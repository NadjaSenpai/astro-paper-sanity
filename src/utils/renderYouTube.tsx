import React from "react";

export function renderYouTube({ value }: { value: { url: string } }) {
  if (!value?.url) return null;

  const url = new URL(value.url);
  const videoId = url.searchParams.get("v");

  if (!videoId) return null;

  return (
    <div className="aspect-video my-8">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

