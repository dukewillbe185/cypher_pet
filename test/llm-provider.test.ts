import { describe, expect, it } from "vitest";

import { buildOpenAICompatibleChatRequestBody } from "@/lib/ai/llm-provider";

const baseParams = {
  systemPrompt: "system",
  messages: [{ role: "user" as const, content: "hello" }],
  maxTokens: 96,
};

describe("OpenAI-compatible LLM request body", () => {
  it("disables thinking and omits custom temperature for Kimi K2.5", () => {
    const body = buildOpenAICompatibleChatRequestBody({
      ...baseParams,
      model: "kimi-k2.5",
      temperature: 0.35,
      stream: false,
    });

    expect(body).toMatchObject({
      model: "kimi-k2.5",
      max_tokens: 96,
      stream: false,
      thinking: { type: "disabled" },
    });
    expect(body).not.toHaveProperty("temperature");
  });

  it("keeps temperature for non-Kimi K2.5 models", () => {
    const body = buildOpenAICompatibleChatRequestBody({
      ...baseParams,
      model: "Qwen3.5-35B-A3B-4bit",
      temperature: 0.35,
      stream: false,
    });

    expect(body).toMatchObject({
      model: "Qwen3.5-35B-A3B-4bit",
      temperature: 0.35,
      max_tokens: 96,
      stream: false,
    });
    expect(body).not.toHaveProperty("thinking");
  });
});
