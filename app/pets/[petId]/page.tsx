import { notFound, redirect } from "next/navigation";

import { OwnerActionButtons, ReportForm } from "@/components/forms/cyber-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getViewerContext } from "@/lib/auth";
import { canViewPet } from "@/lib/domain/pets";
import { getPetDetails } from "@/lib/repository";
import { formatRelativeTime } from "@/lib/utils";

type PetPageProps = {
  params: Promise<{ petId: string }>;
};

export default async function PetPage({ params }: PetPageProps) {
  const { petId } = await params;
  const details = await getPetDetails(petId);
  const { profile } = await getViewerContext();

  if (!details) {
    notFound();
  }

  if (!canViewPet(details.pet, profile?.id, profile?.role ?? "user")) {
    redirect("/garden");
  }

  const isOwner = profile?.id === details.pet.ownerId;
  const autonomy = details.autonomyProfile;
  const memoryDigest = details.memoryDigest;
  const semanticMemory = details.semanticMemoryDigest;
  const episodicIndex = details.episodicMemoryIndex;
  const conversationSummary = details.conversationSummary;
  const lastDecision = details.state?.lastAutonomyDecision;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="space-y-5">
        <div className="flex items-center justify-center rounded-[30px] border border-white/10 bg-black/35 p-10">
          {details.generation?.worldSpritePath ? (
            <img
              alt={details.pet.name}
              className="h-56 w-56 object-contain [image-rendering:pixelated]"
              src={details.generation.worldSpritePath}
            />
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge>{details.pet.species}</Badge>
          <Badge className="border-lime-300/25 bg-lime-300/10 text-lime-100">
            {details.zone?.name ?? "未分区"}
          </Badge>
          <Badge className="border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
            {details.state?.mood ?? "unknown"}
          </Badge>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-5">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
            by @{details.owner.handle}
          </p>
          <div className="space-y-3">
            <h1 className="font-display text-5xl text-white">{details.pet.name}</h1>
            <p className="text-white/62">{details.pet.bio}</p>
            {details.pet.breed ? <p className="text-sm text-white/40">{details.pet.breed}</p> : null}
            <p className="text-xs uppercase tracking-[0.22em] text-lime-200/70">
              {details.personality.archetype}
            </p>
          </div>

          <div className="rounded-[24px] border border-lime-300/15 bg-lime-300/[0.05] p-5">
            <p className="text-sm leading-7 text-lime-100/80">{details.personality.summary}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.18em] text-white/52 sm:grid-cols-3">
              <div className="rounded-[16px] border border-white/8 bg-white/[0.03] p-3">
                好奇 {details.personality.curiosity}
              </div>
              <div className="rounded-[16px] border border-white/8 bg-white/[0.03] p-3">
                社交 {details.personality.sociability}
              </div>
              <div className="rounded-[16px] border border-white/8 bg-white/[0.03] p-3">
                胆量 {details.personality.boldness}
              </div>
              <div className="rounded-[16px] border border-white/8 bg-white/[0.03] p-3">
                上树 {details.personality.treeAffinity}
              </div>
              <div className="rounded-[16px] border border-white/8 bg-white/[0.03] p-3">
                疯跑 {details.personality.zoomies}
              </div>
              <div className="rounded-[16px] border border-white/8 bg-white/[0.03] p-3">
                嗜睡 {details.personality.napBias}
              </div>
            </div>
          </div>

          {details.state ? (
            <div className="grid gap-3">
              {[
                ["体力", details.state.energy],
                ["饥饿", details.state.hunger],
                ["卫生", details.state.hygiene],
                ["膀胱", details.state.bladder],
                ["社交", details.state.social],
                ["压力", details.state.stress],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/40">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/8">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-lime-300"
                      style={{ width: `${Number(value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-white">Autonomy</h2>
            <Badge className="border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100">
              {autonomy?.source ?? "derived"}
            </Badge>
          </div>

          <div className="rounded-[24px] border border-fuchsia-300/15 bg-fuchsia-300/[0.05] p-5">
            <p className="text-sm leading-7 text-white/82">
              {autonomy?.coreIdentity ?? "这只 pet 还没有生成长期 autonomy identity。"}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/60">
              {autonomy?.identityNarrative ?? "长期身份叙事还没有被压实。"}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">长期动机</p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {autonomy?.motivations.join("、") ?? "暂时未生成"}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">社交策略</p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {autonomy?.socialStrategy ?? "暂时未生成"}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">安全感来源</p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {autonomy?.comfortSources.join("、") ?? "暂时未生成"}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">压力触发点</p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {autonomy?.stressSignals.join("、") ?? "暂时未生成"}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">依恋方式</p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {autonomy?.attachmentStyle ?? "暂时未生成"}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">冲突方式</p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {autonomy?.conflictStyle ?? "暂时未生成"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-cyan-300/15 bg-cyan-300/[0.05] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">长期记忆摘要</p>
              <p className="mt-2 text-sm leading-7 text-white/72">
                {memoryDigest?.summary ?? "暂时还没有稳定的长期记忆摘要。"}
              </p>
            </div>
            <div className="rounded-[22px] border border-cyan-300/15 bg-cyan-300/[0.05] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">社交图景</p>
              <p className="mt-2 text-sm leading-7 text-white/72">
                {memoryDigest?.socialSummary ?? "暂时还没有足够稳定的关系图景。"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">当前驱动力</p>
              <p className="mt-2 text-sm text-white/72">
                {memoryDigest?.activeDrives.join(" / ") ?? "explore"}
              </p>
            </div>
            <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">偏好活动</p>
              <p className="mt-2 text-sm text-white/72">
                {autonomy?.favoriteActivities.join(" / ") ?? "暂时未生成"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-cyan-300/15 bg-cyan-300/[0.05] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Conversation Summary</p>
              <p className="mt-2 text-sm leading-7 text-white/72">
                {conversationSummary?.summary ?? "这段对话的滚动摘要还没有形成。"}
              </p>
            </div>
            <div className="rounded-[22px] border border-cyan-300/15 bg-cyan-300/[0.05] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Long-Term Identity Trace</p>
              <p className="mt-2 text-sm leading-7 text-white/72">
                rev {autonomy?.revision ?? 1} · confidence {autonomy?.confidence?.toFixed(2) ?? "0.00"} · {autonomy?.refreshReason ?? "bootstrap"}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-cyan-300/15 bg-cyan-300/[0.05] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Compressed Memory</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">长期偏爱</p>
                <p className="mt-2 text-sm text-white/72">{semanticMemory?.longTermPreferences.join(" / ") || "暂无"}</p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">长期厌恶</p>
                <p className="mt-2 text-sm text-white/72">{semanticMemory?.longTermAversions.join(" / ") || "暂无"}</p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">社会判断</p>
                <p className="mt-2 text-sm text-white/72">{semanticMemory?.socialJudgments.join(" / ") || "暂无"}</p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">地点 / 物件意义</p>
                <p className="mt-2 text-sm text-white/72">
                  {[
                    ...(semanticMemory?.placeMeanings ?? []),
                    ...(semanticMemory?.objectMeanings ?? []),
                  ].join(" / ") || "暂无"}
                </p>
              </div>
            </div>
          </div>

          {episodicIndex ? (
            <div className="rounded-[24px] border border-lime-300/15 bg-lime-300/[0.05] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-lime-200/70">Episodic Memory Index</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["People", episodicIndex.people],
                    ["Places", episodicIndex.places],
                    ["Objects", episodicIndex.objects],
                    ["Owner", episodicIndex.owner],
                    ["Conflicts", episodicIndex.conflicts],
                    ["Comforts", episodicIndex.comforts],
                  ] as Array<[string, string[]]>
                ).map(([label, entries]) => (
                  <div className="rounded-[18px] border border-white/8 bg-black/20 p-4" key={label}>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
                    <p className="mt-2 text-sm text-white/72">
                      {Array.isArray(entries) && entries.length > 0 ? entries.join(" / ") : "暂无"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-[24px] border border-lime-300/15 bg-lime-300/[0.05] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-lime-200/70">Last Decision</p>
              <Badge className="border-lime-300/25 bg-lime-300/10 text-lime-100">
                {lastDecision?.source ?? "none"}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/78">
              {lastDecision
                ? `${lastDecision.goal} -> ${lastDecision.chosenActivity}。${lastDecision.reason}`
                : "最近还没有记录到 autonomy decision。"}
            </p>
            {lastDecision ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-white/8 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">社交意图</p>
                  <p className="mt-2 text-sm text-white/72">{lastDecision.socialIntent ?? "none"}</p>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">候选动作</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {lastDecision.candidates.map((candidate) => (
                      <Badge
                        className="border-white/10 bg-white/[0.04] text-white/72"
                        key={`${candidate.activity}-${candidate.targetPetId ?? "none"}-${candidate.targetObjectId ?? "none"}`}
                      >
                        {candidate.activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold text-white">最近行为日志</h2>
          {details.currentGoals.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {details.currentGoals.map((goal) => (
                <div className="rounded-[22px] border border-cyan-300/10 bg-cyan-300/[0.04] p-4" key={goal.id}>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">{goal.goalType}</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">{goal.reason}</p>
                  <p className="mt-2 text-xs text-white/40">priority {goal.priority} · progress {goal.progress}%</p>
                </div>
              ))}
            </div>
          ) : null}
          {details.bonds.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {details.bonds.map((bond) => (
                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4" key={bond.otherPetId}>
                  <p className="text-sm text-white/78">{bond.otherPetName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200/70">{bond.status}</p>
                  <p className="mt-2 text-xs text-white/48">亲近 {bond.affinity} / 敌意 {bond.rivalry}</p>
                </div>
              ))}
            </div>
          ) : null}
          {details.relationshipModels.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {details.relationshipModels.map((model) => (
                <div className="rounded-[22px] border border-fuchsia-300/10 bg-fuchsia-300/[0.04] p-4" key={model.id}>
                  <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">{model.attachmentPattern}</p>
                  <p className="mt-2 text-xs text-white/48">
                    trust {model.trust} / play {model.playCompatibility} / intimidation {model.intimidation} / resentment {model.resentment}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          {details.memories.length > 0 ? (
            <div className="space-y-3">
              {details.memories.map((memory) => (
                <div className="rounded-[22px] border border-lime-300/10 bg-lime-300/[0.04] p-4" key={memory.id}>
                  <p className="text-sm leading-7 text-lime-50/82">{memory.body}</p>
                </div>
              ))}
            </div>
          ) : null}
          {details.ledgerFacts.length > 0 ? (
            <div className="space-y-3">
              {details.ledgerFacts.map((fact) => (
                <div className="rounded-[22px] border border-cyan-300/10 bg-cyan-300/[0.04] p-4" key={fact.id}>
                  <p className="text-sm leading-7 text-cyan-50/82">
                    {fact.predicate} · {fact.objectLabel}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          <div className="space-y-4">
            {details.recentEvents.map((event) => (
              <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4" key={event.id}>
                <p className="text-sm leading-7 text-white/72">{event.body}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  {formatRelativeTime(event.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold text-white">{isOwner ? "你可以做的事" : "管理与反馈"}</h2>
          {isOwner ? (
            <OwnerActionButtons petId={details.pet.id} />
          ) : (
            <ReportForm targetId={details.pet.id} targetType="pet" />
          )}
        </Card>
      </div>
    </div>
  );
}
