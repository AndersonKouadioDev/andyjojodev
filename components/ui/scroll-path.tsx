"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Desktop: starts at statue center (right column ~1040,505)
// Skiper-style: dramatic loops, large amplitude L↔R traversals, path crosses itself
const PATH_DESKTOP =
  "M 1040,505 " +
  // Opening flourish — loop around the statue
  "C 1300,280 1440,120 1380,370 " +
  "C 1320,620 1020,600 1080,800 " +
  // First big left sweep
  "C 1200,1050 1380,1200 1300,1520 " +
  "C 1220,1840 180,1960 60,2380 " +
  // Deep left → right arc
  "C -60,2800 520,3050 1000,3300 " +
  "C 1440,3550 1460,3900 1280,4280 " +
  // Right loop + back left
  "C 1100,4660 200,4820 60,5260 " +
  "C -60,5700 480,5980 1080,6100 " +
  // Right then dramatic back
  "C 1440,6220 1460,6580 1200,6900 " +
  "C 940,7220 180,7420 80,7820 " +
  // Arrive at contact heading "Un projet en tête ?" (SVG 720,8716)
  "C -20,8100 300,8450 560,8620 " +
  "C 640,8660 690,8700 720,8716";

// Mobile: starts at statue center (centered ~720,673)
const PATH_MOBILE =
  "M 720,673 " +
  // Opening loop
  "C 1000,450 1260,380 1220,620 " +
  "C 1180,860 880,840 860,1050 " +
  // First big left
  "C 840,1350 1200,1550 1120,1900 " +
  "C 1040,2250 120,2380 40,2800 " +
  // Left → right
  "C -40,3220 560,3500 1020,3760 " +
  "C 1440,4020 1460,4380 1260,4760 " +
  // Right loop back
  "C 1060,5140 120,5320 40,5760 " +
  "C -40,6200 580,6480 1100,6600 " +
  // Right + back
  "C 1440,6720 1460,7060 1200,7380 " +
  "C 940,7700 120,7880 60,8260 " +
  // Arrive at contact heading (mobile SVG ~720,8620)
  "C -20,8450 300,8540 560,8590 " +
  "C 640,8600 690,8610 720,8620";

export function ScrollPath() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ghostRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      const ghost = ghostRef.current;
      const dot = dotRef.current;
      if (!path || !ghost || !dot) return;

      const mm = gsap.matchMedia();

      const setupAnimation = (pathD: string) => {
        path.setAttribute("d", pathD);
        ghost.setAttribute("d", pathD);

        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        const p0 = path.getPointAtLength(0);
        gsap.set(dot, {
          xPercent: -50,
          yPercent: -50,
          left: `${(p0.x / 1440) * 100}%`,
          top: `${(p0.y / 9500) * 100}%`,
        });

        const st = {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        };

        const pathTween = gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: st,
        });

        let arrived = false;
        const dotTrigger = ScrollTrigger.create({
          ...st,
          onUpdate(self) {
            const pt = path.getPointAtLength(self.progress * length);
            gsap.set(dot, {
              left: `${(pt.x / 1440) * 100}%`,
              top: `${(pt.y / 9500) * 100}%`,
            });

            // Pulse the contact heading when path arrives
            if (!arrived && self.progress >= 0.97) {
              arrived = true;
              const title = document.getElementById("path-end-title");
              if (title) {
                gsap.fromTo(
                  title,
                  { filter: "drop-shadow(0 0 0px #FF4D00)" },
                  { filter: "drop-shadow(0 0 28px #FF4D0088)", duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }
                );
              }
            } else if (arrived && self.progress < 0.95) {
              arrived = false;
            }
          },
        });

        return () => {
          pathTween.kill();
          dotTrigger.kill();
        };
      };

      mm.add("(min-width: 1024px)", () => setupAnimation(PATH_DESKTOP));
      mm.add("(max-width: 1023px)", () => setupAnimation(PATH_MOBILE));
    },
    { scope: wrapperRef }
  );

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 9500"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="sp-glow" x="-60%" y="-30%" width="220%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feFlood floodColor="#FF4D00" floodOpacity="0.55" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="sp-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4D00" />
            <stop offset="60%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#C9993A" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Ghost path — full trajectory, very subtle */}
        <path
          ref={ghostRef}
          d={PATH_DESKTOP}
          fill="none"
          stroke="#FF4D00"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.06"
          strokeDasharray="4 10"
          strokeLinecap="round"
        />

        {/* Animated draw path */}
        <path
          ref={pathRef}
          d={PATH_DESKTOP}
          fill="none"
          stroke="url(#sp-grad)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          filter="url(#sp-glow)"
        />
      </svg>

      {/* Glowing dot at path tip */}
      <div
        ref={dotRef}
        className="absolute w-2.5 h-2.5 rounded-full bg-primary"
        style={{
          boxShadow:
            "0 0 10px 3px rgba(255,77,0,0.7), 0 0 22px 8px rgba(255,77,0,0.3)",
        }}
      />
    </div>
  );
}
