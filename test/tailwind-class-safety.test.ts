import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const SOURCE_DIRS = ["app", "components"];

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return listSourceFiles(fullPath);
    }

    return /\.(tsx?|css)$/.test(entry) ? [fullPath] : [];
  });
}

describe("Tailwind class safety", () => {
  it("keeps complex gradient backgrounds out of arbitrary utility classes", () => {
    const offenders = SOURCE_DIRS.flatMap(listSourceFiles).flatMap((filePath) => {
      const contents = readFileSync(filePath, "utf8");
      return /bg-\[[^\]\n]*gradient\(/.test(contents)
        ? [filePath]
        : [];
    });

    expect(offenders).toEqual([]);
  });
});
