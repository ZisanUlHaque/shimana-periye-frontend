"use client";

import {
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGetMe, useLogout } from "@/hooks";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Universities", href: "/universities" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Mentors", href: "/mentors" },
  { label: "Roadmaps", href: "/roadmaps" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useGetMe();
  const user = userData?.data?.user || userData?.data;
  const { mutate: logout } = useLogout();

  const isHome = pathname === "/";
  const solid = !isHome || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(undefined as any, {
      onSuccess: () => {
        toast.add({
          title: "Logged out",
          description: "See you next time!",
          type: "success",
        });
        setUserDropdownOpen(false);
        router.push("/login");
      },
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-xs"
          : "bg-gradient-to-b from-black/60 via-black/30 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
                      {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="size-12 overflow-hidden rounded-lg">
                  <Image
                    src="/logo1.png"
                    alt="ShimanaPeriye Logo"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <span
                  className={`hidden text-lg font-bold transition-colors sm:inline ${
                    solid ? "text-primary" : "text-white"
                  }`}
                >
                  ShimanaPeriye
                </span>
              </Link>
            </div>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav
          className={`hidden md:flex items-center gap-1 rounded-full border px-4 py-1.5 shadow-xs transition-colors duration-200 ${
            solid
              ? "border-border/80 bg-card/60 backdrop-blur-md"
              : "border-white/20 bg-white/10 backdrop-blur-md"
          }`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : solid
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    : "text-white/80 hover:text-white hover:bg-white/15"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            /* User profile dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full p-1 pl-1.5 pr-3 border transition-colors ${
                  solid
                    ? "border-border bg-card text-foreground hover:bg-muted"
                    : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-xs">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate">
                  {user.name?.split(" ")[0]}
                </span>
                <ChevronDown className="size-3.5 opacity-70" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 z-50">
                  <div className="px-3 py-2 border-b border-border/60">
                    <p className="text-sm font-bold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        const role = user.role?.toUpperCase();
                        router.push(
                          role === "ADMIN"
                            ? "/admin"
                            : role === "MENTOR"
                            ? "/mentor"
                            : "/student"
                        );
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="size-4 text-primary" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        router.push("/profile");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <User className="size-4 text-primary" />
                      <span>Profile</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-border/60">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Auth links */
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className={`h-9 rounded-xl px-4 text-xs font-semibold ${
                    solid
                      ? "text-foreground hover:bg-muted"
                      : "text-white hover:bg-white/15 hover:text-white"
                  }`}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="h-9 rounded-xl px-4 text-xs font-bold shadow-md shadow-primary/25">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`rounded-xl p-2 md:hidden ${
              solid
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/15"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background/95 px-6 py-4 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {!user && (
              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full h-10 rounded-xl font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button className="w-full h-10 rounded-xl font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
