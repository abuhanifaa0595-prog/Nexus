
import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { 
  Loader2, 
  User, 
  Settings, 
  Bell, 
  Home, 
  Search, 
  Menu, 
  MessageCircle,
  Heart,
  Share2,
  Plus,
  ShoppingCart,
  Play,
  CreditCard,
  Calendar,
  CheckSquare,
  Trophy,
  Zap,
  ArrowLeft
} from 'lucide-react';

// Missing icon component for Travel render
const BriefcaseIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

const GenericApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { windows } = useOS();
  const windowState = windows.find(w => w.id === windowId);
  const appConfig = windowState ? APPS[windowState.appId] : null;
  
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<'splash' | 'login' | 'home'>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Game State
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const themeColor = appConfig?.themeColor || '#2563eb';

  useEffect(() => {
    // Simulate App Startup
    const timer1 = setTimeout(() => {
        setScreen('login');
    }, 2000);
    return () => clearTimeout(timer1);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
      e?.preventDefault();
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          setScreen('home');
      }, 1000);
  };

  if (!appConfig) return <div className="p-4 text-white">App Config Error</div>;

  // --- SPLASH SCREEN ---
  if (screen === 'splash') {
      return (
          <div className="h-full w-full flex flex-col items-center justify-center text-white" style={{ backgroundColor: themeColor }}>
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 shadow-xl backdrop-blur-md animate-bounce">
                 {typeof appConfig.icon === 'string' ? (
                     <img src={appConfig.icon} alt={appConfig.title} className="w-16 h-16 object-contain" />
                 ) : (
                     <appConfig.icon size={64} className="text-white" />
                 )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{appConfig.title}</h1>
              <div className="absolute bottom-10 flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin opacity-75" />
                  <span className="text-xs font-medium uppercase tracking-widest opacity-75">Loading Resources</span>
              </div>
          </div>
      );
  }

  // --- LOGIN SCREEN ---
  if (screen === 'login') {
      return (
          <div className="h-full w-full bg-white flex flex-col px-8 relative overflow-hidden font-sans">
              <div className="absolute top-0 left-0 right-0 h-64 rounded-b-[3rem] shadow-xl" style={{ backgroundColor: themeColor }}></div>
              
              <div className="relative z-10 flex flex-col h-full pt-20">
                  <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center mb-8 border border-gray-100">
                       <div className="w-20 h-20 rounded-2xl mb-4 flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: themeColor }}>
                          {typeof appConfig.icon === 'string' ? (
                                <img src={appConfig.icon} alt={appConfig.title} className="w-12 h-12 object-contain filter brightness-0 invert" />
                            ) : (
                                <appConfig.icon size={40} />
                            )}
                       </div>
                       <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                       <p className="text-gray-500 text-sm mt-1">Sign in to continue to {appConfig.title}</p>
                  </div>

                  <form onSubmit={handleLogin} className="flex-1 flex flex-col gap-4">
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                            style={{ '--tw-ring-color': themeColor } as any}
                            placeholder="user@nexus.os"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                          <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                            style={{ '--tw-ring-color': themeColor } as any}
                            placeholder="••••••••"
                          />
                      </div>
                      <button 
                        disabled={loading}
                        className="w-full text-white font-bold py-4 rounded-xl shadow-lg mt-4 active:scale-95 transition-transform flex items-center justify-center gap-2"
                        style={{ backgroundColor: themeColor }}
                      >
                          {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                      </button>
                      
                      <div className="mt-auto pb-8 text-center">
                          <p className="text-gray-400 text-sm">Don't have an account? <span className="font-bold cursor-pointer hover:underline" style={{ color: themeColor }}>Sign Up</span></p>
                      </div>
                  </form>
              </div>
          </div>
      );
  }

  // --- APP LAYOUT ---
  const renderHeader = (title: string) => (
      <div className="h-14 flex items-center justify-between px-4 text-white shadow-md z-10" style={{ backgroundColor: themeColor }}>
          <div className="flex items-center gap-3">
              <Menu size={24} />
              <span className="font-bold text-lg">{title}</span>
          </div>
          <div className="flex items-center gap-4">
              <Search size={20} />
              <Bell size={20} />
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={16} />
              </div>
          </div>
      </div>
  );

  const renderBottomNav = () => (
      <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-around text-gray-400">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-gray-900' : ''}`}>
              <Home size={24} style={{ color: activeTab === 'home' ? themeColor : undefined }} />
              <span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => setActiveTab('explore')} className={`flex flex-col items-center gap-1 ${activeTab === 'explore' ? 'text-gray-900' : ''}`}>
              <Search size={24} style={{ color: activeTab === 'explore' ? themeColor : undefined }} />
              <span className="text-[10px] font-medium">Explore</span>
          </button>
          <button className="flex flex-col items-center justify-center -mt-8">
              <div className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg border-4 border-white transform transition-transform hover:scale-105" style={{ backgroundColor: themeColor }}>
                  <Plus size={28} />
              </div>
          </button>
          <button onClick={() => setActiveTab('messages')} className={`flex flex-col items-center gap-1 ${activeTab === 'messages' ? 'text-gray-900' : ''}`}>
              <MessageCircle size={24} style={{ color: activeTab === 'messages' ? themeColor : undefined }} />
              <span className="text-[10px] font-medium">Chat</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-gray-900' : ''}`}>
              <Settings size={24} style={{ color: activeTab === 'settings' ? themeColor : undefined }} />
              <span className="text-[10px] font-medium">Settings</span>
          </button>
      </div>
  );

  // --- CONTENT RENDERERS BASED ON CATEGORY ---

  const renderSocialFeed = () => (
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=100&auto=format&fit=crop`} alt="User" />
                      </div>
                      <div>
                          <div className="font-bold text-sm text-gray-800">User_{i}</div>
                          <div className="text-xs text-gray-400">2 hours ago</div>
                      </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                      Just exploring the new NexusOS updates! The {appConfig?.title} app is working great. 🚀 #tech #life
                  </p>
                  <div className="rounded-lg overflow-hidden mb-3">
                      <img src={`https://images.unsplash.com/photo-${1510000000000 + i * 100}?q=80&w=400&auto=format&fit=crop`} className="w-full h-48 object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-gray-500 pt-2 border-t border-gray-100">
                      <button className="flex items-center gap-1 hover:text-red-500"><Heart size={18} /> <span className="text-xs">Likes</span></button>
                      <button className="flex items-center gap-1 hover:text-blue-500"><MessageCircle size={18} /> <span className="text-xs">Comment</span></button>
                      <button className="flex items-center gap-1 hover:text-green-500"><Share2 size={18} /> <span className="text-xs">Share</span></button>
                  </div>
              </div>
          ))}
      </div>
  );

  const renderEntertainment = () => (
      <div className="flex-1 overflow-y-auto bg-[#121212] text-white p-4">
          <h3 className="font-bold text-lg mb-4">Trending Now</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
              {[1,2,3,4].map(i => (
                  <div key={i} className="w-64 flex-shrink-0 aspect-video bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer group">
                      <img src={`https://images.unsplash.com/photo-${1520000000000 + i*50}?q=80&w=400&auto=format&fit=crop`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                              <Play fill="white" size={20} />
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          <h3 className="font-bold text-lg mb-4">Recommended for You</h3>
          <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
                      <div className="aspect-[2/3] bg-gray-700 relative">
                          <img src={`https://images.unsplash.com/photo-${1530000000000 + i*20}?q=80&w=300&auto=format&fit=crop`} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold">HD</div>
                      </div>
                      <div className="p-2">
                          <div className="font-bold text-sm truncate">Movie Title {i}</div>
                          <div className="text-xs text-gray-400">Action • 2024</div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderShopping = () => (
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                          <img src={`https://images.unsplash.com/photo-${1540000000000 + i*100}?q=80&w=300&auto=format&fit=crop`} className="w-full h-full object-cover mix-blend-multiply" />
                          <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500">
                              <Heart size={16} />
                          </button>
                      </div>
                      <div className="font-bold text-gray-800 text-sm mb-1 truncate">Premium Product {i}</div>
                      <div className="flex items-center justify-between">
                          <span className="font-bold" style={{ color: themeColor }}>${(19.99 * i).toFixed(2)}</span>
                          <div className="flex text-yellow-400 text-[10px]">★★★★☆</div>
                      </div>
                      <button className="w-full mt-3 py-2 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-2" style={{ backgroundColor: themeColor }}>
                          <ShoppingCart size={14} /> Add
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderGame = () => (
      <div className="flex-1 flex flex-col bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-white">
               <div className="text-6xl font-black mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ color: themeColor }}>
                   {score.toLocaleString()}
               </div>
               <div className="text-sm font-bold tracking-widest uppercase mb-12 opacity-50">Current Score</div>

               <div className="flex gap-8 mb-12">
                   <div className="flex flex-col items-center gap-2">
                       <div className="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-2xl font-bold">
                           {level}
                       </div>
                       <span className="text-xs font-bold opacity-50">LEVEL</span>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                       <div className="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-2xl font-bold text-yellow-500">
                           <Trophy size={24} />
                       </div>
                       <span className="text-xs font-bold opacity-50">RANK</span>
                   </div>
               </div>

               <button 
                  onClick={() => setScore(s => s + Math.floor(Math.random() * 100))}
                  className="w-48 h-48 rounded-full border-8 border-white/10 flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                  style={{ backgroundColor: themeColor }}
               >
                   <Play size={64} fill="white" className="ml-2" />
               </button>
               <div className="mt-6 font-bold animate-pulse">TAP TO PLAY</div>
          </div>
      </div>
  );

  const renderProductivity = () => (
      <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
          <div className="p-4 bg-white shadow-sm border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-800">Today's Tasks</h3>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${i % 2 === 0 ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {i % 2 === 0 && <CheckSquare size={14} className="text-white" />}
                      </div>
                      <div className="flex-1">
                          <div className={`font-medium ${i % 2 === 0 ? 'text-gray-400 line-through' : 'text-gray-800'}`}>Important Task #{i}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <Calendar size={12} /> 10:00 AM • {i % 2 === 0 ? 'Completed' : 'Pending'}
                          </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  </div>
              ))}
          </div>
          <button className="m-4 bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
              <Plus size={18} /> Add New Task
          </button>
      </div>
  );

  const renderFinance = () => (
      <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="bg-gray-900 text-white p-6 rounded-b-[2rem] shadow-xl">
              <div className="text-sm opacity-70 mb-1">Total Balance</div>
              <div className="text-4xl font-bold mb-6">$24,562.00</div>
              <div className="flex gap-4">
                  <div className="flex-1 bg-white/10 rounded-xl p-3 flex flex-col items-center gap-2 backdrop-blur-sm cursor-pointer hover:bg-white/20">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"><ArrowLeft size={16} className="rotate-45" /></div>
                      <span className="text-xs font-bold">Send</span>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-xl p-3 flex flex-col items-center gap-2 backdrop-blur-sm cursor-pointer hover:bg-white/20">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"><ArrowLeft size={16} className="-rotate-135" /></div>
                      <span className="text-xs font-bold">Request</span>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-xl p-3 flex flex-col items-center gap-2 backdrop-blur-sm cursor-pointer hover:bg-white/20">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center"><CreditCard size={16} /></div>
                      <span className="text-xs font-bold">Cards</span>
                  </div>
              </div>
          </div>

          <div className="p-6">
              <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                  {i % 2 === 0 ? <ShoppingCart size={20} className="text-orange-500" /> : <Zap size={20} className="text-blue-500" />}
                              </div>
                              <div>
                                  <div className="font-bold text-sm text-gray-800">{i % 2 === 0 ? 'Amazon.com' : 'Electric Bill'}</div>
                                  <div className="text-xs text-gray-400">Today, 2:30 PM</div>
                              </div>
                          </div>
                          <div className={`font-bold ${i % 2 === 0 ? 'text-gray-800' : 'text-red-500'}`}>
                              -${(i * 15.50).toFixed(2)}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderTravel = () => (
      <div className="flex-1 relative bg-gray-200">
          <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10"></div>
          
          <div className="absolute inset-x-4 top-4 bg-white rounded-xl shadow-lg p-4">
               <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg mb-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                   <span className="text-sm font-medium text-gray-700">Current Location</span>
               </div>
               <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                   <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
                   <span className="text-sm font-medium text-gray-400">Where to?</span>
               </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6">
              <h3 className="font-bold text-gray-800 mb-4">Recent</h3>
              <div className="flex items-center gap-4 mb-6 overflow-x-auto">
                  <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center"><Home size={20} /></div>
                      <span className="text-xs font-medium">Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center"><BriefcaseIcon size={20} /></div>
                      <span className="text-xs font-medium">Work</span>
                  </div>
              </div>
              <button className="w-full py-4 text-white font-bold rounded-xl shadow-lg" style={{ backgroundColor: themeColor }}>
                  Request Ride
              </button>
          </div>
      </div>
  );

  // --- MAIN RENDER ---
  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden font-sans">
        {renderHeader(appConfig.title)}
        
        {appConfig.category === 'Social' && renderSocialFeed()}
        {appConfig.category === 'Entertainment' && renderEntertainment()}
        {appConfig.category === 'Games' && renderGame()}
        {appConfig.category === 'Productivity' && renderProductivity()}
        {appConfig.category === 'Utilities' && renderProductivity()} 
        {appConfig.category === 'System' && renderProductivity()}
        {appConfig.category === 'Finance' && renderFinance()}
        {appConfig.category === 'News' && renderSocialFeed()}
        {appConfig.category === 'Lifestyle' && renderShopping()}
        {appConfig.category === 'Network' && renderTravel()} 
        
        {/* Fallback for others */}
        {['AI', 'Development', 'Creative'].includes(appConfig.category || '') && renderProductivity()}

        {renderBottomNav()}
    </div>
  );
};

export default GenericApp;
