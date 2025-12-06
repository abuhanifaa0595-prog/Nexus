
import React from 'react';
import { useOS } from '../context/OSContext';
import { APPS } from '../constants';
import { AppId } from '../types';
import { Power, User, LogOut, Lock, Search } from 'lucide-react';

const StartMenu: React.FC = () => {
  const { isStartMenuOpen, openApp, closeStartMenu, installedApps, user, lockScreen, shutDown, logout } = useOS();

  if (!isStartMenuOpen) return null;

  // Filter apps
  const visibleApps = Object.values(APPS).filter(app => installedApps.includes(app.id));

  return (
    <div className="absolute bottom-16 left-4 w-96 bg-os-surface/95 backdrop-blur-3xl border border-os-border/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-[9999] animate-slide-up origin-bottom-left hw-accelerate">
      
      {/* Search Bar */}
      <div className="p-4 pb-2">
         <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:bg-white/20 focus-within:border-white/20 transition-all">
             <Search size={16} className="text-gray-400" />
             <input 
                type="text" 
                placeholder="Search apps, files, and web..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-full"
                autoFocus
             />
         </div>
      </div>

      <div className="px-4 py-2">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Pinned</h2>
        <div className="grid grid-cols-4 gap-2 max-h-[320px] overflow-y-auto custom-scrollbar">
            {visibleApps.map((app) => (
            <button
                key={app.id}
                className="flex flex-col items-center gap-2 group p-3 rounded-xl hover:bg-white/10 transition-all duration-200 active:scale-95 active:bg-white/20"
                onClick={() => {
                openApp(app.id);
                closeStartMenu();
                }}
            >
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500/80 to-purple-600/80 rounded-2xl shadow-lg group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300 text-white">
                    <app.icon size={24} />
                </div>
                <span className="text-[11px] font-medium text-gray-300 group-hover:text-white text-center truncate w-full">
                    {app.title}
                </span>
            </button>
            ))}
        </div>
      </div>

      {/* Recommended Section */}
      <div className="px-6 py-4 bg-black/20">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recommended</h3>
        <div className="flex flex-col gap-1">
           {installedApps.includes(AppId.GEMINI_CHAT) && (
              <button 
                className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/10 text-left transition-all active:scale-[0.98]"
                onClick={() => openApp(AppId.GEMINI_CHAT)}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <APPS.gemini_chat.icon size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-200">Ask Nexus AI</span>
                    <span className="text-xs text-gray-500">Recently used</span>
                </div>
              </button>
           )}
           <button 
             className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/10 text-left transition-all active:scale-[0.98]"
             onClick={() => openApp(AppId.APP_MARKET)}
           >
             <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 border border-pink-500/30">
                <APPS.app_market.icon size={20} />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-200">App Market</span>
                <span className="text-xs text-gray-500">Suggested</span>
             </div>
           </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-black/40 backdrop-blur-xl flex items-center justify-between border-t border-white/5">
        <button 
            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95 group"
            onClick={() => openApp(AppId.SETTINGS)}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 group-hover:border-white transition-colors">
            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-start">
             <span className="text-sm font-medium text-gray-200 group-hover:text-white">{user.name}</span>
          </div>
        </button>
        
        <div className="flex items-center gap-1">
            <button 
                onClick={logout}
                className="p-2.5 hover:bg-white/10 hover:text-white text-gray-400 rounded-lg transition-all active:scale-90"
                title="Lock / Logout"
            >
                <Lock size={18} />
            </button>
            <button 
                onClick={shutDown}
                className="p-2.5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-lg transition-all active:scale-90"
                title="Shut Down"
            >
                <Power size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
