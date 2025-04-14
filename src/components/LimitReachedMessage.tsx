
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface LimitReachedMessageProps {
  translations: {
    limitReachedTitle: string;
    limitReachedMessage: string;
  };
}

const LimitReachedMessage = ({ translations }: LimitReachedMessageProps) => {
  return (
    <Card className="w-full max-w-md mx-auto p-6 text-center">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">{translations.limitReachedTitle}</h2>
        <p className="text-gray-600">
          {translations.limitReachedMessage}
        </p>
      </div>
    </Card>
  );
};

export default LimitReachedMessage;
