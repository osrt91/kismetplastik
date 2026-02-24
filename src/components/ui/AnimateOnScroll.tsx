"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import clsx from "clsx";

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "fade";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const animationStyles: Record<AnimationType, { from: string; to: string }> = {
  "fade-up": {
    from: "translate-y-8 opacity-0",
    to: "translate-y-0 opacity-100",
  },
  "fade-down": {
    from: "-translate-y-8 opacity-0",
    to: "translate-y-0 opacity-100",
  },
  "fade-left": {
    from: "translate-x-8 opacity-0",
    to: "translate-x-0 opacity-100",
  },
  "fade-right": {
    from: "-translate-x-8 opacity-0",
    to: "translate-x-0 opacity-100",
  },
  "zoom-in": {
    from: "scale-95 opacity-0",
    to: "scale-100 opacity-100",
  },
  fade: {
    from: "opacity-0",
    to: "opacity-100",
  },
};

export default function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className,
  threshold = 0.15,
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });
  const styles = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={clsx(
        "transition-all ease-out",
        isVisible ? styles.to : styles.from,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
