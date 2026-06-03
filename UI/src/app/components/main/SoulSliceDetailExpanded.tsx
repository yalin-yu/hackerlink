import { useState, useEffect } from 'react';
import { api } from '../../../api/client';

const GeometricAvatar = ({ variant, size = 64 }: { variant: number; size?: number }) => {
  const avatars = [
    <svg key={1} width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,4 40,14 40,34 24,44 8,34 8,14" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="24" r="8" fill="#D97706" opacity="0.3" />
    </svg>,
    <svg key={2} width={size} height={size} viewBox="0 0 48 48">
      <rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" fill="#D97706" opacity="0.85" />
      <circle cx="24" cy="24" r="6" fill="#2563EB" opacity="0.4" />
    </svg>,
    <svg key={3} width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="16" fill="#8B7DB8" opacity="0.8" />
      <path d="M24,8 A16,16 0 0,1 40,24 L24,24 Z" fill="#2563EB" opacity="0.6" />
    </svg>
  ];
  return avatars[variant - 1] || avatars[0];
};

type ExpandLevel = 0 | 1 | 2 | 3;
type ActionStatus = 'none' | 'interested' | 'skipped';

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

export default function SoulSliceDetailExpanded({ soul, onClose, onInterested, onSkip, userId, eventId }: {
  soul: SoulData;
  onClose: () => void;
  onInterested: () => void;
  onSkip: () => void;
  userId?: string;
  eventId?: string;
}) {
  const [expandLevel, setExpandLevel] = useState<ExpandLevel>(0);
  const [actionStatus, setActionStatus] = useState<ActionStatus>('none');
  const [dialogueTurns, setDialogueTurns] = useState<{speaker: string, content: string, turn: number}[]>([]);
  const [dialogueLoading, setDialogueLoading] = useState(false);
  const [dialogueFetched, setDialogueFetched] = useState(false);

  // [API] Fetch the actual twin dialogue when card is opened
  useEffect(() => {
    if (!userId || !eventId || !soul.userId || dialogueFetched) return;
    const otherId = soul.userId;
    setDialogueLoading(true);
    api.get<{ dialogue: { turns: {speaker: string, content: string, turn: number}[], analysis: any } }>(
      `/api/twin-dialogue/${userId}/${otherId}/${eventId}`
    ).then(res => {
      setDialogueTurns(res.dialogue?.turns || []);
      setDialogueFetched(true);
      setDialogueLoading(false);
    }).catch(() => {
      setDialogueLoading(false);
    });
  }, [userId, eventId, soul.userId, dialogueFetched]);

  const handleExpand = () => {
    if (expandLevel < 3) {
      setExpandLevel((expandLevel + 1) as ExpandLevel);
    }
  };

  const handleInterested = () => {
    setActionStatus('interested');
    setTimeout(() => onInterested(), 300);
  };

  const handleSkip = () => {
    setActionStatus('skipped');
    setTimeout(() => onSkip(), 300);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#10B981]';
    if (score >= 70) return 'text-[#D97706]';
    return 'text-[#6B6B70]';
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#FAFAF7]/60 backdrop-blur-sm flex flex-col" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Detail Card */}
      <div className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-2xl z-50 flex flex-col animate-slide-up overflow-hidden">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#E8E8E5] rounded-full"></div>
        </div>

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-3">
              <GeometricAvatar variant={soul.avatar} size={64} />
            </div>
            <h2 className="text-[18px] text-[#0A0A0A] mb-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              {soul.codename}
            </h2>
            <p className="text-[14px] text-[#D97706] mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
              {soul.quote}
            </p>
            <div className={`text-[12px] ${getScoreColor(soul.score)}`} style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              [匹配度: {soul.score}]
            </div>
          </div>

          {/* Layer 0: Initial View - Click to Expand */}
          {expandLevel === 0 && (
            <div className="animate-fade-in">
              <button
                onClick={handleExpand}
                className="w-full py-4 px-5 border-2 border-dashed border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
                style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '14px' }}
              >
                点击查看 TA 的 Vibe →
              </button>
            </div>
          )}

          {/* Layer 1: Vibe Layer */}
          {expandLevel >= 1 && (
            <div className={`mb-4 p-5 bg-[#FAFAF7] rounded-lg border border-[#E8E8E5] ${expandLevel === 1 ? 'animate-fade-in' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[13px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  [Layer 1 · Vibe]
                </div>
              </div>

              <p className="text-[15px] text-[#0A0A0A] leading-[1.6] mb-4" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                {soul.vibeDescription}
              </p>

              <div className="flex flex-wrap gap-2">
                {soul.vibeTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white border border-[#E8E8E5] rounded-full text-[12px] text-[#2563EB]"
                    style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {expandLevel === 1 && (
                <button
                  onClick={handleExpand}
                  className="w-full mt-4 py-2.5 text-[13px] text-[#6B6B70] hover:text-[#2563EB] transition-colors"
                  style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}
                >
                  继续了解连接理由 →
                </button>
              )}
            </div>
          )}

          {/* Layer 2: Connection Reasons */}
          {expandLevel >= 2 && (
            <div className={`mb-4 p-5 bg-[#FAFAF7] rounded-lg border border-[#E8E8E5] ${expandLevel === 2 ? 'animate-fade-in' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[13px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  [Layer 2 · 连接理由]
                </div>
              </div>

              <div className="mb-3 text-[14px] text-[#0A0A0A]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                为什么可能值得聊：
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-[12px] text-[#10B981] mb-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                    ● 共同点
                  </div>
                  <div className="text-[14px] text-[#0A0A0A] leading-[1.5]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                    {soul.connectionReasons.common}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] text-[#2563EB] mb-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                    ● 互补点
                  </div>
                  <div className="text-[14px] text-[#0A0A0A] leading-[1.5]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                    {soul.connectionReasons.complementary}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] text-[#D97706] mb-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                    ● 不确定点
                  </div>
                  <div className="text-[14px] text-[#0A0A0A] leading-[1.5]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                    {soul.connectionReasons.uncertain}
                  </div>
                </div>
              </div>

              {expandLevel === 2 && (
                <button
                  onClick={handleExpand}
                  className="w-full mt-4 py-2.5 text-[13px] text-[#6B6B70] hover:text-[#2563EB] transition-colors"
                  style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}
                >
                  查看 Aha Moment →
                </button>
              )}
            </div>
          )}

          {/* Layer 3: Aha Moment */}
          {expandLevel >= 3 && (
            <div className={`mb-4 p-5 bg-gradient-to-br from-[#2563EB]/5 to-[#D97706]/5 rounded-lg border-2 border-[#2563EB]/20 ${expandLevel === 3 ? 'animate-fade-in' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[13px] text-[#2563EB]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  [Layer 3 · Aha Moment]
                </div>
              </div>

              <div className="mb-3 text-[15px] text-[#0A0A0A]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                Aha Moment
              </div>

              <p className="text-[14px] text-[#0A0A0A] leading-[1.6] mb-3" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                {soul.ahaMoment.story}
              </p>

              <p className="text-[14px] text-[#6B6B70] leading-[1.6]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                {soul.ahaMoment.context}
              </p>
            </div>
          )}

          {/* [API] Twin dialogue — GET /api/twin-dialogue/:userId/:otherId/:eventId */}
          {dialogueLoading && (
            <div className="mb-4 p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E5] animate-pulse">
              <div className="h-2 bg-[#E8E8E5] rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-[#E8E8E5] rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-[#E8E8E5] rounded w-3/4"></div>
            </div>
          )}
          {dialogueTurns.length > 0 && (
            <div className="mb-4 animate-fade-in">
              <div className="text-[11px] text-[#6B6B70] mb-2 px-1 flex items-center justify-between">
                <span style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  分身对话 · {dialogueTurns.length} 轮
                </span>
              </div>
              <div className="bg-[#FAFAF7] rounded-lg border border-[#E8E8E5] divide-y divide-[#E8E8E5] overflow-hidden">
                {dialogueTurns.map((t, i) => (
                  <div key={i} className="px-3 py-2">
                    <div className="text-[10px] text-[#2563EB] mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {t.speaker}
                    </div>
                    <div className="text-[12px] text-[#0A0A0A] leading-[1.45]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                      {t.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Buttons - Only show when fully expanded */}
        {expandLevel === 3 && (
          <div className="border-t border-[#E8E8E5] px-6 py-4 bg-white animate-fade-in">
            <div className="flex flex-col gap-2">
              {/* Primary Action */}
              <button
                onClick={handleInterested}
                disabled={actionStatus !== 'none'}
                className={`
                  w-full py-3.5 px-6 rounded-lg transition-all duration-150
                  ${actionStatus === 'interested'
                    ? 'bg-[#10B981] text-white'
                    : actionStatus === 'skipped'
                    ? 'bg-[#E8E8E5] text-[#A8A8AC]'
                    : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af]'
                  }
                `}
                style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
              >
                {actionStatus === 'interested' ? '✓ 已选择想聊聊' : '想聊聊'}
              </button>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSkip}
                  disabled={actionStatus !== 'none'}
                  className="flex-1 py-2.5 px-4 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '14px' }}
                >
                  先跳过
                </button>
                <button
                  disabled={actionStatus !== 'none'}
                  className="flex-1 py-2.5 px-4 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '14px' }}
                >
                  让 Agent 再问一句
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
