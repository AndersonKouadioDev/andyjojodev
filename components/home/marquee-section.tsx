"use client";

import { MarqueeTicker } from "@/components/ui/marquee-ticker";

const STACK_ITEMS = [
  "Next.js", "NestJS", "React Native", "Spring Boot", "Flutter",
  "TypeScript", "Docker", "PostgreSQL", "Microservices", "Laravel",
  "Figma", "CI/CD", "Kubernetes", "WebSocket", "Redis",
];

export function MarqueeSection() {
  return (
    <div className="relative py-5 overflow-hidden border-y border-white/5">
      {/* Top row — left */}
      <div className="bg-primary py-3 mb-px">
        <MarqueeTicker
          items={STACK_ITEMS.map((item) => (
            <span key={item} className="text-sm font-display font-semibold text-primary-foreground tracking-wider uppercase px-2">
              {item}
            </span>
          ))}
          speed={30}
          direction="left"
          separator={<span className="text-primary-foreground/50 text-base">✦</span>}
        />
      </div>

      {/* Bottom row — right, darker */}
      <div className="bg-foreground/5 py-3">
        <MarqueeTicker
          items={STACK_ITEMS.map((item) => (
            <span key={item} className="text-sm font-mono-brand text-muted-foreground tracking-widest uppercase px-2">
              {item}
            </span>
          ))}
          speed={20}
          direction="right"
          separator={<span className="text-primary/40 text-base">+</span>}
        />
      </div>
    </div>
  );
}
