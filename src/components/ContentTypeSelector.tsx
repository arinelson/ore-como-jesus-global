
import { ContentType } from "@/types";
import { Card } from "@/components/ui/card";
import { Book, FileText, BookText } from "lucide-react";

interface ContentTypeSelectorProps {
  selected: ContentType;
  onSelect: (type: ContentType) => void;
  translations: {
    contentTypeLabel: string;
    prayerOption: string;
    versesOption: string;
    bothOption: string;
  };
}

const ContentTypeSelector = ({ 
  selected, 
  onSelect,
  translations
}: ContentTypeSelectorProps) => {
  const options: { type: ContentType; label: string; icon: React.ReactNode }[] = [
    {
      type: "prayer",
      label: translations.prayerOption,
      icon: <FileText className="h-10 w-10 mb-2 text-primary" />,
    },
    {
      type: "verses",
      label: translations.versesOption,
      icon: <Book className="h-10 w-10 mb-2 text-primary" />,
    },
    {
      type: "both",
      label: translations.bothOption,
      icon: <BookText className="h-10 w-10 mb-2 text-primary" />,
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {translations.contentTypeLabel}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <Card
            key={option.type}
            className={`p-4 cursor-pointer transition-all hover:shadow-md flex flex-col items-center ${
              selected === option.type
                ? "border-2 border-primary bg-primary/10"
                : "border border-gray-200 hover:border-primary/50"
            }`}
            onClick={() => onSelect(option.type)}
          >
            {option.icon}
            <div className="font-medium text-center">{option.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentTypeSelector;
