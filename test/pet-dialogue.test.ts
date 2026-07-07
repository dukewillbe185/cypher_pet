import { describe, expect, it } from "vitest";

import { parseDialogueTurns } from "@/lib/ai/pet-dialogue";

const petAId = "pet-a";
const petBId = "pet-b";

describe("parseDialogueTurns", () => {
  it("parses a clean JSON array of speaker/line objects with alternating petIds", () => {
    const raw = JSON.stringify([
      { speaker: "Ash", line: "你干嘛呢" },
      { speaker: "Nyx", line: "没事路过" },
    ]);

    const turns = parseDialogueTurns(raw, petAId, petBId);

    expect(turns).toEqual([
      { petId: "pet-a", text: "你干嘛呢" },
      { petId: "pet-b", text: "没事路过" },
    ]);
  });

  it("extracts the array from a fenced code block surrounded by prose", () => {
    const raw = [
      "这是我的想法：",
      "```json",
      '[{"speaker":"Ash","line":"你干嘛呢"},{"speaker":"Nyx","line":"没事路过"}]',
      "```",
      "希望有帮助。",
    ].join("\n");

    const turns = parseDialogueTurns(raw, petAId, petBId);

    expect(turns).toEqual([
      { petId: "pet-a", text: "你干嘛呢" },
      { petId: "pet-b", text: "没事路过" },
    ]);
  });

  it("accepts an array of plain strings with positional alternation", () => {
    const raw = JSON.stringify(["六个字而已", "我也一样"]);

    const turns = parseDialogueTurns(raw, petAId, petBId);

    expect(turns).toEqual([
      { petId: "pet-a", text: "六个字而已" },
      { petId: "pet-b", text: "我也一样" },
    ]);
  });

  it("truncates four or more entries to three alternating turns (A, B, A)", () => {
    const raw = JSON.stringify([
      { line: "第一句台词" },
      { line: "第二句台词" },
      { line: "第三句台词" },
      { line: "第四句台词" },
    ]);

    const turns = parseDialogueTurns(raw, petAId, petBId);

    expect(turns).toEqual([
      { petId: "pet-a", text: "第一句台词" },
      { petId: "pet-b", text: "第二句台词" },
      { petId: "pet-a", text: "第三句台词" },
    ]);
  });

  it("returns null for missing array, unparseable JSON, or non-array JSON", () => {
    expect(parseDialogueTurns("只是一段普通的文字，没有方括号。", petAId, petBId)).toBeNull();
    expect(parseDialogueTurns("[{not valid json}]", petAId, petBId)).toBeNull();
    expect(parseDialogueTurns("{}", petAId, petBId)).toBeNull();
  });

  it("returns null when only one valid entry survives (needs at least two)", () => {
    const raw = JSON.stringify([{ line: "只有一句" }]);

    expect(parseDialogueTurns(raw, petAId, petBId)).toBeNull();
  });

  it("drops empty-string entries via the clamp fallback and returns null if too few remain", () => {
    const raw = JSON.stringify(["", "只剩我一句"]);

    expect(parseDialogueTurns(raw, petAId, petBId)).toBeNull();
  });
});
