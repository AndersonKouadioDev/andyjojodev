interface SkillCategoryProps {
  category: string;
  items: string[];
}

export function SkillCategory({ category, items }: SkillCategoryProps) {
  return (
    <div className="mb-4">
      <h4 className="font-bold text-foreground mb-2 text-sm">{category}</h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <span 
            key={index}
            className="bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary/90 px-2.5 py-1 rounded-full text-xs border border-primary/10 dark:border-primary/20 transition-colors hover:bg-primary/10"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}