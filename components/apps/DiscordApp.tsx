import React, { useState } from 'react';
import { Plus, Compass, Download, Mic, Headphones, Settings, Hash, Volume2, Video, Phone, UserPlus, Inbox, HelpCircle, Gift, Sticker, Smile } from 'lucide-react';

const DiscordApp: React.FC = () => {
  const [activeServer, setActiveServer] = useState(0);
  const [activeChannel, setActiveChannel] = useState('general');

  const servers = [
    { id: 0, name: 'Home', icon: 'https://assets-global.website-files.com/6257adef93867e56f84d3101/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png', isDiscord: true },
    { id: 1, name: 'Nexus Devs', icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=100&auto=format&fit=crop' },
    { id: 2, name: 'React Community', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png' },
    { id: 3, name: 'Gaming Hub', icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=100&auto=format&fit=crop' },
  ];

  return (
    <div className="flex h-full bg-[#313338] text-white font-sans overflow-hidden">
      {/* Server Rail */}
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 overflow-y-auto hidden sm:flex">
         {servers.map(server => (
             <div key={server.id} className="relative group w-full flex justify-center cursor-pointer" onClick={() => setActiveServer(server.id)}>
                 {activeServer === server.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-lg"></div>}
                 <div className={`w-12 h-12 rounded-[24px] group-hover:rounded-[16px] ${activeServer === server.id ? 'rounded-[16px] bg-[#5865F2]' : 'bg-[#313338]'} transition-all overflow-hidden flex items-center justify-center`}>
                     <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
                 </div>
             </div>
         ))}
         <div className="w-8 h-[2px] bg-[#35363c] rounded-lg my-1"></div>
         <div className="w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-[#23a559] group-hover:rounded-[16px] transition-all flex items-center justify-center text-[#23a559] hover:text-white cursor-pointer group">
             <Plus size={24} />
         </div>
         <div className="w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-[#23a559] group-hover:rounded-[16px] transition-all flex items-center justify-center text-[#23a559] hover:text-white cursor-pointer group">
             <Compass size={24} />
         </div>
      </div>

      {/* Sidebar (Channels) */}
      <div className="w-60 bg-[#2b2d31] flex flex-col rounded-tl-lg hidden md:flex">
          <div className="h-12 border-b border-[#1f2023] flex items-center px-4 font-bold shadow-sm hover:bg-[#35373c] cursor-pointer transition-colors">
              {servers.find(s => s.id === activeServer)?.name}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
              {/* Text Channels */}
              <div>
                  <div className="flex items-center text-xs font-bold text-[#949ba4] uppercase px-2 mb-1 hover:text-white cursor-pointer">
                      <span className="mr-0.5">v</span> Text Channels
                  </div>
                  {['general', 'announcements', 'development', 'off-topic'].map(channel => (
                      <div 
                        key={channel} 
                        className={`flex items-center gap-2 px-2 py-1.5 rounded text-[#949ba4] hover:bg-[#35373c] hover:text-gray-100 cursor-pointer ${activeChannel === channel ? 'bg-[#404249] text-white' : ''}`}
                        onClick={() => setActiveChannel(channel)}
                      >
                          <Hash size={20} className="text-[#80848e]" />
                          <span className="font-medium truncate">{channel}</span>
                      </div>
                  ))}
              </div>
              
              {/* Voice Channels */}
              <div>
                  <div className="flex items-center text-xs font-bold text-[#949ba4] uppercase px-2 mb-1 hover:text-white cursor-pointer">
                      <span className="mr-0.5">v</span> Voice Channels
                  </div>
                  {['Lounge', 'Gaming', 'Music'].map(channel => (
                      <div key={channel} className="flex items-center gap-2 px-2 py-1.5 rounded text-[#949ba4] hover:bg-[#35373c] hover:text-gray-100 cursor-pointer">
                          <Volume2 size={20} className="text-[#80848e]" />
                          <span className="font-medium truncate">{channel}</span>
                      </div>
                  ))}
              </div>
          </div>

          {/* User Controls */}
          <div className="h-[52px] bg-[#232428] flex items-center px-2 gap-2">
              <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="User" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#232428]"></div>
              </div>
              <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">NexusUser</div>
                  <div className="text-xs text-[#b5bac1] truncate">#1337</div>
              </div>
              <div className="flex items-center">
                  <div className="p-1.5 hover:bg-[#35373c] rounded cursor-pointer"><Mic size={18} /></div>
                  <div className="p-1.5 hover:bg-[#35373c] rounded cursor-pointer"><Headphones size={18} /></div>
                  <div className="p-1.5 hover:bg-[#35373c] rounded cursor-pointer"><Settings size={18} /></div>
              </div>
          </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
          {/* Header */}
          <div className="h-12 border-b border-[#26272d] flex items-center justify-between px-4 shadow-sm">
              <div className="flex items-center gap-2">
                  <Hash size={24} className="text-[#80848e]" />
                  <span className="font-bold text-white">{activeChannel}</span>
                  <span className="hidden sm:block text-xs text-[#949ba4] ml-2 border-l border-[#3f4147] pl-3">Welcome to the beginning of the #{activeChannel} channel.</span>
              </div>
              <div className="flex items-center gap-4 text-[#b5bac1]">
                  <Phone size={24} className="hover:text-white cursor-pointer" />
                  <Video size={24} className="hover:text-white cursor-pointer" />
                  <div className="hidden sm:flex items-center gap-4">
                      <UserPlus size={24} className="hover:text-white cursor-pointer" />
                      <div className="relative">
                          <input type="text" placeholder="Search" className="bg-[#1e1f22] text-xs px-2 py-1 rounded w-36 transition-all focus:w-60 outline-none text-white" />
                      </div>
                      <Inbox size={24} className="hover:text-white cursor-pointer" />
                      <HelpCircle size={24} className="hover:text-white cursor-pointer" />
                  </div>
              </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar flex flex-col-reverse">
              {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex gap-4 group hover:bg-[#2e3035] -mx-4 px-4 py-0.5 mt-4">
                      <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden shrink-0 mt-1 cursor-pointer hover:shadow-lg transition-shadow">
                          <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=100&auto=format&fit=crop`} alt="User" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                              <span className="font-medium text-white hover:underline cursor-pointer">User {i}</span>
                              <span className="text-[10px] px-1.5 py-[1px] bg-[#5865F2] rounded text-white font-bold">BOT</span>
                              <span className="text-xs text-[#949ba4]">Today at {10+i}:00 AM</span>
                          </div>
                          <p className="text-[#dbdee1] whitespace-pre-wrap leading-relaxed">
                              This is a sample message in the Discord clone app running on NexusOS. It supports basic layout and styling. 🎮
                          </p>
                      </div>
                  </div>
              ))}
              
              <div className="mt-auto pt-10">
                   <div className="w-16 h-16 rounded-full bg-[#41434a] flex items-center justify-center mb-4">
                       <Hash size={40} className="text-white" />
                   </div>
                   <h1 className="text-3xl font-bold mb-2">Welcome to #{activeChannel}!</h1>
                   <p className="text-[#b5bac1]">This is the start of the #{activeChannel} channel.</p>
              </div>
          </div>

          {/* Input Area */}
          <div className="px-4 pb-6 pt-2">
              <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex items-center gap-3">
                  <div className="p-1 rounded-full bg-[#b5bac1] text-[#383a40] cursor-pointer hover:text-white transition-colors">
                      <Plus size={16} className="font-bold" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={`Message #${activeChannel}`} 
                    className="bg-transparent outline-none flex-1 text-[#dbdee1] placeholder-[#949ba4]"
                  />
                  <div className="flex items-center gap-3 text-[#b5bac1]">
                      <Gift size={24} className="hover:text-white cursor-pointer" />
                      <Sticker size={24} className="hover:text-white cursor-pointer" />
                      <Smile size={24} className="hover:text-white cursor-pointer" />
                  </div>
              </div>
          </div>
      </div>

      {/* Users Rail */}
      <div className="w-60 bg-[#2b2d31] hidden lg:flex flex-col p-4 overflow-y-auto">
          <div className="mb-6">
              <div className="text-xs font-bold text-[#949ba4] uppercase mb-2">Online — 3</div>
              {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-[#35373c] cursor-pointer opacity-100">
                      <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                              <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=100&auto=format&fit=crop`} alt="User" />
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2b2d31]"></div>
                      </div>
                      <div className="flex-col">
                          <div className="text-sm font-medium text-[#f2f3f5]">User {i}</div>
                          {i === 1 && <div className="text-xs text-[#949ba4]">Playing NexusOS</div>}
                      </div>
                  </div>
              ))}
          </div>
          <div>
              <div className="text-xs font-bold text-[#949ba4] uppercase mb-2">Offline — 14</div>
              {[4, 5, 6, 7].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-[#35373c] cursor-pointer opacity-50 hover:opacity-100">
                       <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden grayscale">
                           <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=100&auto=format&fit=crop`} alt="User" />
                       </div>
                       <div className="text-sm font-medium text-[#f2f3f5]">User {i}</div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default DiscordApp;