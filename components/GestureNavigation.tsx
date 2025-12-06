
import React, { useRef, useState } from 'react';
import { useOS } from '../context/OSContext';

const GestureNavigation: React.FC = () => {
  const { goHome, goBack, toggleTaskView } = useOS();
  const touchStart = useRef<{ x: number, y: number, time: number } | null>(null);
  const [feedback, setFeedback] = useState<'back-left' | 'back-right' | 'home' | null>(null);

  const handleTouchStart = (e: React.TouchEvent, zone: 'bottom' | 'left' | 'right') => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e: React.TouchEvent, zone: 'bottom' | 'left' | 'right') => {
    if (!touchStart.current) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStart.current.x;
    const diffY = endY - touchStart.current.y;
    const duration = Date.now() - touchStart.current.time;

    if (zone === 'bottom') {
      // Swipe Up
      if (diffY < -40 && Math.abs(diffX) < 60) {
        if (duration > 300) {
          // Long press / slow swipe -> Task View
          toggleTaskView();
        } else {
          // Fast swipe -> Home
          goHome();
          setFeedback('home');
          setTimeout(() => setFeedback(null), 300);
        }
      }
    } else if (zone === 'left') {
      // Swipe Right
      if (diffX > 20 && Math.abs(diffY) < 50) {
        goBack();
        setFeedback('back-left');
        setTimeout(() => setFeedback(null), 300);
      }
    } else if (zone === 'right') {
      // Swipe Left
      if (diffX < -20 && Math.abs(diffY) < 50) {
        goBack();
        setFeedback('back-right');
        setTimeout(() => setFeedback(null), 300);
      }
    }

    touchStart.current = null;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] md:hidden">
      {/* Left Edge Zone */}
      <div 
        className="absolute top-1/4 bottom-1/4 left-0 w-4 pointer-events-auto"
        onTouchStart={(e) => handleTouchStart(e, 'left')}
        onTouchEnd={(e) => handleTouchEnd(e, 'left')}
      />
      
      {/* Right Edge Zone */}
      <div 
        className="absolute top-1/4 bottom-1/4 right-0 w-4 pointer-events-auto"
        onTouchStart={(e) => handleTouchStart(e, 'right')}
        onTouchEnd={(e) => handleTouchEnd(e, 'right')}
      />

      {/* Bottom Zone & Pill Indicator */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-auto flex items-end justify-center pb-2"
        onTouchStart={(e) => handleTouchStart(e, 'bottom')}
        onTouchEnd={(e) => handleTouchEnd(e, 'bottom')}
      >
        <div className="w-32 h-1 bg-white/40 rounded-full shadow-sm" />
      </div>

      {/* Visual Feedback */}
      {feedback === 'back-left' && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 p-4 rounded-r-full backdrop-blur-md animate-fade-in">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </div>
      )}
      {feedback === 'back-right' && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 p-4 rounded-l-full backdrop-blur-md animate-fade-in">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      )}
    </div>
  );
};

export default GestureNavigation;
