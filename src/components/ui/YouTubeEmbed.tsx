"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function YouTubeEmbed({
  videoId,
  title,
  className,
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePlay();
      }
    },
    [handlePlay]
  );

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-neutral-900 aspect-video",
        className
      )}
    >
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={`${title} videosunu oynat`}
          onClick={handlePlay}
          onKeyDown={handleKeyDown}
          className="group absolute inset-0 flex cursor-pointer items-center justify-center"
        >
          {/* Thumbnail */}
          {isVisible && (
            <>
              {!thumbnailLoaded && (
                <div className="absolute inset-0 animate-pulse bg-neutral-800" />
              )}
              <img
                src={thumbnailUrl}
                alt={title}
                loading="lazy"
                onLoad={() => setThumbnailLoaded(true)}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                  thumbnailLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            </>
          )}

          {/* Loading placeholder when not in viewport */}
          {!isVisible && (
            <div className="absolute inset-0 bg-neutral-800" />
          )}

          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />

          {/* Play button */}
          <div
            className={cn(
              "relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#F59E0B] shadow-lg transition-transform duration-300 group-hover:scale-110 group-active:scale-95",
              "sm:h-20 sm:w-20"
            )}
          >
            <Play
              className="ml-1 h-7 w-7 fill-white text-white sm:h-8 sm:w-8"
              strokeWidth={0}
            />
          </div>
        </div>
      )}
    </div>
  );
}
