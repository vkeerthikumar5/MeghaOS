import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  HardDrive, 
  Folder, 
  FileText, 
  Table, 
  Presentation, 
  Search,
  Grid,
  Menu,
  Clock,
  Star,
  Plus,
  RefreshCcw,
  Trash2,
  Edit2,
  Info,
  ExternalLink,
  X,
  Music
} from 'lucide-react';
import { getFS, createFile, deleteFile, renameFile } from '../utils/fs';

const FileManager = ({ initialPath = 'null', onOpenFile, onMoveToBin, refreshKey }) => {
  const [items, setItems] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(initialPath);
  const [currentFolderName, setCurrentFolderName] = useState('D: Drive');
  const [history, setHistory] = useState([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
  const [detailsModal, setDetailsModal] = useState({ visible: false, item: null });

  const fetchItems = async (folderId) => {
    setLoading(true);
    const data = await getFS(folderId);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(currentFolderId);
  }, [currentFolderId, refreshKey]);

  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const navigateTo = (folder) => {
    const id = folder._id;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(id);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(id);
    setCurrentFolderName(folder.name);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFolderId(history[historyIndex - 1]);
      setCurrentFolderName(historyIndex - 1 === 0 ? 'D: Drive' : 'Subfolder');
    }
  };

  const handleCreate = async (type) => {
    const name = type === 'folder' ? 'New Folder' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    await createFile(name, type, currentFolderId);
    fetchItems(currentFolderId);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Move ${item.name} to Recycle Bin?`)) {
      setItems(prev => prev.filter(i => i._id !== item._id));
      await onMoveToBin(item);
    }
  };

  const handleRename = async (item) => {
    const newName = window.prompt("Enter new name:", item.name);
    if (newName && newName.trim() !== '') {
      await renameFile(item._id, newName);
      fetchItems(currentFolderId);
    }
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('itemId', item._id);
  };

  const handleDrop = async (e, targetFolder) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    if (itemId === targetFolder._id) return;
    
    await moveFile(itemId, targetFolder._id);
    fetchItems(currentFolderId);
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item });
  };

  const executeAction = (e, action) => {
    e.stopPropagation();
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
    const { item } = contextMenu;
    
    switch(action) {
      case 'open':
        item.type === 'folder' ? navigateTo(item) : onOpenFile(item);
        break;
      case 'rename':
        handleRename(item);
        break;
      case 'delete':
        handleDelete(item);
        break;
      case 'details':
        setDetailsModal({ visible: true, item });
        break;
      default: break;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'folder': return <Folder className="w-10 h-10 text-yellow-500 fill-yellow-500" />;
      case 'word': return <FileText className="w-10 h-10 text-blue-500 fill-blue-500/20" />;
      case 'excel': return <Table className="w-10 h-10 text-emerald-500 fill-emerald-500/20" />;
      case 'powerpoint': return <Presentation className="w-10 h-10 text-orange-500 fill-orange-500/20" />;
      case 'notepad': return <FileText className="w-10 h-10 text-blue-500 fill-blue-500/20" />;
      case 'audio': return <Music className="w-10 h-10 text-purple-500 fill-purple-500/20" />;
      default: return <FileText className="w-10 h-10 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-white/90 font-sans relative">
      {/* Search & Navigation Bar */}
      <div className="h-10 bg-white/5 flex items-center px-2 sm:px-4 gap-2 sm:gap-4 border-b border-white/5 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button onClick={goBack} disabled={historyIndex === 0} className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 bg-white/5 rounded px-3 py-1 text-xs border border-white/10 flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 opacity-50" />
          <span className="opacity-50">This PC</span>
          <ChevronRight className="w-3 h-3 opacity-30" />
          <span className="font-medium">{currentFolderName}</span>
        </div>

        <button onClick={() => fetchItems(currentFolderId)} className="p-1.5 hover:bg-white/10 rounded-md">
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2">
        <div className="relative group">
          <button className="flex items-center gap-2 text-[11px] bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded transition-colors font-bold">
            <Plus className="w-3.5 h-3.5" /> New
          </button>
          <div className="absolute top-full left-0 mt-1 w-40 bg-[#2c2c2e] border border-white/10 rounded-lg shadow-xl hidden group-hover:block z-50 p-1">
            <button onClick={() => handleCreate('folder')} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded flex items-center gap-2 text-xs text-white/70"><Folder className="w-3 h-3 text-yellow-500"/> Folder</button>
            <button onClick={() => handleCreate('word')} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded flex items-center gap-2 text-xs text-white/70"><FileText className="w-3 h-3 text-blue-500"/> Word Doc</button>
            <button onClick={() => handleCreate('excel')} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded flex items-center gap-2 text-xs text-white/70"><Table className="w-3 h-3 text-emerald-500"/> Spreadsheet</button>
            <button onClick={() => handleCreate('powerpoint')} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded flex items-center gap-2 text-xs text-white/70"><Presentation className="w-3 h-3 text-orange-500"/> Presentation</button>
            <button onClick={() => handleCreate('notepad')} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded flex items-center gap-2 text-xs text-white/70"><FileText className="w-3 h-3 text-blue-500"/> Notepad Text</button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 p-6 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] grid-rows-[repeat(auto-fill,120px)] content-start gap-4 overflow-y-auto bg-black/10 relative">
          {loading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
               <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {items.map((item) => (
            <div 
              key={item._id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => item.type === 'folder' && e.preventDefault()}
              onDrop={(e) => item.type === 'folder' && handleDrop(e, item)}
              className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all group cursor-default relative"
              onClick={() => {
                // Support single click for touch/mobile devices (tablets inclusive)
                if (window.innerWidth < 1024) {
                  item.type === 'folder' ? navigateTo(item) : onOpenFile(item);
                }
              }}
              onDoubleClick={() => item.type === 'folder' ? navigateTo(item) : onOpenFile(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <div className="transition-transform group-hover:scale-110 pointer-events-none">
                {getIcon(item.type)}
              </div>
              <span className="text-[11px] text-center line-clamp-2 leading-tight px-1 font-medium group-hover:text-blue-400 pointer-events-none">
                {item.name}
              </span>
            </div>
          ))}
          
          {!loading && items.length === 0 && (
            <div className="col-span-full h-full flex flex-col items-center justify-center opacity-20">
              <Folder className="w-12 h-12 mb-2" />
              <span className="text-sm">This folder is empty</span>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu Backdrop/Portal */}
      {contextMenu.visible && (
        <div 
          className="fixed z-[9999] bg-[#2c2c2e]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl py-1 w-48 font-sans"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={(e) => executeAction(e, 'open')} className="w-full text-left px-4 py-2 hover:bg-blue-500/20 hover:text-blue-400 text-xs flex items-center gap-3 transition-colors text-white/80">
            <ExternalLink className="w-3.5 h-3.5" /> Open
          </button>
          <div className="h-px bg-white/10 my-1"></div>
          <button onClick={(e) => executeAction(e, 'rename')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-xs flex items-center gap-3 transition-colors text-white/80">
            <Edit2 className="w-3.5 h-3.5" /> Rename
          </button>
          <button onClick={(e) => executeAction(e, 'delete')} className="w-full text-left px-4 py-2 hover:bg-red-500/20 hover:text-red-400 text-xs flex items-center gap-3 transition-colors text-white/80">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <div className="h-px bg-white/10 my-1"></div>
          <button onClick={(e) => executeAction(e, 'details')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-xs flex items-center gap-3 transition-colors text-white/80">
            <Info className="w-3.5 h-3.5" /> Properties / Details
          </button>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal.visible && detailsModal.item && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
           <div className="w-[360px] bg-[#2c2c2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                 <h3 className="text-sm font-semibold flex items-center gap-2">
                    {getIcon(detailsModal.item.type)} 
                    Properties
                 </h3>
                 <button onClick={() => setDetailsModal({visible: false, item: null})} className="p-1 hover:bg-white/10 rounded-md">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              <div className="p-5 space-y-4">
                 <div className="bg-black/20 p-4 rounded-xl flex items-center gap-4">
                    {getIcon(detailsModal.item.type)}
                    <div>
                       <div className="font-bold text-sm truncate w-48">{detailsModal.item.name}</div>
                       <div className="text-[10px] text-white/40 uppercase tracking-widest">{detailsModal.item.type === 'folder' ? 'File Folder' : `${detailsModal.item.type} Document`}</div>
                    </div>
                 </div>

                 <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                       <span className="text-white/40">Location</span>
                       <span className="font-medium">D:\ {detailsModal.item.type === 'folder' ? '' : 'Uploads'}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                       <span className="text-white/40">Size</span>
                       <span className="font-medium">{detailsModal.item.type === 'folder' ? '--' : '42 KB'}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                       <span className="text-white/40">Created</span>
                       <span className="font-medium">{formatDate(detailsModal.item.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-xs pb-2">
                       <span className="text-white/40">Modified</span>
                       <span className="font-medium">{formatDate(detailsModal.item.updatedAt)}</span>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end">
                 <button onClick={() => setDetailsModal({visible: false, item: null})} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-lg">OK</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
