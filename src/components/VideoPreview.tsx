import React from "react";

interface VideoPreviewProps {
  thumbnail?: string | null;
  href?: string;
  alt?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ thumbnail, href, alt }) => {
  const content = thumbnail ? (
    <img
      src={thumbnail}
      alt={alt ?? "video preview"}
      className="rounded-xl shadow-2xl w-96 h-60 object-cover"
      loading="lazy"
    />
  ) : (
    <div className="rounded-xl bg-gray-800 w-96 h-60 flex items-center justify-center text-gray-400">
      <span>Nessuna anteprima</span>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
};

export default VideoPreview;
