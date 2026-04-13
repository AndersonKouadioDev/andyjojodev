"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../language-switcher";

export function MainNav() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const t = useTranslations("navigation");

  const routes = [
    { label: t("home"),     href: "/",         sub: "— Présentation" },
    { label: t("projects"), href: "/projects",  sub: "— 17 réalisations" },
    { label: t("skills"),   href: "/skills",    sub: "— Stack tech" },
    { label: "CV",          href: "/resume",    sub: "— Téléchargeable" },
    { label: t("contact"),  href: "/contact",   sub: "— Disponible" },
  ];

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Nav entrance
  useGSAP(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  // Open / close menu animation
  useGSAP(() => {
    const overlay = overlayRef.current;
    const footer  = footerRef.current;
    if (!overlay || !linksRef.current || !visible) return;

    const items = linksRef.current.querySelectorAll<HTMLElement>(".nav-item");

    if (open) {
      gsap.timeline()
        .fromTo(overlay,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65, ease: "power4.inOut" }
        )
        .fromTo(items,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out" },
          "-=0.35"
        )
        .fromTo(footer,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.45"
        );
    } else {
      gsap.timeline({ onComplete: () => setVisible(false) })
        .to(items, {
          yPercent: -40,
          opacity: 0,
          stagger: 0.04,
          duration: 0.35,
          ease: "power2.in",
        })
        .to(footer, { y: -16, opacity: 0, duration: 0.25, ease: "power2.in" }, 0)
        .to(overlay, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.55,
          ease: "power4.inOut",
        }, "-=0.15");
    }
  }, { dependencies: [open, visible] });

  return (
    <>
      {/* ── Fixed nav bar ── */}
      <nav
        ref={navRef}
        className={cn(
          "fixed top-4 inset-x-0 mx-auto z-[60] print:hidden",
          "w-[calc(100%-2rem)] max-w-5xl",
          "flex items-center justify-between",
          "px-5 py-3 rounded-2xl",
          "transition-all duration-500",
          open
            ? "bg-transparent border-transparent shadow-none backdrop-blur-none"
            : scrolled
              ? "backdrop-blur-xl bg-background/85 shadow-lg shadow-black/10 border border-border/60"
              : "backdrop-blur-xl bg-background/60 border border-border/30"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 group"
          onClick={() => { setOpen(false); setVisible(false); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 34" fill="none" className="h-5 w-auto transition-transform duration-300 group-hover:scale-110 text-foreground group-hover:text-primary">
              <path d="M3 30 L15 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M27 30 L15 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M8 20 L14 12 L20 20 L26 12 L32 20 L38 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 20 L42 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M32 4 L32 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="14" cy="12" r="1.5" fill="currentColor" opacity="0.4"/>
              <circle cx="26" cy="12" r="1.5" fill="currentColor" opacity="0.4"/>
            </svg>
        </Link>

        {/* Center: Open to work badge — desktop only, hidden when menu open */}
        <div className={cn(
          "hidden md:flex items-center gap-2 transition-opacity duration-300",
          open && "opacity-0 pointer-events-none"
        )}>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/8 text-xs font-mono-brand text-green-400 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            Open to work
          </span>
        </div>

        {/* Right: ThemeToggle + MENU button */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "transition-opacity duration-300",
            open && "opacity-0 pointer-events-none"
          )}>
            <ThemeToggle />
          </div>

          {/* MENU / CLOSE button */}
          <button
            onClick={() => {
              if (!open) {
                setVisible(true);
                setOpen(true);
              } else {
                setOpen(false);
              }
            }}
            className={cn(
              "font-mono-brand text-[11px] tracking-[0.25em] px-4 py-2 rounded transition-all duration-200 cursor-pointer",
              "border border-border/50 text-foreground hover:border-primary/60 hover:text-primary"
            )}
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
      </nav>

      {/* ── Fullscreen overlay ── */}
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-[55] flex-col bg-background",
          visible ? "flex" : "hidden"
        )}
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[50vh]"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,77,0,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* ── Navigation links ── */}
        <div
          ref={linksRef}
          className="flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-20 gap-1 md:gap-0 overflow-hidden"
        >
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <div
                key={route.href}
                className="nav-item py-1 border-b border-border/30 last:border-b-0 group"
              >
                {/* Inner mask — clips vertical slide animation only */}
                <div className="flex items-baseline justify-between overflow-hidden">
                  <Link
                    href={route.href}
                    onClick={() => { setOpen(false); setVisible(false); }}
                    className={cn(
                      "font-display font-black uppercase leading-none tracking-tight block",
                      "text-[13vw] md:text-[9.5vw] lg:text-[8vw]",
                      "transition-colors duration-200",
                      isActive
                        ? "text-primary"
                        : "text-foreground/85 group-hover:text-primary"
                    )}
                  >
                    {route.label}
                  </Link>

                  <span className="font-mono-brand text-xs md:text-sm text-foreground/25 group-hover:text-foreground/50 transition-colors duration-200 hidden md:block shrink-0 ml-6">
                    {route.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div
          ref={footerRef}
          className="flex items-center justify-between px-8 md:px-14 lg:px-20 py-6 md:py-8 border-t border-border/30"
        >
          {/* Open to work */}
          <span className="flex items-center gap-2 text-xs font-mono-brand text-green-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Open to work
          </span>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="overlay" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
