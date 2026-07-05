export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function rgbToHex(color: RgbColor) {
  const part = (value: number) => clampChannel(value).toString(16).padStart(2, "0");
  return `#${part(color.r)}${part(color.g)}${part(color.b)}`.toUpperCase();
}

export function hexToRgb(hex: string): RgbColor | null {
  const match = hex.trim().match(/^#?([0-9a-f]{6})$/i);

  if (!match) {
    return null;
  }

  const value = parseInt(match[1], 16);
  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  };
}

/** amount 0-1: 0 keeps the color, 1 goes fully black. */
export function darkenHex(hex: string, amount: number) {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return hex;
  }

  const factor = 1 - Math.max(0, Math.min(1, amount));
  return rgbToHex({ r: rgb.r * factor, g: rgb.g * factor, b: rgb.b * factor });
}

/** amount 0-1: 0 keeps the color, 1 goes fully white. */
export function lightenHex(hex: string, amount: number) {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return hex;
  }

  const mix = Math.max(0, Math.min(1, amount));
  return rgbToHex({
    r: rgb.r + (255 - rgb.r) * mix,
    g: rgb.g + (255 - rgb.g) * mix,
    b: rgb.b + (255 - rgb.b) * mix,
  });
}

export function colorDistance(left: RgbColor, right: RgbColor) {
  return Math.hypot(left.r - right.r, left.g - right.g, left.b - right.b);
}

export function saturationOf(color: RgbColor) {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);

  if (max === 0) {
    return 0;
  }

  return (max - min) / max;
}

export function lightnessOf(color: RgbColor) {
  return (Math.max(color.r, color.g, color.b) + Math.min(color.r, color.g, color.b)) / 2 / 255;
}
