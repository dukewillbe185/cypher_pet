module.exports = [
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatRelativeTime",
    ()=>formatRelativeTime,
    "jsonError",
    ()=>jsonError,
    "jsonOk",
    ()=>jsonOk,
    "slugifyHandle",
    ()=>slugifyHandle,
    "titleCase",
    ()=>titleCase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatDistanceToNow.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatRelativeTime(iso) {
    const value = new Date(iso);
    if (value.getTime() > Date.now()) {
        return "刚刚";
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDistanceToNow"])(value, {
        addSuffix: true
    });
}
function slugifyHandle(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24);
}
function titleCase(value) {
    return value.split(/[\s_-]+/).filter(Boolean).map((segment)=>segment[0]?.toUpperCase() + segment.slice(1)).join(" ");
}
function jsonOk(payload, init) {
    return Response.json(payload, init);
}
function jsonError(message, status = 400) {
    return Response.json({
        error: message
    }, {
        status
    });
}
}),
"[project]/components/chat/chat-bubble.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatBubble",
    ()=>ChatBubble
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
function ChatBubble({ message, petName }) {
    const isPet = message.participantType === "pet";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex", isPet ? "justify-start" : "justify-end"),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-[0_12px_30px_rgba(0,0,0,0.18)]", isPet ? "border border-cyan-300/25 bg-cyan-300/10 text-cyan-50" : "border border-lime-300/25 bg-lime-300/10 text-lime-50"),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-1 text-[10px] uppercase tracking-[0.24em] text-white/45",
                    children: isPet ? petName : "You"
                }, void 0, false, {
                    fileName: "[project]/components/chat/chat-bubble.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: message.content
                }, void 0, false, {
                    fileName: "[project]/components/chat/chat-bubble.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/chat/chat-bubble.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/chat/chat-bubble.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/skeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("ui-skeleton rounded-2xl", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/skeleton.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/chat/chat-drawer-skeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatDrawerSkeleton",
    ()=>ChatDrawerSkeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-ssr] (ecmascript)");
;
;
function ChatDrawerSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-5 w-40"
            }, void 0, false, {
                fileName: "[project]/components/chat/chat-drawer-skeleton.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-20 w-full rounded-[24px]"
            }, void 0, false, {
                fileName: "[project]/components/chat/chat-drawer-skeleton.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                    className: "h-16 w-40 rounded-[24px]"
                }, void 0, false, {
                    fileName: "[project]/components/chat/chat-drawer-skeleton.tsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/chat/chat-drawer-skeleton.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-24 w-[82%] rounded-[24px]"
            }, void 0, false, {
                fileName: "[project]/components/chat/chat-drawer-skeleton.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/chat/chat-drawer-skeleton.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/chat/use-buffered-stream.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBufferedStream",
    ()=>useBufferedStream
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function useBufferedStream(onChunk) {
    const frameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    const onChunkRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onChunk);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        onChunkRef.current = onChunk;
    }, [
        onChunk
    ]);
    const flushNow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!bufferRef.current) {
            return;
        }
        const nextChunk = bufferRef.current;
        bufferRef.current = "";
        onChunkRef.current(nextChunk);
    }, []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (frameRef.current !== null) {
            window.cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        bufferRef.current = "";
    }, []);
    const append = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((token)=>{
        bufferRef.current += token;
        if (frameRef.current !== null) {
            return;
        }
        frameRef.current = window.requestAnimationFrame(()=>{
            frameRef.current = null;
            flushNow();
        });
    }, [
        flushNow
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>reset, [
        reset
    ]);
    return {
        append,
        flushNow,
        reset
    };
}
}),
"[project]/components/garden/speech-bubble.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpeechBubble",
    ()=>SpeechBubble
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
function SpeechBubble({ text, kind = "thought", className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex max-w-full items-center rounded-[22px] border px-3 py-2 text-xs font-semibold leading-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]", kind === "speech" ? "border-cyan-300/25 bg-cyan-300/12 text-cyan-50" : "border-white/12 bg-white/10 text-white/80", className),
        children: text
    }, void 0, false, {
        fileName: "[project]/components/garden/speech-bubble.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function buttonVariants({ className, variant = "primary" } = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("ease-smooth motion-fast inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold tracking-[0.18em] uppercase transition-[transform,background-color,border-color,color,opacity,box-shadow] disabled:cursor-not-allowed disabled:opacity-50", variant === "primary" && "border-lime-300/70 bg-lime-300 text-slate-950 shadow-[0_0_32px_rgba(163,230,53,0.35)] hover:-translate-y-0.5 hover:bg-lime-200", variant === "secondary" && "border-cyan-300/50 bg-cyan-300/10 text-cyan-100 hover:-translate-y-0.5 hover:bg-cyan-300/20", variant === "ghost" && "border-white/12 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white", variant === "danger" && "border-rose-400/40 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20", className);
}
function Button({ className, variant = "primary", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: buttonVariants({
            className,
            variant
        }),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/field.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FieldLabel",
    ()=>FieldLabel,
    "SelectInput",
    ()=>SelectInput,
    "TextAreaInput",
    ()=>TextAreaInput,
    "TextInput",
    ()=>TextInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function FieldLabel({ label, hint, htmlFor }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "space-y-2",
        htmlFor: htmlFor,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "block text-xs font-semibold tracking-[0.24em] uppercase text-white/70",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/ui/field.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            hint ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "block text-sm text-white/45",
                children: hint
            }, void 0, false, {
                fileName: "[project]/components/ui/field.tsx",
                lineNumber: 19,
                columnNumber: 15
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/field.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
function TextInput(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-12 w-full rounded-2xl border border-white/12 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/60 focus:bg-white/7", props.className)
    }, void 0, false, {
        fileName: "[project]/components/ui/field.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
function SelectInput(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-12 w-full rounded-2xl border border-white/12 bg-slate-950/80 px-4 text-sm text-white outline-none transition focus:border-lime-300/60", props.className)
    }, void 0, false, {
        fileName: "[project]/components/ui/field.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
function TextAreaInput(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-h-28 w-full rounded-3xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/60 focus:bg-white/7", props.className)
    }, void 0, false, {
        fileName: "[project]/components/ui/field.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/api-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "describeUnexpectedApiPayload",
    ()=>describeUnexpectedApiPayload,
    "readJsonResponse",
    ()=>readJsonResponse
]);
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function extractErrorMessage(payload, fallback) {
    if (!isRecord(payload)) {
        return fallback;
    }
    if (typeof payload.error === "string" && payload.error.trim()) {
        return payload.error;
    }
    if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
    }
    return fallback;
}
function describeUnexpectedApiPayload(raw, fallback) {
    const trimmed = raw.trim();
    if (!trimmed) {
        return fallback;
    }
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
        return "接口返回了页面内容，不是预期的 JSON。通常是接口报错或服务端返回了错误页。";
    }
    return trimmed.length > 160 ? `${trimmed.slice(0, 157)}...` : trimmed;
}
async function readJsonResponse(response, fallbackMessage) {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        throw new Error(describeUnexpectedApiPayload(await response.text(), fallbackMessage));
    }
    const cloned = response.clone();
    let payload;
    try {
        payload = await response.json();
    } catch  {
        throw new Error(describeUnexpectedApiPayload(await cloned.text(), fallbackMessage));
    }
    if (!response.ok) {
        throw new Error(extractErrorMessage(payload, fallbackMessage));
    }
    return payload;
}
}),
"[project]/lib/client/cache-keys.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cacheKeys",
    ()=>cacheKeys
]);
const cacheKeys = {
    gardenSnapshot: (zoneId)=>`garden:snapshot:${zoneId}`,
    gardenEvents: (zoneId)=>`garden:events:${zoneId}`,
    chatSession: (petId)=>`chat:session:${petId}`,
    petDetails: (petId)=>`pet:details:${petId}`,
    viewerDashboard: (viewerId)=>`viewer:dashboard:${viewerId}`,
    notifications: (viewerId)=>`viewer:notifications:${viewerId}`
};
}),
"[project]/lib/client/ui-cache.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hydrateCache",
    ()=>hydrateCache,
    "invalidate",
    ()=>invalidate,
    "invalidatePrefix",
    ()=>invalidatePrefix,
    "prime",
    ()=>prime,
    "readCacheSnapshot",
    ()=>readCacheSnapshot,
    "readOrFetch",
    ()=>readOrFetch,
    "subscribeToCache",
    ()=>subscribeToCache,
    "useUiResource",
    ()=>useUiResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const cacheStore = new Map();
const cacheListeners = new Map();
function ensureEntry(key) {
    const existing = cacheStore.get(key);
    if (existing) {
        return existing;
    }
    const created = {
        updatedAt: 0,
        status: "idle",
        ttlMs: 0
    };
    cacheStore.set(key, created);
    return created;
}
function notify(key) {
    cacheListeners.get(key)?.forEach((listener)=>listener());
}
function isFresh(entry, ttlMs) {
    return entry.updatedAt > 0 && Date.now() - entry.updatedAt < ttlMs;
}
async function fetchIntoCache(key, options) {
    const entry = ensureEntry(key);
    if (entry.promise && !options.force) {
        return entry.promise;
    }
    entry.status = entry.data === undefined ? "loading" : "refreshing";
    entry.error = undefined;
    entry.ttlMs = options.ttlMs;
    notify(key);
    const promise = options.fetcher().then((data)=>{
        const nextEntry = ensureEntry(key);
        nextEntry.data = data;
        nextEntry.updatedAt = Date.now();
        nextEntry.status = "ready";
        nextEntry.error = undefined;
        nextEntry.promise = undefined;
        nextEntry.ttlMs = options.ttlMs;
        notify(key);
        return data;
    }).catch((error)=>{
        const nextEntry = ensureEntry(key);
        nextEntry.error = error instanceof Error ? error : new Error("resource-fetch-failed");
        nextEntry.status = nextEntry.data === undefined ? "error" : "ready";
        nextEntry.promise = undefined;
        notify(key);
        throw nextEntry.error;
    });
    entry.promise = promise;
    return promise;
}
function readOrFetch(key, options) {
    const entry = ensureEntry(key);
    entry.ttlMs = options.ttlMs;
    if (entry.data !== undefined && isFresh(entry, options.ttlMs)) {
        return Promise.resolve(entry.data);
    }
    if (entry.data !== undefined && !entry.promise) {
        void fetchIntoCache(key, options);
        return Promise.resolve(entry.data);
    }
    return fetchIntoCache(key, options);
}
function prime(key, options) {
    void readOrFetch(key, options);
}
function hydrateCache(key, data, ttlMs = 0) {
    const entry = ensureEntry(key);
    entry.data = data;
    entry.updatedAt = Date.now();
    entry.status = "ready";
    entry.error = undefined;
    entry.promise = undefined;
    if (ttlMs > 0) {
        entry.ttlMs = ttlMs;
    }
    notify(key);
}
function invalidate(key) {
    cacheStore.delete(key);
    notify(key);
}
function invalidatePrefix(prefix) {
    for (const key of cacheStore.keys()){
        if (key.startsWith(prefix)) {
            cacheStore.delete(key);
            notify(key);
        }
    }
}
function subscribeToCache(key, listener) {
    const listeners = cacheListeners.get(key) ?? new Set();
    listeners.add(listener);
    cacheListeners.set(key, listeners);
    return ()=>{
        listeners.delete(listener);
        if (listeners.size === 0) {
            cacheListeners.delete(key);
        }
    };
}
function readCacheSnapshot(key) {
    const entry = cacheStore.get(key);
    if (!entry) {
        return {
            status: "idle",
            updatedAt: 0
        };
    }
    return {
        data: entry.data,
        error: entry.error,
        status: entry.status,
        updatedAt: entry.updatedAt
    };
}
function useUiResource(key, options) {
    const { enabled = true, initialData, keepPreviousData = true, ttlMs } = options;
    const fetcherRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(options.fetcher);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetcherRef.current = options.fetcher;
    }, [
        options.fetcher
    ]);
    const [snapshot, setSnapshot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>readCacheSnapshot(key));
    const [previousData, setPreviousData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialData);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialData !== undefined) {
            hydrateCache(key, initialData, ttlMs);
        }
    }, [
        initialData,
        key,
        ttlMs
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>subscribeToCache(key, ()=>{
            setSnapshot(readCacheSnapshot(key));
        }), [
        key
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setSnapshot(readCacheSnapshot(key));
    }, [
        key
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) {
            return;
        }
        void readOrFetch(key, {
            ttlMs,
            keepPreviousData,
            fetcher: ()=>fetcherRef.current()
        });
    }, [
        enabled,
        key,
        keepPreviousData,
        ttlMs
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (snapshot.data !== undefined) {
            setPreviousData(snapshot.data);
        }
    }, [
        snapshot.data
    ]);
    const data = snapshot.data ?? (keepPreviousData ? previousData : undefined);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            data,
            error: snapshot.error,
            status: snapshot.status,
            updatedAt: snapshot.updatedAt,
            hasData: data !== undefined,
            isLoading: snapshot.status === "loading" && data === undefined,
            isRefreshing: snapshot.status === "refreshing",
            refresh: ()=>fetchIntoCache(key, {
                    ttlMs,
                    keepPreviousData,
                    force: true,
                    fetcher: ()=>fetcherRef.current()
                })
        }), [
        data,
        key,
        keepPreviousData,
        snapshot.error,
        snapshot.status,
        snapshot.updatedAt,
        ttlMs
    ]);
}
}),
"[project]/lib/client/perf.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "markPerformance",
    ()=>markPerformance,
    "measurePerformance",
    ()=>measurePerformance
]);
"use client";
const enabled = ("TURBOPACK compile-time value", "development") !== "production";
function markPerformance(name) {
    if (typeof performance === "undefined") {
        return;
    }
    performance.mark(name);
}
function measurePerformance(name, startMark, endMark) {
    if (typeof performance === "undefined") {
        return;
    }
    try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name, "measure");
        const entry = entries.at(-1);
        if (enabled && entry) {
            console.info(`[perf] ${name}: ${entry.duration.toFixed(1)}ms`);
        }
    } catch  {
    // ignore missing marks
    }
}
}),
"[project]/components/chat/chat-drawer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatDrawer",
    ()=>ChatDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$chat$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/chat/chat-bubble.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$chat$2d$drawer$2d$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/chat/chat-drawer-skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$use$2d$buffered$2d$stream$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/chat/use-buffered-stream.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$speech$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/speech-bubble.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/field.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/cache-keys.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/ui-cache.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/perf.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
const quickOptions = [
    {
        label: "过来",
        text: "过来，我在这边。"
    },
    {
        label: "夸夸",
        text: "你好乖，今天超棒。"
    },
    {
        label: "喂食",
        text: "🍖 给你一点好吃的。"
    },
    {
        label: "玩具",
        text: "要不要我给你扔玩具？"
    }
];
function ChatDrawer({ open, pet, viewerId, onClose, onRefresh }) {
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [streamStatus, setStreamStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hydratedPetId, setHydratedPetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const assistantMessageIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sendStartMarkRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const firstTokenMarkRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionKey = pet ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].chatSession(pet.pet.id) : "chat:disabled";
    const sessionResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUiResource"])(sessionKey, {
        enabled: open && Boolean(pet),
        fetcher: async ()=>{
            if (!pet) {
                return [];
            }
            const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(await fetch(`/api/chat/${pet.pet.id}`, {
                cache: "no-store"
            }), "聊天记录加载失败。");
            return payload.session?.messages ?? [];
        },
        keepPreviousData: false,
        ttlMs: 15_000
    });
    const bufferedStream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$use$2d$buffered$2d$stream$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBufferedStream"])((chunk)=>{
        const assistantId = assistantMessageIdRef.current;
        if (!assistantId) {
            return;
        }
        setMessages((current)=>current.map((message)=>message.id === assistantId ? {
                    ...message,
                    content: `${message.content}${chunk}`
                } : message));
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!pet) {
            setMessages([]);
            setHydratedPetId(null);
            return;
        }
        if (!open) {
            return;
        }
        setMessages(sessionResource.data ?? []);
        setHydratedPetId(pet.pet.id);
    }, [
        open,
        pet,
        sessionResource.data
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (open) {
            return;
        }
        abortRef.current?.abort();
        abortRef.current = null;
        assistantMessageIdRef.current = null;
        bufferedStream.reset();
        setPending(false);
        setStreamStatus(null);
    }, [
        bufferedStream,
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) {
            return;
        }
        const startMark = `chat-drawer:open:start:${pet?.pet.id ?? "none"}:${Date.now()}`;
        const endMark = `chat-drawer:open:end:${pet?.pet.id ?? "none"}:${Date.now()}`;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(startMark);
        const frame = window.requestAnimationFrame(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(endMark);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])(`chat-drawer-open:${pet?.pet.id ?? "none"}`, startMark, endMark);
        });
        return ()=>{
            window.cancelAnimationFrame(frame);
        };
    }, [
        open,
        pet?.pet.id
    ]);
    const title = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!pet) {
            return "和宠物聊天";
        }
        return `和 ${pet.pet.name} 聊聊`;
    }, [
        pet
    ]);
    async function sendMessage(content) {
        if (!pet || pending || !content.trim()) {
            return;
        }
        const trimmedContent = content.trim();
        const userMessage = {
            id: `local-${Date.now()}`,
            petId: pet.pet.id,
            participantType: "user",
            participantId: viewerId ?? "guest",
            content: trimmedContent,
            createdAt: new Date().toISOString()
        };
        const assistantId = `assistant-${Date.now()}`;
        const controller = new AbortController();
        const sendStartMark = `chat-send:start:${pet.pet.id}:${Date.now()}`;
        abortRef.current?.abort();
        abortRef.current = controller;
        assistantMessageIdRef.current = assistantId;
        sendStartMarkRef.current = sendStartMark;
        firstTokenMarkRef.current = sendStartMark;
        bufferedStream.reset();
        try {
            setPending(true);
            setError(null);
            setStreamStatus("生成中");
            setDraft("");
            setMessages((current)=>[
                    ...current,
                    userMessage,
                    {
                        id: assistantId,
                        petId: pet.pet.id,
                        participantType: "pet",
                        participantId: pet.pet.id,
                        content: "",
                        createdAt: new Date().toISOString()
                    }
                ]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(sendStartMark);
            const response = await fetch(`/api/chat/${pet.pet.id}/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: trimmedContent
                }),
                signal: controller.signal
            });
            const contentType = response.headers.get("content-type") ?? "";
            if (!response.ok) {
                throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeUnexpectedApiPayload"])(await response.text(), "聊天失败。"));
            }
            if (!contentType.includes("text/event-stream")) {
                throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeUnexpectedApiPayload"])(await response.text(), "聊天接口没有返回流式响应。"));
            }
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let donePayload = null;
            if (!reader) {
                throw new Error("聊天流不可用。");
            }
            while(true){
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                buffer += decoder.decode(value, {
                    stream: true
                });
                const chunks = buffer.split("\n\n");
                buffer = chunks.pop() ?? "";
                for (const chunk of chunks){
                    for (const rawLine of chunk.split("\n")){
                        const line = rawLine.trim();
                        if (!line.startsWith("data:")) {
                            continue;
                        }
                        let payload;
                        try {
                            payload = JSON.parse(line.slice(5).trim());
                        } catch  {
                            throw new Error("聊天流返回了无法解析的数据。");
                        }
                        if (payload.type === "ack") {
                            continue;
                        }
                        if (payload.type === "status" || payload.type === "repairing" || payload.type === "fallback") {
                            setStreamStatus(payload.message);
                            continue;
                        }
                        if (payload.type === "token") {
                            if (firstTokenMarkRef.current) {
                                const endMark = `chat-send:first-token:${pet.pet.id}:${Date.now()}`;
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(endMark);
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])(`chat-first-token:${pet.pet.id}`, firstTokenMarkRef.current, endMark);
                                firstTokenMarkRef.current = null;
                            }
                            bufferedStream.append(payload.token);
                            continue;
                        }
                        if (payload.type === "done") {
                            donePayload = payload;
                            continue;
                        }
                        if (payload.type === "error") {
                            throw new Error(payload.message);
                        }
                    }
                }
            }
            bufferedStream.flushNow();
            if (!donePayload) {
                throw new Error("聊天流提前结束了。");
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateCache"])(sessionKey, donePayload.session.messages, 15_000);
            setMessages(donePayload.session.messages);
            setHydratedPetId(pet.pet.id);
            setStreamStatus(null);
            await onRefresh();
            if (sendStartMarkRef.current) {
                const endMark = `chat-send:end:${pet.pet.id}:${Date.now()}`;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(endMark);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])(`chat-send-total:${pet.pet.id}`, sendStartMarkRef.current, endMark);
                sendStartMarkRef.current = null;
            }
        } catch (chatError) {
            if (!(chatError instanceof DOMException && chatError.name === "AbortError")) {
                setError(chatError instanceof Error ? chatError.message : "聊天失败。");
            }
            bufferedStream.flushNow();
            setStreamStatus(null);
        } finally{
            setPending(false);
            abortRef.current = null;
            assistantMessageIdRef.current = null;
        }
    }
    if (!pet) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `ease-smooth motion-base fixed inset-x-0 bottom-0 z-40 transition-[transform,opacity] ${open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "chat-drawer-panel mx-auto max-w-4xl rounded-t-[32px] border border-white/10 px-5 pb-5 pt-4 shadow-[0_-30px_80px_rgba(0,0,0,0.42)]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 flex items-start justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-black/30",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        alt: pet.pet.name,
                                        className: "h-12 w-12 object-contain [image-rendering:pixelated]",
                                        src: pet.generation.worldSpritePath
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat/chat-drawer.tsx",
                                        lineNumber: 315,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/chat-drawer.tsx",
                                    lineNumber: 314,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] uppercase tracking-[0.24em] text-cyan-100/55",
                                            children: "Pet Chat"
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/chat-drawer.tsx",
                                            lineNumber: 322,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-semibold text-white",
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/chat-drawer.tsx",
                                            lineNumber: 323,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$speech$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpeechBubble"], {
                                                    kind: pet.state.currentBubble?.kind ?? "thought",
                                                    text: pet.state.currentBubble?.text ?? `${pet.pet.name} 正在看着你。`
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/chat-drawer.tsx",
                                                    lineNumber: 325,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs uppercase tracking-[0.22em] text-white/35",
                                                    children: [
                                                        pet.state.mood,
                                                        " · ",
                                                        pet.state.activity
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/chat/chat-drawer.tsx",
                                                    lineNumber: 329,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/chat/chat-drawer.tsx",
                                            lineNumber: 324,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/chat/chat-drawer.tsx",
                                    lineNumber: 321,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/chat/chat-drawer.tsx",
                            lineNumber: 313,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: onClose,
                            type: "button",
                            variant: "ghost",
                            children: "关闭"
                        }, void 0, false, {
                            fileName: "[project]/components/chat/chat-drawer.tsx",
                            lineNumber: 335,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/chat/chat-drawer.tsx",
                    lineNumber: 312,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 max-h-[38vh] space-y-3 overflow-y-auto rounded-[28px] border border-white/8 bg-black/20 p-4",
                    children: [
                        open && sessionResource.isLoading && hydratedPetId !== pet.pet.id && messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$chat$2d$drawer$2d$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChatDrawerSkeleton"], {}, void 0, false, {
                            fileName: "[project]/components/chat/chat-drawer.tsx",
                            lineNumber: 342,
                            columnNumber: 13
                        }, this) : messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm leading-7 text-white/55",
                            children: [
                                "先和 ",
                                pet.pet.name,
                                " 说句话。它会根据现在的心情、关系和记忆来回你。"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/chat/chat-drawer.tsx",
                            lineNumber: 344,
                            columnNumber: 13
                        }, this) : messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$chat$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChatBubble"], {
                                message: message,
                                petName: pet.pet.name
                            }, message.id, false, {
                                fileName: "[project]/components/chat/chat-drawer.tsx",
                                lineNumber: 349,
                                columnNumber: 15
                            }, this)),
                        pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$speech$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpeechBubble"], {
                            className: "inline-flex",
                            kind: "speech",
                            text: streamStatus ?? "..."
                        }, void 0, false, {
                            fileName: "[project]/components/chat/chat-drawer.tsx",
                            lineNumber: 352,
                            columnNumber: 22
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/chat/chat-drawer.tsx",
                    lineNumber: 340,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 flex flex-wrap gap-2",
                    children: quickOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            disabled: pending,
                            onClick: ()=>sendMessage(option.text),
                            type: "button",
                            variant: "ghost",
                            children: option.label
                        }, option.label, false, {
                            fileName: "[project]/components/chat/chat-drawer.tsx",
                            lineNumber: 357,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/chat/chat-drawer.tsx",
                    lineNumber: 355,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                            onChange: (event)=>setDraft(event.target.value),
                            onKeyDown: (event)=>{
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    void sendMessage(draft);
                                }
                            },
                            placeholder: `对 ${pet.pet.name} 说点什么...`,
                            value: draft
                        }, void 0, false, {
                            fileName: "[project]/components/chat/chat-drawer.tsx",
                            lineNumber: 370,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            disabled: pending || !draft.trim(),
                            onClick: ()=>sendMessage(draft),
                            type: "button",
                            children: "发送"
                        }, void 0, false, {
                            fileName: "[project]/components/chat/chat-drawer.tsx",
                            lineNumber: 381,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/chat/chat-drawer.tsx",
                    lineNumber: 369,
                    columnNumber: 9
                }, this),
                error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-3 text-sm text-rose-300",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/chat/chat-drawer.tsx",
                    lineNumber: 385,
                    columnNumber: 18
                }, this) : null,
                !error && streamStatus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-3 text-sm text-cyan-200/80",
                    children: streamStatus
                }, void 0, false, {
                    fileName: "[project]/components/chat/chat-drawer.tsx",
                    lineNumber: 386,
                    columnNumber: 35
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/components/chat/chat-drawer.tsx",
            lineNumber: 311,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/chat/chat-drawer.tsx",
        lineNumber: 308,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/encounter-thread-labels.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "encounterWorldActionLabels",
    ()=>encounterWorldActionLabels,
    "formatEncounterIntervention",
    ()=>formatEncounterIntervention,
    "formatEncounterStatus",
    ()=>formatEncounterStatus,
    "formatEncounterWorldAction",
    ()=>formatEncounterWorldAction,
    "ownerActionLabels",
    ()=>ownerActionLabels
]);
const ownerActionLabels = {
    feed: "Feed",
    pet: "Comfort",
    throw_toy: "Throw toy",
    clean_poop: "Clean",
    call: "Call over",
    scold: "Interrupt",
    gift: "Gift",
    photo: "Photo",
    rename_spot: "Name spot"
};
const encounterStatusLabels = {
    active: "Active",
    resolving: "Resolving",
    resolved: "Resolved",
    expired: "Expired"
};
const encounterWorldActionLabels = {
    observe: "Observed",
    approach: "Approached"
};
function formatEncounterStatus(encounter) {
    return encounterStatusLabels[encounter.status ?? "active"];
}
function formatEncounterIntervention(encounter) {
    if (!encounter.lastIntervention) {
        return null;
    }
    return `Last intervention: ${ownerActionLabels[encounter.lastIntervention.action]}`;
}
function formatEncounterWorldAction(encounter) {
    if (!encounter.lastWorldAction) {
        return null;
    }
    return `Last world action: ${encounterWorldActionLabels[encounter.lastWorldAction.action]}`;
}
}),
"[project]/components/garden/garden-encounter-actions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findEncounterInterventionTarget",
    ()=>findEncounterInterventionTarget
]);
function findEncounterInterventionTarget(encounter, pets, viewerId) {
    if (!viewerId || encounter.suggestedOwnerActions.length === 0) {
        return null;
    }
    if (encounter.status && encounter.status !== "active") {
        return null;
    }
    const participantIds = new Set(encounter.participantPetIds);
    const pet = pets.find((entry)=>participantIds.has(entry.pet.id) && entry.pet.ownerId === viewerId);
    if (!pet) {
        return null;
    }
    return {
        petId: pet.pet.id,
        petName: pet.pet.name,
        actions: encounter.suggestedOwnerActions
    };
}
}),
"[project]/components/garden/ambient-encounters.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AmbientEncounters",
    ()=>AmbientEncounters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$footprints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Footprints$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/footprints.js [app-ssr] (ecmascript) <export default as Footprints>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2d$handshake$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HeartHandshake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart-handshake.js [app-ssr] (ecmascript) <export default as HeartHandshake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-ssr] (ecmascript) <export default as Utensils>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/encounter-thread-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$encounter$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-encounter-actions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const toneStyles = {
    conflict: "border-rose-300/22 bg-rose-300/[0.07] text-rose-50",
    social: "border-cyan-300/18 bg-cyan-300/[0.07] text-cyan-50",
    explore: "border-amber-300/18 bg-amber-300/[0.07] text-amber-50",
    care: "border-lime-300/18 bg-lime-300/[0.07] text-lime-50",
    rest: "border-violet-300/18 bg-violet-300/[0.07] text-violet-50"
};
const toneIcons = {
    conflict: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
    social: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2d$handshake$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HeartHandshake$3e$__["HeartHandshake"],
    explore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
    care: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"],
    rest: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$footprints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Footprints$3e$__["Footprints"]
};
function participantFor(pets, petId) {
    return pets.find((entry)=>entry.pet.id === petId);
}
function AmbientEncounters({ encounters, pets, viewerId, selectedEncounterId, onRefresh, onSelectPet }) {
    const [pendingActionKey, setPendingActionKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const encounterRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!selectedEncounterId) {
            return;
        }
        encounterRefs.current.get(selectedEncounterId)?.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }, [
        selectedEncounterId
    ]);
    async function runAction(petId, action, encounterThreadId) {
        const actionKey = `${petId}:${action}`;
        try {
            setError(null);
            setPendingActionKey(actionKey);
            const response = await fetch(`/api/pets/${petId}/actions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action,
                    encounterThreadId
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "介入失败。");
            onRefresh();
        } catch (actionError) {
            setError(actionError instanceof Error ? actionError.message : "介入失败。");
        } finally{
            setPendingActionKey(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-white",
                                children: "Ambient Encounters"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/ambient-encounters.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs uppercase tracking-[0.2em] text-white/35",
                                children: "discoverable situations"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/ambient-encounters.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/ambient-encounters.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42",
                        children: encounters.length
                    }, void 0, false, {
                        fileName: "[project]/components/garden/ambient-encounters.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/ambient-encounters.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            encounters.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48",
                children: "这个分区暂时没有明显的遭遇链。继续观察，或者切换区域。"
            }, void 0, false, {
                fileName: "[project]/components/garden/ambient-encounters.tsx",
                lineNumber: 103,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3",
                children: encounters.map((encounter)=>{
                    const Icon = toneIcons[encounter.tone];
                    const participants = encounter.participantPetIds.map((petId)=>participantFor(pets, petId)).filter((entry)=>Boolean(entry));
                    const intervention = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$encounter$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findEncounterInterventionTarget"])(encounter, pets, viewerId);
                    const lastIntervention = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatEncounterIntervention"])(encounter);
                    const lastWorldAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatEncounterWorldAction"])(encounter);
                    const selected = selectedEncounterId === encounter.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        "aria-current": selected ? "true" : undefined,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-[22px] border p-4 transition-[border-color,box-shadow,background-color]", toneStyles[encounter.tone], selected ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.26),0_0_34px_rgba(103,232,249,0.16)]" : ""),
                        ref: (node)=>{
                            if (node) {
                                encounterRefs.current.set(encounter.id, node);
                            } else {
                                encounterRefs.current.delete(encounter.id);
                            }
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        "aria-hidden": "true",
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/ambient-encounters.tsx",
                                        lineNumber: 137,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/garden/ambient-encounters.tsx",
                                    lineNumber: 136,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-2 sm:flex sm:flex-wrap sm:items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "min-w-0 break-words font-semibold leading-6 text-white",
                                                    children: encounter.title
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/ambient-encounters.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-fit rounded-full border border-white/10 bg-black/18 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/48",
                                                    children: encounter.stage
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/ambient-encounters.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-fit rounded-full border border-white/10 bg-black/18 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/48",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatEncounterStatus"])(encounter)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/ambient-encounters.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                                            lineNumber: 140,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 break-words text-sm leading-6 text-white/70",
                                            children: encounter.summary
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                                            lineNumber: 149,
                                            columnNumber: 21
                                        }, this),
                                        lastIntervention ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 break-words text-xs leading-5 text-white/50",
                                            children: lastIntervention
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                                            lineNumber: 151,
                                            columnNumber: 23
                                        }, this) : null,
                                        lastWorldAction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 break-words text-xs leading-5 text-white/50",
                                            children: lastWorldAction
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                                            lineNumber: 154,
                                            columnNumber: 23
                                        }, this) : null,
                                        participants.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 flex flex-wrap gap-2",
                                            children: participants.map((participant)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 py-1 pl-1 pr-3 text-xs text-white/72 transition-colors hover:border-cyan-300/30 hover:text-white",
                                                    onClick: ()=>onSelectPet(participant.pet.id),
                                                    type: "button",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            alt: participant.pet.name,
                                                            className: "h-7 w-7 rounded-full bg-black/30 object-contain p-0.5 [image-rendering:pixelated]",
                                                            src: participant.generation.worldSpritePath
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                                                            lineNumber: 166,
                                                            columnNumber: 29
                                                        }, this),
                                                        participant.pet.name
                                                    ]
                                                }, participant.pet.id, true, {
                                                    fileName: "[project]/components/garden/ambient-encounters.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 27
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                                            lineNumber: 158,
                                            columnNumber: 23
                                        }, this) : null,
                                        intervention ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 flex flex-wrap gap-2",
                                            children: intervention.actions.map((action)=>{
                                                const actionKey = `${intervention.petId}:${action}`;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    className: "h-9 px-3 text-[11px] tracking-[0.12em]",
                                                    disabled: pendingActionKey !== null,
                                                    onClick: ()=>runAction(intervention.petId, action, encounter.threadId),
                                                    type: "button",
                                                    variant: encounter.tone === "conflict" && action === "scold" ? "danger" : "ghost",
                                                    children: pendingActionKey === actionKey ? "Acting..." : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ownerActionLabels"][action]
                                                }, action, false, {
                                                    fileName: "[project]/components/garden/ambient-encounters.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 29
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                                            lineNumber: 178,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-3 break-words text-xs leading-5 text-white/45",
                                            children: "Observe only. You can directly intervene when one of your pets is involved."
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                                            lineNumber: 197,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/garden/ambient-encounters.tsx",
                                    lineNumber: 139,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/garden/ambient-encounters.tsx",
                            lineNumber: 135,
                            columnNumber: 17
                        }, this)
                    }, encounter.id, false, {
                        fileName: "[project]/components/garden/ambient-encounters.tsx",
                        lineNumber: 119,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/garden/ambient-encounters.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/garden/ambient-encounters.tsx",
                lineNumber: 209,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/ambient-encounters.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/garden-labels.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activityLabel",
    ()=>activityLabel,
    "activityTone",
    ()=>activityTone,
    "buildIntentSummary",
    ()=>buildIntentSummary,
    "goalLabel",
    ()=>goalLabel,
    "moodLabel",
    ()=>moodLabel,
    "relationshipPulse",
    ()=>relationshipPulse
]);
const activityLabels = {
    idle: "idling",
    wander: "wandering",
    sleep: "sleeping",
    eat: "eating",
    drink: "drinking",
    climb_tree: "climbing",
    hide: "hiding",
    poop: "pooping",
    chase: "chasing",
    scuffle: "scuffling",
    seek_owner: "seeking owner",
    play: "playing",
    look_around: "looking around",
    sunbathe: "sunbathing",
    watch_fish: "watching fish",
    groom: "grooming",
    dig: "digging",
    approach_pet: "approaching",
    observe_from_distance: "observing",
    claim_spot: "claiming spot",
    escort_owner: "escorting owner",
    offer_toy: "offering toy",
    reconcile: "reconciling",
    ignore: "ignoring",
    steal_spot: "stealing spot",
    move_to_zone: "moving zones"
};
const goalLabels = {
    seek_rest: "looking for rest",
    seek_food: "looking for food",
    seek_play: "looking for play",
    seek_owner: "seeking owner",
    seek_friend: "seeking a friend",
    avoid_threat: "seeking safety",
    guard_spot: "guarding a spot",
    self_maintain: "taking care",
    explore: "exploring"
};
const moodLabels = {
    happy: "happy",
    curious: "curious",
    playful: "playful",
    sleepy: "sleepy",
    lonely: "lonely",
    grumpy: "grumpy",
    dirty: "dirty"
};
const socialActivities = new Set([
    "play",
    "approach_pet",
    "offer_toy",
    "reconcile",
    "escort_owner",
    "seek_owner"
]);
const conflictActivities = new Set([
    "scuffle",
    "chase",
    "steal_spot",
    "ignore"
]);
const restActivities = new Set([
    "sleep",
    "sunbathe",
    "hide"
]);
const careActivities = new Set([
    "eat",
    "drink",
    "groom",
    "poop"
]);
const exploreActivities = new Set([
    "wander",
    "look_around",
    "watch_fish",
    "climb_tree",
    "dig",
    "claim_spot",
    "observe_from_distance",
    "move_to_zone"
]);
function enumFallback(value) {
    return value.replaceAll("_", " ");
}
function activityLabel(activity) {
    return activityLabels[activity] ?? enumFallback(activity);
}
function goalLabel(goal) {
    if (!goal) {
        return "reading the room";
    }
    return goal in goalLabels ? goalLabels[goal] : enumFallback(goal);
}
function moodLabel(mood) {
    return moodLabels[mood] ?? mood;
}
function activityTone(activity) {
    if (socialActivities.has(activity)) {
        return "social";
    }
    if (conflictActivities.has(activity)) {
        return "conflict";
    }
    if (restActivities.has(activity)) {
        return "rest";
    }
    if (careActivities.has(activity)) {
        return "care";
    }
    if (exploreActivities.has(activity)) {
        return "explore";
    }
    return "neutral";
}
function buildIntentSummary(pet) {
    const decision = pet.state.lastAutonomyDecision;
    const activity = decision?.chosenActivity ?? pet.state.activity;
    return {
        activity: activityLabel(activity),
        goal: goalLabel(decision?.goal),
        reason: decision?.reason ?? `${pet.pet.name} is ${moodLabel(pet.state.mood)} and currently ${activityLabel(pet.state.activity)}.`,
        source: decision?.source ?? "state",
        tone: activityTone(activity)
    };
}
function relationshipPulse(pet) {
    const strongestBond = [
        ...pet.bonds
    ].sort((left, right)=>Math.max(right.affinity, right.rivalry) - Math.max(left.affinity, left.rivalry))[0];
    if (strongestBond) {
        return {
            label: strongestBond.otherPetName,
            status: strongestBond.status,
            detail: `affinity ${strongestBond.affinity} / rivalry ${strongestBond.rivalry}`,
            tone: strongestBond.rivalry > strongestBond.affinity ? "conflict" : "social"
        };
    }
    const model = [
        ...pet.relationshipModels
    ].sort((left, right)=>Math.max(right.trust, right.resentment) - Math.max(left.trust, left.resentment))[0];
    if (!model) {
        return null;
    }
    return {
        label: "relationship model",
        status: model.attachmentPattern,
        detail: `trust ${model.trust} / resentment ${model.resentment}`,
        tone: model.resentment > model.trust ? "conflict" : "social"
    };
}
}),
"[project]/lib/domain/world.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WORLD_BOUNDS",
    ()=>WORLD_BOUNDS,
    "WORLD_COLS",
    ()=>WORLD_COLS,
    "WORLD_ROWS",
    ()=>WORLD_ROWS,
    "WORLD_TILE_SIZE",
    ()=>WORLD_TILE_SIZE,
    "buildEnvironmentActors",
    ()=>buildEnvironmentActors,
    "clampTileX",
    ()=>clampTileX,
    "clampTileY",
    ()=>clampTileY,
    "createWorldState",
    ()=>createWorldState,
    "scaleLegacyTileX",
    ()=>scaleLegacyTileX,
    "scaleLegacyTileY",
    ()=>scaleLegacyTileY
]);
const WORLD_COLS = 48;
const WORLD_ROWS = 48;
const WORLD_TILE_SIZE = 32;
const WORLD_BOUNDS = {
    minX: 4,
    maxX: 43,
    minY: 6,
    maxY: 43
};
const CYCLE_MINUTES = 12;
const CYCLE_MS = CYCLE_MINUTES * 60 * 1000;
function cycleProgress(now = new Date()) {
    return (now.getTime() % CYCLE_MS + CYCLE_MS) % CYCLE_MS / CYCLE_MS;
}
function pad(value) {
    return String(value).padStart(2, "0");
}
function phaseFromMinute(minuteOfDay) {
    if (minuteOfDay < 360) {
        return "night";
    }
    if (minuteOfDay < 540) {
        return "dawn";
    }
    if (minuteOfDay < 1020) {
        return "day";
    }
    if (minuteOfDay < 1200) {
        return "dusk";
    }
    return "night";
}
function clampTileX(tileX) {
    return Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, tileX));
}
function clampTileY(tileY) {
    return Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, tileY));
}
function scaleLegacyTileX(tileX) {
    return clampTileX(Math.round(WORLD_BOUNDS.minX + tileX / 19 * (WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX)));
}
function scaleLegacyTileY(tileY) {
    return clampTileY(Math.round(WORLD_BOUNDS.minY + tileY / 12 * (WORLD_BOUNDS.maxY - WORLD_BOUNDS.minY)));
}
function createWorldState(now = new Date()) {
    const progress = cycleProgress(now);
    const minuteOfDay = Math.floor(progress * 24 * 60);
    const hour = Math.floor(minuteOfDay / 60);
    const minute = minuteOfDay % 60;
    const phase = phaseFromMinute(minuteOfDay);
    if (phase === "night") {
        return {
            clockLabel: `${pad(hour)}:${pad(minute)}`,
            phase,
            cycleProgress: progress,
            minuteOfDay,
            isNight: true,
            skyTop: "#061325",
            skyBottom: "#163756",
            ambientGlow: "rgba(99,255,214,0.12)",
            overlayAlpha: 0.34,
            neonAlpha: 0.42,
            ambienceLabel: "夜里的花园会亮起霓虹灯，萤火虫和 hologram 蝴蝶开始出现。"
        };
    }
    if (phase === "dawn") {
        return {
            clockLabel: `${pad(hour)}:${pad(minute)}`,
            phase,
            cycleProgress: progress,
            minuteOfDay,
            isNight: false,
            skyTop: "#91D9FF",
            skyBottom: "#FFE6AE",
            ambientGlow: "rgba(255,224,141,0.18)",
            overlayAlpha: 0.08,
            neonAlpha: 0.16,
            ambienceLabel: "花园刚刚亮起来，宠物会慢慢从窝里醒过来。"
        };
    }
    if (phase === "dusk") {
        return {
            clockLabel: `${pad(hour)}:${pad(minute)}`,
            phase,
            cycleProgress: progress,
            minuteOfDay,
            isNight: false,
            skyTop: "#6BA7FF",
            skyBottom: "#FFB66D",
            ambientGlow: "rgba(255,183,109,0.16)",
            overlayAlpha: 0.16,
            neonAlpha: 0.28,
            ambienceLabel: "傍晚的空气会慢下来，跑累的狗和困了的猫都会找地方窝着。"
        };
    }
    return {
        clockLabel: `${pad(hour)}:${pad(minute)}`,
        phase,
        cycleProgress: progress,
        minuteOfDay,
        isNight: false,
        skyTop: "#83D8FF",
        skyBottom: "#C5F08F",
        ambientGlow: "rgba(255,255,255,0.08)",
        overlayAlpha: 0,
        neonAlpha: 0.08,
        ambienceLabel: "白天的花园最热闹，蝴蝶、蜜蜂、鱼和鸭子都会出来活动。"
    };
}
function actor(zoneId, id, kind, tileX, tileY, layer, scale, drift, tint) {
    return {
        id,
        kind,
        zoneId,
        tileX,
        tileY,
        layer,
        scale,
        drift,
        tint
    };
}
function buildEnvironmentActors(zoneId, world) {
    const actors = [
        actor(zoneId, `${zoneId}-cloud-1`, "cloud", 8, 4, "sky", 1.2, 0.18),
        actor(zoneId, `${zoneId}-cloud-2`, "cloud", 22, 6, "sky", 0.92, 0.14),
        actor(zoneId, `${zoneId}-cloud-3`, "cloud", 38, 5, "sky", 1.04, 0.12),
        actor(zoneId, `${zoneId}-shadow-1`, "cloud_shadow", 10, 20, "shadow", 1.25, 0.14),
        actor(zoneId, `${zoneId}-shadow-2`, "cloud_shadow", 28, 24, "shadow", 0.9, 0.11),
        actor(zoneId, `${zoneId}-shadow-3`, "cloud_shadow", 40, 18, "shadow", 1.05, 0.1)
    ];
    if (world.isNight) {
        actors.push(actor(zoneId, `${zoneId}-firefly-1`, "firefly", 10, 16, "air", 0.88, 0.25, "#C7FF60"), actor(zoneId, `${zoneId}-firefly-2`, "firefly", 18, 22, "air", 0.92, 0.2, "#BEF264"), actor(zoneId, `${zoneId}-firefly-3`, "firefly", 28, 19, "air", 0.8, 0.24, "#67E8F9"), actor(zoneId, `${zoneId}-mushroom-1`, "mushroom", 14, 31, "ground", 0.9, 0.06, "#67E8F9"), actor(zoneId, `${zoneId}-mushroom-2`, "mushroom", 30, 30, "ground", 0.82, 0.05, "#BEF264"));
    } else {
        actors.push(actor(zoneId, `${zoneId}-bee-1`, "bee", 14, 13, "air", 0.74, 0.32), actor(zoneId, `${zoneId}-butterfly-1`, "butterfly", 24, 15, "air", 0.84, 0.28, "#67E8F9"), actor(zoneId, `${zoneId}-leaf-1`, zoneId === "orchard" ? "petal" : "leaf", 18, 12, "air", 0.72, 0.18), actor(zoneId, `${zoneId}-grass-1`, "grass", 10, 33, "ground", 0.9, 0.08), actor(zoneId, `${zoneId}-grass-2`, "grass", 21, 34, "ground", 0.84, 0.07), actor(zoneId, `${zoneId}-grass-3`, "grass", 31, 33, "ground", 0.88, 0.06), actor(zoneId, `${zoneId}-grass-4`, "grass", 41, 35, "ground", 0.86, 0.05));
    }
    if (zoneId === "pond") {
        actors.push(actor(zoneId, `${zoneId}-duck-1`, "duck", 22, 22, "water", 0.98, 0.08), actor(zoneId, `${zoneId}-fish-1`, "fish", 18, 23, "water", 0.76, 0.16, "#5EEAD4"), actor(zoneId, `${zoneId}-fish-2`, "fish", 24, 24, "water", 0.7, 0.14, "#60A5FA"));
    }
    if (zoneId === "orchard") {
        actors.push(actor(zoneId, `${zoneId}-petal-2`, "petal", 12, 17, "air", 0.82, 0.12), actor(zoneId, `${zoneId}-petal-3`, "petal", 35, 15, "air", 0.76, 0.11));
    }
    if (zoneId === "dog-run") {
        actors.push(actor(zoneId, `${zoneId}-bee-2`, "bee", 30, 18, "air", 0.7, 0.24));
    }
    return actors;
}
}),
"[project]/components/garden/autonomy-map-overlays.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildAutonomyMapOverlays",
    ()=>buildAutonomyMapOverlays
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain/world.ts [app-ssr] (ecmascript)");
;
;
const DEFAULT_LIMIT = 8;
const currentActivityRouteOverrides = new Set([
    "scuffle",
    "chase"
]);
const zoneExitTiles = {
    orchard: {
        orchard: {
            tileX: 24,
            tileY: 24
        },
        pond: {
            tileX: 43,
            tileY: 24
        },
        grove: {
            tileX: 17,
            tileY: 43
        },
        "dog-run": {
            tileX: 43,
            tileY: 38
        }
    },
    pond: {
        orchard: {
            tileX: 4,
            tileY: 22
        },
        pond: {
            tileX: 24,
            tileY: 24
        },
        grove: {
            tileX: 16,
            tileY: 43
        },
        "dog-run": {
            tileX: 43,
            tileY: 34
        }
    },
    grove: {
        orchard: {
            tileX: 10,
            tileY: 6
        },
        pond: {
            tileX: 43,
            tileY: 19
        },
        grove: {
            tileX: 24,
            tileY: 24
        },
        "dog-run": {
            tileX: 43,
            tileY: 30
        }
    },
    "dog-run": {
        orchard: {
            tileX: 8,
            tileY: 7
        },
        pond: {
            tileX: 4,
            tileY: 24
        },
        grove: {
            tileX: 10,
            tileY: 43
        },
        "dog-run": {
            tileX: 24,
            tileY: 24
        }
    }
};
function highestGoal(pet) {
    return [
        ...pet.currentGoals
    ].filter((goal)=>goal.status === "active" || goal.status === "paused").sort((left, right)=>right.priority - left.priority)[0];
}
function needPressure(pet) {
    return Math.max(pet.state.hunger - 70, pet.state.stress - 66, 32 - pet.state.energy, 40 - pet.state.hygiene, pet.state.bladder - 74, 34 - pet.state.social, 0);
}
function objectLabel(objectId) {
    return objectId.replace(/^object-/, "").replaceAll("-", " ");
}
function petTargetOverlay(pet, targetPet, snapshot, priority) {
    const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIntentSummary"])(pet);
    const routeActivity = currentActivityRouteOverrides.has(pet.state.activity) ? pet.state.activity : "approach_pet";
    const tone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityTone"])(currentActivityRouteOverrides.has(pet.state.activity) ? pet.state.activity : pet.state.lastAutonomyDecision?.chosenActivity ?? pet.state.activity);
    return {
        id: `intent-route:${pet.pet.id}:${targetPet.pet.id}`,
        actorPetId: pet.pet.id,
        actorName: pet.pet.name,
        zoneId: snapshot.zone.id,
        targetKind: "pet",
        targetLabel: targetPet.pet.name,
        routeLabel: routeActivity === "scuffle" ? `scuffling with ${targetPet.pet.name}` : routeActivity === "chase" ? `chasing ${targetPet.pet.name}` : `approaching ${targetPet.pet.name}`,
        reason: intent.reason,
        tone,
        priority,
        start: {
            tileX: pet.state.tileX,
            tileY: pet.state.tileY
        },
        target: {
            tileX: targetPet.state.tileX,
            tileY: targetPet.state.tileY
        },
        targetPetId: targetPet.pet.id
    };
}
function objectTargetOverlay(pet, snapshot, targetObjectId, priority) {
    const object = snapshot.objects.find((entry)=>entry.id === targetObjectId && !entry.removedAt);
    if (!object) {
        return null;
    }
    const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIntentSummary"])(pet);
    return {
        id: `intent-route:${pet.pet.id}:${object.id}`,
        actorPetId: pet.pet.id,
        actorName: pet.pet.name,
        zoneId: snapshot.zone.id,
        targetKind: "object",
        targetLabel: objectLabel(object.id),
        routeLabel: `tracking ${objectLabel(object.id)}`,
        reason: intent.reason,
        tone: intent.tone,
        priority,
        start: {
            tileX: pet.state.tileX,
            tileY: pet.state.tileY
        },
        target: {
            tileX: object.tileX,
            tileY: object.tileY
        },
        targetObjectId: object.id
    };
}
function zoneTargetOverlay(pet, snapshot, goal, priority) {
    if (!goal.targetZoneId || goal.targetZoneId === snapshot.zone.id) {
        return null;
    }
    const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIntentSummary"])(pet);
    const target = zoneExitTiles[snapshot.zone.id]?.[goal.targetZoneId];
    if (!target) {
        return null;
    }
    return {
        id: `intent-route:${pet.pet.id}:zone-${goal.targetZoneId}`,
        actorPetId: pet.pet.id,
        actorName: pet.pet.name,
        zoneId: snapshot.zone.id,
        targetKind: "zone",
        targetLabel: goal.targetZoneId,
        routeLabel: `route to ${goal.targetZoneId}`,
        reason: goal.reason || intent.reason,
        tone: "explore",
        priority,
        start: {
            tileX: pet.state.tileX,
            tileY: pet.state.tileY
        },
        target,
        targetZoneId: goal.targetZoneId
    };
}
function ambientOffset(activity) {
    switch(activity){
        case "chase":
        case "play":
        case "dig":
            return {
                dx: 7,
                dy: 2
            };
        case "wander":
        case "move_to_zone":
            return {
                dx: 6,
                dy: 3
            };
        case "look_around":
            return {
                dx: 4,
                dy: -2
            };
        case "climb_tree":
            return {
                dx: 2,
                dy: -5
            };
        case "hide":
            return {
                dx: -4,
                dy: 2
            };
        case "watch_fish":
        case "drink":
            return {
                dx: 5,
                dy: 1
            };
        case "sleep":
        case "sunbathe":
            return {
                dx: 2,
                dy: 1
            };
        case "seek_owner":
            return {
                dx: -5,
                dy: 1
            };
        default:
            return {
                dx: 3,
                dy: 2
            };
    }
}
function ambientTargetOverlay(pet, snapshot, priority) {
    const decision = pet.state.lastAutonomyDecision;
    const pressure = needPressure(pet);
    if (!decision && pressure <= 0) {
        return null;
    }
    const activity = currentActivityRouteOverrides.has(pet.state.activity) ? pet.state.activity : decision?.chosenActivity ?? pet.state.activity;
    const isCurrentActivityOverride = currentActivityRouteOverrides.has(pet.state.activity);
    const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIntentSummary"])(pet);
    const offset = ambientOffset(activity);
    return {
        id: `intent-route:${pet.pet.id}:ambient`,
        actorPetId: pet.pet.id,
        actorName: pet.pet.name,
        zoneId: snapshot.zone.id,
        targetKind: "tile",
        targetLabel: "next tile",
        routeLabel: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityLabel"])(activity)} route`,
        reason: intent.reason,
        tone: isCurrentActivityOverride ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityTone"])(activity) : pressure > 20 ? "care" : intent.tone,
        priority,
        start: {
            tileX: pet.state.tileX,
            tileY: pet.state.tileY
        },
        target: {
            tileX: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clampTileX"])(pet.state.tileX + offset.dx),
            tileY: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clampTileY"])(pet.state.tileY + offset.dy)
        }
    };
}
function overlayPriority(pet, goal) {
    return needPressure(pet) + (goal?.priority ?? 0) + (pet.state.lastAutonomyDecision?.source === "llm" ? 10 : 0) + (pet.state.lastAutonomyDecision?.targetPetId ? 16 : 0);
}
function buildAutonomyMapOverlays(snapshot, selectedPetId, limit = DEFAULT_LIMIT) {
    const petsById = new Map(snapshot.pets.map((pet)=>[
            pet.pet.id,
            pet
        ]));
    const overlays = [];
    for (const pet of snapshot.pets){
        const decision = pet.state.lastAutonomyDecision;
        const goal = highestGoal(pet);
        const priority = overlayPriority(pet, goal) + (pet.pet.id === selectedPetId ? 120 : 0);
        if (decision?.targetPetId) {
            const targetPet = petsById.get(decision.targetPetId);
            if (targetPet) {
                overlays.push(petTargetOverlay(pet, targetPet, snapshot, priority));
                continue;
            }
        }
        if (decision?.targetObjectId) {
            const objectOverlay = objectTargetOverlay(pet, snapshot, decision.targetObjectId, priority);
            if (objectOverlay) {
                overlays.push(objectOverlay);
                continue;
            }
        }
        if (goal?.targetPetId) {
            const targetPet = petsById.get(goal.targetPetId);
            if (targetPet) {
                overlays.push(petTargetOverlay(pet, targetPet, snapshot, priority));
                continue;
            }
        }
        if (goal?.targetObjectId) {
            const objectOverlay = objectTargetOverlay(pet, snapshot, goal.targetObjectId, priority);
            if (objectOverlay) {
                overlays.push(objectOverlay);
                continue;
            }
        }
        if (goal?.targetZoneId) {
            const zoneOverlay = zoneTargetOverlay(pet, snapshot, goal, priority);
            if (zoneOverlay) {
                overlays.push(zoneOverlay);
                continue;
            }
        }
        const ambientOverlay = ambientTargetOverlay(pet, snapshot, priority);
        if (ambientOverlay) {
            overlays.push(ambientOverlay);
        }
    }
    return overlays.sort((left, right)=>{
        if (right.priority !== left.priority) {
            return right.priority - left.priority;
        }
        return left.actorName.localeCompare(right.actorName);
    }).slice(0, limit);
}
}),
"[project]/components/garden/autonomy-route-actions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildAutonomyRouteAction",
    ()=>buildAutonomyRouteAction
]);
function findPet(pets, petId) {
    return petId ? pets.find((pet)=>pet.pet.id === petId) ?? null : null;
}
function findViewerApproachPet(overlay, pets, viewer) {
    return pets.find((pet)=>{
        if (pet.pet.ownerId !== viewer.id || pet.pet.isFrozen) {
            return false;
        }
        return pet.pet.id !== overlay.actorPetId && pet.pet.id !== overlay.targetPetId;
    }) ?? null;
}
function commandForOwnedActor(overlay) {
    if (overlay.targetKind === "pet" && overlay.targetPetId) {
        return {
            type: "move_to_pet",
            targetPetId: overlay.targetPetId
        };
    }
    if (overlay.targetKind === "object" && overlay.targetObjectId) {
        return {
            type: "move_to_object",
            objectId: overlay.targetObjectId
        };
    }
    return {
        type: "move_to_tile",
        zoneId: overlay.zoneId,
        tileX: overlay.target.tileX,
        tileY: overlay.target.tileY
    };
}
function buildAutonomyRouteAction(overlay, pets, viewer) {
    if (!viewer) {
        return {
            actorPetId: null,
            actorName: null,
            label: "Enter Garden",
            command: null,
            disabledReason: "Enter Garden to act on this route."
        };
    }
    const actorPet = findPet(pets, overlay.actorPetId);
    if (actorPet?.pet.ownerId === viewer.id) {
        return {
            actorPetId: actorPet.pet.id,
            actorName: actorPet.pet.name,
            label: overlay.targetKind === "pet" ? `Guide ${actorPet.pet.name} to ${overlay.targetLabel}` : `Guide ${actorPet.pet.name}`,
            command: commandForOwnedActor(overlay),
            disabledReason: null
        };
    }
    const approachPet = findViewerApproachPet(overlay, pets, viewer);
    if (!approachPet) {
        return {
            actorPetId: null,
            actorName: null,
            label: "No pet nearby",
            command: null,
            disabledReason: "Bring one of your pets into this zone to approach this route."
        };
    }
    return {
        actorPetId: approachPet.pet.id,
        actorName: approachPet.pet.name,
        label: `Approach with ${approachPet.pet.name}`,
        command: {
            type: "move_to_pet",
            targetPetId: overlay.actorPetId
        },
        disabledReason: null
    };
}
}),
"[project]/components/garden/world-action-feedback.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldActionFeedback",
    ()=>WorldActionFeedback,
    "buildProjectedRouteConsequence",
    ()=>buildProjectedRouteConsequence,
    "buildWorldActionFeedback",
    ()=>buildWorldActionFeedback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function activityMeta(activity) {
    return activity.replaceAll("_", " ");
}
function buildWorldActionFeedback(result) {
    const zoneMeta = result.previousZoneId !== result.zoneId ? `${result.previousZoneId} -> ${result.zoneId}` : result.zoneId;
    return {
        title: "World action recorded",
        body: result.summary,
        meta: `${activityMeta(result.activity)} · ${zoneMeta}`,
        petId: result.petId,
        zoneId: result.zoneId
    };
}
function buildProjectedRouteConsequence(input) {
    if (input.disabledReason) {
        return `${input.actorName} is on ${input.routeLabel} toward ${input.targetLabel}. ${input.disabledReason}`;
    }
    return `${input.commandLabel} will turn ${input.routeLabel} into a world action involving ${input.targetLabel}.`;
}
function WorldActionFeedback({ feedback, onClear, onSelectPet }) {
    if (!feedback) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-[24px] border border-lime-300/18 bg-lime-300/[0.07] p-4 shadow-[0_18px_50px_rgba(26,46,5,0.22)]",
        "data-testid": "world-action-feedback",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        "aria-hidden": "true",
                                        className: "h-4 w-4 text-lime-100/76"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-action-feedback.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-white",
                                        children: feedback.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-action-feedback.tsx",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45",
                                        children: feedback.meta
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-action-feedback.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-action-feedback.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 break-words text-sm leading-6 text-white/72",
                                children: feedback.body
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-action-feedback.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-action-feedback.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": "Dismiss world action feedback",
                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition-colors hover:bg-white/10 hover:text-white",
                        onClick: onClear,
                        type: "button",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            "aria-hidden": "true",
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/components/garden/world-action-feedback.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/garden/world-action-feedback.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/world-action-feedback.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            onSelectPet ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    className: "h-9 px-3 text-[11px] tracking-[0.12em]",
                    onClick: ()=>onSelectPet(feedback.petId),
                    type: "button",
                    variant: "ghost",
                    children: "Focus pet"
                }, void 0, false, {
                    fileName: "[project]/components/garden/world-action-feedback.tsx",
                    lineNumber: 102,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/garden/world-action-feedback.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/world-action-feedback.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/autonomy-route-panel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AutonomyRoutePanel",
    ()=>AutonomyRoutePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crosshair$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crosshair$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crosshair.js [app-ssr] (ecmascript) <export default as Crosshair>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$footprints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Footprints$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/footprints.js [app-ssr] (ecmascript) <export default as Footprints>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-ssr] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$route$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/autonomy-route-actions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$action$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-action-feedback.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function petName(pets, petId) {
    return petId ? pets.find((pet)=>pet.pet.id === petId)?.pet.name : undefined;
}
function AutonomyRoutePanel({ overlay, pets, viewer, onClear, onActionComplete, onRefresh, onSelectPet }) {
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const action = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$route$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildAutonomyRouteAction"])(overlay, pets, viewer);
    const targetPetName = petName(pets, overlay.targetPetId);
    const projectedConsequence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$action$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildProjectedRouteConsequence"])({
        actorName: overlay.actorName,
        commandLabel: action.label,
        disabledReason: action.disabledReason,
        routeLabel: overlay.routeLabel,
        targetLabel: targetPetName ?? overlay.targetLabel
    });
    async function runAction() {
        if (!action.actorPetId || !action.command) {
            setError(action.disabledReason ?? "这条路线现在不能操作。");
            return;
        }
        try {
            setError(null);
            setPending(true);
            const response = await fetch(`/api/pets/${encodeURIComponent(action.actorPetId)}/actions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    command: action.command
                })
            });
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "路线互动失败。");
            onActionComplete?.(result);
            onSelectPet(action.actorPetId);
            onRefresh();
        } catch (routeError) {
            setError(routeError instanceof Error ? routeError.message : "路线互动失败。");
        } finally{
            setPending(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-[24px] border border-amber-300/16 bg-amber-300/[0.055] p-4 shadow-[0_18px_50px_rgba(69,26,3,0.2)]",
        "data-testid": "autonomy-route-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__["Route"], {
                                        "aria-hidden": "true",
                                        className: "h-4 w-4 text-amber-100/72"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "break-words text-sm font-semibold text-white",
                                        children: overlay.routeLabel
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45",
                                        children: overlay.targetKind
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 break-words text-sm leading-6 text-white/66",
                                children: overlay.reason
                            }, void 0, false, {
                                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": "Close route panel",
                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition-colors hover:bg-white/10 hover:text-white",
                        onClick: onClear,
                        type: "button",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            "aria-hidden": "true",
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex flex-wrap gap-2 text-xs text-white/58",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 transition-colors hover:border-amber-200/35 hover:text-white",
                        onClick: ()=>onSelectPet(overlay.actorPetId),
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crosshair$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crosshair$3e$__["Crosshair"], {
                                "aria-hidden": "true",
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            "Focus ",
                            overlay.actorName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    overlay.targetPetId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 transition-colors hover:border-amber-200/35 hover:text-white",
                        onClick: ()=>onSelectPet(overlay.targetPetId),
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                "aria-hidden": "true",
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this),
                            "Locate ",
                            targetPetName ?? overlay.targetLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                "aria-hidden": "true",
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this),
                            overlay.targetLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex flex-wrap items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        className: "h-9 gap-2 px-3 text-[11px] tracking-[0.12em]",
                        disabled: pending || Boolean(action.disabledReason),
                        onClick: runAction,
                        type: "button",
                        variant: "secondary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$footprints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Footprints$3e$__["Footprints"], {
                                "aria-hidden": "true",
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            pending ? "Acting..." : action.label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    action.disabledReason ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs leading-5 text-white/42",
                        children: action.disabledReason
                    }, void 0, false, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 139,
                        columnNumber: 34
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3",
                "data-testid": "route-consequence-preview",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] uppercase tracking-[0.18em] text-white/36",
                        children: "Projected consequence"
                    }, void 0, false, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm leading-6 text-white/68",
                        children: projectedConsequence
                    }, void 0, false, {
                        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/garden/autonomy-route-panel.tsx",
                lineNumber: 147,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/autonomy-route-panel.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/autonomy-roster.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AutonomyRoster",
    ()=>AutonomyRoster,
    "buildAutonomyRosterItems",
    ()=>buildAutonomyRosterItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-ssr] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pinned.js [app-ssr] (ecmascript) <export default as MapPinned>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paw$2d$print$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PawPrint$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/paw-print.js [app-ssr] (ecmascript) <export default as PawPrint>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-ssr] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const DEFAULT_LIMIT = 8;
const toneStyles = {
    social: "border-cyan-300/24 bg-cyan-300/[0.08] text-cyan-50",
    conflict: "border-rose-300/28 bg-rose-300/[0.08] text-rose-50",
    rest: "border-violet-300/22 bg-violet-300/[0.08] text-violet-50",
    care: "border-lime-300/24 bg-lime-300/[0.08] text-lime-50",
    explore: "border-amber-300/22 bg-amber-300/[0.08] text-amber-50",
    neutral: "border-white/10 bg-white/[0.045] text-white/72"
};
const urgencyStyles = {
    "needs intervention": "border-lime-300/26 bg-lime-300/[0.08] text-lime-50",
    "active thread": "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-50",
    "ambient intent": "border-amber-300/18 bg-amber-300/[0.07] text-amber-50",
    steady: "border-white/10 bg-white/[0.04] text-white/52"
};
const toneIcons = {
    social: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
    conflict: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
    rest: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
    care: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
    explore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__["MapPinned"],
    neutral: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paw$2d$print$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PawPrint$3e$__["PawPrint"]
};
function highestActiveGoal(pet) {
    return [
        ...pet.currentGoals
    ].filter((goal)=>goal.status === "active" || goal.status === "paused").sort((left, right)=>right.priority - left.priority)[0];
}
function pressureSignals(pet) {
    const signals = [
        {
            label: "hunger",
            value: Math.max(0, pet.state.hunger - 68)
        },
        {
            label: "stress",
            value: Math.max(0, pet.state.stress - 64)
        },
        {
            label: "energy",
            value: Math.max(0, 34 - pet.state.energy)
        },
        {
            label: "hygiene",
            value: Math.max(0, 42 - pet.state.hygiene)
        },
        {
            label: "bladder",
            value: Math.max(0, pet.state.bladder - 72)
        },
        {
            label: "social",
            value: Math.max(0, 36 - pet.state.social)
        }
    ].filter((signal)=>signal.value > 0);
    return signals.sort((left, right)=>right.value - left.value);
}
function urgencyLabel(urgency) {
    if (urgency >= 60) {
        return "needs intervention";
    }
    if (urgency >= 34) {
        return "active thread";
    }
    if (urgency > 0) {
        return "ambient intent";
    }
    return "steady";
}
function targetName(petsById, petId) {
    return petId ? petsById.get(petId)?.pet.name : undefined;
}
function objectLabel(objectId) {
    return objectId?.replace(/^object-/, "").replaceAll("-", " ");
}
function targetLabelFor(pet, primaryGoal, petsById) {
    const decision = pet.state.lastAutonomyDecision;
    const decisionTargetPet = targetName(petsById, decision?.targetPetId);
    if (decisionTargetPet) {
        return `toward ${decisionTargetPet}`;
    }
    const decisionObject = objectLabel(decision?.targetObjectId);
    if (decisionObject) {
        return `toward ${decisionObject}`;
    }
    const goalTargetPet = targetName(petsById, primaryGoal?.targetPetId);
    if (goalTargetPet) {
        return `tracking ${goalTargetPet}`;
    }
    const goalObject = objectLabel(primaryGoal?.targetObjectId);
    if (goalObject) {
        return `tracking ${goalObject}`;
    }
    return `tile ${pet.state.tileX},${pet.state.tileY}`;
}
function routeLabelFor(pet, primaryGoal) {
    if (primaryGoal?.targetZoneId && primaryGoal.targetZoneId !== pet.state.zoneId) {
        return `route to ${primaryGoal.targetZoneId}`;
    }
    if (pet.state.lastKnownZonePreference && pet.state.lastKnownZonePreference !== pet.state.zoneId) {
        return `prefers ${pet.state.lastKnownZonePreference}`;
    }
    return null;
}
function buildAutonomyRosterItems(pets, limit = DEFAULT_LIMIT) {
    const petsById = new Map(pets.map((pet)=>[
            pet.pet.id,
            pet
        ]));
    return pets.map((pet)=>{
        const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIntentSummary"])(pet);
        const primaryGoal = highestActiveGoal(pet);
        const signals = pressureSignals(pet);
        const pressure = signals.reduce((sum, signal)=>sum + signal.value, 0);
        const goalBoost = primaryGoal ? Math.round(primaryGoal.priority * 0.18) : 0;
        const sourceBoost = pet.state.lastAutonomyDecision?.source === "llm" ? 5 : 0;
        const toneBoost = intent.tone === "conflict" ? 12 : intent.tone === "care" ? 8 : 0;
        const urgency = Math.round(pressure + goalBoost + sourceBoost + toneBoost);
        const tone = pressure >= 34 ? "care" : intent.tone;
        return {
            petId: pet.pet.id,
            name: pet.pet.name,
            ownerHandle: pet.owner.handle,
            spritePath: pet.generation.worldSpritePath,
            mood: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moodLabel"])(pet.state.mood),
            activity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityLabel"])(pet.state.activity),
            goalLabel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["goalLabel"])(pet.state.lastAutonomyDecision?.goal ?? primaryGoal?.goalType),
            reason: intent.reason,
            source: intent.source,
            tone,
            urgency,
            urgencyLabel: urgencyLabel(urgency),
            targetLabel: targetLabelFor(pet, primaryGoal, petsById),
            routeLabel: routeLabelFor(pet, primaryGoal),
            positionLabel: `${pet.state.zoneId} · ${pet.state.tileX},${pet.state.tileY}`,
            decidedAt: pet.state.lastAutonomyDecision?.decidedAt ?? pet.state.lastSimulatedAt,
            pressureLabel: signals[0] ? signals.slice(0, 2).map((signal)=>signal.label).join(" / ") : null
        };
    }).sort((left, right)=>{
        if (right.urgency !== left.urgency) {
            return right.urgency - left.urgency;
        }
        return left.name.localeCompare(right.name);
    }).slice(0, limit);
}
function AutonomyRoster({ pets, selectedPetId, onSelectPet, limit = DEFAULT_LIMIT }) {
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildAutonomyRosterItems(pets, limit), [
        limit,
        pets
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        "data-testid": "autonomy-roster",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] uppercase tracking-[0.22em] text-white/38",
                                children: "Autonomy Roster"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mt-1 text-xl font-semibold text-white",
                                children: "Visible life"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/45",
                        children: [
                            items.length,
                            " tracked"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/autonomy-roster.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white/52",
                children: "No public pets are visible in this zone yet."
            }, void 0, false, {
                fileName: "[project]/components/garden/autonomy-roster.tsx",
                lineNumber: 223,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2",
                children: items.map((item)=>{
                    const selected = selectedPetId === item.petId;
                    const Icon = toneIcons[item.tone];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-pressed": selected,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("group w-full rounded-[20px] border p-3 text-left transition-[transform,border-color,background-color,box-shadow]", toneStyles[item.tone], selected ? "scale-[1.01] shadow-[0_0_0_1px_rgba(255,255,255,0.24)]" : "hover:scale-[1.01] hover:border-white/22"),
                        "data-testid": "autonomy-roster-item",
                        onClick: ()=>onSelectPet(item.petId),
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-black/24",
                                        children: item.spritePath ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            alt: "",
                                            className: "h-10 w-10 object-contain [image-rendering:pixelated]",
                                            src: item.spritePath
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/autonomy-roster.tsx",
                                            lineNumber: 250,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paw$2d$print$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PawPrint$3e$__["PawPrint"], {
                                            "aria-hidden": "true",
                                            className: "h-5 w-5 opacity-70"
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/autonomy-roster.tsx",
                                            lineNumber: 256,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 248,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex min-w-0 items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate font-semibold text-white",
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("shrink-0 rounded-full border px-2 py-1 text-[9px] uppercase tracking-[0.14em]", urgencyStyles[item.urgencyLabel]),
                                                        children: item.urgencyLabel
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                                        lineNumber: 262,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                                lineNumber: 260,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 truncate text-xs text-white/48",
                                                children: [
                                                    "@",
                                                    item.ownerHandle,
                                                    " · ",
                                                    item.mood,
                                                    " · ",
                                                    item.activity
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                                lineNumber: 266,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 259,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                lineNumber: 247,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 rounded-[16px] border border-black/10 bg-black/18 px-3 py-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                "aria-hidden": "true",
                                                className: "h-4 w-4 shrink-0 opacity-76"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                                lineNumber: 274,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "min-w-0 truncate text-sm font-semibold text-white",
                                                children: item.goalLabel
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                                lineNumber: 275,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 273,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 line-clamp-2 text-xs leading-5 text-white/64",
                                        children: item.reason
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 277,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                lineNumber: 272,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/45",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1 rounded-full border border-white/8 bg-black/16 px-2 py-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__["MapPinned"], {
                                                "aria-hidden": "true",
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                                lineNumber: 282,
                                                columnNumber: 21
                                            }, this),
                                            item.targetLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 281,
                                        columnNumber: 19
                                    }, this),
                                    item.routeLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1 rounded-full border border-white/8 bg-black/16 px-2 py-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__["Route"], {
                                                "aria-hidden": "true",
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                                lineNumber: 287,
                                                columnNumber: 23
                                            }, this),
                                            item.routeLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 286,
                                        columnNumber: 21
                                    }, this) : null,
                                    item.pressureLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.pressureLabel
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 291,
                                        columnNumber: 41
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.source
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 292,
                                        columnNumber: 19
                                    }, this),
                                    item.decidedAt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        suppressHydrationWarning: true,
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRelativeTime"])(item.decidedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                                        lineNumber: 294,
                                        columnNumber: 21
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/autonomy-roster.tsx",
                                lineNumber: 280,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.petId, true, {
                        fileName: "[project]/components/garden/autonomy-roster.tsx",
                        lineNumber: 233,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/garden/autonomy-roster.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/autonomy-roster.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/encounter-context-actions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findEncounterActorPet",
    ()=>findEncounterActorPet,
    "getEncounterWorldActionDisabledReason",
    ()=>getEncounterWorldActionDisabledReason
]);
function findEncounterActorPet(encounter, pets, viewer) {
    if (!viewer) {
        return null;
    }
    const participantIds = new Set(encounter.participantPetIds);
    return pets.find((entry)=>entry.pet.ownerId === viewer.id && entry.state.zoneId === encounter.zoneId && !participantIds.has(entry.pet.id)) ?? null;
}
function getEncounterWorldActionDisabledReason(input) {
    if (!input.viewer) {
        return "Enter Garden to record world actions.";
    }
    if (!input.encounter.threadId) {
        return "This encounter is not stable yet.";
    }
    if (input.action === "approach" && !findEncounterActorPet(input.encounter, input.pets, input.viewer)) {
        return "Bring one of your pets into this zone to approach.";
    }
    return null;
}
}),
"[project]/components/garden/encounter-context-panel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EncounterContextPanel",
    ()=>EncounterContextPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$footprints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Footprints$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/footprints.js [app-ssr] (ecmascript) <export default as Footprints>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$context$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/encounter-context-actions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/encounter-thread-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const actionIcons = {
    observe: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
    approach: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$footprints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Footprints$3e$__["Footprints"]
};
const worldActions = [
    "observe",
    "approach"
];
function participantsFor(encounter, pets) {
    const participantIds = new Set(encounter.participantPetIds);
    return pets.filter((entry)=>participantIds.has(entry.pet.id));
}
function EncounterContextPanel({ encounter, pets, viewer, onClear, onRefresh, onSelectPet }) {
    const [pendingAction, setPendingAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const participants = participantsFor(encounter, pets);
    const lastWorldAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatEncounterWorldAction"])(encounter);
    const actorPet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$context$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findEncounterActorPet"])(encounter, pets, viewer);
    const firstDisabledReason = worldActions.map((action)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$context$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getEncounterWorldActionDisabledReason"])({
            action,
            encounter,
            pets,
            viewer
        })).find(Boolean);
    async function runWorldAction(action) {
        if (!encounter.threadId) {
            setError("这个事件还没有稳定线程。");
            return;
        }
        try {
            setError(null);
            setPendingAction(action);
            const response = await fetch(`/api/garden/encounters/${encodeURIComponent(encounter.threadId)}/actions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "事件互动失败。");
            onRefresh();
        } catch (actionError) {
            setError(actionError instanceof Error ? actionError.message : "事件互动失败。");
        } finally{
            setPendingAction(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-[24px] border border-cyan-300/14 bg-cyan-300/[0.045] p-4 shadow-[0_18px_50px_rgba(8,47,73,0.22)]",
        "data-testid": "encounter-context-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "break-words text-sm font-semibold text-white",
                                        children: encounter.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/encounter-context-panel.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45",
                                        children: encounter.stage
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/encounter-context-panel.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatEncounterStatus"])(encounter)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/encounter-context-panel.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 break-words text-sm leading-6 text-white/66",
                                children: encounter.summary
                            }, void 0, false, {
                                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            lastWorldAction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs text-cyan-100/55",
                                children: lastWorldAction
                            }, void 0, false, {
                                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                                lineNumber: 108,
                                columnNumber: 30
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/encounter-context-panel.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": "Close encounter panel",
                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition-colors hover:bg-white/10 hover:text-white",
                        onClick: onClear,
                        type: "button",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            "aria-hidden": "true",
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/components/garden/encounter-context-panel.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/garden/encounter-context-panel.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            participants.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex flex-wrap gap-2",
                children: participants.map((participant)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 py-1 pl-1 pr-3 text-xs text-white/72 transition-colors hover:border-cyan-300/30 hover:text-white",
                        onClick: ()=>onSelectPet(participant.pet.id),
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                alt: participant.pet.name,
                                className: "h-7 w-7 rounded-full bg-black/30 object-contain p-0.5 [image-rendering:pixelated]",
                                src: participant.generation.worldSpritePath
                            }, void 0, false, {
                                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this),
                            participant.pet.name
                        ]
                    }, participant.pet.id, true, {
                        fileName: "[project]/components/garden/encounter-context-panel.tsx",
                        lineNumber: 123,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                lineNumber: 121,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex flex-wrap gap-2",
                children: worldActions.map((action)=>{
                    const Icon = actionIcons[action];
                    const disabledReason = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$context$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getEncounterWorldActionDisabledReason"])({
                        action,
                        encounter,
                        pets,
                        viewer
                    });
                    const disabled = Boolean(disabledReason) || pendingAction !== null;
                    const label = action === "approach" && actorPet ? `Approach with ${actorPet.pet.name}` : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$thread$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encounterWorldActionLabels"][action];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        className: "h-9 gap-2 px-3 text-[11px] tracking-[0.12em]",
                        disabled: disabled,
                        onClick: ()=>runWorldAction(action),
                        type: "button",
                        variant: action === "observe" ? "secondary" : "ghost",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                "aria-hidden": "true",
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                                lineNumber: 164,
                                columnNumber: 15
                            }, this),
                            pendingAction === action ? "Writing..." : label
                        ]
                    }, action, true, {
                        fileName: "[project]/components/garden/encounter-context-panel.tsx",
                        lineNumber: 156,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            firstDisabledReason ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 text-xs leading-5 text-white/42",
                children: firstDisabledReason
            }, void 0, false, {
                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                lineNumber: 171,
                columnNumber: 30
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/garden/encounter-context-panel.tsx",
                lineNumber: 172,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/encounter-context-panel.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/use-player-controls.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePlayerKeyboard",
    ()=>usePlayerKeyboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const MOVEMENT_KEYS = new Map([
    [
        "arrowup",
        "up"
    ],
    [
        "arrowdown",
        "down"
    ],
    [
        "arrowleft",
        "left"
    ],
    [
        "arrowright",
        "right"
    ],
    [
        "w",
        "up"
    ],
    [
        "s",
        "down"
    ],
    [
        "a",
        "left"
    ],
    [
        "d",
        "right"
    ]
]);
function isTypingTarget(target) {
    if (!(target instanceof HTMLElement)) {
        return false;
    }
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target.isContentEditable;
}
function usePlayerKeyboard(enabled) {
    const controlsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        up: false,
        down: false,
        left: false,
        right: false,
        sprint: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) {
            return;
        }
        const setKey = (event, pressed)=>{
            if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) {
                return;
            }
            const key = event.key.toLowerCase();
            if (key === "shift") {
                controlsRef.current.sprint = pressed;
                return;
            }
            const control = MOVEMENT_KEYS.get(key);
            if (!control) {
                return;
            }
            controlsRef.current[control] = pressed;
            event.preventDefault();
        };
        const handleKeyDown = (event)=>setKey(event, true);
        const handleKeyUp = (event)=>setKey(event, false);
        const releaseAll = ()=>{
            controlsRef.current.up = false;
            controlsRef.current.down = false;
            controlsRef.current.left = false;
            controlsRef.current.right = false;
            controlsRef.current.sprint = false;
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("blur", releaseAll);
        return ()=>{
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("blur", releaseAll);
            releaseAll();
        };
    }, [
        enabled
    ]);
    return controlsRef;
}
}),
"[project]/lib/rendering/pet-sprite-frames.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPetFrameUrls",
    ()=>buildPetFrameUrls,
    "frameBucketForActivity",
    ()=>frameBucketForActivity,
    "frameDurationMs",
    ()=>frameDurationMs
]);
function numericAttr(node, name) {
    return Number(node.getAttribute(name) ?? "0");
}
function setNumericAttr(node, name, value) {
    node.setAttribute(name, `${Math.round(value)}`);
}
function moveRect(node, dx = 0, dy = 0) {
    setNumericAttr(node, "x", numericAttr(node, "x") + dx);
    setNumericAttr(node, "y", numericAttr(node, "y") + dy);
}
function resizeRect(node, dw = 0, dh = 0) {
    setNumericAttr(node, "width", Math.max(1, numericAttr(node, "width") + dw));
    setNumericAttr(node, "height", Math.max(1, numericAttr(node, "height") + dh));
}
function mutateCatRect(node, variant) {
    const x = numericAttr(node, "x");
    const y = numericAttr(node, "y");
    const width = numericAttr(node, "width");
    const isTail = x <= 18 && y <= 50;
    const isHead = x >= 54 && y <= 56;
    const isEar = x >= 56 && y <= 32;
    const isLeg = y >= 64 && x >= 22 && x <= 50;
    const isFrontLeg = isLeg && x >= 40;
    const isBackLeg = isLeg && x < 40;
    const isBody = x >= 20 && x <= 56 && y >= 44 && y <= 68 && width >= 8;
    switch(variant){
        case "rest-b":
            if (isTail) {
                moveRect(node, -1, -1);
            }
            if (isHead || isEar) {
                moveRect(node, 0, -1);
            }
            return;
        case "walk-a":
            if (isBackLeg) {
                moveRect(node, -1, -2);
            }
            if (isFrontLeg) {
                moveRect(node, 1, 1);
            }
            if (isTail) {
                moveRect(node, -1, -1);
            }
            if (isHead || isEar) {
                moveRect(node, 0, -1);
            }
            return;
        case "walk-b":
            if (isBackLeg) {
                moveRect(node, 1, 1);
            }
            if (isFrontLeg) {
                moveRect(node, -1, -2);
            }
            if (isTail) {
                moveRect(node, 1, 0);
            }
            return;
        case "walk-c":
            if (isTail) {
                moveRect(node, 0, -2);
            }
            if (isLeg) {
                moveRect(node, 0, -1);
            }
            return;
        case "run-a":
            if (isBackLeg) {
                moveRect(node, -2, -3);
            }
            if (isFrontLeg) {
                moveRect(node, 2, 2);
            }
            if (isTail) {
                moveRect(node, -2, -2);
                resizeRect(node, 1, 0);
            }
            if (isHead || isEar) {
                moveRect(node, 1, -1);
            }
            if (isBody) {
                moveRect(node, 1, 0);
            }
            return;
        case "run-b":
            if (isBackLeg) {
                moveRect(node, 2, 2);
            }
            if (isFrontLeg) {
                moveRect(node, -2, -3);
            }
            if (isTail) {
                moveRect(node, 2, -1);
            }
            if (isHead || isEar) {
                moveRect(node, -1, -1);
            }
            if (isBody) {
                moveRect(node, -1, 0);
            }
            return;
        case "sleep-a":
            if (isBody) {
                moveRect(node, 0, 5);
                resizeRect(node, 0, -2);
            }
            if (isHead || isEar) {
                moveRect(node, -5, 10);
            }
            if (isLeg) {
                moveRect(node, -3, 8);
                resizeRect(node, 2, -4);
            }
            if (isTail) {
                moveRect(node, 5, 8);
            }
            return;
        case "sleep-b":
            if (isBody) {
                moveRect(node, 1, 6);
                resizeRect(node, 0, -3);
            }
            if (isHead || isEar) {
                moveRect(node, -4, 11);
            }
            if (isLeg) {
                moveRect(node, -2, 9);
                resizeRect(node, 1, -5);
            }
            if (isTail) {
                moveRect(node, 4, 9);
            }
            return;
        default:
            return;
    }
}
function mutateDogRect(node, variant) {
    const x = numericAttr(node, "x");
    const y = numericAttr(node, "y");
    const width = numericAttr(node, "width");
    const isTail = x <= 20 && y <= 54;
    const isHead = x >= 54 && y <= 58;
    const isEar = x >= 58 && y <= 34;
    const isLeg = y >= 62 && x >= 20 && x <= 56;
    const isFrontLeg = isLeg && x >= 38;
    const isBackLeg = isLeg && x < 38;
    const isBody = x >= 18 && x <= 58 && y >= 46 && y <= 66 && width >= 6;
    switch(variant){
        case "rest-b":
            if (isTail) {
                moveRect(node, -1, -1);
            }
            if (isHead || isEar) {
                moveRect(node, 0, -1);
            }
            return;
        case "walk-a":
            if (isBackLeg) {
                moveRect(node, -1, -2);
            }
            if (isFrontLeg) {
                moveRect(node, 1, 1);
            }
            if (isTail) {
                moveRect(node, -1, -1);
            }
            return;
        case "walk-b":
            if (isBackLeg) {
                moveRect(node, 1, 1);
            }
            if (isFrontLeg) {
                moveRect(node, -1, -2);
            }
            if (isTail) {
                moveRect(node, 1, -1);
            }
            if (isHead) {
                moveRect(node, 0, -1);
            }
            return;
        case "walk-c":
            if (isTail) {
                moveRect(node, 0, -2);
            }
            if (isBody) {
                moveRect(node, 0, -1);
            }
            return;
        case "run-a":
            if (isBackLeg) {
                moveRect(node, -2, -3);
            }
            if (isFrontLeg) {
                moveRect(node, 2, 2);
            }
            if (isTail) {
                moveRect(node, -2, -2);
            }
            if (isHead || isEar) {
                moveRect(node, 1, -1);
            }
            if (isBody) {
                moveRect(node, 1, 0);
            }
            return;
        case "run-b":
            if (isBackLeg) {
                moveRect(node, 2, 2);
            }
            if (isFrontLeg) {
                moveRect(node, -2, -3);
            }
            if (isTail) {
                moveRect(node, 2, -1);
            }
            if (isHead || isEar) {
                moveRect(node, -1, -1);
            }
            if (isBody) {
                moveRect(node, -1, 0);
            }
            return;
        case "sleep-a":
            if (isBody) {
                moveRect(node, 0, 5);
                resizeRect(node, 0, -3);
            }
            if (isHead || isEar) {
                moveRect(node, -6, 11);
            }
            if (isLeg) {
                moveRect(node, -3, 8);
                resizeRect(node, 1, -6);
            }
            if (isTail) {
                moveRect(node, 5, 8);
            }
            return;
        case "sleep-b":
            if (isBody) {
                moveRect(node, 1, 6);
                resizeRect(node, 0, -4);
            }
            if (isHead || isEar) {
                moveRect(node, -5, 12);
            }
            if (isLeg) {
                moveRect(node, -2, 9);
                resizeRect(node, 1, -7);
            }
            if (isTail) {
                moveRect(node, 4, 9);
            }
            return;
        default:
            return;
    }
}
function mutateSvgFrame(svgText, species, variant) {
    const document = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const rects = [
        ...document.querySelectorAll("rect")
    ];
    const ellipses = [
        ...document.querySelectorAll("ellipse")
    ];
    rects.forEach((rect)=>{
        if (species === "cat") {
            mutateCatRect(rect, variant);
            return;
        }
        mutateDogRect(rect, variant);
    });
    ellipses.forEach((ellipse)=>{
        const cy = numericAttr(ellipse, "cy");
        if (cy >= 78) {
            if (variant === "run-a" || variant === "run-b") {
                setNumericAttr(ellipse, "cx", numericAttr(ellipse, "cx") + (variant === "run-a" ? 2 : -2));
            }
            if (variant === "sleep-a" || variant === "sleep-b") {
                setNumericAttr(ellipse, "rx", numericAttr(ellipse, "rx") + 4);
                setNumericAttr(ellipse, "ry", Math.max(3, numericAttr(ellipse, "ry") - 2));
            }
        }
    });
    return new XMLSerializer().serializeToString(document);
}
function toFrameUrl(svgText) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
}
function buildPetFrameUrls(svgText, species) {
    return {
        rest: [
            toFrameUrl(mutateSvgFrame(svgText, species, "rest-a")),
            toFrameUrl(mutateSvgFrame(svgText, species, "rest-b"))
        ],
        amble: [
            toFrameUrl(mutateSvgFrame(svgText, species, "walk-a")),
            toFrameUrl(mutateSvgFrame(svgText, species, "walk-b")),
            toFrameUrl(mutateSvgFrame(svgText, species, "walk-c"))
        ],
        trot: [
            toFrameUrl(mutateSvgFrame(svgText, species, "walk-a")),
            toFrameUrl(mutateSvgFrame(svgText, species, "walk-c")),
            toFrameUrl(mutateSvgFrame(svgText, species, "walk-b"))
        ],
        sprint: [
            toFrameUrl(mutateSvgFrame(svgText, species, "run-a")),
            toFrameUrl(mutateSvgFrame(svgText, species, "walk-c")),
            toFrameUrl(mutateSvgFrame(svgText, species, "run-b")),
            toFrameUrl(mutateSvgFrame(svgText, species, "walk-b"))
        ],
        sleep: [
            toFrameUrl(mutateSvgFrame(svgText, species, "sleep-a")),
            toFrameUrl(mutateSvgFrame(svgText, species, "sleep-b"))
        ]
    };
}
function frameBucketForActivity(activity) {
    switch(activity){
        case "sleep":
        case "sunbathe":
            return "sleep";
        case "chase":
            return "sprint";
        case "play":
        case "dig":
        case "scuffle":
        case "approach_pet":
            return "trot";
        case "wander":
        case "move_to_zone":
        case "seek_owner":
        case "climb_tree":
            return "amble";
        default:
            return "rest";
    }
}
function frameDurationMs(activity) {
    switch(activity){
        case "chase":
            return 120;
        case "play":
        case "dig":
        case "scuffle":
        case "approach_pet":
            return 170;
        case "wander":
        case "move_to_zone":
        case "seek_owner":
        case "climb_tree":
            return 260;
        case "sleep":
        case "sunbathe":
            return 760;
        default:
            return 460;
    }
}
}),
"[project]/components/garden/use-zone-asset-warmup.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useZoneAssetWarmup",
    ()=>useZoneAssetWarmup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$prefetch$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/prefetch.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$pet$2d$sprite$2d$frames$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rendering/pet-sprite-frames.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const backgroundScenePath = {
    orchard: "/garden/scene-orchard.svg",
    pond: "/garden/scene-pond.svg",
    grove: "/garden/scene-grove.svg",
    "dog-run": "/garden/scene-dog-run.svg"
};
const orderedZones = [
    "orchard",
    "grove",
    "pond",
    "dog-run"
];
function nearbyZones(zoneId) {
    const index = orderedZones.indexOf(zoneId);
    if (index === -1) {
        return [
            zoneId
        ];
    }
    return [
        zoneId,
        orderedZones[(index + 1) % orderedZones.length],
        orderedZones[(index - 1 + orderedZones.length) % orderedZones.length]
    ];
}
function warmImage(src) {
    return new Promise((resolve)=>{
        const image = new Image();
        image.onload = ()=>resolve();
        image.onerror = ()=>resolve();
        image.src = src;
    });
}
async function warmPetFrames(spritePath, species) {
    const response = await fetch(spritePath, {
        cache: "force-cache"
    });
    const svgText = await response.text();
    const frameUrls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$pet$2d$sprite$2d$frames$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildPetFrameUrls"])(svgText, species);
    const warmTargets = [
        ...frameUrls.rest.slice(0, 2),
        ...frameUrls.amble.slice(0, 2),
        ...frameUrls.trot.slice(0, 1)
    ];
    await Promise.all(warmTargets.map((src)=>warmImage(src)));
}
function useZoneAssetWarmup(zoneId, pets) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        for (const candidateZoneId of nearbyZones(zoneId)){
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$prefetch$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["schedulePrefetch"])({
                key: `garden-background:${candidateZoneId}`,
                priority: candidateZoneId === zoneId ? "visible" : "idle",
                run: ()=>warmImage(backgroundScenePath[candidateZoneId])
            });
        }
        for (const pet of pets.slice(0, 4)){
            const spritePath = pet.generation.worldSpritePath;
            if (!spritePath) {
                continue;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$prefetch$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["schedulePrefetch"])({
                key: `garden-pet-frames:${pet.pet.species}:${spritePath}`,
                priority: "idle",
                run: ()=>warmPetFrames(spritePath, pet.pet.species)
            });
        }
    }, [
        pets,
        zoneId
    ]);
}
}),
"[project]/components/garden/world-transition-markers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildWorldTransitionMarkers",
    ()=>buildWorldTransitionMarkers
]);
function markerOffset(index) {
    const row = Math.floor(index / 3);
    switch(index % 3){
        case 1:
            return {
                offsetX: 48,
                offsetY: -10 - row * 24
            };
        case 2:
            return {
                offsetX: -48,
                offsetY: -10 - row * 24
            };
        default:
            return {
                offsetX: 0,
                offsetY: -18 - row * 24
            };
    }
}
function buildWorldTransitionMarkers(snapshot) {
    const petsById = new Map(snapshot.pets.map((pet)=>[
            pet.pet.id,
            pet
        ]));
    const seenPetIds = new Set();
    const tileCounts = new Map();
    return snapshot.recentEvents.filter((event)=>event.type === "zone_move" && event.zoneId === snapshot.zone.id && !event.hidden).sort((left, right)=>new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()).map((event)=>{
        const pet = petsById.get(event.petId);
        if (!pet || seenPetIds.has(pet.pet.id)) {
            return null;
        }
        seenPetIds.add(pet.pet.id);
        const tileKey = `${pet.state.tileX}:${pet.state.tileY}`;
        const tileIndex = tileCounts.get(tileKey) ?? 0;
        tileCounts.set(tileKey, tileIndex + 1);
        const offset = markerOffset(tileIndex);
        return {
            id: `transition:${event.id}`,
            eventId: event.id,
            petId: pet.pet.id,
            petName: pet.pet.name,
            zoneId: snapshot.zone.id,
            tileX: pet.state.tileX,
            tileY: pet.state.tileY,
            offsetX: offset.offsetX,
            offsetY: offset.offsetY,
            title: `${pet.pet.name} 到达${snapshot.zone.name}`,
            summary: event.body
        };
    }).filter((marker)=>marker !== null);
}
}),
"[project]/lib/domain/terrain.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildTerrainMap",
    ()=>buildTerrainMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain/world.ts [app-ssr] (ecmascript)");
;
function rectTiles(type, left, top, right, bottom) {
    const tiles = [];
    for(let y = top; y <= bottom; y += 1){
        for(let x = left; x <= right; x += 1){
            tiles.push({
                x,
                y,
                type
            });
        }
    }
    return tiles;
}
function ellipseTiles(type, centerX, centerY, radiusX, radiusY) {
    const tiles = [];
    for(let y = centerY - radiusY; y <= centerY + radiusY; y += 1){
        for(let x = centerX - radiusX; x <= centerX + radiusX; x += 1){
            const dx = (x - centerX) / radiusX;
            const dy = (y - centerY) / radiusY;
            if (dx * dx + dy * dy <= 1) {
                tiles.push({
                    x,
                    y,
                    type
                });
            }
        }
    }
    return tiles;
}
function everyOtherFlower(left, top, right, bottom) {
    return rectTiles("flower_grass", left, top, right, bottom).filter((tile)=>(tile.x + tile.y) % 3 === 0);
}
function everyOtherBush(left, top, right, bottom) {
    return rectTiles("bush_grass", left, top, right, bottom).filter((tile)=>(tile.x * 2 + tile.y) % 4 === 0);
}
function buildTerrainMap(zoneId) {
    const maxX = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"] - 1;
    const maxY = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_ROWS"] - 1;
    const tiles = rectTiles("grass", 0, 0, maxX, maxY);
    const structures = [];
    if (zoneId === "orchard") {
        tiles.push(...everyOtherFlower(4, 24, 12, 36));
        tiles.push(...everyOtherFlower(30, 24, 42, 37));
        tiles.push(...everyOtherFlower(18, 34, 29, 42));
        tiles.push(...rectTiles("dirt_path", 10, 28, 37, 31));
        tiles.push(...everyOtherBush(5, 12, 10, 18));
        tiles.push(...everyOtherBush(36, 12, 42, 18));
        tiles.push(...everyOtherBush(19, 8, 27, 11));
        structures.push({
            id: "orchard-cat-tree-left",
            x: 8,
            y: 14,
            kind: "cat_tree"
        }, {
            id: "orchard-cat-tree-right",
            x: 38,
            y: 14,
            kind: "cat_tree"
        }, {
            id: "orchard-bench",
            x: 33,
            y: 23,
            kind: "bench"
        }, {
            id: "orchard-dog-house",
            x: 11,
            y: 33,
            kind: "dog_house"
        }, {
            id: "orchard-basket",
            x: 30,
            y: 33,
            kind: "cat_basket"
        }, {
            id: "orchard-feeder",
            x: 24,
            y: 35,
            kind: "feeding_station"
        }, {
            id: "orchard-lamp",
            x: 40,
            y: 18,
            kind: "lamp"
        }, {
            id: "orchard-lamp-2",
            x: 15,
            y: 20,
            kind: "lamp"
        });
    }
    if (zoneId === "pond") {
        tiles.push(...ellipseTiles("water", 24, 22, 10, 8));
        tiles.push(...ellipseTiles("lily", 23, 22, 7, 4).filter((tile)=>(tile.x + tile.y) % 4 === 0));
        tiles.push(...rectTiles("stone_path", 12, 31, 36, 33));
        tiles.push(...everyOtherFlower(5, 26, 13, 40));
        tiles.push(...everyOtherFlower(33, 25, 42, 40));
        structures.push({
            id: "pond-bridge",
            x: 18,
            y: 31,
            kind: "bridge"
        }, {
            id: "pond-bench",
            x: 35,
            y: 21,
            kind: "bench"
        }, {
            id: "pond-lamp",
            x: 40,
            y: 18,
            kind: "lamp"
        }, {
            id: "pond-basket",
            x: 31,
            y: 35,
            kind: "cat_basket"
        }, {
            id: "pond-water-bowl",
            x: 14,
            y: 35,
            kind: "water_bowl"
        }, {
            id: "pond-lamp-2",
            x: 10,
            y: 20,
            kind: "lamp"
        });
    }
    if (zoneId === "grove") {
        tiles.push(...everyOtherBush(6, 20, 42, 42));
        tiles.push(...everyOtherFlower(9, 28, 22, 42));
        tiles.push(...rectTiles("dirt_path", 12, 30, 37, 32));
        structures.push({
            id: "grove-bench",
            x: 30,
            y: 24,
            kind: "bench"
        }, {
            id: "grove-lamp",
            x: 39,
            y: 18,
            kind: "lamp"
        }, {
            id: "grove-feeder",
            x: 16,
            y: 34,
            kind: "feeding_station"
        }, {
            id: "grove-lamp-2",
            x: 11,
            y: 23,
            kind: "lamp"
        });
    }
    if (zoneId === "dog-run") {
        tiles.push(...rectTiles("grass", 10, 18, 40, 42));
        tiles.push(...rectTiles("stone_path", 10, 30, 39, 33));
        tiles.push(...everyOtherFlower(6, 30, 12, 40));
        tiles.push(...everyOtherFlower(35, 29, 42, 39));
        structures.push({
            id: "dogrun-house",
            x: 10,
            y: 34,
            kind: "dog_house"
        }, {
            id: "dogrun-toy-box",
            x: 20,
            y: 36,
            kind: "toy_box"
        }, {
            id: "dogrun-bench",
            x: 33,
            y: 22,
            kind: "bench"
        }, {
            id: "dogrun-water",
            x: 31,
            y: 36,
            kind: "water_bowl"
        }, {
            id: "dogrun-feeder",
            x: 25,
            y: 36,
            kind: "feeding_station"
        }, {
            id: "dogrun-lamp",
            x: 40,
            y: 18,
            kind: "lamp"
        }, {
            id: "dogrun-lamp-2",
            x: 14,
            y: 19,
            kind: "lamp"
        });
    }
    return {
        tiles,
        structures
    };
}
}),
"[project]/lib/domain/pathfinding.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clampToRoamBounds",
    ()=>clampToRoamBounds,
    "findNearestWalkableTile",
    ()=>findNearestWalkableTile,
    "findWalkingPath",
    ()=>findWalkingPath,
    "isWalkableTile",
    ()=>isWalkableTile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$terrain$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain/terrain.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain/world.ts [app-ssr] (ecmascript)");
;
;
const MAX_EXPLORED_NODES = 4200;
const BRIDGE_OPEN_RADIUS = 1;
const walkabilityCache = new Map();
function tileIndex(tileX, tileY) {
    return tileY * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"] + tileX;
}
function inGrid(tileX, tileY) {
    return tileX >= 0 && tileX < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"] && tileY >= 0 && tileY < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_ROWS"];
}
function buildWalkabilityGrid(zoneId) {
    const grid = new Uint8Array(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"] * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_ROWS"]).fill(1);
    const terrain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$terrain$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildTerrainMap"])(zoneId);
    for (const tile of terrain.tiles){
        if (!inGrid(tile.x, tile.y)) {
            continue;
        }
        if (tile.type === "water" || tile.type === "lily") {
            grid[tileIndex(tile.x, tile.y)] = 0;
        }
    }
    for (const structure of terrain.structures){
        if (structure.kind !== "bridge") {
            continue;
        }
        for(let dy = -BRIDGE_OPEN_RADIUS; dy <= BRIDGE_OPEN_RADIUS; dy += 1){
            for(let dx = -BRIDGE_OPEN_RADIUS; dx <= BRIDGE_OPEN_RADIUS; dx += 1){
                const x = structure.x + dx;
                const y = structure.y + dy;
                if (inGrid(x, y)) {
                    grid[tileIndex(x, y)] = 1;
                }
            }
        }
    }
    return grid;
}
function walkabilityGrid(zoneId) {
    const cached = walkabilityCache.get(zoneId);
    if (cached) {
        return cached;
    }
    const grid = buildWalkabilityGrid(zoneId);
    walkabilityCache.set(zoneId, grid);
    return grid;
}
function isWalkableTile(zoneId, tileX, tileY) {
    if (!inGrid(tileX, tileY)) {
        return false;
    }
    return walkabilityGrid(zoneId)[tileIndex(tileX, tileY)] === 1;
}
function clampToRoamBounds(point) {
    return {
        tileX: Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_BOUNDS"].minX, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_BOUNDS"].maxX, Math.round(point.tileX))),
        tileY: Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_BOUNDS"].minY, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_BOUNDS"].maxY, Math.round(point.tileY)))
    };
}
function findNearestWalkableTile(zoneId, point) {
    const target = clampToRoamBounds(point);
    if (isWalkableTile(zoneId, target.tileX, target.tileY)) {
        return target;
    }
    for(let radius = 1; radius <= Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_ROWS"]); radius += 1){
        for(let dy = -radius; dy <= radius; dy += 1){
            for(let dx = -radius; dx <= radius; dx += 1){
                if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) {
                    continue;
                }
                const tileX = target.tileX + dx;
                const tileY = target.tileY + dy;
                if (isWalkableTile(zoneId, tileX, tileY)) {
                    return {
                        tileX,
                        tileY
                    };
                }
            }
        }
    }
    return target;
}
function hasLineOfSight(grid, from, to) {
    let x = from.tileX;
    let y = from.tileY;
    const deltaX = Math.abs(to.tileX - x);
    const deltaY = Math.abs(to.tileY - y);
    const stepX = x < to.tileX ? 1 : -1;
    const stepY = y < to.tileY ? 1 : -1;
    let error = deltaX - deltaY;
    while(x !== to.tileX || y !== to.tileY){
        const doubledError = error * 2;
        if (doubledError > -deltaY) {
            error -= deltaY;
            x += stepX;
        }
        if (doubledError < deltaX) {
            error += deltaX;
            y += stepY;
        }
        if (!inGrid(x, y) || grid[tileIndex(x, y)] !== 1) {
            return false;
        }
    }
    return true;
}
function smoothPath(grid, path) {
    if (path.length <= 2) {
        return path;
    }
    const smoothed = [
        path[0]
    ];
    let anchorIndex = 0;
    for(let index = 1; index < path.length; index += 1){
        const isLast = index === path.length - 1;
        if (isLast || !hasLineOfSight(grid, path[anchorIndex], path[index + 1])) {
            smoothed.push(path[index]);
            anchorIndex = index;
        }
    }
    return smoothed;
}
const NEIGHBOR_STEPS = [
    {
        dx: 0,
        dy: -1,
        cost: 1
    },
    {
        dx: 1,
        dy: 0,
        cost: 1
    },
    {
        dx: 0,
        dy: 1,
        cost: 1
    },
    {
        dx: -1,
        dy: 0,
        cost: 1
    },
    {
        dx: 1,
        dy: -1,
        cost: Math.SQRT2
    },
    {
        dx: 1,
        dy: 1,
        cost: Math.SQRT2
    },
    {
        dx: -1,
        dy: 1,
        cost: Math.SQRT2
    },
    {
        dx: -1,
        dy: -1,
        cost: Math.SQRT2
    }
];
function octileHeuristic(from, to) {
    const dx = Math.abs(from.tileX - to.tileX);
    const dy = Math.abs(from.tileY - to.tileY);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
}
function findWalkingPath(zoneId, start, goal) {
    const grid = walkabilityGrid(zoneId);
    const from = findNearestWalkableTile(zoneId, start);
    const to = findNearestWalkableTile(zoneId, goal);
    if (from.tileX === to.tileX && from.tileY === to.tileY) {
        return [
            to
        ];
    }
    const gScores = new Map();
    const cameFrom = new Map();
    const open = [];
    const startIndex = tileIndex(from.tileX, from.tileY);
    const goalIndex = tileIndex(to.tileX, to.tileY);
    gScores.set(startIndex, 0);
    open.push({
        index: startIndex,
        fScore: octileHeuristic(from, to)
    });
    let explored = 0;
    while(open.length > 0 && explored < MAX_EXPLORED_NODES){
        let bestPosition = 0;
        for(let position = 1; position < open.length; position += 1){
            if (open[position].fScore < open[bestPosition].fScore) {
                bestPosition = position;
            }
        }
        const current = open.splice(bestPosition, 1)[0];
        explored += 1;
        if (current.index === goalIndex) {
            const reversed = [];
            let cursor = goalIndex;
            while(cursor !== undefined && cursor !== startIndex){
                reversed.push({
                    tileX: cursor % __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"],
                    tileY: Math.floor(cursor / __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"])
                });
                cursor = cameFrom.get(cursor);
            }
            reversed.push(from);
            const ordered = reversed.reverse();
            return smoothPath(grid, ordered).slice(1);
        }
        const currentX = current.index % __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"];
        const currentY = Math.floor(current.index / __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"]);
        const currentG = gScores.get(current.index) ?? Number.POSITIVE_INFINITY;
        for (const step of NEIGHBOR_STEPS){
            const nextX = currentX + step.dx;
            const nextY = currentY + step.dy;
            if (!inGrid(nextX, nextY) || grid[tileIndex(nextX, nextY)] !== 1) {
                continue;
            }
            // A diagonal move must not cut a blocked corner.
            if (step.cost > 1 && (grid[tileIndex(currentX + step.dx, currentY)] !== 1 || grid[tileIndex(currentX, currentY + step.dy)] !== 1)) {
                continue;
            }
            const nextIndex = tileIndex(nextX, nextY);
            const tentativeG = currentG + step.cost;
            if (tentativeG >= (gScores.get(nextIndex) ?? Number.POSITIVE_INFINITY)) {
                continue;
            }
            gScores.set(nextIndex, tentativeG);
            cameFrom.set(nextIndex, current.index);
            open.push({
                index: nextIndex,
                fScore: tentativeG + octileHeuristic({
                    tileX: nextX,
                    tileY: nextY
                }, to)
            });
        }
    }
    return [
        to
    ];
}
}),
"[project]/components/garden/garden-canvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GardenCanvas",
    ()=>GardenCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@pixi/react/lib/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$components$2f$Application$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@pixi/react/lib/components/Application.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$helpers$2f$extend$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@pixi/react/lib/helpers/extend.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$hooks$2f$useTick$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@pixi/react/lib/hooks/useTick.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$assets$2f$Assets$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/assets/Assets.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$container$2f$Container$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/scene/container/Container.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$graphics$2f$shared$2f$Graphics$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/scene/graphics/shared/Graphics.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$sprite$2f$Sprite$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/scene/sprite/Sprite.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pixi.js/lib/scene/text/Text.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-ssr] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$map$2d$overlays$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/autonomy-map-overlays.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$use$2d$player$2d$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/use-player-controls.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$use$2d$zone$2d$asset$2d$warmup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/use-zone-asset-warmup.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$transition$2d$markers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-transition-markers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$terrain$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain/terrain.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$pathfinding$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain/pathfinding.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain/world.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$pet$2d$sprite$2d$frames$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rendering/pet-sprite-frames.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$helpers$2f$extend$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({
    Container: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$container$2f$Container$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"],
    Graphics: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$graphics$2f$shared$2f$Graphics$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Graphics"],
    Sprite: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$sprite$2f$Sprite$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sprite"],
    Text: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$scene$2f$text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"]
});
const LOGICAL_COLS = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_COLS"];
const LOGICAL_ROWS = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_ROWS"];
const TILE_SIZE = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_TILE_SIZE"];
const SCENE_WIDTH = 1836;
const SCENE_HEIGHT = 1756;
const PLAYFIELD_LEFT = 150;
const PLAYFIELD_TOP = 110;
const PLAYFIELD_RIGHT = PLAYFIELD_LEFT + LOGICAL_COLS * TILE_SIZE;
const PLAYFIELD_BOTTOM = PLAYFIELD_TOP + LOGICAL_ROWS * TILE_SIZE;
const PLAYER_WALK_TILES_PER_SECOND = 4.6;
const PLAYER_SPRINT_TILES_PER_SECOND = 7.1;
const CAMERA_LERP = 0.085;
const PROXIMITY_ACTION_TILES = 2.6;
const PROXIMITY_NOTICE_TILES = 3.4;
const FAR_CALL_TILES = 6;
const HOLD_TO_MOVE_MS = 220;
const HOLD_TO_MOVE_DRIFT_PX = 12;
const ZONE_TRAVEL_RING = [
    "orchard",
    "pond",
    "grove",
    "dog-run"
];
const GATE_BAND_MIN_TILE_Y = 20;
const GATE_BAND_MAX_TILE_Y = 28;
const backgroundScenePath = {
    orchard: "/garden/scene-orchard.svg",
    pond: "/garden/scene-pond.svg",
    grove: "/garden/scene-grove.svg",
    "dog-run": "/garden/scene-dog-run.svg"
};
const zoneAtmosphere = {
    orchard: "radial-gradient(circle at 15% 16%, rgba(255,243,172,0.28), transparent 22%), radial-gradient(circle at 78% 34%, rgba(112,255,218,0.16), transparent 26%)",
    pond: "radial-gradient(circle at 54% 42%, rgba(132,230,255,0.22), transparent 28%), radial-gradient(circle at 12% 18%, rgba(255,255,255,0.1), transparent 18%)",
    grove: "radial-gradient(circle at 74% 20%, rgba(181,247,135,0.18), transparent 24%), radial-gradient(circle at 24% 54%, rgba(255,209,102,0.08), transparent 24%)",
    "dog-run": "radial-gradient(circle at 28% 18%, rgba(255,217,113,0.18), transparent 28%), radial-gradient(circle at 82% 38%, rgba(116,255,194,0.12), transparent 26%)"
};
const zoneSpawnTile = {
    orchard: {
        tileX: 24,
        tileY: 30
    },
    pond: {
        tileX: 24,
        tileY: 34
    },
    grove: {
        tileX: 24,
        tileY: 31
    },
    "dog-run": {
        tileX: 24,
        tileY: 32
    }
};
const environmentLayerOrder = {
    sky: 0,
    shadow: 1,
    air: 2,
    water: 3,
    ground: 4
};
const activityToneColors = {
    social: {
        stroke: "#67E8F9",
        fill: "#082F49",
        text: "#CFFAFE"
    },
    conflict: {
        stroke: "#FDA4AF",
        fill: "#4C0519",
        text: "#FFE4E6"
    },
    rest: {
        stroke: "#C4B5FD",
        fill: "#2E1065",
        text: "#EDE9FE"
    },
    care: {
        stroke: "#BEFE5F",
        fill: "#1A2E05",
        text: "#ECFCCB"
    },
    explore: {
        stroke: "#FDE68A",
        fill: "#451A03",
        text: "#FEF3C7"
    },
    neutral: {
        stroke: "#E5E7EB",
        fill: "#111827",
        text: "#F8FAFC"
    }
};
const encounterMarkerToneStyles = {
    conflict: "border-rose-200/80 bg-rose-400/18 text-rose-50 shadow-[0_0_28px_rgba(251,113,133,0.28)]",
    social: "border-cyan-200/80 bg-cyan-400/16 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.24)]",
    explore: "border-amber-200/80 bg-amber-300/16 text-amber-50 shadow-[0_0_28px_rgba(251,191,36,0.24)]",
    care: "border-lime-200/80 bg-lime-300/16 text-lime-50 shadow-[0_0_28px_rgba(190,254,95,0.24)]",
    rest: "border-violet-200/80 bg-violet-300/16 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.24)]"
};
function toSceneX(tileX) {
    return PLAYFIELD_LEFT + tileX * TILE_SIZE;
}
function toSceneY(tileY) {
    return PLAYFIELD_TOP + tileY * TILE_SIZE;
}
function toTileX(sceneX) {
    return (sceneX - PLAYFIELD_LEFT) / TILE_SIZE;
}
function toTileY(sceneY) {
    return (sceneY - PLAYFIELD_TOP) / TILE_SIZE;
}
function moodBubble(mood) {
    switch(mood){
        case "sleepy":
            return "zZ";
        case "playful":
            return "!!";
        case "grumpy":
            return "><";
        case "lonely":
            return "?";
        case "dirty":
            return "...";
        case "curious":
            return "+";
        case "happy":
        default:
            return "o";
    }
}
function shouldShowBubble(selected, mood, activity) {
    if (selected) {
        return true;
    }
    return activity === "sleep" || activity === "watch_fish" || mood === "dirty" || mood === "grumpy";
}
function isRenderableObject(object) {
    return object.type === "poop" || object.type === "toy" || object.type === "butterfly" || object.type === "lamp" || object.type === "fountain" || object.type === "bridge";
}
function isSceneryObject(object) {
    return object.type === "tree" || object.type === "bush" || object.type === "stone" || object.type === "doghouse" || object.type === "pet_bed" || object.type === "rest_spot";
}
function movementTier(activity) {
    switch(activity){
        case "chase":
            return "sprint";
        case "play":
        case "dig":
        case "scuffle":
        case "approach_pet":
            return "trot";
        case "wander":
        case "move_to_zone":
        case "seek_owner":
        case "look_around":
        case "climb_tree":
            return "amble";
        default:
            return "rest";
    }
}
function tierTilesPerSecond(tier, zoomies) {
    const zoomBias = zoomies / 100;
    switch(tier){
        case "sprint":
            return 4.9 + zoomBias * 1.2;
        case "trot":
            return 3 + zoomBias * 0.6;
        case "amble":
            return 1.7 + zoomBias * 0.3;
        default:
            return 1.5;
    }
}
function walkingFrameBucket(tilesPerSecond) {
    if (tilesPerSecond >= 4.4) {
        return "sprint";
    }
    if (tilesPerSecond >= 2.4) {
        return "trot";
    }
    return "amble";
}
function walkingFrameDurationMs(tilesPerSecond) {
    if (tilesPerSecond >= 4.4) {
        return 220;
    }
    if (tilesPerSecond >= 2.4) {
        return 300;
    }
    return 400;
}
function petJitterOffset(petId) {
    let hash = 5381;
    for(let index = 0; index < petId.length; index += 1){
        hash = (hash << 5) + hash + petId.charCodeAt(index) | 0;
    }
    const positive = Math.abs(hash);
    return {
        x: positive % 21 - 10,
        y: (positive >> 3) % 15 - 7
    };
}
function drawDynamicObject(object) {
    return (graphics)=>{
        graphics.clear();
        if (object.type === "poop") {
            graphics.ellipse(0, 12, 20, 13).fill({
                color: "#6D4728"
            });
            graphics.circle(-5, 2, 10).fill({
                color: "#8B5E3C"
            });
            graphics.circle(6, -4, 8).fill({
                color: "#92613D"
            });
            return;
        }
        if (object.type === "toy") {
            graphics.circle(0, 0, 16).fill({
                color: "#F59E0B"
            });
            graphics.circle(0, 0, 8).fill({
                color: "#FDE68A"
            });
            graphics.circle(-5, -4, 3).fill({
                color: "#FFF7BF",
                alpha: 0.85
            });
            return;
        }
        if (object.type === "butterfly") {
            graphics.circle(-9, -1, 8).fill({
                color: "#FFB703"
            });
            graphics.circle(9, -1, 8).fill({
                color: "#FFB703"
            });
            graphics.circle(-7, 8, 6).fill({
                color: "#F472B6"
            });
            graphics.circle(7, 8, 6).fill({
                color: "#F472B6"
            });
            graphics.rect(-2, -6, 4, 24).fill({
                color: "#111827"
            });
            return;
        }
        if (object.type === "lamp") {
            graphics.rect(-3, -28, 6, 32).fill({
                color: "#2B3A4F"
            });
            graphics.roundRect(-8, -40, 16, 14, 5).fill({
                color: "#94FDF7"
            });
            graphics.circle(0, -32, 24).fill({
                color: "#67E8F9",
                alpha: 0.16
            });
            return;
        }
        if (object.type === "fountain") {
            graphics.ellipse(0, 10, 42, 16).fill({
                color: "#2563EB",
                alpha: 0.35
            });
            graphics.rect(-6, -30, 12, 34).fill({
                color: "#A5B4FC"
            });
            graphics.roundRect(-4, -50, 8, 22, 4).fill({
                color: "#E0F2FE",
                alpha: 0.9
            });
            return;
        }
        if (object.type === "bridge") {
            graphics.roundRect(-30, -6, 60, 16, 6).fill({
                color: "#7C4A1F"
            });
            graphics.rect(-22, -12, 44, 6).fill({
                color: "#A16207"
            });
            return;
        }
    };
}
function drawSceneryObject(object, neonAlpha) {
    return (graphics)=>{
        graphics.clear();
        if (object.type === "tree") {
            graphics.rect(-9, -8, 18, 52).fill({
                color: "#7C4A1F",
                alpha: 0.98
            });
            graphics.rect(-13, 32, 8, 12).fill({
                color: "#7C4A1F",
                alpha: 0.95
            });
            graphics.rect(5, 32, 8, 12).fill({
                color: "#7C4A1F",
                alpha: 0.95
            });
            graphics.rect(-22, -2, 14, 8).fill({
                color: "#8B5A2B",
                alpha: 0.9
            });
            graphics.rect(8, -6, 14, 8).fill({
                color: "#8B5A2B",
                alpha: 0.9
            });
            graphics.rect(-46, -70, 28, 18).fill({
                color: "#2F6A18",
                alpha: 0.96
            });
            graphics.rect(-20, -84, 30, 18).fill({
                color: "#3E7D1E",
                alpha: 0.98
            });
            graphics.rect(8, -72, 26, 16).fill({
                color: "#36711A",
                alpha: 0.96
            });
            graphics.rect(-58, -52, 34, 18).fill({
                color: "#4D8F23",
                alpha: 0.96
            });
            graphics.rect(-28, -58, 38, 18).fill({
                color: "#5FA82C",
                alpha: 0.98
            });
            graphics.rect(6, -56, 34, 18).fill({
                color: "#4B9224",
                alpha: 0.98
            });
            graphics.rect(-46, -36, 28, 16).fill({
                color: "#74BC31",
                alpha: 0.98
            });
            graphics.rect(-18, -34, 36, 18).fill({
                color: "#8FD63C",
                alpha: 0.98
            });
            graphics.rect(18, -38, 22, 16).fill({
                color: "#76BF32",
                alpha: 0.98
            });
            graphics.rect(-40, -24, 24, 12).fill({
                color: "#BAF248",
                alpha: 0.92
            });
            graphics.rect(-2, -22, 18, 10).fill({
                color: "#D4FB6E",
                alpha: 0.88
            });
            graphics.circle(-4, -42, 72).fill({
                color: "#67E8F9",
                alpha: neonAlpha * 0.035
            });
            return;
        }
        if (object.type === "bush") {
            graphics.rect(-18, -10, 16, 14).fill({
                color: "#3F7C1B",
                alpha: 0.95
            });
            graphics.rect(-6, -16, 18, 16).fill({
                color: "#5FA82C",
                alpha: 0.98
            });
            graphics.rect(8, -10, 14, 14).fill({
                color: "#76BF32",
                alpha: 0.95
            });
            return;
        }
        if (object.type === "stone") {
            graphics.roundRect(-15, -8, 30, 16, 6).fill({
                color: "#D7C8A5",
                alpha: 0.96
            });
            graphics.roundRect(-8, -13, 16, 10, 4).fill({
                color: "#EFE1BE",
                alpha: 0.84
            });
            return;
        }
        if (object.type === "doghouse") {
            graphics.rect(-22, -10, 44, 24).fill({
                color: "#A16207",
                alpha: 0.95
            });
            graphics.poly([
                -24,
                -10,
                0,
                -30,
                24,
                -10
            ], true).fill({
                color: "#DC2626",
                alpha: 0.92
            });
            graphics.roundRect(-8, -1, 16, 15, 5).fill({
                color: "#111827",
                alpha: 0.92
            });
            return;
        }
        if (object.type === "pet_bed") {
            graphics.ellipse(0, 0, 22, 12).fill({
                color: "#A16207",
                alpha: 0.95
            });
            graphics.ellipse(0, -1, 18, 8).fill({
                color: "#60A5FA",
                alpha: 0.88
            });
            return;
        }
        if (object.type === "rest_spot") {
            graphics.roundRect(-18, -8, 36, 18, 8).fill({
                color: "#8B5CF6",
                alpha: 0.12 + neonAlpha * 0.08
            });
            graphics.ellipse(0, 2, 20, 9).fill({
                color: "#FDE68A",
                alpha: 0.24
            });
        }
    };
}
function drawEnvironmentActor(actor) {
    return (graphics)=>{
        graphics.clear();
        if (actor.kind === "cloud") {
            graphics.circle(-18, 4, 18).fill({
                color: "#FFFFFF",
                alpha: 0.92
            });
            graphics.circle(0, 0, 22).fill({
                color: "#FFFFFF",
                alpha: 0.94
            });
            graphics.circle(22, 5, 16).fill({
                color: "#F8FAFC",
                alpha: 0.92
            });
            graphics.roundRect(-24, 4, 56, 18, 10).fill({
                color: "#FFFFFF",
                alpha: 0.9
            });
            return;
        }
        if (actor.kind === "cloud_shadow") {
            graphics.ellipse(0, 0, 46 * actor.scale, 18 * actor.scale).fill({
                color: "#0F172A",
                alpha: 0.08
            });
            return;
        }
        if (actor.kind === "duck") {
            graphics.ellipse(0, 6, 20, 12).fill({
                color: "#FDE047"
            });
            graphics.circle(14, -2, 8).fill({
                color: "#FACC15"
            });
            graphics.poly([
                20,
                -2,
                28,
                0,
                20,
                4
            ], true).fill({
                color: "#FB923C"
            });
            return;
        }
        if (actor.kind === "fish") {
            graphics.ellipse(0, 0, 16, 8).fill({
                color: actor.tint ?? "#60A5FA"
            });
            graphics.poly([
                14,
                0,
                26,
                -8,
                26,
                8
            ], true).fill({
                color: actor.tint ?? "#60A5FA"
            });
            return;
        }
        if (actor.kind === "bee") {
            graphics.ellipse(0, 0, 9, 6).fill({
                color: "#FACC15"
            });
            graphics.rect(-2, -6, 4, 12).fill({
                color: "#111827"
            });
            graphics.circle(-6, -5, 4).fill({
                color: "#E0F2FE",
                alpha: 0.7
            });
            graphics.circle(6, -5, 4).fill({
                color: "#E0F2FE",
                alpha: 0.7
            });
            return;
        }
        if (actor.kind === "firefly") {
            graphics.circle(0, 0, 3).fill({
                color: actor.tint ?? "#BEF264"
            });
            graphics.circle(0, 0, 14).fill({
                color: actor.tint ?? "#BEF264",
                alpha: 0.14
            });
            return;
        }
        if (actor.kind === "butterfly") {
            graphics.circle(-6, -1, 6).fill({
                color: actor.tint ?? "#FFB703"
            });
            graphics.circle(6, -1, 6).fill({
                color: actor.tint ?? "#FFB703"
            });
            graphics.circle(-4, 5, 4).fill({
                color: actor.tint ?? "#F472B6",
                alpha: 0.88
            });
            graphics.circle(4, 5, 4).fill({
                color: actor.tint ?? "#F472B6",
                alpha: 0.88
            });
            graphics.rect(-1, -6, 2, 16).fill({
                color: "#111827"
            });
            return;
        }
        if (actor.kind === "leaf" || actor.kind === "petal") {
            graphics.poly([
                0,
                -8,
                6,
                0,
                0,
                10,
                -6,
                0
            ], true).fill({
                color: actor.kind === "petal" ? "#F9A8D4" : "#86EFAC",
                alpha: 0.92
            });
            return;
        }
        if (actor.kind === "mushroom") {
            graphics.rect(-4, 0, 8, 10).fill({
                color: "#F8FAFC",
                alpha: 0.85
            });
            graphics.roundRect(-10, -6, 20, 10, 5).fill({
                color: actor.tint ?? "#67E8F9",
                alpha: 0.9
            });
            graphics.circle(0, 0, 18).fill({
                color: actor.tint ?? "#67E8F9",
                alpha: 0.12
            });
            return;
        }
        if (actor.kind === "grass") {
            graphics.rect(-1, -12, 2, 14).fill({
                color: "#4ADE80"
            });
            graphics.rect(-6, -10, 2, 12).fill({
                color: "#65A30D"
            });
            graphics.rect(4, -10, 2, 12).fill({
                color: "#84CC16"
            });
        }
    };
}
function drawMoodBubble(selected, kind) {
    return (graphics)=>{
        graphics.clear();
        graphics.roundRect(-2, -2, selected ? 118 : 102, 32, kind === "speech" ? 11 : 16).fill({
            color: kind === "speech" ? "#DFF9FF" : selected ? "#F8FCFF" : "#F6FDE4",
            alpha: 0.94
        });
        if (kind === "speech") {
            graphics.poly([
                {
                    x: 14,
                    y: 28
                },
                {
                    x: 24,
                    y: 28
                },
                {
                    x: 18,
                    y: 38
                }
            ]).fill({
                color: "#DFF9FF",
                alpha: 0.94
            });
        } else {
            graphics.circle(10, 32, 5).fill({
                color: "#F8FCFF",
                alpha: 0.94
            });
            graphics.circle(1, 39, 3).fill({
                color: "#F8FCFF",
                alpha: 0.9
            });
        }
    };
}
function drawShadow(selected) {
    return (graphics)=>{
        graphics.clear();
        graphics.ellipse(0, 0, selected ? 34 : 28, selected ? 13 : 10).fill({
            color: "#071018",
            alpha: 0.28
        });
    };
}
function drawActivityFx(activity) {
    return (graphics)=>{
        graphics.clear();
        if (activity === "scuffle") {
            graphics.circle(-15, -14, 6).fill({
                color: "#FB7185",
                alpha: 0.5
            });
            graphics.circle(12, -18, 5).fill({
                color: "#FDE047",
                alpha: 0.62
            });
            graphics.circle(20, -4, 4).fill({
                color: "#F97316",
                alpha: 0.58
            });
            graphics.circle(-24, 4, 4).fill({
                color: "#F43F5E",
                alpha: 0.46
            });
            graphics.rect(-34, -24, 18, 3).fill({
                color: "#F8FAFC",
                alpha: 0.44
            });
            graphics.rect(16, -30, 20, 3).fill({
                color: "#F8FAFC",
                alpha: 0.38
            });
            graphics.rect(-8, -36, 3, 18).fill({
                color: "#FDE047",
                alpha: 0.42
            });
            graphics.ellipse(0, 20, 30, 9).stroke({
                color: "#FB7185",
                width: 2,
                alpha: 0.36
            });
            return;
        }
        if (activity === "chase") {
            graphics.rect(-28, -6, 10, 2).fill({
                color: "#F8FAFC",
                alpha: 0.38
            });
            graphics.rect(-22, 0, 8, 2).fill({
                color: "#F8FAFC",
                alpha: 0.28
            });
            return;
        }
        if (activity === "dig") {
            graphics.circle(-12, 10, 3).fill({
                color: "#A16207",
                alpha: 0.9
            });
            graphics.circle(-4, 14, 4).fill({
                color: "#B45309",
                alpha: 0.85
            });
            graphics.circle(8, 12, 3).fill({
                color: "#92400E",
                alpha: 0.8
            });
            return;
        }
        if (activity === "watch_fish" || activity === "drink") {
            graphics.ellipse(0, 18, 20, 6).stroke({
                color: "#7DD3FC",
                width: 2,
                alpha: 0.4
            });
            graphics.ellipse(0, 18, 10, 3).stroke({
                color: "#E0F2FE",
                width: 1,
                alpha: 0.45
            });
            return;
        }
        if (activity === "sunbathe") {
            graphics.circle(16, -18, 6).fill({
                color: "#FDE68A",
                alpha: 0.7
            });
            graphics.circle(16, -18, 12).fill({
                color: "#FDE68A",
                alpha: 0.15
            });
            return;
        }
        if (activity === "look_around") {
            graphics.circle(16, -20, 3).fill({
                color: "#BEF264",
                alpha: 0.85
            });
            graphics.circle(16, -20, 8).stroke({
                color: "#BEF264",
                width: 1,
                alpha: 0.3
            });
        }
    };
}
function tileRect(tileX, tileY) {
    return {
        x: toSceneX(tileX),
        y: toSceneY(tileY),
        width: TILE_SIZE,
        height: TILE_SIZE
    };
}
function findNearestPet(snapshot, sceneX, sceneY) {
    return snapshot.pets.map((pet)=>{
        const dx = sceneX - toSceneX(pet.state.tileX);
        const dy = sceneY - toSceneY(pet.state.tileY);
        return {
            pet,
            distance: Math.hypot(dx, dy)
        };
    }).filter((entry)=>entry.distance <= 56).sort((left, right)=>left.distance - right.distance)[0]?.pet;
}
const terrainMapCache = new Map();
function cachedTerrainMap(zoneId) {
    const cached = terrainMapCache.get(zoneId);
    if (cached) {
        return cached;
    }
    const terrain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$terrain$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildTerrainMap"])(zoneId);
    terrainMapCache.set(zoneId, terrain);
    return terrain;
}
function drawTerrainLayer(zoneId, nightAlpha) {
    return (graphics)=>{
        graphics.clear();
        const terrain = cachedTerrainMap(zoneId);
        for (const tile of terrain.tiles){
            const rect = tileRect(tile.x, tile.y);
            let color = (tile.x + tile.y) % 2 === 0 ? "#8FD63C" : "#7BC92A";
            let alpha = 0.9;
            if (tile.type === "flower_grass") {
                color = (tile.x + tile.y) % 2 === 0 ? "#A3E635" : "#B7F14E";
                alpha = 0.96;
            } else if (tile.type === "bush_grass") {
                color = (tile.x + tile.y) % 2 === 0 ? "#5FA82C" : "#4B9224";
                alpha = 0.96;
            } else if (tile.type === "stone_path") {
                color = (tile.x + tile.y) % 2 === 0 ? "#DCCAA4" : "#CDBA93";
                alpha = 0.96;
            } else if (tile.type === "dirt_path") {
                color = (tile.x + tile.y) % 2 === 0 ? "#C98B58" : "#B67749";
                alpha = 0.94;
            } else if (tile.type === "water") {
                color = (tile.x + tile.y) % 2 === 0 ? "#2F7BFF" : "#2563EB";
                alpha = 0.92;
            } else if (tile.type === "lily") {
                color = "#7DDC74";
                alpha = 0.96;
            }
            graphics.rect(rect.x, rect.y, rect.width, rect.height).fill({
                color,
                alpha
            });
            if (tile.type === "flower_grass") {
                graphics.rect(rect.x + 10, rect.y + 10, 4, 4).fill({
                    color: zoneId === "grove" ? "#F472B6" : "#FDE047",
                    alpha: 0.94
                });
                graphics.rect(rect.x + 14, rect.y + 12, 4, 4).fill({
                    color: "#F8FAFC",
                    alpha: 0.86
                });
            }
            if (tile.type === "bush_grass") {
                graphics.rect(rect.x + 8, rect.y + 8, 3, 9).fill({
                    color: "#365314",
                    alpha: 0.9
                });
                graphics.rect(rect.x + 16, rect.y + 6, 3, 11).fill({
                    color: "#4D7C0F",
                    alpha: 0.9
                });
            }
            if (tile.type === "water") {
                graphics.rect(rect.x + 4, rect.y + 12, 20, 2).fill({
                    color: "#BAE6FD",
                    alpha: 0.16
                });
            }
        }
        if (zoneId === "pond") {
            for(let ring = 0; ring < 3; ring += 1){
                graphics.ellipse(toSceneX(24), toSceneY(24), 208 - ring * 30, 94 - ring * 12).stroke({
                    color: "#E0F2FE",
                    width: 2,
                    alpha: 0.08 - ring * 0.02
                });
            }
        }
        if (nightAlpha > 0) {
            graphics.rect(PLAYFIELD_LEFT, PLAYFIELD_TOP, PLAYFIELD_RIGHT - PLAYFIELD_LEFT, PLAYFIELD_BOTTOM - PLAYFIELD_TOP).fill({
                color: "#071018",
                alpha: nightAlpha * 0.08
            });
        }
    };
}
function drawStructureLayer(zoneId, neonAlpha) {
    return (graphics)=>{
        graphics.clear();
        const terrain = cachedTerrainMap(zoneId);
        for (const structure of terrain.structures){
            const baseX = toSceneX(structure.x);
            const baseY = toSceneY(structure.y);
            if (structure.kind === "bench") {
                graphics.roundRect(baseX - 18, baseY - 12, 36, 10, 3).fill({
                    color: "#7C4A1F",
                    alpha: 0.9
                });
                graphics.rect(baseX - 14, baseY - 20, 28, 6).fill({
                    color: "#A16207",
                    alpha: 0.9
                });
                continue;
            }
            if (structure.kind === "lamp") {
                graphics.rect(baseX - 2, baseY - 26, 4, 28).fill({
                    color: "#334155"
                });
                graphics.roundRect(baseX - 7, baseY - 36, 14, 12, 4).fill({
                    color: "#67E8F9",
                    alpha: 0.9
                });
                graphics.circle(baseX, baseY - 30, 18).fill({
                    color: "#67E8F9",
                    alpha: 0.12 + neonAlpha * 0.12
                });
                continue;
            }
            if (structure.kind === "cat_tree") {
                graphics.rect(baseX - 4, baseY - 32, 8, 36).fill({
                    color: "#8B5E34"
                });
                graphics.roundRect(baseX - 16, baseY - 20, 32, 8, 4).fill({
                    color: "#F5D0A9"
                });
                graphics.roundRect(baseX - 12, baseY - 38, 24, 8, 4).fill({
                    color: "#F5D0A9"
                });
                continue;
            }
            if (structure.kind === "dog_house") {
                graphics.rect(baseX - 16, baseY - 12, 32, 18).fill({
                    color: "#A16207"
                });
                graphics.poly([
                    baseX - 18,
                    baseY - 12,
                    baseX,
                    baseY - 28,
                    baseX + 18,
                    baseY - 12
                ], true).fill({
                    color: "#EF4444"
                });
                graphics.roundRect(baseX - 6, baseY - 4, 12, 10, 4).fill({
                    color: "#111827"
                });
                continue;
            }
            if (structure.kind === "cat_basket") {
                graphics.ellipse(baseX, baseY, 18, 10).fill({
                    color: "#A16207"
                });
                graphics.ellipse(baseX, baseY - 2, 14, 6).fill({
                    color: "#60A5FA"
                });
                continue;
            }
            if (structure.kind === "toy_box") {
                graphics.rect(baseX - 12, baseY - 10, 24, 16).fill({
                    color: "#92400E"
                });
                graphics.rect(baseX - 10, baseY - 18, 20, 8).fill({
                    color: "#F59E0B"
                });
                continue;
            }
            if (structure.kind === "feeding_station") {
                graphics.rect(baseX - 10, baseY - 2, 20, 4).fill({
                    color: "#475569"
                });
                graphics.circle(baseX - 6, baseY - 8, 6).fill({
                    color: "#F59E0B"
                });
                graphics.circle(baseX + 6, baseY - 8, 6).fill({
                    color: "#60A5FA"
                });
                continue;
            }
            if (structure.kind === "bridge") {
                graphics.roundRect(baseX - 24, baseY - 4, 48, 10, 4).fill({
                    color: "#7C4A1F"
                });
                graphics.rect(baseX - 16, baseY - 10, 32, 4).fill({
                    color: "#A16207"
                });
                continue;
            }
            if (structure.kind === "water_bowl") {
                graphics.ellipse(baseX, baseY, 10, 5).fill({
                    color: "#60A5FA"
                });
            }
        }
    };
}
function drawTerrainDetailLayer(zoneId) {
    return (graphics)=>{
        graphics.clear();
        const terrain = cachedTerrainMap(zoneId);
        const tileMap = new Map(terrain.tiles.map((tile)=>[
                `${tile.x}:${tile.y}`,
                tile.type
            ]));
        for (const tile of terrain.tiles){
            const rect = tileRect(tile.x, tile.y);
            const top = tileMap.get(`${tile.x}:${tile.y - 1}`);
            const right = tileMap.get(`${tile.x + 1}:${tile.y}`);
            if (tile.type === "stone_path" || tile.type === "dirt_path") {
                graphics.rect(rect.x, rect.y, rect.width, 2).fill({
                    color: "#F8FAFC",
                    alpha: 0.14
                });
                graphics.rect(rect.x, rect.y + rect.height - 2, rect.width, 2).fill({
                    color: "#7C4A1F",
                    alpha: 0.12
                });
            }
            if (tile.type === "water") {
                if (top !== "water") {
                    graphics.rect(rect.x + 2, rect.y + 3, rect.width - 4, 2).fill({
                        color: "#E0F2FE",
                        alpha: 0.2
                    });
                }
                if (right !== "water") {
                    graphics.rect(rect.x + rect.width - 3, rect.y + 4, 2, rect.height - 8).fill({
                        color: "#0F4CC9",
                        alpha: 0.12
                    });
                }
            }
            if (tile.type === "grass" && (tile.x + tile.y) % 5 === 0) {
                graphics.rect(rect.x + 6, rect.y + 18, 2, 8).fill({
                    color: "#6DAF24",
                    alpha: 0.55
                });
                graphics.rect(rect.x + 10, rect.y + 16, 2, 10).fill({
                    color: "#8FD63C",
                    alpha: 0.46
                });
            }
        }
    };
}
function drawGrid() {
    return (graphics)=>{
        graphics.clear();
        for(let x = 0; x < LOGICAL_COLS; x += 1){
            const sceneX = toSceneX(x);
            graphics.moveTo(sceneX, PLAYFIELD_TOP);
            graphics.lineTo(sceneX, PLAYFIELD_BOTTOM);
        }
        for(let y = 0; y < LOGICAL_ROWS; y += 1){
            const sceneY = toSceneY(y);
            graphics.moveTo(PLAYFIELD_LEFT, sceneY);
            graphics.lineTo(PLAYFIELD_RIGHT, sceneY);
        }
        graphics.stroke({
            color: "#FFFFFF",
            alpha: 0.035,
            width: 1
        });
    };
}
function drawTravelGate(direction) {
    return (graphics)=>{
        graphics.clear();
        const pillarOffset = direction === "west" ? 10 : -10;
        for (const side of [
            -52,
            52
        ]){
            graphics.roundRect(pillarOffset - 5, side - 46, 10, 92, 4).fill({
                color: "#0E2233",
                alpha: 0.92
            });
            graphics.roundRect(pillarOffset - 3, side - 42, 6, 84, 3).fill({
                color: "#67E8F9",
                alpha: 0.34
            });
            graphics.circle(pillarOffset, side - 46, 7).fill({
                color: "#BEF264",
                alpha: 0.85
            });
            graphics.circle(pillarOffset, side - 46, 14).fill({
                color: "#BEF264",
                alpha: 0.16
            });
        }
        graphics.roundRect(pillarOffset - 2, -52, 4, 104, 2).fill({
            color: "#67E8F9",
            alpha: 0.1
        });
    };
}
function routePath(overlay) {
    const startX = toSceneX(overlay.start.tileX);
    const startY = toSceneY(overlay.start.tileY) - 38;
    const endX = toSceneX(overlay.target.tileX);
    const endY = toSceneY(overlay.target.tileY) - 38;
    const midpointY = Math.min(startY, endY) - Math.max(42, Math.abs(endX - startX) * 0.08);
    return `M ${startX} ${startY} C ${startX} ${midpointY}, ${endX} ${midpointY}, ${endX} ${endY}`;
}
function routeEndpoint(overlay, point) {
    const tile = point === "start" ? overlay.start : overlay.target;
    return {
        x: toSceneX(tile.tileX),
        y: toSceneY(tile.tileY) - 38
    };
}
function DynamicWorldObjectNode({ object }) {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const baseX = toSceneX(object.tileX);
    const baseY = toSceneY(object.tileY);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$hooks$2f$useTick$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTick"])((ticker)=>{
        if (!containerRef.current) {
            return;
        }
        const elapsed = ticker.lastTime / 260;
        if (object.type === "butterfly") {
            containerRef.current.x = baseX + Math.sin(elapsed + object.tileX) * 22;
            containerRef.current.y = baseY - 22 + Math.cos(elapsed * 1.1 + object.tileY) * 10;
            return;
        }
        if (object.type === "lamp") {
            containerRef.current.alpha = 0.92 + Math.sin(elapsed * 0.8 + object.tileX) * 0.08;
            return;
        }
        if (object.type === "fountain") {
            containerRef.current.y = baseY + Math.sin(elapsed * 1.4 + object.tileY) * 3;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
        ref: containerRef,
        x: baseX,
        y: baseY,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
            draw: drawDynamicObject(object)
        }, void 0, false, {
            fileName: "[project]/components/garden/garden-canvas.tsx",
            lineNumber: 825,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/garden/garden-canvas.tsx",
        lineNumber: 824,
        columnNumber: 5
    }, this);
}
function SceneryWorldObjectNode({ neonAlpha, object }) {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const baseX = toSceneX(object.tileX);
    const baseY = toSceneY(object.tileY);
    const scale = object.type === "tree" ? 1.65 : object.type === "bush" ? 1.2 : object.type === "stone" ? 1.08 : 1;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$hooks$2f$useTick$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTick"])((ticker)=>{
        if (!containerRef.current) {
            return;
        }
        const elapsed = ticker.lastTime / 1400;
        if (object.type === "tree") {
            containerRef.current.x = baseX + Math.sin(elapsed + object.tileX * 0.23) * 1.8;
            containerRef.current.y = baseY + Math.cos(elapsed * 0.7 + object.tileY * 0.17) * 0.8;
            return;
        }
        if (object.type === "bush") {
            containerRef.current.x = baseX + Math.sin(elapsed * 0.8 + object.tileX * 0.3) * 0.9;
            return;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
        ref: containerRef,
        scale: scale,
        x: baseX,
        y: baseY,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
            draw: drawSceneryObject(object, neonAlpha)
        }, void 0, false, {
            fileName: "[project]/components/garden/garden-canvas.tsx",
            lineNumber: 864,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/garden/garden-canvas.tsx",
        lineNumber: 863,
        columnNumber: 5
    }, this);
}
function EnvironmentActorNode({ actor }) {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const baseX = toSceneX(actor.tileX);
    const baseY = toSceneY(actor.tileY);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$hooks$2f$useTick$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTick"])((ticker)=>{
        if (!containerRef.current) {
            return;
        }
        const elapsed = ticker.lastTime / 320;
        const sway = Math.sin(elapsed * actor.drift + actor.tileX) * 10 * actor.scale;
        const bob = Math.cos(elapsed * (actor.drift * 1.2) + actor.tileY) * 6 * actor.scale;
        if (actor.layer === "sky") {
            containerRef.current.x = baseX + sway * 1.2;
            containerRef.current.y = baseY - 160 + bob;
            return;
        }
        if (actor.layer === "shadow") {
            containerRef.current.x = baseX + sway * 1.1;
            containerRef.current.y = baseY + 26;
            containerRef.current.alpha = 0.55;
            return;
        }
        if (actor.kind === "duck" || actor.kind === "fish") {
            containerRef.current.x = baseX + sway;
            containerRef.current.y = baseY + bob * 0.4;
            return;
        }
        containerRef.current.x = baseX + sway;
        containerRef.current.y = baseY - 18 + bob;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
        ref: containerRef,
        x: baseX,
        y: baseY,
        scale: actor.scale,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
            draw: drawEnvironmentActor(actor)
        }, void 0, false, {
            fileName: "[project]/components/garden/garden-canvas.tsx",
            lineNumber: 908,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/garden/garden-canvas.tsx",
        lineNumber: 907,
        columnNumber: 5
    }, this);
}
const petFrameCache = new Map();
function loadPetFrames(spritePath, species) {
    const cacheKey = `${species}:${spritePath}`;
    const cached = petFrameCache.get(cacheKey);
    if (cached) {
        return cached;
    }
    const pending = fetch(spritePath, {
        cache: "force-cache"
    }).then((response)=>response.text()).then((svgText)=>{
        const frameUrls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$pet$2d$sprite$2d$frames$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildPetFrameUrls"])(svgText, species);
        return Promise.all([
            Promise.all(frameUrls.rest.map((url)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$assets$2f$Assets$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Assets"].load(url))),
            Promise.all(frameUrls.amble.map((url)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$assets$2f$Assets$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Assets"].load(url))),
            Promise.all(frameUrls.trot.map((url)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$assets$2f$Assets$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Assets"].load(url))),
            Promise.all(frameUrls.sprint.map((url)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$assets$2f$Assets$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Assets"].load(url))),
            Promise.all(frameUrls.sleep.map((url)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$assets$2f$Assets$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Assets"].load(url)))
        ]);
    }).then(([rest, amble, trot, sprint, sleep])=>({
            rest,
            amble,
            trot,
            sprint,
            sleep
        })).catch(()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pixi$2e$js$2f$lib$2f$assets$2f$Assets$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Assets"].load(spritePath).then((loaded)=>({
                rest: [
                    loaded
                ],
                amble: [
                    loaded
                ],
                trot: [
                    loaded
                ],
                sprint: [
                    loaded
                ],
                sleep: [
                    loaded
                ]
            })).catch(()=>null));
    petFrameCache.set(cacheKey, pending);
    return pending;
}
function activityIdleOffsetY(activity) {
    if (activity === "climb_tree") {
        return -140;
    }
    if (activity === "hide") {
        return 18;
    }
    if (activity === "sleep") {
        return 6;
    }
    if (activity === "watch_fish") {
        return -8;
    }
    return 0;
}
function PetSpriteNode({ pet, selected, allowBubble, socialBubble, playerRef, viewerOwnsPet }) {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const spriteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bubbleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const noticeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const motionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const waypointsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const plannedTargetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastPlanAtRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const noticeUntilRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastNoticeAtRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const facingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(pet.state.facing === "left" ? -1 : 1);
    // Deterministic per-pet phase offset staggers the walk cycles.
    const gaitPhaseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])((petJitterOffset(pet.pet.id).x + 10) * 0.61);
    const motionClockRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const frameIndexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(-1);
    const currentSpeedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const spritePath = pet.generation.worldSpritePath ?? "/generated/world-nyx.svg";
    const [frames, setFrames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const jitter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>petJitterOffset(pet.pet.id), [
        pet.pet.id
    ]);
    const zoneId = pet.state.zoneId;
    const targetTileX = pet.state.tileX;
    const targetTileY = pet.state.tileY;
    const activity = pet.state.activity;
    const tier = movementTier(activity);
    const tilesPerSecond = tierTilesPerSecond(tier, pet.personality.zoomies);
    // Growth stage reads directly in the world: awakened pets stand taller.
    const stageScale = pet.growth?.stage === "awakened" ? 1.12 : pet.growth?.stage === "synced" ? 1 : 0.9;
    const baseScale = (selected ? 2.18 : 2.08) * stageScale;
    const tone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityTone"])(activity);
    const toneColor = activityToneColors[tone];
    const showActivityLabel = selected || Boolean(pet.state.currentBubble?.text) || Boolean(socialBubble?.text) || tone === "social" || tone === "conflict";
    const bubbleText = socialBubble?.text ?? pet.state.currentBubble?.text ?? (activity === "sleep" && !selected ? "z" : moodBubble(pet.state.mood));
    const bubbleKind = socialBubble?.kind ?? pet.state.currentBubble?.kind ?? "thought";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        void loadPetFrames(spritePath, pet.pet.species).then((loadedFrames)=>{
            if (!cancelled) {
                setFrames(loadedFrames);
            }
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        pet.pet.species,
        spritePath
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        motionRef.current = null;
        waypointsRef.current = [];
        plannedTargetRef.current = null;
    }, [
        pet.pet.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        frameIndexRef.current = -1;
    }, [
        activity
    ]);
    // Plan a walking path whenever the server assigns a new destination tile.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const planned = plannedTargetRef.current;
        if (planned && planned.zoneId !== zoneId) {
            motionRef.current = null;
            waypointsRef.current = [];
        }
        if (planned && planned.zoneId === zoneId && planned.tileX === targetTileX && planned.tileY === targetTileY) {
            return;
        }
        plannedTargetRef.current = {
            tileX: targetTileX,
            tileY: targetTileY,
            zoneId
        };
        if (!motionRef.current) {
            // First sighting: appear in place, no walk-in.
            motionRef.current = {
                x: toSceneX(targetTileX),
                y: toSceneY(targetTileY)
            };
            waypointsRef.current = [];
            return;
        }
        const fromTile = {
            tileX: Math.round(toTileX(motionRef.current.x)),
            tileY: Math.round(toTileY(motionRef.current.y))
        };
        const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$pathfinding$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findWalkingPath"])(zoneId, fromTile, {
            tileX: targetTileX,
            tileY: targetTileY
        });
        waypointsRef.current = path.map((waypoint)=>({
                x: toSceneX(waypoint.tileX),
                y: toSceneY(waypoint.tileY)
            }));
        lastPlanAtRef.current = Date.now();
    }, [
        targetTileX,
        targetTileY,
        zoneId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$hooks$2f$useTick$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTick"])((ticker)=>{
        motionClockRef.current += ticker.deltaMS;
        const elapsedSeconds = motionClockRef.current / 1000;
        const deltaSeconds = ticker.deltaMS / 1000;
        const player = playerRef.current;
        const nowMs = Date.now();
        if (!motionRef.current) {
            motionRef.current = {
                x: toSceneX(targetTileX),
                y: toSceneY(targetTileY)
            };
        }
        const motion = motionRef.current;
        // seek_owner chases the live player position when the viewer owns this pet.
        if (activity === "seek_owner" && viewerOwnsPet && player.zoneId === zoneId) {
            const distanceToPlayer = Math.hypot(player.sceneX - motion.x, player.sceneY - motion.y);
            if (distanceToPlayer > TILE_SIZE * 1.7 && nowMs - lastPlanAtRef.current > 650) {
                const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$pathfinding$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findWalkingPath"])(zoneId, {
                    tileX: Math.round(toTileX(motion.x)),
                    tileY: Math.round(toTileY(motion.y))
                }, {
                    tileX: Math.round(toTileX(player.sceneX)),
                    tileY: Math.round(toTileY(player.sceneY))
                });
                waypointsRef.current = path.map((waypoint)=>({
                        x: toSceneX(waypoint.tileX),
                        y: toSceneY(waypoint.tileY)
                    }));
                lastPlanAtRef.current = nowMs;
            }
            if (distanceToPlayer <= TILE_SIZE * 1.7) {
                waypointsRef.current = [];
            }
        }
        // Walk along the planned waypoints at the activity speed.
        let remainingStep = Math.max(tilesPerSecond, 1.2) * TILE_SIZE * deltaSeconds;
        let moved = false;
        while(remainingStep > 0 && waypointsRef.current.length > 0){
            const next = waypointsRef.current[0];
            const dx = next.x - motion.x;
            const dy = next.y - motion.y;
            const distance = Math.hypot(dx, dy);
            if (distance <= remainingStep) {
                motion.x = next.x;
                motion.y = next.y;
                remainingStep -= distance;
                waypointsRef.current.shift();
            } else {
                motion.x += dx / distance * remainingStep;
                motion.y += dy / distance * remainingStep;
                remainingStep = 0;
            }
            if (Math.abs(dx) > 1.5) {
                facingRef.current = dx < 0 ? -1 : 1;
            }
            moved = true;
        }
        currentSpeedRef.current = moved ? tilesPerSecond : 0;
        if (moved) {
            gaitPhaseRef.current += deltaSeconds * (4 + tilesPerSecond * 1.6);
        }
        // Face the player when idle and nearby; occasionally flash a notice mark.
        if (!moved && player.zoneId === zoneId && activity !== "sleep" && activity !== "hide") {
            const distanceToPlayer = Math.hypot(player.sceneX - motion.x, player.sceneY - motion.y);
            if (distanceToPlayer < TILE_SIZE * PROXIMITY_NOTICE_TILES) {
                if (Math.abs(player.sceneX - motion.x) > 6) {
                    facingRef.current = player.sceneX < motion.x ? -1 : 1;
                }
                if (nowMs - lastNoticeAtRef.current > 30000) {
                    lastNoticeAtRef.current = nowMs;
                    noticeUntilRef.current = nowMs + 2100;
                }
            }
        }
        const idleBob = moved ? 0 : Math.sin(elapsedSeconds * 1.6 + jitter.x) * 1.1;
        const hop = moved ? Math.abs(Math.sin(gaitPhaseRef.current)) * Math.min(5, 1.2 + tilesPerSecond) : 0;
        const scuffleShakeX = !moved && activity === "scuffle" ? Math.sin(elapsedSeconds * 23 + jitter.x) * 6 : 0;
        const scuffleShakeY = !moved && activity === "scuffle" ? Math.cos(elapsedSeconds * 29 + jitter.y) * 3.5 : 0;
        if (containerRef.current) {
            containerRef.current.x = motion.x + jitter.x + scuffleShakeX;
            containerRef.current.y = motion.y + jitter.y + activityIdleOffsetY(moved ? "idle" : activity) + idleBob + scuffleShakeY - hop;
            containerRef.current.zIndex = motion.y;
        }
        if (spriteRef.current) {
            const activeFramesNow = frames ? moved ? frames[walkingFrameBucket(tilesPerSecond)] : frames[(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$pet$2d$sprite$2d$frames$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["frameBucketForActivity"])(activity)] : [];
            if (activeFramesNow.length > 0) {
                const duration = moved ? walkingFrameDurationMs(tilesPerSecond) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$pet$2d$sprite$2d$frames$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["frameDurationMs"])(activity);
                const nextFrameIndex = Math.floor(motionClockRef.current / duration) % activeFramesNow.length;
                if (frameIndexRef.current !== nextFrameIndex) {
                    frameIndexRef.current = nextFrameIndex;
                    spriteRef.current.texture = activeFramesNow[nextFrameIndex];
                }
            }
            const stretch = moved ? 1 + Math.sin(gaitPhaseRef.current) * 0.03 : 1 + Math.sin(elapsedSeconds * 1.4) * 0.012;
            const squash = moved ? 1 - Math.sin(gaitPhaseRef.current) * 0.02 : 1 + Math.cos(elapsedSeconds * 1.2) * 0.01;
            spriteRef.current.scale.x = facingRef.current * baseScale * stretch;
            spriteRef.current.scale.y = baseScale * squash;
            spriteRef.current.rotation = !moved && activity === "scuffle" ? Math.sin(elapsedSeconds * 18) * 0.16 : !moved && (activity === "sleep" || activity === "sunbathe") ? -0.08 : moved ? Math.sin(gaitPhaseRef.current * 0.5) * 0.02 : 0;
            spriteRef.current.alpha = activity === "hide" ? 0.82 : 1;
        }
        if (bubbleRef.current) {
            bubbleRef.current.y = -96 + Math.sin(elapsedSeconds * 0.9 + jitter.y) * 4;
        }
        if (noticeRef.current) {
            noticeRef.current.alpha = nowMs < noticeUntilRef.current ? 0.95 : 0;
            noticeRef.current.y = -118 - Math.max(0, Math.sin(elapsedSeconds * 6)) * 4;
        }
    });
    const initialFrames = frames?.[(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$pet$2d$sprite$2d$frames$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["frameBucketForActivity"])(activity)] ?? [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
        ref: containerRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                draw: drawShadow(selected),
                y: 48
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1262,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                draw: drawActivityFx(activity),
                y: 38
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1263,
                columnNumber: 7
            }, this),
            showActivityLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                draw: (graphics)=>{
                    graphics.clear();
                    graphics.circle(0, 18, selected ? 58 : 50).stroke({
                        color: toneColor.stroke,
                        width: selected ? 4 : 2,
                        alpha: selected ? 0.58 : 0.34
                    });
                }
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1265,
                columnNumber: 9
            }, this) : null,
            initialFrames[0] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiSprite", {
                ref: spriteRef,
                texture: initialFrames[0],
                anchor: 0.5
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1276,
                columnNumber: 27
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiText", {
                ref: noticeRef,
                alpha: 0,
                anchor: 0.5,
                text: "!",
                x: 0,
                y: -118,
                style: {
                    fill: "#BEF264",
                    fontFamily: "monospace",
                    fontSize: 26,
                    fontWeight: "900",
                    stroke: {
                        color: "#12250B",
                        width: 4
                    }
                }
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1277,
                columnNumber: 7
            }, this),
            allowBubble && (pet.state.currentBubble?.text || shouldShowBubble(selected, pet.state.mood, activity)) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
                ref: bubbleRef,
                x: 24,
                y: -96,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                        draw: drawMoodBubble(selected, bubbleKind)
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 1294,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiText", {
                        text: bubbleText,
                        x: selected ? 10 : 8,
                        y: 5,
                        style: {
                            fill: "#0B1720",
                            fontFamily: "monospace",
                            fontSize: pet.state.currentBubble?.text ? selected ? 11 : 10 : selected ? 15 : 13,
                            fontWeight: "700",
                            wordWrap: true,
                            wordWrapWidth: selected ? 100 : 88
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 1295,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1293,
                columnNumber: 9
            }, this) : null,
            showActivityLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                x: selected ? -64 : -54,
                y: selected ? 64 : 66,
                draw: (graphics)=>{
                    graphics.clear();
                    graphics.roundRect(0, 0, selected ? 128 : 108, selected ? 22 : 18, selected ? 8 : 7).fill({
                        color: toneColor.fill,
                        alpha: selected ? 0.78 : 0.64
                    }).stroke({
                        color: toneColor.stroke,
                        width: 1,
                        alpha: selected ? 0.34 : 0.22
                    });
                }
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1311,
                columnNumber: 9
            }, this) : null,
            showActivityLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiText", {
                text: selected ? `${pet.pet.name} · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityLabel"])(activity)}` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityLabel"])(activity),
                x: selected ? -58 : -48,
                y: selected ? 68 : 69,
                style: {
                    fill: toneColor.text,
                    fontFamily: "monospace",
                    fontSize: selected ? 11 : 9,
                    fontWeight: "700",
                    wordWrap: true,
                    wordWrapWidth: selected ? 112 : 94
                }
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1323,
                columnNumber: 9
            }, this) : null,
            selected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                x: -42,
                y: 84,
                draw: (graphics)=>{
                    graphics.clear();
                    graphics.roundRect(0, 0, 86, 6, 3).fill({
                        color: "#102330",
                        alpha: 0.72
                    });
                    graphics.roundRect(0, 0, 86 * (pet.state.energy / 100), 6, 3).fill({
                        color: "#BEFE5F"
                    });
                }
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1338,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/garden-canvas.tsx",
        lineNumber: 1261,
        columnNumber: 5
    }, this);
}
function drawPlayerBody(part) {
    return (graphics)=>{
        graphics.clear();
        if (part === "cloak") {
            graphics.poly([
                -16,
                -10,
                16,
                -10,
                20,
                26,
                -20,
                26
            ], true).fill({
                color: "#101B2E",
                alpha: 0.98
            });
            graphics.poly([
                -16,
                -10,
                16,
                -10,
                14,
                0,
                -14,
                0
            ], true).fill({
                color: "#182A44",
                alpha: 0.95
            });
            graphics.rect(-20, 22, 40, 4).fill({
                color: "#67E8F9",
                alpha: 0.35
            });
            return;
        }
        if (part === "torso") {
            graphics.roundRect(-13, -30, 26, 24, 9).fill({
                color: "#1E293B"
            });
            graphics.roundRect(-13, -30, 26, 8, 6).fill({
                color: "#33415C"
            });
            graphics.rect(-13, -12, 26, 2).fill({
                color: "#BEF264",
                alpha: 0.8
            });
            return;
        }
        if (part === "visor") {
            graphics.roundRect(-10, -46, 20, 18, 7).fill({
                color: "#0B1220"
            });
            graphics.roundRect(-8, -42, 16, 7, 3).fill({
                color: "#67E8F9",
                alpha: 0.95
            });
            graphics.roundRect(-8, -42, 7, 7, 3).fill({
                color: "#BEF264",
                alpha: 0.9
            });
            return;
        }
        graphics.rect(-1, -58, 2, 12).fill({
            color: "#33415C"
        });
        graphics.circle(0, -60, 3).fill({
            color: "#F472B6",
            alpha: 0.95
        });
        graphics.circle(0, -60, 7).fill({
            color: "#F472B6",
            alpha: 0.2
        });
    };
}
function drawPlayerLeg() {
    return (graphics)=>{
        graphics.clear();
        graphics.roundRect(-3.5, 0, 7, 14, 3).fill({
            color: "#0F172A"
        });
        graphics.roundRect(-4.5, 11, 9, 5, 2).fill({
            color: "#67E8F9",
            alpha: 0.8
        });
    };
}
function PlayerAvatarNode({ playerRef, displayName }) {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bodyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const leftLegRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rightLegRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const glowRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const gaitRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const facingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(1);
    const lastXRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$hooks$2f$useTick$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTick"])((ticker)=>{
        const player = playerRef.current;
        const deltaSeconds = ticker.deltaMS / 1000;
        if (!containerRef.current) {
            return;
        }
        containerRef.current.visible = true;
        containerRef.current.x = player.sceneX;
        containerRef.current.y = player.sceneY;
        containerRef.current.zIndex = player.sceneY + 0.5;
        const deltaX = player.sceneX - (lastXRef.current ?? player.sceneX);
        lastXRef.current = player.sceneX;
        if (Math.abs(deltaX) > 0.4) {
            facingRef.current = deltaX < 0 ? -1 : 1;
        }
        if (player.moving) {
            gaitRef.current += deltaSeconds * 11;
        } else {
            gaitRef.current *= 0.9;
        }
        const swing = Math.sin(gaitRef.current);
        const bob = player.moving ? Math.abs(Math.sin(gaitRef.current)) * 3 : Math.sin(ticker.lastTime / 640) * 1.2;
        if (bodyRef.current) {
            bodyRef.current.y = -bob;
            bodyRef.current.scale.x = facingRef.current;
            bodyRef.current.rotation = player.moving ? swing * 0.04 : 0;
        }
        if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.x = -6;
            rightLegRef.current.x = 6;
            leftLegRef.current.rotation = player.moving ? swing * 0.55 : 0;
            rightLegRef.current.rotation = player.moving ? -swing * 0.55 : 0;
        }
        if (glowRef.current) {
            glowRef.current.alpha = 0.5 + Math.sin(ticker.lastTime / 420) * 0.16;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
        ref: containerRef,
        visible: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                draw: drawShadow(false),
                y: 26
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1456,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                ref: glowRef,
                draw: (graphics)=>{
                    graphics.clear();
                    graphics.ellipse(0, 26, 26, 9).stroke({
                        color: "#67E8F9",
                        width: 2,
                        alpha: 0.7
                    });
                }
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1457,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
                ref: leftLegRef,
                y: 10,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                    draw: drawPlayerLeg()
                }, void 0, false, {
                    fileName: "[project]/components/garden/garden-canvas.tsx",
                    lineNumber: 1465,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1464,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
                ref: rightLegRef,
                y: 10,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                    draw: drawPlayerLeg()
                }, void 0, false, {
                    fileName: "[project]/components/garden/garden-canvas.tsx",
                    lineNumber: 1468,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1467,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
                ref: bodyRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                        draw: drawPlayerBody("cloak"),
                        y: -6
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 1471,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                        draw: drawPlayerBody("torso")
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 1472,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                        draw: drawPlayerBody("visor")
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 1473,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                        draw: drawPlayerBody("antenna")
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 1474,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1470,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiText", {
                anchor: 0.5,
                text: displayName ? `◈ ${displayName}` : "◈ 你",
                y: -74,
                style: {
                    fill: "#BEF264",
                    fontFamily: "monospace",
                    fontSize: 11,
                    fontWeight: "700",
                    stroke: {
                        color: "#0B1720",
                        width: 3
                    }
                }
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 1476,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/garden-canvas.tsx",
        lineNumber: 1455,
        columnNumber: 5
    }, this);
}
function CameraRig({ playerRef, keyboardRef, holdTargetRef, walkPathRef, cameraContainerRef, overlayWrapperRef, backdropWrapperRef, viewportSizeRef, cameraFocusRef, cameraPositionRef, onPlayerTileChange, onGateEnter }) {
    const lastTileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const gateArmedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$hooks$2f$useTick$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTick"])((ticker)=>{
        const deltaSeconds = Math.min(0.05, ticker.deltaMS / 1000);
        const player = playerRef.current;
        const keys = keyboardRef.current;
        const speed = (keys.sprint ? PLAYER_SPRINT_TILES_PER_SECOND : PLAYER_WALK_TILES_PER_SECOND) * TILE_SIZE * deltaSeconds;
        let inputX = 0;
        let inputY = 0;
        if (keys.left) {
            inputX -= 1;
        }
        if (keys.right) {
            inputX += 1;
        }
        if (keys.up) {
            inputY -= 1;
        }
        if (keys.down) {
            inputY += 1;
        }
        const hasKeyboardInput = inputX !== 0 || inputY !== 0;
        if (hasKeyboardInput) {
            walkPathRef.current = [];
            holdTargetRef.current = null;
        }
        let stepX = 0;
        let stepY = 0;
        if (hasKeyboardInput) {
            const magnitude = Math.hypot(inputX, inputY) || 1;
            stepX = inputX / magnitude * speed;
            stepY = inputY / magnitude * speed;
        } else if (holdTargetRef.current) {
            const target = holdTargetRef.current;
            const dx = target.sceneX - player.sceneX;
            const dy = target.sceneY - player.sceneY;
            const distance = Math.hypot(dx, dy);
            if (distance > 6) {
                stepX = dx / distance * Math.min(speed, distance);
                stepY = dy / distance * Math.min(speed, distance);
            }
        } else if (walkPathRef.current.length > 0) {
            let remaining = speed;
            while(remaining > 0 && walkPathRef.current.length > 0){
                const next = walkPathRef.current[0];
                const dx = next.x - player.sceneX;
                const dy = next.y - player.sceneY;
                const distance = Math.hypot(dx, dy);
                if (distance <= remaining) {
                    player.sceneX = next.x;
                    player.sceneY = next.y;
                    remaining -= distance;
                    walkPathRef.current.shift();
                } else {
                    player.sceneX += dx / distance * remaining;
                    player.sceneY += dy / distance * remaining;
                    remaining = 0;
                }
            }
        }
        const tryStep = (candidateX, candidateY)=>{
            const clampedX = Math.max(PLAYFIELD_LEFT + 8, Math.min(PLAYFIELD_RIGHT - 8, candidateX));
            const clampedY = Math.max(PLAYFIELD_TOP + 16, Math.min(PLAYFIELD_BOTTOM - 8, candidateY));
            const tileX = Math.round(toTileX(clampedX));
            const tileY = Math.round(toTileY(clampedY));
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$pathfinding$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWalkableTile"])(player.zoneId, tileX, tileY)) {
                player.sceneX = clampedX;
                player.sceneY = clampedY;
                return true;
            }
            return false;
        };
        if (stepX !== 0 || stepY !== 0) {
            if (!tryStep(player.sceneX + stepX, player.sceneY + stepY)) {
                if (!tryStep(player.sceneX + stepX, player.sceneY)) {
                    tryStep(player.sceneX, player.sceneY + stepY);
                }
            }
        }
        player.moving = stepX !== 0 || stepY !== 0 || walkPathRef.current.length > 0 || Boolean(holdTargetRef.current && Math.hypot((holdTargetRef.current?.sceneX ?? player.sceneX) - player.sceneX, (holdTargetRef.current?.sceneY ?? player.sceneY) - player.sceneY) > 6);
        const tileX = Math.round(toTileX(player.sceneX));
        const tileY = Math.round(toTileY(player.sceneY));
        player.tileX = tileX;
        player.tileY = tileY;
        if (!lastTileRef.current || tileX !== lastTileRef.current.tileX || tileY !== lastTileRef.current.tileY) {
            lastTileRef.current = {
                tileX,
                tileY
            };
            onPlayerTileChange(tileX, tileY);
        }
        // Travel gates on the east/west edges.
        const inGateBand = tileY >= GATE_BAND_MIN_TILE_Y && tileY <= GATE_BAND_MAX_TILE_Y;
        if (inGateBand && gateArmedRef.current) {
            if (tileX <= 1) {
                gateArmedRef.current = false;
                onGateEnter("west");
            } else if (tileX >= LOGICAL_COLS - 2) {
                gateArmedRef.current = false;
                onGateEnter("east");
            }
        } else if (tileX > 2 && tileX < LOGICAL_COLS - 3) {
            gateArmedRef.current = true;
        }
        // Camera follows the player (or a temporary focus target) with a lerp.
        const focus = cameraFocusRef.current;
        const focusActive = focus && Date.now() < focus.untilMs;
        const focusX = focusActive ? focus.sceneX : player.sceneX;
        const focusY = focusActive ? focus.sceneY : player.sceneY;
        if (focus && !focusActive) {
            cameraFocusRef.current = null;
        }
        const viewport = viewportSizeRef.current;
        const maxCameraX = Math.max(0, SCENE_WIDTH - viewport.width);
        const maxCameraY = Math.max(0, SCENE_HEIGHT - viewport.height);
        const desiredX = Math.max(0, Math.min(maxCameraX, focusX - viewport.width / 2));
        const desiredY = Math.max(0, Math.min(maxCameraY, focusY - viewport.height / 2));
        const camera = cameraPositionRef.current;
        camera.x += (desiredX - camera.x) * Math.min(1, CAMERA_LERP * (ticker.deltaMS / 16.6));
        camera.y += (desiredY - camera.y) * Math.min(1, CAMERA_LERP * (ticker.deltaMS / 16.6));
        const appliedX = Math.round(camera.x);
        const appliedY = Math.round(camera.y);
        if (cameraContainerRef.current) {
            cameraContainerRef.current.x = -appliedX;
            cameraContainerRef.current.y = -appliedY;
        }
        const transform = `translate3d(${-appliedX}px, ${-appliedY}px, 0)`;
        if (overlayWrapperRef.current) {
            overlayWrapperRef.current.style.transform = transform;
        }
        if (backdropWrapperRef.current) {
            backdropWrapperRef.current.style.transform = transform;
        }
    });
    return null;
}
function GardenCanvas({ autonomyOverlays: providedAutonomyOverlays, snapshot, zones, selectedPetId, selectedAutonomyRouteId, selectedEncounterId, onSelectPet, onSelectAutonomyRoute, onSelectEncounter, onOwnerAction, onOpenChat, onTravel, onPlayerTileChange, onCleanPoop, travelLocked, viewerId, viewerName }) {
    const zoneId = snapshot.zone.id;
    const renderableObjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>snapshot.objects.filter(isRenderableObject), [
        snapshot.objects
    ]);
    const sceneryObjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>snapshot.objects.filter(isSceneryObject), [
        snapshot.objects
    ]);
    const environmentActors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            ...snapshot.environmentActors
        ].sort((left, right)=>environmentLayerOrder[left.layer] - environmentLayerOrder[right.layer]), [
        snapshot.environmentActors
    ]);
    const selectedPet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>snapshot.pets.find((entry)=>entry.pet.id === selectedPetId), [
        selectedPetId,
        snapshot.pets
    ]);
    const viewportRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const overlayWrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const backdropWrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cameraContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const viewportSizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        width: 960,
        height: 540
    });
    const cameraPositionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const cameraFocusRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const holdTargetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const walkPathRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const pointerStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pendingSpawnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [actionBursts, setActionBursts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const burstIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const spawnActionBurst = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sceneX, sceneY, emoji, label)=>{
        burstIdRef.current += 1;
        const id = burstIdRef.current;
        setActionBursts((current)=>[
                ...current,
                {
                    id,
                    sceneX,
                    sceneY,
                    emoji,
                    label
                }
            ]);
        window.setTimeout(()=>{
            setActionBursts((current)=>current.filter((burst)=>burst.id !== id));
        }, 1700);
    }, []);
    const spawn = zoneSpawnTile[zoneId];
    const playerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        sceneX: toSceneX(spawn.tileX),
        sceneY: toSceneY(spawn.tileY),
        tileX: spawn.tileX,
        tileY: spawn.tileY,
        zoneId,
        moving: false
    });
    const keyboardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$use$2d$player$2d$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePlayerKeyboard"])(true);
    const [playerTile, setPlayerTile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        tileX: spawn.tileX,
        tileY: spawn.tileY
    });
    const [viewportElement, setViewportElement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [socialBubbleTick, setSocialBubbleTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>Date.now());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$use$2d$zone$2d$asset$2d$warmup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useZoneAssetWarmup"])(zoneId, snapshot.pets);
    // Respawn the avatar when the zone changes (gate travel keeps its side).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const pendingSpawn = pendingSpawnRef.current;
        const spawnTile = pendingSpawn ?? zoneSpawnTile[zoneId];
        const safeTile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$pathfinding$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNearestWalkableTile"])(zoneId, spawnTile);
        pendingSpawnRef.current = null;
        playerRef.current.zoneId = zoneId;
        playerRef.current.sceneX = toSceneX(safeTile.tileX);
        playerRef.current.sceneY = toSceneY(safeTile.tileY);
        playerRef.current.tileX = safeTile.tileX;
        playerRef.current.tileY = safeTile.tileY;
        walkPathRef.current = [];
        holdTargetRef.current = null;
        cameraFocusRef.current = null;
        const viewport = viewportSizeRef.current;
        cameraPositionRef.current = {
            x: Math.max(0, Math.min(SCENE_WIDTH - viewport.width, playerRef.current.sceneX - viewport.width / 2)),
            y: Math.max(0, Math.min(SCENE_HEIGHT - viewport.height, playerRef.current.sceneY - viewport.height / 2))
        };
        setPlayerTile({
            tileX: safeTile.tileX,
            tileY: safeTile.tileY
        });
    }, [
        zoneId
    ]);
    // Track viewport size for camera clamping.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        const viewport = viewportRef.current;
        if (!viewport) {
            return;
        }
        setViewportElement(viewport);
        const updateSize = ()=>{
            const rect = viewport.getBoundingClientRect();
            viewportSizeRef.current = {
                width: Math.max(320, Math.round(rect.width)),
                height: Math.max(280, Math.round(rect.height))
            };
        };
        updateSize();
        const observer = new ResizeObserver(updateSize);
        observer.observe(viewport);
        return ()=>{
            observer.disconnect();
        };
    }, []);
    // Briefly pan the camera to a newly selected pet, then return to the player.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!selectedPet) {
            return;
        }
        cameraFocusRef.current = {
            sceneX: toSceneX(selectedPet.state.tileX),
            sceneY: toSceneY(selectedPet.state.tileY),
            untilMs: Date.now() + 1900
        };
    // Position intentionally sampled once at selection time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedPetId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = window.setInterval(()=>{
            setSocialBubbleTick(Date.now());
        }, 1400);
        return ()=>{
            window.clearInterval(timer);
        };
    }, []);
    const activeSocialBubbleByPetId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = new Map();
        for (const event of snapshot.recentEvents){
            if (event.type !== "social_chat" || !event.socialLines?.length) {
                continue;
            }
            const elapsedMs = socialBubbleTick - new Date(event.createdAt).getTime();
            const lifetimeMs = Math.min(10000, event.socialLines.length * 1600 + 1400);
            if (elapsedMs < 0 || elapsedMs > lifetimeMs) {
                continue;
            }
            const lineIndex = Math.floor(elapsedMs / 1600) % event.socialLines.length;
            const line = event.socialLines[lineIndex];
            if (!line?.text || map.has(line.petId)) {
                continue;
            }
            map.set(line.petId, {
                text: line.text,
                kind: "speech"
            });
        }
        return map;
    }, [
        snapshot.recentEvents,
        socialBubbleTick
    ]);
    const bubblePetIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const prioritizedIds = [
            ...selectedPetId ? [
                selectedPetId
            ] : [],
            ...activeSocialBubbleByPetId.keys(),
            ...snapshot.pets.filter((entry)=>entry.state.currentBubble?.text).sort((left, right)=>{
                const leftExpiry = left.state.currentBubble?.expiresAt ?? "";
                const rightExpiry = right.state.currentBubble?.expiresAt ?? "";
                return rightExpiry.localeCompare(leftExpiry);
            }).map((entry)=>entry.pet.id)
        ];
        return new Set(prioritizedIds.filter((petId, index)=>prioritizedIds.indexOf(petId) === index).slice(0, 3));
    }, [
        activeSocialBubbleByPetId,
        selectedPetId,
        snapshot.pets
    ]);
    const autonomyOverlays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$map$2d$overlays$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildAutonomyMapOverlays"])(snapshot, selectedPetId), [
        selectedPetId,
        snapshot
    ]);
    // Route intents only materialize for the pet you're focused on — the
    // default view stays a clean world instead of a command console.
    const visibleAutonomyOverlays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const overlays = providedAutonomyOverlays ?? autonomyOverlays;
        return overlays.filter((overlay)=>overlay.id === selectedAutonomyRouteId || selectedPetId && (overlay.actorPetId === selectedPetId || overlay.targetPetId === selectedPetId));
    }, [
        autonomyOverlays,
        providedAutonomyOverlays,
        selectedAutonomyRouteId,
        selectedPetId
    ]);
    const transitionMarkers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$transition$2d$markers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildWorldTransitionMarkers"])(snapshot), [
        snapshot
    ]);
    // The single pet close enough for in-world interaction chips; own pets win ties.
    const nearbyPets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return snapshot.pets.map((entry)=>({
                entry,
                owned: Boolean(viewerId && entry.owner.id === viewerId),
                distance: Math.hypot(entry.state.tileX - playerTile.tileX, entry.state.tileY - playerTile.tileY)
            })).filter(({ distance })=>distance <= PROXIMITY_ACTION_TILES).sort((left, right)=>left.owned === right.owned ? left.distance - right.distance : left.owned ? -1 : 1).slice(0, 1).map(({ entry })=>entry);
    }, [
        playerTile.tileX,
        playerTile.tileY,
        snapshot.pets,
        viewerId
    ]);
    // Poops the avatar is standing next to — anyone can help scoop.
    const nearbyPoops = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!viewerId || !onCleanPoop) {
            return [];
        }
        return snapshot.objects.filter((object)=>object.type === "poop" && !object.removedAt && Math.hypot(object.tileX - playerTile.tileX, object.tileY - playerTile.tileY) <= 2.2).slice(0, 2);
    }, [
        onCleanPoop,
        playerTile.tileX,
        playerTile.tileY,
        snapshot.objects,
        viewerId
    ]);
    const zoneRingIndex = ZONE_TRAVEL_RING.indexOf(zoneId);
    const eastZoneId = ZONE_TRAVEL_RING[(zoneRingIndex + 1) % ZONE_TRAVEL_RING.length];
    const westZoneId = ZONE_TRAVEL_RING[(zoneRingIndex + ZONE_TRAVEL_RING.length - 1) % ZONE_TRAVEL_RING.length];
    const zoneNameById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = new Map();
        for (const zone of zones ?? []){
            map.set(zone.id, zone.name);
        }
        return map;
    }, [
        zones
    ]);
    const selectedOwnPetDistance = selectedPet ? Math.hypot(selectedPet.state.tileX - playerTile.tileX, selectedPet.state.tileY - playerTile.tileY) : null;
    const showFarCall = Boolean(selectedPet && viewerId && selectedPet.owner.id === viewerId && selectedOwnPetDistance !== null && selectedOwnPetDistance > FAR_CALL_TILES && onOwnerAction);
    const handleGateEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((direction)=>{
        if (travelLocked || !onTravel) {
            return;
        }
        const nextZoneId = direction === "east" ? eastZoneId : westZoneId;
        // Enter the next zone from the opposite gate, same latitude.
        pendingSpawnRef.current = {
            tileX: direction === "east" ? 3 : LOGICAL_COLS - 4,
            tileY: Math.max(GATE_BAND_MIN_TILE_Y, Math.min(GATE_BAND_MAX_TILE_Y, playerRef.current.tileY))
        };
        onTravel(nextZoneId);
    }, [
        eastZoneId,
        onTravel,
        travelLocked,
        westZoneId
    ]);
    const handlePlayerTileChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((tileX, tileY)=>{
        setPlayerTile((current)=>current.tileX === tileX && current.tileY === tileY ? current : {
                tileX,
                tileY
            });
        onPlayerTileChange?.(tileX, tileY);
    }, [
        onPlayerTileChange
    ]);
    const sceneCoordsFromClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((clientX, clientY)=>{
        const viewport = viewportRef.current;
        if (!viewport) {
            return {
                sceneX: 0,
                sceneY: 0
            };
        }
        const rect = viewport.getBoundingClientRect();
        return {
            sceneX: clientX - rect.left + Math.round(cameraPositionRef.current.x),
            sceneY: clientY - rect.top + Math.round(cameraPositionRef.current.y)
        };
    }, []);
    function handlePointerDown(event) {
        if (event.button !== 0 && event.pointerType === "mouse") {
            return;
        }
        pointerStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startedAt: Date.now(),
            holdActive: false
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    }
    function handlePointerMove(event) {
        const pointer = pointerStateRef.current;
        if (!pointer || pointer.pointerId !== event.pointerId) {
            return;
        }
        const drift = Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY);
        const heldMs = Date.now() - pointer.startedAt;
        if (!pointer.holdActive && (drift > HOLD_TO_MOVE_DRIFT_PX || heldMs > HOLD_TO_MOVE_MS)) {
            pointer.holdActive = true;
            walkPathRef.current = [];
        }
        if (pointer.holdActive) {
            holdTargetRef.current = sceneCoordsFromClient(event.clientX, event.clientY);
        }
    }
    function handlePointerUp(event) {
        const pointer = pointerStateRef.current;
        if (!pointer || pointer.pointerId !== event.pointerId) {
            return;
        }
        pointerStateRef.current = null;
        holdTargetRef.current = null;
        if (pointer.holdActive) {
            return;
        }
        // Tap: select a pet, otherwise walk to the tapped tile.
        const { sceneX, sceneY } = sceneCoordsFromClient(event.clientX, event.clientY);
        const clickedPet = findNearestPet(snapshot, sceneX, sceneY);
        if (clickedPet) {
            onSelectPet(clickedPet.pet.id);
            return;
        }
        const player = playerRef.current;
        const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$pathfinding$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findWalkingPath"])(zoneId, {
            tileX: player.tileX,
            tileY: player.tileY
        }, {
            tileX: Math.round(toTileX(sceneX)),
            tileY: Math.round(toTileY(sceneY))
        });
        walkPathRef.current = path.map((waypoint)=>({
                x: toSceneX(waypoint.tileX),
                y: toSceneY(waypoint.tileY)
            }));
    }
    function handlePointerCancel() {
        pointerStateRef.current = null;
        holdTargetRef.current = null;
    }
    function handleEncounterMarkerClick(marker) {
        const participantPetId = marker.participantPetIds.find((petId)=>snapshot.pets.some((entry)=>entry.pet.id === petId));
        if (participantPetId) {
            onSelectPet(participantPetId);
        }
        onSelectEncounter?.(marker.encounterId, participantPetId);
    }
    const petHasActivePoop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((petId)=>snapshot.objects.some((object)=>object.type === "poop" && object.petId === petId && !object.removedAt), [
        snapshot.objects
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: viewportRef,
                className: "garden-pixel-stage relative h-[62vh] max-h-[720px] min-h-[360px] w-full touch-none select-none overflow-hidden rounded-[32px] border border-white/10 bg-[#071018]",
                onPointerCancel: handlePointerCancel,
                onPointerDown: handlePointerDown,
                onPointerMove: handlePointerMove,
                onPointerUp: handlePointerUp,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: `linear-gradient(to bottom, ${snapshot.world.skyTop}, ${snapshot.world.skyBottom})`
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 2165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: backdropWrapperRef,
                        className: "pointer-events-none absolute left-0 top-0 will-change-transform",
                        style: {
                            height: `${SCENE_HEIGHT}px`,
                            width: `${SCENE_WIDTH}px`
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                alt: "",
                                className: "pointer-events-none block select-none object-cover opacity-45 [image-rendering:pixelated]",
                                draggable: false,
                                src: backgroundScenePath[zoneId],
                                style: {
                                    height: `${SCENE_HEIGHT}px`,
                                    width: `${SCENE_WIDTH}px`
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pointer-events-none absolute inset-0",
                                style: {
                                    background: zoneAtmosphere[zoneId]
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pointer-events-none absolute inset-0",
                                style: {
                                    background: `radial-gradient(circle at 50% 18%, ${snapshot.world.ambientGlow}, transparent 40%)`,
                                    opacity: 0.95
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2187,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pointer-events-none absolute inset-0",
                                style: {
                                    background: "#08131B",
                                    opacity: snapshot.world.overlayAlpha
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2194,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 2171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        children: viewportElement ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pixi$2f$react$2f$lib$2f$components$2f$Application$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Application"], {
                            antialias: false,
                            backgroundAlpha: 0,
                            resizeTo: viewportElement,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
                                    ref: cameraContainerRef,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                                            draw: drawTerrainLayer(zoneId, snapshot.world.overlayAlpha)
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2206,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                                            draw: drawTerrainDetailLayer(zoneId)
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2207,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                                            draw: drawStructureLayer(zoneId, snapshot.world.neonAlpha)
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2208,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                                            draw: drawGrid()
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2209,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                                            draw: drawTravelGate("west"),
                                            x: PLAYFIELD_LEFT + TILE_SIZE,
                                            y: toSceneY((GATE_BAND_MIN_TILE_Y + GATE_BAND_MAX_TILE_Y) / 2)
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2210,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiGraphics", {
                                            draw: drawTravelGate("east"),
                                            x: PLAYFIELD_RIGHT - TILE_SIZE,
                                            y: toSceneY((GATE_BAND_MIN_TILE_Y + GATE_BAND_MAX_TILE_Y) / 2)
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2215,
                                            columnNumber: 17
                                        }, this),
                                        sceneryObjects.map((object)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SceneryWorldObjectNode, {
                                                neonAlpha: snapshot.world.neonAlpha,
                                                object: object
                                            }, object.id, false, {
                                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                                lineNumber: 2222,
                                                columnNumber: 19
                                            }, this)),
                                        environmentActors.map((actor)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnvironmentActorNode, {
                                                actor: actor
                                            }, actor.id, false, {
                                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                                lineNumber: 2226,
                                                columnNumber: 19
                                            }, this)),
                                        renderableObjects.map((object)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DynamicWorldObjectNode, {
                                                object: object
                                            }, object.id, false, {
                                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                                lineNumber: 2230,
                                                columnNumber: 19
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pixiContainer", {
                                            sortableChildren: true,
                                            children: [
                                                snapshot.pets.map((pet)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PetSpriteNode, {
                                                        allowBubble: bubblePetIds.has(pet.pet.id),
                                                        pet: pet,
                                                        playerRef: playerRef,
                                                        selected: pet.pet.id === selectedPetId,
                                                        socialBubble: activeSocialBubbleByPetId.get(pet.pet.id),
                                                        viewerOwnsPet: Boolean(viewerId && pet.owner.id === viewerId)
                                                    }, pet.pet.id, false, {
                                                        fileName: "[project]/components/garden/garden-canvas.tsx",
                                                        lineNumber: 2235,
                                                        columnNumber: 21
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlayerAvatarNode, {
                                                    displayName: viewerName,
                                                    playerRef: playerRef
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                                    lineNumber: 2245,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2233,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                    lineNumber: 2205,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraRig, {
                                    backdropWrapperRef: backdropWrapperRef,
                                    cameraContainerRef: cameraContainerRef,
                                    cameraFocusRef: cameraFocusRef,
                                    cameraPositionRef: cameraPositionRef,
                                    holdTargetRef: holdTargetRef,
                                    keyboardRef: keyboardRef,
                                    onGateEnter: handleGateEnter,
                                    onPlayerTileChange: handlePlayerTileChange,
                                    overlayWrapperRef: overlayWrapperRef,
                                    playerRef: playerRef,
                                    viewportSizeRef: viewportSizeRef,
                                    walkPathRef: walkPathRef
                                }, void 0, false, {
                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                    lineNumber: 2248,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/garden/garden-canvas.tsx",
                            lineNumber: 2204,
                            columnNumber: 13
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 2202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: overlayWrapperRef,
                        className: "pointer-events-none absolute left-0 top-0 will-change-transform",
                        style: {
                            height: `${SCENE_HEIGHT}px`,
                            width: `${SCENE_WIDTH}px`
                        },
                        children: [
                            visibleAutonomyOverlays.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                "aria-hidden": "true",
                                className: "pointer-events-none absolute inset-0",
                                "data-testid": "autonomy-map-routes",
                                height: SCENE_HEIGHT,
                                viewBox: `0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`,
                                width: SCENE_WIDTH,
                                children: visibleAutonomyOverlays.map((overlay)=>{
                                    const toneColor = activityToneColors[overlay.tone];
                                    const selected = selectedAutonomyRouteId === overlay.id || selectedPetId === overlay.actorPetId || selectedPetId === overlay.targetPetId;
                                    const start = routeEndpoint(overlay, "start");
                                    const target = routeEndpoint(overlay, "target");
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        "data-testid": "autonomy-map-route",
                                        opacity: selected ? 0.92 : 0.58,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: routePath(overlay),
                                                fill: "none",
                                                stroke: toneColor.stroke,
                                                strokeDasharray: "12 13",
                                                strokeLinecap: "round",
                                                strokeWidth: selected ? 5 : 3
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                                lineNumber: 2289,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: start.x,
                                                cy: start.y,
                                                fill: toneColor.stroke,
                                                opacity: "0.9",
                                                r: selected ? 6 : 4
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                                lineNumber: 2297,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: target.x,
                                                cy: target.y,
                                                fill: toneColor.fill,
                                                r: selected ? 12 : 10,
                                                stroke: toneColor.stroke,
                                                strokeWidth: "3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                                lineNumber: 2298,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, overlay.id, true, {
                                        fileName: "[project]/components/garden/garden-canvas.tsx",
                                        lineNumber: 2288,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2271,
                                columnNumber: 13
                            }, this) : null,
                            visibleAutonomyOverlays.map((overlay)=>{
                                const toneColor = activityToneColors[overlay.tone];
                                const selected = selectedAutonomyRouteId === overlay.id || selectedPetId === overlay.actorPetId || selectedPetId === overlay.targetPetId;
                                const start = routeEndpoint(overlay, "start");
                                const target = routeEndpoint(overlay, "target");
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pointer-events-none absolute inset-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "aria-label": `Track ${overlay.actorName}: ${overlay.routeLabel}`,
                                            className: "pointer-events-auto absolute flex max-w-[15rem] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 text-left text-[11px] font-semibold shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,border-color,box-shadow] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200",
                                            "data-actor-pet-id": overlay.actorPetId,
                                            "data-testid": "autonomy-map-intent",
                                            onClick: (event)=>{
                                                event.stopPropagation();
                                                onSelectAutonomyRoute?.(overlay.id);
                                                onSelectPet(overlay.actorPetId);
                                            },
                                            onPointerDown: (event)=>event.stopPropagation(),
                                            style: {
                                                backgroundColor: toneColor.fill,
                                                borderColor: toneColor.stroke,
                                                boxShadow: selected ? `0 0 0 2px ${toneColor.stroke}, 0 14px 40px rgba(0,0,0,0.28)` : undefined,
                                                color: toneColor.text,
                                                left: `${start.x}px`,
                                                top: `${start.y - 56}px`
                                            },
                                            title: overlay.reason,
                                            type: "button",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__["Route"], {
                                                    "aria-hidden": "true",
                                                    className: "h-3.5 w-3.5 shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                                    lineNumber: 2346,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: overlay.routeLabel
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                                    lineNumber: 2347,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2322,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "aria-label": `Locate ${overlay.targetLabel}`,
                                            className: "pointer-events-auto absolute flex max-w-[12rem] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 text-left text-[11px] font-semibold shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,border-color,box-shadow] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200",
                                            "data-actor-pet-id": overlay.actorPetId,
                                            "data-target-kind": overlay.targetKind,
                                            "data-target-pet-id": overlay.targetPetId,
                                            "data-testid": "autonomy-map-marker",
                                            onClick: (event)=>{
                                                event.stopPropagation();
                                                onSelectAutonomyRoute?.(overlay.id);
                                                onSelectPet(overlay.targetPetId ?? overlay.actorPetId);
                                            },
                                            onPointerDown: (event)=>event.stopPropagation(),
                                            style: {
                                                backgroundColor: toneColor.fill,
                                                borderColor: toneColor.stroke,
                                                color: toneColor.text,
                                                left: `${target.x}px`,
                                                top: `${target.y - 66}px`
                                            },
                                            title: overlay.reason,
                                            type: "button",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                    "aria-hidden": "true",
                                                    className: "h-3.5 w-3.5 shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                                    lineNumber: 2372,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: overlay.targetLabel
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                                    lineNumber: 2373,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2349,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, `${overlay.id}-buttons`, true, {
                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                    lineNumber: 2321,
                                    columnNumber: 15
                                }, this);
                            }),
                            transitionMarkers.map((marker)=>{
                                const selected = selectedPetId === marker.petId;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "aria-label": `Focus ${marker.petName}: ${marker.title}`,
                                    className: `pointer-events-auto absolute flex max-w-[12rem] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-cyan-100/80 bg-[#071B24]/88 px-3 py-2 text-left text-[11px] font-black uppercase tracking-[0.16em] text-cyan-50 shadow-[0_14px_44px_rgba(34,211,238,0.22)] backdrop-blur-md transition-[transform,border-color,box-shadow] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${selected ? "scale-105 ring-2 ring-lime-200/80" : ""}`,
                                    "data-event-id": marker.eventId,
                                    "data-pet-id": marker.petId,
                                    "data-testid": "world-transition-marker",
                                    onClick: (event)=>{
                                        event.stopPropagation();
                                        onSelectPet(marker.petId);
                                    },
                                    onPointerDown: (event)=>event.stopPropagation(),
                                    style: {
                                        left: `${toSceneX(marker.tileX) + marker.offsetX}px`,
                                        top: `${toSceneY(marker.tileY) - 92 + marker.offsetY}px`
                                    },
                                    title: marker.summary,
                                    type: "button",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            "aria-hidden": "true",
                                            className: "h-3.5 w-3.5 shrink-0 text-lime-200"
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2403,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: [
                                                "到达 · ",
                                                marker.petName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2404,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, marker.id, true, {
                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                    lineNumber: 2382,
                                    columnNumber: 15
                                }, this);
                            }),
                            snapshot.encounterMarkers.map((marker)=>{
                                const selected = selectedEncounterId === marker.encounterId;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "aria-label": `Inspect encounter: ${marker.title}`,
                                    className: `pointer-events-auto absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm transition-[transform,border-color,background-color,box-shadow] hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${encounterMarkerToneStyles[marker.tone]} ${selected ? "scale-110 ring-2 ring-white/70" : ""}`,
                                    onClick: (event)=>{
                                        event.stopPropagation();
                                        handleEncounterMarkerClick(marker);
                                    },
                                    onPointerDown: (event)=>event.stopPropagation(),
                                    style: {
                                        left: `${toSceneX(marker.tileX)}px`,
                                        top: `${toSceneY(marker.tileY) - 66}px`
                                    },
                                    title: marker.title,
                                    type: "button",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute h-16 w-16 rounded-full border border-current opacity-20"
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2429,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono text-lg font-black leading-none",
                                            children: marker.tone === "conflict" ? "!" : marker.tone === "social" ? "+" : "?"
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2430,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, marker.id, true, {
                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                    lineNumber: 2411,
                                    columnNumber: 15
                                }, this);
                            }),
                            nearbyPets.map((entry)=>{
                                const ownsPet = Boolean(viewerId && entry.owner.id === viewerId);
                                const chipX = toSceneX(entry.state.tileX);
                                const chipY = toSceneY(entry.state.tileY) - 118;
                                const burstAt = (emoji, label)=>spawnActionBurst(chipX, toSceneY(entry.state.tileY) - 58, emoji, label);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pointer-events-none absolute flex -translate-x-1/2 flex-col items-center gap-1.5",
                                    "data-testid": "proximity-action-chips",
                                    style: {
                                        left: `${chipX}px`,
                                        top: `${chipY}px`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-full border border-lime-200/40 bg-[#0B1E12]/85 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lime-100 backdrop-blur-sm",
                                            children: [
                                                entry.pet.name,
                                                " · ",
                                                entry.growth?.stageLabel ?? "数据幼体",
                                                " · 羁绊 ",
                                                entry.growth?.bond ?? 0
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2450,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pointer-events-auto flex flex-wrap items-center justify-center gap-1.5",
                                            children: ownsPet && onOwnerAction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "rounded-full border border-amber-200/60 bg-amber-400/20 px-3 py-1.5 text-[11px] font-bold text-amber-50 backdrop-blur-md transition-transform hover:scale-105",
                                                        onClick: (event)=>{
                                                            event.stopPropagation();
                                                            burstAt("🍖", "饱食度回升");
                                                            onOwnerAction({
                                                                petId: entry.pet.id,
                                                                action: "feed"
                                                            });
                                                        },
                                                        onPointerDown: (event)=>event.stopPropagation(),
                                                        type: "button",
                                                        children: "🍖 喂食"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/garden-canvas.tsx",
                                                        lineNumber: 2456,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "rounded-full border border-cyan-200/60 bg-cyan-400/20 px-3 py-1.5 text-[11px] font-bold text-cyan-50 backdrop-blur-md transition-transform hover:scale-105",
                                                        onClick: (event)=>{
                                                            event.stopPropagation();
                                                            burstAt("💚", "羁绊加深");
                                                            onOwnerAction({
                                                                petId: entry.pet.id,
                                                                action: "pet"
                                                            });
                                                        },
                                                        onPointerDown: (event)=>event.stopPropagation(),
                                                        type: "button",
                                                        children: "🤲 抚摸"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/garden-canvas.tsx",
                                                        lineNumber: 2468,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "rounded-full border border-lime-200/60 bg-lime-400/20 px-3 py-1.5 text-[11px] font-bold text-lime-50 backdrop-blur-md transition-transform hover:scale-105",
                                                        onClick: (event)=>{
                                                            event.stopPropagation();
                                                            burstAt("🎾", "玩具时间");
                                                            onOwnerAction({
                                                                petId: entry.pet.id,
                                                                action: "throw_toy"
                                                            });
                                                        },
                                                        onPointerDown: (event)=>event.stopPropagation(),
                                                        type: "button",
                                                        children: "🎾 玩具"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/garden-canvas.tsx",
                                                        lineNumber: 2480,
                                                        columnNumber: 23
                                                    }, this),
                                                    petHasActivePoop(entry.pet.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "rounded-full border border-rose-200/60 bg-rose-400/20 px-3 py-1.5 text-[11px] font-bold text-rose-50 backdrop-blur-md transition-transform hover:scale-105",
                                                        onClick: (event)=>{
                                                            event.stopPropagation();
                                                            burstAt("✨", "清理干净");
                                                            onOwnerAction({
                                                                petId: entry.pet.id,
                                                                action: "clean_poop"
                                                            });
                                                        },
                                                        onPointerDown: (event)=>event.stopPropagation(),
                                                        type: "button",
                                                        children: "🧹 清理"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/garden-canvas.tsx",
                                                        lineNumber: 2493,
                                                        columnNumber: 25
                                                    }, this) : null,
                                                    onOpenChat ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition-transform hover:scale-105",
                                                        onClick: (event)=>{
                                                            event.stopPropagation();
                                                            onOpenChat(entry.pet.id);
                                                        },
                                                        onPointerDown: (event)=>event.stopPropagation(),
                                                        type: "button",
                                                        children: "💬 聊天"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/garden-canvas.tsx",
                                                        lineNumber: 2507,
                                                        columnNumber: 25
                                                    }, this) : null
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "rounded-full border border-cyan-200/60 bg-cyan-400/20 px-3 py-1.5 text-[11px] font-bold text-cyan-50 backdrop-blur-md transition-transform hover:scale-105",
                                                onClick: (event)=>{
                                                    event.stopPropagation();
                                                    onSelectPet(entry.pet.id);
                                                },
                                                onPointerDown: (event)=>event.stopPropagation(),
                                                type: "button",
                                                children: "👋 打招呼"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                                lineNumber: 2521,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2453,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, `proximity-${entry.pet.id}`, true, {
                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                    lineNumber: 2444,
                                    columnNumber: 15
                                }, this);
                            }),
                            nearbyPoops.map((object)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "pointer-events-auto absolute flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-amber-200/60 bg-[#241505]/90 px-3 py-1.5 text-[11px] font-bold text-amber-100 backdrop-blur-md transition-transform hover:scale-105",
                                    "data-testid": "poop-clean-chip",
                                    onClick: (event)=>{
                                        event.stopPropagation();
                                        spawnActionBurst(toSceneX(object.tileX), toSceneY(object.tileY) - 26, "✨", "清理干净");
                                        onCleanPoop?.(object.id);
                                    },
                                    onPointerDown: (event)=>event.stopPropagation(),
                                    style: {
                                        left: `${toSceneX(object.tileX)}px`,
                                        top: `${toSceneY(object.tileY) - 44}px`
                                    },
                                    type: "button",
                                    children: "🧹 铲屎"
                                }, `poop-${object.id}`, false, {
                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                    lineNumber: 2538,
                                    columnNumber: 13
                                }, this)),
                            actionBursts.map((burst)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "garden-action-burst pointer-events-none absolute flex flex-col items-center",
                                    style: {
                                        left: `${burst.sceneX}px`,
                                        top: `${burst.sceneY}px`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-3xl leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]",
                                            children: burst.emoji
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2563,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-1 rounded-full bg-[#0B1E12]/85 px-2 py-0.5 font-mono text-[10px] font-bold text-lime-100",
                                            children: burst.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-canvas.tsx",
                                            lineNumber: 2564,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, burst.id, true, {
                                    fileName: "[project]/components/garden/garden-canvas.tsx",
                                    lineNumber: 2558,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pointer-events-none absolute flex -translate-x-1/2 items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/85",
                                style: {
                                    left: `${PLAYFIELD_LEFT + TILE_SIZE * 2.4}px`,
                                    top: `${toSceneY((GATE_BAND_MIN_TILE_Y + GATE_BAND_MAX_TILE_Y) / 2) - 74}px`
                                },
                                children: [
                                    "← ",
                                    zoneNameById.get(westZoneId) ?? westZoneId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2569,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pointer-events-none absolute flex -translate-x-1/2 items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/85",
                                style: {
                                    left: `${PLAYFIELD_RIGHT - TILE_SIZE * 2.4}px`,
                                    top: `${toSceneY((GATE_BAND_MIN_TILE_Y + GATE_BAND_MAX_TILE_Y) / 2) - 74}px`
                                },
                                children: [
                                    zoneNameById.get(eastZoneId) ?? eastZoneId,
                                    " →"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2578,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 2265,
                        columnNumber: 9
                    }, this),
                    showFarCall && selectedPet ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-4 left-1/2 z-10 -translate-x-1/2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "pointer-events-auto rounded-full border border-lime-200/70 bg-[#101F0C]/90 px-5 py-2.5 text-sm font-bold text-lime-100 shadow-[0_14px_44px_rgba(190,242,100,0.25)] backdrop-blur-md transition-transform hover:scale-105",
                            onClick: (event)=>{
                                event.stopPropagation();
                                spawnActionBurst(playerRef.current.sceneX, playerRef.current.sceneY - 70, "📣", `呼唤 ${selectedPet.pet.name}`);
                                onOwnerAction?.({
                                    petId: selectedPet.pet.id,
                                    action: "call"
                                });
                            },
                            onPointerDown: (event)=>event.stopPropagation(),
                            type: "button",
                            children: [
                                "📣 呼唤 ",
                                selectedPet.pet.name,
                                " 过来"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/garden/garden-canvas.tsx",
                            lineNumber: 2590,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 2589,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-fit rounded-full border border-cyan-300/25 bg-[#07131B]/80 px-3 py-1 font-mono text-xs text-cyan-50 backdrop-blur-sm",
                                children: [
                                    snapshot.world.clockLabel,
                                    " · ",
                                    snapshot.world.phase
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2610,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-fit rounded-full border border-white/12 bg-[#07131B]/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm",
                                children: [
                                    snapshot.zone.name,
                                    " · ",
                                    snapshot.pets.length,
                                    " pets"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-canvas.tsx",
                                lineNumber: 2613,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 2609,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-none absolute bottom-4 right-4 z-10 hidden rounded-full border border-white/12 bg-[#07131B]/75 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 backdrop-blur-sm md:block",
                        children: "WASD / 方向键移动 · 点击地面走过去 · 走近宠物互动"
                    }, void 0, false, {
                        fileName: "[project]/components/garden/garden-canvas.tsx",
                        lineNumber: 2617,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 2156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-[0.22em] text-white/38",
                children: [
                    LOGICAL_COLS,
                    "x",
                    LOGICAL_ROWS,
                    " 花园世界 · ",
                    snapshot.world.phase,
                    " · ",
                    snapshot.world.clockLabel,
                    " · ",
                    snapshot.world.ambienceLabel
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/garden-canvas.tsx",
                lineNumber: 2621,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/garden-canvas.tsx",
        lineNumber: 2155,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/narrative-feed.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NarrativeFeed",
    ()=>NarrativeFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$speech$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/speech-bubble.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function eventMoodBadge(event) {
    switch(event.emotion){
        case "playful":
            return "✦";
        case "grumpy":
            return "↯";
        case "sleepy":
            return "z";
        case "lonely":
            return "…";
        case "dirty":
            return "≈";
        case "curious":
            return "?";
        case "happy":
        default:
            return "•";
    }
}
const toneStyles = {
    social: "border-cyan-300/18 bg-cyan-300/[0.07]",
    conflict: "border-rose-300/22 bg-rose-300/[0.07]",
    rest: "border-violet-300/18 bg-violet-300/[0.07]",
    care: "border-lime-300/18 bg-lime-300/[0.07]",
    explore: "border-amber-300/18 bg-amber-300/[0.07]",
    neutral: "border-white/8 bg-white/[0.035]"
};
function toneForEvent(event, pet) {
    if (event.type === "scuffle" || event.type === "chased") {
        return "conflict";
    }
    if (event.type === "social_chat" || event.type === "bonded") {
        return "social";
    }
    if (event.type === "slept") {
        return "rest";
    }
    if (event.type === "pooped" || event.type === "groomed") {
        return "care";
    }
    if (event.type === "zone_move" || event.type === "climbed_tree" || event.type === "watched_fish" || event.type === "dug") {
        return "explore";
    }
    return pet ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityTone"])(pet.state.activity) : "neutral";
}
function NarrativeFeed({ events, pets, transport, zoneId, onSelectPet }) {
    const petMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new Map(pets.map((entry)=>[
                entry.pet.id,
                entry
            ])), [
        pets
    ]);
    const transportLabel = transport === "live" ? "Live Narrative Feed" : transport === "polling" ? "Polling Narrative Feed" : "Narrative Feed Paused";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-white",
                                children: "World Feed"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs uppercase tracking-[0.2em] text-white/35",
                                children: zoneId
                            }, void 0, false, {
                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/narrative-feed.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42",
                        children: transportLabel
                    }, void 0, false, {
                        fileName: "[project]/components/garden/narrative-feed.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/narrative-feed.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        initial: false,
                        children: events.map((event)=>{
                            const pet = petMap.get(event.petId);
                            const relatedPet = event.relatedPetId ? petMap.get(event.relatedPetId) : undefined;
                            const tone = toneForEvent(event, pet);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    y: 10
                                },
                                initial: {
                                    opacity: 0,
                                    y: 10
                                },
                                transition: {
                                    duration: 0.16,
                                    ease: "easeOut"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("ease-smooth motion-fast cursor-pointer rounded-[22px] border p-3 transition-[background-color,border-color,transform] hover:-translate-y-0.5", toneStyles[tone]),
                                    onClick: ()=>{
                                        if (pet) {
                                            onSelectPet(pet.pet.id);
                                        }
                                    },
                                    onKeyDown: (keyboardEvent)=>{
                                        if ((keyboardEvent.key === "Enter" || keyboardEvent.key === " ") && pet) {
                                            keyboardEvent.preventDefault();
                                            onSelectPet(pet.pet.id);
                                        }
                                    },
                                    role: "button",
                                    tabIndex: 0,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex shrink-0 -space-x-2",
                                                children: [
                                                    pet?.generation.worldSpritePath ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        "aria-label": `Select ${pet.pet.name}`,
                                                        onClick: (clickEvent)=>{
                                                            clickEvent.stopPropagation();
                                                            onSelectPet(event.petId);
                                                        },
                                                        type: "button",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            alt: pet.pet.name,
                                                            className: "h-11 w-11 rounded-2xl border border-white/10 bg-black/35 object-contain p-1 [image-rendering:pixelated]",
                                                            src: pet.generation.worldSpritePath
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/garden/narrative-feed.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/narrative-feed.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 25
                                                    }, this) : null,
                                                    relatedPet?.generation.worldSpritePath ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        "aria-label": `Select ${relatedPet.pet.name}`,
                                                        onClick: (clickEvent)=>{
                                                            clickEvent.stopPropagation();
                                                            onSelectPet(relatedPet.pet.id);
                                                        },
                                                        type: "button",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            alt: relatedPet.pet.name,
                                                            className: "h-11 w-11 rounded-2xl border border-cyan-300/20 bg-black/35 object-contain p-1 [image-rendering:pixelated]",
                                                            src: relatedPet.generation.worldSpritePath
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/garden/narrative-feed.tsx",
                                                            lineNumber: 159,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/narrative-feed.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 25
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                                lineNumber: 133,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start justify-between gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "truncate text-sm font-semibold text-white/86",
                                                                        children: [
                                                                            pet?.pet.name ?? "Unknown",
                                                                            " ",
                                                                            relatedPet ? `× ${relatedPet.pet.name}` : ""
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/garden/narrative-feed.tsx",
                                                                        lineNumber: 171,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-1 flex flex-wrap items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "inline-flex h-5 w-5 items-center justify-center rounded-full border border-lime-300/18 bg-lime-300/[0.08] text-[10px] text-lime-50",
                                                                                children: eventMoodBadge(event)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                                                                lineNumber: 175,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] uppercase tracking-[0.2em] text-white/35",
                                                                                children: event.type
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                                                                lineNumber: 178,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/garden/narrative-feed.tsx",
                                                                        lineNumber: 174,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                                                lineNumber: 170,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "shrink-0 text-[10px] uppercase tracking-[0.16em] text-white/35",
                                                                suppressHydrationWarning: true,
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRelativeTime"])(event.createdAt)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                                                lineNumber: 181,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/garden/narrative-feed.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-2 text-sm leading-6 text-white/72",
                                                        children: event.body
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/narrative-feed.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 23
                                                    }, this),
                                                    event.socialLines?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 flex flex-wrap gap-2",
                                                        children: event.socialLines.map((line, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$speech$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpeechBubble"], {
                                                                className: index % 2 === 0 ? "" : "border-lime-300/18 bg-lime-300/[0.08] text-lime-50",
                                                                kind: "speech",
                                                                text: line.text
                                                            }, `${event.id}-${line.petId}-${index}`, false, {
                                                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                                                lineNumber: 191,
                                                                columnNumber: 29
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/narrative-feed.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 25
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/narrative-feed.tsx",
                                        lineNumber: 132,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/garden/narrative-feed.tsx",
                                    lineNumber: 113,
                                    columnNumber: 17
                                }, this)
                            }, event.id, false, {
                                fileName: "[project]/components/garden/narrative-feed.tsx",
                                lineNumber: 106,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/garden/narrative-feed.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    events.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48",
                        children: "这个分区暂时很安静。"
                    }, void 0, false, {
                        fileName: "[project]/components/garden/narrative-feed.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/narrative-feed.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/narrative-feed.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/rendering/palette-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clampChannel",
    ()=>clampChannel,
    "colorDistance",
    ()=>colorDistance,
    "darkenHex",
    ()=>darkenHex,
    "hexToRgb",
    ()=>hexToRgb,
    "lightenHex",
    ()=>lightenHex,
    "lightnessOf",
    ()=>lightnessOf,
    "rgbToHex",
    ()=>rgbToHex,
    "saturationOf",
    ()=>saturationOf
]);
function clampChannel(value) {
    return Math.max(0, Math.min(255, Math.round(value)));
}
function rgbToHex(color) {
    const part = (value)=>clampChannel(value).toString(16).padStart(2, "0");
    return `#${part(color.r)}${part(color.g)}${part(color.b)}`.toUpperCase();
}
function hexToRgb(hex) {
    const match = hex.trim().match(/^#?([0-9a-f]{6})$/i);
    if (!match) {
        return null;
    }
    const value = parseInt(match[1], 16);
    return {
        r: value >> 16 & 0xff,
        g: value >> 8 & 0xff,
        b: value & 0xff
    };
}
function darkenHex(hex, amount) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return hex;
    }
    const factor = 1 - Math.max(0, Math.min(1, amount));
    return rgbToHex({
        r: rgb.r * factor,
        g: rgb.g * factor,
        b: rgb.b * factor
    });
}
function lightenHex(hex, amount) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return hex;
    }
    const mix = Math.max(0, Math.min(1, amount));
    return rgbToHex({
        r: rgb.r + (255 - rgb.r) * mix,
        g: rgb.g + (255 - rgb.g) * mix,
        b: rgb.b + (255 - rgb.b) * mix
    });
}
function colorDistance(left, right) {
    return Math.hypot(left.r - right.r, left.g - right.g, left.b - right.b);
}
function saturationOf(color) {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    if (max === 0) {
        return 0;
    }
    return (max - min) / max;
}
function lightnessOf(color) {
    return (Math.max(color.r, color.g, color.b) + Math.min(color.r, color.g, color.b)) / 2 / 255;
}
}),
"[project]/lib/client/photo-palette.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractPetPalette",
    ()=>extractPetPalette
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$palette$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rendering/palette-utils.ts [app-ssr] (ecmascript)");
"use client";
;
const SAMPLE_SIZE = 40;
const QUANT_STEP = 24;
function loadBitmap(file) {
    if (typeof createImageBitmap === "function") {
        return createImageBitmap(file);
    }
    return new Promise((resolve, reject)=>{
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = ()=>{
            URL.revokeObjectURL(url);
            resolve(image);
        };
        image.onerror = ()=>{
            URL.revokeObjectURL(url);
            reject(new Error("image-load-failed"));
        };
        image.src = url;
    });
}
async function extractPetPalette(file) {
    try {
        const bitmap = await loadBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const context = canvas.getContext("2d");
        if (!context) {
            return null;
        }
        context.drawImage(bitmap, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const bins = new Map();
        const center = (SAMPLE_SIZE - 1) / 2;
        for(let y = 0; y < SAMPLE_SIZE; y += 1){
            for(let x = 0; x < SAMPLE_SIZE; x += 1){
                const offset = (y * SAMPLE_SIZE + x) * 4;
                const alpha = data[offset + 3];
                if (alpha < 120) {
                    continue;
                }
                const color = {
                    r: data[offset],
                    g: data[offset + 1],
                    b: data[offset + 2]
                };
                const radial = Math.hypot(x - center, y - center) / center;
                const centerWeight = radial < 0.45 ? 1 : radial < 0.75 ? 0.55 : 0.18;
                const saturation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$palette$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saturationOf"])(color);
                const lightness = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$palette$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lightnessOf"])(color);
                // Near-black shadows and blown-out highlights say little about fur.
                if (lightness < 0.08 || lightness > 0.96) {
                    continue;
                }
                const score = centerWeight * (0.35 + saturation);
                const key = [
                    Math.round(color.r / QUANT_STEP),
                    Math.round(color.g / QUANT_STEP),
                    Math.round(color.b / QUANT_STEP)
                ].join(":");
                const bin = bins.get(key) ?? {
                    count: 0,
                    weightedScore: 0,
                    sum: {
                        r: 0,
                        g: 0,
                        b: 0
                    }
                };
                bin.count += 1;
                bin.weightedScore += score;
                bin.sum.r += color.r;
                bin.sum.g += color.g;
                bin.sum.b += color.b;
                bins.set(key, bin);
            }
        }
        const ranked = [
            ...bins.values()
        ].filter((bin)=>bin.count >= 4).map((bin)=>({
                score: bin.weightedScore,
                color: {
                    r: bin.sum.r / bin.count,
                    g: bin.sum.g / bin.count,
                    b: bin.sum.b / bin.count
                }
            })).sort((left, right)=>right.score - left.score);
        if (ranked.length === 0) {
            return null;
        }
        const fur = ranked[0].color;
        const secondary = ranked.find((entry)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$palette$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["colorDistance"])(entry.color, fur) > 64)?.color;
        const furHex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$palette$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rgbToHex"])(fur);
        const stripeHex = secondary ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$palette$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rgbToHex"])(secondary) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$palette$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["darkenHex"])(furHex, 0.32);
        return {
            fur: furHex,
            stripe: stripeHex,
            inner: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rendering$2f$palette$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rgbToHex"])({
                r: fur.r + (255 - fur.r) * 0.55,
                g: fur.g + (255 - fur.g) * 0.55,
                b: fur.b + (255 - fur.b) * 0.55
            }),
            accent: "#F472B6"
        };
    } catch  {
        return null;
    }
}
}),
"[project]/components/forms/cyber-forms.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminReportActions",
    ()=>AdminReportActions,
    "CreatePetForm",
    ()=>CreatePetForm,
    "OwnerActionButtons",
    ()=>OwnerActionButtons,
    "ProfileSetupForm",
    ()=>ProfileSetupForm,
    "RegeneratePetSpriteForm",
    ()=>RegeneratePetSpriteForm,
    "ReportForm",
    ()=>ReportForm,
    "SignInForm",
    ()=>SignInForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-ssr] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gift.js [app-ssr] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hand.js [app-ssr] (ecmascript) <export default as Hand>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/megaphone.js [app-ssr] (ecmascript) <export default as Megaphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-ssr] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-ssr] (ecmascript) <export default as Utensils>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/field.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/perf.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$photo$2d$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/photo-palette.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
function useApiForm() {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    function resetStatus() {
        setMessage(null);
        setError(null);
    }
    function handleFailure(value) {
        setError(value instanceof Error ? value.message : "请求失败，请稍后重试。");
    }
    return {
        message,
        error,
        setMessage,
        setError,
        resetStatus,
        handleFailure
    };
}
function stageLabel(stage) {
    switch(stage){
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
function StepPill({ active, done, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `ease-smooth motion-fast rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition-[background-color,border-color,color] ${active ? "border-cyan-300/40 bg-cyan-300/[0.12] text-cyan-50" : done ? "border-lime-300/30 bg-lime-300/[0.08] text-lime-100" : "border-white/8 bg-white/[0.03] text-white/40"}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
function CreatePetStepper({ stage }) {
    const stageOrder = [
        "creating-pet",
        "uploading-photo",
        "generating-avatar",
        "redirecting"
    ];
    const currentIndex = stageOrder.indexOf(stage);
    if (stage === "idle") {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepPill, {
                active: currentIndex === 0,
                done: currentIndex > 0,
                label: "创建"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepPill, {
                active: currentIndex === 1,
                done: currentIndex > 1,
                label: "上传"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepPill, {
                active: currentIndex === 2,
                done: currentIndex > 2,
                label: "生成"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepPill, {
                active: currentIndex === 3,
                done: false,
                label: "跳转"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
function CreatePetForm() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNavigating, startNavigation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const [stage, setStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const perfMarkRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { message, error, setMessage, resetStatus, handleFailure } = useApiForm();
    async function onSubmit(formData) {
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfStart);
            const name = String(formData.get("name") ?? "");
            const species = String(formData.get("species") ?? "");
            const breed = String(formData.get("breed") ?? "");
            const bio = String(formData.get("bio") ?? "");
            const visibility = String(formData.get("visibility") ?? "public");
            const photo = formData.get("photo");
            const petResponse = await fetch("/api/pets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    species,
                    breed,
                    bio,
                    visibility
                })
            });
            const petPayload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(petResponse, "创建宠物失败。");
            if (!(photo instanceof File) || photo.size === 0) {
                throw new Error("请先上传一张宠物照片。");
            }
            setStage("uploading-photo");
            const uploadPayload = new FormData();
            uploadPayload.append("photo", photo);
            // Sample the photo's dominant colors so the sprite matches the real pet.
            const palette = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$photo$2d$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractPetPalette"])(photo);
            if (palette) {
                uploadPayload.append("palette", JSON.stringify(palette));
            }
            const uploadResponse = await fetch(`/api/pets/${petPayload.pet.id}/source-photo`, {
                method: "POST",
                body: uploadPayload
            });
            const uploadJson = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(uploadResponse, "上传照片失败。");
            setStage("generating-avatar");
            const generationResponse = await fetch(`/api/pets/${petPayload.pet.id}/generations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sourcePhotoId: uploadJson.sourcePhoto.id
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(generationResponse, "生成像素宠物失败。");
            setMessage("像素宠物已经送进花园。");
            setStage("redirecting");
            const href = `/pets/${petPayload.pet.id}`;
            router.prefetch(href);
            redirecting = true;
            if (perfMarkRef.current) {
                const perfEnd = `create-pet:ready:${petPayload.pet.id}:${Date.now()}`;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfEnd);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])("create-pet-submit", perfMarkRef.current, perfEnd);
            }
            startNavigation(()=>{
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: onSubmit,
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CreatePetStepper, {
                stage: stage
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 md:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                htmlFor: "name",
                                label: "宠物名字"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                id: "name",
                                name: "name",
                                placeholder: "Nyx / Miso / Cipher",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                htmlFor: "species",
                                label: "物种"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 225,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectInput"], {
                                defaultValue: "cat",
                                id: "species",
                                name: "species",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "cat",
                                        children: "猫"
                                    }, void 0, false, {
                                        fileName: "[project]/components/forms/cyber-forms.tsx",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "dog",
                                        children: "狗"
                                    }, void 0, false, {
                                        fileName: "[project]/components/forms/cyber-forms.tsx",
                                        lineNumber: 228,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                htmlFor: "breed",
                                hint: "可选",
                                label: "品种"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                id: "breed",
                                name: "breed",
                                placeholder: "Bombay / Shiba / Mixed"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                htmlFor: "visibility",
                                label: "是否进入公共花园"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectInput"], {
                                defaultValue: "public",
                                id: "visibility",
                                name: "visibility",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "public",
                                        children: "公开进入花园"
                                    }, void 0, false, {
                                        fileName: "[project]/components/forms/cyber-forms.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "private",
                                        children: "先私密观察"
                                    }, void 0, false, {
                                        fileName: "[project]/components/forms/cyber-forms.tsx",
                                        lineNumber: 239,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                        htmlFor: "bio",
                        hint: "一句话描述它的脾气。",
                        label: "档案简介"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextAreaInput"], {
                        id: "bio",
                        name: "bio",
                        placeholder: "一不高兴就会找树爬，开心时满园子乱冲。"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                        htmlFor: "photo",
                        hint: "支持 JPG / PNG / WEBP，最大 10MB。",
                        label: "原始照片"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                        accept: "image/png,image/jpeg,image/webp",
                        id: "photo",
                        name: "photo",
                        required: true,
                        type: "file"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 254,
                columnNumber: 16
            }, this) : null,
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-lime-200",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 255,
                columnNumber: 18
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                disabled: busy,
                type: "submit",
                children: busy ? stageLabel(stage) : "生成像素宠物"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, this);
}
function ProfileSetupForm({ profile }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRefreshing, startRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const { message, error, setMessage, handleFailure, resetStatus } = useApiForm();
    async function onSubmit(formData) {
        if (pending) {
            return;
        }
        try {
            resetStatus();
            setPending(true);
            const perfStart = `profile-save:start:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfStart);
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    handle: String(formData.get("handle") ?? ""),
                    displayName: String(formData.get("displayName") ?? ""),
                    bio: String(formData.get("bio") ?? "")
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "保存失败。");
            setMessage("档案已更新。");
            const perfEnd = `profile-save:end:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfEnd);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])("profile-save-submit", perfStart, perfEnd);
            startRefresh(()=>{
                router.refresh();
            });
        } catch (submissionError) {
            handleFailure(submissionError);
        } finally{
            setPending(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: onSubmit,
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 md:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                htmlFor: "displayName",
                                label: "显示名"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 310,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                defaultValue: profile.displayName,
                                id: "displayName",
                                name: "displayName",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                htmlFor: "handle",
                                label: "Handle"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 314,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                defaultValue: profile.handle,
                                id: "handle",
                                name: "handle",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 315,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 313,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                        htmlFor: "bio",
                        hint: "这个简介会公开展示在你的花园身份卡上。",
                        label: "简介"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 319,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextAreaInput"], {
                        defaultValue: profile.bio,
                        id: "bio",
                        name: "bio"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 320,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 322,
                columnNumber: 16
            }, this) : null,
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-lime-200",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 323,
                columnNumber: 18
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                disabled: pending || isRefreshing,
                type: "submit",
                children: pending ? "保存中..." : isRefreshing ? "正在同步界面..." : "保存档案"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 324,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 307,
        columnNumber: 5
    }, this);
}
function SignInForm() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNavigating, startNavigation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const { message, error, setMessage, handleFailure, resetStatus } = useApiForm();
    async function onSubmit(formData) {
        if (pending) {
            return;
        }
        try {
            resetStatus();
            setPending(true);
            const perfStart = `sign-in:start:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfStart);
            const response = await fetch("/api/auth/magic-link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: String(formData.get("email") ?? "")
                })
            });
            const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "登录失败。");
            setMessage(payload.message ?? "已经发送登录链接。");
            const perfEnd = `sign-in:end:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfEnd);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])("sign-in-submit", perfStart, perfEnd);
            if (payload.redirectTo) {
                const redirectTo = payload.redirectTo;
                router.prefetch(redirectTo);
                startNavigation(()=>{
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: onSubmit,
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                        htmlFor: "email",
                        hint: "未配置 Supabase 时会自动进入 demo 账号。",
                        label: "邮箱"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 381,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                        id: "email",
                        name: "email",
                        placeholder: "luna@cypher.pet",
                        required: true,
                        type: "email"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 382,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 384,
                columnNumber: 16
            }, this) : null,
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-lime-200",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 385,
                columnNumber: 18
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                className: "w-full",
                disabled: pending || isNavigating,
                type: "submit",
                children: pending ? "链接生成中..." : isNavigating ? "正在进入花园..." : "进入 Cypher Garden"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 379,
        columnNumber: 5
    }, this);
}
function RegeneratePetSpriteForm({ petId }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { message, error, setMessage, resetStatus, handleFailure } = useApiForm();
    async function onSubmit(formData) {
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
            const palette = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$photo$2d$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractPetPalette"])(photo);
            if (palette) {
                uploadPayload.append("palette", JSON.stringify(palette));
            }
            const uploadResponse = await fetch(`/api/pets/${petId}/source-photo`, {
                method: "POST",
                body: uploadPayload
            });
            const uploadJson = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(uploadResponse, "上传照片失败。");
            const generationResponse = await fetch(`/api/pets/${petId}/generations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sourcePhotoId: uploadJson.sourcePhoto.id
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(generationResponse, "重新生成失败。");
            setMessage("新形象已生成，正在刷新。");
            router.refresh();
        } catch (submissionError) {
            handleFailure(submissionError);
        } finally{
            setPending(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: onSubmit,
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FieldLabel"], {
                hint: "重新上传照片后会按照片的真实配色重新生成像素形象。",
                htmlFor: "regenerate-photo",
                label: "按照片配色重新生成"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 447,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                accept: "image/png,image/jpeg,image/webp",
                id: "regenerate-photo",
                name: "photo",
                required: true,
                type: "file"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 452,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                disabled: pending,
                type: "submit",
                variant: "secondary",
                children: pending ? "生成中..." : "重新生成像素形象"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 459,
                columnNumber: 7
            }, this),
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-lime-200",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 462,
                columnNumber: 18
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 463,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 446,
        columnNumber: 5
    }, this);
}
function OwnerActionButtons({ petId, onDone }) {
    const [pendingAction, setPendingAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const actionGroups = [
        {
            label: "Care",
            actions: [
                {
                    action: "feed",
                    idleLabel: "喂食",
                    pendingLabel: "喂食中...",
                    variant: "primary",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"]
                },
                {
                    action: "pet",
                    idleLabel: "摸头",
                    pendingLabel: "摸头中...",
                    variant: "secondary",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__["Hand"]
                },
                {
                    action: "clean_poop",
                    idleLabel: "清理",
                    pendingLabel: "清理中...",
                    variant: "ghost",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"]
                }
            ]
        },
        {
            label: "Play",
            actions: [
                {
                    action: "throw_toy",
                    idleLabel: "丢玩具",
                    pendingLabel: "丢玩具中...",
                    variant: "ghost",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"]
                },
                {
                    action: "call",
                    idleLabel: "叫过来",
                    pendingLabel: "呼唤中...",
                    variant: "secondary",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__["Megaphone"]
                },
                {
                    action: "gift",
                    idleLabel: "送礼物",
                    pendingLabel: "送礼中...",
                    variant: "ghost",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"]
                },
                {
                    action: "photo",
                    idleLabel: "拍照",
                    pendingLabel: "拍照中...",
                    variant: "ghost",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"]
                }
            ]
        },
        {
            label: "Context",
            actions: [
                {
                    action: "scold",
                    idleLabel: "训斥",
                    pendingLabel: "训斥中...",
                    variant: "danger",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__["Megaphone"]
                },
                {
                    action: "rename_spot",
                    idleLabel: "起昵称",
                    pendingLabel: "命名中...",
                    variant: "ghost",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"]
                }
            ]
        }
    ];
    async function runAction(action) {
        try {
            setError(null);
            setPendingAction(action);
            const response = await fetch(`/api/pets/${petId}/actions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "动作执行失败。");
            onDone?.();
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : "动作执行失败。");
        } finally{
            setPendingAction(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            actionGroups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] uppercase tracking-[0.2em] text-white/35",
                            children: group.label
                        }, void 0, false, {
                            fileName: "[project]/components/forms/cyber-forms.tsx",
                            lineNumber: 590,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-2 sm:grid-cols-2",
                            children: group.actions.map(({ action, idleLabel, pendingLabel, variant, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    className: "h-10 justify-start gap-2 px-4 text-xs tracking-[0.12em]",
                                    disabled: pendingAction !== null,
                                    onClick: ()=>runAction(action),
                                    type: "button",
                                    variant: variant,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            "aria-hidden": "true",
                                            className: "h-4 w-4 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/components/forms/cyber-forms.tsx",
                                            lineNumber: 601,
                                            columnNumber: 17
                                        }, this),
                                        pendingAction === action ? pendingLabel : idleLabel
                                    ]
                                }, action, true, {
                                    fileName: "[project]/components/forms/cyber-forms.tsx",
                                    lineNumber: 593,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/forms/cyber-forms.tsx",
                            lineNumber: 591,
                            columnNumber: 11
                        }, this)
                    ]
                }, group.label, true, {
                    fileName: "[project]/components/forms/cyber-forms.tsx",
                    lineNumber: 589,
                    columnNumber: 9
                }, this)),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 608,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 587,
        columnNumber: 5
    }, this);
}
function ReportForm({ targetType, targetId }) {
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { error, message, setMessage, handleFailure, resetStatus } = useApiForm();
    async function onSubmit(formData) {
        if (pending) {
            return;
        }
        try {
            resetStatus();
            setPending(true);
            const perfStart = `report-submit:start:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfStart);
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    targetType,
                    targetId,
                    reason: String(formData.get("reason") ?? "")
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "举报失败。");
            setMessage("举报已提交给管理员。");
            const perfEnd = `report-submit:end:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfEnd);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])("report-submit", perfStart, perfEnd);
        } catch (submissionError) {
            handleFailure(submissionError);
        } finally{
            setPending(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: onSubmit,
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextAreaInput"], {
                name: "reason",
                placeholder: "说明为什么要举报这个宠物或事件...",
                required: true
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 658,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 659,
                columnNumber: 16
            }, this) : null,
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-lime-200",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 660,
                columnNumber: 18
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                disabled: pending,
                type: "submit",
                variant: "danger",
                children: pending ? "提交中..." : "提交举报"
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 661,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 657,
        columnNumber: 5
    }, this);
}
function AdminReportActions({ reportId, targetType }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRefreshing, startRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    async function resolve(action) {
        if (pending) {
            return;
        }
        try {
            setError(null);
            setPending(true);
            const perfStart = `admin-report-resolve:start:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfStart);
            const response = await fetch(`/api/admin/reports/${reportId}/resolve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "处理失败。");
            const perfEnd = `admin-report-resolve:end:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(perfEnd);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])("admin-report-resolve", perfStart, perfEnd);
            startRefresh(()=>{
                router.refresh();
            });
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : "处理失败。");
        } finally{
            setPending(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        disabled: pending || isRefreshing,
                        onClick: ()=>resolve("dismiss"),
                        type: "button",
                        variant: "ghost",
                        children: "Dismiss"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 715,
                        columnNumber: 9
                    }, this),
                    targetType === "pet" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                disabled: pending || isRefreshing,
                                onClick: ()=>resolve("hide_pet"),
                                type: "button",
                                variant: "danger",
                                children: "Hide Pet"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 720,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                disabled: pending || isRefreshing,
                                onClick: ()=>resolve("freeze_pet"),
                                type: "button",
                                variant: "danger",
                                children: "Freeze Pet"
                            }, void 0, false, {
                                fileName: "[project]/components/forms/cyber-forms.tsx",
                                lineNumber: 723,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : null,
                    targetType === "pet_event" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        disabled: pending || isRefreshing,
                        onClick: ()=>resolve("hide_event"),
                        type: "button",
                        variant: "danger",
                        children: "Hide Event"
                    }, void 0, false, {
                        fileName: "[project]/components/forms/cyber-forms.tsx",
                        lineNumber: 729,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 714,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-rose-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/forms/cyber-forms.tsx",
                lineNumber: 734,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/forms/cyber-forms.tsx",
        lineNumber: 713,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Badge({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold tracking-[0.24em] uppercase text-cyan-100", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("card-surface relative overflow-hidden rounded-[28px] border border-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/pet-autonomy-hud.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PetAutonomyHud",
    ()=>PetAutonomyHud
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$forms$2f$cyber$2d$forms$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/forms/cyber-forms.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$speech$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/speech-bubble.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const toneStyles = {
    social: "border-cyan-300/22 bg-cyan-300/[0.08] text-cyan-50",
    conflict: "border-rose-300/24 bg-rose-300/[0.08] text-rose-50",
    rest: "border-violet-300/20 bg-violet-300/[0.08] text-violet-50",
    care: "border-lime-300/20 bg-lime-300/[0.08] text-lime-50",
    explore: "border-amber-300/20 bg-amber-300/[0.08] text-amber-50",
    neutral: "border-white/10 bg-white/[0.05] text-white/72"
};
const meterStyles = {
    energy: "from-cyan-300 to-sky-300",
    hunger: "from-amber-300 to-orange-300",
    hygiene: "from-lime-300 to-emerald-300",
    bladder: "from-blue-300 to-cyan-300",
    social: "from-fuchsia-300 to-cyan-300",
    stress: "from-rose-300 to-amber-300"
};
function NeedMeter({ label, value, tone }) {
    const safeValue = Math.max(0, Math.min(100, value));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-white/42",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-white/62",
                        children: Math.round(safeValue)
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-2 overflow-hidden rounded-full bg-white/8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-full rounded-full bg-gradient-to-r", meterStyles[tone]),
                    style: {
                        width: `${safeValue}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
function EmptySelection() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                children: "Observer HUD"
            }, void 0, false, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-white",
                        children: "Select a pet"
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm leading-6 text-white/55",
                        children: "点地图里的宠物，查看它现在的意图、关系、最近事件和可以介入的动作。"
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
function PetAutonomyHud({ pet, viewer, onChat, onRefresh }) {
    if (!pet) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptySelection, {}, void 0, false, {
            fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
            lineNumber: 88,
            columnNumber: 12
        }, this);
    }
    const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIntentSummary"])(pet);
    const pulse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["relationshipPulse"])(pet);
    const isOwner = viewer?.id === pet.pet.ownerId;
    const recentEvent = pet.recentEvent;
    const decision = pet.state.lastAutonomyDecision;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "space-y-5 p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        className: toneStyles[intent.tone],
                        children: "Selected Pet"
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45",
                        children: pet.state.zoneId
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-18 w-18 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-black/30",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            alt: pet.pet.name,
                            className: "h-14 w-14 object-contain [image-rendering:pixelated]",
                            src: pet.generation.worldSpritePath
                        }, void 0, false, {
                            fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "truncate text-3xl font-semibold text-white",
                                children: pet.pet.name
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-cyan-100/65",
                                children: [
                                    "@",
                                    pet.owner.handle
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs uppercase tracking-[0.18em] text-lime-100/62",
                                children: pet.personality.archetype
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-[18px] border border-white/8 bg-white/[0.035] p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] uppercase tracking-[0.18em] text-white/35",
                                children: "Mood"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 font-semibold text-white",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moodLabel"])(pet.state.mood)
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-[18px] border border-white/8 bg-white/[0.035] p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] uppercase tracking-[0.18em] text-white/35",
                                children: "Activity"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 font-semibold text-white",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityLabel"])(pet.state.activity)
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            pet.growth ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-[22px] border border-lime-300/14 bg-lime-300/[0.05] p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] uppercase tracking-[0.22em] text-lime-100/55",
                                children: "Growth"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full border border-lime-200/30 bg-lime-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-lime-100",
                                children: pet.growth.stageLabel
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-white/42",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "羁绊 bond"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-lime-100/80",
                                children: pet.growth.bond
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 h-2 overflow-hidden rounded-full bg-white/8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-gradient-to-r from-lime-300 to-cyan-300",
                            style: {
                                width: `${Math.round(pet.growth.stageProgress * 100)}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                            lineNumber: 147,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs text-white/45",
                        children: pet.growth.stage === "awakened" ? "已完全觉醒，和你同步率最高。" : `距离下一次进化还差 ${Math.round((1 - pet.growth.stageProgress) * 100)}% 的共同经历。`
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 135,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-[22px] border p-4", toneStyles[intent.tone]),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] uppercase tracking-[0.22em] opacity-65",
                                        children: "Current Intent"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-lg font-semibold text-white",
                                        children: intent.goal
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/55",
                                children: intent.source
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm leading-6 text-white/74",
                        children: intent.reason
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-white/48",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: intent.activity
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this),
                            decision?.socialIntent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "social: ",
                                    decision.socialIntent
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 173,
                                columnNumber: 37
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            pet.state.currentBubble?.text ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$speech$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpeechBubble"], {
                kind: pet.state.currentBubble.kind,
                text: pet.state.currentBubble.text
            }, void 0, false, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 178,
                columnNumber: 9
            }, this) : null,
            recentEvent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-[22px] border border-white/8 bg-white/[0.035] p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] uppercase tracking-[0.22em] text-white/38",
                                children: "Recent Event"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] uppercase tracking-[0.18em] text-white/35",
                                suppressHydrationWarning: true,
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRelativeTime"])(recentEvent.createdAt)
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm leading-6 text-white/72",
                        children: recentEvent.body
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this),
                    recentEvent.socialLines?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex flex-wrap gap-2",
                        children: recentEvent.socialLines.slice(0, 2).map((line, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$speech$2d$bubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpeechBubble"], {
                                className: index % 2 === 0 ? "" : "border-lime-300/18 bg-lime-300/[0.08] text-lime-50",
                                kind: "speech",
                                text: line.text
                            }, `${recentEvent.id}-${line.petId}-${index}`, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 193,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 191,
                        columnNumber: 13
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 182,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-[22px] border border-white/8 bg-white/[0.035] p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] uppercase tracking-[0.22em] text-white/38",
                        children: "Relationship Pulse"
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    pulse ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex rounded-full border px-3 py-1 text-xs", toneStyles[pulse.tone]),
                                children: [
                                    pulse.label,
                                    " · ",
                                    pulse.status
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-sm text-white/58",
                                children: pulse.detail
                            }, void 0, false, {
                                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm text-white/50",
                        children: "No strong social signal yet."
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "grid gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NeedMeter, {
                        label: "energy",
                        tone: "energy",
                        value: pet.state.energy
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NeedMeter, {
                        label: "hunger",
                        tone: "hunger",
                        value: pet.state.hunger
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NeedMeter, {
                        label: "hygiene",
                        tone: "hygiene",
                        value: pet.state.hygiene
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NeedMeter, {
                        label: "bladder",
                        tone: "bladder",
                        value: pet.state.bladder
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NeedMeter, {
                        label: "social",
                        tone: "social",
                        value: pet.state.social
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NeedMeter, {
                        label: "stress",
                        tone: "stress",
                        value: pet.state.stress
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    className: "gap-2",
                    onClick: onChat,
                    type: "button",
                    variant: "secondary",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                            "aria-hidden": "true",
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                            lineNumber: 230,
                            columnNumber: 11
                        }, this),
                        "Chat"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                    lineNumber: 229,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this),
            isOwner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] uppercase tracking-[0.22em] text-white/38",
                        children: "Intervene"
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$forms$2f$cyber$2d$forms$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OwnerActionButtons"], {
                        onDone: onRefresh,
                        petId: pet.pet.id
                    }, void 0, false, {
                        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 236,
                columnNumber: 9
            }, this) : viewer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-[18px] border border-amber-300/12 bg-amber-300/[0.05] px-4 py-3 text-sm leading-6 text-amber-50/78",
                children: [
                    "这是 ",
                    pet.owner.displayName,
                    " 的宠物。你可以观察它的行为，也可以从公共事件里理解它和其他 pet 的关系。"
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 241,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-[18px] border border-amber-300/12 bg-amber-300/[0.05] px-4 py-3 text-sm leading-6 text-amber-50/78",
                children: "当前是公共观景模式。登录后可以指挥自己的宠物移动和互动。"
            }, void 0, false, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 245,
                columnNumber: 9
            }, this),
            !isOwner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$forms$2f$cyber$2d$forms$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReportForm"], {
                targetId: pet.pet.id,
                targetType: "pet"
            }, void 0, false, {
                fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
                lineNumber: 250,
                columnNumber: 19
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/pet-autonomy-hud.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/world-activity-tape.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldActivityTape",
    ()=>WorldActivityTape,
    "buildWorldActivityTapeItems",
    ()=>buildWorldActivityTapeItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$footprints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Footprints$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/footprints.js [app-ssr] (ecmascript) <export default as Footprints>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pinned.js [app-ssr] (ecmascript) <export default as MapPinned>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio.js [app-ssr] (ecmascript) <export default as Radio>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const DEFAULT_LIMIT = 10;
const encounterToneOrder = {
    conflict: 5,
    care: 4,
    social: 3,
    explore: 2,
    rest: 1
};
const toneStyles = {
    social: "border-cyan-300/22 bg-cyan-300/[0.08] text-cyan-50",
    conflict: "border-rose-300/26 bg-rose-300/[0.08] text-rose-50",
    rest: "border-violet-300/18 bg-violet-300/[0.07] text-violet-50",
    care: "border-lime-300/22 bg-lime-300/[0.08] text-lime-50",
    explore: "border-amber-300/22 bg-amber-300/[0.08] text-amber-50",
    neutral: "border-white/10 bg-white/[0.045] text-white/70"
};
function eventTone(event) {
    if (event.type === "scuffle" || event.type === "chased") {
        return "conflict";
    }
    if (event.type === "social_chat" || event.type === "bonded") {
        return "social";
    }
    if (event.type === "pooped" || event.type === "groomed") {
        return "care";
    }
    if (event.type === "slept") {
        return "rest";
    }
    if (event.type === "zone_move" || event.type === "climbed_tree" || event.type === "watched_fish" || event.type === "dug") {
        return "explore";
    }
    return "neutral";
}
function eventTitle(event) {
    return event.type.replaceAll("_", " ");
}
function uniquePetIds(ids) {
    return [
        ...new Set(ids.filter((id)=>Boolean(id)))
    ];
}
function petNamesFor(petsById, petIds) {
    return petIds.map((petId)=>petsById.get(petId)?.pet.name).filter((name)=>Boolean(name));
}
function buildWorldActivityTapeItems({ activeZoneId, snapshots, limit = DEFAULT_LIMIT }) {
    const petsById = new Map(snapshots.flatMap((snapshot)=>snapshot.pets.map((pet)=>[
                pet.pet.id,
                pet
            ])));
    const representedEventIds = new Set(snapshots.flatMap((snapshot)=>snapshot.encounters.flatMap((encounter)=>encounter.relatedEventIds)));
    const items = [];
    for (const snapshot of snapshots){
        const isOffPage = snapshot.zone.id !== activeZoneId;
        for (const encounter of snapshot.encounters){
            if (encounter.status === "resolved" || encounter.status === "expired") {
                continue;
            }
            items.push({
                id: `encounter:${encounter.id}`,
                kind: "encounter",
                zoneId: snapshot.zone.id,
                zoneName: snapshot.zone.name,
                title: encounter.title,
                summary: encounter.summary,
                petIds: encounter.participantPetIds,
                petNames: petNamesFor(petsById, encounter.participantPetIds),
                tone: encounter.tone,
                actionLabel: isOffPage ? "Go" : "Inspect",
                isOffPage,
                timestamp: encounter.updatedAt,
                encounterId: encounter.id,
                priority: 100 + encounterToneOrder[encounter.tone]
            });
        }
        for (const event of snapshot.recentEvents){
            if (representedEventIds.has(event.id)) {
                continue;
            }
            const petIds = uniquePetIds([
                event.petId,
                event.relatedPetId
            ]);
            items.push({
                id: `event:${event.id}`,
                kind: "event",
                zoneId: snapshot.zone.id,
                zoneName: snapshot.zone.name,
                title: eventTitle(event),
                summary: event.body,
                petIds,
                petNames: petNamesFor(petsById, petIds),
                tone: eventTone(event),
                actionLabel: isOffPage ? "Go" : "Track",
                isOffPage,
                timestamp: event.createdAt,
                eventId: event.id,
                priority: 50
            });
        }
    }
    return items.sort((left, right)=>{
        const timestampOrder = right.timestamp.localeCompare(left.timestamp);
        if (timestampOrder !== 0) {
            return timestampOrder;
        }
        return right.priority - left.priority;
    }).slice(0, limit).map((item)=>({
            id: item.id,
            kind: item.kind,
            zoneId: item.zoneId,
            zoneName: item.zoneName,
            title: item.title,
            summary: item.summary,
            petIds: item.petIds,
            petNames: item.petNames,
            tone: item.tone,
            actionLabel: item.actionLabel,
            isOffPage: item.isOffPage,
            timestamp: item.timestamp,
            encounterId: item.encounterId,
            eventId: item.eventId
        }));
}
function WorldActivityTape({ activeZoneId, limit, onSelectItem, selectedEncounterId, selectedPetId, snapshots }) {
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildWorldActivityTapeItems({
            activeZoneId,
            snapshots,
            limit
        }), [
        activeZoneId,
        limit,
        snapshots
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-3",
        "data-testid": "world-activity-tape",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__["Radio"], {
                                "aria-hidden": "true",
                                className: "h-4 w-4 text-cyan-100/70"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold uppercase tracking-[0.2em] text-white/70",
                                children: "Activity Tape"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42",
                        children: [
                            items.length,
                            " live beats"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/world-activity-tape.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48",
                children: "No fresh world activity yet."
            }, void 0, false, {
                fileName: "[project]/components/garden/world-activity-tape.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 overflow-x-auto pb-1",
                children: items.map((item)=>{
                    const selected = item.encounterId && item.encounterId === selectedEncounterId || item.petIds.some((petId)=>petId === selectedPetId);
                    const Icon = item.kind === "encounter" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"] : item.tone === "social" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$footprints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Footprints$3e$__["Footprints"];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-pressed": selected,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-h-[10rem] w-[18rem] shrink-0 rounded-[20px] border p-3 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5", toneStyles[item.tone], selected ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.22)]" : ""),
                        "data-activity-id": item.id,
                        "data-testid": "world-activity-tape-item",
                        onClick: ()=>onSelectItem(item),
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-start justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex flex-wrap items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45",
                                                        children: item.zoneName
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 23
                                                    }, this),
                                                    item.isOffPage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center gap-1 rounded-full border border-cyan-300/14 bg-cyan-300/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-50/70",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__["MapPinned"], {
                                                                "aria-hidden": "true",
                                                                className: "h-3 w-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                                                lineNumber: 249,
                                                                columnNumber: 27
                                                            }, this),
                                                            "away"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                                                        lineNumber: 248,
                                                        columnNumber: 25
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                                lineNumber: 243,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-2 block text-[10px] uppercase tracking-[0.14em] text-white/35",
                                                suppressHydrationWarning: true,
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRelativeTime"])(item.timestamp)
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                                lineNumber: 254,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                                        lineNumber: 242,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            "aria-hidden": "true",
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/world-activity-tape.tsx",
                                            lineNumber: 259,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                                        lineNumber: 258,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                lineNumber: 241,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-3 block line-clamp-2 min-h-10 break-words text-sm font-semibold leading-5 text-white",
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                lineNumber: 263,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-1 line-clamp-2 block break-words text-xs leading-5 text-white/60",
                                children: item.summary
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                lineNumber: 266,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-3 flex items-center justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 truncate text-xs text-white/50",
                                        children: item.petNames.length > 0 ? item.petNames.join(" x ") : "Garden signal"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                                        lineNumber: 270,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/56",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                "aria-hidden": "true",
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                                lineNumber: 274,
                                                columnNumber: 21
                                            }, this),
                                            item.actionLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                                        lineNumber: 273,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-activity-tape.tsx",
                                lineNumber: 269,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/components/garden/world-activity-tape.tsx",
                        lineNumber: 228,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/garden/world-activity-tape.tsx",
                lineNumber: 219,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/world-activity-tape.tsx",
        lineNumber: 203,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/world-director.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldDirector",
    ()=>WorldDirector,
    "buildWorldDirectorBeats",
    ()=>buildWorldDirectorBeats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/compass.js [app-ssr] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2d$pulse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HeartPulse$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart-pulse.js [app-ssr] (ecmascript) <export default as HeartPulse>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio-tower.js [app-ssr] (ecmascript) <export default as RadioTower>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-ssr] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const DEFAULT_LIMIT = 4;
const encounterPriority = {
    conflict: 48,
    care: 42,
    social: 30,
    explore: 22,
    rest: 12
};
const eventPriority = {
    scuffle: 34,
    chased: 32,
    pooped: 24,
    mood_change: 22,
    bonded: 18,
    social_chat: 18,
    zone_move: 16,
    climbed_tree: 14,
    watched_fish: 12,
    dug: 12,
    owner_action: 10
};
const toneStyles = {
    social: "border-cyan-300/24 bg-cyan-300/[0.08] text-cyan-50",
    conflict: "border-rose-300/28 bg-rose-300/[0.08] text-rose-50",
    rest: "border-violet-300/20 bg-violet-300/[0.07] text-violet-50",
    care: "border-lime-300/24 bg-lime-300/[0.08] text-lime-50",
    explore: "border-amber-300/22 bg-amber-300/[0.08] text-amber-50",
    neutral: "border-white/10 bg-white/[0.045] text-white/70"
};
const kindLabels = {
    encounter: "live thread",
    need: "care lead",
    intent: "free roam",
    event: "world beat"
};
const kindIcons = {
    encounter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
    need: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2d$pulse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HeartPulse$3e$__["HeartPulse"],
    intent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__["Route"],
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__["RadioTower"]
};
function needSignals(pet) {
    const signals = [
        {
            label: "hunger",
            value: Math.max(0, pet.state.hunger - 72)
        },
        {
            label: "hygiene",
            value: Math.max(0, 38 - pet.state.hygiene)
        },
        {
            label: "stress",
            value: Math.max(0, pet.state.stress - 70)
        },
        {
            label: "energy",
            value: Math.max(0, 28 - pet.state.energy)
        },
        {
            label: "bladder",
            value: Math.max(0, pet.state.bladder - 78)
        },
        {
            label: "social",
            value: Math.max(0, 32 - pet.state.social)
        }
    ].filter((signal)=>signal.value > 0);
    return signals.sort((left, right)=>right.value - left.value);
}
function eventTone(event) {
    if (event.type === "scuffle" || event.type === "chased") {
        return "conflict";
    }
    if (event.type === "social_chat" || event.type === "bonded") {
        return "social";
    }
    if (event.type === "pooped" || event.type === "groomed") {
        return "care";
    }
    if (event.type === "slept") {
        return "rest";
    }
    if (event.type === "zone_move" || event.type === "climbed_tree" || event.type === "watched_fish" || event.type === "dug") {
        return "explore";
    }
    return "neutral";
}
function eventTitle(event, petsById) {
    const pet = petsById.get(event.petId);
    const relatedPet = event.relatedPetId ? petsById.get(event.relatedPetId) : undefined;
    if (pet && relatedPet) {
        return `${pet.pet.name} x ${relatedPet.pet.name}`;
    }
    return pet?.pet.name ?? event.type.replaceAll("_", " ");
}
function uniquePetIds(ids) {
    return [
        ...new Set(ids.filter((id)=>Boolean(id)))
    ];
}
function buildWorldDirectorBeats({ activeZoneId, snapshots, limit = DEFAULT_LIMIT }) {
    const petsById = new Map(snapshots.flatMap((snapshot)=>snapshot.pets.map((pet)=>[
                pet.pet.id,
                pet
            ])));
    const representedEventIds = new Set(snapshots.flatMap((snapshot)=>snapshot.encounters.flatMap((encounter)=>encounter.relatedEventIds)));
    const coveredPetIds = new Set();
    const beats = [];
    for (const snapshot of snapshots){
        const isOffPage = snapshot.zone.id !== activeZoneId;
        for (const encounter of snapshot.encounters){
            if (encounter.status === "resolved" || encounter.status === "expired") {
                continue;
            }
            encounter.participantPetIds.forEach((petId)=>coveredPetIds.add(petId));
            beats.push({
                id: `encounter:${encounter.id}`,
                kind: "encounter",
                zoneId: snapshot.zone.id,
                zoneName: snapshot.zone.name,
                title: encounter.title,
                summary: encounter.summary,
                petIds: encounter.participantPetIds,
                tone: encounter.tone,
                priority: 150 + encounterPriority[encounter.tone] + (isOffPage ? 16 : 0),
                actionLabel: isOffPage ? "Go to zone" : "Inspect",
                isOffPage,
                timestamp: encounter.updatedAt,
                encounterId: encounter.id
            });
        }
    }
    for (const snapshot of snapshots){
        const isOffPage = snapshot.zone.id !== activeZoneId;
        for (const pet of snapshot.pets){
            if (coveredPetIds.has(pet.pet.id)) {
                continue;
            }
            const signals = needSignals(pet);
            const pressure = signals.reduce((sum, signal)=>sum + signal.value, 0);
            if (pressure > 0) {
                beats.push({
                    id: `need:${pet.pet.id}`,
                    kind: "need",
                    zoneId: snapshot.zone.id,
                    zoneName: snapshot.zone.name,
                    title: `${pet.pet.name} needs attention`,
                    summary: `${signals.slice(0, 2).map((signal)=>signal.label).join(" / ")} pressure is shaping the next move.`,
                    petIds: [
                        pet.pet.id
                    ],
                    tone: "care",
                    priority: 110 + pressure + (isOffPage ? 12 : 0),
                    actionLabel: isOffPage ? "Go to zone" : "Track",
                    isOffPage,
                    timestamp: pet.state.lastSimulatedAt
                });
                coveredPetIds.add(pet.pet.id);
                continue;
            }
            if (!pet.state.lastAutonomyDecision) {
                continue;
            }
            const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIntentSummary"])(pet);
            beats.push({
                id: `intent:${pet.pet.id}`,
                kind: "intent",
                zoneId: snapshot.zone.id,
                zoneName: snapshot.zone.name,
                title: `${pet.pet.name} is ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityLabel"])(pet.state.lastAutonomyDecision.chosenActivity)}`,
                summary: intent.reason,
                petIds: [
                    pet.pet.id
                ],
                tone: intent.tone,
                priority: 58 + (pet.state.lastAutonomyDecision.source === "llm" ? 8 : 0) + (isOffPage ? 8 : 0),
                actionLabel: isOffPage ? "Go to zone" : "Follow",
                isOffPage,
                timestamp: pet.state.lastAutonomyDecision.decidedAt
            });
        }
        for (const event of snapshot.recentEvents){
            if (representedEventIds.has(event.id)) {
                continue;
            }
            const petIds = uniquePetIds([
                event.petId,
                event.relatedPetId
            ]);
            if (petIds.some((petId)=>coveredPetIds.has(petId))) {
                continue;
            }
            const tone = eventTone(event);
            beats.push({
                id: `event:${event.id}`,
                kind: "event",
                zoneId: snapshot.zone.id,
                zoneName: snapshot.zone.name,
                title: eventTitle(event, petsById),
                summary: event.body,
                petIds,
                tone,
                priority: 72 + (eventPriority[event.type] ?? 7) + (isOffPage ? 10 : 0),
                actionLabel: isOffPage ? "Go to zone" : "Locate",
                isOffPage,
                timestamp: event.createdAt,
                eventId: event.id
            });
        }
    }
    return beats.sort((left, right)=>{
        if (right.priority !== left.priority) {
            return right.priority - left.priority;
        }
        return (right.timestamp ?? "").localeCompare(left.timestamp ?? "");
    }).slice(0, limit);
}
function WorldDirector({ activeZoneId, limit, onSelectBeat, selectedEncounterId, selectedPetId, snapshots }) {
    const beats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildWorldDirectorBeats({
            activeZoneId,
            snapshots,
            limit
        }), [
        activeZoneId,
        limit,
        snapshots
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-3",
        "data-testid": "world-director",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                "aria-hidden": "true",
                                className: "h-4 w-4 text-amber-100/70"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-director.tsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold uppercase tracking-[0.2em] text-white/70",
                                children: "Live Leads"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-director.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-director.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42",
                        children: [
                            beats.length,
                            " followable"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-director.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/world-director.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this),
            beats.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48",
                children: "The garden is in a quiet roam state."
            }, void 0, false, {
                fileName: "[project]/components/garden/world-director.tsx",
                lineNumber: 298,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2 lg:grid-cols-2 2xl:grid-cols-4",
                children: beats.map((beat)=>{
                    const Icon = kindIcons[beat.kind];
                    const selected = beat.encounterId && beat.encounterId === selectedEncounterId || beat.petIds.some((petId)=>petId === selectedPetId);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-pressed": selected,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-w-0 rounded-[20px] border p-3 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5", toneStyles[beat.tone], selected ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.22)]" : ""),
                        "data-beat-id": beat.id,
                        "data-testid": "world-director-beat",
                        onClick: ()=>onSelectBeat(beat),
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-start justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex flex-wrap items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45",
                                                        children: kindLabels[beat.kind]
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/world-director.tsx",
                                                        lineNumber: 326,
                                                        columnNumber: 23
                                                    }, this),
                                                    beat.isOffPage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded-full border border-cyan-300/14 bg-cyan-300/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-50/70",
                                                        children: "away"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/world-director.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 25
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/garden/world-director.tsx",
                                                lineNumber: 325,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-2 block truncate text-sm font-semibold text-white",
                                                children: beat.zoneName
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-director.tsx",
                                                lineNumber: 335,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-director.tsx",
                                        lineNumber: 324,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            "aria-hidden": "true",
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/world-director.tsx",
                                            lineNumber: 338,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-director.tsx",
                                        lineNumber: 337,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-director.tsx",
                                lineNumber: 323,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-3 block line-clamp-2 min-h-10 break-words text-sm leading-5 text-white/76",
                                children: beat.title
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-director.tsx",
                                lineNumber: 341,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-2 line-clamp-2 block break-words text-xs leading-5 text-white/55",
                                children: beat.summary
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-director.tsx",
                                lineNumber: 344,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em] text-white/46",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: beat.timestamp ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRelativeTime"])(beat.timestamp) : "live"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-director.tsx",
                                        lineNumber: 348,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-white/56",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                "aria-hidden": "true",
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-director.tsx",
                                                lineNumber: 350,
                                                columnNumber: 21
                                            }, this),
                                            beat.actionLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-director.tsx",
                                        lineNumber: 349,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-director.tsx",
                                lineNumber: 347,
                                columnNumber: 17
                            }, this)
                        ]
                    }, beat.id, true, {
                        fileName: "[project]/components/garden/world-director.tsx",
                        lineNumber: 310,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/garden/world-director.tsx",
                lineNumber: 302,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/world-director.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/world-echo-feed.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldEchoFeed",
    ()=>WorldEchoFeed,
    "buildWorldEchoItems",
    ()=>buildWorldEchoItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pinned.js [app-ssr] (ecmascript) <export default as MapPinned>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio-tower.js [app-ssr] (ecmascript) <export default as RadioTower>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const DEFAULT_LIMIT = 6;
const encounterPriority = {
    conflict: 42,
    care: 34,
    social: 26,
    explore: 18,
    rest: 10
};
const eventPriority = {
    scuffle: 36,
    chased: 34,
    mood_change: 24,
    pooped: 22,
    bonded: 20,
    social_chat: 20,
    zone_move: 19,
    owner_action: 18,
    climbed_tree: 16,
    dug: 14,
    watched_fish: 12,
    inner_voice: 10,
    groomed: 8,
    slept: 6
};
const toneStyles = {
    social: "border-cyan-300/18 bg-cyan-300/[0.07] text-cyan-50",
    conflict: "border-rose-300/24 bg-rose-300/[0.08] text-rose-50",
    rest: "border-violet-300/18 bg-violet-300/[0.07] text-violet-50",
    care: "border-lime-300/18 bg-lime-300/[0.07] text-lime-50",
    explore: "border-amber-300/18 bg-amber-300/[0.07] text-amber-50",
    neutral: "border-white/8 bg-white/[0.04] text-white/70"
};
function eventTone(event) {
    if (event.type === "scuffle" || event.type === "chased") {
        return "conflict";
    }
    if (event.type === "social_chat" || event.type === "bonded") {
        return "social";
    }
    if (event.type === "slept") {
        return "rest";
    }
    if (event.type === "pooped" || event.type === "groomed") {
        return "care";
    }
    if (event.type === "owner_action" || event.type === "zone_move" || event.type === "watched_fish" || event.type === "climbed_tree" || event.type === "dug") {
        return "explore";
    }
    return "neutral";
}
function eventTitle(event) {
    return event.type.replaceAll("_", " ");
}
function uniquePetIds(ids) {
    return [
        ...new Set(ids.filter((id)=>Boolean(id)))
    ];
}
function buildWorldEchoItems({ snapshots, activeZoneId, limit = DEFAULT_LIMIT }) {
    const representedEventIds = new Set(snapshots.flatMap((snapshot)=>snapshot.encounters.flatMap((encounter)=>encounter.relatedEventIds)));
    const items = [];
    for (const snapshot of snapshots){
        const isOffPage = snapshot.zone.id !== activeZoneId;
        for (const encounter of snapshot.encounters){
            if (encounter.status === "resolved" || encounter.status === "expired") {
                continue;
            }
            items.push({
                id: `encounter:${encounter.id}`,
                kind: "encounter",
                zoneId: snapshot.zone.id,
                zoneName: snapshot.zone.name,
                title: encounter.title,
                summary: encounter.summary,
                petIds: encounter.participantPetIds,
                tone: encounter.tone,
                priority: 100 + encounterPriority[encounter.tone] + (isOffPage ? 18 : 0),
                actionLabel: isOffPage ? "Go to zone" : "Inspect",
                isOffPage,
                timestamp: encounter.updatedAt,
                encounterId: encounter.id
            });
        }
        for (const event of snapshot.recentEvents){
            if (representedEventIds.has(event.id)) {
                continue;
            }
            items.push({
                id: `event:${event.id}`,
                kind: "event",
                zoneId: snapshot.zone.id,
                zoneName: snapshot.zone.name,
                title: eventTitle(event),
                summary: event.body,
                petIds: uniquePetIds([
                    event.petId,
                    event.relatedPetId
                ]),
                tone: eventTone(event),
                priority: 50 + (eventPriority[event.type] ?? 7) + (isOffPage ? 12 : 0),
                actionLabel: isOffPage ? "Go to zone" : "Locate",
                isOffPage,
                timestamp: event.createdAt,
                eventId: event.id
            });
        }
    }
    return items.sort((left, right)=>{
        if (right.priority !== left.priority) {
            return right.priority - left.priority;
        }
        return (right.timestamp ?? "").localeCompare(left.timestamp ?? "");
    }).slice(0, limit);
}
function WorldEchoFeed({ activeZoneId, limit = DEFAULT_LIMIT, onSelectEcho, selectedZoneId, snapshots }) {
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildWorldEchoItems({
            activeZoneId,
            snapshots,
            limit
        }), [
        activeZoneId,
        limit,
        snapshots
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-3",
        "data-testid": "world-echo-feed",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__["RadioTower"], {
                                        "aria-hidden": "true",
                                        className: "h-4 w-4 text-cyan-200/70"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-echo-feed.tsx",
                                        lineNumber: 200,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold text-white",
                                        children: "World Echo"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-echo-feed.tsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-echo-feed.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs uppercase tracking-[0.2em] text-white/35",
                                children: "off-page incidents"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-echo-feed.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-echo-feed.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42",
                        children: [
                            items.filter((item)=>item.isOffPage).length,
                            " away"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-echo-feed.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/world-echo-feed.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48",
                children: "The wider garden is quiet for now."
            }, void 0, false, {
                fileName: "[project]/components/garden/world-echo-feed.tsx",
                lineNumber: 211,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2",
                children: items.map((item)=>{
                    const selected = selectedZoneId === item.zoneId;
                    const Icon = item.kind === "encounter" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"] : item.tone === "social" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full rounded-[20px] border p-3 text-left transition-[transform,border-color,background-color,box-shadow] hover:scale-[1.01]", toneStyles[item.tone], selected ? "shadow-[0_0_0_1px_rgba(255,255,255,0.24)]" : ""),
                        "data-echo-id": item.id,
                        "data-testid": "world-echo-item",
                        onClick: ()=>onSelectEcho(item),
                        type: "button",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        "aria-hidden": "true",
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-echo-feed.tsx",
                                        lineNumber: 235,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/garden/world-echo-feed.tsx",
                                    lineNumber: 234,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex flex-wrap items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45",
                                                    children: item.zoneName
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/world-echo-feed.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 23
                                                }, this),
                                                item.isOffPage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center gap-1 rounded-full border border-cyan-300/14 bg-cyan-300/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-50/70",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__["MapPinned"], {
                                                            "aria-hidden": "true",
                                                            className: "h-3 w-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/garden/world-echo-feed.tsx",
                                                            lineNumber: 244,
                                                            columnNumber: 27
                                                        }, this),
                                                        "off-page"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/garden/world-echo-feed.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 25
                                                }, this) : null,
                                                item.timestamp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] uppercase tracking-[0.14em] text-white/35",
                                                    suppressHydrationWarning: true,
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRelativeTime"])(item.timestamp)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/garden/world-echo-feed.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 25
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/garden/world-echo-feed.tsx",
                                            lineNumber: 238,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-2 block break-words text-sm font-semibold leading-5 text-white",
                                            children: item.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/world-echo-feed.tsx",
                                            lineNumber: 254,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-1 line-clamp-2 block break-words text-xs leading-5 text-white/62",
                                            children: item.summary
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/world-echo-feed.tsx",
                                            lineNumber: 257,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-3 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/52",
                                            children: item.actionLabel
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/world-echo-feed.tsx",
                                            lineNumber: 260,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/garden/world-echo-feed.tsx",
                                    lineNumber: 237,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/garden/world-echo-feed.tsx",
                            lineNumber: 233,
                            columnNumber: 17
                        }, this)
                    }, item.id, false, {
                        fileName: "[project]/components/garden/world-echo-feed.tsx",
                        lineNumber: 221,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/garden/world-echo-feed.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/world-echo-feed.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/world-map-radar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldMapRadar",
    ()=>WorldMapRadar,
    "buildWorldZoneRadarItems",
    ()=>buildWorldZoneRadarItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.js [app-ssr] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paw$2d$print$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PawPrint$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/paw-print.js [app-ssr] (ecmascript) <export default as PawPrint>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio-tower.js [app-ssr] (ecmascript) <export default as RadioTower>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-ssr] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$transition$2d$markers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-transition-markers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const toneStyles = {
    conflict: "border-rose-300/35 bg-rose-300/[0.09] text-rose-50",
    social: "border-cyan-300/26 bg-cyan-300/[0.08] text-cyan-50",
    care: "border-lime-300/24 bg-lime-300/[0.08] text-lime-50",
    explore: "border-amber-300/24 bg-amber-300/[0.08] text-amber-50",
    rest: "border-violet-300/22 bg-violet-300/[0.08] text-violet-50",
    event: "border-sky-300/22 bg-sky-300/[0.07] text-sky-50",
    quiet: "border-white/10 bg-white/[0.035] text-white/66"
};
const toneIcons = {
    conflict: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
    social: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__["RadioTower"],
    care: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paw$2d$print$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PawPrint$3e$__["PawPrint"],
    explore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__["Route"],
    rest: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paw$2d$print$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PawPrint$3e$__["PawPrint"],
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__["RadioTower"],
    quiet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"]
};
function radarTone(snapshot, arrivalCount) {
    const activeEncounter = snapshot.encounters.find((encounter)=>encounter.status !== "resolved" && encounter.status !== "expired");
    if (activeEncounter) {
        return activeEncounter.tone;
    }
    if (arrivalCount > 0) {
        return "explore";
    }
    return snapshot.recentEvents.length > 0 ? "event" : "quiet";
}
function topSignal(snapshot) {
    const activeEncounter = snapshot.encounters.find((encounter)=>encounter.status !== "resolved" && encounter.status !== "expired");
    if (activeEncounter) {
        return {
            title: activeEncounter.title,
            summary: activeEncounter.summary
        };
    }
    const recentEvent = snapshot.recentEvents[0];
    if (recentEvent) {
        return {
            title: recentEvent.body,
            summary: recentEvent.type.replaceAll("_", " ")
        };
    }
    return {
        title: "Quiet patrol",
        summary: "No major visible signal."
    };
}
function buildWorldZoneRadarItems(snapshots, activeZoneId) {
    return snapshots.map((snapshot)=>{
        const signal = topSignal(snapshot);
        const arrivalCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$transition$2d$markers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildWorldTransitionMarkers"])(snapshot).length;
        const encounterMarkerCount = snapshot.encounterMarkers.length;
        return {
            zoneId: snapshot.zone.id,
            zoneName: snapshot.zone.name,
            active: snapshot.zone.id === activeZoneId,
            tone: radarTone(snapshot, arrivalCount),
            petCount: snapshot.pets.length,
            encounterCount: snapshot.encounters.filter((encounter)=>encounter.status !== "resolved" && encounter.status !== "expired").length,
            eventCount: snapshot.recentEvents.length,
            markerCount: encounterMarkerCount + arrivalCount,
            arrivalCount,
            topSignal: signal.title,
            summary: signal.summary
        };
    });
}
function WorldMapRadar({ activeZoneId, disabled, snapshots, onSelectZone }) {
    const items = buildWorldZoneRadarItems(snapshots, activeZoneId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-3",
        "data-testid": "world-map-radar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
                                "aria-hidden": "true",
                                className: "h-4 w-4 text-lime-200/70"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-map-radar.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold uppercase tracking-[0.2em] text-white/70",
                                children: "World Map"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-map-radar.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-map-radar.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42",
                        children: [
                            items.reduce((sum, item)=>sum + item.encounterCount, 0),
                            " signals"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-map-radar.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/world-map-radar.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2 md:grid-cols-2 xl:grid-cols-4",
                children: items.map((item)=>{
                    const Icon = toneIcons[item.tone];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-current": item.active ? "true" : undefined,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-w-0 rounded-[20px] border p-3 text-left transition-[border-color,background-color,box-shadow,transform,opacity] hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-70", toneStyles[item.tone], item.active ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.22)]" : ""),
                        "data-testid": "world-map-radar-zone",
                        disabled: disabled || item.active,
                        onClick: ()=>onSelectZone(item.zoneId),
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-start justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate text-base font-semibold text-white",
                                                children: item.zoneName
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-map-radar.tsx",
                                                lineNumber: 161,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-1 block truncate text-[10px] uppercase tracking-[0.16em] text-white/42",
                                                children: [
                                                    item.petCount,
                                                    " pets · ",
                                                    item.markerCount,
                                                    " markers"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/garden/world-map-radar.tsx",
                                                lineNumber: 162,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-map-radar.tsx",
                                        lineNumber: 160,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/22",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            "aria-hidden": "true",
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/world-map-radar.tsx",
                                            lineNumber: 167,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-map-radar.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-map-radar.tsx",
                                lineNumber: 159,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-3 block line-clamp-2 min-h-10 break-words text-sm leading-5 text-white/72",
                                children: item.topSignal
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-map-radar.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-white/42",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            item.encounterCount,
                                            " encounters"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-map-radar.tsx",
                                        lineNumber: 174,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            item.eventCount,
                                            " events"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-map-radar.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this),
                                    item.arrivalCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            item.arrivalCount,
                                            " arrivals"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-map-radar.tsx",
                                        lineNumber: 176,
                                        columnNumber: 42
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-map-radar.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.zoneId, true, {
                        fileName: "[project]/components/garden/world-map-radar.tsx",
                        lineNumber: 146,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/garden/world-map-radar.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/world-map-radar.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/world-pulse.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldPulse",
    ()=>WorldPulse,
    "buildWorldPulseItems",
    ()=>buildWorldPulseItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2d$handshake$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HeartHandshake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart-handshake.js [app-ssr] (ecmascript) <export default as HeartHandshake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio.js [app-ssr] (ecmascript) <export default as Radio>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-ssr] (ecmascript) <export default as Utensils>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-labels.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const DEFAULT_LIMIT = 5;
const encounterTonePriority = {
    conflict: 34,
    care: 28,
    social: 20,
    explore: 14,
    rest: 8
};
const eventTypePriority = {
    scuffle: 32,
    chased: 30,
    mood_change: 20,
    pooped: 18,
    bonded: 18,
    social_chat: 16,
    zone_move: 15,
    climbed_tree: 14,
    dug: 12,
    watched_fish: 10,
    inner_voice: 8,
    groomed: 6,
    slept: 4
};
const stagePriority = {
    spark: 18,
    unfolding: 12,
    cooldown: 3
};
const statusPriority = {
    active: 10,
    resolving: 4,
    resolved: -40,
    expired: -60
};
const toneStyles = {
    social: "border-cyan-300/18 bg-cyan-300/[0.07] text-cyan-50",
    conflict: "border-rose-300/24 bg-rose-300/[0.08] text-rose-50",
    rest: "border-violet-300/18 bg-violet-300/[0.07] text-violet-50",
    care: "border-lime-300/18 bg-lime-300/[0.07] text-lime-50",
    explore: "border-amber-300/18 bg-amber-300/[0.07] text-amber-50",
    neutral: "border-white/8 bg-white/[0.04] text-white/70"
};
const toneIcons = {
    social: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2d$handshake$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HeartHandshake$3e$__["HeartHandshake"],
    conflict: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
    rest: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
    care: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"],
    explore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
    neutral: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"]
};
function eventTone(event, pet) {
    if (event.type === "scuffle" || event.type === "chased") {
        return "conflict";
    }
    if (event.type === "social_chat" || event.type === "bonded") {
        return "social";
    }
    if (event.type === "slept") {
        return "rest";
    }
    if (event.type === "pooped" || event.type === "groomed") {
        return "care";
    }
    if (event.type === "zone_move" || event.type === "climbed_tree" || event.type === "watched_fish" || event.type === "dug") {
        return "explore";
    }
    return pet ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityTone"])(pet.state.activity) : "neutral";
}
function needPressure(pet) {
    const hunger = pet.state.hunger >= 72 ? pet.state.hunger - 60 : 0;
    const stress = pet.state.stress >= 68 ? pet.state.stress - 58 : 0;
    const hygiene = pet.state.hygiene <= 34 ? 38 - pet.state.hygiene : 0;
    const energy = pet.state.energy <= 30 ? 34 - pet.state.energy : 0;
    return Math.max(hunger, stress, hygiene, energy, 0);
}
function participantNames(petsById, petIds) {
    return petIds.map((petId)=>petsById.get(petId)?.pet.name).filter((name)=>Boolean(name));
}
function eventTitle(event, petsById) {
    const names = participantNames(petsById, event.relatedPetId ? [
        event.petId,
        event.relatedPetId
    ] : [
        event.petId
    ]);
    if (names.length > 1) {
        return `${names[0]} x ${names[1]}`;
    }
    return names[0] ?? "Garden signal";
}
function uniquePetIds(petIds) {
    return [
        ...new Set(petIds.filter((petId)=>Boolean(petId)))
    ];
}
function buildWorldPulseItems({ encounters, events, pets, limit = DEFAULT_LIMIT }) {
    const petsById = new Map(pets.map((pet)=>[
            pet.pet.id,
            pet
        ]));
    const representedEventIds = new Set(encounters.flatMap((encounter)=>encounter.relatedEventIds));
    const activeEncounterPetIds = new Set(encounters.filter((encounter)=>encounter.status !== "resolved" && encounter.status !== "expired").flatMap((encounter)=>encounter.participantPetIds));
    const items = [];
    for (const encounter of encounters){
        if (encounter.status === "resolved" || encounter.status === "expired") {
            continue;
        }
        items.push({
            id: `encounter:${encounter.id}`,
            kind: "encounter",
            tone: encounter.tone,
            priority: 100 + encounterTonePriority[encounter.tone] + stagePriority[encounter.stage] + statusPriority[encounter.status ?? "active"],
            title: encounter.title,
            summary: encounter.summary,
            actionLabel: "Inspect",
            petIds: encounter.participantPetIds,
            encounterId: encounter.id,
            timestamp: encounter.updatedAt
        });
    }
    for (const event of events){
        if (representedEventIds.has(event.id)) {
            continue;
        }
        const pet = petsById.get(event.petId);
        const tone = eventTone(event, pet);
        const petIds = uniquePetIds([
            event.petId,
            event.relatedPetId
        ]);
        items.push({
            id: `event:${event.id}`,
            kind: "event",
            tone,
            priority: 60 + (eventTypePriority[event.type] ?? 7),
            title: eventTitle(event, petsById),
            summary: event.body,
            actionLabel: "Locate",
            petIds,
            eventId: event.id,
            timestamp: event.createdAt
        });
    }
    for (const pet of pets){
        const pressure = needPressure(pet);
        if (!pet.state.lastAutonomyDecision && pressure <= 0) {
            continue;
        }
        if (activeEncounterPetIds.has(pet.pet.id) && pressure <= 0) {
            continue;
        }
        const intent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIntentSummary"])(pet);
        const tone = pressure > 0 ? "care" : intent.tone;
        items.push({
            id: `intent:${pet.pet.id}`,
            kind: "intent",
            tone,
            priority: 40 + pressure + (intent.source === "llm" ? 8 : 0),
            title: `${pet.pet.name} is ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$labels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activityLabel"])(pet.state.lastAutonomyDecision?.chosenActivity ?? pet.state.activity)}`,
            summary: intent.reason,
            actionLabel: "Track",
            petIds: [
                pet.pet.id
            ],
            timestamp: pet.state.lastAutonomyDecision?.decidedAt ?? pet.state.lastSimulatedAt
        });
    }
    return items.sort((left, right)=>{
        if (right.priority !== left.priority) {
            return right.priority - left.priority;
        }
        return (right.timestamp ?? "").localeCompare(left.timestamp ?? "");
    }).slice(0, limit);
}
function pulseLabel(kind) {
    switch(kind){
        case "encounter":
            return "Encounter";
        case "event":
            return "Event";
        case "intent":
            return "Autonomy";
    }
}
function WorldPulse({ encounters, events, pets, selectedEncounterId, selectedPetId, onSelectEncounter, onSelectPet, limit }) {
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildWorldPulseItems({
            encounters,
            events,
            pets,
            limit
        }), [
        encounters,
        events,
        limit,
        pets
    ]);
    const petsById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new Map(pets.map((pet)=>[
                pet.pet.id,
                pet
            ])), [
        pets
    ]);
    function selectItem(item) {
        if (item.encounterId) {
            onSelectEncounter(item.encounterId, item.petIds[0]);
            return;
        }
        if (item.petIds[0]) {
            onSelectPet(item.petIds[0]);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-3",
        "data-testid": "world-pulse",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__["Radio"], {
                                        "aria-hidden": "true",
                                        className: "h-4 w-4 text-cyan-200/70"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-pulse.tsx",
                                        lineNumber: 294,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold text-white",
                                        children: "World Pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-pulse.tsx",
                                        lineNumber: 295,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-pulse.tsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs uppercase tracking-[0.2em] text-white/35",
                                children: "autonomy, incidents, encounters"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-pulse.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/world-pulse.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42",
                        children: items.length
                    }, void 0, false, {
                        fileName: "[project]/components/garden/world-pulse.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/world-pulse.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/48",
                children: "当前分区没有强信号。宠物仍会继续自主行动，下一次刷新会更新这里。"
            }, void 0, false, {
                fileName: "[project]/components/garden/world-pulse.tsx",
                lineNumber: 305,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2",
                children: items.map((item)=>{
                    const Icon = toneIcons[item.tone];
                    const selected = item.encounterId && item.encounterId === selectedEncounterId || item.petIds.some((petId)=>petId === selectedPetId);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        "aria-current": selected ? "true" : undefined,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-[22px] border p-3 transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5", toneStyles[item.tone], selected ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]" : ""),
                        "data-encounter-id": item.encounterId,
                        "data-kind": item.kind,
                        "data-testid": "world-pulse-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "grid w-full grid-cols-[auto,minmax(0,1fr)_auto] items-start gap-3 text-left",
                                onClick: ()=>selectItem(item),
                                type: "button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            "aria-hidden": "true",
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/world-pulse.tsx",
                                            lineNumber: 335,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/world-pulse.tsx",
                                        lineNumber: 334,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex flex-wrap items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45",
                                                        children: pulseLabel(item.kind)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/world-pulse.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 23
                                                    }, this),
                                                    item.timestamp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] uppercase tracking-[0.16em] text-white/35",
                                                        suppressHydrationWarning: true,
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRelativeTime"])(item.timestamp)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/garden/world-pulse.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 25
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/garden/world-pulse.tsx",
                                                lineNumber: 338,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-2 block break-words text-sm font-semibold leading-5 text-white",
                                                children: item.title
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-pulse.tsx",
                                                lineNumber: 351,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-1 line-clamp-2 block break-words text-xs leading-5 text-white/62",
                                                children: item.summary
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-pulse.tsx",
                                                lineNumber: 354,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-pulse.tsx",
                                        lineNumber: 337,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/56",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                "aria-hidden": "true",
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-pulse.tsx",
                                                lineNumber: 359,
                                                columnNumber: 21
                                            }, this),
                                            item.actionLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/world-pulse.tsx",
                                        lineNumber: 358,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/world-pulse.tsx",
                                lineNumber: 329,
                                columnNumber: 17
                            }, this),
                            item.petIds.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex flex-wrap gap-2 pl-[3.25rem]",
                                children: item.petIds.map((petId)=>{
                                    const pet = petsById.get(petId);
                                    if (!pet) {
                                        return null;
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-label": `Select ${pet.pet.name}`,
                                        className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 py-1 pl-1 pr-3 text-xs text-white/72 transition-colors hover:border-cyan-300/30 hover:text-white",
                                        onClick: ()=>onSelectPet(petId),
                                        type: "button",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                alt: pet.pet.name,
                                                className: "h-7 w-7 rounded-full bg-black/30 object-contain p-0.5 [image-rendering:pixelated]",
                                                src: pet.generation.worldSpritePath
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/world-pulse.tsx",
                                                lineNumber: 380,
                                                columnNumber: 27
                                            }, this),
                                            pet.pet.name
                                        ]
                                    }, petId, true, {
                                        fileName: "[project]/components/garden/world-pulse.tsx",
                                        lineNumber: 373,
                                        columnNumber: 25
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/garden/world-pulse.tsx",
                                lineNumber: 365,
                                columnNumber: 19
                            }, this) : null
                        ]
                    }, item.id, true, {
                        fileName: "[project]/components/garden/world-pulse.tsx",
                        lineNumber: 317,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/garden/world-pulse.tsx",
                lineNumber: 309,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/world-pulse.tsx",
        lineNumber: 290,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/garden/world-snapshot-cache.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeCurrentZoneSnapshot",
    ()=>mergeCurrentZoneSnapshot
]);
function mergeCurrentZoneSnapshot(worldSnapshots, currentSnapshot) {
    let replaced = false;
    const merged = worldSnapshots.map((snapshot)=>{
        if (snapshot.zone.id !== currentSnapshot.zone.id) {
            return snapshot;
        }
        replaced = true;
        return currentSnapshot;
    });
    return replaced ? merged : [
        ...merged,
        currentSnapshot
    ];
}
}),
"[project]/components/garden/use-garden-zone-state.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGardenZoneState",
    ()=>useGardenZoneState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/cache-keys.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/ui-cache.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/client/perf.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const SNAPSHOT_TTL_MS = 3_000;
const SNAPSHOT_POLL_MS = 3_500;
async function fetchZoneSnapshot(zoneId) {
    const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(await fetch(`/api/garden/snapshot?zoneId=${zoneId}`, {
        cache: "no-store"
    }), "花园同步失败。");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateCache"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].gardenEvents(zoneId), payload.snapshot.recentEvents, SNAPSHOT_TTL_MS);
    return payload.snapshot;
}
function areEventsEqual(left, right) {
    if (left.length !== right.length) {
        return false;
    }
    return left.every((event, index)=>event.id === right[index]?.id);
}
function useGardenZoneState(zoneId, initialSnapshot) {
    const matchingInitialSnapshot = initialSnapshot?.zone.id === zoneId ? initialSnapshot : undefined;
    const [transport, setTransport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("paused");
    const [isPageVisible, setIsPageVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>typeof document === "undefined" || document.visibilityState !== "hidden");
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const queuedEventsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const switchMarkRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const resource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUiResource"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].gardenSnapshot(zoneId), {
        enabled: true,
        fetcher: ()=>fetchZoneSnapshot(zoneId),
        initialData: matchingInitialSnapshot,
        keepPreviousData: true,
        ttlMs: SNAPSHOT_TTL_MS
    });
    const eventsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUiResource"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].gardenEvents(zoneId), {
        enabled: true,
        fetcher: async ()=>{
            const snapshot = await fetchZoneSnapshot(zoneId);
            return snapshot.recentEvents;
        },
        initialData: matchingInitialSnapshot?.recentEvents,
        keepPreviousData: true,
        ttlMs: SNAPSHOT_TTL_MS
    });
    const refreshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(resource.refresh);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!matchingInitialSnapshot) {
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateCache"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].gardenSnapshot(zoneId), matchingInitialSnapshot, SNAPSHOT_TTL_MS);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateCache"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].gardenEvents(zoneId), matchingInitialSnapshot.recentEvents, SNAPSHOT_TTL_MS);
    }, [
        matchingInitialSnapshot,
        zoneId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (typeof document === "undefined") {
            return;
        }
        const handleVisibilityChange = ()=>{
            setIsPageVisible(document.visibilityState !== "hidden");
        };
        handleVisibilityChange();
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return ()=>{
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        refreshRef.current = resource.refresh;
    }, [
        resource.refresh
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const displayingRequestedZone = resource.data?.zone.id === zoneId;
        if (!displayingRequestedZone && !switchMarkRef.current) {
            const markName = `garden-zone-switch:start:${zoneId}:${Date.now()}`;
            switchMarkRef.current = markName;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(markName);
        }
        if (displayingRequestedZone && switchMarkRef.current) {
            const endMarkName = `garden-zone-switch:end:${zoneId}:${Date.now()}`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markPerformance"])(endMarkName);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$perf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["measurePerformance"])(`garden-zone-switch:${zoneId}`, switchMarkRef.current, endMarkName);
            switchMarkRef.current = null;
        }
    }, [
        resource.data,
        zoneId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPageVisible) {
            return;
        }
        let disposed = false;
        let eventSource = null;
        let snapshotInterval = null;
        const cancelQueuedFlush = ()=>{
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            queuedEventsRef.current = null;
        };
        const flushEvents = ()=>{
            animationFrameRef.current = null;
            if (disposed || !queuedEventsRef.current) {
                return;
            }
            const nextEvents = queuedEventsRef.current;
            queuedEventsRef.current = null;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateCache"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].gardenEvents(zoneId), nextEvents, SNAPSHOT_TTL_MS);
        };
        const scheduleEvents = (nextEvents)=>{
            queuedEventsRef.current = nextEvents;
            if (animationFrameRef.current === null) {
                animationFrameRef.current = window.requestAnimationFrame(flushEvents);
            }
        };
        const stopSnapshotPolling = ()=>{
            if (snapshotInterval) {
                window.clearInterval(snapshotInterval);
                snapshotInterval = null;
            }
        };
        const pullSnapshot = async ()=>{
            try {
                const snapshot = await fetchZoneSnapshot(zoneId);
                if (disposed) {
                    return;
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateCache"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].gardenSnapshot(zoneId), snapshot, SNAPSHOT_TTL_MS);
                scheduleEvents(snapshot.recentEvents);
            } catch  {
            // ignore poll failures; the next interval retries
            }
        };
        // Positions, needs and objects only travel through the snapshot, so the
        // poll must run continuously — SSE below only carries narrative events.
        const startSnapshotPolling = ()=>{
            if (snapshotInterval) {
                return;
            }
            snapshotInterval = window.setInterval(()=>{
                void pullSnapshot();
            }, SNAPSHOT_POLL_MS);
        };
        const connectStream = ()=>{
            eventSource = new EventSource(`/api/garden/events-stream?zoneId=${zoneId}`);
            setTransport("live");
            eventSource.onmessage = (message)=>{
                try {
                    const payload = JSON.parse(message.data);
                    if (Array.isArray(payload.events)) {
                        scheduleEvents(payload.events);
                    }
                } catch  {
                // ignore malformed events
                }
            };
            eventSource.onerror = ()=>{
                eventSource?.close();
                eventSource = null;
                setTransport("polling");
            };
        };
        void refreshRef.current().catch(()=>undefined);
        startSnapshotPolling();
        connectStream();
        return ()=>{
            disposed = true;
            eventSource?.close();
            stopSnapshotPolling();
            cancelQueuedFlush();
        };
    }, [
        isPageVisible,
        zoneId
    ]);
    const events = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>eventsResource.data ?? resource.data?.recentEvents ?? matchingInitialSnapshot?.recentEvents ?? [], [
        eventsResource.data,
        matchingInitialSnapshot?.recentEvents,
        resource.data?.recentEvents
    ]);
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!resource.data) {
            return matchingInitialSnapshot ?? null;
        }
        if (events.length === 0 || areEventsEqual(resource.data.recentEvents, events)) {
            return resource.data;
        }
        return {
            ...resource.data,
            recentEvents: events
        };
    }, [
        events,
        matchingInitialSnapshot,
        resource.data
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            snapshot,
            events,
            error: resource.error,
            status: resource.status,
            transport: isPageVisible ? transport : "paused",
            updatedAt: resource.updatedAt,
            hasData: resource.hasData,
            isLoading: resource.isLoading,
            isRefreshing: resource.isRefreshing,
            refresh: async ()=>{
                const nextSnapshot = await resource.refresh();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$ui$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateCache"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$client$2f$cache$2d$keys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cacheKeys"].gardenEvents(zoneId), nextSnapshot.recentEvents, SNAPSHOT_TTL_MS);
                return nextSnapshot;
            }
        }), [
        events,
        isPageVisible,
        resource,
        snapshot,
        transport,
        zoneId
    ]);
}
}),
"[project]/components/garden/garden-experience.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GardenExperience",
    ()=>GardenExperience
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Radar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radar.js [app-ssr] (ecmascript) <export default as Radar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$chat$2d$drawer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/chat/chat-drawer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$ambient$2d$encounters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/ambient-encounters.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$map$2d$overlays$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/autonomy-map-overlays.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$route$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/autonomy-route-panel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$roster$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/autonomy-roster.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$context$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/encounter-context-panel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$canvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/garden-canvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$narrative$2d$feed$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/narrative-feed.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$pet$2d$autonomy$2d$hud$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/pet-autonomy-hud.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$action$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-action-feedback.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$activity$2d$tape$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-activity-tape.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$director$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-director.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$echo$2d$feed$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-echo-feed.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$map$2d$radar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-map-radar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$pulse$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-pulse.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$snapshot$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/world-snapshot-cache.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$use$2d$garden$2d$zone$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/garden/use-garden-zone-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const PRESENCE_REPORT_INTERVAL_MS = 4_000;
function GardenExperience({ initialSnapshot, worldSnapshots, zones, viewer }) {
    const [activeZoneId, setActiveZoneId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialSnapshot.zone.id);
    const [selectedPetId, setSelectedPetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])();
    const [selectedAutonomyRouteId, setSelectedAutonomyRouteId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])();
    const [selectedEncounterId, setSelectedEncounterId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])();
    const [worldActionFeedback, setWorldActionFeedback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chatOpen, setChatOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const playerTileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const zoneState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$use$2d$garden$2d$zone$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGardenZoneState"])(activeZoneId, initialSnapshot);
    const snapshot = zoneState.snapshot ?? initialSnapshot;
    const isSwitchingZone = snapshot.zone.id !== activeZoneId;
    const isZoneLocked = isSwitchingZone || zoneState.isLoading;
    const activeZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>zones.find((zone)=>zone.id === activeZoneId) ?? snapshot.zone, [
        activeZoneId,
        snapshot.zone,
        zones
    ]);
    const selectedPet = snapshot.pets.find((entry)=>entry.pet.id === selectedPetId);
    const selectedEncounter = snapshot.encounters.find((entry)=>entry.id === selectedEncounterId);
    const autonomyOverlays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$map$2d$overlays$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildAutonomyMapOverlays"])(snapshot, selectedPetId), [
        selectedPetId,
        snapshot
    ]);
    const liveWorldSnapshots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$snapshot$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeCurrentZoneSnapshot"])(worldSnapshots, snapshot), [
        snapshot,
        worldSnapshots
    ]);
    const selectedAutonomyRoute = autonomyOverlays.find((overlay)=>overlay.id === selectedAutonomyRouteId);
    const visibleError = error ?? zoneState.error?.message ?? null;
    // Report the avatar position so pets can come looking for their owner.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!viewer) {
            return;
        }
        let disposed = false;
        const report = async ()=>{
            const tile = playerTileRef.current;
            if (!tile || disposed) {
                return;
            }
            try {
                await fetch("/api/garden/presence", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        zoneId: activeZoneId,
                        tileX: tile.tileX,
                        tileY: tile.tileY
                    })
                });
            } catch  {
            // Presence is best-effort; the next interval retries.
            }
        };
        void report();
        const timer = window.setInterval(()=>{
            void report();
        }, PRESENCE_REPORT_INTERVAL_MS);
        return ()=>{
            disposed = true;
            window.clearInterval(timer);
        };
    }, [
        activeZoneId,
        viewer
    ]);
    function switchZone(zoneId, options = {}) {
        if (zoneId === activeZoneId || isZoneLocked) {
            return;
        }
        setError(null);
        if (!options.preserveSelection) {
            setSelectedAutonomyRouteId(undefined);
            setSelectedEncounterId(undefined);
            setSelectedPetId(undefined);
        }
        setActiveZoneId(zoneId);
    }
    function handlePetSelection(petId) {
        setSelectedPetId((current)=>current === petId ? undefined : petId);
    }
    function handleEncounterSelection(encounterId, participantPetId) {
        setSelectedAutonomyRouteId(undefined);
        setSelectedEncounterId(encounterId);
        if (participantPetId) {
            setSelectedPetId(participantPetId);
        }
    }
    function handleAutonomyRouteSelection(routeId) {
        setError(null);
        setSelectedEncounterId(undefined);
        setSelectedAutonomyRouteId(routeId);
    }
    function handleWorldEchoSelection(item) {
        setError(null);
        setSelectedAutonomyRouteId(undefined);
        setSelectedEncounterId(item.kind === "encounter" ? item.encounterId : undefined);
        setSelectedPetId(item.petIds[0]);
        if (item.zoneId !== activeZoneId) {
            switchZone(item.zoneId, {
                preserveSelection: true
            });
        }
    }
    function handleWorldDirectorBeatSelection(beat) {
        setError(null);
        setSelectedAutonomyRouteId(undefined);
        setSelectedEncounterId(beat.kind === "encounter" ? beat.encounterId : undefined);
        setSelectedPetId(beat.petIds[0]);
        if (beat.zoneId !== activeZoneId) {
            switchZone(beat.zoneId, {
                preserveSelection: true
            });
        }
    }
    function handleWorldActivitySelection(item) {
        setError(null);
        setSelectedAutonomyRouteId(undefined);
        setSelectedEncounterId(item.kind === "encounter" ? item.encounterId : undefined);
        setSelectedPetId(item.petIds[0]);
        if (item.zoneId !== activeZoneId) {
            switchZone(item.zoneId, {
                preserveSelection: true
            });
        }
    }
    function handleWorldActionComplete(result) {
        setWorldActionFeedback((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$action$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildWorldActionFeedback"])(result));
    }
    async function refreshCurrentZone() {
        try {
            setError(null);
            await zoneState.refresh();
        } catch (refreshError) {
            setError(refreshError instanceof Error ? refreshError.message : "花园同步失败。");
        }
    }
    async function handleProximityOwnerAction(interaction) {
        if (!viewer) {
            setError("先登录才能照顾宠物。");
            return;
        }
        try {
            setError(null);
            const response = await fetch(`/api/pets/${interaction.petId}/actions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: interaction.action
                })
            });
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "互动失败。");
            handleWorldActionComplete({
                petId: result.state.petId,
                zoneId: result.state.zoneId,
                previousZoneId: result.state.zoneId,
                activity: result.state.activity,
                summary: result.event.body
            });
            await refreshCurrentZone();
        } catch (interactionError) {
            setError(interactionError instanceof Error ? interactionError.message : "互动失败。");
        }
    }
    function handleOpenChat(petId) {
        setSelectedPetId(petId);
        setChatOpen(true);
    }
    async function handleCleanPoop(objectId) {
        if (!viewer) {
            setError("先登录才能帮忙清理。");
            return;
        }
        try {
            setError(null);
            const response = await fetch("/api/garden/objects/clean", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    objectId
                })
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readJsonResponse"])(response, "清理失败。");
            await refreshCurrentZone();
        } catch (cleanError) {
            setError(cleanError instanceof Error ? cleanError.message : "清理失败。");
        }
    }
    function handlePlayerTileChange(tileX, tileY) {
        playerTileRef.current = {
            tileX,
            tileY
        };
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: "space-y-4 overflow-visible p-4 sm:p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-w-2xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        children: "Open World Garden"
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "mt-2 font-display text-3xl text-white",
                                        children: activeZone.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm leading-6 text-white/62",
                                        children: activeZone.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 overflow-x-auto pb-1",
                                children: zones.map((zone)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `ease-smooth motion-fast shrink-0 rounded-full border px-4 py-2 text-sm transition-[transform,background-color,border-color,color,opacity] ${activeZoneId === zone.id ? "border-lime-300/60 bg-lime-300/15 text-lime-100 shadow-[0_0_0_1px_rgba(190,242,100,0.08)]" : "border-white/10 bg-white/5 text-white/55 hover:border-cyan-300/25 hover:bg-cyan-300/[0.08] hover:text-white"}`,
                                        disabled: isZoneLocked || activeZoneId === zone.id,
                                        onClick: ()=>switchZone(zone.id),
                                        type: "button",
                                        children: isSwitchingZone && activeZoneId === zone.id ? "切换中..." : zone.name
                                    }, zone.id, false, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-experience.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `space-y-3 ${isSwitchingZone ? "smooth-fade" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$garden$2d$canvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GardenCanvas"], {
                                autonomyOverlays: autonomyOverlays,
                                onCleanPoop: handleCleanPoop,
                                onOpenChat: handleOpenChat,
                                onOwnerAction: handleProximityOwnerAction,
                                onPlayerTileChange: handlePlayerTileChange,
                                onSelectAutonomyRoute: handleAutonomyRouteSelection,
                                onSelectEncounter: handleEncounterSelection,
                                onSelectPet: handlePetSelection,
                                onTravel: (zoneId)=>switchZone(zoneId, {
                                        preserveSelection: true
                                    }),
                                selectedAutonomyRouteId: selectedAutonomyRouteId,
                                selectedEncounterId: selectedEncounterId,
                                selectedPetId: selectedPetId,
                                snapshot: snapshot,
                                travelLocked: isZoneLocked,
                                viewerId: viewer?.id,
                                viewerName: viewer?.displayName,
                                zones: zones
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this),
                            selectedPet && viewer?.id === selectedPet.pet.ownerId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-cyan-300/10 bg-cyan-300/[0.04] px-4 py-3 text-sm leading-6 text-cyan-50/78",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "走到 ",
                                            selectedPet.pet.name,
                                            " 身边就能喂食和抚摸；离得远时，点呼唤让它自己跑过来找你。"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 304,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: "gap-2",
                                        onClick: ()=>setChatOpen(true),
                                        type: "button",
                                        variant: "secondary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                "aria-hidden": "true",
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 308,
                                                columnNumber: 17
                                            }, this),
                                            "和 ",
                                            selectedPet.pet.name,
                                            " 聊聊"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 303,
                                columnNumber: 13
                            }, this) : null,
                            isSwitchingZone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-[18px] border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-3 text-sm text-cyan-100/80",
                                children: [
                                    "正在切到 ",
                                    activeZone.name,
                                    "，当前画面会保留到新分区就绪。"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$action$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldActionFeedback"], {
                                feedback: worldActionFeedback,
                                onClear: ()=>setWorldActionFeedback(null),
                                onSelectPet: handlePetSelection
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this),
                            selectedAutonomyRoute ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$route$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutonomyRoutePanel"], {
                                onActionComplete: handleWorldActionComplete,
                                onClear: ()=>setSelectedAutonomyRouteId(undefined),
                                onRefresh: refreshCurrentZone,
                                onSelectPet: handlePetSelection,
                                overlay: selectedAutonomyRoute,
                                pets: snapshot.pets,
                                viewer: viewer
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 324,
                                columnNumber: 13
                            }, this) : null,
                            selectedEncounter ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$encounter$2d$context$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EncounterContextPanel"], {
                                encounter: selectedEncounter,
                                onClear: ()=>setSelectedEncounterId(undefined),
                                onRefresh: refreshCurrentZone,
                                onSelectPet: handlePetSelection,
                                pets: snapshot.pets,
                                viewer: viewer
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this) : null,
                            visibleError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-rose-300",
                                children: visibleError
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 344,
                                columnNumber: 27
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-experience.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/garden-experience.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-5 2xl:grid-cols-[minmax(0,1fr)_24rem]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$ambient$2d$encounters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AmbientEncounters"], {
                                    encounters: snapshot.encounters,
                                    onRefresh: refreshCurrentZone,
                                    onSelectPet: handlePetSelection,
                                    pets: snapshot.pets,
                                    selectedEncounterId: selectedEncounterId,
                                    viewerId: viewer?.id
                                }, void 0, false, {
                                    fileName: "[project]/components/garden/garden-experience.tsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$narrative$2d$feed$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NarrativeFeed"], {
                                    events: zoneState.events,
                                    onSelectPet: handlePetSelection,
                                    pets: snapshot.pets,
                                    transport: zoneState.transport,
                                    zoneId: activeZoneId
                                }, void 0, false, {
                                    fileName: "[project]/components/garden/garden-experience.tsx",
                                    lineNumber: 361,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 360,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-experience.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 2xl:sticky 2xl:top-24 2xl:self-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$pet$2d$autonomy$2d$hud$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PetAutonomyHud"], {
                                onChat: ()=>setChatOpen(true),
                                onRefresh: refreshCurrentZone,
                                pet: selectedPet ?? null,
                                viewer: viewer
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$map$2d$radar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldMapRadar"], {
                                    activeZoneId: activeZoneId,
                                    disabled: isZoneLocked,
                                    onSelectZone: switchZone,
                                    snapshots: liveWorldSnapshots
                                }, void 0, false, {
                                    fileName: "[project]/components/garden/garden-experience.tsx",
                                    lineNumber: 379,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 378,
                                columnNumber: 11
                            }, this),
                            zoneState.isRefreshing && !isSwitchingZone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-2 text-sm text-white/40",
                                children: "花园正在后台刷新。"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 387,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-experience.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/garden-experience.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "group rounded-[24px] border border-white/10 bg-white/[0.03]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        className: "flex cursor-pointer select-none items-center gap-3 rounded-[24px] px-5 py-4 text-sm font-semibold text-white/70 transition-colors hover:text-white [&::-webkit-details-marker]:hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Radar$3e$__["Radar"], {
                                "aria-hidden": "true",
                                className: "h-4 w-4 text-cyan-200"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 394,
                                columnNumber: 11
                            }, this),
                            "世界监控台 · World Console",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto text-xs font-normal uppercase tracking-[0.2em] text-white/35 group-open:hidden",
                                children: "展开"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 396,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto hidden text-xs font-normal uppercase tracking-[0.2em] text-white/35 group-open:inline",
                                children: "收起"
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-experience.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 px-5 pb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2 text-sm sm:grid-cols-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-[18px] border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] uppercase tracking-[0.2em] text-cyan-100/55",
                                                children: "Garden Time"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 406,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 font-mono text-lg text-cyan-50",
                                                children: snapshot.world.clockLabel
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 407,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-cyan-100/50",
                                                children: snapshot.world.phase
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 408,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 405,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] uppercase tracking-[0.2em] text-white/42",
                                                children: "Transport"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 411,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 font-mono text-lg text-white",
                                                children: zoneState.transport
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 412,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-white/42",
                                                children: zoneState.isRefreshing ? "refreshing" : "steady"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 413,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 410,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-[18px] border border-lime-300/12 bg-lime-300/[0.05] px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] uppercase tracking-[0.2em] text-lime-100/50",
                                                children: "Pets"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 416,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 font-mono text-lg text-lime-50",
                                                children: snapshot.pets.length
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 417,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 415,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-[18px] border border-amber-300/12 bg-amber-300/[0.05] px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] uppercase tracking-[0.2em] text-amber-100/50",
                                                children: "Objects"
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 420,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 font-mono text-lg text-amber-50",
                                                children: snapshot.objects.filter((item)=>!item.removedAt).length
                                            }, void 0, false, {
                                                fileName: "[project]/components/garden/garden-experience.tsx",
                                                lineNumber: 421,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 419,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 404,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$director$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldDirector"], {
                                activeZoneId: activeZoneId,
                                onSelectBeat: handleWorldDirectorBeatSelection,
                                selectedEncounterId: selectedEncounterId,
                                selectedPetId: selectedPetId,
                                snapshots: liveWorldSnapshots
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 427,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$activity$2d$tape$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldActivityTape"], {
                                activeZoneId: activeZoneId,
                                onSelectItem: handleWorldActivitySelection,
                                selectedEncounterId: selectedEncounterId,
                                selectedPetId: selectedPetId,
                                snapshots: liveWorldSnapshots
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 435,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-4 lg:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$autonomy$2d$roster$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutonomyRoster"], {
                                            onSelectPet: handlePetSelection,
                                            pets: snapshot.pets,
                                            selectedPetId: selectedPetId
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-experience.tsx",
                                            lineNumber: 445,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 444,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$echo$2d$feed$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldEchoFeed"], {
                                            activeZoneId: activeZoneId,
                                            onSelectEcho: handleWorldEchoSelection,
                                            selectedZoneId: activeZoneId,
                                            snapshots: liveWorldSnapshots
                                        }, void 0, false, {
                                            fileName: "[project]/components/garden/garden-experience.tsx",
                                            lineNumber: 452,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/garden/garden-experience.tsx",
                                        lineNumber: 451,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 443,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$garden$2f$world$2d$pulse$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldPulse"], {
                                    encounters: snapshot.encounters,
                                    events: snapshot.recentEvents,
                                    onSelectEncounter: handleEncounterSelection,
                                    onSelectPet: handlePetSelection,
                                    pets: snapshot.pets,
                                    selectedEncounterId: selectedEncounterId,
                                    selectedPetId: selectedPetId
                                }, void 0, false, {
                                    fileName: "[project]/components/garden/garden-experience.tsx",
                                    lineNumber: 462,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/garden/garden-experience.tsx",
                                lineNumber: 461,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/garden/garden-experience.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/garden/garden-experience.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$chat$2d$drawer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChatDrawer"], {
                onClose: ()=>setChatOpen(false),
                onRefresh: refreshCurrentZone,
                open: chatOpen,
                pet: selectedPet ?? null,
                viewerId: viewer?.id
            }, void 0, false, {
                fileName: "[project]/components/garden/garden-experience.tsx",
                lineNumber: 475,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/garden/garden-experience.tsx",
        lineNumber: 255,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_d17c6039._.js.map