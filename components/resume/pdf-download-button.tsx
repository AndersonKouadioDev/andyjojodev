"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const CV_PATH = "/cv/CV_Anderson_KOUADIO.pdf";

export function PDFDownloadButton({ label = "Télécharger le CV", variant = "default" }: {
  label?: string;
  variant?: "default" | "outline" | "ghost";
}) {
  return (
    <Button
      variant={variant}
      className={
        variant === "default"
          ? "bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold rounded-xl"
          : "font-display font-semibold rounded-xl"
      }
      asChild
    >
      <a href={CV_PATH} download="CV_Anderson_KOUADIO.pdf" target="_blank" rel="noopener noreferrer">
        <Download className="mr-2 h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
