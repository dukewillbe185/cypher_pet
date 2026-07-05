import gc
import json
import os
import sys
import traceback

import mlx.core as mx
from mlx_vlm import load, stream_generate
from mlx_vlm.prompt_utils import apply_chat_template


MODEL_PATH = os.environ.get(
    "CYPHER_QWEN_MODEL_PATH",
    "/Users/dukeisyourdaddy/models/Qwen3.5-35B-A3B-4bit",
)
PREFILL_STEP_SIZE = int(os.environ.get("CYPHER_QWEN_PREFILL_STEP_SIZE", "256"))
MAX_KV_SIZE = int(os.environ.get("CYPHER_QWEN_MAX_KV_SIZE", "131072"))


def emit(payload):
    sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def main():
    model = None
    processor = None
    config = None

    try:
        model, processor = load(MODEL_PATH)
        config = model.config
        emit({"type": "ready", "modelPath": MODEL_PATH})
    except Exception as exc:
        emit(
            {
                "type": "fatal",
                "error": str(exc),
                "traceback": traceback.format_exc(limit=8),
            }
        )
        raise

    for line in sys.stdin:
        raw = line.strip()
        if not raw:
            continue

        request_id = None
        try:
            payload = json.loads(raw)
            request_id = payload.get("id")

            if payload.get("type") == "health":
                emit(
                    {
                        "id": request_id,
                        "ok": True,
                        "status": "healthy",
                        "modelPath": MODEL_PATH,
                    }
                )
                continue

            messages = []
            system_prompt = payload.get("systemPrompt", "").strip()
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})

            for message in payload.get("messages", []):
                role = message.get("role", "user")
                content = str(message.get("content", "")).strip()
                messages.append({"role": role, "content": content})

            prompt = apply_chat_template(processor, config, messages, num_images=0)
            max_tokens = int(payload.get("maxTokens", 220))
            generated_parts = []
            prompt_tokens = 0
            generation_tokens = 0
            total_tokens = 0

            for chunk in stream_generate(
                model,
                processor,
                prompt=prompt,
                verbose=False,
                max_tokens=max_tokens,
                temperature=float(payload.get("temperature", 0.7)),
                enable_thinking=False,
                prefill_step_size=PREFILL_STEP_SIZE,
                max_kv_size=MAX_KV_SIZE,
            ):
                delta = chunk.text or ""
                prompt_tokens = chunk.prompt_tokens
                generation_tokens = chunk.generation_tokens
                total_tokens = chunk.total_tokens

                if delta:
                    generated_parts.append(delta)
                    emit(
                        {
                            "id": request_id,
                            "type": "token",
                            "delta": delta,
                            "promptTokens": prompt_tokens,
                            "generationTokens": generation_tokens,
                            "totalTokens": total_tokens,
                        }
                    )

            finish_reason = "length" if generation_tokens >= max_tokens else "stop"
            emit(
                {
                    "id": request_id,
                    "ok": True,
                    "type": "done",
                    "content": "".join(generated_parts),
                    "promptTokens": prompt_tokens,
                    "generationTokens": generation_tokens,
                    "totalTokens": total_tokens,
                    "finishReason": finish_reason,
                }
            )
        except Exception as exc:
            emit(
                {
                    "id": request_id,
                    "ok": False,
                    "error": str(exc),
                    "traceback": traceback.format_exc(limit=8),
                }
            )
        finally:
            try:
                mx.clear_cache()
            except Exception:
                pass
            gc.collect()


if __name__ == "__main__":
    main()
