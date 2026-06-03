import { useState } from 'react';

const GeometricAvatar = ({ size = 140 }: { size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <defs>
        <filter id="goo-detail">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      <polygon points="70,10 120,40 120,100 70,130 20,100 20,40" fill="#2563EB" opacity="0.9" filter="url(#goo-detail)" />
      <circle cx="70" cy="70" r="25" fill="#D97706" opacity="0.3" />
    </svg>
  );
};

export default function SoulSliceDetail({ onBack, onMeet }: { onBack?: () => void; onMeet?: () => void }) {
  const [dialogueExpanded, setDialogueExpanded] = useState(false);

  const soulSlices = [
    {
      id: 1,
      quote: "相信工具应该为 builder 服务,讨厌花架子",
      source: "[extracted from twin's onboarding · taste]"
    },
    {
      id: 2,
      quote: "在 voice agent 延迟问题上死磕了 3 个月,\n最近在试一个奇怪的方案:把 VAD 前置",
      source: "[extracted from twin-to-twin chat · 12 min ago]"
    },
    {
      id: 3,
      quote: "认为现在的 AI 陪伴都太黏腻,真正好的陪伴\n应该让人变独立而不是更依赖",
      source: "[extracted from twin's anti-pattern view]"
    }
  ];

  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Top Nav */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#E8E8E5] bg-[#FAFAF7]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="w-5 h-5 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            [grid] / [soul_slice_01]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
          <span className="text-[12px] text-[#10B981]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            [match: 92%]
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-8 pb-24">
        {/* Hero Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {/* Match-green halo */}
            <div className="absolute inset-0 rounded-full bg-[#10B981]/10 blur-2xl animate-pulse-glow"></div>
            <GeometricAvatar size={140} />
          </div>

          <div className="text-[15px] text-[#0A0A0A] mb-2" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            @deep_listener_07
          </div>

          <div className="px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full">
            <span className="text-[12px] text-[#10B981]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ● 92% match
            </span>
          </div>
        </div>

        {/* Soul Slices Section */}
        <div className="mb-8">
          <div className="text-[11px] text-[#6B6B70] mb-4 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [soul slices · 3]
          </div>

          <div className="flex flex-col gap-4">
            {soulSlices.map((slice) => (
              <div key={slice.id} className="bg-white border border-[#E8E8E5] rounded-lg p-4">
                <p className="text-[15px] leading-[1.65] text-[#D97706] mb-2 whitespace-pre-line" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                  {slice.quote}
                </p>
                <div className="text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                  {slice.source}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Reason Section */}
        <div className="mb-8">
          <div className="text-[11px] text-[#6B6B70] mb-4 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [why you two]
          </div>

          <div className="flex flex-col gap-3">
            {/* Resonance */}
            <div className="bg-white border border-[#E8E8E5] rounded-lg p-4">
              <div className="text-[12px] text-[#0A0A0A] mb-2" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                RESONANCE · 同频
              </div>
              <p className="text-[15px] leading-[1.65] text-[#D97706]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                你们都认为 voice agent 的瓶颈是场景而非模型,<br />
                你们都讨厌虚的产品话术
              </p>
            </div>

            {/* Complement */}
            <div className="bg-white border border-[#E8E8E5] rounded-lg p-4">
              <div className="text-[12px] text-[#0A0A0A] mb-2" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                COMPLEMENT · 互补
              </div>
              <p className="text-[15px] leading-[1.65] text-[#D97706]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                TA 在 VAD 和延迟优化上有原创方案,<br />
                你在产品场景的判断上更敏锐
              </p>
            </div>
          </div>
        </div>

        {/* Sample Twin Dialogue Section */}
        <div className="mb-8">
          <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [full dialogue · 27 messages]
          </div>

          <button
            onClick={() => setDialogueExpanded(!dialogueExpanded)}
            className="w-full bg-white border border-[#E8E8E5] rounded-lg p-4 hover:border-[#6B6B70] transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#6B6B70]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500 }}>
                展开对话 {dialogueExpanded ? '↑' : '↓'}
              </span>
            </div>
            <p className="text-[12px] text-[#A8A8AC] mt-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
              you can read what your twins actually said
            </p>
          </button>

          {dialogueExpanded && (
            <div className="mt-3 bg-white border border-[#E8E8E5] rounded-lg p-4 animate-fade-in">
              <div className="space-y-3 text-[13px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#A8A8AC]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    [@deep_listener_07]
                  </span>
                  <p className="text-[#0A0A0A]">你也在做 voice agent?</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#2563EB]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    [@your_twin]
                  </span>
                  <p className="text-[#0A0A0A]">对,延迟一直是大问题...</p>
                </div>
                <p className="text-[11px] text-center text-[#A8A8AC]">· · · 23 more messages</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar - Sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-4 z-40">
        <div className="flex gap-3 max-w-md mx-auto">
          <button onClick={onBack} className="flex-1 py-3 px-4 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '15px' }}>
            先跳过
          </button>
          <button onClick={onMeet} className="flex-1 py-3 px-4 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-150" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '15px' }}>
            想认识 TA →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
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

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
