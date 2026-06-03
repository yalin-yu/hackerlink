import { useState } from 'react';

type Role = 'builder' | 'backer' | 'organizer';

export default function RoleSelectionScreen({ onNext }: { onNext: (role: Role) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const roles = [
    {
      id: 'builder' as Role,
      emoji: '👾',
      label: 'Builder 建设者',
      description: '参赛选手 / 独立开发 / 产品黑客'
    },
    {
      id: 'backer' as Role,
      emoji: '💰',
      label: 'Backer 支持者',
      description: '投资人 / 赞助方 / 导师 / 战略'
    },
    {
      id: 'organizer' as Role,
      emoji: '🎪',
      label: 'Organizer 组织者',
      description: '主办方 / 社区主理 / 生态负责'
    }
  ];

  return (
    <div className="size-full bg-[#FAFAF7] overflow-y-auto relative">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 px-6 py-8 pb-12 max-w-md mx-auto flex flex-col min-h-full">
        {/* Top - Small Avatar */}
        <div className="mb-8">
          <div className="w-10 h-10">
            <svg width="40" height="40" viewBox="0 0 120 120" className="breathing-avatar-small">
              <defs>
                <filter id="goo-small">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </defs>
              <path
                d="M60,20 C75,18 88,25 95,40 C102,55 100,72 90,85 C80,98 65,103 50,100 C35,97 22,88 18,73 C14,58 20,42 32,30 C40,22 50,21 60,20 Z"
                fill="#2563EB"
                filter="url(#goo-small)"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-8">
          <h1 className="text-[20px] leading-[1.4] text-[#0A0A0A] tracking-[-0.01em] mb-6" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            在这场活动里，你是谁？
          </h1>

          {/* Role Cards */}
          <div className="flex flex-col gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`
                  p-5 rounded-lg text-left transition-all duration-200
                  ${selectedRole === role.id
                    ? 'bg-[#2563EB]/5 border-2 border-[#2563EB] shadow-sm'
                    : 'bg-white border border-[#E8E8E5] hover:border-[#6B6B70]'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Emoji */}
                  <div className="text-4xl shrink-0">{role.emoji}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-[16px] text-[#0A0A0A] mb-1.5" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
                      {role.label}
                    </div>
                    <div className="text-[13px] text-[#6B6B70] leading-[1.5]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
                      {role.description}
                    </div>
                  </div>

                  {/* Checkmark */}
                  {selectedRole === role.id && (
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

        {/* Bottom - Next Button */}
        <div className="mt-auto pt-8">
          <button
            onClick={() => selectedRole && onNext(selectedRole)}
            disabled={!selectedRole}
            className={`
              w-full py-3.5 px-6 rounded-lg transition-all duration-150
              ${selectedRole
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
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .breathing-avatar-small {
          animation: breathing-small 3s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
