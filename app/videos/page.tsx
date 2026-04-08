import { VideoShowcase } from "./video-showcase";

export const metadata = {
  title: "Video Gallery | Digitiva",
  description: "Browse our collection of beautifully crafted digital invitation videos.",
};

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-background">
      <VideoShowcase />
    </main>
  );
}
