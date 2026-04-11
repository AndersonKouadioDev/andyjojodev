"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import { ArrowRight, MapPin, Github, Linkedin, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
const ThreeHeroOrb = dynamic(
  () => import("@/components/three/three-hero-orb").then(m => ({ default: m.ThreeHeroOrb })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface HeroSectionProps {
  name: string;
  title: string;
  location: string;
  github: string;
  linkedin: string;
}

export function HeroSection({ name, title, location, github, linkedin }: HeroSectionProps) {
  const heroT = useTranslations("hero_section");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const fog1Ref = useRef<HTMLDivElement>(null);
  const fog2Ref = useRef<HTMLDivElement>(null);
  const fog3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Badge bounce in
    tl.fromTo(
      badgeRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
    );

    // Name — SplitText chars
    if (nameRef.current) {
      const split = new SplitText(nameRef.current, { type: "chars,words" });
      tl.fromTo(
        split.chars,
        { y: 80, opacity: 0, rotationX: -45 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.7,
          stagger: 0.025,
          ease: "power3.out",
        },
        "-=0.2"
      );
    }

    // Subtitle words
    if (subtitleRef.current) {
      const splitSub = new SplitText(subtitleRef.current, { type: "words" });
      tl.fromTo(
        splitSub.words,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }

    // Meta info (location, etc.)
    tl.fromTo(
      metaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );

    // CTA buttons
    tl.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );

    // Orb — simple fade in, no scale
    tl.fromTo(
      orbRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power2.out" },
      "-=0.8"
    );

    // Fog layers — slow drifting clouds
    if (fog1Ref.current && fog2Ref.current && fog3Ref.current) {
      gsap.set([fog1Ref.current, fog2Ref.current, fog3Ref.current], { opacity: 0 });

      // Fog 1: slides from left, slow
      gsap.timeline({ delay: 1.2, repeat: -1, yoyo: false })
        .to(fog1Ref.current, { opacity: 0.55, duration: 3, ease: "sine.inOut" })
        .to(fog1Ref.current, { x: "18%", duration: 18, ease: "none" }, 0)
        .to(fog1Ref.current, { opacity: 0, duration: 3, ease: "sine.inOut" }, 15)
        .set(fog1Ref.current, { x: "-10%" })
        .to(fog1Ref.current, { opacity: 0, duration: 0.01 });

      // Fog 2: slides from right, offset timing
      gsap.timeline({ delay: 5, repeat: -1, yoyo: false })
        .to(fog2Ref.current, { opacity: 0.40, duration: 4, ease: "sine.inOut" })
        .to(fog2Ref.current, { x: "-14%", duration: 22, ease: "none" }, 0)
        .to(fog2Ref.current, { opacity: 0, duration: 4, ease: "sine.inOut" }, 18)
        .set(fog2Ref.current, { x: "8%" })
        .to(fog2Ref.current, { opacity: 0, duration: 0.01 });

      // Fog 3: subtle bottom drift
      gsap.timeline({ delay: 9, repeat: -1, yoyo: false })
        .to(fog3Ref.current, { opacity: 0.30, duration: 4, ease: "sine.inOut" })
        .to(fog3Ref.current, { x: "10%", y: "-5%", duration: 20, ease: "none" }, 0)
        .to(fog3Ref.current, { opacity: 0, duration: 4, ease: "sine.inOut" }, 16)
        .set(fog3Ref.current, { x: "-5%", y: "0%" })
        .to(fog3Ref.current, { opacity: 0, duration: 0.01 });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-grid"
    >
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(255,77,0,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Content */}
          <div className="flex flex-col gap-6 z-10">
            {/* Badge */}
            <div ref={badgeRef} className="inline-flex">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-sm font-mono-brand text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Open to work
              </span>
            </div>

            {/* Name */}
            <h1
              ref={nameRef}
              className="font-display text-hero text-foreground leading-none"
              style={{ perspective: "800px" }}
            >
              {name}
              <span className="text-primary">.</span>
            </h1>

            {/* Title */}
            <p
              ref={subtitleRef}
              className="font-display text-subsection text-muted-foreground leading-tight"
            >
              {title}
            </p>

            {/* Meta */}
            <div ref={metaRef} className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" />
                {location}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                {heroT("years_exp")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                {heroT("projects_delivered")}
              </span>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mt-2">
              <MagneticButton>
                <Link href="/projects">
                  <Button
                    size="lg"
                    className={cn(
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "font-display font-semibold px-8 rounded-xl",
                      "glow-brand-sm transition-all duration-300"
                    )}
                  >
                    {heroT("cta_projects")}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-display font-semibold px-8 rounded-xl border-border/50 hover:border-primary/40 hover:bg-foreground/5 transition-all duration-300"
                  >
                    {heroT("cta_contact")}
                  </Button>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <a
                  href="/cv/CV_Anderson_KOUADIO.pdf"
                  download="CV_Anderson_KOUADIO.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="ghost"
                    className="font-display font-semibold px-6 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-300"
                  >
                    <Download size={15} className="mr-2" />
                    CV
                  </Button>
                </a>
              </MagneticButton>

              {/* Social links */}
              <div className="flex items-center gap-3 ml-1">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Right — 3D Statue */}
          <div
            ref={orbRef}
            className="flex flex-col items-center justify-center lg:items-end gap-2"
          >
            <Suspense fallback={<div className="w-full h-[420px] sm:w-[420px] sm:h-[500px] md:w-[500px] md:h-[580px] lg:w-[560px] lg:h-[620px]" />}>
              <ThreeHeroOrb className="w-full h-[420px] sm:w-[420px] sm:h-[500px] md:w-[500px] md:h-[580px] lg:w-[560px] lg:h-[620px]" />
            </Suspense>

            {/* Statue caption — below canvas, no overlap */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-background/60 backdrop-blur-sm self-center lg:self-end lg:mr-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="font-mono-brand text-[10px] tracking-widest uppercase text-muted-foreground whitespace-nowrap">
                Masque Baoulé
              </span>
              <span className="font-mono-brand text-[10px] text-primary/60">· 3D</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fog layers — pointer-events-none ── */}
      <div
        ref={fog1Ref}
        className="absolute inset-0 pointer-events-none z-[1] opacity-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 40% at 20% 55%, rgba(255,255,255,0.03) 0%, rgba(180,130,100,0.04) 40%, transparent 75%)"
            : "radial-gradient(ellipse 80% 40% at 20% 55%, rgba(255,255,255,0.55) 0%, rgba(240,220,200,0.30) 40%, transparent 75%)",
          filter: "blur(32px)",
        }}
      />
      <div
        ref={fog2Ref}
        className="absolute inset-0 pointer-events-none z-[1] opacity-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 70% 50% at 80% 40%, rgba(255,255,255,0.025) 0%, rgba(150,120,90,0.035) 40%, transparent 70%)"
            : "radial-gradient(ellipse 70% 50% at 80% 40%, rgba(255,255,255,0.50) 0%, rgba(230,210,195,0.28) 40%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      <div
        ref={fog3Ref}
        className="absolute pointer-events-none z-[1] opacity-0"
        style={{
          bottom: 0, left: "-5%", right: "-5%", height: "45%",
          background: isDark
            ? "linear-gradient(to top, rgba(255,255,255,0.02) 0%, transparent 100%)"
            : "linear-gradient(to top, rgba(255,255,255,0.45) 0%, transparent 100%)",
          filter: "blur(28px)",
        }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground/50">
        <span className="text-xs font-mono-brand tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
}
