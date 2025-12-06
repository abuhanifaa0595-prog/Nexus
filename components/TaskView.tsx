
import React, { useRef, useState } from 'react';
import { useOS } from '../context/OSContext';
import { APPS } from '../constants';
import { X, Smartphone } from 'lucide-react';

const TaskView: React.FC = () => {
  const { windows, isTaskViewOpen, toggleTaskView, focusWindow, closeWindow } = useOS();
  
  // Track swipe gestures on individual cards
  const touchStartY = useRef<number>(0);
  const [closingWindowId, setClosingWindowId] = useState<string | null>(null);

  if (!isTaskViewOpen) return null;

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    
    // Swipe UP to close (negative difference)
    if (diff < -100) {
      setClosingWindowId(id);
      setTimeout(() => {
        closeWindow(id);
        setClosingWindowId(null);
      }, 300); // Wait for animation
    } else if (Math.abs(diff) < 10) {
      // Tap to open
      focusWindow(id);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-xl flex flex-col md:hidden animate-[fadeIn_0.2s_ease-out]">
       {/* Background dismiss area */}
       <div className="absolute inset-0" onClick={toggleTaskView} />

       <div className="relative flex-1 flex items-center overflow-x-auto snap-x snap-mandatory px-8 gap-6 py-20 no-scrollbar">
           {windows.length === 0 && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 pointer-events-none">
                   <Smartphone size={48} className="mb-4 opacity-50" />
                   <p>No recent apps</p>
               </div>
           )}
           
           {windows.map(win => {
               const AppConfig = APPS[win.appId];
               const isClosing = closingWindowId === win.id;

               return (
                   <div 
                      key={win.id} 
                      className={`
                        relative flex-shrink-0 w-[70vw] h-[60vh] snap-center flex flex-col shadow-2xl transition-all duration-300
                        ${isClosing ? '-translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}
                      `}
                      onTouchStart={(e) => handleTouchStart(e, win.id)}
                      onTouchEnd={(e) => handleTouchEnd(e, win.id)}
                   >
                       {/* Header (Icon + Title) */}
                       <div className="bg-gray-800 text-white p-3 rounded-t-2xl flex items-center gap-3 border-b border-white/10">
                           <AppConfig.icon size={20} />
                           <span className="font-bold text-sm truncate">{win.title}</span>
                       </div>

                       {/* Preview Body */}
                       <div className="flex-1 bg-gray-900 rounded-b-2xl border-x border-b border-white/10 overflow-hidden relative group">
                           {/* Simulated Mini Content */}
                           <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
                               <AppConfig.icon size={64} className="text-white mb-4" />
                               <div className="w-3/4 h-2 bg-white/20 rounded-full mb-2"></div>
                               <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                           </div>
                           
                           {/* Close Hint */}
                           <div className="absolute top-2 right-2 bg-red-500/80 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <X size={16} />
                           </div>
                       </div>
                       
                       {/* App Name Below */}
                       <div className="mt-4 flex items-center justify-center gap-2">
                          <AppConfig.icon size={24} className="text-white shadow-lg" />
                          <span className="text-white font-semibold text-lg drop-shadow-md">{AppConfig.title}</span>
                       </div>
                   </div>
               )
           })}
       </div>

       <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
       `}</style>
    </div>
  );
};

export default TaskView;
