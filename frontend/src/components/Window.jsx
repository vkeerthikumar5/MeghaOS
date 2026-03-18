import React from 'react';
import Draggable from 'react-draggable';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

const Window = ({ 
  id, 
  title, 
  children, 
  onClose, 
  onMinimize, 
  onFocus, 
  zIndex, 
  icon,
  initialPos = { x: 100, y: 50 }
}) => {
  const [maximized, setMaximized] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [size, setSize] = React.useState({ 
    width: typeof window !== 'undefined' ? Math.min(800, window.innerWidth - 20) : 800, 
    height: typeof window !== 'undefined' ? Math.min(500, window.innerHeight - 100) : 500 
  });
  const [isResizing, setIsResizing] = React.useState(false);
  const nodeRef = React.useRef(null);

  const startResizing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (e) => {
      const newWidth = Math.max(400, startWidth + (e.clientX - startX));
      const newHeight = Math.max(300, startHeight + (e.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      bounds="parent"
      disabled={maximized || isResizing}
      onStart={onFocus}
      defaultPosition={initialPos}
    >
      <div 
        ref={nodeRef}
        className={`absolute top-0 left-0 flex flex-col bg-[#1c1c1e] backdrop-blur-3xl border border-white/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden select-none window-transition
          ${maximized ? 'top-0 left-0 right-0 bottom-[48px] !transform-none !m-0 !w-full h-auto rounded-none z-[1000]' : ''}
        `}
        style={{ 
          zIndex: maximized ? 1000 : zIndex,
          width: maximized ? '100%' : `${size.width}px`,
          height: maximized ? 'calc(100% - 48px)' : `${size.height}px`,
          bottom: maximized ? '48px' : 'auto'
        }}
        onClick={onFocus}
      >
        {/* Header */}
        <div className="window-header h-10 bg-white/5 flex items-center justify-between px-3 cursor-default active:cursor-grabbing border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              {icon}
            </div>
            <span className="text-xs font-medium text-white/80">{title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors group"
            >
              <Minus className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setMaximized(!maximized); }}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors group"
            >
              {maximized ? (
                <Square className="w-3 h-3 text-white/40 group-hover:text-white" />
              ) : (
                <Maximize2 className="w-3 h-3 text-white/40 group-hover:text-white" />
              )}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(id); }}
              className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors group"
            >
              <X className="w-3.5 h-3.5 text-white/40 group-hover:text-red-500" />
            </button>
          </div>
        </div>

        {/* Content Area - Must be relative for absolute children */}
        <div className="flex-1 relative overflow-auto bg-white/5">
          {children}
        </div>

        {/* Resize Handle */}
        {!maximized && (
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 group/resize z-50"
            onMouseDown={startResizing}
          >
            <div className="w-1.5 h-1.5 border-r border-b border-white/20 rounded-br-sm group-hover/resize:border-white transition-colors" />
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default Window;
