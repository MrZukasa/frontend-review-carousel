import { motion, AnimatePresence } from "framer-motion";
import OverlayLink from "./OverlayLink";
import { VideoColumnProps } from "../utilities/interfaces";

const getThumbnail = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

const VideoColumn: React.FC<VideoColumnProps> = ({ title, videoUrl, showVideo, iframeClasses, position }: VideoColumnProps): React.ReactElement => {
  const videoId = videoUrl?.split("/").pop();

  return (
    <div className="flex flex-col items-center h-screen relative overflow-hidden">
      <div className="absolute top-12 left-0 w-full flex items-start justify-center z-20 pointer-events-none">
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg text-center">
          {title}
        </p>
      </div>
      <div className={`absolute top-0 h-full w-8 z-10 pointer-events-none ${position === "left"
        ? "left-0 bg-gradient-to-r from-black via-black/40 to-transparent"
        : "right-0 bg-gradient-to-l from-black via-black/40 to-transparent"
        }`} />
      <div className="flex-1 w-full h-full flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {!showVideo && videoId && (
            <motion.img
              key={"thumbnail-" + videoId}
              src={getThumbnail(videoId)}
              alt={`${title} thumbnail`}
              className="absolute inset-0 m-auto max-w-full max-h-full object-contain shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          )}
          {showVideo && videoId && (
            <motion.iframe
              key={"video-" + videoId}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&mute=1`}
              title={title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className={iframeClasses}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
        <OverlayLink href={videoUrl} />
      </div>
    </div>
  );
};

export default VideoColumn;
