import React from 'react';

const DesktopIcon = ({ name, icon, color, onContextMenu }) => {
  return (
    <div 
      className="group flex flex-row sm:flex-col items-center sm:justify-center p-2 w-full sm:w-24 h-14 sm:h-24 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-default select-none gap-3 sm:gap-2"
      onContextMenu={(e) => onContextMenu && onContextMenu(e, 'app')}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${color} backdrop-blur-md border border-white/20`}>
        {icon}
      </div>
      <span className="text-[11px] sm:text-[10px] text-white font-medium sm:text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 truncate w-full leading-tight">
        {name}
      </span>
    </div>
  );
};

export default DesktopIcon;
