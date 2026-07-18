import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Mission, Achievement, CosmeticItem, MatchHistoryItem, PlayerStats } from '../types';
import { BRAINROT_QUESTIONS, GK_QUESTIONS } from '../data/questions';
import { COSMETIC_ITEMS } from '../data/cosmetics';

interface GameContextType {
  user: User | null;
  loading: boolean;
  loginAsGuest: (username: string, gender: 'girl' | 'boy') => void;
  loginWithGoogle: (email: string, name: string, gender: 'girl' | 'boy') => void;
  logout: () => void;
  addXpAndCoins: (xp: number, coins: number) => { leveledUp: boolean; oldLevel: number; newLevel: number };
  buyCosmetic: (id: string) => boolean;
  equipCosmetic: (id: string, type: 'skin' | 'frame' | 'title') => void;
  addMatchToHistory: (mode: 'Brainrot' | 'GK Quiz' | 'Multiplayer', result: string, score: number, xp: number, coins: number) => void;
  missions: Mission[];
  updateMissionProgress: (type: Mission['type'], amount: number) => void;
  claimMissionReward: (missionId: string) => void;
  achievements: Achievement[];
  unlockedAchievements: string[];
  triggerAchievement: (id: string) => void;
  matchHistory: MatchHistoryItem[];
  allCosmetics: CosmeticItem[];
  // Event state for showing level up modals
  levelUpEvent: { show: boolean; oldLevel: number; newLevel: number } | null;
  dismissLevelUp: () => void;
  // Active multiplayer state (can be fully simulated)
  activeRoomCode: string | null;
  setActiveRoomCode: (code: string | null) => void;
  linkBankAccount: (cardholderName: string, cardNumber: string, expiryDate: string, cvv: string, bankName: string) => void;
  toggleGender: () => void;
}

const DEFAULT_MISSIONS: Mission[] = [
  { id: 'm_1', description: 'Play Brainrot Mode once', progress: 0, target: 1, rewarded: false, coinsReward: 100, xpReward: 150, type: 'play_brainrot' },
  { id: 'm_2', description: 'Play GK Quiz twice', progress: 0, target: 2, rewarded: false, coinsReward: 150, xpReward: 200, type: 'play_gk' },
  { id: 'm_3', description: 'Get 5 correct answers in GK', progress: 0, target: 5, rewarded: false, coinsReward: 120, xpReward: 180, type: 'correct_answers' },
  { id: 'm_4', description: 'Predict the absolute majority (top) option 3 times in Brainrot', progress: 0, target: 3, rewarded: false, coinsReward: 150, xpReward: 250, type: 'predict_majority' },
  { id: 'm_5', description: 'Maintain a 5x combo multiplier in GK Mode', progress: 0, target: 1, rewarded: false, coinsReward: 200, xpReward: 300, type: 'streak' },
  { id: 'm_6', description: 'Earn 1000 points in a single match', progress: 0, target: 1000, rewarded: false, coinsReward: 250, xpReward: 400, type: 'earn_points' }
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_first', title: 'First Game', description: 'Complete your first ever quiz match', rarity: 'common', iconName: 'Gamepad2', xpReward: 100, coinsReward: 50 },
  { id: 'ach_brainrot_master', title: 'Brainrot Guru', description: 'Predict the majority choice 5 times in a single game', rarity: 'rare', iconName: 'Brain', xpReward: 250, coinsReward: 150 },
  { id: 'ach_ghost_elite', title: 'Ghost Elite', description: 'Play 10 matches on the platform', rarity: 'epic', iconName: 'Ghost', xpReward: 500, coinsReward: 300 },
  { id: 'ach_speed_demon', title: 'Speed Demon', description: 'Answer a GK question correctly in under 1.5 seconds', rarity: 'rare', iconName: 'Zap', xpReward: 200, coinsReward: 100 },
  { id: 'ach_genius', title: 'Trivia Savant', description: 'Answer 10 GK questions correctly in a single session', rarity: 'legendary', iconName: 'Award', xpReward: 1000, coinsReward: 500 },
  { id: 'ach_lucky_guess', title: 'Lucky Guess', description: 'Predict an option that has less than 10% popularity', rarity: 'rare', iconName: 'Sparkles', xpReward: 250, coinsReward: 120 },
  { id: 'ach_mind_reader', title: 'Mind Reader', description: 'Reach a prediction streak of 5 in Brainrot', rarity: 'epic', iconName: 'Eye', xpReward: 400, coinsReward: 200 },
  { id: 'ach_combo_king', title: 'Combo Overlord', description: 'Reach a 5x score combo multiplier in GK Mode', rarity: 'epic', iconName: 'Flame', xpReward: 300, coinsReward: 150 },
  { id: 'ach_completionist', title: 'Completionist', description: 'Own at least 5 purchased cosmetics from the Ghost Shop', rarity: 'legendary', iconName: 'Crown', xpReward: 1200, coinsReward: 600 }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>(DEFAULT_MISSIONS);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>([]);
  const [levelUpEvent, setLevelUpEvent] = useState<{ show: boolean; oldLevel: number; newLevel: number } | null>(null);
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('ghosted_user');
    const savedMissions = localStorage.getItem('ghosted_missions');
    const savedAchievements = localStorage.getItem('ghosted_unlocked_achievements');
    const savedHistory = localStorage.getItem('ghosted_history');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedMissions) {
      setMissions(JSON.parse(savedMissions));
    }
    if (savedAchievements) {
      setUnlockedAchievements(JSON.parse(savedAchievements));
    }
    if (savedHistory) {
      setMatchHistory(JSON.parse(savedHistory));
    }
    setLoading(false);
  }, []);

  // Save changes to LocalStorage
  const saveUserData = (updatedUser: User | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('ghosted_user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('ghosted_user');
    }
  };

  const saveMissions = (updatedMissions: Mission[]) => {
    setMissions(updatedMissions);
    localStorage.setItem('ghosted_missions', JSON.stringify(updatedMissions));
  };

  const saveAchievements = (updatedAchievements: string[]) => {
    setUnlockedAchievements(updatedAchievements);
    localStorage.setItem('ghosted_unlocked_achievements', JSON.stringify(updatedAchievements));
  };

  const saveHistory = (updatedHistory: MatchHistoryItem[]) => {
    setMatchHistory(updatedHistory);
    localStorage.setItem('ghosted_history', JSON.stringify(updatedHistory));
  };

  const loginAsGuest = (username: string, gender: 'girl' | 'boy') => {
    const trimmed = username.trim() || 'Guest Ghost';
    const avatarSeed = Math.floor(Math.random() * 1000);
    const newUser: User = {
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      username: trimmed,
      avatar: gender === 'girl' 
        ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}&backgroundColor=6b21a8`
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=0284c7`,
      xp: 0,
      coins: 200, // starting coins
      level: 1,
      dailyStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedMissions: [],
      unlockedAchievements: [],
      unlockedSkins: ['skin_default'],
      unlockedFrames: ['frame_none'],
      unlockedTitles: ['title_newbie'],
      equippedSkin: 'skin_default',
      equippedFrame: 'frame_none',
      equippedTitle: 'title_newbie',
      brainrotRating: 1000,
      gkRating: 1000,
      longestStreak: 0,
      gamesPlayed: 0,
      wins: 0,
      gender
    };
    saveUserData(newUser);
    saveMissions(DEFAULT_MISSIONS);
    saveAchievements([]);
    saveHistory([]);
  };

  const loginWithGoogle = (email: string, name: string, gender: 'girl' | 'boy') => {
    const trimmed = name.trim() || 'Google Ghost';
    const avatarSeed = encodeURIComponent(email);
    const newUser: User = {
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      username: trimmed,
      avatar: gender === 'girl'
        ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}&backgroundColor=a855f7`
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=2563eb`,
      xp: 150, // Google login bonus XP
      coins: 500, // Google login bonus coins!
      level: 1,
      dailyStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedMissions: [],
      unlockedAchievements: [],
      unlockedSkins: ['skin_default'],
      unlockedFrames: ['frame_none'],
      unlockedTitles: ['title_newbie'],
      equippedSkin: 'skin_default',
      equippedFrame: 'frame_none',
      equippedTitle: 'title_newbie',
      brainrotRating: 1050,
      gkRating: 1050,
      longestStreak: 0,
      gamesPlayed: 0,
      wins: 0,
      gender
    };
    saveUserData(newUser);
    saveMissions(DEFAULT_MISSIONS);
    saveAchievements([]);
    saveHistory([]);
  };

  const linkBankAccount = (
    cardholderName: string,
    cardNumber: string,
    expiryDate: string,
    cvv: string,
    bankName: string
  ) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      coins: user.coins + 5000, // Big premium unlock bonus!
      bankDetails: {
        cardholderName,
        cardNumber,
        expiryDate,
        cvv,
        bankName,
        linkedAt: new Date().toLocaleDateString(),
        balance: 10000 // Mock starting bank balance
      }
    };
    saveUserData(updatedUser);
  };

  const logout = () => {
    saveUserData(null);
    setMissions(DEFAULT_MISSIONS);
    setUnlockedAchievements([]);
    setMatchHistory([]);
    setActiveRoomCode(null);
    localStorage.removeItem('ghosted_user');
    localStorage.removeItem('ghosted_missions');
    localStorage.removeItem('ghosted_unlocked_achievements');
    localStorage.removeItem('ghosted_history');
  };

  const calculateXpForLevel = (lvl: number) => {
    return lvl * 500; // lvl 1: 500xp needed to reach lvl 2, lvl 2: 1000xp to reach lvl 3, etc.
  };

  const addXpAndCoins = (xpGained: number, coinsGained: number) => {
    if (!user) return { leveledUp: false, oldLevel: 1, newLevel: 1 };

    let currentXp = user.xp + xpGained;
    let currentLevel = user.level;
    let leveledUp = false;
    const oldLevel = currentLevel;

    while (currentXp >= calculateXpForLevel(currentLevel)) {
      currentXp -= calculateXpForLevel(currentLevel);
      currentLevel += 1;
      leveledUp = true;
    }

    // Level up reward! 200 coins per level up
    const bonusCoins = leveledUp ? (currentLevel - oldLevel) * 200 : 0;

    const updatedUser: User = {
      ...user,
      xp: currentXp,
      level: currentLevel,
      coins: user.coins + coinsGained + bonusCoins,
      gamesPlayed: user.gamesPlayed
    };

    saveUserData(updatedUser);

    if (leveledUp) {
      setLevelUpEvent({ show: true, oldLevel, newLevel: currentLevel });
      // Trigger mission checks if needed
    }

    return { leveledUp, oldLevel, newLevel: currentLevel };
  };

  const buyCosmetic = (id: string) => {
    if (!user) return false;
    const item = COSMETIC_ITEMS.find(c => c.id === id);
    if (!item) return false;

    // Check if already unlocked
    const lists = {
      skin: user.unlockedSkins,
      frame: user.unlockedFrames,
      title: user.unlockedTitles
    };

    if (lists[item.type].includes(id)) return true;

    if (user.coins < item.price) return false;

    const updatedUser: User = { ...user };
    updatedUser.coins -= item.price;

    if (item.type === 'skin') {
      updatedUser.unlockedSkins = [...user.unlockedSkins, id];
    } else if (item.type === 'frame') {
      updatedUser.unlockedFrames = [...user.unlockedFrames, id];
    } else if (item.type === 'title') {
      updatedUser.unlockedTitles = [...user.unlockedTitles, id];
    }

    // Check completionist achievement
    const totalPurchased = updatedUser.unlockedSkins.length + updatedUser.unlockedFrames.length + updatedUser.unlockedTitles.length - 3; // subtracting 3 default ones
    saveUserData(updatedUser);

    if (totalPurchased >= 5) {
      triggerAchievement('ach_completionist');
    }

    return true;
  };

  const equipCosmetic = (id: string, type: 'skin' | 'frame' | 'title') => {
    if (!user) return;
    const updatedUser = { ...user };
    if (type === 'skin') {
      if (updatedUser.unlockedSkins.includes(id)) {
        updatedUser.equippedSkin = id;
      }
    } else if (type === 'frame') {
      if (updatedUser.unlockedFrames.includes(id)) {
        updatedUser.equippedFrame = id;
      }
    } else if (type === 'title') {
      if (updatedUser.unlockedTitles.includes(id)) {
        updatedUser.equippedTitle = id;
      }
    }
    saveUserData(updatedUser);
  };

  const addMatchToHistory = (
    mode: 'Brainrot' | 'GK Quiz' | 'Multiplayer',
    result: string,
    score: number,
    xpEarned: number,
    coinsEarned: number
  ) => {
    if (!user) return;

    const newMatch: MatchHistoryItem = {
      id: 'match_' + Date.now(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      mode,
      result,
      score,
      xpEarned,
      coinsEarned
    };

    const newHistory = [newMatch, ...matchHistory].slice(0, 15); // keep last 15
    saveHistory(newHistory);

    // Update global user stats
    const updatedUser = { ...user };
    updatedUser.gamesPlayed += 1;
    if (result.toLowerCase().includes('won') || result.toLowerCase().includes('first') || result.toLowerCase().includes('win')) {
      updatedUser.wins += 1;
    }
    updatedUser.winRate = Math.round((updatedUser.wins / updatedUser.gamesPlayed) * 100);

    // Update mode ratings
    if (mode === 'Brainrot') {
      // Brainrot performance shifts ratings
      updatedUser.brainrotRating += Math.floor((score - 400) / 10);
    } else if (mode === 'GK Quiz') {
      updatedUser.gkRating += Math.floor((score - 600) / 12);
    } else if (mode === 'Multiplayer') {
      if (result.includes('Won')) {
        updatedUser.brainrotRating += 25;
        updatedUser.gkRating += 25;
      } else {
        updatedUser.brainrotRating -= 10;
        updatedUser.gkRating -= 10;
      }
    }

    // Bound ratings to minimum 800
    if (updatedUser.brainrotRating < 800) updatedUser.brainrotRating = 800;
    if (updatedUser.gkRating < 800) updatedUser.gkRating = 800;

    saveUserData(updatedUser);

    // Trigger basic milestones
    triggerAchievement('ach_first');
    if (updatedUser.gamesPlayed >= 10) {
      triggerAchievement('ach_ghost_elite');
    }

    // Update missions progress
    if (mode === 'Brainrot') {
      updateMissionProgress('play_brainrot', 1);
    } else if (mode === 'GK Quiz') {
      updateMissionProgress('play_gk', 1);
    }
    updateMissionProgress('earn_points', score);
  };

  const updateMissionProgress = (type: Mission['type'], amount: number) => {
    const updatedMissions = missions.map(mission => {
      if (mission.type === type && !mission.rewarded) {
        let newProgress = mission.progress;
        if (type === 'earn_points') {
          newProgress = Math.max(newProgress, amount); // For max points target
        } else {
          newProgress += amount;
        }
        return {
          ...mission,
          progress: Math.min(newProgress, mission.target)
        };
      }
      return mission;
    });
    saveMissions(updatedMissions);
  };

  const claimMissionReward = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.rewarded || mission.progress < mission.target) return;

    // Award XP and coins
    addXpAndCoins(mission.xpReward, mission.coinsReward);

    const updatedMissions = missions.map(m => {
      if (m.id === missionId) {
        return { ...m, rewarded: true };
      }
      return m;
    });

    saveMissions(updatedMissions);

    // Check if all are completed to award daily grinder
    const activeMissions = updatedMissions.filter(m => m.rewarded);
    if (activeMissions.length === missions.length) {
      triggerAchievement('ach_daily_grinder');
    }
  };

  const triggerAchievement = (id: string) => {
    if (unlockedAchievements.includes(id)) return;
    const ach = DEFAULT_ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    const newUnlocked = [...unlockedAchievements, id];
    saveAchievements(newUnlocked);

    // Award rewards
    addXpAndCoins(ach.xpReward, ach.coinsReward);
  };

  const dismissLevelUp = () => {
    setLevelUpEvent(null);
  };

  const toggleGender = () => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      gender: user.gender === 'girl' ? 'boy' : 'girl'
    };
    saveUserData(updatedUser);
  };

  return (
    <GameContext.Provider value={{
      user,
      loading,
      loginAsGuest,
      loginWithGoogle,
      logout,
      addXpAndCoins,
      buyCosmetic,
      equipCosmetic,
      addMatchToHistory,
      missions,
      updateMissionProgress,
      claimMissionReward,
      achievements: DEFAULT_ACHIEVEMENTS,
      unlockedAchievements,
      triggerAchievement,
      matchHistory,
      allCosmetics: COSMETIC_ITEMS,
      levelUpEvent,
      dismissLevelUp,
      activeRoomCode,
      setActiveRoomCode,
      linkBankAccount,
      toggleGender
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
