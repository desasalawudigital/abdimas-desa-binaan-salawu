import React from "react";
import fs from "fs";
import path from "path";

const getYoutubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

import { getSettings } from "@/lib/db";

export default async function VideoSection() {
  let heroVideoType = "none";
  let heroVideoUrl = "";
  try {
    const settingsData = await getSettings();
    heroVideoType = settingsData?.hero_video_type || "none";
    heroVideoUrl = settingsData?.hero_video_url || "";
  } catch (e) {
    console.error("Failed to load settings for video section:", e);
  }

  if (heroVideoType === "none" || !heroVideoUrl) {
    return null; // Don't render anything if no video is set
  }

  const youtubeId = heroVideoType === "youtube" ? getYoutubeVideoId(heroVideoUrl) : null;

  if (heroVideoType === "youtube" && !youtubeId) {
    return null; // Invalid youtube url
  }

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] overflow-hidden bg-black flex items-center justify-center">
      {heroVideoType === "local" && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-100"
        >
          <source src={heroVideoUrl} type={heroVideoUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      )}

      {heroVideoType === "youtube" && youtubeId && (
        <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
          <iframe 
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            className="w-[200vw] h-[200vh] sm:w-[150vw] sm:h-[150vh] min-w-full min-h-full max-w-none pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
            style={{ border: 0 }}
          />
        </div>
      )}
      
      {/* Optional: adding a subtle inner shadow so it blends well with adjacent sections */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none" />
    </section>
  );
}
