"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "../language-switcher";

gsap.registerPlugin(ScrollTrigger);

export function MainNav() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const navigationT = useTranslations("navigation");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const routes = [
    { label: navigationT("home"), href: "/" },
    { label: navigationT("projects"), href: "/projects" },
    { label: navigationT("skills"), href: "/skills" },
    { label: navigationT("contact"), href: "/contact" },
  ];

  // Entrance animation
  useGSAP(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.fromTo(
      nav,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  // Glassmorphism intensifies on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={cn(
        // Centrage Tailwind v4 : inset-x-0 + mx-auto
        "fixed top-4 inset-x-0 mx-auto z-50 print:hidden",
        "w-[calc(100%-2rem)] max-w-5xl",
        "flex items-center justify-between gap-4",
        "px-5 py-3 rounded-2xl",
        "backdrop-blur-xl transition-all duration-500",
        scrolled
          ? "bg-background/85 shadow-lg shadow-black/10 border border-border/60"
          : "bg-background/60 border border-border/30"
      )}
    >
      {/* ── Logo ── */}
      <Link href="/" className="flex items-center shrink-0 group">
        <span className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
          AK<span className="text-primary">.</span>
        </span>
      </Link>

      {/* ── Desktop links ── */}
      <div className="hidden md:flex items-center gap-0.5">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "relative px-4 py-1.5 text-sm font-medium rounded-xl",
                "transition-all duration-200",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              )}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-foreground/8 border border-border/40 pointer-events-none" />
              )}
              <span className="relative">{route.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Right controls ── */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        {/* Open to work */}
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/8 text-xs font-mono-brand text-green-400 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
          Open to work
        </span>
        <div className="w-px h-4 bg-white/10" />
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* ── Mobile menu ── */}
      <div className="md:hidden flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-foreground/5 h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-l border-border/40 w-72 p-6">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-6">
              {/* Badge */}
              <span className="flex items-center gap-2 px-3 py-2 rounded-xl border border-green-500/30 bg-green-500/8 text-xs font-mono-brand text-green-400 mb-3 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Open to work
              </span>

              {routes.map((route) => {
                const isActive = pathname === route.href;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground bg-foreground/8 border border-border/40"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    )}
                  >
                    {route.label}
                  </Link>
                );
              })}

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/30 px-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
