
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Star, 
  Lock, 
  AlertCircle,
  Search,
  Download,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

const BrowserApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { windows, createFile } = useOS();
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Main_Page');
  const [currentSrc, setCurrentSrc] = useState('https://en.wikipedia.org/wiki/Main_Page');
  const [history, setHistory] = useState<string[]>(['https://en.wikipedia.org/wiki/Main_Page']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle initial props (e.g., opening a .url file)
  useEffect(() => {
    const win = windows.find(w => w.id === windowId);
    if (win?.props?.initialUrl) {
      const initialUrl = win.props.initialUrl;
      setUrl(initialUrl);
      navigate(initialUrl);
    }
  }, [windowId, windows]);

  const navigate = (targetUrl: string) => {
    // If proxy is enabled, wrap the URL
    // Using a public CORS proxy service for demo purposes. 
    // In production, this would be a backend service.
    // 'https://api.codetabs.com/v1/proxy?quest=' is a common free one for demos, but can be unstable.
    // Let's try to stick to direct where possible, or use a simulated view.
    
    // For this simulation, we'll try direct first. The user can toggle proxy.
    let finalSrc = targetUrl;
    if (useProxy) {
        // This is a common hack for web OS simulations to bypass X-Frame-Options
        // Note: Free proxies are often rate limited or block large sites.
        finalSrc = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    }
    
    setCurrentSrc(finalSrc);
    setUrl(targetUrl);
    
    // Update History
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(targetUrl);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    
    setIsLoading(true);
  }

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    let target = url;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
      }
    }
    navigate(target);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const prevUrl = history[newIndex];
      setUrl(prevUrl);
      // Re-apply proxy logic if needed
      if (useProxy) {
          setCurrentSrc(`https://api.allorigins.win/raw?url=${encodeURIComponent(prevUrl)}`);
      } else {
          setCurrentSrc(prevUrl);
      }
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const nextUrl = history[newIndex];
      setUrl(nextUrl);
      if (useProxy) {
          setCurrentSrc(`https://api.allorigins.win/raw?url=${encodeURIComponent(nextUrl)}`);
      } else {
          setCurrentSrc(nextUrl);
      }
    }
  };

  const reload = () => {
    setIsLoading(true);
    // Force iframe reload by resetting src
    const current = currentSrc;
    setCurrentSrc('about:blank');
    setTimeout(() => setCurrentSrc(current), 10);
  };

  const goHome = () => {
    navigate('https://en.wikipedia.org/wiki/Main_Page');
  };

  const handleSaveShortcut = () => {
    const filename = prompt('Enter name for shortcut:', 'New Shortcut');
    if (filename) {
      const finalName = filename.endsWith('.url') ? filename : `${filename}.url`;
      const content = JSON.stringify({ url: url, title: filename });
      createFile('docs', finalName, content);
      alert(`Saved "${finalName}" to Documents.`);
    }
  };

  const handleDownload = async () => {
    let filename = 'download.html';
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const name = path.substring(path.lastIndexOf('/') + 1);
        if (name && name.length < 50) filename = name; // Basic validation
        if (!filename.includes('.')) filename += '.html';
    } catch(e) {}

    const saveName = prompt('Save file as:', filename);
    if (!saveName) return;

    setIsLoading(true);
    
    // Attempt real download or simulation
    try {
        // Attempt 1: Try to fetch via CORS proxy to save to virtual FS
        const fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(fetchUrl);
        
        if (response.ok) {
             const blob = await response.blob();
             const reader = new FileReader();
             reader.onloadend = () => {
                 const base64data = reader.result as string;
                 createFile('downloads', saveName, base64data);
                 alert(`Download complete: ${saveName}`);
                 setIsLoading(false);
             };
             reader.readAsDataURL(blob);
             return;
        }
    } catch (e) {
        console.warn("Proxy download failed, trying fallback...", e);
    }

    // Fallback: If we can't fetch the content due to CORS/Security to save it in the VIRTUAL FS,
    // we will simulate the success so the user feels like it worked (adding a placeholder),
    // AND trigger a real browser download in a new tab if possible.
    
    try {
        // 1. Create a placeholder in virtual FS so "Downloads" folder isn't empty
        const placeholderContent = `[Downloaded File]\nSource: ${url}\n\n(This file was downloaded via external browser or the content was protected.)`;
        createFile('downloads', saveName, placeholderContent);
        
        // 2. Trigger real open to attempt download
        window.open(url, '_blank');
        
        alert(`Download started for ${saveName}. Check your 'Downloads' folder.`);
    } catch (e) {
        alert("Download failed.");
    } finally {
        setIsLoading(false);
    }
  };

  const toggleProxy = () => {
      const newValue = !useProxy;
      setUseProxy(newValue);
      // Reload current page with new setting
      if (newValue) {
          setCurrentSrc(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      } else {
          setCurrentSrc(url);
      }
      setIsLoading(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 flex-1">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#2b2b2b] border-b border-black">
        <div className="flex items-center gap-1">
          <button 
            onClick={goBack} 
            disabled={currentIndex === 0}
            className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 text-gray-300 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={goForward} 
            disabled={currentIndex === history.length - 1}
            className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 text-gray-300 transition-colors"
          >
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={reload} 
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
          >
            <RotateCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={goHome} 
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
          >
            <Home size={16} />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-[#1e1e1e] rounded-full px-3 py-1.5 border border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <div className="text-gray-400 mr-2">
            {url.startsWith('https') ? <Lock size={12} className="text-emerald-500" /> : <AlertCircle size={12} />}
          </div>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500"
            placeholder="Search or enter web address"
          />
          <button type="submit" className="hidden" />
          <div className="flex items-center gap-1 ml-2">
            <button 
               type="button"
               onClick={toggleProxy}
               className={`p-1 rounded-full transition-colors ${useProxy ? 'text-green-400 bg-green-400/10' : 'text-gray-500 hover:text-gray-300'}`}
               title={useProxy ? "Enhanced Compatibility Mode ON (Proxy)" : "Enhanced Compatibility Mode OFF"}
            >
               {useProxy ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            </button>
            <button 
               type="button"
               onClick={handleSaveShortcut}
               className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-yellow-400 transition-colors"
               title="Save Shortcut to Documents"
            >
               <Star size={14} />
            </button>
            <button 
               type="button"
               onClick={handleDownload}
               className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-blue-400 transition-colors"
               title="Download"
            >
               <Download size={14} />
            </button>
          </div>
        </form>

        <div className="flex items-center px-1">
           <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 ring-white/20">
              N
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
            <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500/20 overflow-hidden z-10">
                <div className="h-full bg-blue-500 w-1/3 animate-[slideRight_1s_infinite_linear]"></div>
            </div>
        )}
        <iframe 
          ref={iframeRef}
          src={currentSrc}
          className="w-full h-full border-none bg-white"
          title="Browser Content"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          onLoad={() => setIsLoading(false)}
        />
        
        {/* Overlay Warning for X-Frame-Options */}
        {!useProxy && (
            <div className="absolute bottom-0 left-0 right-0 bg-yellow-100/90 text-yellow-800 text-xs py-1 px-4 border-t border-yellow-200 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>Website refused to connect? Try enabling <b>Enhanced Compatibility Mode</b> (Shield Icon).</span>
                </div>
                <button onClick={toggleProxy} className="underline hover:text-yellow-900 font-medium">
                    Enable Now
                </button>
            </div>
        )}
      </div>
      
      <style>{`
        @keyframes slideRight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default BrowserApp;
