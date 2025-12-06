
import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Search, 
  Gamepad2, 
  Smartphone, 
  Film, 
  Book, 
  Star, 
  ChevronRight,
  Download,
  Check
} from 'lucide-react';
import { AppId } from '../../types';

const PlayStoreApp: React.FC = () => {
  const { installedApps, openApp, createFile } = useOS();
  const [activeTab, setActiveTab] = useState('apps');
  const [downloadingAppId, setDownloadingAppId] = useState<string | null>(null);

  const apps = [
    { id: 'instagram', appId: AppId.INSTAGRAM, title: 'Instagram', developer: 'Meta Platforms, Inc.', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png', rating: 4.5, downloads: '1B+' },
    { id: 'spotify', appId: AppId.SPOTIFY, title: 'Spotify: Music and Podcasts', developer: 'Spotify AB', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png', rating: 4.7, downloads: '500M+' },
    { id: 'tiktok', appId: AppId.TIKTOK, title: 'TikTok', developer: 'TikTok Pte. Ltd.', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png', rating: 4.6, downloads: '1B+' },
    { id: 'twitter', appId: AppId.TWITTER, title: 'X', developer: 'X Corp.', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/1200px-X_logo_2023.svg.png', rating: 4.2, downloads: '1B+' },
    { id: 'discord', appId: AppId.DISCORD, title: 'Discord - Talk, Chat & Hang Out', developer: 'Discord Inc.', icon: 'https://assets-global.website-files.com/6257adef93867e56f84d3101/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png', rating: 4.4, downloads: '100M+' },
    { id: 'freefire', appId: AppId.BATTLE_ROYALE, title: 'Free Fire MAX', developer: 'Garena International I', icon: 'https://play-lh.googleusercontent.com/Knw78x-31uF9F529s8aG8M3Gg8c55y555628522338255555555555555555555555555', rating: 4.3, downloads: '500M+' }, // Fake Icon URL fallback
  ];

  const handleAction = (app: any) => {
    if (installedApps.includes(app.appId)) {
        openApp(app.appId);
        return;
    }

    // Download Simulation
    setDownloadingAppId(app.id);
    
    // Simulate network delay
    setTimeout(() => {
        // Create the APK file in Downloads
        // In a real scenario, this would be a binary blob. Here we use a marker string for the installer to detect.
        const fileName = `${app.id}.apk`;
        const dummyContent = JSON.stringify({
            origin: 'Play Store',
            package: `com.${app.id}.android`,
            signature: 'VALID_NEXUS_SIGNATURE'
        });
        
        createFile('downloads', fileName, dummyContent);
        
        setDownloadingAppId(null);
        alert(`${app.title} downloaded to Downloads folder. Open the file to install.`);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white text-[#202124] font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 shadow-sm z-10">
         <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
            alt="Google Play" 
            className="h-8"
         />
         <div className="flex-1 bg-[#f1f3f4] rounded-lg px-4 py-2 flex items-center gap-3 transition-shadow hover:shadow-md cursor-pointer">
             <Search size={18} className="text-[#5f6368]" />
             <input className="bg-transparent border-none outline-none w-full text-sm" placeholder="Search for apps & games" />
         </div>
         <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
             N
         </div>
      </div>

      {/* Nav */}
      <div className="flex border-b border-gray-200">
          {[
              { id: 'games', label: 'Games', icon: Gamepad2 },
              { id: 'apps', label: 'Apps', icon: Smartphone },
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'books', label: 'Books', icon: Book }
          ].map(tab => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
                    ${activeTab === tab.id ? 'border-[#01875f] text-[#01875f]' : 'border-transparent text-[#5f6368] hover:text-[#202124]'}
                 `}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Recommended for you</h2>
              <button className="text-[#01875f] text-sm hover:bg-[#01875f]/10 px-3 py-1 rounded transition-colors flex items-center">
                  See more <ChevronRight size={16} />
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map(app => {
                  const isInstalled = installedApps.includes(app.appId as AppId);
                  const isDownloading = downloadingAppId === app.id;
                  
                  return (
                      <div key={app.id} className="flex gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                          <img src={app.icon} alt={app.title} className="w-20 h-20 rounded-xl shadow-sm bg-white object-contain p-1" />
                          <div className="flex flex-col flex-1 min-w-0">
                              <h3 className="text-sm font-medium truncate" title={app.title}>{app.title}</h3>
                              <div className="text-xs text-[#5f6368] mb-1">{app.developer}</div>
                              <div className="flex items-center gap-2 text-xs text-[#5f6368] mb-3">
                                  <span className="flex items-center">{app.rating} <Star size={10} className="fill-current text-[#5f6368] ml-0.5" /></span>
                                  <span>{app.downloads}</span>
                              </div>
                              <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(app);
                                }}
                                disabled={isDownloading}
                                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors w-fit flex items-center gap-2
                                    ${isInstalled 
                                        ? 'bg-transparent text-[#01875f] border border-[#dadce0] hover:bg-[#01875f]/5' 
                                        : 'bg-[#01875f] text-white hover:bg-[#017654]'
                                    }
                                    ${isDownloading ? 'opacity-70 cursor-wait' : ''}
                                `}
                              >
                                  {isDownloading ? (
                                      <>Downloading...</>
                                  ) : isInstalled ? (
                                      'Open'
                                  ) : (
                                      'Install'
                                  )}
                              </button>
                          </div>
                      </div>
                  )
              })}
          </div>

          {/* Featured Banner Simulation */}
          <div className="mt-8 relative rounded-xl overflow-hidden aspect-[21/9] bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 flex flex-col justify-end">
             <div className="z-10 max-w-lg">
                 <div className="text-xs uppercase tracking-wider font-bold text-yellow-400 mb-2">Editor's Choice</div>
                 <h2 className="text-3xl font-bold mb-2">Clash of Nexus</h2>
                 <p className="text-gray-300 mb-4">Build your village, raise a clan, and compete in epic Clan Wars!</p>
                 <button className="bg-[#01875f] hover:bg-[#017654] text-white px-6 py-2 rounded-lg font-medium">Install Now</button>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
      </div>
    </div>
  );
};

export default PlayStoreApp;
