import { ExpertiseItem } from "./expertise-item";
import { getTranslations } from "next-intl/server";

export async function ExpertiseSection() {
  const expertiseT = await getTranslations("expertise");
  const keys = [
    "expertise_1",
    "expertise_2",
    "expertise_3",
    "expertise_4",
  ] as const;

  const expertise = keys.map((key) => ({
    title: expertiseT(`${key}.title`),
    description: expertiseT(`${key}.description`),
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {expertise.map((item, index) => (
        <ExpertiseItem
          key={index}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
}
