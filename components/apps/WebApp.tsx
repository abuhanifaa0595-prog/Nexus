import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { Loader2, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';

const WebApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { windows } = useOS();
  const windowState = windows.find(w => w.id === windowId);
  const appConfig = windowState ? APPS[windowState.appId] : null;
  const url = appConfig?.url || 'about:blank';
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  const reload = () => {
    setIsLoading(true);
    setHasError(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Minimal Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-black text-gray-400">
        <div className="flex items-center gap-2 text-xs">
           <button onClick={reload} className="hover:text-white transition-colors" title="Reload">
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
           </button>
           <span className="opacity-50">|</span>
           <span className="truncate max-w-[200px]">{url}</span>
        </div>
        <button 
          onClick={() => window.open(url, '_blank')}
          className="flex items-center gap-1 text-xs hover:text-white transition-colors px-2 py-1 hover:bg-white/5 rounded"
        >
           <ExternalLink size={12} /> Open in Browser
        </button>
      </div>

      <div className="flex-1 relative bg-white">
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1e1e] text-white z-10">
                <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
                <span className="text-sm text-gray-400">Connecting to {appConfig?.title}...</span>
            </div>
        )}
        
        <iframe
          key={key}
          src={url}
          className="w-full h-full border-none"
          title={appConfig?.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          onLoad={() => setIsLoading(false)}
          onError={() => {
              setIsLoading(false);
              setHasError(true);
          }}
        />

        {/* Overlay for sites that refuse to connect (X-Frame-Options) */}
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-900/90 text-yellow-100 text-xs py-2 px-4 border-t border-yellow-700 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>If the content doesn't load, the website might be blocking embedded views.</span>
            </div>
            <button 
                onClick={() => window.open(url, '_blank')} 
                className="underline hover:text-white font-medium"
            >
                Open in New Tab
            </button>
        </div>
      </div>
    </div>
  );
};

export default WebApp;