interface ExpertiseItemProps {
  title: string;
  description: string;
}

export function ExpertiseItem({ title, description }: ExpertiseItemProps) {
  return (
    <div className="p-3 bg-secondary/50 dark:bg-secondary/30 rounded-md border-l-4 border-primary/70 hover:bg-secondary/70 transition-colors">
      <h4 className="text-foreground text-sm font-medium mb-1">{title}</h4>
      <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
    </div>
  );
}