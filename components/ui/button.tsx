import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function buttonVariants({
  className,
  variant = "primary",
}: {
  className?: string;
  variant?: Variant;
} = {}) {
  return cn(
    "ease-smooth motion-fast inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold tracking-[0.18em] uppercase transition-[transform,background-color,border-color,color,opacity,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" &&
      "border-lime-300/70 bg-lime-300 text-slate-950 shadow-[0_0_32px_rgba(163,230,53,0.35)] hover:-translate-y-0.5 hover:bg-lime-200",
    variant === "secondary" &&
      "border-cyan-300/50 bg-cyan-300/10 text-cyan-100 hover:-translate-y-0.5 hover:bg-cyan-300/20",
    variant === "ghost" &&
      "border-white/12 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
    variant === "danger" &&
      "border-rose-400/40 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20",
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
}) {
  return (
    <button
      className={buttonVariants({ className, variant })}
      {...props}
    />
  );
}
