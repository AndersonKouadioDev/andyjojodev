import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const locales = ["fr", "en"];
const routes = ["", "/projects", "/skills", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${siteConfig.url}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "monthly" : "yearly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
