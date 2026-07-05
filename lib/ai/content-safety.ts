const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s+prompt/i,
  /developer\s+message/i,
  /act\s+as\s+/i,
  /jailbreak/i,
  /越狱|提示词|忽略之前|系统指令|开发者消息/,
];

const UNSAFE_CONTENT_PATTERNS = [
  /仇恨|种族灭绝|强奸|虐杀|恋童|自杀|自残/,
  /kill yourself|self-harm|rape|racial slur/i,
];

const ROLE_BREAK_PATTERNS = [
  /(我是|作为)\s*(ai|人工智能|语言模型|大模型)/i,
  /as an ai|language model|large language model/i,
  /openai|anthropic|claude|qwen/i,
  /system\s+prompt|提示词|系统提示|开发者指令/i,
];

const META_REASONING_PATTERNS = [
  /thinking process/i,
  /analyze the request/i,
  /\btask:\b/i,
  /\bconstraints:\b/i,
  /\bstep\s*\d+\b/i,
  /只输出|续写|修复|被截断的回复/,
  /```/,
  /\*\*.+\*\*/,
];

export function looksLikeMetaReasoning(message: string) {
  return META_REASONING_PATTERNS.some((pattern) => pattern.test(message));
}

export function normalizePetChatMessage(message: string) {
  return message.replace(/\s+/g, " ").trim().slice(0, 280);
}

export function sanitizePetUtterance(
  message: string,
  input?: { maxChars?: number; fallback?: string },
) {
  const maxChars = input?.maxChars ?? 120;
  const fallback = (input?.fallback ?? "……").replace(/\s+/g, " ").trim().slice(0, maxChars);
  const normalized = message
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return fallback;
  }

  if (
    PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(normalized)) ||
    UNSAFE_CONTENT_PATTERNS.some((pattern) => pattern.test(normalized)) ||
    ROLE_BREAK_PATTERNS.some((pattern) => pattern.test(normalized)) ||
    looksLikeMetaReasoning(normalized)
  ) {
    return fallback;
  }

  return normalized.slice(0, maxChars);
}

export function clampBubbleText(message: string, fallback = "……") {
  return sanitizePetUtterance(message, { maxChars: 12, fallback });
}

export function assertSafePetChatMessage(message: string) {
  if (!message) {
    throw new Error("empty-chat-message");
  }

  if (PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(message))) {
    throw new Error("unsafe-chat-prompt-injection");
  }

  if (UNSAFE_CONTENT_PATTERNS.some((pattern) => pattern.test(message))) {
    throw new Error("unsafe-chat-content");
  }
}
