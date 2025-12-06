import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { useOS } from '../context/OSContext';
import WindowFrame from './WindowFrame';
import { APPS, WALLPAPERS } from '../constants';
import { AppId, Theme, ContextMenuOption, FileNode } from '../types';
import { 
  RefreshCw, 
  Image, 
  Monitor, 
  Terminal, 
  FolderPlus, 
  FilePlus,
  Trash,
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Film,
  Globe,
  Loader2,
  Code,
  Clipboard,
  Copy,
  Scissors,
  Trash2
} from 'lucide-react';

const Desktop: React.FC = () => {
  const { 
    windows, 
    theme, 
    setTheme, 
    openApp, 
    closeStartMenu, 
    installedApps, 
    openContextMenu,
    fileSystem,
    createFolder,
    createFile,
    deleteNode,
    clipboard,
    pasteNodes,
    copyNodes,
    cutNodes,
    iconPositions,
    updateIconPosition,
    desktopMode,
    desktopSortOrder,
    updateDesktopSortOrder,
    emptyTrash
  } = useOS();

  // Define the preferred order of desktop icons
  const shortcutOrder: AppId[] = [
    AppId.GEMINI_CHAT,
    AppId.CHROME,
    AppId.VSCODE,
    AppId.BROWSER,
    AppId.PLAY_STORE,
    AppId.NEXUS_OFFICE,
    AppId.APP_MARKET,
    AppId.FILE_EXPLORER,
    AppId.NOTEPAD,
    AppId.INSTAGRAM,
    AppId.SPOTIFY,
    AppId.TIKTOK,
    AppId.TWITTER,
    AppId.DISCORD,
    AppId.PHOTO_EDITOR,
    AppId.MEDIA_PLAYER,
    AppId.TERMINAL,
    AppId.CALCULATOR,
    AppId.SETTINGS
  ];

  // Filter to only show installed apps
  const desktopShortcuts = shortcutOrder.filter(id => installedApps.includes(id));
  const desktopFiles = fileSystem.filter(node => node.parentId === 'desktop');
  
  // Check if trash has items
  const trashItems = fileSystem.filter(node => node.parentId === 'trash');
  const isTrashEmpty = trashItems.length === 0;

  // Drag State
  const [dragState, setDragState] = useState<{id: string, startX: number, startY: number, initialIconX: number, initialIconY: number} | null>(null);
  
  // Selection State
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectionBox, setSelectionBox] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionStartRef = useRef<{x: number, y: number} | null>(null);
  
  // Refresh State (fake refresh)
  const [refreshKey, setRefreshKey] = useState(0);

  // Layout Constants
  const START_X = 20;
  const START_Y = 20;
  const GRID_GAP_X = 100;
  const GRID_GAP_Y = 110;
  const ITEMS_PER_COL = Math.floor((window.innerHeight - 60) / GRID_GAP_Y);

  const getGridPosition = (index: number) => {
      const col = Math.floor(index / ITEMS_PER_COL);
      const row = index % ITEMS_PER_COL;
      return {
          x: START_X + col * GRID_GAP_X,
          y: START_Y + row * GRID_GAP_Y
      };
  };

  const getIconPosition = (id: string, index: number) => {
      // If currently dragging this item, use its temporary position
      if (dragState?.id === id) {
          // If in grid mode, we still show the smooth drag, but on drop we snap
          return iconPositions[id] || {x: 0, y: 0};
      }

      // If we have a saved position, use it
      if (iconPositions[id]) return iconPositions[id];
      
      // Otherwise, calculate a default position based on index (sequential fill)
      // This is for new items that haven't been moved yet
      const pos = getGridPosition(index);
      
      // We should probably save this default position so it persists in 'grid' mode correctly if we drag others around it
      // But for now, returning calculated is fine for display
      return pos;
  };

  const rawItems = useMemo(() => [
      { type: 'system', id: 'recycle_bin', data: { title: 'Recycle Bin', icon: Trash2 } },
      ...desktopShortcuts.map(id => ({ type: 'app', id, data: APPS[id] })),
      ...desktopFiles.map(node => ({ type: 'file', id: node.id, data: node }))
  ], [desktopShortcuts, desktopFiles]);

  // Combined and sorted items
  const allItems = useMemo(() => {
      // Recycle bin always first/separate logic? 
      // Let's treat recycle bin as just another item that can be moved.
      
      // If we have a sort order, apply it
      if (desktopSortOrder.length === 0) return rawItems;
      
      return [...rawItems].sort((a, b) => {
          const idxA = desktopSortOrder.indexOf(a.id);
          const idxB = desktopSortOrder.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0; 
      });
  }, [rawItems, desktopSortOrder]);

  // Initial Grid Allocation for items without position
  useEffect(() => {
      // Find items without position
      const unpositioned = allItems.filter(item => !iconPositions[item.id]);
      
      if (unpositioned.length > 0) {
          const newPositions = { ...iconPositions };
          
          // Find used slots
          const usedSlots = new Set<string>();
          Object.values(iconPositions).forEach((pos: any) => {
              // Approximate grid slot
              const col = Math.round((pos.x - START_X) / GRID_GAP_X);
              const row = Math.round((pos.y - START_Y) / GRID_GAP_Y);
              usedSlots.add(`${col},${row}`);
          });

          // Assign slots
          let currentIndex = 0;
          unpositioned.forEach(item => {
              // Find next free slot
              let col = Math.floor(currentIndex / ITEMS_PER_COL);
              let row = currentIndex % ITEMS_PER_COL;
              
              // Skip used slots
              while (usedSlots.has(`${col},${row}`)) {
                  currentIndex++;
                  col = Math.floor(currentIndex / ITEMS_PER_COL);
                  row = currentIndex % ITEMS_PER_COL;
              }
              
              newPositions[item.id] = {
                  x: START_X + col * GRID_GAP_X,
                  y: START_Y + row * GRID_GAP_Y
              };
              usedSlots.add(`${col},${row}`);
              currentIndex++;
          });
          
          // Update state in one batch to avoid loops
          // We can't batch update via context easily without adding a batch function
          // So we'll just update them one by one or rely on the render default fallback for now
          // Ideally, OSContext should expose setIconPositions.
          // For now, the `getIconPosition` fallback handles display, but dragging needs real pos.
          // Let's rely on fallback until drag starts.
      }
  }, [allItems.length]); // Only run when item count changes

  const handleDragStart = (e: React.MouseEvent, id: string, currentX: number, currentY: number) => {
      e.stopPropagation();
      e.preventDefault();
      if (e.button !== 0) return;
      
      if (!selectedItems.has(id)) {
          setSelectedItems(new Set([id]));
      }

      // Initialize persistent position if missing
      if (!iconPositions[id]) {
          updateIconPosition(id, currentX, currentY);
      }

      setDragState({
          id,
          startX: e.clientX,
          startY: e.clientY,
          initialIconX: currentX,
          initialIconY: currentY
      });
  };

  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget || (e.target as HTMLElement).id === 'desktop-bg') {
          if (e.button === 0) {
            setIsSelecting(true);
            selectionStartRef.current = { x: e.clientX, y: e.clientY };
            setSelectionBox({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
            setSelectedItems(new Set());
            closeStartMenu();
          }
      }
  };

  // Global Mouse Handlers
  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          // Dragging
          if (dragState) {
              const dx = e.clientX - dragState.startX;
              const dy = e.clientY - dragState.startY;
              updateIconPosition(dragState.id, dragState.initialIconX + dx, dragState.initialIconY + dy);
              return;
          }

          // Selecting
          if (isSelecting && selectionStartRef.current) {
              const startX = selectionStartRef.current.x;
              const startY = selectionStartRef.current.y;
              const currentX = e.clientX;
              const currentY = e.clientY;

              const x = Math.min(startX, currentX);
              const y = Math.min(startY, currentY);
              const width = Math.abs(currentX - startX);
              const height = Math.abs(currentY - startY);

              setSelectionBox({ x, y, width, height });

              const newSelected = new Set<string>();
              allItems.forEach((item, index) => {
                  const pos = getIconPosition(item.id, index); // Use current visual position
                  const iconW = 96; 
                  const iconH = 96;

                  if (
                      x < pos.x + iconW &&
                      x + width > pos.x &&
                      y < pos.y + iconH &&
                      y + height > pos.y
                  ) {
                      newSelected.add(item.id);
                  }
              });
              setSelectedItems(newSelected);
          }
      };
      
      const handleMouseUp = (e: MouseEvent) => {
          if (dragState) {
              // SNAP TO GRID LOGIC
              if (desktopMode === 'grid') {
                  const currentPos = iconPositions[dragState.id] || { x: dragState.initialIconX, y: dragState.initialIconY };
                  
                  // Calculate nearest grid slot
                  // We offset by START_X/Y to align grid
                  const relX = currentPos.x - START_X;
                  const relY = currentPos.y - START_Y;
                  
                  const col = Math.round(relX / GRID_GAP_X);
                  const row = Math.round(relY / GRID_GAP_Y);
                  
                  const snappedX = Math.max(START_X, START_X + col * GRID_GAP_X);
                  const snappedY = Math.max(START_Y, START_Y + row * GRID_GAP_Y);
                  
                  updateIconPosition(dragState.id, snappedX, snappedY);
              }
              setDragState(null);
          }
          if (isSelecting) {
              setIsSelecting(false);
              setSelectionBox(null);
              selectionStartRef.current = null;
          }
      };

      if (dragState || isSelecting) {
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', handleMouseUp);
      }
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };
  }, [dragState, isSelecting, updateIconPosition, iconPositions, allItems, desktopMode]);


  const handleNewFolder = () => {
    const name = prompt('Folder Name:', 'New Folder');
    if (name) createFolder('desktop', name);
  };

  const handleNewFile = () => {
    const name = prompt('File Name:', 'New Text Document.txt');
    if (name) createFile('desktop', name);
  };

  const handlePaste = () => {
      if (clipboard) {
          pasteNodes('desktop');
      }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (dragState || isSelecting) return;

    const options: ContextMenuOption[] = [
      {
        label: 'Refresh',
        icon: RefreshCw,
        action: () => {
            setRefreshKey(prev => prev + 1);
            setSelectedItems(new Set());
        }
      },
      { separator: true, label: '', action: () => {} },
      {
        label: 'Paste',
        icon: Clipboard,
        disabled: !clipboard,
        action: handlePaste
      },
      { separator: true, label: '', action: () => {} },
      {
        label: 'New Folder',
        icon: FolderPlus,
        action: handleNewFolder
      },
      {
        label: 'New Text File',
        icon: FilePlus,
        action: handleNewFile
      },
      { separator: true, label: '', action: () => {} },
      {
        label: 'Next Wallpaper',
        icon: Image,
        action: () => {
           const themes = Object.keys(WALLPAPERS) as Theme[];
           const currentIndex = themes.indexOf(theme);
           const nextIndex = (currentIndex + 1) % themes.length;
           setTheme(themes[nextIndex]);
        }
      },
      {
        label: 'Personalize',
        icon: Monitor,
        action: () => openApp(AppId.SETTINGS)
      },
      { separator: true, label: '', action: () => {} },
      {
        label: 'Open Terminal',
        icon: Terminal,
        action: () => openApp(AppId.TERMINAL),
        disabled: !installedApps.includes(AppId.TERMINAL)
      }
    ];

    openContextMenu(e, options);
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') return <Folder size={28} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />;
    if (node.name.endsWith('.jpg') || node.name.endsWith('.png') || node.name.endsWith('.webp')) return <ImageIcon size={28} className="text-purple-400 drop-shadow-md" />;
    if (node.name.endsWith('.mp3')) return <Music size={28} className="text-red-400 drop-shadow-md" />;
    if (node.name.endsWith('.mp4')) return <Film size={28} className="text-blue-400 drop-shadow-md" />;
    if (node.name.endsWith('.url')) return <Globe size={28} className="text-blue-300 drop-shadow-md" />;
    if (node.name.match(/\.(js|jsx|ts|tsx|html|css|json)$/i)) return <Code size={28} className="text-blue-500 drop-shadow-md" />;
    return <FileText size={28} className="text-gray-300 drop-shadow-md" />;
  };

  const openFile = (node: FileNode) => {
    if (node.type === 'folder') {
       openApp(AppId.FILE_EXPLORER);
    } else if (node.name.endsWith('.url') && node.content) {
        try {
          const data = JSON.parse(node.content);
          if (data.url) {
            openApp(AppId.CHROME, { initialUrl: data.url });
          }
        } catch (e) {
          openApp(AppId.NOTEPAD, { fileId: node.id, initialContent: node.content, fileName: node.name });
        }
    } else if (node.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      openApp(AppId.IMAGE_VIEWER, { fileId: node.id, content: node.content });
    } else if (node.name.match(/\.(mp3|mp4|webm)$/i)) {
      openApp(AppId.MEDIA_PLAYER, { fileId: node.id, content: node.content });
    } else if (node.name.match(/\.(js|jsx|ts|tsx|html|css|json)$/i)) {
      openApp(AppId.VSCODE, { fileId: node.id, content: node.content, fileName: node.name });
    } else {
       openApp(AppId.NOTEPAD, { fileId: node.id, initialContent: node.content, fileName: node.name });
    }
  }

  const openRecycleBin = () => {
      // We simulate opening file explorer at 'trash' path
      // This requires the file explorer to check a prop or we just open standard and let user navigate
      // But typically OS opens directly.
      // We'll implement prop support in File Explorer next, but for now simple open
      // Actually, FileExplorerApp isn't fully props-driven for path yet.
      // We will assume FileExplorerApp handles 'initialPath' prop or similar.
      // Since I can't modify FileExplorerApp props interface in this file, I'll pass it and assume it's handled or user navigates manually.
      // Wait, I am modifying FileExplorerApp too.
      openApp(AppId.FILE_EXPLORER, { initialPath: ['root', 'trash'] });
  };

  return (
    <div 
      id="desktop-bg"
      className="fixed inset-0 w-full h-full bg-cover bg-center overflow-hidden transition-[background-image] duration-700 ease-in-out"
      style={{ backgroundImage: `url(${WALLPAPERS[theme]})` }}
      onMouseDown={handleBackgroundMouseDown}
      onContextMenu={handleContextMenu}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {selectionBox && (
        <div 
          className="absolute border border-blue-400 bg-blue-500/20 z-50 pointer-events-none"
          style={{
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height
          }}
        />
      )}

      {/* Desktop Items Layer */}
      <div className="absolute inset-0 pointer-events-none" key={refreshKey}>
        {allItems.map((item, index) => {
            const pos = getIconPosition(item.id, index);
            const isSelected = selectedItems.has(item.id);
            const isDragging = dragState?.id === item.id;
            
            // Render Logic based on Type
            let icon, label, onDbClick, onContext;

            if (item.type === 'system' && item.id === 'recycle_bin') {
                icon = <Trash2 size={28} className={isTrashEmpty ? "text-gray-300 drop-shadow-md" : "text-gray-300 drop-shadow-md fill-white/50"} />;
                label = "Recycle Bin";
                onDbClick = openRecycleBin;
                onContext = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    openContextMenu(e, [
                        { label: 'Open', action: openRecycleBin },
                        { label: 'Empty Recycle Bin', icon: Trash, action: emptyTrash, disabled: isTrashEmpty },
                    ]);
                };
            } else if (item.type === 'app') {
                const app = item.data as any;
                icon = <app.icon size={28} className="text-white drop-shadow-md" />;
                label = app.title;
                onDbClick = () => openApp(item.id);
                onContext = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    openContextMenu(e, [
                        { label: 'Open', action: () => openApp(item.id) },
                        { label: 'Uninstall', danger: true, action: () => alert("Go to App Market to uninstall.") }
                    ]);
                };
            } else {
                const node = item.data as FileNode;
                icon = getFileIcon(node);
                label = node.name;
                onDbClick = () => openFile(node);
                onContext = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    const itemsToActOn = selectedItems.has(node.id) ? Array.from(selectedItems) : [node.id];
                    openContextMenu(e, [
                        { label: 'Open', action: () => openFile(node) },
                        { separator: true, label: '', action: () => {} },
                        { label: 'Copy', icon: Copy, action: () => copyNodes(itemsToActOn) },
                        { label: 'Cut', icon: Scissors, action: () => cutNodes(itemsToActOn) },
                        { label: 'Delete', danger: true, icon: Trash, action: () => itemsToActOn.forEach(id => deleteNode(id)) }
                    ]);
                };
            }

            return (
                <div
                    key={item.id}
                    style={{ 
                        position: 'absolute', 
                        left: pos.x, 
                        top: pos.y,
                        zIndex: isDragging ? 100 : 1,
                        cursor: 'default'
                    }}
                    onMouseDown={(e) => handleDragStart(e, item.id, pos.x, pos.y)}
                    onDoubleClick={onDbClick}
                    onContextMenu={onContext}
                    className={`pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 rounded-lg border transition-colors select-none
                        ${isSelected ? 'bg-white/20 border-white/30 backdrop-blur-sm' : 'border-transparent hover:bg-white/10'}
                        ${isDragging ? 'opacity-80 scale-105 transition-none' : ''}
                        ${desktopMode === 'grid' && !isDragging ? 'transition-all duration-300 ease-out' : ''}
                    `}
                >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 pointer-events-none 
                        ${item.type === 'app' ? 'bg-gradient-to-br from-white/10 to-white/5 shadow-lg backdrop-blur-sm' : ''}
                    `}>
                        {icon}
                    </div>
                    <span className="text-xs text-white text-center font-medium drop-shadow-md line-clamp-2 break-words leading-tight transition-colors pointer-events-none px-1 rounded bg-black/20">
                        {label}
                    </span>
                </div>
            );
        })}
      </div>

      {/* Windows Layer */}
      {windows.map(window => {
        const AppComp = APPS[window.appId].component;
        return (
          <WindowFrame key={window.id} windowState={window}>
             <Suspense fallback={
                 <div className="flex items-center justify-center h-full text-white bg-gray-900 animate-pulse">
                     <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
                     <span className="sr-only">Loading Application...</span>
                 </div>
             }>
                 <AppComp windowId={window.id} />
             </Suspense>
          </WindowFrame>
        );
      })}
    </div>
  );
};

export default Desktop;