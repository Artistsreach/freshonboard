import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

const YouTubePlayer = ({ videoId, onClose, zIndex, position = { top: 100, left: 100 }, onDragEnd, windowId }) => {
  if (!videoId) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-800 resize"
      style={{ 
        zIndex,
        top: position.top,
        left: position.left,
        width: '480px',
        height: '320px',
        minWidth: '320px',
        minHeight: '240px'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onDragEnd={(e, info) => {
        if (onDragEnd && windowId) {
          onDragEnd(windowId, e, info);
        }
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 text-white text-sm cursor-move">
        <span className="font-medium">YouTube Player</span>
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-700 rounded">
            <Minus className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded">
            <Square className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-red-500 rounded" onClick={onClose}>
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="w-full h-full bg-black">
        <iframe
          key={videoId}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
};

export default YouTubePlayer;
