"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Radar } from "lucide-react";

import { ChatDrawer } from "@/components/chat/chat-drawer";
import { CreateZonePanel } from "@/components/garden/create-zone-panel";
import { MyPetsPanel } from "@/components/garden/my-pets-panel";
import { AmbientEncounters } from "@/components/garden/ambient-encounters";
import { buildAutonomyMapOverlays } from "@/components/garden/autonomy-map-overlays";
import { AutonomyRoutePanel } from "@/components/garden/autonomy-route-panel";
import { AutonomyRoster } from "@/components/garden/autonomy-roster";
import { EncounterContextPanel } from "@/components/garden/encounter-context-panel";
import { GardenCanvas, type ProximityPetAction } from "@/components/garden/garden-canvas";
import { NarrativeFeed } from "@/components/garden/narrative-feed";
import { PetAutonomyHud } from "@/components/garden/pet-autonomy-hud";
import {
  buildWorldActionFeedback,
  WorldActionFeedback,
  type PetCommandResult,
  type WorldActionFeedbackItem,
} from "@/components/garden/world-action-feedback";
import { WorldActivityTape, type WorldActivityTapeItem } from "@/components/garden/world-activity-tape";
import { WorldDirector, type WorldDirectorBeat } from "@/components/garden/world-director";
import { WorldEchoFeed, type WorldEchoItem } from "@/components/garden/world-echo-feed";
import { WorldMapRadar } from "@/components/garden/world-map-radar";
import { WorldPulse } from "@/components/garden/world-pulse";
import { mergeCurrentZoneSnapshot } from "@/components/garden/world-snapshot-cache";
import { useGardenZoneState } from "@/components/garden/use-garden-zone-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { readJsonResponse } from "@/lib/api-client";
import type { GardenSnapshot, GardenZone, GardenZoneId, Profile } from "@/lib/types";

const PRESENCE_REPORT_INTERVAL_MS = 4_000;

export function GardenExperience({
  initialSnapshot,
  worldSnapshots,
  zones,
  viewer,
}: {
  initialSnapshot: GardenSnapshot;
  worldSnapshots: GardenSnapshot[];
  zones: GardenZone[];
  viewer: Profile | null;
}) {
  const [activeZoneId, setActiveZoneId] = useState<GardenZoneId>(initialSnapshot.zone.id);
  const [zoneList, setZoneList] = useState<GardenZone[]>(zones);
  const [createZoneOpen, setCreateZoneOpen] = useState(false);
  const [myPetsRefreshToken, setMyPetsRefreshToken] = useState(0);
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>();
  const [selectedAutonomyRouteId, setSelectedAutonomyRouteId] = useState<string | undefined>();
  const [selectedEncounterId, setSelectedEncounterId] = useState<string | undefined>();
  const [worldActionFeedback, setWorldActionFeedback] = useState<WorldActionFeedbackItem | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerTileRef = useRef<{ tileX: number; tileY: number } | null>(null);
  const zoneState = useGardenZoneState(activeZoneId, initialSnapshot);
  const snapshot = zoneState.snapshot ?? initialSnapshot;
  const isSwitchingZone = snapshot.zone.id !== activeZoneId;
  const isZoneLocked = isSwitchingZone || zoneState.isLoading;
  const activeZone = useMemo(
    () => zoneList.find((zone) => zone.id === activeZoneId) ?? snapshot.zone,
    [activeZoneId, snapshot.zone, zoneList],
  );
  const selectedPet = snapshot.pets.find((entry) => entry.pet.id === selectedPetId);
  const selectedEncounter = snapshot.encounters.find((entry) => entry.id === selectedEncounterId);
  const autonomyOverlays = useMemo(
    () => buildAutonomyMapOverlays(snapshot, selectedPetId),
    [selectedPetId, snapshot],
  );
  const liveWorldSnapshots = useMemo(
    () => mergeCurrentZoneSnapshot(worldSnapshots, snapshot),
    [snapshot, worldSnapshots],
  );
  const selectedAutonomyRoute = autonomyOverlays.find((overlay) => overlay.id === selectedAutonomyRouteId);
  const visibleError = error ?? zoneState.error?.message ?? null;

  // Report the avatar position so pets can come looking for their owner.
  useEffect(() => {
    if (!viewer) {
      return;
    }

    let disposed = false;

    const report = async () => {
      const tile = playerTileRef.current;

      // A hidden tab is not "being in the garden" — otherwise pets keep
      // seeking a ghost while the player is off doing something else.
      if (!tile || disposed || document.visibilityState === "hidden") {
        return;
      }

      try {
        await fetch("/api/garden/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zoneId: activeZoneId,
            tileX: tile.tileX,
            tileY: tile.tileY,
          }),
        });
      } catch {
        // Presence is best-effort; the next interval retries.
      }
    };

    void report();
    const timer = window.setInterval(() => {
      void report();
    }, PRESENCE_REPORT_INTERVAL_MS);

    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
  }, [activeZoneId, viewer]);

  function switchZone(zoneId: GardenZoneId, options: { preserveSelection?: boolean } = {}) {
    if (zoneId === activeZoneId || isZoneLocked) {
      return;
    }

    setError(null);
    if (!options.preserveSelection) {
      setSelectedAutonomyRouteId(undefined);
      setSelectedEncounterId(undefined);
      setSelectedPetId(undefined);
    }
    setActiveZoneId(zoneId);
  }

  function handlePetSelection(petId: string) {
    setSelectedPetId((current) => (current === petId ? undefined : petId));
  }

  function handleEncounterSelection(encounterId: string, participantPetId?: string) {
    setSelectedAutonomyRouteId(undefined);
    setSelectedEncounterId(encounterId);
    if (participantPetId) {
      setSelectedPetId(participantPetId);
    }
  }

  function handleAutonomyRouteSelection(routeId: string) {
    setError(null);
    setSelectedEncounterId(undefined);
    setSelectedAutonomyRouteId(routeId);
  }

  function handleWorldEchoSelection(item: WorldEchoItem) {
    setError(null);
    setSelectedAutonomyRouteId(undefined);
    setSelectedEncounterId(item.kind === "encounter" ? item.encounterId : undefined);
    setSelectedPetId(item.petIds[0]);

    if (item.zoneId !== activeZoneId) {
      switchZone(item.zoneId, { preserveSelection: true });
    }
  }

  function handleWorldDirectorBeatSelection(beat: WorldDirectorBeat) {
    setError(null);
    setSelectedAutonomyRouteId(undefined);
    setSelectedEncounterId(beat.kind === "encounter" ? beat.encounterId : undefined);
    setSelectedPetId(beat.petIds[0]);

    if (beat.zoneId !== activeZoneId) {
      switchZone(beat.zoneId, { preserveSelection: true });
    }
  }

  function handleWorldActivitySelection(item: WorldActivityTapeItem) {
    setError(null);
    setSelectedAutonomyRouteId(undefined);
    setSelectedEncounterId(item.kind === "encounter" ? item.encounterId : undefined);
    setSelectedPetId(item.petIds[0]);

    if (item.zoneId !== activeZoneId) {
      switchZone(item.zoneId, { preserveSelection: true });
    }
  }

  function handleWorldActionComplete(result: PetCommandResult) {
    setWorldActionFeedback(buildWorldActionFeedback(result));
  }

  async function refreshCurrentZone() {
    try {
      setError(null);
      await zoneState.refresh();
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "花园同步失败。");
    }
  }

  async function handleProximityOwnerAction(interaction: ProximityPetAction) {
    if (!viewer) {
      setError("先登录才能照顾宠物。");
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/pets/${interaction.petId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: interaction.action }),
      });
      const result = await readJsonResponse<{
        state: { petId: string; zoneId: GardenZoneId; activity: PetCommandResult["activity"] };
        event: { body: string };
      }>(response, "互动失败。");
      handleWorldActionComplete({
        petId: result.state.petId,
        zoneId: result.state.zoneId,
        previousZoneId: result.state.zoneId,
        activity: result.state.activity,
        summary: result.event.body,
      });
      await refreshCurrentZone();
    } catch (interactionError) {
      setError(interactionError instanceof Error ? interactionError.message : "互动失败。");
    }
  }

  function handleOpenChat(petId: string) {
    setSelectedPetId(petId);
    setChatOpen(true);
  }

  async function handleCleanPoop(objectId: string) {
    if (!viewer) {
      setError("先登录才能帮忙清理。");
      return;
    }

    try {
      setError(null);
      const response = await fetch("/api/garden/objects/clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectId }),
      });
      await readJsonResponse(response, "清理失败。");
      await refreshCurrentZone();
    } catch (cleanError) {
      setError(cleanError instanceof Error ? cleanError.message : "清理失败。");
    }
  }

  function handlePlayerTileChange(tileX: number, tileY: number) {
    playerTileRef.current = { tileX, tileY };
  }

  function handleZoneCreated(zone: GardenZone) {
    setZoneList((current) => [...current, zone]);
    setCreateZoneOpen(false);
    setMyPetsRefreshToken((token) => token + 1);
    setError(null);
    setSelectedAutonomyRouteId(undefined);
    setSelectedEncounterId(undefined);
    setSelectedPetId(undefined);
    setActiveZoneId(zone.id);
  }

  async function handleToggleZoneVisibility() {
    if (!viewer || activeZone.ownerId !== viewer.id) {
      return;
    }

    const nextVisibility = (activeZone.visibility ?? "public") === "public" ? "private" : "public";

    try {
      setError(null);
      const response = await fetch(`/api/garden/zones/${activeZone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: nextVisibility }),
      });
      const payload = await readJsonResponse<{ zone: GardenZone }>(response, "更新区域失败。");
      setZoneList((current) =>
        current.map((zone) => (zone.id === payload.zone.id ? payload.zone : zone)),
      );
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "更新区域失败。");
    }
  }

  function handleLocatePet(petId: string, zoneId: GardenZoneId) {
    setSelectedPetId(petId);
    if (zoneId !== activeZoneId) {
      switchZone(zoneId, { preserveSelection: true });
    }
  }

  async function handleSetPetHome(petId: string, zoneId: GardenZoneId | null) {
    try {
      setError(null);
      const response = await fetch(`/api/pets/${petId}/home`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId }),
      });
      await readJsonResponse(response, "安排失败。");
      await refreshCurrentZone();
    } catch (homeError) {
      setError(homeError instanceof Error ? homeError.message : "安排失败。");
    }
  }

  async function handleSummonPet(petId: string) {
    const tile = playerTileRef.current ?? { tileX: 24, tileY: 32 };

    try {
      setError(null);
      const response = await fetch(`/api/pets/${petId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: {
            type: "move_to_tile",
            zoneId: activeZoneId,
            tileX: tile.tileX,
            tileY: tile.tileY,
          },
        }),
      });
      const result = await readJsonResponse<PetCommandResult>(response, "召唤失败。");
      handleWorldActionComplete(result);
      await refreshCurrentZone();
    } catch (summonError) {
      setError(summonError instanceof Error ? summonError.message : "召唤失败。");
    }
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 overflow-visible p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <Badge>Open World Garden</Badge>
            <h1 className="mt-2 font-display text-3xl text-white">{activeZone.name}</h1>
            <p className="mt-1 text-sm leading-6 text-white/62">{activeZone.description}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {zoneList.map((zone) => (
              <button
                key={zone.id}
                className={`ease-smooth motion-fast shrink-0 rounded-full border px-4 py-2 text-sm transition-[transform,background-color,border-color,color,opacity] ${
                  activeZoneId === zone.id
                    ? "border-lime-300/60 bg-lime-300/15 text-lime-100 shadow-[0_0_0_1px_rgba(190,242,100,0.08)]"
                    : "border-white/10 bg-white/5 text-white/55 hover:border-cyan-300/25 hover:bg-cyan-300/[0.08] hover:text-white"
                }`}
                disabled={isZoneLocked || activeZoneId === zone.id}
                onClick={() => switchZone(zone.id)}
                type="button"
              >
                {zone.visibility === "private" ? "🔒 " : ""}
                {isSwitchingZone && activeZoneId === zone.id ? "切换中..." : zone.name}
                {viewer && zone.ownerId === viewer.id ? " ·我的" : ""}
              </button>
            ))}
            {viewer ? (
              <button
                className="ease-smooth motion-fast shrink-0 rounded-full border border-dashed border-violet-300/40 bg-violet-300/[0.06] px-4 py-2 text-sm text-violet-100/80 transition-[transform,background-color,border-color,color] hover:border-violet-300/70 hover:text-violet-50"
                data-testid="open-create-zone"
                onClick={() => setCreateZoneOpen((open) => !open)}
                type="button"
              >
                ＋ 开辟新区域
              </button>
            ) : null}
          </div>
        </div>

        {createZoneOpen && viewer ? (
          <CreateZonePanel onClose={() => setCreateZoneOpen(false)} onCreated={handleZoneCreated} />
        ) : null}

        {viewer && activeZone.ownerId === viewer.id ? (
          <div className="flex flex-wrap items-center gap-3 rounded-[18px] border border-violet-300/12 bg-violet-300/[0.04] px-4 py-2.5 text-sm text-violet-50/80">
            <span>
              这是你开辟的区域，当前
              {(activeZone.visibility ?? "public") === "private" ? "仅自己的宠物可进" : "对所有宠物开放"}。
            </span>
            <Button onClick={handleToggleZoneVisibility} type="button" variant="ghost">
              {(activeZone.visibility ?? "public") === "private" ? "改为公开" : "改为私密"}
            </Button>
          </div>
        ) : null}

        <div className={`space-y-3 ${isSwitchingZone ? "smooth-fade" : ""}`}>
          <GardenCanvas
            autonomyOverlays={autonomyOverlays}
            onCleanPoop={handleCleanPoop}
            onOpenChat={handleOpenChat}
            onOwnerAction={handleProximityOwnerAction}
            onPlayerTileChange={handlePlayerTileChange}
            onSelectAutonomyRoute={handleAutonomyRouteSelection}
            onSelectEncounter={handleEncounterSelection}
            onSelectPet={handlePetSelection}
            onTravel={(zoneId) => switchZone(zoneId, { preserveSelection: true })}
            selectedAutonomyRouteId={selectedAutonomyRouteId}
            selectedEncounterId={selectedEncounterId}
            selectedPetId={selectedPetId}
            snapshot={snapshot}
            travelLocked={isZoneLocked}
            viewerId={viewer?.id}
            viewerName={viewer?.displayName}
            zones={zoneList}
          />
          {selectedPet && viewer?.id === selectedPet.pet.ownerId ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-cyan-300/10 bg-cyan-300/[0.04] px-4 py-3 text-sm leading-6 text-cyan-50/78">
              <p>
                走到 {selectedPet.pet.name} 身边就能喂食和抚摸；离得远时，点呼唤让它自己跑过来找你。
              </p>
              <Button className="gap-2" onClick={() => setChatOpen(true)} type="button" variant="secondary">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                和 {selectedPet.pet.name} 聊聊
              </Button>
            </div>
          ) : null}
          {isSwitchingZone ? (
            <div className="rounded-[18px] border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-3 text-sm text-cyan-100/80">
              正在切到 {activeZone.name}，当前画面会保留到新分区就绪。
            </div>
          ) : null}
          <WorldActionFeedback
            feedback={worldActionFeedback}
            onClear={() => setWorldActionFeedback(null)}
            onSelectPet={handlePetSelection}
          />
          {selectedAutonomyRoute ? (
            <AutonomyRoutePanel
              onActionComplete={handleWorldActionComplete}
              onClear={() => setSelectedAutonomyRouteId(undefined)}
              onRefresh={refreshCurrentZone}
              onSelectPet={handlePetSelection}
              overlay={selectedAutonomyRoute}
              pets={snapshot.pets}
              viewer={viewer}
            />
          ) : null}
          {selectedEncounter ? (
            <EncounterContextPanel
              encounter={selectedEncounter}
              onClear={() => setSelectedEncounterId(undefined)}
              onRefresh={refreshCurrentZone}
              onSelectPet={handlePetSelection}
              pets={snapshot.pets}
              viewer={viewer}
            />
          ) : null}
          {visibleError ? <p className="text-sm text-rose-300">{visibleError}</p> : null}
        </div>
      </Card>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          <Card className="p-4">
            <AmbientEncounters
              encounters={snapshot.encounters}
              onRefresh={refreshCurrentZone}
              onSelectPet={handlePetSelection}
              pets={snapshot.pets}
              selectedEncounterId={selectedEncounterId}
              viewerId={viewer?.id}
            />
          </Card>
          <Card className="p-4">
            <NarrativeFeed
              events={zoneState.events}
              onSelectPet={handlePetSelection}
              pets={snapshot.pets}
              transport={zoneState.transport}
              zoneId={activeZoneId}
            />
          </Card>
        </div>

        <div className="space-y-4 2xl:sticky 2xl:top-24 2xl:self-start">
          {viewer ? (
            <Card className="p-4">
              <MyPetsPanel
                activeZoneId={activeZoneId}
                onLocatePet={handleLocatePet}
                onSetHome={handleSetPetHome}
                onSummonPet={handleSummonPet}
                refreshToken={myPetsRefreshToken}
                zones={zoneList}
              />
            </Card>
          ) : null}
          <PetAutonomyHud
            onChat={() => setChatOpen(true)}
            onRefresh={refreshCurrentZone}
            pet={selectedPet ?? null}
            viewer={viewer}
          />
          <Card className="p-4">
            <WorldMapRadar
              activeZoneId={activeZoneId}
              disabled={isZoneLocked}
              onSelectZone={switchZone}
              snapshots={liveWorldSnapshots}
            />
          </Card>
          {zoneState.isRefreshing && !isSwitchingZone ? (
            <p className="px-2 text-sm text-white/40">花园正在后台刷新。</p>
          ) : null}
        </div>
      </div>

      <details className="group rounded-[24px] border border-white/10 bg-white/[0.03]">
        <summary className="garden-summary-toggle flex cursor-pointer select-none items-center gap-3 rounded-[24px] px-5 py-4 text-sm font-semibold text-white/70 transition-colors hover:text-white">
          <Radar aria-hidden="true" className="h-4 w-4 text-cyan-200" />
          世界监控台 · World Console
          <span className="ml-auto text-xs font-normal uppercase tracking-[0.2em] text-white/35 group-open:hidden">
            展开
          </span>
          <span className="ml-auto hidden text-xs font-normal uppercase tracking-[0.2em] text-white/35 group-open:inline">
            收起
          </span>
        </summary>
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-[18px] border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/55">Garden Time</p>
              <p className="mt-1 font-mono text-lg text-cyan-50">{snapshot.world.clockLabel}</p>
              <p className="text-xs text-cyan-100/50">{snapshot.world.phase}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">Transport</p>
              <p className="mt-1 font-mono text-lg text-white">{zoneState.transport}</p>
              <p className="text-xs text-white/42">{zoneState.isRefreshing ? "refreshing" : "steady"}</p>
            </div>
            <div className="rounded-[18px] border border-lime-300/12 bg-lime-300/[0.05] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-lime-100/50">Pets</p>
              <p className="mt-1 font-mono text-lg text-lime-50">{snapshot.pets.length}</p>
            </div>
            <div className="rounded-[18px] border border-amber-300/12 bg-amber-300/[0.05] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-100/50">Objects</p>
              <p className="mt-1 font-mono text-lg text-amber-50">
                {snapshot.objects.filter((item) => !item.removedAt).length}
              </p>
            </div>
          </div>

          <WorldDirector
            activeZoneId={activeZoneId}
            onSelectBeat={handleWorldDirectorBeatSelection}
            selectedEncounterId={selectedEncounterId}
            selectedPetId={selectedPetId}
            snapshots={liveWorldSnapshots}
          />

          <WorldActivityTape
            activeZoneId={activeZoneId}
            onSelectItem={handleWorldActivitySelection}
            selectedEncounterId={selectedEncounterId}
            selectedPetId={selectedPetId}
            snapshots={liveWorldSnapshots}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <AutonomyRoster
                onSelectPet={handlePetSelection}
                pets={snapshot.pets}
                selectedPetId={selectedPetId}
              />
            </Card>
            <Card className="p-4">
              <WorldEchoFeed
                activeZoneId={activeZoneId}
                onSelectEcho={handleWorldEchoSelection}
                selectedZoneId={activeZoneId}
                snapshots={liveWorldSnapshots}
              />
            </Card>
          </div>

          <Card className="p-4">
            <WorldPulse
              encounters={snapshot.encounters}
              events={snapshot.recentEvents}
              onSelectEncounter={handleEncounterSelection}
              onSelectPet={handlePetSelection}
              pets={snapshot.pets}
              selectedEncounterId={selectedEncounterId}
              selectedPetId={selectedPetId}
            />
          </Card>
        </div>
      </details>

      <ChatDrawer
        onClose={() => setChatOpen(false)}
        onRefresh={refreshCurrentZone}
        open={chatOpen}
        pet={selectedPet ?? null}
        viewerId={viewer?.id}
      />
    </div>
  );
}
