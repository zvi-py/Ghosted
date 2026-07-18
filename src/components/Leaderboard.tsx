import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'motion/react';
import { Trophy, Award, Flame, Brain, Users, Medal, Crown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  title: string;
  score: number;
  isSelf?: boolean;
}

const MOCK_BRAINROT_RANKINGS: LeaderboardEntry[] = [
  { rank: 1, username: 'SkibidiSavant', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=savant', title: 'Brainrot Overlord 🧠', score: 2450 },
  { rank: 2, username: 'GigaRizzler', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=rizzler', title: 'GIGA CHAD 🗿', score: 2180 },
  { rank: 3, username: 'DelusionalQueen', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=queen', title: 'Delusional 🔮', score: 1950 },
  { rank: 4, username: 'SigmaGrindset', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sigma', title: 'Main Character', score: 1720 },
  { rank: 5, username: 'KaiCenatEnjoyer', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=kai', title: 'Unranked NPC', score: 1480 },
  { rank: 6, username: 'W_Rizz_Phantom', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=wrizz', title: 'Unranked NPC', score: 1210 }
];

const MOCK_GK_RANKINGS: LeaderboardEntry[] = [
  { rank: 1, username: 'CyberSecurityPro', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=cyber', title: '✦ THE PHANTOM 👻', score: 2890 },
  { rank: 2, username: 'NewtonEinstein', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=newton', title: 'GIGA CHAD 🗿', score: 2540 },
  { rank: 3, username: 'BabbageAda', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ada', title: 'GIGA CHAD 🗿', score: 2210 },
  { rank: 4, username: 'MatrixNeo', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=neo', title: 'Main Character', score: 1920 },
  { rank: 5, username: 'GraceHopperCoding', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=hopper', title: 'Unranked NPC', score: 1640 },
  { rank: 6, username: 'LeetCodeGrinder', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=leetcode', title: 'Unranked NPC', score: 1390 }
];

const MOCK_XP_RANKINGS: LeaderboardEntry[] = [
  { rank: 1, username: 'GhostElite99', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=elite99', title: '✦ THE PHANTOM 👻', score: 14500 },
  { rank: 2, username: 'TriviaDemon', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demon', title: 'GIGA CHAD 🗿', score: 11200 },
  { rank: 3, username: 'SpeedDemonXP', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=speed', title: 'Main Character', score: 9800 },
  { rank: 4, username: 'MidwitGamer', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=midwit', title: 'Unranked NPC', score: 7500 },
  { rank: 5, username: 'PhantomFiddler', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=fiddle', title: 'Unranked NPC', score: 5400 },
  { rank: 6, username: 'NPC_392', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=npc392', title: 'Unranked NPC', score: 3200 }
];

export const Leaderboard: React.FC = () => {
  const { user } = useGame();
  const [activeLeaderboard, setActiveLeaderboard] = useState<'brainrot' | 'gk' | 'xp'>('brainrot');

  if (!user) return null;

  // Function to insert current user into mock list dynamically
  const getRankings = () => {
    let mockList: LeaderboardEntry[] = [];
    let userScore = 1000;
    let label = 'Rating';

    if (activeLeaderboard === 'brainrot') {
      mockList = [...MOCK_BRAINROT_RANKINGS];
      userScore = user.brainrotRating;
      label = 'Rating';
    } else if (activeLeaderboard === 'gk') {
      mockList = [...MOCK_GK_RANKINGS];
      userScore = user.gkRating;
      label = 'Rating';
    } else {
      mockList = [...MOCK_XP_RANKINGS];
      userScore = (user.level - 1) * 500 + user.xp;
      label = 'Total XP';
    }

    const selfEntry: LeaderboardEntry = {
      rank: 99,
      username: `${user.username} (You)`,
      avatar: user.avatar,
      title: user.equippedTitle === 'title_newbie' ? 'Unranked NPC' : 'Main Character',
      score: userScore,
      isSelf: true
    };

    const combinedList = [...mockList, selfEntry].sort((a, b) => b.score - a.score);

    return combinedList.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  };

  const currentRankings = getRankings();
  const topThree = currentRankings.slice(0, 3);
  const remaining = currentRankings.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-300 fill-amber-300" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-zinc-300 fill-zinc-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600 fill-amber-600" />;
    return <span className="text-zinc-500 font-mono text-xs">{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
      
      {/* Header */}
      <div className="text-center space-y-3 py-4">
        <h1 className="text-3xl font-serif text-zinc-950 tracking-wider uppercase flex items-center justify-center gap-3 font-light">
          <Trophy className="w-7 h-7 text-amber-500 animate-pulse" />
          <span className="italic">Leaderboards</span>
        </h1>
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider font-extrabold">
          Climb the ranks, secure the badges, and flex your scores fr fr
        </p>
      </div>

      {/* Mode selectors */}
      <div className="flex bg-purple-50/50 p-1.5 border border-purple-200/50 rounded-full max-w-lg mx-auto shadow-3xs">
        <button
          id="btn-leaderboard-brainrot"
          onClick={() => setActiveLeaderboard('brainrot')}
          className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 font-black ${
            activeLeaderboard === 'brainrot'
              ? 'bg-zinc-950 text-white shadow-sm'
              : 'text-zinc-500 hover:text-purple-700'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          Brainrot
        </button>
        <button
          id="btn-leaderboard-gk"
          onClick={() => setActiveLeaderboard('gk')}
          className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 font-black ${
            activeLeaderboard === 'gk'
              ? 'bg-zinc-950 text-white shadow-sm'
              : 'text-zinc-500 hover:text-purple-700'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          GK Quiz
        </button>
        <button
          id="btn-leaderboard-xp"
          onClick={() => setActiveLeaderboard('xp')}
          className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 font-black ${
            activeLeaderboard === 'xp'
              ? 'bg-zinc-950 text-white shadow-sm'
              : 'text-zinc-500 hover:text-purple-700'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Global XP
        </button>
      </div>

      {/* Top 3 Podium (Aesthetic editorial / luxury vibe) */}
      <div className="grid grid-cols-3 gap-5 max-w-2xl mx-auto pt-8 items-end">
        
        {/* Second Place (Podium Left) */}
        {topThree[1] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex flex-col items-center bg-white border rounded-t-[32px] p-5 text-center shadow-3xs ${
              topThree[1].isSelf ? 'border-purple-300 shadow-[0_4px_20px_rgba(168,85,247,0.05)]' : 'border-purple-100'
            }`}
          >
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border border-purple-100 overflow-hidden bg-purple-50/50 flex items-center justify-center p-1 shadow-inner">
                <img src={topThree[1].avatar} alt={topThree[1].username} className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Medal className="w-6 h-6 text-zinc-300 fill-zinc-300 drop-shadow-xs" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-50 text-purple-700 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-100 shadow-xs">
                #2
              </div>
            </div>
            <h3 className="text-xs font-mono uppercase text-zinc-800 truncate w-full font-black">{topThree[1].username}</h3>
            <span className="text-[10px] text-zinc-500 uppercase font-mono block mt-1 tracking-wider truncate w-full font-bold">
              {topThree[1].title}
            </span>
            <span className="text-base font-mono font-black text-purple-700 mt-2.5">{topThree[1].score}</span>
          </motion.div>
        )}

        {/* First Place (Podium Middle) */}
        {topThree[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center bg-white border rounded-t-[40px] p-6 text-center shadow-xs relative ${
              topThree[0].isSelf ? 'border-purple-300' : 'border-purple-200/50'
            }`}
          >
            {/* Crown shine flare */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-500 animate-pulse rounded-t-full" />

            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-full border-2 border-amber-400 overflow-hidden bg-purple-50/50 flex items-center justify-center p-1 shadow-xs">
                <img src={topThree[0].avatar} alt={topThree[0].username} className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 drop-shadow-[0_4px_12px_rgba(245,158,11,0.2)]">
                <Crown className="w-7 h-7 text-amber-500 fill-amber-500 animate-bounce" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-zinc-950 font-mono text-[10px] font-black px-3 py-0.5 rounded-full shadow-xs border border-amber-500">
                👑 #1
              </div>
            </div>
            <h3 className="text-sm md:text-base font-serif italic text-amber-600 truncate w-full font-black">{topThree[0].username}</h3>
            <span className="text-[10px] text-amber-700 uppercase font-mono block mt-1 tracking-wider truncate w-full font-black">
              {topThree[0].title}
            </span>
            <span className="text-lg font-mono font-black text-amber-600 mt-2.5">{topThree[0].score}</span>
          </motion.div>
        )}

        {/* Third Place (Podium Right) */}
        {topThree[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`flex flex-col items-center bg-white border rounded-t-[32px] p-5 text-center shadow-3xs ${
              topThree[2].isSelf ? 'border-purple-300 shadow-[0_4px_20px_rgba(168,85,247,0.05)]' : 'border-purple-100'
            }`}
          >
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border border-purple-100 overflow-hidden bg-purple-50/50 flex items-center justify-center p-1 shadow-inner">
                <img src={topThree[2].avatar} alt={topThree[2].username} className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Medal className="w-6 h-6 text-amber-700 fill-amber-700 drop-shadow-xs" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-50 text-purple-700 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-100 shadow-xs">
                #3
              </div>
            </div>
            <h3 className="text-xs font-mono uppercase text-zinc-800 truncate w-full font-black">{topThree[2].username}</h3>
            <span className="text-[10px] text-zinc-500 uppercase font-mono block mt-1 tracking-wider truncate w-full font-bold">
              {topThree[2].title}
            </span>
            <span className="text-base font-mono font-black text-purple-700 mt-2.5">{topThree[2].score}</span>
          </motion.div>
        )}
      </div>

      {/* Main rankings list */}
      <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 space-y-4 max-w-2xl mx-auto shadow-3xs">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-black uppercase tracking-wider px-4 py-2 border-b border-purple-100 font-mono">
          <div className="flex items-center gap-10">
            <span>Rank</span>
            <span>Player</span>
          </div>
          <span className="text-right">{activeLeaderboard === 'xp' ? 'Total XP' : 'Rating'}</span>
        </div>

        <div className="space-y-3">
          {remaining.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 ${
                entry.isSelf
                  ? 'bg-purple-50 border-2 border-purple-300 shadow-[0_4px_12px_rgba(124,58,237,0.05)]'
                  : 'bg-white border border-purple-100 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className="w-6 text-center">{getRankBadge(entry.rank)}</div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50/50 border border-purple-100 p-0.5 overflow-hidden">
                    <img src={entry.avatar} alt={entry.username} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-mono uppercase font-black ${entry.isSelf ? 'text-purple-700' : 'text-zinc-800'}`}>
                        {entry.username}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider block mt-0.5 font-bold">
                      {entry.title}
                    </span>
                  </div>
                </div>
              </div>

              <span className={`font-mono text-sm md:text-base font-black ${entry.isSelf ? 'text-purple-700' : 'text-zinc-700'}`}>
                {entry.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
