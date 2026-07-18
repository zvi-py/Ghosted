import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MascotGhost } from './MascotGhost';
import { motion, AnimatePresence } from 'motion/react';
import { Chrome, User, Sparkles, Ghost, Brain, Award } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginAsGuest, loginWithGoogle } = useGame();
  const [username, setUsername] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [gender, setGender] = useState<'girl' | 'boy'>('girl');

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsGuest(username.trim() || 'Guest Ghost', gender);
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGoogle(
      googleEmail.trim() || 'user@gmail.com',
      googleName.trim() || 'Google Champ',
      gender
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f7f6fd]">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-200/45 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-indigo-200/35 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white border border-purple-200/50 rounded-[36px] p-8 shadow-[0_15px_50px_rgba(124,58,237,0.06)] flex flex-col items-center text-center relative"
      >
        <div className="absolute -top-12">
          <MascotGhost skinId="skin_purple" mood="happy" size={84} />
        </div>

        <div className="mt-12 mb-8">
          <h1 className="font-serif text-4xl tracking-widest text-zinc-950 uppercase italic font-bold">
            GHOSTED
          </h1>
          <p className="text-purple-650 text-xs md:text-sm font-mono uppercase tracking-widest mt-2.5 font-bold">
            Where knowledge meets chaos.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showGuestForm && !showGoogleForm ? (
            <motion.div
              key="main-auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full space-y-5"
            >
              {/* Feature Previews */}
              <div className="grid grid-cols-3 gap-2 py-4 mb-4 bg-purple-50/50 border border-purple-100/60 px-3 rounded-2xl shadow-xs">
                <div className="flex flex-col items-center p-1 text-center">
                  <Brain className="w-5 h-5 text-purple-600 mb-1.5 animate-bounce" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-extrabold">Brainrot</span>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase mt-0.5 font-bold">PREDICT</span>
                </div>
                <div className="flex flex-col items-center p-1 text-center border-x border-purple-100/40">
                  <Award className="w-5 h-5 text-amber-600 mb-1.5 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-extrabold">GK Mode</span>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase mt-0.5 font-bold">COMPETE</span>
                </div>
                <div className="flex flex-col items-center p-1 text-center">
                  <Ghost className="w-5 h-5 text-indigo-500 mb-1.5" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-extrabold">Skins</span>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase mt-0.5 font-bold">CUSTOMIZE</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                id="btn-google-auth-trigger"
                onClick={() => setShowGoogleForm(true)}
                className="w-full h-12 rounded-full bg-white hover:bg-purple-50/50 text-zinc-950 font-mono tracking-widest text-xs font-bold flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer uppercase border border-purple-200/80 shadow-xs"
              >
                <Chrome className="w-4 h-4 text-purple-600" />
                Sign in with Google
              </button>

              <button
                id="btn-guest-auth-trigger"
                onClick={() => setShowGuestForm(true)}
                className="w-full h-12 rounded-full bg-zinc-950 hover:bg-purple-600 text-white font-mono tracking-widest text-xs font-bold flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-md uppercase"
              >
                <User className="w-4 h-4 text-white" />
                Play as Guest
              </button>

              <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 pt-2 font-bold">
                Subject to standard community vibe check.
              </div>
            </motion.div>
          ) : showGuestForm ? (
            <motion.form
              key="guest-form"
              onSubmit={handleGuestLogin}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full space-y-4"
            >
              <div className="text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-purple-600 block mb-2 font-bold">CHOOSE YOUR GAMERTAG</label>
                <input
                  id="input-guest-username"
                  type="text"
                  maxLength={18}
                  placeholder="e.g., RizzlerGhost"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 rounded-full bg-white border border-purple-200 px-4 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-all text-center font-mono text-sm font-extrabold shadow-inner"
                  required
                  autoFocus
                />
              </div>

              {/* Character Preference Selection */}
              <div className="text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-purple-600 block mb-2 font-bold">CHARACTER STYLE PREFERENCE</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                      gender === 'girl'
                        ? 'bg-purple-50/50 border-purple-500 shadow-xs text-purple-600 font-bold'
                        : 'bg-white border-purple-100 text-zinc-400 hover:border-purple-300'
                    }`}
                  >
                    <div className="mb-1 pointer-events-none">
                      <MascotGhost skinId="skin_default" mood="cool" size={60} gender="girl" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Girl Style</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                      gender === 'boy'
                        ? 'bg-purple-50/50 border-purple-500 shadow-xs text-purple-600 font-bold'
                        : 'bg-white border-purple-100 text-zinc-400 hover:border-purple-300'
                    }`}
                  >
                    <div className="mb-1 pointer-events-none">
                      <MascotGhost skinId="skin_default" mood="cool" size={60} gender="boy" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Boy Style</span>
                  </button>
                </div>
              </div>

              <button
                id="btn-guest-submit"
                type="submit"
                className="w-full h-12 rounded-full bg-zinc-950 hover:bg-purple-600 text-white font-mono tracking-widest text-xs font-bold transition-all shadow-md cursor-pointer uppercase"
              >
                Launch App
              </button>

              <button
                id="btn-guest-back"
                type="button"
                onClick={() => setShowGuestForm(false)}
                className="text-xs font-mono uppercase tracking-wider text-purple-500 hover:text-purple-700 transition-colors block w-full text-center py-1 font-bold"
              >
                ← Back to options
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="google-form"
              onSubmit={handleGoogleLogin}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full space-y-4 text-left"
            >
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-purple-600 block mb-2 font-bold">GOOGLE NAME</label>
                <input
                  id="input-google-name"
                  type="text"
                  placeholder="John Doe"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full h-12 rounded-full bg-white border border-purple-200 px-4 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-all font-mono text-sm font-extrabold shadow-inner"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-purple-600 block mb-2 font-bold">EMAIL ADDRESS</label>
                <input
                  id="input-google-email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full h-12 rounded-full bg-white border border-purple-200 px-4 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-all font-mono text-sm font-extrabold shadow-inner"
                  required
                />
              </div>

              {/* Character Preference Selection */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-purple-600 block mb-2 font-bold">CHARACTER STYLE PREFERENCE</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                      gender === 'girl'
                        ? 'bg-purple-50/50 border-purple-500 shadow-xs text-purple-600 font-bold'
                        : 'bg-white border-purple-100 text-zinc-400 hover:border-purple-300'
                    }`}
                  >
                    <div className="mb-1 pointer-events-none">
                      <MascotGhost skinId="skin_default" mood="cool" size={60} gender="girl" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Girl Style</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                      gender === 'boy'
                        ? 'bg-purple-50/50 border-purple-500 shadow-xs text-purple-600 font-bold'
                        : 'bg-white border-purple-100 text-zinc-400 hover:border-purple-300'
                    }`}
                  >
                    <div className="mb-1 pointer-events-none">
                      <MascotGhost skinId="skin_default" mood="cool" size={60} gender="boy" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Boy Style</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-purple-700 text-xs font-mono uppercase tracking-wider mt-2.5 font-bold shadow-xs">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
                <span>Unlocks +300 Coins & +150 XP bonus instantly!</span>
              </div>

              <button
                id="btn-google-submit"
                type="submit"
                className="w-full h-12 rounded-full bg-zinc-950 hover:bg-purple-600 text-white font-mono tracking-widest text-xs font-bold transition-all shadow-md cursor-pointer uppercase"
              >
                Sign in with Google
              </button>

              <button
                id="btn-google-back"
                type="button"
                onClick={() => setShowGoogleForm(false)}
                className="text-xs font-mono uppercase tracking-wider text-purple-500 hover:text-purple-700 transition-colors block w-full text-center py-1 font-bold"
              >
                ← Back to options
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
