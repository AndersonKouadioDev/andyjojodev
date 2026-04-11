import { MainNav } from "@/components/navigation/main-nav";
import { HeroSection } from "@/components/home/hero-section";
import { MarqueeSection } from "@/components/home/marquee-section";
import { AboutSection } from "@/components/home/about-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { StackSection } from "@/components/home/stack-section";
import { ProjectsShowcase } from "@/components/home/projects-showcase";
import { SofaSection, HotspotService } from "@/components/home/sofa-section";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollPath } from "@/components/ui/scroll-path";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("resume");
  const expT = await getTranslations("professional_experience");
  const statsT = await getTranslations("stats");
  const servicesT = await getTranslations("services");
  const projectsT = await getTranslations("projects");

  // Experiences
  const expKeys = ["experience_0", "experience_1", "experience_2", "experience_3", "experience_4", "experience_5"] as const;
  const experiences = expKeys.map((key, i) => ({
    title: expT(`${key}.title`),
    company: expT(`${key}.company`),
    period: expT(`${key}.period`),
    description: expT(`${key}.description`).split("<br/>").map((s) => s.trim()),
    isLatest: i === 0,
  }));

  // Stats
  const stats = [
    { value: 4, suffix: "+", label: statsT("years_label") },
    { value: 10, suffix: "+", label: statsT("projects_label") },
    { value: 10, suffix: "", label: statsT("devs_label") },
    { value: 3, suffix: "", label: statsT("sectors_label") },
  ];

  // Services → 6 hotspots sofa
  const serviceKeys = ["service_1", "service_2", "service_3", "service_4", "service_5", "service_6"] as const;
  const serviceCategories = ["web", "mobile", "backend", "lead", "design", "devops"];
  const sofaServices: HotspotService[] = serviceKeys.map((key, i) => ({
    title: servicesT(`${key}.title`),
    description: servicesT(`${key}.description`),
    category: serviceCategories[i],
  }));

  // Projects
  const projectKeys = [
    "project_1", "project_2", "project_3", "project_4", "project_5",
    "project_6", "project_7", "project_8", "project_9", "project_10",
    "project_11", "project_12", "project_13", "project_14", "project_15",
    "project_16", "project_17",
  ] as const;
  const projects = projectKeys.map((key) => ({
    title: projectsT(`${key}.title`),
    description: projectsT(`${key}.description`),
    sector: projectsT(`${key}.sector`),
    type: projectsT(`${key}.type`),
    role: projectsT(`${key}.role`),
    tags: projectsT(`${key}.tags`).split("|"),
    category: projectsT(`${key}.category`),
    placeholder_image: projectsT(`${key}.placeholder_image`),
    live_url: projectsT(`${key}.live_url`),
    github_url: projectsT(`${key}.github_url`),
  }));

  return (
    <div className="relative min-h-screen bg-background cursor-none-desktop overflow-x-hidden">
      <ScrollPath />
      <CustomCursor />
      <MainNav />

      {/* 1 — Hero */}
      <HeroSection
        name={t("name")}
        title={t("title")}
        location={t("location")}
        github={t("github")}
        linkedin={t("linkedIn")}
      />

      {/* 2 — Marquee */}
      <MarqueeSection />

      {/* 3 — About */}
      <AboutSection biography={t("biography")} stats={stats} />

      {/* 4 — Experience */}
      <ExperienceSection experiences={experiences} />

      {/* 5 — Stack */}
      <StackSection />

      {/* 6 — Projects showcase */}
      <ProjectsShowcase projects={projects} />

      {/* 7 — Sofa immersif (services) */}
      <SofaSection services={sofaServices} />

      {/* 8 — Contact CTA */}
      <ContactCtaSection
        email={t("email")}
        linkedin={t("linkedIn")}
        github={t("github")}
      />
    </div>
  );
}
