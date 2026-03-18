import React from 'react';
import { Upload } from 'lucide-react';

const AudioUploader = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-md z-50 flex flex-col items-center justify-center border-4 border-dashed border-blue-500/50 m-4 rounded-3xl animate-in fade-in duration-300 pointer-events-none">
       <Upload className="w-16 h-16 text-blue-400 animate-bounce mb-4" />
       <h2 className="text-2xl font-bold text-blue-400">Drop to Add Music</h2>
       <p className="text-blue-400/60 mt-2 font-medium">MP3, WAV, OGG supported</p>
    </div>
  );
};

export default AudioUploader;
