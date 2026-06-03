import { useState } from 'react';

type RelationType = 'business' | 'peer' | 'mentor' | 'interest' | 'dormant';
type Circle = 'core' | 'potential' | 'dormant';
type NodeStatus = 'lit' | 'normal' | 'activate';

type RelationNode = {
  id: number;
  name: string;
  codename: string;
  type: RelationType;
  circle: Circle;
  status: NodeStatus;
  x: number; // Position in SVG
  y: number;
  size: number;
  vibe: string;
  notification?: string;
};

const typeColors = {
  business: '#D97706', // 黄色 - 商业
  peer: '#10B981',     // 绿色 - 同伴
  mentor: '#8B7DB8',   // 紫色 - 指引
  interest: '#EC4899', // 粉色 - 同好
  dormant: '#6B6B70'   // 灰色 - 沉睡
};

const typeLabels = {
  business: '商业',
  peer: '同伴',
  mentor: '指引',
  interest: '同好',
  dormant: '沉睡'
};

export default function NetworkTabWithGraph({ onNodeClick, onTabChange }: { onNodeClick?: (nodeId: number) => void; onTabChange?: (tab: 'me' | 'messages') => void }) {
  const [expandedNotification, setExpandedNotification] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | RelationType>('all');

  // 示例数据 - 关系网节点
  const nodes: RelationNode[] = [
    {
      id: 1,
      name: 'Brian',
      codename: '@deep_listener_07',
      type: 'peer',
      circle: 'core',
      status: 'lit',
      x: 150,
      y: 180,
      size: 16,
      vibe: '在 VAD 方向最有原创判断的人',
      notification: 'Brian 也报名了 AI Agent Meetup'
    },
    {
      id: 2,
      name: 'Sarah',
      codename: '@product_skeptic_23',
      type: 'peer',
      circle: 'core',
      status: 'normal',
      x: 240,
      y: 160,
      size: 14,
      vibe: '相信工具应该为 builder 服务'
    },
    {
      id: 3,
      name: 'Alex',
      codename: '@fine_tune_rebel_11',
      type: 'mentor',
      circle: 'potential',
      status: 'activate',
      x: 100,
      y: 250,
      size: 12,
      vibe: '在小模型方向有反共识判断'
    },
    {
      id: 4,
      name: 'Jordan',
      codename: '@vc_operator_42',
      type: 'business',
      circle: 'potential',
      status: 'normal',
      x: 280,
      y: 240,
      size: 12,
      vibe: '既懂投资又能亲自下场做产品'
    },
    {
      id: 5,
      name: 'Morgan',
      codename: '@indie_hacker_88',
      type: 'interest',
      circle: 'dormant',
      status: 'normal',
      x: 50,
      y: 150,
      size: 10,
      vibe: '独立开发者，注重产品美感'
    },
    {
      id: 6,
      name: 'Taylor',
      codename: '@ai_researcher_15',
      type: 'dormant',
      circle: 'dormant',
      status: 'normal',
      x: 320,
      y: 180,
      size: 10,
      vibe: '学术背景，关注 AI 理论'
    }
  ];

  const centerX = 190;
  const centerY = 200;

  const filteredNodes = selectedFilter === 'all'
    ? nodes
    : nodes.filter(node => node.type === selectedFilter);

  const activeNotification = nodes.find(n => n.notification);

  return (
    <div className="size-full bg-[#FAFAF7] flex flex-col relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Top Section */}
      <div className="relative z-10 px-6 pt-6 pb-4 border-b border-[#E8E8E5] bg-[#FAFAF7]">
        <h1 className="text-[24px] text-[#0A0A0A] tracking-[-0.01em] mb-1" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
          关系网
        </h1>
        <p className="text-[15px] text-[#0A0A0A] mb-1" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
          6 个有效关系
        </p>
        <p className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          [核心: 2 · 潜力: 2 · 沉睡: 2]
        </p>
      </div>

      {/* Notification Bar */}
      {activeNotification && (
        <div className="relative z-10 border-b border-[#E8E8E5] bg-white">
          <button
            onClick={() => setExpandedNotification(!expandedNotification)}
            className="w-full px-6 py-3 text-left hover:bg-[#FAFAF7] transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#10B981] mt-2 shrink-0 animate-pulse"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                  {activeNotification.notification}
                </p>
                {expandedNotification && (
                  <div className="mt-3 pt-3 border-t border-[#E8E8E5] space-y-3">
                    <p className="text-[13px] leading-[1.6] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                      你们上次聊过 Agent Memory，但没有继续跟进。<br />
                      这次他也报名了同一场活动，可能是重新建立连接的好时机。
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-[#2563EB] text-white rounded-lg text-[12px] hover:bg-[#1d4ed8] transition-colors" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                        让 Agent 帮我开场
                      </button>
                      <button className="px-3 py-2 border border-[#E8E8E5] text-[#6B6B70] rounded-lg text-[12px] hover:border-[#6B6B70] transition-colors" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                        稍后提醒
                      </button>
                      <button className="px-3 py-2 border border-[#E8E8E5] text-[#6B6B70] rounded-lg text-[12px] hover:border-[#6B6B70] transition-colors" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                        忽略
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B6B70"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 mt-0.5 transition-transform ${expandedNotification ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Graph Visualization */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-6 pb-40">
        <div className="bg-white border border-[#E8E8E5] rounded-lg p-6 mb-6">
          {/* Legend */}
          <div className="flex items-center gap-4 mb-6 text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
              <span>同伴</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#D97706]"></div>
              <span>商业</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#8B7DB8]"></div>
              <span>指引</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
              <span>同好</span>
            </div>
          </div>

          {/* SVG Network Graph */}
          <svg width="100%" height="400" viewBox="0 0 380 400" className="overflow-visible">
            {/* Filter definitions for glow effect */}
            <defs>
              {/* 轻微发光模糊 - 用于节点外围光晕 */}
              <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Concentric circles - 圈层 */}
            <circle cx={centerX} cy={centerY} r="80" fill="none" stroke="#E8E8E5" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
            <circle cx={centerX} cy={centerY} r="130" fill="none" stroke="#E8E8E5" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <circle cx={centerX} cy={centerY} r="180" fill="none" stroke="#E8E8E5" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

            {/* Center node (You) */}
            <circle cx={centerX} cy={centerY} r="12" fill="#2563EB" opacity="0.2" />
            <text x={centerX} y={centerY + 30} textAnchor="middle" fontSize="11" fill="#6B6B70" fontFamily="'JetBrains Mono', monospace">
              你
            </text>

            {/* Connection lines */}
            {filteredNodes.map(node => (
              <line
                key={`line-${node.id}`}
                x1={centerX}
                y1={centerY}
                x2={node.x}
                y2={node.y}
                stroke={typeColors[node.type]}
                strokeWidth="1"
                opacity={node.circle === 'dormant' ? 0.2 : 0.4}
              />
            ))}

            {/* Relation nodes */}
            {filteredNodes.map(node => {
              const nodeColor = typeColors[node.type];

              return (
                <g key={node.id} onClick={() => onNodeClick?.(node.id)} className="cursor-pointer">
                  {/* Glow effect for "lit" nodes - 被点亮的小灯效果 */}
                  {node.status === 'lit' && (
                    <>
                      {/* 外层光晕 - 半径×1.6 */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size * 1.6}
                        fill="#F59E0B"
                        className="animate-halo-outer"
                        filter="url(#node-glow)"
                      />
                      {/* 内层光晕 - 半径×1.3 */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size * 1.3}
                        fill="#FBBF24"
                        className="animate-halo-inner"
                        filter="url(#node-glow)"
                      />
                    </>
                  )}

                  {/* Main node circle - 保持原有颜色不变 */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={nodeColor}
                    opacity={node.circle === 'dormant' ? 0.4 : 0.9}
                    className="transition-all hover:opacity-100"
                  />

                  {/* 核心光环 - 仅在被点亮时显示 */}
                  {node.status === 'lit' && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size}
                      fill="none"
                      stroke="#FCD34D"
                      strokeWidth="1"
                      className="animate-core-ring"
                    />
                  )}

                  {/* Activate indicator (red dot) */}
                  {node.status === 'activate' && (
                    <circle
                      cx={node.x + node.size * 0.7}
                      cy={node.y - node.size * 0.7}
                      r="4"
                      fill="#EF4444"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Name label */}
                  <text
                    x={node.x}
                    y={node.y + node.size + 16}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#0A0A0A"
                    fontFamily="'Inter', sans-serif"
                    fontWeight="600"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Circle Labels */}
          <div className="flex items-center justify-center gap-6 mt-4 text-[11px] text-[#6B6B70]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            <span>[核心圈]</span>
            <span>[潜力圈]</span>
            <span>[沉睡圈]</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-[#E8E8E5] rounded-lg p-4 text-center">
            <div className="text-[24px] text-[#10B981] mb-1" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>
              2
            </div>
            <div className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
              核心关系
            </div>
          </div>
          <div className="bg-white border border-[#E8E8E5] rounded-lg p-4 text-center">
            <div className="text-[24px] text-[#D97706] mb-1" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>
              1
            </div>
            <div className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
              被点亮
            </div>
          </div>
          <div className="bg-white border border-[#E8E8E5] rounded-lg p-4 text-center">
            <div className="text-[24px] text-[#2563EB] mb-1" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>
              1
            </div>
            <div className="text-[12px] text-[#6B6B70]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
              待激活
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar - Sticky */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-3 z-30">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`
              px-3 py-1.5 rounded-full text-[12px] shrink-0 transition-all
              ${selectedFilter === 'all'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70]'
              }
            `}
            style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}
          >
            全部
          </button>
          {Object.entries(typeLabels).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setSelectedFilter(type as RelationType)}
              className={`
                px-3 py-1.5 rounded-full text-[12px] shrink-0 transition-all flex items-center gap-1.5
                ${selectedFilter === type
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border border-[#E8E8E5] text-[#6B6B70] hover:border-[#6B6B70]'
                }
              `}
              style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedFilter === type ? 'white' : typeColors[type as RelationType] }}
              ></div>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E5] px-6 py-3 z-40">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => onTabChange?.('messages')} className="flex flex-col items-center gap-1 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <div className="text-[13px] flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ○ /messages
              <span className="text-[11px] text-[#A8A8AC]">[3]</span>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#2563EB]">
            <div className="text-[13px] flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ● /network
            </div>
          </button>
          <button onClick={() => onTabChange?.('me')} className="flex flex-col items-center gap-1 text-[#6B6B70] hover:text-[#0A0A0A] transition-colors">
            <div className="text-[13px]" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
              ○ /me
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        /* 核心光环 - 金黄色描边呼吸 */
        @keyframes core-ring {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-core-ring {
          animation: core-ring 2.4s ease-in-out infinite;
        }

        /* 内层光晕 - 淡黄色呼吸 */
        @keyframes halo-inner {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.08);
          }
        }

        .animate-halo-inner {
          animation: halo-inner 1.8s ease-in-out infinite;
          transform-origin: center center;
          transform-box: fill-box;
        }

        /* 外层光晕 - 淡黄色涟漪 */
        @keyframes halo-outer {
          0%, 100% {
            opacity: 0.08;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.08);
          }
        }

        .animate-halo-outer {
          animation: halo-outer 1.8s ease-in-out infinite;
          animation-delay: 0.2s;
          transform-origin: center center;
          transform-box: fill-box;
        }
      `}</style>
    </div>
  );
}
