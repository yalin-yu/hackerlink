export default function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Top 50% - Avatar Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10">
        {/* Generative Art Avatar - Perlin Noise Blob */}
        <div className="relative w-[120px] h-[120px]">
          <svg width="120" height="120" viewBox="0 0 120 120" className="breathing-avatar">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
            <path
              d="M60,20
                 C75,18 88,25 95,40
                 C102,55 100,72 90,85
                 C80,98 65,103 50,100
                 C35,97 22,88 18,73
                 C14,58 20,42 32,30
                 C40,22 50,21 60,20 Z"
              fill="#2563EB"
              filter="url(#goo)"
              opacity="0.9"
            />
            <circle cx="45" cy="50" r="8" fill="#2563EB" opacity="0.6" />
            <circle cx="75" cy="55" r="6" fill="#2563EB" opacity="0.5" />
            <circle cx="60" cy="75" r="10" fill="#2563EB" opacity="0.4" />
          </svg>
        </div>

        {/* Status Label */}
        <div className="text-[13px] text-[#A8A8AC]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          [twin · initializing]
        </div>
      </div>

      {/* Center - Headline */}
      <div className="flex flex-col items-center gap-3 relative z-10 mb-auto">
        <h1 className="text-[22px] leading-[1.4] text-center text-[#0A0A0A] tracking-[-0.01em]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
          在你出去认识别人之前,<br />
          先认识一下要代表你的那个你
        </h1>

        <p className="text-[15px] text-[#6B6B70] text-center mt-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
          3-4 个问题,大概 3 分钟
        </p>
      </div>

      {/* Bottom - CTA */}
      <div className="w-full max-w-md flex flex-col items-center gap-3 relative z-10">
        <button
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-150"
          style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
        >
          开始 →
        </button>

        <div className="text-[12px] text-[#A8A8AC] text-center" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          [your_twin will be reused across all events]
        </div>
      </div>

      <style>{`
        @keyframes breathing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        .breathing-avatar {
          animation: breathing 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
