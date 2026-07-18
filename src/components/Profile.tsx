import React from 'react';
import { useGame } from '../context/GameContext';
import { COSMETIC_ITEMS } from '../data/cosmetics';
import { MascotGhost } from './MascotGhost';
import { motion } from 'motion/react';
import {
  Award,
  Coins,
  Gamepad2,
  TrendingUp,
  History,
  Trophy,
  Calendar,
  Zap,
  Activity,
  User,
  Star
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const Profile: React.FC = () => {
  const { user, matchHistory, achievements, unlockedAchievements } = useGame();

  if (!user) return null;

  // Find cosmetic item designs
  const equippedTitleItem = COSMETIC_ITEMS.find(c => c.id === user.equippedTitle);
  const equippedFrameItem = COSMETIC_ITEMS.find(c => c.id === user.equippedFrame);

  // Calculate XP ratio
  const nextLevelXp = user.level * 500;
  const xpPercent = Math.min(100, (user.xp / nextLevelXp) * 100);

  // Map match history for activity chart
  const chartData = [...matchHistory]
    .reverse()
    .map((match, idx) => ({
      name: `M${idx + 1}`,
      score: match.score,
      xp: match.xpEarned
    }));

  // Fallback if no history yet
  const dummyChartData = [
    { name: 'Start', score: 0, xp: 0 },
    { name: 'P1', score: 200, xp: 100 },
    { name: 'P2', score: 450, xp: 220 },
    { name: 'P3', score: 300, xp: 150 },
    { name: 'P4', score: 700, xp: 350 },
    { name: 'P5', score: 850, xp: 420 }
  ];

  const actualChartData = chartData.length > 0 ? chartData : dummyChartData;

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-zinc-900 text-zinc-400 border-zinc-800';
      case 'rare': return 'bg-sky-50 text-sky-600 border-sky-200';
      case 'epic': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'legendary': return 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200';
      default: return 'bg-zinc-900 text-zinc-400 border-zinc-800';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'hover:shadow-xs';
      case 'rare': return 'hover:shadow-md hover:border-sky-300';
      case 'epic': return 'hover:shadow-md hover:border-purple-300';
      case 'legendary': return 'hover:shadow-lg hover:border-fuchsia-300 animate-pulse';
      default: return '';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 md:px-0">
      
      {/* Upper Bento: Profile Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* User Stats Card */}
        <div className="md:col-span-2 bg-white border border-purple-200/50 rounded-[32px] p-6 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-3xs">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar block with equipped frame */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center bg-purple-50/50 p-2.5 transition-all duration-300 border-2 ${
                  equippedFrameItem ? equippedFrameItem.value : 'border-purple-300'
                } shadow-sm`}
              >
                <MascotGhost skinId={user.equippedSkin} mood="cool" size={74} />
              </div>
              <div className="absolute -bottom-2 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs font-black px-4 py-1 rounded-full shadow-sm">
                LVL {user.level}
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1 space-y-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-3xl font-serif text-zinc-950 italic tracking-wide font-light">{user.username}</h1>
                <span className="px-3.5 py-1 text-[10px] font-mono tracking-wider uppercase bg-purple-50 border border-purple-200/50 text-purple-700 rounded-full font-black shadow-3xs">
                  {equippedTitleItem ? equippedTitleItem.value : 'NPC'}
                </span>
              </div>

              {/* XP progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-400 font-mono font-bold">
                  <span>XP PROGRESS</span>
                  <span className="text-purple-700 font-black">
                    {user.xp} / {nextLevelXp}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-purple-50 rounded-full overflow-hidden p-[2px] border border-purple-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-sky-500"
                  />
                </div>
              </div>

              {/* Balances */}
              <div className="flex justify-center sm:justify-start gap-6 pt-1">
                <div className="flex items-center gap-1.5 text-sm text-amber-650 font-black font-mono uppercase">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>{user.coins} Coins</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-purple-700 font-black font-mono uppercase">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>{unlockedAchievements.length} Badges</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-8 border-t border-purple-100">
            <div className="text-center p-4 bg-purple-50/30 border border-purple-100 rounded-2xl shadow-3xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-bold">Rating (Brainrot)</span>
              <span className="text-lg font-mono font-black text-purple-700 tracking-wide">⚡ {user.brainrotRating}</span>
            </div>
            <div className="text-center p-4 bg-purple-50/30 border border-purple-100 rounded-2xl shadow-3xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-bold">Rating (GK)</span>
              <span className="text-lg font-mono font-black text-sky-650 tracking-wide">🎓 {user.gkRating}</span>
            </div>
            <div className="text-center p-4 bg-purple-50/30 border border-purple-100 rounded-2xl shadow-3xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-bold">Games Played</span>
              <span className="text-lg font-mono font-black text-zinc-800 tracking-wide">{user.gamesPlayed}</span>
            </div>
            <div className="text-center p-4 bg-purple-50/30 border border-purple-100 rounded-2xl shadow-3xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-bold">Win Rate</span>
              <span className="text-lg font-mono font-black text-emerald-700 tracking-wide">{user.winRate || 0}%</span>
            </div>
          </div>
        </div>

        {/* Small bento: Daily Streak */}
        <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden text-center shadow-3xs">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl -z-10 animate-pulse" />

          <div className="space-y-3">
            <span className="text-xs md:text-sm text-zinc-500 font-black uppercase tracking-wider block font-mono">STREAK MULTIPLIER</span>
            <div className="text-5xl font-mono font-black text-orange-600 tracking-tighter">
              🔥 {user.dailyStreak}
            </div>
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider font-extrabold">Days active in a row</p>
          </div>

          <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-4 text-xs md:text-sm font-mono uppercase tracking-wide text-orange-800 mt-6 leading-normal font-bold shadow-3xs">
            Streak yields a <span className="font-black text-orange-900 underline">+{user.dailyStreak * 10}% COINS & XP</span> multiplier on all sessions!
          </div>
        </div>
      </div>

      {/* Activity Graph Section */}
      <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 md:p-8 shadow-3xs">
        <div className="flex items-center gap-2.5 mb-5">
          <Activity className="w-5 h-5 text-purple-600 animate-pulse" />
          <h2 className="text-xs md:text-sm font-mono tracking-wider text-zinc-500 uppercase font-bold">Activity Graph</h2>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={actualChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="xpColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#8b5cf6" fontSize={11} tickLine={false} />
              <YAxis stroke="#8b5cf6" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e9d5ff', borderRadius: '16px' }}
                labelStyle={{ color: '#6b21a8', fontWeight: 'bold', fontSize: '11px', fontFamily: 'monospace' }}
                itemStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#3f3f46' }}
              />
              <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" name="Game Score" />
              <Area type="monotone" dataKey="xp" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#xpColor)" name="XP Earned" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Match History & Achievements Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Achievements / Badges Grid */}
        <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 shadow-3xs flex flex-col">
          <div className="flex items-center justify-between mb-5 border-b border-purple-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-xs md:text-sm font-mono tracking-wider text-zinc-500 uppercase font-bold">Achievements</h2>
            </div>
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider font-black">
              {unlockedAchievements.length} / {achievements.length} UNLOCKED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
            {achievements.map((ach) => {
              const isUnlocked = unlockedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border flex gap-3 transition-all duration-300 relative ${
                    isUnlocked
                      ? `bg-white border-purple-200/60 ${getRarityGlow(ach.rarity)}`
                      : 'bg-purple-50/10 border-purple-100/30 opacity-40'
                  }`}
                >
                  <div className="shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                        isUnlocked
                          ? ach.rarity === 'legendary'
                            ? 'bg-amber-50 border-amber-200 text-amber-600'
                            : ach.rarity === 'epic'
                            ? 'bg-purple-50 border-purple-200/80 text-purple-600'
                            : ach.rarity === 'rare'
                            ? 'bg-sky-50 border-sky-200 text-sky-600'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                          : 'bg-zinc-100/50 border-zinc-200/30 text-zinc-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isUnlocked ? 'fill-current animate-pulse' : ''}`} />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-mono uppercase text-zinc-800 font-extrabold truncate">{ach.title}</span>
                      <span className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded-full border uppercase font-black ${getRarityBadgeColor(ach.rarity)}`}>
                        {ach.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-bold">{ach.description}</p>
                    {isUnlocked && (
                      <span className="text-[11px] font-mono font-black text-amber-600 block pt-0.5 uppercase tracking-wider">
                        +{ach.coinsReward} Coins / +{ach.xpReward} XP
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Match History */}
        <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 flex flex-col shadow-3xs">
          <div>
            <div className="flex items-center gap-2.5 mb-5 border-b border-purple-100 pb-3">
              <History className="w-5 h-5 text-sky-600" />
              <h2 className="text-xs md:text-sm font-mono tracking-wider text-zinc-500 uppercase font-bold">Match History</h2>
            </div>

            {matchHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
                <Gamepad2 className="w-10 h-10 mb-3 text-zinc-300 animate-pulse" />
                <p className="text-sm font-mono uppercase tracking-wider font-bold">No matches registered yet.</p>
                <p className="text-xs text-zinc-400 mt-1.5 font-mono uppercase tracking-wider font-medium">Jump into Brainrot or GK to log stats!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {matchHistory.map((match) => (
                  <div
                    key={match.id}
                    className="p-3.5 bg-white border border-purple-100 hover:border-purple-300 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 shadow-3xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm font-extrabold border ${
                          match.mode === 'Brainrot'
                            ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200'
                            : match.mode === 'GK Quiz'
                            ? 'bg-sky-50 text-sky-600 border-sky-200'
                            : 'bg-purple-50 text-purple-600 border-purple-200'
                        }`}
                      >
                        {match.mode[0]}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs md:text-sm font-mono uppercase text-zinc-800 font-extrabold">{match.mode}</span>
                          <span className="text-[10px] text-zinc-400 flex items-center gap-0.5 font-mono uppercase font-semibold">
                            <Calendar className="w-3 h-3" />
                            {match.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono uppercase font-semibold">
                          <span>Result: <span className="font-extrabold text-zinc-700">{match.result}</span></span>
                          <span>•</span>
                          <span>Score: <span className="font-extrabold text-zinc-700">{match.score}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                      <div className="text-xs md:text-sm text-amber-600 font-black font-mono flex items-center gap-0.5">
                        <span>+{match.coinsEarned}</span>
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <div className="text-xs md:text-sm text-purple-700 font-black font-mono flex items-center gap-0.5">
                        <span>+{match.xpEarned} XP</span>
                        <Award className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
