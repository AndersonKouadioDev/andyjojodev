"use client";

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

interface LanguageSwitcherProps {
  showFlags?: boolean;
  showName?: boolean;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  showFlags = true,
  showName = true,
  compact = false,
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
