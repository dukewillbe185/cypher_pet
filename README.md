# Cypher Garden

中文优先、移动端优先的赛博朋克像素宠物世界。用户上传猫狗照片后生成像素分身，宠物会进入公共花园，在不同分区里自己生活、发呆、拉屎、追逐和打闹。Phase 2 之后，宠物还会拥有 LLM 驱动的人格、内心独白、社交对话、叙事事件流，以及可直接聊天的抽屉面板。当前版本进一步加入了 autonomy profile、长期记忆摘要、候选动作决策器和社交意图层，让 pet 的行为不再只是规则随机，而是开始带有连续人格。

最新版本把 `/garden` 从"俯瞰监控台"改成了**可进入的世界**：

- 玩家有一个赛博化身，可以用 WASD / 方向键 / 点击地面 / 按住拖动在花园里走动，镜头跟随玩家
- 宠物不再瞬移，而是沿 A* 寻路的路径真实走过去（避开水面），步态、朝向、动画速度都跟随移动速度
- 玩家的位置会上报给模拟层（garden presence）：宠物会主动跑过来找主人、在脚边打招呼；每天第一次进花园还有重逢奖励
- 走到自己宠物身边会浮出贴身互动 chips（喂食 / 抚摸 / 玩具 / 清理 / 聊天）；离得远时可以"呼唤"它自己跑过来
- 新增成长循环：每次照顾累积 growth XP 和羁绊 bond，宠物会从「数据幼体」进化到「同步体」再到「觉醒体」，体型和 HUD 都会变化
- 走到分区东西两侧的霓虹传送门可以直接步行切换分区；原先环绕画布的分析面板收进了可折叠的「世界监控台」

## 当前实现

- `Next.js App Router + TypeScript + Tailwind CSS + Framer Motion`
- `PixiJS + @pixi/react` 渲染公共像素花园
- 本地 `Qwen 3.5 35B` OpenAI-compatible endpoint 负责聊天、独白、社交对话、动作选择和叙事
- 默认可直接跑的 mock 数据层，数据文件在 `storage/mock-db.runtime.json`
- 配置 `DATABASE_URL` 后，仓储层会自动切到 PostgreSQL 单表 runtime store
- Supabase Auth 接口与 SQL migration 已落位
- 每只 pet 会维护一份长期 autonomy profile 和 memory digest，并在详情页展示最近一次自主决策
- 完整页面：
  - `/`
  - `/garden`
  - `/auth/sign-in`
  - `/onboarding`
  - `/me`
  - `/pets/new`
  - `/pets/[petId]`
  - `/notifications`
  - `/admin/reports`
- 当前 API：
  - `GET/POST /api/chat/:petId`
  - `GET /api/pets/:petId/inner-voice`
  - `POST /api/pets/:petId/social-chat`
  - `POST /api/garden/narrate`
  - `GET /api/garden/events-stream`
  - `POST /api/pets`
  - `POST /api/pets/:petId/source-photo`
  - `POST /api/pets/:petId/generations`
  - `GET /api/garden/snapshot`
  - `POST /api/garden/presence`
  - `POST /api/pets/:petId/actions`
  - `GET /api/pets/:petId/journal`
  - `GET /api/me/pets/status`
  - `GET /api/notifications`
  - `POST /api/reports`
  - `POST /api/webhooks/image-generation`

## 花园模型

- 4 个固定分区：
  - `orchard` 果树区
  - `pond` 水池区
  - `grove` 灌木区
  - `dog-run` 追逐区
- 每个分区最多返回 `24` 只公开宠物
- 私密宠物不会进入公共花园
- 冻结宠物不会被渲染，也不会参与模拟
- 世界状态（位置 / 需求 / 物件）持续走 `3.5s` snapshot 轮询；叙事事件走 `SSE`，SSE 断开时 transport 标记为 polling
- 玩家化身位置每 `4s` 上报一次 `POST /api/garden/presence`；presence 90 秒内视为"主人在场"，`seek_owner` 会直接把宠物导向主人真实坐标
- 客户端宠物移动使用 48x48 walkability 网格上的 A* 寻路（水面不可走、桥会打开通道），路径经过 line-of-sight 平滑
- 聊天、独白、叙事、社交对话、动作决策统一走 `lib/ai/*`，带内存缓存和限流
- 模拟层采用“规则候选动作 + LLM 选一个 + 规则提交世界状态”的混合架构
- 社交互动分成两步：先判断社交意图，再生成对话台词

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

如果你本地已经启动了 OpenAI-compatible 的 Qwen 服务，当前项目只会调用外部服务，不会再从项目内部拉起 bridge 或模型进程。

当前默认接入配置：

- Base URL: `http://127.0.0.1:8888/v1`
- API Key: `1234`
- Model ID: `Qwen3.5-35B-A3B-4bit`

项目会向 `POST /chat/completions` 发请求，并自动带上 `Authorization: Bearer $LLM_API_KEY`。

推荐的 `.env.local` 最小配置：

```bash
LLM_BASE_URL=http://127.0.0.1:8888/v1
LLM_API_KEY=1234
LLM_MODEL_CHAT=Qwen3.5-35B-A3B-4bit
LLM_MODEL_NARRATION=Qwen3.5-35B-A3B-4bit
LLM_MODEL_SOCIAL=Qwen3.5-35B-A3B-4bit
LLM_MODEL_ACTION=Qwen3.5-35B-A3B-4bit
```

未配置 Supabase 时：

- 登录页会自动走 demo 模式
- 可直接用这些邮箱进入不同身份：
  - `luna@cypher.pet`
  - `mars@cypher.pet`
  - `admin@cypher.pet`

如果你之前运行过旧版 plaza，当前版本会在读到旧的 `storage/mock-db.runtime.json` 时自动重置为新的 garden seed。

## 方案 A：本地 24/7 自治 Demo

这版会在本地持续触发 `advanceStoreToNow()`。如果配置了 `DATABASE_URL`，worker 和 Web 进程会共享同一份 PostgreSQL store；否则继续使用本地 JSON 文件：

```bash
npm run dev
npm run garden:worker
```

默认每 `15s` tick 一次，配置项：

- `GARDEN_TICK_SECRET`
- `GARDEN_TICK_INTERVAL_MS`
- `GARDEN_TICK_BASE_URL`
- `GARDEN_TICK_MATERIALIZE`
- `GARDEN_TICK_MATERIALIZE_MIN_INTERVAL_MS`

当前 worker 会调用本地 `POST /api/admin/garden/tick`，并强制使用 `llmMode: "off"`，这样能稳定跑自治世界，不会把 LLM 吞吐打满。

如果开启 `GARDEN_TICK_MATERIALIZE=true`，每次 tick 之后还会按最小间隔自动刷新一次 `public.runtime_*` projection 表。默认最小间隔是 `60s`，避免每个 tick 都重建投影。

首页现在也有一块 live signal radar：

- 登录用户优先看到自己的 notifications
- 游客会看到公共花园的最新事件
- 前端会自动轮询 `/api/home/signals`，不需要先进入 `/garden`

如果你需要把 `app_runtime_store` 展开成一组便于 SQL 查询的 projection 表：

```bash
npm run db:materialize
```

这个命令会生成 `public.runtime_*` 表，例如：

- `runtime_profiles`
- `runtime_pets`
- `runtime_pet_states`
- `runtime_pet_events`
- `runtime_notifications`
- `runtime_chat_messages`

## 环境变量

- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTHOG_KEY`
- `POSTHOG_HOST`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `SENTRY_DSN`
- `CYPHER_DEMO_ADMIN_EMAIL`
- `IMAGE_PROVIDER`
- `IMAGE_PROVIDER_WEBHOOK_SECRET`
- `LLM_PROVIDER`
- `LLM_BASE_URL`
- `LLM_API_KEY`
- `LLM_MODEL_CHAT`
- `LLM_MODEL_NARRATION`
- `LLM_MODEL_SOCIAL`
- `LLM_MODEL_ACTION`
- `LLM_BRIDGE_PYTHON`
- `LLM_BRIDGE_SCRIPT`
- `LLM_BRIDGE_MODEL_PATH`
- `LLM_TIMEOUT_MS`
- `LLM_RATE_LIMIT_PER_PET`
- `LLM_RATE_LIMIT_PER_USER`
- `LLM_GLOBAL_TOKEN_BUDGET_PER_MINUTE`
- `LLM_INTERACTIVE_RATE_LIMIT_PER_PET`
- `LLM_INTERACTIVE_RATE_LIMIT_PER_USER`
- `LLM_INTERACTIVE_TOKEN_BUDGET_PER_MINUTE`
- `LLM_AUTONOMY_ENABLED`
- `LLM_AUTONOMY_PUBLIC_ONLY`
- `LLM_AUTONOMY_ZONES`
- `GARDEN_TICK_SECRET`
- `GARDEN_TICK_INTERVAL_MS`
- `GARDEN_TICK_BASE_URL`
- `GARDEN_TICK_MATERIALIZE`
- `GARDEN_TICK_MATERIALIZE_MIN_INTERVAL_MS`

Action Director rollout:

- `LLM_AUTONOMY_ENABLED=false` 时，行为决策完整回退到 deterministic baseline
- `LLM_AUTONOMY_PUBLIC_ONLY=true` 时，只对公开宠物启用 autonomy 选动作
- `LLM_AUTONOMY_ZONES=orchard,pond` 时，只在这些 zone 里启用 Action Director

聊天安全：

- 会拦截明显的 prompt injection，例如索要 system prompt、要求忽略规则
- Persona prompt 明确禁止跳出宠物角色和输出不当内容

## Supabase

- SQL schema 在 [001_initial_schema.sql](/Users/dukeisyourdaddy/Desktop/cypher_pet/supabase/migrations/001_initial_schema.sql)
- Phase 2 聊天 / LLM 扩展在 [002_phase2_chat_and_llm.sql](/Users/dukeisyourdaddy/Desktop/cypher_pet/supabase/migrations/002_phase2_chat_and_llm.sql)
- 当前 schema 覆盖：
  - `profiles`
  - `pets`
  - `source_photos`
  - `pet_generations`
  - `garden_zones`
  - `pet_states`
  - `pet_events`
  - `world_objects`
  - `pet_relationships`
  - `owner_actions`
  - `chat_sessions`
  - `chat_messages`
  - `notifications`
  - `reports`

说明：

- 未配置 `DATABASE_URL` 时，业务数据默认走本地文件仓储，方便空仓库直接试跑
- 配置 `DATABASE_URL` 后，`lib/repository/store.ts` 会优先读写 `public.app_runtime_store`
- 接上真实 Supabase 后，可以把 `lib/repository` 逐步替换为数据库实现，不需要改页面和 API 形状

## 验证

```bash
npm run lint
npm run test
npm run build
```
