import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { createFile } from '../utils/fs';
import { Save, Printer, Share2, Download, FileText, ChevronDown } from 'lucide-react';

const WordApp = ({ file }) => {
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (file?._id && editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
          ],
        },
        placeholder: 'Once upon a time in the cloud...',
      });
    }
  }, [file]);

  const handleSaveToCloud = async () => {
    try {
      const name = prompt("Enter name for document:", "Document.docx") || "Untitled.docx";
      setLoading(true);
      await createFile(name, 'word', 'null');
      window.location.reload();
    } catch (err) {
      alert("Save failed.");
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-blue-600 animate-pulse font-bold text-center">Launching MeghWord...</div>;

  return (
    <div className="w-full h-full flex flex-col bg-[#f3f2f1] overflow-hidden">
      {!file?._id ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
           <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 text-white font-bold text-3xl shadow-lg">W</div>
           <h2 className="text-2xl font-bold text-gray-800 mb-2">MeghWord Document</h2>
           <p className="text-gray-500 mb-8 max-w-xs">Start your next great project with a clean, cloud-synced document.</p>
           <button 
             onClick={handleSaveToCloud}
             className="px-10 py-4 bg-[#185abd] text-white rounded-xl font-bold shadow-xl hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all"
           >
             Create New Document
           </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Ribbon Style Header */}
          <div className="bg-[#185abd] text-white p-1 shadow-md z-10">
            <div className="flex items-center justify-between px-4 py-1 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-2 hover:bg-white/10 rounded cursor-pointer transition-colors">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-semibold">File</span>
                </div>
                <div className="h-4 w-[1px] bg-white/20" />
                <span className="text-xs opacity-90 font-medium truncate max-w-[200px]">{file.name} - Saved</span>
              </div>
              <div className="flex items-center gap-3">
                <button title="Recent Files" className="p-1.5 hover:bg-white/10 rounded transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-1 px-4 py-2 bg-[#185abd] overflow-x-auto no-scrollbar">
              <button title="Save (Ctrl+S)" className="p-2 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-all group">
                <Save className="w-4 h-4 group-hover:scale-110" />
                <span className="text-[10px] sm:inline hidden uppercase tracking-wider font-bold">Save</span>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-all">
                <Printer className="w-4 h-4" />
                <span className="text-[10px] sm:inline hidden uppercase tracking-wider font-bold">Print</span>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-all">
                <Share2 className="w-4 h-4" />
                <span className="text-[10px] sm:inline hidden uppercase tracking-wider font-bold">Share</span>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-all">
                <Download className="w-4 h-4" />
                <span className="text-[10px] sm:inline hidden uppercase tracking-wider font-bold">Export</span>
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-12 flex justify-center custom-scrollbar bg-[#f3f2f1]">
            <div className="w-full max-w-[816px] min-h-[1056px] bg-white shadow-2xl rounded-sm transition-shadow p-2 sm:p-4 mb-12 flex flex-col">
              <div ref={editorRef} className="flex-1 word-editor" />
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .word-editor.ql-toolbar.ql-snow {
              border: none;
              border-bottom: 1px solid #e2e8f0;
              background: #fafafa;
              position: sticky;
              top: 0;
              z-index: 5;
            }
            .ql-toolbar.ql-snow {
              border: none !important;
              border-bottom: 1px solid #f1f1f1 !important;
              padding: 12px 20px !important;
            }
            .ql-container.ql-snow {
              border: none !important;
              font-family: 'Inter', sans-serif !important;
              font-size: 16px !important;
              flex: 1;
            }
            .ql-editor {
              min-height: 900px;
              padding: 60px !important;
              line-height: 1.8 !important;
            }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />
        </div>
      )}
    </div>
  );
};

export default WordApp;




