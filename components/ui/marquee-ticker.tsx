"use client";

import { useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface MarqueeTickerProps {
  items: ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  separator?: ReactNode;
}

export function MarqueeTicker({
  items,
  speed = 25,
  direction = "left",
  className,
  separator,
}: MarqueeTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    gsap.set(track, { x: direction === "left" ? 0 : -totalWidth });
    gsap.to(track, {
      x: direction === "left" ? -totalWidth : 0,
      duration: speed,
      ease: "none",
      repeat: -1,
    });
  }, [speed, direction]);

  const repeated = [...items, ...items];

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={trackRef} className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center shrink-0">
            {item}
            {separator && i < repeated.length - 1 && (
              <span className="mx-3 opacity-50">{separator}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
