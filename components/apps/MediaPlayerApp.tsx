import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Music, 
  Video, 
  List,
  Maximize2
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

const MediaPlayerApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { fileSystem } = useOS();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mediaFiles = fileSystem.filter(f => 
    f.name.endsWith('.mp3') || f.name.endsWith('.mp4') || f.name.endsWith('.webm')
  );

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentFile = mediaFiles[currentFileIndex];
  const isVideo = currentFile?.name.endsWith('.mp4') || currentFile?.name.endsWith('.webm');

  useEffect(() => {
    // Reset state on file change
    setIsPlaying(false);
    setCurrentTime(0);
  }, [currentFileIndex]);

  const togglePlay = () => {
    const media = isVideo ? videoRef.current : audioRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const media = isVideo ? videoRef.current : audioRef.current;
    if (media) {
      setCurrentTime(media.currentTime);
      setDuration(media.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    const media = isVideo ? videoRef.current : audioRef.current;
    if (media) {
      media.currentTime = time;
      setCurrentTime(time);
    }
  };

  const nextTrack = () => {
    setCurrentFileIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const prevTrack = () => {
    setCurrentFileIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white">
        <Music size={64} className="mb-4 text-gray-600" />
        <p>No media files found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white select-none">
      {/* Media Display Area */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentFile.content}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={nextTrack}
            onClick={togglePlay}
          />
        ) : (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <Music size={64} className="text-white" />
            </div>
            <div className="text-center">
               <h2 className="text-xl font-bold">{currentFile.name}</h2>
               <p className="text-gray-400">Nexus Audio</p>
            </div>
            <audio 
                ref={audioRef} 
                src={currentFile.content} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextTrack}
            />
          </div>
        )}
        
        {/* Playlist Overlay */}
        {showPlaylist && (
            <div className="absolute inset-y-0 right-0 w-64 bg-black/80 backdrop-blur-md border-l border-white/10 p-4 overflow-y-auto animate-slide-up">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Playlist</h3>
                <div className="space-y-2">
                    {mediaFiles.map((file, idx) => (
                        <button
                            key={file.id}
                            onClick={() => {
                                setCurrentFileIndex(idx);
                                setShowPlaylist(false);
                            }}
                            className={`w-full text-left p-2 rounded flex items-center gap-2 text-sm truncate
                                ${idx === currentFileIndex ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-gray-300'}
                            `}
                        >
                            {file.name.endsWith('mp4') ? <Video size={14}/> : <Music size={14}/>}
                            <span className="truncate">{file.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-24 bg-neutral-900 border-t border-white/10 px-6 flex flex-col justify-center gap-2">
         {/* Progress Bar */}
         <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
             <span>{formatTime(currentTime)}</span>
             <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
             />
             <span>{formatTime(duration)}</span>
         </div>

         <div className="flex items-center justify-between mt-2">
             <div className="flex items-center gap-4">
                 <button onClick={prevTrack} className="text-gray-400 hover:text-white transition-colors">
                     <SkipBack size={20} />
                 </button>
                 <button 
                    onClick={togglePlay} 
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                 >
                     {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
                 </button>
                 <button onClick={nextTrack} className="text-gray-400 hover:text-white transition-colors">
                     <SkipForward size={20} />
                 </button>
             </div>

             <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className={`text-gray-400 hover:text-white transition-colors ${showPlaylist ? 'text-indigo-400' : ''}`}
                 >
                     <List size={20} />
                 </button>
                 <div className="flex items-center gap-2 group w-24">
                     {volume === 0 ? <VolumeX size={18} className="text-gray-400"/> : <Volume2 size={18} className="text-gray-400"/>}
                     <input 
                        type="range" min="0" max="1" step="0.1" 
                        value={volume}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            setVolume(v);
                            if (videoRef.current) videoRef.current.volume = v;
                            if (audioRef.current) audioRef.current.volume = v;
                        }}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white opacity-0 group-hover:opacity-100 transition-opacity"
                     />
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default MediaPlayerApp;