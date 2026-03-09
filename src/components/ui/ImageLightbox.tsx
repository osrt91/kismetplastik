"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxImage {
  src?: string;
  alt: string;
  gradient?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  }),
};

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: ImageLightboxProps) {
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          setDirection(1);
          onNext();
          break;
        case "ArrowLeft":
          setDirection(-1);
          onPrev();
          break;
      }
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setDirection(1);
        onNext();
      } else {
        setDirection(-1);
        onPrev();
      }
    }
  }, [onNext, onPrev]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    onPrev();
  }, [onPrev]);

  const handleNext = useCallback(() => {
    setDirection(1);
    onNext();
  }, [onNext]);

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
          aria-label="Kapat"
        >
          <X size={22} />
        </button>

        {/* Image counter */}
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white sm:left-6"
            aria-label="Onceki"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white sm:right-6"
            aria-label="Sonraki"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Image area */}
        <div
          className="relative z-[1] mx-16 flex max-h-[80vh] max-w-5xl items-center justify-center overflow-hidden sm:mx-20"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex items-center justify-center"
            >
              {current.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-[80vh] max-w-full rounded-xl object-contain"
                  draggable={false}
                />
              ) : (
                <div
                  className={`flex h-[60vh] w-[80vw] max-w-4xl items-center justify-center rounded-2xl sm:h-[70vh] ${current.gradient || "bg-gradient-to-br from-primary-800 to-primary-600"}`}
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                      <svg
                        className="h-10 w-10 text-white/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-white/80">
                      {current.alt}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
