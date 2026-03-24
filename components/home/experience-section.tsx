"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string[];
  isLatest?: boolean;
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const t = useTranslations("experience_section");
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useGSAP(() => {
    // Animate the SVG timeline line via stroke-dashoffset
    if (lineRef.current) {
      const length = lineRef.current.getTotalLength?.() ?? 600;
      gsap.set(lineRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
        },
      });
    }

    // Each experience item slides in
    const items = sectionRef.current?.querySelectorAll(".exp-item");
    if (items) {
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              once: true,
            },
          }
        );
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16">
          <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
            — {t("eyebrow")}
          </span>
          <h2 className="font-display text-section text-foreground">
            {t("title_1")} <span className="text-primary">{t("title_2")}</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* SVG line */}
          <svg
            className="absolute left-4 top-0 bottom-0 hidden md:block"
            width="2"
            height="100%"
            style={{ height: "100%" }}
            preserveAspectRatio="none"
          >
            <line
              ref={lineRef}
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="rgb(255 77 0 / 30%)"
              strokeWidth="2"
            />
          </svg>

          <div className="flex flex-col gap-0 md:pl-12">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className={cn(
                  "exp-item relative group",
                  i < experiences.length - 1 && "pb-12"
                )}
              >
                {/* Dot on the line */}
                <div
                  className={cn(
                    "absolute -left-[2.9rem] top-1 hidden md:flex",
                    "w-5 h-5 rounded-full border-2 items-center justify-center",
                    exp.isLatest
                      ? "border-primary bg-primary shadow-[0_0_12px_rgba(255,77,0,0.5)]"
                      : "border-white/20 bg-background group-hover:border-primary/60 transition-colors duration-300"
                  )}
                >
                  {exp.isLatest && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-6 md:p-8 border border-white/5 hover:border-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {exp.title}
                      </h3>
                      <p className="text-primary font-medium mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                    <span className="font-mono-brand text-xs text-muted-foreground border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {exp.description.map((line, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
