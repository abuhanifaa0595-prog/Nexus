import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download,
  ChevronLeft, 
  ChevronRight,
  Maximize
} from 'lucide-react';

const ImageViewerApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { windows, fileSystem } = useOS();
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Initialize
  useEffect(() => {
    const win = windows.find(w => w.id === windowId);
    if (win?.props?.fileId) {
      setCurrentFileId(win.props.fileId);
    }
  }, [windowId, windows]);

  // Find all images in the same folder for navigation
  const currentFile = fileSystem.find(f => f.id === currentFileId);
  const folderImages = fileSystem.filter(f => 
    f.parentId === currentFile?.parentId && 
    (f.name.endsWith('.jpg') || f.name.endsWith('.png') || f.name.endsWith('.webp'))
  );
  
  const currentIndex = folderImages.findIndex(f => f.id === currentFileId);

  const handleNext = () => {
    if (currentIndex < folderImages.length - 1) {
      setCurrentFileId(folderImages[currentIndex + 1].id);
      resetView();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentFileId(folderImages[currentIndex - 1].id);
      resetView();
    }
  };

  const resetView = () => {
    setScale(1);
    setRotation(0);
  };

  if (!currentFile) return <div className="flex items-center justify-center h-full text-white">No Image Selected</div>;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      {/* Toolbar */}
      <div className="h-12 bg-[#252526] border-b border-black flex items-center justify-center relative px-4 z-10">
         <div className="absolute left-4 text-sm font-medium truncate max-w-[200px]">
            {currentFile.name}
         </div>
         
         <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
             <button onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="p-1.5 hover:bg-white/10 rounded"><ZoomOut size={16}/></button>
             <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
             <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="p-1.5 hover:bg-white/10 rounded"><ZoomIn size={16}/></button>
             <div className="w-[1px] h-4 bg-white/10 mx-1" />
             <button onClick={() => setRotation(r => r + 90)} className="p-1.5 hover:bg-white/10 rounded"><RotateCw size={16}/></button>
         </div>

         <div className="absolute right-4">
             <button 
                className="p-1.5 hover:bg-white/10 rounded"
                onClick={() => {
                     const link = document.createElement('a');
                     link.download = currentFile.name;
                     link.href = currentFile.content || '';
                     link.click();
                }}
             >
                 <Download size={16} />
             </button>
         </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[#1e1e1e] p-4">
          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
              <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-0 transition-all"
              >
                  <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext} 
                disabled={currentIndex === folderImages.length - 1}
                className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-0 transition-all"
              >
                  <ChevronRight size={24} />
              </button>
          </div>

          <div 
             className="transition-transform duration-200 ease-out"
             style={{ 
                 transform: `scale(${scale}) rotate(${rotation}deg)` 
             }}
          >
              <img 
                 src={currentFile.content} 
                 alt={currentFile.name} 
                 className="max-w-full max-h-[80vh] shadow-2xl object-contain"
                 draggable={false}
              />
          </div>
      </div>
    </div>
  );
};

export default ImageViewerApp;