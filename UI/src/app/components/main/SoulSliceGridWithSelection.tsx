const GeometricAvatar = ({ variant, size = 48 }: { variant: number; size?: number }) => {
  const avatars = [
    // Variant 1: Hexagon
    <svg key={1} width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,4 40,14 40,34 24,44 8,34 8,14" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="24" r="8" fill="#D97706" opacity="0.3" />
    </svg>,
    // Variant 2: Diamond
    <svg key={2} width={size} height={size} viewBox="0 0 48 48">
      <rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" fill="#D97706" opacity="0.85" />
      <circle cx="24" cy="24" r="6" fill="#2563EB" opacity="0.4" />
    </svg>,
    // Variant 3: Circle segments
    <svg key={3} width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="16" fill="#8B7DB8" opacity="0.8" />
      <path d="M24,8 A16,16 0 0,1 40,24 L24,24 Z" fill="#2563EB" opacity="0.6" />
    </svg>,
    // Variant 4: Triangle
    <svg key={4} width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,6 42,38 6,38" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="30" r="5" fill="#D97706" opacity="0.5" />
    </svg>,
    // Variant 5: Rounded square
    <svg key={5} width={size} height={size} viewBox="0 0 48 48">
      <rect x="8" y="8" width="32" height="32" rx="8" fill="#D97706" opacity="0.85" />
      <rect x="16" y="16" width="16" height="16" rx="4" fill="#FAFAF7" opacity="0.3" />
    </svg>,
    // Variant 6: Star-like
    <svg key={6} width={size} height={size} viewBox="0 0 48 48">
      <path d="M24,4 L28,20 L44,24 L28,28 L24,44 L20,28 L4,24 L20,20 Z" fill="#8B7DB8" opacity="0.85" />
      <circle cx="24" cy="24" r="6" fill="#2563EB" opacity="0.5" />
    </svg>,
    // Variant 7: Pentagon
    <svg key={7} width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,4 42,18 34,40 14,40 6,18" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="22" r="5" fill="#D97706" opacity="0.4" />
    </svg>,
    // Variant 8: Cross
    <svg key={8} width={size} height={size} viewBox="0 0 48 48">
      <rect x="18" y="8" width="12" height="32" fill="#D97706" opacity="0.85" />
      <rect x="8" y="18" width="32" height="12" fill="#2563EB" opacity="0.7" />
    </svg>,
    // Variant 9: Concentric circles
    <svg key={9} width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18" fill="#8B7DB8" opacity="0.6" />
      <circle cx="24" cy="24" r="12" fill="#2563EB" opacity="0.7" />
      <circle cx="24" cy="24" r="6" fill="#D97706" opacity="0.8" />
    </svg>
  ];

  return avatars[variant - 1] || avatars[0];
};

import { useState } from 'react';
import RoleAvatar from '../common/RoleAvatar';

type Role = 'builder' | 'backer' | 'organizer';
type CardState = 'normal' | 'selected' | 'skipped';

export default function SoulSliceGridWithSelection({ onGoToMessages, onBack, userRole }: { onGoToMessages?: () => void; onBack?: () => void; userRole: Role }) {
  const soulsData = [
    {
      id: 1,
      avatar: 1,
      quote: "相信工具应该为 builder 服务,\n讨厌花架子",
      score: 92
    },
    {
      id: 2,
      avatar: 2,
      quote: "在 voice agent 延迟问题上\n死磕了 3 个月",
      score: 88
    },
    {
      id: 3,
      avatar: 3,
      quote: "认为 AI 陪伴需要长期记忆,\n不是无止境聊天",
      score: 85
    },
    {
      id: 4,
      avatar: 4,
      quote: "做过的 demo 都跑通了,\n不画饼",
      score: 83
    },
    {
      id: 5,
      avatar: 5,
      quote: "对蓝领招聘场景的方言识别\n有原创方案",
      score: 80
    },
    {
      id: 6,
      avatar: 6,
      quote: "在 character.ai 工作过,\n看穿了它的留存陷阱",
      score: 78
    },
    {
      id: 7,
      avatar: 7,
      quote: "认为 Cursor 的 multi-file edit\n还远未到极限",
      score: 76
    },
    {
      id: 8,
      avatar: 8,
      quote: "在 fine-tune 小模型方面\n有反共识的判断",
      score: 73
    },
    {
      id: 9,
      avatar: 9,
      quote: "讨厌交换名片,\n只愿意为真问题花时间",
      score: 71
    }
  ];

  // 初始选中状态：默认选中前3个高分的
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set([1, 4, 8]));

  // 切换选择状态
  const toggleSelection = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const souls = soulsData.map(soul => ({
    ...soul,
    state: selectedIds.has(soul.id) ? 'selected' as CardState : 'normal' as CardState
  }));

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#10B981]';
    if (score >= 70) return 'text-[#D97706]';
    return 'text-[#6B6B70]';
  };

  const selectedCount = selectedIds.size;
  const unselectedCount = souls.length - selectedIds.size;

  return (
    <div className="size-full bg-[#FAFAF7] overflow-y-auto relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 px-4 py-8 pb-32 max-w-md mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <button onClick={onBack} className="flex items-center gap-2 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-[14px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>返回</span>
          </button>
        </div>

        {/* Top Section */}
        <div className="mb-6">
          {/* Small Avatar with Status */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <RoleAvatar role={userRole} size={40} />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10B981] border-2 border-[#FAFAF7]"></div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[20px] text-[#0A0A0A] tracking-[-0.01em] mb-2" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            分身找到了 9 个可能聊得来的人
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] text-[#D97706] mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
            点击卡片选择想聊的人 · 支持多选
          </p>

          {/* Metadata */}
          <p className="text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            [scope: anthropic_hackathon · sorted by resonance]
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {souls.map((soul) => {
            const isSelected = selectedIds.has(soul.id);

            return (
              <button
                key={soul.id}
                onClick={() => toggleSelection(soul.id)}
                className={`
                  aspect-square bg-white rounded-lg p-2.5 flex flex-col items-center justify-between
                  transition-all duration-200 relative active:scale-95
                  ${isSelected ? 'border-2 border-[#2563EB] shadow-md bg-[#2563EB]/5' : 'border border-[#E8E8E5] hover:border-[#2563EB] hover:shadow-sm'}
                `}
              >
                {/* Status Icon - Top Right */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2563EB] flex items-center justify-center animate-scale-in">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                {/* Avatar */}
                <div className="relative z-10 mb-2">
                  <GeometricAvatar variant={soul.avatar} size={36} />
                </div>

                {/* Quote */}
                <p className="text-[11px] leading-[1.3] text-[#D97706] text-center flex-1 flex items-center whitespace-pre-line relative z-10" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                  {soul.quote}
                </p>

                {/* Match Score */}
                <div className={`text-[10px] ${getScoreColor(soul.score)} self-end relative z-10`} style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  [{soul.score}]
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[12px] text-[#6B6B70] text-center" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            点击卡片选择 · 再次点击取消选择
          </p>

          <button className="px-4 py-2 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '13px' }}>
            让分身再找一批
          </button>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-3 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            [已选: {selectedCount} · 未选: {unselectedCount}]
          </div>
          <button
            onClick={onGoToMessages}
            disabled={selectedCount === 0}
            className={`
              relative px-5 py-2.5 rounded-lg transition-all duration-150
              ${selectedCount > 0
                ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af]'
                : 'bg-[#E8E8E5] text-[#A8A8AC] cursor-not-allowed'
              }
            `}
            style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '14px' }}
          >
            去 Messages →
            {/* Notification Dot - only show when has selection */}
            {selectedCount > 0 && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EF4444] border-2 border-white"></div>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
