import { getTranslations } from "next-intl/server";

export async function LanguagesInterestsSection() {
  const t = await getTranslations();
  const resumeSectionT = await getTranslations("resume_section");
  const languageT = await getTranslations("language");

  const keys = ["french", "english"];
  const langues = keys.map((key: string) => {
    return (
      <div className="text-muted-foreground">
        <span className="font-medium text-foreground">
          {languageT(`${key}.title`)} :
        </span>{" "}
        {languageT(`${key}.level`)}
      </div>
    );
  });
  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      <div className="flex-1">
        <h2 className="text-lg md:text-xl font-bold text-primary mb-4 pb-1.5 border-b border-border flex items-center gap-2">
          <span className="text-base">💬</span>
          {resumeSectionT("language")}
        </h2>
        <div className="flex gap-6">{langues}</div>
      </div>

      <div className="flex-2">
        <h2 className="text-lg md:text-xl font-bold text-primary mb-4 pb-1.5 border-b border-border flex items-center gap-2">
          <span className="text-base">🎯</span>
          {resumeSectionT("interests")}
        </h2>
        <p className="text-muted-foreground">{t("interests")} </p>
      </div>
    </div>
  );
}
