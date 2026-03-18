import React, { useState, useEffect, useRef } from 'react';
import { Music, Upload, Disc, Music2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAudioFiles, uploadFileRaw } from '../utils/fs';
import AudioUploader from './AudioUploader';
import Playlist from './Playlist';
import PlayerControls from './PlayerControls';

const API_BASE = 'https://meghaos.onrender.com';

const MeghPlayer = ({ file, systemVolume, setSystemVolume, isSystemMuted, setIsSystemMuted }) => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(true);

  const audioRef = useRef(new Audio());
  const containerRef = useRef(null);

  useEffect(() => {
    fetchSongs();
    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const data = await getAudioFiles();
      setSongs(data);
      setLoading(false);

      if (file && data.length > 0) {
        const index = data.findIndex(s => s._id === file._id);
        if (index !== -1) {
          setTimeout(() => handlePlaySong(index), 100);
        }
      }
    } catch (err) {
      console.error("Fetch songs failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
    };
  }, [songs, currentSongIndex, isShuffle, isRepeat]);

  useEffect(() => {
    const effectiveVolume = isSystemMuted ? 0 : systemVolume / 100;
    audioRef.current.volume = effectiveVolume;
  }, [systemVolume, isSystemMuted]);

  const handlePlaySong = (index) => {
    if (index === currentSongIndex) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
        setIsPlaying(true);
      }
      return;
    }
    const song = songs[index];
    if (song) {
      audioRef.current.src = `${API_BASE}${song.serverPath}`;
      audioRef.current.volume = isSystemMuted ? 0 : systemVolume / 100;
      audioRef.current.play().catch(e => console.error("Playback start error:", e));
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (currentSongIndex === -1 && songs.length > 0) {
      handlePlaySong(0);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Toggle play failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (songs.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
      if (nextIndex === currentSongIndex && songs.length > 1) {
        nextIndex = (nextIndex + 1) % songs.length;
      }
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }
    handlePlaySong(nextIndex);
  };

  const handlePrev = () => {
    if (songs.length === 0) return;
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    handlePlaySong(prevIndex);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    const seekTime = (val / 100) * audioRef.current.duration;
    if (!isNaN(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setProgress(val);
    }
  };

  const handleFileUpload = async (files) => {
    for (let f of files) {
      if (f.type.startsWith('audio/')) {
        const formData = new FormData();
        formData.append('file', f);
        formData.append('parentId', 'null');
        try {
          await uploadFileRaw(formData);
        } catch (err) {
          console.error("Upload error", err);
        }
      }
    }
    fetchSongs();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const currentSong = songs[currentSongIndex];

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-[#0a0a0f] text-white/90 overflow-hidden relative font-sans select-none"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <AudioUploader isDragging={isDragging} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Toggle Playlist Button (Responsive) */}
        <button
          onClick={() => setIsPlaylistVisible(!isPlaylistVisible)}
          className="absolute top-4 left-4 z-50 p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-white/40 hover:text-white"
          title={isPlaylistVisible ? "Hide Playlist" : "Show Playlist"}
        >
          {isPlaylistVisible ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        <div className={`transition-all duration-500 ease-in-out h-full overflow-hidden ${isPlaylistVisible ? 'w-80 border-r border-white/5 opacity-100' : 'w-0 opacity-0 border-r-0'}`}>
          <div className="w-80 h-full">
            <Playlist
              songs={songs}
              currentSongIndex={currentSongIndex}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySong}
              loading={loading}
            />
          </div>
        </div>

        {/* Player Visualization View */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/10 relative overflow-hidden">
          {/* Visualizer Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className={`w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/20 rounded-full blur-[80px] md:blur-[120px] transition-all duration-1000 ${isPlaying ? 'scale-125 opacity-30 text-blue-400' : 'scale-75 opacity-10'}`} />
            <div className={`absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-purple-500/10 rounded-full blur-[60px] md:blur-[100px] transition-all duration-700 ${isPlaying ? 'scale-110' : 'scale-90'}`} />
          </div>

          <div className="relative group perspective-1000 z-10 transition-transform duration-500 hover:translate-y-[-10px] flex flex-col items-center scale-75 md:scale-100">
            <div className={`w-64 h-64 md:w-80 md:h-80 bg-[#1c1c2e] rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-1000 border border-white/10 ${isPlaying ? 'scale-105 rotate-3' : 'scale-100'}`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-white/5 to-purple-600/30" />

              {/* Rotating Disc */}
              <div className={`absolute bottom-[-80px] right-[-80px] md:bottom-[-100px] md:right-[-100px] w-56 h-56 md:w-64 md:h-64 border-[30px] md:border-[40px] border-black/80 rounded-full opacity-40 transition-all ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <div className="absolute inset-0 border border-white/5 rounded-full" />
                <div className="absolute inset-4 border border-white/5 rounded-full" />
                <div className="absolute inset-8 border border-white/5 rounded-full" />
              </div>

              {currentSong ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8 animate-in zoom-in duration-500">
                  <div className={`w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-3xl rounded-3xl flex items-center justify-center mb-6 md:mb-8 shadow-2xl transition-all ${isPlaying ? 'animate-pulse scale-110' : ''}`}>
                    <Music2 className="w-10 h-10 md:w-12 md:h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-md mb-2 truncate max-w-full">{currentSong.name}</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <p className="text-[10px] md:text-[12px] text-white/40 uppercase tracking-[0.3em] font-black">Playing Now</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <Disc className="w-16 h-16 md:w-24 md:h-24 mb-6 animate-pulse" />
                  <p className="font-black text-[10px] uppercase tracking-[0.4em]">Ready to Play</p>
                </div>
              )}
            </div>

            <div className={`absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-16 h-16 md:w-20 md:h-20 bg-blue-600/90 backdrop-blur-md rounded-[24px] md:rounded-[28px] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2 border border-white/20 ${isPlaying ? 'scale-110' : ''}`}>
              <Music className={`w-6 h-6 md:w-8 md:h-8 text-white ${isPlaying ? 'animate-bounce' : ''}`} />
            </div>
          </div>

          {/* Mobile / Center Badge */}
          <div className="mt-8 md:mt-16 bg-white/5 backdrop-blur-xl border border-white/10 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl flex items-center gap-3 md:gap-4 animate-in slide-in-from-bottom-4 duration-700 opacity-60">
            <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-blue-400 text-center">MeghOS Audio Track</span>
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/20 rounded-full hidden md:block" />
            <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest hidden md:block">Premium Player</span>
          </div>
        </div>
      </div>

      <PlayerControls
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        isRepeat={isRepeat}
        setIsRepeat={setIsRepeat}
        progress={progress}
        onSeek={handleSeek}
        currentTime={currentTime}
        duration={duration}
        volume={systemVolume}
        setVolume={(e) => setSystemVolume(parseInt(e.target.value))}
        currentSong={currentSong}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
         @keyframes music-1 { 0%, 100% { height: 4px; } 50% { height: 12px; } }
         @keyframes music-2 { 0%, 100% { height: 10px; } 50% { height: 4px; } }
         @keyframes music-3 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
         .animate-music-1 { animation: music-1 0.8s infinite ease-in-out; }
         .animate-music-2 { animation: music-2 0.8s infinite ease-in-out; animation-delay: 0.2s; }
         .animate-music-3 { animation: music-3 0.8s infinite ease-in-out; animation-delay: 0.4s; }
         .animate-spin-slow { animation: spin 10s linear infinite; }
         .perspective-1000 { perspective: 1000px; }
         input[type='range'] {
           -webkit-appearance: none;
           background: transparent;
         }
         input[type='range']::-webkit-slider-thumb {
           -webkit-appearance: none;
           appearance: none;
           width: 0;
           height: 0;
         }
      `}} />
    </div>
  );
};

export default MeghPlayer;
