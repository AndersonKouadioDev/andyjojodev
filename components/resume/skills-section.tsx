import { SkillCategory } from "./skill-category";

export function SkillsSection() {
  const skills = [
    {
      category: "Langages",
      items: [
        "HTML/CSS",
        "JavaScript (ES6+)",
        "TypeScript",
        "PHP",
        "Python",
        "Rust",
      ],
    },
    {
      category: "Front-end",
      items: [
        "ReactJS",
        "Next.js",
        "Tailwind CSS",
        "Zustand/Redux",
        "PWA",
        "Hero UI",
        "Framer Motion",
        "React Hook Form",
        "React Query",
        "Electron",
      ],
    },
    {
      category: "Mobile",
      items: ["React Native", "Expo"],
    },
    {
      category: "Back-end",
      items: [
        "NestJS",
        "Laravel",
        "Django",
        "Rust",
        "MySQL/PostgreSQL/MongoDB",
        "Redis",
        "API REST/WebSocket",
        "Microservices",
      ],
    },
    {
      category: "DevOps & Test",
      items: [
        "Git",
        "GitLab/GitHub",
        "Docker",
        "CI/CD",
        "Jest",
        "React Testing Library",
        "GitHub Actions",
      ],
    },
    {
      category: "UX/UI",
      items: [
        "Figma",
        "Design System",
        "Prototypage",
        "Accessibilité",
        "Storybook",
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {skills.map((skill, index) => (
        <SkillCategory
          key={index}
          category={skill.category}
          items={skill.items}
        />
      ))}
    </div>
  );
}
