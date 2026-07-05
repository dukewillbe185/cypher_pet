import type { Pet, PetPersonality, PetPersonalityArchetype } from "@/lib/types";

function simpleHash(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function score(seed: string, min: number, max: number) {
  return min + (simpleHash(seed) % (max - min + 1));
}

function summaryFor(archetype: PetPersonalityArchetype, petName: string) {
  switch (archetype) {
    case "tree poet":
      return `${petName} 喜欢待在高处观察世界，先盯一会儿，再决定要不要下来。`;
    case "orange chaos":
      return `${petName} 很容易突然上头，喜欢扑玩具、撞朋友，再装得像没发生过。`;
    case "velcro heart":
      return `${petName} 黏人、爱贴贴，情绪波动往往和有没有陪伴直接相关。`;
    case "shadow watcher":
      return `${petName} 不爱张扬，更偏好躲在树影或花丛边缘看别人闹腾。`;
    case "pond dreamer":
      return `${petName} 对安静的水边和柔软的窝有明显偏好，节奏慢，容易打盹。`;
    case "rocket scout":
    default:
      return `${petName} 对一切移动的东西都有反应，冲刺和转场都比别的宠物更果断。`;
  }
}

export function getPetPersonality(pet: Pet): PetPersonality {
  const archetypes: PetPersonalityArchetype[] =
    pet.species === "cat"
      ? ["tree poet", "orange chaos", "velcro heart", "shadow watcher"]
      : ["pond dreamer", "rocket scout", "velcro heart", "orange chaos"];
  const seed = `${pet.id}-${pet.name}-${pet.breed ?? "plain"}-${pet.bio ?? ""}`;
  const archetype = archetypes[simpleHash(seed) % archetypes.length];

  const base = {
    curiosity: score(`${seed}-curiosity`, 42, 88),
    sociability: score(`${seed}-sociability`, 28, 84),
    boldness: score(`${seed}-boldness`, 26, 86),
    treeAffinity: pet.species === "cat" ? score(`${seed}-tree`, 34, 92) : score(`${seed}-tree`, 4, 24),
    zoomies: score(`${seed}-zoomies`, 26, 90),
    napBias: score(`${seed}-nap`, 24, 84),
  };

  if (archetype === "tree poet") {
    base.treeAffinity = Math.max(base.treeAffinity, 78);
    base.boldness = Math.max(base.boldness, 58);
    base.zoomies = Math.min(base.zoomies, 58);
  }

  if (archetype === "orange chaos") {
    base.zoomies = Math.max(base.zoomies, 76);
    base.curiosity = Math.max(base.curiosity, 68);
    base.sociability = Math.max(base.sociability, 52);
  }

  if (archetype === "velcro heart") {
    base.sociability = Math.max(base.sociability, 74);
    base.boldness = Math.min(base.boldness, 58);
    base.napBias = Math.max(base.napBias, 48);
  }

  if (archetype === "shadow watcher") {
    base.boldness = Math.min(base.boldness, 42);
    base.treeAffinity = Math.max(base.treeAffinity, 62);
    base.sociability = Math.min(base.sociability, 46);
  }

  if (archetype === "pond dreamer") {
    base.napBias = Math.max(base.napBias, 74);
    base.zoomies = Math.min(base.zoomies, 52);
    base.boldness = Math.min(base.boldness, 56);
  }

  if (archetype === "rocket scout") {
    base.zoomies = Math.max(base.zoomies, 82);
    base.boldness = Math.max(base.boldness, 72);
    base.napBias = Math.min(base.napBias, 42);
  }

  return {
    archetype,
    summary: summaryFor(archetype, pet.name),
    curiosity: base.curiosity,
    sociability: base.sociability,
    boldness: base.boldness,
    treeAffinity: base.treeAffinity,
    zoomies: base.zoomies,
    napBias: base.napBias,
  };
}
