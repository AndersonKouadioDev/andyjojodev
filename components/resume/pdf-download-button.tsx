"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export function PDFDownloadButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  // const generatePDF = async () => {
  //   setIsGenerating(true);
  //   try {
  //     // Dynamically import the html2pdf library
  //     const html2pdf = (await import('html2pdf.js')).default;
      
  //     // Get the resume container
  //     const element = document.querySelector('.print-content') || document.body;
      
  //     const opt = {
  //       margin: [15, 15, 15, 15],
  //       filename: 'anderson_kouadio_cv.pdf',
  //       image: { type: 'jpeg', quality: 0.98 },
  //       html2canvas: { scale: 2, useCORS: true },
  //       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //     };
      
  //     // Generate PDF
  //     await html2pdf().from(element).set(opt).save();
      
  //     toast("PDF téléchargé avec succès");
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     toast("Une erreur s'est produite lors de la génération du PDF.", {
  //       duration: 5000,
  //     });
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  return (
    <Button 
      // onClick={generatePDF} 
      disabled={isGenerating}
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Génération en cours...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Télécharger en PDF
        </>
      )}
    </Button>
  );
}