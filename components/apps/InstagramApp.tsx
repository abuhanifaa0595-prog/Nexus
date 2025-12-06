import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Search, 
  Home, 
  Compass, 
  Film, 
  PlusSquare, 
  Menu,
  Smile
} from 'lucide-react';

interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: number;
  caption: string;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface Story {
  id: number;
  username: string;
  avatar: string;
  isSeen: boolean;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    username: 'natgeo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop',
    likes: 12453,
    caption: 'The breathtaking view of the mountains at sunrise. Nature is amazing! 🏔️ #nature #sunrise #mountains',
    comments: 342,
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    username: 'design.daily',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
    likes: 8932,
    caption: 'Minimalist architecture in Tokyo. What do you think about this structure?',
    comments: 124,
    isLiked: true,
    isSaved: true
  },
  {
    id: 3,
    username: 'tech_crunch',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
    likes: 5621,
    caption: 'Coding setup goals. 💻 #developer #setup #tech',
    comments: 89,
    isLiked: false,
    isSaved: false
  }
];

const STORIES: Story[] = [
  { id: 1, username: 'your_story', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop', isSeen: false },
  { id: 2, username: 'alex_doe', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop', isSeen: false },
  { id: 3, username: 'sarah_m', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop', isSeen: true },
  { id: 4, username: 'mike_t', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop', isSeen: false },
  { id: 5, username: 'lisa_art', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop', isSeen: true },
];

const InstagramApp: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [activeTab, setActiveTab] = useState('home');

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleSave = (id: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return { ...post, isSaved: !post.isSaved };
      }
      return post;
    }));
  };

  return (
    <div className="flex h-full bg-black text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-[244px] hidden md:flex flex-col border-r border-[#262626] p-3">
        <div className="pt-8 pb-8 px-3 mb-4">
           {/* Instagram Logo Text */}
           <h1 className="text-xl font-medium tracking-tight" style={{ fontFamily: 'billabong, cursive' }}>Instagram</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
            {[
                { name: 'Home', icon: Home, id: 'home' },
                { name: 'Search', icon: Search, id: 'search' },
                { name: 'Explore', icon: Compass, id: 'explore' },
                { name: 'Reels', icon: Film, id: 'reels' },
                { name: 'Messages', icon: MessageCircle, id: 'messages' },
                { name: 'Notifications', icon: Heart, id: 'notifications' },
                { name: 'Create', icon: PlusSquare, id: 'create' },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-3 py-3 rounded-lg w-full transition-all hover:bg-[#1a1a1a] group
                        ${activeTab === item.id ? 'font-bold' : 'font-normal'}
                    `}
                >
                    <item.icon size={24} className={`group-hover:scale-105 transition-transform ${activeTab === item.id ? 'stroke-[2.5px]' : ''}`} />
                    <span>{item.name}</span>
                </button>
            ))}
            
            <button className="flex items-center gap-4 px-3 py-3 rounded-lg w-full transition-all hover:bg-[#1a1a1a] mt-2">
                 <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-600">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="Profile" />
                 </div>
                 <span>Profile</span>
            </button>
        </nav>

        <div className="mt-auto">
            <button className="flex items-center gap-4 px-3 py-3 rounded-lg w-full transition-all hover:bg-[#1a1a1a]">
                <Menu size={24} />
                <span>More</span>
            </button>
        </div>
      </div>

      {/* Main Content Feed */}
      <div className="flex-1 overflow-y-auto flex justify-center">
         <div className="w-full max-w-[630px] pt-8 px-4 md:px-0">
             
             {/* Stories */}
             <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
                {STORIES.map(story => (
                    <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
                        <div className={`p-[3px] rounded-full bg-gradient-to-tr ${story.isSeen ? 'from-gray-600 to-gray-600' : 'from-yellow-400 via-red-500 to-purple-600'}`}>
                            <div className="w-14 h-14 rounded-full border-2 border-black overflow-hidden bg-black">
                                <img src={story.avatar} alt={story.username} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-xs text-gray-300 w-16 truncate text-center">{story.username}</span>
                    </div>
                ))}
             </div>

             {/* Posts Feed */}
             <div className="flex flex-col gap-6 pb-20">
                {posts.map(post => (
                    <div key={post.id} className="border-b border-[#262626] pb-6 last:border-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 cursor-pointer">
                                    <img src={post.avatar} alt={post.username} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-semibold cursor-pointer hover:opacity-80">{post.username}</span>
                                <span className="text-gray-500 text-sm">• 2h</span>
                            </div>
                            <MoreHorizontal className="text-white cursor-pointer" size={20} />
                        </div>

                        {/* Image */}
                        <div 
                            className="rounded bg-[#121212] overflow-hidden border border-[#262626] aspect-square flex items-center justify-center cursor-pointer"
                            onDoubleClick={() => toggleLike(post.id)}
                        >
                            <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Heart 
                                    size={24} 
                                    className={`cursor-pointer transition-colors ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-white hover:text-gray-400'}`}
                                    onClick={() => toggleLike(post.id)}
                                />
                                <MessageCircle size={24} className="cursor-pointer hover:text-gray-400" />
                                <Send size={24} className="cursor-pointer hover:text-gray-400" />
                            </div>
                            <Bookmark 
                                size={24} 
                                className={`cursor-pointer transition-colors ${post.isSaved ? 'fill-white text-white' : 'text-white hover:text-gray-400'}`}
                                onClick={() => toggleSave(post.id)}
                            />
                        </div>

                        {/* Likes & Caption */}
                        <div className="mt-3 space-y-1">
                            <div className="text-sm font-semibold">{post.likes.toLocaleString()} likes</div>
                            <div className="text-sm">
                                <span className="font-semibold mr-2">{post.username}</span>
                                {post.caption}
                            </div>
                            <div className="text-sm text-gray-500 cursor-pointer">View all {post.comments} comments</div>
                            
                            <div className="flex items-center gap-2 mt-2">
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..." 
                                    className="bg-transparent text-sm w-full outline-none placeholder-gray-500"
                                />
                                <Smile size={14} className="text-gray-500 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
         </div>
      </div>

      {/* Right Sidebar Suggestions */}
      <div className="hidden xl:block w-[320px] pt-8 pr-8 pl-4">
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="Current User" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-sm font-semibold">nexus_user</span>
                      <span className="text-sm text-gray-500">Nexus OS User</span>
                  </div>
              </div>
              <button className="text-xs text-blue-500 font-semibold hover:text-blue-400">Switch</button>
          </div>

          <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500">Suggested for you</span>
              <button className="text-xs text-white font-semibold hover:text-gray-300">See All</button>
          </div>

          <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                            <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=100&auto=format&fit=crop`} alt="Suggested" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold">suggested_user_{i}</span>
                            <span className="text-[10px] text-gray-500">Followed by user_{i+2}</span>
                        </div>
                      </div>
                      <button className="text-xs text-blue-500 font-semibold hover:text-blue-400">Follow</button>
                  </div>
              ))}
          </div>

          <div className="mt-8 text-xs text-gray-600 space-y-4">
              <p>About • Help • Press • API • Jobs • Privacy • Terms</p>
              <p>© 2024 INSTAGRAM FROM NEXUS</p>
          </div>
      </div>
    </div>
  );
};

export default InstagramApp;