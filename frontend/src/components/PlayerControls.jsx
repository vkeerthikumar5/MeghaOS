import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat } from 'lucide-react';

const PlayerControls = ({ 
  isPlaying, 
  onTogglePlay, 
  onNext, 
  onPrev, 
  isShuffle, 
  setIsShuffle, 
  isRepeat, 
  setIsRepeat, 
  progress, 
  onSeek, 
  currentTime, 
  duration, 
  volume, 
  setVolume, 
  currentSong
}) => {
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-24 bg-black/60 backdrop-blur-3xl border-t border-white/5 px-10 flex items-center gap-12 z-10 shrink-0">
       {/* Current Song Info */}
       <div className="w-72 flex items-center gap-5 shrink-0 animate-in slide-in-from-left-4 duration-500 group/info">
          <div className="relative">
             <div className={`w-14 h-14 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-xl transition-all ${isPlaying ? 'scale-105 shadow-blue-500/10' : ''}`}>
                <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                   <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
             </div>
          </div>
          <div className="min-w-0">
             <p className="text-sm font-bold truncate text-white drop-shadow-sm">{currentSong?.name || 'Nothing Playing'}</p>
             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">MeghOS Cloud OS &bull; 2026</p>
          </div>
       </div>

       {/* Player PlayerControls */}
       <div className="flex-1 flex flex-col items-center gap-3">
          <div className="flex items-center gap-10">
             <button 
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-1.5 transition-all active:scale-95 ${isShuffle ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-white/20 hover:text-white'}`}
              title="Shuffle"
             >
                <Shuffle className="w-4 h-4" />
             </button>
             <button onClick={onPrev} className="text-white/60 hover:text-white transition-all active:scale-75">
                <SkipBack className="w-6 h-6 fill-current" />
             </button>
             <button 
                onClick={onTogglePlay}
                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-2xl shadow-white/20 overflow-hidden group"
             >
                {isPlaying ? <Pause className="w-7 h-7 fill-black" /> : <Play className="w-7 h-7 fill-black translate-x-1" />}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
             <button onClick={onNext} className="text-white/60 hover:text-white transition-all active:scale-75">
                <SkipForward className="w-6 h-6 fill-current" />
             </button>
             <button 
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-1.5 transition-all active:scale-95 ${isRepeat ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-white/20 hover:text-white'}`}
              title="Repeat One"
             >
                <Repeat className="w-4 h-4" />
             </button>
          </div>

          <div className="w-full max-w-2xl flex items-center gap-4">
             <span className="text-[10px] tabular-nums font-bold text-white/20 w-10 text-right">{formatTime(currentTime)}</span>
             <div className="flex-1 h-[6px] bg-white/5 rounded-full relative group cursor-pointer overflow-hidden backdrop-blur-sm">
                <input 
                   type="range"
                   min="0"
                   max="100"
                   value={progress}
                   onChange={onSeek}
                   className="absolute inset-0 w-full opacity-0 z-10 cursor-pointer"
                />
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full relative transition-all duration-300" style={{ width: `${progress}%` }}>
                   <div className="absolute right-[-1px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform ring-4 ring-blue-500/20" />
                </div>
             </div>
             <span className="text-[10px] tabular-nums font-bold text-white/20 w-10">{formatTime(duration)}</span>
          </div>
       </div>

       {/* Volume & Other */}
       <div className="w-72 flex items-center justify-end gap-5 shrink-0">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
             <Volume2 className="w-4 h-4 text-white/40" />
             <div className="w-24 h-[3px] bg-white/10 rounded-full relative group overflow-hidden">
                <input 
                   type="range"
                   min="0"
                   max="100"
                   value={volume}
                   onChange={setVolume}
                   className="absolute inset-0 w-full opacity-0 z-10 cursor-pointer"
                />
                <div className="h-full bg-white/70 rounded-full" style={{ width: `${volume}%` }} />
             </div>
          </div>
       </div>
    </div>
  );
};

export default PlayerControls;
