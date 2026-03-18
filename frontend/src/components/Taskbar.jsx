import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Wifi, X } from 'lucide-react';

const Taskbar = ({ 
  onStartClick, 
  isStartOpen, 
  pinnedApps = [], 
  openWindows = [], 
  onWindowClick, 
  onAppClick,
  onWindowClose,
  systemVolume,
  setSystemVolume,
  isSystemMuted,
  setIsSystemMuted
}) => {
  const [time, setTime] = useState(new Date());
  const [showVolume, setShowVolume] = useState(false);
  const [windowContextMenu, setWindowContextMenu] = useState({ visible: false, x: 0, y: 0, winId: null });
  const volumeRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target)) {
        setShowVolume(false);
      }
      setWindowContextMenu(prev => ({ ...prev, visible: false }));
    };
    if (showVolume || windowContextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVolume, windowContextMenu.visible]);

  const getVolumeIcon = () => {
    if (isSystemMuted || systemVolume === 0) return <VolumeX className="w-4 h-4 text-white/70" />;
    return <Volume2 className="w-4 h-4 text-white/70" />;
  };

  const handleWindowContextMenu = (e, winId) => {
    e.preventDefault();
    e.stopPropagation();
    setWindowContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY - 40, // Show above taskbar
      winId
    });
  };



  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-[48px] bg-black/40 backdrop-blur-3xl border-t border-white/10 flex items-center justify-between px-3 z-[2000] select-none"
    >
      
      {/* Start Button & Apps Section */}
      <div className="flex items-center gap-1">
        <button 
          onClick={onStartClick}
          className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200 group relative ${isStartOpen ? 'bg-white/10 shadow-inner' : 'hover:bg-white/10 active:scale-90'}`}
        >
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform" />
          {isStartOpen && <div className="absolute bottom-0 w-1.5 h-0.5 bg-blue-400 rounded-full" />}
        </button>
 
        <div className="w-px h-6 bg-white/10 mx-1" />

        <div className="flex items-center gap-1">
          {pinnedApps.map((app, index) => (
            <div 
              key={`p-${index}`} 
              title={app.name} 
              onClick={() => onAppClick && onAppClick(app.type)}
              className="h-10 w-10 flex flex-col items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer relative group active:scale-95"
            >
              <div className={`w-5 h-5 ${app.color} rounded shadow-sm border border-white/10 flex items-center justify-center`}>
                {app.icon}
              </div>
              <div className="absolute bottom-1 w-1 h-1 bg-white/20 rounded-full"></div>
            </div>
          ))}

          {openWindows.map((win) => (
            <div 
              key={win.id} 
              title={win.title}
              onClick={() => onWindowClick(win.id)}
              onContextMenu={(e) => handleWindowContextMenu(e, win.id)}
              className="h-10 w-10 flex flex-col items-center justify-center rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer relative group active:scale-95 animate-in slide-in-from-left-2"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {win.icon}
              </div>
              <div className="absolute bottom-1 w-4 h-0.5 bg-blue-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Window Context Menu (Close Option) */}
      {windowContextMenu.visible && (
        <div 
          className="fixed bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/10 rounded-xl py-1.5 w-40 shadow-2xl z-[3000] animate-in fade-in zoom-in-95 duration-150"
          style={{ left: windowContextMenu.x, top: windowContextMenu.y - 10 }}
        >
          <button 
            onClick={() => {
              onWindowClose(windowContextMenu.winId);
              setWindowContextMenu(prev => ({ ...prev, visible: false }));
            }}
            className="w-full px-4 py-2 hover:bg-white/10 flex items-center gap-3 text-sm font-medium text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
            Close Window
          </button>
        </div>
      )}



      {/* System Tray */}
      <div className="flex items-center gap-1 h-full relative" ref={volumeRef}>
        {showVolume && (
          <div className="absolute bottom-14 right-0 w-80 bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
             <div className="flex items-center gap-4">
                <button 
                   onClick={() => setIsSystemMuted(!isSystemMuted)}
                   className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                   {getVolumeIcon()}
                </button>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full relative group cursor-pointer overflow-hidden">
                   <input 
                      type="range"
                      min="0"
                      max="100"
                      value={isSystemMuted ? 0 : systemVolume}
                      onChange={(e) => {
                        setSystemVolume(parseInt(e.target.value));
                        if (isSystemMuted) setIsSystemMuted(false);
                      }}
                      className="absolute inset-0 w-full opacity-0 z-10 cursor-pointer"
                   />
                   <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${isSystemMuted ? 0 : systemVolume}%` }} />
                </div>
                <span className="text-xs font-bold text-white/60 w-8">{isSystemMuted ? 0 : systemVolume}%</span>
             </div>
             <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-white/40 uppercase tracking-widest">
                <span>System Volume</span>
                <span className="text-blue-400">Master</span>
             </div>
          </div>
        )}

        <div 
           onClick={() => setShowVolume(!showVolume)}
           className={`flex items-center px-2 py-1.5 gap-3 rounded-lg transition-all cursor-default ${showVolume ? 'bg-white/10' : 'hover:bg-white/10 active:scale-95'}`}
        >
          <Wifi className="w-4 h-4 text-white/70" />
          {getVolumeIcon()}
        </div>

        <div className="flex flex-col items-end px-3 py-1 hover:bg-white/10 rounded-lg transition-colors cursor-default">
          <span className="text-[11px] font-semibold text-white/90">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[9px] text-white/50 font-mono tracking-tighter">
            {time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
