import React, { useState, useEffect, useRef } from 'react';
import { Save, FileText, ChevronDown, Share2, Download, Trash2, Printer, Search, Settings, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { saveFileContent, createFile, getFile } from '../utils/fs';

const NotepadApp = ({ file }) => {
  const [content, setContent] = useState(file?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saved' or null
  const [activeTab, setActiveTab] = useState('File');

  useEffect(() => {
    const fetchLatest = async () => {
      if (file?._id) {
        try {
          const latest = await getFile(file._id);
          if (latest && latest.content !== undefined) {
             setContent(latest.content);
          }
        } catch (err) {
          console.error("Failed to fetch latest content");
        }
      }
    };
    fetchLatest();
  }, [file?._id]);

  const handleSave = async () => {
    if (!file?._id) {
       const name = prompt("Enter name for text file:", "Untitled.txt") || "Untitled.txt";
       try {
         const newFile = await createFile(name, 'notepad', 'null');
         await saveFileContent(newFile._id, content);
         setSaveStatus('saved');
         setTimeout(() => setSaveStatus(null), 3000);
         alert("File saved successfully!");
         window.location.reload();
       } catch (err) {
         alert("Failed to save.");
       }
       return;
    }

    setIsSaving(true);
    setSaveStatus(null);
    try {
      await saveFileContent(file._id, content);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert('Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = ['File', 'Edit', 'Format', 'View', 'Help'];

  return (
    <div className="w-full h-full bg-[#f9f9f9] flex flex-col overflow-hidden font-sans">
      {/* Premium Ribbon Area */}
      <div className="bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
        <div className="flex items-center px-4 py-2 border-b border-gray-100 bg-[#f3f2f1] text-[11px] font-medium text-gray-600">
           <div className="flex items-center gap-2 mr-4">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span className="truncate max-w-[150px]">{file?.name || 'Untitled'} - Notepad</span>
           </div>
           {isSaving && <div className="text-blue-500 animate-pulse ml-auto flex items-center gap-1.5 font-bold"><Save className="w-3 h-3" /> Saving...</div>}
           {saveStatus === 'saved' && <div className="text-emerald-500 ml-auto flex items-center gap-1.5 font-bold animate-in fade-in zoom-in duration-300"><CheckCircle2 className="w-3.5 h-3.5" /> All changes saved</div>}
        </div>

        {/* Tab Selection */}
        <div className="flex items-center px-2 pt-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-medium rounded-t-lg transition-colors ${
                activeTab === tab ? 'bg-white text-blue-700 border-x border-t border-gray-200 -mb-px relative z-20' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Ribbon Content */}
        <div className="h-20 bg-white px-6 py-2 flex items-center gap-1 border-t border-gray-200">
          {activeTab === 'File' && (
            <>
              <button 
                onClick={handleSave}
                className="flex flex-col items-center justify-center gap-1.5 p-2 px-4 hover:bg-blue-50 rounded-lg group transition-all"
              >
                <Save className="w-5 h-5 text-blue-600 group-active:scale-90 transition-transform" />
                <span className="text-[10px] font-bold text-gray-700">Save</span>
              </button>
              <div className="w-px h-10 bg-gray-200 mx-2" />
              <button className="flex flex-col items-center justify-center gap-1.5 p-2 px-4 hover:bg-gray-100 rounded-lg group transition-all">
                <Printer className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-700">Print</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1.5 p-2 px-4 hover:bg-gray-100 rounded-lg group transition-all">
                <Share2 className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-700">Share</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1.5 p-2 px-4 hover:bg-gray-100 rounded-lg group transition-all">
                <Download className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-700">Export</span>
              </button>
            </>
          )}

          {activeTab === 'Edit' && (
            <>
              <button 
                onClick={() => {
                  const textarea = document.getElementById('notepad-textarea');
                  textarea.focus();
                  document.execCommand('undo');
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2 px-4 hover:bg-gray-100 rounded-lg transition-all"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                <span className="text-[10px] font-bold text-gray-700">Undo</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1.5 p-2 px-4 hover:bg-gray-100 rounded-lg transition-all">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-700">Find</span>
              </button>
              <div className="w-px h-10 bg-gray-200 mx-2" />
              <button 
                onClick={() => setContent('')}
                className="flex flex-col items-center justify-center gap-1.5 p-2 px-4 hover:bg-red-50 rounded-lg group transition-all"
              >
                <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-500" />
                <span className="text-[10px] font-bold text-gray-700">Clear</span>
              </button>
            </>
          )}

          {(activeTab !== 'File' && activeTab !== 'Edit') && (
            <div className="flex items-center justify-center w-full h-full text-gray-300 italic text-xs">
              This feature is coming soon to MeghOS Notepad
            </div>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 bg-white p-6 overflow-hidden relative">
        <textarea
          id="notepad-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none outline-none border-none font-mono text-sm leading-relaxed text-gray-800 p-8 shadow-inner bg-[#fffdfa]"
          placeholder="Start typing your notes..."
          autoFocus
        />
        
        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#f3f2f1] border-t border-gray-200 px-4 flex items-center justify-between text-[10px] text-gray-500">
           <div className="flex gap-4">
              <span>Lines: {content.split('\n').length}</span>
              <span>Characters: {content.length}</span>
           </div>
           <div className="flex gap-4">
              <span>UTF-8</span>
              <span>Windows (CRLF)</span>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        #notepad-textarea::-webkit-scrollbar {
          width: 12px;
        }
        #notepad-textarea::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        #notepad-textarea::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 6px;
          border: 3px solid #f1f1f1;
        }
        #notepad-textarea::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
      `}} />
    </div>
  );
};

export default NotepadApp;
