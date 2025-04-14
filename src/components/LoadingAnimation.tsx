
import { Book } from "lucide-react";

interface LoadingAnimationProps {
  message: string;
}

const LoadingAnimation = ({ message }: LoadingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="animate-bible-open">
          <Book className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-pulse-glow">
          <span className="w-8 h-8 bg-primary/20 rounded-full blur-md"></span>
        </div>
      </div>
      <p className="mt-6 text-lg text-center animate-pulse-glow">
        {message}
      </p>
      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
