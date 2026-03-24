"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MainNav } from "@/components/navigation/main-nav";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { PerspectiveCard } from "@/components/ui/perspective-card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

// Radar data
const RADAR_SKILLS = [
  { label: "Frontend", value: 92 },
  { label: "Backend", value: 85 },
  { label: "Mobile", value: 78 },
  { label: "DevOps", value: 72 },
  { label: "UX/UI", value: 70 },
  { label: "Leadership", value: 80 },
];

const TECH_SKILLS = [
  { name: "Next.js / React", level: 95, category: "Frontend" },
  { name: "TypeScript", level: 90, category: "Frontend" },
  { name: "Tailwind CSS", level: 92, category: "Frontend" },
  { name: "NestJS", level: 88, category: "Backend" },
  { name: "Spring Boot", level: 80, category: "Backend" },
  { name: "Laravel", level: 82, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Backend" },
  { name: "React Native", level: 82, category: "Mobile" },
  { name: "Flutter", level: 72, category: "Mobile" },
  { name: "Docker", level: 78, category: "DevOps" },
  { name: "CI/CD", level: 75, category: "DevOps" },
  { name: "Figma", level: 80, category: "UX/UI" },
];

function RadarChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 110;
  const n = RADAR_SKILLS.length;

  const getPoint = (idx: number, r: number) => {
    const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = RADAR_SKILLS.map((s, i) => getPoint(i, (s.value / 100) * maxR));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  useGSAP(() => {
    const path = svgRef.current?.querySelector(".radar-data");
    if (!path) return;
    const length = (path as SVGPathElement).getTotalLength?.() ?? 800;
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    gsap.to(path, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.inOut",
      scrollTrigger: { trigger: svgRef.current, start: "top 80%", once: true },
    });

    // Fill fade in
    const fill = svgRef.current?.querySelector(".radar-fill");
    if (!fill) return;
    gsap.fromTo(fill, { opacity: 0 }, {
      opacity: 1, duration: 0.8, delay: 0.8,
      scrollTrigger: { trigger: svgRef.current, start: "top 80%", once: true },
    });
  }, []);

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid levels */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={Array.from({ length: n }, (_, i) => {
            const p = getPoint(i, maxR * level);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {RADAR_SKILLS.map((_, i) => {
        const outer = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}
      {/* Data fill */}
      <path className="radar-fill" d={dataPath} fill="rgba(255,77,0,0.1)" stroke="none" />
      {/* Data stroke */}
      <path className="radar-data" d={dataPath} fill="none" stroke="#FF4D00" strokeWidth="2" />
      {/* Labels */}
      {RADAR_SKILLS.map((skill, i) => {
        const labelPt = getPoint(i, maxR + 24);
        return (
          <text
            key={i}
            x={labelPt.x}
            y={labelPt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="rgba(250,250,250,0.6)"
            fontFamily="JetBrains Mono, monospace"
          >
            {skill.label}
          </text>
        );
      })}
      {/* Dots on data */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#FF4D00" opacity="0.9" />
      ))}
    </svg>
  );
}

function SkillBar({ name, level, category }: { name: string; level: number; category: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;
    gsap.fromTo(
      bar,
      { width: "0%" },
      {
        width: `${level}%`,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: bar, start: "top 88%", once: true },
      }
    );
  }, [level]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">{name}</span>
        <span className="font-mono-brand text-xs text-primary">{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #FF4D00, #C9993A)",
            width: 0,
          }}
        />
      </div>
    </div>
  );
}

const SOFT_SKILLS_KEYS = ["skill_1", "skill_2", "skill_3", "skill_4", "skill_5", "skill_6", "skill_7", "skill_8"] as const;

export default function SkillsPage() {
  const softT = useTranslations("soft_skills");
  const st = useTranslations("skills_page");
  const softSkills = SOFT_SKILLS_KEYS.map((k) => softT(k));
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".skills-header", { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3,
    });
    gsap.fromTo(".soft-tag", { scale: 0.8, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: "back.out(1.5)",
      scrollTrigger: { trigger: ".soft-skills-grid", start: "top 85%", once: true },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background cursor-none-desktop">
      <CustomCursor />
      <MainNav />

      <div ref={sectionRef} className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">
        {/* Header */}
        <div className="skills-header flex flex-col gap-4 mb-16">
          <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
            — {st("eyebrow")}
          </span>
          <h1 className="font-display text-section text-foreground">
            {st("title_1")} <span className="text-primary">{st("title_2")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            {st("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left — Radar */}
          <div className="flex flex-col items-center gap-8">
            <div className="glass rounded-3xl p-10 border border-white/5 flex flex-col items-center gap-6">
              <h2 className="font-display text-xl font-semibold text-foreground self-start">
                {st("radar_title")}
              </h2>
              <RadarChart />
            </div>

            {/* Soft skills */}
            <div className="w-full glass rounded-3xl p-8 border border-white/5">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                {st("soft_title")}
              </h2>
              <div className="soft-skills-grid flex flex-wrap gap-2">
                {softSkills.map((skill) => (
                  <span
                    key={skill}
                    className="soft-tag px-4 py-2 rounded-xl text-sm font-medium border border-primary/20 bg-primary/5 text-primary hover:bg-primary/15 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Skill bars */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {["Frontend", "Backend", "Mobile", "DevOps", "UX/UI"].map((cat) => {
              const catSkills = TECH_SKILLS.filter((s) => s.category === cat);
              return (
                <PerspectiveCard
                  key={cat}
                  className="glass rounded-2xl p-8 border border-white/5 hover:border-primary/20 transition-colors"
                  intensity={5}
                >
                  <h3 className="font-display text-lg font-semibold text-foreground mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {cat}
                  </h3>
                  <div className="flex flex-col gap-4">
                    {catSkills.map((skill) => (
                      <SkillBar key={skill.name} {...skill} />
                    ))}
                  </div>
                </PerspectiveCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
