# 完整 Mock 数据整理

## 1. 找人初筛选项数据 (ExploreModal)

```typescript
const exploreCards = [
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
```

## 2. 找到的9个人完整数据 (SoulSliceGrid + SoulSliceDetailExpanded)

```typescript
const soulsData = [
  {
    id: 1,
    avatar: 1,
    codename: '@product_skeptic_23',
    quote: "相信工具应该为 builder 服务,\n讨厌花架子",
    score: 92,
    // 三层展开数据
    vibeDescription: "TA 不是很会主动社交，但可能真的做了东西。",
    vibeTags: ["慢热Builder", "真实项目导向", "不爱泛聊"],
    connectionReasons: {
      common: "你们都关注 Agent Memory",
      complementary: "TA 偏 AI Infra，你偏产品 Workflow",
      uncertain: "TA 目前是否愿意赛后继续推进"
    },
    ahaMoment: {
      story: "你们其实已经在三场活动里擦肩而过了，但从没真正聊过。",
      context: "这次 TA 正在找一个能帮他判断产品方向的人。你最近也在寻找真实项目合作机会。"
    }
  },
  {
    id: 2,
    avatar: 2,
    codename: '@deep_listener_07',
    quote: "在 voice agent 延迟问题上\n死磕了 3 个月",
    score: 88,
    vibeDescription: "技术极客，对细节有极致追求，喜欢深度讨论而非表面交流。",
    vibeTags: ["技术深挖", "延迟优化狂", "细节控"],
    connectionReasons: {
      common: "都在做 Voice Agent 相关项目",
      complementary: "TA 专注底层优化，你关注用户体验",
      uncertain: "TA 的技术方案是否开源"
    },
    ahaMoment: {
      story: "TA 在社区发过一篇关于 VAD 前置的技术文章，你当时收藏了但没留言。",
      context: "这次 TA 想找人一起验证方案在真实场景的效果。你正好有用户场景可以测试。"
    }
  },
  {
    id: 3,
    avatar: 3,
    codename: '@fine_tune_rebel_11',
    quote: "认为 AI 陪伴需要长期记忆,\n不是无止境聊天",
    score: 85,
    vibeDescription: "有独立思考能力，不跟风主流，愿意为反共识观点花时间验证。",
    vibeTags: ["反共识思考", "长期主义", "记忆架构"],
    connectionReasons: {
      common: "都在思考 AI 产品的长期价值",
      complementary: "TA 偏技术实现，你偏产品设计",
      uncertain: "TA 是否有时间投入合作项目"
    },
    ahaMoment: {
      story: "你们在同一个 Discord 群潜水了半年，都没说过话。",
      context: "TA 最近在找懂产品的人帮忙设计记忆交互。你正好在研究类似问题。"
    }
  },
  {
    id: 4,
    avatar: 4,
    codename: '@demo_runner_88',
    quote: "做过的 demo 都跑通了,\n不画饼",
    score: 83,
    vibeDescription: "行动派，不空谈理论，每个想法都会快速做 MVP 验证。",
    vibeTags: ["快速验证", "执行力强", "不画饼"],
    connectionReasons: {
      common: "都相信快速迭代的重要性",
      complementary: "TA 擅长技术实现，你擅长方向判断",
      uncertain: "TA 的项目是否有商业化打算"
    },
    ahaMoment: {
      story: "TA 的 GitHub 上有个项目和你的想法 90% 重合，但你们互不知情。",
      context: "TA 想找人一起把 demo 做成产品。你正好在找靠谱的技术合伙人。"
    }
  },
  {
    id: 5,
    avatar: 5,
    codename: '@dialect_hacker_42',
    quote: "对蓝领招聘场景的方言识别\n有原创方案",
    score: 80,
    vibeDescription: "关注下沉市场和真实场景，不追热点，找到细分问题深挖。",
    vibeTags: ["下沉场景", "方言识别", "垂直深挖"],
    connectionReasons: {
      common: "都关注 AI 在非主流场景的应用",
      complementary: "TA 有技术方案，你有场景洞察",
      uncertain: "TA 是否愿意分享数据集"
    },
    ahaMoment: {
      story: "你曾在一个调研中提到蓝领招聘痛点，TA 看到了但没联系你。",
      context: "TA 的技术方案需要真实场景验证。你有渠道可以接触目标用户。"
    }
  },
  {
    id: 6,
    avatar: 6,
    codename: '@retention_critic_09',
    quote: "在 character.ai 工作过,\n看穿了它的留存陷阱",
    score: 78,
    vibeDescription: "有大厂经验，对增长黑客和产品套路有深刻理解和批判性思考。",
    vibeTags: ["前大厂", "增长洞察", "批判性思维"],
    connectionReasons: {
      common: "都在思考 AI 产品的可持续性",
      complementary: "TA 懂增长，你懂产品",
      uncertain: "TA 是否还在原公司"
    },
    ahaMoment: {
      story: "TA 在一个播客里提到的观点，正好是你一直想验证的假设。",
      context: "TA 想做一个反套路的 AI 产品。你正好厌倦了主流产品的同质化。"
    }
  },
  {
    id: 7,
    avatar: 7,
    codename: '@cursor_visionary_31',
    quote: "认为 Cursor 的 multi-file edit\n还远未到极限",
    score: 76,
    vibeDescription: "对工具型产品有极致追求，相信好工具能改变工作方式。",
    vibeTags: ["工具控", "效率极客", "开发体验"],
    connectionReasons: {
      common: "都在做开发者工具相关项目",
      complementary: "TA 关注编辑体验，你关注协作流程",
      uncertain: "TA 的项目是否开源"
    },
    ahaMoment: {
      story: "你们都在 Cursor 的 Discord 里活跃，但从没私聊过。",
      context: "TA 想找人一起做下一代代码编辑器。你有相关产品经验。"
    }
  },
  {
    id: 8,
    avatar: 8,
    codename: '@small_model_rebel_55',
    quote: "在 fine-tune 小模型方面\n有反共识的判断",
    score: 73,
    vibeDescription: "相信小模型在特定场景的价值，不盲目追求大参数量。",
    vibeTags: ["小模型", "场景优化", "反大模型潮流"],
    connectionReasons: {
      common: "都关注 AI 的实际落地成本",
      complementary: "TA 有技术方案，你有成本敏感场景",
      uncertain: "TA 的方案是否已经验证"
    },
    ahaMoment: {
      story: "TA 写过一篇小模型优化的技术博客，你在朋友圈转发过但没细看。",
      context: "TA 想找真实业务场景测试小模型方案。你的项目预算有限，正好需要低成本方案。"
    }
  },
  {
    id: 9,
    avatar: 9,
    codename: '@real_problem_only_77',
    quote: "讨厌交换名片,\n只愿意为真问题花时间",
    score: 71,
    vibeDescription: "时间宝贵，只对真实问题感兴趣，讨厌形式化社交。",
    vibeTags: ["问题导向", "高效沟通", "反社交套路"],
    connectionReasons: {
      common: "都不喜欢浪费时间在无效社交上",
      complementary: "TA 有明确问题需要解决，你有相关经验",
      uncertain: "TA 是否愿意分享具体问题细节"
    },
    ahaMoment: {
      story: "你在一个论坛回答过一个问题，TA 默默点赞收藏了，但没回复。",
      context: "TA 现在遇到类似问题卡住了。你正好有解决方案可以分享。"
    }
  }
];
```

## 3. 聊天记录数据 (MessagesTab)

```typescript
const conversationsData = [
  {
    id: 1,
    avatar: 1,
    codename: '@deep_listener_07',
    vibeQuote: '在 voice agent 延迟优化上有反共识方案',
    latestMessage: '我看你也对 VAD 前置的方案感兴趣...',
    timestamp: '2m',
    dotColor: 'bg-[#2563EB]',
    unread: 2
  },
  {
    id: 2,
    avatar: 2,
    codename: '@product_skeptic_23',
    vibeQuote: '相信工具应该为 builder 服务,讨厌花架子',
    latestMessage: '你说的那个蓝领招聘场景确实有意思',
    timestamp: '5m',
    dotColor: 'bg-[#D97706]',
    unread: 0
  },
  {
    id: 3,
    avatar: 3,
    codename: '@fine_tune_rebel_11',
    vibeQuote: '在 fine-tune 小模型方面有反共识的判断',
    latestMessage: '我觉得大家都低估了小模型的潜力',
    timestamp: '12m',
    dotColor: 'bg-[#8B7DB8]',
    unread: 1
  },
  // ... 继续到 id: 9
];
```

## 4. Onboarding 角色和问题数据

```typescript
// 角色选择
const roles = [
  {
    id: 'builder',
    emoji: '👾',
    label: 'Builder 建设者',
    description: '参赛选手 / 独立开发 / 产品黑客'
  },
  {
    id: 'backer',
    emoji: '💰',
    label: 'Backer 支持者',
    description: '投资人 / 赞助方 / 导师 / 战略'
  },
  {
    id: 'organizer',
    emoji: '🎪',
    label: 'Organizer 组织者',
    description: '主办方 / 社区主理 / 生态负责'
  }
];

// 方向选择的Tab
const directionTabs = [
  '想法 / Demo / 方向',
  '搭档 / 资金 / 渠道',
  '趋势 / 判断 / 壁垒',
  '卡点 / 瓶颈 / 死胡同'
];

// 角色对应的placeholder
const placeholders = {
  builder: {
    question1: '用一句话说说你最近的直觉或困惑：\n\n大家都在卷应用层，但我感觉底层基建才是真机会，一直没找到人聊透',
    question4: '你目前最具体的困境是什么？\n\nDemo能跑了，但卡在真实场景用户不用，不知道是切错痛点还是交互太重'
  },
  backer: {
    question1: '用一句话说说你最近的直觉或困惑：\n\n看了几十个套壳项目，想找真正在底层做事的团队，聊聊壁垒到底在哪',
    question4: '你目前最具体的困境是什么？\n\n模式看着都不错，但卡在团队没商业化经验，不确定他们能不能把东西卖出去'
  },
  organizer: {
    question1: '用一句话说说你最近的直觉或困惑：\n\n想把做基建和做应用的两组人连起来，但缺一个能把两边语言对齐的切入点',
    question4: '你目前最具体的困境是什么？\n\n参赛项目方向很散，卡在怎么把对的人组到一桌，怕活动变成了自嗨'
  }
};
```

## 5. 卡片状态定义

```typescript
type ExpandLevel = 0 | 1 | 2 | 3;
type ActionStatus = 'none' | 'interested' | 'skipped';

// 0: 未展开 - 只看到简要 vibe
// 1: 已看 Vibe - 展开第一层（性格描述+标签）
// 2: 已看连接理由 - 展开第二层（共同点/互补点/不确定点）
// 3: 已看 Aha Moment - 展开第三层（深层故事+行动按钮）
```

## 6. 交互流程

1. **网格视图** (SoulSliceGrid)
   - 显示9个人的卡片
   - 点击任意卡片 → 打开详情模态

2. **详情模态** (SoulSliceDetailExpanded)
   - Layer 0: 显示"点击查看 TA 的 Vibe"按钮
   - Layer 1: 展开 Vibe 层（性格+标签）+ "继续了解连接理由"按钮
   - Layer 2: 展开连接理由层（共同点/互补点/不确定点）+ "查看 Aha Moment"按钮
   - Layer 3: 展开 Aha Moment 层（故事+上下文）+ 三个行动按钮
     - 想聊聊（主按钮）
     - 先跳过（次按钮）
     - 让 Agent 再问一句（次按钮）

3. **行动后**
   - 点击"想聊聊" → 关闭模态，标记为感兴趣
   - 点击"先跳过" → 关闭模态，标记为跳过
   - 点击"让 Agent 再问一句" → 触发 Agent 交互（待实现）
