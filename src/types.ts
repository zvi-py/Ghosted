export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface User {
  id: string;
  username: string;
  avatar: string; // url or descriptor
  xp: number;
  coins: number;
  level: number;
  dailyStreak: number;
  lastActiveDate: string | null;
  completedMissions: string[]; // list of mission IDs completed today
  unlockedAchievements: string[]; // list of achievement IDs
  unlockedSkins: string[]; // cosmetic IDs
  unlockedFrames: string[]; // cosmetic IDs
  unlockedTitles: string[]; // cosmetic IDs
  equippedSkin: string; // e.g., 'default'
  equippedFrame: string; // e.g., 'none'
  equippedTitle: string; // e.g., 'Newbie'
  brainrotRating: number;
  gkRating: number;
  longestStreak: number;
  gamesPlayed: number;
  wins: number;
  gender: 'girl' | 'boy';
  bankDetails?: {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    bankName: string;
    linkedAt: string;
    balance: number;
  };
}

export interface BrainrotQuestion {
  id: string;
  question: string;
  options: string[];
  originalPercent: number[]; // e.g. [68, 21, 8, 3] representing standard Gen Z response breakdown
  category: string;
}

export interface GKQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface Mission {
  id: string;
  description: string;
  progress: number;
  target: number;
  rewarded: boolean;
  coinsReward: number;
  xpReward: number;
  type: 'play_brainrot' | 'play_gk' | 'correct_answers' | 'predict_majority' | 'streak' | 'earn_points';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: Rarity;
  iconName: string; // lucide icon name
  xpReward: number;
  coinsReward: number;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: 'skin' | 'frame' | 'title';
  price: number;
  rarity: Rarity;
  value: string; // value used for styling or title text
  color?: string; // CSS color or Tailwind gradient class
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  mode: 'Brainrot' | 'GK Quiz' | 'Multiplayer';
  result: string; // e.g. "Completed", "Won (1st)", "Lost"
  score: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  winRate: number;
  longestStreak: number;
  brainrotRating: number;
  gkRating: number;
}
