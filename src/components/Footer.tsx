import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full py-2 flex justify-center-safe
                       bg-black/40 backdrop-blur-md text-gray-300 text-sm z-50">
      <p className="flex items-center gap-1">
        Crafted with
        <motion.span
          className="font-extralight"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          ♥️
        </motion.span>
        by <span className="line-through text-red-700">MrZ</span>
      </p>
    </footer>
  );
};

export default Footer;
