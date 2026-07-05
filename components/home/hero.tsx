"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trees, PawPrint, Sparkles } from "lucide-react";

import { HomeSignalRadar } from "@/components/home/home-signal-radar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SmartLink } from "@/components/ui/smart-link";
import type { HomeSignalFeed } from "@/lib/types";

export function Hero({ initialSignals }: { initialSignals: HomeSignalFeed }) {
  return (
    <section className="hero-surface relative overflow-hidden rounded-[40px] border border-white/10 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div className="hero-grid absolute inset-0 opacity-35" />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-6"
        >
          <Badge>Cypher Garden Online</Badge>
          <div className="space-y-4">
            <h1 className="font-display text-4xl leading-tight text-white sm:text-6xl">
              不是广场。
              <span className="block text-lime-200">是一个活着的像素花园。</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
              上传你的猫狗，生成像素分身。它们会在公共花园里爬树、发呆、拉屎、打闹、追逐，
              还会把情绪直接甩到你脸上。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SmartLink className={buttonVariants({ className: "w-full sm:w-auto", variant: "primary" })} href="/garden">
              进入花园
              <ArrowRight className="ml-2 h-4 w-4" />
            </SmartLink>
            <SmartLink className={buttonVariants({ className: "w-full sm:w-auto", variant: "secondary" })} href="/pets/new">
              上传我的宠物
            </SmartLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <Trees className="h-8 w-8 text-cyan-200" />
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-cyan-100/70">Zone World</p>
              <p className="mt-2 text-xl font-semibold text-white">4 个固定花园分区</p>
            </div>
            <div className="rounded-[28px] border border-lime-300/20 bg-lime-300/10 p-5">
              <PawPrint className="h-8 w-8 text-lime-200" />
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-lime-100/70">Autonomy</p>
              <p className="mt-2 text-xl font-semibold text-white">宠物会自己生活和闹事</p>
            </div>
            <div className="rounded-[28px] border border-fuchsia-300/20 bg-fuchsia-300/10 p-5">
              <Sparkles className="h-8 w-8 text-fuchsia-200" />
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-fuchsia-100/70">Signals</p>
              <p className="mt-2 text-xl font-semibold text-white">情绪和事件会主动找你</p>
            </div>
          </div>

          <HomeSignalRadar initialFeed={initialSignals} />
        </motion.div>
      </div>
    </section>
  );
}
