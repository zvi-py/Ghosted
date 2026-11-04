/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ParticleBackground } from './components/ParticleBackground';
import { CustomCursor } from './components/CustomCursor';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { BrainrotGame } from './components/BrainrotGame';
import { GKGame } from './components/GKGame';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { Shop } from './components/Shop';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { MascotGhost } from './components/MascotGhost';
import { AudioHub } from './components/AudioHub';
import { COSMETIC_ITEMS } from './data/cosmetics';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins,
  LogOut,
  ArrowLeft,
  Award
} from 'lucide-react';

type Tab = 'dashboard' | 'brainrot' | 'gk' | 'multiplayer' | 'shop' | 'leaderboard' | 'profile';

const AppContent: React.FC = () => {
  const { user, logout, levelUpEvent, dismissLevelUp } = useGame();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  // Custom particle state for Level Up Modal
  const [modalParticles, setModalParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);

  useEffect(() => {
    if (levelUpEvent?.show) {
      const colors = ['#7c3aed', '#b45309', '#ec4899', '#0284c7', '#10b981', '#3b82f6'];
      const particles = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 350,
        y: (Math.random() - 0.5) * 350,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4
      }));
      setModalParticles(particles);
    }
  }, [levelUpEvent]);

  // If user logging in, skip Landing Page
  useEffect(() => {
    if (user) {
      setShowLanding(false);
      setShowAuthScreen(false);
    }
  }, [user]);

  const handleEnterApp = () => {
    setShowLanding(false);
    setShowAuthScreen(true);
  };

  const handleBackToLanding = () => {
    setShowAuthScreen(false);
    setShowLanding(true);
  };

  // If user is not logged in, render unauthenticated flows
  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#f7f6fd]">
        <CustomCursor />
        <ParticleBackground />
        {showLanding ? (
          <LandingPage onEnterApp={handleEnterApp} />
        ) : (
          <div className="relative">
            {/* Absolute Back Button on Auth */}
            <button
              id="btn-auth-back-to-landing"
              onClick={handleBackToLanding}
              className="absolute top-6 left-6 text-xs text-purple-600 hover:text-purple-800 font-mono tracking-wider flex items-center gap-1 cursor-pointer z-50 bg-white p-2 border border-purple-200/80 rounded-xl shadow-xs font-bold"
            >
              ← BACK TO BANNER
            </button>
            <AuthScreen />
          </div>
        )}
      </div>
    );
  }

  // Find cosmetic profiles
  const equippedTitleItem = COSMETIC_ITEMS.find(c => c.id === user.equippedTitle);
  const equippedFrameItem = COSMETIC_ITEMS.find(c => c.id === user.equippedFrame);

  // Dispatch current screen
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onSelectGameMode={(mode) => setActiveTab(mode)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'brainrot':
        return <BrainrotGame onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'gk':
        return <GKGame onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'multiplayer':
        return <MultiplayerLobby onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'shop':
        return <Shop />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onSelectGameMode={(mode) => setActiveTab(mode)} onNavigateTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f7f6fd] text-zinc-900 select-none">
      <CustomCursor />
      <ParticleBackground />

      {/* Main Wrapper */}
      <div className="w-full flex flex-col min-h-screen">
        
        {/* Dynamic Navigation Topbar (Only shows on sub-pages to maximize clean space on main dashboard) */}
        <AnimatePresence mode="wait">
          {activeTab !== 'dashboard' ? (
            <motion.header
              key="sub-topbar"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="px-4 py-4 md:px-8 border-b border-purple-200/40 bg-white/70 backdrop-blur-md relative z-30 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <button
                  id="btn-back-to-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 text-[10px] font-mono tracking-widest uppercase bg-zinc-950 hover:bg-purple-600 text-white rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-white" />
                  <span>BACK</span>
                </button>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-purple-200/50 rounded-full">
                  <img
                    src="/assets/aistudio/image_fd9cc78b.png"
                    alt="Ghosted Logo"
                    className="w-4 h-4 object-contain"
                  />
                  <span className="font-serif italic font-bold text-xs tracking-wider text-zinc-900">
                    GHOSTED
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Audio Hub Controls */}
                <AudioHub />

                {/* Coins Tracker */}
                <div className="flex items-center gap-1.5 font-mono text-xs text-amber-650 font-bold px-3.5 py-1.5 bg-white border border-purple-200/50 rounded-full shadow-2xs">
                  <Coins className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{user.coins}</span>
                </div>

                {/* Micro avatar profile */}
                <div className="flex items-center gap-2.5 px-3 py-1 bg-white border border-purple-200/55 rounded-full shadow-2xs">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center bg-purple-50 p-0.5 shrink-0 border ${
                      equippedFrameItem ? equippedFrameItem.value : 'border-purple-250'
                    }`}
                  >
                    <MascotGhost skinId={user.equippedSkin} mood="idle" size={20} />
                  </div>
                  <span className="hidden sm:inline text-xs font-serif text-zinc-950 block italic font-bold">
                    {user.username}
                  </span>
                </div>
              </div>
            </motion.header>
          ) : (
            <>
              {/* Ghosted Brand Emblem with Custom Mascot Icon */}
              <motion.div
                key="dashboard-brand-badge"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute top-4 left-4 md:left-8 z-30 flex items-center gap-2.5 px-3.5 py-1.5 bg-white/85 backdrop-blur-md border border-purple-200/55 rounded-full shadow-2xs"
              >
                <img
                  src="/assets/aistudio/image_fd9cc78b.png"
                  alt="Ghosted Icon"
                  className="w-5 h-5 object-contain"
                />
                <span className="font-serif italic font-bold text-xs tracking-wider text-zinc-950">
                  GHOSTED
                </span>
                <span className="text-[9px] font-mono text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-200/40">
                  LIVE
                </span>
              </motion.div>

              {/* Subtle dashboard helper bar at the very top (just a tiny transparent sign out button and coins tracker) */}
              <motion.div
                key="dashboard-topbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 right-4 md:right-8 z-30 flex items-center gap-4"
              >
                {/* Audio Hub Controls */}
                <AudioHub />

                <div className="flex items-center gap-1.5 font-mono text-xs text-amber-650 font-bold px-3.5 py-1.5 bg-white border border-purple-200/55 rounded-full shadow-2xs">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>{user.coins}</span>
                </div>

                <button
                  id="dashboard-header-logout"
                  onClick={logout}
                  className="p-2 border border-purple-200/50 hover:border-red-400 bg-white hover:bg-red-50 text-zinc-500 hover:text-red-500 rounded-full cursor-pointer transition-all active:scale-95 shadow-2xs"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Pane */}
        <main className="flex-1 w-full px-4 py-8 md:p-8 max-w-7xl mx-auto relative z-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer info brand */}
        {activeTab === 'dashboard' && (
          <div className="pb-6 text-center text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
            GHOSTED VIBE PROTOCOL © 2026
          </div>
        )}
      </div>

      {/* LEVEL UP EXPLOSION MODAL */}
      <AnimatePresence>
        {levelUpEvent?.show && (
          <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-hidden">
            {/* Flying confetti particles */}
            <div className="absolute inset-0 pointer-events-none">
              {modalParticles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    scale: 0.5,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    backgroundColor: p.color,
                    width: p.size,
                    height: p.size,
                    boxShadow: `0 0 10px ${p.color}`
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white border-2 border-purple-300 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden shadow-[0_15px_50px_rgba(124,58,237,0.12)]"
            >
              {/* Top rainbow shine */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400" />

              <div className="flex justify-center">
                <MascotGhost skinId="skin_gold" mood="happy" size={130} />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-purple-600 tracking-widest block">Level Unlocked</span>
                <h2 className="text-3xl font-serif text-zinc-950 tracking-wide uppercase italic font-bold">LEVEL UP!</h2>
                <p className="text-zinc-500 text-xs">
                  You advanced from Level <span className="font-bold text-zinc-700">{levelUpEvent.oldLevel}</span> to{' '}
                  <span className="font-extrabold text-purple-650">{levelUpEvent.newLevel}</span>!
                </p>
              </div>

              {/* Reward info banner */}
              <div className="p-4 bg-purple-50 border border-purple-150 rounded-xl space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-amber-600 font-mono">
                  <Coins className="w-5 h-5" />
                  <span>+200 Coins Level Reward!</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Every level progression awards free coins to buy cosmetics, borders, or funny gamertag titles!
                </p>
              </div>

              <button
                id="btn-dismiss-levelup"
                onClick={dismissLevelUp}
                className="w-full h-11 bg-zinc-950 hover:bg-purple-600 text-white font-mono text-xs rounded-xl cursor-pointer active:scale-95 transition-all shadow-sm font-bold"
              >
                Claim Reward ✦
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
