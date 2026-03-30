import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'CyberSynth AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400'
  },
  {
    id: '2',
    title: 'Midnight Grid',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400'
  },
  {
    id: '3',
    title: 'Pulse of the Machine',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-fuchsia-500/30 shadow-[0_0_50px_-12px_rgba(217,70,239,0.5)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-6 mb-8">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Music size={24} className="text-white drop-shadow-lg" />
              </motion.div>
            </div>
          )}
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <motion.h3 
            key={`title-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-bold text-white truncate"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={`artist-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-fuchsia-400/80 font-mono text-sm"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 group-hover:h-2 transition-all"
          />
          <div 
            className="absolute top-0 left-0 h-1.5 bg-fuchsia-500 rounded-lg pointer-events-none group-hover:h-2 transition-all shadow-[0_0_10px_#d946ef]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={skipBack}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center bg-fuchsia-500 text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(217,70,239,0.6)]"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>

            <button 
              onClick={skipForward}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-white/40">
            <Volume2 size={18} />
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
