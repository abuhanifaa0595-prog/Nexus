import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Star, 
  Lock, 
  X, 
  Plus, 
  MoreVertical,
  Globe,
  AlertTriangle
} from 'lucide-react';

interface Tab {
  id: number;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  hasError: boolean;
}

const ChromeApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: 1, 
      title: 'New Tab', 
      url: 'https://www.google.com/search?igu=1', 
      history: ['https://www.google.com/search?igu=1'], 
      historyIndex: 0, 
      isLoading: false, 
      hasError: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [addressBarInput, setAddressBarInput] = useState('');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateTab = (id: number, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (id === activeTabId && updates.url) {
      setAddressBarInput(updates.url);
    }
  };

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    let target = addressBarInput;
    
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `https://www.google.com/search?igu=1&q=${encodeURIComponent(target)}`;
      }
    }

    const newHistory = activeTab.history.slice(0, activeTab.historyIndex + 1);
    newHistory.push(target);
    
    updateTab(activeTabId, {
      url: target,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isLoading: true,
      hasError: false
    });
  };

  const handleNewTab = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    const newTab: Tab = {
      id: newId,
      title: 'New Tab',
      url: 'https://www.google.com/search?igu=1',
      history: ['https://www.google.com/search?igu=1'],
      historyIndex: 0,
      isLoading: false,
      hasError: false
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setAddressBarInput(newTab.url);
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't close last tab
    
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
      setAddressBarInput(newTabs[newTabs.length - 1].url);
    }
  };

  const goBack = () => {
    if (activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const newUrl = activeTab.history[newIndex];
      updateTab(activeTabId, {
        historyIndex: newIndex,
        url: newUrl,
        isLoading: true
      });
      setAddressBarInput(newUrl);
    }
  };

  const goForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const newUrl = activeTab.history[newIndex];
      updateTab(activeTabId, {
        historyIndex: newIndex,
        url: newUrl,
        isLoading: true
      });
      setAddressBarInput(newUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#35363a] text-gray-100 font-sans">
      {/* Tab Bar */}
      <div className="flex items-end px-2 pt-2 gap-1 bg-black">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            onClick={() => {
              setActiveTabId(tab.id);
              setAddressBarInput(tab.url);
            }}
            className={`
              group relative flex items-center gap-2 px-3 py-2 pr-1 rounded-t-lg max-w-[200px] min-w-[120px] cursor-default transition-colors select-none
              ${activeTabId === tab.id ? 'bg-[#35363a] text-white' : 'bg-transparent text-gray-400 hover:bg-[#35363a]/50'}
            `}
          >
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
               <Globe size={10} />
            </div>
            <span className="text-xs truncate flex-1">{tab.title || 'New Tab'}</span>
            <button 
              onClick={(e) => closeTab(tab.id, e)}
              className={`p-1 rounded-full hover:bg-white/20 ${tabs.length === 1 ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <X size={10} />
            </button>
            
            {/* Visual separator for inactive tabs */}
            {activeTabId !== tab.id && <div className="absolute right-0 h-4 w-[1px] bg-gray-600 top-1/2 -translate-y-1/2" />}
          </div>
        ))}
        <button 
          onClick={handleNewTab}
          className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 ml-1"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#35363a] border-b border-gray-700">
        <div className="flex items-center gap-1">
          <button onClick={goBack} disabled={activeTab.historyIndex === 0} className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30">
            <ArrowLeft size={16} />
          </button>
          <button onClick={goForward} disabled={activeTab.historyIndex === activeTab.history.length - 1} className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30">
            <ArrowRight size={16} />
          </button>
          <button onClick={() => updateTab(activeTabId, { isLoading: true })} className="p-1.5 rounded-full hover:bg-white/10">
            <RotateCw size={16} className={activeTab.isLoading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => {
             updateTab(activeTabId, { url: 'https://www.google.com/search?igu=1' });
             setAddressBarInput('https://www.google.com/search?igu=1');
          }} className="p-1.5 rounded-full hover:bg-white/10">
            <Home size={16} />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-[#202124] rounded-full px-3 py-1.5 border border-transparent focus-within:border-blue-500/50 focus-within:bg-[#202124] focus-within:shadow-lg transition-all">
          <div className="text-gray-400 mr-2">
            {activeTab.url.startsWith('https') ? <Lock size={12} className="text-green-500" /> : <AlertTriangle size={12} />}
          </div>
          <input 
            type="text" 
            value={addressBarInput}
            onChange={(e) => setAddressBarInput(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500"
            placeholder="Search Google or type a URL"
          />
          <button type="submit" className="hidden" />
          <Star size={14} className="text-gray-400 hover:text-yellow-400 cursor-pointer mx-1" />
        </form>

        <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 ring-white/20">
              U
            </div>
            <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-4 px-3 py-1.5 bg-[#35363a] border-b border-gray-700 text-xs text-gray-300">
        <button className="hover:bg-white/10 px-2 py-1 rounded flex items-center gap-1">
            <img src="https://www.google.com/favicon.ico" alt="" className="w-3 h-3" />
            Google
        </button>
        <button className="hover:bg-white/10 px-2 py-1 rounded flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            YouTube
        </button>
        <button className="hover:bg-white/10 px-2 py-1 rounded flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            News
        </button>
      </div>

      {/* Webview Content */}
      <div className="flex-1 relative bg-white">
         {/* Loader */}
         {activeTab.isLoading && (
             <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500/20 z-10">
                 <div className="h-full bg-blue-500 w-1/3 animate-[slideRight_1s_infinite_linear]"></div>
             </div>
         )}
         
         <iframe
            key={activeTab.id + activeTab.url} // Force remount on url change
            ref={iframeRef}
            src={activeTab.url}
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            onLoad={() => {
                updateTab(activeTabId, { isLoading: false });
            }}
            onError={() => {
                updateTab(activeTabId, { isLoading: false, hasError: true });
            }}
         />
         
         {/* Error State / Security Restriction Handler */}
         {activeTab.hasError && (
             <div className="absolute inset-0 bg-[#202124] flex flex-col items-center justify-center text-gray-400">
                 <AlertTriangle size={48} className="mb-4 text-red-500" />
                 <h2 className="text-xl font-medium text-white mb-2">This site refused to connect.</h2>
                 <p className="max-w-md text-center mb-6">
                    Most major websites block embedding in simulators for security reasons (X-Frame-Options).
                 </p>
                 <button 
                    onClick={() => window.open(activeTab.url, '_blank')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                 >
                    Open in New Window
                 </button>
             </div>
         )}

         {/* Helper Overlay for refused connections that don't trigger onError */}
         <div className="absolute bottom-0 w-full bg-[#202124] text-gray-400 text-xs py-1 px-2 border-t border-gray-700 flex justify-between">
            <span>Simulated Chrome Browser</span>
            <button 
                onClick={() => updateTab(activeTabId, { hasError: true })} 
                className="hover:text-white"
            >
                Site not loading?
            </button>
         </div>
      </div>
    </div>
  );
};

export default ChromeApp;