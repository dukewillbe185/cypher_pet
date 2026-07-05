import { redirect } from "next/navigation";

import { GardenExperience } from "@/components/garden/garden-experience";
import { getViewerContext } from "@/lib/auth";
import { getGardenPreview, getGardenSnapshot, listGardenZones } from "@/lib/repository";
import type { GardenZoneId } from "@/lib/types";

type GardenPageProps = {
  searchParams: Promise<{
    zone?: string;
  }>;
};

export default async function GardenPage({ searchParams }: GardenPageProps) {
  const params = await searchParams;
  const { profile } = await getViewerContext();
  const zones = await listGardenZones();
  const requestedZone = params.zone as GardenZoneId | undefined;
  const zoneId = zones.some((zone) => zone.id === requestedZone) ? requestedZone! : "orchard";
  const [snapshot, worldSnapshots] = await Promise.all([
    getGardenSnapshot({
      zoneId,
      viewerId: profile?.id,
      llmMode: "off",
    }),
    getGardenPreview(profile?.id),
  ]);

  if (!snapshot) {
    redirect("/");
  }

  return <GardenExperience initialSnapshot={snapshot} viewer={profile} worldSnapshots={worldSnapshots} zones={zones} />;
}
