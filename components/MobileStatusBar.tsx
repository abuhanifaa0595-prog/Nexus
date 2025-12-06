
import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { format } from 'date-fns';
import { Wifi, Battery, Signal } from 'lucide-react';

const MobileStatusBar: React.FC = () => {
  const { toggleControlCenter, isWifiOn } = useOS();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simple touch handling to allow dragging down the status bar
  const [touchStartY, setTouchStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY > 30) {
      toggleControlCenter();
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-5 text-white z-[10002] md:hidden select-none cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={toggleControlCenter}
    >
      {/* Time */}
      <div className="text-sm font-bold tracking-wide">
        {format(time, 'h:mm')}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-1.5">
        <Signal size={14} className="fill-white" />
        {isWifiOn && <Wifi size={14} />}
        <Battery size={16} className="fill-white" />
      </div>
      
      {/* Invisible drag handle indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full opacity-50"></div>
    </div>
  );
};

export default MobileStatusBar;
