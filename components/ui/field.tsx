import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function FieldLabel({
  label,
  hint,
  htmlFor,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <label className="space-y-2" htmlFor={htmlFor}>
      <span className="block text-xs font-semibold tracking-[0.24em] uppercase text-white/70">
        {label}
      </span>
      {hint ? <span className="block text-sm text-white/45">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-white/12 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/60 focus:bg-white/7",
        props.className,
      )}
    />
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-white/12 bg-slate-950/80 px-4 text-sm text-white outline-none transition focus:border-lime-300/60",
        props.className,
      )}
    />
  );
}

export function TextAreaInput(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-3xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/60 focus:bg-white/7",
        props.className,
      )}
    />
  );
}
