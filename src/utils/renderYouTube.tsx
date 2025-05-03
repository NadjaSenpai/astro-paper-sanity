// src/utils/renderYouTube.tsx
import type { ReactElement } from "react";

interface YoutubeProps {
  value: { url: string };
}

export function renderYouTube({ value }: YoutubeProps): ReactElement {
  // URL から動画 ID を抽出
  const match = value.url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
  const id = match?.[1];
  if (!id) {
    // ID 抽出できなければただのリンク
    return (
      <a href={value.url} target="_blank" rel="noopener noreferrer">
        {value.url}
      </a>
    );
  }

  return (
    <div className="relative w-full aspect-video my-4">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
