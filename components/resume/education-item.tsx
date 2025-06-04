interface EducationItemProps {
  title: string;
  school: string;
  year: string;
}

export function EducationItem({ title, school, year }: EducationItemProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{school}</p>
      </div>
      <span className="text-primary font-medium text-sm mt-1 sm:mt-0">{year}</span>
    </div>
  );
}