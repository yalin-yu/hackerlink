import { useState } from 'react';

export default function MeetOfflineInvitation({ onSend, onBack }: { onSend?: () => void; onBack?: () => void }) {
  const [startTime, setStartTime] = useState('18:20');
  const [endTime, setEndTime] = useState('18:35');
  const [location, setLocation] = useState('活动二楼咖啡角');

  const useSuggestion = () => {
    setLocation('活动二楼咖啡角');
  };

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
          <h1 className="text-[20px] text-[#0A0A0A] tracking-[-0.01em]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            发起线下见面
          </h1>
        </div>
        <p className="text-[12px] text-[#6B6B70] pl-8" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          [twin_partner: @deep_listener_07]
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-6 pb-28">
        {/* Agent's Recommendation Section */}
        <div className="mb-6">
          <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [twin suggests]
          </div>

          <div className="bg-white border border-[#E8E8E5] rounded-lg p-0 overflow-hidden">
            {/* Amber accent line on left */}
            <div className="flex">
              <div className="w-1 bg-[#D97706] shrink-0"></div>
              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[16px] shrink-0">📍</span>
                  <p className="text-[14px] leading-[1.6] text-[#0A0A0A]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                    <span className="font-normal">地点: </span>活动二楼咖啡角(距主厅 50m)
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[16px] shrink-0">⏱</span>
                  <p className="text-[14px] leading-[1.6] text-[#0A0A0A]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                    <span className="font-normal">时长: </span>15 分钟足够判断是否值得深入
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[16px] shrink-0">💡</span>
                  <p className="text-[14px] leading-[1.6] text-[#0A0A0A]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                    <span className="font-normal">理由: </span>你们方向互补,直接进技术细节就行
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Editable Section */}
        <div className="mb-6">
          <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [your invitation]
          </div>

          <div className="space-y-4">
            {/* Time Picker */}
            <div>
              <label className="text-[13px] text-[#6B6B70] mb-2 block" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                见面时间
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 px-4 py-3 border border-[#E8E8E5] rounded-lg bg-white text-[#0A0A0A] focus:outline-none focus:border-[#2563EB] transition-colors"
                  style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '15px' }}
                />
                <span className="text-[#6B6B70]">—</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 px-4 py-3 border border-[#E8E8E5] rounded-lg bg-white text-[#0A0A0A] focus:outline-none focus:border-[#2563EB] transition-colors"
                  style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '15px' }}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                  见面地点
                </label>
                <button
                  onClick={useSuggestion}
                  className="text-[12px] text-[#2563EB] hover:underline"
                  style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}
                >
                  use suggestion
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8E8E5] rounded-lg bg-white text-[#0A0A0A] focus:outline-none focus:border-[#2563EB] transition-colors"
                style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontSize: '15px' }}
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mb-6">
          <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [preview]
          </div>

          {/* Invitation Envelope Card */}
          <div className="bg-white border border-[#E8E8E5] border-t-[3px] border-t-[#D97706] rounded-lg p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="text-[20px]">☕</span>
              <h3 className="text-[16px] text-[#0A0A0A]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                Coffee Chat 邀约
              </h3>
            </div>

            {/* Time + Location */}
            <div className="space-y-2">
              <div className="text-[15px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                {startTime} — {endTime}
              </div>
              <div className="text-[15px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                📍 {location}
              </div>
            </div>

            {/* Agent Analysis - Quoted with left bar */}
            <div className="flex gap-3">
              <div className="w-0.5 bg-[#D97706] shrink-0"></div>
              <p className="text-[14px] leading-[1.65] text-[#D97706]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
                你们方向互补,TA 偏 infra 你偏产品,<br />
                15 分钟足够判断是否值得深入聊聊
              </p>
            </div>

            {/* Status */}
            <div className="pt-3 border-t border-[#E8E8E5]">
              <div className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                [● awaiting your confirmation]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action - Sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-4 z-40">
        <div className="max-w-md mx-auto">
          <button
            onClick={onSend}
            className="w-full py-3.5 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-all duration-150 mb-2"
            style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
          >
            发送邀约 →
          </button>
          <p className="text-[12px] text-[#6B6B70] text-center" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
            对方会立刻收到,可以接受/改时间/婉拒
          </p>
        </div>
      </div>
    </div>
  );
}
