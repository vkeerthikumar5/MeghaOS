import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Cpu, Monitor, Zap, X } from 'lucide-react';

const TaskManager = ({ openWindows, onCloseWindow }) => {
  const [cpuUsage, setCpuUsage] = useState(12);
  const [history, setHistory] = useState(Array(50).fill(0));
  const [activeTab, setActiveTab] = useState('processes');

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 10) - 5;
        const newVal = Math.max(2, Math.min(85, prev + delta));
        return newVal;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev.slice(1), cpuUsage];
      return newHistory;
    });
  }, [cpuUsage]);

  const sortedWindows = useMemo(() => {
    return [...openWindows].sort((a, b) => b.zIndex - a.zIndex);
  }, [openWindows]);

  const items = [
    { name: 'Word', cpu: '2.4%', memory: '124 MB', type: 'word' },
    { name: 'Excel', cpu: '1.8%', memory: '85 MB', type: 'excel' },
    { name: 'Megh Player', cpu: '4.2%', memory: '210 MB', type: 'meghplayer' },
    { name: 'File Explorer', cpu: '0.5%', memory: '42 MB', type: 'filemanager' },
    { name: 'MeghExplorer', cpu: '8.1%', memory: '450 MB', type: 'meghexplorer' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#111111] text-white font-sans overflow-hidden">
      {/* Sidebar / Tabs */}
      <div className="flex h-full">
        <div className="w-16 md:w-48 bg-[#181818] border-r border-white/5 flex flex-col pt-4">
           <button 
             onClick={() => setActiveTab('processes')}
             className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${activeTab === 'processes' ? 'bg-blue-600/20 text-blue-400' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
           >
              <Monitor className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold hidden md:block">Processes</span>
           </button>
           <button 
             onClick={() => setActiveTab('performance')}
             className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${activeTab === 'performance' ? 'bg-blue-600/20 text-blue-400' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
           >
              <Activity className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold hidden md:block">Performance</span>
           </button>
           <div className="mt-auto p-4 opacity-20 hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-center">MeghOS Diagnostics</p>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
           {activeTab === 'processes' ? (
             <div className="flex-1 overflow-auto p-4 md:p-6">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-black text-white/90 tracking-tight">System Processes</h2>
                   <div className="flex items-center gap-3 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Healthy</span>
                   </div>
                </div>

                <div className="w-full text-[11px] uppercase tracking-widest font-black text-white/20 grid grid-cols-4 px-4 mb-4">
                   <span>App Name</span>
                   <span className="text-right">Status</span>
                   <span className="text-right">Memory</span>
                   <span className="text-right">Action</span>
                </div>

                <div className="space-y-1">
                   {sortedWindows.map((win) => (
                      <div key={win.id} className="grid grid-cols-4 items-center bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors group">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-black/40 rounded-lg flex items-center justify-center p-1.5 grayscale group-hover:grayscale-0 transition-all">
                               {win.icon}
                            </div>
                            <span className="text-sm font-bold text-white/80 truncate">{win.title}</span>
                         </div>
                         <div className="text-right">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[9px] font-black uppercase">Running</span>
                         </div>
                         <div className="text-right text-[12px] font-mono text-white/40">
                            {win.type === 'meghexplorer' ? '450.2 MB' : '112.5 MB'}
                         </div>
                         <div className="text-right">
                            <button 
                              onClick={() => onCloseWindow(win.id)}
                              className="p-2 bg-red-600/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                            >
                               <X className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   ))}
                   {openWindows.length === 0 && (
                     <div className="py-20 text-center opacity-20 border-2 border-dashed border-white/10 rounded-2xl">
                        <Monitor className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs">No Active Processes</p>
                     </div>
                   )}
                </div>
             </div>
           ) : (
             <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* CPU Widget */}
                   <div className="bg-[#1c1c1c] rounded-2xl p-6 border border-white/5 shadow-2xl">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                               <Cpu className="w-5 h-5" />
                            </div>
                            <div>
                               <h3 className="text-sm font-black text-white/90">CPU Usage</h3>
                               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Megh v2 Silicon</p>
                            </div>
                         </div>
                         <span className="text-2xl font-black text-blue-400 tracking-tighter">{cpuUsage}%</span>
                      </div>
                      
                      {/* Graph */}
                      <div className="h-40 flex items-end gap-[2px] bg-black/40 rounded-xl p-2 border border-white/5">
                         {history.map((val, i) => (
                           <div 
                             key={i} 
                             className="flex-1 bg-blue-500/40 hover:bg-blue-400 transition-all rounded-t-sm"
                             style={{ height: `${val}%` }}
                           />
                         ))}
                      </div>
                   </div>

                   {/* Memory Widget */}
                   <div className="bg-[#1c1c1c] rounded-2xl p-6 border border-white/5 shadow-2xl">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
                               <Zap className="w-5 h-5" />
                            </div>
                            <div>
                               <h3 className="text-sm font-black text-white/90">Memory Pool</h3>
                               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Cloud VRAM</p>
                            </div>
                         </div>
                         <span className="text-2xl font-black text-purple-400 tracking-tighter">4.2 GB</span>
                      </div>
                      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden mt-8">
                         <div className="absolute inset-y-0 left-0 bg-purple-500 w-[60%] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                      </div>
                      <div className="flex justify-between mt-3">
                         <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">In Use: 4.2 GB</span>
                         <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">Free: 11.8 GB</span>
                      </div>
                   </div>
                </div>

                <div className="bg-[#1c1c1c] rounded-2xl p-8 border border-white/5 shadow-2xl">
                   <h3 className="text-sm font-black text-white/90 mb-6 uppercase tracking-widest border-b border-white/5 pb-4">Process Statistics</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Threads</p>
                         <p className="text-xl font-black text-white">2,142</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Handles</p>
                         <p className="text-xl font-black text-white">84,102</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Up Time</p>
                         <p className="text-xl font-black text-white">02:14:15</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Page Pool</p>
                         <p className="text-xl font-black text-white">852 MB</p>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
