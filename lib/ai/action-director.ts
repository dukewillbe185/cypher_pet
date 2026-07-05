import { extractJsonBlock, getLLMProvider } from "@/lib/ai/llm-provider";
import { buildPetDecisionPrompt, type PersonaContext } from "@/lib/ai/pet-persona";
import { estimateTokensFromText, executeLLMTask, type LLMExecutionMode } from "@/lib/ai/rate-limiter";
import { env } from "@/lib/env";
import type {
  GardenZoneId,
  Pet,
  PetActivity,
  PetAutonomyDecision,
  PetDecisionCandidateSummary,
  PetDrive,
  SocialIntent,
} from "@/lib/types";

export interface PetActionCandidate extends PetDecisionCandidateSummary {
  tileX: number;
  tileY: number;
  zoneId?: GardenZoneId;
}

interface DirectorInput {
  pet: Pet;
  context: PersonaContext;
  candidates: PetActionCandidate[];
  mode?: LLMExecutionMode;
}

function fallbackGoal(activity: PetActivity): PetDrive {
  switch (activity) {
    case "sleep":
      return "seek_rest";
    case "eat":
    case "drink":
      return "seek_food";
    case "play":
    case "chase":
      return "seek_play";
    case "seek_owner":
      return "seek_owner";
    case "hide":
      return "avoid_threat";
    case "groom":
      return "self_maintain";
    case "sunbathe":
    case "climb_tree":
      return "guard_spot";
    default:
      return "explore";
  }
}

function fallbackSocialIntent(activity: PetActivity): SocialIntent | undefined {
  if (activity === "play") {
    return "invite_play";
  }

  if (activity === "scuffle" || activity === "chase") {
    return "tease";
  }

  if (activity === "hide") {
    return "avoid";
  }

  if (activity === "look_around" || activity === "watch_fish") {
    return "observe";
  }

  return undefined;
}

function fallbackDecision(candidate: PetActionCandidate, candidates: PetActionCandidate[]): PetAutonomyDecision {
  return {
    goal: fallbackGoal(candidate.activity),
    chosenActivity: candidate.activity,
    source: "fallback",
    reason: candidate.summary,
    candidates: candidates.map(({ activity, summary, targetObjectId, targetPetId, targetZoneId }) => ({
      activity,
      summary,
      targetObjectId,
      targetPetId,
      targetZoneId,
    })),
    targetPetId: candidate.targetPetId,
    targetObjectId: candidate.targetObjectId,
    targetZoneId: candidate.targetZoneId ?? candidate.zoneId,
    socialIntent: fallbackSocialIntent(candidate.activity),
    decidedAt: new Date().toISOString(),
  };
}

export async function decidePetAction(input: DirectorInput): Promise<PetAutonomyDecision> {
  const baseline = input.candidates[0];
  if (!baseline) {
    return {
      goal: "explore",
      chosenActivity: "wander",
      source: "fallback",
      reason: "没有可选动作时默认继续巡游。",
      candidates: [],
      socialIntent: "observe",
      decidedAt: new Date().toISOString(),
    };
  }

  const fallback = fallbackDecision(baseline, input.candidates);
  const systemPrompt = `
你正在担任一只赛博花园宠物的行为导演。

${buildPetDecisionPrompt(input.pet, input.context.state, input.context)}

你不能创造新的动作，只能从候选动作里选一个。
你优先考虑：
- 这只宠物此刻真正想做什么
- 长期人格和长期记忆是否支持这个动作
- 当前情绪、压力、饥饿、精力是否合理
- 周围是否有值得靠近、回避或观察的对象

输出 JSON：
{
  "goal": "seek_rest",
  "chosenActivity": "sleep",
  "targetPetId": null,
  "targetObjectId": null,
  "targetZoneId": null,
  "socialIntent": "observe",
  "reason": "一句简短原因"
}

规则：
- chosenActivity 必须严格来自候选列表
- goal 只能是 seek_rest, seek_food, seek_play, seek_owner, seek_friend, avoid_threat, guard_spot, self_maintain, explore
- targetZoneId 只能来自候选列表里的 targetZoneId，或留空
- socialIntent 只能是 approach, invite_play, tease, observe, avoid, reassure，或留空
- 不要输出解释文字，不要输出 markdown，只返回 JSON
  `.trim();

  const userPrompt = `
当前候选动作：
${JSON.stringify(
    input.candidates.map(({ activity, summary, targetObjectId, targetPetId, targetZoneId }) => ({
      activity,
      summary,
      targetObjectId: targetObjectId ?? null,
      targetPetId: targetPetId ?? null,
      targetZoneId: targetZoneId ?? null,
    })),
    null,
    2,
  )}
  `.trim();

  try {
    const raw = await executeLLMTask({
      cacheKey: `action-director:${input.pet.id}:${input.context.state.mood}:${input.context.state.activity}:${input.candidates
        .map((candidate) => `${candidate.activity}:${candidate.targetPetId ?? "-"}:${candidate.targetObjectId ?? "-"}`)
        .join("|")}`,
      ttlMs: 1000 * 20,
      petId: input.pet.id,
      estimatedTokens: estimateTokensFromText(systemPrompt, userPrompt),
      mode: input.mode ?? "cache-first",
      fallbackValue: JSON.stringify(fallback),
      task: async () =>
        (
          await getLLMProvider().chat({
          systemPrompt,
          model: env.llmModelAction || env.llmModelSocial || env.llmModelNarration,
          messages: [{ role: "user", content: userPrompt }],
          maxTokens: 160,
          temperature: 0.45,
          timeoutMs: 1400,
          })
        ).content,
    });

    const parsed = extractJsonBlock<Partial<PetAutonomyDecision>>(raw);
    const chosen = input.candidates.find((candidate) => candidate.activity === parsed?.chosenActivity);

    if (!chosen) {
      return fallback;
    }

    return {
      goal: (parsed?.goal as PetDrive | undefined) ?? fallbackGoal(chosen.activity),
      chosenActivity: chosen.activity,
      source: "llm",
      reason: parsed?.reason?.trim() || chosen.summary,
      candidates: fallback.candidates,
      targetPetId: chosen.targetPetId,
      targetObjectId: chosen.targetObjectId,
      targetZoneId: chosen.targetZoneId ?? chosen.zoneId,
      socialIntent: parsed?.socialIntent ?? fallbackSocialIntent(chosen.activity),
      decidedAt: new Date().toISOString(),
    };
  } catch {
    return fallback;
  }
}
