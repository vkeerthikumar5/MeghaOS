import React, { useEffect, useRef, useState } from 'react';
import jspreadsheet from 'jspreadsheet-ce';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import { createFile } from '../utils/fs';
import { Save, Share2, Grid3X3, Download, FileSpreadsheet } from 'lucide-react';

const ExcelApp = ({ file }) => {
  const jRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file?._id && jRef.current && !jRef.current.jspreadsheet) {
      jspreadsheet(jRef.current, {
        data: [
          ['Product', 'Qty', 'Price', 'Total'],
          ['Cloud Storage', '1', '0', '0'],
          ['Premium OS', '1', '10', '10'],
        ],
        columns: [
          { type: 'text', title: 'A', width: 200 },
          { type: 'numeric', title: 'B', width: 100 },
          { type: 'numeric', title: 'C', width: 100, mask: '$ #.##0,00' },
          { type: 'numeric', title: 'D', width: 120, mask: '$ #.##0,00' },
        ],
        minDimensions: [20, 50],
        tableOverflow: true,
        tableWidth: '100%',
        tableHeight: '100%',
        defaultColWidth: 100,
        contextMenu: true,
      });
    }
  }, [file]);

  const handleCreate = async () => {
    try {
      const name = prompt("Enter name for spreadsheet:", "Book.xlsx") || "Untitled.xlsx";
      setLoading(true);
      await createFile(name, 'excel', 'null');
      window.location.reload();
    } catch (err) {
      alert("Save failed.");
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-emerald-600 animate-pulse font-bold text-center">Launching MeghSheets...</div>;

  return (
    <div className="w-full h-full bg-[#f3f2f1] flex flex-col overflow-hidden">
      {!file?._id ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-6">
           <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mb-6 text-white font-bold text-3xl shadow-lg animate-in zoom-in duration-300">X</div>
           <h2 className="text-2xl font-bold text-gray-800 mb-2">MeghSheets Spreadsheet</h2>
           <p className="text-gray-500 mb-8 max-w-xs">Analyze data and build powerful reports with cloud-synced spreadsheets.</p>
           <button 
             onClick={handleCreate}
             className="px-10 py-4 bg-[#217346] text-white rounded-xl font-bold shadow-xl hover:bg-emerald-800 transition-all"
           >
             Create New Spreadsheet
           </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
           {/* Excel Ribbon */}
           <div className="bg-[#217346] text-white shadow-md z-10">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs font-medium">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
                       <FileSpreadsheet className="w-3.5 h-3.5" />
                       <span>File</span>
                    </div>
                    <div className="h-3 w-[1px] bg-white/20" />
                    <span className="opacity-80 truncate">{file.name} - Online</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-emerald-100 cursor-default">
                       <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                       Synced
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-1 px-4 py-3">
                 <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-all min-w-[60px]">
                    <Save className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold tracking-tight">Save</span>
                 </button>
                 <div className="h-8 w-[1px] bg-white/10 mx-1" />
                 <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-all min-w-[60px]">
                    <Share2 className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold tracking-tight">Share</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-all min-w-[60px]">
                    <Download className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold tracking-tight">Export</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-all min-w-[60px]">
                    <Grid3X3 className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold tracking-tight">Format</span>
                 </button>
              </div>
           </div>

           {/* Formula Bar Simulation */}
           <div className="bg-white border-b border-gray-200 flex items-center px-4 py-1.5 gap-2 text-sm">
              <div className="italic text-gray-400 font-serif border-r border-gray-200 pr-3 mr-1">fx</div>
              <input 
                type="text" 
                className="flex-1 outline-none text-gray-700 bg-transparent" 
                placeholder="Enter formula or text..."
              />
           </div>

           {/* Spreadsheet Engine */}
           <div className="flex-1 overflow-hidden p-0 bg-white sheet-container">
             <div ref={jRef} className="w-full h-full" />
           </div>

           <style dangerouslySetInnerHTML={{ __html: `
              .sheet-container .jss_container {
                width: 100% !important;
                height: 100% !important;
              }
              .jexcel > thead > tr > td {
                background-color: #f8f9fa !important;
                color: #5f6368 !important;
                font-size: 11px !important;
                border: 1px solid #e2e8f0 !important;
                padding: 4px !important;
              }
              .jexcel > tbody > tr > td {
                font-size: 13px !important;
                border: 1px solid #f1f3f4 !important;
                padding: 4px 8px !important;
                font-family: 'Inter', sans-serif !important;
              }
              .jexcel > tbody > tr > td:first-child {
                background: #f8f9fa !important;
                text-align: center !important;
                color: #5f6368 !important;
                font-weight: 500 !important;
              }
              .jexcel_content {
                box-shadow: none !important;
              }
              .jss_toolbar {
                display: none !important;
              }
           `}} />
        </div>
      )}
    </div>
  );
};

export default ExcelApp;

