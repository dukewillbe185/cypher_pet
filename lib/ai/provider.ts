import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { env } from "@/lib/env";
import { darkenHex, hexToRgb, lightenHex, lightnessOf } from "@/lib/rendering/palette-utils";
import type { GenerationStatus, PetPhotoPalette, Species } from "@/lib/types";

export interface ImageGenerationProvider {
  createJob(input: {
    imagePath: string;
    species: Species;
    promptSeed: string;
    palette?: PetPhotoPalette;
  }): Promise<{
    providerJobId: string;
    worldSpritePath?: string;
    appearanceSeed: string;
    paletteName: string;
  }>;
  parseWebhook(payload: unknown): Promise<{
    providerJobId: string;
    status: GenerationStatus;
    worldSpritePath?: string;
    error?: string;
  }>;
}

export interface CatSpriteFill {
  fur: string;
  stripe: string;
  inner: string;
  nose: string;
}

export interface DogSpriteFill {
  fur: string;
  patch: string;
  ear: string;
  collar: string;
}

const DEFAULT_CAT_FILL: CatSpriteFill = {
  fur: "#F7F4E8",
  stripe: "#F59E0B",
  inner: "#FFE4E6",
  nose: "#F472B6",
};

const DEFAULT_DOG_FILL: DogSpriteFill = {
  fur: "#D97706",
  patch: "#FFF7ED",
  ear: "#78350F",
  collar: "#2563EB",
};

function isValidHex(value: string | undefined): value is string {
  return Boolean(value && hexToRgb(value));
}

/**
 * Maps the photo palette onto the sprite template so the cypher pet wears the
 * real pet's colors. Falls back to the classic garden palette without a photo.
 */
export function resolveSpritePalette(
  species: Species,
  palette?: PetPhotoPalette,
): { cat: CatSpriteFill; dog: DogSpriteFill; paletteName: string } {
  if (!palette || !isValidHex(palette.fur)) {
    return {
      cat: DEFAULT_CAT_FILL,
      dog: DEFAULT_DOG_FILL,
      paletteName: species === "cat" ? "garden-cat" : "garden-dog",
    };
  }

  const fur = palette.fur;
  const furRgb = hexToRgb(fur)!;
  const stripe = isValidHex(palette.stripe) && palette.stripe !== fur
    ? palette.stripe
    : darkenHex(fur, 0.3);
  const inner = isValidHex(palette.inner) ? palette.inner : lightenHex(fur, 0.55);
  const nose = isValidHex(palette.accent) ? palette.accent : "#F472B6";
  // Ears need contrast against the fur to stay readable at sprite scale.
  const ear = lightnessOf(furRgb) > 0.35 ? darkenHex(fur, 0.42) : lightenHex(fur, 0.25);

  return {
    cat: { fur, stripe, inner, nose },
    dog: { fur, patch: inner, ear, collar: DEFAULT_DOG_FILL.collar },
    paletteName: "photo-matched",
  };
}

export function buildCatSpriteSvg(fill: CatSpriteFill, seed: string) {
  return `
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <ellipse cx="40" cy="78" rx="28" ry="8" fill="#0B1220" fill-opacity=".18"/>
  <g fill="#111827">
    <rect x="10" y="38" width="8" height="8"/>
    <rect x="14" y="46" width="8" height="8"/>
    <rect x="20" y="50" width="36" height="18"/>
    <rect x="28" y="44" width="24" height="10"/>
    <rect x="54" y="36" width="18" height="18"/>
    <rect x="56" y="28" width="6" height="8"/>
    <rect x="66" y="28" width="6" height="8"/>
    <rect x="24" y="66" width="8" height="10"/>
    <rect x="42" y="64" width="8" height="12"/>
  </g>
  <g fill="${fill.fur}">
    <rect x="12" y="40" width="4" height="4"/>
    <rect x="16" y="48" width="4" height="4"/>
    <rect x="22" y="52" width="30" height="12"/>
    <rect x="30" y="46" width="18" height="8"/>
    <rect x="56" y="38" width="14" height="14"/>
    <rect x="26" y="66" width="4" height="8"/>
    <rect x="44" y="64" width="4" height="10"/>
  </g>
  <g fill="${fill.stripe}">
    <rect x="30" y="52" width="12" height="4"/>
    <rect x="58" y="40" width="10" height="4"/>
    <rect x="20" y="54" width="4" height="4"/>
  </g>
  <g fill="${fill.inner}">
    <rect x="58" y="48" width="6" height="2"/>
    <rect x="60" y="54" width="2" height="2"/>
    <rect x="24" y="70" width="4" height="2"/>
    <rect x="42" y="70" width="4" height="2"/>
  </g>
  <g fill="#111827">
    <rect x="58" y="44" width="4" height="4"/>
    <rect x="64" y="44" width="4" height="4"/>
  </g>
  <g fill="${fill.nose}">
    <rect x="58" y="30" width="2" height="2"/>
    <rect x="68" y="30" width="2" height="2"/>
    <rect x="60" y="50" width="4" height="2"/>
  </g>
  <text x="8" y="88" fill="#0B1720" font-size="8" font-family="monospace">${seed.toUpperCase()}</text>
</svg>`.trim();
}

export function buildDogSpriteSvg(fill: DogSpriteFill, seed: string) {
  return `
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <ellipse cx="42" cy="78" rx="30" ry="8" fill="#0B1220" fill-opacity=".16"/>
  <g fill="${fill.ear}">
    <rect x="10" y="44" width="10" height="8"/>
    <rect x="18" y="48" width="40" height="18"/>
    <rect x="54" y="38" width="18" height="20"/>
    <rect x="60" y="30" width="8" height="10"/>
    <rect x="22" y="64" width="6" height="12"/>
    <rect x="34" y="64" width="6" height="12"/>
    <rect x="50" y="62" width="6" height="14"/>
  </g>
  <g fill="${fill.fur}">
    <rect x="12" y="46" width="4" height="4"/>
    <rect x="20" y="50" width="34" height="12"/>
    <rect x="28" y="46" width="20" height="8"/>
    <rect x="56" y="40" width="14" height="14"/>
    <rect x="24" y="64" width="2" height="10"/>
    <rect x="36" y="64" width="2" height="10"/>
    <rect x="52" y="62" width="2" height="12"/>
  </g>
  <g fill="${fill.patch}">
    <rect x="24" y="52" width="12" height="10"/>
    <rect x="56" y="46" width="10" height="6"/>
    <rect x="22" y="72" width="4" height="2"/>
    <rect x="34" y="72" width="4" height="2"/>
    <rect x="50" y="72" width="4" height="2"/>
  </g>
  <g fill="#111827">
    <rect x="60" y="44" width="4" height="4"/>
    <rect x="66" y="44" width="2" height="4"/>
  </g>
  <rect x="54" y="56" width="14" height="4" fill="${fill.collar}"/>
  <rect x="68" y="56" width="4" height="8" fill="#FF7A8A"/>
  <text x="8" y="88" fill="#0B1720" font-size="8" font-family="monospace">${seed.toUpperCase()}</text>
</svg>`.trim();
}

class MockImageGenerationProvider implements ImageGenerationProvider {
  async createJob(input: {
    imagePath: string;
    species: Species;
    promptSeed: string;
    palette?: PetPhotoPalette;
  }) {
    const filename = `generated-${randomUUID()}.svg`;
    const outputPath = path.join(process.cwd(), "public", "generated", filename);
    const appearanceSeed = input.promptSeed.split("-").slice(-1)[0] ?? randomUUID().slice(0, 6);
    const resolved = resolveSpritePalette(input.species, input.palette);
    const svg =
      input.species === "cat"
        ? buildCatSpriteSvg(resolved.cat, appearanceSeed)
        : buildDogSpriteSvg(resolved.dog, appearanceSeed);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, svg, "utf8");

    return {
      providerJobId: `mock-${randomUUID()}`,
      // Served via a route so sprites written after `next build` still load.
      worldSpritePath: `/api/sprites/${filename}`,
      appearanceSeed,
      paletteName: resolved.paletteName,
    };
  }

  async parseWebhook(payload: unknown) {
    const record = payload as {
      providerJobId?: string;
      status?: GenerationStatus;
      worldSpritePath?: string;
      error?: string;
    };

    return {
      providerJobId: record.providerJobId ?? "",
      status: record.status ?? "failed",
      worldSpritePath: record.worldSpritePath,
      error: record.error,
    };
  }
}

class WebhookImageGenerationProvider implements ImageGenerationProvider {
  async createJob(_input: {
    imagePath: string;
    species: Species;
    promptSeed: string;
  }) {
    void _input;

    return {
      providerJobId: `webhook-${randomUUID()}`,
      appearanceSeed: randomUUID().slice(0, 6),
      paletteName: "external-provider",
    };
  }

  async parseWebhook(payload: unknown) {
    const record = payload as {
      providerJobId?: string;
      status?: GenerationStatus;
      worldSpritePath?: string;
      error?: string;
    };

    return {
      providerJobId: record.providerJobId ?? "",
      status: record.status ?? "failed",
      worldSpritePath: record.worldSpritePath,
      error: record.error,
    };
  }
}

export function getImageGenerationProvider(): ImageGenerationProvider {
  if (env.imageProvider === "webhook") {
    return new WebhookImageGenerationProvider();
  }

  return new MockImageGenerationProvider();
}
