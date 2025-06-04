import { MainNav } from "@/components/navigation/main-nav";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectVideo } from "@/components/projects/project-video";

export default function ProjectsPage() {
  const projects = [
    {
      title: "ERP Immobilier",
      description: "Application de gestion immobilière avec React et Laravel",
      image: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg",
      tags: ["React", "Laravel", "PostgreSQL"],
      link: "https://github.com/AndersonKouadioDev"
    },
    {
      title: "Tropic105 ERP",
      description: "Système de gestion d'entreprise avec React et Django",
      image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg",
      tags: ["React", "Django", "Zustand"],
      link: "https://github.com/AndersonKouadioDev"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <MainNav />
      <div className="max-w-6xl mx-auto mt-20">
        <h1 className="text-4xl font-bold text-primary mb-8">Mes Projets</h1>
        
        <ProjectVideo />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
}