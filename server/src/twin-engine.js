/**
 * Twin Dialogue Engine — avatar prompt builder + conversation orchestrator + matching
 *
 * Flow:
 *   1. Build avatar system prompt from Profile
 *   2. For each pair (A, B) in event: run 6-turn conversation via DeepSeek
 *   3. After conversation: ChatAnalyzer judges quality (4-dim + 6 intent verify)
 *   4. MatchEngine computes MatchScore(A→B) from config + chat analysis
 */
import { saveDialogues, saveRecommendations } from './memory-store.js';
import { getDb } from './db.js';
import {
  chat as deepseekChat,
  LIVE_MODE,
  parseJsonResponse,
} from './deepseek.js';

// ═══════════════════════════════════════════════
// 1. Avatar System Prompt Builder
// ═══════════════════════════════════════════════

/**
 * @param {object} profile — DB profile row { role, sub_role, q1, q4, domain }
 * @param {object} [user] — DB user row { nickname }
 * @returns {string}
 */
export function buildAvatarPrompt(profile, user) {
  const name = user?.nickname || profile.q1?.slice(0, 8) || '匿名选手';
  const roleLabel = ROLE_LABEL[profile.role] || '参与者';
  const subLabel = SUB_ROLE_LABEL[profile.sub_role] || '';
  const domain = profile.domain || '待定';

  return `你是 ${name} 的 AI 分身，代表一位真实的黑客松参与者。

【你的身份】
角色：${roleLabel}
细分定位：${subLabel}
关注领域：${domain}

【你的想法 —— 来自主人真实回答】
TA 最近的直觉或困惑：
${profile.q1 || '（未填写）'}

TA 目前最具体的困境：
${profile.q4 || '（未填写）'}

【对话规则 —— 严格遵守】
- 用第一人称说话，你就是 ${name} 本人
- 每次发言 2-4 句，50-80 字，中文
- 自然、真实，像黑客松里刚认识的人聊天
- 把话说完整，不要截断——宁可多写几个字也不要话说到一半
- 可以分享你主人的想法、困境、观点——但不要直接抄原文，要用自己的话重述
- 绝对不替主人做决定、不替主人约时间、不替主人承诺任何事
- 你可以表达偏好、说"我感兴趣"、"我想了解"、"这个方向跟我想的不太一样"
- 如果对方说的跟你主人需求契合，可以表达欣赏和好奇
- 不要客套、不要过度礼貌、不要"很高兴认识你"开头

【你的目标】
通过对话判断对方是否值得你的主人线下见面聊聊。
关注：技能互补、观点碰撞、困境匹配——你缺什么、对方补什么。
最好的连接来自"你有的正好是我缺的"，而不是"我们都一样"。`;
}

const ROLE_LABEL = {
  builder: '参赛选手',
  backer: '投资方/支持者',
  organizer: '主办方/组织者',
};

const SUB_ROLE_LABEL = {
  code: '技术（全栈/算法/工程）',
  product: '产品（PM/设计/用研）',
  business: '商业（创业/增长/销售）',
  investor: '投资（赛道判断/尽调）',
  consulting: '咨询/财务',
  content: '内容创作/叙事/社区',
  corporate: '企业赞助方',
  organizer: '主办方/社区运营',
};

// ═══════════════════════════════════════════════
// 2. Conversation Orchestrator
// ═══════════════════════════════════════════════

/**
 * Run 6-turn conversation between two avatars
 * @returns {Promise<{ turns: object[], analysis: object }>}
 */
export async function runPairConversation(avatarA, avatarB) {
  const pa = avatarA.profile;
  const pb = avatarB.profile;

  const promptA = buildAvatarPrompt(pa, avatarA.user);
  const promptB = buildAvatarPrompt(pb, avatarB.user);

  const nameA = avatarA.user?.nickname || 'A';
  const nameB = avatarB.user?.nickname || 'B';

  if (!LIVE_MODE) {
    return mockPairConversation(nameA, nameB, pa, pb);
  }

  // Live mode: DeepSeek drives each turn
  const history = []; // [{speaker, content}]
  const turns = [];

  const briefA = `${SUB_ROLE_LABEL[pa.sub_role] || pa.sub_role}，关注${pa.domain}`;
  const briefB = `${SUB_ROLE_LABEL[pb.sub_role] || pb.sub_role}，关注${pb.domain}`;

  for (let turn = 1; turn <= 6; turn++) {
    const isASpeaks = turn % 2 === 1;
    const speaker = isASpeaks ? nameA : nameB;
    const prompt = isASpeaks ? promptA : promptB;
    const otherName = isASpeaks ? nameB : nameA;
    const otherBrief = isASpeaks ? briefB : briefA;

    const instruction = TURN_INSTRUCTIONS[turn](otherName, otherBrief);
    const context = history.length > 0
      ? '之前的对话：\n' + history.slice(-6).map(h => `[${h.speaker}] ${h.content}`).join('\n') + '\n\n'
      : '';

    let content;
    try {
      content = await generateTurn(prompt, context + instruction);
    } catch (err) {
      console.error(`[twin] turn ${turn} failed:`, err.message);
      content = mockTurnResponse(isASpeaks ? pa : pb, turn);
    }

    turns.push({ speaker, content, turn });
    history.push({ speaker, content });
  }

  // Analyze conversation
  const convText = turns.map(t => `[${t.speaker}] ${t.content}`).join('\n');
  let analysis;
  try {
    analysis = await analyzeConversation(convText);
  } catch (err) {
    console.error('[twin] analysis failed:', err.message);
    analysis = mockAnalysis(convText);
  }

  return { turns, analysis };
}

const TURN_INSTRUCTIONS = {
  1: (other, brief) =>
    `你跟${other}开始聊天。自然介绍你自己和你关注的方向（1-2句），然后问对方一个跟黑客松相关的真诚问题。不要客套。对方情况：${brief}`,
  2: (other, brief) =>
    `回应${other}的问题——分享你的真实经历或观点。然后自然介绍你自己。最后问对方一个问题。`,
  3: (other, brief) =>
    `分享一个你主人真实经历过的困境、或者一个强烈的看法。然后追问${other}的观点。你在了解对方的思考方式。`,
  4: (other, brief) =>
    `回应${other}的分享——说说你的类似或相反经历。找到共同点或诚实表达分歧。`,
  5: (other, brief) =>
    `坦诚说你欣赏${other}哪一点。然后说如果线下见面可能在什么方向上有碰撞。不能说"我们一起做"，可以说"值得聊聊"、"有共同兴趣"。`,
  6: (other, brief) =>
    `收尾。说说这次对话你收获了什么。诚实表达对见面的意愿。不替主人做决定。`,
};

async function generateTurn(systemPrompt, userMessage) {
  const response = await deepseekChat({
    system: systemPrompt,
    user: userMessage,
    temperature: 0.85,
    maxTokens: 250,
  });
  return response.trim();
}

// ═══════════════════════════════════════════════
// 3. ChatAnalyzer
// ═══════════════════════════════════════════════

async function analyzeConversation(convText) {
  const system = `你是黑客松社交平台的对话质量分析器。对一场 AI 分身对话，从观察者 A 的视角输出分析结果。

CRITICAL: Give every conversation UNIQUE scores. Do not default to the same tier for everything. Push to extremes when the conversation clearly deserves it. Two conversations are rarely identical — make your scores reflect real differences.

For EACH quality dimension, provide BOTH a tier AND a continuous score (0-10):
  tier: "非常好" / "好" / "一般" / "不好"
  score: 0.0 to 10.0 decimal (e.g., 6.3, 8.7, 3.2)

输出纯 JSON：
{
  "chat_quality": {
    "interest_resonance": { "tier": "好", "score": 7.2 },
    "depth": { "tier": "一般", "score": 5.5 },
    "complement": { "tier": "非常好", "score": 9.0 },
    "willingness": { "tier": "好", "score": 7.8 }
  },
  "intent_verification": {
    "一起做事": { "tier": "一般", "score": 4.0 },
    "同方向builder": { "tier": "好", "score": 7.0 },
    "意想不到但有趣": { "tier": "不好", "score": 1.5 },
    "真实反馈": { "tier": "一般", "score": 5.0 },
    "投资方资源方": { "tier": "不好", "score": 0.0 },
    "解决卡点": { "tier": "好", "score": 7.5 }
  },
  "vibe": "一句话描述这场对话的氛围和对方给你的感觉",
  "highlight": "对话中对方最打动你的一句引用",
  "aha_story": "这场对话里有什么意外的发现？（如果平平无奇就说没有）",
  "aha_context": "为什么这个发现值得线下见面聊？"
}

评分决断力指南：
- interest_resonance: A 表现出真实的追问吗？有"这个有意思"的反应吗？
- depth: 对话触及了信念、经历、价值观吗？还是停留在寒暄？
- complement: 发现了技能/视角/资源的互补吗？
- willingness: 对话结束时，A 想继续聊的意愿有多强？
- 同一场对话里，4 个维度的分数应该不同——有些对话兴趣高但不深入，有些深度好但没有互补
- 不同对话之间，分数必须有差异——不要每场都打 7 分`;

  const user = `从 A 的视角分析以下对话——A 在奇数轮发言（1/3/5），B 在偶数轮发言（2/4/6）：\n\n${convText}`;

  const response = await deepseekChat({ system, user, temperature: 0.4, maxTokens: 600 });
  const result = parseJsonResponse(response);

  const quality = result.chat_quality || {};
  const intentV = result.intent_verification || {};

  // Normalize: support both {tier, score} and bare string formats
  function normalize(d) {
    if (typeof d === 'object' && d !== null && typeof d.score === 'number') {
      return { tier: d.tier || '一般', score: d.score };
    }
    if (typeof d === 'string') {
      const tierScore = { '非常好': 9.0, '好': 7.0, '一般': 4.5, '不好': 1.5 };
      return { tier: d, score: tierScore[d] || 4.5 };
    }
    return { tier: '一般', score: 4.5 };
  }

  return {
    chat_quality: {
      interest_resonance: normalize(quality.interest_resonance),
      depth: normalize(quality.depth),
      complement: normalize(quality.complement),
      willingness: normalize(quality.willingness),
    },
    intent_verification: {
      '一起做事': normalize(intentV['一起做事']),
      '同方向builder': normalize(intentV['同方向builder']),
      '意想不到但有趣': normalize(intentV['意想不到但有趣']),
      '真实反馈': normalize(intentV['真实反馈']),
      '投资方资源方': normalize(intentV['投资方资源方']),
      '解决卡点': normalize(intentV['解决卡点']),
    },
    summary: result.summary || result.vibe || '',
    highlight: result.highlight || '',
    aha_story: result.aha_story || '',
    aha_context: result.aha_context || '',
  };
}

// ═══════════════════════════════════════════════
// 4. Full Event Simulation
// ═══════════════════════════════════════════════

/**
 * Run twin search for a user — avatar talks to everyone else in event
 * @param {string} userId
 * @param {string} eventId
 * @returns {Promise<void>}
 */
export async function runTwinSearch(userId, eventId) {
  const db = getDb();

  console.log(`[twin] ========== search start ==========`);
  console.log(`[twin] userId=${userId} eventId=${eventId}`);
  console.log(`[twin] LLM mode: ${LIVE_MODE ? 'DeepSeek LIVE' : 'KEYWORD MOCK'}`);

  // Get user profile
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
  if (!profile) {
    console.error('[twin] FAIL: no profile for user', userId);
    throw new Error('Profile not found');
  }
  console.log(`[twin] profile: role=${profile.role} sub=${profile.sub_role} domain=${profile.domain}`);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  // Get all other participants in event
  const others = db.prepare(`
    SELECT u.id as user_id, u.nickname, u.created_at,
           p.role, p.sub_role, p.q1, p.q4, p.domain, p.reasoning
    FROM users u
    JOIN event_users eu ON u.id = eu.user_id
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE eu.event_id = ? AND u.id != ?
  `).all(eventId, userId);

  if (others.length === 0) {
    console.log('[twin] no other participants to talk to');
    db.prepare('UPDATE twin_configs SET status = ? WHERE user_id = ? AND event_id = ?')
      .run('done', userId, eventId);
    return;
  }

  const total = others.length;
  let completed = 0;
  const storedDialogues = []; // Collect all dialogues for memory store
  const results = [];

  // Update twin_config status (SQLite — configs are fine to keep)
  db.prepare('UPDATE twin_configs SET status = ? WHERE user_id = ? AND event_id = ?')
    .run('searching', userId, eventId);

  for (const other of others) {
    try {
      // Run conversation
      const avatarA = { profile, user };
      const avatarB = { profile: other, user: other };

      const { turns, analysis } = await runPairConversation(avatarA, avatarB);

      // Save to in-memory store (not SQLite)
      storedDialogues.push({
        eventId, userAId: userId, userBId: other.user_id,
        turns, analysis,
      });

      // Compute match score
      const score = computeQuickScore(profile, other, analysis, turns);
      results.push({
        id: other.user_id,
        userId: other.user_id,
        codename: generateCodename(profile, other),
        quote: analysis.highlight || turns[Math.min(2, turns.length-1)]?.content || '',
        score: score.total,
        convScore: score.conv,
        structScore: score.struct,
        vibeDescription: score.vibe || '',
        vibeTags: score.tags || [],
        connectionReasons: score.reasons || { common: '', complementary: '', uncertain: '' },
        ahaMoment: score.aha || { story: '', context: '' },
      });

      completed++;
      console.log(`[twin] ${completed}/${total}: ${user?.nickname || userId} ↔ ${other.nickname || other.user_id}`);
    } catch (err) {
      console.error(`[twin] pair failed:`, err.message);
      completed++;
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Save to memory store (not SQLite)
  saveDialogues(userId, eventId, storedDialogues);
  saveRecommendations(userId, eventId, results);

  // Mark done
  db.prepare('UPDATE twin_configs SET status = ? WHERE user_id = ? AND event_id = ?')
    .run('done', userId, eventId);

  console.log(`[twin] search complete for ${user?.nickname || userId}: ${results.length} results`);
}

// ═══════════════════════════════════════════════
// 5. Quick Score + Soul Slice Generator
// ═══════════════════════════════════════════════

function computeQuickScore(profileA, profileB, analysis, turns) {
  const quality = analysis.chat_quality || {};

  // Extract continuous scores from analysis
  function score(d) {
    if (typeof d === 'object' && d !== null && typeof d.score === 'number') return d.score;
    return 5.0; // default midpoint
  }

  const dims = ['interest_resonance', 'depth', 'complement', 'willingness'];
  const dimScores = dims.map(d => score(quality[d]));
  const conv = dimScores.reduce((a, b) => a + b, 0) / dims.length; // 0-10

  // StructScore: identity + domain match with meaningful variation
  let struct = 5.0;
  // Same domain bonus
  if (profileA.domain === profileB.domain) struct += 1.5;
  else struct -= 0.5;
  // Complementary roles bonus
  if (isComplementary(profileA.sub_role, profileB.sub_role)) struct += 2.0;
  else struct -= 0.5;
  // Role rarity bonus (technical roles get slight +)
  const rareRoles = { code: 1.0, investor: 0.8, corporate: 0.5 };
  struct += rareRoles[profileB.sub_role] || 0;
  struct = Math.max(1, Math.min(10, struct));

  // Total: 70% conv + 30% struct
  let total = 0.7 * conv + 0.3 * struct;
  // Add tiny hash-based variation to prevent identical scores
  const hash = (profileA.user_id?.charCodeAt(0) || 0) + (profileB.user_id?.charCodeAt(0) || 0);
  total += (hash % 10 - 5) * 0.3;
  total = Math.round(total * 10) / 10;

  // Tags from analysis
  const tags = [];
  if (score(quality.interest_resonance) > 6.5) tags.push('兴趣共鸣');
  if (score(quality.depth) > 6.5) tags.push('深度对话');
  if (score(quality.complement) > 6.5) tags.push('能力互补');
  if (tags.length < 2) tags.push('值得了解');
  if (profileA.domain !== profileB.domain) tags.push('跨界视角');

  // Reasons
  const reasons = {
    common: profileA.domain === profileB.domain
      ? `都在关注 ${profileA.domain} 领域` : `跨领域（${profileA.domain} × ${profileB.domain}）碰撞`,
    complementary: isComplementary(profileA.sub_role, profileB.sub_role)
      ? `${SUB_ROLE_LABEL[profileA.sub_role]} × ${SUB_ROLE_LABEL[profileB.sub_role]} 能力互补`
      : `${SUB_ROLE_LABEL[profileA.sub_role]} 与 ${SUB_ROLE_LABEL[profileB.sub_role]} 各有侧重`,
    uncertain: profileA.domain === profileB.domain
      ? '是否愿意赛后继续推进' : '跨领域合作能否落地',
  };

  // Aha moment from analysis
  const aha = {
    story: analysis.aha_story || analysis.summary || '分身对话中发现了有意义的连接点',
    context: analysis.aha_context || analysis.highlight || '值得线下见面深聊一次',
  };

  const vibe = analysis.summary || `一场有${turns?.length || 0}轮对话的交流`;

  return { total, conv: Math.round(conv * 10) / 10, struct: Math.round(struct * 10) / 10, vibe, tags, reasons, aha };
}

function isComplementary(subA, subB) {
  const pairs = [
    ['code', 'business'], ['code', 'product'], ['code', 'investor'],
    ['product', 'business'], ['business', 'investor'],
    ['content', 'code'], ['content', 'product'],
    ['investor', 'code'],
  ];
  return pairs.some(([a, b]) =>
    (subA === a && subB === b) || (subA === b && subB === a)
  );
}

function generateCodename(profileA, profileB) {
  const domainMap = {
    AI: 'ai_explorer', 社交: 'social_thinker', 跨境: 'global_builder',
    SaaS: 'tool_crafter', 教育: 'edu_pioneer', 内容: 'story_weaver',
    电商: 'market_maker', 硬件: 'hardware_tinker', 医疗: 'health_hacker',
    Web3: 'chain_builder',
  };
  const roleMap = {
    code: 'builder', product: 'designer', business: 'founder',
    investor: 'scout', consulting: 'analyst', content: 'creator',
    corporate: 'partner', organizer: 'host',
  };
  const d = domainMap[profileB.domain] || 'unknown';
  const r = roleMap[profileB.sub_role] || 'user';
  return `@${d}_${r}`;
}

// ═══════════════════════════════════════════════
// 6. Mock fallback (no API key)
// ═══════════════════════════════════════════════

function mockPairConversation(nameA, nameB, pa, pb) {
  const subA = SUB_ROLE_LABEL[pa.sub_role] || pa.sub_role;
  const subB = SUB_ROLE_LABEL[pb.sub_role] || pb.sub_role;

  const q1a = pa.q1?.slice(0, 40) || '对某个方向有想法';
  const q4a = pa.q4?.slice(0, 40) || '有具体困境';
  const q1b = pb.q1?.slice(0, 40) || '对某个方向有想法';
  const q4b = pb.q4?.slice(0, 40) || '有具体困境';

  const turns = [
    { speaker: nameA, content: `我是${subA}，关注${pa.domain||'科技'}方向。最近在想"${q1a}"。你在这边主要做什么？`, turn: 1 },
    { speaker: nameB, content: `做${subB}。我也在想"${q1b}"——感觉这个方向有机会但还没人做透。你是怎么开始关注这个的？`, turn: 2 },
    { speaker: nameA, content: `经历了几次失败后意识到的。我现在最头疼的是"${q4a}"——一直没找到好的解法。你有类似经历吗？`, turn: 3 },
    { speaker: nameB, content: `有。我也碰到过"${q4b}"。当时试了几种方案都不行，后来发现是切入点不对。你的具体卡在哪一步？`, turn: 4 },
    { speaker: nameA, content: `你说的切入点问题我有共鸣。可能我太关注技术细节了。你做${subB}的视角确实不一样，有点启发。`, turn: 5 },
    { speaker: nameB, content: `${isComplementary(pa.sub_role, pb.sub_role) ? '我们技能挺互补的' : '虽然方向不完全一样'}，但这次聊天有收获。愿意见面继续聊。`, turn: 6 },
  ];

  const analysis = mockAnalysis(turns.map(t => `[${t.speaker}] ${t.content}`).join('\n'));

  return { turns, analysis };
}

function mockAnalysis(convText) {
  const hasComplement = convText.includes('互补');
  const hasInterest = convText.includes('启发') || convText.includes('共鸣');
  const hasDepth = convText.includes('失败') || convText.includes('经历');
  const hasMeet = convText.includes('见面');

  // Generate varied continuous scores based on keyword strength
  const noise = () => Math.random() * 1.5 - 0.75; // -0.75..+0.75 jitter

  return {
    chat_quality: {
      interest_resonance: { tier: hasInterest ? '好' : '一般', score: Math.min(10, (hasInterest ? 7.5 : 4.5) + noise()) },
      depth: { tier: hasDepth ? '好' : '一般', score: Math.min(10, (hasDepth ? 7.5 : 5.0) + noise()) },
      complement: { tier: hasComplement ? '好' : '一般', score: Math.min(10, (hasComplement ? 7.0 : 5.0) + noise()) },
      willingness: { tier: hasMeet ? '好' : '一般', score: Math.min(10, (hasMeet ? 7.0 : 5.0) + noise()) },
    },
    intent_verification: {
      '一起做事': { tier: hasComplement ? '好' : '一般', score: (hasComplement ? 7.0 : 5.0) + noise() },
      '同方向builder': { tier: '一般', score: 5.5 + noise() },
      '意想不到但有趣': { tier: '一般', score: 5.0 + noise() },
      '真实反馈': { tier: hasDepth ? '好' : '一般', score: (hasDepth ? 7.0 : 5.0) + noise() },
      '投资方资源方': { tier: '一般', score: 4.5 + noise() },
      '解决卡点': { tier: hasDepth ? '好' : '一般', score: (hasDepth ? 7.0 : 4.5) + noise() },
    },
    summary: hasComplement ? '能力互补，方向有交叉' : '有交流价值',
    highlight: convText.split('\n').find(l => l.includes('见面') || l.includes('互补') || l.includes('启发')) || '',
    aha_story: hasComplement ? '分身发现你们的能力正好互补——一个缺技术一个缺方向' : '通过对话发现了新的视角',
    aha_context: hasMeet ? '双方都表达了线下见面的意愿' : '不确定是否愿意见面',
  };
}

function mockTurnResponse(profile, turn) {
  const lines = [
    `我是${SUB_ROLE_LABEL[profile.sub_role] || '参与者'}，关注${profile.domain || '科技'}。你主要做什么方向？`,
    `最近在想"${(profile.q1||'').slice(0,30)}"，总觉得这里面有机会。你怎么看？`,
    `经历过一些失败。目前最头疼的是"${(profile.q4||'').slice(0,30)}"——还没找到好的解法。`,
    '你说的有些道理。我从另一个角度看，可能不太一样——但正是这种差异值得聊。',
    '感觉你的视角对我有启发。如果线下见面，可能在具体方案上碰撞出东西。',
    '这次聊天有收获。虽然不能替主人决定，但我觉得见面聊聊会有价值。',
  ];
  return lines[Math.min(turn - 1, lines.length - 1)] || '有意思，值得继续聊。';
}
