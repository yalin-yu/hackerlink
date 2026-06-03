import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

const GeometricAvatar = ({ variant, size = 40 }: { variant: number; size?: number }) => {
  const avatars = [
    <svg key={1} width={size} height={size} viewBox="0 0 48 48"><polygon points="24,4 40,14 40,34 24,44 8,34 8,14" fill="#2563EB" opacity="0.9" /><circle cx="24" cy="24" r="8" fill="#D97706" opacity="0.3" /></svg>,
    <svg key={2} width={size} height={size} viewBox="0 0 48 48"><rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" fill="#D97706" opacity="0.85" /><circle cx="24" cy="24" r="6" fill="#2563EB" opacity="0.4" /></svg>,
    <svg key={3} width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" fill="#8B7DB8" opacity="0.8" /><path d="M24,8 A16,16 0 0,1 40,24 L24,24 Z" fill="#2563EB" opacity="0.6" /></svg>,
  ];
  return avatars[(variant - 1) % 3] || avatars[0];
};

interface ConvEntry {
  id: string;
  codename: string;
  vibeQuote: string;
  latestMessage: string;
  timestamp: string;
  dotColor: string;
  unread: number;
  userId: string;
}

interface Props {
  userId: string;
  eventId: string;
  onMeetOffline?: () => void;
  onContinueChat?: () => void;
  onTabChange?: (tab: 'me' | 'network') => void;
}

/**
 * MessagesTab — 展示所有分身对话过的用户
 *
 * [API] 数据来源：
 *   1. GET /api/twin-search/results/:userId/:eventId → 获取推荐列表
 *   2. 对每个人 GET /api/twin-dialogue/:userId/:otherId/:eventId → 获取完整对话
 *
 * F12 Network → filter "twin-search" + "twin-dialogue"
 */
export default function MessagesTab({ userId, eventId, onMeetOffline, onContinueChat, onTabChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConvEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['bg-[#2563EB]', 'bg-[#D97706]', 'bg-[#8B7DB8]', 'bg-[#10B981]', 'bg-[#EF4444]'];

  // [API] Fetch twin dialogue partners on mount
  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      // Get recommendation results (these include everyone we chatted with)
      const res = await api.get<{ results: { userId?: string; codename: string; quote: string; score: number }[] }>(
        `/api/twin-search/results/${userId}/${eventId}`
      );

      if (!res.results || res.results.length === 0) {
        setLoading(false);
        return;
      }

      // For each partner, fetch the last few messages from their twin dialogue
      const entries: ConvEntry[] = await Promise.all(
        res.results.slice(0, 20).map(async (r, i) => {
          const otherId = r.userId || '';
          let latestMessage = r.quote || '';
          try {
            const dRes = await api.get<{ dialogue: { turns: { speaker: string; content: string }[] } }>(
              `/api/twin-dialogue/${userId}/${otherId}/${eventId}`
            );
            if (dRes.dialogue?.turns?.length) {
              const last = dRes.dialogue.turns[dRes.dialogue.turns.length - 1];
              latestMessage = last.content || latestMessage;
            }
          } catch { /* no dialogue for this pair yet */ }

          return {
            id: otherId,
            codename: r.codename || '@unknown',
            vibeQuote: r.quote || '',
            latestMessage: latestMessage.length > 60 ? latestMessage.slice(0, 60) + '...' : latestMessage,
            timestamp: `${i + 1}m ago`,
            dotColor: COLORS[i % COLORS.length],
            unread: i < 3 ? 1 : 0, // first 3 are "unread"
            userId: otherId,
          };
        })
      );

      setConversations(entries);
    } catch (err) {
      console.error('[MessagesTab] fetch failed:', err);
    }
    setLoading(false);
  }, [userId, eventId]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col relative">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 px-4 pt-4 pb-3 border-b border-[#E8E8E5] bg-[#FAFAF7]">
        <h1 className="text-[20px] text-[#0A0A0A] tracking-[-0.01em] mb-0.5" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
          消息
        </h1>
        <p className="text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          [matched: {conversations.length}]
        </p>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 px-4 py-3 pb-20">
        {loading && (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-[#F5F5F2] rounded-lg p-4 animate-pulse">
                <div className="h-3 bg-[#E8E8E5] rounded w-2/3 mb-2" />
                <div className="h-3 bg-[#E8E8E5] rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#A8A8AC]">
            <p className="text-[14px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
              还没有聊过的人
            </p>
            <p className="text-[11px] mt-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              [let your twin find someone first]
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {conversations.map((conv) => {
            const isExpanded = expandedId === conv.id;
            return (
              <div
                key={conv.id}
                className={`bg-white border rounded-lg transition-all duration-200 ${
                  isExpanded ? 'border-[#2563EB] shadow-sm' : 'border-[#E8E8E5]'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : conv.id)}
                  className="w-full p-3 flex items-start gap-3 text-left"
                >
                  <div className="shrink-0">
                    <GeometricAvatar variant={conv.id.charCodeAt(0) % 3 + 1} size={36} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#0A0A0A] mb-0.5" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                      {conv.codename}
                    </div>
                    <p className="text-[11px] leading-[1.3] text-[#D97706] line-clamp-1 mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                      {conv.vibeQuote}
                    </p>
                    <p className="text-[11px] text-[#6B6B70] line-clamp-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                      {conv.latestMessage}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${conv.dotColor}`}></div>
                    <div className="text-[10px] text-[#A8A8AC]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                      {conv.timestamp}
                    </div>
                    {conv.unread > 0 && (
                      <div className="min-w-[18px] h-[18px] rounded-full bg-[#2563EB] flex items-center justify-center px-1">
                        <span className="text-[10px] text-white" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                          {conv.unread}
                        </span>
                      </div>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-[#E8E8E5] pt-2 animate-fade-in">
                    <div className="flex flex-col gap-1.5">
                      <button onClick={onMeetOffline} className="w-full py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] text-[13px]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                        ☕ 约线下见面
                      </button>
                      <button onClick={onContinueChat} className="w-full py-2 rounded-lg border border-[#E8E8E5] text-[#6B6B70] hover:text-[#0A0A0A] text-[12px]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500 }}>
                        继续聊
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t border-[#E8E8E5] px-4 py-2.5 z-40">
        <div className="flex items-center justify-around max-w-[430px] mx-auto">
          <span className="text-[12px] text-[#2563EB]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>● messages</span>
          <button onClick={() => onTabChange?.('network')} className="text-[12px] text-[#6B6B70] hover:text-[#0A0A0A]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>○ network</button>
          <button onClick={() => onTabChange?.('me')} className="text-[12px] text-[#6B6B70] hover:text-[#0A0A0A]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>○ me</button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
