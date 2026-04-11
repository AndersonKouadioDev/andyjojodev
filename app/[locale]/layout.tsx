import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { PageLoader } from "@/components/ui/page-loader";
import { FontLoader } from "@/components/font-loader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Anderson Kouadio | Développeur Fullstack & Tech Lead",
    template: "%s | Anderson Kouadio",
  },
  description:
    "Développeur Fullstack & Tech Lead basé à Abidjan, Côte d'Ivoire. Expert Next.js, NestJS, React Native, Spring Boot. 4+ ans, 10+ projets livrés.",
  keywords: [
    "Anderson Kouadio",
    "Développeur Fullstack",
    "Tech Lead",
    "Next.js",
    "NestJS",
    "React Native",
    "Spring Boot",
    "Abidjan",
    "Côte d'Ivoire",
    "portfolio développeur",
    "freelance développeur Abidjan",
  ],
  authors: [{ name: "Anderson Kouadio", url: siteConfig.url }],
  creator: "Anderson Kouadio",
  openGraph: {
    title: "Anderson Kouadio | Développeur Fullstack & Tech Lead",
    description:
      "Développeur Fullstack & Tech Lead basé à Abidjan. 4+ ans, 10+ projets livrés en Next.js, NestJS, React Native.",
    url: siteConfig.url,
    siteName: "Anderson Kouadio Portfolio",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Anderson Kouadio — Développeur Fullstack & Tech Lead",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anderson Kouadio | Développeur Fullstack & Tech Lead",
    description: "Développeur Fullstack & Tech Lead — Abidjan, Côte d'Ivoire.",
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className="grain-overlay">
      <head>
        {/* Preconnect for Clash Display (loaded async via FontLoader) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <FontLoader />
            <PageLoader />
            <main className="min-h-screen bg-background">{children}</main>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
