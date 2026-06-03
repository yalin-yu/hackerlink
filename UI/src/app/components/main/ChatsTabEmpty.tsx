import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';
import SoulSliceDetailExpanded from './SoulSliceDetailExpanded';

/**
 * ChatsTab — 底部 /chats 页
 *
 * 列出所有分身对话过的人。点击 → 打开 SoulSliceDetailExpanded 弹窗，
 * 三层渐进展开（Vibe → 连接理由 → Aha Moment）+ 6 轮分身对话记录。
 *
 * [API] GET /api/twin-dialogues/:userId/:eventId
 * F12 Network → filter "twin-dialogues"
 */

interface DialogueEntry {
  id: string;
  codename: string;
  nickname: string;
  vibeQuote: string;
  turns: { speaker: string; content: string; turn: number }[];
  score: number | null;
  created_at: string;
}

// SoulData from recommendation cache
interface SoulData {
  id: number | string;
  userId?: string;
  avatar?: number;
  codename: string;
  quote: string;
  score: number;
  vibeDescription: string;
  vibeTags: string[];
  connectionReasons: {
    common: string;
    complementary: string;
    uncertain: string;
  };
  ahaMoment: {
    story: string;
    context: string;
  };
}

interface ApiEntry {
  soul: SoulData;
  turns: { speaker: string; content: string; turn: number }[];
  created_at: string;
}

interface Props {
  userId: string;
  eventId: string;
  onTabChange?: (tab: 'me' | 'network') => void;
}

const AVATAR_COLORS = [
  'bg-[#2563EB]', 'bg-[#D97706]', 'bg-[#8B7DB8]', 'bg-[#10B981]', 'bg-[#EF4444]',
];

function MiniAvatar({ index }: { index: number }) {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48">
      <polygon points="24,4 40,14 40,34 24,44 8,34 8,14" className={AVATAR_COLORS[index % 5]} fill="currentColor" opacity="0.9" />
      <circle cx="24" cy="24" r="8" fill="#D97706" opacity="0.3" />
    </svg>
  );
}

export default function ChatsTab({ userId, eventId, onTabChange }: Props) {
  const [entries, setEntries] = useState<ApiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSoul, setSelectedSoul] = useState<SoulData | null>(null);

  const fetchDialogues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ dialogues: ApiEntry[] }>(
        `/api/twin-dialogues/${userId}/${eventId}`
      );
      setEntries(res.dialogues || []);
    } catch (err) {
      console.error('[ChatsTab] fetch failed:', err);
    }
    setLoading(false);
  }, [userId, eventId]);

  useEffect(() => { fetchDialogues(); }, [fetchDialogues]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-[#10B981]';
    if (score >= 6) return 'text-[#D97706]';
    return 'text-[#6B6B70]';
  };

  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col relative">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Top */}
      <div className="relative z-10 px-4 pt-4 pb-3 border-b border-[#E8E8E5] bg-[#FAFAF7]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] text-[#0A0A0A] tracking-[-0.01em] mb-0.5" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
              Chats
            </h1>
            <p className="text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              [dialogues: {entries.length}]
            </p>
          </div>
          <button
            onClick={fetchDialogues}
            className="text-[11px] text-[#6B6B70] hover:text-[#2563EB] transition-colors"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}
          >
            ↻ refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative z-10 px-4 py-3 pb-20">
        {loading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#F5F5F2] rounded-lg p-4 animate-pulse">
                <div className="h-3 bg-[#E8E8E5] rounded w-2/3 mb-2" />
                <div className="h-3 bg-[#E8E8E5] rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <svg width="80" height="80" viewBox="0 0 120 120" fill="none">
              <rect x="20" y="30" width="50" height="35" rx="8" stroke="#E8E8E5" strokeWidth="2" strokeDasharray="4 4"/>
              <rect x="50" y="55" width="50" height="35" rx="8" stroke="#E8E8E5" strokeWidth="2" strokeDasharray="4 4"/>
              <circle cx="35" cy="47" r="3" fill="#E8E8E5"/>
            </svg>
            <h2 className="text-[16px] text-[#0A0A0A] text-center" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
              还没有分身对话
            </h2>
            <p className="text-[13px] text-[#6B6B70] text-center leading-[1.5]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
              点右下角按钮，让分身去跟人聊
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {entries.map((e, i) => {
            const s = e.soul;
            const lastMsg = e.turns.length > 0 ? e.turns[e.turns.length - 1] : null;

            return (
              <button
                key={s.id}
                onClick={() => setSelectedSoul(s)}
                className="w-full bg-white rounded-lg border border-[#E8E8E5] p-3 flex items-start gap-3 text-left hover:border-[#2563EB] hover:shadow-sm transition-all"
              >
                <div className="shrink-0 mt-0.5">
                  <MiniAvatar index={i} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] text-[#0A0A0A]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                      {s.codename}
                    </span>
                    {s.score > 0 && (
                      <span className={`text-[10px] ${getScoreColor(s.score)}`} style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                        [{s.score}]
                      </span>
                    )}
                  </div>
                  {s.quote && (
                    <p className="text-[11px] text-[#D97706] line-clamp-1 mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                      {s.quote}
                    </p>
                  )}
                  {lastMsg && (
                    <p className="text-[11px] text-[#6B6B70] line-clamp-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                      {lastMsg.content.length > 50 ? lastMsg.content.slice(0, 50) + '...' : lastMsg.content}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
                  <span className="text-[10px] text-[#A8A8AC]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                    {e.turns.length}轮
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SoulSliceDetailExpanded Modal */}
      {selectedSoul && (
        <SoulSliceDetailExpanded
          soul={selectedSoul}
          userId={userId}
          eventId={eventId}
          onClose={() => setSelectedSoul(null)}
          onInterested={() => setSelectedSoul(null)}
          onSkip={() => setSelectedSoul(null)}
        />
      )}

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t border-[#E8E8E5] px-4 py-2.5 z-40">
        <div className="flex items-center justify-around max-w-[430px] mx-auto">
          <span className="text-[12px] text-[#2563EB]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>● chats</span>
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
