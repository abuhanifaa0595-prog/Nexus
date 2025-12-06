import React from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Image, Smile, Calendar, MapPin, Repeat, Heart, BarChart2, Share, MessageCircle } from 'lucide-react';

const TwitterApp: React.FC = () => {
  return (
    <div className="flex h-full bg-black text-white font-sans">
      {/* Sidebar */}
      <div className="w-20 xl:w-64 flex flex-col items-end xl:items-start px-2 py-4 border-r border-[#2f3336] h-full overflow-y-auto">
        <div className="mb-4 xl:ml-3 p-3 hover:bg-[#181818] rounded-full w-fit transition-colors cursor-pointer">
           <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 text-white fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
        </div>

        <nav className="space-y-1 w-full">
            {[
                { icon: Home, label: 'Home', active: true },
                { icon: Search, label: 'Explore' },
                { icon: Bell, label: 'Notifications' },
                { icon: Mail, label: 'Messages' },
                { icon: Bookmark, label: 'Bookmarks' },
                { icon: User, label: 'Profile' },
                { icon: MoreHorizontal, label: 'More' },
            ].map(item => (
                <div key={item.label} className="flex items-center gap-4 p-3 rounded-full hover:bg-[#181818] w-fit xl:w-full cursor-pointer transition-colors group">
                    <item.icon size={26} className={item.active ? 'stroke-[3px]' : ''} />
                    <span className={`hidden xl:block text-xl ${item.active ? 'font-bold' : 'font-normal'}`}>{item.label}</span>
                </div>
            ))}
        </nav>

        <button className="mt-8 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full p-4 xl:px-8 xl:py-3 font-bold text-lg shadow-lg w-fit xl:w-full transition-colors">
            <span className="hidden xl:block">Post</span>
            <span className="xl:hidden">+</span>
        </button>

        <div className="mt-auto flex items-center gap-3 p-3 rounded-full hover:bg-[#181818] w-full cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="Profile" />
            </div>
            <div className="hidden xl:block">
                <div className="font-bold text-sm">Nexus User</div>
                <div className="text-gray-500 text-sm">@nexus_user</div>
            </div>
            <MoreHorizontal size={16} className="hidden xl:block ml-auto" />
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 border-r border-[#2f3336] overflow-y-auto w-full max-w-[600px]">
         <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-[#2f3336] z-10">
             <div className="flex">
                 <div className="flex-1 p-4 hover:bg-[#181818] text-center cursor-pointer transition-colors font-bold relative">
                     For you
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>
                 </div>
                 <div className="flex-1 p-4 hover:bg-[#181818] text-center cursor-pointer transition-colors text-gray-500 font-medium">
                     Following
                 </div>
             </div>
         </div>

         {/* Composer */}
         <div className="p-4 border-b border-[#2f3336] flex gap-4">
             <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden shrink-0">
                 <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="Profile" />
             </div>
             <div className="flex-1">
                 <input 
                    type="text" 
                    placeholder="What is happening?!" 
                    className="bg-transparent text-xl placeholder-gray-500 outline-none w-full mb-4"
                 />
                 <div className="flex items-center justify-between border-t border-[#2f3336] pt-3">
                     <div className="flex gap-4 text-[#1d9bf0]">
                         <Image size={20} className="cursor-pointer" />
                         <Smile size={20} className="cursor-pointer" />
                         <Calendar size={20} className="cursor-pointer" />
                         <MapPin size={20} className="cursor-pointer opacity-50" />
                     </div>
                     <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white px-4 py-1.5 rounded-full font-bold disabled:opacity-50 transition-colors">
                         Post
                     </button>
                 </div>
             </div>
         </div>

         {/* Tweets */}
         <div>
             {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="p-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer group">
                     <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden shrink-0">
                             <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=100&auto=format&fit=crop`} alt="User" />
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold hover:underline">Nexus Dev</span>
                                 <span className="text-gray-500">@dev_nexus_{i}</span>
                                 <span className="text-gray-500">· {i}h</span>
                                 <MoreHorizontal size={16} className="ml-auto text-gray-500 group-hover:text-[#1d9bf0]" />
                             </div>
                             <p className="text-[15px] leading-normal mb-3">
                                 Just pushed a major update to the NexusOS kernel. The performance improvements are insane! 🚀 #WebOS #React #Gemini
                             </p>
                             {i % 2 === 0 && (
                                 <div className="rounded-2xl overflow-hidden border border-[#2f3336] mb-3">
                                     <img src={`https://images.unsplash.com/photo-${1510000000000 + i * 100}?q=80&w=600&auto=format&fit=crop`} className="w-full h-full object-cover" alt="Tweet media" />
                                 </div>
                             )}
                             <div className="flex justify-between text-gray-500 max-w-md">
                                 <div className="flex items-center gap-2 hover:text-[#1d9bf0] transition-colors group/action">
                                     <div className="p-2 rounded-full group-hover/action:bg-[#1d9bf0]/10"><MessageCircle size={18} /></div>
                                     <span className="text-sm">24</span>
                                 </div>
                                 <div className="flex items-center gap-2 hover:text-green-500 transition-colors group/action">
                                     <div className="p-2 rounded-full group-hover/action:bg-green-500/10"><Repeat size={18} /></div>
                                     <span className="text-sm">5</span>
                                 </div>
                                 <div className="flex items-center gap-2 hover:text-pink-500 transition-colors group/action">
                                     <div className="p-2 rounded-full group-hover/action:bg-pink-500/10"><Heart size={18} /></div>
                                     <span className="text-sm">182</span>
                                 </div>
                                 <div className="flex items-center gap-2 hover:text-[#1d9bf0] transition-colors group/action">
                                     <div className="p-2 rounded-full group-hover/action:bg-[#1d9bf0]/10"><BarChart2 size={18} /></div>
                                     <span className="text-sm">1.2k</span>
                                 </div>
                                 <div className="flex items-center gap-2 hover:text-[#1d9bf0] transition-colors group/action">
                                     <div className="p-2 rounded-full group-hover/action:bg-[#1d9bf0]/10"><Share size={18} /></div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-[350px] pl-8 py-4 pr-4">
          <div className="bg-[#202327] rounded-full flex items-center px-4 py-3 mb-6 focus-within:bg-black focus-within:ring-1 focus-within:ring-[#1d9bf0] border border-transparent focus-within:border-[#1d9bf0]">
              <Search size={20} className="text-gray-500 mr-3" />
              <input type="text" placeholder="Search" className="bg-transparent outline-none w-full" />
          </div>

          <div className="bg-[#16181c] rounded-2xl mb-4 overflow-hidden">
              <h2 className="font-extrabold text-xl px-4 py-3">What's happening</h2>
              {[
                  { cat: 'Technology · Trending', title: '#NexusOS', posts: '54.2K posts' },
                  { cat: 'US News · LIVE', title: 'SpaceX Starship Launch', posts: '124K posts' },
                  { cat: 'Trending in Tech', title: 'React 19', posts: '22.1K posts' },
                  { cat: 'Gaming · Trending', title: 'GTA VI', posts: '89.5K posts' }
              ].map((trend, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-[#1d1f23] cursor-pointer transition-colors">
                      <div className="flex justify-between text-gray-500 text-xs mb-0.5">
                          <span>{trend.cat}</span>
                          <MoreHorizontal size={14} />
                      </div>
                      <div className="font-bold mb-0.5">{trend.title}</div>
                      <div className="text-gray-500 text-xs">{trend.posts}</div>
                  </div>
              ))}
              <div className="px-4 py-4 text-[#1d9bf0] hover:bg-[#1d1f23] cursor-pointer text-sm">Show more</div>
          </div>
      </div>
    </div>
  );
};

export default TwitterApp;