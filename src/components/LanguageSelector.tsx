
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Globe } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { languages, saveLanguage } from "@/utils/i18n";

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (langCode: string) => void;
}

const LanguageSelector = ({ currentLang, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  // Find out the width dynamically based on the current language name
  const [buttonWidth, setButtonWidth] = useState<number>(180);

  useEffect(() => {
    // Calculate approximate width based on language name length
    const width = Math.max(180, (currentLanguage.nativeName.length * 10) + 70);
    setButtonWidth(width);
  }, [currentLanguage]);

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode);
    saveLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center justify-between gap-2 bg-white/90 border-gray-200 hover:bg-gray-50"
          style={{ width: `${buttonWidth}px` }}
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.nativeName}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[260px] max-h-[400px] overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`flex items-center justify-between ${
              lang.code === currentLang ? "bg-muted" : ""
            }`}
            onClick={() => handleLanguageSelect(lang.code)}
          >
            <span>
              {lang.nativeName} 
              <span className="ml-2 text-muted-foreground text-xs">
                ({lang.name})
              </span>
            </span>
            {lang.code === currentLang && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
