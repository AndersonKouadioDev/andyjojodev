import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  title: "Anderson Kouadio | Développeur Fullstack & IT Manager",
  description:
    "Développeur Fullstack & IT Manager basé à Abidjan, Côte d'Ivoire. Expert Next.js, NestJS, React Native, Spring Boot. 4+ ans, 10+ projets livrés.",
  keywords: [
    "Anderson Kouadio",
    "Développeur Fullstack",
    "IT Manager",
    "Next.js",
    "NestJS",
    "React Native",
    "Abidjan",
    "Côte d'Ivoire",
  ],
  authors: [{ name: "Anderson Kouadio" }],
  openGraph: {
    title: "Anderson Kouadio | Développeur Fullstack & IT Manager",
    description:
      "Développeur Fullstack & IT Manager. 4+ ans, 10+ projets livrés.",
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
