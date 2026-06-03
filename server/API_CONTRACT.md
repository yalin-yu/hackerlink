# Hackerlink API 契约 v1.0

## 概述

- 服务地址：`http://localhost:3001`
- 所有请求/响应：JSON
- 无认证（MVP 阶段，前端传 userId 识别身份）
- 接口设计原则：每个 UI 页面的数据需求驱动接口定义，不多不少

---

## Step 2 涉及

### 1. 创建/更新 Profile

**前端页面**：SubRoleScreen → Question1Screen → Question4Screen → TwinReadyScreen

```
POST /api/profiles
body {
  userId: string,
  role: string,        // "builder" | "backer" | "organizer" (RoleSelectionScreen)
  subRole: string,     // "code"|"product"|... (SubRoleScreen)
  q1: string,          // 自由文本
  q4: string           // 自由文本
}
→ 201 { profile: { id, userId, role, subRole, q1, q4, domain, reasoning, onboardingComplete: true } }
```

**后端行为**：
1. 收到 POST → 立即调 DeepSeek 提取 domain
2. 将 role + subRole + q1 + q4 + domain + reasoning 全部存入 profiles 表
3. 返回完整 profile，前端据此判断 onboarding 完成

**Already built (step 1)**：basic profile create/read — needs subRole + domain + DeepSeek

### 2. 获取 Profile

```
GET /api/profiles/:userId
→ 200 { profile: { id, userId, role, subRole, q1, q4, domain, reasoning, onboardingComplete } }
→ 404 { error: "not found" }
```

**前端页面**：TwinReadyScreen、App.tsx 启动时检查 onboarding 完成状态

---

## Step 3 涉及（暂不实现）

### 3. 绑定活动 + 保存搜索配置

**前端页面**：ExploreModal

```
POST /api/twin-config
body {
  userId: string,
  eventId: string,
  selectedCards: number[],   // [1,3,6] 对应 6 张卡片的 id
  customInput: string         // 自由文本
}
→ 201 { config: { ... } }
```

### 4. 获取活动参与者

**前端页面**：分身出发前确定跟谁聊

```
GET /api/events/:eventId/participants
→ 200 { participants: [{ id, nickname, profile: { role, subRole, domain, ... } }] }
```

---

## Step 4 涉及（暂不实现）

### 5. 启动分身搜索（异步）

**前端页面**：TwinDepartureTransition

```
POST /api/twin-search/start
body { userId: string, eventId: string }
→ 202 { taskId: string, status: "started" }
```

**后端行为**：触发后台任务，为该用户的分身与活动内每个其他用户的分身进行 6 轮对话（DeepSeek）

### 6. 查询搜索进度

```
GET /api/twin-search/status/:taskId
→ 200 { status: "running"|"done", progress: { completed: 3, total: 7 } }
```

### 7. 获取搜索推荐结果

```
GET /api/twin-search/results/:userId/:eventId
→ 200 { results: SoulData[] }
```

**SoulData 结构**：等你确认 PersonaProfile 后定义

---

## Step 5 涉及（暂不实现）

### 8-10. 聊天、匹配、邀约

已实现基础 CRUD：`POST /api/matches`、`POST /api/messages`、`GET /api/messages/:matchId`、`POST /api/meetings`、`PUT /api/meetings/:id`

详细契约在实现前再定。

---

## 前端 API 层结构

```
UI/src/api/
  client.js     # fetch 封装 (base URL: http://localhost:3001)
  profile.js    # createProfile(userId, data), getProfile(userId)
  events.js     # getEvents(), getEventParticipants(eventId)
  twin.js       # saveTwinConfig(...), startSearch(...), getResults(...)
  chat.js       # sendMessage(...), getMessages(...), pollMessages(...)
```

## 测试标注规范

每个前端页面在组件内部，接 API 处加注释标注：

```jsx
{/* [API] POST /api/profiles → 存 role/subRole/q1/q4 → 返回 domain */}
// 对应 F12 Network 搜索路径
```

这样在浏览器 F12 Network 面板可以按注释关键词过滤请求。
