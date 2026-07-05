import type {
  EnvironmentActor,
  GardenWorldState,
  GardenZoneId,
  WorldTimePhase,
} from "@/lib/types";

export const WORLD_COLS = 48;
export const WORLD_ROWS = 48;
export const WORLD_TILE_SIZE = 32;
export const WORLD_BOUNDS = {
  minX: 4,
  maxX: 43,
  minY: 6,
  maxY: 43,
};

const CYCLE_MINUTES = 12;
const CYCLE_MS = CYCLE_MINUTES * 60 * 1000;

function cycleProgress(now = new Date()) {
  return ((now.getTime() % CYCLE_MS) + CYCLE_MS) % CYCLE_MS / CYCLE_MS;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function phaseFromMinute(minuteOfDay: number): WorldTimePhase {
  if (minuteOfDay < 360) {
    return "night";
  }

  if (minuteOfDay < 540) {
    return "dawn";
  }

  if (minuteOfDay < 1020) {
    return "day";
  }

  if (minuteOfDay < 1200) {
    return "dusk";
  }

  return "night";
}

export function clampTileX(tileX: number) {
  return Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, tileX));
}

export function clampTileY(tileY: number) {
  return Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, tileY));
}

export function scaleLegacyTileX(tileX: number) {
  return clampTileX(Math.round(WORLD_BOUNDS.minX + (tileX / 19) * (WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX)));
}

export function scaleLegacyTileY(tileY: number) {
  return clampTileY(Math.round(WORLD_BOUNDS.minY + (tileY / 12) * (WORLD_BOUNDS.maxY - WORLD_BOUNDS.minY)));
}

export function createWorldState(now = new Date()): GardenWorldState {
  const progress = cycleProgress(now);
  const minuteOfDay = Math.floor(progress * 24 * 60);
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const phase = phaseFromMinute(minuteOfDay);

  if (phase === "night") {
    return {
      clockLabel: `${pad(hour)}:${pad(minute)}`,
      phase,
      cycleProgress: progress,
      minuteOfDay,
      isNight: true,
      skyTop: "#061325",
      skyBottom: "#163756",
      ambientGlow: "rgba(99,255,214,0.12)",
      overlayAlpha: 0.34,
      neonAlpha: 0.42,
      ambienceLabel: "夜里的花园会亮起霓虹灯，萤火虫和 hologram 蝴蝶开始出现。",
    };
  }

  if (phase === "dawn") {
    return {
      clockLabel: `${pad(hour)}:${pad(minute)}`,
      phase,
      cycleProgress: progress,
      minuteOfDay,
      isNight: false,
      skyTop: "#91D9FF",
      skyBottom: "#FFE6AE",
      ambientGlow: "rgba(255,224,141,0.18)",
      overlayAlpha: 0.08,
      neonAlpha: 0.16,
      ambienceLabel: "花园刚刚亮起来，宠物会慢慢从窝里醒过来。",
    };
  }

  if (phase === "dusk") {
    return {
      clockLabel: `${pad(hour)}:${pad(minute)}`,
      phase,
      cycleProgress: progress,
      minuteOfDay,
      isNight: false,
      skyTop: "#6BA7FF",
      skyBottom: "#FFB66D",
      ambientGlow: "rgba(255,183,109,0.16)",
      overlayAlpha: 0.16,
      neonAlpha: 0.28,
      ambienceLabel: "傍晚的空气会慢下来，跑累的狗和困了的猫都会找地方窝着。",
    };
  }

  return {
    clockLabel: `${pad(hour)}:${pad(minute)}`,
    phase,
    cycleProgress: progress,
    minuteOfDay,
    isNight: false,
    skyTop: "#83D8FF",
    skyBottom: "#C5F08F",
    ambientGlow: "rgba(255,255,255,0.08)",
    overlayAlpha: 0,
    neonAlpha: 0.08,
    ambienceLabel: "白天的花园最热闹，蝴蝶、蜜蜂、鱼和鸭子都会出来活动。",
  };
}

function actor(
  zoneId: GardenZoneId,
  id: string,
  kind: EnvironmentActor["kind"],
  tileX: number,
  tileY: number,
  layer: EnvironmentActor["layer"],
  scale: number,
  drift: number,
  tint?: string,
): EnvironmentActor {
  return {
    id,
    kind,
    zoneId,
    tileX,
    tileY,
    layer,
    scale,
    drift,
    tint,
  };
}

export function buildEnvironmentActors(
  zoneId: GardenZoneId,
  world: GardenWorldState,
): EnvironmentActor[] {
  const actors: EnvironmentActor[] = [
    actor(zoneId, `${zoneId}-cloud-1`, "cloud", 8, 4, "sky", 1.2, 0.18),
    actor(zoneId, `${zoneId}-cloud-2`, "cloud", 22, 6, "sky", 0.92, 0.14),
    actor(zoneId, `${zoneId}-cloud-3`, "cloud", 38, 5, "sky", 1.04, 0.12),
    actor(zoneId, `${zoneId}-shadow-1`, "cloud_shadow", 10, 20, "shadow", 1.25, 0.14),
    actor(zoneId, `${zoneId}-shadow-2`, "cloud_shadow", 28, 24, "shadow", 0.9, 0.11),
    actor(zoneId, `${zoneId}-shadow-3`, "cloud_shadow", 40, 18, "shadow", 1.05, 0.1),
  ];

  if (world.isNight) {
    actors.push(
      actor(zoneId, `${zoneId}-firefly-1`, "firefly", 10, 16, "air", 0.88, 0.25, "#C7FF60"),
      actor(zoneId, `${zoneId}-firefly-2`, "firefly", 18, 22, "air", 0.92, 0.2, "#BEF264"),
      actor(zoneId, `${zoneId}-firefly-3`, "firefly", 28, 19, "air", 0.8, 0.24, "#67E8F9"),
      actor(zoneId, `${zoneId}-mushroom-1`, "mushroom", 14, 31, "ground", 0.9, 0.06, "#67E8F9"),
      actor(zoneId, `${zoneId}-mushroom-2`, "mushroom", 30, 30, "ground", 0.82, 0.05, "#BEF264"),
    );
  } else {
    actors.push(
      actor(zoneId, `${zoneId}-bee-1`, "bee", 14, 13, "air", 0.74, 0.32),
      actor(zoneId, `${zoneId}-butterfly-1`, "butterfly", 24, 15, "air", 0.84, 0.28, "#67E8F9"),
      actor(zoneId, `${zoneId}-leaf-1`, zoneId === "orchard" ? "petal" : "leaf", 18, 12, "air", 0.72, 0.18),
      actor(zoneId, `${zoneId}-grass-1`, "grass", 10, 33, "ground", 0.9, 0.08),
      actor(zoneId, `${zoneId}-grass-2`, "grass", 21, 34, "ground", 0.84, 0.07),
      actor(zoneId, `${zoneId}-grass-3`, "grass", 31, 33, "ground", 0.88, 0.06),
      actor(zoneId, `${zoneId}-grass-4`, "grass", 41, 35, "ground", 0.86, 0.05),
    );
  }

  if (zoneId === "pond") {
    actors.push(
      actor(zoneId, `${zoneId}-duck-1`, "duck", 22, 22, "water", 0.98, 0.08),
      actor(zoneId, `${zoneId}-fish-1`, "fish", 18, 23, "water", 0.76, 0.16, "#5EEAD4"),
      actor(zoneId, `${zoneId}-fish-2`, "fish", 24, 24, "water", 0.7, 0.14, "#60A5FA"),
    );
  }

  if (zoneId === "orchard") {
    actors.push(
      actor(zoneId, `${zoneId}-petal-2`, "petal", 12, 17, "air", 0.82, 0.12),
      actor(zoneId, `${zoneId}-petal-3`, "petal", 35, 15, "air", 0.76, 0.11),
    );
  }

  if (zoneId === "dog-run") {
    actors.push(actor(zoneId, `${zoneId}-bee-2`, "bee", 30, 18, "air", 0.7, 0.24));
  }

  return actors;
}
