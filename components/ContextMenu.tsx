import React, { useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';
import { ChevronRight } from 'lucide-react';

const ContextMenu: React.FC = () => {
  const { contextMenu, closeContextMenu } = useOS();
  const menuRef = useRef<HTMLDivElement>(null);

  if (!contextMenu.isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999]" 
      onClick={closeContextMenu}
      onContextMenu={(e) => {
        e.preventDefault();
        closeContextMenu();
      }}
    >
      <div 
        ref={menuRef}
        className="absolute bg-os-surface/95 backdrop-blur-2xl border border-os-border/50 rounded-xl shadow-2xl p-1 min-w-[200px] animate-fade-in"
        style={{ 
          top: Math.min(contextMenu.y, window.innerHeight - 300), 
          left: Math.min(contextMenu.x, window.innerWidth - 220) 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {contextMenu.options.map((option, index) => {
          if (option.separator) {
            return <div key={index} className="h-[1px] bg-white/10 my-1 mx-2" />;
          }

          return (
            <button
              key={index}
              onClick={() => {
                if (!option.disabled) {
                  option.action();
                  closeContextMenu();
                }
              }}
              disabled={option.disabled}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${option.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-200 hover:bg-white/10 hover:text-white'}
                ${option.disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}
              `}
            >
              {option.icon && <option.icon size={16} />}
              <span className="flex-1 text-left">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContextMenu;