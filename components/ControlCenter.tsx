import React from 'react';
import { useOS } from '../context/OSContext';
import { AppId } from '../types';
import { 
  Wifi, 
  Bluetooth, 
  Plane, 
  Flashlight, 
  Moon, 
  Sun, 
  Volume2, 
  Play, 
  SkipForward, 
  SkipBack,
  Lock,
  RotateCcw,
  Smartphone,
  Timer,
  Calculator,
  Camera,
  Cast
} from 'lucide-react';

const ControlCenter: React.FC = () => {
  const { 
    isControlCenterOpen, 
    closeControlCenter, 
    brightness, 
    setBrightness, 
    volume, 
    setVolume,
    isWifiOn,
    toggleWifi,
    isBluetoothOn,
    toggleBluetooth,
    isAirplaneModeOn,
    toggleAirplaneMode,
    theme,
    setTheme,
    openApp
  } = useOS();

  if (!isControlCenterOpen) return null;

  return (
    <div className="fixed inset-0 z-[10005] md:hidden font-sans">
      {/* Backdrop with fade in */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in"
        onClick={closeControlCenter}
      />
      
      {/* Panel with slide down */}
      <div className="absolute top-0 left-0 right-0 p-3 animate-slide-down">
         <div className="bg-gray-200/80 dark:bg-black/60 backdrop-blur-3xl rounded-[2.5rem] p-4 shadow-2xl border border-white/20 flex flex-col gap-4 text-white hw-accelerate">
             
             {/* Top Grid */}
             <div className="grid grid-cols-2 gap-4 h-40">
                 {/* Connectivity Block */}
                 <div className="bg-[#1e1e1e]/60 rounded-[1.5rem] p-3 grid grid-rows-2 gap-2">
                     <button 
                        onClick={toggleWifi}
                        className="flex items-center gap-3 active:scale-95 transition-all duration-300 group"
                     >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isWifiOn ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/20 text-white'}`}>
                           <Wifi size={22} />
                        </div>
                        <div className="flex flex-col items-start">
                           <span className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">Wi-Fi</span>
                           <span className="text-xs text-white/70">{isWifiOn ? 'Nexus_5G' : 'Off'}</span>
                        </div>
                     </button>
                     <button 
                        onClick={toggleBluetooth}
                        className="flex items-center gap-3 active:scale-95 transition-all duration-300 group"
                     >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isBluetoothOn ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/20 text-white'}`}>
                           <Bluetooth size={22} />
                        </div>
                        <div className="flex flex-col items-start">
                           <span className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">Bluetooth</span>
                           <span className="text-xs text-white/70">{isBluetoothOn ? 'On' : 'Off'}</span>
                        </div>
                     </button>
                 </div>

                 {/* Media Controls */}
                 <div className="bg-[#1e1e1e]/60 rounded-[1.5rem] p-4 flex flex-col justify-between items-center text-center">
                     <div className="w-full flex justify-between items-start">
                        <div className="text-xs text-white/50 font-medium animate-pulse">Not Playing</div>
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                            <Cast size={12} />
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                         <span className="text-sm font-semibold text-white/80">Nexus Music</span>
                     </div>
                     <div className="flex items-center justify-between w-full mt-2 gap-4">
                         <button className="text-white/40 active:text-white hover:scale-110 transition-all"><SkipBack size={24} /></button>
                         <button className="active:scale-90 transition-transform"><Play size={32} className="fill-white" /></button>
                         <button className="text-white/40 active:text-white hover:scale-110 transition-all"><SkipForward size={24} /></button>
                     </div>
                 </div>
             </div>

             {/* Toggles Row */}
             <div className="grid grid-cols-4 gap-4 h-20">
                 <button 
                    onClick={toggleAirplaneMode}
                    className={`rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-all duration-300 ${isAirplaneModeOn ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-[#1e1e1e]/60 text-white hover:bg-[#1e1e1e]/80'}`}
                 >
                    <Plane size={24} />
                 </button>
                 <button className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]/80 rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-transform">
                    <Smartphone size={24} />
                 </button>
                 <button className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]/80 rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-transform">
                    <RotateCcw size={24} />
                 </button>
                 <button 
                    className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]/80 rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-transform"
                    onClick={() => {
                        // Toggle logic for DND
                    }}
                 >
                    <Moon size={24} />
                 </button>
             </div>

             {/* Sliders */}
             <div className="flex flex-col gap-4 bg-[#1e1e1e]/60 rounded-[1.5rem] p-4">
                 <div className="flex items-center gap-3">
                     <Sun size={20} className="text-white/60" />
                     <div className="flex-1 h-12 bg-black/40 rounded-full relative overflow-hidden group active:scale-[0.99] transition-transform">
                         <input 
                            type="range" 
                            min="20" 
                            max="130" 
                            value={brightness} 
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         />
                         <div 
                            className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100 ease-out"
                            style={{ width: `${(brightness - 20) / 1.1}%` }}
                         />
                     </div>
                 </div>
                 <div className="flex items-center gap-3">
                     <Volume2 size={20} className="text-white/60" />
                     <div className="flex-1 h-12 bg-black/40 rounded-full relative overflow-hidden group active:scale-[0.99] transition-transform">
                         <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={volume} 
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         />
                         <div 
                            className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100 ease-out"
                            style={{ width: `${volume}%` }}
                         />
                     </div>
                 </div>
             </div>

             {/* Bottom Shortcuts */}
             <div className="grid grid-cols-4 gap-4 h-20">
                 <button className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]/80 rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-transform">
                    <Flashlight size={24} />
                 </button>
                 <button 
                    onClick={() => { openApp(AppId.CALCULATOR); closeControlCenter(); }}
                    className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]/80 rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-transform"
                 >
                    <Calculator size={24} />
                 </button>
                 <button 
                    onClick={() => { openApp(AppId.INSTAGRAM); closeControlCenter(); }} 
                    className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]/80 rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-transform"
                 >
                    <Camera size={24} />
                 </button>
                 <button className="bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]/80 rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-transform">
                    <Timer size={24} />
                 </button>
             </div>

             <div className="w-16 h-1 bg-white/20 rounded-full self-center mt-1"></div>
         </div>
      </div>
    </div>
  );
};

export default ControlCenter;