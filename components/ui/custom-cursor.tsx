"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power3.out",
      });
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf: number;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      gsap.set(ring, { x: ringX, y: ringY });
      raf = requestAnimationFrame(animate);
    };

    // Hover interactions
    const onMouseEnterLink = () => {
      gsap.to(ring, { scale: 2.2, opacity: 0.5, duration: 0.3 });
      gsap.to(dot, { scale: 0.3, duration: 0.3 });
    };

    const onMouseLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 0.7, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const links = document.querySelectorAll("a, button, [data-cursor-hover]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterLink);
      el.addEventListener("mouseleave", onMouseLeaveLink);
    });

    document.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterLink);
        el.removeEventListener("mouseleave", onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#FF4D00",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 77, 0, 0.7)",
          transform: "translate(-50%, -50%)",
          opacity: 0.7,
        }}
      />
    </>
  );
}
