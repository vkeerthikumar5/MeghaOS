import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Globe, Search, ExternalLink, ShieldAlert, Cloud } from 'lucide-react';

const MeghExplorer = () => {
  const [url, setUrl] = useState(''); // Empty for home view
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(['']);
  const [histIndex, setHistIndex] = useState(0);
  const iframeRef = useRef(null);

  const handleNavigate = (e, customUrl = null) => {
    if (e) e.preventDefault();
    let targetUrl = customUrl || inputUrl;
    
    if (targetUrl.trim() === '') return;

    // Simple URL validation/formatting
    if (!targetUrl.includes('.') && !targetUrl.startsWith('http')) {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}&igu=1`;
    } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    setUrl(targetUrl);
    setInputUrl(targetUrl);
    
    // Update history
    const newHistory = history.slice(0, histIndex + 1);
    newHistory.push(targetUrl);
    setHistory(newHistory);
    setHistIndex(newHistory.length - 1);
  };

  const goHome = () => {
    setUrl('');
    setInputUrl('');
    const newHistory = history.slice(0, histIndex + 1);
    newHistory.push('');
    setHistory(newHistory);
    setHistIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (histIndex > 0) {
      const prevUrl = history[histIndex - 1];
      setHistIndex(histIndex - 1);
      setUrl(prevUrl);
      setInputUrl(prevUrl);
    }
  };

  const goForward = () => {
    if (histIndex < history.length - 1) {
      const nextUrl = history[histIndex + 1];
      setHistIndex(histIndex + 1);
      setUrl(nextUrl);
      setInputUrl(nextUrl);
    }
  };

  const refresh = () => {
    if (!url) return;
    const currentUrl = url;
    setUrl(''); // Trigger re-render of iframe
    setTimeout(() => setUrl(currentUrl), 10);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1c1c1e] text-white select-none">
      {/* Browser Toolbar */}
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-2 sm:px-4 gap-1.5 sm:gap-4 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <button 
            onClick={goHome}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Home"
          >
            <Cloud className="w-4 h-4 text-blue-400" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button 
            onClick={goBack}
            disabled={histIndex === 0}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={goForward}
            disabled={histIndex === history.length - 1}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={refresh}
            disabled={!url}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1 max-w-3xl relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
            <Globe className="w-3.5 h-3.5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input 
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-sans"
            placeholder="Search or enter web address"
          />
        </form>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Search className="w-4 h-4 text-white/40" />
          </button>
          <div className="w-px h-6 bg-white/10" />
          <a 
            href={url || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${!url ? 'opacity-20 cursor-not-allowed' : ''}`}
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-white/40" />
          </a>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {!url ? (
          /* MeghExplorer Home View */
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1e] to-[#0a0a0f] flex flex-col items-center justify-center p-6 sm:p-8">
            <div className="mb-8 sm:mb-12 flex flex-col items-center animate-in fade-in zoom-in duration-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 sm:mb-6 scale-100 sm:scale-110">
                <Cloud className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-light tracking-[0.2em] sm:tracking-[0.3em] text-white text-center">
                MEGH<span className="font-bold text-blue-500">EXPLORER</span>
              </h2>
              <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2 sm:mt-3 font-medium text-center">
                Your Window to the World
              </p>
            </div>

            <form 
              onSubmit={handleNavigate}
              className="w-full max-w-xl relative group animate-in slide-in-from-bottom-8 duration-1000 px-4 sm:px-0"
            >
              <div className="absolute left-8 sm:left-5 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input 
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 sm:py-4 pl-12 sm:pl-14 pr-24 sm:pr-32 text-sm text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-sans placeholder:text-white/20 shadow-2xl"
                placeholder="Search the web with Megh..."
              />
              <button 
                type="submit"
                className="absolute right-6 sm:right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white text-[9px] sm:text-[10px] font-bold px-3 sm:px-4 py-2 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Search
              </button>
            </form>

            <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-2 sm:gap-4 animate-in fade-in duration-1000 delay-500 opacity-60 px-4 sm:px-0">
              {[
                { label: 'ISKCON Bangalore', url: 'https://www.iskconbangalore.org' },
                { label: 'HKM Chennai', url: 'https://www.hkmchennai.org' },
                { label: 'Google', url: 'https://www.google.com/search?q=%s&igu=1' },
                { label: 'YouTube', url: 'https://www.youtube.com' }
              ].map(site => (
                <button 
                  key={site.label}
                  onClick={() => handleNavigate(null, site.url.replace('%s', ''))}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] sm:text-[11px] font-bold hover:bg-white/10 hover:border-blue-500/30 hover:text-blue-400 transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2"
                >
                  <Globe className="w-3 h-3" />
                  {site.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Iframe View */
          <>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md z-[60] transition-all">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                <div className="flex items-center gap-2 text-blue-500 font-bold text-sm tracking-wider">
                  {[0, 150, 300].map(delay => (
                    <span 
                      key={delay}
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                      style={{ animationDelay: `${delay}ms` }} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Access Toolbar for Blocked Sites */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 animate-in slide-in-from-top-4 duration-500">
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-2xl transition-all active:scale-95 group"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Full Browser</span>
                <div className="w-0 group-hover:w-20 overflow-hidden transition-all duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 ml-1">
                  (Fixes Blank Page)
                </div>
              </a>
            </div>

            <iframe 
              ref={iframeRef}
              src={url}
              onLoad={() => setLoading(false)}
              className="w-full h-full border-none bg-white"
              title="MeghExplorer Content"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />

            <div className="absolute bottom-6 left-6 right-6 flex justify-center z-50 pointer-events-none">
              <div className="max-w-xl flex items-start gap-4 bg-black/80 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-3xl pointer-events-auto transform transition-all hover:scale-[1.02]">
                <div className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-red-500/10">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold mb-1">Navigation Note</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed font-medium">
                    Major sites (Google, GitHub, Facebook) block embedding inside other apps for security. If the window below is <span className="text-red-400">blank</span>, please use the <span className="text-blue-400 font-bold">"Open in Full Browser"</span> button at the top right to view this site in a new tab.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MeghExplorer;
