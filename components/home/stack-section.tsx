"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PerspectiveCard } from "@/components/ui/perspective-card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_KEYS = ["all", "Frontend", "Backend", "Mobile", "DevOps"] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const SKILLS: { name: string; category: Exclude<CategoryKey, "all">; icon: string }[] = [
  // Frontend
  { name: "Next.js", category: "Frontend", icon: "N" },
  { name: "React", category: "Frontend", icon: "⚛" },
  { name: "TypeScript", category: "Frontend", icon: "TS" },
  { name: "Tailwind CSS", category: "Frontend", icon: "TW" },
  { name: "Zustand", category: "Frontend", icon: "Z" },
  { name: "React Query", category: "Frontend", icon: "RQ" },
  { name: "Framer Motion", category: "Frontend", icon: "FM" },
  { name: "Electron", category: "Frontend", icon: "E" },
  // Backend
  { name: "NestJS", category: "Backend", icon: "N" },
  { name: "Spring Boot", category: "Backend", icon: "SB" },
  { name: "Laravel", category: "Backend", icon: "L" },
  { name: "Django", category: "Backend", icon: "D" },
  { name: "Node.js", category: "Backend", icon: "⬡" },
  { name: "PostgreSQL", category: "Backend", icon: "PG" },
  { name: "Redis", category: "Backend", icon: "R" },
  { name: "GraphQL", category: "Backend", icon: "G" },
  // Mobile
  { name: "React Native", category: "Mobile", icon: "RN" },
  { name: "Flutter", category: "Mobile", icon: "FL" },
  { name: "Expo", category: "Mobile", icon: "EX" },
  // DevOps
  { name: "Docker", category: "DevOps", icon: "🐳" },
  { name: "Kubernetes", category: "DevOps", icon: "K8S" },
  { name: "GitHub Actions", category: "DevOps", icon: "GH" },
  { name: "Kafka", category: "DevOps", icon: "KF" },
  { name: "CI/CD", category: "DevOps", icon: "⚙" },
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
          {filtered.map((skill) => (
            <PerspectiveCard
              key={skill.name}
              className="skill-card glass rounded-2xl p-4 border border-white/5 hover:border-primary/30 cursor-default group"
              intensity={10}
            >
              <div className="flex flex-col items-center gap-3 py-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    "bg-white/5 group-hover:bg-primary/10 transition-colors duration-200",
                    "text-sm font-mono-brand font-bold text-muted-foreground group-hover:text-primary"
                  )}
                >
                  {skill.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200 text-center leading-tight">
                  {skill.name}
                </span>
              </div>
            </PerspectiveCard>
          ))}
        </div>
      </div>
    </section>
  );
}
