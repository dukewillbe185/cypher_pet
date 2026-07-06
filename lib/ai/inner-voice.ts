import { clampBubbleText } from "@/lib/ai/content-safety";
import { getLLMProvider } from "@/lib/ai/llm-provider";
import { buildPetVoicePrompt, type PersonaContext } from "@/lib/ai/pet-persona";
import { estimateTokensFromText, executeLLMTask, type LLMExecutionMode } from "@/lib/ai/rate-limiter";
import { env } from "@/lib/env";
import type { Pet, PetState, SpeechBubbleKind } from "@/lib/types";

export type InnerVoiceTrigger =
  | "activity_change"
  | "mood_change"
  | "social_encounter"
  | "owner_nearby"
  | "random";

function trimBubbleText(text: string) {
  return clampBubbleText(text);
}

function fallbackInnerVoice(pet: Pet, state: PetState, trigger: InnerVoiceTrigger) {
  if (state.activity === "climb_tree") {
    return "高一点，风也更懂事。";
  }

  if (state.activity === "chase") {
    return pet.species === "dog" ? "等我一下，马上追上！" : "不许碰我的尾巴。";
  }

  if (state.activity === "sleep") {
    return pet.species === "cat" ? "先眯一下，不许吵。" : "呼……等我醒了再玩。";
  }

  if (trigger === "social_encounter") {
    return pet.species === "cat" ? "今天先看看你想干嘛。" : "嘿，你也在这儿！";
  }

  if (state.mood === "lonely") {
    return "怎么突然安静下来了。";
  }

  if (state.mood === "grumpy") {
    return "别挤，我今天脾气一般。";
  }

  return pet.species === "cat" ? "这一带现在归我巡。": "今天的草地看起来很能跑。";
}

export async function generateInnerVoice(
  pet: Pet,
  state: PetState,
  context: PersonaContext,
  trigger: InnerVoiceTrigger,
  mode: LLMExecutionMode = "blocking",
  options?: {
    /** Hot simulation paths keep the 900ms guard; background jobs can wait. */
    timeoutMs?: number;
    /** Extra cache-key salt so ambient lines vary across visits. */
    cacheSalt?: string;
    /** A concrete in-world moment to react to (e.g. "你刚跟 Nyx 起了冲突"). */
    situation?: string;
    /** Recent lines the pet said; the model is told not to repeat them. */
    avoidLines?: string[];
  },
): Promise<{ text: string; kind: SpeechBubbleKind; source: "llm" | "fallback" }> {
  const situationKey = options?.situation ? `:${options.situation}` : "";
  const cacheKey = `inner-voice:${pet.id}:${state.activity}:${state.mood}:${trigger}${situationKey}:${context.worldState.phase}${
    options?.cacheSalt ? `:${options.cacheSalt}` : ""
  }`;
  const avoidDirective =
    options?.avoidLines && options.avoidLines.length > 0
      ? `\n最近你已经说过这些，别重复、也别换个说法重说：${options.avoidLines
          .slice(0, 6)
          .map((line) => `「${line}」`)
          .join("、")}`
      : "";
  const systemPrompt = `${buildPetVoicePrompt(pet, state, context)}\n\n请输出一句 6 到 14 个汉字以内的内心独白，不要加引号，不要加解释。${avoidDirective}`;
  const userPrompt = options?.situation
    ? `此刻的处境：${options.situation}\n请说出 ${pet.name} 此刻脱口而出、最像它自己的一句话。`
    : `触发原因：${trigger}。请给出 ${pet.name} 此刻最像它自己的想法。`;
  const fallbackText = fallbackInnerVoice(pet, state, trigger);

  try {
    const reply = await executeLLMTask({
      cacheKey,
      ttlMs: 1000 * 60 * 5,
      petId: pet.id,
      estimatedTokens: estimateTokensFromText(systemPrompt, userPrompt),
      mode,
      fallbackValue: fallbackText,
      task: async () =>
        (
          await getLLMProvider().chat({
          systemPrompt,
          model: env.llmModelNarration,
          messages: [{ role: "user", content: userPrompt }],
          maxTokens: 60,
          temperature: 0.8,
          timeoutMs: options?.timeoutMs ?? 900,
          })
        ).content,
    });

    const trimmed = trimBubbleText(reply);

    return {
      text: trimmed || trimBubbleText(fallbackText),
      kind: trigger === "social_encounter" ? "speech" : "thought",
      source: trimmed && trimmed !== trimBubbleText(fallbackText) ? "llm" : "fallback",
    };
  } catch {
    return {
      text: trimBubbleText(fallbackText),
      kind: trigger === "social_encounter" ? "speech" : "thought",
      source: "fallback",
    };
  }
}
