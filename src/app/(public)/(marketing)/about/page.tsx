import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Marquee, Reveal, StatsRow, TeamCarousel, Testimonials, ValueGrid } from "./AboutInteractive";

export const metadata = {
  title: "About Us | PUB GradPath",
  description: "PUB GradPath makes studying abroad clearer with universities, scholarships, mentors, and preparation tools in one place.",
};

const G = "/assets/guides/";
const heading = "font-[family-name:var(--font-heading)] font-semibold tracking-[-0.03em] text-foreground";
const wrap = "mx-auto max-w-6xl px-5 sm:px-8";

const stats = [
  { to: 10, suffix: "K+", label: "Students guided" },
  { to: 500, suffix: "+", label: "Universities explored" },
  { to: 50, suffix: "+", label: "Countries within reach" },
  { to: 120, suffix: "+", label: "Verified mentors" },
];
const values = [
  { icon: "heart" as const, title: "Student-first", body: "We design around missed deadlines, scattered tabs, and too many unknowns." },
  { icon: "shield" as const, title: "Honest guidance", body: "No fake guarantees or sales pressure. Mentors who have walked the path." },
  { icon: "globe" as const, title: "Global, not generic", body: "Shaped around your destination, field, budget, and ambitions." },
  { icon: "compass" as const, title: "Clarity over noise", body: "One next step is better than a hundred open tabs." },
];
const tools = ["University search", "Scholarships", "Mentors", "Preparation", "Applications", "Global community", "Visa guidance", "Deadline planner"];
const team = [
  { name: "Zisan Ul Haque", role: "Team Lead & Full-Stack Developer", image: G + "zisan.png" },
  { name: "Afsana Nur Labonno", role: "Frontend Developer", image: G + "laaa.jpeg" },
  { name: "Al Amin Sarder", role: "Video Editor & UI", image: G + "alamin.jpeg" },
  { name: "Zahin Rahman Rufaida", role: "Researcher", image: G + "Zahin.jpeg" },
  { name: "Mst.Nusrat Ananna", role: "Researcher", image: G + "ananna.png" },
];
const places = [
  { name: "United Kingdom", detail: "Universities, funding and visa guidance", image: "https://plus.unsplash.com/premium_photo-1682799116921-de130f76c1d0?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "North America", detail: "Build a shortlist that fits your goals", image: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?q=80&w=1087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Everywhere next", detail: "Explore 50+ countries with confidence", image: "https://plus.unsplash.com/premium_photo-1697730221799-f2aa87ab2c5d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
];

const Photo = ({ src, alt, className }: { src: string; alt: string; className: string }) => (
  <div className={`group relative overflow-hidden rounded-2xl bg-muted ${className}`}>
    <Image alt={alt} className="object-cover transition duration-700 group-hover:scale-105" fill sizes="(max-width:768px) 100vw, 33vw" src={src} />
  </div>
);

export default function AboutPage() {
  return (
    <div className="overflow-hidden bg-background font-[family-name:var(--font-sans)] text-foreground">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background pb-20 pt-32 sm:pt-40">
        <div className={wrap}>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h1 className={`${heading} text-5xl leading-[1.05] sm:text-7xl`}>Where ambition meets a clearer path.</h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-muted-foreground">Our mission is to close the gap between students and the opportunities abroad, with clarity and confidence at every step.</p>
          </Reveal>
          <Reveal className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-[1fr_1fr]" delay={0.15}>
            <Photo alt="Aminul Islam" className="min-h-72 md:row-span-2 md:min-h-[26rem]" src={G + "about2.avif"} />
            <div className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground">
              <p className={`${heading} text-5xl !text-primary-foreground`}>10K+</p>
              <p className="text-base font-medium">Students guided</p>
            </div>
            <Photo alt="Mentors" className="min-h-60" src={"https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"} />
            <Photo alt="Campus" className="min-h-60" src="https://plus.unsplash.com/premium_photo-1681842124524-98822110352f?q=80&w=1202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" />
            <Photo alt="Community" className="min-h-60 md:hidden" src={"https://plus.unsplash.com/premium_photo-1727209457571-00be81de277c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"} />
            <div className="flex flex-col justify-between rounded-2xl bg-foreground p-6 text-background md:col-start-3">
              <p className={`${heading} text-5xl !text-background`}>120+</p>
              <p className="text-base font-medium">Verified mentors</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission + stats */}
      <section className="py-20 sm:py-28">
        <div className={wrap}>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal><h2 className={`${heading} text-4xl leading-tight sm:text-5xl`}>Making study abroad clearer for everyone</h2></Reveal>
            <Reveal className="space-y-5 text-sm leading-6 text-muted-foreground" delay={0.1}>
              <p>What began as a shared spreadsheet and a group chat has grown into a platform for students from Bangladesh and beyond. Our journey has been fueled by passion, collaboration, and a relentless drive to make a difference.</p>
              <p>The best opportunities are often hidden behind confusing forms and scattered deadlines. We bring universities, scholarships, mentors, and preparation into one calm workspace, so students can decide at their own pace.</p>
            </Reveal>
          </div>
          <div className="mt-16"><StatsRow stats={stats} /></div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-16 sm:py-24">
        <div className={wrap}>
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <h2 className={`${heading} text-4xl sm:text-5xl`}>Our core values</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">We believe in building long-term confidence, based on trust and mutual respect, not short-term pressure.</p>
          </Reveal>
          <ValueGrid values={values} />
        </div>
      </section>

      {/* Backed by the best */}
      <section className="py-16 sm:py-24">
        <div className={wrap}>
          <Reveal className="mx-auto mb-10 max-w-xl text-center">
            <h2 className={`${heading} text-4xl sm:text-5xl`}>Everything in one place</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">From the first search to the final application, the tools you need work together.</p>
          </Reveal>
        </div>
        <Marquee items={tools} />
      </section>

      {/* Founder */}
      <section className="py-16 sm:py-24">
        <div className={`${wrap} grid items-center gap-10 md:grid-cols-[1fr_0.9fr]`}>
          <Reveal>
            <h2 className={`${heading} text-4xl sm:text-5xl`}>A word from the founder</h2>
            <div className="mt-6 max-w-md space-y-4 text-sm leading-6 text-muted-foreground">
              <p>We started PUB GradPath because talented students were spending more energy navigating the system than preparing for the future they wanted.</p>
              <p>Our work is to make the path easier to understand, one decision at a time. Thank you for being part of this story.</p>
            </div>
            <p className="mt-8 text-sm font-semibold">Zisan Ul Haque</p>
            <p className="text-xs text-muted-foreground">Founder, PUB GradPath</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl bg-primary/5 p-4">
            <Photo alt="Student celebrating on campus" className="aspect-[4/3] !rounded-2xl" src={G + "about1.png"} />
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-24">
        <div className={wrap}>
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <h2 className={`${heading} text-4xl sm:text-5xl`}>Meet the team</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Behind every great experience is a group of builders, mentors, and learners.</p>
          </Reveal>
          <TeamCarousel team={team} />
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 sm:py-24">
        <div className={wrap}>
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <h2 className={`${heading} text-4xl sm:text-5xl`}>Our students are all over the world</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Compare destinations and take the next step with more context.</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {places.map((p, i) => (
              <Reveal delay={i * 0.08} key={p.name}>
                <Photo alt={p.name} className="aspect-[4/3]" src={p.image} />
                <p className="mt-4 flex items-center gap-1.5 text-base font-semibold"><MapPin className="size-4 text-primary" />{p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 pt-10 sm:pb-32">
        <div className={wrap}>
          <Reveal className="grid items-center gap-10 overflow-hidden rounded-3xl bg-primary/5 p-8 sm:p-14 md:grid-cols-2">
            <div>
              <h2 className={`${heading} text-4xl sm:text-5xl`}>Start your journey today.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Discover opportunities, organise the details, and find the support to keep moving.</p>
              <div className="mt-7 flex gap-3">
                <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90" href="/register">Get started <ArrowRight className="size-4" /></Link>
                <Link className="inline-flex items-center rounded-full border border-border px-5 py-3 text-sm font-medium transition hover:bg-card" href="/contact">Learn more</Link>
              </div>
            </div>
            <div className="group relative aspect-[16/11] overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/15 md:-mr-24 md:translate-y-4 lg:-mr-32">
              <Image alt="PUB GradPath dashboard" className="object-cover object-left-top transition duration-700 group-hover:scale-[1.03]" fill sizes="(max-width:768px) 100vw, 50vw" src="/dashboard.png" />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}