import { ResumeContainer } from "./resume-container";
import { ResumeHeader } from "./resume-header";
import { ResumeSection } from "./resume-section";
import { ProfileSection } from "./profile-section";
import { SkillsSection } from "./skills-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { ExpertiseSection } from "./expertise-section";
import { LanguagesInterestsSection } from "./languages-interests-section";
import { getTranslations } from "next-intl/server";

export async function Resume() {
  const resumeT = await getTranslations("resume");
  const resumeSectionT = await getTranslations("resume_section");

  return (
    <div className="flex flex-col items-center py-10 px-4 md:py-16">
      <ResumeContainer>
        <ResumeHeader
          name={resumeT("name")}
          title={resumeT("title")}
          location={resumeT("location")}
          email={resumeT("email")}
          phone={resumeT("phone")}
          linkedIn={resumeT("linkedIn")}
          github={resumeT("github")}
        />

        <ResumeSection title={resumeSectionT("professional_profile")} icon="👤">
          <ProfileSection />
        </ResumeSection>

        <ResumeSection title={resumeSectionT("technical_skills")} icon="🛠">
          <SkillsSection />
        </ResumeSection>

        <ResumeSection
          title={resumeSectionT("professional_experience")}
          icon="💼"
        >
          <ExperienceSection />
        </ResumeSection>

        <ResumeSection title={resumeSectionT("education")} icon="🎓">
          <EducationSection />
        </ResumeSection>

        <ResumeSection title={resumeSectionT("key_expertise")} icon="🔍">
          <ExpertiseSection />
        </ResumeSection>

        <LanguagesInterestsSection />
      </ResumeContainer>
    </div>
  );
}
