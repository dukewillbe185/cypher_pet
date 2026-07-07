import { clampBubbleText } from "@/lib/ai/content-safety";
import { getLLMProvider } from "@/lib/ai/llm-provider";
import { buildPetVoicePrompt, type PersonaContext } from "@/lib/ai/pet-persona";
import { estimateTokensFromText, executeLLMTask } from "@/lib/ai/rate-limiter";
import { env } from "@/lib/env";
import type { Pet, PetState } from "@/lib/types";

export interface DialogueTurn {
  petId: string;
  text: string;
}

export interface DialogueParticipant {
  pet: Pet;
  state: PetState;
  context: PersonaContext;
}

const MAX_DIALOGUE_TURNS = 3;
const CLAMP_SILENCE = clampBubbleText("");

/**
 * Pulls the first JSON array out of a model reply that may be wrapped in
 * fences or prose. Turns are assigned by strict alternation (A opens) — the
 * model's own speaker labels are decoration we don't trust.
 */
export function parseDialogueTurns(raw: string, petAId: string, petBId: string): DialogueTurn[] | null {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end <= start) {
    return null;
  }

  let entries: unknown;
  try {
    entries = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }

  if (!Array.isArray(entries)) {
    return null;
  }

  const turns: DialogueTurn[] = [];
  for (const entry of entries) {
    if (turns.length >= MAX_DIALOGUE_TURNS) {
      break;
    }

    const line =
      typeof entry === "string"
        ? entry
        : entry && typeof entry === "object" && typeof (entry as { line?: unknown }).line === "string"
          ? ((entry as { line: string }).line)
          : null;
    if (line === null) {
      return null;
    }

    const text = clampBubbleText(line);
    if (!text || text === CLAMP_SILENCE) {
      continue;
    }

    turns.push({ petId: turns.length % 2 === 0 ? petAId : petBId, text });
  }

  return turns.length >= 2 ? turns : null;
}

/**
 * One model call stages the whole overheard exchange (2-3 alternating lines).
 * There is deliberately no template fallback: a canned conversation reads
 * worse than silence, so unusable output just returns null.
 */
export async function generatePetDialogue(
  a: DialogueParticipant,
  b: DialogueParticipant,
  input: {
    situation: string;
    sourceEventId: string;
    timeoutMs: number;
    avoidLines?: string[];
  },
): Promise<DialogueTurn[] | null> {
  const avoidDirective =
    input.avoidLines && input.avoidLines.length > 0
      ? `\n- 这些话最近刚说过，别重复也别换个说法重说：${input.avoidLines
          .slice(0, 6)
          .map((line) => `「${line}」`)
          .join("、")}`
      : "";

  const systemPrompt = `你是宠物花园的对话导演，请为两只宠物即兴一小段被主人偶然听到的对话。

## 角色甲：${a.pet.name}
${buildPetVoicePrompt(a.pet, a.state, a.context)}

## 角色乙：${b.pet.name}
${buildPetVoicePrompt(b.pet, b.state, b.context)}

## 导演规则
- 共 2 到 3 句，${a.pet.name} 先开口，两只宠物严格交替发言。
- 每句 6 到 12 个汉字，口语化，贴合各自性格与当前心情，可以呛声、可以示好，但要接得上对方的话。
- 只输出 JSON 数组，不要任何其他文字：[{"speaker":"${a.pet.name}","line":"……"},{"speaker":"${b.pet.name}","line":"……"}]${avoidDirective}`;

  const userPrompt = `此刻的处境：${input.situation}\n请给出这段对话。`;

  let raw: string;
  try {
    // "blocking" so we actually wait for the exchange; a rate-limiter refusal
    // or provider error surfaces as a throw and the dialogue quietly doesn't
    // happen this beat (the un-burned pair cooldown lets the next beat retry).
    raw = await executeLLMTask<string>({
      cacheKey: `pet-dialogue:${input.sourceEventId}`,
      ttlMs: 1000 * 60 * 5,
      petId: a.pet.id,
      estimatedTokens: estimateTokensFromText(systemPrompt, userPrompt),
      mode: "blocking",
      task: async () =>
        (
          await getLLMProvider().chat({
            systemPrompt,
            model: env.llmModelSocial,
            messages: [{ role: "user", content: userPrompt }],
            maxTokens: 180,
            temperature: 0.9,
            timeoutMs: input.timeoutMs,
          })
        ).content,
    });
  } catch {
    return null;
  }

  if (!raw) {
    return null;
  }

  return parseDialogueTurns(raw, a.pet.id, b.pet.id);
}
