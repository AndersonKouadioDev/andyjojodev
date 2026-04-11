"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CounterUp } from "@/components/ui/counter-up";
import dynamic from "next/dynamic";
const ThreeBlob = dynamic(
  () => import("@/components/three/three-blob").then(m => ({ default: m.ThreeBlob })),
  { ssr: false, loading: () => null }
);
import { useTranslations } from "next-intl";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface AboutSectionProps {
  biography: string;
  stats: StatItem[];
}

export function AboutSection({ biography, stats }: AboutSectionProps) {
  const t = useTranslations("about_section");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Title reveal — line by line
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: "lines" });
      gsap.fromTo(
        split.lines,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    // Bio reveal — word by word
    if (bioRef.current) {
      const split = new SplitText(bioRef.current, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }

    // Stats cards pop in
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll(".stat-card");
      gsap.fromTo(
        cards,
        { scale: 0.85, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
    >
      {/* Three.js blob — décoratif fond */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none opacity-20 hidden lg:block">
        <ThreeBlob
          className="w-[500px] h-[500px]"
          color="#FF4D00"
          distort={0.6}
          speed={1.5}
        />
      </div>

      {/* Radial glow left */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(201,153,58,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-8">
            {/* Label */}
            <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
              — {t("eyebrow")}
            </span>

            {/* Title */}
            <h2
              ref={titleRef}
              className="font-display text-section text-foreground"
              style={{ overflow: "hidden" }}
            >
              {t("title_1")}{" "}
              <span className="text-primary">{t("title_2")}</span>,
              <br />
              {t("title_3")}{" "}
              <span className="italic text-muted-foreground">{t("title_4")}</span>.
            </h2>

            {/* Bio */}
            <p
              ref={bioRef}
              className="text-muted-foreground text-lg leading-relaxed max-w-prose"
            >
              {biography}
            </p>

            {/* Photo */}
            <div className="relative w-full max-w-full lg:max-w-xs h-80 rounded-2xl overflow-hidden border border-border/20 shadow-2xl group">
              <Image
                src="/images/about/me.webp"
                alt="Anderson Kouadio"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 320px"
                priority
              />
              {/* Subtle gradient overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              {/* Accent border glow */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all duration-500" />
            </div>
          </div>

          {/* Right — Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="stat-card glass rounded-2xl p-8 flex flex-col gap-2 border border-border/25 hover:border-primary/20 transition-colors duration-300 group"
              >
                <span className="font-display text-5xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  <CounterUp
                    value={parseInt(stat.value.toString())}
                    suffix={stat.suffix}
                  />
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
