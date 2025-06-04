interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  description: string[];
  isLast?: boolean;
}

export function ExperienceItem({ 
  title, 
  company, 
  period, 
  description,
  isLast = false
}: ExperienceItemProps) {
  return (
    <div className={`pb-4 ${!isLast ? 'border-b border-border/50' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between mb-2">
        <div>
          <h3 className="font-bold text-foreground text-base">{title}</h3>
          <p className="text-primary font-medium text-sm">{company}</p>
        </div>
        <span className="text-muted-foreground italic text-sm mt-1 sm:mt-0">{period}</span>
      </div>
      <ul className="mt-2 space-y-1">
        {description.map((item, index) => (
          <li key={index} className="text-muted-foreground pl-4 relative text-sm">
            <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary/70"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}