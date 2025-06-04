import { ReactNode } from 'react';

interface ResumeContainerProps {
  children: ReactNode;
}

export function ResumeContainer({ children }: ResumeContainerProps) {
  return (
    <div className="w-full max-w-[210mm] bg-white dark:bg-card shadow-lg rounded-lg print:shadow-none print:rounded-none transition-all print-content">
      <div className="p-8 md:p-12 print:p-[15mm]">
        {children}
      </div>
    </div>
  );
}