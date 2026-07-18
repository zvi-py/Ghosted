import React from 'react';
import { useGame } from '../context/GameContext';
import { Mission } from '../types';
import { motion } from 'motion/react';
import { Coins, Award, CheckCircle2, Circle } from 'lucide-react';

export const DailyMissions: React.FC = () => {
  const { missions, claimMissionReward } = useGame();

  return (
    <div className="bg-white border border-purple-200/40 rounded-[32px] p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-serif text-zinc-950 tracking-wider uppercase italic font-light">Daily Missions</h2>
          <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest font-bold">Complete tasks to farm Coins and XP</p>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs text-purple-700 font-mono uppercase tracking-wider font-bold">
          <Award className="w-4 h-4 text-purple-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Resets Daily</span>
        </div>
      </div>

      <div className="space-y-4">
        {missions.map((mission: Mission, index: number) => {
          const isCompleted = mission.progress >= mission.target;
          const percentage = Math.min(100, (mission.progress / mission.target) * 100);

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${
                mission.rewarded
                  ? 'bg-purple-50/20 border-purple-100/50 opacity-55'
                  : isCompleted
                  ? 'bg-purple-50/80 border-purple-300 shadow-[0_4px_12px_rgba(124,58,237,0.06)] font-bold'
                  : 'bg-white border-purple-100 hover:border-purple-350 hover:bg-purple-50/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    {mission.rewarded ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-200 shrink-0" />
                    )}
                    <h3 className={`text-sm md:text-base font-serif tracking-wider uppercase italic font-light ${mission.rewarded ? 'text-zinc-400 line-through' : 'text-zinc-950'}`}>
                      {mission.description}
                    </h3>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mb-1.5 uppercase tracking-widest font-bold">
                      <span>Progress</span>
                      <span>
                        {mission.progress} / {mission.target}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-purple-50 border border-purple-100 rounded-full overflow-hidden p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          mission.rewarded
                            ? 'bg-zinc-400'
                            : isCompleted
                            ? 'bg-gradient-to-r from-purple-400 to-purple-600'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Reward info or Claim Button */}
                <div className="shrink-0 text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-purple-100/40 pt-3 sm:pt-0">
                  <div className="flex flex-col gap-1 items-start sm:items-end font-mono text-xs uppercase tracking-widest">
                    <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>+{mission.coinsReward} Coins</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-purple-600 font-bold">
                      <Award className="w-3.5 h-3.5 text-purple-500" />
                      <span>+{mission.xpReward} XP</span>
                    </div>
                  </div>

                  {isCompleted && !mission.rewarded && (
                    <button
                      id={`btn-claim-${mission.id}`}
                      onClick={() => claimMissionReward(mission.id)}
                      className="px-5 py-2 bg-zinc-950 hover:bg-purple-600 text-white font-mono text-xs tracking-widest font-bold uppercase rounded-full cursor-pointer active:scale-95 transition-all shadow-[0_4px_12px_rgba(124,58,237,0.12)]"
                    >
                      CLAIM ✦
                    </button>
                  )}

                  {mission.rewarded && (
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest px-3 py-1 bg-purple-50 border border-purple-200/50 rounded-full">
                      Claimed
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
