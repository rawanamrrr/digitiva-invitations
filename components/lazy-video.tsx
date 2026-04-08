"use client";

import { useCallback, useRef, useState, memo } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LazyVideoProps {
  /** Video source URL (local or Cloudinary) */
  src: string;
  /** Poster / thumbnail image URL shown before video loads */
  poster?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** CSS class for the outer wrapper */
  className?: string;
  /** Aspect ratio — used for the skeleton placeholder. Default: "16/9" */
  aspectRatio?: string;
  /** Autoplay when the video enters the viewport. Default: false */
  autoPlay?: boolean;
  /** Muted — required for autoplay in most browsers. Default: true */
  muted?: boolean;
  /** Loop playback. Default: false */
  loop?: boolean;
  /** Show native browser controls. Default: true */
  controls?: boolean;
  /** Preload hint after intersection: "none" | "metadata" | "auto". Default: "metadata" */
  preload?: "none" | "metadata" | "auto";
  /** Distance (rootMargin) before the element enters viewport to start loading. Default: "200px 0px" */
  rootMargin?: string;
  /** Show a play-button overlay before loading. Default: true */
  showPlayButton?: boolean;
  /** Custom MIME type for the <source> element */
  type?: string;
  /** Called when the video starts playing */
  onPlay?: () => void;
  /** Called when the video is paused */
  onPause?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Skeleton({ aspectRatio }: { aspectRatio: string }) {
  return (
    <div
      className="lazy-video__skeleton"
      style={{ aspectRatio }}
      aria-hidden="true"
    >
      {/* Spinning loader */}
      <div className="lazy-video__spinner" />
    </div>
  );
}

function PlayOverlay({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="lazy-video__play-overlay"
      onClick={onClick}
      aria-label="Play video"
    >
      <svg
        className="lazy-video__play-icon"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="36" cy="36" r="36" fill="rgba(0,0,0,0.55)" />
        <polygon points="30,24 52,36 30,48" fill="#fff" />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * LazyVideo — a reusable component that lazy-loads a video only when it
 * enters the viewport, shows a poster/thumbnail + play button overlay,
 * and displays a loading skeleton while the video buffers.
 *
 * Works with both local files and Cloudinary URLs.
 */
export const LazyVideo = memo(function LazyVideo({
  src,
  poster,
  alt = "Video",
  className = "",
  aspectRatio = "16/9",
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  preload = "metadata",
  rootMargin = "200px 0px",
  showPlayButton = true,
  type,
  onPlay,
  onPause,
}: LazyVideoProps) {
  // Intersection Observer — triggers when the wrapper scrolls into view
  const [wrapperRef, isInViewport] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    triggerOnce: true,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // ------ Handlers ------

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setHasStarted(true);
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handlePlayClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        // Autoplay blocked — user will use native controls
      });
    } else {
      video.pause();
    }
  }, []);

  // ------ Render ------

  const showOverlay = showPlayButton && !isPlaying && !autoPlay;

  return (
    <div
      ref={wrapperRef}
      className={`lazy-video ${className}`}
      style={{ aspectRatio }}
      role="region"
      aria-label={alt}
    >
      {/* Skeleton / spinner shown while loading */}
      {isInViewport && isLoading && <Skeleton aspectRatio={aspectRatio} />}

      {/* Poster image as background before video loads */}
      {poster && !hasStarted && (
        <div
          className="lazy-video__poster"
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden="true"
        />
      )}

      {/* Play button overlay */}
      {isInViewport && showOverlay && (
        <PlayOverlay onClick={handlePlayClick} />
      )}

      {/* Actual video element — only rendered after intersection */}
      {isInViewport && (
        <video
          ref={videoRef}
          className="lazy-video__video"
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          preload={preload}
          playsInline
          onCanPlay={handleCanPlay}
          onPlay={handlePlay}
          onPause={handlePause}
        >
          <source src={src} type={type || getMimeType(src)} />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMimeType(url: string): string {
  if (url.includes(".webm")) return "video/webm";
  if (url.includes(".ogv") || url.includes(".ogg")) return "video/ogg";
  return "video/mp4"; // default
}
