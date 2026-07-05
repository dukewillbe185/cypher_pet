(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/client/prefetch.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "schedulePrefetch",
    ()=>schedulePrefetch
]);
"use client";
const inflightTasks = new Set();
const completedTasks = new Set();
function runTask(task) {
    if (completedTasks.has(task.key) || inflightTasks.has(task.key)) {
        return;
    }
    inflightTasks.add(task.key);
    void Promise.resolve(task.run()).catch(()=>{
    // ignore prefetch failures
    }).finally(()=>{
        inflightTasks.delete(task.key);
        completedTasks.add(task.key);
    });
}
function schedulePrefetch(task) {
    if (("TURBOPACK compile-time value", "object") === "undefined" || completedTasks.has(task.key) || inflightTasks.has(task.key)) {
        return;
    }
    if (task.priority === "visible") {
        globalThis.setTimeout(()=>runTask(task), 0);
        return;
    }
    if (task.priority === "hover") {
        queueMicrotask(()=>runTask(task));
        return;
    }
    const requestIdleCallback = globalThis.requestIdleCallback;
    if (requestIdleCallback) {
        requestIdleCallback(()=>runTask(task), {
            timeout: 1200
        });
        return;
    }
    globalThis.setTimeout(()=>runTask(task), 160);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/smart-link.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SmartLink",
    ()=>SmartLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$prefetch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/prefetch.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function SmartLink({ children, href, onFocus, onMouseEnter, prefetchMode = "idle", warmTasks = [], ...props }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const hrefValue = typeof href === "string" ? href : null;
    const triggerPrefetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SmartLink.useCallback[triggerPrefetch]": (priority)=>{
            if (hrefValue) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$prefetch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["schedulePrefetch"])({
                    key: `route:${hrefValue}`,
                    priority,
                    run: {
                        "SmartLink.useCallback[triggerPrefetch]": ()=>router.prefetch(hrefValue)
                    }["SmartLink.useCallback[triggerPrefetch]"]
                });
            }
            for (const task of warmTasks){
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$prefetch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["schedulePrefetch"])({
                    ...task,
                    priority: task.priority ?? priority
                });
            }
        }
    }["SmartLink.useCallback[triggerPrefetch]"], [
        hrefValue,
        router,
        warmTasks
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SmartLink.useEffect": ()=>{
            if (prefetchMode === "idle") {
                triggerPrefetch("idle");
            }
            if (prefetchMode === "visible") {
                triggerPrefetch("visible");
            }
        }
    }["SmartLink.useEffect"], [
        prefetchMode,
        triggerPrefetch
    ]);
    const handleMouseEnter = (event)=>{
        onMouseEnter?.(event);
        triggerPrefetch("hover");
    };
    const handleFocus = (event)=>{
        onFocus?.(event);
        triggerPrefetch("hover");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        onFocus: handleFocus,
        onMouseEnter: handleMouseEnter,
        prefetch: false,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/smart-link.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(SmartLink, "6x8o1ZkR4Z9VWrDt2QX1aQeIWq8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SmartLink;
var _c;
__turbopack_context__.k.register(_c, "SmartLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/providers/posthog-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostHogProvider",
    ()=>PostHogProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/posthog-js/dist/module.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const posthogKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_POSTHOG_HOST;
function PostHogProvider({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PostHogProvider.useEffect": ()=>{
            if (!posthogKey || !posthogHost) {
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].init(posthogKey, {
                api_host: posthogHost,
                capture_pageview: true,
                capture_pageleave: true
            });
        }
    }["PostHogProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(PostHogProvider, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = PostHogProvider;
var _c;
__turbopack_context__.k.register(_c, "PostHogProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_c6fc225e._.js.map