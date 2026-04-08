"use client";

import { LazyVideo } from "@/components/lazy-video";

// ---------------------------------------------------------------------------
// Replace these with your actual video paths in /public/videos/
// ---------------------------------------------------------------------------
const VIDEOS = [
  {
    src: "/videos/wedding-demo.mp4",
    poster: "/videos/posters/wedding-demo.jpg",
    title: "Elegant Wedding",
  },
  {
    src: "/videos/birthday-demo.mp4",
    poster: "/videos/posters/birthday-demo.jpg",
    title: "Birthday Celebration",
  },
  {
    src: "/videos/corporate-demo.mp4",
    poster: "/videos/posters/corporate-demo.jpg",
    title: "Corporate Event",
  },
  {
    src: "/videos/engagement-demo.mp4",
    poster: "/videos/posters/engagement-demo.jpg",
    title: "Engagement Party",
  },
];

export function VideoShowcase() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-center text-4xl font-bold gradient-text">
        Video Gallery
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
        Scroll down to see videos lazy-load as they enter the viewport.
        Each video only starts downloading when it&apos;s about to appear.
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {VIDEOS.map((video) => (
          <div key={video.src} className="space-y-3">
            <LazyVideo
              src={video.src}
              poster={video.poster}
              alt={video.title}
              aspectRatio="16/9"
              controls
              muted
              showPlayButton
            />
            <p className="text-sm font-medium text-foreground">
              {video.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
