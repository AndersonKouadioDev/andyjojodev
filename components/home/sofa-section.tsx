"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, X, ExternalLink, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { ThreeSofaScene } from "@/components/three/three-sofa-scene";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Project data for each hotspot ───────────────────────────────────────────
interface HotspotProject {
  title: string;
  description: string;
  role: string;
  tags: string[];
  category: string;
  anchor: string;
}

// ─── Project card (glassmorphism overlay) ────────────────────────────────────
function ProjectCard({
  project,
  index,
  onClose,
  onDetails,
  isDark,
}: {
  project: HotspotProject;
  index: number;
  onClose: () => void;
  onDetails: () => void;
  isDark: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" }
    );
  }, []);

  const close = () => {
    if (!cardRef.current) return onClose();
    gsap.to(cardRef.current, {
      opacity: 0, y: 20, scale: 0.95,
      duration: 0.35, ease: "power2.in",
      onComplete: onClose,
    });
  };

  const categoryColors: Record<string, string> = {
    mobile: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    erp:    "bg-purple-500/15 text-purple-400 border-purple-500/25",
    web:    "bg-green-500/15 text-green-400 border-green-500/25",
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-2xl p-6 border max-w-sm w-full shadow-2xl",
        isDark
          ? "bg-black/60 border-white/10 backdrop-blur-2xl"
          : "bg-white/80 border-black/8 backdrop-blur-2xl"
      )}
    >
      {/* Close button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-foreground/8 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={14} />
      </button>

      {/* Hotspot number */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-mono-brand font-bold text-white shrink-0">
          {index + 1}
        </span>
        <span className={cn("text-[10px] font-mono-brand uppercase tracking-widest px-2 py-0.5 rounded-md border", categoryColors[project.category] ?? "bg-primary/10 text-primary border-primary/25")}>
          {project.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-xl font-bold text-foreground mb-2 leading-tight">
        {project.title}
      </h3>

      {/* Role */}
      <p className="text-xs font-mono-brand text-primary mb-3">{project.role}</p>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono-brand px-2 py-0.5 rounded-md bg-foreground/6 text-muted-foreground border border-border/30"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 4 && (
          <span className="text-[10px] font-mono-brand px-2 py-0.5 rounded-md text-muted-foreground">
            +{project.tags.length - 4}
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onDetails}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-display font-semibold hover:bg-primary/90 transition-colors"
      >
        <ArrowRight size={14} />
        Voir les détails
      </button>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
interface SofaSectionProps {
  projects: HotspotProject[];
}

export function SofaSection({ projects }: SofaSectionProps) {
  const pt = useTranslations("projects_page");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [mounted, setMounted] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setMounted(true), []);

  const sectionRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);

  // Responsive
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // GSAP entrance
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.4 });
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
    .fromTo([title1Ref.current, title2Ref.current],
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" },
      "-=0.2"
    )
    .fromTo(hintRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo(scrollBtnRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      "-=0.1"
    );
  }, []);

  // Hint pulse on hotspot click
  useEffect(() => {
    if (!hintRef.current) return;
    if (activeHotspot !== null) {
      gsap.to(hintRef.current, { opacity: 0, y: -6, duration: 0.25 });
    } else {
      gsap.to(hintRef.current, { opacity: 1, y: 0, duration: 0.35 });
    }
  }, [activeHotspot]);

  const handleHotspotClick = (index: number) => {
    setActiveHotspot(index);
  };

  const handleClose = () => {
    setActiveHotspot(null);
  };

  const handleDetails = () => {
    handleClose();
    // Scroll to project grid after card closes
    setTimeout(() => {
      const grid = document.getElementById("projects-grid");
      if (grid) grid.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  const handleScrollDown = () => {
    const grid = document.getElementById("projects-grid");
    if (grid) grid.scrollIntoView({ behavior: "smooth" });
  };

  // Background gradient per theme (only after mount to avoid hydration mismatch)
  const bgGradient = !mounted
    ? undefined
    : isDark
    ? "radial-gradient(ellipse 80% 60% at 50% 60%, #1a0800 0%, #0a0705 55%, #050505 100%)"
    : "radial-gradient(ellipse 80% 60% at 50% 60%, #fff4ef 0%, #f5ece7 55%, #ede5e0 100%)";

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background"
      style={{ minHeight: "100svh", ...(bgGradient ? { background: bgGradient } : {}) }}
      suppressHydrationWarning
    >
      {/* ── 3D Canvas (full section) ── */}
      <ThreeSofaScene
        className="absolute inset-0 w-full h-full"
        isDark={isDark}
        isMobile={isMobile}
        activeHotspot={activeHotspot}
        onHotspotClick={handleHotspotClick}
      />

      {/* ── Text overlay (top-left on desktop, top-center on mobile) ── */}
      <div className="relative z-10 pointer-events-none flex flex-col h-full min-h-[100svh]">
        <div className="pt-28 px-6 md:px-12 lg:px-16 max-w-xl">
          {/* Eyebrow */}
          <span
            ref={eyebrowRef}
            className="inline-block font-mono-brand text-xs text-primary tracking-[0.2em] uppercase mb-4 opacity-0"
          >
            — {pt("sofa_eyebrow")}
          </span>

          {/* Title */}
          <h1 className="font-display leading-[1.0] mb-3">
            <span
              ref={title1Ref}
              className="block text-[clamp(2.4rem,6vw,5.5rem)] font-black text-foreground opacity-0"
            >
              {pt("sofa_title_1")}
            </span>
            <span
              ref={title2Ref}
              className="block text-[clamp(2.4rem,6vw,5.5rem)] font-black text-primary opacity-0"
            >
              {pt("sofa_title_2")}
            </span>
          </h1>

          {/* Hint */}
          <p
            ref={hintRef}
            className="text-sm text-muted-foreground font-mono-brand tracking-wide opacity-0 mt-4 flex items-center gap-2"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            {pt("sofa_hint")}
          </p>
        </div>

        {/* Scroll button at the bottom */}
        <button
          ref={scrollBtnRef}
          onClick={handleScrollDown}
          className="pointer-events-auto mt-auto mb-8 mx-auto flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors opacity-0"
        >
          <span className="font-mono-brand text-[10px] tracking-widest uppercase">
            {pt("sofa_scroll")}
          </span>
          <ChevronDown size={16} className="animate-bounce" />
        </button>
      </div>

      {/* ── Project card overlay ── */}
      {activeHotspot !== null && projects[activeHotspot] && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center md:items-end md:justify-end md:pb-16 md:pr-16 px-4 pb-20">
          <div className="pointer-events-auto">
            <ProjectCard
              project={projects[activeHotspot]}
              index={activeHotspot}
              onClose={handleClose}
              onDetails={handleDetails}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* ── Hotspot number indicators (DOM layer, projected from 3D) ── */}
      {/* These are shown as simple floating badges near the canvas bubbles */}
    </section>
  );
}
