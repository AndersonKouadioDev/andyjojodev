"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_KEYS = ["all", "Frontend", "Backend", "Mobile", "DevOps"] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const CATEGORY_COLOR: Record<Exclude<CategoryKey, "all">, string> = {
  Frontend: "#60a5fa",
  Backend:  "#34d399",
  Mobile:   "#c084fc",
  DevOps:   "#fb923c",
};

const SKILLS: { name: string; category: Exclude<CategoryKey, "all"> }[] = [
  { name: "Next.js",        category: "Frontend" },
  { name: "React",          category: "Frontend" },
  { name: "TypeScript",     category: "Frontend" },
  { name: "Tailwind CSS",   category: "Frontend" },
  { name: "Zustand",        category: "Frontend" },
  { name: "React Query",    category: "Frontend" },
  { name: "Framer Motion",  category: "Frontend" },
  { name: "Electron",       category: "Frontend" },
  { name: "NestJS",         category: "Backend"  },
  { name: "Spring Boot",    category: "Backend"  },
  { name: "Laravel",        category: "Backend"  },
  { name: "Django",         category: "Backend"  },
  { name: "Node.js",        category: "Backend"  },
  { name: "PostgreSQL",     category: "Backend"  },
  { name: "Redis",          category: "Backend"  },
  { name: "GraphQL",        category: "Backend"  },
  { name: "React Native",   category: "Mobile"   },
  { name: "Flutter",        category: "Mobile"   },
  { name: "Expo",           category: "Mobile"   },
  { name: "Docker",         category: "DevOps"   },
  { name: "Kubernetes",     category: "DevOps"   },
  { name: "GitHub Actions", category: "DevOps"   },
  { name: "Kafka",          category: "DevOps"   },
  { name: "CI/CD",          category: "DevOps"   },
];

export function StackSection() {
  const t = useTranslations("stack_section");
  const [isDark, setIsDark] = useState(false);
  useLayoutEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<CategoryKey>("all");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const filtered = active === "all" ? SKILLS : SKILLS.filter((s) => s.category === active);

  useGSAP(
    () => {
      const cards = sectionRef.current?.querySelectorAll(".skill-pill");
      if (!cards) return;
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const handleCategory = (cat: CategoryKey) => {
    setActive(cat);
    setHoveredIdx(null);
    requestAnimationFrame(() => {
      const pills = gridRef.current?.querySelectorAll(".skill-pill");
      if (!pills) return;
      gsap.fromTo(pills,
        { y: 16, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, stagger: 0.03, ease: "power2.out" }
      );
    });
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

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-12">
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

        {/* Pills */}
        <div
          ref={gridRef}
          className="flex flex-wrap gap-3"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {filtered.map((skill, i) => {
            const color = CATEGORY_COLOR[skill.category];
            const isHovered = hoveredIdx === i;
            const drift =
              hoveredIdx !== null && !isHovered
                ? i < hoveredIdx ? -14 : 14
                : 0;

            return (
              <div
                key={skill.name}
                className="skill-pill select-none cursor-default"
                onMouseEnter={() => setHoveredIdx(i)}
                style={{
                  /* Layout */
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  border: `1px solid ${isHovered ? color : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.14)"}`,
                  /* Colors */
                  background: isHovered ? `${color}18` : "transparent",
                  color: isHovered ? color : isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)",
                  /* Text */
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "var(--font-display, sans-serif)",
                  /* Motion */
                  transform: isHovered
                    ? "translateY(-5px) scale(1.06)"
                    : `translateX(${drift}px)`,
                  opacity: hoveredIdx !== null && !isHovered ? 0.4 : 1,
                  transition:
                    "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease, border-color 0.2s ease, color 0.2s ease, background 0.2s ease",
                  boxShadow: isHovered ? `0 4px 18px ${color}35` : "none",
                  zIndex: isHovered ? 2 : 1,
                  position: "relative",
                }}
              >
                {skill.name}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
