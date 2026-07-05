import { getPetVoiceProfile } from "@/lib/ai/pet-voice";
import { buildSemanticMemoryDigest } from "@/lib/ai/memory-compressor";
import { getPetPersonality } from "@/lib/domain/personality";
import { buildPetBonds, listPetMemories } from "@/lib/domain/social";
import type {
  AppStore,
  Pet,
  PetActivity,
  PetAutonomyProfile,
  PetDrive,
  PetMemoryDigest,
} from "@/lib/types";

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function motivationsFor(pet: Pet): string[] {
  const personality = getPetPersonality(pet);

  const base =
    pet.species === "cat"
      ? ["守住自己挑中的位置", "在安全边界内观察其他动静"]
      : ["把周围的动静都跑一遍", "确认谁愿意陪自己互动"];

  if (personality.napBias >= 72) {
    base.push("优先寻找舒服又不被打扰的休息点");
  }

  if (personality.zoomies >= 72) {
    base.push("一有空就想把精力释放出去");
  }

  if (personality.sociability >= 68) {
    base.push("会主动靠近熟悉对象确认关系还在");
  }

  if (personality.boldness <= 42) {
    base.push("对突然靠近的家伙会先建立安全距离");
  }

  return unique(base);
}

function comfortSourcesFor(pet: Pet): string[] {
  const personality = getPetPersonality(pet);
  const comfort = [pet.species === "cat" ? "高处和树影" : "追逐区和开阔地"];

  if (personality.napBias >= 60) {
    comfort.push("安静窝点");
  }

  if (personality.treeAffinity >= 60) {
    comfort.push("树边或能藏身的位置");
  }

  if (personality.sociability >= 68) {
    comfort.push("熟悉对象陪在旁边");
  }

  return unique(comfort);
}

function stressSignalsFor(pet: Pet): string[] {
  const personality = getPetPersonality(pet);
  const signals = [pet.species === "cat" ? "被追逐或被围观" : "长时间没人回应"];

  if (personality.boldness <= 46) {
    signals.push("突然靠近和过快的节奏");
  }

  if (personality.zoomies >= 70) {
    signals.push("被迫待着不动太久");
  }

  if (personality.sociability <= 40) {
    signals.push("被不熟的人反复搭话");
  }

  return unique(signals);
}

function favoriteActivitiesFor(pet: Pet): PetActivity[] {
  const personality = getPetPersonality(pet);
  const activities: PetActivity[] = ["wander"];

  if (personality.napBias >= 60) {
    activities.push("sleep", pet.species === "cat" ? "sunbathe" : "look_around");
  }

  if (personality.zoomies >= 64) {
    activities.push("play", pet.species === "dog" ? "chase" : "wander");
  }

  if (pet.species === "cat" && personality.treeAffinity >= 58) {
    activities.push("climb_tree", "hide");
  }

  if (pet.species === "dog" && personality.curiosity >= 56) {
    activities.push("dig");
  }

  return unique(activities);
}

function avoidedActivitiesFor(pet: Pet): PetActivity[] {
  const personality = getPetPersonality(pet);
  const activities: PetActivity[] = [];

  if (personality.boldness <= 42) {
    activities.push("scuffle", "chase");
  }

  if (personality.napBias >= 72) {
    activities.push("dig");
  }

  if (pet.species === "cat") {
    activities.push("seek_owner");
  }

  return unique(activities);
}

function dailyRhythmFor(pet: Pet) {
  const personality = getPetPersonality(pet);

  if (personality.napBias >= 70) {
    return "白天偏慢，容易在舒适点位停留很久，黄昏后才会稍微恢复主动性。";
  }

  if (personality.zoomies >= 74) {
    return "白天和傍晚都会反复进入活跃窗口，遇到刺激后会突然切到高能模式。";
  }

  return pet.species === "cat"
    ? "在清晨和傍晚更愿意移动，白天中段更倾向观察和占位。"
    : "白天大部分时间都可被调动，情绪高时会主动拉别人一起动起来。";
}

function ownerBondStyleFor(pet: Pet) {
  const personality = getPetPersonality(pet);

  if (personality.archetype === "velcro heart") {
    return "把主人的回应当成重要确认，会主动回到主人的行动轨迹附近。";
  }

  if (pet.species === "cat") {
    return "会靠近主人，但更希望由自己决定节奏和距离。";
  }

  return "对主人的指令和注意力反应明显，容易把主人视作主要安全锚点。";
}

export function buildDerivedPetAutonomyProfile(
  pet: Pet,
  nowIso = new Date().toISOString(),
): PetAutonomyProfile {
  const personality = getPetPersonality(pet);
  const voice = getPetVoiceProfile(pet, personality);

  return {
    id: `autonomy-${pet.id}`,
    petId: pet.id,
    source: "derived",
    coreIdentity: `${pet.name} 是一只${pet.species === "cat" ? "偏猫式" : "偏狗式"}的角色宠物，原型为 ${personality.archetype}，说话方式偏向 ${voice.style}`,
    identityNarrative: `${pet.name} 已经在花园里活成了固定风格：${personality.summary}`,
    motivations: motivationsFor(pet),
    comfortSources: comfortSourcesFor(pet),
    stressSignals: stressSignalsFor(pet),
    socialStrategy: voice.socialInstinct,
    attachmentStyle:
      personality.sociability >= 68
        ? "会主动确认关系是否稳定"
        : "偏向先远观，再决定要不要靠近",
    conflictStyle:
      personality.boldness >= 62
        ? "会正面回怼或抢回位置"
        : "更倾向先撤开、绕路或保留观察",
    favoriteActivities: favoriteActivitiesFor(pet),
    avoidedActivities: avoidedActivitiesFor(pet),
    dailyRhythm: dailyRhythmFor(pet),
    ownerBondStyle: ownerBondStyleFor(pet),
    revision: 1,
    confidence: 0.58,
    refreshReason: "bootstrap",
    updatedAt: nowIso,
  };
}

function drivesFromStore(store: AppStore, pet: Pet): PetDrive[] {
  const state = store.petStates.find((entry) => entry.petId === pet.id);
  const bonds = buildPetBonds(store, pet.id, 4);
  const memories = listPetMemories(store, pet.id, 6);
  const drives: PetDrive[] = [];

  if (state?.energy !== undefined && state.energy <= 34) {
    drives.push("seek_rest");
  }

  if (state?.hunger !== undefined && state.hunger >= 54) {
    drives.push("seek_food");
  }

  if (state?.stress !== undefined && state.stress >= 58) {
    drives.push("avoid_threat");
  }

  if (state?.social !== undefined && state.social <= 38) {
    drives.push("seek_owner");
  }

  if (bonds.some((bond) => bond.status === "friend")) {
    drives.push("seek_friend");
  }

  if (memories.some((memory) => memory.kind === "favorite_spot")) {
    drives.push("guard_spot");
  }

  if (drives.length === 0) {
    drives.push("explore", "self_maintain");
  }

  return unique(drives).slice(0, 4);
}

export function buildDerivedPetMemoryDigest(
  store: AppStore,
  pet: Pet,
  nowIso = new Date().toISOString(),
): PetMemoryDigest {
  const memories = listPetMemories(store, pet.id, 4);
  const bonds = buildPetBonds(store, pet.id, 3);
  const notableMemories = memories.map((memory) => memory.body).slice(0, 3);

  const summary =
    notableMemories[0] ??
    `${pet.name} 目前主要靠天性行动，还没有形成特别强的长期剧情记忆。`;

  const socialSummary =
    bonds.length > 0
      ? bonds
          .map((bond) => `${bond.otherPetName}:${bond.status}(${Math.max(bond.affinity, bond.rivalry)})`)
          .join(" / ")
      : `${pet.name} 还没有稳定到足以写进长期摘要的社交关系。`;

  return {
    petId: pet.id,
    source: "derived",
    summary,
    socialSummary,
    activeDrives: drivesFromStore(store, pet),
    notableMemories,
    updatedAt: nowIso,
  };
}

export function syncPetAutonomyState(
  store: AppStore,
  pet: Pet,
  nowIso = new Date().toISOString(),
) {
  store.petAutonomyProfiles ??= [];
  store.petMemoryDigests ??= [];
  store.petSemanticMemoryDigests ??= [];
  const existingProfileIndex = store.petAutonomyProfiles.findIndex((entry) => entry.petId === pet.id);
  const nextProfile =
    existingProfileIndex >= 0
      ? {
          ...store.petAutonomyProfiles[existingProfileIndex],
          updatedAt: nowIso,
        }
      : buildDerivedPetAutonomyProfile(pet, nowIso);

  if (existingProfileIndex >= 0) {
    store.petAutonomyProfiles[existingProfileIndex] = nextProfile;
  } else {
    store.petAutonomyProfiles.push(nextProfile);
  }

  const digest = buildDerivedPetMemoryDigest(store, pet, nowIso);
  const existingDigestIndex = store.petMemoryDigests.findIndex((entry) => entry.petId === pet.id);

  if (existingDigestIndex >= 0) {
    store.petMemoryDigests[existingDigestIndex] = digest;
  } else {
    store.petMemoryDigests.push(digest);
  }

  const semanticDigest = buildSemanticMemoryDigest(store, pet, nowIso);
  const existingSemanticDigestIndex = store.petSemanticMemoryDigests.findIndex((entry) => entry.petId === pet.id);

  if (existingSemanticDigestIndex >= 0) {
    store.petSemanticMemoryDigests[existingSemanticDigestIndex] = semanticDigest;
  } else {
    store.petSemanticMemoryDigests.push(semanticDigest);
  }
}

export function syncAutonomyState(store: AppStore, nowIso = new Date().toISOString()) {
  for (const pet of store.pets) {
    syncPetAutonomyState(store, pet, nowIso);
  }
}
