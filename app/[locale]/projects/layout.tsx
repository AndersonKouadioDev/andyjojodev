import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "17 projets livrés par Anderson Kouadio : applications web, mobile, backoffice, immobilier, e-commerce. Next.js, React Native, NestJS, Spring Boot.",
  alternates: {
    canonical: `${siteConfig.url}/fr/projects`,
  },
  openGraph: {
    title: "Projets | Anderson Kouadio",
    description:
      "17 projets livrés — web, mobile, backoffice, immobilier, e-commerce.",
    url: `${siteConfig.url}/projects`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Projets — Anderson Kouadio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projets | Anderson Kouadio",
    description: "17 projets livrés — web, mobile, backoffice.",
    images: [siteConfig.ogImage],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
