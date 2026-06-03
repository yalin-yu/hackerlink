import { useState } from 'react';

type Role = 'builder' | 'backer' | 'organizer';

export default function Question1Screen({ onNext, role }: { onNext: (text: string) => void; role: Role }) {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const tabs = [
    '想法 / Demo / 方向',
    '搭档 / 资金 / 渠道',
    '趋势 / 判断 / 壁垒',
    '卡点 / 瓶颈 / 死胡同'
  ];

  const placeholders: Record<Role, string> = {
    builder: '用一句话说说你最近的直觉或困惑：\n\n大家都在卷应用层，但我感觉底层基建才是真机会，一直没找到人聊透',
    backer: '用一句话说说你最近的直觉或困惑：\n\n看了几十个套壳项目，想找真正在底层做事的团队，聊聊壁垒到底在哪',
    organizer: '用一句话说说你最近的直觉或困惑：\n\n想把做基建和做应用的两组人连起来，但缺一个能把两边语言对齐的切入点'
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
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 px-6 py-8 pb-12 max-w-md mx-auto flex flex-col min-h-full">
        <div className="mb-8">
          <div className="w-10 h-10">
            <svg width="40" height="40" viewBox="0 0 120 120" className="breathing-avatar-small">
              <path d="M60,20 C75,18 88,25 95,40 C102,55 100,72 90,85 C80,98 65,103 50,100 C35,97 22,88 18,73 C14,58 20,42 32,30 C40,22 50,21 60,20 Z" fill="#2563EB" opacity="0.9" />
            </svg>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-[20px] leading-[1.4] text-[#0A0A0A] tracking-[-0.01em] mb-6" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            最近一个月,有什么事让你忍不住<br />
            想找人聊但没找到合适的人?
          </h1>

          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedTab(index)}
                className={`
                  px-3 py-2 rounded-lg text-[13px] transition-all
                  ${selectedTab === index
                    ? 'bg-[#2563EB]/10 border border-[#2563EB] text-[#2563EB]'
                    : 'bg-white border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70]'
                  }
                `}
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Input Section */}
          <div className="space-y-2">
            {/* Guide Text */}
            <p className="text-[13px] text-[#D97706] leading-[1.5] mb-3" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
              别写简历，写你最近心里那个还没对别人说过的直觉。
            </p>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
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

        <div className="mt-auto pt-8">
          <button
            onClick={() => onNext(inputText)}
            disabled={!inputText.trim()}
            className={`w-full py-3.5 px-6 rounded-lg transition-all duration-150 ${inputText.trim() ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af]' : 'bg-[#E8E8E5] text-[#A8A8AC] cursor-not-allowed'}`}
            style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
          >
            下一题 →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .breathing-avatar-small { animation: breathing-small 3s ease-in-out infinite; }
        @keyframes breathing-small {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
