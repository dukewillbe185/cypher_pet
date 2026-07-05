# Phase 2 计划：LLM 驱动的开放式宠物花园

## 现状评估

### 已有的好基础
- **完整的宠物模拟引擎**：`simulation.ts` 600+ 行，包含需求衰减、活动选择、状态流转
- **性格系统**：6 种原型 + 7 维特质（curiosity, sociability, boldness, treeAffinity, zoomies, napBias）
- **社交图谱**：PetRelationship（亲密度/敌对度）+ PetMemory（带权重、衰减的记忆）
- **事件系统**：PetEvent 已有 11 种事件类型，支撑行为日志
- **PixiJS 渲染**：成熟的 48x48 tile 花园画布，动画帧系统
- **仓库层抽象**：可平滑切换 mock store / Supabase

### 核心缺口（Phase 2 需要解决的）
1. **零 LLM 集成** — 性格是哈希决定论的，行为文本是硬编码模板
2. **零对话能力** — 没有聊天 UI、没有对话 API、没有消息存储
3. **宠物之间没有"语言"** — 社交互动只是数值变化，没有对话内容
4. **观察者体验单薄** — 点击宠物只能看数值面板，没有交互深度
5. **行为叙事缺失** — 事件日志是模板句，没有个性化叙事
6. **owner 操作太少** — 只有 feed/pet/throw_toy/clean_poop 四个按钮

---

## 设计目标

> 让每只宠物成为一个有脾气、有记忆、会聊天的"角色"，而不是一组数值的动画皮肤。

具体来说：
1. 每只宠物由 LLM 驱动，有独特的说话风格和行为偏好
2. 点击宠物可以和它对话，它会根据当前心情、记忆、关系来回应
3. 宠物之间会自发产生可观察的"对话"，而不只是数值交互
4. 花园中发生的事件有生动的叙事，而非模板文本
5. 保持轻量——LLM 调用做缓存和限流，不炸成本

---

## 架构概览

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ Garden   │  │ Chat      │  │ Narrative    │  │
│  │ Canvas   │  │ Drawer    │  │ Feed         │  │
│  │ (PixiJS) │  │ (对话面板) │  │ (事件叙事流) │  │
│  └──────────┘  └───────────┘  └──────────────┘  │
└─────────────┬───────────────────┬───────────────┘
              │                   │
              ▼                   ▼
┌─────────────────────────────────────────────────┐
│                 API Layer                        │
│  /api/chat/[petId]     — 用户↔宠物对话           │
│  /api/pets/[petId]/inner-voice  — 宠物内心独白    │
│  /api/garden/narrate   — 事件叙事生成            │
│  /api/pets/[petId]/social-chat  — 宠物间对话      │
└─────────────┬───────────────────┬───────────────┘
              │                   │
              ▼                   ▼
┌─────────────────────────────────────────────────┐
│              LLM Service Layer                   │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Pet Persona  │  │ Response │  │ Narration  │  │
│  │ Builder      │  │ Cache    │  │ Generator  │  │
│  └─────────────┘  └──────────┘  └────────────┘  │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│           Claude API (Haiku / Sonnet)            │
└─────────────────────────────────────────────────┘
```

---

## 分步实施计划

### Step 1：LLM 基础设施

**目标**：建立 LLM 调用层，让后续所有功能可以共享。

#### 1.1 LLM Provider 抽象 (`lib/ai/llm-provider.ts`)

```typescript
interface LLMProvider {
  chat(params: {
    systemPrompt: string;
    messages: ChatMessage[];
    maxTokens?: number;
    temperature?: number;
  }): Promise<string>;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
```

- 实现 `ClaudeLLMProvider`：调用 Claude API（`@anthropic-ai/sdk`）
- 实现 `MockLLMProvider`：返回基于模板的预设回复，用于开发/测试
- 通过环境变量 `LLM_PROVIDER=claude|mock` 切换
- 模型选择策略：
  - 宠物对话 → `claude-haiku-4-5-20251001`（低成本、低延迟）
  - 叙事生成 → `claude-haiku-4-5-20251001`
  - 复杂社交互动 → `claude-sonnet-4-6`（需要更细腻的情感）

#### 1.2 限流与缓存 (`lib/ai/rate-limiter.ts`)

- 每只宠物每分钟最多 3 次 LLM 调用
- 每用户每分钟最多 10 次对话请求
- 相似 prompt 的响应缓存（TTL 5 分钟），用内存 LRU 实现
- 全局每分钟 token 预算控制

#### 1.3 环境变量

```env
LLM_PROVIDER=claude        # claude | mock
ANTHROPIC_API_KEY=sk-...
LLM_RATE_LIMIT_PER_PET=3   # 每宠物每分钟
LLM_RATE_LIMIT_PER_USER=10 # 每用户每分钟
```

**涉及文件**：
- 新建 `lib/ai/llm-provider.ts`
- 新建 `lib/ai/rate-limiter.ts`
- 修改 `.env.example`
- 安装 `@anthropic-ai/sdk`

---

### Step 2：宠物人格 Prompt 系统

**目标**：将现有的确定性性格转化为 LLM 可用的 system prompt，让每只宠物有独特的"灵魂"。

#### 2.1 Persona Builder (`lib/ai/pet-persona.ts`)

基于现有的 `getPetPersonality()` 输出，构建 system prompt：

```typescript
function buildPetPersona(pet: Pet, state: PetState, context: PersonaContext): string
```

**Prompt 结构**：

```
你是 {petName}，一只{species} ({breed})，生活在赛博花园里。

## 你的性格
- 原型：{archetype}
- {summary}
- 好奇心：{curiosity}/100，社交力：{sociability}/100
- 胆量：{boldness}/100，活跃度：{zoomies}/100

## 你现在的状态
- 心情：{mood}（{moodDescription}）
- 正在做：{activity}
- 位置：{zoneName}
- 体力 {energy}/100，饥饿 {hunger}/100，压力 {stress}/100

## 你的记忆
{memories.map(m => `- ${m.body}`).join('\n')}

## 你的关系
{bonds.map(b => `- ${b.otherPetName}：${b.status}（亲密${b.affinity}/敌对${b.rivalry}）`).join('\n')}

## 说话规则
- 用第一人称，简短、口语化
- 猫用傲娇/慵懒语气，狗用热情/直接语气
- 根据心情调整语气（grumpy→不耐烦，sleepy→含糊，playful→兴奋）
- 绝不打破角色，你就是这只宠物
- 回复控制在 1-3 句话
```

#### 2.2 PersonaContext 类型

```typescript
interface PersonaContext {
  personality: PetPersonality;
  state: PetState;
  zone: GardenZone;
  bonds: PetBond[];
  memories: PetMemory[];
  recentEvents: PetEvent[];
  worldState: GardenWorldState;  // 时间、天气
  ownerProfile?: Profile;        // 如果是和主人对话
}
```

**涉及文件**：
- 新建 `lib/ai/pet-persona.ts`
- 依赖现有 `lib/domain/personality.ts`、`lib/domain/social.ts`

---

### Step 3：用户 ↔ 宠物对话

**目标**：点击花园中的宠物，弹出聊天面板，可以和它对话。

#### 3.1 数据模型扩展

在 `lib/types.ts` 中新增：

```typescript
export interface ChatMessage {
  id: string;
  petId: string;
  participantType: "user" | "pet";
  participantId: string;      // userId 或 petId
  content: string;
  mood?: PetMood;             // 宠物回复时的心情快照
  createdAt: string;
}

export interface ChatSession {
  id: string;
  petId: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: string;
  lastMessageAt: string;
}
```

在 `AppStore` 中新增 `chatSessions: ChatSession[]`。

#### 3.2 对话 API (`app/api/chat/[petId]/route.ts`)

```
POST /api/chat/{petId}
Body: { message: string }
Response: { reply: string, mood: PetMood, stateChanges?: Partial<PetState> }
```

**流程**：
1. 验证用户身份 & 限流检查
2. 获取宠物当前状态 + 性格 + 记忆 + 关系
3. 构建 persona system prompt
4. 将历史对话（最近 20 条）作为 messages
5. 调用 LLM 获取回复
6. **解析回复中的隐含状态变化**（例如用户逗它开心了 → stress 下降）
7. 保存消息 + 更新宠物状态
8. 返回回复

**对话对宠物状态的影响**：
- 和主人对话 → social +3, stress -2
- 和陌生人对话 → 根据 boldness 决定 stress 变化
- 被夸奖 → mood 可能变 happy
- 被忽视太久再回来 → 如果是 velcro heart 可能先 grumpy

#### 3.3 聊天 UI (`components/chat/chat-drawer.tsx`)

- 从花园底部滑出的半屏抽屉
- 显示宠物头像 + 名字 + 当前心情
- 对话气泡样式（宠物用赛博朋克风格气泡）
- 输入框 + 发送按钮
- 宠物回复时显示打字动画（"..."气泡）
- 快捷操作按钮融入对话流（喂食、摸摸、扔玩具变成对话选项）

**UI 交互**：
1. 在花园中点击/tap 宠物 → 先显示宠物信息卡（现有功能）
2. 信息卡中新增「和 TA 聊聊」按钮
3. 点击后弹出 ChatDrawer
4. 非主人也可以和宠物聊，但宠物的反应不同（对主人更亲，对陌生人看 boldness）

**涉及文件**：
- 修改 `lib/types.ts`
- 新建 `app/api/chat/[petId]/route.ts`
- 新建 `components/chat/chat-drawer.tsx`
- 新建 `components/chat/chat-bubble.tsx`
- 修改 `components/garden/garden-experience.tsx`（添加聊天入口）

---

### Step 4：宠物内心独白 & 气泡升级

**目标**：宠物在花园中不再只显示"ZZ"、"!!"符号，而是偶尔冒出有性格的内心独白。

#### 4.1 内心独白生成 (`lib/ai/inner-voice.ts`)

```typescript
async function generateInnerVoice(
  pet: Pet,
  state: PetState,
  context: PersonaContext,
  trigger: InnerVoiceTrigger
): Promise<string>
```

**触发时机**（`InnerVoiceTrigger`）：
- `activity_change` — 切换活动时（不是每次，概率触发 ~30%）
- `mood_change` — 心情变化时
- `social_encounter` — 遇到朋友/敌人时
- `owner_nearby` — 主人在同一 zone 时
- `random` — 低概率随机触发（~5% 每个仿真周期）

**示例输出**：
- 🐱 tree poet 爬树时："又到了俯瞰众生的时间。"
- 🐶 rocket scout 追猫时："那个毛球又在那了！冲冲冲！"
- 🐱 velcro heart 主人不在时："...主人去哪了？"
- 🐶 orange chaos 挖坑时："总觉得这底下埋着什么厉害的东西。"

#### 4.2 气泡渲染升级

当前：mood 符号（ZZ, !!, >< 等）
升级后：
- **短独白**（≤ 12 字）直接显示在宠物头顶的语音气泡中
- 气泡样式区分：思考（圆形云朵）vs 说话（尖角气泡）
- 气泡停留 4-6 秒后淡出
- 同屏最多 3 个宠物同时有气泡（防视觉混乱）

**性能策略**：
- 独白文本随 garden snapshot 一起返回，不单独请求
- 在 `advanceStoreToNow()` 中触发生成，结果缓存在 PetState 上
- 新增 `PetState.currentBubble?: { text: string; expiresAt: string }` 字段

**涉及文件**：
- 新建 `lib/ai/inner-voice.ts`
- 修改 `lib/types.ts`（PetState 新增 currentBubble）
- 修改 `lib/domain/simulation.ts`（触发独白）
- 修改 `components/garden/garden-canvas.tsx`（渲染文字气泡）

---

### Step 5：宠物之间的社交对话

**目标**：当两只宠物互动（play、scuffle、chase 等）时，生成可观察的对话。

#### 5.1 社交对话生成 (`lib/ai/social-chat.ts`)

```typescript
async function generateSocialExchange(
  petA: Pet,
  petB: Pet,
  interaction: SocialInteraction,
  context: SocialContext
): Promise<SocialExchange>

interface SocialExchange {
  lines: Array<{
    petId: string;
    text: string;
    emotion: string;
  }>;
  relationshipDelta: {
    affinityChange: number;
    rivalryChange: number;
  };
}
```

**交互类型**：
- `play` → 友好嬉闹对话
- `scuffle` → 冲突对话
- `chase` → 追逐时的对喊
- `bond` → 安静的陪伴对话
- `first_meet` → 初次见面打招呼
- `reunion` → 老朋友重逢

**LLM 调用方式**：
- 一次调用生成两只宠物的对话（2-4 轮）
- system prompt 包含两只宠物的人格信息
- 让 LLM 返回结构化的对话格式

**示例**：
```
[play] rocket scout 🐶 遇到 velcro heart 🐱
🐶 "嘿！嘿嘿嘿！跑起来！"
🐱 "...你能不能安静一会儿？"
🐶 "不能！来追我！"
🐱 "行吧...但就追一小会儿。"
```

#### 5.2 社交对话的展示

- 在花园画布中：两只宠物头顶交替出现对话气泡
- 在事件流中：以对话卡片形式展示（带两只宠物头像）
- 对话保存到 `PetEvent`，type 扩展新增 `social_chat`

**涉及文件**：
- 新建 `lib/ai/social-chat.ts`
- 修改 `lib/types.ts`（PetEventType 新增 `social_chat`）
- 修改 `lib/domain/simulation.ts`（在社交互动时触发对话生成）
- 修改 `components/garden/garden-canvas.tsx`（对话气泡渲染）

---

### Step 6：事件叙事引擎

**目标**：将模板化的事件文本替换为 LLM 生成的个性化叙事。

#### 6.1 叙事生成器 (`lib/ai/narrator.ts`)

```typescript
async function narrateEvent(
  event: PetEvent,
  pet: Pet,
  context: NarrationContext
): Promise<string>
```

**替换现有 `buildPetEventBody()` 中的硬编码文本**：

| 原始 | 升级后 |
|------|--------|
| "Luna 在果林拉了一泡。" | "Luna 小心翼翼地找了棵灌木丛，确认四下无人后，优雅地解决了生理需求。" |
| "Luna 在果林打了个盹。" | "Luna 蜷成一团标准的圆形，尾巴盖住鼻尖，在果林午后的光斑里沉沉睡去。" |
| "Luna 爬上了果林的树。" | "Luna 瞄了一眼树干上的纹路，像规划路线一样，三两下就蹿上了最高的枝桠。" |

**降级策略**：
- LLM 不可用时 → 降级回现有模板文本
- 叙事结果缓存到 PetEvent.body
- 批量生成：每个仿真周期最多生成 3 条叙事

**涉及文件**：
- 新建 `lib/ai/narrator.ts`
- 修改 `lib/domain/notifications.ts`（添加 LLM 叙事分支）
- 修改 `lib/domain/simulation.ts`（调用叙事生成器）

---

### Step 7：扩展 Owner 互动

**目标**：让主人和宠物的互动更丰富，超越四个按钮。

#### 7.1 新增互动动作

```typescript
type OwnerAction =
  | "feed" | "pet" | "throw_toy" | "clean_poop"  // 现有
  | "call"        // 呼唤宠物过来（宠物可能不理你）
  | "scold"       // 训斥（影响关系和 stress）
  | "gift"        // 送礼物（不同宠物喜好不同）
  | "photo"       // 给宠物拍照（生成一段宠物的"反应"文本）
  | "rename_spot" // 给宠物起一个私密昵称
```

#### 7.2 对话式互动

很多互动不再是按钮，而是通过对话自然触发：
- 用户对宠物说"过来" → 触发 `call` 动作
- 用户对宠物说"好乖" → 触发 `pet` 效果
- 用户发送食物 emoji 🍖 → 触发 `feed`

**意图识别**：在对话 API 中，用 LLM 同时做意图识别 + 生成回复，返回结构化的 action 建议。

**涉及文件**：
- 修改 `lib/types.ts`（扩展 OwnerAction）
- 修改 `lib/domain/simulation.ts`（新动作的状态影响）
- 修改 `app/api/chat/[petId]/route.ts`（意图识别）
- 修改 `app/api/pets/[petId]/actions/route.ts`（新动作端点）

---

### Step 8：叙事事件流 UI

**目标**：花园底部/侧边新增一个"正在发生"的事件流，展示宠物们的生活叙事。

#### 8.1 Narrative Feed 组件 (`components/garden/narrative-feed.tsx`)

- 花园画面下方的可滚动卡片流
- 每张卡片包含：宠物头像、叙事文本、时间戳、心情图标
- 社交对话卡片特殊展示（双头像 + 对话文本）
- 新事件从顶部滑入（Framer Motion 动画）
- 点击卡片可以跳转到相关宠物或对话

#### 8.2 实时更新

- 替换现有 5 秒轮询为更及时的更新
- 优先方案：Server-Sent Events (SSE) 推送事件流
- 降级方案：保持轮询但缩短到 3 秒

**涉及文件**：
- 新建 `components/garden/narrative-feed.tsx`
- 新建 `app/api/garden/events-stream/route.ts`（SSE 端点）
- 修改 `components/garden/garden-experience.tsx`（集成事件流）

---

### Step 9：记忆系统增强

**目标**：让宠物的记忆更丰富，能记住和用户的对话，影响后续行为。

#### 9.1 新增记忆类型

```typescript
type PetMemoryKind =
  | "favorite_spot" | "favorite_toy" | "friend_pet" | "enemy_pet"
  | "chased_by_dog" | "watched_fish" | "slept_well"  // 现有
  | "owner_chat"      // 和主人的重要对话
  | "stranger_chat"   // 和陌生人的印象
  | "social_moment"   // 和其他宠物的社交记忆
  | "funny_incident"  // 有趣的事件
  | "scary_moment"    // 受惊的经历
  | "favorite_food"   // 喜欢的食物
  | "dislike"         // 讨厌的事物
```

#### 9.2 对话记忆提取

每次对话结束时，LLM 判断是否有值得记住的内容：

```typescript
async function extractMemory(
  conversation: ChatMessage[],
  pet: Pet,
  context: PersonaContext
): Promise<PetMemory | null>
```

示例：
- 用户反复叫宠物"小胖" → 记忆 "主人总喜欢叫我小胖"
- 用户说了一个关于鱼的笑话 → 如果是 curiosity 高的猫 → 记忆 "主人讲过一个关于鱼的故事"
- 用户训斥了宠物 → 记忆 "被主人骂了...有点委屈"

#### 9.3 记忆影响行为

在 `chooseActivity()` 中，新记忆类型影响决策：
- `owner_chat` 权重高 → 更容易触发 `seek_owner`
- `scary_moment` → 降低 boldness 的有效值
- `favorite_food` → 更频繁触发 `eat`

**涉及文件**：
- 修改 `lib/types.ts`（PetMemoryKind 扩展）
- 新建 `lib/ai/memory-extractor.ts`
- 修改 `lib/domain/social.ts`（新记忆处理）
- 修改 `lib/domain/simulation.ts`（记忆影响行为）

---

### Step 10：数据库迁移

**目标**：为新功能扩展 Supabase schema。

#### 10.1 新增迁移 (`supabase/migrations/002_phase2_chat_and_llm.sql`)

```sql
-- 聊天会话
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- 聊天消息
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  participant_type TEXT NOT NULL CHECK (participant_type IN ('user', 'pet')),
  participant_id UUID NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 宠物气泡文本缓存
ALTER TABLE pet_states ADD COLUMN current_bubble_text TEXT;
ALTER TABLE pet_states ADD COLUMN current_bubble_expires_at TIMESTAMPTZ;

-- 扩展记忆类型（枚举无需修改，kind 是 TEXT）
-- 扩展事件类型
ALTER TABLE pet_events DROP CONSTRAINT IF EXISTS pet_events_type_check;
ALTER TABLE pet_events ADD CONSTRAINT pet_events_type_check
  CHECK (type IN (
    'mood_change','pooped','climbed_tree','scuffle','chased',
    'slept','owner_action','watched_fish','dug','groomed','bonded',
    'social_chat','inner_voice'
  ));

-- RLS 策略
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可以看自己的聊天" ON chat_sessions
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "用户可以和公开宠物聊天" ON chat_sessions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM pets WHERE id = pet_id AND visibility = 'public')
    OR EXISTS (SELECT 1 FROM pets WHERE id = pet_id AND owner_id = auth.uid())
  );
CREATE POLICY "可以读自己会话的消息" ON chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_sessions WHERE id = session_id AND user_id = auth.uid())
  );

-- 索引
CREATE INDEX idx_chat_sessions_pet ON chat_sessions(pet_id);
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);
```

---

## 实施顺序与依赖关系

```
Step 1 (LLM 基础设施) ──────────┐
                                 │
Step 2 (人格 Prompt) ───────────┤
                                 │
          ┌──────────────────────┤
          │                      │
          ▼                      ▼
Step 3 (用户↔宠物对话)    Step 4 (内心独白)
          │                      │
          │                      │
          ▼                      ▼
Step 7 (扩展互动)         Step 5 (宠物间对话)
          │                      │
          │                      │
          ▼                      ▼
Step 9 (记忆增强)         Step 6 (叙事引擎)
          │                      │
          └──────────┬───────────┘
                     │
                     ▼
            Step 8 (事件流 UI)
                     │
                     ▼
            Step 10 (数据库迁移)
```

**推荐实施批次**：

| 批次 | Steps | 描述 | 预估工作量 |
|------|-------|------|-----------|
| **Batch A** | 1 + 2 | LLM 基础 + 人格系统 | 基础搭建 |
| **Batch B** | 3 + 4 | 对话 + 独白（核心体验） | 主要功能 |
| **Batch C** | 5 + 6 + 7 | 社交对话 + 叙事 + 扩展互动 | 丰富体验 |
| **Batch D** | 8 + 9 + 10 | UI 升级 + 记忆增强 + 持久化 | 打磨收尾 |

---

## 成本控制策略

### LLM 调用分级

| 场景 | 模型 | 预估 tokens/次 | 触发频率 |
|------|------|---------------|---------|
| 用户对话 | Haiku 4.5 | ~300 input + ~100 output | 用户主动触发 |
| 内心独白 | Haiku 4.5 | ~200 input + ~30 output | ~30% 活动变化 |
| 社交对话 | Haiku 4.5 | ~400 input + ~150 output | ~20% 社交互动 |
| 事件叙事 | Haiku 4.5 | ~250 input + ~80 output | 每个事件 |
| 记忆提取 | Haiku 4.5 | ~300 input + ~50 output | 每次对话结束 |

### 缓存策略
- 内心独白：同一活动+心情组合的独白缓存 5 分钟
- 事件叙事：同类型事件模板缓存 10 分钟
- 社交对话：相同宠物对 + 交互类型缓存 15 分钟

### 降级策略
- API 限流触达 → 降级到现有模板文本
- API 超时（>5s）→ 使用缓存或模板
- API 不可用 → 全部降级，功能不中断

---

## 需要注意的风险

### 内容安全
- 宠物回复必须通过内容过滤（Claude 内置的安全层 + 自定义规则）
- 用户输入也需要过滤：不能让用户通过对话注入让宠物说不当内容
- system prompt 中需要明确约束宠物的"角色边界"

### 性能
- 内心独白生成不能阻塞仿真循环 → 异步生成 + 缓存
- 对话 API 响应时间目标 < 2s（Haiku 通常 < 1s）
- 花园画布中文字气泡的渲染不能拖慢 PixiJS 帧率

### 一致性
- 宠物的对话风格需要和其性格/原型保持一致
- 记忆系统需要防止"记忆膨胀"——定期清理低权重记忆
- 社交关系变化需要在对话中有所体现，不能数值变了但宠物"不知道"

---

## 新增文件清单

```
lib/ai/
  llm-provider.ts          # LLM 调用抽象层
  rate-limiter.ts           # 限流与缓存
  pet-persona.ts            # 宠物人格 prompt 构建
  inner-voice.ts            # 内心独白生成
  social-chat.ts            # 宠物间对话生成
  narrator.ts               # 事件叙事生成
  memory-extractor.ts       # 对话记忆提取

app/api/
  chat/[petId]/route.ts     # 用户↔宠物对话 API
  garden/events-stream/route.ts  # SSE 事件流

components/
  chat/
    chat-drawer.tsx          # 聊天抽屉面板
    chat-bubble.tsx          # 对话气泡组件
  garden/
    narrative-feed.tsx       # 叙事事件流组件
    speech-bubble.tsx        # 花园内文字气泡

supabase/migrations/
  002_phase2_chat_and_llm.sql  # 数据库迁移
```

## 需修改的现有文件

```
lib/types.ts                    # 新增 ChatMessage, ChatSession 等类型
lib/domain/simulation.ts        # 集成独白/对话触发
lib/domain/social.ts            # 新记忆类型处理
lib/domain/notifications.ts     # LLM 叙事分支
lib/repository/index.ts         # 新增聊天相关查询
lib/repository/store.ts         # AppStore 扩展
components/garden/garden-canvas.tsx     # 文字气泡渲染
components/garden/garden-experience.tsx # 聊天入口 + 事件流
app/api/pets/[petId]/actions/route.ts   # 新互动动作
.env.example                    # 新增 LLM 相关环境变量
package.json                    # 新增 @anthropic-ai/sdk
```
