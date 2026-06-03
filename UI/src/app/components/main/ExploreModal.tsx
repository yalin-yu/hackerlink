import { useState } from 'react';

export default function ExploreModal({ onStart, onClose }: { onStart?: (selectedCards: number[], customInput: string) => void; onClose?: () => void }) {
  const [selectedCards, setSelectedCards] = useState<number[]>([1, 6]);
  const [customInput, setCustomInput] = useState('');

  const cards = [
    {
      id: 1,
      emoji: '🤝',
      label: '能一起做事的人',
      description: '想找 cofounder 或长期合作'
    },
    {
      id: 2,
      emoji: '🔬',
      label: '能给真实反馈的人',
      description: '让你的想法被严肃挑战'
    },
    {
      id: 3,
      emoji: '🧭',
      label: '同方向 Builder',
      description: '在做相似事情的人'
    },
    {
      id: 4,
      emoji: '💰',
      label: '投资人 / 资源方',
      description: '看赛道的或能帮你 scale'
    },
    {
      id: 5,
      emoji: '🪐',
      label: '意想不到但有趣的人',
      description: '跨界的、有 taste 的'
    },
    {
      id: 6,
      emoji: '🎯',
      label: '解决你具体卡点的人',
      description: '见你 onboarding 提到的那个问题'
    }
  ];

  const toggleCard = (id: number) => {
    setSelectedCards(prev =>
      prev.includes(id)
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col relative">
      {/* Dimmed Background Overlay */}
      <div className="absolute inset-0 bg-[#FAFAF7]/60 backdrop-blur-sm z-40"></div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-white rounded-t-2xl z-50 flex flex-col animate-slide-up">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-10 h-1 bg-[#E8E8E5] rounded-full"></div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                [twin · ready to explore]
              </div>
              <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <h2 className="text-[20px] text-[#0A0A0A] tracking-[-0.01em] mb-2" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
              这场活动,你最想遇到谁?
            </h2>
            <p className="text-[14px] text-[#D97706]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
              Agent 会带着这个目标去和其他分身聊
            </p>
          </div>

          {/* Selection Cards - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {cards.map((card) => {
              const isSelected = selectedCards.includes(card.id);
              return (
                <button
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  className={`
                    p-4 rounded-lg text-left transition-all
                    ${isSelected
                      ? 'bg-[#2563EB]/5 border-2 border-[#2563EB]'
                      : 'bg-white border border-[#E8E8E5] hover:border-[#6B6B70]'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">{card.emoji}</div>
                  <div className="text-[14px] text-[#0A0A0A] mb-1" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                    {card.label}
                  </div>
                  <div className="text-[12px] text-[#6B6B70] leading-[1.4]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                    {card.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional Custom Input */}
          <div className="mb-6">
            <label className="text-[13px] text-[#6B6B70] mb-2 block" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
              或者直接告诉它(可选)
            </label>
            <div className="relative border border-[#E8E8E5] rounded-lg bg-white px-4 py-3 focus-within:border-[#2563EB] transition-colors">
              <div className="flex items-baseline gap-1">
                <span className="text-[#0A0A0A] shrink-0" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '14px', lineHeight: '1.5' }}>
                  我想见一个
                </span>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="在做 voice agent infra 的人,延迟优化是关键"
                  rows={2}
                  className="flex-1 outline-none bg-transparent text-[#0A0A0A] placeholder:text-[#6B6B70] resize-none"
                  style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '14px', lineHeight: '1.5' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Button */}
        <div className="border-t border-[#E8E8E5] px-6 py-4 bg-white">
          <button
            onClick={() => onStart?.(selectedCards, customInput)}
            disabled={selectedCards.length === 0 && !customInput.trim()}
            className={`
              w-full py-3.5 px-6 rounded-lg transition-all duration-150
              ${selectedCards.length > 0 || customInput.trim()
                ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af]'
                : 'bg-[#E8E8E5] text-[#A8A8AC] cursor-not-allowed'
              }
            `}
            style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
          >
            让分身出发 →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
