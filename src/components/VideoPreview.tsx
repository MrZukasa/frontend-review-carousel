import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPreviewProps {
  thumbnail?: string | null;
  href?: string;
  alt?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ thumbnail, href, alt }) => {
  return (
    <div className="w-96 h-60 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {thumbnail ? (
          <motion.a
            key={thumbnail} // serve per far triggerare l’animazione al cambio immagine
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
        ) : (
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
