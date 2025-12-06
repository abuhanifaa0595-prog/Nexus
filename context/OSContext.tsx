
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { WindowState, AppId, Theme, FileNode, ContextMenuOption, User } from '../types';
import { APPS } from '../constants';

interface SystemStats {
  totalMemory: number; // MB
  usedMemory: number; // MB
  totalStorage: number; // MB
  usedStorage: number; // MB
}

interface ClipboardItem {
    nodes: string[];
    op: 'copy' | 'cut';
}

interface OSContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  openApp: (appId: string, props?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  
  // App Management
  installedApps: string[];
  installApp: (appId: string) => void;
  uninstallApp: (appId: string) => void;

  // File System
  fileSystem: FileNode[];
  createFile: (parentId: string, name: string, content?: string) => void;
  createFolder: (parentId: string, name: string) => void;
  deleteNode: (id: string) => void;
  restoreNode: (id: string) => void;
  emptyTrash: () => void;
  getFileContent: (id: string) => string | undefined;
  updateFileContent: (id: string, content: string) => void;
  
  // Desktop Icons
  iconPositions: Record<string, {x: number, y: number}>;
  updateIconPosition: (id: string, x: number, y: number) => void;
  desktopMode: 'grid' | 'free';
  setDesktopMode: (mode: 'grid' | 'free') => void;
  desktopSortOrder: string[];
  updateDesktopSortOrder: (order: string[]) => void;
  
  // Clipboard
  clipboard: ClipboardItem | null;
  copyNodes: (ids: string[]) => void;
  cutNodes: (ids: string[]) => void;
  pasteNodes: (targetFolderId: string) => void;

  // System Stats
  systemStats: SystemStats;

  // System Settings
  volume: number;
  setVolume: (v: number) => void;
  brightness: number;
  setBrightness: (b: number) => void;
  isWifiOn: boolean;
  toggleWifi: () => void;
  isBluetoothOn: boolean;
  toggleBluetooth: () => void;
  isAirplaneModeOn: boolean;
  toggleAirplaneMode: () => void;
  resetSystem: () => void;
  shutDown: () => void;
  logout: () => void;

  // Context Menu
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    options: ContextMenuOption[];
  };
  openContextMenu: (e: React.MouseEvent, options: ContextMenuOption[]) => void;
  closeContextMenu: () => void;

  // Auth & Account
  user: User;
  users: User[];
  isLocked: boolean;
  lockScreen: () => void;
  unlockScreen: (password: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
  addUser: (user: User) => void;
  removeUser: (username: string) => void;
  loginUser: (username: string) => void;

  // Mobile/Tablet Features
  isTaskViewOpen: boolean;
  toggleTaskView: () => void;
  isControlCenterOpen: boolean;
  toggleControlCenter: () => void;
  closeControlCenter: () => void;
  goHome: () => void;
  goBack: () => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

// Initial File System Data
const initialFileSystem: FileNode[] = [
  { id: 'root', parentId: null, name: 'This PC', type: 'folder', createdAt: Date.now() },
  { id: 'desktop', parentId: 'root', name: 'Desktop', type: 'folder', createdAt: Date.now() },
  { id: 'downloads', parentId: 'root', name: 'Downloads', type: 'folder', createdAt: Date.now() },
  { id: 'docs', parentId: 'root', name: 'Documents', type: 'folder', createdAt: Date.now() },
  { id: 'pics', parentId: 'root', name: 'Pictures', type: 'folder', createdAt: Date.now() },
  { id: 'music', parentId: 'root', name: 'Music', type: 'folder', createdAt: Date.now() },
  { id: 'videos', parentId: 'root', name: 'Videos', type: 'folder', createdAt: Date.now() },
  { id: 'trash', parentId: 'root', name: 'Recycle Bin', type: 'folder', createdAt: Date.now() },
  { id: 'readme', parentId: 'desktop', name: 'ReadMe.txt', type: 'file', content: 'Welcome to NexusOS!\n\nThis is a fully functional web-based operating system.\n\nEnjoy your stay!', createdAt: Date.now() },
  { id: 'todo', parentId: 'docs', name: 'ToDo.txt', type: 'file', content: '- Explore File Explorer\n- Ask Gemini a question\n- Customize theme\n- Check out the App Market', createdAt: Date.now() },
  { id: 'sys', parentId: 'root', name: 'System', type: 'folder', createdAt: Date.now() },
  { id: 'config', parentId: 'sys', name: 'config.json', type: 'file', content: '{\n  "version": "1.0.0",\n  "build": "stable"\n}', createdAt: Date.now() },
  
  // Sample Media
  { id: 'sample_vid', parentId: 'videos', name: 'Nature_Flight.mp4', type: 'file', content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', createdAt: Date.now() },
  { id: 'sample_music', parentId: 'music', name: 'Ambient_Chill.mp3', type: 'file', content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', createdAt: Date.now() },
  { id: 'sample_img1', parentId: 'pics', name: 'Mountain.jpg', type: 'file', content: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now() },
  { id: 'sample_img2', parentId: 'pics', name: 'Code.png', type: 'file', content: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now() },
  { id: 'project1', parentId: 'docs', name: 'main.js', type: 'file', content: 'console.log("Hello World");\n\nfunction add(a, b) {\n  return a + b;\n}', createdAt: Date.now() },
];

const initialUsers: User[] = [
  {
    name: 'Nexus User',
    username: 'nexus',
    email: 'user@nexus.os',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    password: 'nexus',
    isAdmin: true // Default Admin
  }
];

const defaultInstalledApps = [
    AppId.GEMINI_CHAT,
    AppId.CHROME,
    AppId.FILE_EXPLORER,
    AppId.SETTINGS,
    AppId.APP_MARKET,
    AppId.NOTEPAD,
    AppId.VSCODE,
    AppId.MEDIA_PLAYER,
    AppId.IMAGE_VIEWER,
    AppId.PHOTO_EDITOR,
    AppId.TERMINAL,
    AppId.NEXUS_OFFICE,
    AppId.PLAY_STORE,
    AppId.APK_INSTALLER
];

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persistence Helper
  const getStorage = <T,>(key: string, initial: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initial;
    } catch (e) {
        return initial;
    }
  };

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => getStorage('nexus_theme', 'nebula'));
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  
  // System Settings
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(100);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [isAirplaneModeOn, setIsAirplaneModeOn] = useState(false);

  // Desktop Icons
  const [iconPositions, setIconPositions] = useState<Record<string, {x: number, y: number}>>(() => getStorage('nexus_icons', {}));
  // Default mode is now 'grid' (Snap to grid) instead of free or auto
  const [desktopMode, setDesktopMode] = useState<'grid' | 'free'>(() => {
      const stored = localStorage.getItem('nexus_desktop_mode');
      if (stored === 'auto' || stored === 'grid') return 'grid'; // Migrate 'auto' to 'grid'
      if (stored === 'free') return 'free';
      return 'grid'; 
  });
  const [desktopSortOrder, setDesktopSortOrder] = useState<string[]>(() => getStorage('nexus_desktop_sort', []));

  const updateIconPosition = useCallback((id: string, x: number, y: number) => {
    setIconPositions(prev => ({ ...prev, [id]: { x, y } }));
  }, []);

  const updateDesktopSortOrder = useCallback((order: string[]) => {
      setDesktopSortOrder(order);
  }, []);

  // Auth State
  // Persistent Lock State: Default to true if not found or if explicity locked
  const [isLocked, setIsLocked] = useState<boolean>(() => getStorage('nexus_locked', true));
  const [users, setUsers] = useState<User[]>(() => getStorage('nexus_users', initialUsers));
  const [currentUser, setCurrentUser] = useState<User>(() => getStorage('nexus_current_user', users[0] || initialUsers[0]));

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number; options: ContextMenuOption[] }>({
    isOpen: false,
    x: 0,
    y: 0,
    options: []
  });

  // App State
  const [installedApps, setInstalledApps] = useState<string[]>(() => getStorage('nexus_apps', defaultInstalledApps));

  // File System State
  const [fileSystem, setFileSystem] = useState<FileNode[]>(() => getStorage('nexus_fs', initialFileSystem));
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('nexus_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('nexus_icons', JSON.stringify(iconPositions)); }, [iconPositions]);
  useEffect(() => { localStorage.setItem('nexus_desktop_mode', desktopMode); }, [desktopMode]);
  useEffect(() => { localStorage.setItem('nexus_desktop_sort', JSON.stringify(desktopSortOrder)); }, [desktopSortOrder]);
  useEffect(() => { localStorage.setItem('nexus_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nexus_current_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('nexus_apps', JSON.stringify(installedApps)); }, [installedApps]);
  useEffect(() => { localStorage.setItem('nexus_fs', JSON.stringify(fileSystem)); }, [fileSystem]);
  
  // Critical: Persist lock state so refresh doesn't lock if not needed
  useEffect(() => { localStorage.setItem('nexus_locked', JSON.stringify(isLocked)); }, [isLocked]);

  // Calculate System Stats
  const systemStats = useMemo(() => {
    // 16 GB Total RAM
    const TOTAL_MEMORY = 16 * 1024; 
    
    // 64 GB Total Storage (simulated small SSD for web)
    const TOTAL_STORAGE = 64 * 1024; 
    
    const OS_MEMORY_OVERHEAD = 2048; // 2 GB
    const OS_STORAGE_OVERHEAD = 12 * 1024; // 12 GB

    // Calculate RAM based on open windows
    const appsMemory = windows.reduce((acc, win) => {
        const app = APPS[win.appId];
        return acc + (app?.memoryUsage || 200);
    }, 0);
    
    // Used RAM
    const usedMemory = Math.min(TOTAL_MEMORY, OS_MEMORY_OVERHEAD + appsMemory);

    // Calculate Storage based on Installed Apps
    const appsStorage = installedApps.reduce((acc, appId) => {
        const app = APPS[appId];
        return acc + (app?.storageSize || 100);
    }, 0);
    
    // Calculate REAL file content size
    const fileContentStorage = fileSystem.reduce((acc, node) => {
        if (node.type === 'file' && node.content) {
            return acc + (node.content.length / (1024 * 1024));
        }
        return acc;
    }, 0);
    
    const usedStorage = Math.min(TOTAL_STORAGE, OS_STORAGE_OVERHEAD + appsStorage + fileContentStorage);

    return {
        totalMemory: TOTAL_MEMORY,
        usedMemory,
        totalStorage: TOTAL_STORAGE,
        usedStorage
    };
  }, [windows, installedApps, fileSystem]);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setZIndexCounter(prev => prev + 1);
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: zIndexCounter + 1, isMinimized: false } : w
    ));
    setIsStartMenuOpen(false);
    setIsTaskViewOpen(false);
    setIsControlCenterOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, [zIndexCounter]);

  const openApp = useCallback((appId: string, props?: any) => {
    if (!installedApps.includes(appId)) {
        alert("This app is not installed. Please install it from the Play Store or via APK.");
        return;
    }

    const appConfig = APPS[appId];
    if (!appConfig) return;

    // RAM Check
    if (systemStats.usedMemory + (appConfig.memoryUsage || 200) > systemStats.totalMemory) {
        alert("Not enough memory to open this application. Close some windows.");
        return;
    }

    const id = `${appId}-${Date.now()}`;
    const newWindow: WindowState = {
      id,
      appId,
      title: appConfig.title,
      x: 100 + (windows.length * 30),
      y: 50 + (windows.length * 30),
      width: appConfig.defaultWidth,
      height: appConfig.defaultHeight,
      isMinimized: false,
      isMaximized: false,
      zIndex: zIndexCounter + 1,
      props
    };

    setZIndexCounter(prev => prev + 1);
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
    setIsStartMenuOpen(false);
    setIsTaskViewOpen(false);
    setIsControlCenterOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, [windows, zIndexCounter, installedApps, systemStats]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
    focusWindow(id);
  }, [focusWindow]);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width, height } : w
    ));
  }, []);

  const toggleStartMenu = useCallback(() => {
    setIsStartMenuOpen(prev => !prev);
    setIsTaskViewOpen(false);
    setIsControlCenterOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);
  
  const closeStartMenu = useCallback(() => setIsStartMenuOpen(false), []);

  const toggleTaskView = useCallback(() => {
    setIsTaskViewOpen(prev => !prev);
    setIsStartMenuOpen(false);
    setIsControlCenterOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggleControlCenter = useCallback(() => {
    setIsControlCenterOpen(prev => !prev);
    setIsStartMenuOpen(false);
    setIsTaskViewOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  const closeControlCenter = useCallback(() => setIsControlCenterOpen(false), []);

  const goHome = useCallback(() => {
    setIsStartMenuOpen(false);
    setIsTaskViewOpen(false);
    setIsControlCenterOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
    // Minimize all windows
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
    setActiveWindowId(null);
  }, []);

  const goBack = useCallback(() => {
      if (contextMenu.isOpen) {
          setContextMenu(prev => ({ ...prev, isOpen: false }));
          return;
      }
      if (isControlCenterOpen) {
          setIsControlCenterOpen(false);
          return;
      }
      if (isStartMenuOpen) {
          setIsStartMenuOpen(false);
          return;
      }
      if (isTaskViewOpen) {
          setIsTaskViewOpen(false);
          return;
      }
      if (activeWindowId) {
          minimizeWindow(activeWindowId);
          return;
      }
  }, [contextMenu.isOpen, isStartMenuOpen, isTaskViewOpen, isControlCenterOpen, activeWindowId, minimizeWindow]);

  const installApp = useCallback((appId: string) => {
    const appConfig = APPS[appId];
    if (!appConfig) return;

    if (systemStats.usedStorage + appConfig.storageSize > systemStats.totalStorage) {
        alert("Not enough storage space to install this application.");
        return;
    }

    setInstalledApps(prev => {
        if (prev.includes(appId)) return prev;
        return [...prev, appId];
    });
  }, [systemStats]);

  const uninstallApp = useCallback((appId: string) => {
    setInstalledApps(prev => prev.filter(id => id !== appId));
    setWindows(prev => prev.filter(w => w.appId !== appId));
  }, []);

  // File System Operations
  const createFile = useCallback((parentId: string, name: string, content: string = '') => {
    const fileSizeMB = content.length / (1024 * 1024);
    if (systemStats.usedStorage + fileSizeMB > systemStats.totalStorage) {
        alert("Disk Full. Cannot create file.");
        return;
    }

    // Handle collision
    let newName = name;
    const siblings = fileSystem.filter(n => n.parentId === parentId);
    let counter = 1;
    while (siblings.find(s => s.name === newName)) {
        const dotIndex = name.lastIndexOf('.');
        if (dotIndex > 0) {
            newName = `${name.substring(0, dotIndex)} (${counter})${name.substring(dotIndex)}`;
        } else {
            newName = `${name} (${counter})`;
        }
        counter++;
    }

    const newFile: FileNode = {
      id: `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      parentId,
      name: newName,
      type: 'file',
      content,
      createdAt: Date.now()
    };
    setFileSystem(prev => [...prev, newFile]);
  }, [systemStats, fileSystem]);

  const createFolder = useCallback((parentId: string, name: string) => {
    // Handle collision
    let newName = name;
    const siblings = fileSystem.filter(n => n.parentId === parentId);
    let counter = 1;
    while (siblings.find(s => s.name === newName)) {
        newName = `${name} (${counter})`;
        counter++;
    }

    const newFolder: FileNode = {
      id: `folder-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      parentId,
      name: newName,
      type: 'folder',
      createdAt: Date.now()
    };
    setFileSystem(prev => [...prev, newFolder]);
  }, [fileSystem]);

  const deleteNode = useCallback((id: string) => {
    const node = fileSystem.find(n => n.id === id);
    if (!node) return;

    if (node.parentId === 'trash') {
        // Permanent Delete
        const getDescendants = (nodeId: string): string[] => {
          const children = fileSystem.filter(n => n.parentId === nodeId);
          let ids = children.map(c => c.id);
          children.forEach(c => {
            if (c.type === 'folder') {
              ids = [...ids, ...getDescendants(c.id)];
            }
          });
          return ids;
        };

        const idsToDelete = [id, ...getDescendants(id)];
        setFileSystem(prev => prev.filter(n => !idsToDelete.includes(n.id)));
    } else {
        // Move to Trash
        setFileSystem(prev => prev.map(n => n.id === id ? { ...n, parentId: 'trash', originalParentId: n.parentId } : n));
    }
  }, [fileSystem]);

  const restoreNode = useCallback((id: string) => {
      setFileSystem(prev => prev.map(n => {
          if (n.id === id) {
              // Try to restore to original parent, if it exists. Else desktop.
              const originalParentExists = prev.some(p => p.id === n.originalParentId);
              return { 
                  ...n, 
                  parentId: originalParentExists ? (n.originalParentId || 'desktop') : 'desktop',
                  originalParentId: null 
              };
          }
          return n;
      }));
  }, []);

  const emptyTrash = useCallback(() => {
      // Find all items in trash
      const trashItems = fileSystem.filter(n => n.parentId === 'trash');
      if (trashItems.length === 0) return;

      if (!window.confirm(`Are you sure you want to permanently delete ${trashItems.length} items?`)) return;

      const getDescendants = (nodeId: string): string[] => {
          const children = fileSystem.filter(n => n.parentId === nodeId);
          let ids = children.map(c => c.id);
          children.forEach(c => {
            if (c.type === 'folder') {
              ids = [...ids, ...getDescendants(c.id)];
            }
          });
          return ids;
        };

      let idsToDelete: string[] = [];
      trashItems.forEach(item => {
          idsToDelete.push(item.id);
          idsToDelete = [...idsToDelete, ...getDescendants(item.id)];
      });

      setFileSystem(prev => prev.filter(n => !idsToDelete.includes(n.id)));
  }, [fileSystem]);

  const getFileContent = useCallback((id: string) => {
    return fileSystem.find(n => n.id === id)?.content;
  }, [fileSystem]);

  const updateFileContent = useCallback((id: string, content: string) => {
     const currentFile = fileSystem.find(f => f.id === id);
     if (currentFile && currentFile.content) {
         const diffMB = (content.length - currentFile.content.length) / (1024 * 1024);
         if (systemStats.usedStorage + diffMB > systemStats.totalStorage) {
             alert("Disk Full. Cannot save changes.");
             return;
         }
     }

    setFileSystem(prev => prev.map(node => 
      node.id === id ? { ...node, content } : node
    ));
  }, [fileSystem, systemStats]);

  // Clipboard Operations
  const copyNodes = useCallback((ids: string[]) => {
      setClipboard({ nodes: ids, op: 'copy' });
  }, []);

  const cutNodes = useCallback((ids: string[]) => {
      setClipboard({ nodes: ids, op: 'cut' });
  }, []);

  const pasteNodes = useCallback((targetFolderId: string) => {
      if (!clipboard) return;

      if (clipboard.op === 'cut') {
          // Move items
          setFileSystem(prev => prev.map(node => {
              if (clipboard.nodes.includes(node.id)) {
                  // Prevent moving a folder into itself
                  if (node.id === targetFolderId) return node;
                  return { ...node, parentId: targetFolderId };
              }
              return node;
          }));
          setClipboard(null);
      } else {
          // Copy items (Recursive for folders)
          const newNodes: FileNode[] = [];

          const duplicateNode = (nodeId: string, newParentId: string) => {
              const node = fileSystem.find(n => n.id === nodeId);
              if (!node) return;

              // Handle name collision
              let newName = node.name;
              const siblings = fileSystem.filter(n => n.parentId === newParentId);
              let counter = 1;
              while (siblings.find(s => s.name === newName)) {
                  // Insert (1), (2) before extension
                  const dotIndex = node.name.lastIndexOf('.');
                  if (dotIndex > 0) {
                      newName = `${node.name.substring(0, dotIndex)} (${counter})${node.name.substring(dotIndex)}`;
                  } else {
                      newName = `${node.name} (${counter})`;
                  }
                  counter++;
              }

              const newId = `${node.type}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
              const newNode: FileNode = {
                  ...node,
                  id: newId,
                  parentId: newParentId,
                  name: newName,
                  createdAt: Date.now()
              };
              newNodes.push(newNode);

              // Recurse children if folder
              if (node.type === 'folder') {
                  const children = fileSystem.filter(c => c.parentId === nodeId);
                  children.forEach(child => duplicateNode(child.id, newId));
              }
          };

          clipboard.nodes.forEach(id => duplicateNode(id, targetFolderId));
          setFileSystem(prev => [...prev, ...newNodes]);
      }
  }, [clipboard, fileSystem]);

  const openContextMenu = useCallback((e: React.MouseEvent, options: ContextMenuOption[]) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      options
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  const lockScreen = useCallback(() => {
    setIsLocked(true);
    setIsStartMenuOpen(false);
  }, []);

  const unlockScreen = useCallback((password: string) => {
    if (currentUser.isGuest) {
      setIsLocked(false);
      return true;
    }
    if (password === currentUser.password) {
      setIsLocked(false);
      return true;
    }
    return false;
  }, [currentUser]);

  const updateUser = useCallback((updates: Partial<User>) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.username === updatedUser.username ? updatedUser : u));
  }, [currentUser]);

  const addUser = useCallback((newUser: User) => {
    if (!currentUser.isAdmin) {
        alert("Permission denied: Only administrators can add users.");
        return;
    }
    if (users.some(u => u.username === newUser.username)) {
      alert("Username already exists!");
      return;
    }
    setUsers(prev => [...prev, newUser]);
  }, [users, currentUser]);

  const removeUser = useCallback((username: string) => {
    if (!currentUser.isAdmin) {
        alert("Permission denied: Only administrators can remove users.");
        return;
    }
     const targetUser = users.find(u => u.username === username);
     if (targetUser?.isAdmin) {
         alert("Cannot remove an administrator account.");
         return;
     }
     if (users.length <= 1) {
       alert("Cannot remove the last user.");
       return;
     }
     setUsers(prev => prev.filter(u => u.username !== username));
  }, [users, currentUser]);

  const loginUser = useCallback((username: string) => {
    const targetUser = users.find(u => u.username === username);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  }, [users]);

  const resetSystem = useCallback(() => {
      if (window.confirm("Are you sure you want to factory reset? All data will be lost.")) {
          localStorage.clear();
          window.location.reload();
      }
  }, []);

  const shutDown = useCallback(() => {
      setIsLocked(true);
      setWindows([]);
      setIsStartMenuOpen(false);
      // Simulate power cycle by reloading to show boot screen, but locked
      window.location.reload();
  }, []);

  const logout = useCallback(() => {
      setIsLocked(true);
      setWindows([]);
      setIsStartMenuOpen(false);
  }, []);

  // Toggles
  const toggleWifi = useCallback(() => setIsWifiOn(p => !p), []);
  const toggleBluetooth = useCallback(() => setIsBluetoothOn(p => !p), []);
  const toggleAirplaneMode = useCallback(() => setIsAirplaneModeOn(p => !p), []);

  return (
    <OSContext.Provider value={{
      windows,
      activeWindowId,
      theme,
      setTheme,
      openApp,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      isStartMenuOpen,
      toggleStartMenu,
      closeStartMenu,
      installedApps,
      installApp,
      uninstallApp,
      fileSystem,
      createFile,
      createFolder,
      deleteNode,
      restoreNode,
      emptyTrash,
      getFileContent,
      updateFileContent,
      iconPositions,
      updateIconPosition,
      desktopMode,
      setDesktopMode,
      desktopSortOrder,
      updateDesktopSortOrder,
      clipboard,
      copyNodes,
      cutNodes,
      pasteNodes,
      systemStats,
      volume,
      setVolume,
      brightness,
      setBrightness,
      isWifiOn,
      toggleWifi,
      isBluetoothOn,
      toggleBluetooth,
      isAirplaneModeOn,
      toggleAirplaneMode,
      resetSystem,
      shutDown,
      logout,
      contextMenu,
      openContextMenu,
      closeContextMenu,
      user: currentUser, // Deprecated but kept for compat
      users,
      isLocked,
      lockScreen,
      unlockScreen,
      updateUser,
      addUser,
      removeUser,
      loginUser,
      isTaskViewOpen,
      toggleTaskView,
      isControlCenterOpen,
      toggleControlCenter,
      closeControlCenter,
      goHome,
      goBack
    }}>
      <div style={{ filter: `brightness(${brightness}%)` }} className="w-full h-full transition-[filter] duration-300">
        {children}
      </div>
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within OSProvider');
  return context;
};
