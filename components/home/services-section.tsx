"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Smartphone, Server, Users, Pen, Wrench } from "lucide-react";
import { PerspectiveCard } from "@/components/ui/perspective-card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Globe, Smartphone, Server, Users, Pen, Wrench];

export interface Service {
  title: string;
  description: string;
}

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const t = useTranslations("services_section");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".service-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16">
          <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
            — {t("eyebrow")}
          </span>
          <h2 className="font-display text-section text-foreground">
            {t("title_1")} <span className="text-primary">{t("title_2")}</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const Icon = ICONS[i] ?? Globe;
            return (
              <PerspectiveCard
                key={i}
                className="service-card glass rounded-2xl p-8 border border-border/25 hover:border-primary/25 group cursor-default"
                intensity={8}
              >
                <div className="flex flex-col gap-5">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-primary/10 text-primary",
                      "group-hover:bg-primary group-hover:text-primary-foreground",
                      "transition-all duration-300"
                    )}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Index */}
                  <span className="font-mono-brand text-xs text-muted-foreground/40">
                    0{i + 1}
                  </span>

                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {service.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </PerspectiveCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
