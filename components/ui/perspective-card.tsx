"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface PerspectiveCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function PerspectiveCard({
  children,
  className,
  intensity = 12,
}: PerspectiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    gsap.to(card, {
      rotationY: dx * intensity,
      rotationX: -dy * intensity,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
      transformOrigin: "center center",
    });

    if (glow) {
      gsap.to(glow, {
        opacity: 0.15,
        x: (e.clientX - rect.left) - rect.width / 2,
        y: (e.clientY - rect.top) - rect.height / 2,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;

    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.3 });
  };

  return (
    <div
      ref={cardRef}
      className={cn("perspective-card relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow highlight */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 200,
          height: 200,
          background:
            "radial-gradient(circle, rgba(255,77,0,0.3) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          top: "50%",
          left: "50%",
        }}
      />
      {children}
    </div>
  );
}
