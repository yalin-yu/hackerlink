# Hackerlink

黑客松 AI 分身社交平台。让用户的 AI 数字分身代替真人去跟其他人聊天，从对话中判断谁是值得线下见面的人。

## 怎么工作的

1. **Onboarding**：选角色（Builder / Backer / Organizer），选细分定位，回答两个问题
2. **分身出发**：AI 分析你的回答 → 构建分身形象 → 分身跟活动里其他人的分身一对一对话（6 轮）
3. **智能推荐**：分析每场对话的质量（兴趣共鸣、深度、互补性、见面意愿）→ 按匹配度排序展示
4. **聊天 & 见面**：点击卡片看三层详情（Vibe → 连接理由 → Aha Moment）+ 完整对话记录

## 项目结构

```
hackerlink/
├── server/       ← Node.js 后端（零依赖，内置模块）
│   ├── src/
│   │   ├── index.js          # HTTP 服务入口
│   │   ├── router.js         # 路由框架
│   │   ├── db.js             # SQLite 数据库
│   │   ├── routes.js         # API 端点
│   │   ├── twin-engine.js    # 分身对话引擎 + 匹配算法
│   │   ├── deepseek.js       # LLM 客户端（DeepSeek API）
│   │   ├── memory-store.js   # 内存存储（无持久化）
│   │   ├── seed.js           # 种子数据（8 个测试用户）
│   │   └── test.js           # 自动化测试
│   └── package.json
├── UI/           ← React 前端（Vite + TypeScript + Tailwind）
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx                  # 主应用 + 状态管理
│   │   │   └── components/
│   │   │       ├── onboarding/          # Onboarding 流程
│   │   │       └── main/               # 核心页面
│   │   └── api/                        # API 调用层
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS |
| 后端 | Node.js 22 (零依赖：`node:http` + `node:sqlite`) |
| LLM | DeepSeek API（可选，无 Key 时使用 keyword mock 模式） |
| 数据 | SQLite（用户/Profile）+ 内存存储（对话/推荐） |
| 部署 | GitHub Pages（前端）+ Render（后端） |

## 本地开发

### 后端

```bash
cd server
node src/index.js
# 启动在 http://localhost:3001
```

### 前端

```bash
cd UI
npm install
npm run dev
# 启动在 http://localhost:5173
```

### 测试

```bash
cd server
node src/test.js
# 21 个集成测试，覆盖全部 API 端点
```

## LLM 模式

| 模式 | DEEPSEEK_API_KEY | 行为 |
|---|---|---|
| Keyword Mock | 未设置 | 关键词模板生成对话，瞬间出结果 |
| DeepSeek Live | 已设置 | 真实 LLM 驱动分身对话，有等待时间 |

```bash
# 启用真实 LLM
export DEEPSEEK_API_KEY="sk-your-key"
node src/index.js
```

##

### 说明

- **不需要 API Key 也能用**：keyword mock 模式全覆盖
- **无持久化**：对话存在内存里，服务重启清空。登录系统后续再加
- **冷启动**：Render 免费版空闲后休眠 ~30 秒。建议用 Fly.io 或 Railway 避免

## 许可证

MIT
