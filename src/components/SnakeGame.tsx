import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw } from 'lucide-react';
import { Point, GameStatus } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setStatus('playing');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setStatus('gameover');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, highScore]);

  useEffect(() => {
    if (status === 'playing') {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <div className="flex justify-between w-full px-4 py-2 relative">
        {/* Glitchy Border Overlay */}
        <div className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-xl pointer-events-none" />
        
        <div className="flex flex-col relative group">
          <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/60 font-mono mb-1">Score</span>
          <div className="relative">
            <motion.span 
              animate={{ 
                x: [0, -2, 2, -1, 0],
                opacity: [1, 0.8, 1, 0.9, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.2,
                repeatDelay: Math.random() * 5
              }}
              className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] font-mono"
            >
              {score.toString().padStart(3, '0')}
            </motion.span>
            {/* Glitch Layers */}
            <motion.span 
              animate={{ 
                x: [0, 3, -3, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.1, repeatDelay: 2 }}
              className="absolute inset-0 text-4xl font-black text-fuchsia-500 font-mono -z-10 translate-x-1"
            >
              {score.toString().padStart(3, '0')}
            </motion.span>
          </div>
        </div>

        <div className="flex flex-col items-end relative">
          <span className="text-[10px] uppercase tracking-[0.3em] text-fuchsia-500/60 font-mono mb-1">Best</span>
          <div className="flex items-center gap-3 relative">
            <Trophy size={18} className="text-fuchsia-400 animate-pulse" />
            <div className="relative">
              <motion.span 
                animate={{ 
                  x: [0, 1, -1, 0],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
                }}
                transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 3 }}
                className="text-4xl font-black text-fuchsia-400 drop-shadow-[0_0_10px_rgba(192,38,211,0.6)] font-mono"
              >
                {highScore.toString().padStart(3, '0')}
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-black/60 rounded-xl border-2 border-cyan-500/20 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-10">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-500/30" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((p, i) => (
          <motion.div
            key={`${i}-${p.x}-${p.y}`}
            initial={false}
            animate={{ x: p.x * 20, y: p.y * 20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute w-[18px] h-[18px] rounded-sm m-[1px]"
            style={{
              background: i === 0 
                ? 'linear-gradient(45deg, #22d3ee, #0891b2)' 
                : 'linear-gradient(45deg, #0891b2, #164e63)',
              boxShadow: i === 0 ? '0 0 15px #22d3ee' : 'none',
              zIndex: i === 0 ? 10 : 5
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            boxShadow: [
              '0 0 10px #f02ad3',
              '0 0 20px #f02ad3',
              '0 0 10px #f02ad3'
            ]
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute w-[14px] h-[14px] rounded-full bg-fuchsia-500 m-[3px]"
          style={{ left: food.x * 20, top: food.y * 20 }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20"
            >
              <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic">Snake Neon</h2>
              <button 
                onClick={resetGame}
                className="group relative px-8 py-3 bg-cyan-500 text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <div className="relative flex items-center gap-2">
                  <Play size={20} fill="currentColor" />
                  START GAME
                </div>
              </button>
            </motion.div>
          )}

          {status === 'gameover' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-20"
            >
              <span className="text-fuchsia-500 font-mono text-sm tracking-widest mb-2">SYSTEM FAILURE</span>
              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">GAME OVER</h2>
              <p className="text-cyan-400/60 font-mono mb-8">FINAL SCORE: {score}</p>
              <button 
                onClick={resetGame}
                className="group flex items-center gap-2 px-8 py-3 border-2 border-cyan-500 text-cyan-500 font-bold rounded-full transition-all hover:bg-cyan-500 hover:text-black"
              >
                <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                RETRY
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-cyan-500/40 font-mono text-[10px] tracking-[0.3em] uppercase">
        Use Arrow Keys to Navigate
      </div>
    </div>
  );
}
