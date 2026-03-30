import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <main className="relative z-10 container mx-auto min-h-screen flex flex-col items-center justify-center gap-12 p-6">
        <header className="text-center space-y-2">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-4"
          >
            Experimental Hybrid Interface v1.0
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-8xl md:text-[14rem] font-black tracking-tighter uppercase relative group flex items-center justify-center"
          >
            <div className="relative font-mono">
              <span className="relative z-10 text-white">NEON</span>
              
              {/* Glitch Layers */}
              <motion.span 
                animate={{ 
                  x: [-2, 2, -1, 3, 0],
                  y: [1, -1, 2, 0],
                  opacity: [0.5, 0.8, 0.4, 0.7]
                }}
                transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                className="absolute inset-0 text-cyan-400 opacity-50 -z-10 translate-x-1"
              >
                NEON
              </motion.span>
              <motion.span 
                animate={{ 
                  x: [2, -2, 1, -3, 0],
                  y: [-1, 1, -2, 0],
                  opacity: [0.5, 0.8, 0.4, 0.7]
                }}
                transition={{ repeat: Infinity, duration: 0.15, ease: "linear", delay: 0.05 }}
                className="absolute inset-0 text-fuchsia-500 opacity-50 -z-20 -translate-x-1"
              >
                NEON
              </motion.span>
              
              {/* Scanline effect on text */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1 w-full animate-scanline pointer-events-none z-20" />
            </div>
            
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 ml-6 italic text-6xl md:text-8xl">Pulse</span>
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 font-mono text-sm tracking-widest uppercase"
          >
            Play the grid. Feel the rhythm.
          </motion.p>
        </header>

        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12">
          {/* Left Side - Stats or Info could go here, but we'll keep it clean */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden xl:flex flex-col gap-8 w-64 pt-12"
          >
            <div className="space-y-4">
              <h4 className="text-xs font-mono text-cyan-500/60 uppercase tracking-widest">System Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/40">CORE_TEMP</span>
                  <span className="text-cyan-400">32°C</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['20%', '45%', '30%'] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="h-full bg-cyan-500/50" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/40">SYNC_RATE</span>
                  <span className="text-fuchsia-400">99.9%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['80%', '95%', '85%'] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="h-full bg-fuchsia-500/50" 
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-3">
              <p className="text-[10px] leading-relaxed text-white/40 font-mono">
                Welcome to the Neon Pulse environment. Control the snake with arrow keys. Manage your audio experience with the integrated player.
              </p>
            </div>
          </motion.div>

          {/* Center - Game */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SnakeGame />
          </motion.div>

          {/* Right Side - Music Player */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-8"
          >
            <MusicPlayer />
            
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest mb-4">Up Next</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    02
                  </div>
                  <div>
                    <p className="text-xs font-bold">Midnight Grid</p>
                    <p className="text-[10px] font-mono text-white/40">Digital Dreamer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-30">
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                    03
                  </div>
                  <div>
                    <p className="text-xs font-bold">Pulse of the Machine</p>
                    <p className="text-[10px] font-mono text-white/40">Neural Beats</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-auto py-8 text-center">
          <p className="text-[10px] font-mono text-white/20 tracking-[0.5em] uppercase">
            &copy; 2026 NEON PULSE INTERACTIVE // ALL RIGHTS RESERVED
          </p>
        </footer>
      </main>
    </div>
  );
}
