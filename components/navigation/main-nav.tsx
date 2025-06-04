"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "../language-switcher";

const routes = () => {
  const navigationT = useTranslations("navigation");

  const routes = [
    {
      label: navigationT("resume"),
      href: "/",
    },
    {
      label: navigationT("projects"),
      href: "/projects",
    },
    {
      label: navigationT("skills"),
      href: "/skills",
    },
    {
      label: navigationT("contact"),
      href: "/contact",
    },
  ];

  return routes;
};

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 right-4 z-50 print:hidden flex items-center gap-4">
      <div className="hidden md:flex items-center gap-6">
        <LanguageSwitcher />
        {routes().map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === route.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
        <ThemeToggle />
      </div>

      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col gap-4 mt-4">
            {routes().map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
