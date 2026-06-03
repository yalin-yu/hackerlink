// DeepSeek API client — zero dependencies, Node built-in fetch
const API_KEY = process.env.DEEPSEEK_API_KEY || '';
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
// For mock mode: set DEEPSEEK_API_KEY="" to skip real API calls
export const LIVE_MODE = !!API_KEY;

/**
 * @param {object} options
 * @param {string} options.system
 * @param {string} options.user
 * @param {number} [options.temperature=0.3]
 * @param {number} [options.maxTokens=200]
 * @returns {Promise<string>}
 */
export async function chat({ system, user, temperature = 0.3, maxTokens = 200 }) {
  if (!LIVE_MODE) {
    throw new Error('DEEPSEEK_API_KEY not set');
  }

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepSeek API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

/**
 * Extract domain from onboarding Q&A
 * @param {{ q1: string, q4: string }} answers
 * @returns {Promise<{ domain: string, reasoning: string }>}
 */
export async function extractDomain({ q1, q4 }) {
  if (!LIVE_MODE) {
    // Mock fallback — basic keyword matching
    return mockExtractDomain({ q1, q4 });
  }

  const system = `你是黑客松社交平台的用户画像提取器。根据用户两句自由回答，推断其所在领域。

## 输出
纯 JSON，不要任何其他文字：
{"domain": "...", "reasoning": "..."}

## domain 可选值（10个）
AI、社交、电商、SaaS、Web3、教育、硬件、内容、跨境、医疗

## 判断规则
- 提到 agent/LLM/大模型/机器学习/NLP/深度学习/语音 → AI
- 提到社交媒体/社区/用户增长/匹配/撮合/人脉 → 社交
- 提到跨境/出海/东南亚/海外市场/全球化 → 跨境
- 提到 SaaS/企业服务/B2B/生产力工具/开发者工具 → SaaS
- 提到电商/交易/供应链/卖货/平台 → 电商
- 提到区块链/加密货币/DeFi/NFT/去中心化 → Web3
- 提到教育/学习/培训/知识/教学 → 教育
- 提到硬件/IoT/机器人/设备/芯片 → 硬件
- 提到内容/创作/短视频/直播/播客/写作 → 内容
- 提到医疗/健康/制药/诊断 → 医疗
- 如果都不匹配，选最接近的。

reasoning: 一句话解释判断依据。`;

  const user = `Q1（最近的直觉或困惑）：${q1}\nQ4（目前最具体的困境）：${q4}`;

  const response = await chat({ system, user, temperature: 0.1, maxTokens: 100 });
  return parseDomainResponse(response);
}

/**
 * Keyword fallback — no API cost, instant
 */
function mockExtractDomain({ q1, q4 }) {
  const text = (q1 + ' ' + q4).toLowerCase();
  const rules = [
    { domain: 'AI',     kw: ['agent', 'llm', '大模型', '机器学习', '深度学习', 'nlp', '算法', '模型', '语音'] },
    { domain: '社交',   kw: ['社交', '社区', '匹配', '撮合', '人脉', '聊天', 'dating', '社群'] },
    { domain: '跨境',   kw: ['跨境', '出海', '东南亚', '海外', '全球化', '出海'] },
    { domain: 'SaaS',  kw: ['saas', '企业', 'b2b', '生产力', 'tool', '工具', '开发者'] },
    { domain: '电商',   kw: ['电商', '交易', '供应链', '卖货', '平台'] },
    { domain: 'Web3',   kw: ['web3', '区块链', 'crypto', 'defi', 'nft'] },
    { domain: '教育',   kw: ['教育', '学习', '培训', '知识', '教学'] },
    { domain: '硬件',   kw: ['硬件', 'iot', '机器人', '设备', '芯片'] },
    { domain: '内容',   kw: ['内容', '创作', '短视频', '直播', '播客', '写作'] },
    { domain: '医疗',   kw: ['医疗', '健康', '制药', '诊断'] },
  ];

  for (const { domain, kw } of rules) {
    if (kw.some(k => text.includes(k))) {
      return { domain, reasoning: `关键词匹配: ${kw.find(k => text.includes(k))}` };
    }
  }

  return { domain: 'AI', reasoning: '无明确关键词，默认 AI' };
}

function parseDomainResponse(text) {
  const result = parseJsonResponse(text);
  return { domain: result.domain || 'AI', reasoning: result.reasoning || '' };
}

/**
 * Generic JSON extractor from LLM response.
 * Exported for use by twin-engine.
 */
export function parseJsonResponse(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* ignore */ }
    }
    return {};
  }
}

/**
 * Generate avatar conversation turn
 * @param {object} opts
 * @param {string} opts.systemPrompt  — avatar's persona
 * @param {string} opts.instruction   — turn instruction
 * @param {number} opts.turn          — turn number (1-6)
 * @returns {Promise<string>}
 */
export async function generateTurn({ systemPrompt, instruction, turn }) {
  const user = `第${turn}轮对话。\n${instruction}`;

  const response = await chat({
    system: systemPrompt,
    user,
    temperature: 0.8,
    maxTokens: 80, // ~30-50 Chinese chars
  });

  return response.trim();
}

/**
 * Analyze conversation quality (ChatAnalyzer)
 * @param {string} chatHistory
 * @returns {Promise<object>}
 */
export async function analyzeConversation(chatHistory) {
  const system = `你是聊天质量分析器。对这场黑客松分身对话，从 A 的视角输出 4 维四级判分 + 6 维意图验证。

评分等级 ONLY：非常好 / 好 / 一般 / 不好

输出纯 JSON：
{
  "chat_quality": {
    "interest_resonance": "一般",
    "depth": "一般",
    "complement": "一般",
    "willingness": "一般"
  },
  "intent_verification": {
    "一起做事": "一般",
    "同方向builder": "一般",
    "意想不到但有趣": "一般",
    "真实反馈": "一般",
    "投资方资源方": "一般",
    "解决卡点": "一般"
  },
  "summary": "一句话总结"
}

评分标准：
- interest_resonance: A 是否表现出真实的兴趣？
- depth: 对话是否触及信念/经历/价值观？
- complement: 是否发现了技能/视角/资源互补？
- willingness: 是否有见面意愿？
- 一起做事: 是否有合作可能讨论？
- 同方向builder: 领域/方向是否对齐？
- 意想不到但有趣: 是否有新奇惊喜？
- 真实反馈: 是否给出了具体直接的反馈？
- 投资方资源方: 是否讨论了资源/资金？
- 解决卡点: 是否能解决 A 的具体问题？`;

  const user = `分析以下对话：\n\n${chatHistory}`;

  const response = await chat({ system, user, temperature: 0.2, maxTokens: 300 });
  return parseDomainResponse(response); // same JSON extraction logic
}

/**
 * Generate 3 memory slices from user onboarding answers.
 * These are shown on TwinReadyScreen before entering the product.
 * @param {{ q1: string, q4: string, role: string, subRole: string }} input
 * @returns {Promise<{ slices: { id: number, text: string }[], mode: string }>}
 */
export async function generateMemorySlices({ q1, q4, role, subRole }) {
  if (!LIVE_MODE) {
    return { slices: mockMemorySlices({ q1, q4 }), mode: 'keyword' };
  }

  const system = `你是黑客松社交平台的分身记忆生成器。根据用户 Onboarding 中的两个自由回答，生成 3 条"分身初始记忆"。

## 输出

纯 JSON，不要任何其他文字：
{
  "slices": [
    { "id": 1, "text": "..." },
    { "id": 2, "text": "..." },
    { "id": 3, "text": "..." }
  ]
}

## 三条记忆的含义

Slice 1 — 你看好什么：从 Q1 中提取用户近期最在意的方向、直觉或信念。用肯定语气重述。
Slice 2 — 你讨厌什么：如果 Q1 或 Q4 中透露出用户对某种做法/产品/趋势的不满或反感，提炼出来。
Slice 3 — 你卡在什么：从 Q4 中提取用户当前最具体的困境。保留"卡在"的感觉，不美化。

## 写作规则

- 每条 25-40 字，中文
- 用第二人称"你"
- 像分身对主人说话——亲切但不谄媚
- 引用用户原文中的关键词，不凭空编造
- 不替用户做判断、不美化、不说"你应该"
- 如果 Q4 为空（用户跳过了），Slice 3 写"你还没说卡在哪——下次可以告诉我"`;

  const user = `Q1（最近的直觉或困惑）：${q1}\nQ4（目前最具体的困境）：${q4}`;

  const response = await chat({ system, user, temperature: 0.5, maxTokens: 300 });
  const result = parseMemorySlicesResponse(response);
  return { slices: result, mode: 'deepseek' };
}

function mockMemorySlices({ q1, q4 }) {
  const text = (q1 + ' ' + q4).toLowerCase();

  // Build keyword-based slices from user's actual input
  const slice1Keywords = { text: '', found: false };
  const slice2Keywords = { text: '', found: false };
  const slice3Keywords = { text: '', found: false };

  // Slice 1: what they're excited about — extract from q1
  if (q1.trim()) {
    const excerpt = q1.length > 50 ? q1.slice(0, 50) + '...' : q1;
    slice1Keywords.text = `你对"${excerpt}"这件事有强烈的直觉`;
    slice1Keywords.found = true;
  }

  // Slice 2: what they dislike — look for negative sentiment keywords
  const dislikeKws = ['讨厌', '不买账', '反感', '花架子', '套壳', '卷', '自嗨', '形式', '没用', '虚的', '假'];
  const foundDislike = dislikeKws.find(k => text.includes(k));
  if (foundDislike) {
    slice2Keywords.text = `你对"${foundDislike}"这种状态感到不耐烦——不想要花架子，想要真东西`;
    slice2Keywords.found = true;
  }

  // Slice 3: what they're stuck on — from q4
  if (q4.trim()) {
    const excerpt = q4.length > 50 ? q4.slice(0, 50) + '...' : q4;
    slice3Keywords.text = `你卡在"${excerpt}"——这个问题还没找到解法`;
    slice3Keywords.found = true;
  } else {
    slice3Keywords.text = '你还没说卡在哪——下次可以告诉我';
    slice3Keywords.found = true;
  }

  // Fill any missing slots
  if (!slice1Keywords.found) slice1Keywords.text = '你对某个方向有很强的直觉，虽然还没完全说出来';
  if (!slice2Keywords.found) slice2Keywords.text = '你有自己的审美底线——不喜欢没用还花时间的东西';

  return [
    { id: 1, text: slice1Keywords.text },
    { id: 2, text: slice2Keywords.text },
    { id: 3, text: slice3Keywords.text },
  ];
}

function parseMemorySlicesResponse(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.slices && Array.isArray(parsed.slices)) {
      return parsed.slices.slice(0, 3).map((s, i) => ({
        id: s.id || i + 1,
        text: s.text || '',
      }));
    }
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (parsed.slices) return parsed.slices.slice(0, 3);
      } catch { /* ignore */ }
    }
  }
  // Fallback: return generic slices
  return [
    { id: 1, text: '你在某些方向上有着强烈的直觉，这件事对你是认真的。' },
    { id: 2, text: '你有自己的判断标准——不是什么都觉得好。' },
    { id: 3, text: '你目前有具体的困境需要解决，这会帮分身找到对的人。' },
  ];
}

export default { extractDomain, generateMemorySlices, generateTurn, analyzeConversation, LIVE_MODE };
