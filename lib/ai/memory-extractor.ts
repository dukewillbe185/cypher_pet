import { extractJsonBlock, getLLMProvider } from "@/lib/ai/llm-provider";
import type { PersonaContext } from "@/lib/ai/pet-persona";
import { estimateTokensFromText, executeLLMTask } from "@/lib/ai/rate-limiter";
import { env } from "@/lib/env";
import type { ChatMessage, Pet, PetMemory, PetMemoryKind } from "@/lib/types";

const EMOJI_ACTION_MAP: Array<[RegExp, PetMemoryKind, string]> = [
  [/🍖|🦴|罐头|零食|吃饭/, "favorite_food", "这份食物闻起来值得被单独记住。"],
  [/别闹|不可以|不准|骂|训/, "scary_moment", "刚刚那种语气让我有点缩了一下。"],
  [/小胖|宝宝|乖乖|宝贝|昵称/, "owner_chat", "主人总爱用特别的称呼叫我。"],
];

function fallbackMemory(
  conversation: ChatMessage[],
  pet: Pet,
): Omit<PetMemory, "id" | "createdAt" | "updatedAt"> | null {
  const recentUserMessage = [...conversation]
    .reverse()
    .find((message) => message.participantType === "user")?.content;

  if (!recentUserMessage) {
    return null;
  }

  for (const [pattern, kind, body] of EMOJI_ACTION_MAP) {
    if (pattern.test(recentUserMessage)) {
      return {
        petId: pet.id,
        kind,
        body,
        weight: kind === "favorite_food" ? 78 : 62,
      };
    }
  }

  if (recentUserMessage.length >= 10) {
    return {
      petId: pet.id,
      kind: "owner_chat",
      body: `${pet.name} 记住了主人刚刚对它说过的一段话。`,
      weight: 58,
    };
  }

  return null;
}

function previewMemory(
  memory: Omit<PetMemory, "id" | "createdAt" | "updatedAt">,
): PetMemory {
  return {
    id: `memory-preview-${memory.petId}`,
    petId: memory.petId,
    kind: memory.kind,
    body: memory.body,
    weight: memory.weight,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function buildMemoryExtractionPrompt(
  pet: Pet,
  conversation: ChatMessage[],
  context: PersonaContext,
) {
  const transcript = conversation
    .slice(-4)
    .map((message) => `${message.participantType === "user" ? "用户" : pet.name}：${message.content}`)
    .join("\n");
  const memoryHint =
    context.memoryDigest?.summary ??
    context.memories[0]?.body ??
    `${pet.name} 暂时还没有很稳定的长期记忆。`;
  const semanticHint =
    context.semanticMemoryDigest?.summary ??
    `${pet.name} 还在慢慢分清什么让自己舒服，什么让自己警觉。`;
  const relationshipHint =
    context.bonds[0]
      ? `${context.bonds[0].otherPetName}:${context.bonds[0].status}`
      : "暂无特别强的对象关系";
  const conversationHint =
    context.conversationSummary?.summary ??
    "这段关系还没有形成厚重的对话摘要。";

  const systemPrompt = `
你在做宠物记忆提取，只判断“刚刚这几句是否值得长期记住”。
不要扮演宠物，不要分析过程，只输出 JSON。

宠物：${pet.name}
物种：${pet.species}${pet.breed ? ` / ${pet.breed}` : ""}
当前状态：${context.state.mood} / ${context.state.activity} / ${context.zone.name}
长期摘要：${memoryHint}
语义摘要：${semanticHint}
当前关系提示：${relationshipHint}
对话关系提示：${conversationHint}

如果没有值得长期记住的内容，返回：
{"remember": false}

如果有，返回：
{
  "remember": true,
  "kind": "owner_chat",
  "body": "一段近距离、具体、可复用的短记忆",
  "weight": 64
}

规则：
- body 尽量控制在 16 到 40 个汉字。
- 只允许 kind 为：owner_chat, stranger_chat, social_moment, funny_incident, scary_moment, favorite_food, dislike
- 只有“会影响以后态度或行为”的内容才值得记。
  `.trim();

  return { systemPrompt, transcript };
}

export async function extractMemory(
  conversation: ChatMessage[],
  pet: Pet,
  context: PersonaContext,
): Promise<PetMemory | null> {
  const userMessages = conversation.filter((message) => message.participantType === "user");

  if (userMessages.length === 0) {
    return null;
  }

  const fallback = fallbackMemory(conversation, pet);
  const { systemPrompt, transcript } = buildMemoryExtractionPrompt(pet, conversation, context);

  try {
    const raw = await executeLLMTask({
      cacheKey: `memory:${pet.id}:${transcript}`,
      ttlMs: 1000 * 60 * 10,
      petId: pet.id,
      estimatedTokens: estimateTokensFromText(systemPrompt, transcript),
      task: async () =>
        (
          await getLLMProvider().chat({
          systemPrompt,
          model: env.llmModelNarration,
          messages: [{ role: "user", content: transcript }],
          maxTokens: 96,
          temperature: 0.35,
          timeoutMs: 1000,
          })
        ).content,
    });
    const parsed = extractJsonBlock<{
      remember?: boolean;
      kind?: PetMemoryKind;
      body?: string;
      weight?: number;
    }>(raw);

    if (!parsed?.remember || !parsed.kind || !parsed.body) {
      if (!fallback) {
        return null;
      }

      return previewMemory(fallback);
    }

    return {
      id: `memory-preview-${pet.id}`,
      petId: pet.id,
      kind: parsed.kind,
      body: parsed.body.trim(),
      weight: Math.max(28, Math.min(92, parsed.weight ?? 60)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    if (!fallback) {
      return null;
    }

    return previewMemory(fallback);
  }
}
