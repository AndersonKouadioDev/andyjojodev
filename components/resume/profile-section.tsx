import { getTranslations } from "next-intl/server";

export async function ProfileSection() {
  const t = await getTranslations();
  return (
    <p className="text-justify leading-relaxed text-muted-foreground">
      {t("resume.biography")}
    </p>
  );
}
