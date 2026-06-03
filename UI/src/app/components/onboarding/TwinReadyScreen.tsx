import { useState, useEffect } from 'react';
import { generateMemory, type MemorySlice } from '../../../api/profile';

/**
 * TwinReadyScreen — 分身就绪页
 *
 * 展示 LLM 根据 Q1+Q4 生成的 3 条"初始记忆"：
 *   1. 你看好什么
 *   2. 你反感什么
 *   3. 你卡在什么
 *
 * [API] POST /api/twin-memory { q1, q4 }
 *   → { slices: [{id, text}] }
 * F12 Network → filter "twin-memory"
 */
export default function TwinReadyScreen({
  q1,
  q4,
  onNext,
}: {
  q1: string;
  q4: string;
  onNext?: () => void;
}) {
  const [slices, setSlices] = useState<MemorySlice[]>([]);

  useEffect(() => {
    let cancelled = false;
    generateMemory(q1, q4)
      .then((res) => {
        if (!cancelled && res.slices) setSlices(res.slices);
      })
      .catch((err) => {
        console.error('[API] POST /api/twin-memory failed:', err);
        if (!cancelled) {
          // Fallback: generate locally from keywords
          setSlices([
            { id: 1, text: q1 ? `你对"${q1.slice(0, 60)}${q1.length > 60 ? '...' : ''}"有强烈的直觉` : '你有自己的方向感' },
            { id: 2, text: '你有自己的审美底线——不想要花架子，想要真东西' },
            { id: 3, text: q4 ? `你卡在"${q4.slice(0, 60)}${q4.length > 60 ? '...' : ''}"——这个问题还没找到解法` : '你还没说卡在哪——下次可以告诉我' },
          ]);
        }
      });
    return () => { cancelled = true; };
  }, [q1, q4]);

  return (
    <div className="size-full bg-[#FAFAF7] overflow-y-auto relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 px-6 py-12 pb-12 max-w-md mx-auto flex flex-col min-h-full">
        {/* Top - Large Avatar */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative w-[140px] h-[140px]">
            {/* Outer amber glow */}
            <div className="absolute inset-0 rounded-full bg-[#D97706]/10 blur-2xl animate-pulse-glow"></div>

            {/* Main Avatar - Voronoi Blob */}
            <svg width="140" height="140" viewBox="0 0 140 140" className="breathing-avatar">
              <defs>
                <filter id="goo-large">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
                <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </radialGradient>
              </defs>

              <path
                d="M70,20 C90,18 110,30 120,50 C130,70 125,92 110,108 C95,124 75,130 55,125 C35,120 20,105 15,85 C10,65 18,45 35,30 C48,20 58,21 70,20 Z"
                fill="#2563EB"
                filter="url(#goo-large)"
                opacity="0.95"
              />
              <circle cx="70" cy="70" r="50" fill="url(#amberGlow)" />
              <circle cx="50" cy="55" r="12" fill="#2563EB" opacity="0.6" />
              <circle cx="90" cy="65" r="8" fill="#2563EB" opacity="0.5" />
              <circle cx="70" cy="90" r="14" fill="#2563EB" opacity="0.4" />
            </svg>
          </div>

          {/* Status */}
          <div className="text-[14px] text-[#10B981]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            ● twin · ready
          </div>
        </div>

        {/* Center - Headlines */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <h1 className="text-[22px] text-center text-[#0A0A0A] tracking-[-0.01em]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            你的分身已经准备好了
          </h1>

          <p className="text-[15px] leading-[1.6] text-center text-[#D97706] px-4" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
            它现在知道：你看好什么、你讨厌什么、你卡在什么
          </p>
        </div>

        {/* Memory Peek Section — [API] data from POST /api/twin-memory */}
        <div className="mb-6">
          <div className="text-[11px] text-[#6B6B70] mb-4 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [initial memory · {slices.length || '...'} slices]
          </div>

          <div className="flex flex-col gap-3 mb-4">
            {slices.length > 0 ? slices.map((slice) => (
              <div key={slice.id} className="bg-white border border-[#E8E8E5] rounded-lg p-4 animate-fade-in">
                <p className="text-[14px] leading-[1.65] text-[#D97706] whitespace-pre-line" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                  {slice.text}
                </p>
              </div>
            )) : (
              // Loading state — show skeleton while waiting for LLM
              <>
                <div className="bg-[#F5F5F2] border border-[#E8E8E5] rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-[#E8E8E5] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[#E8E8E5] rounded w-1/2"></div>
                </div>
                <div className="bg-[#F5F5F2] border border-[#E8E8E5] rounded-lg p-4 animate-pulse" style={{ animationDelay: '0.15s' }}>
                  <div className="h-4 bg-[#E8E8E5] rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-[#E8E8E5] rounded w-1/3"></div>
                </div>
                <div className="bg-[#F5F5F2] border border-[#E8E8E5] rounded-lg p-4 animate-pulse" style={{ animationDelay: '0.3s' }}>
                  <div className="h-4 bg-[#E8E8E5] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[#E8E8E5] rounded w-1/2"></div>
                </div>
              </>
            )}
          </div>

          {/* Helper Text */}
          <p className="text-[13px] text-[#6B6B70] text-center leading-[1.5]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
            这些只是开始——每参加一场活动，你的分身会变得更像你
          </p>
        </div>

        {/* Bottom - Primary Button */}
        <div className="mt-auto pt-8">
          <button
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-150"
            style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
          >
            进入产品 →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes breathing {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.95;
          }
          50% {
            transform: scale(1.05) rotate(2deg);
            opacity: 1;
          }
        }

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
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .breathing-avatar {
          animation: breathing 4s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out both;
        }
        .animate-fade-in:nth-child(1) { animation-delay: 0s; }
        .animate-fade-in:nth-child(2) { animation-delay: 0.1s; }
        .animate-fade-in:nth-child(3) { animation-delay: 0.2s; }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
