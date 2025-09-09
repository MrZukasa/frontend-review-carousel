import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPreviewProps {
  thumbnail?: string | null;
  href?: string; // link YouTube
  alt?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ thumbnail, href, alt }) => {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setShowVideo(false);
    if (href) {
      const timer = setTimeout(() => setShowVideo(true), 2000); // 2 secondi
      return () => clearTimeout(timer);
    }
  }, [href]);

  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = href ? getYouTubeId(href) : null;

  return (
    <div className="w-96 h-60 flex items-center justify-center overflow-hidden relative">
      <AnimatePresence mode="wait">
        {/* Thumbnail iniziale */}
        {!showVideo && thumbnail && (
          <motion.a
            key={thumbnail}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={thumbnail}
              alt={alt ?? "video preview"}
              className="rounded-xl shadow-2xl w-full h-full object-cover"
              loading="lazy"
            />
          </motion.a>
        )}

        {/* Video YouTube */}
        {showVideo && videoId && (
          <motion.iframe
            key="video"
            className="rounded-xl shadow-2xl w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
            title={alt ?? "video player"}
            allow="autoplay; encrypted-media"
            allowFullScreen
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Nessuna thumbnail / video */}
        {!thumbnail && !videoId && (
          <motion.div
            key="no-thumbnail"
            className="rounded-xl bg-gray-800 w-full h-full flex items-center justify-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span>Nessuna anteprima</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPreview;
