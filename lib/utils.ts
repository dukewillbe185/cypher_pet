import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(iso: string) {
  const value = new Date(iso);

  if (value.getTime() > Date.now()) {
    return "刚刚";
  }

  return formatDistanceToNow(value, { addSuffix: true });
}

export function slugifyHandle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export function titleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

export function jsonOk(payload: unknown, init?: ResponseInit) {
  return Response.json(payload, init);
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
