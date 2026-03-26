"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Languages } from "@/types/languages";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  showFlags?: boolean;
  showName?: boolean;
  compact?: boolean;
  /**
   * "overlay" → inline pill switcher, always white,
   * designed for the dark fullscreen menu footer.
   */
  variant?: "default" | "overlay";
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  showFlags = true,
  showName = true,
  compact = false,
  variant = "default",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const languages: Languages = {
    en: { code: "en", name: "English", flag: "🇬🇧" },
    fr: { code: "fr", name: "Français", flag: "🇫🇷" },
  };

  const [open, setOpen] = useState(false);
  const currentLanguage =
    languages[currentLocale as keyof Languages] ?? languages.en;

  const handleLanguageChange = (code: string) => {
    if (languages[code]) {
      document.documentElement.lang = code;
      router.replace(pathname, { locale: code });
      setOpen(false);
    }
  };

  /* ── Overlay variant: two inline buttons FR / EN ── */
  if (variant === "overlay") {
    return (
      <div className="flex items-center gap-1">
        {Object.values(languages).map((lang, i) => {
          const isActive = lang.code === currentLocale;
          return (
            <React.Fragment key={lang.code}>
              {i > 0 && (
                <span className="text-foreground/20 font-mono-brand text-xs px-0.5">·</span>
              )}
              <button
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "font-mono-brand text-xs tracking-[0.2em] uppercase px-1 py-0.5 transition-colors duration-150 cursor-pointer",
                  isActive
                    ? "text-foreground"
                    : "text-foreground/30 hover:text-foreground/70"
                )}
              >
                {lang.code.toUpperCase()}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  /* ── Default dropdown variant ── */
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "icon" : "default"}
          className="flex items-center gap-2 text-sm"
        >
          {!showFlags && !showName && <Globe className="w-5 h-5" />}
          {showFlags && <span className="text-lg">{currentLanguage.flag}</span>}
          {showName && <span>{currentLanguage.name}</span>}
          <span className="ml-1">
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {Object.values(languages).map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2"
          >
            {showFlags && <span className="text-lg">{language.flag}</span>}
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
