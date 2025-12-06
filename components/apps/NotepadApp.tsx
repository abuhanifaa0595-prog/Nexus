import React, { useState, useEffect } from 'react';
import { Save, File, AlertCircle } from 'lucide-react';
import { useOS } from '../../context/OSContext';

const NotepadApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { windows, updateFileContent, createFile } = useOS();
  const [content, setContent] = useState('');
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('Untitled.txt');
  const [isSaved, setIsSaved] = useState(true);

  // Initialize from window props
  useEffect(() => {
    const win = windows.find(w => w.id === windowId);
    if (win?.props) {
      if (win.props.initialContent !== undefined) setContent(win.props.initialContent);
      if (win.props.fileId) setFileId(win.props.fileId);
      if (win.props.fileName) setFileName(win.props.fileName);
    }
  }, [windowId, windows]);

  const handleChange = (newContent: string) => {
    setContent(newContent);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (fileId) {
      // Update existing
      updateFileContent(fileId, content);
      setIsSaved(true);
    } else {
      // Save as new (Simple implementation: save to Documents by default)
      // A full OS would open a "Save As" dialog.
      const name = prompt("Save as:", fileName);
      if (name) {
        setFileName(name);
        createFile('docs', name, content);
        setIsSaved(true);
        alert('Saved to Documents');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-200 font-mono text-sm">
      <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border-b border-[#3e3e3e] select-none">
        <button 
            className="flex items-center gap-1 px-3 py-1 hover:bg-[#3e3e3e] rounded text-xs transition-colors"
            onClick={() => {
                setContent('');
                setFileId(null);
                setFileName('Untitled.txt');
            }}
        >
          <File size={12} /> New
        </button>
        <button 
            className="flex items-center gap-1 px-3 py-1 hover:bg-[#3e3e3e] rounded text-xs transition-colors"
            onClick={handleSave}
        >
          <Save size={12} /> Save
        </button>
        <div className="flex-1" />
        <span className="text-[10px] text-gray-500 px-2 flex items-center gap-2">
            {!isSaved && <span className="w-2 h-2 rounded-full bg-yellow-500" title="Unsaved changes"></span>}
            {fileName}
        </span>
      </div>
      <textarea
        className="flex-1 w-full h-full bg-transparent p-4 resize-none focus:outline-none custom-scrollbar leading-6"
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
        placeholder="Start typing..."
      />
      <div className="h-6 bg-[#007acc] text-white text-[10px] flex items-center px-2 justify-end gap-4">
        <span>UTF-8</span>
        <span>Ln {content.split('\n').length}, Col {content.length}</span>
      </div>
    </div>
  );
};

export default NotepadApp;