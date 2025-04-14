
import { useState } from "react";
import { PrayerResult } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { generatePDF } from "@/utils/pdfGenerator";
import { Translations } from "@/types";

interface ResultDisplayProps {
  result: PrayerResult;
  onBack: () => void;
  translations: Translations;
  langCode: string;
}

const ResultDisplay = ({ result, onBack, translations, langCode }: ResultDisplayProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleDownloadPDF = () => {
    generatePDF(result, langCode);
  };

  const handleShareWhatsApp = () => {
    setIsSharing(true);
    
    let message = `*${result.context}*\n\n`;
    
    if (result.prayer) {
      message += `*${translations.prayerSectionTitle}:*\n${result.prayer}\n\n`;
    }
    
    if (result.verses && result.verses.length > 0) {
      message += `*${translations.versesSectionTitle}:*\n`;
      result.verses.forEach((verse) => {
        message += `"${verse.text}" - ${verse.reference}\n\n`;
      });
    }
    
    message += `${window.location.origin}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setTimeout(() => setIsSharing(false), 1000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          {translations.backButton}
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShareWhatsApp}
            disabled={isSharing}
          >
            <Share2 className="h-4 w-4" />
            {isSharing ? "..." : translations.shareButton}
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4" />
            {translations.downloadButton}
          </Button>
        </div>
      </div>
      
      <Card className="p-8 mb-6 bible-paper">
        <h1 className="text-2xl font-bold text-center mb-6">{result.context}</h1>
        
        {result.prayer && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{translations.prayerSectionTitle}</h2>
            <p className="text-lg leading-relaxed">{result.prayer}</p>
          </div>
        )}
        
        {result.verses && result.verses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">{translations.versesSectionTitle}</h2>
            <div className="space-y-4">
              {result.verses.map((verse, index) => (
                <div key={index} className="py-2">
                  <p className="text-lg leading-relaxed mb-1">"{verse.text}"</p>
                  <p className="verse-reference">— {verse.reference}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResultDisplay;
