import { describe, expect, it } from "vitest";

import { gardenCommandBlockReason } from "@/components/garden/garden-command-permissions";

describe("garden command permissions", () => {
  it("explains that guests cannot move selected pets by clicking the world", () => {
    expect(
      gardenCommandBlockReason({
        selectedPetOwnerId: "profile-luna",
        selectedPetOwnerName: "Luna",
      }),
    ).toBe("当前是公共观景模式。先用右上角 Enter Garden 登录，再指挥属于你的宠物移动。");
  });

  it("explains that viewers cannot move another owner's pet", () => {
    expect(
      gardenCommandBlockReason({
        selectedPetOwnerId: "profile-mars",
        selectedPetOwnerName: "Mars",
        viewerId: "profile-luna",
      }),
    ).toBe("当前选中的是 Mars 的宠物。只能指挥你自己的宠物移动。");
  });

  it("allows commands for the selected owner pet", () => {
    expect(
      gardenCommandBlockReason({
        selectedPetOwnerId: "profile-luna",
        selectedPetOwnerName: "Luna",
        viewerId: "profile-luna",
      }),
    ).toBeNull();
  });
});
