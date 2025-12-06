import React, { useState } from 'react';
import { Home, Search, MessageSquare, User, Heart, Share2, Music, PlusSquare } from 'lucide-react';

const TikTokApp: React.FC = () => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex h-full bg-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#2f2f2f] p-4 hidden md:flex flex-col gap-4 overflow-y-auto custom-scrollbar">
         <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center font-bold text-white text-xl border border-gray-700">T</div>
             <span className="font-bold text-2xl tracking-tighter">TikTok</span>
         </div>

         <div className="space-y-2 pb-4 border-b border-[#2f2f2f]">
             <div className="flex items-center gap-3 px-2 py-3 bg-[#1f1f1f] rounded-lg text-[#fe2c55] font-bold cursor-pointer">
                 <Home size={24} />
                 <span>For You</span>
             </div>
             <div className="flex items-center gap-3 px-2 py-3 hover:bg-[#1f1f1f] rounded-lg cursor-pointer transition-colors font-semibold">
                 <User size={24} />
                 <span>Following</span>
             </div>
             <div className="flex items-center gap-3 px-2 py-3 hover:bg-[#1f1f1f] rounded-lg cursor-pointer transition-colors font-semibold">
                 <Search size={24} />
                 <span>Explore</span>
             </div>
             <div className="flex items-center gap-3 px-2 py-3 hover:bg-[#1f1f1f] rounded-lg cursor-pointer transition-colors font-semibold">
                 <MessageSquare size={24} />
                 <span>LIVE</span>
             </div>
         </div>
         
         <div className="pt-4">
             <p className="text-gray-400 text-xs font-semibold mb-4">Suggested accounts</p>
             {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-[#1f1f1f] p-2 rounded-lg transition-colors">
                     <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                         <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=100&auto=format&fit=crop`} alt="User" className="w-full h-full object-cover" />
                     </div>
                     <div>
                         <div className="text-sm font-bold hover:underline">user_nexus_{i}</div>
                         <div className="text-xs text-gray-400">Nexus Creator</div>
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto snap-y snap-mandatory bg-[#121212] custom-scrollbar">
         {[1, 2, 3].map((item, index) => (
             <div key={index} className="h-full w-full flex justify-center py-6 snap-start border-b border-[#2f2f2f]">
                 <div className="relative h-full aspect-[9/16] bg-[#222] rounded-lg overflow-hidden flex shadow-2xl">
                     <img 
                        src={`https://images.unsplash.com/photo-${1510000000000 + index * 1000}?q=80&w=800&auto=format&fit=crop`} 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        alt="Video Content"
                     />
                     
                     <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
                         <div className="flex items-end justify-between">
                             <div className="mb-4 text-shadow w-3/4">
                                 <div className="font-bold text-lg mb-1 hover:underline cursor-pointer">@creative_user_{index}</div>
                                 <div className="text-sm mb-2">Check out this amazing view! 🏔️ #nexus #travel #viral</div>
                                 <div className="flex items-center gap-2 text-sm font-semibold">
                                     <Music size={14} />
                                     <span>Original Sound - @creative_user_{index}</span>
                                 </div>
                             </div>

                             <div className="flex flex-col items-center gap-4 mb-4">
                                 <div className="relative mb-2">
                                     <div className="w-12 h-12 rounded-full border border-white overflow-hidden cursor-pointer">
                                         <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="Avatar" />
                                     </div>
                                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#fe2c55] rounded-full p-0.5">
                                         <PlusSquare size={12} fill="white" className="text-white" />
                                     </div>
                                 </div>

                                 <div className="flex flex-col items-center cursor-pointer">
                                     <div className={`p-2 rounded-full bg-black/40 transition-colors ${liked ? 'text-[#fe2c55]' : 'text-white'}`} onClick={() => setLiked(!liked)}>
                                         <Heart size={28} fill={liked ? '#fe2c55' : 'rgba(255,255,255,0.9)'} />
                                     </div>
                                     <span className="text-xs font-bold mt-1">452.1K</span>
                                 </div>

                                 <div className="flex flex-col items-center cursor-pointer">
                                     <div className="p-2 rounded-full bg-black/40 text-white">
                                         <MessageSquare size={28} fill="white" />
                                     </div>
                                     <span className="text-xs font-bold mt-1">2093</span>
                                 </div>

                                 <div className="flex flex-col items-center cursor-pointer">
                                     <div className="p-2 rounded-full bg-black/40 text-white">
                                         <Share2 size={28} fill="white" />
                                     </div>
                                     <span className="text-xs font-bold mt-1">12.5K</span>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};

export default TikTokApp;