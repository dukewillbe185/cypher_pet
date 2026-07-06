"use client";

import { useEffect, useState } from "react";
import { Hammer, Lock, LockOpen, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/api-client";
import type {
  CustomZoneElementKind,
  DashboardPetCard,
  GardenZone,
  GardenZoneVisibility,
} from "@/lib/types";

const ELEMENT_OPTIONS: Array<{ kind: CustomZoneElementKind; label: string }> = [
  { kind: "tree", label: "🌳 果树" },
  { kind: "pond", label: "💧 小池塘" },
  { kind: "bush", label: "🌿 灌木" },
  { kind: "stone", label: "🪨 石头" },
  { kind: "fountain", label: "⛲ 喷泉" },
  { kind: "lamp", label: "💡 霓虹路灯" },
  { kind: "doghouse", label: "🏠 狗屋" },
  { kind: "pet_bed", label: "🛏️ 宠物床" },
  { kind: "rest_spot", label: "✨ 休息点" },
  { kind: "toy", label: "🎾 玩具" },
];

export function CreateZonePanel({
  onCreated,
  onClose,
}: {
  onCreated: (zone: GardenZone) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<GardenZoneVisibility>("public");
  const [selectedElements, setSelectedElements] = useState<CustomZoneElementKind[]>(["tree"]);
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);
  const [ownedPets, setOwnedPets] = useState<DashboardPetCard[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/me/pets/status")
      .then((response) => readJsonResponse<{ pets: DashboardPetCard[] }>(response, "读取宠物失败。"))
      .then((payload) => {
        if (!cancelled) {
          setOwnedPets(payload.pets);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOwnedPets([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleElement(kind: CustomZoneElementKind) {
    setSelectedElements((current) =>
      current.includes(kind) ? current.filter((entry) => entry !== kind) : [...current, kind],
    );
  }

  function togglePet(petId: string) {
    setSelectedPetIds((current) =>
      current.includes(petId) ? current.filter((entry) => entry !== petId) : [...current, petId],
    );
  }

  async function submit() {
    if (pending) {
      return;
    }

    try {
      setError(null);
      setPending(true);
      const response = await fetch("/api/garden/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          visibility,
          elements: selectedElements,
          petIds: selectedPetIds,
        }),
      });
      const payload = await readJsonResponse<{ zone: GardenZone }>(response, "开辟区域失败。");
      onCreated(payload.zone);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "开辟区域失败。");
      setPending(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[24px] border border-violet-300/20 bg-violet-300/[0.05] p-5" data-testid="create-zone-panel">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-violet-100">
          <Hammer aria-hidden="true" className="h-4 w-4" />
          开辟一块自己的区域
        </p>
        <button
          aria-label="关闭"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/55 hover:text-white"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          className="rounded-[14px] border border-white/12 bg-black/25 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-violet-300/50"
          maxLength={16}
          onChange={(event) => setName(event.target.value)}
          placeholder="给区域起个名字（最多 16 字）"
          value={name}
        />
        <div className="flex gap-1.5">
          <button
            className={`flex items-center gap-1.5 rounded-[14px] border px-3.5 py-2 text-xs font-semibold transition-colors ${
              visibility === "public"
                ? "border-lime-300/55 bg-lime-300/12 text-lime-100"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white"
            }`}
            onClick={() => setVisibility("public")}
            type="button"
          >
            <LockOpen aria-hidden="true" className="h-3.5 w-3.5" />
            公共
          </button>
          <button
            className={`flex items-center gap-1.5 rounded-[14px] border px-3.5 py-2 text-xs font-semibold transition-colors ${
              visibility === "private"
                ? "border-violet-300/55 bg-violet-300/12 text-violet-100"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white"
            }`}
            onClick={() => setVisibility("private")}
            type="button"
          >
            <Lock aria-hidden="true" className="h-3.5 w-3.5" />
            私密
          </button>
        </div>
      </div>
      <p className="text-xs leading-5 text-white/45">
        公共区域所有宠物都能来玩；私密区域只有你自己的宠物能进出。
      </p>

      <div>
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/40">选择区域元素</p>
        <div className="flex flex-wrap gap-1.5">
          {ELEMENT_OPTIONS.map((option) => (
            <button
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedElements.includes(option.kind)
                  ? "border-cyan-300/60 bg-cyan-300/12 text-cyan-50"
                  : "border-white/10 bg-white/5 text-white/50 hover:text-white"
              }`}
              key={option.kind}
              onClick={() => toggleElement(option.kind)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/40">让哪些宠物搬进来</p>
        {ownedPets && ownedPets.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {ownedPets.map((card) => (
              <button
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedPetIds.includes(card.pet.id)
                    ? "border-lime-300/60 bg-lime-300/12 text-lime-50"
                    : "border-white/10 bg-white/5 text-white/50 hover:text-white"
                }`}
                key={card.pet.id}
                onClick={() => togglePet(card.pet.id)}
                type="button"
              >
                {card.generation?.worldSpritePath ? (
                  <img
                    alt=""
                    className="h-5 w-5 object-contain [image-rendering:pixelated]"
                    src={card.generation.worldSpritePath}
                  />
                ) : null}
                {card.pet.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/40">暂时没有可以搬家的宠物，之后也可以随时呼唤它们过来。</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button disabled={pending || !name.trim() || selectedElements.length === 0} onClick={submit} type="button">
          {pending ? "开辟中..." : "开辟区域"}
        </Button>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </div>
    </div>
  );
}
