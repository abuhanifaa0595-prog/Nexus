
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId, FileNode } from '../../types';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Film, 
  HardDrive, 
  ArrowUp, 
  Plus, 
  Trash2, 
  Home, 
  Globe, 
  RefreshCw, 
  FolderPlus, 
  FilePlus, 
  Trash, 
  Search, 
  X, 
  Download, 
  Upload, 
  Package, 
  Code, 
  Copy, 
  Scissors, 
  Clipboard,
  RotateCcw
} from 'lucide-react';

const FileExplorerApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { 
    fileSystem, 
    openApp, 
    createFolder, 
    createFile, 
    deleteNode, 
    restoreNode,
    emptyTrash,
    openContextMenu, 
    clipboard, 
    copyNodes, 
    cutNodes, 
    pasteNodes,
    windows
  } = useOS();
  
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize Path from props if provided (e.g., Opening Recycle Bin)
  useEffect(() => {
      const win = windows.find(w => w.id === windowId);
      if (win?.props?.initialPath) {
          setCurrentPath(win.props.initialPath);
      }
  }, [windowId]); // Run once on mount or window change

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFolderId = currentPath[currentPath.length - 1];
  const isTrash = currentFolderId === 'trash';

  // Derived Data
  const currentFolder = fileSystem.find(n => n.id === currentFolderId);
  
  const files = useMemo(() => {
    if (searchQuery.trim()) {
        // Global search
        return fileSystem.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // Contextual folder view
    return fileSystem.filter(n => n.parentId === currentFolderId);
  }, [fileSystem, currentFolderId, searchQuery]);

  // Navigation Handlers
  const handleNavigate = (folderId: string) => {
    setSearchQuery(''); // Clear search when navigating
    setCurrentPath(prev => [...prev, folderId]);
    setSelectedItems(new Set());
  };

  const handleNavigateUp = () => {
    if (currentPath.length > 1) {
      setSearchQuery('');
      setCurrentPath(prev => prev.slice(0, -1));
      setSelectedItems(new Set());
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setSearchQuery('');
    setCurrentPath(prev => prev.slice(0, index + 1));
    setSelectedItems(new Set());
  };

  // Interaction Handlers
  const openNode = (node: FileNode) => {
    if (node.type === 'folder') {
      handleNavigate(node.id);
    } else if (node.name.endsWith('.apk')) {
        openApp(AppId.APK_INSTALLER, { fileId: node.id });
    } else if (node.name.endsWith('.url') && node.content) {
      try {
        const data = JSON.parse(node.content);
        if (data.url) {
          openApp(AppId.BROWSER, { initialUrl: data.url });
        }
      } catch (e) {
        openApp(AppId.NOTEPAD, { fileId: node.id, initialContent: node.content, fileName: node.name });
      }
    } else if (node.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      openApp(AppId.PHOTO_EDITOR, { fileId: node.id, content: node.content });
    } else if (node.name.match(/\.(mp3|mp4|webm)$/i)) {
      openApp(AppId.MEDIA_PLAYER, { fileId: node.id, content: node.content });
    } else if (node.name.match(/\.(js|jsx|ts|tsx|html|css|json)$/i)) {
      openApp(AppId.VSCODE, { fileId: node.id, content: node.content, fileName: node.name });
    } else {
      openApp(AppId.NOTEPAD, { fileId: node.id, initialContent: node.content, fileName: node.name });
    }
  };

  const handleItemClick = (e: React.MouseEvent, node: FileNode) => {
    e.stopPropagation();
    
    // Check for multi-select modifier
    if (e.ctrlKey || e.metaKey) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(node.id)) newSelected.delete(node.id);
      else newSelected.add(node.id);
      setSelectedItems(newSelected);
    } else {
      // Single Click Open Behavior
      setSelectedItems(new Set([node.id]));
      openNode(node);
    }
  };

  const handleNewFolder = () => {
    if (searchQuery || isTrash) return; 
    const name = prompt('Folder Name:', 'New Folder');
    if (name) createFolder(currentFolderId, name);
  };

  const handleNewFile = () => {
    if (searchQuery || isTrash) return;
    const name = prompt('File Name:', 'New Text Document.txt');
    if (name) createFile(currentFolderId, name);
  };

  const handleDelete = (ids: string[] = Array.from(selectedItems)) => {
    if (ids.length === 0) return;
    const isPermanent = isTrash; // If already in trash, delete permanently
    const message = isPermanent 
        ? `Permanently delete ${ids.length} items? This cannot be undone.` 
        : `Move ${ids.length} items to Recycle Bin?`;

    if (window.confirm(message)) {
      ids.forEach(id => deleteNode(id));
      setSelectedItems(new Set());
    }
  };

  const handleRestore = (ids: string[] = Array.from(selectedItems)) => {
      if (ids.length === 0) return;
      ids.forEach(id => restoreNode(id));
      setSelectedItems(new Set());
  };

  const handleCopy = () => {
      if (selectedItems.size === 0 || isTrash) return; // Can't copy from trash typically
      copyNodes(Array.from(selectedItems));
  };

  const handleCut = () => {
      if (selectedItems.size === 0) return;
      cutNodes(Array.from(selectedItems));
  };

  const handlePaste = () => {
      if (!clipboard || isTrash) return; // Can't paste into trash
      pasteNodes(currentFolderId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
          if (e.key === 'c') {
              e.preventDefault();
              handleCopy();
          } else if (e.key === 'x') {
              e.preventDefault();
              handleCut();
          } else if (e.key === 'v') {
              e.preventDefault();
              handlePaste();
          }
      } else if (e.key === 'Delete') {
          handleDelete();
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isTrash) return;
      const files = e.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach((file: File) => {
          const reader = new FileReader();
          
          const isText = file.type.startsWith('text/') || 
                         file.name.endsWith('.js') || 
                         file.name.endsWith('.ts') || 
                         file.name.endsWith('.json') || 
                         file.name.endsWith('.md');

          if (isText) {
              reader.onload = (ev) => {
                  const content = ev.target?.result as string;
                  createFile(currentFolderId, file.name, content);
              };
              reader.readAsText(file);
          } else {
              reader.onload = (ev) => {
                  const content = ev.target?.result as string;
                  createFile(currentFolderId, file.name, content);
              };
              reader.readAsDataURL(file);
          }
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Context Menus
  const handleBackgroundContextMenu = (e: React.MouseEvent) => {
    if (searchQuery) return;
    
    if (isTrash) {
        openContextMenu(e, [
            { label: 'Empty Recycle Bin', icon: Trash, danger: true, action: emptyTrash },
            { label: 'Refresh', icon: RefreshCw, action: () => {} }
        ]);
        return;
    }

    openContextMenu(e, [
        { label: 'Refresh', icon: RefreshCw, action: () => {} },
        { separator: true, label: '', action: () => {} },
        { label: 'Paste', icon: Clipboard, disabled: !clipboard, action: handlePaste },
        { separator: true, label: '', action: () => {} },
        { label: 'Upload from Device', icon: Upload, action: () => fileInputRef.current?.click() },
        { label: 'New Folder', icon: FolderPlus, action: handleNewFolder },
        { label: 'New File', icon: FilePlus, action: handleNewFile },
    ]);
  };

  const handleItemContextMenu = (e: React.MouseEvent, node: FileNode) => {
    if (!selectedItems.has(node.id)) {
        setSelectedItems(new Set([node.id]));
    }
    const itemsToActOn: string[] = selectedItems.has(node.id) ? Array.from(selectedItems) : [node.id];

    if (isTrash) {
        openContextMenu(e, [
            { label: 'Restore', icon: RotateCcw, action: () => handleRestore(itemsToActOn) },
            { label: 'Delete Permanently', icon: Trash, danger: true, action: () => handleDelete(itemsToActOn) }
        ]);
        return;
    }

    openContextMenu(e, [
        { label: 'Open', action: () => openNode(node) },
        { separator: true, label: '', action: () => {} },
        { label: 'Copy', icon: Copy, action: () => copyNodes(itemsToActOn) },
        { label: 'Cut', icon: Scissors, action: () => cutNodes(itemsToActOn) },
        { label: 'Delete', icon: Trash, danger: true, action: () => handleDelete(itemsToActOn) },
    ]);
  };

  // Helpers
  const getIcon = (node: FileNode) => {
    if (node.type === 'folder') return <Folder size={48} className="text-yellow-400 fill-yellow-400" />;
    if (node.name.endsWith('.apk')) return <Package size={48} className="text-green-600" />;
    if (node.name.endsWith('.jpg') || node.name.endsWith('.png') || node.name.endsWith('.webp')) return <ImageIcon size={48} className="text-purple-500" />;
    if (node.name.endsWith('.mp3')) return <Music size={48} className="text-red-500" />;
    if (node.name.endsWith('.mp4')) return <Film size={48} className="text-blue-500" />;
    if (node.name.endsWith('.url')) return <Globe size={48} className="text-blue-400" />;
    if (node.name.match(/\.(js|jsx|ts|tsx|html|css|json)$/i)) return <Code size={48} className="text-blue-500" />;
    return <FileText size={48} className="text-gray-500" />;
  };

  const sidebarItems = [
    { icon: Home, label: 'Home', id: 'root' },
    { icon: Download, label: 'Downloads', id: 'downloads' },
    { icon: Folder, label: 'Documents', id: 'docs' },
    { icon: ImageIcon, label: 'Pictures', id: 'pics' },
    { icon: Music, label: 'Music', id: 'music' },
    { icon: Film, label: 'Videos', id: 'videos' },
    { icon: Trash2, label: 'Recycle Bin', id: 'trash' },
  ];

  return (
    <div 
        className="flex flex-col h-full bg-white text-gray-800 font-sans outline-none" 
        onClick={() => setSelectedItems(new Set())}
        tabIndex={0}
        onKeyDown={handleKeyDown}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        multiple
      />

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
        <button 
          onClick={handleNavigateUp} 
          disabled={currentPath.length <= 1 || !!searchQuery}
          className="p-1.5 hover:bg-gray-200 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowUp size={16} />
        </button>
        <div className="h-4 w-[1px] bg-gray-300 mx-1" />
        
        {/* Contextual Toolbar Buttons */}
        {isTrash ? (
            <>
               <button 
                  onClick={emptyTrash}
                  disabled={files.length === 0}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-red-100 text-red-600 rounded-md text-sm disabled:opacity-50"
                >
                  <Trash size={16} /> <span className="hidden sm:inline">Empty Bin</span>
               </button>
               <button 
                  onClick={() => handleRestore()}
                  disabled={selectedItems.size === 0}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-green-100 text-green-700 rounded-md text-sm disabled:opacity-50"
                >
                  <RotateCcw size={16} /> <span className="hidden sm:inline">Restore Selected</span>
               </button>
            </>
        ) : (
            <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-200 rounded-md text-sm"
                >
                    <Upload size={16} /> <span className="hidden sm:inline">Upload</span>
                </button>
                <button 
                  onClick={handleNewFolder}
                  disabled={!!searchQuery}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-200 rounded-md text-sm disabled:opacity-50"
                >
                  <Plus size={16} /> <span className="hidden sm:inline">New Folder</span>
                </button>
            </>
        )}

        <div className="flex-1" />
        
        {/* Search Bar */}
        <div className="relative flex items-center w-64 mr-2">
            <Search size={14} className="absolute left-2.5 text-gray-400" />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full bg-white border border-gray-300 rounded-md py-1.5 pl-8 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                    <X size={14} />
                </button>
            )}
        </div>

        <button 
          onClick={() => handleDelete()}
          disabled={selectedItems.size === 0}
          className="p-1.5 hover:bg-red-100 text-red-600 rounded-md disabled:opacity-30 disabled:hover:bg-transparent disabled:text-gray-500"
          title={isTrash ? "Delete Permanently" : "Delete"}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
        <HardDrive size={16} className="text-gray-500" />
        <div className="flex items-center text-sm overflow-hidden whitespace-nowrap">
          {searchQuery ? (
              <span className="text-gray-700 font-medium italic">Search Results: "{searchQuery}"</span>
          ) : (
              currentPath.map((id, index) => {
                const node = fileSystem.find(n => n.id === id);
                return (
                  <React.Fragment key={id}>
                    {index > 0 && <span className="mx-1 text-gray-400">›</span>}
                    <button 
                      onClick={() => handleBreadcrumbClick(index)}
                      className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer font-medium text-gray-700 truncate max-w-[150px]"
                    >
                      {node?.name || 'Unknown'}
                    </button>
                  </React.Fragment>
                );
              })
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col py-2 hidden md:flex">
          {sidebarItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                if (fileSystem.find(n => n.id === item.id)) {
                   setSearchQuery('');
                   if (item.id === 'root') setCurrentPath(['root']);
                   else setCurrentPath(['root', item.id]);
                }
              }}
              className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left
                ${currentFolderId === item.id && !searchQuery ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-200 text-gray-700'}
              `}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>

        {/* File Area */}
        <div 
            className="flex-1 overflow-auto p-4"
            onContextMenu={handleBackgroundContextMenu}
        >
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 select-none">
              {searchQuery ? (
                  <>
                    <Search size={64} className="mb-2 opacity-20" />
                    <p>No items found for "{searchQuery}"</p>
                  </>
              ) : isTrash ? (
                  <>
                    <Trash2 size={64} className="mb-2 opacity-20" />
                    <p>Recycle Bin is empty</p>
                  </>
              ) : (
                  <>
                    <Folder size={64} className="mb-2 opacity-20" />
                    <p>This folder is empty</p>
                    <p className="text-sm mt-2">Right-click to upload or create new</p>
                  </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 content-start">
              {files.map((node) => {
                  const isCut = clipboard?.op === 'cut' && clipboard.nodes.includes(node.id);
                  return (
                    <div 
                      key={node.id}
                      onClick={(e) => handleItemClick(e, node)}
                      onContextMenu={(e) => handleItemContextMenu(e, node)}
                      className={`
                        group flex flex-col items-center p-4 rounded-lg cursor-pointer border transition-all
                        ${selectedItems.has(node.id) 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                        }
                        ${isCut ? 'opacity-50' : ''}
                      `}
                    >
                      <div className="mb-2 transition-transform group-hover:scale-105 duration-200 relative">
                        {getIcon(node)}
                      </div>
                      <span className={`text-xs text-center truncate w-full px-1 rounded
                         ${selectedItems.has(node.id) ? 'bg-blue-200/50 font-medium text-blue-900' : 'text-gray-700'}
                      `}>
                        {node.name}
                      </span>
                      {searchQuery && (
                          <span className="text-[10px] text-gray-400 mt-1 truncate max-w-full">
                              In: {fileSystem.find(p => p.id === node.parentId)?.name || 'Unknown'}
                          </span>
                      )}
                    </div>
                  );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-gray-50 border-t border-gray-200 flex items-center px-4 text-[11px] text-gray-500 select-none">
        <span className="mr-4">{files.length} items</span>
        {selectedItems.size > 0 && <span>{selectedItems.size} selected</span>}
      </div>
    </div>
  );
};

export default FileExplorerApp;
