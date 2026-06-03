import { useState } from 'react';

type Role = 'builder' | 'backer' | 'organizer';

export default function Question4Screen({ onNext, onSkip, role }: { onNext?: (text: string) => void; onSkip?: () => void; role: Role }) {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const placeholders: Record<Role, string> = {
    builder: '你目前最具体的困境是什么？\n\nDemo能跑了，但卡在真实场景用户不用，不知道是切错痛点还是交互太重',
    backer: '你目前最具体的困境是什么？\n\n模式看着都不错，但卡在团队没商业化经验，不确定他们能不能把东西卖出去',
    organizer: '你目前最具体的困境是什么？\n\n参赛项目方向很散，卡在怎么把对的人组到一桌，怕活动变成了自嗨'
  };

  const selectedPlaceholder = placeholders[role];

  const handleRecordStart = () => {
    setIsRecording(true);
    // TODO: 实际的语音录制逻辑
    console.log('开始录音');
  };

  const handleRecordEnd = () => {
    setIsRecording(false);
    // TODO: 停止录音并转文字
    console.log('结束录音');
  };

  return (
    <div className="size-full bg-[#FAFAF7] overflow-y-auto relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 px-6 py-8 pb-12 max-w-md mx-auto flex flex-col min-h-full">
        {/* Top - Small Avatar + Optional Tag */}
        <div className="mb-8 flex items-start justify-between">
          <div className="w-10 h-10">
            <svg width="40" height="40" viewBox="0 0 120 120" className="breathing-avatar-small">
              <defs>
                <filter id="goo-small">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </defs>
              <path
                d="M60,20 C75,18 88,25 95,40 C102,55 100,72 90,85 C80,98 65,103 50,100 C35,97 22,88 18,73 C14,58 20,42 32,30 C40,22 50,21 60,20 Z"
                fill="#2563EB"
                filter="url(#goo-small)"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Optional Pill Tag */}
          <div className="px-3 py-1 border border-[#E8E8E5] rounded-full bg-white/60 backdrop-blur-sm">
            <span className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              [optional · 可跳过]
            </span>
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-8">
          <h1 className="text-[20px] leading-[1.4] text-[#0A0A0A] tracking-[-0.01em] mb-3" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            你正在做的事情里,最近<br />
            卡住你的一个具体问题是什么?
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] leading-[1.5] text-[#D97706] mb-6" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
            越具体，分身越能帮你找对人。卡在两难之间的事最值得写。
          </p>

          {/* Input Field */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={selectedPlaceholder}
                rows={6}
                className="w-full p-4 pr-12 border border-[#E8E8E5] rounded-lg bg-white text-[#0A0A0A] placeholder:text-[#6B6B70] resize-none focus:outline-none focus:border-[#2563EB] transition-colors"
                style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '15px', lineHeight: '1.5' }}
              />

              {/* Microphone Icon */}
              <button
                onMouseDown={handleRecordStart}
                onMouseUp={handleRecordEnd}
                onMouseLeave={handleRecordEnd}
                onTouchStart={handleRecordStart}
                onTouchEnd={handleRecordEnd}
                onTouchCancel={handleRecordEnd}
                className={`absolute right-3 top-3 w-6 h-6 flex items-center justify-center transition-colors ${
                  isRecording ? 'text-[#EF4444]' : 'text-[#6B6B70] hover:text-[#2563EB]'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </button>
            </div>

            <div className="text-[11px] text-[#A8A8AC] text-right" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              {isRecording ? '[recording... release to stop]' : '[hold to speak · 10s]'}
            </div>
          </div>
        </div>

        {/* Bottom - Two Buttons Side by Side */}
        <div className="mt-auto pt-8">
          <div className="flex gap-3">
            {/* Ghost Button - Skip */}
            <button
              onClick={onSkip}
              className="flex-[0.4] py-3.5 px-4 rounded-lg bg-transparent border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-all duration-150"
              style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
            >
              跳过
            </button>

            {/* Primary Button - Complete */}
            <button
              onClick={() => onNext?.(answer)}
              disabled={!answer.trim()}
              className={`
                flex-[0.55] py-3.5 px-4 rounded-lg transition-all duration-150
                ${answer.trim()
                  ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af]'
                  : 'bg-[#E8E8E5] text-[#A8A8AC] cursor-not-allowed'
                }
              `}
              style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
            >
              完成 →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes breathing-small {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        .breathing-avatar-small {
          animation: breathing-small 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
