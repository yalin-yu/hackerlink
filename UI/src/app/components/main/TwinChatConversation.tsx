import { useState } from 'react';

const GeometricAvatar = ({ size = 32 }: { size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,4 40,14 40,34 24,44 8,34 8,14" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="24" r="8" fill="#D97706" opacity="0.3" />
    </svg>
  );
};

type Message = {
  id: number;
  sender: 'user' | 'twin' | 'other';
  content: string;
  timestamp: string;
  type?: 'text' | 'system';
};

export default function TwinChatConversation({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [isTwinMode, setIsTwinMode] = useState(true); // true = 分身控制, false = 用户接管
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');

  const handleTakeControl = () => {
    setTransitionMessage('你已接管对话');
    setShowTransition(true);
    setIsTwinMode(false);
    setTimeout(() => setShowTransition(false), 2000);
  };

  const handleReturnToTwin = () => {
    setTransitionMessage('已交回分身');
    setShowTransition(true);
    setIsTwinMode(true);
    setInputText(''); // 清空输入框
    setTimeout(() => setShowTransition(false), 2000);
  };

  const messages: Message[] = [
    {
      id: 1,
      sender: 'system',
      content: '你的分身 Milo 正在代表你和 @deep_listener_07 聊天',
      timestamp: '14:23',
      type: 'system'
    },
    {
      id: 2,
      sender: 'twin',
      content: '我看你也对 VAD 前置的方案感兴趣,能具体说说你的思路吗?',
      timestamp: '14:23'
    },
    {
      id: 3,
      sender: 'other',
      content: '我最近在做的是把 VAD 判断提前到音频流开始之前,用上下文预判断用户意图',
      timestamp: '14:24'
    },
    {
      id: 4,
      sender: 'twin',
      content: '这个思路有意思。我们这边更关注的是在产品场景里,什么时候用户真的需要这种低延迟的交互',
      timestamp: '14:25'
    },
    {
      id: 5,
      sender: 'other',
      content: '对,其实我也一直在想这个问题。技术上能做到 50ms 延迟,但什么场景真的需要?',
      timestamp: '14:26'
    },
    {
      id: 6,
      sender: 'twin',
      content: '我觉得蓝领招聘可能是一个,比如工地上的临时工需要快速匹配。你有 demo 可以看看吗?',
      timestamp: '14:27'
    },
    {
      id: 7,
      sender: 'other',
      content: '有的,下周我们可以约个时间,我给你演示一下具体实现',
      timestamp: '14:28'
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
      <div className="relative z-10 px-6 py-4 border-b border-[#E8E8E5] bg-[#FAFAF7]">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="w-5 h-5 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1">
            <GeometricAvatar size={32} />
            <div>
              <h1 className="text-[16px] text-[#0A0A0A]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                @deep_listener_07
              </h1>
            </div>
          </div>
          {/* Twin Status Indicator */}
          {isTwinMode ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
              <span className="text-[11px] text-[#2563EB]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                分身在聊
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              <span className="text-[11px] text-[#10B981]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                你在控制
              </span>
            </div>
          )}
        </div>
        <p className="text-[12px] text-[#D97706] pl-8" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
          在 voice agent 延迟优化上有反共识方案
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-6 pb-28">
        <div className="space-y-4 max-w-md mx-auto">
          {messages.map((msg) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="px-3 py-1.5 bg-[#6B6B70]/5 border border-[#E8E8E5] rounded-full">
                    <p className="text-[11px] text-[#6B6B70] text-center" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            }

            const isFromTwin = msg.sender === 'twin';
            const isFromOther = msg.sender === 'other';

            return (
              <div key={msg.id} className={`flex gap-3 ${isFromTwin ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                {isFromOther && (
                  <div className="shrink-0 mt-1">
                    <GeometricAvatar size={32} />
                  </div>
                )}
                {isFromTwin && (
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
                      <span className="text-[12px]">🤖</span>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex-1 ${isFromTwin ? 'mr-12' : 'ml-12'}`}>
                  <div className={`
                    px-4 py-3 rounded-lg
                    ${isFromTwin
                      ? 'bg-white border border-[#2563EB]/20'
                      : 'bg-[#2563EB] text-white'
                    }
                  `}>
                    <p className={`
                      text-[15px] leading-[1.6]
                      ${isFromTwin ? 'text-[#0A0A0A]' : 'text-white'}
                    `} style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                      {msg.content}
                    </p>
                  </div>
                  <div className={`
                    mt-1 text-[11px] text-[#A8A8AC]
                    ${isFromTwin ? 'text-left' : 'text-right'}
                  `} style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transition Toast */}
      {showTransition && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in-out">
          <div className="px-6 py-3 bg-[#0A0A0A] text-white rounded-lg shadow-lg flex items-center gap-2">
            <span className="text-[14px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: 600 }}>
              {transitionMessage}
            </span>
            <span className="text-[16px]">{isTwinMode ? '🤖' : '👤'}</span>
          </div>
        </div>
      )}

      {/* Input Area - Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-4 z-40">
        <div className="max-w-md mx-auto">
          {/* Control Notice */}
          {isTwinMode ? (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-[#D97706]/5 border border-[#D97706]/20 rounded-lg">
              <span className="text-[16px]">✋</span>
              <p className="flex-1 text-[12px] text-[#D97706]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                分身正在代表你聊天,你也可以随时接管
              </p>
              <button
                onClick={handleTakeControl}
                className="text-[12px] text-[#2563EB] hover:underline shrink-0"
                style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}
              >
                接管
              </button>
            </div>
          ) : (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg">
              <span className="text-[16px]">👤</span>
              <p className="flex-1 text-[12px] text-[#10B981]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                你正在亲自聊天,可以让分身继续
              </p>
              <button
                onClick={handleReturnToTwin}
                className="text-[12px] text-[#2563EB] hover:underline shrink-0"
                style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}
              >
                交回分身
              </button>
            </div>
          )}

          {/* Input Box */}
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isTwinMode ? '分身正在聊天,点击上方"接管"后可输入...' : '输入消息...'}
                rows={1}
                disabled={isTwinMode}
                className={`
                  w-full px-4 py-3 pr-12 border border-[#E8E8E5] rounded-lg text-[#0A0A0A] placeholder:text-[#6B6B70] resize-none focus:outline-none focus:border-[#2563EB] transition-colors
                  ${isTwinMode ? 'bg-[#F5F5F5] cursor-not-allowed opacity-60' : 'bg-[#FAFAF7]'}
                `}
                style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '15px' }}
              />
              {/* Microphone Icon */}
              <button disabled={isTwinMode} className={`absolute right-3 bottom-3 w-6 h-6 flex items-center justify-center transition-colors ${isTwinMode ? 'text-[#A8A8AC] cursor-not-allowed' : 'text-[#6B6B70] hover:text-[#2563EB]'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </button>
            </div>
            <button className="shrink-0 w-12 h-12 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-150 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed" disabled={isTwinMode || !inputText.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-out {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          10%, 90% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }

        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
