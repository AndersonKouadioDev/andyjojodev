"use client";

import React, { useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface GsapSplitTextProps {
  children: ReactNode;
  className?: string;
  type?: "chars" | "words" | "lines";
  stagger?: number;
  delay?: number;
  triggerOnScroll?: boolean;
  from?: gsap.TweenVars;
  tag?: string;
}

export function GsapSplitText({
  children,
  className,
  type = "words",
  stagger = 0.06,
  delay = 0,
  triggerOnScroll = true,
  from = { y: 60, opacity: 0, rotationX: -30 },
  tag: Tag = "div",
}: GsapSplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const split = new SplitText(el, { type });

    const targets =
      type === "chars"
        ? split.chars
        : type === "words"
        ? split.words
        : split.lines;

    const anim = gsap.from(targets, {
      ...from,
      duration: 0.8,
      stagger,
      ease: "power3.out",
      delay,
      paused: triggerOnScroll,
    });

    if (triggerOnScroll) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => anim.play(),
        once: true,
      });
    }

    return () => split.revert();
  }, [type, stagger, delay, triggerOnScroll]);

  return React.createElement(
    Tag as string,
    { ref, className: cn("overflow-hidden", className) },
    children
  );
}
