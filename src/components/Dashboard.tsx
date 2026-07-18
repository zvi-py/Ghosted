import React from 'react';
import { useGame } from '../context/GameContext';
import { MascotGhost } from './MascotGhost';
import { COSMETIC_ITEMS } from '../data/cosmetics';
import { motion } from 'motion/react';
import { 
  Brain, 
  Award, 
  Users, 
  Coins, 
  Sparkles, 
  Trophy, 
  User, 
  ShoppingBag, 
  Target,
  ArrowRight,
  Flame,
  Zap,
  Activity
} from 'lucide-react';

interface DashboardProps {
  onSelectGameMode: (mode: 'brainrot' | 'gk' | 'multiplayer') => void;
  onNavigateTab: (tab: 'dashboard' | 'shop' | 'leaderboard' | 'profile' | 'brainrot' | 'gk' | 'multiplayer') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectGameMode, onNavigateTab }) => {
  const { user, missions } = useGame();

  if (!user) return null;

  // Cosmetic matching
  const equippedTitleItem = COSMETIC_ITEMS.find(c => c.id === user.equippedTitle);
  const equippedFrameItem = COSMETIC_ITEMS.find(c => c.id === user.equippedFrame);

  // Level & XP calculations
  const nextLevelXp = user.level * 500;
  const xpPercent = Math.min(100, (user.xp / nextLevelXp) * 100);

  // Active mission count
  const activeMissionsCount = missions.filter(m => m.progress < m.target).length;
  const completedMissionsCount = missions.filter(m => m.progress >= m.target && !m.rewarded).length;

  // Stagger entrance animation variants for classy transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 22, scale: 0.975 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15
      } 
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-8 px-4 max-w-6xl mx-auto relative select-none">
      
      {/* Dynamic atmospheric subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-200/25 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Header Brand Concept */}
      <div className="text-center space-y-4 mb-14">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block relative mb-2"
        >
          {/* Glowing pedestal backing */}
          <div className="absolute inset-0 bg-purple-200/40 rounded-full blur-xl scale-90 -z-10 animate-pulse" />
          
          <div className={`w-28 h-28 rounded-full flex items-center justify-center bg-white p-1.5 border-3 ${
            equippedFrameItem ? equippedFrameItem.value : 'border-purple-250/50'
          } shadow-[0_16px_48px_rgba(124,58,237,0.08)]`}>
            <MascotGhost skinId={user.equippedSkin} mood="happy" size={76} />
          </div>
          <div className="absolute -bottom-2.5 right-1.5 bg-zinc-950 text-white font-mono text-[10px] px-3.5 py-1 rounded-full border border-purple-200/20 uppercase font-bold tracking-widest shadow-md">
            LVL {user.level}
          </div>
        </motion.div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3.5 py-1 text-[9px] bg-purple-50 text-purple-750 border border-purple-200/60 rounded-full font-mono tracking-widest uppercase font-black shadow-3xs">
              {equippedTitleItem ? equippedTitleItem.value : 'NPC'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-zinc-950 italic tracking-wider font-extralight uppercase">
            {user.username}
          </h1>
          
          {/* Level progress bar beautifully designed */}
          <div className="w-full max-w-[280px] mx-auto mt-4 space-y-1.5">
            <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-extrabold">
              <span>EXPERIENCE ENGINE</span>
              <span>{user.xp} / {nextLevelXp} XP</span>
            </div>
            <div className="w-full h-2 bg-purple-100/45 border border-purple-200/20 rounded-full overflow-hidden p-[1.5px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-xs" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Options Portal Bento-Grid (Enlarged and premium layouts with stagger animations in a 3-column setup) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full relative z-10"
      >
        
        {/* Card 1: Brainrot Arena */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2 } }}
          onClick={() => onNavigateTab('brainrot')}
          className="bg-white border-2 border-purple-100 hover:border-purple-400 rounded-[28px] p-6 lg:p-8 min-h-[240px] transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(124,58,237,0.03)] group"
        >
          {/* Subtle ambient light mesh inside */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-purple-50/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 shadow-sm">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono bg-purple-100/60 text-purple-750 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                Live Predictions
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-serif text-zinc-950 italic font-light tracking-wide">Brainrot Arena</h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
                Vote on highly chaotic, ultimate Gen Z consensus and culture predictions. Align with the stream mind or get absolute npc ratios.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-100/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-600 font-extrabold">ENTER ARENA</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:bg-purple-600 transition-colors shadow-sm">
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card 2: GK Trivia Quiz */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2 } }}
          onClick={() => onNavigateTab('gk')}
          className="bg-white border-2 border-purple-100 hover:border-sky-400 rounded-[28px] p-6 lg:p-8 min-h-[240px] transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(124,58,237,0.03)] group"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-sky-50/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-600 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono bg-sky-100/60 text-sky-700 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                IQ Challenges
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-serif text-zinc-950 italic font-light tracking-wide">GK Trivia Quiz</h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
                Test your intelligence core across Programming, Cybersecurity, AI development, Astronomy, and Pop Culture. Ghost Mode double points!
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-100/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-600 font-extrabold">START QUIZ</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:bg-sky-600 transition-colors shadow-sm">
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Multiplayer Void */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2 } }}
          onClick={() => onNavigateTab('multiplayer')}
          className="bg-white border-2 border-purple-100 hover:border-fuchsia-400 rounded-[28px] p-6 lg:p-8 min-h-[240px] transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(124,58,237,0.03)] group"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-fuchsia-50/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-50 border border-fuchsia-200/60 flex items-center justify-center text-fuchsia-600 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono bg-fuchsia-100/60 text-fuchsia-700 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                Live Lobbies
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-serif text-zinc-950 italic font-light tracking-wide">Multiplayer Void</h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
                Connect with active players globally. Create private rooms, host head-to-head quiz lobbies, and engage with live simulated Gen Z.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-100/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-600 font-extrabold">JOIN THE VOID</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:bg-fuchsia-600 transition-colors shadow-sm">
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card 4: Ghost Shop & Cosmetics */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2 } }}
          onClick={() => onNavigateTab('shop')}
          className="bg-white border-2 border-purple-100 hover:border-amber-400 rounded-[28px] p-6 lg:p-8 min-h-[240px] transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(124,58,237,0.03)] group"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-50/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono bg-amber-100/60 text-amber-700 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                Gamer Cosmetics
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-serif text-zinc-950 italic font-light tracking-wide">Ghost Shop</h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
                Farm coins and exchange them for rare character skins, glowing neon borders, and funny custom title descriptors for your dossier profile.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-100/40">
            <div className="flex items-center gap-1.5 font-mono text-xs text-amber-650 font-bold">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{user.coins} COINS</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:bg-amber-600 transition-colors shadow-sm">
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card 5: Leaderboards */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2 } }}
          onClick={() => onNavigateTab('leaderboard')}
          className="bg-white border-2 border-purple-100 hover:border-emerald-400 rounded-[28px] p-6 lg:p-8 min-h-[240px] transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(124,58,237,0.03)] group"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-50/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono bg-emerald-100/60 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                Rankings
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-serif text-zinc-950 italic font-light tracking-wide">Elite Leaderboards</h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
                Inspect top players who hold maximum stats in Brainrot Consensus accuracy, GK score, and absolute speed metrics. Find your rank!
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-100/40">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-extrabold">VIEW LEADERBOARD</span>
            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-sm">
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card 6: My Dossier Profile */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2 } }}
          onClick={() => onNavigateTab('profile')}
          className="bg-white border-2 border-purple-100 hover:border-purple-400 rounded-[28px] p-6 lg:p-8 min-h-[240px] transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(124,58,237,0.03)] group"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-50/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shadow-sm">
                <User className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono bg-indigo-100/60 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                Historic dossier
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-serif text-zinc-950 italic font-light tracking-wide">My Ghost Dossier</h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
                Inspect your level statistics, daily mission trackers, game history charts, custom profile configuration, and prestigious achievements.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-100/40">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-extrabold">VIEW DOSSIER</span>
            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-sm">
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* Mini Mission Tracker Status at the bottom of Main Menu */}
      <div className="mt-14 text-center relative z-10 max-w-sm mx-auto">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-purple-200/65 rounded-full text-xs text-zinc-850 shadow-md">
          <Target className="w-4.5 h-4.5 text-purple-600 shrink-0" />
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
            {completedMissionsCount > 0 ? (
              <span className="text-purple-700 font-extrabold animate-pulse">
                ★ {completedMissionsCount} Reward Claimable!
              </span>
            ) : activeMissionsCount > 0 ? (
              <span>{activeMissionsCount} Daily Missions Active</span>
            ) : (
              <span>All Missions Completed!</span>
            )}
          </span>
          <button 
            onClick={() => onNavigateTab('profile')}
            className="text-[9px] font-mono bg-zinc-950 hover:bg-purple-600 text-white rounded-full px-3 py-1 uppercase ml-2 font-extrabold cursor-pointer transition-colors shadow-sm"
          >
            OPEN
          </button>
        </div>
      </div>

    </div>
  );
};
