"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin, Github, Linkedin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ThreeHeroOrb } from "@/components/three/three-hero-orb";
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
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

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

    // Orb fade in
    tl.fromTo(
      orbRef.current,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.8"
    );
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
            <ThreeHeroOrb className="w-full h-[420px] sm:w-[420px] sm:h-[500px] md:w-[500px] md:h-[580px] lg:w-[560px] lg:h-[620px]" />

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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground/50">
        <span className="text-xs font-mono-brand tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
}
