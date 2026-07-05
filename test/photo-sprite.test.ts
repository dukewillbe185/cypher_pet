import { describe, expect, it } from "vitest";

import { buildCatSpriteSvg, buildDogSpriteSvg, resolveSpritePalette } from "@/lib/ai/provider";
import { darkenHex, hexToRgb, lightenHex, rgbToHex } from "@/lib/rendering/palette-utils";

const ORANGE_CAT_PALETTE = {
  fur: "#D97B29",
  stripe: "#9A4E12",
  inner: "#F3C9A2",
  accent: "#F472B6",
};

describe("palette utils", () => {
  it("round-trips hex and rgb", () => {
    expect(rgbToHex(hexToRgb("#D97B29")!)).toBe("#D97B29");
  });

  it("darkens and lightens without leaving hex range", () => {
    expect(hexToRgb(darkenHex("#D97B29", 0.3))).not.toBeNull();
    expect(hexToRgb(lightenHex("#D97B29", 0.5))).not.toBeNull();
    expect(darkenHex("#FFFFFF", 1)).toBe("#000000");
    expect(lightenHex("#000000", 1)).toBe("#FFFFFF");
  });

  it("passes through invalid hex unchanged", () => {
    expect(darkenHex("not-a-color", 0.5)).toBe("not-a-color");
  });
});

describe("resolveSpritePalette", () => {
  it("keeps the classic garden palette without a photo palette", () => {
    const resolved = resolveSpritePalette("cat");

    expect(resolved.paletteName).toBe("garden-cat");
    expect(resolved.cat.fur).toBe("#F7F4E8");
  });

  it("dresses the cat sprite in the photo's fur color", () => {
    const resolved = resolveSpritePalette("cat", ORANGE_CAT_PALETTE);

    expect(resolved.paletteName).toBe("photo-matched");
    expect(resolved.cat.fur).toBe("#D97B29");
    expect(resolved.cat.stripe).toBe("#9A4E12");

    const svg = buildCatSpriteSvg(resolved.cat, "devil1");
    expect(svg).toContain("#D97B29");
    expect(svg).toContain("#9A4E12");
    expect(svg).not.toContain("#F7F4E8");
  });

  it("derives a stripe color when the photo palette lacks contrast", () => {
    const resolved = resolveSpritePalette("cat", {
      ...ORANGE_CAT_PALETTE,
      stripe: ORANGE_CAT_PALETTE.fur,
    });

    expect(resolved.cat.stripe).not.toBe(resolved.cat.fur);
    expect(hexToRgb(resolved.cat.stripe)).not.toBeNull();
  });

  it("maps the palette onto dog fills with readable ears", () => {
    const resolved = resolveSpritePalette("dog", ORANGE_CAT_PALETTE);
    const svg = buildDogSpriteSvg(resolved.dog, "rex");

    expect(resolved.dog.fur).toBe("#D97B29");
    expect(resolved.dog.ear).not.toBe(resolved.dog.fur);
    expect(svg).toContain("#D97B29");
  });

  it("falls back to defaults when the palette hex is malformed", () => {
    const resolved = resolveSpritePalette("cat", {
      fur: "orange",
      stripe: "#9A4E12",
      inner: "#F3C9A2",
      accent: "#F472B6",
    });

    expect(resolved.paletteName).toBe("garden-cat");
  });
});
