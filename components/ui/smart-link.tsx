"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import type { ComponentPropsWithoutRef, FocusEventHandler, MouseEventHandler } from "react";

import { schedulePrefetch, type PrefetchTask } from "@/lib/client/prefetch";

type SmartLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string | ComponentPropsWithoutRef<typeof Link>["href"];
  warmTasks?: PrefetchTask[];
  prefetchMode?: "idle" | "hover" | "visible" | "off";
};

export function SmartLink({
  children,
  href,
  onFocus,
  onMouseEnter,
  prefetchMode = "idle",
  warmTasks = [],
  ...props
}: SmartLinkProps) {
  const router = useRouter();
  const hrefValue = typeof href === "string" ? (href as Route) : null;

  const triggerPrefetch = useCallback(
    (priority: PrefetchTask["priority"]) => {
      if (hrefValue) {
        schedulePrefetch({
          key: `route:${hrefValue}`,
          priority,
          run: () => router.prefetch(hrefValue),
        });
      }

      for (const task of warmTasks) {
        schedulePrefetch({
          ...task,
          priority: task.priority ?? priority,
        });
      }
    },
    [hrefValue, router, warmTasks],
  );

  useEffect(() => {
    if (prefetchMode === "idle") {
      triggerPrefetch("idle");
    }
    if (prefetchMode === "visible") {
      triggerPrefetch("visible");
    }
  }, [prefetchMode, triggerPrefetch]);

  const handleMouseEnter: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onMouseEnter?.(event);
    triggerPrefetch("hover");
  };

  const handleFocus: FocusEventHandler<HTMLAnchorElement> = (event) => {
    onFocus?.(event);
    triggerPrefetch("hover");
  };

  return (
    <Link
      href={href as ComponentPropsWithoutRef<typeof Link>["href"]}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      prefetch={false}
      {...props}
    >
      {children}
    </Link>
  );
}
