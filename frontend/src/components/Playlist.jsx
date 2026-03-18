import React from 'react';
import { Music, ListMusic, Upload } from 'lucide-react';

const Playlist = ({ songs, currentSongIndex, isPlaying, onPlaySong, loading }) => {
  return (
    <div className="w-72 bg-black/40 border-r border-white/5 flex flex-col">
       <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Music className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-lg font-bold tracking-tight text-white uppercase tracking-[0.1em]">Megh</h1>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Player</p>
             </div>
          </div>
          
          <div className="space-y-1">
             <button className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 text-blue-400 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-500/10">
                <ListMusic className="w-4 h-4" />
                Playlist
             </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-hide">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Songs</h3>
          {loading ? (
            <div className="space-y-3 px-2">
               {[1,2,3,4].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : songs.length === 0 ? (
            <div className="text-center py-10 opacity-20 border-2 border-dashed border-white/10 rounded-2xl m-2">
               <Upload className="w-8 h-8 mx-auto mb-2" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Add Local Music</p>
            </div>
          ) : (
            <div className="space-y-1">
               {songs.map((song, idx) => (
                  <button 
                    key={song._id}
                    onClick={() => onPlaySong(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                      currentSongIndex === idx ? 'bg-blue-600/20 text-blue-400 border border-blue-500/10' : 'hover:bg-white/5 text-white/60'
                    }`}
                  >
                     <div className="relative shrink-0">
                        <Music className={`w-4 h-4 ${currentSongIndex === idx ? 'text-blue-400' : 'text-white/20 group-hover:text-white/40 transition-colors'}`} />
                        {currentSongIndex === idx && isPlaying && (
                           <div className="absolute inset-x-[-2px] bottom-[-2px] flex items-end justify-center gap-[1.5px] h-3 z-10">
                              <div className="w-[2px] bg-blue-400 animate-music-1 rounded-full" />
                              <div className="w-[2px] bg-blue-400 animate-music-2 rounded-full" />
                              <div className="w-[2px] bg-blue-400 animate-music-3 rounded-full" />
                           </div>
                        )}
                     </div>
                     <div className="flex-1 text-left min-w-0">
                        <p className={`text-xs font-bold truncate ${currentSongIndex === idx ? 'text-blue-400' : 'text-white/90 group-hover:text-white'}`}>{song.name}</p>
                        <p className="text-[10px] opacity-40 truncate font-medium uppercase tracking-tighter tracking-widest">MeghOS Audio Track</p>
                     </div>
                  </button>
               ))}
            </div>
          )}
       </div>
    </div>
  );
};

export default Playlist;
