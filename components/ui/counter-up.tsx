"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface CounterUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CounterUp({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };

    const anim = gsap.to(obj, {
      val: value,
      duration,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        el.textContent = `${prefix}${Math.floor(obj.val)}${suffix}`;
      },
    });

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => anim.play(),
      once: true,
    });
  }, [value, duration, suffix, prefix]);

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}0{suffix}
    </span>
  );
}
