"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { ThreeSofaScene } from "@/components/three/three-sofa-scene";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface HotspotService {
  title: string;
  description: string;
  category: string; // web | mobile | backend | lead | design | devops
}

// ─── Accent colors per category ───────────────────────────────────────────────
const ACCENT: Record<string, string> = {
  web:     "#34d399",
  mobile:  "#60a5fa",
  backend: "#fb923c",
  lead:    "#FF4D00",
  design:  "#c084fc",
  devops:  "#22d3ee",
};

// ─── Accordion row ────────────────────────────────────────────────────────────
function ServiceRow({
  service,
  index,
  isActive,
  isDark,
  onToggle,
  onContact,
}: {
  service: HotspotService;
  index: number;
  isActive: boolean;
  isDark: boolean;
  onToggle: (i: number) => void;
  onContact: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const accent = ACCENT[service.category] ?? ACCENT.web;
  const num = String(index + 1).padStart(2, "0");

  // GSAP accordion: height 0 ↔ auto
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (isActive) {
      gsap.set(el, { height: "auto", opacity: 1 });
      gsap.from(el, { height: 0, opacity: 0, duration: 0.42, ease: "power3.out", overwrite: "auto" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: "power2.in", overwrite: "auto" });
    }
  }, [isActive]);

  return (
    <div
      className={cn(
        "border-b cursor-pointer select-none",
        isDark ? "border-white/8" : "border-black/8"
      )}
      style={{
        borderLeft: `2px solid ${isActive ? accent : "transparent"}`,
        paddingLeft: "14px",
        transition: "border-left-color 0.25s ease",
      }}
      onClick={() => onToggle(index)}
    >
      {/* Header row */}
      <div className="flex items-center gap-4 py-[14px] group">
        <span
          className="font-mono-brand text-xs tabular-nums shrink-0 w-7 transition-colors duration-300"
          style={{ color: isActive ? accent : undefined }}
        >
          {num}
        </span>
        <span className={cn(
          "font-display font-semibold text-sm md:text-[15px] flex-1 leading-snug transition-colors duration-200",
          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {service.title}
        </span>
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300"
          style={{ backgroundColor: isActive ? accent : undefined, opacity: isActive ? 1 : 0.25 }}
        />
      </div>

      {/* Body — GSAP controls height */}
      <div ref={bodyRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="pb-5 pr-3">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {service.description}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onContact(); }}
            className="flex items-center gap-2 text-xs font-display font-semibold py-2 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <ArrowRight size={12} />
            Me contacter
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
interface SofaSectionProps {
  services: HotspotService[];
}

export function SofaSection({ services }: SofaSectionProps) {
  const pt = useTranslations("sofa_section");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const router = useRouter();
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const animatedRef = useRef(false);

  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const title1Ref  = useRef<HTMLSpanElement>(null);
  const title2Ref  = useRef<HTMLSpanElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Entrance animation — runs once, guarded by animatedRef
  useEffect(() => {
    if (!mounted || animatedRef.current) return;
    if (!eyebrowRef.current || !title1Ref.current || !title2Ref.current || !listRef.current) return;

    animatedRef.current = true;
    const rows = listRef.current.querySelectorAll<HTMLElement>(".service-row");

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(eyebrowRef.current,
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    )
    .fromTo([title1Ref.current, title2Ref.current],
      { opacity: 0, x: -28 },
      { opacity: 1, x: 0, duration: 0.65, stagger: 0.1, ease: "power3.out" },
      "-=0.25"
    );

    if (rows.length > 0) {
      tl.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" },
        "-=0.3"
      );
    }

    return () => { tl.kill(); };
  }, [mounted]);

  const handleToggle = (i: number) => setActive(prev => prev === i ? null : i);
  const handleContact = () => router.push(`/${locale}/contact`);

  if (!mounted) {
    return <section style={{ minHeight: "100svh" }} className="bg-background" suppressHydrationWarning />;
  }

  return (
    <section
      suppressHydrationWarning
      className="relative w-full overflow-hidden bg-background flex flex-col"
      style={{ minHeight: "100svh" }}
    >
      {/* ── Top: Eyebrow + Title ── */}
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 pt-20 pb-10 md:pb-0">
        <span
          ref={eyebrowRef}
          className="inline-block font-mono-brand text-xs text-primary tracking-[0.2em] uppercase mb-5 opacity-0"
        >
          — {pt("eyebrow")}
        </span>
        <div className="leading-[1.05]">
          <span
            ref={title1Ref}
            className="block font-display font-black opacity-0"
            style={{ fontSize: "clamp(2rem, 3.5vw, 4rem)" }}
          >
            {pt("title_1")}
          </span>
          <span
            ref={title2Ref}
            className="block font-display font-black text-primary opacity-0"
            style={{ fontSize: "clamp(2rem, 3.5vw, 4rem)" }}
          >
            {pt("title_2")}
          </span>
        </div>
      </div>

      {/* ── Bottom: Services + Sofa ── */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0">

        {/* Services accordion */}
        <div className={cn(
          "flex flex-col justify-start md:justify-center z-10",
          "w-full md:w-[40%] shrink-0 px-6 md:px-10 lg:px-16 xl:px-20 pt-4 pb-12 md:py-10"
        )}>
          <div
            ref={listRef}
            className={cn("border-t", isDark ? "border-white/8" : "border-black/8")}
          >
            {services.map((svc, i) => (
              <div key={i} className="service-row opacity-0">
                <ServiceRow
                  service={svc}
                  index={i}
                  isActive={active === i}
                  isDark={isDark}
                  onToggle={handleToggle}
                  onContact={handleContact}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3D Sofa — desktop only */}
        <div className="relative flex-1 hidden md:block min-h-[500px]">
          <div className={cn(
            "absolute left-0 top-[10%] bottom-[10%] w-px",
            isDark ? "bg-white/6" : "bg-black/6"
          )} />
          <ThreeSofaScene
            className="absolute inset-0 w-full h-full"
            isDark={isDark}
            isMobile={false}
            activeHotspot={null}
            onHotspotClick={() => {}}
            showHotspots={false}
          />
        </div>
      </div>
    </section>
  );
}
