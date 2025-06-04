import { ReactNode } from 'react';

interface ResumeSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export function ResumeSection({ title, icon, children }: ResumeSectionProps) {
  return (
    <section className="mb-6 md:mb-8 animate-fadeIn">
      <h2 className="text-lg md:text-xl font-bold text-primary mb-4 pb-1.5 border-b border-border flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        {title}
      </h2>
      <div className="text-foreground">
        {children}
      </div>
    </section>
  );
}