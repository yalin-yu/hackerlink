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
import SoulSliceDetailExpanded from './SoulSliceDetailExpanded';
import RoleAvatar from '../common/RoleAvatar';

type Role = 'builder' | 'backer' | 'organizer';

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

export default function SoulSliceGrid({ souls: externalSouls, onCardClick, onBack, userRole, userId, eventId }: {
  souls?: SoulData[];
  onCardClick?: () => void;
  onBack?: () => void;
  userRole: Role;
  userId?: string;
  eventId?: string;
}) {
  const [selectedSoul, setSelectedSoul] = useState<SoulData | null>(null);

  // Use external souls from API, fall back to empty array
  const souls: SoulData[] = externalSouls && externalSouls.length > 0 ? externalSouls : [];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#10B981]';
    if (score >= 70) return 'text-[#D97706]';
    return 'text-[#6B6B70]';
  };

  return (
    <>
      <div className="size-full bg-[#FAFAF7] overflow-y-auto relative">
        {/* Subtle paper grain texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>

        <div className="relative z-10 px-4 py-8 pb-12 max-w-md mx-auto">
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
            不是简历,是 TA 们的灵魂切片
          </p>

          {/* Metadata */}
          <p className="text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            [scope: anthropic_hackathon · sorted by resonance]
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {souls.map((soul, index) => (
            <button
              key={soul.id}
              onClick={() => setSelectedSoul(soul)}
              className={`
                aspect-square bg-white border border-[#E8E8E5] rounded-lg p-2.5 flex flex-col items-center justify-between
                hover:border-[#2563EB] hover:shadow-sm transition-all
                ${index === 0 ? 'relative' : ''}
              `}
            >
              {/* Amber glow for highest match */}
              {index === 0 && (
                <div className="absolute inset-0 rounded-lg bg-[#D97706]/5 pointer-events-none"></div>
              )}

              {/* Avatar */}
              <div className="relative z-10 mb-2">
                <GeometricAvatar variant={(soul.avatar || (soul.id ? (parseInt(soul.id.slice(-2), 16) || 1) % 9 + 1 : 1)) as number} size={36} />
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
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            点击卡片查看详情 · 三层展开了解 TA
          </p>

          <button className="px-4 py-2 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '13px' }}>
            让分身再找一批
          </button>
        </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSoul && (
        <SoulSliceDetailExpanded
          soul={selectedSoul}
          userId={userId}
          eventId={eventId}
          onClose={() => setSelectedSoul(null)}
          onInterested={() => {
            setSelectedSoul(null);
          }}
          onSkip={() => {
            setSelectedSoul(null);
          }}
        />
      )}
    </>
  );
}
