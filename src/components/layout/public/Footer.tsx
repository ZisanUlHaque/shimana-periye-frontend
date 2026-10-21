"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Universities", href: "/universities" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Mentors", href: "/mentors" },
    { label: "Roadmaps", href: "/roadmaps" },
];

const resourceItems = [
    { label: "Country Guides", href: "/resources/countries" },
    { label: "Visa Preparation", href: "/resources/visa" },
    { label: "Application Tips", href: "/resources/tips" },
    { label: "Community Forum", href: "/community" },
];

const legalItems = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
];

// Clean SVGs for Social Links
const TwitterIcon = ({ className = "size-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LinkedinIcon = ({ className = "size-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
);

const YoutubeIcon = ({ className = "size-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

export function Footer() {
    return (
        <footer className="relative w-full overflow-hidden bg-[#020d0b] text-slate-200 border-t border-emerald-500/20 pt-16 pb-12">

            {/* Background Lighting Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 blur-[100px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- 1. HERO CALL TO ACTION BANNER --- */}
                <div className="relative mb-16 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/80 via-[#031c16]/90 to-emerald-950/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
                    <div className="absolute -right-10 -top-10 size-60 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-2 max-w-xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Start Your Higher Study Journey
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                Ready to cross borders for your education?
                            </h2>
                            <p className="text-sm text-slate-300/80">
                                Get personalized university matching, scholarship alerts, and 1-on-1 mentor guidance today.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
                            >
                                Get Started Free
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* --- 2. MAIN NAVIGATION GRID & NEWSLETTER CARD --- */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-emerald-500/15">

                    {/* Brand Info & Newsletter */}
                    <div className="lg:col-span-5 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="size-11 rounded-2xl bg-emerald-950/90 border border-emerald-400/40 flex items-center justify-center p-1.5 shadow-lg backdrop-blur-xl group-hover:border-emerald-400 transition-all">
                                <Image
                                    src="/logo1.png"
                                    alt="ShimanaPeriye Logo"
                                    width={36}
                                    height={36}
                                    className="h-full w-full object-cover rounded-xl"
                                />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                Shimana<span className="text-emerald-400">Periye</span>
                            </span>
                        </Link>

                        <p className="text-sm leading-relaxed text-slate-300/80 max-w-md">
                            Discover worldwide universities, track active deadlines, and build a successful global future with verified mentors.
                        </p>

                        {/* Newsletter Input */}
                        <div className="space-y-2 max-w-md pt-2">
                            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                Subscribe to Scholarship Alerts
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 backdrop-blur-md"
                                />
                                <button
                                    type="button"
                                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-all shrink-0"
                                >
                                    Join
                                </button>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            {[
                                { icon: TwitterIcon, href: "#", label: "Twitter" },
                                { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
                                { icon: YoutubeIcon, href: "#", label: "YouTube" },
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="size-9 rounded-xl border border-emerald-500/20 bg-emerald-950/40 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-400 transition-all shadow-md backdrop-blur-md"
                                >
                                    <social.icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">

                        {/* Explore */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                                Explore
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-slate-300/80 hover:text-emerald-300 hover:translate-x-1 inline-block transition-all duration-200"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                                Resources
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {resourceItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-slate-300/80 hover:text-emerald-300 hover:translate-x-1 inline-block transition-all duration-200"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-4 col-span-2 sm:col-span-1">
                            <h3 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                                Legal
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {legalItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-slate-300/80 hover:text-emerald-300 hover:translate-x-1 inline-block transition-all duration-200"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

                {/* --- 3. SUB-FOOTER BAR --- */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-emerald-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-emerald-300 transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-emerald-300 transition-colors">Cookie Preferences</Link>
                    </div>

                    <p>© {new Date().getFullYear()} <span className="text-slate-200 font-semibold">ShimanaPeriye</span>. All rights reserved.</p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;