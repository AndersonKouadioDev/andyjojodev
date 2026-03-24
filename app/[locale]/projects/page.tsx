"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MainNav } from "@/components/navigation/main-nav";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ["Tous", "mobile", "erp", "web"] as const;
type Category = (typeof CATEGORIES)[number];

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const pt = useTranslations("projects_page");

  const CATEGORY_LABELS: Record<Category, string> = {
    Tous: pt("filter_all"),
    mobile: pt("filter_mobile"),
    erp: pt("filter_erp"),
    web: pt("filter_web"),
  };
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Category>("Tous");
  const [hovered, setHovered] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const projectKeys = [
    "project_1", "project_2", "project_3",
    "project_4", "project_5", "project_6",
  ] as const;

  const projects = projectKeys.map((key) => ({
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    sector: t(`${key}.sector`),
    type: t(`${key}.type`),
    role: t(`${key}.role`),
    tags: t(`${key}.tags`).split("|"),
    category: t(`${key}.category`),
    placeholder_image: t(`${key}.placeholder_image`),
    live_url: t(`${key}.live_url`),
    github_url: t(`${key}.github_url`),
  }));

  const filtered = active === "Tous" ? projects : projects.filter((p) => p.category === active);

  // Initial entrance
  useGSAP(() => {
    gsap.fromTo(
      ".projects-header",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  // Re-animate grid on filter change
  const handleFilter = (cat: Category) => {
    setActive(cat);
    setTimeout(() => {
      const cards = document.querySelectorAll(".project-item");
      gsap.fromTo(
        cards,
        { y: 25, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: "power2.out" }
      );
    }, 10);
  };

  // Hover preview follows cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const preview = previewRef.current;
    if (!preview) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    gsap.to(preview, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <div className="min-h-screen bg-background cursor-none-desktop">
      <CustomCursor />
      <MainNav />

      {/* Hover preview */}
      <div
        ref={previewRef}
        className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{ opacity: hovered !== null ? 1 : 0 }}
      >
        <div
          className="placeholder-zone w-48 h-32 rounded-xl shadow-2xl"
          data-label={hovered !== null ? projects[hovered]?.placeholder_image : ""}
        />
      </div>

      <div ref={sectionRef} className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">
        {/* Header */}
        <div className="projects-header flex flex-col gap-4 mb-14">
          <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
            — {pt("eyebrow")}
          </span>
          <h1 className="font-display text-section text-foreground">
            {pt("title_1")} <span className="text-primary">{pt("title_2")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            {pt("subtitle")}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <MagneticButton key={cat} strength={0.2}>
              <button
                onClick={() => handleFilter(cat)}
                className={cn(
                  "px-5 py-2 rounded-xl text-sm font-medium font-display transition-all duration-200",
                  active === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "glass text-muted-foreground hover:text-foreground border border-border/30"
                )}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            </MagneticButton>
          ))}
        </div>

        {/* Projects grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          onMouseMove={handleMouseMove}
        >
          {filtered.map((project, i) => (
            <div
              key={`${project.title}-${i}`}
              className="project-item glass rounded-2xl overflow-hidden border border-white/5 hover:border-primary/25 transition-all duration-300 group cursor-pointer"
              onMouseEnter={() => setHovered(projects.indexOf(project))}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Image placeholder */}
              <div
                className="placeholder-zone w-full h-44"
                data-label={`Image — ${project.title}`}
              />

              <div className="p-6 flex flex-col gap-4">
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <span className="font-mono-brand text-xs text-primary/70">
                    {project.sector}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-foreground/8 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={14} />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-foreground/8 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>

                <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <p className="text-xs text-muted-foreground/50 font-mono-brand">
                  {project.role}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-mono-brand bg-white/5 text-muted-foreground border-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 4 && (
                    <Badge
                      variant="secondary"
                      className="text-xs font-mono-brand bg-primary/10 text-primary border-0"
                    >
                      +{project.tags.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
