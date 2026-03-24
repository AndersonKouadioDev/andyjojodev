import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anderson Kouadio | Tech Lead & Fullstack Developer",
  description:
    "Tech Lead & Développeur Fullstack Web & Mobile basé à Abidjan, Côte d'Ivoire. Expert Next.js, NestJS, React Native, Spring Boot. 5+ ans, 10+ projets livrés.",
  keywords: [
    "Anderson Kouadio",
    "Tech Lead",
    "Fullstack Developer",
    "Next.js",
    "NestJS",
    "React Native",
    "Abidjan",
    "Côte d'Ivoire",
  ],
  authors: [{ name: "Anderson Kouadio" }],
  openGraph: {
    title: "Anderson Kouadio | Tech Lead & Fullstack Developer",
    description:
      "Tech Lead & Développeur Fullstack Web & Mobile. 5+ ans, 10+ projets livrés.",
    type: "website",
    locale: "fr_FR",
  },
};

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
        {/* Fonts */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <main className="min-h-screen bg-background">{children}</main>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
