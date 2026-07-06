"use client";

import { useCallback, useEffect, useState } from "react";
import { Crosshair, Home, Megaphone, PawPrint } from "lucide-react";

import { SmartLink } from "@/components/ui/smart-link";
import { readJsonResponse } from "@/lib/api-client";
import { growthSummary } from "@/lib/domain/growth";
import type { DashboardPetCard, GardenZone, GardenZoneId } from "@/lib/types";

export function MyPetsPanel({
  zones,
  activeZoneId,
  refreshToken,
  onLocatePet,
  onSummonPet,
  onSetHome,
}: {
  zones: GardenZone[];
  activeZoneId: GardenZoneId;
  /** Bump to reload the list (e.g. after creating a zone or deleting a pet). */
  refreshToken: number;
  onLocatePet: (petId: string, zoneId: GardenZoneId) => void;
  onSummonPet: (petId: string) => Promise<void>;
  onSetHome: (petId: string, zoneId: GardenZoneId | null) => Promise<void>;
}) {
  const [cards, setCards] = useState<DashboardPetCard[] | null>(null);
  const [busyPetId, setBusyPetId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const response = await fetch("/api/me/pets/status");
      const payload = await readJsonResponse<{ pets: DashboardPetCard[] }>(response, "读取宠物失败。");
      setCards(payload.pets);
    } catch {
      setCards([]);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [refreshToken, reload]);

  if (cards === null) {
    return <p className="px-1 text-sm text-white/40">正在整理你的宠物名单…</p>;
  }

  if (cards.length === 0) {
    return (
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-white/80">
          <PawPrint aria-hidden="true" className="h-4 w-4 text-lime-200" />
          我的宠物
        </p>
        <p className="text-sm leading-6 text-white/50">
          你还没有宠物。去 Upload 页上传一张照片，就能生成第一只像素伙伴。
        </p>
      </div>
    );
  }

  const zoneNameById = new Map(zones.map((zone) => [zone.id, zone.name]));

  return (
    <div className="space-y-3" data-testid="my-pets-panel">
      <p className="flex items-center gap-2 text-sm font-semibold text-white/80">
        <PawPrint aria-hidden="true" className="h-4 w-4 text-lime-200" />
        我的宠物 · {cards.length}
      </p>
      <ul className="space-y-2">
        {cards.map((card) => {
          const growth = card.state ? growthSummary({ ...card.state }) : null;
          const zoneName = card.state
            ? zoneNameById.get(card.state.zoneId) ?? card.state.zoneId
            : "未入园";
          const inCurrentZone = card.state?.zoneId === activeZoneId;
          const homeZoneId = card.pet.homeZoneId;
          const homeName = homeZoneId ? zoneNameById.get(homeZoneId) ?? homeZoneId : null;
          const settledHere = homeZoneId === activeZoneId;

          return (
            <li
              className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.035] px-3 py-2.5"
              key={card.pet.id}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-black/30">
                {card.generation?.worldSpritePath ? (
                  <img
                    alt={card.pet.name}
                    className="h-9 w-9 object-contain [image-rendering:pixelated]"
                    src={card.generation.worldSpritePath}
                  />
                ) : (
                  <PawPrint aria-hidden="true" className="h-4 w-4 text-white/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <SmartLink
                  className="block truncate text-sm font-semibold text-white hover:text-lime-100"
                  href={`/pets/${card.pet.id}`}
                >
                  {card.pet.name}
                </SmartLink>
                <p className="truncate text-xs text-white/45">
                  {zoneName}
                  {growth ? ` · ${growth.stageLabel} · 羁绊 ${growth.bond}` : ""}
                  {homeName ? ` · 家：${homeName}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {card.state ? (
                  <button
                    aria-label={
                      settledHere ? `让 ${card.pet.name} 恢复自由漫游` : `让 ${card.pet.name} 定居到当前区域`
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:scale-105 disabled:opacity-50 ${
                      settledHere
                        ? "border-amber-300/60 bg-amber-300/15 text-amber-100"
                        : "border-white/12 bg-white/[0.05] text-white/55 hover:text-white"
                    }`}
                    data-testid="pet-home-toggle"
                    disabled={busyPetId === card.pet.id}
                    onClick={async () => {
                      setBusyPetId(card.pet.id);
                      try {
                        await onSetHome(card.pet.id, settledHere ? null : activeZoneId);
                        await reload();
                      } finally {
                        setBusyPetId(null);
                      }
                    }}
                    title={settledHere ? "已定居此区 · 点按恢复自由漫游" : "搬来这里定居（会一直住在这个区域）"}
                    type="button"
                  >
                    <Home aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                ) : null}
                {card.state ? (
                  <button
                    aria-label={`定位 ${card.pet.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-100 transition-transform hover:scale-105"
                    onClick={() => onLocatePet(card.pet.id, card.state!.zoneId)}
                    title="定位到它所在的区域"
                    type="button"
                  >
                    <Crosshair aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                ) : null}
                {card.state && !inCurrentZone ? (
                  <button
                    aria-label={`把 ${card.pet.name} 召到身边`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-lime-300/25 bg-lime-300/[0.08] text-lime-100 transition-transform hover:scale-105 disabled:opacity-50"
                    disabled={busyPetId === card.pet.id}
                    onClick={async () => {
                      setBusyPetId(card.pet.id);
                      try {
                        await onSummonPet(card.pet.id);
                        await reload();
                      } finally {
                        setBusyPetId(null);
                      }
                    }}
                    title="把它召到你身边"
                    type="button"
                  >
                    <Megaphone aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
