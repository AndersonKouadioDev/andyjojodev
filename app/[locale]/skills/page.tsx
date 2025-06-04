import { MainNav } from "@/components/navigation/main-nav";
import { SkillsSection } from "@/components/resume/skills-section";
import { ExpertiseSection } from "@/components/resume/expertise-section";

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <MainNav />
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-4xl font-bold text-primary mb-8">Compétences & Expertise</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Compétences Techniques</h2>
            <SkillsSection />
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-6">Domaines d'Expertise</h2>
            <ExpertiseSection />
          </section>
        </div>
      </div>
    </div>
  );
}