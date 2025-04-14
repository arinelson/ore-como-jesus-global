
import { useState } from "react";
import { ContextOption } from "@/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ContextSelectorProps {
  options: ContextOption[];
  selectedContext: string;
  customContext: string;
  onSelectContext: (contextId: string) => void;
  onCustomContextChange: (value: string) => void;
  translations: {
    contextSectionTitle: string;
    customContextLabel: string;
    customContextPlaceholder: string;
  };
  langCode: string;
}

const ContextSelector = ({
  options,
  selectedContext,
  customContext,
  onSelectContext,
  onCustomContextChange,
  translations,
  langCode
}: ContextSelectorProps) => {
  const [showCustomInput, setShowCustomInput] = useState(selectedContext === 'custom');

  const handleContextChange = (value: string) => {
    onSelectContext(value);
    setShowCustomInput(value === 'custom');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {translations.contextSectionTitle}
      </h2>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-2">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedContext === option.id
                ? "border-2 border-primary bg-primary/10"
                : "border border-gray-200 hover:border-primary/50"
            }`}
            onClick={() => handleContextChange(option.id)}
          >
            <div className="font-medium text-center">
              {option.translations[langCode] || option.label}
            </div>
          </Card>
        ))}
        
        <Card
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedContext === 'custom'
              ? "border-2 border-primary bg-primary/10"
              : "border border-gray-200 hover:border-primary/50"
          }`}
          onClick={() => handleContextChange('custom')}
        >
          <div className="font-medium text-center">
            {translations.customContextLabel}
          </div>
        </Card>
      </div>
      
      {showCustomInput && (
        <div className="mt-4">
          <Input
            value={customContext}
            onChange={(e) => onCustomContextChange(e.target.value)}
            placeholder={translations.customContextPlaceholder}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ContextSelector;
