import { ExperienceItem } from "./experience-item";
import { getTranslations } from "next-intl/server";

export async function ExperienceSection() {
  const t = await getTranslations("professional_experience");
  const keys = [
    "experience_0",
    "experience_1",
    "experience_2",
    "experience_3",
    "experience_4",
    "experience_5",
  ] as const;

  const experiences = keys.map((key) => ({
    title: t(`${key}.title`),
    company: t(`${key}.company`),
    period: t(`${key}.period`),
    description: t(`${key}.description`)
      .split("<br/>")
      .map((item) => item.trim()),
  }));

  return (
    <div className="space-y-5">
      {experiences.map((experience, index) => (
        <ExperienceItem
          key={index}
          title={experience.title}
          company={experience.company}
          period={experience.period}
          description={experience.description}
          isLast={index === experiences.length - 1}
        />
      ))}
    </div>
  );
}
