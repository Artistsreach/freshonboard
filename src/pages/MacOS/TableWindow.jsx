import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TrafficLightButton = ({ color, onClick }) => (
  <button onClick={onClick} className={`w-3 h-3 rounded-full ${color}`}></button>
);

export default function TableWindow({ isOpen, onClose, onMinimize, onMaximize, isMaximized, title, data, zIndex, onClick, position, windowId }) {
  if (!isOpen) return null;

  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [isMobile, setIsMobile] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [hasUserResized, setHasUserResized] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragHandle=".drag-handle"
      className={`absolute bg-gray-100/50 backdrop-blur-xl rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-300/20 ${isMaximized ? 'w-full h-full top-0 left-0 rounded-none' : ''}`}
      style={{
        width: isMaximized ? '100%' : (isMobile && !hasUserResized ? Math.min(width, 400) : width),
        maxWidth: isMaximized ? undefined : (isMobile && !hasUserResized ? 400 : undefined),
        height: isMaximized ? '100%' : height,
        zIndex,
        top: isMaximized ? 0 : position?.top,
        left: isMaximized ? 0 : position?.left,
      }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="drag-handle relative flex items-center justify-between p-2 bg-gray-200/80 rounded-t-lg border-b border-gray-300/40">
        <div className="flex space-x-2">
          <TrafficLightButton color="bg-red-500" onClick={onClose} />
          <TrafficLightButton color="bg-yellow-500" onClick={onMinimize} />
          <TrafficLightButton color="bg-green-500" onClick={onMaximize} />
        </div>
        <div className="font-semibold text-sm text-black">{title}</div>
        <div></div>
      </div>
      <div className="flex-grow p-4 overflow-auto" onMouseDown={(e) => e.stopPropagation()}>
        <table className="w-full">
          <thead>
            <tr>
              {data.headers.map((header, index) => (
                <th key={index} className="p-2 border">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-2 border">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isMaximized && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          onDragStart={() => setIsResizing(true)}
          onDrag={(event, info) => {
            setWidth((w) => {
              const next = Math.max(360, w + info.delta.x);
              return (isMobile && !hasUserResized && !isResizing) ? Math.min(next, 400) : next;
            });
            setHeight((h) => Math.max(240, h + info.delta.y));
          }}
          onDragEnd={() => { setIsResizing(false); setHasUserResized(true); }}
          className="absolute bottom-2 right-2 w-4 h-4 cursor-nwse-resize"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="w-full h-full bg-gray-500/40 rounded-full" />
        </motion.div>
      )}
    </motion.div>
  );
}
