import React, { useState, useEffect, useCallback } from 'react';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import Window from './Window';
import WordApp from './WordApp';
import ExcelApp from './ExcelApp';
import PowerPointApp from './PowerPointApp';
import NotepadApp from './NotepadApp';
import MeghPlayer from './MeghPlayer';
import MeghExplorer from './MeghExplorer';
import FileManager from './FileManager';
import TaskManager from './TaskManager';
import { FileText, Table, Presentation, HardDrive, Trash2, Recycle, RotateCcw, Cloud, Globe, Music, Activity } from 'lucide-react';
import { getFS, createFile, deleteFile, moveFile } from '../utils/fs';

const Desktop = ({ user }) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: 'desktop', targetApp: null });
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  // Recycle Bin state
  const [recycleBin, setRecycleBin] = useState(() => {
    const saved = localStorage.getItem('recycleBin');
    return saved ? JSON.parse(saved) : [];
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [systemVolume, setSystemVolume] = useState(80);
  const [isSystemMuted, setIsSystemMuted] = useState(false);

  useEffect(() => {
    localStorage.setItem('recycleBin', JSON.stringify(recycleBin));
  }, [recycleBin]);

  // Pinned taskbar apps state
  const [pinnedTaskbarApps, setPinnedTaskbarApps] = useState([
    { name: "File Explorer", type: 'filemanager', icon: <HardDrive className="w-4 h-4 text-blue-400" />, color: 'bg-white/10' },
    { name: "MeghExplorer", type: 'meghexplorer', icon: <Globe className="w-4 h-4 text-blue-400" />, color: 'bg-white/10' }
  ]);

  // Desktop Icons state
  const [desktopApps, setDesktopApps] = useState([
    {
      id: 'thispc', name: "This PC", color: "bg-blue-500/30", icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ), type: 'filemanager'
    },
    {
      id: 'meghexplorer_desktop', name: "MeghExplorer", color: "bg-blue-600/30", icon: <Cloud className="w-6 h-6 text-white" />, type: 'meghexplorer'
    },
    { id: 'recyclebin', name: "Recycle Bin", color: "bg-gray-500/30", icon: <Recycle className="w-6 h-6 text-emerald-400" />, type: 'recyclebin' },
    { id: 'meghplayer', name: "Megh Player", color: "bg-purple-600/30", icon: <Music className="w-6 h-6 text-purple-400" />, type: 'meghplayer' },
  ]);

  const appIcons = {
    word: <FileText className="w-6 h-6 text-blue-400" />,
    excel: <Table className="w-6 h-6 text-emerald-400" />,
    powerpoint: <Presentation className="w-6 h-6 text-orange-400" />,
    notepad: <FileText className="w-6 h-6 text-blue-400" />,
    meghplayer: <Music className="w-6 h-6 text-purple-400" />,
    filemanager: <HardDrive className="w-6 h-6 text-blue-400" />,
    meghexplorer: <Cloud className="w-6 h-6 text-white shadow-sm" />,
    taskmanager: <Activity className="w-6 h-6 text-red-400" />,
    audio: <Music className="w-6 h-6 text-purple-400" />
  };

  const appIconsSmall = {
    word: <FileText className="w-4 h-4 text-blue-400" />,
    excel: <Table className="w-4 h-4 text-emerald-400" />,
    powerpoint: <Presentation className="w-4 h-4 text-orange-400" />,
    notepad: <FileText className="w-4 h-4 text-blue-400" />,
    meghplayer: <Music className="w-4 h-4 text-purple-400" />,
    filemanager: <HardDrive className="w-4 h-4 text-blue-400" />,
    meghexplorer: <Cloud className="w-4 h-4 text-white shadow-sm" />,
    taskmanager: <Activity className="w-4 h-4 text-red-400" />,
    audio: <Music className="w-4 h-4 text-purple-400" />
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleDragStart = (e, app) => {
    if (app.type === 'filemanager' || app.type === 'recyclebin') return; // Don't drag system folders for now
    e.dataTransfer.setData('appId', app.id);
  };

  const handleDropOnFolder = async (e, targetFolder) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('appId');
    console.log(`Dropped ${appId} into folder ${targetFolder.name}`);
  };

  const handleRestore = async (item) => {
    try {
      await createFile(item.name, item.type, item.parentId || 'null');
      setRecycleBin(prev => prev.filter(i => i._id !== item._id));
      setRefreshKey(prev => prev + 1);
      alert(`${item.name} has been restored to Cloud storage.`);
    } catch (err) {
      alert('Error restoring file.');
    }
  };

  const handleRestoreAll = async () => {
    if (recycleBin.length === 0) return;
    try {
      for (const item of recycleBin) {
        await createFile(item.name, item.type, item.parentId || 'null');
      }
      setRecycleBin([]);
      setRefreshKey(prev => prev + 1);
      alert('All items have been restored to Cloud storage.');
    } catch (err) {
      alert('Error restoring some items.');
    }
  };

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!activeWindow) return;

        const win = openWindows.find(w => w.id === activeWindow);
        if (win && (!win.data || !win.data._id) && ['word', 'excel', 'powerpoint', 'notepad'].includes(win.type)) {
          const name = window.prompt(`Save ${win.type} file. Enter filename:`, `Untilted_${win.type}`);
          if (name && name.trim() !== '') {
            try {
              const savedFile = await createFile(name, win.type, 'null');
              setOpenWindows(prev => prev.map(w => w.id === win.id ? { ...w, data: savedFile, title: savedFile.name } : w));
              alert(`${name} saved successfully to Cloud storage!`);
            } catch (err) {
              alert('Error saving file. Server might be down.');
            }
          }
        } else if (win && win.data && win.data._id && ['word', 'excel', 'powerpoint', 'notepad'].includes(win.type)) {
          // It's already saved, and since OnlyOffice handles autosaves/commits, we just notify.
          console.log("Ctrl+S pushed to cloud sync queue (handled by OnlyOffice).");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openWindows, activeWindow]);

  const openApp = (type, data = null) => {
    const id = `win_${Date.now()}`;
    const newWindow = {
      id,
      type,
      title: data?.name || type.charAt(0).toUpperCase() + type.slice(1),
      data,
      zIndex: (Math.max(100, ...openWindows.map(w => w.zIndex), 100)) + 1,
      minimized: false,
      icon: appIcons[type]
    };
    setOpenWindows(prev => [...prev, newWindow]);
    setActiveWindow(id);
    setIsStartOpen(false);
  };

  const closeWindow = async (id) => {
    const win = openWindows.find(w => w.id === id);
    if (win && (!win.data || !win.data._id) && ['word', 'excel', 'powerpoint', 'notepad'].includes(win.type)) {
      if (window.confirm(`Do you want to save this new ${win.type} document before closing?`)) {
        const name = window.prompt(`Enter filename for ${win.type}:`, `New_${win.type}`);
        if (name && name.trim() !== '') {
          try {
            await createFile(name, win.type, 'null');
            // Saved successfully
          } catch (err) {
            alert('Error saving. Closing without saving.');
          }
        }
      }
    }
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id) => setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  const focusWindow = (id) => {
    setActiveWindow(id);
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: Math.max(100, ...prev.map(win => win.zIndex)) + 1, minimized: false } : w));
  };

  const handleCreateFile = (type) => {
    openApp(type);
  };

  const desktopOptions = [
    { label: 'New Word Doc', icon: <FileText className="w-4 h-4 text-blue-400" />, onClick: () => handleCreateFile('word') },
    { label: 'New Spreadsheet', icon: <Table className="w-4 h-4 text-emerald-400" />, onClick: () => handleCreateFile('excel') },
    { label: 'New Presentation', icon: <Presentation className="w-4 h-4 text-orange-400" />, onClick: () => handleCreateFile('powerpoint') },
    { label: 'New Notepad Text', icon: <FileText className="w-4 h-4 text-blue-400" />, onClick: () => handleCreateFile('notepad') },
    { type: 'separator' },
    { label: 'Task Manager', icon: <Activity className="w-4 h-4 text-red-400" />, onClick: () => openApp('taskmanager') },
    { label: 'Refresh', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>, onClick: () => window.location.reload() },
  ];



  return (
    <div
      className="fixed inset-0 bg-[#0f111a] overflow-hidden select-none"
      onClick={() => setIsStartOpen(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, type: 'desktop' });
      }}
    >
      {/* Wallpaper */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col items-center justify-center">
        {/* Previous Minimalist Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/5 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600/5 blur-[150px] rounded-full" />

        {/* Mild Central Branding */}
        <div className="flex flex-col items-center gap-2 opacity-10 animate-in fade-in duration-1000">
          <div className="w-12 h-12 border border-white/10 rounded-2xl flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl tracking-[0.3em] text-white">
              <span className="font-bold text-sky-400">MEGH</span>OS
            </h1>
            <p className="text-[7px] uppercase tracking-[0.5em] mt-2 text-white font-medium">
              Your Desktop in the Cloud
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="relative z-10 w-full sm:w-24 h-[calc(100vh-48px)] flex flex-col items-start gap-1 p-2 pt-4">
        {desktopApps.map((app) => (
          <div
            key={app.id}
            draggable={app.type !== 'filemanager' && app.type !== 'recyclebin'}
            onDragStart={(e) => handleDragStart(e, app)}
            onDragOver={(e) => app.type === 'filemanager' && e.preventDefault()}
            onDrop={(e) => app.type === 'filemanager' && handleDropOnFolder(e, app)}
            onClick={() => {
              if (window.innerWidth < 768) {
                openApp(app.type);
              }
            }}
            onDoubleClick={() => openApp(app.type)}
          >
            <DesktopIcon
              name={app.name}
              icon={app.icon}
              color={app.color}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Reuse the same logic as Start Menu for consistency
                const appType = app.type;
                setContextMenu({
                  visible: true,
                  x: e.clientX,
                  y: e.clientY,
                  type: 'app',
                  options: [
                    { label: 'Open', icon: appIconsSmall[appType], onClick: () => { openApp(appType); } },
                    { type: 'separator' },
                    {
                      label: 'Pin to Taskbar',
                      icon: <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
                      onClick: () => {
                        if (!pinnedTaskbarApps.find(a => a.type === appType)) {
                          setPinnedTaskbarApps(prev => [...prev, {
                            name: app.name,
                            type: appType,
                            icon: appIconsSmall[appType],
                            color: app.color.replace('/40', '/20')
                          }]);
                        }
                      }
                    }
                  ]
                });
              }}
            />
          </div>
        ))}
      </div>

      {/* Windows Layer */}
      {openWindows.map((win) => (
        !win.minimized && (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            zIndex={win.zIndex}
            icon={win.icon}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={() => focusWindow(win.id)}
          >
            {win.type === 'word' && <WordApp file={win.data} />}
            {win.type === 'excel' && <ExcelApp file={win.data} />}
            {win.type === 'powerpoint' && <PowerPointApp file={win.data} />}
            {win.type === 'notepad' && <NotepadApp file={win.data} />}
            {(win.type === 'meghplayer' || win.type === 'naadaplayer' || win.type === 'audio') && (
              <MeghPlayer
                file={win.data}
                systemVolume={systemVolume}
                isSystemMuted={isSystemMuted}
              />
            )}
            {win.type === 'taskmanager' && (
              <TaskManager
                openWindows={openWindows}
                onCloseWindow={closeWindow}
              />
            )}
            {win.type === 'meghexplorer' && <MeghExplorer />}
            {win.type === 'filemanager' && (
              <FileManager
                refreshKey={refreshKey}
                onOpenFile={(file) => openApp(file.type, file)}
                onMoveToBin={async (file) => {
                  try {
                    await deleteFile(file._id);
                    setRecycleBin(prev => [...prev, file]);
                  } catch (err) {
                    alert('Error moving to bin. Server might be sync issues.');
                  }
                }}
              />
            )}
            {win.type === 'recyclebin' && (
              <div className="p-4 h-full bg-[#1c1c1e] text-white overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
                    <Recycle className="w-5 h-5" /> Recycle Bin
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRestoreAll}
                      className="text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore All
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Permanently delete all items in Recycle Bin?')) {
                          recycleBin.forEach(item => deleteFile(item._id));
                          setRecycleBin([]);
                        }
                      }}
                      className="text-xs bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Empty Bin
                    </button>
                  </div>
                </div>
                {recycleBin.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center opacity-20">
                    <Trash2 className="w-12 h-12 mb-2" />
                    <span>Recycle Bin is empty</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {recycleBin.map(item => (
                      <div
                        key={item._id}
                        className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded-lg group relative border border-white/5"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            type: 'recycleItem',
                            options: [
                              {
                                label: 'Restore',
                                icon: <RotateCcw className="w-4 h-4 text-emerald-400" />,
                                onClick: () => { handleRestore(item); }
                              },
                              {
                                label: 'Delete Permanently',
                                icon: <Trash2 className="w-4 h-4 text-red-400" />,
                                onClick: async () => {
                                  if (window.confirm(`Permanently delete ${item.name}?`)) {
                                    await deleteFile(item._id);
                                    setRecycleBin(prev => prev.filter(i => i._id !== item._id));
                                  }
                                }
                              },
                            ]
                          });
                        }}
                      >
                        <div className="text-gray-500 opacity-60">
                          {appIcons[item.type] || <FileText className="w-6 h-6" />}
                        </div>
                        <span className="text-[10px] text-center truncate w-full px-1">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Window>
        )
      ))}

      {/* Menus */}
      <StartMenu
        user={user}
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          window.location.reload();
        }}
        onAppClick={(app) => openApp(app.type || app.name.toLowerCase(), app.data)}
        onAppContextMenu={(e, type, app) => {
          e.preventDefault();
          const appType = app.name.toLowerCase();
          setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            type: 'app',
            options: [
              { label: 'Open', icon: appIconsSmall[appType], onClick: () => { openApp(appType); } },
              { type: 'separator' },
              {
                label: 'Pin to Taskbar',
                icon: <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
                onClick: () => {
                  if (!pinnedTaskbarApps.find(a => a.type === appType)) {
                    setPinnedTaskbarApps(prev => [...prev, {
                      name: app.name,
                      type: appType,
                      icon: appIconsSmall[appType],
                      color: app.color.replace('/40', '/20') // slightly less opaque
                    }]);
                  }
                  setIsStartOpen(false);
                }
              },
              {
                label: 'Add to Desktop',
                icon: <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                onClick: () => {
                  if (!desktopApps.find(a => a.type === appType)) {
                    setDesktopApps(prev => [...prev, {
                      id: `desktop_${appType}`,
                      name: app.name,
                      type: appType,
                      icon: appIcons[appType],
                      color: app.color
                    }]);
                  }
                  setIsStartOpen(false);
                }
              },
            ]
          });
        }}
      />

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        options={contextMenu.type === 'desktop' ? desktopOptions : contextMenu.options}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
      />

      <Taskbar
        onStartClick={(e) => { e.stopPropagation(); setIsStartOpen(!isStartOpen); }}
        isStartOpen={isStartOpen}
        pinnedApps={pinnedTaskbarApps}
        openWindows={openWindows}
        onWindowClick={focusWindow}
        onAppClick={openApp}
        onWindowClose={closeWindow}
        systemVolume={systemVolume}
        setSystemVolume={setSystemVolume}
        isSystemMuted={isSystemMuted}
        setIsSystemMuted={setIsSystemMuted}
      />
    </div>
  );
};

export default Desktop;
