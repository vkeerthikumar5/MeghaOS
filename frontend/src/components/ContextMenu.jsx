import React from 'react';

const ContextMenu = ({ x, y, options, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div 
      className="fixed z-[2200] w-56 bg-[#1c1c1e]/95 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in duration-100"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option, index) => (
        <React.Fragment key={index}>
          {option.type === 'separator' ? (
            <div className="h-px bg-white/5 my-1" />
          ) : (
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors group relative"
              onClick={() => {
                option.onClick();
                onClose && onClose();
              }}
            >
              {option.icon && <span className="text-white/40 group-hover:text-blue-400 transition-colors">{option.icon}</span>}
              <span className="flex-1 text-left">{option.label}</span>
              {option.hasSubmenu && (
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContextMenu;
