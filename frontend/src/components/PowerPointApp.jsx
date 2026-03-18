import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createFile } from '../utils/fs';
import { Plus, Play, Presentation, Layout, Save, Share2, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const PowerPointApp = ({ file }) => {
  const [slides, setSlides] = useState([
    { id: 1, title: 'Welcome to MeghSlides', subtitle: 'Powerful presentations in the cloud' },
    { id: 2, title: 'Native Browser Support', subtitle: 'No plugins, no Docker, just pure React' }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSaveToCloud = async () => {
    try {
      const name = prompt("Enter name for presentation:", "Presentation.pptx") || "Untitled.pptx";
      setLoading(true);
      await createFile(name, 'powerpoint', 'null');
      window.location.reload();
    } catch (err) {
      alert("Save failed.");
      setLoading(false);
    }
  };

  const addSlide = () => {
    const newSlide = { id: Date.now(), title: 'New Slide', subtitle: 'Add more details here' };
    setSlides([...slides, newSlide]);
    setCurrentSlide(slides.length);
  };

  const deleteSlide = (idx) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== idx);
    setSlides(newSlides);
    setCurrentSlide(Math.max(0, idx - 1));
  };

  const updateSlide = (field, value) => {
    const newSlides = [...slides];
    newSlides[currentSlide][field] = value;
    setSlides(newSlides);
  };

  if (loading) return <div className="p-8 text-orange-600 animate-pulse font-bold text-center">Launching MeghSlides...</div>;

  return (
    <div className="w-full h-full bg-[#323130] flex flex-col overflow-hidden select-none">
      {!file?._id ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-6">
           <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center mb-6 text-white font-bold text-3xl shadow-lg animate-in zoom-in duration-300">P</div>
           <h2 className="text-2xl font-bold text-gray-800 mb-2">MeghSlides Presentation</h2>
           <p className="text-gray-500 mb-8 max-w-xs">Design stunning presentations with built-in cloud collaboration.</p>
           <button 
             onClick={handleSaveToCloud}
             className="px-10 py-4 bg-[#b7472a] text-white rounded-xl font-bold shadow-xl hover:bg-orange-800 transition-all"
           >
             Create New Presentation
           </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
           {/* PowerPoint Ribbon */}
           <div className="bg-[#b7472a] text-white shadow-md z-10 p-1">
              <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/10">
                 <div className="flex items-center gap-4">
                    <span className="font-bold text-lg flex items-center gap-2">
                       <Presentation className="w-5 h-5" /> MeghSlides
                    </span>
                    <div className="h-4 w-[1px] bg-white/20 mx-1" />
                    <span className="text-sm opacity-80 font-medium truncate">{file.name}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg text-sm transition-all font-semibold">
                       <Play className="w-4 h-4" /> Start Slide Show
                    </button>
                 </div>
              </div>
              
              <div className="flex items-center gap-1 px-4 py-2">
                 <button className="p-2 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px] transition-all">
                    <Save className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold">Save</span>
                 </button>
                 <div className="h-8 w-[1px] bg-white/10 mx-2" />
                 <button onClick={addSlide} className="p-2 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px] transition-all text-orange-200">
                    <Plus className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold">New Slide</span>
                 </button>
                 <button className="p-2 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px] transition-all">
                    <Layout className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold">Layout</span>
                 </button>
                 <div className="h-8 w-[1px] bg-white/10 mx-2" />
                 <button className="p-2 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px] transition-all">
                    <Share2 className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold">Share</span>
                 </button>
                 <button className="p-2 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px] transition-all">
                    <Download className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold">Export</span>
                 </button>
              </div>
           </div>

           <div className="flex-1 flex overflow-hidden">
              {/* Left Slide Panel - Narrower on mobile */}
              <div className="w-16 sm:w-56 bg-[#252423] border-r border-white/5 p-2 sm:p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar shadow-inner shrink-0">
                 <AnimatePresence>
                    {slides.map((slide, idx) => (
                       <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={slide.id}
                          onClick={() => setCurrentSlide(idx)}
                          className={`group relative aspect-video w-full rounded-md border-2 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-1 sm:p-2 text-center ${currentSlide === idx ? 'border-[#b7472a] bg-orange-500/10 shadow-lg scale-105' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                       >
                          <span className="absolute top-1 left-2 text-[8px] sm:text-[10px] text-white/30 font-bold">{idx + 1}</span>
                          <div className="text-[5px] sm:text-[7px] text-white font-bold mb-1 truncate w-full px-1">{slide.title}</div>
                          <button 
                             onClick={(e) => { e.stopPropagation(); deleteSlide(idx); }}
                             className="absolute top-1 right-1 p-0.5 sm:p-1 bg-red-500 rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all transform scale-75"
                          >
                             <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          </button>
                       </motion.div>
                    ))}
                 </AnimatePresence>
                 <button 
                    onClick={addSlide}
                    className="aspect-video w-full rounded-md border-2 border-dashed border-white/10 hover:border-[#b7472a]/50 hover:bg-white/5 flex flex-col items-center justify-center text-white/30 transition-all gap-1"
                 >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                 </button>
              </div>

              {/* Main Stage Panel */}
              <div className="flex-1 bg-[#3b3a39] flex flex-col items-center justify-center p-4 sm:p-16 relative overflow-hidden">
                 <div className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 flex flex-col gap-4 opacity-0 hover:opacity-100 transition-opacity z-20">
                    <button 
                       disabled={currentSlide === 0}
                       onClick={() => setCurrentSlide(prev => prev - 1)}
                       className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-20 transition-all"
                    >
                       <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                    </button>
                 </div>
                 <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 flex flex-col gap-4 opacity-0 hover:opacity-100 transition-opacity z-20">
                    <button 
                       disabled={currentSlide === slides.length - 1}
                       onClick={() => setCurrentSlide(prev => prev + 1)}
                       className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-20 transition-all"
                    >
                       <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                    </button>
                 </div>

                 <AnimatePresence mode="wait">
                    <motion.div 
                       key={currentSlide}
                       initial={{ opacity: 0, scale: 0.95, y: 10 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 1.05, y: -10 }}
                       className="aspect-video w-full max-w-5xl bg-white shadow-2xl flex flex-col items-center justify-center p-6 sm:p-24 text-center rounded-sm relative group"
                    >
                       <textarea 
                          className="text-2xl sm:text-6xl font-bold text-[#b7472a] bg-transparent text-center w-full outline-none resize-none border-b-2 border-transparent focus:border-orange-100 py-1 sm:py-2 placeholder:text-gray-100 transition-all"
                          placeholder="Title"
                          rows={2}
                          value={slides[currentSlide].title}
                          onChange={(e) => updateSlide('title', e.target.value)}
                       />
                       <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-orange-100 my-4 sm:my-8 rounded-full" />
                       <textarea 
                          className="text-sm sm:text-2xl text-gray-500 bg-transparent text-center w-full outline-none resize-none border-b-2 border-transparent focus:border-orange-100 py-1 sm:py-2 placeholder:text-gray-100 transition-all"
                          placeholder="Subtitle"
                          rows={2}
                          value={slides[currentSlide].subtitle}
                          onChange={(e) => updateSlide('subtitle', e.target.value)}
                       />
                    </motion.div>
                 </AnimatePresence>
                 
                 <div className="absolute bottom-4 flex gap-2 sm:gap-4 text-white/30 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] pointer-events-none">
                    <span>Cloud Mode</span>
                    <span>&bull;</span>
                    <span>Autosave</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PowerPointApp;

