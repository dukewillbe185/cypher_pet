import { Hero } from "@/components/home/hero";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SmartLink } from "@/components/ui/smart-link";
import { getViewerContext } from "@/lib/auth";
import { getGardenPreview, getHomeSignals, listFeaturedPets } from "@/lib/repository";
import { formatRelativeTime } from "@/lib/utils";

export default async function Home() {
  const { profile } = await getViewerContext();
  const [featuredPets, previews, homeSignals] = await Promise.all([
    listFeaturedPets(),
    getGardenPreview(),
    getHomeSignals({
      viewerId: profile?.id,
      viewerName: profile?.displayName,
      simulate: false,
    }),
  ]);

  return (
    <div className="space-y-10">
      <Hero initialSignals={homeSignals} />

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-6">
          <Badge>现在花园里</Badge>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredPets.map(({ pet, generation, owner, state }) => (
              <SmartLink href={`/pets/${pet.id}`} key={pet.id}>
                <div className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-4 transition hover:border-lime-300/35 hover:bg-white/[0.05]">
                  <div className="mb-4 flex items-center justify-center rounded-[22px] border border-white/8 bg-black/35 p-4">
                    <img
                      alt={pet.name}
                      className="h-24 w-24 object-contain transition duration-300 group-hover:scale-110 [image-rendering:pixelated]"
                      src={generation?.worldSpritePath}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">{pet.name}</h2>
                      <span className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">
                        {state?.mood}
                      </span>
                    </div>
                    <p className="text-sm text-white/52">by {owner?.displayName}</p>
                    <p className="text-sm leading-7 text-white/65">{pet.bio}</p>
                  </div>
                </div>
              </SmartLink>
            ))}
          </div>
        </Card>

        <Card className="space-y-6">
          <Badge>分区预览</Badge>
          <div className="grid gap-4">
            {previews.map((preview) => (
              <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4" key={preview.zone.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{preview.zone.name}</h3>
                    <p className="mt-2 text-sm text-white/58">{preview.zone.description}</p>
                  </div>
                  <span className="text-sm text-white/40">{preview.pets.length} 只在线</span>
                </div>
                <div className="mt-4 space-y-3">
                  {preview.recentEvents.slice(0, 2).map((event) => (
                    <div className="rounded-[20px] border border-white/8 bg-black/20 p-3" key={event.id}>
                      <p className="text-sm leading-7 text-white/70">{event.body}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
                        {formatRelativeTime(event.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <SmartLink className={buttonVariants({ variant: "secondary" })} href="/garden">
            直接进入公共花园
          </SmartLink>
        </Card>
      </section>
    </div>
  );
}
