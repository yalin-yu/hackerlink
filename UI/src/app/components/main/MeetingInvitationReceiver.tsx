import { useState } from 'react';

const GeometricAvatar = ({ size = 40 }: { size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,4 40,14 40,34 24,44 8,34 8,14" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="24" r="8" fill="#D97706" opacity="0.3" />
    </svg>
  );
};

export default function MeetingInvitationReceiver({ onConfirm, onBack }: { onConfirm?: () => void; onBack?: () => void }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Top Nav - Chat Header */}
      <div className="relative z-10 flex items-center gap-3 px-6 py-4 border-b border-[#E8E8E5] bg-[#FAFAF7]">
        <button onClick={onBack} className="w-5 h-5 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="w-10 h-10">
          <GeometricAvatar size={40} />
        </div>
        <div>
          <div className="text-[15px] text-[#0A0A0A]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            @deep_listener_07
          </div>
        </div>
      </div>

      {/* Toggle for Preview */}
      <div className="relative z-10 px-6 py-3 bg-[#FAFAF7] border-b border-[#E8E8E5]">
        <div className="flex gap-2">
          <button
            onClick={() => setConfirmed(false)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              !confirmed
                ? 'bg-[#2563EB] text-white'
                : 'bg-transparent text-[#6B6B70] hover:text-[#0A0A0A]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            New Invitation
          </button>
          <button
            onClick={() => setConfirmed(true)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              confirmed
                ? 'bg-[#2563EB] text-white'
                : 'bg-transparent text-[#6B6B70] hover:text-[#0A0A0A]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Confirmed
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-6 pb-6">
        {/* Prior Message Bubbles */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-start">
            <div className="max-w-[75%] bg-white border border-[#E8E8E5] rounded-lg rounded-tl-none px-4 py-2.5">
              <p className="text-[14px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                你也在做 voice agent?
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[75%] bg-[#2563EB] rounded-lg rounded-tr-none px-4 py-2.5">
              <p className="text-[14px] text-white" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                对,延迟一直是大问题...
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[75%] bg-white border border-[#E8E8E5] rounded-lg rounded-tl-none px-4 py-2.5">
              <p className="text-[14px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                我最近在试 VAD 前置,可能能帮到你
              </p>
            </div>
          </div>
        </div>

        {/* INVITATION CARD */}
        <div className="flex justify-center mb-3">
          <div className="w-[90%] bg-white border border-[#E8E8E5] border-t-[3px] border-t-[#D97706] rounded-lg overflow-hidden animate-drop-in shadow-sm">
            {/* Top Row */}
            <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#E8E8E5]">
              <div className="flex items-center gap-2">
                <span className="text-[18px]">☕</span>
                <span className="text-[15px] text-[#0A0A0A]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                  Coffee Chat 邀约
                </span>
              </div>
              <span className="text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                [just now]
              </span>
            </div>

            {/* Sender Info */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-[#E8E8E5]">
              <div className="w-6 h-6">
                <GeometricAvatar size={24} />
              </div>
              <p className="text-[13px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>@your_codename</span> 想和你见 15 分钟
              </p>
            </div>

            {!confirmed ? (
              /* NEW INVITATION STATE */
              <>
                {/* Time & Location */}
                <div className="px-4 py-4 space-y-2 border-b border-[#E8E8E5]">
                  <div className="text-[18px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                    18:20 — 18:35
                  </div>
                  <div className="text-[15px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                    📍 活动二楼咖啡角
                  </div>
                </div>

                {/* Agent Analysis */}
                <div className="px-4 py-4 border-b border-[#E8E8E5]">
                  <div className="flex gap-3">
                    <div className="w-0.5 bg-[#D97706] shrink-0"></div>
                    <p className="text-[14px] leading-[1.65] text-[#0A0A0A]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                      TA 和你方向互补,这次见面可能帮你<br />
                      找到产品场景判断上的搭档
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => {
                      setConfirmed(true);
                      setTimeout(() => onConfirm?.(), 2000);
                    }}
                    className="flex-[2] py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                    style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '14px' }}
                  >
                    赴约
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '13px' }}>
                    改时间
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '13px' }}>
                    婉拒
                  </button>
                </div>
              </>
            ) : (
              /* CONFIRMED STATE */
              <>
                {/* Time & Location */}
                <div className="px-4 py-4 space-y-2 border-b border-[#E8E8E5]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-[12px] text-[#10B981]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                      [✓ confirmed · meet in 23 min]
                    </span>
                  </div>
                  <div className="text-[18px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                    18:20 — 18:35
                  </div>
                  <div className="text-[15px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                    📍 活动二楼咖啡角
                  </div>
                </div>

                {/* Countdown */}
                <div className="px-4 py-4 border-b border-[#E8E8E5]">
                  <div className="flex items-center justify-center gap-2 py-2 bg-[#10B981]/5 rounded-lg mb-3">
                    <span className="text-[20px]">⏱</span>
                    <span className="text-[18px] text-[#10B981]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", fontWeight: 600 }}>
                      见面倒计时 23:14
                    </span>
                  </div>
                </div>

                {/* Action Buttons - Confirmed State */}
                <div className="px-4 py-3 flex gap-2">
                  <button className="flex-1 py-2.5 rounded-lg border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '13px' }}>
                    取消
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 500, fontSize: '13px' }}>
                    改期
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* System Message */}
        <div className="flex justify-center">
          <p className="text-[11px] text-[#A8A8AC] text-center" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            Agent 已根据你们的 vibe 生成此邀约 · 7s ago
          </p>
        </div>
      </div>

      <style>{`
        @keyframes drop-in {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          50% {
            transform: translateY(5px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-drop-in {
          animation: drop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
