import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { APPS } from '../constants';
import { AppId } from '../types';
import { Grip, Wifi, Volume2, Battery } from 'lucide-react';
import { format } from 'date-fns';

const Taskbar: React.FC = () => {
  const { 
    windows, 
    activeWindowId, 
    focusWindow, 
    minimizeWindow, 
    toggleStartMenu,
    isStartMenuOpen 
  } = useOS();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Group windows by app
  const openApps = Array.from(new Set(windows.map(w => w.appId))) as AppId[];

  return (
    <div className="hidden md:flex fixed bottom-0 left-0 w-full h-12 bg-os-surface/80 backdrop-blur-2xl border-t border-white/10 z-[10000] items-center justify-between px-2 shadow-2xl hw-accelerate transition-all duration-300">
      <div className="flex items-center gap-2 h-full">
        {/* Start Button */}
        <button 
          onClick={toggleStartMenu}
          className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-90 active:bg-white/20 hover:scale-105 ${isStartMenuOpen ? 'bg-white/20 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}`}
          title="Start"
        >
          <Grip size={20} className={`text-cyan-400 transition-transform duration-500 ${isStartMenuOpen ? 'rotate-90' : ''}`} />
        </button>

        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* Running Apps */}
        <div className="flex items-center gap-1">
          {openApps.map(appId => {
            const appConfig = APPS[appId];
            const appWindows = windows.filter(w => w.appId === appId);
            const isActive = appWindows.some(w => w.id === activeWindowId && !w.isMinimized);
            const isRunning = appWindows.length > 0;

            if (!isRunning) return null;

            return (
              <button
                key={appId}
                onClick={() => {
                  const lastActive = appWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
                  if (isActive && !lastActive.isMinimized) {
                    minimizeWindow(lastActive.id);
                  } else {
                    focusWindow(lastActive.id);
                  }
                }}
                className={`group relative h-9 w-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-110 active:scale-90
                  ${isActive ? 'bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : ''}
                `}
                title={appConfig.title}
              >
                <appConfig.icon size={18} className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`} />
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                )}
                {/* Tooltip Simulation */}
                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg translate-y-2 group-hover:translate-y-0">
                    {appConfig.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 px-2">
        <div className="flex items-center gap-2 text-gray-400">
           <div className="hover:text-white transition-colors cursor-pointer hover:scale-110"><Wifi size={16} /></div>
           <div className="hover:text-white transition-colors cursor-pointer hover:scale-110"><Volume2 size={16} /></div>
           <div className="hover:text-white transition-colors cursor-pointer hover:scale-110"><Battery size={16} /></div>
        </div>
        <div className="text-right flex flex-col justify-center h-full px-2 hover:bg-white/5 rounded-lg cursor-default transition-colors">
          <span className="text-xs font-medium text-gray-200 leading-tight">
            {format(time, 'h:mm aa')}
          </span>
          <span className="text-[10px] text-gray-400 leading-tight">
            {format(time, 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;