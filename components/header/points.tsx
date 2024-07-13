import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import styles from "@/components/header/animation.module.css";

interface PointsProps {
  pointsGained: number;
}

export function Points({ pointsGained }: PointsProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const id = setTimeout(() => {
      setAnimate(false);
    });

    return clearTimeout(id);
  }, [pointsGained]);

  if (!animate) return false;
  return (
    <h4
      className={cn(
        "text-2xl opacity-0 transition-all absolute top-[5%] left-full",
        animate && styles.scoreAnimation
      )}
    >
      +{pointsGained}
    </h4>
  );
}
