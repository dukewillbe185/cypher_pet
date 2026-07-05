"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Application, extend, useTick } from "@pixi/react";
import { Assets, Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { MapPin, Route } from "lucide-react";

import { buildAutonomyMapOverlays, type AutonomyMapOverlay } from "@/components/garden/autonomy-map-overlays";
import { activityLabel, activityTone, type ActivityTone } from "@/components/garden/garden-labels";
import { usePlayerKeyboard } from "@/components/garden/use-player-controls";
import { useZoneAssetWarmup } from "@/components/garden/use-zone-asset-warmup";
import { buildWorldTransitionMarkers } from "@/components/garden/world-transition-markers";
import { buildTerrainMap } from "@/lib/domain/terrain";
import {
  findNearestWalkableTile,
  findWalkingPath,
  isWalkableTile,
  type TilePoint,
} from "@/lib/domain/pathfinding";
import { WORLD_COLS, WORLD_ROWS, WORLD_TILE_SIZE } from "@/lib/domain/world";
import {
  buildPetFrameUrls,
  frameBucketForActivity,
  frameDurationMs,
} from "@/lib/rendering/pet-sprite-frames";
import type {
  EnvironmentActor,
  GardenPetSnapshot,
  GardenSnapshot,
  GardenZone,
  GardenZoneId,
  OwnerAction,
  PetActivity,
  PetMood,
  Species,
  WorldObject,
} from "@/lib/types";

extend({ Container, Graphics, Sprite, Text });

const LOGICAL_COLS = WORLD_COLS;
const LOGICAL_ROWS = WORLD_ROWS;
const TILE_SIZE = WORLD_TILE_SIZE;
const SCENE_WIDTH = 1836;
const SCENE_HEIGHT = 1756;
const PLAYFIELD_LEFT = 150;
const PLAYFIELD_TOP = 110;
const PLAYFIELD_RIGHT = PLAYFIELD_LEFT + LOGICAL_COLS * TILE_SIZE;
const PLAYFIELD_BOTTOM = PLAYFIELD_TOP + LOGICAL_ROWS * TILE_SIZE;

const PLAYER_WALK_TILES_PER_SECOND = 4.6;
const PLAYER_SPRINT_TILES_PER_SECOND = 7.1;
const CAMERA_LERP = 0.085;
const PROXIMITY_ACTION_TILES = 2.6;
const PROXIMITY_NOTICE_TILES = 3.4;
const FAR_CALL_TILES = 6;
const HOLD_TO_MOVE_MS = 220;
const HOLD_TO_MOVE_DRIFT_PX = 12;

const ZONE_TRAVEL_RING: GardenZoneId[] = ["orchard", "pond", "grove", "dog-run"];
const GATE_BAND_MIN_TILE_Y = 20;
const GATE_BAND_MAX_TILE_Y = 28;

const backgroundScenePath: Record<GardenZoneId, string> = {
  orchard: "/garden/scene-orchard.svg",
  pond: "/garden/scene-pond.svg",
  grove: "/garden/scene-grove.svg",
  "dog-run": "/garden/scene-dog-run.svg",
};

const zoneAtmosphere: Record<GardenZoneId, string> = {
  orchard:
    "radial-gradient(circle at 15% 16%, rgba(255,243,172,0.28), transparent 22%), radial-gradient(circle at 78% 34%, rgba(112,255,218,0.16), transparent 26%)",
  pond:
    "radial-gradient(circle at 54% 42%, rgba(132,230,255,0.22), transparent 28%), radial-gradient(circle at 12% 18%, rgba(255,255,255,0.1), transparent 18%)",
  grove:
    "radial-gradient(circle at 74% 20%, rgba(181,247,135,0.18), transparent 24%), radial-gradient(circle at 24% 54%, rgba(255,209,102,0.08), transparent 24%)",
  "dog-run":
    "radial-gradient(circle at 28% 18%, rgba(255,217,113,0.18), transparent 28%), radial-gradient(circle at 82% 38%, rgba(116,255,194,0.12), transparent 26%)",
};

const zoneSpawnTile: Record<GardenZoneId, TilePoint> = {
  orchard: { tileX: 24, tileY: 30 },
  pond: { tileX: 24, tileY: 34 },
  grove: { tileX: 24, tileY: 31 },
  "dog-run": { tileX: 24, tileY: 32 },
};

const environmentLayerOrder = {
  sky: 0,
  shadow: 1,
  air: 2,
  water: 3,
  ground: 4,
} as const;

const activityToneColors: Record<ActivityTone, { stroke: string; fill: string; text: string }> = {
  social: { stroke: "#67E8F9", fill: "#082F49", text: "#CFFAFE" },
  conflict: { stroke: "#FDA4AF", fill: "#4C0519", text: "#FFE4E6" },
  rest: { stroke: "#C4B5FD", fill: "#2E1065", text: "#EDE9FE" },
  care: { stroke: "#BEFE5F", fill: "#1A2E05", text: "#ECFCCB" },
  explore: { stroke: "#FDE68A", fill: "#451A03", text: "#FEF3C7" },
  neutral: { stroke: "#E5E7EB", fill: "#111827", text: "#F8FAFC" },
};

const encounterMarkerToneStyles = {
  conflict: "border-rose-200/80 bg-rose-400/18 text-rose-50 shadow-[0_0_28px_rgba(251,113,133,0.28)]",
  social: "border-cyan-200/80 bg-cyan-400/16 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.24)]",
  explore: "border-amber-200/80 bg-amber-300/16 text-amber-50 shadow-[0_0_28px_rgba(251,191,36,0.24)]",
  care: "border-lime-200/80 bg-lime-300/16 text-lime-50 shadow-[0_0_28px_rgba(190,254,95,0.24)]",
  rest: "border-violet-200/80 bg-violet-300/16 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.24)]",
} satisfies Record<GardenSnapshot["encounterMarkers"][number]["tone"], string>;

function toSceneX(tileX: number) {
  return PLAYFIELD_LEFT + tileX * TILE_SIZE;
}

function toSceneY(tileY: number) {
  return PLAYFIELD_TOP + tileY * TILE_SIZE;
}

function toTileX(sceneX: number) {
  return (sceneX - PLAYFIELD_LEFT) / TILE_SIZE;
}

function toTileY(sceneY: number) {
  return (sceneY - PLAYFIELD_TOP) / TILE_SIZE;
}

function moodBubble(mood: PetMood) {
  switch (mood) {
    case "sleepy":
      return "zZ";
    case "playful":
      return "!!";
    case "grumpy":
      return "><";
    case "lonely":
      return "?";
    case "dirty":
      return "...";
    case "curious":
      return "+";
    case "happy":
    default:
      return "o";
  }
}

function shouldShowBubble(selected: boolean, mood: PetMood, activity: PetActivity) {
  if (selected) {
    return true;
  }

  return activity === "sleep" || activity === "watch_fish" || mood === "dirty" || mood === "grumpy";
}

function isRenderableObject(object: WorldObject) {
  return (
    object.type === "poop" ||
    object.type === "toy" ||
    object.type === "butterfly" ||
    object.type === "lamp" ||
    object.type === "fountain" ||
    object.type === "bridge"
  );
}

function isSceneryObject(object: WorldObject) {
  return (
    object.type === "tree" ||
    object.type === "bush" ||
    object.type === "stone" ||
    object.type === "doghouse" ||
    object.type === "pet_bed" ||
    object.type === "rest_spot"
  );
}

type MovementTier = "rest" | "amble" | "trot" | "sprint";

function movementTier(activity: PetActivity): MovementTier {
  switch (activity) {
    case "chase":
      return "sprint";
    case "play":
    case "dig":
    case "scuffle":
    case "approach_pet":
      return "trot";
    case "wander":
    case "move_to_zone":
    case "seek_owner":
    case "look_around":
    case "climb_tree":
      return "amble";
    default:
      return "rest";
  }
}

function tierTilesPerSecond(tier: MovementTier, zoomies: number) {
  const zoomBias = zoomies / 100;

  switch (tier) {
    case "sprint":
      return 4.9 + zoomBias * 1.2;
    case "trot":
      return 3 + zoomBias * 0.6;
    case "amble":
      return 1.7 + zoomBias * 0.3;
    default:
      return 1.5;
  }
}

function walkingFrameBucket(tilesPerSecond: number): "amble" | "trot" | "sprint" {
  if (tilesPerSecond >= 4.4) {
    return "sprint";
  }

  if (tilesPerSecond >= 2.4) {
    return "trot";
  }

  return "amble";
}

function walkingFrameDurationMs(tilesPerSecond: number) {
  if (tilesPerSecond >= 4.4) {
    return 220;
  }

  if (tilesPerSecond >= 2.4) {
    return 300;
  }

  return 400;
}

function petJitterOffset(petId: string) {
  let hash = 5381;

  for (let index = 0; index < petId.length; index += 1) {
    hash = ((hash << 5) + hash + petId.charCodeAt(index)) | 0;
  }

  const positive = Math.abs(hash);
  return {
    x: (positive % 21) - 10,
    y: ((positive >> 3) % 15) - 7,
  };
}

function drawDynamicObject(object: WorldObject) {
  return (graphics: Graphics) => {
    graphics.clear();

    if (object.type === "poop") {
      graphics.ellipse(0, 12, 20, 13).fill({ color: "#6D4728" });
      graphics.circle(-5, 2, 10).fill({ color: "#8B5E3C" });
      graphics.circle(6, -4, 8).fill({ color: "#92613D" });
      return;
    }

    if (object.type === "toy") {
      graphics.circle(0, 0, 16).fill({ color: "#F59E0B" });
      graphics.circle(0, 0, 8).fill({ color: "#FDE68A" });
      graphics.circle(-5, -4, 3).fill({ color: "#FFF7BF", alpha: 0.85 });
      return;
    }

    if (object.type === "butterfly") {
      graphics.circle(-9, -1, 8).fill({ color: "#FFB703" });
      graphics.circle(9, -1, 8).fill({ color: "#FFB703" });
      graphics.circle(-7, 8, 6).fill({ color: "#F472B6" });
      graphics.circle(7, 8, 6).fill({ color: "#F472B6" });
      graphics.rect(-2, -6, 4, 24).fill({ color: "#111827" });
      return;
    }

    if (object.type === "lamp") {
      graphics.rect(-3, -28, 6, 32).fill({ color: "#2B3A4F" });
      graphics.roundRect(-8, -40, 16, 14, 5).fill({ color: "#94FDF7" });
      graphics.circle(0, -32, 24).fill({ color: "#67E8F9", alpha: 0.16 });
      return;
    }

    if (object.type === "fountain") {
      graphics.ellipse(0, 10, 42, 16).fill({ color: "#2563EB", alpha: 0.35 });
      graphics.rect(-6, -30, 12, 34).fill({ color: "#A5B4FC" });
      graphics.roundRect(-4, -50, 8, 22, 4).fill({ color: "#E0F2FE", alpha: 0.9 });
      return;
    }

    if (object.type === "bridge") {
      graphics.roundRect(-30, -6, 60, 16, 6).fill({ color: "#7C4A1F" });
      graphics.rect(-22, -12, 44, 6).fill({ color: "#A16207" });
      return;
    }
  };
}

function drawSceneryObject(object: WorldObject, neonAlpha: number) {
  return (graphics: Graphics) => {
    graphics.clear();

    if (object.type === "tree") {
      graphics.rect(-9, -8, 18, 52).fill({ color: "#7C4A1F", alpha: 0.98 });
      graphics.rect(-13, 32, 8, 12).fill({ color: "#7C4A1F", alpha: 0.95 });
      graphics.rect(5, 32, 8, 12).fill({ color: "#7C4A1F", alpha: 0.95 });
      graphics.rect(-22, -2, 14, 8).fill({ color: "#8B5A2B", alpha: 0.9 });
      graphics.rect(8, -6, 14, 8).fill({ color: "#8B5A2B", alpha: 0.9 });

      graphics.rect(-46, -70, 28, 18).fill({ color: "#2F6A18", alpha: 0.96 });
      graphics.rect(-20, -84, 30, 18).fill({ color: "#3E7D1E", alpha: 0.98 });
      graphics.rect(8, -72, 26, 16).fill({ color: "#36711A", alpha: 0.96 });
      graphics.rect(-58, -52, 34, 18).fill({ color: "#4D8F23", alpha: 0.96 });
      graphics.rect(-28, -58, 38, 18).fill({ color: "#5FA82C", alpha: 0.98 });
      graphics.rect(6, -56, 34, 18).fill({ color: "#4B9224", alpha: 0.98 });
      graphics.rect(-46, -36, 28, 16).fill({ color: "#74BC31", alpha: 0.98 });
      graphics.rect(-18, -34, 36, 18).fill({ color: "#8FD63C", alpha: 0.98 });
      graphics.rect(18, -38, 22, 16).fill({ color: "#76BF32", alpha: 0.98 });
      graphics.rect(-40, -24, 24, 12).fill({ color: "#BAF248", alpha: 0.92 });
      graphics.rect(-2, -22, 18, 10).fill({ color: "#D4FB6E", alpha: 0.88 });
      graphics.circle(-4, -42, 72).fill({ color: "#67E8F9", alpha: neonAlpha * 0.035 });
      return;
    }

    if (object.type === "bush") {
      graphics.rect(-18, -10, 16, 14).fill({ color: "#3F7C1B", alpha: 0.95 });
      graphics.rect(-6, -16, 18, 16).fill({ color: "#5FA82C", alpha: 0.98 });
      graphics.rect(8, -10, 14, 14).fill({ color: "#76BF32", alpha: 0.95 });
      return;
    }

    if (object.type === "stone") {
      graphics.roundRect(-15, -8, 30, 16, 6).fill({ color: "#D7C8A5", alpha: 0.96 });
      graphics.roundRect(-8, -13, 16, 10, 4).fill({ color: "#EFE1BE", alpha: 0.84 });
      return;
    }

    if (object.type === "doghouse") {
      graphics.rect(-22, -10, 44, 24).fill({ color: "#A16207", alpha: 0.95 });
      graphics.poly([-24, -10, 0, -30, 24, -10], true).fill({ color: "#DC2626", alpha: 0.92 });
      graphics.roundRect(-8, -1, 16, 15, 5).fill({ color: "#111827", alpha: 0.92 });
      return;
    }

    if (object.type === "pet_bed") {
      graphics.ellipse(0, 0, 22, 12).fill({ color: "#A16207", alpha: 0.95 });
      graphics.ellipse(0, -1, 18, 8).fill({ color: "#60A5FA", alpha: 0.88 });
      return;
    }

    if (object.type === "rest_spot") {
      graphics.roundRect(-18, -8, 36, 18, 8).fill({ color: "#8B5CF6", alpha: 0.12 + neonAlpha * 0.08 });
      graphics.ellipse(0, 2, 20, 9).fill({ color: "#FDE68A", alpha: 0.24 });
    }
  };
}

function drawEnvironmentActor(actor: EnvironmentActor) {
  return (graphics: Graphics) => {
    graphics.clear();

    if (actor.kind === "cloud") {
      graphics.circle(-18, 4, 18).fill({ color: "#FFFFFF", alpha: 0.92 });
      graphics.circle(0, 0, 22).fill({ color: "#FFFFFF", alpha: 0.94 });
      graphics.circle(22, 5, 16).fill({ color: "#F8FAFC", alpha: 0.92 });
      graphics.roundRect(-24, 4, 56, 18, 10).fill({ color: "#FFFFFF", alpha: 0.9 });
      return;
    }

    if (actor.kind === "cloud_shadow") {
      graphics.ellipse(0, 0, 46 * actor.scale, 18 * actor.scale).fill({ color: "#0F172A", alpha: 0.08 });
      return;
    }

    if (actor.kind === "duck") {
      graphics.ellipse(0, 6, 20, 12).fill({ color: "#FDE047" });
      graphics.circle(14, -2, 8).fill({ color: "#FACC15" });
      graphics.poly([20, -2, 28, 0, 20, 4], true).fill({ color: "#FB923C" });
      return;
    }

    if (actor.kind === "fish") {
      graphics.ellipse(0, 0, 16, 8).fill({ color: actor.tint ?? "#60A5FA" });
      graphics.poly([14, 0, 26, -8, 26, 8], true).fill({ color: actor.tint ?? "#60A5FA" });
      return;
    }

    if (actor.kind === "bee") {
      graphics.ellipse(0, 0, 9, 6).fill({ color: "#FACC15" });
      graphics.rect(-2, -6, 4, 12).fill({ color: "#111827" });
      graphics.circle(-6, -5, 4).fill({ color: "#E0F2FE", alpha: 0.7 });
      graphics.circle(6, -5, 4).fill({ color: "#E0F2FE", alpha: 0.7 });
      return;
    }

    if (actor.kind === "firefly") {
      graphics.circle(0, 0, 3).fill({ color: actor.tint ?? "#BEF264" });
      graphics.circle(0, 0, 14).fill({ color: actor.tint ?? "#BEF264", alpha: 0.14 });
      return;
    }

    if (actor.kind === "butterfly") {
      graphics.circle(-6, -1, 6).fill({ color: actor.tint ?? "#FFB703" });
      graphics.circle(6, -1, 6).fill({ color: actor.tint ?? "#FFB703" });
      graphics.circle(-4, 5, 4).fill({ color: actor.tint ?? "#F472B6", alpha: 0.88 });
      graphics.circle(4, 5, 4).fill({ color: actor.tint ?? "#F472B6", alpha: 0.88 });
      graphics.rect(-1, -6, 2, 16).fill({ color: "#111827" });
      return;
    }

    if (actor.kind === "leaf" || actor.kind === "petal") {
      graphics.poly([0, -8, 6, 0, 0, 10, -6, 0], true).fill({
        color: actor.kind === "petal" ? "#F9A8D4" : "#86EFAC",
        alpha: 0.92,
      });
      return;
    }

    if (actor.kind === "mushroom") {
      graphics.rect(-4, 0, 8, 10).fill({ color: "#F8FAFC", alpha: 0.85 });
      graphics.roundRect(-10, -6, 20, 10, 5).fill({ color: actor.tint ?? "#67E8F9", alpha: 0.9 });
      graphics.circle(0, 0, 18).fill({ color: actor.tint ?? "#67E8F9", alpha: 0.12 });
      return;
    }

    if (actor.kind === "grass") {
      graphics.rect(-1, -12, 2, 14).fill({ color: "#4ADE80" });
      graphics.rect(-6, -10, 2, 12).fill({ color: "#65A30D" });
      graphics.rect(4, -10, 2, 12).fill({ color: "#84CC16" });
    }
  };
}

function drawMoodBubble(selected: boolean, kind: "thought" | "speech") {
  return (graphics: Graphics) => {
    graphics.clear();
    graphics.roundRect(-2, -2, selected ? 118 : 102, 32, kind === "speech" ? 11 : 16).fill({
      color: kind === "speech" ? "#DFF9FF" : selected ? "#F8FCFF" : "#F6FDE4",
      alpha: 0.94,
    });
    if (kind === "speech") {
      graphics
        .poly([
          { x: 14, y: 28 },
          { x: 24, y: 28 },
          { x: 18, y: 38 },
        ])
        .fill({ color: "#DFF9FF", alpha: 0.94 });
    } else {
      graphics.circle(10, 32, 5).fill({ color: "#F8FCFF", alpha: 0.94 });
      graphics.circle(1, 39, 3).fill({ color: "#F8FCFF", alpha: 0.9 });
    }
  };
}

function drawShadow(selected: boolean) {
  return (graphics: Graphics) => {
    graphics.clear();
    graphics.ellipse(0, 0, selected ? 34 : 28, selected ? 13 : 10).fill({
      color: "#071018",
      alpha: 0.28,
    });
  };
}

function drawActivityFx(activity: PetActivity) {
  return (graphics: Graphics) => {
    graphics.clear();

    if (activity === "scuffle") {
      graphics.circle(-15, -14, 6).fill({ color: "#FB7185", alpha: 0.5 });
      graphics.circle(12, -18, 5).fill({ color: "#FDE047", alpha: 0.62 });
      graphics.circle(20, -4, 4).fill({ color: "#F97316", alpha: 0.58 });
      graphics.circle(-24, 4, 4).fill({ color: "#F43F5E", alpha: 0.46 });
      graphics.rect(-34, -24, 18, 3).fill({ color: "#F8FAFC", alpha: 0.44 });
      graphics.rect(16, -30, 20, 3).fill({ color: "#F8FAFC", alpha: 0.38 });
      graphics.rect(-8, -36, 3, 18).fill({ color: "#FDE047", alpha: 0.42 });
      graphics.ellipse(0, 20, 30, 9).stroke({ color: "#FB7185", width: 2, alpha: 0.36 });
      return;
    }

    if (activity === "chase") {
      graphics.rect(-28, -6, 10, 2).fill({ color: "#F8FAFC", alpha: 0.38 });
      graphics.rect(-22, 0, 8, 2).fill({ color: "#F8FAFC", alpha: 0.28 });
      return;
    }

    if (activity === "dig") {
      graphics.circle(-12, 10, 3).fill({ color: "#A16207", alpha: 0.9 });
      graphics.circle(-4, 14, 4).fill({ color: "#B45309", alpha: 0.85 });
      graphics.circle(8, 12, 3).fill({ color: "#92400E", alpha: 0.8 });
      return;
    }

    if (activity === "watch_fish" || activity === "drink") {
      graphics.ellipse(0, 18, 20, 6).stroke({ color: "#7DD3FC", width: 2, alpha: 0.4 });
      graphics.ellipse(0, 18, 10, 3).stroke({ color: "#E0F2FE", width: 1, alpha: 0.45 });
      return;
    }

    if (activity === "sunbathe") {
      graphics.circle(16, -18, 6).fill({ color: "#FDE68A", alpha: 0.7 });
      graphics.circle(16, -18, 12).fill({ color: "#FDE68A", alpha: 0.15 });
      return;
    }

    if (activity === "look_around") {
      graphics.circle(16, -20, 3).fill({ color: "#BEF264", alpha: 0.85 });
      graphics.circle(16, -20, 8).stroke({ color: "#BEF264", width: 1, alpha: 0.3 });
    }
  };
}

function tileRect(tileX: number, tileY: number) {
  return {
    x: toSceneX(tileX),
    y: toSceneY(tileY),
    width: TILE_SIZE,
    height: TILE_SIZE,
  };
}

function findNearestPet(snapshot: GardenSnapshot, sceneX: number, sceneY: number) {
  return snapshot.pets
    .map((pet) => {
      const dx = sceneX - toSceneX(pet.state.tileX);
      const dy = sceneY - toSceneY(pet.state.tileY);
      return {
        pet,
        distance: Math.hypot(dx, dy),
      };
    })
    .filter((entry) => entry.distance <= 56)
    .sort((left, right) => left.distance - right.distance)[0]?.pet;
}

const terrainMapCache = new Map<GardenZoneId, ReturnType<typeof buildTerrainMap>>();

function cachedTerrainMap(zoneId: GardenZoneId) {
  const cached = terrainMapCache.get(zoneId);

  if (cached) {
    return cached;
  }

  const terrain = buildTerrainMap(zoneId);
  terrainMapCache.set(zoneId, terrain);
  return terrain;
}

function drawTerrainLayer(zoneId: GardenZoneId, nightAlpha: number) {
  return (graphics: Graphics) => {
    graphics.clear();

    const terrain = cachedTerrainMap(zoneId);

    for (const tile of terrain.tiles) {
      const rect = tileRect(tile.x, tile.y);
      let color = (tile.x + tile.y) % 2 === 0 ? "#8FD63C" : "#7BC92A";
      let alpha = 0.9;

      if (tile.type === "flower_grass") {
        color = (tile.x + tile.y) % 2 === 0 ? "#A3E635" : "#B7F14E";
        alpha = 0.96;
      } else if (tile.type === "bush_grass") {
        color = (tile.x + tile.y) % 2 === 0 ? "#5FA82C" : "#4B9224";
        alpha = 0.96;
      } else if (tile.type === "stone_path") {
        color = (tile.x + tile.y) % 2 === 0 ? "#DCCAA4" : "#CDBA93";
        alpha = 0.96;
      } else if (tile.type === "dirt_path") {
        color = (tile.x + tile.y) % 2 === 0 ? "#C98B58" : "#B67749";
        alpha = 0.94;
      } else if (tile.type === "water") {
        color = (tile.x + tile.y) % 2 === 0 ? "#2F7BFF" : "#2563EB";
        alpha = 0.92;
      } else if (tile.type === "lily") {
        color = "#7DDC74";
        alpha = 0.96;
      }

      graphics.rect(rect.x, rect.y, rect.width, rect.height).fill({ color, alpha });

      if (tile.type === "flower_grass") {
        graphics.rect(rect.x + 10, rect.y + 10, 4, 4).fill({
          color: zoneId === "grove" ? "#F472B6" : "#FDE047",
          alpha: 0.94,
        });
        graphics.rect(rect.x + 14, rect.y + 12, 4, 4).fill({ color: "#F8FAFC", alpha: 0.86 });
      }

      if (tile.type === "bush_grass") {
        graphics.rect(rect.x + 8, rect.y + 8, 3, 9).fill({ color: "#365314", alpha: 0.9 });
        graphics.rect(rect.x + 16, rect.y + 6, 3, 11).fill({ color: "#4D7C0F", alpha: 0.9 });
      }

      if (tile.type === "water") {
        graphics.rect(rect.x + 4, rect.y + 12, 20, 2).fill({ color: "#BAE6FD", alpha: 0.16 });
      }
    }

    if (zoneId === "pond") {
      for (let ring = 0; ring < 3; ring += 1) {
        graphics
          .ellipse(toSceneX(24), toSceneY(24), 208 - ring * 30, 94 - ring * 12)
          .stroke({ color: "#E0F2FE", width: 2, alpha: 0.08 - ring * 0.02 });
      }
    }

    if (nightAlpha > 0) {
      graphics
        .rect(PLAYFIELD_LEFT, PLAYFIELD_TOP, PLAYFIELD_RIGHT - PLAYFIELD_LEFT, PLAYFIELD_BOTTOM - PLAYFIELD_TOP)
        .fill({
          color: "#071018",
          alpha: nightAlpha * 0.08,
        });
    }
  };
}

function drawStructureLayer(zoneId: GardenZoneId, neonAlpha: number) {
  return (graphics: Graphics) => {
    graphics.clear();

    const terrain = cachedTerrainMap(zoneId);

    for (const structure of terrain.structures) {
      const baseX = toSceneX(structure.x);
      const baseY = toSceneY(structure.y);

      if (structure.kind === "bench") {
        graphics.roundRect(baseX - 18, baseY - 12, 36, 10, 3).fill({ color: "#7C4A1F", alpha: 0.9 });
        graphics.rect(baseX - 14, baseY - 20, 28, 6).fill({ color: "#A16207", alpha: 0.9 });
        continue;
      }

      if (structure.kind === "lamp") {
        graphics.rect(baseX - 2, baseY - 26, 4, 28).fill({ color: "#334155" });
        graphics.roundRect(baseX - 7, baseY - 36, 14, 12, 4).fill({ color: "#67E8F9", alpha: 0.9 });
        graphics.circle(baseX, baseY - 30, 18).fill({ color: "#67E8F9", alpha: 0.12 + neonAlpha * 0.12 });
        continue;
      }

      if (structure.kind === "cat_tree") {
        graphics.rect(baseX - 4, baseY - 32, 8, 36).fill({ color: "#8B5E34" });
        graphics.roundRect(baseX - 16, baseY - 20, 32, 8, 4).fill({ color: "#F5D0A9" });
        graphics.roundRect(baseX - 12, baseY - 38, 24, 8, 4).fill({ color: "#F5D0A9" });
        continue;
      }

      if (structure.kind === "dog_house") {
        graphics.rect(baseX - 16, baseY - 12, 32, 18).fill({ color: "#A16207" });
        graphics.poly([baseX - 18, baseY - 12, baseX, baseY - 28, baseX + 18, baseY - 12], true).fill({ color: "#EF4444" });
        graphics.roundRect(baseX - 6, baseY - 4, 12, 10, 4).fill({ color: "#111827" });
        continue;
      }

      if (structure.kind === "cat_basket") {
        graphics.ellipse(baseX, baseY, 18, 10).fill({ color: "#A16207" });
        graphics.ellipse(baseX, baseY - 2, 14, 6).fill({ color: "#60A5FA" });
        continue;
      }

      if (structure.kind === "toy_box") {
        graphics.rect(baseX - 12, baseY - 10, 24, 16).fill({ color: "#92400E" });
        graphics.rect(baseX - 10, baseY - 18, 20, 8).fill({ color: "#F59E0B" });
        continue;
      }

      if (structure.kind === "feeding_station") {
        graphics.rect(baseX - 10, baseY - 2, 20, 4).fill({ color: "#475569" });
        graphics.circle(baseX - 6, baseY - 8, 6).fill({ color: "#F59E0B" });
        graphics.circle(baseX + 6, baseY - 8, 6).fill({ color: "#60A5FA" });
        continue;
      }

      if (structure.kind === "bridge") {
        graphics.roundRect(baseX - 24, baseY - 4, 48, 10, 4).fill({ color: "#7C4A1F" });
        graphics.rect(baseX - 16, baseY - 10, 32, 4).fill({ color: "#A16207" });
        continue;
      }

      if (structure.kind === "water_bowl") {
        graphics.ellipse(baseX, baseY, 10, 5).fill({ color: "#60A5FA" });
      }
    }
  };
}

function drawTerrainDetailLayer(zoneId: GardenZoneId) {
  return (graphics: Graphics) => {
    graphics.clear();

    const terrain = cachedTerrainMap(zoneId);
    const tileMap = new Map(terrain.tiles.map((tile) => [`${tile.x}:${tile.y}`, tile.type]));

    for (const tile of terrain.tiles) {
      const rect = tileRect(tile.x, tile.y);
      const top = tileMap.get(`${tile.x}:${tile.y - 1}`);
      const right = tileMap.get(`${tile.x + 1}:${tile.y}`);

      if (tile.type === "stone_path" || tile.type === "dirt_path") {
        graphics.rect(rect.x, rect.y, rect.width, 2).fill({ color: "#F8FAFC", alpha: 0.14 });
        graphics.rect(rect.x, rect.y + rect.height - 2, rect.width, 2).fill({ color: "#7C4A1F", alpha: 0.12 });
      }

      if (tile.type === "water") {
        if (top !== "water") {
          graphics.rect(rect.x + 2, rect.y + 3, rect.width - 4, 2).fill({ color: "#E0F2FE", alpha: 0.2 });
        }

        if (right !== "water") {
          graphics.rect(rect.x + rect.width - 3, rect.y + 4, 2, rect.height - 8).fill({ color: "#0F4CC9", alpha: 0.12 });
        }
      }

      if (tile.type === "grass" && (tile.x + tile.y) % 5 === 0) {
        graphics.rect(rect.x + 6, rect.y + 18, 2, 8).fill({ color: "#6DAF24", alpha: 0.55 });
        graphics.rect(rect.x + 10, rect.y + 16, 2, 10).fill({ color: "#8FD63C", alpha: 0.46 });
      }
    }
  };
}

function drawGrid() {
  return (graphics: Graphics) => {
    graphics.clear();

    for (let x = 0; x < LOGICAL_COLS; x += 1) {
      const sceneX = toSceneX(x);
      graphics.moveTo(sceneX, PLAYFIELD_TOP);
      graphics.lineTo(sceneX, PLAYFIELD_BOTTOM);
    }

    for (let y = 0; y < LOGICAL_ROWS; y += 1) {
      const sceneY = toSceneY(y);
      graphics.moveTo(PLAYFIELD_LEFT, sceneY);
      graphics.lineTo(PLAYFIELD_RIGHT, sceneY);
    }

    graphics.stroke({ color: "#FFFFFF", alpha: 0.035, width: 1 });
  };
}

function drawTravelGate(direction: "west" | "east") {
  return (graphics: Graphics) => {
    graphics.clear();

    const pillarOffset = direction === "west" ? 10 : -10;

    for (const side of [-52, 52]) {
      graphics.roundRect(pillarOffset - 5, side - 46, 10, 92, 4).fill({ color: "#0E2233", alpha: 0.92 });
      graphics.roundRect(pillarOffset - 3, side - 42, 6, 84, 3).fill({ color: "#67E8F9", alpha: 0.34 });
      graphics.circle(pillarOffset, side - 46, 7).fill({ color: "#BEF264", alpha: 0.85 });
      graphics.circle(pillarOffset, side - 46, 14).fill({ color: "#BEF264", alpha: 0.16 });
    }

    graphics
      .roundRect(pillarOffset - 2, -52, 4, 104, 2)
      .fill({ color: "#67E8F9", alpha: 0.1 });
  };
}

function routePath(overlay: AutonomyMapOverlay) {
  const startX = toSceneX(overlay.start.tileX);
  const startY = toSceneY(overlay.start.tileY) - 38;
  const endX = toSceneX(overlay.target.tileX);
  const endY = toSceneY(overlay.target.tileY) - 38;
  const midpointY = Math.min(startY, endY) - Math.max(42, Math.abs(endX - startX) * 0.08);

  return `M ${startX} ${startY} C ${startX} ${midpointY}, ${endX} ${midpointY}, ${endX} ${endY}`;
}

function routeEndpoint(overlay: AutonomyMapOverlay, point: "start" | "target") {
  const tile = point === "start" ? overlay.start : overlay.target;
  return {
    x: toSceneX(tile.tileX),
    y: toSceneY(tile.tileY) - 38,
  };
}

function DynamicWorldObjectNode({ object }: { object: WorldObject }) {
  const containerRef = useRef<Container | null>(null);
  const baseX = toSceneX(object.tileX);
  const baseY = toSceneY(object.tileY);

  useTick((ticker) => {
    if (!containerRef.current) {
      return;
    }

    const elapsed = ticker.lastTime / 260;

    if (object.type === "butterfly") {
      containerRef.current.x = baseX + Math.sin(elapsed + object.tileX) * 22;
      containerRef.current.y = baseY - 22 + Math.cos(elapsed * 1.1 + object.tileY) * 10;
      return;
    }

    if (object.type === "lamp") {
      containerRef.current.alpha = 0.92 + Math.sin(elapsed * 0.8 + object.tileX) * 0.08;
      return;
    }

    if (object.type === "fountain") {
      containerRef.current.y = baseY + Math.sin(elapsed * 1.4 + object.tileY) * 3;
    }
  });

  return (
    <pixiContainer ref={containerRef} x={baseX} y={baseY}>
      <pixiGraphics draw={drawDynamicObject(object)} />
    </pixiContainer>
  );
}

function SceneryWorldObjectNode({
  neonAlpha,
  object,
}: {
  neonAlpha: number;
  object: WorldObject;
}) {
  const containerRef = useRef<Container | null>(null);
  const baseX = toSceneX(object.tileX);
  const baseY = toSceneY(object.tileY);
  const scale =
    object.type === "tree" ? 1.65 : object.type === "bush" ? 1.2 : object.type === "stone" ? 1.08 : 1;

  useTick((ticker) => {
    if (!containerRef.current) {
      return;
    }

    const elapsed = ticker.lastTime / 1400;

    if (object.type === "tree") {
      containerRef.current.x = baseX + Math.sin(elapsed + object.tileX * 0.23) * 1.8;
      containerRef.current.y = baseY + Math.cos(elapsed * 0.7 + object.tileY * 0.17) * 0.8;
      return;
    }

    if (object.type === "bush") {
      containerRef.current.x = baseX + Math.sin(elapsed * 0.8 + object.tileX * 0.3) * 0.9;
      return;
    }
  });

  return (
    <pixiContainer ref={containerRef} scale={scale} x={baseX} y={baseY}>
      <pixiGraphics draw={drawSceneryObject(object, neonAlpha)} />
    </pixiContainer>
  );
}

function EnvironmentActorNode({ actor }: { actor: EnvironmentActor }) {
  const containerRef = useRef<Container | null>(null);
  const baseX = toSceneX(actor.tileX);
  const baseY = toSceneY(actor.tileY);

  useTick((ticker) => {
    if (!containerRef.current) {
      return;
    }

    const elapsed = ticker.lastTime / 320;
    const sway = Math.sin(elapsed * actor.drift + actor.tileX) * 10 * actor.scale;
    const bob = Math.cos(elapsed * (actor.drift * 1.2) + actor.tileY) * 6 * actor.scale;

    if (actor.layer === "sky") {
      containerRef.current.x = baseX + sway * 1.2;
      containerRef.current.y = baseY - 160 + bob;
      return;
    }

    if (actor.layer === "shadow") {
      containerRef.current.x = baseX + sway * 1.1;
      containerRef.current.y = baseY + 26;
      containerRef.current.alpha = 0.55;
      return;
    }

    if (actor.kind === "duck" || actor.kind === "fish") {
      containerRef.current.x = baseX + sway;
      containerRef.current.y = baseY + bob * 0.4;
      return;
    }

    containerRef.current.x = baseX + sway;
    containerRef.current.y = baseY - 18 + bob;
  });

  return (
    <pixiContainer ref={containerRef} x={baseX} y={baseY} scale={actor.scale}>
      <pixiGraphics draw={drawEnvironmentActor(actor)} />
    </pixiContainer>
  );
}

type PetTextureFrames = Record<"rest" | "amble" | "trot" | "sprint" | "sleep", Texture[]>;

export interface PlayerWorldState {
  sceneX: number;
  sceneY: number;
  tileX: number;
  tileY: number;
  zoneId: GardenZoneId;
  moving: boolean;
}

const petFrameCache = new Map<string, Promise<PetTextureFrames | null>>();

function loadPetFrames(spritePath: string, species: Species) {
  const cacheKey = `${species}:${spritePath}`;
  const cached = petFrameCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const pending = fetch(spritePath, { cache: "force-cache" })
    .then((response) => response.text())
    .then((svgText) => {
      const frameUrls = buildPetFrameUrls(svgText, species);
      return Promise.all([
        Promise.all(frameUrls.rest.map((url) => Assets.load(url))),
        Promise.all(frameUrls.amble.map((url) => Assets.load(url))),
        Promise.all(frameUrls.trot.map((url) => Assets.load(url))),
        Promise.all(frameUrls.sprint.map((url) => Assets.load(url))),
        Promise.all(frameUrls.sleep.map((url) => Assets.load(url))),
      ]);
    })
    .then(([rest, amble, trot, sprint, sleep]) => ({
      rest,
      amble,
      trot,
      sprint,
      sleep,
    }))
    .catch(() =>
      Assets.load(spritePath)
        .then((loaded) => ({
          rest: [loaded],
          amble: [loaded],
          trot: [loaded],
          sprint: [loaded],
          sleep: [loaded],
        }))
        .catch(() => null),
    );

  petFrameCache.set(cacheKey, pending);
  return pending;
}

function activityIdleOffsetY(activity: PetActivity) {
  if (activity === "climb_tree") {
    return -140;
  }

  if (activity === "hide") {
    return 18;
  }

  if (activity === "sleep") {
    return 6;
  }

  if (activity === "watch_fish") {
    return -8;
  }

  return 0;
}

function PetSpriteNode({
  pet,
  selected,
  allowBubble,
  socialBubble,
  playerRef,
  viewerOwnsPet,
}: {
  pet: GardenPetSnapshot;
  selected: boolean;
  allowBubble: boolean;
  socialBubble?: { text: string; kind: "speech" };
  playerRef: React.MutableRefObject<PlayerWorldState>;
  viewerOwnsPet: boolean;
}) {
  const containerRef = useRef<Container | null>(null);
  const spriteRef = useRef<Sprite | null>(null);
  const bubbleRef = useRef<Container | null>(null);
  const noticeRef = useRef<Text | null>(null);
  const motionRef = useRef<{ x: number; y: number } | null>(null);
  const waypointsRef = useRef<Array<{ x: number; y: number }>>([]);
  const plannedTargetRef = useRef<{ tileX: number; tileY: number; zoneId: GardenZoneId } | null>(null);
  const lastPlanAtRef = useRef(0);
  const noticeUntilRef = useRef(0);
  const lastNoticeAtRef = useRef(0);
  const facingRef = useRef(pet.state.facing === "left" ? -1 : 1);
  // Deterministic per-pet phase offset staggers the walk cycles.
  const gaitPhaseRef = useRef((petJitterOffset(pet.pet.id).x + 10) * 0.61);
  const motionClockRef = useRef(0);
  const frameIndexRef = useRef(-1);
  const currentSpeedRef = useRef(0);
  const spritePath = pet.generation.worldSpritePath ?? "/generated/world-nyx.svg";
  const [frames, setFrames] = useState<PetTextureFrames | null>(null);
  const jitter = useMemo(() => petJitterOffset(pet.pet.id), [pet.pet.id]);
  const zoneId = pet.state.zoneId;
  const targetTileX = pet.state.tileX;
  const targetTileY = pet.state.tileY;
  const activity = pet.state.activity;
  const tier = movementTier(activity);
  const tilesPerSecond = tierTilesPerSecond(tier, pet.personality.zoomies);
  // Growth stage reads directly in the world: awakened pets stand taller.
  const stageScale =
    pet.growth?.stage === "awakened" ? 1.12 : pet.growth?.stage === "synced" ? 1 : 0.9;
  const baseScale = (selected ? 2.18 : 2.08) * stageScale;
  const tone = activityTone(activity);
  const toneColor = activityToneColors[tone];
  const showActivityLabel =
    selected ||
    Boolean(pet.state.currentBubble?.text) ||
    Boolean(socialBubble?.text) ||
    tone === "social" ||
    tone === "conflict";
  const bubbleText =
    socialBubble?.text ??
    pet.state.currentBubble?.text ??
    (activity === "sleep" && !selected ? "z" : moodBubble(pet.state.mood));
  const bubbleKind = socialBubble?.kind ?? pet.state.currentBubble?.kind ?? "thought";

  useEffect(() => {
    let cancelled = false;

    void loadPetFrames(spritePath, pet.pet.species).then((loadedFrames) => {
      if (!cancelled) {
        setFrames(loadedFrames);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pet.pet.species, spritePath]);

  useEffect(() => {
    motionRef.current = null;
    waypointsRef.current = [];
    plannedTargetRef.current = null;
  }, [pet.pet.id]);

  useEffect(() => {
    frameIndexRef.current = -1;
  }, [activity]);

  // Plan a walking path whenever the server assigns a new destination tile.
  useEffect(() => {
    const planned = plannedTargetRef.current;

    if (planned && planned.zoneId !== zoneId) {
      motionRef.current = null;
      waypointsRef.current = [];
    }

    if (
      planned &&
      planned.zoneId === zoneId &&
      planned.tileX === targetTileX &&
      planned.tileY === targetTileY
    ) {
      return;
    }

    plannedTargetRef.current = { tileX: targetTileX, tileY: targetTileY, zoneId };

    if (!motionRef.current) {
      // First sighting: appear in place, no walk-in.
      motionRef.current = {
        x: toSceneX(targetTileX),
        y: toSceneY(targetTileY),
      };
      waypointsRef.current = [];
      return;
    }

    const fromTile = {
      tileX: Math.round(toTileX(motionRef.current.x)),
      tileY: Math.round(toTileY(motionRef.current.y)),
    };
    const path = findWalkingPath(zoneId, fromTile, { tileX: targetTileX, tileY: targetTileY });
    waypointsRef.current = path.map((waypoint) => ({
      x: toSceneX(waypoint.tileX),
      y: toSceneY(waypoint.tileY),
    }));
    lastPlanAtRef.current = Date.now();
  }, [targetTileX, targetTileY, zoneId]);

  useTick((ticker) => {
    motionClockRef.current += ticker.deltaMS;
    const elapsedSeconds = motionClockRef.current / 1000;
    const deltaSeconds = ticker.deltaMS / 1000;
    const player = playerRef.current;
    const nowMs = Date.now();

    if (!motionRef.current) {
      motionRef.current = {
        x: toSceneX(targetTileX),
        y: toSceneY(targetTileY),
      };
    }

    const motion = motionRef.current;

    // seek_owner chases the live player position when the viewer owns this pet.
    if (activity === "seek_owner" && viewerOwnsPet && player.zoneId === zoneId) {
      const distanceToPlayer = Math.hypot(player.sceneX - motion.x, player.sceneY - motion.y);

      if (distanceToPlayer > TILE_SIZE * 1.7 && nowMs - lastPlanAtRef.current > 650) {
        const path = findWalkingPath(
          zoneId,
          { tileX: Math.round(toTileX(motion.x)), tileY: Math.round(toTileY(motion.y)) },
          { tileX: Math.round(toTileX(player.sceneX)), tileY: Math.round(toTileY(player.sceneY)) },
        );
        waypointsRef.current = path.map((waypoint) => ({
          x: toSceneX(waypoint.tileX),
          y: toSceneY(waypoint.tileY),
        }));
        lastPlanAtRef.current = nowMs;
      }

      if (distanceToPlayer <= TILE_SIZE * 1.7) {
        waypointsRef.current = [];
      }
    }

    // Walk along the planned waypoints at the activity speed.
    let remainingStep = Math.max(tilesPerSecond, 1.2) * TILE_SIZE * deltaSeconds;
    let moved = false;

    while (remainingStep > 0 && waypointsRef.current.length > 0) {
      const next = waypointsRef.current[0];
      const dx = next.x - motion.x;
      const dy = next.y - motion.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= remainingStep) {
        motion.x = next.x;
        motion.y = next.y;
        remainingStep -= distance;
        waypointsRef.current.shift();
      } else {
        motion.x += (dx / distance) * remainingStep;
        motion.y += (dy / distance) * remainingStep;
        remainingStep = 0;
      }

      if (Math.abs(dx) > 1.5) {
        facingRef.current = dx < 0 ? -1 : 1;
      }

      moved = true;
    }

    currentSpeedRef.current = moved ? tilesPerSecond : 0;

    if (moved) {
      gaitPhaseRef.current += deltaSeconds * (4 + tilesPerSecond * 1.6);
    }

    // Face the player when idle and nearby; occasionally flash a notice mark.
    if (!moved && player.zoneId === zoneId && activity !== "sleep" && activity !== "hide") {
      const distanceToPlayer = Math.hypot(player.sceneX - motion.x, player.sceneY - motion.y);

      if (distanceToPlayer < TILE_SIZE * PROXIMITY_NOTICE_TILES) {
        if (Math.abs(player.sceneX - motion.x) > 6) {
          facingRef.current = player.sceneX < motion.x ? -1 : 1;
        }

        if (nowMs - lastNoticeAtRef.current > 30000) {
          lastNoticeAtRef.current = nowMs;
          noticeUntilRef.current = nowMs + 2100;
        }
      }
    }

    const idleBob = moved ? 0 : Math.sin(elapsedSeconds * 1.6 + jitter.x) * 1.1;
    const hop = moved ? Math.abs(Math.sin(gaitPhaseRef.current)) * Math.min(5, 1.2 + tilesPerSecond) : 0;
    const scuffleShakeX =
      !moved && activity === "scuffle" ? Math.sin(elapsedSeconds * 23 + jitter.x) * 6 : 0;
    const scuffleShakeY =
      !moved && activity === "scuffle" ? Math.cos(elapsedSeconds * 29 + jitter.y) * 3.5 : 0;

    if (containerRef.current) {
      containerRef.current.x = motion.x + jitter.x + scuffleShakeX;
      containerRef.current.y =
        motion.y + jitter.y + activityIdleOffsetY(moved ? "idle" : activity) + idleBob + scuffleShakeY - hop;
      containerRef.current.zIndex = motion.y;
    }

    if (spriteRef.current) {
      const activeFramesNow = frames
        ? moved
          ? frames[walkingFrameBucket(tilesPerSecond)]
          : frames[frameBucketForActivity(activity)]
        : [];

      if (activeFramesNow.length > 0) {
        const duration = moved ? walkingFrameDurationMs(tilesPerSecond) : frameDurationMs(activity);
        const nextFrameIndex = Math.floor(motionClockRef.current / duration) % activeFramesNow.length;

        if (frameIndexRef.current !== nextFrameIndex) {
          frameIndexRef.current = nextFrameIndex;
          spriteRef.current.texture = activeFramesNow[nextFrameIndex];
        }
      }

      const stretch = moved ? 1 + Math.sin(gaitPhaseRef.current) * 0.03 : 1 + Math.sin(elapsedSeconds * 1.4) * 0.012;
      const squash = moved ? 1 - Math.sin(gaitPhaseRef.current) * 0.02 : 1 + Math.cos(elapsedSeconds * 1.2) * 0.01;

      spriteRef.current.scale.x = facingRef.current * baseScale * stretch;
      spriteRef.current.scale.y = baseScale * squash;
      spriteRef.current.rotation =
        !moved && activity === "scuffle"
          ? Math.sin(elapsedSeconds * 18) * 0.16
          : !moved && (activity === "sleep" || activity === "sunbathe")
            ? -0.08
            : moved
              ? Math.sin(gaitPhaseRef.current * 0.5) * 0.02
              : 0;
      spriteRef.current.alpha = activity === "hide" ? 0.82 : 1;
    }

    if (bubbleRef.current) {
      bubbleRef.current.y = -96 + Math.sin(elapsedSeconds * 0.9 + jitter.y) * 4;
    }

    if (noticeRef.current) {
      noticeRef.current.alpha = nowMs < noticeUntilRef.current ? 0.95 : 0;
      noticeRef.current.y = -118 - Math.max(0, Math.sin(elapsedSeconds * 6)) * 4;
    }
  });

  const initialFrames = frames?.[frameBucketForActivity(activity)] ?? [];

  return (
    <pixiContainer ref={containerRef}>
      <pixiGraphics draw={drawShadow(selected)} y={48} />
      <pixiGraphics draw={drawActivityFx(activity)} y={38} />
      {showActivityLabel ? (
        <pixiGraphics
          draw={(graphics) => {
            graphics.clear();
            graphics.circle(0, 18, selected ? 58 : 50).stroke({
              color: toneColor.stroke,
              width: selected ? 4 : 2,
              alpha: selected ? 0.58 : 0.34,
            });
          }}
        />
      ) : null}
      {initialFrames[0] ? <pixiSprite ref={spriteRef} texture={initialFrames[0]} anchor={0.5} /> : null}
      <pixiText
        ref={noticeRef}
        alpha={0}
        anchor={0.5}
        text="!"
        x={0}
        y={-118}
        style={{
          fill: "#BEF264",
          fontFamily: "monospace",
          fontSize: 26,
          fontWeight: "900",
          stroke: { color: "#12250B", width: 4 },
        }}
      />
      {allowBubble && (pet.state.currentBubble?.text || shouldShowBubble(selected, pet.state.mood, activity)) ? (
        <pixiContainer ref={bubbleRef} x={24} y={-96}>
          <pixiGraphics draw={drawMoodBubble(selected, bubbleKind)} />
          <pixiText
            text={bubbleText}
            x={selected ? 10 : 8}
            y={5}
            style={{
              fill: "#0B1720",
              fontFamily: "monospace",
              fontSize: pet.state.currentBubble?.text ? (selected ? 11 : 10) : selected ? 15 : 13,
              fontWeight: "700",
              wordWrap: true,
              wordWrapWidth: selected ? 100 : 88,
            }}
          />
        </pixiContainer>
      ) : null}
      {showActivityLabel ? (
        <pixiGraphics
          x={selected ? -64 : -54}
          y={selected ? 64 : 66}
          draw={(graphics) => {
            graphics.clear();
            graphics.roundRect(0, 0, selected ? 128 : 108, selected ? 22 : 18, selected ? 8 : 7)
              .fill({ color: toneColor.fill, alpha: selected ? 0.78 : 0.64 })
              .stroke({ color: toneColor.stroke, width: 1, alpha: selected ? 0.34 : 0.22 });
          }}
        />
      ) : null}
      {showActivityLabel ? (
        <pixiText
          text={selected ? `${pet.pet.name} · ${activityLabel(activity)}` : activityLabel(activity)}
          x={selected ? -58 : -48}
          y={selected ? 68 : 69}
          style={{
            fill: toneColor.text,
            fontFamily: "monospace",
            fontSize: selected ? 11 : 9,
            fontWeight: "700",
            wordWrap: true,
            wordWrapWidth: selected ? 112 : 94,
          }}
        />
      ) : null}
      {selected ? (
        <pixiGraphics
          x={-42}
          y={84}
          draw={(graphics) => {
            graphics.clear();
            graphics.roundRect(0, 0, 86, 6, 3).fill({ color: "#102330", alpha: 0.72 });
            graphics.roundRect(0, 0, 86 * (pet.state.energy / 100), 6, 3).fill({ color: "#BEFE5F" });
          }}
        />
      ) : null}
    </pixiContainer>
  );
}

function drawPlayerBody(part: "cloak" | "torso" | "visor" | "antenna") {
  return (graphics: Graphics) => {
    graphics.clear();

    if (part === "cloak") {
      graphics.poly([-16, -10, 16, -10, 20, 26, -20, 26], true).fill({ color: "#101B2E", alpha: 0.98 });
      graphics.poly([-16, -10, 16, -10, 14, 0, -14, 0], true).fill({ color: "#182A44", alpha: 0.95 });
      graphics.rect(-20, 22, 40, 4).fill({ color: "#67E8F9", alpha: 0.35 });
      return;
    }

    if (part === "torso") {
      graphics.roundRect(-13, -30, 26, 24, 9).fill({ color: "#1E293B" });
      graphics.roundRect(-13, -30, 26, 8, 6).fill({ color: "#33415C" });
      graphics.rect(-13, -12, 26, 2).fill({ color: "#BEF264", alpha: 0.8 });
      return;
    }

    if (part === "visor") {
      graphics.roundRect(-10, -46, 20, 18, 7).fill({ color: "#0B1220" });
      graphics.roundRect(-8, -42, 16, 7, 3).fill({ color: "#67E8F9", alpha: 0.95 });
      graphics.roundRect(-8, -42, 7, 7, 3).fill({ color: "#BEF264", alpha: 0.9 });
      return;
    }

    graphics.rect(-1, -58, 2, 12).fill({ color: "#33415C" });
    graphics.circle(0, -60, 3).fill({ color: "#F472B6", alpha: 0.95 });
    graphics.circle(0, -60, 7).fill({ color: "#F472B6", alpha: 0.2 });
  };
}

function drawPlayerLeg() {
  return (graphics: Graphics) => {
    graphics.clear();
    graphics.roundRect(-3.5, 0, 7, 14, 3).fill({ color: "#0F172A" });
    graphics.roundRect(-4.5, 11, 9, 5, 2).fill({ color: "#67E8F9", alpha: 0.8 });
  };
}

function PlayerAvatarNode({
  playerRef,
  displayName,
}: {
  playerRef: React.MutableRefObject<PlayerWorldState>;
  displayName?: string;
}) {
  const containerRef = useRef<Container | null>(null);
  const bodyRef = useRef<Container | null>(null);
  const leftLegRef = useRef<Container | null>(null);
  const rightLegRef = useRef<Container | null>(null);
  const glowRef = useRef<Graphics | null>(null);
  const gaitRef = useRef(0);
  const facingRef = useRef(1);
  const lastXRef = useRef<number | null>(null);

  useTick((ticker) => {
    const player = playerRef.current;
    const deltaSeconds = ticker.deltaMS / 1000;

    if (!containerRef.current) {
      return;
    }

    containerRef.current.visible = true;
    containerRef.current.x = player.sceneX;
    containerRef.current.y = player.sceneY;
    containerRef.current.zIndex = player.sceneY + 0.5;

    const deltaX = player.sceneX - (lastXRef.current ?? player.sceneX);
    lastXRef.current = player.sceneX;

    if (Math.abs(deltaX) > 0.4) {
      facingRef.current = deltaX < 0 ? -1 : 1;
    }

    if (player.moving) {
      gaitRef.current += deltaSeconds * 11;
    } else {
      gaitRef.current *= 0.9;
    }

    const swing = Math.sin(gaitRef.current);
    const bob = player.moving ? Math.abs(Math.sin(gaitRef.current)) * 3 : Math.sin(ticker.lastTime / 640) * 1.2;

    if (bodyRef.current) {
      bodyRef.current.y = -bob;
      bodyRef.current.scale.x = facingRef.current;
      bodyRef.current.rotation = player.moving ? swing * 0.04 : 0;
    }

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.x = -6;
      rightLegRef.current.x = 6;
      leftLegRef.current.rotation = player.moving ? swing * 0.55 : 0;
      rightLegRef.current.rotation = player.moving ? -swing * 0.55 : 0;
    }

    if (glowRef.current) {
      glowRef.current.alpha = 0.5 + Math.sin(ticker.lastTime / 420) * 0.16;
    }
  });

  return (
    <pixiContainer ref={containerRef} visible={false}>
      <pixiGraphics draw={drawShadow(false)} y={26} />
      <pixiGraphics
        ref={glowRef}
        draw={(graphics) => {
          graphics.clear();
          graphics.ellipse(0, 26, 26, 9).stroke({ color: "#67E8F9", width: 2, alpha: 0.7 });
        }}
      />
      <pixiContainer ref={leftLegRef} y={10}>
        <pixiGraphics draw={drawPlayerLeg()} />
      </pixiContainer>
      <pixiContainer ref={rightLegRef} y={10}>
        <pixiGraphics draw={drawPlayerLeg()} />
      </pixiContainer>
      <pixiContainer ref={bodyRef}>
        <pixiGraphics draw={drawPlayerBody("cloak")} y={-6} />
        <pixiGraphics draw={drawPlayerBody("torso")} />
        <pixiGraphics draw={drawPlayerBody("visor")} />
        <pixiGraphics draw={drawPlayerBody("antenna")} />
      </pixiContainer>
      <pixiText
        anchor={0.5}
        text={displayName ? `◈ ${displayName}` : "◈ 你"}
        y={-74}
        style={{
          fill: "#BEF264",
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: "700",
          stroke: { color: "#0B1720", width: 3 },
        }}
      />
    </pixiContainer>
  );
}

interface CameraRigProps {
  playerRef: React.MutableRefObject<PlayerWorldState>;
  keyboardRef: React.MutableRefObject<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    sprint: boolean;
  }>;
  holdTargetRef: React.MutableRefObject<{ sceneX: number; sceneY: number } | null>;
  walkPathRef: React.MutableRefObject<Array<{ x: number; y: number }>>;
  cameraContainerRef: React.MutableRefObject<Container | null>;
  overlayWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  backdropWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  viewportSizeRef: React.MutableRefObject<{ width: number; height: number }>;
  cameraFocusRef: React.MutableRefObject<{ sceneX: number; sceneY: number; untilMs: number } | null>;
  cameraPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  onPlayerTileChange: (tileX: number, tileY: number) => void;
  onGateEnter: (direction: "west" | "east") => void;
}

function CameraRig({
  playerRef,
  keyboardRef,
  holdTargetRef,
  walkPathRef,
  cameraContainerRef,
  overlayWrapperRef,
  backdropWrapperRef,
  viewportSizeRef,
  cameraFocusRef,
  cameraPositionRef,
  onPlayerTileChange,
  onGateEnter,
}: CameraRigProps) {
  const lastTileRef = useRef<{ tileX: number; tileY: number } | null>(null);
  const gateArmedRef = useRef(true);

  useTick((ticker) => {
    const deltaSeconds = Math.min(0.05, ticker.deltaMS / 1000);
    const player = playerRef.current;
    const keys = keyboardRef.current;
    const speed =
      (keys.sprint ? PLAYER_SPRINT_TILES_PER_SECOND : PLAYER_WALK_TILES_PER_SECOND) *
      TILE_SIZE *
      deltaSeconds;

    let inputX = 0;
    let inputY = 0;

    if (keys.left) {
      inputX -= 1;
    }

    if (keys.right) {
      inputX += 1;
    }

    if (keys.up) {
      inputY -= 1;
    }

    if (keys.down) {
      inputY += 1;
    }

    const hasKeyboardInput = inputX !== 0 || inputY !== 0;

    if (hasKeyboardInput) {
      walkPathRef.current = [];
      holdTargetRef.current = null;
    }

    let stepX = 0;
    let stepY = 0;

    if (hasKeyboardInput) {
      const magnitude = Math.hypot(inputX, inputY) || 1;
      stepX = (inputX / magnitude) * speed;
      stepY = (inputY / magnitude) * speed;
    } else if (holdTargetRef.current) {
      const target = holdTargetRef.current;
      const dx = target.sceneX - player.sceneX;
      const dy = target.sceneY - player.sceneY;
      const distance = Math.hypot(dx, dy);

      if (distance > 6) {
        stepX = (dx / distance) * Math.min(speed, distance);
        stepY = (dy / distance) * Math.min(speed, distance);
      }
    } else if (walkPathRef.current.length > 0) {
      let remaining = speed;

      while (remaining > 0 && walkPathRef.current.length > 0) {
        const next = walkPathRef.current[0];
        const dx = next.x - player.sceneX;
        const dy = next.y - player.sceneY;
        const distance = Math.hypot(dx, dy);

        if (distance <= remaining) {
          player.sceneX = next.x;
          player.sceneY = next.y;
          remaining -= distance;
          walkPathRef.current.shift();
        } else {
          player.sceneX += (dx / distance) * remaining;
          player.sceneY += (dy / distance) * remaining;
          remaining = 0;
        }
      }
    }

    const tryStep = (candidateX: number, candidateY: number) => {
      const clampedX = Math.max(PLAYFIELD_LEFT + 8, Math.min(PLAYFIELD_RIGHT - 8, candidateX));
      const clampedY = Math.max(PLAYFIELD_TOP + 16, Math.min(PLAYFIELD_BOTTOM - 8, candidateY));
      const tileX = Math.round(toTileX(clampedX));
      const tileY = Math.round(toTileY(clampedY));

      if (isWalkableTile(player.zoneId, tileX, tileY)) {
        player.sceneX = clampedX;
        player.sceneY = clampedY;
        return true;
      }

      return false;
    };

    if (stepX !== 0 || stepY !== 0) {
      if (!tryStep(player.sceneX + stepX, player.sceneY + stepY)) {
        if (!tryStep(player.sceneX + stepX, player.sceneY)) {
          tryStep(player.sceneX, player.sceneY + stepY);
        }
      }
    }

    player.moving =
      stepX !== 0 ||
      stepY !== 0 ||
      walkPathRef.current.length > 0 ||
      Boolean(holdTargetRef.current && Math.hypot(
        (holdTargetRef.current?.sceneX ?? player.sceneX) - player.sceneX,
        (holdTargetRef.current?.sceneY ?? player.sceneY) - player.sceneY,
      ) > 6);

    const tileX = Math.round(toTileX(player.sceneX));
    const tileY = Math.round(toTileY(player.sceneY));

    player.tileX = tileX;
    player.tileY = tileY;

    if (!lastTileRef.current || tileX !== lastTileRef.current.tileX || tileY !== lastTileRef.current.tileY) {
      lastTileRef.current = { tileX, tileY };
      onPlayerTileChange(tileX, tileY);
    }

    // Travel gates on the east/west edges.
    const inGateBand = tileY >= GATE_BAND_MIN_TILE_Y && tileY <= GATE_BAND_MAX_TILE_Y;

    if (inGateBand && gateArmedRef.current) {
      if (tileX <= 1) {
        gateArmedRef.current = false;
        onGateEnter("west");
      } else if (tileX >= LOGICAL_COLS - 2) {
        gateArmedRef.current = false;
        onGateEnter("east");
      }
    } else if (tileX > 2 && tileX < LOGICAL_COLS - 3) {
      gateArmedRef.current = true;
    }

    // Camera follows the player (or a temporary focus target) with a lerp.
    const focus = cameraFocusRef.current;
    const focusActive = focus && Date.now() < focus.untilMs;
    const focusX = focusActive ? focus.sceneX : player.sceneX;
    const focusY = focusActive ? focus.sceneY : player.sceneY;

    if (focus && !focusActive) {
      cameraFocusRef.current = null;
    }

    const viewport = viewportSizeRef.current;
    const maxCameraX = Math.max(0, SCENE_WIDTH - viewport.width);
    const maxCameraY = Math.max(0, SCENE_HEIGHT - viewport.height);
    const desiredX = Math.max(0, Math.min(maxCameraX, focusX - viewport.width / 2));
    const desiredY = Math.max(0, Math.min(maxCameraY, focusY - viewport.height / 2));
    const camera = cameraPositionRef.current;

    camera.x += (desiredX - camera.x) * Math.min(1, CAMERA_LERP * (ticker.deltaMS / 16.6));
    camera.y += (desiredY - camera.y) * Math.min(1, CAMERA_LERP * (ticker.deltaMS / 16.6));

    const appliedX = Math.round(camera.x);
    const appliedY = Math.round(camera.y);

    if (cameraContainerRef.current) {
      cameraContainerRef.current.x = -appliedX;
      cameraContainerRef.current.y = -appliedY;
    }

    const transform = `translate3d(${-appliedX}px, ${-appliedY}px, 0)`;

    if (overlayWrapperRef.current) {
      overlayWrapperRef.current.style.transform = transform;
    }

    if (backdropWrapperRef.current) {
      backdropWrapperRef.current.style.transform = transform;
    }
  });

  return null;
}

export interface ProximityPetAction {
  petId: string;
  action: OwnerAction;
}

export function GardenCanvas({
  autonomyOverlays: providedAutonomyOverlays,
  snapshot,
  zones,
  selectedPetId,
  selectedAutonomyRouteId,
  selectedEncounterId,
  onSelectPet,
  onSelectAutonomyRoute,
  onSelectEncounter,
  onOwnerAction,
  onOpenChat,
  onTravel,
  onPlayerTileChange,
  travelLocked,
  viewerId,
  viewerName,
}: {
  snapshot: GardenSnapshot;
  zones?: GardenZone[];
  autonomyOverlays?: AutonomyMapOverlay[];
  selectedPetId?: string;
  selectedAutonomyRouteId?: string;
  selectedEncounterId?: string;
  onSelectPet: (petId: string) => void;
  onSelectAutonomyRoute?: (overlayId: string) => void;
  onSelectEncounter?: (encounterId: string, participantPetId?: string) => void;
  onOwnerAction?: (action: ProximityPetAction) => void;
  onOpenChat?: (petId: string) => void;
  onTravel?: (zoneId: GardenZoneId) => void;
  onPlayerTileChange?: (tileX: number, tileY: number) => void;
  travelLocked?: boolean;
  viewerId?: string;
  viewerName?: string;
}) {
  const zoneId = snapshot.zone.id;
  const renderableObjects = useMemo(
    () => snapshot.objects.filter(isRenderableObject),
    [snapshot.objects],
  );
  const sceneryObjects = useMemo(
    () => snapshot.objects.filter(isSceneryObject),
    [snapshot.objects],
  );
  const environmentActors = useMemo(
    () =>
      [...snapshot.environmentActors].sort(
        (left, right) => environmentLayerOrder[left.layer] - environmentLayerOrder[right.layer],
      ),
    [snapshot.environmentActors],
  );
  const selectedPet = useMemo(
    () => snapshot.pets.find((entry) => entry.pet.id === selectedPetId),
    [selectedPetId, snapshot.pets],
  );

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const overlayWrapperRef = useRef<HTMLDivElement | null>(null);
  const backdropWrapperRef = useRef<HTMLDivElement | null>(null);
  const cameraContainerRef = useRef<Container | null>(null);
  const viewportSizeRef = useRef({ width: 960, height: 540 });
  const cameraPositionRef = useRef({ x: 0, y: 0 });
  const cameraFocusRef = useRef<{ sceneX: number; sceneY: number; untilMs: number } | null>(null);
  const holdTargetRef = useRef<{ sceneX: number; sceneY: number } | null>(null);
  const walkPathRef = useRef<Array<{ x: number; y: number }>>([]);
  const pointerStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startedAt: number;
    holdActive: boolean;
  } | null>(null);
  const pendingSpawnRef = useRef<TilePoint | null>(null);

  const spawn = zoneSpawnTile[zoneId];
  const playerRef = useRef<PlayerWorldState>({
    sceneX: toSceneX(spawn.tileX),
    sceneY: toSceneY(spawn.tileY),
    tileX: spawn.tileX,
    tileY: spawn.tileY,
    zoneId,
    moving: false,
  });
  const keyboardRef = usePlayerKeyboard(true);
  const [playerTile, setPlayerTile] = useState<TilePoint>({ tileX: spawn.tileX, tileY: spawn.tileY });
  const [viewportElement, setViewportElement] = useState<HTMLDivElement | null>(null);
  const [socialBubbleTick, setSocialBubbleTick] = useState(() => Date.now());

  useZoneAssetWarmup(zoneId, snapshot.pets);

  // Respawn the avatar when the zone changes (gate travel keeps its side).
  useEffect(() => {
    const pendingSpawn = pendingSpawnRef.current;
    const spawnTile = pendingSpawn ?? zoneSpawnTile[zoneId];
    const safeTile = findNearestWalkableTile(zoneId, spawnTile);
    pendingSpawnRef.current = null;

    playerRef.current.zoneId = zoneId;
    playerRef.current.sceneX = toSceneX(safeTile.tileX);
    playerRef.current.sceneY = toSceneY(safeTile.tileY);
    playerRef.current.tileX = safeTile.tileX;
    playerRef.current.tileY = safeTile.tileY;
    walkPathRef.current = [];
    holdTargetRef.current = null;
    cameraFocusRef.current = null;

    const viewport = viewportSizeRef.current;
    cameraPositionRef.current = {
      x: Math.max(0, Math.min(SCENE_WIDTH - viewport.width, playerRef.current.sceneX - viewport.width / 2)),
      y: Math.max(0, Math.min(SCENE_HEIGHT - viewport.height, playerRef.current.sceneY - viewport.height / 2)),
    };
    setPlayerTile({ tileX: safeTile.tileX, tileY: safeTile.tileY });
  }, [zoneId]);

  // Track viewport size for camera clamping.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    setViewportElement(viewport);

    const updateSize = () => {
      const rect = viewport.getBoundingClientRect();
      viewportSizeRef.current = {
        width: Math.max(320, Math.round(rect.width)),
        height: Math.max(280, Math.round(rect.height)),
      };
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Briefly pan the camera to a newly selected pet, then return to the player.
  useEffect(() => {
    if (!selectedPet) {
      return;
    }

    cameraFocusRef.current = {
      sceneX: toSceneX(selectedPet.state.tileX),
      sceneY: toSceneY(selectedPet.state.tileY),
      untilMs: Date.now() + 1900,
    };
    // Position intentionally sampled once at selection time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPetId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSocialBubbleTick(Date.now());
    }, 1400);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const activeSocialBubbleByPetId = useMemo(() => {
    const map = new Map<string, { text: string; kind: "speech" }>();

    for (const event of snapshot.recentEvents) {
      if (event.type !== "social_chat" || !event.socialLines?.length) {
        continue;
      }

      const elapsedMs = socialBubbleTick - new Date(event.createdAt).getTime();
      const lifetimeMs = Math.min(10000, event.socialLines.length * 1600 + 1400);

      if (elapsedMs < 0 || elapsedMs > lifetimeMs) {
        continue;
      }

      const lineIndex = Math.floor(elapsedMs / 1600) % event.socialLines.length;
      const line = event.socialLines[lineIndex];

      if (!line?.text || map.has(line.petId)) {
        continue;
      }

      map.set(line.petId, { text: line.text, kind: "speech" });
    }

    return map;
  }, [snapshot.recentEvents, socialBubbleTick]);

  const bubblePetIds = useMemo(() => {
    const prioritizedIds = [
      ...(selectedPetId ? [selectedPetId] : []),
      ...activeSocialBubbleByPetId.keys(),
      ...snapshot.pets
        .filter((entry) => entry.state.currentBubble?.text)
        .sort((left, right) => {
          const leftExpiry = left.state.currentBubble?.expiresAt ?? "";
          const rightExpiry = right.state.currentBubble?.expiresAt ?? "";
          return rightExpiry.localeCompare(leftExpiry);
        })
        .map((entry) => entry.pet.id),
    ];

    return new Set(
      prioritizedIds.filter((petId, index) => prioritizedIds.indexOf(petId) === index).slice(0, 3),
    );
  }, [activeSocialBubbleByPetId, selectedPetId, snapshot.pets]);

  const autonomyOverlays = useMemo(
    () => buildAutonomyMapOverlays(snapshot, selectedPetId),
    [selectedPetId, snapshot],
  );
  // Route intents only materialize for the pet you're focused on — the
  // default view stays a clean world instead of a command console.
  const visibleAutonomyOverlays = useMemo(() => {
    const overlays = providedAutonomyOverlays ?? autonomyOverlays;

    return overlays.filter(
      (overlay) =>
        overlay.id === selectedAutonomyRouteId ||
        (selectedPetId &&
          (overlay.actorPetId === selectedPetId || overlay.targetPetId === selectedPetId)),
    );
  }, [autonomyOverlays, providedAutonomyOverlays, selectedAutonomyRouteId, selectedPetId]);
  const transitionMarkers = useMemo(
    () => buildWorldTransitionMarkers(snapshot),
    [snapshot],
  );

  // The single pet close enough for in-world interaction chips; own pets win ties.
  const nearbyPets = useMemo(() => {
    return snapshot.pets
      .map((entry) => ({
        entry,
        owned: Boolean(viewerId && entry.owner.id === viewerId),
        distance: Math.hypot(entry.state.tileX - playerTile.tileX, entry.state.tileY - playerTile.tileY),
      }))
      .filter(({ distance }) => distance <= PROXIMITY_ACTION_TILES)
      .sort((left, right) =>
        left.owned === right.owned ? left.distance - right.distance : left.owned ? -1 : 1,
      )
      .slice(0, 1)
      .map(({ entry }) => entry);
  }, [playerTile.tileX, playerTile.tileY, snapshot.pets, viewerId]);

  const zoneRingIndex = ZONE_TRAVEL_RING.indexOf(zoneId);
  const eastZoneId = ZONE_TRAVEL_RING[(zoneRingIndex + 1) % ZONE_TRAVEL_RING.length];
  const westZoneId = ZONE_TRAVEL_RING[(zoneRingIndex + ZONE_TRAVEL_RING.length - 1) % ZONE_TRAVEL_RING.length];
  const zoneNameById = useMemo(() => {
    const map = new Map<GardenZoneId, string>();

    for (const zone of zones ?? []) {
      map.set(zone.id, zone.name);
    }

    return map;
  }, [zones]);

  const selectedOwnPetDistance = selectedPet
    ? Math.hypot(selectedPet.state.tileX - playerTile.tileX, selectedPet.state.tileY - playerTile.tileY)
    : null;
  const showFarCall = Boolean(
    selectedPet &&
      viewerId &&
      selectedPet.owner.id === viewerId &&
      selectedOwnPetDistance !== null &&
      selectedOwnPetDistance > FAR_CALL_TILES &&
      onOwnerAction,
  );

  const handleGateEnter = useCallback(
    (direction: "west" | "east") => {
      if (travelLocked || !onTravel) {
        return;
      }

      const nextZoneId = direction === "east" ? eastZoneId : westZoneId;
      // Enter the next zone from the opposite gate, same latitude.
      pendingSpawnRef.current = {
        tileX: direction === "east" ? 3 : LOGICAL_COLS - 4,
        tileY: Math.max(GATE_BAND_MIN_TILE_Y, Math.min(GATE_BAND_MAX_TILE_Y, playerRef.current.tileY)),
      };
      onTravel(nextZoneId);
    },
    [eastZoneId, onTravel, travelLocked, westZoneId],
  );

  const handlePlayerTileChange = useCallback(
    (tileX: number, tileY: number) => {
      setPlayerTile((current) =>
        current.tileX === tileX && current.tileY === tileY ? current : { tileX, tileY },
      );
      onPlayerTileChange?.(tileX, tileY);
    },
    [onPlayerTileChange],
  );

  const sceneCoordsFromClient = useCallback((clientX: number, clientY: number) => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return { sceneX: 0, sceneY: 0 };
    }

    const rect = viewport.getBoundingClientRect();
    return {
      sceneX: clientX - rect.left + Math.round(cameraPositionRef.current.x),
      sceneY: clientY - rect.top + Math.round(cameraPositionRef.current.y),
    };
  }, []);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    pointerStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startedAt: Date.now(),
      holdActive: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const pointer = pointerStateRef.current;

    if (!pointer || pointer.pointerId !== event.pointerId) {
      return;
    }

    const drift = Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY);
    const heldMs = Date.now() - pointer.startedAt;

    if (!pointer.holdActive && (drift > HOLD_TO_MOVE_DRIFT_PX || heldMs > HOLD_TO_MOVE_MS)) {
      pointer.holdActive = true;
      walkPathRef.current = [];
    }

    if (pointer.holdActive) {
      holdTargetRef.current = sceneCoordsFromClient(event.clientX, event.clientY);
    }
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const pointer = pointerStateRef.current;

    if (!pointer || pointer.pointerId !== event.pointerId) {
      return;
    }

    pointerStateRef.current = null;
    holdTargetRef.current = null;

    if (pointer.holdActive) {
      return;
    }

    // Tap: select a pet, otherwise walk to the tapped tile.
    const { sceneX, sceneY } = sceneCoordsFromClient(event.clientX, event.clientY);
    const clickedPet = findNearestPet(snapshot, sceneX, sceneY);

    if (clickedPet) {
      onSelectPet(clickedPet.pet.id);
      return;
    }

    const player = playerRef.current;
    const path = findWalkingPath(
      zoneId,
      { tileX: player.tileX, tileY: player.tileY },
      { tileX: Math.round(toTileX(sceneX)), tileY: Math.round(toTileY(sceneY)) },
    );
    walkPathRef.current = path.map((waypoint) => ({
      x: toSceneX(waypoint.tileX),
      y: toSceneY(waypoint.tileY),
    }));
  }

  function handlePointerCancel() {
    pointerStateRef.current = null;
    holdTargetRef.current = null;
  }

  function handleEncounterMarkerClick(marker: GardenSnapshot["encounterMarkers"][number]) {
    const participantPetId = marker.participantPetIds.find((petId) =>
      snapshot.pets.some((entry) => entry.pet.id === petId),
    );

    if (participantPetId) {
      onSelectPet(participantPetId);
    }

    onSelectEncounter?.(marker.encounterId, participantPetId);
  }

  const petHasActivePoop = useCallback(
    (petId: string) =>
      snapshot.objects.some(
        (object) => object.type === "poop" && object.petId === petId && !object.removedAt,
      ),
    [snapshot.objects],
  );

  return (
    <div className="space-y-3">
      <div
        ref={viewportRef}
        className="garden-pixel-stage relative h-[62vh] max-h-[720px] min-h-[360px] w-full touch-none select-none overflow-hidden rounded-[32px] border border-white/10 bg-[#071018]"
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Sky stays fixed to the viewport; the world scrolls beneath it. */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${snapshot.world.skyTop}, ${snapshot.world.skyBottom})`,
          }}
        />
        <div
          ref={backdropWrapperRef}
          className="pointer-events-none absolute left-0 top-0 will-change-transform"
          style={{ height: `${SCENE_HEIGHT}px`, width: `${SCENE_WIDTH}px` }}
        >
          <img
            alt=""
            className="pointer-events-none block select-none object-cover opacity-45 [image-rendering:pixelated]"
            draggable={false}
            src={backgroundScenePath[zoneId]}
            style={{ height: `${SCENE_HEIGHT}px`, width: `${SCENE_WIDTH}px` }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: zoneAtmosphere[zoneId] }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 18%, ${snapshot.world.ambientGlow}, transparent 40%)`,
              opacity: 0.95,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "#08131B",
              opacity: snapshot.world.overlayAlpha,
            }}
          />
        </div>
        <div className="absolute inset-0">
          {viewportElement ? (
            <Application antialias={false} backgroundAlpha={0} resizeTo={viewportElement}>
              <pixiContainer ref={cameraContainerRef}>
                <pixiGraphics draw={drawTerrainLayer(zoneId, snapshot.world.overlayAlpha)} />
                <pixiGraphics draw={drawTerrainDetailLayer(zoneId)} />
                <pixiGraphics draw={drawStructureLayer(zoneId, snapshot.world.neonAlpha)} />
                <pixiGraphics draw={drawGrid()} />
                <pixiGraphics
                  draw={drawTravelGate("west")}
                  x={PLAYFIELD_LEFT + TILE_SIZE}
                  y={toSceneY((GATE_BAND_MIN_TILE_Y + GATE_BAND_MAX_TILE_Y) / 2)}
                />
                <pixiGraphics
                  draw={drawTravelGate("east")}
                  x={PLAYFIELD_RIGHT - TILE_SIZE}
                  y={toSceneY((GATE_BAND_MIN_TILE_Y + GATE_BAND_MAX_TILE_Y) / 2)}
                />

                {sceneryObjects.map((object) => (
                  <SceneryWorldObjectNode key={object.id} neonAlpha={snapshot.world.neonAlpha} object={object} />
                ))}

                {environmentActors.map((actor) => (
                  <EnvironmentActorNode key={actor.id} actor={actor} />
                ))}

                {renderableObjects.map((object) => (
                  <DynamicWorldObjectNode key={object.id} object={object} />
                ))}

                <pixiContainer sortableChildren>
                  {snapshot.pets.map((pet) => (
                    <PetSpriteNode
                      allowBubble={bubblePetIds.has(pet.pet.id)}
                      key={pet.pet.id}
                      pet={pet}
                      playerRef={playerRef}
                      selected={pet.pet.id === selectedPetId}
                      socialBubble={activeSocialBubbleByPetId.get(pet.pet.id)}
                      viewerOwnsPet={Boolean(viewerId && pet.owner.id === viewerId)}
                    />
                  ))}
                  <PlayerAvatarNode displayName={viewerName} playerRef={playerRef} />
                </pixiContainer>
              </pixiContainer>
              <CameraRig
                backdropWrapperRef={backdropWrapperRef}
                cameraContainerRef={cameraContainerRef}
                cameraFocusRef={cameraFocusRef}
                cameraPositionRef={cameraPositionRef}
                holdTargetRef={holdTargetRef}
                keyboardRef={keyboardRef}
                onGateEnter={handleGateEnter}
                onPlayerTileChange={handlePlayerTileChange}
                overlayWrapperRef={overlayWrapperRef}
                playerRef={playerRef}
                viewportSizeRef={viewportSizeRef}
                walkPathRef={walkPathRef}
              />
            </Application>
          ) : null}
        </div>
        <div
          ref={overlayWrapperRef}
          className="pointer-events-none absolute left-0 top-0 will-change-transform"
          style={{ height: `${SCENE_HEIGHT}px`, width: `${SCENE_WIDTH}px` }}
        >
          {visibleAutonomyOverlays.length > 0 ? (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              data-testid="autonomy-map-routes"
              height={SCENE_HEIGHT}
              viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
              width={SCENE_WIDTH}
            >
              {visibleAutonomyOverlays.map((overlay) => {
                const toneColor = activityToneColors[overlay.tone];
                const selected =
                  selectedAutonomyRouteId === overlay.id ||
                  selectedPetId === overlay.actorPetId || selectedPetId === overlay.targetPetId;
                const start = routeEndpoint(overlay, "start");
                const target = routeEndpoint(overlay, "target");

                return (
                  <g data-testid="autonomy-map-route" key={overlay.id} opacity={selected ? 0.92 : 0.58}>
                    <path
                      d={routePath(overlay)}
                      fill="none"
                      stroke={toneColor.stroke}
                      strokeDasharray="12 13"
                      strokeLinecap="round"
                      strokeWidth={selected ? 5 : 3}
                    />
                    <circle cx={start.x} cy={start.y} fill={toneColor.stroke} opacity="0.9" r={selected ? 6 : 4} />
                    <circle
                      cx={target.x}
                      cy={target.y}
                      fill={toneColor.fill}
                      r={selected ? 12 : 10}
                      stroke={toneColor.stroke}
                      strokeWidth="3"
                    />
                  </g>
                );
              })}
            </svg>
          ) : null}
          {visibleAutonomyOverlays.map((overlay) => {
            const toneColor = activityToneColors[overlay.tone];
            const selected =
              selectedAutonomyRouteId === overlay.id ||
              selectedPetId === overlay.actorPetId ||
              selectedPetId === overlay.targetPetId;
            const start = routeEndpoint(overlay, "start");
            const target = routeEndpoint(overlay, "target");

            return (
              <div className="pointer-events-none absolute inset-0" key={`${overlay.id}-buttons`}>
                <button
                  aria-label={`Track ${overlay.actorName}: ${overlay.routeLabel}`}
                  className="pointer-events-auto absolute flex max-w-[15rem] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 text-left text-[11px] font-semibold shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,border-color,box-shadow] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                  data-actor-pet-id={overlay.actorPetId}
                  data-testid="autonomy-map-intent"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectAutonomyRoute?.(overlay.id);
                    onSelectPet(overlay.actorPetId);
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  style={{
                    backgroundColor: toneColor.fill,
                    borderColor: toneColor.stroke,
                    boxShadow: selected
                      ? `0 0 0 2px ${toneColor.stroke}, 0 14px 40px rgba(0,0,0,0.28)`
                      : undefined,
                    color: toneColor.text,
                    left: `${start.x}px`,
                    top: `${start.y - 56}px`,
                  }}
                  title={overlay.reason}
                  type="button"
                >
                  <Route aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{overlay.routeLabel}</span>
                </button>
                <button
                  aria-label={`Locate ${overlay.targetLabel}`}
                  className="pointer-events-auto absolute flex max-w-[12rem] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 text-left text-[11px] font-semibold shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,border-color,box-shadow] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                  data-actor-pet-id={overlay.actorPetId}
                  data-target-kind={overlay.targetKind}
                  data-target-pet-id={overlay.targetPetId}
                  data-testid="autonomy-map-marker"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectAutonomyRoute?.(overlay.id);
                    onSelectPet(overlay.targetPetId ?? overlay.actorPetId);
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  style={{
                    backgroundColor: toneColor.fill,
                    borderColor: toneColor.stroke,
                    color: toneColor.text,
                    left: `${target.x}px`,
                    top: `${target.y - 66}px`,
                  }}
                  title={overlay.reason}
                  type="button"
                >
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{overlay.targetLabel}</span>
                </button>
              </div>
            );
          })}
          {transitionMarkers.map((marker) => {
            const selected = selectedPetId === marker.petId;

            return (
              <button
                aria-label={`Focus ${marker.petName}: ${marker.title}`}
                className={`pointer-events-auto absolute flex max-w-[12rem] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-cyan-100/80 bg-[#071B24]/88 px-3 py-2 text-left text-[11px] font-black uppercase tracking-[0.16em] text-cyan-50 shadow-[0_14px_44px_rgba(34,211,238,0.22)] backdrop-blur-md transition-[transform,border-color,box-shadow] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${
                  selected ? "scale-105 ring-2 ring-lime-200/80" : ""
                }`}
                data-event-id={marker.eventId}
                data-pet-id={marker.petId}
                data-testid="world-transition-marker"
                key={marker.id}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectPet(marker.petId);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                style={{
                  left: `${toSceneX(marker.tileX) + marker.offsetX}px`,
                  top: `${toSceneY(marker.tileY) - 92 + marker.offsetY}px`,
                }}
                title={marker.summary}
                type="button"
              >
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-lime-200" />
                <span className="truncate">到达 · {marker.petName}</span>
              </button>
            );
          })}
          {snapshot.encounterMarkers.map((marker) => {
            const selected = selectedEncounterId === marker.encounterId;
            return (
              <button
                aria-label={`Inspect encounter: ${marker.title}`}
                className={`pointer-events-auto absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm transition-[transform,border-color,background-color,box-shadow] hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${
                  encounterMarkerToneStyles[marker.tone]
                } ${selected ? "scale-110 ring-2 ring-white/70" : ""}`}
                key={marker.id}
                onClick={(event) => {
                  event.stopPropagation();
                  handleEncounterMarkerClick(marker);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                style={{
                  left: `${toSceneX(marker.tileX)}px`,
                  top: `${toSceneY(marker.tileY) - 66}px`,
                }}
                title={marker.title}
                type="button"
              >
                <span className="absolute h-16 w-16 rounded-full border border-current opacity-20" />
                <span className="font-mono text-lg font-black leading-none">
                  {marker.tone === "conflict" ? "!" : marker.tone === "social" ? "+" : "?"}
                </span>
              </button>
            );
          })}
          {nearbyPets.map((entry) => {
            const ownsPet = Boolean(viewerId && entry.owner.id === viewerId);
            const chipX = toSceneX(entry.state.tileX);
            const chipY = toSceneY(entry.state.tileY) - 118;

            return (
              <div
                className="pointer-events-none absolute flex -translate-x-1/2 flex-col items-center gap-1.5"
                data-testid="proximity-action-chips"
                key={`proximity-${entry.pet.id}`}
                style={{ left: `${chipX}px`, top: `${chipY}px` }}
              >
                <span className="rounded-full border border-lime-200/40 bg-[#0B1E12]/85 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lime-100 backdrop-blur-sm">
                  {entry.pet.name} · {entry.growth?.stageLabel ?? "数据幼体"} · 羁绊 {entry.growth?.bond ?? 0}
                </span>
                <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5">
                  {ownsPet && onOwnerAction ? (
                    <>
                      <button
                        className="rounded-full border border-amber-200/60 bg-amber-400/20 px-3 py-1.5 text-[11px] font-bold text-amber-50 backdrop-blur-md transition-transform hover:scale-105"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOwnerAction({ petId: entry.pet.id, action: "feed" });
                        }}
                        onPointerDown={(event) => event.stopPropagation()}
                        type="button"
                      >
                        🍖 喂食
                      </button>
                      <button
                        className="rounded-full border border-cyan-200/60 bg-cyan-400/20 px-3 py-1.5 text-[11px] font-bold text-cyan-50 backdrop-blur-md transition-transform hover:scale-105"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOwnerAction({ petId: entry.pet.id, action: "pet" });
                        }}
                        onPointerDown={(event) => event.stopPropagation()}
                        type="button"
                      >
                        🤲 抚摸
                      </button>
                      <button
                        className="rounded-full border border-lime-200/60 bg-lime-400/20 px-3 py-1.5 text-[11px] font-bold text-lime-50 backdrop-blur-md transition-transform hover:scale-105"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOwnerAction({ petId: entry.pet.id, action: "throw_toy" });
                        }}
                        onPointerDown={(event) => event.stopPropagation()}
                        type="button"
                      >
                        🎾 玩具
                      </button>
                      {petHasActivePoop(entry.pet.id) ? (
                        <button
                          className="rounded-full border border-rose-200/60 bg-rose-400/20 px-3 py-1.5 text-[11px] font-bold text-rose-50 backdrop-blur-md transition-transform hover:scale-105"
                          onClick={(event) => {
                            event.stopPropagation();
                            onOwnerAction({ petId: entry.pet.id, action: "clean_poop" });
                          }}
                          onPointerDown={(event) => event.stopPropagation()}
                          type="button"
                        >
                          🧹 清理
                        </button>
                      ) : null}
                      {onOpenChat ? (
                        <button
                          className="rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition-transform hover:scale-105"
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenChat(entry.pet.id);
                          }}
                          onPointerDown={(event) => event.stopPropagation()}
                          type="button"
                        >
                          💬 聊天
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <button
                      className="rounded-full border border-cyan-200/60 bg-cyan-400/20 px-3 py-1.5 text-[11px] font-bold text-cyan-50 backdrop-blur-md transition-transform hover:scale-105"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectPet(entry.pet.id);
                      }}
                      onPointerDown={(event) => event.stopPropagation()}
                      type="button"
                    >
                      👋 打招呼
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div
            className="pointer-events-none absolute flex -translate-x-1/2 items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/85"
            style={{
              left: `${PLAYFIELD_LEFT + TILE_SIZE * 2.4}px`,
              top: `${toSceneY((GATE_BAND_MIN_TILE_Y + GATE_BAND_MAX_TILE_Y) / 2) - 74}px`,
            }}
          >
            ← {zoneNameById.get(westZoneId) ?? westZoneId}
          </div>
          <div
            className="pointer-events-none absolute flex -translate-x-1/2 items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/85"
            style={{
              left: `${PLAYFIELD_RIGHT - TILE_SIZE * 2.4}px`,
              top: `${toSceneY((GATE_BAND_MIN_TILE_Y + GATE_BAND_MAX_TILE_Y) / 2) - 74}px`,
            }}
          >
            {zoneNameById.get(eastZoneId) ?? eastZoneId} →
          </div>
        </div>
        {showFarCall && selectedPet ? (
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
            <button
              className="pointer-events-auto rounded-full border border-lime-200/70 bg-[#101F0C]/90 px-5 py-2.5 text-sm font-bold text-lime-100 shadow-[0_14px_44px_rgba(190,242,100,0.25)] backdrop-blur-md transition-transform hover:scale-105"
              onClick={(event) => {
                event.stopPropagation();
                onOwnerAction?.({ petId: selectedPet.pet.id, action: "call" });
              }}
              onPointerDown={(event) => event.stopPropagation()}
              type="button"
            >
              📣 呼唤 {selectedPet.pet.name} 过来
            </button>
          </div>
        ) : null}
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-1.5">
          <span className="w-fit rounded-full border border-cyan-300/25 bg-[#07131B]/80 px-3 py-1 font-mono text-xs text-cyan-50 backdrop-blur-sm">
            {snapshot.world.clockLabel} · {snapshot.world.phase}
          </span>
          <span className="w-fit rounded-full border border-white/12 bg-[#07131B]/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm">
            {snapshot.zone.name} · {snapshot.pets.length} pets
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 z-10 hidden rounded-full border border-white/12 bg-[#07131B]/75 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 backdrop-blur-sm md:block">
          WASD / 方向键移动 · 点击地面走过去 · 走近宠物互动
        </div>
      </div>
      <p className="text-xs uppercase tracking-[0.22em] text-white/38">
        {LOGICAL_COLS}x{LOGICAL_ROWS} 花园世界 · {snapshot.world.phase} · {snapshot.world.clockLabel} · {snapshot.world.ambienceLabel}
      </p>
    </div>
  );
}
