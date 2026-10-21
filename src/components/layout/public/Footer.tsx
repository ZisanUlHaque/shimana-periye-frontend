"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-gradient-to-b from-sky-50 to-blue-100 text-gray-700">

      {/* ===== Wavy Divider ===== */}
      <div className="absolute top-0 left-0 w-full -translate-y-[99%] leading-none overflow-hidden">
        <svg className="relative block w-full h-[70px] sm:h-[90px] lg:h-[110px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,10 900,110 1200,40 L1200,120 L0,120 Z" className="fill-sky-100/60" />
        </svg>
        <svg className="relative block w-full h-[80px] sm:h-[100px] lg:h-[120px] -mt-[60px] sm:-mt-[75px] lg:-mt-[90px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 C300,120 900,-20 1200,60 L1200,120 L0,120 Z" className="fill-sky-50" />
        </svg>
      </div>

      {/* ===== Floating Newsletter Card (overlapping wave) ===== */}
      <div className="relative max-w-3xl mx-auto px-6 -mt-16 sm:-mt-20 mb-10 z-20">
        <div className="relative bg-gradient-to-br from-emerald-50 to-sky-50 border border-white shadow-2xl shadow-emerald-900/10 rounded-[2.5rem] px-8 py-10 sm:px-12 sm:py-12 text-center overflow-hidden">
          
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

          <h3 className="relative text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Never Miss a Deadline.
          </h3>
          <p className="relative text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto">
            Subscribe to get scholarship deadlines, university updates, and expert tips — straight to your inbox.
          </p>

          <form className="relative max-w-md mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-md pl-5 pr-1.5 py-1.5">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="shrink-0 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white p-3 rounded-full shadow-md transition-all duration-300 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>

          <p className="relative text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* ===== Inner wrapper (dot-grid + watermark + main content) ===== */}
      <div className="relative overflow-hidden">

        {/* ===== Subtle Dot Grid Background Texture ===== */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* ===== Giant Watermark Text ===== */}
        <h1 className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 text-[18vw] sm:text-[14vw] font-extrabold text-emerald-900/[0.03] select-none pointer-events-none whitespace-nowrap">
          ShimanaPeriye
        </h1>

        {/* ===== Main Footer Content ===== */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-10 z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✈️</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                  ShimanaPeriye
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-sm">
                Your all-in-one higher study platform. Discover worldwide universities,
                track scholarship deadlines, and prepare applications with verified mentor guidance.
              </p>

              <div className="flex gap-3">
                {[
                  { name: "Facebook", path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" },
                  { name: "Twitter", path: "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.7 11.7 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.8A8.2 8.2 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" },
                  { name: "LinkedIn", path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6v6.2h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z" },
                  { name: "Instagram", path: "M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" },
                ].map((icon) => (
                  <a
                    key={icon.name}
                    href="#"
                    aria-label={icon.name}
                    className="group relative p-[2px] rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 hover:from-emerald-500 hover:to-sky-500 transition-all hover:scale-110 duration-300"
                  >
                    <span className="flex items-center justify-center bg-white w-9 h-9 rounded-full">
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-emerald-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d={icon.path} />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <FooterLinkGroup
              title="Platform"
              icon="🎓"
              links={["Universities", "Scholarships", "Mentors", "Roadmaps"]}
            />

            <FooterLinkGroup
              title="Company"
              icon="🏢"
              links={["About Us", "Careers", "Blog", "Contact"]}
            />

            <div>
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                <span>🌐</span> Reach
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>50+ Countries Supported</li>
                <li>500+ Partner Universities</li>
                <li>10,000+ Students Guided</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300/60 mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 text-center sm:text-left">
            <p>© {new Date().getFullYear()} ShimanaPeriye. All rights reserved.</p>

            <div className="flex items-center gap-2 bg-white/70 border border-gray-200 px-3 py-1.5 rounded-full shadow-sm text-xs">
              <span>🌐</span>
              <span>Available in 50+ Countries</span>
            </div>

            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-emerald-600 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-emerald-600 transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-sky-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  icon,
  links,
}: {
  title: string;
  icon: string;
  links: string[];
}) {
  return (
    <div>
      <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-3 text-sm">
        {links.map((link) => (
          <li key={link}>
            <Link
              href="#"
              className="group inline-flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <span className="relative">
                {link}
                <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-[1px] bg-emerald-500 transition-all duration-300" />
              </span>
              <svg
                className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}