import React, { useState, useMemo } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { AppId } from '../../types';
import { 
  Download, 
  Check, 
  ShoppingBag, 
  Gamepad2, 
  Briefcase, 
  Cpu, 
  Search,
  Zap,
  Coffee,
  Globe,
  DollarSign
} from 'lucide-react';

const AppMarket: React.FC = () => {
  const { installedApps, installApp, uninstallApp, openApp, systemStats } = useOS();
  const [activeTab, setActiveTab] = useState<'all' | 'installed' | 'games' | 'productivity' | 'social'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allApps = Object.values(APPS).filter(app => app.id !== AppId.APP_MARKET); // Don't list the store itself

  const filteredApps = useMemo(() => {
    return allApps.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (activeTab === 'installed') return installedApps.includes(app.id);
      if (activeTab === 'games') return app.category === 'Games';
      if (activeTab === 'productivity') return app.category === 'Productivity' || app.category === 'Utilities';
      if (activeTab === 'social') return app.category === 'Social' || app.category === 'Entertainment';
      
      return true;
    });
  }, [allApps, searchQuery, activeTab, installedApps]);

  const categories = [
    { id: 'all', label: 'Discover', icon: ShoppingBag },
    { id: 'installed', label: 'Library', icon: Download },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'productivity', label: 'Work', icon: Briefcase },
  ];

  const formatSize = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const storagePercent = (systemStats.usedStorage / systemStats.totalStorage) * 100;

  const FeaturedCard = () => (
    <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 mb-8 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="space-y-4 max-w-lg relative z-10">
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">New Release</span>
        <h2 className="text-3xl font-bold">100+ New Apps Added</h2>
        <p className="text-pink-100 leading-relaxed">
          The Nexus Store just got a massive upgrade. Explore hundreds of new applications across social, gaming, finance, and lifestyle categories.
        </p>
        <button 
           onClick={() => setActiveTab('all')}
           className="bg-white text-pink-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-sm"
        >
           Explore All
        </button>
      </div>
      <div className="hidden md:flex gap-4 opacity-90 relative z-10">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 rotate-12">
             <Globe size={40} className="text-white" />
          </div>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 -rotate-6">
             <Gamepad2 size={40} className="text-white" />
          </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
        <div className="flex items-center gap-3 px-4 mb-8 text-indigo-600">
           <ShoppingBag size={24} />
           <h1 className="text-xl font-bold tracking-tight">App Market</h1>
        </div>
        
        <div className="space-y-1">
          {categories.map(cat => (
             <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium
                   ${activeTab === cat.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
             >
                <cat.icon size={18} />
                {cat.label}
             </button>
          ))}
        </div>

        <div className="mt-auto p-4 bg-gray-50 rounded-xl border border-gray-100">
           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">System Storage</h3>
           <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div 
                className={`h-full transition-all duration-500 ${storagePercent > 90 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                style={{ width: `${storagePercent}%` }}
              ></div>
           </div>
           <div className="flex justify-between text-[10px] text-gray-500">
              <span>{formatSize(systemStats.usedStorage)} used</span>
              <span>{formatSize(systemStats.totalStorage)}</span>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
         {/* Header */}
         <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10 sticky top-0">
             <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                   type="text" 
                   placeholder="Search apps..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-full pl-10 pr-4 py-2 text-sm outline-none transition-all"
                />
             </div>
             <div className="text-xs font-medium text-gray-500">
                 {filteredApps.length} Apps Found
             </div>
         </div>

         {/* Scrollable Content */}
         <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            {activeTab === 'all' && !searchQuery && <FeaturedCard />}

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                {activeTab === 'installed' ? 'Your Library' : 'Available Apps'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
               {filteredApps.map(app => {
                  const isInstalled = installedApps.includes(app.id);
                  
                  return (
                    <div key={app.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4 group">
                       <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner overflow-hidden" 
                          style={{ backgroundColor: app.themeColor ? `${app.themeColor}20` : '#f3f4f6' }} // 20 hex opacity
                       >
                          {typeof app.icon === 'string' ? (
                              <img src={app.icon} alt={app.title} className="w-12 h-12 object-contain" />
                          ) : (
                              <app.icon size={32} style={{ color: app.themeColor || '#4b5563' }} />
                          )}
                       </div>
                       <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                             <h3 className="font-semibold text-gray-900 truncate pr-2">{app.title}</h3>
                             <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap">{app.category || 'App'}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{app.description || 'No description available.'}</p>
                          <div className="mt-auto flex gap-2 items-center">
                             <span className="text-[10px] text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded">{formatSize(app.storageSize || 0)}</span>
                             <div className="flex-1"></div>
                             {isInstalled ? (
                                <>
                                    <button 
                                        onClick={() => openApp(app.id)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Open
                                    </button>
                                    <button 
                                        onClick={() => uninstallApp(app.id)}
                                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                                        title="Uninstall"
                                    >
                                        <Zap size={14} />
                                    </button>
                                </>
                             ) : (
                                <button 
                                    onClick={() => installApp(app.id)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                >
                                    <Download size={14} />
                                    Get
                                </button>
                             )}
                          </div>
                       </div>
                    </div>
                  );
               })}
            </div>
            
            {filteredApps.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p>No apps found matching "{searchQuery}"</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AppMarket;