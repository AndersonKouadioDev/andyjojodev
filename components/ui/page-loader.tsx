"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin();

const TOTAL_BLOCKS = 10;
const SIM_DURATION = 1.8;
const MIN_DISPLAY = 1.8;

/* ── Theme colors ──────────────────────────────────────────────────────── */
function getColors(isDark: boolean) {
  return {
    bg:           isDark ? "#111111" : "#EDEAE5",
    card:         isDark ? "#1c1c1c" : "#ffffff",
    cardBorder:   isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    mainBorder:   isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
    text:         isDark ? "#e8e8e8" : "#1a1a1a",
    muted:        isDark ? "#666666" : "#9e9e9e",
    faint:        isDark ? "#555555" : "#aaaaaa",
    body:         isDark ? "#aaaaaa" : "#555555",
    pill:         isDark ? "#2a2a2a" : "#F0EDE8",
    pillText:     isDark ? "#c0c0c0" : "#2a2a2a",
    divider:      isDark ? "#2a2a2a" : "#eeeeee",
    blockFilled:  isDark ? "#e0e0e0" : "#2A2A2A",
    blockEmpty:   isDark ? "#2a2a2a" : "#E8E8E8",
    progressText: isDark ? "#888888" : "#555555",
    dotCircles:   isDark ? "#333333" : "#e5e5e5",
    labelTop:     isDark ? "#555555" : "#aaaaaa",
  };
}

/* ── Card data ─────────────────────────────────────────────────────────── */
// batch 0 → 0.05s  |  batch 1 → 0.22s  |  batch 2 → 0.40s
const BATCH_DELAY = [0.05, 0.22, 0.40];

type Colors = ReturnType<typeof getColors>;

const FLOATERS: {
  id: string;
  pos: React.CSSProperties;
  rotate: number;
  from: gsap.TweenVars;
  batch: 0 | 1 | 2;
  content: (C: Colors) => React.ReactNode;
}[] = [
  // top-left — identity  [batch 0]
  {
    id: "ak",
    pos: { top: "7%", left: "5%" },
    rotate: -2.5,
    from: { x: -90, y: -30, opacity: 0, scale: 0.88 },
    batch: 0,
    content: (C) => (
      <div className="px-5 py-4">
        <div style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: 38, fontWeight: 700, lineHeight: 1, color: C.text, letterSpacing: "-0.02em" }}>
          AK<span style={{ color: "#FF4D00" }}>.</span>
        </div>
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, letterSpacing: "0.2em", color: C.muted, marginTop: 6, textTransform: "uppercase" }}>
          Portfolio 2025
        </div>
      </div>
    ),
  },
  // top-right — stack  [batch 0]
  {
    id: "stack",
    pos: { top: "5%", right: "4%" },
    rotate: 2,
    from: { x: 80, y: -40, opacity: 0, scale: 0.9 },
    batch: 0,
    content: (C) => (
      <div className="px-4 py-3">
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 8, letterSpacing: "0.2em", color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>
          Stack principal
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {["Next.js", "NestJS", "React Native", "Spring Boot", "TypeScript"].map(t => (
            <span key={t} style={{ fontSize: 10, fontWeight: 600, color: C.pillText, background: C.pill, borderRadius: 99, padding: "3px 9px", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.05em" }}>{t}</span>
          ))}
        </div>
      </div>
    ),
  },
  // mid-left — open to work  [batch 1]
  {
    id: "otw",
    pos: { top: "28%", left: "3%" },
    rotate: -1.5,
    from: { x: -70, opacity: 0, scale: 0.9 },
    batch: 1,
    content: (_C) => (
      <div className="px-4 py-3 flex items-center gap-2.5">
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, color: "#22c55e", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
          Open to work
        </span>
      </div>
    ),
  },
  // mid-right — stats  [batch 1]
  {
    id: "stats",
    pos: { top: "36%", right: "3%" },
    rotate: 3,
    from: { x: 80, y: 20, opacity: 0, scale: 0.88 },
    batch: 1,
    content: (C) => (
      <div className="px-5 py-4">
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1 }}>5<span style={{ color: "#FF4D00" }}>+</span></div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 8, color: C.faint, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>ans d&apos;exp.</div>
          </div>
          <div style={{ width: 1, height: 36, background: C.divider, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1 }}>10<span style={{ color: "#FF4D00" }}>+</span></div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 8, color: C.faint, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>projets</div>
          </div>
        </div>
      </div>
    ),
  },
  // center-left — role  [batch 2]
  {
    id: "role",
    pos: { top: "56%", left: "4%" },
    rotate: 1.5,
    from: { x: -80, y: 20, opacity: 0, scale: 0.9 },
    batch: 2,
    content: (C) => (
      <div className="px-5 py-4" style={{ maxWidth: 190 }}>
        <div style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          Tech Lead<br />&amp; Fullstack Dev
        </div>
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 8, color: C.faint, marginTop: 6, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Abidjan, Côte d&apos;Ivoire
        </div>
      </div>
    ),
  },
  // top-center — exp tag  [batch 1]
  {
    id: "exp",
    pos: { top: "14%", left: "38%" },
    rotate: -1,
    from: { y: -60, opacity: 0, scale: 0.88 },
    batch: 1,
    content: (C) => (
      <div className="px-4 py-2.5 flex items-center gap-2">
        <span style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: 11, fontWeight: 700, color: "#FF4D00", letterSpacing: "-0.01em" }}>5 ans</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.divider }} />
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, color: C.body, letterSpacing: "0.1em", textTransform: "uppercase" }}>d&apos;expérience</span>
      </div>
    ),
  },
  // bottom-left — location  [batch 2]
  {
    id: "loc",
    pos: { bottom: "9%", left: "5%" },
    rotate: -3,
    from: { x: -60, y: 60, opacity: 0, scale: 0.88 },
    batch: 2,
    content: (C) => (
      <div className="px-4 py-3">
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 8, color: C.labelTop, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Basé à</div>
        <div style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>Abidjan</div>
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, color: C.faint, letterSpacing: "0.1em", marginTop: 2 }}>Côte d&apos;Ivoire <span style={{ color: "#FF4D00" }}>✦</span></div>
      </div>
    ),
  },
  // bottom-right — dispo  [batch 2]
  {
    id: "dispo",
    pos: { bottom: "8%", right: "4%" },
    rotate: 2.5,
    from: { x: 70, y: 50, opacity: 0, scale: 0.88 },
    batch: 2,
    content: (C) => (
      <div className="px-4 py-3" style={{ maxWidth: 160 }}>
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 8, color: C.labelTop, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 5 }}>Disponibilité</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, color: C.text, fontWeight: 600, letterSpacing: "0.08em" }}>Missions freelance</span>
        </div>
      </div>
    ),
  },
  // center-right — sectors  [batch 2]
  {
    id: "sectors",
    pos: { top: "62%", right: "4%" },
    rotate: -2,
    from: { x: 70, y: -20, opacity: 0, scale: 0.9 },
    batch: 2,
    content: (C) => (
      <div className="px-4 py-3">
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 8, color: C.labelTop, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Secteurs</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {["SaaS", "Fintech", "Immobilier", "Restauration"].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF4D00", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, color: C.body, letterSpacing: "0.05em" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function PageLoader() {
  const [visible, setVisible]       = useState(true);
  const [progress, setProgress]     = useState(0);
  const [simDone, setSimDone]       = useState(false);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [animKey, setAnimKey]       = useState(0); // increments to re-trigger entrance anim

  const overlayRef  = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const floaterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exitingRef  = useRef(false);
  const isRouteChange = useRef(false);

  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  // useLayoutEffect fires synchronously before the browser paints, so the correct
  // dark/light value is applied before the user sees the loader — no visible flash.
  const [isDark, setIsDark] = useState(false); // safe SSR default
  useLayoutEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check(); // apply immediately before paint
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  const C = getColors(isDark);

  // ── Entrance animations (re-runs when animKey changes for route nav) ──────
  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 28, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out", delay: 0.0 }
      );
    }
    floaterRefs.current.forEach((el, i) => {
      if (!el) return;
      const f = FLOATERS[i];
      gsap.fromTo(el,
        { ...f.from },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)", delay: BATCH_DELAY[f.batch] }
      );
    });
  }, { scope: overlayRef, dependencies: [animKey] });

  // ── Initial simulated progress ────────────────────────────────────────────
  useEffect(() => {
    const proxy = { v: 0 };
    const tween = gsap.to(proxy, {
      v: 90, duration: SIM_DURATION, ease: "power2.out",
      onUpdate: () => setProgress(Math.round(proxy.v)),
      onComplete: () => setSimDone(true),
    });
    return () => { tween.kill(); };
  }, []);

  // ── THREE.js hook ─────────────────────────────────────────────────────────
  useEffect(() => {
    let done = false;
    import("three").then(({ DefaultLoadingManager }) => {
      const prev = DefaultLoadingManager.onLoad;
      DefaultLoadingManager.onLoad = () => {
        prev?.();
        if (!done) { done = true; setThreeLoaded(true); }
        DefaultLoadingManager.onLoad = prev;
      };
      setTimeout(() => { if (!done) { done = true; setThreeLoaded(true); } }, 800);
    });
    const hard = setTimeout(() => { if (!done) { done = true; setThreeLoaded(true); } }, 3500);
    return () => clearTimeout(hard);
  }, []);

  // ── Exit ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!simDone || !threeLoaded || exitingRef.current) return;
    exitingRef.current = true;
    setProgress(100);
    setTimeout(() => {
      if (!overlayRef.current) { setVisible(false); return; }
      floaterRefs.current.forEach((el, i) => {
        if (!el) return;
        const f = FLOATERS[i];
        gsap.to(el, {
          x: ((f.from.x as number) ?? 0) * 0.6,
          y: ((f.from.y as number) ?? 0) * 0.6,
          opacity: 0, scale: 0.9,
          duration: 0.4, ease: "power2.in",
          delay: i * 0.025,
        });
      });
      setTimeout(() => {
        gsap.to(overlayRef.current!, {
          yPercent: -100, duration: 0.65, ease: "power3.inOut",
          onComplete: () => setVisible(false),
        });
      }, 250);
    }, 300);
  }, [simDone, threeLoaded]);

  // ── Route change — useLayoutEffect to prevent white flash ─────────────────
  // State updates here are flushed synchronously before the browser paints.
  useLayoutEffect(() => {
    if (prevPathname.current === null) { prevPathname.current = pathname; return; }
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    isRouteChange.current = true;
    exitingRef.current = false;
    setVisible(true);
    setProgress(0);
    setSimDone(false);
    setThreeLoaded(false);
    setAnimKey(k => k + 1);
  }, [pathname]);

  // ── Route change — progress tween (async, after layout) ──────────────────
  useEffect(() => {
    if (!isRouteChange.current) return;
    isRouteChange.current = false;
    const proxy = { v: 0 };
    const tween = gsap.to(proxy, {
      v: 90, duration: MIN_DISPLAY, ease: "power2.out",
      onUpdate: () => setProgress(Math.round(proxy.v)),
      onComplete: () => setSimDone(true),
    });
    const t = setTimeout(() => setThreeLoaded(true), MIN_DISPLAY * 800);
    return () => { tween.kill(); clearTimeout(t); };
  }, [pathname]);

  if (!visible) return null;

  const filledBlocks = Math.ceil(progress / TOTAL_BLOCKS);

  return (
    <div
      ref={overlayRef}
      suppressHydrationWarning
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
      {/* ── Mobile positions — cards bleed off edges ─────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          [data-floater-id="ak"]      { top: 2% !important; left: -12% !important; }
          [data-floater-id="stack"]   { top: 2% !important; right: -18% !important; }
          [data-floater-id="otw"]     { top: 20% !important; left: -14% !important; }
          [data-floater-id="stats"]   { top: 28% !important; right: -16% !important; }
          [data-floater-id="role"]    { top: 54% !important; left: -10% !important; }
          [data-floater-id="exp"]     { top: 10% !important; left: 28% !important; }
          [data-floater-id="loc"]     { bottom: 4% !important; left: -12% !important; }
          [data-floater-id="dispo"]   { bottom: 4% !important; right: -14% !important; }
          [data-floater-id="sectors"] { top: 62% !important; right: -18% !important; }
        }
      `}</style>

      {/* ── Scattered floater cards ──────────────────────────────────────── */}
      {FLOATERS.map((f, i) => (
        <div
          key={f.id}
          ref={el => { floaterRefs.current[i] = el; }}
          data-floater-id={f.id}
          className="absolute rounded-xl shadow-sm"
          style={{
            ...f.pos,
            background: C.card,
            border: `1px solid ${C.cardBorder}`,
            transform: `rotate(${f.rotate}deg)`,
            opacity: 0,
          }}
        >
          {f.content(C)}
        </div>
      ))}

      {/* ── Main loader card ─────────────────────────────────────────────── */}
      <div
        ref={cardRef}
        className="relative z-10 rounded-2xl shadow-md"
        style={{ width: 290, padding: "18px 22px", opacity: 0, background: C.card, border: `1px solid ${C.mainBorder}` }}
      >
        <div className="flex justify-between items-center mb-4">
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, letterSpacing: "0.24em", color: C.muted, textTransform: "uppercase" }}>
            Chargement
          </span>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: C.dotCircles }} />
            <div className="w-2 h-2 rounded-full" style={{ background: C.dotCircles }} />
          </div>
        </div>

        <div className="flex gap-[3px] mb-3">
          {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-[5px]"
              style={{
                height: 34,
                backgroundColor: i < filledBlocks ? C.blockFilled : C.blockEmpty,
                transition: "background-color 0.12s ease",
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: "right", fontFamily: "var(--font-mono, monospace)", fontSize: 13, color: C.progressText, fontVariantNumeric: "tabular-nums" }}>
          {progress}%
        </div>
      </div>
    </div>
  );
}
