import { describe, expect, it } from "vitest";

import {
  buildOpenAICompatibleChatRequestBody,
  isModelNotFoundResponse,
  stripThinkBlocks,
} from "@/lib/ai/llm-provider";

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

  it("omits the model field entirely when model is undefined", () => {
    const body = buildOpenAICompatibleChatRequestBody({
      ...baseParams,
      model: undefined,
      stream: false,
    });

    expect(body).not.toHaveProperty("model");
  });
});

describe("isModelNotFoundResponse", () => {
  it("matches the MLX stale-model error shape", () => {
    const body =
      '{"error":{"message":"Model \'Qwen3.5-35B-A3B-4bit\' not found. Available models: Qwen3.6-35B-A3B-4bit","type":"not_found_error"}}';

    expect(isModelNotFoundResponse(404, body)).toBe(true);
  });

  it("ignores unrelated 404s and other statuses", () => {
    expect(isModelNotFoundResponse(404, "route missing")).toBe(false);
    expect(isModelNotFoundResponse(500, "not_found_error")).toBe(false);
    expect(isModelNotFoundResponse(401, "unauthorized")).toBe(false);
  });
});

describe("stripThinkBlocks", () => {
  it("removes closed reasoning blocks and keeps the reply", () => {
    expect(stripThinkBlocks("<think>让我想想主人的心情。</think>喵，过来蹭蹭。")).toBe(
      "喵，过来蹭蹭。",
    );
  });

  it("drops everything when the block never closes", () => {
    expect(stripThinkBlocks("<think>reasoning that ran out of tokens")).toBe("");
  });

  it("leaves normal replies untouched", () => {
    expect(stripThinkBlocks("汪！今天风很好。")).toBe("汪！今天风很好。");
  });
});
