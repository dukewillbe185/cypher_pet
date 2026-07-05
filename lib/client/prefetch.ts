"use client";

export type PrefetchTask = {
  key: string;
  run: () => Promise<void> | void;
  priority?: "visible" | "hover" | "idle";
};

const inflightTasks = new Set<string>();
const completedTasks = new Set<string>();

function runTask(task: PrefetchTask) {
  if (completedTasks.has(task.key) || inflightTasks.has(task.key)) {
    return;
  }

  inflightTasks.add(task.key);
  void Promise.resolve(task.run())
    .catch(() => {
      // ignore prefetch failures
    })
    .finally(() => {
      inflightTasks.delete(task.key);
      completedTasks.add(task.key);
    });
}

export function schedulePrefetch(task: PrefetchTask) {
  if (typeof window === "undefined" || completedTasks.has(task.key) || inflightTasks.has(task.key)) {
    return;
  }

  if (task.priority === "visible") {
    globalThis.setTimeout(() => runTask(task), 0);
    return;
  }

  if (task.priority === "hover") {
    queueMicrotask(() => runTask(task));
    return;
  }

  const requestIdleCallback = (
    globalThis as typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    }
  ).requestIdleCallback;

  if (requestIdleCallback) {
    requestIdleCallback(
      () => runTask(task),
      {
        timeout: 1200,
      },
    );
    return;
  }

  globalThis.setTimeout(() => runTask(task), 160);
}
