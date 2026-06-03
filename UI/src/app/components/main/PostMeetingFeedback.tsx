import { useState } from 'react';

const GeometricAvatar = ({ size = 60 }: { size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,4 40,14 40,34 24,44 8,34 8,14" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="24" r="8" fill="#D97706" opacity="0.3" />
    </svg>
  );
};

type WorthLevel = 'very' | 'maybe' | 'not';
type NextStep = 'continue' | 'collaborate' | 'feedback' | 'archive';

export default function PostMeetingFeedback({ onSave, onBack }: { onSave?: () => void; onBack?: () => void }) {
  const [worthLevel, setWorthLevel] = useState<WorthLevel>('very');
  const [topics, setTopics] = useState('聊了 VAD 前置的具体实现,TA 有 demo,我们决定下周再深聊');
  const [nextSteps, setNextSteps] = useState<NextStep[]>(['continue', 'collaborate']);

  const toggleNextStep = (step: NextStep) => {
    setNextSteps(prev =>
      prev.includes(step)
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  };

  const worthOptions = [
    { value: 'very' as WorthLevel, label: '很值得', dot: '●', color: 'text-[#10B981]', bgColor: 'bg-[#10B981]/10', borderColor: 'border-[#10B981]' },
    { value: 'maybe' as WorthLevel, label: '可以观察', dot: '◐', color: 'text-[#D97706]', bgColor: 'bg-[#D97706]/10', borderColor: 'border-[#D97706]' },
    { value: 'not' as WorthLevel, label: '暂时不用', dot: '○', color: 'text-[#6B6B70]', bgColor: 'bg-[#6B6B70]/10', borderColor: 'border-[#6B6B70]' }
  ];

  const nextStepOptions = [
    { value: 'continue' as NextStep, label: '想继续聊' },
    { value: 'collaborate' as NextStep, label: '想合作' },
    { value: 'feedback' as NextStep, label: '想要反馈' },
    { value: 'archive' as NextStep, label: '仅保留记录' }
  ];

  return (
    <div className="size-full bg-[#FAFAF7] overflow-y-auto relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 px-6 py-8 pb-28 max-w-md mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-[14px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>返回</span>
          </button>
        </div>

        {/* Top Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Avatar */}
          <div className="mb-4">
            <GeometricAvatar size={60} />
          </div>

          {/* Headline */}
          <h1 className="text-[18px] text-center text-[#0A0A0A] tracking-[-0.01em] mb-2" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            刚刚和 <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>@deep_listener_07</span> 聊得怎么样?
          </h1>

          {/* Subtitle */}
          <p className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            [honest feedback helps your twin]
          </p>
        </div>

        {/* Question 1 - Worth Continuing? */}
        <div className="mb-6">
          <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [worth continuing?]
          </div>

          <div className="flex gap-2">
            {worthOptions.map((option) => {
              const isSelected = worthLevel === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setWorthLevel(option.value)}
                  className={`
                    flex-1 py-3 px-3 rounded-lg border transition-all
                    ${isSelected
                      ? `${option.bgColor} ${option.borderColor} border-2`
                      : 'bg-white border border-[#E8E8E5] hover:border-[#6B6B70]'
                    }
                  `}
                >
                  <div className={`text-[16px] mb-1 ${isSelected ? option.color : 'text-[#6B6B70]'}`}>
                    {option.dot}
                  </div>
                  <div className={`text-[13px] ${isSelected ? option.color : 'text-[#6B6B70]'}`} style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: isSelected ? 600 : 400 }}>
                    {option.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2 - What did you talk about? */}
        <div className="mb-6">
          <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [topics]
          </div>

          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="聊了什么?一两句话就行"
                rows={3}
                className="w-full p-4 pr-12 border border-[#E8E8E5] rounded-lg bg-white text-[#0A0A0A] placeholder:text-[#6B6B70] resize-none focus:outline-none focus:border-[#2563EB] transition-colors"
                style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '14px' }}
              />

              {/* Microphone Icon */}
              <button className="absolute right-3 top-3 w-6 h-6 flex items-center justify-center text-[#6B6B70] hover:text-[#2563EB] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </button>
            </div>

            <div className="text-[11px] text-[#A8A8AC] text-right" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              [hold to speak · 10s]
            </div>
          </div>
        </div>

        {/* Question 3 - Next Step? */}
        <div className="mb-6">
          <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [next step]
          </div>

          <div className="flex flex-wrap gap-2">
            {nextStepOptions.map((option) => {
              const isSelected = nextSteps.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleNextStep(option.value)}
                  className={`
                    px-4 py-2.5 rounded-lg border transition-all
                    ${isSelected
                      ? 'bg-[#2563EB]/10 border-[#2563EB] border-2 text-[#2563EB]'
                      : 'bg-white border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70]'
                    }
                  `}
                  style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '14px', fontWeight: isSelected ? 600 : 400 }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action - Sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-4 z-40">
        <div className="max-w-md mx-auto">
          <button
            onClick={onSave}
            className="w-full py-3.5 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-150 mb-2"
            style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
          >
            保存到关系网 →
          </button>
          <p className="text-[12px] text-[#6B6B70] text-center" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
            TA 会被加入你的关系圈层
          </p>
        </div>
      </div>
    </div>
  );
}
