import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { detectLanguage, getContextOptions, getTranslation } from "@/utils/i18n";
import { ContentType, PrayerResult } from "@/types";
import ContextSelector from "@/components/ContextSelector";
import ContentTypeSelector from "@/components/ContentTypeSelector";
import LoadingAnimation from "@/components/LoadingAnimation";
import ResultDisplay from "@/components/ResultDisplay";
import LanguageSelector from "@/components/LanguageSelector";
import LimitReachedMessage from "@/components/LimitReachedMessage";
import PrayerSizeSelector from "@/components/PrayerSizeSelector";
import { 
  hasReachedDailyLimit, 
  initUsageTracking, 
  incrementUsageCount, 
  getRemainingUsages,
  saveResult,
  getSavedLanguage
} from "@/utils/storage";
import { generateContent } from "@/utils/generateResult";
import { PrayerSize } from "@/types";

const Index = () => {
  const [langCode, setLangCode] = useState<string>("en");
  const [selectedContext, setSelectedContext] = useState<string>("");
  const [customContext, setCustomContext] = useState<string>("");
  const [contentType, setContentType] = useState<ContentType>("both");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<PrayerResult | null>(null);
  const [remainingUsages, setRemainingUsages] = useState<number>(3);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [prayerSize, setPrayerSize] = useState<PrayerSize>("medium");

  const contextOptions = getContextOptions();
  const t = getTranslation(langCode);

  useEffect(() => {
    const initApp = async () => {
      await initUsageTracking();
      setRemainingUsages(getRemainingUsages());
      setLimitReached(hasReachedDailyLimit());
      
      const savedLang = getSavedLanguage();
      if (savedLang) {
        setLangCode(savedLang);
      } else {
        const detectedLang = detectLanguage();
        setLangCode(detectedLang);
      }
    };
    
    initApp();
    
    console.log('App initialized, checking usage limits and language preferences');
  }, []);

  const handleLanguageChange = (newLangCode: string) => {
    setLangCode(newLangCode);
    console.log(`Language changed to: ${newLangCode}`);
  };

  const getContextString = (): string => {
    if (selectedContext === 'custom') {
      return customContext.trim();
    }
    
    const selectedOption = contextOptions.find(opt => opt.id === selectedContext);
    return selectedOption 
      ? (selectedOption.translations[langCode] || selectedOption.label) 
      : '';
  };

  const handleGenerate = async () => {
    if (hasReachedDailyLimit()) {
      setLimitReached(true);
      return;
    }
    
    const contextString = getContextString();
    if (!contextString) {
      return;
    }
    
    setIsGenerating(true);
    console.log(`Generating content for: ${contextString}, type: ${contentType}, size: ${prayerSize}`);
    
    try {
      const content = await generateContent(contextString, contentType, langCode, contentType === 'prayer' || contentType === 'both' ? prayerSize : undefined);
      
      const result: PrayerResult = {
        context: contextString,
        contentType,
        prayer: content.prayer,
        verses: content.verses,
        prayerSize: contentType === 'prayer' || contentType === 'both' ? prayerSize : undefined,
        timestamp: Date.now()
      };
      
      saveResult(result);
      incrementUsageCount();
      setGeneratedResult(result);
      setRemainingUsages(getRemainingUsages());
      setLimitReached(hasReachedDailyLimit());
      
      console.log('Content generated successfully');
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    setGeneratedResult(null);
  };

  const isGenerateDisabled = 
    !selectedContext || 
    (selectedContext === 'custom' && !customContext.trim()) ||
    limitReached;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-center flex-1">{t.siteTitle}</h1>
        <LanguageSelector 
          currentLang={langCode} 
          onLanguageChange={handleLanguageChange} 
        />
      </header>
      
      <main className="flex-1 flex flex-col items-center">
        {!generatedResult ? (
          <>
            {limitReached ? (
              <LimitReachedMessage translations={t} />
            ) : (
              <>
                <p className="text-center text-gray-600 mb-8 max-w-md">
                  {t.subtitle}
                </p>
                
                {isGenerating ? (
                  <LoadingAnimation message={t.loadingMessage} />
                ) : (
                  <>
                    <ContextSelector
                      options={contextOptions}
                      selectedContext={selectedContext}
                      customContext={customContext}
                      onSelectContext={setSelectedContext}
                      onCustomContextChange={setCustomContext}
                      translations={t}
                      langCode={langCode}
                    />
                    
                    <ContentTypeSelector
                      selected={contentType}
                      onSelect={setContentType}
                      translations={t}
                    />
                    
                    {(contentType === 'prayer' || contentType === 'both') && (
                      <PrayerSizeSelector
                        selected={prayerSize}
                        onSelect={setPrayerSize}
                        translations={t}
                      />
                    )}
                    
                    <div className="mt-10 w-full max-w-md">
                      <Button
                        className="w-full py-6 text-lg"
                        disabled={isGenerateDisabled}
                        onClick={handleGenerate}
                      >
                        {t.generateButton}
                      </Button>
                      
                      {!limitReached && (
                        <p className="text-center text-sm text-gray-500 mt-4">
                          {t.remainingTitle} {remainingUsages}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <ResultDisplay 
            result={generatedResult} 
            onBack={handleBack} 
            translations={t}
            langCode={langCode}
          />
        )}
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Ore Como Jesus</p>
      </footer>
    </div>
  );
};

export default Index;
