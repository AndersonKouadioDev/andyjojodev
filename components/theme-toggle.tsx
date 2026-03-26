"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useCallback, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  /** true = button is on a dark overlay → always white border/icons */
  onOverlay?: boolean;
}

export function ThemeToggle({ className, onOverlay = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const isDark = resolvedTheme === "dark";
      const next = isDark ? "light" : "dark";

      /* ── Fallback: browsers without View Transition API ── */
      if (!("startViewTransition" in document)) {
        setTheme(next);
        return;
      }

      const x = e.clientX;
      const y = e.clientY;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = (document as Document & {
        startViewTransition: (cb: () => void) => { ready: Promise<void> };
      }).startViewTransition(() => {
        setTheme(next);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [resolvedTheme, setTheme]
  );

  return (
    <button
      onClick={handleToggle}
      aria-label="Basculer le thème"
      className={cn(
        "relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
        onOverlay
          ? "border border-white/25 hover:border-white/60 text-white hover:bg-white/10"
          : "border border-border/40 hover:border-primary/50 text-foreground hover:bg-foreground/5",
        className
      )}
    >
      {/* Sun — visible in light mode */}
      <Sun className="h-4 w-4 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      {/* Moon — visible in dark mode */}
      <Moon className="absolute h-4 w-4 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
