"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_KEYS = ["all", "Frontend", "Backend", "Mobile", "DevOps"] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

// Accent colors & index per category
const CATEGORY_META: Record<Exclude<CategoryKey, "all">, { color: string; bg: string; index: string }> = {
  Frontend: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  index: "FE" },
  Backend:  { color: "#34d399", bg: "rgba(52,211,153,0.08)",  index: "BE" },
  Mobile:   { color: "#c084fc", bg: "rgba(192,132,252,0.08)", index: "MO" },
  DevOps:   { color: "#fb923c", bg: "rgba(251,146,60,0.08)",  index: "DO" },
};

const SKILLS: { name: string; category: Exclude<CategoryKey, "all"> }[] = [
  // Frontend
  { name: "Next.js",       category: "Frontend" },
  { name: "React",         category: "Frontend" },
  { name: "TypeScript",    category: "Frontend" },
  { name: "Tailwind CSS",  category: "Frontend" },
  { name: "Zustand",       category: "Frontend" },
  { name: "React Query",   category: "Frontend" },
  { name: "Framer Motion", category: "Frontend" },
  { name: "Electron",      category: "Frontend" },
  // Backend
  { name: "NestJS",        category: "Backend" },
  { name: "Spring Boot",   category: "Backend" },
  { name: "Laravel",       category: "Backend" },
  { name: "Django",        category: "Backend" },
  { name: "Node.js",       category: "Backend" },
  { name: "PostgreSQL",    category: "Backend" },
  { name: "Redis",         category: "Backend" },
  { name: "GraphQL",       category: "Backend" },
  // Mobile
  { name: "React Native",  category: "Mobile" },
  { name: "Flutter",       category: "Mobile" },
  { name: "Expo",          category: "Mobile" },
  // DevOps
  { name: "Docker",          category: "DevOps" },
  { name: "Kubernetes",      category: "DevOps" },
  { name: "GitHub Actions",  category: "DevOps" },
  { name: "Kafka",           category: "DevOps" },
  { name: "CI/CD",           category: "DevOps" },
];

export function StackSection() {
  const t = useTranslations("stack_section");
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<CategoryKey>("all");

  const filtered = active === "all" ? SKILLS : SKILLS.filter((s) => s.category === active);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".skill-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  // Re-animate on tab change
  const handleCategory = (cat: CategoryKey) => {
    setActive(cat);
    const cards = gridRef.current?.querySelectorAll(".skill-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { y: 20, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: "power2.out" }
    );
  };

  return (
    <section ref={sectionRef} className="py-24 md:py-36 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12">
          <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
            — {t("eyebrow")}
          </span>
          <h2 className="font-display text-section text-foreground">
            {t("title_1")} <span className="text-primary">{t("title_2")}</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORY_KEYS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-medium font-display transition-all duration-200",
                active === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground border border-border/20"
              )}
            >
              {cat === "all" ? t("filter_all") : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {filtered.map((skill) => {
            const meta = CATEGORY_META[skill.category];
            return (
              <div
                key={skill.name}
                className="skill-card relative glass rounded-2xl overflow-hidden border border-border/20 hover:border-transparent cursor-default group transition-all duration-300 hover:-translate-y-0.5"
                style={{ "--accent": meta.color } as React.CSSProperties}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: meta.color }}
                />

                {/* Card body */}
                <div
                  className="flex flex-col items-start gap-3 p-4 pt-5"
                  style={{ background: `linear-gradient(135deg, ${meta.bg} 0%, transparent 60%)` }}
                >
                  {/* Category badge */}
                  <span
                    className="font-mono-brand text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-md font-bold"
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    {meta.index}
                  </span>

                  {/* Skill name */}
                  <span className="font-display text-[13px] font-semibold text-foreground/70 group-hover:text-foreground transition-colors duration-200 leading-tight">
                    {skill.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
