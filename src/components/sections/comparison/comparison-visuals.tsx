"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, HelpCircle, Sparkles } from "lucide-react";
import type { CleanRow } from "./comparison-data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*                               The old way: chaos                            */
/* -------------------------------------------------------------------------- */

const SLOTS = [
  { x: 5, y: 9, r: -4, w: 42 },
  { x: 50, y: 7, r: 3, w: 44 },
  { x: 18, y: 39, r: -2, w: 46 },
  { x: 56, y: 46, r: 5, w: 40 },
  { x: 7, y: 71, r: 2, w: 48 },
];

export function MessyVisual({ items, reduce }: { items: string[]; reduce: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-red-50 via-orange-50/60 to-slate-100">
      {/* ruled "spreadsheet" lines */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(248,113,113,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(248,113,113,0.10)_1px,transparent_1px)] bg-[size:28px_28px]"
      />
      <HelpCircle
        aria-hidden
        className="absolute bottom-5 right-6 size-16 text-red-300/50 sm:size-24"
      />

      {items.slice(0, SLOTS.length).map((text, i) => {
        const s = SLOTS[i];
        return (
          <motion.div
            key={text}
            initial={reduce ? false : { opacity: 0, scale: 0.7, rotate: s.r * 3, y: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: s.r, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.06 * i }}
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%` }}
            className="absolute"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -4, 0] }}
              transition={{
                duration: 3.4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              className="flex items-center gap-2 rounded-xl border border-red-200/70 bg-white px-3 py-2.5 text-[12px] text-slate-500 shadow-[0_10px_24px_-12px_rgba(220,38,38,0.35)] sm:text-sm"
            >
              <AlertTriangle className="size-3.5 shrink-0 text-red-400 sm:size-4" />
              <span className={i % 2 === 0 ? "line-through decoration-red-300" : ""}>{text}</span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         The new way: calm dashboard                         */
/* -------------------------------------------------------------------------- */

export function CleanVisual({ rows, reduce }: { rows: CleanRow[]; reduce: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div
        aria-hidden
        className="absolute -right-16 -top-16 size-64 rounded-full bg-emerald-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-10 size-64 rounded-full bg-sky-300/25 blur-3xl"
      />

      <div className="relative flex h-full items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="w-full max-w-[26rem] rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-[0_30px_60px_-30px_rgba(16,185,129,0.45)] backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-300" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-300" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              <Sparkles className="size-3" />
              Sample preview
            </span>
          </div>

          <ul className="mt-3 space-y-2">
            {rows.map((r, i) => {
              const pct = r.progress ?? 100;
              return (
                <motion.li
                  key={r.label}
                  initial={reduce ? false : { opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.15 + i * 0.09 }}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-sm shadow-emerald-300">
                    <Check className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{r.label}</p>
                    <p className="truncate text-xs text-slate-500">{r.meta}</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
                      <motion.div
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.09 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                      />
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
