import { sanitizePetUtterance } from "@/lib/ai/content-safety";
import { getLLMProvider } from "@/lib/ai/llm-provider";
import { buildPetNarrationPrompt, type PersonaContext } from "@/lib/ai/pet-persona";
import { estimateTokensFromText, executeLLMTask, type LLMExecutionMode } from "@/lib/ai/rate-limiter";
import { env } from "@/lib/env";
import type { Pet, PetEvent } from "@/lib/types";

export interface NarrationContext extends PersonaContext {
  fallbackBody: string;
  relatedPet?: Pet;
}

export async function narrateEvent(
  event: PetEvent,
  pet: Pet,
  context: NarrationContext,
  mode: LLMExecutionMode = "blocking",
): Promise<string> {
  const cacheKey = `narrator:${pet.id}:${event.type}:${event.zoneId}:${context.state.mood}:${context.worldState.phase}`;
  const systemPrompt = `
你是一个温柔、克制、会写像素宠物生活切片的叙事者。

${buildPetNarrationPrompt(pet, context.state, context)}

写作要求：
- 把事件改写成 1 句中文叙事。
- 画面感要强，但不要过长，控制在 24 到 52 个汉字。
- 不要出现“AI”“模型”“系统”等词。
- 不要脱离当前事件，不要增加不存在的设定。
`.trim();
  const userPrompt = `事件类型：${event.type}。基础描述：${context.fallbackBody}${context.relatedPet ? `。相关宠物：${context.relatedPet.name}` : ""}。请改写成更有画面的叙事。`;

  try {
    const raw = await executeLLMTask({
      cacheKey,
      ttlMs: 1000 * 60 * 10,
      petId: pet.id,
      estimatedTokens: estimateTokensFromText(systemPrompt, userPrompt),
      mode,
      fallbackValue: context.fallbackBody,
      task: async () =>
        (
          await getLLMProvider().chat({
          systemPrompt,
          model: env.llmModelNarration,
          messages: [{ role: "user", content: userPrompt }],
          maxTokens: 120,
          temperature: 0.65,
          timeoutMs: 1000,
          })
        ).content,
    });

    return sanitizePetUtterance(raw, {
      maxChars: 80,
      fallback: context.fallbackBody,
    });
  } catch {
    return context.fallbackBody;
  }
}
