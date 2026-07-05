export function gardenCommandBlockReason(input: {
  selectedPetOwnerId?: string;
  selectedPetOwnerName?: string;
  viewerId?: string;
}) {
  if (!input.selectedPetOwnerId) {
    return "先选中一只宠物，再点场地里的位置。";
  }

  if (!input.viewerId) {
    return "当前是公共观景模式。先用右上角 Enter Garden 登录，再指挥属于你的宠物移动。";
  }

  if (input.selectedPetOwnerId !== input.viewerId) {
    return `当前选中的是 ${input.selectedPetOwnerName ?? "其他人"} 的宠物。只能指挥你自己的宠物移动。`;
  }

  return null;
}
