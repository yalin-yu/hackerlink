import { useState } from 'react';

/**
 * SubRoleScreen — 选择细分角色
 *
 * 在 RoleSelectionScreen 之后出现。
 * 选项根据主角色不同而不同。
 *
 * [API] 选完后 subRole 值存入 state，最终在 POST /api/profiles 时发送。
 * F12 Network → 搜索 "profiles" 查看 sub_role 字段
 */

type SubRole = 'code' | 'product' | 'business' | 'investor' | 'consulting' | 'content' | 'corporate' | 'organizer';
type Role = 'builder' | 'backer' | 'organizer';

interface Option {
  id: SubRole;
  emoji: string;
  label: string;
  description: string;
}

// 每个主角色可见的细分选项
const OPTIONS_BY_ROLE: Record<Role, Option[]> = {
  builder: [
    { id: 'code', emoji: '💻', label: '技术选手', description: '全栈 / 算法 / 工程 / AI' },
    { id: 'product', emoji: '🎨', label: '产品选手', description: 'PM / 设计 / 用户研究' },
    { id: 'business', emoji: '🚀', label: '商业选手', description: '创业 / 增长 / 销售 / 融资' },
    { id: 'investor', emoji: '🔍', label: '投资背景', description: '看赛道 / 投项目 / 尽调' },
    { id: 'consulting', emoji: '📊', label: '咨询/财务', description: '商业分析 / 财务建模 / 战略' },
    { id: 'content', emoji: '✍️', label: '内容创作者', description: '叙事 / 品牌 / 社区运营' },
  ],
  backer: [
    { id: 'investor', emoji: '💰', label: '投资方', description: '看赛道 / 投项目 / 提供资金' },
    { id: 'corporate', emoji: '🏢', label: '企业赞助方', description: '资源 / 渠道 / 行业连接' },
    { id: 'business', emoji: '🚀', label: '商业操盘手', description: '创业经验 / 增长 / 市场判断' },
    { id: 'consulting', emoji: '📊', label: '顾问/导师', description: '战略咨询 / 技术评估 / 行业洞察' },
  ],
  organizer: [
    { id: 'organizer', emoji: '🎪', label: '主办方/组织者', description: '活动运营 / 社区管理 / 连接者' },
    { id: 'business', emoji: '🌐', label: '生态运营', description: '社区增长 / 品牌合作 / 资源整合' },
  ],
};

export default function SubRoleSelectionScreen({ role, onNext }: { role: Role; onNext: (subRole: SubRole) => void }) {
  const [selectedSubRole, setSelectedSubRole] = useState<SubRole | null>(null);
  const options = OPTIONS_BY_ROLE[role];

  return (
    <div className="size-full bg-[#FAFAF7] overflow-y-auto relative">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 px-6 py-8 pb-12 max-w-md mx-auto flex flex-col min-h-full">
        {/* Avatar + Status */}
        <div className="mb-8">
          <div className="w-10 h-10">
            <svg width="40" height="40" viewBox="0 0 120 120" className="breathing-avatar-small">
              <defs>
                <filter id="goo-sub">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </defs>
              <path
                d="M60,20 C75,18 88,25 95,40 C102,55 100,72 90,85 C80,98 65,103 50,100 C35,97 22,88 18,73 C14,58 20,42 32,30 C40,22 50,21 60,20 Z"
                fill="#2563EB"
                filter="url(#goo-sub)"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h1 className="text-[20px] leading-[1.4] text-[#0A0A0A] tracking-[-0.01em] mb-6" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            你更偏向哪一类？
          </h1>

          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedSubRole(opt.id)}
                className={`
                  p-5 rounded-lg text-left transition-all duration-200
                  ${selectedSubRole === opt.id
                    ? 'bg-[#2563EB]/5 border-2 border-[#2563EB] shadow-sm'
                    : 'bg-white border border-[#E8E8E5] hover:border-[#6B6B70]'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0">{opt.emoji}</div>
                  <div className="flex-1">
                    <div className="text-[16px] text-[#0A0A0A] mb-1.5" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                      {opt.label}
                    </div>
                    <div className="text-[13px] text-[#6B6B70] leading-[1.5]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                      {opt.description}
                    </div>
                  </div>
                  {selectedSubRole === opt.id && (
                    <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 animate-scale-in">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-auto pt-8">
          <button
            onClick={() => selectedSubRole && onNext(selectedSubRole)}
            disabled={!selectedSubRole}
            className={`
              w-full py-3.5 px-6 rounded-lg transition-all duration-150
              ${selectedSubRole
                ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af]'
                : 'bg-[#E8E8E5] text-[#A8A8AC] cursor-not-allowed'
              }
            `}
            style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600, fontSize: '16px' }}
          >
            下一题 →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes breathing-small {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .breathing-avatar-small { animation: breathing-small 3s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
