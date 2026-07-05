import { sanitizePetUtterance } from "@/lib/ai/content-safety";
import { extractJsonBlock, getLLMProvider } from "@/lib/ai/llm-provider";
import { buildPetVoicePrompt, type PersonaContext } from "@/lib/ai/pet-persona";
import { estimateTokensFromText, executeLLMTask, type LLMExecutionMode } from "@/lib/ai/rate-limiter";
import { env } from "@/lib/env";
import type { Pet, SocialIntent } from "@/lib/types";

export type SocialInteraction = "play" | "scuffle" | "chase" | "bond" | "first_meet" | "reunion";

export interface SocialContext {
  petAContext: PersonaContext;
  petBContext: PersonaContext;
}

export interface SocialExchange {
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

function fallbackExchange(petA: Pet, petB: Pet, interaction: SocialInteraction): SocialExchange {
  if (interaction === "scuffle") {
    return {
      lines: [
        { petId: petA.id, text: `${petB.name}，别挤我。`, emotion: "annoyed" },
        { petId: petB.id, text: "那你先别瞪我。", emotion: "defensive" },
      ],
      relationshipDelta: { affinityChange: -2, rivalryChange: 6 },
    };
  }

  if (interaction === "chase") {
    return {
      lines: [
        { petId: petA.id, text: "跑起来！", emotion: "excited" },
        { petId: petB.id, text: "你别追我尾巴！", emotion: "alarmed" },
      ],
      relationshipDelta: { affinityChange: -3, rivalryChange: 8 },
    };
  }

  if (interaction === "first_meet") {
    return {
      lines: [
        { petId: petA.id, text: `你是 ${petB.name}？`, emotion: "curious" },
        { petId: petB.id, text: "先闻闻再决定。", emotion: "neutral" },
      ],
      relationshipDelta: { affinityChange: 2, rivalryChange: 0 },
    };
  }

  return {
    lines: [
      { petId: petA.id, text: "一起闹一会儿？", emotion: "playful" },
      { petId: petB.id, text: "行，但别太离谱。", emotion: "warm" },
    ],
    relationshipDelta: { affinityChange: 5, rivalryChange: -1 },
  };
}

export async function generateSocialExchange(
  petA: Pet,
  petB: Pet,
  interaction: SocialInteraction,
  context: SocialContext,
  socialIntent?: SocialIntent,
  mode: LLMExecutionMode = "blocking",
): Promise<SocialExchange> {
  const cacheKey = `social:${petA.id}:${petB.id}:${interaction}:${context.petAContext.state.mood}:${context.petBContext.state.mood}`;
  const fallback = fallbackExchange(petA, petB, interaction);
  const systemPrompt = `
你要同时扮演两只生活在赛博花园里的宠物。

## 宠物 A
${buildPetVoicePrompt(petA, context.petAContext.state, context.petAContext)}

## 宠物 B
${buildPetVoicePrompt(petB, context.petBContext.state, context.petBContext)}

请输出 JSON：
{
  "lines": [
    { "petId": "${petA.id}", "text": "一句短台词", "emotion": "情绪标签" },
    { "petId": "${petB.id}", "text": "一句短台词", "emotion": "情绪标签" }
  ],
  "relationshipDelta": { "affinityChange": 0, "rivalryChange": 0 }
}

规则：
- 2 到 4 句。
- 每句不超过 20 个汉字。
- 保持角色一致。
- 不加解释性文字，只返回 JSON。
`.trim();
  const userPrompt = `当前互动类型：${interaction}。社交意图：${socialIntent ?? "未指定"}。请生成这两只宠物此刻会说的话。`;

  try {
    const raw = await executeLLMTask({
      cacheKey,
      ttlMs: 1000 * 60 * 15,
      petId: petA.id,
      estimatedTokens: estimateTokensFromText(systemPrompt, userPrompt),
      mode,
      fallbackValue: JSON.stringify(fallback),
      task: async () =>
        (
          await getLLMProvider().chat({
          systemPrompt,
          model: env.llmModelSocial,
          messages: [{ role: "user", content: userPrompt }],
          maxTokens: 220,
          temperature: 0.8,
          timeoutMs: 1200,
          })
        ).content,
    });
    const parsed = extractJsonBlock<SocialExchange>(raw);

    if (!parsed || !Array.isArray(parsed.lines) || parsed.lines.length < 2) {
      return fallback;
    }

    return {
      lines: parsed.lines.slice(0, 4).map((line, index) => ({
        petId: line.petId || (index % 2 === 0 ? petA.id : petB.id),
        text: sanitizePetUtterance(line.text, {
          maxChars: 20,
          fallback: fallback.lines[index % fallback.lines.length]?.text ?? "……",
        }),
        emotion: line.emotion?.trim() || "neutral",
      })),
      relationshipDelta: {
        affinityChange: parsed.relationshipDelta?.affinityChange ?? 0,
        rivalryChange: parsed.relationshipDelta?.rivalryChange ?? 0,
      },
    };
  } catch {
    return fallback;
  }
}
