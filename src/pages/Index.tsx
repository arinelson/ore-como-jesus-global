
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
import { 
  hasReachedDailyLimit, 
  initUsageTracking, 
  incrementUsageCount, 
  getRemainingUsages,
  saveResult,
  getSavedLanguage
} from "@/utils/storage";
import { generateContent } from "@/utils/generateResult";

const Index = () => {
  // State for language
  const [langCode, setLangCode] = useState<string>("en");
  
  // State for content selection
  const [selectedContext, setSelectedContext] = useState<string>("");
  const [customContext, setCustomContext] = useState<string>("");
  const [contentType, setContentType] = useState<ContentType>("both");
  
  // State for generation flow
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<PrayerResult | null>(null);
  
  // State for usage limits
  const [remainingUsages, setRemainingUsages] = useState<number>(3);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  
  // Get context options and translations
  const contextOptions = getContextOptions();
  const t = getTranslation(langCode);

  // Initialize usage tracking and check saved language
  useEffect(() => {
    const initApp = async () => {
      await initUsageTracking();
      setRemainingUsages(getRemainingUsages());
      setLimitReached(hasReachedDailyLimit());
      
      // Check for saved language or detect from browser
      const savedLang = getSavedLanguage();
      if (savedLang) {
        setLangCode(savedLang);
      } else {
        const detectedLang = detectLanguage();
        setLangCode(detectedLang);
      }
    };
    
    initApp();
    
    // Log initialization
    console.log('App initialized, checking usage limits and language preferences');
  }, []);

  // Handle language change
  const handleLanguageChange = (newLangCode: string) => {
    setLangCode(newLangCode);
    console.log(`Language changed to: ${newLangCode}`);
  };

  // Get the actual context string to use
  const getContextString = (): string => {
    if (selectedContext === 'custom') {
      return customContext.trim();
    }
    
    const selectedOption = contextOptions.find(opt => opt.id === selectedContext);
    return selectedOption 
      ? (selectedOption.translations[langCode] || selectedOption.label) 
      : '';
  };

  // Handle generate button click
  const handleGenerate = async () => {
    if (hasReachedDailyLimit()) {
      setLimitReached(true);
      return;
    }
    
    const contextString = getContextString();
    if (!contextString) {
      // Here you could add an error message or toast notification
      return;
    }
    
    setIsGenerating(true);
    console.log(`Generating content for: ${contextString}, type: ${contentType}`);
    
    try {
      // Generate content
      const content = await generateContent(contextString, contentType, langCode);
      
      // Create result object
      const result: PrayerResult = {
        context: contextString,
        contentType,
        prayer: content.prayer,
        verses: content.verses,
        timestamp: Date.now()
      };
      
      // Save result
      saveResult(result);
      
      // Increment usage count
      incrementUsageCount();
      
      // Update state
      setGeneratedResult(result);
      setRemainingUsages(getRemainingUsages());
      setLimitReached(hasReachedDailyLimit());
      
      console.log('Content generated successfully');
    } catch (error) {
      console.error('Error generating content:', error);
      // Here you could add an error message or toast notification
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset to selection screen
  const handleBack = () => {
    setGeneratedResult(null);
  };

  // Determine if generate button should be disabled
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
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center">
        {!generatedResult ? (
          // Selection screen
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
          // Result display
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
