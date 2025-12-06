import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';
import { useOS } from '../context/OSContext';

interface WindowFrameProps {
  windowState: WindowState;
  children: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ windowState, children }) => {
  const { 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow, 
    updateWindowPosition,
    updateWindowSize,
    activeWindowId
  } = useOS();

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMounting, setIsMounting] = useState(true);

  // Trigger entry animation
  useEffect(() => {
    requestAnimationFrame(() => setIsMounting(false));
  }, []);

  const isActive = activeWindowId === windowState.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(windowState.id);
  };

  const startDrag = (e: React.MouseEvent) => {
    if (window.innerWidth < 768 || windowState.isMaximized) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateWindowPosition(windowState.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, windowState.id, updateWindowPosition]);

  // Frame Styles with Smooth Transitions
  const frameStyle: React.CSSProperties = {
    top: windowState.isMaximized ? 0 : windowState.y,
    left: windowState.isMaximized ? 0 : windowState.x,
    width: windowState.isMaximized ? '100vw' : windowState.width,
    height: windowState.isMaximized ? 'calc(100vh - 48px)' : windowState.height,
    zIndex: windowState.zIndex,
    // Smooth transition for maximize/restore, opacity for mount/minimize
    transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: isMounting 
      ? 'scale(0.95)' 
      : windowState.isMinimized 
        ? 'scale(0.7) translateY(100px)' 
        : 'scale(1) translateY(0)',
    opacity: isMounting || windowState.isMinimized ? 0 : 1,
    borderRadius: windowState.isMaximized ? 0 : '0.75rem', // rounded-xl
  };

  // Mobile overrides applied via CSS class logic for precedence, 
  // but simpler to handle inside style if we detect mobile, or via className overrides.
  // We'll stick to className for mobile enforcement.

  return (
    <div 
      ref={windowRef}
      className={`fixed flex flex-col bg-os-surface backdrop-blur-2xl border border-os-border shadow-2xl overflow-hidden hw-accelerate
        ${isActive ? 'ring-1 ring-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]' : 'shadow-xl'}
        
        /* Mobile Overrides */
        max-md:!top-0 max-md:!left-0 max-md:!w-full max-md:!h-[calc(100vh-48px)] max-md:!transform-none max-md:!opacity-100 max-md:!rounded-none max-md:!transition-none
      `}
      style={frameStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <div 
        className="h-10 min-h-[40px] bg-white/5 border-b border-white/5 flex items-center justify-between px-3 select-none transition-colors hover:bg-white/10"
        onMouseDown={startDrag}
        onDoubleClick={() => {
           if (window.innerWidth >= 768) maximizeWindow(windowState.id);
        }}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <span className="opacity-70 drop-shadow-sm">{windowState.title}</span>
        </div>
        
        <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
          {/* Controls */}
          <button 
            onClick={() => minimizeWindow(windowState.id)}
            className="hidden md:flex p-1.5 hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-95"
            title="Minimize"
          >
            <Minus size={14} className="text-gray-300" />
          </button>
          <button 
            onClick={() => maximizeWindow(windowState.id)}
            className="hidden md:flex p-1.5 hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-95"
            title="Maximize"
          >
            {windowState.isMaximized ? (
              <Maximize2 size={12} className="text-gray-300" />
            ) : (
              <Square size={12} className="text-gray-300" />
            )}
          </button>
          <button 
            onClick={() => closeWindow(windowState.id)}
            className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-all hover:scale-110 active:scale-95 group"
            title="Close"
          >
            <X size={14} className="text-gray-300 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative bg-black/20">
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;