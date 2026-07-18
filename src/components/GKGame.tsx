import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { GK_QUESTIONS } from '../data/questions';
import { GKQuestion } from '../types';
import { MascotGhost } from './MascotGhost';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Home, Award, Trophy, Coins, Flame, Zap, Ghost } from 'lucide-react';
import { playTimerTick, playCorrect, playIncorrect, playWin, playOptionClick } from '../utils/audio';

interface GKGameProps {
  onBackToDashboard: () => void;
}

export const GKGame: React.FC<GKGameProps> = ({ onBackToDashboard }) => {
  const { addMatchToHistory, addXpAndCoins, updateMissionProgress, triggerAchievement } = useGame();

  // State for setup vs playing
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'gameover'>('setup');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GKQuestion['difficulty']>('easy');
  const [ghostMode, setGhostMode] = useState(false); // Double points, half time!

  const [questions, setQuestions] = useState<GKQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [sessionScore, setSessionScore] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Time tracker ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nextQuestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSecondRef = useRef<number | null>(null);
  const timeLimit = ghostMode ? 7 : 15; // Ghost Mode cuts time limit in half!

  // Category list
  const categories = ['All', 'Programming', 'Technology', 'Science', 'Cybersecurity', 'History', 'AI', 'Business', 'Space', 'Movies', 'Mathematics', 'Geography', 'Gaming', 'Anime & Pop Culture', 'Music', 'Sports'];

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (nextQuestionTimeoutRef.current) clearTimeout(nextQuestionTimeoutRef.current);
    };
  }, []);

  // Filter and pick questions
  const handleStartGame = () => {
    let filtered = [...GK_QUESTIONS];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    filtered = filtered.filter(q => q.difficulty === selectedDifficulty);

    // If too few, fill with others of same difficulty
    if (filtered.length < 5) {
      const extra = GK_QUESTIONS.filter(q => q.difficulty === selectedDifficulty && q.category !== selectedCategory);
      filtered = [...filtered, ...extra];
    }

    // Load already seen GK questions
    let seenIds: string[] = [];
    try {
      const stored = localStorage.getItem('seen_gk_questions');
      if (stored) {
        seenIds = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    // Filter out already seen ones from the available pool
    let pool = filtered.filter(q => !seenIds.includes(q.id));

    // If we have fewer than 5 non-seen questions, clear those seen IDs from the filter set and reset
    if (pool.length < 5) {
      const filteredIds = filtered.map(q => q.id);
      seenIds = seenIds.filter(id => !filteredIds.includes(id));
      pool = [...filtered];
    }

    // Shuffle and pick 5
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    // Shuffle options of each selected question so that correct answers are randomized
    const shuffledSelected = selected.map(q => {
      const indexedOptions = q.options.map((opt, i) => ({ opt, originalIndex: i }));
      const shuffledIndexed = [...indexedOptions].sort(() => 0.5 - Math.random());
      const newOptions = shuffledIndexed.map(x => x.opt);
      const newCorrectAnswer = shuffledIndexed.findIndex(x => x.originalIndex === q.correctAnswer);
      return {
        ...q,
        options: newOptions,
        correctAnswer: newCorrectAnswer
      };
    });

    // Save back updated seen list
    const newSeenIds = [...seenIds, ...selected.map(q => q.id)];
    try {
      localStorage.setItem('seen_gk_questions', JSON.stringify(newSeenIds));
    } catch (e) {
      console.error(e);
    }

    setQuestions(shuffledSelected);
    setCurrentIndex(0);
    setSessionScore(0);
    setComboMultiplier(1);
    setMaxCombo(1);
    setCorrectAnswersCount(0);
    setSelectedOption(null);
    setTimeLeft(timeLimit);
    lastSecondRef.current = null;
    setGameState('playing');
  };

  // Timer logic
  useEffect(() => {
    if (gameState !== 'playing' || selectedOption !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.05) {
          // Time expired! Treated as wrong answer.
          handleSelectOption(-1);
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
  }, [gameState, selectedOption, currentIndex, ghostMode]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);

    if (idx !== -1) {
      playOptionClick();
    }

    setSelectedOption(idx);
    const q = questions[currentIndex];
    const isCorrect = idx === q.correctAnswer;

    if (isCorrect) {
      playCorrect();
      setCorrectAnswersCount(prev => prev + 1);

      // Track speed demon achievement: correct answer in under 1.5 seconds
      const timeSpent = timeLimit - timeLeft;
      if (timeSpent <= 1.5) {
        triggerAchievement('ach_speed_demon');
      }

      // Calculate scores
      let baseScore = 100;
      let speedBonus = Math.floor(timeLeft * (ghostMode ? 10 : 5)); // Higher reward for speed
      let difficultyBonus = 0;
      if (selectedDifficulty === 'medium') difficultyBonus = 20;
      if (selectedDifficulty === 'hard') difficultyBonus = 50;
      if (selectedDifficulty === 'expert') difficultyBonus = 100;

      let scoreForThis = (baseScore + speedBonus + difficultyBonus) * comboMultiplier;

      if (ghostMode) {
        scoreForThis *= 2; // Ghost Mode doubles all score points!
      }

      setSessionScore(prev => prev + scoreForThis);

      // Increase combo
      const nextCombo = comboMultiplier + 1;
      setComboMultiplier(nextCombo);
      if (nextCombo > maxCombo) {
        setMaxCombo(nextCombo);
      }

      // Achievement: Combo King
      if (nextCombo >= 5) {
        triggerAchievement('ach_combo_king');
        updateMissionProgress('streak', 1);
      }
    } else {
      playIncorrect();
      // Wrong answer resets combo
      setComboMultiplier(1);
    }

    // AUTO-SUBMIT: automatically transition to next question after 1.8s
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
      setTimeLeft(timeLimit);
    } else {
      // Game over
      setGameState('gameover');
      playWin();

      // Rewards
      const coinsEarned = Math.floor(sessionScore / 10);
      const xpEarned = Math.floor(sessionScore / 3);

      addXpAndCoins(xpEarned, coinsEarned);
      addMatchToHistory('GK Quiz', `Completed (${correctAnswersCount}/5)`, sessionScore, xpEarned, coinsEarned);

      // Check achievements
      if (correctAnswersCount >= 5) {
        triggerAchievement('ach_genius');
      }
      updateMissionProgress('correct_answers', correctAnswersCount);
    }
  };

  const currentQuestion = questions[currentIndex];

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
    <div className={`max-w-2xl mx-auto min-h-[500px] flex flex-col justify-between transition-all duration-500 rounded-[32px] px-4 md:px-0 ${
      ghostMode && gameState === 'playing' ? 'border border-rose-350/30' : ''
    }`}>
      <AnimatePresence mode="wait">
        {gameState === 'setup' ? (
          <motion.div
            key="setup-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 md:p-8 text-center space-y-3 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50/50 rounded-bl-full pointer-events-none -z-10" />
              <Award className="w-9 h-9 text-sky-600 mx-auto animate-pulse" />
              <h2 className="text-3xl font-serif text-zinc-950 italic font-light tracking-wide pt-2">Configure GK Quiz</h2>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-extrabold">Choose your category, difficulty, and risk tier</p>
            </div>

            {/* Selection Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category */}
              <div className="bg-white border border-purple-200/50 rounded-[28px] p-6 space-y-3.5 shadow-3xs">
                <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block font-extrabold">Category</label>
                <select
                  id="select-gk-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 bg-white border border-purple-150/80 rounded-full px-4 text-zinc-800 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-sky-500 font-bold cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-white text-zinc-850 font-bold">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="bg-white border border-purple-200/50 rounded-[28px] p-6 space-y-3.5 shadow-3xs">
                <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block font-extrabold">Difficulty</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['easy', 'medium', 'hard', 'expert'] as const).map(diff => (
                    <button
                      id={`btn-gk-diff-${diff}`}
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`h-11 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer font-extrabold border ${
                        selectedDifficulty === diff
                          ? 'bg-zinc-950 text-white border-zinc-900 shadow-sm'
                          : 'bg-purple-50/50 text-purple-700 border-purple-100 hover:bg-purple-100/50'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ghost Mode Toggle (Double or Nothing) */}
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-[28px] p-6 flex items-center justify-between gap-5 shadow-3xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-rose-600 uppercase font-black">
                  <Ghost className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>Ghost Mode Activator</span>
                </div>
                <p className="text-xs md:text-sm text-zinc-750 uppercase font-mono tracking-wider font-semibold leading-relaxed">
                  Cut timer in half, but earn <span className="text-rose-600 font-black underline">2X POINTS & MULTIPLIER VALUE</span> fr fr!
                </p>
              </div>

              {/* Toggle switch */}
              <button
                id="btn-gk-ghostmode-toggle"
                onClick={() => setGhostMode(!ghostMode)}
                className={`w-16 h-8 rounded-full p-1 transition-colors duration-300 flex items-center cursor-pointer shrink-0 border ${
                  ghostMode ? 'bg-rose-500 border-rose-400 justify-end shadow-xs' : 'bg-purple-150/40 border-purple-200/50 justify-start'
                }`}
              >
                <motion.div
                  layout
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Launch Action */}
            <button
              id="btn-gk-start"
              onClick={handleStartGame}
              className="w-full h-12 rounded-full bg-zinc-950 hover:bg-sky-600 text-white font-mono tracking-wider text-xs md:text-sm font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md"
            >
              <span>ENTER GK QUIZ CONFLICT ✦</span>
              <ArrowRight className="w-4 h-4 text-white stroke-[3]" />
            </button>
          </motion.div>
        ) : gameState === 'playing' ? (
          <motion.div
            key={`question-gk-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-white border border-purple-200/60 rounded-[36px] p-6 md:p-8 shadow-[0_16px_48px_rgba(124,58,237,0.04)] relative overflow-hidden space-y-6"
          >
            {/* Subtle category glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50/40 rounded-bl-full pointer-events-none -z-10" />

            {/* HUD with Circular Dial Timer and Retro Glowing Stats */}
            <div className={`flex items-center justify-between bg-purple-50/50 border border-purple-100 rounded-2xl px-5 py-3.5 text-xs font-mono relative z-10`}>
              <div className="flex items-center gap-2 text-sky-700 font-extrabold tracking-wider">
                <Award className="w-4 h-4 text-sky-600" />
                <span>{selectedCategory} // {selectedDifficulty}</span>
              </div>

              {/* Combo bubble */}
              {comboMultiplier > 1 && (
                <div className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-[9px] rounded-md animate-bounce shadow-3xs">
                  <Flame className="w-3 h-3 text-rose-500 fill-current animate-pulse" />
                  <span>{comboMultiplier}X COMBO!</span>
                </div>
              )}

              {/* Dial Timer */}
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
                      stroke={timeLeft <= 3 ? '#ec4899' : '#0ea5e9'}
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      animate={{ strokeDashoffset: (2 * Math.PI * 16) - (timeLeft / timeLimit) * (2 * Math.PI * 16) }}
                      transition={{ ease: 'linear', duration: 0.1 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`absolute text-[10px] font-mono font-bold ${timeLeft <= 3 ? 'text-rose-600 animate-pulse' : 'text-sky-700'}`}>
                    {Math.ceil(timeLeft)}s
                  </span>
                </div>

                <div className="text-zinc-500 font-bold text-right text-[10px] tracking-wider font-mono">
                  STAGE <span className="text-sky-700 font-black">{currentIndex + 1}</span> / 5
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-amber-600">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{sessionScore} PTS</span>
              </div>
            </div>

            {/* Question description card */}
            <motion.div
              animate={selectedOption === null && timeLeft <= 3
                ? {
                    x: [0, -3, 3, -3, 3, -3, 3, 0],
                    borderColor: '#ec4899',
                    boxShadow: '0 0 25px rgba(236,72,153,0.1)',
                  }
                : {
                    x: 0,
                    borderColor: '#e2e8f0',
                    boxShadow: 'none',
                  }
              }
              transition={selectedOption === null && timeLeft <= 3
                ? { repeat: Infinity, duration: 0.25 }
                : { duration: 0.2 }
              }
              className={`bg-sky-50/20 border border-sky-100 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xs group z-10`}
            >
              <div className="absolute -right-4 -bottom-4 opacity-15">
                <MascotGhost
                  skinId={ghostMode ? 'skin_fire' : 'skin_cyber'}
                  mood={selectedOption === null ? 'idle' : selectedOption === currentQuestion.correctAnswer ? 'cool' : 'sad'}
                  size={110}
                />
              </div>

              <div className="space-y-4 relative z-10 text-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-sky-700 font-extrabold bg-sky-50 border border-sky-200/60 px-3.5 py-1 rounded-full inline-block">
                  👾 INTEL CAT: {currentQuestion.category}
                </span>
                <h2 className="text-xl md:text-2xl font-serif text-zinc-950 italic font-light leading-relaxed tracking-wide">
                  "{currentQuestion.question}"
                </h2>
              </div>
            </motion.div>

            {/* Options list with premium stagger motion */}
            <motion.div
              variants={optionContainerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10"
            >
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectAns = idx === currentQuestion.correctAnswer;
                const showCorrect = selectedOption !== null && isCorrectAns;
                const showWrong = selectedOption !== null && isSelected && !isCorrectAns;
                const isUnselectedState = selectedOption === null;

                return (
                  <motion.button
                    variants={optionItemVariants}
                    id={`btn-gk-option-${idx}`}
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border relative overflow-hidden transition-[background-color,border-color,opacity,shadow] duration-300 font-mono text-xs md:text-sm group ${
                      isUnselectedState
                        ? 'bg-white border-purple-100 hover:border-sky-400 hover:bg-sky-50/10 text-zinc-750 font-bold shadow-2xs hover:shadow-sm cursor-pointer'
                        : showCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-850 font-black shadow-xs'
                        : showWrong
                        ? 'bg-rose-50 border-rose-400 text-rose-850 font-black shadow-xs'
                        : 'bg-zinc-50 border-zinc-100 text-zinc-400 opacity-50'
                    }`}
                  >
                    {/* Glowing highlight strip */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-all duration-300 ${
                      isUnselectedState
                        ? 'bg-sky-300/30 group-hover:bg-sky-500'
                        : showCorrect
                        ? 'bg-emerald-500'
                        : showWrong
                        ? 'bg-rose-500'
                        : 'bg-transparent'
                    }`} />

                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-xs md:text-sm font-bold leading-relaxed tracking-wide">{option}</span>
                      {selectedOption !== null && isCorrectAns && (
                        <span className="text-[10px] font-mono font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1 shrink-0">
                          ✓ CORRECT
                        </span>
                      )}
                      {selectedOption !== null && isSelected && !isCorrectAns && (
                        <span className="text-[10px] font-mono font-black uppercase text-rose-600 tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
                          ✗ ERROR
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
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-sky-600">
                  <span>Evaluating results core...</span>
                  <button
                    onClick={handleNextQuestion}
                    className="text-sky-700 hover:text-sky-500 font-extrabold cursor-pointer transition-colors"
                  >
                    NEXT WAVE ➔
                  </button>
                </div>
                <div className="w-full bg-sky-100/50 h-1.5 rounded-full overflow-hidden p-[1px]">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 1.8, ease: "linear" }}
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 shadow-xs"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="gameover-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-purple-200/60 rounded-[36px] p-8 md:p-10 text-center space-y-6 relative overflow-hidden shadow-md"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-100/20 rounded-full blur-3xl -z-10" />

            <div className="flex justify-center mb-2">
              <MascotGhost skinId={ghostMode ? 'skin_fire' : 'skin_cyber'} mood={correctAnswersCount >= 4 ? 'cool' : 'happy'} size={110} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-sky-600 font-extrabold bg-sky-50 border border-sky-200/50 px-3.5 py-1 rounded-full">
                SESSION CONCLUDED
              </span>
              <h2 className="text-3xl font-serif text-zinc-950 italic font-light tracking-wide pt-2">GK PERFORMANCE SUMMARY</h2>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider font-extrabold">
                {correctAnswersCount >= 4
                  ? 'ABSOLUTE GIGA BRAIN! Trivia demon fr fr!'
                  : 'You survived, but need some books in your life.'}
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl text-center shadow-3xs">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-extrabold">Final Score</span>
                <span className="text-sm font-extrabold text-purple-750 font-mono">{sessionScore}</span>
              </div>
              <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl text-center shadow-3xs">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-extrabold">Correct</span>
                <span className="text-sm font-extrabold text-sky-600 font-mono">{correctAnswersCount} / 5</span>
              </div>
              <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl text-center shadow-3xs">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1 font-mono font-extrabold">Max Combo</span>
                <span className="text-sm font-extrabold text-orange-600 font-mono">{maxCombo}x</span>
              </div>
            </div>

            {/* Rewards */}
            <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl flex items-center justify-around max-w-sm mx-auto font-mono text-xs uppercase tracking-wider font-extrabold shadow-3xs">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>+{Math.floor(sessionScore / 10)} Coins</span>
              </div>
              <div className="w-px h-6 bg-purple-200/50" />
              <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span>+{Math.floor(sessionScore / 3)} XP</span>
              </div>
            </div>

            {/* Bottom actions */}
            <button
              id="btn-gk-finish"
              onClick={onBackToDashboard}
              className="w-full h-11 rounded-full bg-zinc-950 hover:bg-sky-600 text-white font-mono tracking-wider text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all max-w-xs mx-auto shadow-sm"
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
