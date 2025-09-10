import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TrafficLightButton = ({ color, onClick }) => (
  <button onClick={onClick} className={`w-3 h-3 rounded-full ${color}`}></button>
);

export default function InteractiveHtmlWindow({
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  zIndex,
  onClick,
  position,
  windowId,
  title = 'Interactive Chart',
  html = '',
}) {
  const [width, setWidth] = useState(700);
  const [height, setHeight] = useState(500);
  const [hasUserResized, setHasUserResized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const iframeRef = useRef(null);

  if (!isOpen) return null;

  // Write HTML into iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html || '<!doctype html><html><body><p>No content</p></body></html>');
    doc.close();
  }, [html]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragHandle=".drag-handle"
      className={`absolute bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-300/50 ${isMaximized ? 'w-full h-full top-0 left-0 rounded-none' : ''}`}
      style={{
        width: isMaximized ? '100%' : width,
        height: isMaximized ? '100%' : height,
        zIndex,
        top: isMaximized ? 0 : position?.top,
        left: isMaximized ? 0 : position?.left,
      }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="drag-handle flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200">
        <div className="flex space-x-2">
          <TrafficLightButton color="bg-red-500" onClick={onClose} />
          <TrafficLightButton color="bg-yellow-500" onClick={onMinimize} />
          <TrafficLightButton color="bg-green-500" onClick={onMaximize} />
        </div>
        <div className="text-sm font-medium text-gray-800 select-none">{title}</div>
        <div className="w-16" />
      </div>
      <iframe ref={iframeRef} title={title} className="w-full h-full bg-white" />
      {!isMaximized && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          onDragStart={() => setIsResizing(true)}
          onDrag={(event, info) => {
            setWidth((w) => Math.max(400, w + info.delta.x));
            setHeight((h) => Math.max(250, h + info.delta.y));
          }}
          onDragEnd={() => { setIsResizing(false); setHasUserResized(true); }}
          className="absolute bottom-2 right-2 w-4 h-4 cursor-nwse-resize"
        >
          <div className="w-full h-full bg-gray-500/40 rounded-full" />
        </motion.div>
      )}
    </motion.div>
  );
}
