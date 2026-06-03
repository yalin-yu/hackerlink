const GeometricAvatar = ({ size = 100 }: { size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,4 40,14 40,34 24,44 8,34 8,14" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="24" r="8" fill="#D97706" opacity="0.3" />
    </svg>
  );
};

export default function NetworkTabFirstNode({ onTabChange }: { onTabChange?: (tab: 'me' | 'messages') => void }) {
  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Top Section */}
      <div className="relative z-10 px-6 pt-6 pb-4 border-b border-[#E8E8E5] bg-[#FAFAF7]">
        <h1 className="text-[24px] text-[#0A0A0A] tracking-[-0.01em] mb-1" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
          核心关系网
        </h1>
        <p className="text-[15px] text-[#0A0A0A] mb-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
          1 个真正同频的人
        </p>
        <p className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          [+1 from anthropic_hackathon]
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-8 pb-24">
        {/* Large Connection Card */}
        <div className="bg-white border border-[#E8E8E5] rounded-lg p-6 mb-6">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <GeometricAvatar size={100} />
            </div>

            <h2 className="text-[28px] text-[#0A0A0A] mb-1" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
              Brian
            </h2>

            <p className="text-[13px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              [was @deep_listener_07]
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E8E8E5] mb-6"></div>

          {/* WHY YOU TWO Section */}
          <div className="mb-6">
            <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              why you two
            </div>

            <p className="text-[14px] leading-[1.65] text-[#D97706]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
              你们都认为 voice agent 的瓶颈是场景而非模型,<br />
              TA 在 VAD 前置上有反共识方案,你在产品场景判断上更敏锐
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E8E8E5] mb-6"></div>

          {/* Metadata Grid 2x2 */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <div className="text-[11px] text-[#6B6B70] mb-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                [met_at]
              </div>
              <div className="text-[14px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                Anthropic Hackathon · 2026.05.30
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#6B6B70] mb-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                [last_seen]
              </div>
              <div className="text-[14px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                2h ago · Coffee Chat
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#6B6B70] mb-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                [strength]
              </div>
              <div className="text-[14px] text-[#0A0A0A] flex items-center gap-2" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                <span className="text-[#10B981]">●</span>
                <span>strong · 同伴 (peer)</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#6B6B70] mb-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                [your_tag]
              </div>
              <div className="text-[14px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                "VAD 方向最有原创判断的人"
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 px-3 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors flex items-center justify-center gap-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '13px' }}>
              <span>💬</span>
              <span>继续聊</span>
            </button>
            <button className="flex-1 py-2.5 px-3 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors flex items-center justify-center gap-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '13px' }}>
              <span>✨</span>
              <span>Agent 开场</span>
            </button>
            <button className="flex-1 py-2.5 px-3 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors flex items-center justify-center gap-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '13px' }}>
              <span>☕</span>
              <span>再约一次</span>
            </button>
          </div>
        </div>

        {/* Future State Hint */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[13px] text-[#6B6B70] text-center" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
            等你认识更多人,这里会变成星状图
          </p>

          {/* Constellation Preview */}
          <div className="relative w-48 h-32">
            <svg width="192" height="128" viewBox="0 0 192 128" fill="none">
              {/* Central node */}
              <circle cx="96" cy="64" r="8" fill="#2563EB" opacity="0.2" />

              {/* Surrounding nodes - very faint */}
              <circle cx="60" cy="40" r="6" stroke="#E8E8E5" strokeWidth="2" strokeDasharray="2 2" fill="none" />
              <circle cx="132" cy="40" r="6" stroke="#E8E8E5" strokeWidth="2" strokeDasharray="2 2" fill="none" />
              <circle cx="48" cy="88" r="6" stroke="#E8E8E5" strokeWidth="2" strokeDasharray="2 2" fill="none" />
              <circle cx="144" cy="88" r="6" stroke="#E8E8E5" strokeWidth="2" strokeDasharray="2 2" fill="none" />
              <circle cx="96" cy="20" r="6" stroke="#E8E8E5" strokeWidth="2" strokeDasharray="2 2" fill="none" />
              <circle cx="96" cy="108" r="6" stroke="#E8E8E5" strokeWidth="2" strokeDasharray="2 2" fill="none" />

              {/* Connection lines - very faint */}
              <line x1="96" y1="64" x2="60" y2="40" stroke="#E8E8E5" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
              <line x1="96" y1="64" x2="132" y2="40" stroke="#E8E8E5" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
              <line x1="96" y1="64" x2="48" y2="88" stroke="#E8E8E5" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
              <line x1="96" y1="64" x2="144" y2="88" stroke="#E8E8E5" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-3 z-40">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => onTabChange?.('messages')} className="flex flex-col items-center gap-1 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <div className="text-[13px] flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ○ /messages
              <span className="text-[11px] text-[#A8A8AC]">[3]</span>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#2563EB]">
            <div className="text-[13px] flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ● /network
            </div>
          </button>
          <button onClick={() => onTabChange?.('me')} className="flex flex-col items-center gap-1 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <div className="text-[13px]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ○ /me
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
