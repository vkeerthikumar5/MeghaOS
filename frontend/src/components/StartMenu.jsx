import React, { useState, useEffect } from 'react';
import { Cloud, Search, FileText, Table, Presentation, HardDrive, Music, Gamepad2, Brain } from 'lucide-react';
import { getFS } from '../utils/fs';

const StartMenu = ({ isOpen, onClose, onLogout, onAppContextMenu, onAppClick, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileResults, setFileResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const allApps = [
    { name: "Word", type: 'word', color: "bg-blue-600/40", icon: <FileText className="w-5 h-5 text-blue-400" />, textColor: "text-blue-400" },
    { name: "Excel", type: 'excel', color: "bg-emerald-600/40", icon: <Table className="w-5 h-5 text-emerald-400" />, textColor: "text-emerald-400" },
    { name: "PowerPoint", type: 'powerpoint', color: "bg-orange-600/40", icon: <Presentation className="w-5 h-5 text-orange-400" />, textColor: "text-orange-400" },
    { name: "Megh Player", type: 'meghplayer', color: "bg-purple-600/40", icon: <Music className="w-5 h-5 text-purple-400" />, textColor: "text-purple-400" },
    { name: "Notepad", type: 'notepad', color: "bg-gray-600/40", icon: <FileText className="w-5 h-5 text-blue-400" />, textColor: "text-blue-400" },
    { name: "MeghExplorer", type: 'meghexplorer', color: "bg-blue-600/40", icon: <Cloud className="w-5 h-5 text-white" />, textColor: "text-blue-200" },
    { name: "File Explorer", type: 'filemanager', color: "bg-yellow-600/40", icon: <HardDrive className="w-5 h-5 text-yellow-400" />, textColor: "text-yellow-400" },
    { name: "Tic Tac Toe", type: 'tictactoe', color: "bg-sky-600/40", icon: <Gamepad2 className="w-5 h-5 text-sky-400" />, textColor: "text-sky-400" },
    { name: "Memory Game", type: 'memorygame', color: "bg-rose-600/40", icon: <Brain className="w-5 h-5 text-rose-400" />, textColor: "text-rose-400" },
  ];

  const pinnedApps = allApps.slice(0, 4);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const searchFiles = async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          // Fetch root files for search demo - in a real app we might have a search endpoint
          const files = await getFS();
          const filtered = files.filter(f => 
            f.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFileResults(filtered);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setFileResults([]);
      }
    };

    const timer = setTimeout(searchFiles, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const filteredApps = searchQuery 
    ? allApps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div 
      className="fixed z-[2100] bottom-16 left-4 right-4 sm:right-auto sm:w-[540px] max-h-[calc(100vh-100px)] h-[640px] bg-[#1c1c1e]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200" 
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Search Bar */}
      <div className="p-6 pb-2">
        <div className="relative group">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for apps, settings, and documents"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/30"
            autoFocus
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-white/30 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {searchQuery ? (
          <div className="p-6 space-y-6">
            {/* App Results */}
            {filteredApps.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3 px-2">Apps</h3>
                <div className="grid grid-cols-1 gap-1">
                   {filteredApps.map((app, index) => (
                     <button 
                       key={index}
                       onClick={() => onAppClick && onAppClick(app)}
                       className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group text-left"
                     >
                        <div className={`w-10 h-10 ${app.color} rounded-lg flex items-center justify-center border border-white/5`}>
                          {app.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white/90 font-medium">{app.name}</p>
                          <p className="text-[11px] text-white/30">System App</p>
                        </div>
                     </button>
                   ))}
                </div>
              </div>
            )}

            {/* Document Results */}
            <div>
              <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3 px-2">Documents</h3>
              {isSearching ? (
                <div className="px-2 py-4 text-xs text-white/30 animate-pulse">Searching your cloud...</div>
              ) : fileResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-1">
                  {fileResults.map((file) => (
                    <button 
                      key={file._id}
                      onClick={() => onAppClick && onAppClick({ name: file.type, data: file })}
                      className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group text-left"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                        {file.type === 'word' && <FileText className="w-5 h-5 text-blue-400" />}
                        {file.type === 'excel' && <Table className="w-5 h-5 text-emerald-400" />}
                        {file.type === 'powerpoint' && <Presentation className="w-5 h-5 text-orange-400" />}
                        {file.type === 'audio' && <Music className="w-5 h-5 text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/90 font-medium">{file.name}</p>
                        <p className="text-[11px] text-white/30 truncate">Cloud Storage &bull; {new Date(file.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-2 py-8 text-center">
                  <p className="text-xs text-white/20">No matching documents found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Pinned</h3>
                <button className="text-[11px] text-blue-400 hover:text-blue-300 font-medium">All apps &gt;</button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-6">
                {pinnedApps.map((app, index) => (
                  <button 
                    key={index} 
                    className="flex flex-col items-center gap-3 group px-2"
                    onClick={() => onAppClick && onAppClick(app)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAppContextMenu(e, 'app', app);
                    }}
                  >
                    <div className={`w-12 h-12 ${app.color} rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-200 overflow-hidden`}>
                      <div className="group-hover:brightness-125 transition-all">
                        {app.icon}
                      </div>
                    </div>
                    <span className="text-[11px] text-white/70 group-hover:text-white transition-colors text-center truncate w-full">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </>
        )}
      </div>

      {/* Bottom Profile/Power bar */}
      <div className="h-20 bg-black/20 flex items-center justify-between px-8 border-t border-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4 hover:bg-white/5 p-2 pr-4 rounded-xl transition-all cursor-pointer group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border border-white/20 shadow-lg capitalize">
            <span className="text-xs font-bold text-white">{user?.[0] || 'U'}</span>
          </div>
          <span className="text-xs text-white/90 font-semibold tracking-wide group-hover:text-white transition-colors">{user || 'User Account'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onLogout}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all group relative"
            title="Sign out"
          >
            <svg className="w-5 h-5 text-white/40 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;

