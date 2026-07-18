import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { BRAINROT_QUESTIONS } from '../data/questions';
import { BrainrotQuestion } from '../types';
import { MascotGhost } from './MascotGhost';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Home, Brain, Trophy, Coins, Zap } from 'lucide-react';
import { playTimerTick, playCorrect, playIncorrect, playWin, playOptionClick } from '../utils/audio';

interface BrainrotGameProps {
  onBackToDashboard: () => void;
}

export const BrainrotGame: React.FC<BrainrotGameProps> = ({ onBackToDashboard }) => {
  const { addMatchToHistory, addXpAndCoins, updateMissionProgress, triggerAchievement } = useGame();

  // Pick 5 random questions for this session without repeating them
  const [questions] = useState<BrainrotQuestion[]>(() => {
    let seenIds: string[] = [];
    try {
      const stored = localStorage.getItem('seen_brainrot_questions');
      if (stored) {
        seenIds = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    let pool = BRAINROT_QUESTIONS.filter(q => !seenIds.includes(q.id));

    // If pool has fewer than 5 questions left, reset and use full pool
    if (pool.length < 5) {
      seenIds = [];
      pool = [...BRAINROT_QUESTIONS];
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const newSeenIds = [...seenIds, ...selected.map(q => q.id)];
    try {
      localStorage.setItem('seen_brainrot_questions', JSON.stringify(newSeenIds));
    } catch (e) {
      console.error(e);
    }

    // Shuffle options and matching originalPercent values so option positions are randomized
    const shuffledSelected = selected.map(q => {
      const indexed = q.options.map((opt, i) => ({ opt, percent: q.originalPercent[i] }));
      const shuffledIndexed = [...indexed].sort(() => 0.5 - Math.random());
      return {
        ...q,
        options: shuffledIndexed.map(x => x.opt),
        originalPercent: shuffledIndexed.map(x => x.percent)
      };
    });

    return shuffledSelected;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [mindReaderStreak, setMindReaderStreak] = useState(0);
  const [maxMindReaderStreak, setMaxMindReaderStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [majoritySelectedCount, setMajoritySelectedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);

  const currentQuestion = questions[currentIndex];
  const nextQuestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSecondRef = useRef<number | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (nextQuestionTimeoutRef.current) clearTimeout(nextQuestionTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isGameOver || selectedOption !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.05) {
          handleSelectOption(-1); // Time expired!
          return 0;
        }
        const nextVal = Number((prev - 0.05).toFixed(2));
        // Sound warning when timer is low (less than or equal to 3 seconds)
        const currentSec = Math.ceil(nextVal);
        if (currentSec <= 3 && currentSec > 0 && currentSec !== lastSecondRef.current) {
          lastSecondRef.current = currentSec;
          playTimerTick();
        }
        return nextVal;
      });
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, selectedOption, currentIndex]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(idx);

    if (idx !== -1) {
      playOptionClick();
    }

    if (idx === -1) {
      // Time expired! Reset streak
      setMindReaderStreak(0);
      playIncorrect();
      // AUTO-SUBMIT: automatically trigger next question after 1.8s
      if (nextQuestionTimeoutRef.current) {
        clearTimeout(nextQuestionTimeoutRef.current);
      }
      nextQuestionTimeoutRef.current = setTimeout(() => {
        handleNextQuestion();
      }, 1800);
      return;
    }

    // Calculate score based on choice popularity rank
    const percentages = currentQuestion.originalPercent;
    const chosenPercent = percentages[idx];

    // Find the rank of the chosen option
    const sortedPercentages = [...percentages].sort((a, b) => b - a);
    const majorityVal = sortedPercentages[0];
    const isMajority = chosenPercent === majorityVal;

    if (isMajority) {
      playCorrect();
    } else {
      playIncorrect();
    }

    let pointsGained = 10;
    if (chosenPercent === sortedPercentages[0]) {
      pointsGained = 100;
    } else if (chosenPercent === sortedPercentages[1]) {
      pointsGained = 70;
    } else if (chosenPercent === sortedPercentages[2]) {
      pointsGained = 40;
    }

    setSessionScore(prev => prev + pointsGained);

    // Track streaks
    if (isMajority) {
      setMajoritySelectedCount(prev => prev + 1);
      const newStreak = mindReaderStreak + 1;
      setMindReaderStreak(newStreak);
      if (newStreak > maxMindReaderStreak) {
        setMaxMindReaderStreak(newStreak);
      }
      if (newStreak >= 5) {
        triggerAchievement('ach_mind_reader');
      }
      updateMissionProgress('predict_majority', 1);
    } else {
      setMindReaderStreak(0);
    }

    // Check for lucky guess achievement (predicting very unpopular option)
    if (chosenPercent < 10) {
      triggerAchievement('ach_lucky_guess');
    }

    // AUTO-SUBMIT: automatically trigger next question after 1.8s
    if (nextQuestionTimeoutRef.current) {
      clearTimeout(nextQuestionTimeoutRef.current);
    }
    nextQuestionTimeoutRef.current = setTimeout(() => {
      handleNextQuestion();
    }, 1800);
  };

  const handleNextQuestion = () => {
    if (nextQuestionTimeoutRef.current) {
      clearTimeout(nextQuestionTimeoutRef.current);
    }
    setSelectedOption(null);
    lastSecondRef.current = null;
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(12);
    } else {
      // Game over! Calculate final rewards
      setIsGameOver(true);
      playWin();

      // Base: score / 10 = coins. Base score = xp.
      const coinsEarned = Math.floor(sessionScore / 8);
      const xpEarned = Math.floor(sessionScore / 2);

      addXpAndCoins(xpEarned, coinsEarned);
      addMatchToHistory('Brainrot', `Completed (${majoritySelectedCount}/5)`, sessionScore, xpEarned, coinsEarned);

      // Check achievement for majority count
      if (majoritySelectedCount >= 5) {
        triggerAchievement('ach_brainrot_master');
      }
    }
  };

  // Stagger animation definitions for option choices
  const optionContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const optionItemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.97 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 110, 
        damping: 14 
      } 
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-[500px] flex flex-col justify-between px-4 md:px-0">
      <AnimatePresence mode="wait">
        {!isGameOver ? (
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-white border border-purple-200/60 rounded-[36px] p-6 md:p-8 shadow-[0_16px_48px_rgba(124,58,237,0.04)] relative overflow-hidden space-y-6"
          >
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/30 rounded-bl-full pointer-events-none -z-10" />

            {/* HUD Status Bar with circular dial countdown */}
            <div className="flex items-center justify-between bg-purple-50/50 border border-purple-100 rounded-2xl px-5 py-3.5 text-xs font-mono relative z-10">
              <div className="flex items-center gap-2 text-purple-700 font-extrabold tracking-wider">
                <Brain className="w-4 h-4 shrink-0 text-purple-600" />
                <span>BRAINROT CONSENSUS</span>
              </div>

              {/* Smooth Dial Timer */}
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-11 h-11">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="22"
                      cy="22"
                      r="16"
                      className="stroke-purple-100/80"
                      strokeWidth="3.5"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="22"
                      cy="22"
                      r="16"
                      stroke={timeLeft <= 3 ? '#ec4899' : '#7c3aed'}
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      animate={{ strokeDashoffset: (2 * Math.PI * 16) - (timeLeft / 12) * (2 * Math.PI * 16) }}
                      transition={{ ease: 'linear', duration: 0.1 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`absolute text-[10px] font-mono font-bold ${timeLeft <= 3 ? 'text-rose-600 animate-pulse' : 'text-purple-700'}`}>
                    {Math.ceil(timeLeft)}s
                  </span>
                </div>

                <div className="text-zinc-500 font-bold text-right text-[10px] tracking-wider font-mono">
                  STAGE <span className="text-purple-700 font-black">{currentIndex + 1}</span> / {questions.length}
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-amber-600">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{sessionScore} PTS</span>
              </div>
            </div>

            {/* Streak Counter Overlay */}
            {mindReaderStreak > 0 && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-xs font-black uppercase tracking-wider w-max mx-auto shadow-xs relative z-10"
              >
                <Zap className="w-3.5 h-3.5 fill-current animate-bounce text-rose-500" />
                <span>{mindReaderStreak}X MIND READER STREAK!</span>
              </motion.div>
            )}

            {/* Main Question Card */}
            <motion.div
              animate={selectedOption === null && timeLeft <= 3
                ? {
                    x: [0, -3, 3, -3, 3, -3, 3, 0],
                    borderColor: '#ec4899',
                    boxShadow: '0 0 25px rgba(236,72,153,0.1)',
                  }
                : {
                    x: 0,
                    borderColor: '#e8ddfc',
                    boxShadow: 'none',
                  }
              }
              transition={selectedOption === null && timeLeft <= 3
                ? { repeat: Infinity, duration: 0.25 }
                : { duration: 0.2 }
              }
              className="bg-purple-50/20 border border-purple-100 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xs group z-10"
            >
              <div className="absolute -right-4 -bottom-4 opacity-15">
                <MascotGhost skinId="skin_purple" mood={selectedOption === null ? 'idle' : mindReaderStreak > 0 ? 'cool' : 'sad'} size={110} />
              </div>

              <div className="space-y-4 relative z-10 text-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-purple-700 font-extrabold bg-purple-50 border border-purple-200/60 px-3.5 py-1 rounded-full inline-block">
                  👾 TRENDING CAT: {currentQuestion.category}
                </span>
                <h2 className="text-xl md:text-2xl font-serif text-zinc-950 italic font-light leading-relaxed tracking-wide">
                  "{currentQuestion.question}"
                </h2>
              </div>
            </motion.div>

            {/* Prediction Options Grid with premium stagger motion */}
            <motion.div
              variants={optionContainerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10"
            >
              {currentQuestion.options.map((option, idx) => {
                const wasSelected = selectedOption === idx;
                const percentage = currentQuestion.originalPercent[idx];
                const isSelectedState = selectedOption !== null;

                // Find if this was the majority choice
                const sortedPercentages = [...currentQuestion.originalPercent].sort((a, b) => b - a);
                const isMajorityChoice = percentage === sortedPercentages[0];

                return (
                  <motion.button
                    variants={optionItemVariants}
                    id={`btn-brainrot-option-${idx}`}
                    key={idx}
                    disabled={isSelectedState}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border relative overflow-hidden transition-[background-color,border-color,opacity,shadow] duration-300 font-mono text-xs md:text-sm group ${
                      isSelectedState
                        ? wasSelected
                          ? isMajorityChoice
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-850 font-black shadow-xs'
                            : 'bg-purple-50 border-purple-400 text-purple-850 font-black shadow-xs'
                          : isMajorityChoice
                          ? 'bg-zinc-50 border-emerald-200 text-zinc-400 opacity-60'
                          : 'bg-zinc-50 border-zinc-100 text-zinc-400 opacity-40'
                        : 'bg-white border-purple-100 hover:border-purple-400 hover:bg-purple-50/10 text-zinc-750 font-bold shadow-2xs hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    {/* Background filler representing percentage results */}
                    {isSelectedState && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`absolute left-0 top-0 bottom-0 -z-10 ${
                          isMajorityChoice ? 'bg-emerald-500/10' : 'bg-purple-500/10'
                        }`}
                      />
                    )}

                    {/* Left visual strip accent */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-all duration-300 ${
                      !isSelectedState
                        ? 'bg-purple-300/30 group-hover:bg-purple-500'
                        : isMajorityChoice
                        ? 'bg-emerald-500'
                        : 'bg-purple-500'
                    }`} />

                    <div className="flex justify-between items-center relative z-10 gap-4">
                      <span className="text-xs md:text-sm leading-relaxed font-bold tracking-wide">{option}</span>
                      {isSelectedState && (
                        <span className={`text-sm font-black shrink-0 flex items-center gap-1.5 ${
                          isMajorityChoice ? 'text-emerald-600' : 'text-purple-600'
                        }`}>
                          {isMajorityChoice ? '👑 ' : '👾 '}{percentage}%
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Auto-transition status overlay */}
            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2 mt-4 relative z-10"
              >
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-purple-600">
                  <span>Syncing consensus stream...</span>
                  <button
                    onClick={handleNextQuestion}
                    className="text-purple-700 hover:text-purple-500 font-extrabold cursor-pointer transition-colors"
                  >
                    NEXT ROT ➔
                  </button>
                </div>
                <div className="w-full bg-purple-100/50 h-1.5 rounded-full overflow-hidden p-[1px]">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 1.8, ease: "linear" }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-xs"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="game-over"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-purple-200/60 rounded-[36px] p-8 md:p-10 text-center space-y-6 relative overflow-hidden shadow-md"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-100/20 rounded-full blur-3xl -z-10" />

            <div className="flex justify-center mb-2">
              <MascotGhost skinId="skin_purple" mood={majoritySelectedCount >= 4 ? 'cool' : 'happy'} size={110} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-600 font-extrabold bg-purple-50 border border-purple-200/50 px-3.5 py-1 rounded-full">
                MISSION COMPLETED
              </span>
              <h2 className="text-3xl font-serif text-zinc-950 italic font-light tracking-wide pt-2">CONVERSATIONAL SUMMARY</h2>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider font-extrabold">
                {majoritySelectedCount >= 4
                  ? 'GIGA BRAIN! You understand Gen Z perfectly!'
                  : 'NPC VIBES! Go scroll TikTok more, you got predicted.'}
              </p>
            </div>

            {/* Score stats grid */}
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl text-center shadow-3xs">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-extrabold">Score</span>
                <span className="text-sm font-extrabold text-purple-750 font-mono">{sessionScore}</span>
              </div>
              <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl text-center shadow-3xs">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-extrabold">Majority</span>
                <span className="text-sm font-extrabold text-emerald-600 font-mono">{majoritySelectedCount} / 5</span>
              </div>
              <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl text-center shadow-3xs">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-extrabold">Max Streak</span>
                <span className="text-sm font-extrabold text-purple-750 font-mono">{maxMindReaderStreak}</span>
              </div>
            </div>

            {/* Coin and XP Reward summary banner */}
            <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl flex items-center justify-around max-w-sm mx-auto font-mono text-xs uppercase tracking-wider font-extrabold shadow-3xs">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>+{Math.floor(sessionScore / 8)} Coins</span>
              </div>
              <div className="w-px h-6 bg-purple-200/50" />
              <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span>+{Math.floor(sessionScore / 2)} XP</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <button
              id="btn-brainrot-finish"
              onClick={onBackToDashboard}
              className="w-full h-11 rounded-full bg-zinc-950 hover:bg-purple-600 text-white font-mono tracking-wider text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all max-w-xs mx-auto shadow-sm"
            >
              <Home className="w-4 h-4 text-white" />
              Return to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
