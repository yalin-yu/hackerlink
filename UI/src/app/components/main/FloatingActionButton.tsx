type FABState = 'new-event' | 'chatting' | 'found-people' | 'hidden';

export default function FloatingActionButton({
  state,
  onPress
}: {
  state: FABState;
  onPress?: () => void;
}) {
  if (state === 'hidden') return null;

  const messages = {
    'new-event': '长按让分身去找人',
    'chatting': '分身正在帮你聊',
    'found-people': '分身帮你找到9人了'
  };

  const message = messages[state];

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="relative">
        {/* Enhanced pulsing amber halo */}
        <div className="absolute inset-0 rounded-full bg-[#D97706]/30 blur-xl animate-pulse-halo-highlight"></div>

        {/* Main Button */}
        <button
          onClick={onPress}
          className="relative w-[72px] h-[72px] rounded-full bg-white border-2 border-[#2563EB] hover:border-[#2563EB] hover:shadow-lg transition-all duration-300 flex items-center justify-center group animate-pulse-gentle"
        >
          {/* Isometric Cube Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#2563EB]">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* Notification Badge - only for found-people state */}
          {state === 'found-people' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#EF4444] border-2 border-white flex items-center justify-center">
              <span className="text-[11px] text-white" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", fontWeight: 600 }}>
                9
              </span>
            </div>
          )}
        </button>

        {/* Caption */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          {message}
        </div>
      </div>

      <style>{`
        @keyframes pulse-halo-highlight {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.3);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        .animate-pulse-halo-highlight {
          animation: pulse-halo-highlight 2s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
