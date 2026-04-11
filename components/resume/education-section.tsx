import { EducationItem } from "./education-item";
import { getTranslations } from "next-intl/server";

export async function EducationSection() {
  const educationT = await getTranslations("education");

  const keys = ["diploma_1", "diploma_2", "diploma_3", "diploma_4", "diploma_5"] as const;

  const education = keys.map((key) => ({
    title: educationT(`${key}.title`),
    school: educationT(`${key}.school`),
    year: educationT(`${key}.year`),
  }));

  return (
    <div className="space-y-3">
      {education.map((item, index) => (
        <EducationItem
          key={index}
          title={item.title}
          school={item.school}
          year={item.year}
        />
      ))}
    </div>
  );
}
