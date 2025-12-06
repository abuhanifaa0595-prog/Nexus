
import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Files, 
  Search, 
  GitBranch, 
  Bug, 
  Monitor, 
  Settings, 
  UserCircle, 
  Menu, 
  ChevronRight, 
  ChevronDown, 
  X,
  FileCode,
  Folder,
  Play
} from 'lucide-react';
import { FileNode } from '../../types';

interface VSCodeTab {
  id: string;
  fileId: string;
  name: string;
  content: string;
  isDirty: boolean;
}

const VSCodeApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { fileSystem, updateFileContent, createFile } = useOS();
  
  // State
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [tabs, setTabs] = useState<VSCodeTab[]>([]);
  const [sidebarActive, setSidebarActive] = useState('explorer');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [terminalOpen, setTerminalOpen] = useState(true);

  // Load initial file if provided
  useEffect(() => {
     // Check if we opened a file from props, logic usually in OSContext but here we assume props passed
     // For this basic clone, we rely on the internal explorer to open files
  }, []);

  const openFile = (node: FileNode) => {
    if (tabs.find(t => t.fileId === node.id)) {
      setActiveTabId(node.id);
      return;
    }
    
    const newTab: VSCodeTab = {
      id: node.id,
      fileId: node.id,
      name: node.name,
      content: node.content || '',
      isDirty: false
    };
    
    setTabs([...tabs, newTab]);
    setActiveTabId(node.id);
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
       setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
    }
  };

  const handleContentChange = (val: string) => {
    if (!activeTabId) return;
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, content: val, isDirty: true } : t));
  };

  const handleSave = () => {
    if (!activeTabId) return;
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        updateFileContent(tab.fileId, tab.content);
        setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isDirty: false } : t));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          handleSave();
      }
  };

  const toggleFolder = (folderId: string) => {
      const newSet = new Set(expandedFolders);
      if (newSet.has(folderId)) newSet.delete(folderId);
      else newSet.add(folderId);
      setExpandedFolders(newSet);
  };

  const renderTree = (parentId: string | null, depth = 0) => {
      const children = fileSystem.filter(n => n.parentId === parentId);
      if (children.length === 0) return null;

      return children.map(node => (
          <div key={node.id}>
              <div 
                className={`flex items-center gap-1 py-0.5 px-2 hover:bg-[#37373d] cursor-pointer text-sm ${node.id === activeTabId ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'}`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={() => node.type === 'folder' ? toggleFolder(node.id) : openFile(node)}
              >
                  {node.type === 'folder' && (
                      <span className="text-[#cccccc]">
                          {expandedFolders.has(node.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                  )}
                  {node.type === 'folder' ? (
                      <Folder size={14} className="text-[#dcb67a] mr-1" />
                  ) : (
                      <FileCode size={14} className="text-[#4fc1ff] mr-1" />
                  )}
                  <span className="truncate">{node.name}</span>
              </div>
              {node.type === 'folder' && expandedFolders.has(node.id) && renderTree(node.id, depth + 1)}
          </div>
      ));
  };

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-sans text-sm" onKeyDown={handleKeyDown}>
      {/* Title Bar (Simulated) */}
      <div className="h-8 flex items-center justify-center bg-[#1e1e1e] border-b border-[#252526] text-xs select-none relative">
          <span>{activeTab ? `${activeTab.name} - Visual Studio Code` : 'Visual Studio Code'}</span>
          <div className="absolute left-0 flex items-center h-full px-2 gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" className="w-4 h-4" alt="VSCode" />
              <div className="flex gap-2 text-[#cccccc] hover:text-white cursor-pointer">
                  <span>File</span>
                  <span>Edit</span>
                  <span>Selection</span>
                  <span>View</span>
                  <span>Go</span>
                  <span>Run</span>
                  <span>Terminal</span>
                  <span>Help</span>
              </div>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Activity Bar */}
          <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-4 border-r border-[#252526] z-10">
              <div className={`p-2 cursor-pointer border-l-2 ${sidebarActive === 'explorer' ? 'border-white text-white' : 'border-transparent text-[#858585] hover:text-white'}`} onClick={() => setSidebarActive('explorer')}>
                  <Files size={24} />
              </div>
              <div className="p-2 cursor-pointer text-[#858585] hover:text-white"><Search size={24} /></div>
              <div className="p-2 cursor-pointer text-[#858585] hover:text-white"><GitBranch size={24} /></div>
              <div className="p-2 cursor-pointer text-[#858585] hover:text-white"><Bug size={24} /></div>
              <div className="p-2 cursor-pointer text-[#858585] hover:text-white"><Monitor size={24} /></div>
              <div className="mt-auto p-2 cursor-pointer text-[#858585] hover:text-white"><UserCircle size={24} /></div>
              <div className="p-2 cursor-pointer text-[#858585] hover:text-white"><Settings size={24} /></div>
          </div>

          {/* Sidebar */}
          {sidebarActive === 'explorer' && (
              <div className="w-60 bg-[#252526] flex flex-col border-r border-[#252526]">
                  <div className="h-9 px-4 flex items-center text-xs font-bold uppercase tracking-wider text-[#bbbbbb]">Explorer</div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="px-2 py-1 flex items-center gap-1 font-bold text-xs text-[#bbbbbb] cursor-pointer hover:bg-[#37373d]" onClick={() => toggleFolder('root')}>
                          {expandedFolders.has('root') ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                          NEXUS-WORKSPACE
                      </div>
                      {expandedFolders.has('root') && renderTree('root')}
                  </div>
              </div>
          )}

          {/* Editor Area */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e] min-w-0">
              {/* Tabs */}
              <div className="flex bg-[#252526] overflow-x-auto scrollbar-hide">
                  {tabs.map(tab => (
                      <div 
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`
                           flex items-center gap-2 px-3 py-2 min-w-[120px] max-w-[200px] text-xs cursor-pointer border-r border-[#252526]
                           ${activeTabId === tab.id ? 'bg-[#1e1e1e] text-white border-t border-t-blue-500' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2d2d2d]/80'}
                        `}
                      >
                          <FileCode size={14} className={activeTabId === tab.id ? 'text-[#eacb64]' : 'text-[#969696]'} />
                          <span className="truncate flex-1">{tab.name}</span>
                          {tab.isDirty ? (
                             <div className="w-2 h-2 rounded-full bg-white ml-2"></div>
                          ) : (
                             <X size={14} className="hover:bg-[#4d4d4d] rounded-sm p-0.5" onClick={(e) => closeTab(e, tab.id)} />
                          )}
                      </div>
                  ))}
              </div>

              {/* Editor Content */}
              {activeTab ? (
                   <div className="flex-1 relative flex">
                       <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-2 pt-4 select-none text-xs leading-6 border-r border-[#2b2b2b]">
                           {activeTab.content.split('\n').map((_, i) => (
                               <div key={i}>{i + 1}</div>
                           ))}
                       </div>
                       <textarea 
                           className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 pt-4 outline-none resize-none font-mono text-xs leading-6 whitespace-pre"
                           value={activeTab.content}
                           onChange={(e) => handleContentChange(e.target.value)}
                           spellCheck={false}
                       />
                   </div>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-[#858585]">
                      <div className="mb-4">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" className="w-32 h-32 opacity-20 grayscale" alt="VSCode" />
                      </div>
                      <div className="text-sm">Show All Commands <span className="bg-[#333] px-1 rounded text-xs">Ctrl+Shift+P</span></div>
                      <div className="text-sm mt-2">Go to File <span className="bg-[#333] px-1 rounded text-xs">Ctrl+P</span></div>
                  </div>
              )}

              {/* Integrated Terminal */}
              {terminalOpen && (
                  <div className="h-48 border-t border-[#414141] bg-[#1e1e1e] flex flex-col">
                      <div className="flex items-center gap-4 px-4 py-1 text-xs uppercase border-b border-[#252526]">
                          <span className="text-white border-b border-white cursor-pointer pb-1">Terminal</span>
                          <span className="text-[#858585] hover:text-white cursor-pointer pb-1">Output</span>
                          <span className="text-[#858585] hover:text-white cursor-pointer pb-1">Debug Console</span>
                          <span className="text-[#858585] hover:text-white cursor-pointer pb-1">Problems</span>
                          <div className="ml-auto flex items-center gap-2">
                              <X size={14} className="cursor-pointer hover:text-white" onClick={() => setTerminalOpen(false)} />
                          </div>
                      </div>
                      <div className="flex-1 p-2 font-mono text-xs text-[#cccccc] overflow-y-auto">
                          <div className="mb-1">nexus@os:~/workspace$ npm start</div>
                          <div className="text-green-500">> nexus-os@1.0.0 start</div>
                          <div className="text-green-500">> react-scripts start</div>
                          <div className="mt-2">Starting the development server...</div>
                          <div className="mt-2 text-blue-400">Compiled successfully!</div>
                          <div className="mt-2">
                             You can now view nexus-os in the browser.<br/>
                             Local:            http://localhost:3000<br/>
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                              <span>nexus@os:~/workspace$</span>
                              <div className="w-2 h-4 bg-white animate-pulse"></div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs justify-between">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer">
                  <GitBranch size={12} />
                  <span>main*</span>
              </div>
              <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer">
                  <RefreshCw size={12} />
                  <span>0</span>
                  <ArrowUp size={12} />
                  <span>0</span>
                  <ArrowDown size={12} />
              </div>
          </div>
          <div className="flex items-center gap-4">
              <span className="hover:bg-white/20 px-1 rounded cursor-pointer">Ln {activeTab?.content.split('\n').length || 1}, Col 1</span>
              <span className="hover:bg-white/20 px-1 rounded cursor-pointer">UTF-8</span>
              <span className="hover:bg-white/20 px-1 rounded cursor-pointer">TypeScript React</span>
              <span className="hover:bg-white/20 px-1 rounded cursor-pointer"><Bell size={12} /></span>
          </div>
      </div>
    </div>
  );
};

// Missing Imports fallback
const ArrowUp = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);
const ArrowDown = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
);
const Bell = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);
const RefreshCw = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
);

export default VSCodeApp;
