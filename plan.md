# Cypher Pet LLM Autonomy Plan

## Goal

让 `cypher_pet` 从“规则决定行为，LLM 负责说话和叙事”，升级为“规则兜底、LLM 参与决策、每只 pet 有持续人格和长期记忆”的自治宠物系统。

目标不是把世界全交给 LLM。
目标是建立一个可控的混合架构：

- 规则引擎负责世界约束、数值变化、位置合法性、对象交互
- LLM 负责人格建模、行为意图选择、社交意图、语言表达、长期记忆压缩
- 每只 pet 都有连续的“自我”，不是每次临时扮演

---

## Current State

基于当前仓库，已经具备的能力：

- 规则模拟主循环已经存在，核心在 `lib/domain/simulation.ts`
- 基础人格维度已经存在，核心在 `lib/domain/personality.ts`
- 社交关系与记忆系统已经存在，核心在 `lib/domain/social.ts`
- Persona prompt、inner voice、social chat、narrator、rate limiter 已经存在，核心在 `lib/ai/*`
- 聊天 API、事件流、详情页、花园页都已经落地

当前真正缺失的是：

1. pet 没有持久化的长期 agency profile
2. pet 的“下一步想干嘛”仍主要由规则写死
3. 社交对话已有，但社交“意图”还不是一级公民
4. 记忆有事件条目，但缺少长期压缩后的自我叙述
5. 缺少调试面板，很难理解 pet 为什么做出某个选择

---

## Design Principles

### 1. LLM 不直接修改世界

LLM 绝不直接输出最终世界状态。

LLM 只能输出：

- `autonomy_profile`
- `memory_digest`
- `action_intent`
- `social_intent`
- `chat_reply`
- `inner_voice`
- `narration`

真正执行变更的必须是本地代码：

- `PetState` 数值变化
- `tileX/tileY` 移动
- `WorldObject` 创建/删除
- `PetRelationship` 更新
- `PetMemory` 写入

### 2. 行为决策采用 Hybrid 模式

不能直接让 LLM 自由发挥行为。

必须是：

1. 规则层先产出 `candidate actions`
2. LLM 在候选集合里选一个，并解释原因
3. 若 LLM 失败，则回退到规则层 baseline

### 3. 长期人格与短期状态分离

每只 pet 的“是谁”与“现在怎样”必须分开：

- 长期：人格、偏好、依恋方式、冲突触发点、舒适源
- 短期：心情、体力、压力、饥饿、所在区、附近对象、近期互动

### 4. 语言层与行为层分离

先决定“要做什么”，再生成“会怎么说”。

禁止反过来只靠台词推断行为。

---

## Target Architecture

```text
Pet
├─ deterministic personality stats
├─ autonomy profile (persistent)
├─ memory digest (persistent / refreshable)
├─ current state
├─ bonds + episodic memories
└─ last autonomy decision trace

Simulation Tick
├─ need decay
├─ deterministic candidate generation
├─ LLM action director
├─ state transition execution
├─ social intent resolution
├─ dialogue / inner voice / narration
└─ memory compression
```

---

## Implementation Status

以下内容已经在当前 repo 中落地，不再只是计划。

### Completed

#### 1. Persistent autonomy data 已接入

已完成：

- `lib/types.ts`
  - 新增 `PetDrive`
  - 新增 `SocialIntent`
  - 新增 `PetAutonomyProfile`
  - 新增 `PetMemoryDigest`
  - 新增 `PetAutonomyDecision`
  - 新增 `PetDecisionCandidateSummary`
  - `PetState.lastAutonomyDecision`
  - `AppStore.petAutonomyProfiles`
  - `AppStore.petMemoryDigests`
- `lib/repository/store.ts`
  - schema version 从 `4` 升到 `5`
  - runtime store 校验已包含 autonomy arrays
- `lib/mock/seed.ts`
  - seed 已补 `petAutonomyProfiles` / `petMemoryDigests`
- `test/domain.test.ts`
  - 测试辅助 store 已同步 schema 结构
- `lib/domain/autonomy.ts`
  - 已实现 `buildDerivedPetAutonomyProfile()`
  - 已实现 `buildDerivedPetMemoryDigest()`
  - 已实现 `syncPetAutonomyState()`
  - 已实现 `syncAutonomyState()`

#### 2. Persona 上下文已消费 autonomy 数据

已完成：

- `lib/ai/pet-persona.ts`
  - `PersonaContext` 已新增 `autonomyProfile`
  - `PersonaContext` 已新增 `memoryDigest`
  - `buildPersonaContextFromStore()` 已从 store 读取长期 autonomy 数据
  - `buildPetPersona()` 已把长期身份、长期记忆摘要、当前驱动力写入 prompt
  - `buildPetChatPrompt()` 已把长期 autonomy 数据写入聊天 prompt

#### 3. Action Director 已接入主模拟链路

已完成：

- `lib/ai/action-director.ts`
  - 已实现结构化候选动作输入
  - 已实现 JSON 输出约束
  - 已实现 fallback goal / fallback social intent
  - 已实现 `decidePetAction()`
- `lib/domain/simulation.ts`
  - 保留原有 deterministic `chooseActivity()` 作为 baseline
  - 新增 `buildActivityCandidates()` 产出 3 到 6 个候选动作
  - 新增 `chooseActivityWithAutonomy()` 执行 `candidate actions -> LLM choose one`
  - `advanceStoreToNow()` 已在 retarget 时改走 autonomy 决策链
  - `lastAutonomyDecision` 已写回 `PetState`

#### 4. Social intent 已成为一级决策层

已完成：

- `lib/ai/social-intent.ts`
  - 已实现 `SocialIntentDecision`
  - 已实现 `decideSocialIntent()`
- `lib/ai/social-chat.ts`
  - `generateSocialExchange()` 已支持接收 `socialIntent`
- `lib/domain/simulation.ts`
  - `maybeEmitSocialDialogue()` 已改为：
    1. 先判断 `socialIntent`
    2. 再生成社交台词
    3. 再按 `socialIntent + exchange delta` 更新关系
- `lib/repository/index.ts`
  - `generatePetSocialChatPreview()` 已同步走新的社交意图链路

#### 5. Repository / runtime refresh 已补齐

已完成：

- `lib/repository/index.ts`
  - `createPet()` 后会立即生成 autonomy profile / memory digest
  - `sendChatToPet()` 在记忆写入后会刷新 autonomy digest
  - dashboard / pet details 读取已返回 autonomy profile 和 memory digest
- `lib/domain/simulation.ts`
  - `advanceStoreToNow()` 在模拟前、每只 pet 处理中、以及收尾阶段都会刷新 autonomy 数据
  - `applyOwnerActionToStore()` 执行主人行为后会刷新 autonomy 数据
  - `buildGardenSnapshot()` 已把 autonomy profile / memory digest 带入花园 pet snapshot

#### 6. 调试面板已落地

已完成：

- `app/pets/[petId]/page.tsx`
  - 新增 `Autonomy` 区块
  - 可查看：
    - `coreIdentity`
    - `motivations`
    - `comfortSources`
    - `stressSignals`
    - `socialStrategy`
    - `memoryDigest.summary`
    - `memoryDigest.socialSummary`
    - `memoryDigest.activeDrives`
    - `lastAutonomyDecision.goal`
    - `lastAutonomyDecision.chosenActivity`
    - `lastAutonomyDecision.reason`
    - `lastAutonomyDecision.socialIntent`
    - `lastAutonomyDecision.candidates`

#### 7. 文档与环境变量已同步

已完成：

- `.env.example`
  - 已新增 `LLM_MODEL_ACTION`
- `lib/env.ts`
  - 已新增 `llmModelAction`
- `README.md`
  - 已补 autonomy / action director / social intent 的说明
  - 已补 `LLM_MODEL_ACTION`

#### 8. 校验已完成

已执行并通过：

- `npm run lint`
- `npm run test`
- `npm run build`

#### 9. Phase 5 prompt 拆分已落地

已完成：

- `lib/ai/pet-persona.ts`
  - 已新增 `buildPetVoicePrompt()`
  - 已新增 `buildPetDecisionPrompt()`
  - 已新增 `buildPetNarrationPrompt()`
  - `buildPetChatPrompt()` 已改成 compact chat prompt，不再兼做所有任务
- `lib/ai/action-director.ts`
  - 已改为消费 `buildPetDecisionPrompt()`
- `lib/ai/social-intent.ts`
  - 已改为消费 `buildPetDecisionPrompt()`
- `lib/ai/memory-extractor.ts`
  - 已改为消费 `buildPetDecisionPrompt()`
- `lib/ai/social-chat.ts`
  - 已改为消费 `buildPetVoicePrompt()`
- `lib/ai/inner-voice.ts`
  - 已改为消费 `buildPetVoicePrompt()`
- `lib/ai/narrator.ts`
  - 已改为消费 `buildPetNarrationPrompt()`

#### 10. Rollout strategy 已接入环境开关

已完成：

- `.env.example`
  - 已新增 `LLM_AUTONOMY_ENABLED`
  - 已新增 `LLM_AUTONOMY_PUBLIC_ONLY`
  - 已新增 `LLM_AUTONOMY_ZONES`
- `lib/env.ts`
  - 已新增 autonomy rollout env 解析
- `lib/domain/simulation.ts`
  - 已新增 `shouldUseLLMAutonomyForPet()`
  - Action Director 已支持 safe toggle / public-only / zone rollout
- `README.md`
  - 已补 rollout 配置说明

### Current Boundaries

当前版本虽然已经落地 autonomy 主链路，但仍有几个明确边界，需要记录：

1. `PetAutonomyProfile` 和 `PetMemoryDigest` 当前是 `derived` 优先，不是定时 LLM 重写版
2. 长期记忆摘要当前是从 episodic memory 提炼出的 deterministic digest，还没有独立的异步压缩 worker
3. LLM 不直接改世界状态，仍然只负责：
   - 候选动作选择
   - 社交意图判断
   - 聊天台词
   - 内心独白
   - 叙事文本
4. 世界状态变更仍然完全由本地代码控制，这个约束是刻意保留的

### Conclusion

所以答案是：

- `plan.md` 现在既包含原始设计目标
- 也已经补上了当前这轮实现的详细落地记录
- 但它仍然不是逐 commit 的 changelog，而是“设计 + 实施状态”的工程文档

---

## Phase 1: Persistent Autonomy Layer

### Objective

给每只 pet 增加持久化的 agency 配置和长期记忆摘要，成为后续所有 LLM 决策的固定输入。

### Files

- `lib/types.ts`
- `lib/repository/store.ts`
- `lib/mock/seed.ts`
- `storage/mock-db.runtime.json` 仅在运行时重建，不手工维护
- 新建 `lib/domain/autonomy.ts`

### Additions

新增数据结构：

#### `PetAutonomyProfile`

建议字段：

- `id`
- `petId`
- `source: "derived" | "llm"`
- `coreIdentity`
- `motivations`
- `comfortSources`
- `stressSignals`
- `socialStrategy`
- `favoriteActivities`
- `avoidedActivities`
- `dailyRhythm`
- `ownerBondStyle`
- `updatedAt`

#### `PetMemoryDigest`

建议字段：

- `petId`
- `source: "derived" | "llm"`
- `summary`
- `socialSummary`
- `activeDrives`
- `notableMemories`
- `updatedAt`

#### `PetAutonomyDecision`

建议字段：

- `goal`
- `chosenActivity`
- `source`
- `reason`
- `candidates`
- `targetPetId?`
- `targetObjectId?`
- `socialIntent?`
- `decidedAt`

挂载位置：

- `AppStore.petAutonomyProfiles`
- `AppStore.petMemoryDigests`
- `PetState.lastAutonomyDecision`

### Implementation Rules

- 先实现 deterministic backfill，保证 mock store 启动即有完整数据
- 之后再加入 LLM profile refresh，不要一开始把 profile 生成绑死在页面访问路径上
- `advanceStoreToNow()` 或 store init 时自动补齐缺失 profile/digest

### Success Criteria

- 任意已有 pet 打开详情页时都能拿到 autonomy profile 和 memory digest
- 新建 pet 时能自动生成默认 autonomy profile
- schema 变更后旧 runtime store 可安全重建

---

## Phase 2: LLM Action Director

### Objective

让 pet 的“下一步行为”不再完全由规则硬编码，而是通过 `candidate actions -> LLM choose one` 的方式获得自主性。

### Files

- 新建 `lib/ai/action-director.ts`
- 修改 `lib/domain/simulation.ts`
- 修改 `lib/env.ts`
- 修改 `.env.example`
- 修改 `README.md`

### New Environment Variable

- `LLM_MODEL_ACTION`

默认可以回退到：

- `LLM_MODEL_SOCIAL`
或
- `LLM_MODEL_NARRATION`

### Required Input To Action Director

Action Director 的输入必须包含：

- pet 基本信息
- `PetPersonality`
- `PetAutonomyProfile`
- `PetMemoryDigest`
- 当前 `PetState`
- 当前 `GardenWorldState`
- 附近 pet 摘要
- 附近 object 摘要
- 候选动作列表

### Output Schema

必须强制 JSON 输出：

```json
{
  "goal": "seek_rest",
  "chosenActivity": "sleep",
  "targetPetId": null,
  "targetObjectId": "rest-spot-1",
  "socialIntent": "observe",
  "reason": "刚刚连续被追逐，压力高，且当前夜间更适合退回休息点。"
}
```

### Candidate Action Strategy

当前规则逻辑不要删。
要把现有规则系统拆成两层：

#### Layer A: deterministic candidate builder

由当前 `simulation.ts` 提供 3 到 6 个候选动作，例如：

- `sleep`
- `eat`
- `hide`
- `wander`
- `play`
- `seek_owner`

每个 candidate 必须附带：

- activity
- target tile / target object / target pet
- short summary

#### Layer B: LLM action selection

LLM 只能在候选集中选择。

失败时直接走 deterministic baseline。

### Important Constraint

LLM 不负责：

- 计算精确数值
- 设置最终 stress/hunger/energy
- 创建对象
- 处理非法 tile

这些仍归 `simulation.ts` 负责。

### Success Criteria

- `chooseActivity()` 不再是单一路径
- 每次重定向行为后，`state.lastAutonomyDecision` 都有记录
- 在 LLM 关闭模式下，系统仍然稳定运行
- 在 LLM 开启时，同条件下 pet 会表现出更高的个体差异

---

## Phase 3: Social Intent As First-Class Logic

### Objective

把“宠物之间的关系变化”从纯规则 + 台词装饰，升级成：

1. 先判断社交意图
2. 再生成对话
3. 最后更新关系和事件

### Files

- 新建 `lib/ai/social-intent.ts`
- 修改 `lib/ai/social-chat.ts`
- 修改 `lib/domain/simulation.ts`

### New Concept

新增 `SocialIntent`：

- `approach`
- `invite_play`
- `tease`
- `observe`
- `avoid`
- `reassure`

### Flow

现有 `maybeEmitSocialDialogue()` 改为：

1. 先根据双方状态、关系、记忆生成 `social_intent`
2. 再根据 intent 映射为 interaction tone
3. 再调用 `generateSocialExchange()`
4. 最后更新：
   - `PetRelationship`
   - `PetMemory`
   - `PetEvent.socialLines`

### Why

现在的 `social_chat` 更像“发生了互动之后补一句对白”。
Phase 3 后要变成“因为它决定靠近/试探/挑衅，所以互动发生了”。

### Success Criteria

- 相同的 `play/scuffle/chase` 行为，在不同 pet 组合上会有不同社交意图
- `friend`、`enemy`、`familiar` 会真正影响 pet 的主动接近和退避
- 社交事件不仅有台词，也有可追踪的 intent

---

## Phase 4: Long-Term Memory Compression

### Objective

让 pet 不只是存很多事件，而是能拥有“自己怎么理解这些经历”的长期记忆。

### Files

- 新建 `lib/ai/memory-digest.ts`
- 修改 `lib/ai/memory-extractor.ts`
- 修改 `lib/domain/social.ts`
- 修改 `lib/domain/autonomy.ts`
- 修改 `lib/domain/simulation.ts`

### Two-Layer Memory Model

#### Layer A: Episodic Memory

保留现有：

- `PetMemory`
- 带 `kind`
- 带 `weight`
- 带衰减

#### Layer B: Semantic Memory Digest

新增压缩后的长期自我叙述：

- 我讨厌什么
- 我把谁当朋友
- 我在哪些地方会放松
- 我最近更倾向防御还是探索

### Refresh Triggers

不要每 tick 刷新。
只在这些时机刷新：

- 新增高权重 memory
- 关系跨阈值（neutral -> friend / enemy）
- 主人发生显著互动
- pet 连续多次在同一区重复某行为

### Output Style

Memory digest 必须是“给 pet 自己用”的近距离摘要，不是旁白说明书。

坏例子：

- “该宠物喜欢待在树边”

好例子：

- “它已经把树影附近当成自己比较安全的边界”

### Success Criteria

- persona prompt 中能稳定读到 digest
- chat / action / social intent 能引用 digest 影响行为
- digest 可追踪更新时间和来源

---

## Phase 5: Persona Prompt Refactor

### Objective

让当前 `buildPetPersona()` 不只拼接“性格分数 + 最近事件”，而是明确区分：

- 固定自我
- 当前状态
- 长期记忆
- 社交位置
- 当前情境

### Files

- `lib/ai/pet-persona.ts`
- `lib/ai/pet-voice.ts`

### Prompt Structure

建议分 5 段：

1. `Who you are`
2. `What you want lately`
3. `What state you are in now`
4. `Who is around you`
5. `How you should speak / decide`

### Critical Improvement

当前 persona 更适合“说话”。
改造后 persona 要同时适合：

- 聊天
- 内心独白
- 行为决策
- 社交意图
- 记忆压缩

所以建议拆成：

- `buildPetVoicePrompt()`
- `buildPetDecisionPrompt()`
- `buildPetNarrationPrompt()`

而不是一份 prompt 服务所有任务。

### Success Criteria

- prompt 使用者按任务分开
- action director 不再吃整份冗长聊天 prompt
- token 成本下降，角色稳定性提升

---

## Phase 6: Debug / Observability

### Objective

让 owner 和开发者能理解 pet 的自治行为，不然系统越像 agent，越难调。

### Files

- `lib/repository/index.ts`
- `app/pets/[petId]/page.tsx`
- 可选：新增 `app/api/pets/[petId]/autonomy/route.ts`

### Pet Details Page Additions

在详情页新增一块 `Autonomy` 面板，展示：

- core identity
- motivations
- comfort sources
- stress signals
- social strategy
- memory digest
- last autonomy decision

last decision 至少要显示：

- goal
- chosen activity
- source (`llm` / `fallback`)
- reason
- candidate list
- social intent
- decided time

### Optional Admin Extension

如果后续要做更强调试，再加：

- 每次 tick 的 action trace
- per-pet LLM call count
- cache hit/miss

### Success Criteria

- 打开 pet detail 能看出“它为什么这样行动”
- 不需要翻日志就能判断是规则触发还是 LLM 触发

---

## Recommended Execution Order

严格按这个顺序做，不要并行乱改：

1. `Phase 1` 数据结构和 backfill
2. `Phase 2` action director 主链路
3. `Phase 3` social intent
4. `Phase 4` long-term memory digest refresh
5. `Phase 5` prompt 拆分
6. `Phase 6` debug surface

原因：

- 没有持久化 profile，后续 prompt 都不稳
- 没有 action director，pet 还只是“会说话的规则 NPC”
- 没有 social intent，就无法形成像样的宠物社会

---

## Rollout Strategy

### Step 1: Safe Toggle

给 Action Director 增加软开关：

- `LLM_AUTONOMY_ENABLED=true|false`

关闭时：

- 系统仍走旧规则
- 只保留现有 chat / narration / inner voice

### Step 2: Partial Rollout

先只对公开宠物启用，或只对特定 zone 启用：

- `orchard`
- `pond`

### Step 3: Full Rollout

确认 token 成本和稳定性后，再给全部 public pets 开启。

---

## Anti-Patterns To Avoid

以下事情不要做：

1. 不要让 LLM 直接返回最终 `PetState`
2. 不要把所有任务共用一个超长 prompt
3. 不要每个 tick 都请求 LLM
4. 不要让 pet 的长期人格只存在于内存，不做持久化
5. 不要只生成台词，不记录意图和理由
6. 不要让 debug 信息只存在 console

---

## Definition Of Done

只有满足以下条件，才算这次自治升级完成：

1. 每只 pet 都有持久化 autonomy profile
2. 每只 pet 都有可读的长期记忆摘要
3. 模拟主循环中存在 `candidate -> LLM choose -> execute` 的行为决策链
4. 社交互动先有 intent 再有对话
5. 详情页能看到最后一次自治决策及理由
6. LLM 挂掉时系统可完整回退到 deterministic 模式
7. `lint`、`test`、`build` 全绿

---

## Short Summary

你这个项目最正确的演进方向，不是“让 pet 更会聊天”，而是：

把 pet 从“有性格的 UI 角色”升级成“有持续 agency 的行动体”。

这份 plan 的核心就是三句话：

- 先把 pet 的长期自我存下来
- 再让 LLM 在候选动作里做决策
- 最后把决策理由和长期记忆暴露出来，便于调试和迭代
