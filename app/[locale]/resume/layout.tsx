import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum Vitae d'Anderson Kouadio — Développeur Fullstack & Tech Lead. 4+ ans d'expérience, 10+ projets livrés. Téléchargeable en PDF.",
  alternates: {
    canonical: `${siteConfig.url}/fr/resume`,
  },
  openGraph: {
    title: "CV | Anderson Kouadio",
    description: "CV d'Anderson Kouadio — Développeur Fullstack & Tech Lead, Abidjan.",
    url: `${siteConfig.url}/resume`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "CV Anderson Kouadio" }],
  },
};

export const revalidate = 86400;

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
