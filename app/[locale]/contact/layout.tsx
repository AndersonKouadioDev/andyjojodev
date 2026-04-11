import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter Anderson Kouadio via WhatsApp pour un projet freelance, une mission, ou une collaboration. Disponible immédiatement.",
  alternates: {
    canonical: `${siteConfig.url}/fr/contact`,
  },
  openGraph: {
    title: "Contact | Anderson Kouadio",
    description:
      "Disponible pour missions freelance, opportunités full-time, collaborations. Contactez via WhatsApp.",
    url: `${siteConfig.url}/contact`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Contact — Anderson Kouadio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Anderson Kouadio",
    description: "Disponible immédiatement — contactez via WhatsApp.",
    images: [siteConfig.ogImage],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
