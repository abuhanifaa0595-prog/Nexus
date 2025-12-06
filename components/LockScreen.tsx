
import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { WALLPAPERS } from '../constants';
import { format } from 'date-fns';
import { ArrowRight, Lock, Loader2, AlertCircle } from 'lucide-react';
import { User } from '../types';

const LockScreen: React.FC = () => {
  const { isLocked, unlockScreen, user, users, loginUser, theme } = useOS();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [time, setTime] = useState(new Date());

  // Local state to track which user is selected for login on the lock screen
  // Defaults to the currently 'active' user in context, but allows switching
  const [selectedUser, setSelectedUser] = useState<User>(user);

  useEffect(() => {
    setSelectedUser(user);
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnlocking) return;

    setIsUnlocking(true);
    
    // Switch context to the selected user before unlocking if it's different
    if (selectedUser.username !== user.username) {
        loginUser(selectedUser.username);
    }

    // Simulate API delay
    setTimeout(() => {
        // Special Guest Handling
        if (selectedUser.isGuest) {
            unlockScreen('');
            setPassword('');
            setError(false);
            setIsUnlocking(false);
            return;
        }

        const success = unlockScreen(password);
        if (success) {
            setPassword('');
            setError(false);
        } else {
            setError(true);
            setIsUnlocking(false);
        }
    }, 800);
  };

  if (!isLocked) return null;

  return (
    <div 
        className="fixed inset-0 z-[100000] flex flex-col items-center justify-between text-white bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${WALLPAPERS[theme]})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Time & Date Display */}
      <div className="relative z-10 flex flex-col items-center mt-32 animate-fade-in">
        <h1 className="text-8xl font-thin tracking-tighter drop-shadow-lg font-sans">
            {format(time, 'h:mm')}
        </h1>
        <h2 className="text-2xl font-medium tracking-wide drop-shadow-md">
            {format(time, 'EEEE, MMMM d')}
        </h2>
      </div>

      {/* Login Card */}
      <div className="relative z-10 mb-48 flex flex-col items-center gap-6 w-full max-w-sm">
         <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full p-1 bg-white/10 backdrop-blur-md shadow-2xl">
                <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name} 
                    className="w-full h-full rounded-full object-cover border-2 border-white/20"
                />
            </div>
            <h3 className="text-2xl font-semibold drop-shadow-md">{selectedUser.name}</h3>
         </div>

         <form onSubmit={handleLogin} className="w-full flex flex-col items-center gap-3">
             {selectedUser.isGuest ? (
                 <button 
                    type="submit"
                    className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all font-medium border border-white/10 shadow-lg"
                 >
                     {isUnlocking ? <Loader2 size={20} className="animate-spin" /> : "Sign In as Guest"}
                 </button>
             ) : (
                 <div className="relative w-full max-w-[280px] group">
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        placeholder="Password"
                        autoFocus
                        className={`
                            w-full bg-black/30 text-center text-white placeholder-gray-400 rounded-full py-3 px-10 outline-none border border-white/20 backdrop-blur-md transition-all
                            focus:bg-black/50 focus:border-white/40 focus:ring-2 focus:ring-white/10
                            ${error ? 'border-red-500/50 ring-2 ring-red-500/20 animate-shake' : ''}
                        `}
                    />
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors" />
                    
                    <button 
                        type="submit"
                        disabled={!password || isUnlocking}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all
                            ${password ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer' : 'opacity-0 pointer-events-none'}
                        `}
                    >
                        {isUnlocking ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    </button>
                 </div>
             )}
             
             {error && (
                 <div className="flex items-center gap-2 text-red-300 text-sm animate-fade-in bg-black/40 px-3 py-1 rounded-lg">
                     <AlertCircle size={14} />
                     <span>Incorrect password.</span>
                 </div>
             )}
         </form>
      </div>
      
      {/* User Switcher (If multiple users) */}
      {users.length > 1 && (
          <div className="relative z-10 mb-8 flex gap-4 bg-black/30 p-2 rounded-2xl backdrop-blur-md border border-white/10">
              {users.map(u => (
                  <button 
                    key={u.username}
                    onClick={() => {
                        setSelectedUser(u);
                        setPassword('');
                        setError(false);
                    }}
                    className={`
                        flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20
                        ${selectedUser.username === u.username ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10 opacity-70 hover:opacity-100'}
                    `}
                  >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-medium truncate w-full text-center">{u.name.split(' ')[0]}</span>
                  </button>
              ))}
          </div>
      )}

      {!users.length && (
         <div className="relative z-10 text-xs text-gray-400 mb-6 font-mono">
           NexusOS v1.0 • Secure Lock Screen
         </div>
      )}

      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default LockScreen;
