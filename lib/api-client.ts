function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!isRecord(payload)) {
    return fallback;
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return fallback;
}

export function describeUnexpectedApiPayload(raw: string, fallback: string) {
  const trimmed = raw.trim();

  if (!trimmed) {
    return fallback;
  }

  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
    return "接口返回了页面内容，不是预期的 JSON。通常是接口报错或服务端返回了错误页。";
  }

  return trimmed.length > 160 ? `${trimmed.slice(0, 157)}...` : trimmed;
}

export async function readJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(describeUnexpectedApiPayload(await response.text(), fallbackMessage));
  }

  const cloned = response.clone();
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error(describeUnexpectedApiPayload(await cloned.text(), fallbackMessage));
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload, fallbackMessage));
  }

  return payload as T;
}
