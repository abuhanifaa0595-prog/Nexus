import React, { useState } from 'react';
import { Home, Search, Library, PlusSquare, Heart, Play, SkipBack, SkipForward, Repeat, Shuffle, Mic2, List, Speaker, Volume2, Pause } from 'lucide-react';

const SpotifyApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="flex flex-col h-full bg-[#121212] text-white font-sans select-none">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-black p-6 flex flex-col gap-6 hidden md:flex">
           <div className="space-y-4">
               <div className="flex items-center gap-4 text-white cursor-pointer font-bold">
                   <Home size={24} />
                   Home
               </div>
               <div className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer transition-colors font-bold">
                   <Search size={24} />
                   Search
               </div>
               <div className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer transition-colors font-bold">
                   <Library size={24} />
                   Your Library
               </div>
           </div>

           <div className="mt-4 space-y-4">
               <div className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer transition-colors font-bold">
                   <div className="bg-gray-300 text-black p-1 rounded-sm"><PlusSquare size={16} /></div>
                   Create Playlist
               </div>
               <div className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer transition-colors font-bold">
                   <div className="bg-gradient-to-br from-indigo-700 to-blue-300 text-white p-1 rounded-sm"><Heart size={16} fill="white" /></div>
                   Liked Songs
               </div>
           </div>
           
           <div className="border-t border-[#282828] pt-4 flex-1 overflow-y-auto custom-scrollbar">
               {['Chill Vibes', 'Top Hits 2024', 'Coding Focus', 'Gym Motivation', 'Discover Weekly', 'Late Night Jazz', 'Rock Classics'].map(pl => (
                   <div key={pl} className="text-sm text-gray-400 hover:text-white py-1.5 cursor-pointer truncate">{pl}</div>
               ))}
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-y-auto">
             <div className="sticky top-0 bg-[#1e1e1e]/90 backdrop-blur-md p-4 flex items-center justify-between z-10">
                 <div className="flex gap-4">
                     <button className="bg-black/40 rounded-full p-1"><SkipBack size={20} className="text-gray-400" /></button>
                     <button className="bg-black/40 rounded-full p-1"><SkipForward size={20} className="text-gray-400" /></button>
                 </div>
                 <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold text-black">N</div>
             </div>

             <div className="p-8 pt-2">
                 <h2 className="text-3xl font-bold mb-6">Good evening</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                     {[1, 2, 3, 4, 5, 6].map(i => (
                         <div key={i} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-md flex items-center overflow-hidden cursor-pointer group">
                             <div className={`w-20 h-20 bg-gradient-to-br ${i % 2 === 0 ? 'from-green-600 to-blue-600' : 'from-purple-600 to-red-600'} shadow-lg`}></div>
                             <span className="font-bold px-4">Daily Mix {i}</span>
                             <div className="ml-auto mr-4 bg-green-500 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                 <Play size={20} fill="black" className="text-black ml-0.5" />
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-4 w-[30%]">
              <div className="w-14 h-14 bg-gray-700 rounded-sm"></div>
              <div>
                  <div className="text-sm font-medium hover:underline cursor-pointer">Midnight City</div>
                  <div className="text-xs text-gray-400 hover:underline cursor-pointer">M83</div>
              </div>
              <Heart size={16} className="text-green-500 ml-2" fill="currentColor" />
          </div>

          <div className="flex flex-col items-center max-w-[40%] w-full gap-2">
              <div className="flex items-center gap-6">
                  <Shuffle size={16} className="text-gray-400 hover:text-white cursor-pointer" />
                  <SkipBack size={20} className="text-gray-300 hover:text-white cursor-pointer" />
                  <button 
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                      {isPlaying ? <Pause size={16} fill="black" className="text-black" /> : <Play size={16} fill="black" className="text-black ml-0.5" />}
                  </button>
                  <SkipForward size={20} className="text-gray-300 hover:text-white cursor-pointer" />
                  <Repeat size={16} className="text-gray-400 hover:text-white cursor-pointer" />
              </div>
              <div className="flex items-center gap-2 w-full text-xs text-gray-400">
                  <span>1:23</span>
                  <div className="h-1 bg-gray-600 rounded-full flex-1 group cursor-pointer">
                      <div className="h-full w-1/3 bg-white group-hover:bg-green-500 rounded-full relative"></div>
                  </div>
                  <span>4:05</span>
              </div>
          </div>

          <div className="flex items-center gap-3 w-[30%] justify-end text-gray-400">
              <Mic2 size={16} className="hover:text-white cursor-pointer" />
              <List size={16} className="hover:text-white cursor-pointer" />
              <Speaker size={16} className="hover:text-white cursor-pointer" />
              <div className="flex items-center gap-2 w-24 group">
                  <Volume2 size={16} />
                  <div className="h-1 bg-gray-600 rounded-full flex-1">
                      <div className="h-full w-2/3 bg-gray-400 group-hover:bg-green-500 rounded-full"></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SpotifyApp;