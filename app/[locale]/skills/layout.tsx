import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compétences",
  description:
    "Compétences techniques d'Anderson Kouadio : Next.js, TypeScript, NestJS, Spring Boot, React Native, Flutter, Docker, PostgreSQL — 4+ ans d'expérience.",
  alternates: {
    canonical: `${siteConfig.url}/fr/skills`,
  },
  openGraph: {
    title: "Compétences | Anderson Kouadio",
    description:
      "Frontend, Backend, Mobile, DevOps — stack complet maîtrisé.",
    url: `${siteConfig.url}/skills`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Compétences — Anderson Kouadio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compétences | Anderson Kouadio",
    description: "Stack complet : Next.js, NestJS, React Native, Docker.",
    images: [siteConfig.ogImage],
  },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
