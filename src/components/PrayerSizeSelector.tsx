
import { PrayerSize } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PrayerSizeSelectorProps {
  selected: PrayerSize;
  onSelect: (size: PrayerSize) => void;
  translations: {
    prayerSizeLabel: string;
    smallPrayer: string;
    mediumPrayer: string;
    largePrayer: string;
  };
}

const PrayerSizeSelector = ({ 
  selected, 
  onSelect,
  translations 
}: PrayerSizeSelectorProps) => {
  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {translations.prayerSizeLabel}
      </h2>
      <RadioGroup
        value={selected}
        onValueChange={(value) => onSelect(value as PrayerSize)}
        className="grid grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem value="small" id="small" className="peer sr-only" />
          <Label
            htmlFor="small"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            {translations.smallPrayer}
          </Label>
        </div>
        <div>
          <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
          <Label
            htmlFor="medium"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            {translations.mediumPrayer}
          </Label>
        </div>
        <div>
          <RadioGroupItem value="large" id="large" className="peer sr-only" />
          <Label
            htmlFor="large"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            {translations.largePrayer}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PrayerSizeSelector;
