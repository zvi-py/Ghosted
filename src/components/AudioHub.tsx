import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music, Music2, Check, Sliders } from 'lucide-react';
import {
  isMusicEnabled,
  isSfxEnabled,
  toggleMusic,
  toggleSfx,
  playCorrect
} from '../utils/audio';

export const AudioHub: React.FC = () => {
  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read actual state after mounting
    setMusicOn(isMusicEnabled());
    setSfxOn(isSfxEnabled());
  }, []);

  const handleToggleMusic = () => {
    const nextState = toggleMusic();
    setMusicOn(nextState);
  };

  const handleToggleSfx = () => {
    const nextState = toggleSfx();
    setSfxOn(nextState);
    if (nextState) {
      // Play a satisfying feedback chime when turned back on
      setTimeout(() => {
        playCorrect();
      }, 50);
    }
  };

  return (
    <div className="relative z-50">
      {/* Floating Pill Controller */}
      <motion.button
        id="btn-audio-hub-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-2xs backdrop-blur-md transition-all cursor-pointer font-mono text-[11px] font-bold ${
          isOpen
            ? 'bg-purple-950 text-white border-purple-900'
            : 'bg-white/90 hover:bg-white text-zinc-700 border-purple-200/65'
        }`}
      >
        <span className="relative flex h-2 w-2">
          {musicOn && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${musicOn ? 'bg-purple-500' : 'bg-zinc-300'}`}></span>
        </span>
        {musicOn ? <Music className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: '3s' }} /> : <Volume2 className="w-3.5 h-3.5" />}
        <span>AUDIO</span>
      </motion.button>

      {/* Audio Panel Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              id="audio-hub-panel"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg border border-purple-100/80 rounded-3xl p-5 shadow-[0_12px_40px_rgba(124,58,237,0.1)] z-50 space-y-4 text-left select-none"
            >
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-purple-100/50 pb-2.5">
                <Sliders className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">
                  Audio Protocol
                </h4>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {/* 1. Ambient Music */}
                <div className="flex items-center justify-between p-2 hover:bg-purple-50/40 rounded-xl transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-950">
                      <Music2 className="w-3.5 h-3.5 text-purple-500" />
                      <span>Ambient Swells</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal font-light">
                      Generative chill cloud synth
                    </p>
                  </div>

                  <button
                    id="btn-toggle-ambient-music"
                    onClick={handleToggleMusic}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 flex items-center cursor-pointer ${
                      musicOn ? 'bg-purple-600 justify-end' : 'bg-zinc-250 justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 rounded-full bg-white shadow-xs"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* 2. Sound Effects */}
                <div className="flex items-center justify-between p-2 hover:bg-purple-50/40 rounded-xl transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-950">
                      <Volume2 className="w-3.5 h-3.5 text-purple-500" />
                      <span>Interface Cues</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal font-light">
                      Polished wood and glass chimes
                    </p>
                  </div>

                  <button
                    id="btn-toggle-interface-sfx"
                    onClick={handleToggleSfx}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 flex items-center cursor-pointer ${
                      sfxOn ? 'bg-purple-600 justify-end' : 'bg-zinc-250 justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 rounded-full bg-white shadow-xs"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              {/* Info Label */}
              <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100/40">
                <span className="text-[9px] font-mono leading-relaxed block text-purple-750 font-medium">
                  ✦ Dynamic browser synthesis runs with 0% network latency. Settings persist locally.
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
