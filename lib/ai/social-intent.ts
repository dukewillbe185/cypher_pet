import { extractJsonBlock, getLLMProvider } from "@/lib/ai/llm-provider";
import { buildPetDecisionPrompt, type PersonaContext } from "@/lib/ai/pet-persona";
import { estimateTokensFromText, executeLLMTask, type LLMExecutionMode } from "@/lib/ai/rate-limiter";
import { env } from "@/lib/env";
import type { Pet, SocialIntent } from "@/lib/types";
import type { SocialInteraction } from "@/lib/ai/social-chat";

export interface SocialIntentDecision {
  intent: SocialIntent;
  interaction: SocialInteraction;
  affinityChange: number;
  rivalryChange: number;
  reason: string;
  source: "fallback" | "llm";
}

function fallbackIntent(interaction: SocialInteraction): SocialIntentDecision {
  if (interaction === "scuffle") {
    return {
      intent: "tease",
      interaction,
      affinityChange: -2,
      rivalryChange: 5,
      reason: "冲突型动作默认带有挑衅和防御意味。",
      source: "fallback",
    };
  }

  if (interaction === "chase") {
    return {
      intent: "tease",
      interaction,
      affinityChange: -3,
      rivalryChange: 7,
      reason: "追逐默认会提升紧张感和敌意。",
      source: "fallback",
    };
  }

  if (interaction === "first_meet") {
    return {
      intent: "approach",
      interaction,
      affinityChange: 2,
      rivalryChange: 0,
      reason: "初次接触优先判定为试探性靠近。",
      source: "fallback",
    };
  }

  if (interaction === "reunion") {
    return {
      intent: "reassure",
      interaction,
      affinityChange: 4,
      rivalryChange: -1,
      reason: "重逢型互动会强化稳定关系。",
      source: "fallback",
    };
  }

  return {
    intent: "invite_play",
    interaction,
    affinityChange: 4,
    rivalryChange: 0,
    reason: "一般友好互动默认会向玩耍和靠近倾斜。",
    source: "fallback",
  };
}

export async function decideSocialIntent(input: {
  petA: Pet;
  petB: Pet;
  interaction: SocialInteraction;
  petAContext: PersonaContext;
  petBContext: PersonaContext;
  mode?: LLMExecutionMode;
}): Promise<SocialIntentDecision> {
  const fallback = fallbackIntent(input.interaction);
  const systemPrompt = `
你要判断两只赛博花园宠物在这次接触中的社交意图。

## 宠物 A
${buildPetDecisionPrompt(input.petA, input.petAContext.state, input.petAContext)}

## 宠物 B
${buildPetDecisionPrompt(input.petB, input.petBContext.state, input.petBContext)}

输出 JSON：
{
  "intent": "invite_play",
  "interaction": "${input.interaction}",
  "affinityChange": 4,
  "rivalryChange": 0,
  "reason": "一句简短原因"
}

规则：
- intent 只能是 approach, invite_play, tease, observe, avoid, reassure
- interaction 只能是 play, scuffle, chase, bond, first_meet, reunion
- affinityChange 取值 -6 到 8
- rivalryChange 取值 -2 到 10
- 不输出 markdown，不输出解释文字，只返回 JSON
  `.trim();

  const userPrompt = `当前接触类型：${input.interaction}。请判断这两只宠物这次真正的社交意图。`;

  try {
    const raw = await executeLLMTask({
      cacheKey: `social-intent:${input.petA.id}:${input.petB.id}:${input.interaction}:${input.petAContext.state.mood}:${input.petBContext.state.mood}`,
      ttlMs: 1000 * 30,
      petId: input.petA.id,
      estimatedTokens: estimateTokensFromText(systemPrompt, userPrompt),
      mode: input.mode ?? "cache-first",
      fallbackValue: JSON.stringify(fallback),
      task: async () =>
        (
          await getLLMProvider().chat({
          systemPrompt,
          model: env.llmModelSocial || env.llmModelAction || env.llmModelNarration,
          messages: [{ role: "user", content: userPrompt }],
          maxTokens: 140,
          temperature: 0.5,
          timeoutMs: 1200,
          })
        ).content,
    });

    const parsed = extractJsonBlock<Partial<SocialIntentDecision>>(raw);
    if (!parsed?.intent) {
      return fallback;
    }

    return {
      intent: parsed.intent,
      interaction: parsed.interaction ?? fallback.interaction,
      affinityChange: Math.max(-6, Math.min(8, parsed.affinityChange ?? fallback.affinityChange)),
      rivalryChange: Math.max(-2, Math.min(10, parsed.rivalryChange ?? fallback.rivalryChange)),
      reason: parsed.reason?.trim() || fallback.reason,
      source: "llm",
    };
  } catch {
    return fallback;
  }
}
