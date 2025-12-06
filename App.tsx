
import React, { useState, useEffect } from 'react';
import { OSProvider } from './context/OSContext';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import ContextMenu from './components/ContextMenu';
import LockScreen from './components/LockScreen';
import GestureNavigation from './components/GestureNavigation';
import MobileStatusBar from './components/MobileStatusBar';
import ControlCenter from './components/ControlCenter';
import TaskView from './components/TaskView';
import { Bot, Terminal, Cpu } from 'lucide-react';

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [bootStep, setBootStep] = useState(0);
  const [bootLog, setBootLog] = useState<string[]>([]);

  useEffect(() => {
    // Determine if we should even show the boot screen based on localStorage
    const savedLockState = localStorage.getItem('nexus_locked');
    if (savedLockState === 'false') {
        onComplete();
        return;
    }

    const steps = [
        "Initializing System Core...",
        "Loading Kernel Modules...",
        "Mounting Virtual File System...",
        "Starting User Interface Service...",
        "Establishing Secure Connection...",
        "System Ready."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            setBootLog(prev => [...prev, `[OK] ${steps[currentStep]}`]);
            setBootStep(prev => prev + 1);
            currentStep++;
        } else {
            clearInterval(interval);
            setTimeout(onComplete, 500);
        }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  // If persisting unlock state, we might render nothing briefly
  const savedLockState = localStorage.getItem('nexus_locked');
  if (savedLockState === 'false') return null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white z-[99999] font-mono">
      <div className="animate-fade-in flex flex-col items-center gap-8 mb-12">
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/50 blur-3xl rounded-full animate-pulse"></div>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 flex items-center justify-center shadow-2xl relative z-10">
                <Bot size={48} className="text-indigo-400" />
            </div>
        </div>
        
        <div className="flex flex-col items-center gap-1">
            <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">NexusOS</h1>
            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">Version 2.0.4 - Build 2024</p>
        </div>
      </div>

      <div className="w-80 space-y-4">
          <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                style={{ width: `${(bootStep / 6) * 100}%` }}
              ></div>
          </div>
          
          <div className="h-32 bg-black border border-gray-800 rounded p-2 overflow-hidden text-[10px] text-green-500 font-mono opacity-80 leading-relaxed shadow-inner">
              {bootLog.map((log, i) => (
                  <div key={i}>{log}</div>
              ))}
              <div className="animate-pulse">_</div>
          </div>
      </div>
    </div>
  );
};

function App() {
  const [booted, setBooted] = useState(false);

  // Initial check for lock state to prevent flicker
  useEffect(() => {
      const savedLockState = localStorage.getItem('nexus_locked');
      if (savedLockState === 'false') {
          setBooted(true);
      }
  }, []);

  if (!booted) {
    return <BootScreen onComplete={() => setBooted(true)} />;
  }

  return (
    <OSProvider>
      <div className="h-screen w-screen overflow-hidden bg-black select-none font-sans text-white touch-none">
        <Desktop />
        <StartMenu />
        <TaskView />
        <Taskbar />
        
        {/* Mobile Specifics */}
        <MobileStatusBar />
        <ControlCenter />
        <GestureNavigation />
        
        <ContextMenu />
        <LockScreen />
      </div>
    </OSProvider>
  );
}

export default App;
