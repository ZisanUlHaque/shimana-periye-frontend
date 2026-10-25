"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUp,
  GraduationCap,
  Building2,
  Globe,
} from "lucide-react";

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-sky-100 via-blue-50 to-sky-100 text-gray-700 pt-12">
      
      {/* 🌊 High-Contrast Wavy SVG Divider (Double Layer for Sharp Visibility) */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%] overflow-hidden leading-none pointer-events-none z-10">
        <svg
          className="relative block w-full h-[60px] sm:h-[90px] lg:h-[130px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Darker Back Shadow Wave for high contrast against white background */}
          <path
            d="M0,0 C150,90 350,-40 500,60 C650,140 900,-20 1200,40 L1200,120 L0,120 Z"
            className="fill-sky-300/40"
          ></path>
          {/* Layer 2: Main Front Wave matching Footer Top Gradient */}
          <path
            d="M0,30 C200,100 450,10 650,70 C850,130 1050,20 1200,50 L1200,120 L0,120 Z"
            className="fill-sky-100"
          ></path>
        </svg>
      </div>

      {/* 📬 Floating Newsletter Card (Overlapping the Wave) */}
      <div className="relative max-w-3xl mx-auto px-6 -mt-16 sm:-mt-24 mb-12 z-20">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-emerald-50/90 via-white/90 to-sky-50/90 p-8 sm:p-10 shadow-xl shadow-sky-900/10 backdrop-blur-xl">
          {/* Soft background decorative blobs */}
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-sky-400/20 blur-2xl" />

          <div className="relative z-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Never Miss a Deadline.
            </h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Subscribe to get scholarship deadlines, university updates, and expert tips — straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-md mx-auto relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full rounded-full border border-emerald-200/80 bg-white/90 px-6 py-4 pr-16 text-sm text-slate-800 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="submit"
                className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-md hover:scale-105 transition-transform"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
            <p className="mt-3 text-[11px] text-slate-400">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="relative overflow-hidden">
        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Faded Watermark */}
        <h1 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[18vw] sm:text-[14vw] font-black text-emerald-900/[0.03] select-none pointer-events-none tracking-tighter whitespace-nowrap">
          ShimanaPeriye
        </h1>

        <div className="relative mx-auto max-w-7xl px-6 pt-6 pb-12">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-300/60">
            
            {/* 1. Brand & Logo Column */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="size-11 overflow-hidden rounded-xl bg-white shadow-md shadow-emerald-500/10 border border-emerald-100 p-0.5 flex items-center justify-center">
                  <Image
                    src="/logo1.png"
                    alt="ShimanaPeriye Logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover rounded-lg"
                    priority
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-sky-700 bg-clip-text text-transparent">
                  ShimanaPeriye
                </span>
              </Link>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your all-in-one higher study platform. Discover universities, apply for scholarships, and connect with verified mentors worldwide.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                <SocialIcon href="#" icon={<FacebookIcon />} ariaLabel="Facebook" />
                <SocialIcon href="#" icon={<TwitterIcon />} ariaLabel="Twitter" />
                <SocialIcon href="#" icon={<LinkedInIcon />} ariaLabel="LinkedIn" />
                <SocialIcon href="#" icon={<InstagramIcon />} ariaLabel="Instagram" />
              </div>
            </div>

            {/* 2. Platform Column */}
            <FooterLinkGroup
              title="Platform"
              icon={<GraduationCap className="h-4 w-4 text-emerald-600" />}
              links={[
                { label: "Universities", href: "/universities" },
                { label: "Scholarships", href: "/scholarships" },
                { label: "Mentors", href: "/mentors" },
                { label: "Roadmaps", href: "/roadmaps" },
              ]}
            />

            {/* 3. Company Column */}
            <FooterLinkGroup
              title="Company"
              icon={<Building2 className="h-4 w-4 text-emerald-600" />}
              links={[
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ]}
            />

            {/* 4. Reach Stats Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600" /> Our Reach
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  50+ Countries Supported
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-sky-500"></span>
                  500+ Partner Universities
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                  10,000+ Students Guided
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} ShimanaPeriye. All rights reserved.</p>
            
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              <span className="text-emerald-600 font-semibold">🌐 Available in 50+ Countries</span>
            </div>

            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-emerald-700 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-110 active:scale-95"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}

{/* Helper Sub-components */}

function SocialIcon({ href, icon, ariaLabel }: { href: string; icon: React.ReactNode; ariaLabel: string }) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 shadow-xs hover:border-emerald-400 hover:text-emerald-600 hover:shadow-md transition-all"
    >
      {icon}
    </a>
  );
}

interface LinkItem {
  label: string;
  href: string;
}

function FooterLinkGroup({
  title,
  icon,
  links,
}: {
  title: string;
  icon: React.ReactNode;
  links: LinkItem[];
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
        {icon} {title}
      </h4>
      <ul className="space-y-2.5 text-sm font-medium">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <span>{link.label}</span>
              <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-500" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

{/* Inline Social SVG Icons */}
function FacebookIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}