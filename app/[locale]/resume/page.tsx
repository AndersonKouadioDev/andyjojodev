import { Resume } from "@/components/resume";
import { PDFDownloadButton } from "@/components/resume/pdf-download-button";
import { MainNav } from "@/components/navigation/main-nav";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      {/* Download bar */}
      <div className="sticky top-16 z-40 flex justify-end px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <PDFDownloadButton label="Télécharger le CV (PDF)" />
      </div>

      <Resume />
    </div>
  );
}
