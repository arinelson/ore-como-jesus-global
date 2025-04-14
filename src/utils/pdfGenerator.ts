
import { PrayerResult } from "@/types";
import { jsPDF } from "jspdf";
import { getTranslation } from "./i18n";

export const generatePDF = (result: PrayerResult, langCode: string): void => {
  try {
    const t = getTranslation(langCode);
    const doc = new jsPDF();
    
    // Set font sizes
    const titleSize = 16;
    const headingSize = 14;
    const textSize = 12;
    
    // Set initial y position
    let y = 20;
    
    // Add title
    doc.setFontSize(titleSize);
    doc.setFont("helvetica", "bold");
    doc.text(t.siteTitle, 105, y, { align: "center" });
    y += 15;
    
    // Add context
    doc.setFontSize(headingSize);
    doc.text(result.context, 105, y, { align: "center" });
    y += 20;
    
    // Add prayer if available
    if (result.prayer) {
      doc.setFont("helvetica", "bold");
      doc.text(t.prayerSectionTitle, 20, y);
      y += 10;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(textSize);
      
      // Split long prayer text into multiple lines
      const splitPrayer = doc.splitTextToSize(result.prayer, 170);
      doc.text(splitPrayer, 20, y);
      y += (splitPrayer.length * 7) + 15;
    }
    
    // Add verses if available
    if (result.verses && result.verses.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(headingSize);
      doc.text(t.versesSectionTitle, 20, y);
      y += 10;
      
      doc.setFontSize(textSize);
      
      result.verses.forEach((verse) => {
        doc.setFont("helvetica", "normal");
        
        // Split long verse text into multiple lines
        const splitVerse = doc.splitTextToSize(verse.text, 170);
        doc.text(splitVerse, 20, y);
        y += (splitVerse.length * 7);
        
        doc.setFont("helvetica", "italic");
        doc.text(`- ${verse.reference}`, 20, y);
        y += 15;
      });
    }
    
    // Add footer with date
    const dateStr = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`${t.siteTitle} - ${dateStr}`, 105, 280, { align: "center" });
    
    // Generate file name
    const filename = `prayer-${result.context.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    console.log(`PDF saved: ${filename}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
