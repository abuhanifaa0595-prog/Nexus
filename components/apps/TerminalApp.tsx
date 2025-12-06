import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';

const TerminalApp: React.FC = () => {
  const { fileSystem } = useOS();
  const [history, setHistory] = useState<string[]>(['Welcome to NexusOS Terminal v1.0', 'Type "help" for available commands.']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    
    let output = '';

    switch (command) {
      case 'help':
        output = 'Available commands: help, clear, ls, date, echo [text], whoami, reboot';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'ls':
        // Simple list of root folders
        const rootItems = fileSystem.filter(n => n.parentId === 'root');
        output = rootItems.map(i => i.name + (i.type === 'folder' ? '/' : '')).join('  ');
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'echo':
        output = args.slice(1).join(' ');
        break;
      case 'whoami':
        output = 'nexus_user';
        break;
      case 'reboot':
        output = 'Rebooting is not permitted in safe mode.';
        break;
      default:
        output = `Command not found: ${command}`;
    }

    setHistory(prev => [...prev, `$ ${cmd}`, output]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!input.trim()) {
        setHistory(prev => [...prev, '$ ']);
      } else {
        handleCommand(input);
      }
      setInput('');
    }
  };

  return (
    <div 
        className="h-full bg-black/90 text-green-500 font-mono p-4 text-sm overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
      ))}
      <div className="flex">
        <span className="mr-2 text-green-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-green-500"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalApp;