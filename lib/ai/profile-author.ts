import { extractJsonBlock, getLLMProvider } from "@/lib/ai/llm-provider";
import { estimateTokensFromText, executeLLMTask, type LLMExecutionMode } from "@/lib/ai/rate-limiter";
import { looksLikeMetaReasoning, sanitizePetUtterance } from "@/lib/ai/content-safety";
import { buildSemanticMemoryDigest } from "@/lib/ai/memory-compressor";
import { buildPetBonds, listPetMemories } from "@/lib/domain/social";
import { env } from "@/lib/env";
import type { AppStore, Pet, PetAutonomyProfile, PetState } from "@/lib/types";

type AuthoredProfilePayload = {
  coreIdentity?: string;
  identityNarrative?: string;
  motivations?: string[];
  comfortSources?: string[];
  stressSignals?: string[];
  socialStrategy?: string;
  attachmentStyle?: string;
  conflictStyle?: string;
  favoriteActivities?: string[];
  avoidedActivities?: string[];
  dailyRhythm?: string;
  ownerBondStyle?: string;
  confidence?: number;
};

function asStringList(value: unknown) {
  return Array.isArray(value)
    ? value.map((entry) => (typeof entry === "string" ? entry.trim() : "")).filter(Boolean)
    : [];
}

function fallbackArray(primary: string[], fallback: string[]) {
  return primary.length > 0 ? primary.slice(0, 4) : fallback.slice(0, 4);
}

function normalizeAuthoredProfile(
  payload: AuthoredProfilePayload,
  fallback: PetAutonomyProfile,
  refreshReason: string,
) {
  return {
    ...fallback,
    source: "llm" as const,
    coreIdentity: payload.coreIdentity?.trim() || fallback.coreIdentity,
    identityNarrative: payload.identityNarrative?.trim() || fallback.identityNarrative,
    motivations: fallbackArray(asStringList(payload.motivations), fallback.motivations),
    comfortSources: fallbackArray(asStringList(payload.comfortSources), fallback.comfortSources),
    stressSignals: fallbackArray(asStringList(payload.stressSignals), fallback.stressSignals),
    socialStrategy: payload.socialStrategy?.trim() || fallback.socialStrategy,
    attachmentStyle: payload.attachmentStyle?.trim() || fallback.attachmentStyle,
    conflictStyle: payload.conflictStyle?.trim() || fallback.conflictStyle,
    favoriteActivities: fallbackArray(
      asStringList(payload.favoriteActivities),
      fallback.favoriteActivities,
    ) as PetAutonomyProfile["favoriteActivities"],
    avoidedActivities: fallbackArray(
      asStringList(payload.avoidedActivities),
      fallback.avoidedActivities,
    ) as PetAutonomyProfile["avoidedActivities"],
    dailyRhythm: payload.dailyRhythm?.trim() || fallback.dailyRhythm,
    ownerBondStyle: payload.ownerBondStyle?.trim() || fallback.ownerBondStyle,
    confidence:
      typeof payload.confidence === "number"
        ? Math.max(0, Math.min(1, payload.confidence))
        : fallback.confidence,
    revision: fallback.revision + 1,
    refreshReason,
    updatedAt: new Date().toISOString(),
  } satisfies PetAutonomyProfile;
}

async function repairProfileJson(input: {
  rawContent: string;
  fallback: PetAutonomyProfile;
  pet: Pet;
  state: PetState;
  refreshReason: string;
}) {
  const schemaHint = JSON.stringify(
    {
      coreIdentity: "string",
      identityNarrative: "string",
      motivations: ["string", "string"],
      comfortSources: ["string", "string"],
      stressSignals: ["string", "string"],
      socialStrategy: "string",
      attachmentStyle: "string",
      conflictStyle: "string",
      favoriteActivities: ["wander", "sleep"],
      avoidedActivities: ["scuffle"],
      dailyRhythm: "string",
      ownerBondStyle: "string",
      confidence: 0.72,
    },
    null,
    2,
  );

  const repairPrompt = `
你是一个 JSON 修复器。
把下面关于宠物长期身份的草稿，重写成一个严格 JSON 对象。
只输出 JSON，不要解释，不要英文标题，不要 Thinking Process。
字段必须完整：
coreIdentity, identityNarrative, motivations, comfortSources, stressSignals,
socialStrategy, attachmentStyle, conflictStyle, favoriteActivities, avoidedActivities,
dailyRhythm, ownerBondStyle, confidence

宠物：${input.pet.name}
物种：${input.pet.species}
当前状态：${input.state.mood} / ${input.state.activity} / ${input.state.zoneId}
刷新原因：${input.refreshReason}

如果草稿里信息不足，就尽量保留原有设定，不要凭空写离谱内容。
输出格式示例：
${schemaHint}

原始草稿：
${input.rawContent}
  `.trim();

  const repaired = await getLLMProvider().chat({
    systemPrompt: "只输出一个 JSON 对象。",
    messages: [{ role: "user", content: repairPrompt }],
    model: env.llmModelAction || env.llmModelChat,
    temperature: 0.15,
    maxTokens: 280,
    timeoutMs: 24000,
  });

  return extractJsonBlock<AuthoredProfilePayload>(repaired.content);
}

async function authorIdentityNarrative(input: {
  pet: Pet;
  state: PetState;
  semanticSummary: string;
  fallback: PetAutonomyProfile;
  refreshReason: string;
}) {
  const raw = await getLLMProvider().chat({
    systemPrompt: `
你只做一件事：写出这只宠物稳定、长期、像活物一样的身份叙述。
只输出 1 到 2 句中文，不要 JSON，不要解释，不要 Thinking Process。
语气要像在描述“它一直是谁”，而不是描述一时状态。
    `.trim(),
    messages: [
      {
        role: "user",
        content: `
宠物：${input.pet.name}
物种：${input.pet.species}${input.pet.breed ? ` / ${input.pet.breed}` : ""}
当前状态：${input.state.mood} / ${input.state.activity} / ${input.state.zoneId}
当前长期摘要：${input.semanticSummary}
旧身份：${input.fallback.identityNarrative}
刷新原因：${input.refreshReason}
        `.trim(),
      },
    ],
    model: env.llmModelAction || env.llmModelChat,
    temperature: 0.35,
    maxTokens: 96,
    timeoutMs: 16000,
  });

  const narrative = sanitizePetUtterance(raw.content, {
    maxChars: 96,
    fallback: "",
  });

  if (!narrative || looksLikeMetaReasoning(narrative)) {
    return null;
  }

  return {
    ...input.fallback,
    source: "llm" as const,
    coreIdentity: narrative,
    identityNarrative: narrative,
    revision: input.fallback.revision + 1,
    confidence: Math.max(0.4, input.fallback.confidence),
    refreshReason: input.refreshReason,
    updatedAt: new Date().toISOString(),
  } satisfies PetAutonomyProfile;
}

export async function authorPetAutonomyProfile(input: {
  store: AppStore;
  pet: Pet;
  state: PetState;
  fallback: PetAutonomyProfile;
  refreshReason: string;
  mode?: LLMExecutionMode;
}) {
  const semanticDigest = buildSemanticMemoryDigest(input.store, input.pet);
  const bonds = buildPetBonds(input.store, input.pet.id, 4)
    .map((bond) => `${bond.otherPetName}:${bond.status}(亲近${bond.affinity}/敌对${bond.rivalry})`)
    .join("；");
  const memories = listPetMemories(input.store, input.pet.id, 5)
    .map((memory) => memory.body)
    .join("；");

  const systemPrompt = `
你要为一只花园宠物写“长期身份档案”JSON。
输出严格 JSON，不要代码块，不要解释。
字段：
coreIdentity, identityNarrative, motivations, comfortSources, stressSignals,
socialStrategy, attachmentStyle, conflictStyle, favoriteActivities, avoidedActivities,
dailyRhythm, ownerBondStyle, confidence
要求：
- 保持宠物视角和长期稳定性
- 允许缓慢变化，但不要每次像重生
- 每个数组 2-4 项
- confidence 为 0 到 1 的数字
  `.trim();

  const userPrompt = `
宠物：${input.pet.name}（${input.pet.species}${input.pet.breed ? ` / ${input.pet.breed}` : ""}）
当前状态：${input.state.mood} / ${input.state.activity} / zone=${input.state.zoneId}
现有档案：${input.fallback.coreIdentity}
语义记忆：${semanticDigest.summary}
长期偏好：${semanticDigest.longTermPreferences.join("、") || "暂无"}
长期厌恶：${semanticDigest.longTermAversions.join("、") || "暂无"}
社会判断：${semanticDigest.socialJudgments.join("、") || "暂无"}
和主人的模式：${semanticDigest.ownerInteractionPattern}
关系：${bonds || "暂无"}
记忆：${memories || "暂无"}
刷新原因：${input.refreshReason}
  `.trim();

  try {
    const result = await executeLLMTask({
      cacheKey: `profile-author:${input.pet.id}:${input.refreshReason}:${semanticDigest.summary}`,
      ttlMs: 1000 * 60 * 60 * 4,
      petId: input.pet.id,
      estimatedTokens: estimateTokensFromText(systemPrompt, userPrompt),
      priority: input.refreshReason === "manual-refresh" ? "interactive" : "ambient",
      mode: input.mode ?? "cache-first",
      skipCache: input.refreshReason === "manual-refresh",
      fallbackValue: input.fallback,
      task: async () => {
        const raw = await getLLMProvider().chat({
          systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
          model: env.llmModelAction || env.llmModelChat,
          temperature: 0.35,
          maxTokens: 240,
          timeoutMs: 18000,
        });
        let payload = extractJsonBlock<AuthoredProfilePayload>(raw.content);

        if (!payload || looksLikeMetaReasoning(raw.content)) {
          payload = await repairProfileJson({
            rawContent: raw.content,
            fallback: input.fallback,
            pet: input.pet,
            state: input.state,
            refreshReason: input.refreshReason,
          });
        }

        if (!payload) {
          const identityOnly = await authorIdentityNarrative({
            pet: input.pet,
            state: input.state,
            semanticSummary: semanticDigest.summary,
            fallback: input.fallback,
            refreshReason: input.refreshReason,
          });

          return identityOnly ?? input.fallback;
        }

        return normalizeAuthoredProfile(payload, input.fallback, input.refreshReason);
      },
    });

    if (result.source !== "llm" && input.refreshReason === "manual-refresh") {
      const identityOnly = await authorIdentityNarrative({
        pet: input.pet,
        state: input.state,
        semanticSummary: semanticDigest.summary,
        fallback: input.fallback,
        refreshReason: input.refreshReason,
      });

      return identityOnly ?? result;
    }

    return result;
  } catch {
    if (input.refreshReason === "manual-refresh") {
      const identityOnly = await authorIdentityNarrative({
        pet: input.pet,
        state: input.state,
        semanticSummary: semanticDigest.summary,
        fallback: input.fallback,
        refreshReason: input.refreshReason,
      });

      return identityOnly ?? input.fallback;
    }

    return input.fallback;
  }
}
