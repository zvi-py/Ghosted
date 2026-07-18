import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { GK_QUESTIONS } from '../data/questions';
import { GKQuestion } from '../types';
import { MascotGhost } from './MascotGhost';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ShieldAlert, ArrowRight, Zap, Trophy, MessageSquare, Flame, Send, Sparkles, Coins, Gamepad2, Play, Home } from 'lucide-react';

interface MultiplayerLobbyProps {
  onBackToDashboard: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isSelf?: boolean;
}

interface PlayerScore {
  username: string;
  avatar: string;
  score: number;
  hasAnswered: boolean;
  lastChoice?: string;
  isSelf?: boolean;
}

const GEN_Z_CHATS = [
  "fr fr this is tough",
  "no cap I guessed that",
  "bruh who designed this question?",
  "gg, y'all are cooked",
  "this quiz has infinite rizz",
  "skibidi trivia goes crazy",
  "let him cook!",
  "i manifested this win",
  "no way u chose that lmao",
  "such npc behavior from RizzlerGhost",
  "W answers only",
  "LMAO absolute delusional behavior",
  "wait, actually?",
  "ez points"
];

const BOT_PLAYERS = [
  { username: 'RizzMaster69', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=rizz' },
  { username: 'SkibidiQueen', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=queen' },
  { username: 'SigmaSpectre', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sigma' },
  { username: 'DepopSlayer', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=depop' },
  { username: 'IcedLatteNPC', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=npc' }
];

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onBackToDashboard }) => {
  const { user, addMatchToHistory, addXpAndCoins, triggerAchievement } = useGame();

  const [stage, setStage] = useState<'options' | 'matching' | 'lobby' | 'playing' | 'gameover'>('options');
  const [matchCode, setMatchCode] = useState('');
  const [matchingProgress, setMatchingProgress] = useState(0);

  // Active lobby states
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState<PlayerScore[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Playing states
  const [questions, setQuestions] = useState<GKQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(12);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!user) return null;

  // Trigger simulated matchmaking
  const handleStartMatchmaking = () => {
    setStage('matching');
    setMatchingProgress(0);

    const interval = setInterval(() => {
      setMatchingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Set up live players
          const shuffledBots = [...BOT_PLAYERS].sort(() => 0.5 - Math.random()).slice(0, 3);
          const lobbyPlayers: PlayerScore[] = [
            { username: `${user.username} (You)`, avatar: user.avatar, score: 0, hasAnswered: false, isSelf: true },
            ...shuffledBots.map(bot => ({ username: bot.username, avatar: bot.avatar, score: 0, hasAnswered: false }))
          ];
          setPlayers(lobbyPlayers);
          setRoomCode(`RM-${Math.floor(100000 + Math.random() * 900000)}`);
          setChats([
            { id: '1', sender: 'System', text: 'Match connected! Say hi in the live Gen Z chat room!' }
          ]);
          setStage('lobby');
          return 100;
        }
        return prev + 12;
      });
    }, 400);
  };

  // Bot chat simulator
  useEffect(() => {
    if (stage !== 'lobby' && stage !== 'playing') return;

    const chatInterval = setInterval(() => {
      if (players.length <= 1) return;
      const randomBot = players.filter(p => !p.isSelf)[Math.floor(Math.random() * (players.length - 1))];
      const randomText = GEN_Z_CHATS[Math.floor(Math.random() * GEN_Z_CHATS.length)];

      setChats(prev => [
        ...prev,
        { id: Math.random().toString(), sender: randomBot.username, text: randomText }
      ].slice(-15)); // keep last 15
    }, 6000);

    return () => clearInterval(chatInterval);
  }, [stage, players]);

  // Host Private Room directly
  const handleHostPrivate = () => {
    const shuffledBots = [...BOT_PLAYERS].sort(() => 0.5 - Math.random()).slice(0, 2);
    const lobbyPlayers: PlayerScore[] = [
      { username: `${user.username} (You)`, avatar: user.avatar, score: 0, hasAnswered: false, isSelf: true },
      ...shuffledBots.map(bot => ({ username: bot.username, avatar: bot.avatar, score: 0, hasAnswered: false }))
    ];
    setPlayers(lobbyPlayers);
    setRoomCode(`PV-${Math.floor(100000 + Math.random() * 900000)}`);
    setChats([
      { id: '1', sender: 'System', text: 'Private room created. Send this room code to your friends or play with local bots!' }
    ]);
    setStage('lobby');
  };

  const handleJoinPrivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchCode.trim()) return;
    setStage('matching');
    setMatchingProgress(30);
    setTimeout(() => {
      const shuffledBots = [...BOT_PLAYERS].sort(() => 0.5 - Math.random()).slice(0, 3);
      const lobbyPlayers: PlayerScore[] = [
        { username: `${user.username} (You)`, avatar: user.avatar, score: 0, hasAnswered: false, isSelf: true },
        ...shuffledBots.map(bot => ({ username: bot.username, avatar: bot.avatar, score: 0, hasAnswered: false }))
      ];
      setPlayers(lobbyPlayers);
      setRoomCode(matchCode.toUpperCase());
      setChats([
        { id: '1', sender: 'System', text: `Successfully joined lobby ${matchCode.toUpperCase()}!` }
      ]);
      setStage('lobby');
    }, 1200);
  };

  // Launch live multiplayer quiz conflict
  const handleLaunchMultiplayerGame = () => {
    // Pick 5 random GK Questions of mixed difficulties without repeating them
    let seenIds: string[] = [];
    try {
      const stored = localStorage.getItem('seen_gk_questions');
      if (stored) {
        seenIds = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    let pool = GK_QUESTIONS.filter(q => !seenIds.includes(q.id));

    // If pool has fewer than 5 questions left, reset and use full pool
    if (pool.length < 5) {
      seenIds = [];
      pool = [...GK_QUESTIONS];
    }

    const shuffledGK = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffledGK.slice(0, 5);

    const newSeenIds = [...seenIds, ...selected.map(q => q.id)];
    try {
      localStorage.setItem('seen_gk_questions', JSON.stringify(newSeenIds));
    } catch (e) {
      console.error(e);
    }

    setQuestions(selected);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setTimeLeft(12);
    setStage('playing');
  };

  // Gameplay Timer and Bot responses
  useEffect(() => {
    if (stage !== 'playing' || selectedOption !== null) return;

    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.05) {
          handleSelectOption(-1);
          return 0;
        }
        return Number((prev - 0.05).toFixed(2));
      });
    }, 50);

    // Bot decision simulation: bots answer randomly between 2s and 8s
    const botDecisionTimers = players.filter(p => !p.isSelf).map(bot => {
      const delay = 2000 + Math.random() * 6000;
      return setTimeout(() => {
        setPlayers(prevPlayers =>
          prevPlayers.map(p => {
            if (p.username === bot.username) {
              const q = questions[currentQIndex];
              const isCorrect = Math.random() > 0.35; // bots have 65% accuracy
              const choiceIndex = isCorrect ? q.correctAnswer : (q.correctAnswer + 1) % 4;
              const pts = isCorrect ? Math.floor(100 + Math.random() * 80) : 0;
              return { ...p, hasAnswered: true, score: p.score + pts };
            }
            return p;
          })
        );
      }, delay);
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      botDecisionTimers.forEach(t => clearTimeout(t));
    };
  }, [stage, currentQIndex, selectedOption, questions]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    const q = questions[currentQIndex];
    const isCorrect = idx === q.correctAnswer;
    let earned = 0;

    if (isCorrect) {
      earned = Math.floor(100 + timeLeft * 10); // faster answers earn more!
    }

    // Update self score
    setPlayers(prev =>
      prev.map(p => {
        if (p.isSelf) {
          return { ...p, hasAnswered: true, score: p.score + earned };
        }
        return p;
      })
    );
  };

  const handleNextQ = () => {
    setSelectedOption(null);
    // Reset answered indicator
    setPlayers(prev => prev.map(p => ({ ...p, hasAnswered: false })));

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(12);
    } else {
      // Game Over! Determine Placement
      setStage('gameover');

      // Sort placements
      const sortedEnd = [...players].sort((a, b) => b.score - a.score);
      const isWinner = sortedEnd[0].username.includes('(You)');

      // Score-based XP
      const selfFinalScore = players.find(p => p.isSelf)?.score || 0;
      const winXp = isWinner ? 300 : 100;
      const winCoins = isWinner ? 150 : 50;

      const finalXp = Math.floor(selfFinalScore / 3) + winXp;
      const finalCoins = Math.floor(selfFinalScore / 10) + winCoins;

      addXpAndCoins(finalXp, finalCoins);
      addMatchToHistory('Multiplayer', isWinner ? 'Won (1st Place) 🏆' : 'Completed', selfFinalScore, finalXp, finalCoins);

      if (isWinner) {
        triggerAchievement('ach_genius');
      }
    }
  };

  // Chat message sending
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChats(prev => [
      ...prev,
      { id: Date.now().toString(), sender: `${user.username} (You)`, text: chatInput.trim(), isSelf: true }
    ]);
    setChatInput('');

    // Trigger funny immediate response from a random bot sometimes!
    setTimeout(() => {
      const activeBots = players.filter(p => !p.isSelf);
      if (activeBots.length === 0) return;
      const responder = activeBots[Math.floor(Math.random() * activeBots.length)];
      const text = Math.random() > 0.5 ? "skibidi fr" : "W take";

      setChats(prev => [
        ...prev,
        { id: Math.random().toString(), sender: responder.username, text }
      ]);
    }, 1500);
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
      <AnimatePresence mode="wait">
        {stage === 'options' && (
          <motion.div
            key="mp-options"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Left: Quick Matchmaking */}
            <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-3xs">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <MascotGhost skinId="skin_cyber" mood="cool" size={130} />
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-zinc-950 tracking-wider uppercase italic font-light">Ranked Matchmaking</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-2 uppercase tracking-wider leading-relaxed font-bold">
                    Scan the universe for active players. Test your knowledge in live head-to-head Gen Z quiz warfare!
                  </p>
                </div>
              </div>

              <button
                id="btn-matchmaking-start"
                onClick={handleStartMatchmaking}
                className="w-full h-11 rounded-full bg-zinc-950 hover:bg-sky-600 text-white font-mono tracking-wider text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all mt-8 font-black shadow-sm"
              >
                <span>Scan For Players ✦</span>
                <ArrowRight className="w-4 h-4 text-white stroke-[3]" />
              </button>
            </div>

            {/* Right: Private lobby join/host */}
            <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 md:p-8 flex flex-col justify-between shadow-3xs">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-full bg-sky-50/80 border border-sky-150 flex items-center justify-center">
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-zinc-950 tracking-wider uppercase italic font-light">Play with Friends</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-2 uppercase tracking-wider leading-relaxed font-bold">
                    Host a private match with custom codes or join an existing custom lobby.
                  </p>
                </div>

                <form onSubmit={handleJoinPrivate} className="space-y-3">
                  <input
                    id="input-mp-roomcode"
                    type="text"
                    maxLength={12}
                    placeholder="ENTER ROOM CODE (e.g., PV-492138)"
                    value={matchCode}
                    onChange={(e) => setMatchCode(e.target.value)}
                    className="w-full h-11 bg-white border border-purple-150 rounded-full px-4 text-center text-xs font-mono tracking-wider text-zinc-850 uppercase placeholder-zinc-400 focus:outline-none focus:border-sky-500 font-extrabold"
                  />
                  <button
                    id="btn-join-private"
                    type="submit"
                    className="w-full h-11 bg-zinc-950 hover:bg-sky-600 text-white font-mono text-xs tracking-wider uppercase rounded-full cursor-pointer active:scale-[0.99] transition-all font-black"
                  >
                    Join Room Code ✦
                  </button>
                </form>
              </div>

              <div className="pt-6 border-t border-purple-100 mt-6 flex justify-between items-center gap-4">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-extrabold">Or Host A Lobby</span>
                <button
                  id="btn-host-private"
                  onClick={handleHostPrivate}
                  className="px-5 py-2.5 bg-purple-50/50 hover:bg-purple-100 text-purple-700 border border-purple-200/50 text-[10px] font-mono tracking-wider uppercase rounded-full cursor-pointer active:scale-95 transition-all font-extrabold"
                >
                  Create Lobby
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'matching' && (
          <motion.div
            key="mp-matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center space-y-8"
          >
            {/* Matching radar animation */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 border border-purple-200 rounded-full animate-ping" />
              <div className="absolute inset-4 border border-purple-300 rounded-full animate-pulse" />
              <div className="absolute inset-0 border border-dashed border-sky-400 rounded-full animate-spin [animation-duration:8s]" />

              <div className="relative z-10">
                <MascotGhost skinId="skin_cyber" mood="shocked" size={90} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-serif text-zinc-950 tracking-wider uppercase italic font-light animate-pulse">Scanning Cosmic Waves...</h3>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider font-bold">
                Matching rating parameters (Progress: {matchingProgress}%)
              </p>
            </div>
          </motion.div>
        )}

        {stage === 'lobby' && (
          <motion.div
            key="mp-lobby"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Left Col: Lobby Information & Players */}
            <div className="md:col-span-2 bg-white border border-purple-200/50 rounded-[32px] p-6 md:p-8 flex flex-col justify-between shadow-3xs">
              <div className="space-y-6">
                {/* Lobby code bar */}
                <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-mono font-bold">Room Code</span>
                    <h2 className="text-xl font-mono font-black text-purple-700 tracking-wider uppercase">
                      {roomCode}
                    </h2>
                  </div>
                  <span className="px-3.5 py-1.5 text-[10px] font-mono uppercase bg-purple-50 border border-purple-200 text-purple-700 rounded-full font-bold">
                    {players.length} / 4 Players
                  </span>
                </div>

                {/* Players List */}
                <div className="space-y-3">
                  <h3 className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">Connected Members</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {players.map((p, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-center gap-3 ${
                          p.isSelf
                            ? 'bg-purple-50/50 border-purple-200 text-purple-800 shadow-3xs'
                            : 'bg-white border-purple-100 text-zinc-800'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200/50 p-0.5 shrink-0 overflow-hidden">
                          <img src={p.avatar} alt={p.username} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                          <span className={`text-xs font-black block ${p.isSelf ? 'text-purple-700' : 'text-zinc-800'}`}>
                            {p.username}
                          </span>
                          <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider font-extrabold">
                            {p.isSelf ? 'Host/You' : 'Guest Bot'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Launcher CTA */}
              <button
                id="btn-multiplayer-launch"
                onClick={handleLaunchMultiplayerGame}
                className="w-full h-12 rounded-full bg-zinc-950 hover:bg-sky-600 text-white font-mono tracking-wider text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all mt-8 font-black shadow-md"
              >
                <Play className="w-4 h-4 text-white fill-current" />
                <span>Launch Head-To-Head Quiz Warfare ✦</span>
              </button>
            </div>

            {/* Right Col: Live Chat Simulator */}
            <div className="bg-white border border-purple-200/50 rounded-[32px] p-5 flex flex-col justify-between h-[450px] shadow-3xs">
              <div>
                <div className="flex items-center gap-2 border-b border-purple-100 pb-3 mb-3">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-extrabold">Live Chat Lobby</span>
                </div>

                <div className="space-y-3 h-[300px] overflow-y-auto pr-1">
                  {chats.map((chat) => (
                    <div key={chat.id} className="text-[11px] font-mono leading-relaxed">
                      {chat.sender === 'System' ? (
                        <div className="p-2.5 bg-sky-50/50 border border-sky-100 rounded-xl text-[9px] text-sky-700 italic uppercase tracking-wider font-extrabold">
                          {chat.text}
                        </div>
                      ) : (
                        <div>
                          <span className={`font-black ${chat.isSelf ? 'text-purple-700' : 'text-sky-700'}`}>
                            {chat.sender}:
                          </span>{' '}
                          <span className="text-zinc-800 font-sans font-medium">{chat.text}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2 border-t border-purple-100 pt-3">
                <input
                  id="input-mp-chat"
                  type="text"
                  maxLength={60}
                  placeholder="Type Gen Z gossip..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-white border border-purple-150 rounded-full text-xs px-4 py-2.5 text-zinc-800 focus:outline-none focus:border-sky-500 font-mono font-bold"
                />
                <button
                  id="btn-send-chat"
                  type="submit"
                  className="w-10 h-10 shrink-0 bg-zinc-950 text-white hover:bg-sky-600 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4 text-white fill-current" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {stage === 'playing' && (
          <motion.div
            key={`mp-playing-${currentQIndex}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Left 2 Cols: Main gameplay */}
            <div className="md:col-span-2 space-y-6">
              {/* HUD */}
              <div className="flex items-center justify-between bg-white border border-purple-200/50 rounded-full px-6 py-3.5 text-xs font-mono shadow-3xs">
                <div className="flex items-center gap-1.5 text-purple-700 font-black animate-pulse">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>Multiplayer Conflict</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    timeLeft <= 3 ? 'bg-rose-50 border border-rose-200 text-rose-600 animate-pulse' : 'bg-purple-50 border border-purple-100 text-sky-700'
                  }`}>
                    ⏳ {timeLeft.toFixed(1)}s
                  </div>
                  <div className="text-zinc-500 font-bold">
                    Q <span className="text-sky-700 font-black">{currentQIndex + 1}</span> / 5
                  </div>
                </div>

                <div className="flex items-center gap-1 font-bold text-amber-600">
                  <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
                  <span>{players.find(p => p.isSelf)?.score || 0} PTS</span>
                </div>
              </div>

              {/* Question */}
              <div className="bg-sky-50/20 border border-sky-100 rounded-[32px] p-6 md:p-8 shadow-2xs relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-15">
                  <MascotGhost skinId="skin_cyber" mood="cool" size={110} />
                </div>
                <span className="text-[9px] uppercase font-mono tracking-wider text-sky-700 font-extrabold bg-sky-50 border border-sky-200/60 px-3.5 py-1 rounded-full inline-block">
                  👾 DATA CAT: {currentQ.category}
                </span>
                <h2 className="text-xl md:text-2xl font-serif text-zinc-950 mt-3 leading-relaxed italic font-light relative z-10">
                  "{currentQ.question}"
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAns = idx === currentQ.correctAnswer;
                  const showCorrect = selectedOption !== null && isCorrectAns;
                  const showWrong = selectedOption !== null && isSelected && !isCorrectAns;
                  const isUnselectedState = selectedOption === null;

                  return (
                    <button
                      id={`btn-mp-option-${idx}`}
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 md:p-4 rounded-2xl border relative transition-all duration-300 font-mono text-xs md:text-sm ${
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
                          ? 'bg-sky-300/30 hover:bg-sky-500'
                          : showCorrect
                          ? 'bg-emerald-500'
                          : showWrong
                          ? 'bg-rose-500'
                          : 'bg-transparent'
                      }`} />
                      <span className="font-bold leading-relaxed tracking-wide font-sans">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action */}
              {selectedOption !== null && (
                <motion.button
                  id="btn-mp-next"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNextQ}
                  className="w-full h-12 rounded-full bg-zinc-950 hover:bg-sky-600 text-white font-mono tracking-wider text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md font-black"
                >
                  <span>
                    {currentQIndex + 1 === questions.length ? 'Finish Match ✦' : 'Next Multiplayer Question ✦'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white stroke-[3]" />
                </motion.button>
              )}
            </div>

            {/* Right Col: Live Score tickers and Chat logs */}
            <div className="space-y-6">
              {/* Score tickers */}
              <div className="bg-white border border-purple-200/50 rounded-[32px] p-5 space-y-4 shadow-3xs">
                <h3 className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">Live Standings</h3>

                <div className="space-y-3">
                  {players.map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                        p.isSelf ? 'bg-purple-50/50 border-purple-200' : 'bg-white border-purple-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200/50 p-0.5 relative shrink-0 overflow-hidden">
                          <img src={p.avatar} alt={p.username} className="w-full h-full object-cover rounded-full" />
                          {p.hasAnswered && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border border-white rounded-full flex items-center justify-center text-[7px] text-white font-bold font-mono">
                              ✓
                            </div>
                          )}
                        </div>
                        <span className={`text-xs font-mono font-black ${p.isSelf ? 'text-purple-700' : 'text-zinc-800'}`}>
                          {p.username}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 font-bold">{p.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lobby chatter */}
              <div className="bg-white border border-purple-200/50 rounded-[32px] p-5 h-[190px] flex flex-col justify-between shadow-3xs">
                <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider block border-b border-purple-100 pb-2">
                  Lobby Gossip (Live)
                </span>
                <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 h-32">
                  {chats.slice(-4).map((chat) => (
                    <div key={chat.id} className="text-[10px] font-mono leading-relaxed">
                      <span className={`font-bold ${chat.isSelf ? 'text-purple-700' : 'text-sky-700'}`}>
                        {chat.sender}:
                      </span>{' '}
                      <span className="text-zinc-600 font-sans font-medium">{chat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'gameover' && (
          <motion.div
            key="mp-gameover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-purple-200/60 rounded-[32px] p-8 md:p-10 text-center space-y-6 relative overflow-hidden max-w-xl mx-auto shadow-md"
          >
            {/* Flare */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-50 rounded-full blur-3xl -z-10" />

            <div className="flex justify-center mb-2">
              <MascotGhost
                skinId="skin_gold"
                mood={players.sort((a, b) => b.score - a.score)[0].username.includes('(You)') ? 'cool' : 'sad'}
                size={110}
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-700 font-extrabold bg-purple-50 border border-purple-200 px-3.5 py-1 rounded-full inline-block animate-pulse">Multiplayer Concluded</span>
              <h2 className="text-3xl font-serif text-zinc-950 italic font-light tracking-wide pt-2">Match Placements</h2>
            </div>

            {/* Standings table */}
            <div className="bg-purple-50/20 border border-purple-100 rounded-2xl p-4 space-y-3 max-w-md mx-auto text-left font-mono shadow-3xs">
              {[...players].sort((a, b) => b.score - a.score).map((p, idx) => {
                const isWinner = idx === 0;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      p.isSelf
                        ? 'bg-purple-50 border-purple-200 shadow-3xs'
                        : 'bg-white border-purple-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-zinc-500 w-4">#{idx + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200/50 p-0.5 shrink-0 overflow-hidden">
                        <img src={p.avatar} alt={p.username} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <span className={`text-xs font-bold ${p.isSelf ? 'text-purple-700' : 'text-zinc-800'}`}>
                        {p.username} {isWinner ? '👑' : ''}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-zinc-500">{p.score} Pts</span>
                  </div>
                );
              })}
            </div>

            {/* Placement-dependent coin and XP reward summary banner */}
            <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl flex items-center justify-around max-w-sm mx-auto font-mono text-xs uppercase tracking-wider font-extrabold shadow-3xs">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>
                  +{Math.floor((players.find(p => p.isSelf)?.score || 0) / 10) + (players.sort((a, b) => b.score - a.score)[0].username.includes('(You)') ? 150 : 50)} Coins
                </span>
              </div>
              <div className="w-px h-6 bg-purple-200/50" />
              <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span>
                  +{Math.floor((players.find(p => p.isSelf)?.score || 0) / 3) + (players.sort((a, b) => b.score - a.score)[0].username.includes('(You)') ? 300 : 100)} XP
                </span>
              </div>
            </div>

            {/* Return CTA */}
            <button
              id="btn-mp-finish"
              onClick={onBackToDashboard}
              className="w-full h-11 rounded-full bg-zinc-950 hover:bg-sky-600 text-white text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all max-w-xs mx-auto shadow-sm font-black"
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
