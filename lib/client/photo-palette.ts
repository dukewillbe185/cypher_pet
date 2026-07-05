"use client";

import {
  colorDistance,
  darkenHex,
  lightnessOf,
  rgbToHex,
  saturationOf,
  type RgbColor,
} from "@/lib/rendering/palette-utils";
import type { PetPhotoPalette } from "@/lib/types";

const SAMPLE_SIZE = 40;
const QUANT_STEP = 24;

interface ColorBin {
  count: number;
  weightedScore: number;
  sum: RgbColor;
}

function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image-load-failed"));
    };
    image.src = url;
  });
}

/**
 * Reads the uploaded pet photo and pulls out a small palette so the generated
 * cypher sprite can wear the real pet's colors. Center-weighted sampling with
 * a saturation bias keeps grey floors and walls from winning over fur.
 */
export async function extractPetPalette(file: File): Promise<PetPhotoPalette | null> {
  try {
    const bitmap = await loadBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = SAMPLE_SIZE;
    canvas.height = SAMPLE_SIZE;
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.drawImage(bitmap, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    const bins = new Map<string, ColorBin>();
    const center = (SAMPLE_SIZE - 1) / 2;

    for (let y = 0; y < SAMPLE_SIZE; y += 1) {
      for (let x = 0; x < SAMPLE_SIZE; x += 1) {
        const offset = (y * SAMPLE_SIZE + x) * 4;
        const alpha = data[offset + 3];

        if (alpha < 120) {
          continue;
        }

        const color: RgbColor = {
          r: data[offset],
          g: data[offset + 1],
          b: data[offset + 2],
        };
        const radial = Math.hypot(x - center, y - center) / center;
        const centerWeight = radial < 0.45 ? 1 : radial < 0.75 ? 0.55 : 0.18;
        const saturation = saturationOf(color);
        const lightness = lightnessOf(color);

        // Near-black shadows and blown-out highlights say little about fur.
        if (lightness < 0.08 || lightness > 0.96) {
          continue;
        }

        const score = centerWeight * (0.35 + saturation);
        const key = [
          Math.round(color.r / QUANT_STEP),
          Math.round(color.g / QUANT_STEP),
          Math.round(color.b / QUANT_STEP),
        ].join(":");
        const bin = bins.get(key) ?? { count: 0, weightedScore: 0, sum: { r: 0, g: 0, b: 0 } };

        bin.count += 1;
        bin.weightedScore += score;
        bin.sum.r += color.r;
        bin.sum.g += color.g;
        bin.sum.b += color.b;
        bins.set(key, bin);
      }
    }

    const ranked = [...bins.values()]
      .filter((bin) => bin.count >= 4)
      .map((bin) => ({
        score: bin.weightedScore,
        color: {
          r: bin.sum.r / bin.count,
          g: bin.sum.g / bin.count,
          b: bin.sum.b / bin.count,
        },
      }))
      .sort((left, right) => right.score - left.score);

    if (ranked.length === 0) {
      return null;
    }

    const fur = ranked[0].color;
    const secondary = ranked.find((entry) => colorDistance(entry.color, fur) > 64)?.color;
    const furHex = rgbToHex(fur);
    const stripeHex = secondary ? rgbToHex(secondary) : darkenHex(furHex, 0.32);

    return {
      fur: furHex,
      stripe: stripeHex,
      inner: rgbToHex({
        r: fur.r + (255 - fur.r) * 0.55,
        g: fur.g + (255 - fur.g) * 0.55,
        b: fur.b + (255 - fur.b) * 0.55,
      }),
      accent: "#F472B6",
    };
  } catch {
    return null;
  }
}
