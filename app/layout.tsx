import { Suspense } from "react";
import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Space_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderShell } from "@/components/layout/site-header";
import { SiteHeaderUserSkeleton } from "@/components/layout/site-header-user-skeleton";
import { SiteHeaderUserSlot } from "@/components/layout/site-header-user-slot";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";

const displayFont = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const monoFont = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Cypher Garden",
  description: "把你的猫狗上传进一个会自己活着的赛博像素花园。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" style={{ backgroundColor: "#04070d", colorScheme: "dark" }}>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
        style={{ backgroundColor: "#04070d" }}
      >
        <PostHogProvider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="app-backdrop pointer-events-none absolute inset-0" />
            <SiteHeaderShell
              accountSlot={(
                <Suspense fallback={<SiteHeaderUserSkeleton />}>
                  <SiteHeaderUserSlot />
                </Suspense>
              )}
            />
            <main className="relative mx-auto min-h-[calc(100vh-140px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <SiteFooter />
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}
