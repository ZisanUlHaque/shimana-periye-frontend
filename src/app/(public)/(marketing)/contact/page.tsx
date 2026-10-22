"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

const topics = [
  "General question",
  "Mentorship",
  "University guidance",
  "Partnerships",
  "Press & media",
  "Something else",
];

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.add({
        title: "Message sent",
        description: "We’ll get back to you within 1–2 business days.",
        type: "success",
      });
    }, 700);
  };

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white pt-28 sm:pt-36">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            <MessageCircle className="h-3.5 w-3.5" /> CONTACT
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            We&apos;re a message
            <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              {" "}
              away.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Partnerships, press, product questions, or just stuck on a deadline —
            drop a note. A real human reads every one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-4">
            <InfoCard
              icon={Mail}
              title="Email"
              body="hello@shimanaperiye.com"
              hint="Best for detailed questions"
            />
            <InfoCard
              icon={Clock}
              title="Response time"
              body="1–2 business days"
              hint="Mon–Fri, 10:00–18:00 BST"
            />
            <InfoCard
              icon={MapPin}
              title="Based across"
              body="Dhaka · London · Toronto"
              hint="A remote-first student team"
            />
          </div>

          <div className="lg:col-span-8">
            <form
              onSubmit={onSubmit}
              className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/80 p-6 shadow-xl shadow-sky-100/60 sm:p-10"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />

              <div className="relative grid gap-5 sm:grid-cols-2">
                <Field label="Full name" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Ayesha Rahman"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Topic" htmlFor="topic" className="sm:col-span-2">
                  <select id="topic" name="topic" required className={inputClass}>
                    <option value="">What is this about?</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Message" htmlFor="message" className="sm:col-span-2">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us a little about what you need…"
                    className={`${inputClass} resize-none py-3`}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:shadow-xl disabled:opacity-70 sm:w-auto"
              >
                {loading ? "Sending…" : "Send message"}
                {loading ? (
                  <Send className="h-4 w-4 animate-pulse" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
              <p className="relative mt-3 text-[11px] text-slate-400">
                We never share your email. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`} htmlFor={htmlFor}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
  hint,
}: {
  icon: typeof Mail;
  title: string;
  body: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-600">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <p className="mt-1 font-semibold text-slate-900">{body}</p>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
    </div>
  );
}