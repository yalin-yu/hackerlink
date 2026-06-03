type RelationType = 'business' | 'peer' | 'mentor' | 'interest' | 'dormant';

type TimelineEvent = {
  type: string;
  date: string;
  description: string;
};

type RelationDetail = {
  id: number;
  name: string;
  codename: string;
  type: RelationType;
  vibe: string;
  whyConnected: {
    commonGround: string;
    complement: string;
    tasteMatch: string;
  };
  timeline: TimelineEvent[];
  strengthAnalysis: string;
  latestUpdate: string;
  reconnectSuggestion: string;
};

const typeColors = {
  business: '#D97706',
  peer: '#10B981',
  mentor: '#8B7DB8',
  interest: '#EC4899',
  dormant: '#6B6B70'
};

const typeLabels = {
  business: '商业',
  peer: '同伴',
  mentor: '指引',
  interest: '同好',
  dormant: '沉睡'
};

export default function RelationDetailCard({ relationId, onClose, onChat }: { relationId: number; onClose?: () => void; onChat?: () => void }) {
  // Mock data - 实际应该根据 relationId 获取
  const relation: RelationDetail = {
    id: 1,
    name: 'Brian',
    codename: '@deep_listener_07',
    type: 'peer',
    vibe: '在 VAD 方向最有原创判断的人',
    whyConnected: {
      commonGround: '你们都关注 voice agent 的延迟优化，都认为瓶颈是场景而非模型',
      complement: 'TA 在 VAD 前置上有反共识方案，你在产品场景判断上更敏锐',
      tasteMatch: '你们都讨厌无效社交，表达直接，能快速进入问题核心'
    },
    timeline: [
      { type: '初识', date: '2026.05.30', description: 'Anthropic Hackathon · Agent 初聊' },
      { type: 'Coffee Chat', date: '2026.05.30', description: '活动二楼咖啡角 · 15分钟深聊 VAD 实现' },
      { type: '关系更新', date: '2026.06.02', description: '添加到核心关系网' }
    ],
    strengthAnalysis: '你们有明确方向重合，且双方都表达过赛后继续沟通的意愿。TA 有具体 demo，你有产品判断，天然可组队。',
    latestUpdate: '3天前更新了 LinkedIn，提到正在做 VAD 前置的 POC',
    reconnectSuggestion: '建议从"上次你们聊过 VAD 前置方案"切入，问他最近 demo 是否已经有进展。可以提议下周再约一次技术细节讨论。'
  };

  const typeColor = typeColors[relation.type];

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
      ></div>

      {/* Card */}
      <div className="relative w-full bg-white rounded-t-2xl shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#E8E8E5] rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#E8E8E5]">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-[24px] text-[#0A0A0A]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                  {relation.name}
                </h2>
                <div
                  className="px-2 py-0.5 rounded text-[11px] text-white"
                  style={{ backgroundColor: typeColor, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {typeLabels[relation.type]}
                </div>
              </div>
              <p className="text-[13px] text-[#6B6B70] mb-2" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                {relation.codename}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* TA 的 Vibe */}
          <div className="mb-6">
            <div className="text-[11px] text-[#6B6B70] mb-2 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              [TA 的 vibe]
            </div>
            <p className="text-[14px] leading-[1.65] text-[#D97706]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
              {relation.vibe}
            </p>
          </div>

          {/* 为什么你们连接 */}
          <div className="mb-6">
            <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              [为什么你们连接]
            </div>
            <div className="bg-[#FAFAF7] border border-[#E8E8E5] rounded-lg p-4 space-y-3">
              <div>
                <span className="text-[13px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                  共同点：
                </span>
                <span className="text-[13px] text-[#0A0A0A] ml-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                  {relation.whyConnected.commonGround}
                </span>
              </div>
              <div>
                <span className="text-[13px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                  互补点：
                </span>
                <span className="text-[13px] text-[#0A0A0A] ml-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                  {relation.whyConnected.complement}
                </span>
              </div>
              <div>
                <span className="text-[13px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                  Taste 契合：
                </span>
                <span className="text-[13px] text-[#0A0A0A] ml-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                  {relation.whyConnected.tasteMatch}
                </span>
              </div>
            </div>
          </div>

          {/* 历史建联记录 */}
          <div className="mb-6">
            <div className="text-[11px] text-[#6B6B70] mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              [历史建联记录]
            </div>
            <div className="relative pl-4">
              {/* Vertical line */}
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#E8E8E5]"></div>

              <div className="space-y-4">
                {relation.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-[11px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#2563EB]"></div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] text-[#0A0A0A]" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                          {event.type}
                        </span>
                        <span className="text-[11px] text-[#A8A8AC]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
                          {event.date}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 关系强度判定 */}
          <div className="mb-6">
            <div className="text-[11px] text-[#6B6B70] mb-2 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              [关系强度判定]
            </div>
            <p className="text-[14px] leading-[1.65] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
              {relation.strengthAnalysis}
            </p>
          </div>

          {/* 最新 Update */}
          <div className="mb-6">
            <div className="text-[11px] text-[#6B6B70] mb-2 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              [最新 update]
            </div>
            <div className="flex items-start gap-2 px-3 py-2.5 bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg">
              <span className="text-[16px] shrink-0">🔔</span>
              <p className="text-[13px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                {relation.latestUpdate}
              </p>
            </div>
          </div>

          {/* 再次建联建议 */}
          <div className="mb-6">
            <div className="text-[11px] text-[#6B6B70] mb-2 tracking-wider" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              [再次建联建议]
            </div>
            <div className="flex gap-2">
              <div className="w-1 bg-[#D97706] shrink-0 rounded"></div>
              <p className="text-[14px] leading-[1.65] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                {relation.reconnectSuggestion}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={onChat}
              className="w-full py-3 px-4 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-all duration-150"
              style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '15px' }}
            >
              进入 Chat
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 px-3 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors text-[13px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                让 Agent 开场
              </button>
              <button className="py-2.5 px-3 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors text-[13px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                邀请 Coffee Chat
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2.5 px-3 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors text-[13px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                稍后提醒
              </button>
              <button className="py-2.5 px-3 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors text-[13px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                标记重要
              </button>
              <button className="py-2.5 px-3 border border-[#E8E8E5] rounded-lg text-[#6B6B70] hover:border-[#6B6B70] hover:text-[#0A0A0A] transition-colors text-[13px]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                归档
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
