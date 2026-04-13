"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Smartphone, Server, Users, Pen, Wrench, ArrowRight } from "lucide-react";
import { PerspectiveCard } from "@/components/ui/perspective-card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_META = [
  { icon: Globe,      color: "#34d399" }, // web
  { icon: Smartphone, color: "#60a5fa" }, // mobile
  { icon: Server,     color: "#fb923c" }, // backend
  { icon: Users,      color: "#FF4D00" }, // lead
  { icon: Pen,        color: "#c084fc" }, // design
  { icon: Wrench,     color: "#22d3ee" }, // devops
];

export interface Service {
  title: string;
  description: string;
}

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const t = useTranslations("services_section");
  const ctaT = useTranslations("contact_cta");
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
            const meta = SERVICE_META[i] ?? SERVICE_META[0];
            const Icon = meta.icon;
            const accent = meta.color;
            return (
              <PerspectiveCard
                key={i}
                className="service-card glass rounded-2xl p-8 border border-border/25 hover:border-border/50 group cursor-default"
                intensity={8}
              >
                <div
                  className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: accent }}
                />
                <div className="flex flex-col gap-5">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "transition-all duration-300"
                    )}
                    style={{
                      backgroundColor: `${accent}15`,
                      color: accent,
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Index */}
                  <span className="font-mono-brand text-xs text-muted-foreground/40">
                    0{i + 1}
                  </span>

                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-foreground transition-colors duration-200">
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

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/contact"
            className={cn(
              "group inline-flex items-center gap-3 px-8 py-4 rounded-full",
              "bg-primary text-primary-foreground font-semibold text-sm",
              "hover:bg-primary/90 transition-all duration-300",
              "hover:shadow-lg hover:shadow-primary/20"
            )}
          >
            {ctaT("cta_start")}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
