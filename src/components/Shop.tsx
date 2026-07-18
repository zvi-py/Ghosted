import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { COSMETIC_ITEMS } from '../data/cosmetics';
import { CosmeticItem, Rarity } from '../types';
import { MascotGhost } from './MascotGhost';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Sparkles, Check, Lock, ShieldCheck, ArrowRightLeft, Crown, RefreshCw } from 'lucide-react';

export const Shop: React.FC = () => {
  const { user, buyCosmetic, equipCosmetic, linkBankAccount, toggleGender } = useGame();
  const [activeTab, setActiveTab] = useState<'skin' | 'frame' | 'title'>('skin');
  const [purchaseSuccessItem, setPurchaseSuccessItem] = useState<CosmeticItem | null>(null);
  
  // Try animation moods tracker for each item
  const [previewMoods, setPreviewMoods] = useState<Record<string, 'idle' | 'happy' | 'sad' | 'shocked' | 'cool' | 'chaos' | 'combo' | 'perfect'>>({});

  // Credit Card state variables
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankName, setBankName] = useState('Chase Bank');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardError, setCardError] = useState('');
  const [linkingSuccess, setLinkingSuccess] = useState(false);

  if (!user) return null;

  const currentCoins = user.coins;

  // Formatting helper for Card Number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Expiry date input formatter (adds '/')
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleLinkCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setCardError('Card number must be exactly 16 digits.');
      return;
    }
    if (expiry.length < 5) {
      setCardError('Expiry date must be in MM/YY format.');
      return;
    }
    if (cvv.length < 3) {
      setCardError('CVV must be 3 digits.');
      return;
    }

    setCardError('');
    linkBankAccount(cardName, cardNumber, expiry, cvv, bankName);
    setLinkingSuccess(true);
    setTimeout(() => {
      setLinkingSuccess(false);
      setShowBillingModal(false);
      // Reset fields
      setCardName('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
    }, 2500);
  };

  // Filter items by type
  const items = COSMETIC_ITEMS.filter(item => item.type === activeTab);

  const getUnlockedList = (type: 'skin' | 'frame' | 'title') => {
    if (type === 'skin') return user.unlockedSkins;
    if (type === 'frame') return user.unlockedFrames;
    return user.unlockedTitles;
  };

  const getEquippedId = (type: 'skin' | 'frame' | 'title') => {
    if (type === 'skin') return user.equippedSkin;
    if (type === 'frame') return user.equippedFrame;
    return user.equippedTitle;
  };

  const handlePurchase = (item: CosmeticItem) => {
    const isUnlocked = getUnlockedList(item.type).includes(item.id);
    if (isUnlocked) {
      // Equip immediately if already unlocked
      equipCosmetic(item.id, item.type);
      return;
    }

    if (currentCoins < item.price) {
      return;
    }

    const success = buyCosmetic(item.id);
    if (success) {
      setPurchaseSuccessItem(item);
      // Auto-equip purchased items!
      equipCosmetic(item.id, item.type);
      setTimeout(() => {
        setPurchaseSuccessItem(null);
      }, 3000);
    }
  };

  // Premium Gacha Style Rarity Configurator
  const getRarityStyle = (rarity: Rarity) => {
    switch (rarity) {
      case 'common':
        return {
          cardBorder: 'border-purple-100 hover:border-purple-300 bg-white',
          badge: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          glow: 'group-hover:shadow-[0_4px_20px_rgba(161,161,170,0.08)]',
          badgeText: 'Common',
          textGradient: 'text-zinc-600'
        };
      case 'rare':
        return {
          cardBorder: 'border-sky-200 hover:border-sky-400 bg-sky-50/10',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
          glow: 'group-hover:shadow-[0_4px_25px_rgba(56,189,248,0.1)]',
          badgeText: 'Rare',
          textGradient: 'text-sky-700'
        };
      case 'epic':
        return {
          cardBorder: 'border-purple-200/60 hover:border-purple-400 bg-purple-50/10',
          badge: 'bg-purple-50 text-purple-700 border-purple-200/50',
          glow: 'group-hover:shadow-[0_4px_30px_rgba(168,85,247,0.12)]',
          badgeText: 'Epic',
          textGradient: 'text-purple-700 font-bold'
        };
      case 'legendary':
        return {
          cardBorder: 'border-amber-200 hover:border-amber-400 bg-amber-50/10',
          badge: 'bg-amber-50 text-amber-700 border-amber-200 font-black tracking-wider animate-pulse',
          glow: 'group-hover:shadow-[0_4px_35px_rgba(245,158,11,0.15)]',
          badgeText: '★ Legendary ★',
          textGradient: 'text-amber-850 font-black'
        };
      case 'mythic':
        return {
          cardBorder: 'border-pink-200 hover:border-pink-400 bg-pink-50/10',
          badge: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white border-transparent uppercase font-black tracking-wider animate-pulse shadow-sm',
          glow: 'group-hover:shadow-[0_4px_45px_rgba(236,72,153,0.18)]',
          badgeText: '✦ MYTHIC ✦',
          textGradient: 'text-pink-600 font-extrabold tracking-wide uppercase'
        };
    }
  };

  // Try Mood Handler
  const triggerTryMood = (itemId: string, moodName: any) => {
    setPreviewMoods(prev => ({
      ...prev,
      [itemId]: moodName
    }));

    // Reset back to idle after 3.5 seconds
    if (moodName !== 'idle') {
      setTimeout(() => {
        setPreviewMoods(prev => {
          if (prev[itemId] === moodName) {
            return { ...prev, [itemId]: 'idle' };
          }
          return prev;
        });
      }, 3500);
    }
  };

  const activeUnlockedList = getUnlockedList(activeTab);
  const totalItemsCount = items.length;
  const unlockedItemsCount = activeUnlockedList.length;
  const progressPercent = totalItemsCount > 0 ? (unlockedItemsCount / totalItemsCount) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
      
      {/* Shop Header Banner */}
      <div className="bg-white border border-purple-200/50 rounded-[32px] p-6 md:p-8 relative overflow-hidden shadow-3xs">
        <div className="absolute -right-6 -bottom-8 opacity-15 hover:opacity-25 transition-all duration-500">
          <MascotGhost skinId="skin_angel" mood="cool" size={160} />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 text-center md:text-left">
            <h1 className="text-3xl font-serif font-light text-zinc-950 tracking-wider flex items-center justify-center md:justify-start gap-3">
              <Sparkles className="w-7 h-7 text-amber-500 animate-pulse" />
              <span className="italic">Ghosted Shop</span>
            </h1>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider font-extrabold">
              Redeem quiz coins for premium chibi skins, borders, and elite titles.
            </p>
          </div>

          <div className="px-6 py-3.5 bg-purple-50/50 border border-purple-100 rounded-full flex items-center gap-4 shadow-sm">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider font-mono">WALLET BALANCE</span>
            <div className="flex items-center gap-2 text-2xl font-mono font-black text-amber-600">
              <Coins className="w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{currentCoins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Bank / Card Link Banner */}
      {!user.bankDetails ? (
        <div className="bg-gradient-to-r from-purple-50/60 via-white to-purple-50/40 border border-purple-200/50 rounded-[28px] p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5 shadow-3xs">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-100/30 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1.5 text-center sm:text-left relative z-10">
            <h2 className="text-sm font-mono font-black text-purple-700 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              Unlock Premium Characters
            </h2>
            <p className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider leading-relaxed font-bold">
              Link your credit/debit card to receive a <span className="text-amber-600 font-extrabold">+5,000 Coins</span> premium bonus instantly!
            </p>
          </div>
          <button
            onClick={() => setShowBillingModal(true)}
            className="px-6 py-3 rounded-full bg-zinc-950 hover:bg-sky-600 text-white font-mono text-xs uppercase tracking-wider font-black transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 flex items-center gap-2"
          >
            💳 Link Bank Card
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50/20 via-white to-emerald-50/10 border border-emerald-200/50 rounded-[28px] p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-3xs">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-emerald-700 text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              PREMIUM MEMBERSHIP ACTIVE
            </h2>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider font-bold">
              Account: <span className="text-zinc-800 font-bold">{user.bankDetails.bankName}</span> (Card ending in <span className="text-zinc-800 font-bold">*{user.bankDetails.cardNumber.replace(/\s/g, '').slice(-4)}</span>)
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full text-emerald-700 font-mono text-[9px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Premium Vibe Verified</span>
          </div>
        </div>
      )}

      {/* Navigation, Progress & Twin Switcher Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
        {/* Categories Tabs */}
        <div className="flex bg-purple-50/50 border border-purple-200/50 rounded-full p-1.5 gap-2 w-fit items-center shadow-3xs">
          {(['skin', 'frame', 'title'] as const).map((tab) => (
            <button
              id={`tab-shop-${tab}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-xs font-mono uppercase tracking-wider rounded-full cursor-pointer transition-all duration-300 font-black ${
                activeTab === tab
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-purple-700 hover:bg-purple-100/30'
              }`}
            >
              {tab === 'skin' ? 'Ghost Skins' : tab === 'frame' ? 'Borders' : 'Titles'}
            </button>
          ))}
        </div>

        {/* Dynamic Chibi Twin switcher button */}
        {toggleGender && (
          <button
            onClick={() => toggleGender()}
            className="px-6 py-3 bg-white hover:bg-purple-50/30 border border-purple-200 hover:border-purple-300 rounded-full text-[11px] font-mono uppercase tracking-wider text-zinc-800 flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-3xs active:scale-95 group font-bold"
          >
            <span className="text-zinc-400 font-bold">MASCOT VIEW:</span>
            <span className="text-purple-700 font-black flex items-center gap-1.5">
              {user.gender === 'girl' ? '👧 CHIBI GIRL' : '👦 CHIBI BOY (TWIN)'}
              <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" style={{ animationDuration: '10s' }} />
            </span>
          </button>
        )}
      </div>

      {/* Collection Progress indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white border border-purple-200/50 rounded-3xl p-5 md:p-6 w-full relative overflow-hidden shadow-3xs">
        <div className="space-y-1.5 text-center sm:text-left relative z-10">
          <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">Cosmetic Locker Collection</h3>
          <p className="text-[11px] font-mono text-zinc-800 tracking-wide font-extrabold">
            Unlocked <span className="text-purple-700 font-black">{unlockedItemsCount}</span> of <span className="text-purple-700 font-black">{totalItemsCount}</span> {activeTab === 'skin' ? 'Anime Chibi Skins' : activeTab === 'frame' ? 'Vibrant Borders' : 'Prestige Titles'}
          </p>
        </div>
        <div className="w-full sm:w-1/2 space-y-2 relative z-10">
          <div className="flex justify-between text-[9px] font-mono font-bold text-zinc-400">
            <span>0% UNLOCKED</span>
            <span className="text-purple-600 font-black">{Math.round(progressPercent)}% COMPLETE</span>
            <span>100% UNLOCKED</span>
          </div>
          <div className="h-2.5 w-full bg-purple-50 rounded-full border border-purple-100 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-sky-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
            />
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {purchaseSuccessItem && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-mono uppercase tracking-wider font-extrabold shadow-sm"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>
                UNLOCKED & EQUIPPED <span className="font-black text-amber-700">{purchaseSuccessItem.name}</span>!
              </span>
            </div>
            <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shop Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item: CosmeticItem) => {
          const unlockedList = getUnlockedList(item.type);
          const isUnlocked = unlockedList.includes(item.id);
          const isEquipped = getEquippedId(item.type) === item.id;
          const canAfford = currentCoins >= item.price;
          const rarityConf = getRarityStyle(item.rarity as Rarity);

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 450, damping: 24 }}
              className={`border rounded-[28px] p-5 md:p-6 flex flex-col justify-between transition-all duration-300 relative group cursor-default ${
                isEquipped
                  ? 'border-amber-400/80 bg-gradient-to-b from-amber-950/20 to-zinc-950 shadow-[0_10px_30px_rgba(245,158,11,0.12)]'
                  : isUnlocked
                  ? 'border-zinc-800 hover:border-purple-500/40 bg-zinc-950/70'
                  : 'border-zinc-900/80 bg-zinc-950/90'
              } ${rarityConf.glow}`}
            >
              {/* Outer soft shadow overlay glow matching rarity on hover */}
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

              {/* Top Row: Rarity badge & Equipped/Owned Indicators */}
              <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                <span className={`text-[9px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border font-black ${rarityConf.badge}`}>
                  {rarityConf.badgeText}
                </span>

                {isEquipped ? (
                  <span className="text-[9px] font-mono font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                    ACTIVE
                  </span>
                ) : isUnlocked ? (
                  <span className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-800/50 px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Check className="w-3 h-3 text-purple-400" /> OWNED
                  </span>
                ) : null}
              </div>

              {/* Center Preview Box with try controls overlay */}
              <div className="flex flex-col items-center justify-center py-6 mb-5 bg-zinc-900/15 border border-zinc-850 rounded-[24px] relative overflow-hidden min-h-[175px] shadow-inner group/preview">
                {/* Back-shadow pulse for cosmetic items */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-purple-500/5 blur-xl pointer-events-none" />

                {item.type === 'skin' ? (
                  <MascotGhost skinId={item.id} mood={previewMoods[item.id] || 'idle'} size={110} />
                ) : item.type === 'frame' ? (
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center p-1 bg-zinc-900 border ${item.value}`}
                  >
                    <MascotGhost skinId={user.equippedSkin} mood={previewMoods[item.id] || 'idle'} size={68} />
                  </div>
                ) : (
                  <div className="text-center px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <span className="text-purple-400 text-[9px] block mb-1 uppercase tracking-widest font-mono font-bold">Player Title Preview</span>
                    <span className="text-base font-serif text-zinc-100 italic tracking-wide font-light">
                      {item.value}
                    </span>
                  </div>
                )}

                {/* INTERACTIVE "TRY ANIMATION" OVERLAY CONTROLS (Only for skins or frames previews) */}
                {(item.type === 'skin' || item.type === 'frame') && (
                  <div className="absolute inset-x-0 bottom-0 bg-zinc-950/90 border-t border-zinc-850 p-2 transform translate-y-full group-hover/preview:translate-y-0 transition-transform duration-300 flex flex-col items-center justify-center gap-1.5 z-20">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-extrabold flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                      TRY INTERACTIVE MOODS
                    </span>
                    <div className="flex items-center gap-1 w-full justify-center">
                      <button
                        title="Happy Jump"
                        onClick={(e) => { e.stopPropagation(); triggerTryMood(item.id, 'happy'); }}
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-purple-500/20 border transition-all cursor-pointer ${previewMoods[item.id] === 'happy' ? 'bg-purple-500/30 border-purple-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                      >
                        😊
                      </button>
                      <button
                        title="Gremlin Cry"
                        onClick={(e) => { e.stopPropagation(); triggerTryMood(item.id, 'sad'); }}
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-purple-500/20 border transition-all cursor-pointer ${previewMoods[item.id] === 'sad' ? 'bg-purple-500/30 border-purple-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                      >
                        😭
                      </button>
                      <button
                        title="Shocked Gasp"
                        onClick={(e) => { e.stopPropagation(); triggerTryMood(item.id, 'shocked'); }}
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-purple-500/20 border transition-all cursor-pointer ${previewMoods[item.id] === 'shocked' ? 'bg-purple-500/30 border-purple-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                      >
                        😲
                      </button>
                      <button
                        title="Sunglasses Gleam"
                        onClick={(e) => { e.stopPropagation(); triggerTryMood(item.id, 'cool'); }}
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-purple-500/20 border transition-all cursor-pointer ${previewMoods[item.id] === 'cool' ? 'bg-purple-500/30 border-purple-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                      >
                        😎
                      </button>
                      <button
                        title="Gremlin Chaos"
                        onClick={(e) => { e.stopPropagation(); triggerTryMood(item.id, 'chaos'); }}
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-purple-500/20 border transition-all cursor-pointer ${previewMoods[item.id] === 'chaos' ? 'bg-purple-500/30 border-purple-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                      >
                        🤪
                      </button>
                      <button
                        title="Rainbow Combo"
                        onClick={(e) => { e.stopPropagation(); triggerTryMood(item.id, 'combo'); }}
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-purple-500/20 border transition-all cursor-pointer ${previewMoods[item.id] === 'combo' ? 'bg-purple-500/30 border-purple-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                      >
                        ⚡
                      </button>
                      <button
                        title="Streak Crown"
                        onClick={(e) => { e.stopPropagation(); triggerTryMood(item.id, 'perfect'); }}
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-purple-500/20 border transition-all cursor-pointer ${previewMoods[item.id] === 'perfect' ? 'bg-purple-500/30 border-purple-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                      >
                        👑
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Row: Item Info & Action CTAs */}
              <div className="space-y-4 relative z-10">
                <div className="text-center space-y-1">
                  <h3 className={`text-sm font-mono uppercase tracking-wider text-center font-bold ${rarityConf.textGradient}`}>
                    {item.name}
                  </h3>
                  
                  {/* COINS PRICE + GEMS EQUIVALENT DISPLAY */}
                  {item.price > 0 && !isUnlocked && (
                    <div className="flex items-center justify-center gap-4 text-[10px] font-mono tracking-widest text-zinc-400">
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Coins className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span>{item.price} COINS</span>
                      </div>
                      <span className="text-zinc-600">|</span>
                      <div className="flex items-center gap-1 font-bold text-pink-400">
                        <span className="text-[12px] filter drop-shadow-[0_0_4px_#f472b6]">💎</span>
                        <span>{Math.ceil(item.price / 10)} GEMS</span>
                      </div>
                    </div>
                  )}

                  {isUnlocked && (
                    <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">
                      Fully Unlocked in Inventory
                    </p>
                  )}
                </div>

                {isEquipped ? (
                  <button
                    id={`btn-shop-equip-${item.id}`}
                    disabled
                    className="w-full h-11 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-1.5 font-bold cursor-default"
                  >
                    <Check className="w-4 h-4 text-emerald-400" /> ACTIVE
                  </button>
                ) : isUnlocked ? (
                  <button
                    id={`btn-shop-equip-action-${item.id}`}
                    onClick={() => equipCosmetic(item.id, item.type)}
                    className="w-full h-11 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all font-bold shadow-sm"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-purple-400" /> Equip Cosmetic
                  </button>
                ) : (
                  <button
                    id={`btn-shop-buy-${item.id}`}
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford}
                    className={`w-full h-11 rounded-full font-mono tracking-widest text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 font-bold ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-black shadow-[0_4px_12px_rgba(124,58,237,0.15)]'
                        : 'bg-zinc-900 border border-zinc-850 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Coins className="w-4 h-4 text-white fill-current" /> BUY / {item.price} Coins
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-zinc-500" /> NEED {item.price} Coins
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Credit Card Modal for Bank Account details linking */}
      <AnimatePresence>
        {showBillingModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-950 border border-zinc-800 rounded-[32px] p-6 md:p-8 max-w-md w-full relative shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-mono font-bold text-zinc-100 uppercase tracking-widest">Link Bank Details</h3>
                  <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-1">Unlock Premium Mascot Characters</p>
                </div>
                <button
                  onClick={() => {
                    if (!linkingSuccess) setShowBillingModal(false);
                  }}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {linkingSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-emerald-400 text-sm font-mono font-black uppercase tracking-widest">PAYMENT ACCESS LINKED</h4>
                    <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest">
                      +5,000 Premium Quiz Coins credited!
                    </p>
                  </div>
                  <div className="text-amber-500 font-mono text-xl font-bold animate-pulse flex items-center gap-1.5">
                    <Coins className="w-5 h-5" />
                    <span>+5,000 Coins</span>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleLinkCardSubmit} className="space-y-4 text-left">
                  {/* Dynamic Interactive Card Graphic */}
                  <div className="relative w-full max-w-[320px] h-44 mx-auto rounded-2xl bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-950 p-5 text-white shadow-xl flex flex-col justify-between overflow-hidden border border-purple-500/20 mb-6">
                    <div className="absolute inset-0 bg-white/[0.03] skew-y-12 pointer-events-none transform -translate-y-1/2" />
                    
                    {!isFlipped ? (
                      // Front Graphic
                      <>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-purple-300 uppercase truncate max-w-[150px]">
                            {bankName || 'AURORA CAPITAL'}
                          </span>
                          <span className="text-sm font-black italic tracking-widest text-zinc-300">GHOSTCARD</span>
                        </div>
                        <div className="my-1.5 flex items-center gap-3">
                          {/* Gold Chip */}
                          <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-300 to-yellow-500 border border-amber-600/30 flex flex-col justify-between p-1">
                            <div className="grid grid-cols-3 gap-0.5 h-full opacity-60">
                              <div className="border-r border-amber-900/30" />
                              <div className="border-r border-amber-900/30" />
                              <div />
                            </div>
                          </div>
                          {/* Contactless */}
                          <div className="flex gap-0.5 items-center opacity-40">
                            <div className="w-1 h-1 rounded-full bg-white" />
                            <div className="w-2 h-2 rounded-full border-r-2 border-white" />
                            <div className="w-3 h-3 rounded-full border-r-2 border-white" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-mono tracking-widest font-black text-center mb-1 text-purple-100">
                            {cardNumber ? formatCardNumber(cardNumber) : '•••• •••• •••• ••••'}
                          </div>
                          <div className="flex justify-between items-end text-[8px] font-mono uppercase text-zinc-400">
                            <div className="truncate max-w-[150px]">
                              <span className="block text-[6px] text-zinc-500">CARDHOLDER</span>
                              <span className="font-bold text-zinc-200 truncate">{cardName || 'CHIBI GHOST'}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[6px] text-zinc-500">EXPIRES</span>
                              <span className="font-bold text-zinc-200">{expiry || 'MM/YY'}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Back Graphic
                      <div className="flex flex-col justify-between h-full -mx-5 -my-5 py-4">
                        <div className="w-full h-8 bg-zinc-900/90 mb-3" />
                        <div className="px-5">
                          <div className="text-[6px] font-mono text-zinc-500 mb-0.5 text-right">CVV SECURITY</div>
                          <div className="bg-zinc-800/80 text-zinc-100 font-mono text-xs font-bold text-right py-1 px-2.5 rounded italic flex justify-between items-center border border-zinc-700">
                            <span className="text-[7px] text-zinc-500 tracking-tight normal-case">AUTH SIGNATURE</span>
                            <span className="bg-white text-zinc-950 px-1.5 py-0.5 rounded text-[10px] font-mono font-black">{cvv || '•••'}</span>
                          </div>
                        </div>
                        <div className="px-5 text-[6px] font-mono text-zinc-500 uppercase tracking-widest mt-2 text-center">
                          Secured by AI Studio Sandbox Encrypted Sandbox.
                        </div>
                      </div>
                    )}
                  </div>

                  {cardError && (
                    <div className="text-rose-500 text-[10px] font-mono uppercase tracking-widest text-center">
                      ⚠ {cardError}
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1 font-bold">Bank / Issuer Name</label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                      >
                        <option value="Chase Bank">Chase Bank</option>
                        <option value="Bank of America">Bank of America</option>
                        <option value="Monzo Bank">Monzo Bank</option>
                        <option value="Revolut">Revolut</option>
                        <option value="HSBC Bank">HSBC Bank</option>
                        <option value="Barclays">Barclays</option>
                        <option value="DBS Bank">DBS Bank</option>
                        <option value="Gringotts Ghost Vault">Gringotts Ghost Vault</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1 font-bold">Cardholder Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g., GABRIEL GHOST"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        maxLength={22}
                        className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1 font-bold">16-Digit Card Number</label>
                      <input
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19} // 16 digits + 3 spaces
                        className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500 transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1 font-bold">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500 transition-all text-center"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1 font-bold">CVV Code</label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/gi, ''))}
                          maxLength={3}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500 transition-all text-center"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-zinc-400 text-[9px] font-mono uppercase tracking-wider leading-relaxed text-center">
                    🔒 ENCRYPTED SANDBOX MEMORY. BANK DETAILS AND BALANCES ARE STORED LOCALLY IN SECURE GUEST CACHE AND NEVER LEAVE YOUR DEVICE.
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-mono text-xs tracking-widest uppercase font-extrabold transition-all shadow-md active:scale-95 cursor-pointer mt-4"
                  >
                    🚀 ACTIVATE PREMIUM (+5,000 COINS)
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
