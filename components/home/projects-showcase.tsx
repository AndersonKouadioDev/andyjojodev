"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  title: string;
  description: string;
  sector: string;
  type: string;
  role: string;
  tags: string[];
  category: string;
  placeholder_image: string;
  live_url: string;
  github_url: string;
}

interface ProjectsShowcaseProps {
  projects: Project[];
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const t = useTranslations("projects_showcase");
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  // Fan → grid animation on scroll
  useGSAP(() => {
    const cards = cardsContainerRef.current?.querySelectorAll(".project-card");
    if (!cards) return;

    const angles = [-10, -6, -2, 2, 6, 10];

    // Initial fan state
    cards.forEach((card, i) => {
      gsap.set(card, {
        rotateZ: angles[i] ?? 0,
        z: -i * 20,
        transformOrigin: "bottom center",
      });
    });

    // Scroll → unfan to grid
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          rotateZ: 0,
          z: 0,
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      },
    });

    // Initial hidden state
    gsap.set(cards, { opacity: 0, y: 30 });
  }, []);

  // Hover preview follows cursor
  const handleMouseMove = (e: React.MouseEvent, idx: number) => {
    const preview = previewRef.current;
    if (!preview || activeProject !== idx) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    gsap.to(preview, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 80,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  // Show first 6 on homepage
  const showcased = projects.slice(0, 6);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-4">
            <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
              — {t("eyebrow")}
            </span>
            <h2 className="font-display text-section text-foreground">
              {t("title_1")} <span className="text-primary">{t("title_2")}</span>
            </h2>
          </div>
          <MagneticButton>
            <Link href="/projects">
              <Button
                variant="outline"
                className="font-display border-border/50 hover:border-primary/40 hover:bg-foreground/5 rounded-xl"
              >
                {t("view_all")}
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </MagneticButton>
        </div>

        {/* Hover preview */}
        <div
          ref={previewRef}
          className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
          style={{ opacity: activeProject !== null ? 1 : 0 }}
        >
          {activeProject !== null && showcased[activeProject] && (
            <div className="w-44 h-28 rounded-xl overflow-hidden shadow-2xl border border-border/20">
              <Image
                src={`/images/projects/${showcased[activeProject].placeholder_image}.webp`}
                alt={showcased[activeProject].title}
                width={176}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Cards grid */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          style={{ perspective: "1000px" }}
        >
          {showcased.map((project, i) => (
            <div
              key={i}
              className="project-card glass rounded-2xl overflow-hidden border border-border/25 hover:border-primary/25 transition-all duration-300 group cursor-pointer"
              onMouseEnter={() => setActiveProject(i)}
              onMouseLeave={() => setActiveProject(null)}
              onMouseMove={(e) => handleMouseMove(e, i)}
            >
              {/* Project image */}
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={`/images/projects/${project.placeholder_image}.webp`}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-4">
                {/* Meta row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono-brand text-xs text-primary/70 tracking-wide">
                    {project.sector} · {project.type}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-foreground/8 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  {project.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Role */}
                <p className="text-xs text-muted-foreground/60 font-mono-brand">
                  {project.role}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-mono-brand bg-white/5 text-muted-foreground border-0 px-2 py-0.5"
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
    </section>
  );
}
