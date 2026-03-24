"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight, Mail, Linkedin, Github } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";
import { ThreeCursorBlob } from "@/components/three/three-cursor-blob";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface ContactCtaSectionProps {
  email: string;
  linkedin: string;
  github: string;
}

export function ContactCtaSection({ email, linkedin, github }: ContactCtaSectionProps) {
  const t = useTranslations("contact_cta");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: "lines" });
      gsap.fromTo(
        split.lines,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }

    gsap.fromTo(
      [subRef.current, ctaRef.current],
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden bg-primary/5"
    >
      {/* Three.js cursor blob in background */}
      <ThreeCursorBlob className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,77,0,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 md:px-10 text-center flex flex-col items-center gap-10">
        {/* Label */}
        <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
          — Contact
        </span>

        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display text-section text-foreground leading-tight"
          style={{ overflow: "hidden" }}
        >
          {t("title_1")}<br />
          <span className="text-primary">{t("title_2")}</span>
        </h2>

        {/* Subtitle */}
        <p ref={subRef} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold px-10 rounded-xl glow-brand transition-all duration-300"
              >
                {t("cta_start")}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </MagneticButton>

          <MagneticButton>
            <a href={`mailto:${email}`}>
              <Button
                size="lg"
                variant="outline"
                className="font-display font-semibold px-8 rounded-xl border-border/50 hover:border-primary/40 hover:bg-foreground/5"
              >
                <Mail size={16} className="mr-2" />
                {email}
              </Button>
            </a>
          </MagneticButton>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Linkedin size={16} className="group-hover:text-primary transition-colors" />
            LinkedIn
          </a>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Github size={16} className="group-hover:text-primary transition-colors" />
            GitHub
          </a>
        </div>

        {/* Footer bottom line */}
        <div className="pt-16 border-t border-border/20 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/40 font-mono-brand">
          <span>Anderson Kouadio — Abidjan, Côte d&apos;Ivoire</span>
          <span>© 2025 — {t("copyright")}</span>
        </div>
      </div>
    </section>
  );
}
