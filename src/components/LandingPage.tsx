import React from 'react';
import { motion } from 'motion/react';
import { MascotGhost } from './MascotGhost';
import { Brain, Award, Coins, Sparkles, ChevronRight, Users, Heart, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const handlePortraitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({ x: x * 16, y: y * -16 }); // tilt angles
  };

  const handlePortraitMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-zinc-700 bg-[#f7f6fd] font-sans selection:bg-purple-500/10 selection:text-purple-800">
      
      {/* Slow Floating Decorative Celestial Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <motion.div
          animate={{
            y: [0, -35, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[18%] left-[8%] text-purple-300 text-3xl opacity-30 font-serif"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[30%] right-[10%] text-purple-400 text-2xl opacity-25 font-serif"
        >
          ◯
        </motion.div>
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[30%] left-[6%] text-purple-300 text-4xl opacity-20 font-serif"
        >
          ★
        </motion.div>
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, 25, 0],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[15%] right-[6%] text-purple-400 text-xl opacity-30 font-serif"
        >
          ✦
        </motion.div>
      </div>

      {/* HEADER BAR */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between border-b border-zinc-200 relative z-10"
      >
        {/* Left: Selected Works Metadata */}
        <div className="hidden md:block text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
          DESIGN EDITION<br />
          VOL. III — 2026
        </div>
 
        {/* Center: Vertical Capsule Logo (G\O) */}
        <motion.div 
          whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={onEnterApp}
        >
          <div className="w-9 h-14 rounded-full border border-purple-200 flex flex-col items-center justify-center text-[11px] font-serif tracking-widest text-purple-600 font-bold relative bg-white/60 backdrop-blur-sm shadow-sm">
            <span className="text-[7px] text-purple-600 absolute top-1.5 animate-pulse">✦</span>
            <span className="my-0.5 leading-none">G</span>
            <span className="my-0.5 leading-none">O</span>
            <span className="text-[7px] text-purple-600 absolute bottom-1.5 animate-pulse">✦</span>
          </div>
        </motion.div>
 
        {/* Right: Creative Portfolio Metadata */}
        <div className="text-right text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
          LUXURY EDITORIAL QUIZ<br />
          FOR THE INTERNET CULTURED
        </div>
      </motion.nav>
 
      {/* HERO SECTION / BRAND HEADER TITLE */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-8 text-center relative z-10">
        {/* Ambient Aurora behind text */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[480px] h-[150px] bg-gradient-to-r from-purple-500/10 via-purple-300/15 to-sky-350/10 rounded-full blur-[90px] -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
 
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <motion.span 
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "0.4em", opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[10px] font-mono tracking-[0.4em] text-purple-650 uppercase font-bold block"
          >
            ✦ AN INTELLECTUAL VOID ✦
          </motion.span>
          
          <motion.h1 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-7xl md:text-[11rem] font-serif font-light text-zinc-950 tracking-[0.22em] uppercase leading-none select-none drop-shadow-sm pl-[0.22em]"
          >
            GHOSTED
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xs md:text-sm font-serif italic text-zinc-600 tracking-[0.3em] uppercase mt-4 max-w-lg mx-auto"
          >
            Can You Think Like The Internet?
          </motion.p>
        </motion.div>
 
        {/* Hero Interactive Dual CTA Buttons - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Brainrot Button */}
          <motion.button
            id="hero-cta-brainrot"
            onClick={onEnterApp}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-sans tracking-widest text-xs uppercase font-extrabold rounded-full cursor-pointer transition-all duration-300 shadow-md flex items-center gap-2.5"
          >
            <Brain className="w-4 h-4 text-white stroke-[2.5] group-hover:rotate-12 transition-transform duration-300" />
            <span>PLAY BRAINROT</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
 
          {/* GK Button */}
          <motion.button
            id="hero-cta-gk"
            onClick={onEnterApp}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 bg-zinc-200/50 hover:bg-zinc-200 text-zinc-800 font-sans tracking-widest text-xs uppercase font-extrabold rounded-full border border-zinc-300 cursor-pointer transition-all duration-300 transform shadow-sm flex items-center gap-2.5 backdrop-blur-[24px]"
          >
            <Award className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform duration-300" />
            <span>PLAY GK QUIZ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-sky-600" />
          </motion.button>
        </motion.div>
      </header>
 
      {/* PORTRAIT / SIDEBAR CONTAINER */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12 items-center relative z-10">
        
        {/* Left Side: Elegant Sidebar Menu */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col space-y-6 text-left"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-purple-600 uppercase font-bold">CATEGORIES</span>
          <div className="flex flex-col space-y-4 text-[11px] font-mono tracking-[0.18em] text-zinc-400">
            {['01 / BRAINROT PREDICT', '02 / TRIVIA GK CHALLENGE', '03 / COSMETICS SHOP', '04 / MULTIPLAYER VOID'].map((txt, index) => (
              <motion.span 
                key={txt} 
                onClick={onEnterApp} 
                whileHover={{ x: 6, color: '#09090b' }}
                className="hover:text-zinc-900 transition-colors cursor-pointer flex items-center gap-1 w-fit"
              >
                {txt}
              </motion.span>
            ))}
          </div>
        </motion.div>
 
        {/* Center: The Iconic Arched Portrait (Mascot Ghost) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center relative">
          {/* Outer glowing halo */}
          <div className="absolute w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -z-10 animate-pulse" />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotateX: tilt.y,
              rotateY: tilt.x,
              transformPerspective: 1000
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            onMouseMove={handlePortraitMouseMove}
            onMouseLeave={handlePortraitMouseLeave}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-[290px] h-[390px] md:w-[330px] md:h-[440px] rounded-t-full border border-zinc-300 relative overflow-hidden bg-zinc-100/50 backdrop-blur-[24px] flex items-center justify-center shadow-md group cursor-pointer"
          >
            {/* Soft pink dome arch background */}
            <div className="absolute inset-x-8 bottom-0 top-16 bg-[#F4D4FF]/10 rounded-t-full -z-10 border border-zinc-200/50" style={{ transform: 'translateZ(10px)' }} />
            
            {/* Large Mascot Ghost with 3D offset */}
            <motion.div
              className="relative z-10"
              style={{ transform: 'translateZ(30px)' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MascotGhost skinId="skin_purple" mood="cool" size={230} />
            </motion.div>
 
            {/* Tiny stars decorations */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-purple-600/40 text-xs animate-pulse" style={{ transform: 'translateZ(15px)' }}>✦</div>
            <div className="absolute bottom-12 left-12 text-purple-600/30 text-[9px] animate-pulse" style={{ transform: 'translateZ(15px)' }}>✦</div>
            <div className="absolute bottom-24 right-12 text-purple-600/30 text-[9px] animate-pulse" style={{ transform: 'translateZ(15px)' }}>✦</div>
          </motion.div>
        </div>
 
        {/* Right Side: Elegant Philosophy Quote */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-right space-y-6"
        >
          <div className="inline-block md:block">
            <span className="text-[10px] font-mono tracking-[0.3em] text-purple-600 uppercase font-bold">PHILOSOPHY</span>
          </div>
          <p className="text-zinc-650 text-sm md:text-base font-serif italic leading-relaxed max-w-xs mx-auto md:ml-auto">
            "Design that frames your chaotic knowledge beautifully."
          </p>
          <div className="pt-2 flex justify-center md:justify-end">
            <motion.button
              id="btn-landing-enter-reality"
              onClick={onEnterApp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-zinc-950 text-white font-mono tracking-widest text-[10px] uppercase font-bold rounded-full cursor-pointer transition-all duration-300 hover:bg-purple-600 shadow-sm flex items-center gap-2"
            >
              <span>ENTER PORTAL</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </motion.button>
          </div>
        </motion.div>
      </section>
 
      {/* INTRODUCTION ARCHED CONTAINER */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[40px] md:rounded-[80px] bg-white border border-zinc-200 p-8 md:p-16 text-zinc-950 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Left side text details */}
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-purple-600 uppercase">
                <span>INTRODUCTION</span>
                <span>✦</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-light text-zinc-950 leading-tight">
                HI, WE ARE <span className="font-serif italic text-purple-650 font-medium">GHOSTED</span>
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed tracking-wide font-light font-sans">
                A highly polished quiz platform engineered for Gen Z and trivia lovers alike. We blend general academic clout with chaotic internet culture prediction, delivering a dual-mechanic reality where knowledge meets absolute chaos.
              </p>
              <div className="pt-2">
                <span className="font-serif italic text-purple-600 text-lg border-b border-purple-200 pb-1.5">Knowledge is digital high fashion.</span>
              </div>
            </div>
 
            {/* Right side bullet items & spinning badge */}
            <div className="md:col-span-5 space-y-8 md:pl-8 border-t md:border-t-0 md:border-l border-zinc-200 pt-8 md:pt-0 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-purple-600 uppercase font-bold block mb-4">WHAT WE DO</span>
                <ul className="space-y-4 font-mono text-[11px] text-zinc-500 tracking-wider">
                  <li className="flex items-center gap-3">
                    <span className="text-purple-600 text-xs">✦</span>
                    <span>Brand Identity Brainrot Predictor</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-600 text-xs">☾</span>
                    <span>High-Speed General Knowledge Quiz</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-600 text-xs">✦</span>
                    <span>Cosmetic Skin, Frame & Title Shop</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-600 text-xs">◯</span>
                    <span>Real-time Multiplayer Match Lobbies</span>
                  </li>
                </ul>
              </div>
 
              {/* Glowing spinning brand seal badge */}
              <div className="flex justify-end pt-4 md:pt-0">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-22 h-22 rounded-full border border-zinc-300 flex items-center justify-center relative"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    className="text-[6px] font-mono tracking-[0.15em] text-purple-600 uppercase absolute inset-0 flex items-center justify-center"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-purple-600">
                      <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                      <text className="font-mono text-[7px] uppercase tracking-[0.22em]">
                        <textPath href="#circlePath">✦ GHOSTED QUIZ PLATFORM ✦</textPath>
                      </text>
                    </svg>
                  </motion.div>
                  <Sparkles className="w-5 h-5 text-purple-600/70" />
                </motion.div>
              </div>
 
            </div>
 
          </div>
        </motion.div>
      </section>
 
      {/* SELECTED MODES - DESIGNED AS PORTFOLIO ITEMS */}
      <section className="border-y border-zinc-200 py-24 relative z-10 bg-zinc-100">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] text-purple-600 uppercase font-bold">✦ CURATED SYSTEM ✦</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-zinc-950 uppercase tracking-wider">CHOOSE YOUR CHALLENGE</h2>
          </div>
 
          {/* Grid of Arched Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Mode 1: Brainrot */}
            <motion.div 
              onClick={onEnterApp}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.0 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-[3/4] rounded-t-full border border-zinc-200 overflow-hidden bg-white relative flex items-center justify-center group-hover:border-purple-300/40 transition-all duration-500 shadow-md backdrop-blur-[20px] group-hover:shadow-lg">
                {/* Visual content inside arch */}
                <div className="absolute inset-x-4 bottom-0 top-12 bg-purple-50/20 rounded-t-full border border-zinc-100 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Brain className="w-7 h-7 text-purple-650" />
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 text-center uppercase">01 / PREDICT INTUITION</span>
                </div>
              </div>
              <div className="text-center mt-5 space-y-1.5">
                <h3 className="text-xl font-serif text-zinc-950 italic font-light group-hover:text-purple-600 transition-colors">Brainrot Mode</h3>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 block">INTERNET CULTURE CHAOS</span>
              </div>
            </motion.div>
 
            {/* Mode 2: General Knowledge */}
            <motion.div 
              onClick={onEnterApp}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-[3/4] rounded-t-full border border-zinc-200 overflow-hidden bg-white relative flex items-center justify-center group-hover:border-purple-300/40 transition-all duration-500 shadow-md backdrop-blur-[20px] group-hover:shadow-lg">
                {/* Visual content inside arch */}
                <div className="absolute inset-x-4 bottom-0 top-12 bg-sky-50/20 rounded-t-full border border-zinc-100 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Award className="w-7 h-7 text-sky-600" />
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 text-center uppercase">02 / ACADEMIC CLOUT</span>
                </div>
              </div>
              <div className="text-center mt-5 space-y-1.5">
                <h3 className="text-xl font-serif text-zinc-950 italic font-light group-hover:text-purple-600 transition-colors">Trivia GK Mode</h3>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 block">COMPETITIVE MULTIPLIERS</span>
              </div>
            </motion.div>
 
            {/* Mode 3: Cosmetic Shop */}
            <motion.div 
              onClick={onEnterApp}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-[3/4] rounded-t-full border border-zinc-200 overflow-hidden bg-white relative flex items-center justify-center group-hover:border-purple-300/40 transition-all duration-500 shadow-md backdrop-blur-[20px] group-hover:shadow-lg">
                {/* Visual content inside arch */}
                <div className="absolute inset-x-4 bottom-0 top-12 bg-pink-50/20 rounded-t-full border border-zinc-100 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Coins className="w-7 h-7 text-pink-600" />
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 text-center uppercase">03 / COSMETIC ASSETS</span>
                </div>
              </div>
              <div className="text-center mt-5 space-y-1.5">
                <h3 className="text-xl font-serif text-zinc-950 italic font-light group-hover:text-purple-600 transition-colors">Ghost Shop</h3>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 block">TITLES, FRAMES & SKINS</span>
              </div>
            </motion.div>
 
            {/* Mode 4: Multiplayer Matchmaking */}
            <motion.div 
              onClick={onEnterApp}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-[3/4] rounded-t-full border border-zinc-200 overflow-hidden bg-white relative flex items-center justify-center group-hover:border-purple-300/40 transition-all duration-500 shadow-md backdrop-blur-[20px] group-hover:shadow-lg">
                {/* Visual content inside arch */}
                <div className="absolute inset-x-4 bottom-0 top-12 bg-purple-50/20 rounded-t-full border border-zinc-100 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-7 h-7 text-purple-650" />
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 text-center uppercase">04 / MULTIPLAYER VOID</span>
                </div>
              </div>
              <div className="text-center mt-5 space-y-1.5">
                <h3 className="text-xl font-serif text-zinc-950 italic font-light group-hover:text-purple-600 transition-colors">Lobbies & Clans</h3>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 block">CUSTOM ROOM CODES</span>
              </div>
            </motion.div>
 
          </div>
 
        </div>
      </section>
 
      {/* PROCESS / STATS SECTION WITH THIN DIVIDERS */}
      <section className="bg-zinc-50 py-24 relative z-10 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200 text-center md:text-left">
            
            {/* Stat 1 */}
            <div className="space-y-3 pt-6 md:pt-0 md:pl-0 flex flex-col justify-between">
              <span className="text-purple-600 text-sm">✦</span>
              <div>
                <div className="text-4xl md:text-5xl font-serif text-zinc-950 font-light">25K+</div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400 block mt-1.5">MATCHES COMPLETED</span>
              </div>
            </div>
 
            {/* Stat 2 */}
            <div className="space-y-3 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
              <span className="text-purple-600 text-sm">☾</span>
              <div>
                <div className="text-4xl md:text-5xl font-serif text-zinc-950 font-light">12+</div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400 block mt-1.5">ACTIVE CATEGORIES</span>
              </div>
            </div>
 
            {/* Stat 3 */}
            <div className="space-y-3 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
              <span className="text-purple-600 text-sm">✦</span>
              <div>
                <div className="text-4xl md:text-5xl font-serif text-zinc-950 font-light">50+</div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400 block mt-1.5">UNLOCKABLE ASSETS</span>
              </div>
            </div>
 
            {/* Stat 4 */}
            <div className="space-y-3 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
              <span className="text-purple-600 text-sm">◯</span>
              <div>
                <div className="text-4xl md:text-5xl font-serif text-zinc-950 font-light">100%</div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400 block mt-1.5">DEDICATION TO GAMEPLAY</span>
              </div>
            </div>
 
          </div>
        </div>
      </section>
 
      {/* CALL TO ACTION & MOUNTAIN LANDSCAPE FOOTER */}
      <section className="max-w-4xl mx-auto px-6 py-28 text-center space-y-8 relative z-10">
        <h2 className="text-5xl md:text-7xl font-serif font-light text-zinc-950 leading-tight">
          LET'S UNLOCK <br />
          <span className="font-serif italic text-purple-650">CELESTIAL HIGHSCORES</span> TOGETHER
        </h2>
        
        <p className="text-zinc-500 text-xs md:text-sm font-mono uppercase tracking-[0.3em] max-w-md mx-auto">
          Prove your internet clout or academic dominance. Enter the platform.
        </p>
 
        <div className="pt-4">
          <button
            id="btn-landing-final-cta"
            onClick={onEnterApp}
            className="px-12 h-14 bg-zinc-950 hover:bg-zinc-900 text-white font-sans tracking-[0.25em] text-xs rounded-full cursor-pointer transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 uppercase font-extrabold shadow-md"
          >
            ENTER THE VOID ✦
          </button>
        </div>
 
        {/* CRESCENT MOON LANDSCAPE */}
        <div className="pt-20 flex justify-center">
          <div className="w-[190px] h-[190px] rounded-full border border-zinc-200 relative overflow-hidden bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center group shadow-md">
            {/* Stars background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
            
            {/* Glowing moon */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-100/10 shadow-[0_0_20px_rgba(251,243,220,0.2)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-amber-100/90 relative overflow-hidden">
                {/* Crescent shadow mask */}
                <div className="absolute w-8 h-8 rounded-full bg-zinc-950 -top-1 -right-2" />
              </div>
            </div>
 
            {/* Mountains silhouette */}
            <svg viewBox="0 0 100 100" className="absolute bottom-0 w-full h-1/2 fill-zinc-950 stroke-zinc-800 stroke-1">
              <polygon points="0,50 30,20 60,50 40,50" />
              <polygon points="30,50 65,15 100,50" />
              <polygon points="15,50 45,25 75,50" />
            </svg>
          </div>
        </div>
      </section>
 
      {/* FOOTER METADATA */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-zinc-200 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-zinc-950 font-serif italic text-xs tracking-wider">hello@ghostedstudio.com</div>
          <div>www.ghostedstudio.com</div>
        </div>
        
        <div className="flex gap-4">
          <span className="hover:text-zinc-950 transition-colors cursor-pointer">INSTAGRAM</span>
          <span>/</span>
          <span className="hover:text-zinc-950 transition-colors cursor-pointer">TWITTER</span>
          <span>/</span>
          <span className="hover:text-zinc-950 transition-colors cursor-pointer">BEHANCE</span>
        </div>
 
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-purple-600" />
          <span>BY GHOSTS WORLDWIDE</span>
        </div>
      </footer>

    </div>
  );
};
