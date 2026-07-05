import type { NotificationKind, OwnerAction, PetEventType, PetMood } from "@/lib/types";

export function buildMoodNotification(petName: string, mood: PetMood) {
  switch (mood) {
    case "grumpy":
      return `${petName} 今天有点炸毛，看谁都不太顺眼。`;
    case "lonely":
      return `${petName} 今天有点孤单，正在花园边上自己发呆。`;
    case "dirty":
      return `${petName} 身上脏兮兮的，可能刚在灌木里打滚过。`;
    case "sleepy":
      return `${petName} 困得不行，正在找地方窝起来。`;
    case "playful":
      return `${petName} 明显兴奋了，像是马上要冲出去闹一场。`;
    case "curious":
      return `${petName} 正在东闻西看，像是发现了新动静。`;
    case "happy":
    default:
      return `${petName} 今天状态不错，正在花园里自在地晃。`;
  }
}

export function buildPetEventBody(input: {
  petName: string;
  type: PetEventType;
  zoneName: string;
  otherPetName?: string;
  action?: OwnerAction;
}) {
  switch (input.type) {
    case "pooped":
      return `${input.petName} 绕着 ${input.zoneName} 的角落转了半天，最后挑了个最像自己地盘的位置解决问题。`;
    case "climbed_tree":
      return `${input.petName} 一眨眼就蹿上了 ${input.zoneName} 的树枝，现在正从高处装作若无其事地观察大家。`;
    case "chased":
      return `${input.petName} 在 ${input.zoneName} 突然起跑，追着 ${input.otherPetName ?? "另一只宠物"} 兜了一整圈才肯停。`;
    case "scuffle":
      return `${input.petName} 和 ${input.otherPetName ?? "别的宠物"} 在 ${input.zoneName} 顶了两下又扑了一下，像打架又更像在逞强。`;
    case "slept":
      return `${input.petName} 在 ${input.zoneName} 找到一块舒服得离谱的位置，缩起来以后几乎连耳朵都不动了。`;
    case "watched_fish":
      return `${input.petName} 在 ${input.zoneName} 趴成一小团，专心盯着水里发亮的数字鱼，像在看自己的秘密频道。`;
    case "dug":
      return `${input.petName} 在 ${input.zoneName} 刨出了一块新坑，刨到最后自己都很满意。`;
    case "groomed":
      return `${input.petName} 在 ${input.zoneName} 慢悠悠地舔毛整理自己，情绪也跟着顺了下来。`;
    case "bonded":
      return `${input.petName} 和 ${input.otherPetName ?? "另一只宠物"} 在 ${input.zoneName} 混熟了一点，已经开始默认彼此会出现在附近。`;
    case "owner_action":
      if (input.action === "feed") {
        return `你喂了 ${input.petName}，它明显平静了下来。`;
      }
      if (input.action === "pet") {
        return `你摸了摸 ${input.petName}，它看起来没那么别扭了。`;
      }
      if (input.action === "throw_toy") {
        return `你朝 ${input.petName} 扔了个玩具，它立刻来了精神。`;
      }
      if (input.action === "clean_poop") {
        return `你帮 ${input.petName} 清理了现场，花园终于又清爽了。`;
      }
      if (input.action === "call") {
        return `你在 ${input.zoneName} 里叫了 ${input.petName} 一声，它耳朵明显动了一下。`;
      }
      if (input.action === "scold") {
        return `你板起脸训了 ${input.petName} 两句，它虽然听了，但表情并不服气。`;
      }
      if (input.action === "gift") {
        return `你给 ${input.petName} 送了个小礼物，它围着闻了好几圈。`;
      }
      if (input.action === "photo") {
        return `你举起镜头对准 ${input.petName}，它像是突然意识到自己正在被看着。`;
      }
      return `你给 ${input.petName} 起了个新的私密昵称，它像是把这件事记在心里了。`;
    case "mood_change":
    default:
      return `${input.petName} 在 ${input.zoneName} 的状态发生了变化。`;
  }
}

export function notificationKindFromMood(mood: PetMood): NotificationKind {
  if (mood === "grumpy" || mood === "lonely" || mood === "dirty") {
    return "important_event";
  }

  return "mood_change";
}
