import RoleAvatar from '../common/RoleAvatar';

type Role = 'builder' | 'backer' | 'organizer';

export default function MyTabEmpty({ onTabChange, userRole }: { onTabChange?: (tab: 'chats' | 'network') => void; userRole: Role }) {
  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Top Nav */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#E8E8E5] bg-[#FAFAF7]">
        <div className="text-[15px] text-[#0A0A0A]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          twin.network
        </div>
        <div className="flex items-center gap-4">
          {/* Bell Icon */}
          <button className="w-5 h-5 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          {/* Settings Icon */}
          <button className="w-5 h-5 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-6 pb-24">
        {/* Top Section - Twin Profile */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            {/* Avatar */}
            <RoleAvatar role={userRole} size={60} />

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-[17px] text-[#0A0A0A] mb-1" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                你的分身 Milo
              </h2>
              <div className="text-[13px] text-[#10B981] mb-3" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                ● standby · 等你绑定活动
              </div>

              {/* Vibe Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-[#2563EB]/5 text-[#2563EB] text-[12px] rounded border border-[#2563EB]/20" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  [#AI Builder]
                </span>
                <span className="px-2 py-1 bg-[#D97706]/5 text-[#D97706] text-[12px] rounded border border-[#D97706]/20" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  [#voice agent]
                </span>
                <span className="px-2 py-1 bg-[#6B6B70]/5 text-[#6B6B70] text-[12px] rounded border border-[#6B6B70]/20" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  [#不爱泛聊]
                </span>
                <span className="px-2 py-1 bg-[#10B981]/5 text-[#10B981] text-[12px] rounded border border-[#10B981]/20" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  [#找互补技术]
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Current Event */}
        <div className="mb-6">
          <div className="bg-white border border-[#E8E8E5] rounded-lg overflow-hidden">
            <div className="text-[12px] text-[#A8A8AC] px-4 pt-4 pb-2" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              [current event]
            </div>

            {/* Event Card */}
            <div className="px-4 pb-4">
              {/* Event Title */}
              <h3 className="text-[20px] text-[#0A0A0A] mb-2" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                清客松
              </h3>

              <p className="text-[13px] text-[#D97706] mb-3" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                行胜于言，智起无界
              </p>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-[14px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                  <span className="shrink-0">📅</span>
                  <span>2026.05.30 周六 09:00-18:00</span>
                </div>
                <div className="flex items-start gap-2 text-[14px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                  <span className="shrink-0">📍</span>
                  <span>清华大学 FIT楼</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full mb-3">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span className="text-[12px] text-[#10B981]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  活动进行中
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-[13px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                <span>87 个分身在场</span>
                <span>•</span>
                <span>你的分身: standby</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Historical Events */}
        <div>
          <h3 className="text-[14px] text-[#6B6B70] mb-3" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            历史活动
          </h3>

          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-dashed border-[#E8E8E5] rounded-lg p-4 flex items-center justify-center min-h-[60px]">
                <span className="text-[13px] text-[#A8A8AC]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                  你的第一场活动会出现在这里
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-3 z-40">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => onTabChange?.('chats')} className="flex flex-col items-center gap-1 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <div className="text-[13px] flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ○ /chats
              <span className="text-[11px] text-[#A8A8AC]">[0]</span>
            </div>
          </button>
          <button onClick={() => onTabChange?.('network')} className="flex flex-col items-center gap-1 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <div className="text-[13px] flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ○ /network
              <span className="text-[11px] text-[#A8A8AC]">[0]</span>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#2563EB]">
            <div className="text-[13px]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ● /me
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-halo {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.2);
          }
        }

        .animate-pulse-halo {
          animation: pulse-halo 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
