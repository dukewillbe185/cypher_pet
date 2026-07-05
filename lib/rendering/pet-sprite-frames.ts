import type { PetActivity, Species } from "@/lib/types";

type FrameBucket = "rest" | "amble" | "trot" | "sprint" | "sleep";
type FrameVariant =
  | "rest-a"
  | "rest-b"
  | "walk-a"
  | "walk-b"
  | "walk-c"
  | "run-a"
  | "run-b"
  | "sleep-a"
  | "sleep-b";

function numericAttr(node: Element, name: string) {
  return Number(node.getAttribute(name) ?? "0");
}

function setNumericAttr(node: Element, name: string, value: number) {
  node.setAttribute(name, `${Math.round(value)}`);
}

function moveRect(node: Element, dx = 0, dy = 0) {
  setNumericAttr(node, "x", numericAttr(node, "x") + dx);
  setNumericAttr(node, "y", numericAttr(node, "y") + dy);
}

function resizeRect(node: Element, dw = 0, dh = 0) {
  setNumericAttr(node, "width", Math.max(1, numericAttr(node, "width") + dw));
  setNumericAttr(node, "height", Math.max(1, numericAttr(node, "height") + dh));
}

function mutateCatRect(node: Element, variant: FrameVariant) {
  const x = numericAttr(node, "x");
  const y = numericAttr(node, "y");
  const width = numericAttr(node, "width");

  const isTail = x <= 18 && y <= 50;
  const isHead = x >= 54 && y <= 56;
  const isEar = x >= 56 && y <= 32;
  const isLeg = y >= 64 && x >= 22 && x <= 50;
  const isFrontLeg = isLeg && x >= 40;
  const isBackLeg = isLeg && x < 40;
  const isBody = x >= 20 && x <= 56 && y >= 44 && y <= 68 && width >= 8;

  switch (variant) {
    case "rest-b":
      if (isTail) {
        moveRect(node, -1, -1);
      }
      if (isHead || isEar) {
        moveRect(node, 0, -1);
      }
      return;
    case "walk-a":
      if (isBackLeg) {
        moveRect(node, -1, -2);
      }
      if (isFrontLeg) {
        moveRect(node, 1, 1);
      }
      if (isTail) {
        moveRect(node, -1, -1);
      }
      if (isHead || isEar) {
        moveRect(node, 0, -1);
      }
      return;
    case "walk-b":
      if (isBackLeg) {
        moveRect(node, 1, 1);
      }
      if (isFrontLeg) {
        moveRect(node, -1, -2);
      }
      if (isTail) {
        moveRect(node, 1, 0);
      }
      return;
    case "walk-c":
      if (isTail) {
        moveRect(node, 0, -2);
      }
      if (isLeg) {
        moveRect(node, 0, -1);
      }
      return;
    case "run-a":
      if (isBackLeg) {
        moveRect(node, -2, -3);
      }
      if (isFrontLeg) {
        moveRect(node, 2, 2);
      }
      if (isTail) {
        moveRect(node, -2, -2);
        resizeRect(node, 1, 0);
      }
      if (isHead || isEar) {
        moveRect(node, 1, -1);
      }
      if (isBody) {
        moveRect(node, 1, 0);
      }
      return;
    case "run-b":
      if (isBackLeg) {
        moveRect(node, 2, 2);
      }
      if (isFrontLeg) {
        moveRect(node, -2, -3);
      }
      if (isTail) {
        moveRect(node, 2, -1);
      }
      if (isHead || isEar) {
        moveRect(node, -1, -1);
      }
      if (isBody) {
        moveRect(node, -1, 0);
      }
      return;
    case "sleep-a":
      if (isBody) {
        moveRect(node, 0, 5);
        resizeRect(node, 0, -2);
      }
      if (isHead || isEar) {
        moveRect(node, -5, 10);
      }
      if (isLeg) {
        moveRect(node, -3, 8);
        resizeRect(node, 2, -4);
      }
      if (isTail) {
        moveRect(node, 5, 8);
      }
      return;
    case "sleep-b":
      if (isBody) {
        moveRect(node, 1, 6);
        resizeRect(node, 0, -3);
      }
      if (isHead || isEar) {
        moveRect(node, -4, 11);
      }
      if (isLeg) {
        moveRect(node, -2, 9);
        resizeRect(node, 1, -5);
      }
      if (isTail) {
        moveRect(node, 4, 9);
      }
      return;
    default:
      return;
  }
}

function mutateDogRect(node: Element, variant: FrameVariant) {
  const x = numericAttr(node, "x");
  const y = numericAttr(node, "y");
  const width = numericAttr(node, "width");

  const isTail = x <= 20 && y <= 54;
  const isHead = x >= 54 && y <= 58;
  const isEar = x >= 58 && y <= 34;
  const isLeg = y >= 62 && x >= 20 && x <= 56;
  const isFrontLeg = isLeg && x >= 38;
  const isBackLeg = isLeg && x < 38;
  const isBody = x >= 18 && x <= 58 && y >= 46 && y <= 66 && width >= 6;

  switch (variant) {
    case "rest-b":
      if (isTail) {
        moveRect(node, -1, -1);
      }
      if (isHead || isEar) {
        moveRect(node, 0, -1);
      }
      return;
    case "walk-a":
      if (isBackLeg) {
        moveRect(node, -1, -2);
      }
      if (isFrontLeg) {
        moveRect(node, 1, 1);
      }
      if (isTail) {
        moveRect(node, -1, -1);
      }
      return;
    case "walk-b":
      if (isBackLeg) {
        moveRect(node, 1, 1);
      }
      if (isFrontLeg) {
        moveRect(node, -1, -2);
      }
      if (isTail) {
        moveRect(node, 1, -1);
      }
      if (isHead) {
        moveRect(node, 0, -1);
      }
      return;
    case "walk-c":
      if (isTail) {
        moveRect(node, 0, -2);
      }
      if (isBody) {
        moveRect(node, 0, -1);
      }
      return;
    case "run-a":
      if (isBackLeg) {
        moveRect(node, -2, -3);
      }
      if (isFrontLeg) {
        moveRect(node, 2, 2);
      }
      if (isTail) {
        moveRect(node, -2, -2);
      }
      if (isHead || isEar) {
        moveRect(node, 1, -1);
      }
      if (isBody) {
        moveRect(node, 1, 0);
      }
      return;
    case "run-b":
      if (isBackLeg) {
        moveRect(node, 2, 2);
      }
      if (isFrontLeg) {
        moveRect(node, -2, -3);
      }
      if (isTail) {
        moveRect(node, 2, -1);
      }
      if (isHead || isEar) {
        moveRect(node, -1, -1);
      }
      if (isBody) {
        moveRect(node, -1, 0);
      }
      return;
    case "sleep-a":
      if (isBody) {
        moveRect(node, 0, 5);
        resizeRect(node, 0, -3);
      }
      if (isHead || isEar) {
        moveRect(node, -6, 11);
      }
      if (isLeg) {
        moveRect(node, -3, 8);
        resizeRect(node, 1, -6);
      }
      if (isTail) {
        moveRect(node, 5, 8);
      }
      return;
    case "sleep-b":
      if (isBody) {
        moveRect(node, 1, 6);
        resizeRect(node, 0, -4);
      }
      if (isHead || isEar) {
        moveRect(node, -5, 12);
      }
      if (isLeg) {
        moveRect(node, -2, 9);
        resizeRect(node, 1, -7);
      }
      if (isTail) {
        moveRect(node, 4, 9);
      }
      return;
    default:
      return;
  }
}

function mutateSvgFrame(svgText: string, species: Species, variant: FrameVariant) {
  const document = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const rects = [...document.querySelectorAll("rect")];
  const ellipses = [...document.querySelectorAll("ellipse")];

  rects.forEach((rect) => {
    if (species === "cat") {
      mutateCatRect(rect, variant);
      return;
    }

    mutateDogRect(rect, variant);
  });

  ellipses.forEach((ellipse) => {
    const cy = numericAttr(ellipse, "cy");
    if (cy >= 78) {
      if (variant === "run-a" || variant === "run-b") {
        setNumericAttr(ellipse, "cx", numericAttr(ellipse, "cx") + (variant === "run-a" ? 2 : -2));
      }

      if (variant === "sleep-a" || variant === "sleep-b") {
        setNumericAttr(ellipse, "rx", numericAttr(ellipse, "rx") + 4);
        setNumericAttr(ellipse, "ry", Math.max(3, numericAttr(ellipse, "ry") - 2));
      }
    }
  });

  return new XMLSerializer().serializeToString(document);
}

function toFrameUrl(svgText: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
}

export function buildPetFrameUrls(svgText: string, species: Species): Record<FrameBucket, string[]> {
  return {
    rest: [
      toFrameUrl(mutateSvgFrame(svgText, species, "rest-a")),
      toFrameUrl(mutateSvgFrame(svgText, species, "rest-b")),
    ],
    amble: [
      toFrameUrl(mutateSvgFrame(svgText, species, "walk-a")),
      toFrameUrl(mutateSvgFrame(svgText, species, "walk-b")),
      toFrameUrl(mutateSvgFrame(svgText, species, "walk-c")),
    ],
    trot: [
      toFrameUrl(mutateSvgFrame(svgText, species, "walk-a")),
      toFrameUrl(mutateSvgFrame(svgText, species, "walk-c")),
      toFrameUrl(mutateSvgFrame(svgText, species, "walk-b")),
    ],
    sprint: [
      toFrameUrl(mutateSvgFrame(svgText, species, "run-a")),
      toFrameUrl(mutateSvgFrame(svgText, species, "walk-c")),
      toFrameUrl(mutateSvgFrame(svgText, species, "run-b")),
      toFrameUrl(mutateSvgFrame(svgText, species, "walk-b")),
    ],
    sleep: [
      toFrameUrl(mutateSvgFrame(svgText, species, "sleep-a")),
      toFrameUrl(mutateSvgFrame(svgText, species, "sleep-b")),
    ],
  };
}

export function frameBucketForActivity(activity: PetActivity): FrameBucket {
  switch (activity) {
    case "sleep":
    case "sunbathe":
      return "sleep";
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
    case "climb_tree":
      return "amble";
    default:
      return "rest";
  }
}

export function frameDurationMs(activity: PetActivity) {
  switch (activity) {
    case "chase":
      return 120;
    case "play":
    case "dig":
    case "scuffle":
    case "approach_pet":
      return 170;
    case "wander":
    case "move_to_zone":
    case "seek_owner":
    case "climb_tree":
      return 260;
    case "sleep":
    case "sunbathe":
      return 760;
    default:
      return 460;
  }
}
