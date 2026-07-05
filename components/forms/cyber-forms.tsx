"use client";

import type { Route } from "next";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Gift,
  Hand,
  Megaphone,
  Pencil,
  Sparkles,
  Trash2,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldLabel, SelectInput, TextAreaInput, TextInput } from "@/components/ui/field";
import { readJsonResponse } from "@/lib/api-client";
import { markPerformance, measurePerformance } from "@/lib/client/perf";
import { extractPetPalette } from "@/lib/client/photo-palette";
import type { OwnerAction, Profile, ReportTargetType } from "@/lib/types";

type CreatePetStage =
  | "idle"
  | "creating-pet"
  | "uploading-photo"
  | "generating-avatar"
  | "redirecting";

function useApiForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function resetStatus() {
    setMessage(null);
    setError(null);
  }

  function handleFailure(value: unknown) {
    setError(value instanceof Error ? value.message : "请求失败，请稍后重试。");
  }

  return {
    message,
    error,
    setMessage,
    setError,
    resetStatus,
    handleFailure,
  };
}

function stageLabel(stage: CreatePetStage) {
  switch (stage) {
    case "creating-pet":
      return "正在创建宠物档案...";
    case "uploading-photo":
      return "正在上传原始照片...";
    case "generating-avatar":
      return "正在生成像素宠物...";
    case "redirecting":
      return "马上带你去它的新页面...";
    case "idle":
    default:
      return "生成像素宠物";
  }
}

function StepPill({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div
      className={`ease-smooth motion-fast rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition-[background-color,border-color,color] ${
        active
          ? "border-cyan-300/40 bg-cyan-300/[0.12] text-cyan-50"
          : done
            ? "border-lime-300/30 bg-lime-300/[0.08] text-lime-100"
            : "border-white/8 bg-white/[0.03] text-white/40"
      }`}
    >
      {label}
    </div>
  );
}

function CreatePetStepper({ stage }: { stage: CreatePetStage }) {
  const stageOrder: CreatePetStage[] = [
    "creating-pet",
    "uploading-photo",
    "generating-avatar",
    "redirecting",
  ];
  const currentIndex = stageOrder.indexOf(stage);

  if (stage === "idle") {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <StepPill active={currentIndex === 0} done={currentIndex > 0} label="创建" />
      <StepPill active={currentIndex === 1} done={currentIndex > 1} label="上传" />
      <StepPill active={currentIndex === 2} done={currentIndex > 2} label="生成" />
      <StepPill active={currentIndex === 3} done={false} label="跳转" />
    </div>
  );
}

export function CreatePetForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [isNavigating, startNavigation] = useTransition();
  const [stage, setStage] = useState<CreatePetStage>("idle");
  const perfMarkRef = useRef<string | null>(null);
  const { message, error, setMessage, resetStatus, handleFailure } = useApiForm();

  async function onSubmit(formData: FormData) {
    if (pending) {
      return;
    }

    let redirecting = false;

    try {
      resetStatus();
      setPending(true);
      setStage("creating-pet");
      const perfStart = `create-pet:start:${Date.now()}`;
      perfMarkRef.current = perfStart;
      markPerformance(perfStart);

      const name = String(formData.get("name") ?? "");
      const species = String(formData.get("species") ?? "");
      const breed = String(formData.get("breed") ?? "");
      const bio = String(formData.get("bio") ?? "");
      const visibility = String(formData.get("visibility") ?? "public");
      const photo = formData.get("photo");

      const petResponse = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, species, breed, bio, visibility }),
      });
      const petPayload = await readJsonResponse<{
        pet: { id: string };
      }>(petResponse, "创建宠物失败。");

      if (!(photo instanceof File) || photo.size === 0) {
        throw new Error("请先上传一张宠物照片。");
      }

      setStage("uploading-photo");
      const uploadPayload = new FormData();
      uploadPayload.append("photo", photo);

      // Sample the photo's dominant colors so the sprite matches the real pet.
      const palette = await extractPetPalette(photo);
      if (palette) {
        uploadPayload.append("palette", JSON.stringify(palette));
      }

      const uploadResponse = await fetch(`/api/pets/${petPayload.pet.id}/source-photo`, {
        method: "POST",
        body: uploadPayload,
      });
      const uploadJson = await readJsonResponse<{
        sourcePhoto: { id: string };
      }>(uploadResponse, "上传照片失败。");

      setStage("generating-avatar");
      const generationResponse = await fetch(`/api/pets/${petPayload.pet.id}/generations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourcePhotoId: uploadJson.sourcePhoto.id }),
      });
      await readJsonResponse(generationResponse, "生成像素宠物失败。");

      setMessage("像素宠物已经送进花园。");
      setStage("redirecting");
      const href = `/pets/${petPayload.pet.id}` as Route;
      router.prefetch(href);
      redirecting = true;

      if (perfMarkRef.current) {
        const perfEnd = `create-pet:ready:${petPayload.pet.id}:${Date.now()}`;
        markPerformance(perfEnd);
        measurePerformance("create-pet-submit", perfMarkRef.current, perfEnd);
      }

      startNavigation(() => {
        router.push(href);
      });
    } catch (submissionError) {
      setPending(false);
      setStage("idle");
      handleFailure(submissionError);
    }

    if (!redirecting) {
      setPending(false);
    }
  }

  const busy = pending || isNavigating;

  return (
    <form action={onSubmit} className="space-y-6">
      <CreatePetStepper stage={stage} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <FieldLabel htmlFor="name" label="宠物名字" />
          <TextInput id="name" name="name" placeholder="Nyx / Miso / Cipher" required />
        </div>
        <div className="space-y-3">
          <FieldLabel htmlFor="species" label="物种" />
          <SelectInput defaultValue="cat" id="species" name="species">
            <option value="cat">猫</option>
            <option value="dog">狗</option>
          </SelectInput>
        </div>
        <div className="space-y-3">
          <FieldLabel htmlFor="breed" hint="可选" label="品种" />
          <TextInput id="breed" name="breed" placeholder="Bombay / Shiba / Mixed" />
        </div>
        <div className="space-y-3">
          <FieldLabel htmlFor="visibility" label="是否进入公共花园" />
          <SelectInput defaultValue="public" id="visibility" name="visibility">
            <option value="public">公开进入花园</option>
            <option value="private">先私密观察</option>
          </SelectInput>
        </div>
      </div>

      <div className="space-y-3">
        <FieldLabel htmlFor="bio" hint="一句话描述它的脾气。" label="档案简介" />
        <TextAreaInput id="bio" name="bio" placeholder="一不高兴就会找树爬，开心时满园子乱冲。" />
      </div>

      <div className="space-y-3">
        <FieldLabel htmlFor="photo" hint="支持 JPG / PNG / WEBP，最大 10MB。" label="原始照片" />
        <TextInput accept="image/png,image/jpeg,image/webp" id="photo" name="photo" required type="file" />
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="text-sm text-lime-200">{message}</p> : null}
      <Button disabled={busy} type="submit">
        {busy ? stageLabel(stage) : "生成像素宠物"}
      </Button>
    </form>
  );
}

export function ProfileSetupForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const { message, error, setMessage, handleFailure, resetStatus } = useApiForm();

  async function onSubmit(formData: FormData) {
    if (pending) {
      return;
    }

    try {
      resetStatus();
      setPending(true);
      const perfStart = `profile-save:start:${Date.now()}`;
      markPerformance(perfStart);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: String(formData.get("handle") ?? ""),
          displayName: String(formData.get("displayName") ?? ""),
          bio: String(formData.get("bio") ?? ""),
        }),
      });
      await readJsonResponse(response, "保存失败。");

      setMessage("档案已更新。");
      const perfEnd = `profile-save:end:${Date.now()}`;
      markPerformance(perfEnd);
      measurePerformance("profile-save-submit", perfStart, perfEnd);

      startRefresh(() => {
        router.refresh();
      });
    } catch (submissionError) {
      handleFailure(submissionError);
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <FieldLabel htmlFor="displayName" label="显示名" />
          <TextInput defaultValue={profile.displayName} id="displayName" name="displayName" required />
        </div>
        <div className="space-y-3">
          <FieldLabel htmlFor="handle" label="Handle" />
          <TextInput defaultValue={profile.handle} id="handle" name="handle" required />
        </div>
      </div>
      <div className="space-y-3">
        <FieldLabel htmlFor="bio" hint="这个简介会公开展示在你的花园身份卡上。" label="简介" />
        <TextAreaInput defaultValue={profile.bio} id="bio" name="bio" />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="text-sm text-lime-200">{message}</p> : null}
      <Button disabled={pending || isRefreshing} type="submit">
        {pending ? "保存中..." : isRefreshing ? "正在同步界面..." : "保存档案"}
      </Button>
    </form>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [isNavigating, startNavigation] = useTransition();
  const { message, error, setMessage, handleFailure, resetStatus } = useApiForm();

  async function onSubmit(formData: FormData) {
    if (pending) {
      return;
    }

    try {
      resetStatus();
      setPending(true);
      const perfStart = `sign-in:start:${Date.now()}`;
      markPerformance(perfStart);

      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(formData.get("email") ?? "") }),
      });
      const payload = await readJsonResponse<{
        message?: string;
        redirectTo?: string;
      }>(response, "登录失败。");

      setMessage(payload.message ?? "已经发送登录链接。");
      const perfEnd = `sign-in:end:${Date.now()}`;
      markPerformance(perfEnd);
      measurePerformance("sign-in-submit", perfStart, perfEnd);

      if (payload.redirectTo) {
        const redirectTo = payload.redirectTo as Route;
        router.prefetch(redirectTo);
        startNavigation(() => {
          router.push(redirectTo);
        });
      } else {
        setPending(false);
      }
    } catch (submissionError) {
      setPending(false);
      handleFailure(submissionError);
    }
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <div className="space-y-3">
        <FieldLabel htmlFor="email" hint="未配置 Supabase 时会自动进入 demo 账号。" label="邮箱" />
        <TextInput id="email" name="email" placeholder="luna@cypher.pet" required type="email" />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="text-sm text-lime-200">{message}</p> : null}
      <Button className="w-full" disabled={pending || isNavigating} type="submit">
        {pending ? "链接生成中..." : isNavigating ? "正在进入花园..." : "进入 Cypher Garden"}
      </Button>
    </form>
  );
}

export function RegeneratePetSpriteForm({ petId }: { petId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { message, error, setMessage, resetStatus, handleFailure } = useApiForm();

  async function onSubmit(formData: FormData) {
    if (pending) {
      return;
    }

    try {
      resetStatus();
      setPending(true);

      const photo = formData.get("photo");

      if (!(photo instanceof File) || photo.size === 0) {
        throw new Error("请选择一张新的宠物照片。");
      }

      const uploadPayload = new FormData();
      uploadPayload.append("photo", photo);

      const palette = await extractPetPalette(photo);
      if (palette) {
        uploadPayload.append("palette", JSON.stringify(palette));
      }

      const uploadResponse = await fetch(`/api/pets/${petId}/source-photo`, {
        method: "POST",
        body: uploadPayload,
      });
      const uploadJson = await readJsonResponse<{
        sourcePhoto: { id: string };
      }>(uploadResponse, "上传照片失败。");

      const generationResponse = await fetch(`/api/pets/${petId}/generations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourcePhotoId: uploadJson.sourcePhoto.id }),
      });
      await readJsonResponse(generationResponse, "重新生成失败。");

      setMessage("新形象已生成，正在刷新。");
      router.refresh();
    } catch (submissionError) {
      handleFailure(submissionError);
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <FieldLabel
        hint="重新上传照片后会按照片的真实配色重新生成像素形象。"
        htmlFor="regenerate-photo"
        label="按照片配色重新生成"
      />
      <TextInput
        accept="image/png,image/jpeg,image/webp"
        id="regenerate-photo"
        name="photo"
        required
        type="file"
      />
      <Button disabled={pending} type="submit" variant="secondary">
        {pending ? "生成中..." : "重新生成像素形象"}
      </Button>
      {message ? <p className="text-sm text-lime-200">{message}</p> : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </form>
  );
}

export function OwnerActionButtons({
  petId,
  onDone,
}: {
  petId: string;
  onDone?: () => void;
}) {
  const [pendingAction, setPendingAction] = useState<OwnerAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const actionGroups: Array<{
    label: string;
    actions: Array<{
      action: OwnerAction;
      idleLabel: string;
      pendingLabel: string;
      variant: "primary" | "secondary" | "ghost" | "danger";
      icon: LucideIcon;
    }>;
  }> = [
    {
      label: "Care",
      actions: [
        {
          action: "feed",
          idleLabel: "喂食",
          pendingLabel: "喂食中...",
          variant: "primary",
          icon: Utensils,
        },
        {
          action: "pet",
          idleLabel: "摸头",
          pendingLabel: "摸头中...",
          variant: "secondary",
          icon: Hand,
        },
        {
          action: "clean_poop",
          idleLabel: "清理",
          pendingLabel: "清理中...",
          variant: "ghost",
          icon: Trash2,
        },
      ],
    },
    {
      label: "Play",
      actions: [
        {
          action: "throw_toy",
          idleLabel: "丢玩具",
          pendingLabel: "丢玩具中...",
          variant: "ghost",
          icon: Sparkles,
        },
        {
          action: "call",
          idleLabel: "叫过来",
          pendingLabel: "呼唤中...",
          variant: "secondary",
          icon: Megaphone,
        },
        {
          action: "gift",
          idleLabel: "送礼物",
          pendingLabel: "送礼中...",
          variant: "ghost",
          icon: Gift,
        },
        {
          action: "photo",
          idleLabel: "拍照",
          pendingLabel: "拍照中...",
          variant: "ghost",
          icon: Camera,
        },
      ],
    },
    {
      label: "Context",
      actions: [
        {
          action: "scold",
          idleLabel: "训斥",
          pendingLabel: "训斥中...",
          variant: "danger",
          icon: Megaphone,
        },
        {
          action: "rename_spot",
          idleLabel: "起昵称",
          pendingLabel: "命名中...",
          variant: "ghost",
          icon: Pencil,
        },
      ],
    },
  ];

  async function runAction(action: OwnerAction) {
    try {
      setError(null);
      setPendingAction(action);
      const response = await fetch(`/api/pets/${petId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await readJsonResponse(response, "动作执行失败。");

      onDone?.();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "动作执行失败。");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="space-y-3">
      {actionGroups.map((group) => (
        <div className="space-y-2" key={group.label}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{group.label}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {group.actions.map(({ action, idleLabel, pendingLabel, variant, icon: Icon }) => (
              <Button
                className="h-10 justify-start gap-2 px-4 text-xs tracking-[0.12em]"
                disabled={pendingAction !== null}
                key={action}
                onClick={() => runAction(action)}
                type="button"
                variant={variant}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {pendingAction === action ? pendingLabel : idleLabel}
              </Button>
            ))}
          </div>
        </div>
      ))}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}

export function ReportForm({
  targetType,
  targetId,
}: {
  targetType: ReportTargetType;
  targetId: string;
}) {
  const [pending, setPending] = useState(false);
  const { error, message, setMessage, handleFailure, resetStatus } = useApiForm();

  async function onSubmit(formData: FormData) {
    if (pending) {
      return;
    }

    try {
      resetStatus();
      setPending(true);
      const perfStart = `report-submit:start:${Date.now()}`;
      markPerformance(perfStart);

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          reason: String(formData.get("reason") ?? ""),
        }),
      });
      await readJsonResponse(response, "举报失败。");

      setMessage("举报已提交给管理员。");
      const perfEnd = `report-submit:end:${Date.now()}`;
      markPerformance(perfEnd);
      measurePerformance("report-submit", perfStart, perfEnd);
    } catch (submissionError) {
      handleFailure(submissionError);
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <TextAreaInput name="reason" placeholder="说明为什么要举报这个宠物或事件..." required />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="text-sm text-lime-200">{message}</p> : null}
      <Button disabled={pending} type="submit" variant="danger">
        {pending ? "提交中..." : "提交举报"}
      </Button>
    </form>
  );
}

export function AdminReportActions({
  reportId,
  targetType,
}: {
  reportId: string;
  targetType: ReportTargetType;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function resolve(action: "dismiss" | "hide_pet" | "hide_event" | "freeze_pet") {
    if (pending) {
      return;
    }

    try {
      setError(null);
      setPending(true);
      const perfStart = `admin-report-resolve:start:${Date.now()}`;
      markPerformance(perfStart);

      const response = await fetch(`/api/admin/reports/${reportId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await readJsonResponse(response, "处理失败。");

      const perfEnd = `admin-report-resolve:end:${Date.now()}`;
      markPerformance(perfEnd);
      measurePerformance("admin-report-resolve", perfStart, perfEnd);

      startRefresh(() => {
        router.refresh();
      });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "处理失败。");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button disabled={pending || isRefreshing} onClick={() => resolve("dismiss")} type="button" variant="ghost">
          Dismiss
        </Button>
        {targetType === "pet" ? (
          <>
            <Button disabled={pending || isRefreshing} onClick={() => resolve("hide_pet")} type="button" variant="danger">
              Hide Pet
            </Button>
            <Button disabled={pending || isRefreshing} onClick={() => resolve("freeze_pet")} type="button" variant="danger">
              Freeze Pet
            </Button>
          </>
        ) : null}
        {targetType === "pet_event" ? (
          <Button disabled={pending || isRefreshing} onClick={() => resolve("hide_event")} type="button" variant="danger">
            Hide Event
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
