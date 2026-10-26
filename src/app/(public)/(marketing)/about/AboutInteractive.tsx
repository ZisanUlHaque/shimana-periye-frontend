"use client";

import { ArrowLeft, ArrowRight, ChevronDown, Compass, Globe2, Heart, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease, delay }}>
      {children}
    </motion.div>
  );
}

function Count({ to, suffix, run }: { to: number; suffix: string; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [run, to]);
  return <>{n}{suffix}</>;
}

export function StatsRow({ stats }: { stats: { to: number; suffix: string; label: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4" ref={ref}>
      {stats.map((s, i) => (
        <div className={`px-2 sm:px-8 ${i ? "lg:border-l lg:border-border" : "lg:pl-0"} ${i % 2 ? "border-l border-border" : ""}`} key={s.label}>
          <p className="font-[family-name:var(--font-heading)] text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
            <Count run={inView} suffix={s.suffix} to={s.to} />
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

const iconMap = { heart: Heart, shield: ShieldCheck, globe: Globe2, compass: Compass };
export function ValueGrid({ values }: { values: { icon: keyof typeof iconMap; title: string; body: string }[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {values.map((v, i) => {
        const Icon = iconMap[v.icon];
        return (
          <Reveal delay={i * 0.07} key={v.title}>
            <div className="group h-full rounded-2xl p-5 transition-colors duration-300 hover:bg-card">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="size-4 text-primary transition-transform duration-300 group-hover:scale-125" /> {v.title}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{v.body}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <motion.div className="flex w-max gap-14 py-2" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 28, ease: "linear", repeat: Infinity }}>
        {row.map((t, i) => (
          <span className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-muted-foreground" key={i}>
            <span className="size-3 rounded-sm bg-primary/70" /> {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function TeamCarousel({ team }: { team: { name: string; role: string; image: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * 280, behavior: "smooth" });
  return (
    <div>
      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8" ref={ref} style={{ scrollbarWidth: "none" }}>
        {team.map((m) => (
          <div className="group w-60 shrink-0 snap-start" key={m.name}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
              <Image alt={m.name} className="object-cover transition duration-700 group-hover:scale-105" fill sizes="240px" src={m.image} />
            </div>
            <p className="mt-3 text-sm font-semibold">{m.name}</p>
            <p className="text-xs text-muted-foreground">{m.role}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {[-1, 1].map((d) => (
          <button aria-label={d < 0 ? "Previous" : "Next"} className="flex size-10 items-center justify-center rounded-full border border-border transition hover:bg-primary hover:text-primary-foreground" key={d} onClick={() => scroll(d)} type="button">
            {d < 0 ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Testimonials({ items }: { items: { quote: string; name: string; role: string; image: string }[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, 3);
  return (
    <div>
      <div className="relative">
        <div className="grid gap-4 md:grid-cols-3">
          {shown.map((t, i) => (
            <motion.figure className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-xl hover:shadow-primary/10"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} key={t.name} transition={{ delay: i > 2 ? 0.1 : 0, duration: 0.5 }}>
              <blockquote className="text-sm leading-6 text-foreground/80">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage alt="" src={t.image} />
                  <AvatarFallback>{t.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span><span className="block text-xs font-semibold">{t.name}</span><span className="block text-[11px] text-muted-foreground">{t.role}</span></span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        {!all && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />}
      </div>
      <div className="mt-6 flex justify-center">
        <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:bg-primary hover:text-primary-foreground" onClick={() => setAll((v) => !v)} type="button">
          {all ? "Show less" : "Show more"} <ChevronDown className={`size-4 transition-transform ${all ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
}