import React, { useEffect } from 'react';
import { Cloud } from 'lucide-react';

const BootScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center text-white z-50">
      <div className="relative mb-8 group">
        {/* Animated Cloud Logo */}
        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-110 animate-pulse"></div>
        <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 transform transition-transform group-hover:scale-105 duration-500">
          <Cloud className="w-12 h-12 text-white animate-bounce-slow" />
        </div>
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl font-light tracking-[0.3em] mb-3">
          MEGH<span className="font-bold text-blue-500">OS</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-blue-400/60 font-mono text-xs">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          <span>Your Desktop in the Cloud</span>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-2">
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-0 animate-loading-bar"></div>
        </div>
        <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-bold">
          System Initializing
        </p>
      </div>
    </div>
  );
};

export default BootScreen;
