




import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { WALLPAPERS } from '../../constants';
import { Theme, User } from '../../types';
import { Monitor, Volume2, Cpu, HardDrive, Sun, Speaker, User as UserIcon, Key, Mail, Camera, UserPlus, Users, Trash2, RefreshCw } from 'lucide-react';

const SettingsApp: React.FC = () => {
  const { theme, setTheme, systemStats, volume, setVolume, brightness, setBrightness, user, updateUser, users, addUser, removeUser, resetSystem, desktopMode, setDesktopMode } = useOS();
  const [activeTab, setActiveTab] = useState<'personalization' | 'system' | 'display' | 'sound' | 'accounts'>('accounts');
  
  // New User Form State
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  // Helpers for stats display
  const ramPercent = Math.round((systemStats.usedMemory / systemStats.totalMemory) * 100);
  const storagePercent = Math.round((systemStats.usedStorage / systemStats.totalStorage) * 100);

  const formatSize = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName && newUserUsername && newUserPassword) {
      const newUser: User = {
        name: newUserName,
        username: newUserUsername,
        password: newUserPassword,
        email: `${newUserUsername.toLowerCase()}@nexus.os`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*1000)}?q=80&w=200&auto=format&fit=crop`
      };
      addUser(newUser);
      setShowAddUserForm(false);
      setNewUserName('');
      setNewUserUsername('');
      setNewUserPassword('');
    }
  };

  const handleAddGuest = () => {
      const guestUser: User = {
          name: 'Guest',
          username: 'guest',
          email: '',
          avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          isGuest: true
      };
      addUser(guestUser);
  };

  return (
    <div className="flex h-full bg-slate-50 text-slate-800">
      <div className="w-1/3 bg-white border-r border-gray-200 p-4 space-y-2">
        <h2 className="text-xl font-bold mb-6 px-2">Settings</h2>
        <button 
            onClick={() => setActiveTab('accounts')}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-3 transition-colors
                ${activeTab === 'accounts' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}
            `}
        >
            <UserIcon size={18} />
            Accounts
        </button>
        <button 
            onClick={() => setActiveTab('personalization')}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-3 transition-colors
                ${activeTab === 'personalization' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}
            `}
        >
            <Monitor size={18} />
            Personalization
        </button>
        <button 
            onClick={() => setActiveTab('system')}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-3 transition-colors
                ${activeTab === 'system' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}
            `}
        >
            <Cpu size={18} />
            System Resources
        </button>
        <button 
            onClick={() => setActiveTab('display')}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-3 transition-colors
                ${activeTab === 'display' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}
            `}
        >
            <Sun size={18} />
            Display
        </button>
        <button 
            onClick={() => setActiveTab('sound')}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium flex items-center gap-3 transition-colors
                ${activeTab === 'sound' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}
            `}
        >
            <Volume2 size={18} />
            Sound
        </button>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto">
         {activeTab === 'personalization' && (
             <>
                <h3 className="text-2xl font-semibold mb-6">Personalization</h3>
                <div className="space-y-8">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Wallpaper</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {(Object.keys(WALLPAPERS) as Theme[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`relative aspect-video rounded-xl overflow-hidden shadow-sm border-2 transition-all hover:scale-[1.02]
                                        ${theme === t ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}
                                    `}
                                >
                                    <img 
                                        src={WALLPAPERS[t]} 
                                        alt={t} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full bg-black/50 backdrop-blur-sm p-2 text-white text-xs font-medium capitalize">
                                        {t}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Desktop Layout</h4>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDesktopMode('grid')}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${desktopMode === 'grid' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="w-full h-16 bg-gray-200 rounded-lg flex flex-wrap gap-1 p-1 content-start">
                                    <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                                    <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                                    <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                                </div>
                                <span className="text-sm font-medium">Snap to Grid</span>
                            </button>
                            <button
                                onClick={() => setDesktopMode('free')}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${desktopMode === 'free' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="w-full h-16 bg-gray-200 rounded-lg relative">
                                    <div className="absolute top-2 left-2 w-3 h-3 bg-gray-400 rounded-sm"></div>
                                    <div className="absolute top-8 right-4 w-3 h-3 bg-gray-400 rounded-sm"></div>
                                    <div className="absolute bottom-3 left-1/2 w-3 h-3 bg-gray-400 rounded-sm"></div>
                                </div>
                                <span className="text-sm font-medium">Free Movement</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            "Snap to Grid" aligns icons perfectly. "Free Movement" allows pixel-perfect placement anywhere.
                        </p>
                    </div>
                </div>
             </>
         )}

         {activeTab === 'accounts' && (
             <>
                <h3 className="text-2xl font-semibold mb-6">Accounts</h3>
                
                {/* Current User Profile */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-6">
                         <div className="relative group cursor-pointer">
                             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50">
                                 <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                             </div>
                             <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Camera className="text-white" />
                             </div>
                         </div>
                         <div>
                             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                               {user.name} 
                               {user.isAdmin && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>}
                               {user.isGuest && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">Guest</span>}
                             </h2>
                             <p className="text-gray-500 text-sm">{user.isAdmin ? 'Administrator' : 'Standard User'} • Local Account</p>
                         </div>
                    </div>
                    
                    {!user.isGuest && (
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                    <div className="flex items-center gap-2">
                                        <UserIcon size={18} className="text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={user.name}
                                            onChange={(e) => updateUser({ name: e.target.value })}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="flex items-center gap-2">
                                        <Mail size={18} className="text-gray-400" />
                                        <input 
                                            type="email" 
                                            value={user.email}
                                            onChange={(e) => updateUser({ email: e.target.value })}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="font-medium text-gray-900 mb-3">Sign-in Options</h4>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-md shadow-sm">
                                                <Key size={18} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">Password</div>
                                                <div className="text-xs text-gray-500">Change your account password</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newPass = prompt("Enter new password:", user.password);
                                                if (newPass) updateUser({ password: newPass });
                                            }}
                                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Manage Users - Only Visible if Admin or if there are other users to see (but limited actions) */}
                <h4 className="text-lg font-semibold mb-4">Other Users</h4>
                <div className="space-y-3 mb-6">
                    {users.filter(u => u.username !== user.username).map(otherUser => (
                        <div key={otherUser.username} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                    <img src={otherUser.avatar} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-gray-900 flex items-center gap-2">
                                        {otherUser.name}
                                        {otherUser.isAdmin && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">Admin</span>}
                                    </div>
                                    <div className="text-xs text-gray-500">{otherUser.isGuest ? 'Guest Account' : 'Standard User'}</div>
                                </div>
                            </div>
                            {user.isAdmin && (
                                <button 
                                    onClick={() => removeUser(otherUser.username)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove User"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    
                    {users.filter(u => u.username !== user.username).length === 0 && (
                        <div className="text-sm text-gray-500 italic px-2">No other users added.</div>
                    )}
                </div>

                {user.isAdmin && (
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowAddUserForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
                        >
                            <UserPlus size={16} /> Add User
                        </button>
                        {!users.some(u => u.isGuest) && (
                            <button 
                                onClick={handleAddGuest}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                            >
                                <Users size={16} /> Add Guest Profile
                            </button>
                        )}
                    </div>
                )}
                
                {!user.isAdmin && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                        You do not have permission to manage other users. Please contact an administrator.
                    </div>
                )}

                {/* Add User Modal/Form Overlay */}
                {showAddUserForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-scale-up">
                            <h3 className="text-xl font-bold mb-4">Add New User</h3>
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newUserName}
                                        onChange={e => setNewUserName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newUserUsername}
                                        onChange={e => setNewUserUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="johndoe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={newUserPassword}
                                        onChange={e => setNewUserPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="••••••"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setShowAddUserForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium"
                                    >
                                        Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
             </>
         )}

         {activeTab === 'display' && (
             <>
                <h3 className="text-2xl font-semibold mb-6">Display</h3>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="font-medium">Brightness</label>
                             <span className="text-gray-500">{brightness}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Sun size={20} className="text-gray-400" />
                            <input 
                                type="range" 
                                min="20" 
                                max="130" 
                                value={brightness}
                                onChange={(e) => setBrightness(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                            <Sun size={24} className="text-gray-800" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Adjusts the global brightness of the OS container.</p>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex justify-between mb-2">
                             <label className="font-medium">Scale & Layout</label>
                        </div>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>100% (Recommended)</option>
                            <option>125%</option>
                            <option>150%</option>
                        </select>
                    </div>
                </div>
             </>
         )}

        {activeTab === 'sound' && (
             <>
                <h3 className="text-2xl font-semibold mb-6">Sound</h3>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="font-medium">Master Volume</label>
                             <span className="text-gray-500">{volume}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Speaker size={20} className="text-gray-400" />
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                            <Volume2 size={24} className="text-gray-800" />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <label className="font-medium mb-2 block">Output Device</label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <Speaker size={20} className="text-blue-600"/>
                                <div>
                                    <div className="font-medium text-sm">Nexus Audio Output</div>
                                    <div className="text-xs text-gray-500">Default</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </>
         )}

         {activeTab === 'system' && (
             <>
                <h3 className="text-2xl font-semibold mb-6">System Resources</h3>
                <div className="space-y-8">
                    {/* RAM */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium">Memory (RAM)</h4>
                                <p className="text-sm text-gray-500">System Performance</p>
                            </div>
                            <div className="ml-auto text-right">
                                <div className="text-2xl font-bold text-gray-800">{ramPercent}%</div>
                                <div className="text-xs text-gray-500">{formatSize(systemStats.usedMemory)} / {formatSize(systemStats.totalMemory)}</div>
                            </div>
                        </div>
                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${ramPercent > 80 ? 'bg-red-500' : 'bg-purple-500'}`}
                                style={{ width: `${ramPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Storage */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <HardDrive size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium">Virtual Storage</h4>
                                <p className="text-sm text-gray-500">Disk Space</p>
                            </div>
                            <div className="ml-auto text-right">
                                <div className="text-2xl font-bold text-gray-800">{storagePercent}%</div>
                                <div className="text-xs text-gray-500">{formatSize(systemStats.usedStorage)} / {formatSize(systemStats.totalStorage)}</div>
                            </div>
                        </div>
                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${storagePercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Factory Reset */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                    <RefreshCw size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-red-600">Factory Reset</h4>
                                    <p className="text-sm text-gray-500">Reset system and clear all local data</p>
                                </div>
                            </div>
                            <button 
                                onClick={resetSystem}
                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg font-medium transition-colors"
                            >
                                Reset System
                            </button>
                        </div>
                    </div>
                </div>
             </>
         )}
      </div>
    </div>
  );
};

export default SettingsApp;