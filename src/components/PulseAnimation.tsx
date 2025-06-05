
import { useState, useEffect } from "react";

interface PulseAnimationProps {
  color: string;
  isQuick?: boolean;
}

export const PulseAnimation = ({ color, isQuick = false }: PulseAnimationProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, isQuick ? 500 : 1500);

    return () => clearInterval(interval);
  }, [isQuick]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="absolute inset-0 rounded-lg">
        <div
          className="absolute inset-0 rounded-lg transition-opacity duration-500"
          style={{
            backgroundColor: color,
            opacity: isVisible ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
};
