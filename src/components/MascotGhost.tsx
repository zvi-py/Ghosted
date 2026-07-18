import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';

interface MascotGhostProps {
  skinId?: string;
  mood?: 'idle' | 'happy' | 'sad' | 'shocked' | 'cool' | 'chaos' | 'correct' | 'wrong' | 'combo' | 'perfect' | 'unlock';
  size?: number;
  className?: string;
  animate?: boolean;
  gender?: 'girl' | 'boy';
}

export const MascotGhost: React.FC<MascotGhostProps> = ({
  skinId = 'skin_default',
  mood = 'idle',
  size = 120,
  className = '',
  animate = true,
  gender
}) => {
  // Safe extraction of gender from GameContext if not explicitly provided
  let userGender: 'girl' | 'boy' = 'girl';
  try {
    const context = useGame();
    if (context && context.user && context.user.gender) {
      userGender = context.user.gender;
    }
  } catch (e) {
    // Fallback if rendered outside of GameProvider
  }

  const activeGender = gender || userGender;

  // Idle sub-action cycle: looks around, tiny smile, adjusts glasses, small wave every 8 seconds
  const [idlePhase, setIdlePhase] = useState<'normal' | 'look' | 'adjust' | 'wave'>('normal');

  useEffect(() => {
    if (mood !== 'idle' || !animate) {
      setIdlePhase('normal');
      return;
    }
    const interval = setInterval(() => {
      const phases: ('look' | 'adjust' | 'wave')[] = ['look', 'adjust', 'wave'];
      const nextPhase = phases[Math.floor(Math.random() * phases.length)];
      setIdlePhase(nextPhase);
      
      // Return to normal after 2.5s of action
      const timeout = setTimeout(() => {
        setIdlePhase('normal');
      }, 2500);

      return () => clearTimeout(timeout);
    }, 8000);

    return () => clearInterval(interval);
  }, [mood, animate]);

  // Resolve skin colors and accessories
  let hoodieBgStart = '#ffffff';
  let hoodieBgEnd = '#e4e4e7';
  let hoodieShadow = '#cbd5e1';
  let drawstringsColor = '#94a3b8';
  let sneakerSole = '#ef4444';
  let pantsBgStart = '#fbbf24';
  let pantsBgEnd = '#f59e0b';
  let hairBgStart = '#ffffff';
  let hairBgEnd = '#cbd5e1';
  let hairShadow = '#94a3b8';

  // Helper flags for unique rendering
  let hasSakura = false;
  let hasHorns = false;
  let hasBearEars = false;
  let hasSlimeFriend = false;
  let hasHeadphones = false;
  let hasHaloAndWings = false;
  let hasCyberGrids = false;
  let hasWaves = false;
  let hasStars = false;

  switch (skinId) {
    case 'skin_default':
    default:
      hoodieBgStart = '#ffffff';
      hoodieBgEnd = '#e2e8f0';
      hoodieShadow = '#cbd5e1';
      drawstringsColor = '#94a3b8';
      sneakerSole = '#ef4444';
      pantsBgStart = '#fbbf24';
      pantsBgEnd = '#d97706';
      hairBgStart = activeGender === 'girl' ? '#ffffff' : '#3f3f46';
      hairBgEnd = activeGender === 'girl' ? '#e2e8f0' : '#18181b';
      hairShadow = activeGender === 'girl' ? '#cbd5e1' : '#09090b';
      break;

    case 'skin_galaxy':
      // Galaxy Drifter
      hoodieBgStart = '#3b0764';
      hoodieBgEnd = '#120024';
      hoodieShadow = '#0c0018';
      drawstringsColor = '#c084fc';
      sneakerSole = '#c084fc';
      pantsBgStart = '#1e1b4b';
      pantsBgEnd = '#0f172a';
      hairBgStart = activeGender === 'girl' ? '#d8b4fe' : '#120024';
      hairBgEnd = activeGender === 'girl' ? '#8b5cf6' : '#090012';
      hairShadow = activeGender === 'girl' ? '#5b21b6' : '#000000';
      hasStars = true;
      break;

    case 'skin_sakura':
      // Sakura Bloom
      hoodieBgStart = '#fff1f2';
      hoodieBgEnd = '#ffe4e6';
      hoodieShadow = '#fecdd3';
      drawstringsColor = '#f43f5e';
      sneakerSole = '#fda4af';
      pantsBgStart = '#fb7185';
      pantsBgEnd = '#e11d48';
      hairBgStart = activeGender === 'girl' ? '#fff5f5' : '#271217';
      hairBgEnd = activeGender === 'girl' ? '#fecdd3' : '#170509';
      hairShadow = activeGender === 'girl' ? '#fda4af' : '#000000';
      hasSakura = true;
      break;

    case 'skin_hacker':
      // Cyber Hacker
      hoodieBgStart = '#18181b';
      hoodieBgEnd = '#09090b';
      hoodieShadow = '#000000';
      drawstringsColor = '#8b5cf6';
      sneakerSole = '#a855f7';
      pantsBgStart = '#27272a';
      pantsBgEnd = '#18181b';
      hairBgStart = activeGender === 'girl' ? '#c084fc' : '#09090b';
      hairBgEnd = activeGender === 'girl' ? '#6b21a8' : '#020202';
      hairShadow = activeGender === 'girl' ? '#4c1d95' : '#000000';
      hasCyberGrids = true;
      break;

    case 'skin_ocean':
      // Ocean Spirit
      hoodieBgStart = '#bae6fd';
      hoodieBgEnd = '#38bdf8';
      hoodieShadow = '#0284c7';
      drawstringsColor = '#0369a1';
      sneakerSole = '#22d3ee';
      pantsBgStart = '#0c4a6e';
      pantsBgEnd = '#0369a1';
      hairBgStart = activeGender === 'girl' ? '#f0f9ff' : '#0f172a';
      hairBgEnd = activeGender === 'girl' ? '#bae6fd' : '#020617';
      hairShadow = activeGender === 'girl' ? '#7dd3fc' : '#000000';
      hasWaves = true;
      break;

    case 'skin_oni':
      // Oni Demon
      hoodieBgStart = '#1f1616';
      hoodieBgEnd = '#0c0000';
      hoodieShadow = '#580808';
      drawstringsColor = '#ef4444';
      sneakerSole = '#f43f5e';
      pantsBgStart = '#3f0712';
      pantsBgEnd = '#18181b';
      hairBgStart = activeGender === 'girl' ? '#fff1f2' : '#0a0505';
      hairBgEnd = activeGender === 'girl' ? '#fecdd3' : '#020101';
      hairShadow = activeGender === 'girl' ? '#fda4af' : '#000000';
      hasHorns = true;
      break;

    case 'skin_bear':
      // Honey Bear
      hoodieBgStart = '#fef08a';
      hoodieBgEnd = '#facc15';
      hoodieShadow = '#ca8a04';
      drawstringsColor = '#78350f';
      sneakerSole = '#ca8a04';
      pantsBgStart = '#78350f';
      pantsBgEnd = '#451a03';
      hairBgStart = activeGender === 'girl' ? '#f59e0b' : '#3f1f0a';
      hairBgEnd = activeGender === 'girl' ? '#ca8a04' : '#1c0a02';
      hairShadow = activeGender === 'girl' ? '#78350f' : '#000000';
      hasBearEars = true;
      break;

    case 'skin_slime_gamer':
      // Slime Gamer
      hoodieBgStart = '#bbf7d0';
      hoodieBgEnd = '#4ade80';
      hoodieShadow = '#16a34a';
      drawstringsColor = '#15803d';
      sneakerSole = '#22c55e';
      pantsBgStart = '#064e3b';
      pantsBgEnd = '#14532d';
      hairBgStart = activeGender === 'girl' ? '#f0fdf4' : '#14532d';
      hairBgEnd = activeGender === 'girl' ? '#bbf7d0' : '#052e16';
      hairShadow = activeGender === 'girl' ? '#86efac' : '#000000';
      hasSlimeFriend = true;
      break;

    case 'skin_glitch':
      // Glitch Neon
      hoodieBgStart = '#0a0a0c';
      hoodieBgEnd = '#181824';
      hoodieShadow = '#d946ef';
      drawstringsColor = '#06b6d4';
      sneakerSole = '#f43f5e';
      pantsBgStart = '#1e1b4b';
      pantsBgEnd = '#312e81';
      hairBgStart = activeGender === 'girl' ? '#f472b6' : '#111827';
      hairBgEnd = activeGender === 'girl' ? '#c084fc' : '#020617';
      hairShadow = activeGender === 'girl' ? '#4a044e' : '#000000';
      hasHeadphones = true;
      break;

    case 'skin_angel':
      // Celestial Angel (Mythic)
      hoodieBgStart = '#fffdf5';
      hoodieBgEnd = '#fef08a';
      hoodieShadow = '#ca8a04';
      drawstringsColor = '#d97706';
      sneakerSole = '#fbbf24';
      pantsBgStart = '#fde047';
      pantsBgEnd = '#eab308';
      hairBgStart = activeGender === 'girl' ? '#fffbf0' : '#27272a';
      hairBgEnd = activeGender === 'girl' ? '#fef08a' : '#09090b';
      hairShadow = activeGender === 'girl' ? '#fde047' : '#000000';
      hasHaloAndWings = true;
      break;
  }

  // Floating/Squatting bouncy animation settings (Disabled by default)
  const floatTransition = undefined;
  const floatAnimate = undefined;

  // Render highly-detailed anime eyes and round glasses
  const renderFaceAndGlasses = () => {
    const leftX = 44;
    const rightX = 76;
    const eyeY = 46;
    const glassY = 51;
    const glassR = 14.5;

    // Eye blinking helper
    const blinkAnimate = animate
      ? { scaleY: [1, 1, 1, 1, 0.1, 1, 1, 1] }
      : undefined;
    const blinkTransition = animate
      ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
      : undefined;

    // Resolve current active emotion
    const isHappy = mood === 'happy' || mood === 'correct' || mood === 'combo' || mood === 'perfect' || mood === 'unlock';
    const isSad = mood === 'sad' || mood === 'wrong';
    const isShocked = mood === 'shocked';
    const isCool = mood === 'cool';
    const isChaos = mood === 'chaos';

    return (
      <g id="mascot-face">
        {/* ROSY BLUSH (Under eyes, always present for cute factor!) */}
        <ellipse cx="33" cy="56" rx="5.5" ry="3" fill="#f43f5e" opacity="0.35" />
        <ellipse cx="87" cy="56" rx="5.5" ry="3" fill="#f43f5e" opacity="0.35" />

        {isHappy && (
          <g opacity="0.5">
            <path d="M 28 56 Q 33 53 38 56" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 82 56 Q 87 53 92 56" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ANIME EYE DRAWINGS */}
        <g id="anime-eyes">
          {isHappy ? (
            // Curved anime happy smile eyes
            <>
              <path d="M 36 44 Q 44 36 49 45" stroke="#1f2937" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 71 45 Q 76 36 84 44" stroke="#1f2937" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            </>
          ) : isSad ? (
            // Drooping crying eyes
            <>
              <path d="M 37 46 Q 44 50 49 44" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 71 44 Q 76 50 83 46" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Floating tears */}
              <motion.path
                d="M 37 49 Q 34 58 35 63"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.path
                d="M 83 49 Q 86 58 85 63"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </>
          ) : isShocked ? (
            // Wide blank circles
            <>
              <ellipse cx="44" cy="45" rx="5" ry="6" fill="#ffffff" stroke="#1f2937" strokeWidth="1.8" />
              <circle cx="44" cy="45" r="2" fill="#1f2937" />
              <ellipse cx="76" cy="45" rx="5" ry="6" fill="#ffffff" stroke="#1f2937" strokeWidth="1.8" />
              <circle cx="76" cy="45" r="2" fill="#1f2937" />
            </>
          ) : isChaos ? (
            // Playful x-eyes
            <>
              <path d="M 38 42 L 48 50 M 48 42 L 38 50" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
              <path d="M 72 42 L 82 50 M 82 42 L 72 50" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            // Regular gorgeous expressive anime eyes with white highlights!
            <motion.g animate={blinkAnimate} transition={blinkTransition} style={{ transformOrigin: `60px ${eyeY}px` }}>
              {/* Left Eye */}
              <g transform="translate(0,0)">
                <ellipse cx="43" cy={eyeY} rx="7" ry="10" fill="url(#eyeGradient)" />
                {/* Highlights */}
                <circle cx="41" cy="41" r="2.5" fill="#ffffff" />
                <circle cx="45" cy="49" r="1.2" fill="#ffffff" />
                {/* Eyelash */}
                <path d="M 34 43 Q 43 38 51 45" stroke="#1f2937" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                <path d="M 33 45 L 30 43" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" />
              </g>
              {/* Right Eye */}
              <g transform="translate(0,0)">
                <ellipse cx="77" cy={eyeY} rx="7" ry="10" fill="url(#eyeGradient)" />
                {/* Highlights */}
                <circle cx="75" cy="41" r="2.5" fill="#ffffff" />
                <circle cx="79" cy="49" r="1.2" fill="#ffffff" />
                {/* Eyelash */}
                <path d="M 69 45 Q 77 38 86 43" stroke="#1f2937" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                <path d="M 87 45 L 90 43" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            </motion.g>
          )}
        </g>

        {/* IDLE ANIMATION SPECIAL action: LOOKS AROUND (eyes translate slightly) */}
        {mood === 'idle' && idlePhase === 'look' && (
          <g opacity="0.15" transform="translate(2.5, 0)">
            <ellipse cx="43" cy={eyeY} rx="7" ry="10" fill="#000000" />
            <ellipse cx="77" cy={eyeY} rx="7" ry="10" fill="#000000" />
          </g>
        )}

        {/* CUTEST TINY MOUTH */}
        <g id="anime-mouth">
          {isHappy ? (
            // Big open happy mouth (gacha game style!)
            <path d="M 55 58 Q 60 66 65 58 Z" fill="#e11d48" stroke="#1f2937" strokeWidth="1.5" />
          ) : isSad ? (
            // Tiny sad curve
            <path d="M 57 61 Q 60 57 63 61" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : isShocked ? (
            // Small gasp circle
            <ellipse cx="60" cy="59" rx="3.5" ry="4.5" fill="#e11d48" stroke="#1f2937" strokeWidth="1.5" />
          ) : isChaos ? (
            // Playful tongue out
            <g transform="translate(0, 1)">
              <path d="M 55 58 C 55 64, 65 64, 65 58 Z" fill="#f43f5e" />
              <path d="M 54 58 Q 60 59 66 58" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            // Cute tiny open smiley mouth (standard cat mouth / "3" mouth!)
            <path d="M 56 58 Q 58 60 60 58 Q 62 60 64 58" stroke="#1f2937" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          )}
        </g>

        {/* BLACK ROUND SUNGLASSES (Slid down slightly in happy mood, always semi-transparent for premium look) */}
        <g id="sunglasses" transform={isHappy ? 'translate(0, 5)' : 'translate(0, 0)'} opacity={isSad ? 0.35 : 0.88}>
          {/* Glasses Bridge */}
          <line x1={leftX + 8} y1={glassY - 4} x2={rightX - 8} y2={glassY - 4} stroke="#1f2937" strokeWidth="3" />
          {/* Left Lens */}
          <circle cx={leftX} cy={glassY} r={glassR} fill="url(#lensGradient)" stroke="#1f2937" strokeWidth="2.5" />
          <path d="M 33 46 Q 44 42 39 52" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
          {/* Right Lens */}
          <circle cx={rightX} cy={glassY} r={glassR} fill="url(#lensGradient)" stroke="#1f2937" strokeWidth="2.5" />
          <path d="M 65 46 Q 76 42 71 52" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />

          {/* Cool Sunglasses gleam indicator */}
          {isCool && (
            <motion.polygon
              points="28,34 31,37 36,37 33,39 34,43 30,41 26,43 27,39 24,37 28,37"
              fill="#fbbf24"
              className="origin-center"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          )}
        </g>
      </g>
    );
  };

  return (
    <motion.div
      className={`inline-block select-none ${className}`}
      style={{ width: size, height: size }}
      animate={floatAnimate}
      transition={floatTransition}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]">
        {/* CUSTOM GRADIENTS & SHADERS */}
        <defs>
          {/* Eyes Expressive color gradient */}
          <radialGradient id="eyeGradient" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="60%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#6366f1" />
          </radialGradient>

          {/* Sunglasses Semi-transparent Lens gradient */}
          <linearGradient id="lensGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </linearGradient>

          {/* Character skin peach gradient */}
          <radialGradient id="skinGradient" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fff8f8" />
            <stop offset="70%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </radialGradient>

          {/* Hoodie dynamic gradients */}
          <linearGradient id="hoodieGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hoodieBgStart} />
            <stop offset="100%" stopColor={hoodieBgEnd} />
          </linearGradient>

          {/* Pants dynamic gradient */}
          <linearGradient id="pantsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pantsBgStart} />
            <stop offset="100%" stopColor={pantsBgEnd} />
          </linearGradient>

          {/* Hair dynamic gradient */}
          <linearGradient id="hairGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hairBgStart} />
            <stop offset="100%" stopColor={hairBgEnd} />
          </linearGradient>

          {/* Hologram or grid shading */}
          <pattern id="hackerGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#a855f7" strokeWidth="0.4" opacity="0.35" />
          </pattern>
        </defs>

        {/* CELESTIAL ANGEL BACK WINGS ACCESSORY */}
        {hasHaloAndWings && (
          <g id="angel-wings">
            {/* Left wing */}
            <motion.path
              d="M 24 45 C -6 32, -16 66, 12 76 C 18 66, 21 56, 24 45 Z"
              fill="#ffffff"
              opacity="0.95"
              stroke="#fbbf24"
              strokeWidth="1.2"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '24px 45px' }}
            />
            {/* Right wing */}
            <motion.path
              d="M 96 45 C 126 32, 136 66, 108 76 C 102 66, 99 56, 96 45 Z"
              fill="#ffffff"
              opacity="0.95"
              stroke="#fbbf24"
              strokeWidth="1.2"
              animate={{ rotate: [3, -3, 3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              style={{ transformOrigin: '96px 45px' }}
            />
          </g>
        )}

        {/* BACKDROP PARTICLES (Galaxy stars, Cherry blossoms, Cyber grids, Slime bubbles, Angel rays) */}
        <g id="skin-background-particles">
          {hasStars && (
            <g opacity="0.8">
              <circle cx="20" cy="30" r="1.5" fill="#e9d5ff" className="animate-ping" />
              <circle cx="102" cy="40" r="1.2" fill="#c084fc" className="animate-pulse" />
              <polygon points="12,65 14,68 17,68 14,70 15,73 12,71 9,73 10,70 7,68 10,68" fill="#fef08a" opacity="0.6" />
              <polygon points="108,70 109,72 111,72 109,73 110,75 108,74 106,75 107,73 105,72 107,72" fill="#fef08a" opacity="0.6" />
            </g>
          )}
          {hasSakura && (
            <g opacity="0.8">
              {/* Petals */}
              <motion.path d="M 12 25 C 8 25, 6 29, 10 32 C 14 30, 14 26, 12 25" fill="#fbcfe8" animate={{ y: [0, 8, 0], x: [0, 2, 0], rotate: [0, 45, 0] }} transition={{ duration: 3, repeat: Infinity }} />
              <motion.path d="M 106 32 C 102 32, 100 36, 104 39 C 108 37, 108 33, 106 32" fill="#fbcfe8" animate={{ y: [0, 6, 0], x: [0, -3, 0], rotate: [0, -35, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
            </g>
          )}
          {hasCyberGrids && (
            <g opacity="0.4">
              <rect x="25" y="65" width="70" height="25" fill="url(#hackerGrid)" />
              <circle cx="18" cy="80" r="2" fill="#a855f7" className="animate-ping" />
              <circle cx="102" cy="74" r="1.5" fill="#22d3ee" className="animate-pulse" />
            </g>
          )}
          {hasWaves && (
            <g opacity="0.7">
              <circle cx="15" cy="40" r="2" fill="#bae6fd" opacity="0.6" className="animate-ping" />
              <circle cx="105" cy="55" r="1.5" fill="#38bdf8" opacity="0.5" className="animate-bounce" />
            </g>
          )}
        </g>

        {/* GROUND BASE SHADOW */}
        <ellipse cx="60" cy="114" rx="36" ry="5" fill="rgba(0, 0, 0, 0.45)" />

        {/* CHUNKY SNEAKERS & BAGGY PANTS - LOWER BODY */}
        <g id="mascot-legs">
          {/* LEFT LEG & SNEAKER */}
          <g>
            {/* Baggy pants fold */}
            <path d="M 32 84 C 18 84, 10 97, 21 106 C 27 106, 37 101, 39 91 Z" fill="url(#pantsGradient)" />
            <path d="M 32 84 C 18 84, 10 97, 21 106" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" />
            {/* Chunky Sneaker */}
            <rect x="15" y="102" width="23" height="11" rx="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            {/* Sneaker sole trim */}
            <path d="M 15 109 Q 26 112, 38 109" stroke={sneakerSole} strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Cute laces */}
            <line x1="22" y1="104" x2="28" y2="104" stroke="#475569" strokeWidth="1.5" />
            <line x1="23" y1="107" x2="27" y2="107" stroke="#475569" strokeWidth="1.5" />
          </g>

          {/* RIGHT LEG & SNEAKER */}
          <g>
            {/* Baggy pants fold */}
            <path d="M 88 84 C 102 84, 110 97, 99 106 C 93 106, 83 101, 81 91 Z" fill="url(#pantsGradient)" />
            <path d="M 88 84 C 102 84, 110 97, 99 106" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" />
            {/* Chunky Sneaker */}
            <rect x="82" y="102" width="23" height="11" rx="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            {/* Sneaker sole trim */}
            <path d="M 82 109 Q 93 112, 105 109" stroke={sneakerSole} strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Cute laces */}
            <line x1="89" y1="104" x2="95" y2="104" stroke="#475569" strokeWidth="1.5" />
            <line x1="90" y1="107" x2="94" y2="107" stroke="#475569" strokeWidth="1.5" />
          </g>
        </g>

        {/* OVERSIZED HOODIE BAGGY TORSO */}
        <g id="mascot-torso">
          {/* Cozy baggy body shape */}
          <path d="M 28 58 C 18 69, 18 89, 28 97 Q 60 100, 92 97 C 102 89, 102 69, 92 58 Z" fill="url(#hoodieGradient)" />

          {/* Cyber accents if hacker */}
          {hasCyberGrids && (
            <path d="M 38 68 H 82 M 46 78 H 74 M 60 62 V 92" stroke="#a855f7" strokeWidth="1.2" opacity="0.3" strokeDasharray="3 3" />
          )}

          {/* Waves detailing for ocean spirit */}
          {hasWaves && (
            <g opacity="0.4">
              <path d="M 32 80 Q 46 76, 60 80 Q 74 84, 88 80" stroke="#0ea5e9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 36 86 Q 48 83, 60 86 Q 72 89, 84 86" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Star shapes */}
          {hasStars && (
            <g opacity="0.65">
              <polygon points="46,67 48,70 51,70 49,72 50,75 46,73 42,75 43,72 41,70 44,70" fill="#c084fc" />
              <polygon points="76,76 77,78 80,78 78,79 79,82 76,80 73,82 74,79 72,78 75,78" fill="#fde047" />
            </g>
          )}

          {/* Hoodie shadow and borders */}
          <path d="M 28 58 C 21 68, 20 85, 28 95" stroke={hoodieShadow} strokeWidth="2.2" fill="none" />
          <path d="M 92 58 C 99 68, 100 85, 92 95" stroke={hoodieShadow} strokeWidth="2.2" fill="none" />
          <path d="M 26 95 C 42 98, 78 98, 94 95" stroke={hoodieShadow} strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Center zipper/stitch line */}
          <line x1="60" y1="58" x2="60" y2="95" stroke={hoodieShadow} strokeWidth="1.8" strokeDasharray="3 2" />

          {/* Cozy Drawstrings with decorative beads */}
          <g id="drawstrings">
            {/* Left string */}
            <path d="M 54 58 Q 50 74, 47 84" stroke="#f1f5f9" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 54 58 Q 50 74, 47 84" stroke={drawstringsColor} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <circle cx="47" cy="84" r="3" fill={drawstringsColor} />

            {/* Right string */}
            <path d="M 66 58 Q 70 74, 73 84" stroke="#f1f5f9" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 66 58 Q 70 74, 73 84" stroke={drawstringsColor} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <circle cx="73" cy="84" r="3" fill={drawstringsColor} />
          </g>
        </g>

        {/* BEAR EARS ON THE HOOD CONTRAST */}
        {hasBearEars && (
          <g id="bear-ears">
            <circle cx="34" cy="16" r="10" fill="url(#hoodieGradient)" stroke={hoodieShadow} strokeWidth="1.5" />
            <circle cx="34" cy="16" r="6" fill="#fca5a5" opacity="0.8" />
            <circle cx="86" cy="16" r="10" fill="url(#hoodieGradient)" stroke={hoodieShadow} strokeWidth="1.5" />
            <circle cx="86" cy="16" r="6" fill="#fca5a5" opacity="0.8" />
          </g>
        )}

        {/* DEEP COZY HOOD DARK INSIDE VOID */}
        <path d="M 28 62 C 24 33, 32 18, 60 18 C 88 18, 96 33, 92 62 Z" fill="#0f0c1b" />

        {/* HAIR - BACK SIDE (For Girls - Flowing beautiful hair strands) */}
        {activeGender === 'girl' && (
          <g id="hair-back">
            <path d="M 28 58 C 20 68, 28 84, 28 90" stroke="url(#hairGradient)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 28 58 C 20 68, 28 84, 28 90" stroke={hairShadow} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 92 58 C 100 68, 92 84, 92 90" stroke="url(#hairGradient)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 92 58 C 100 68, 92 84, 92 90" stroke={hairShadow} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* CHIBI PEACH FACE SKIN */}
        <path d="M 33 50 C 33 37, 87 37, 87 50 C 87 65, 75 71, 60 71 C 45 71, 33 65, 33 50 Z" fill="url(#skinGradient)" />

        {/* HAIR - FRONT SIDE (Boy style is messy; girl style is elegant hime cut) */}
        {activeGender === 'girl' ? (
          <g id="hair-front-girl">
            {/* Long side locks */}
            <path d="M 32 44 C 27 55, 25 72, 31 82 C 33 82, 34 72, 32 54 Z" fill="url(#hairGradient)" />
            <path d="M 88 44 C 93 55, 95 72, 89 82 C 87 82, 86 72, 88 54 Z" fill="url(#hairGradient)" />
            {/* Front bangs */}
            <path d="M 32 44 C 42 36, 51 36, 56 45 C 58 36, 67 36, 69 45 C 73 36, 82 36, 88 44 L 88 38 C 88 28, 32 28, 32 38 Z" fill="url(#hairGradient)" />
            {/* Fine texture strokes */}
            <path d="M 34 46 C 33 56, 31 68, 32 76" stroke={hairShadow} strokeWidth="1" fill="none" />
            <path d="M 86 46 C 87 56, 89 68, 88 76" stroke={hairShadow} strokeWidth="1" fill="none" />
          </g>
        ) : (
          <g id="hair-front-boy">
            {/* Shaggy side burns */}
            <path d="M 32 44 C 30 50, 29 54, 31 58 C 33 58, 34 50, 33 44 Z" fill="url(#hairGradient)" />
            <path d="M 88 44 C 90 50, 91 54, 89 58 C 87 58, 86 50, 87 44 Z" fill="url(#hairGradient)" />
            {/* Messy spikes on forehead */}
            <path
              d="M 32 44 
                 Q 37 36, 41 43 
                 Q 45 34, 49 44 
                 Q 54 32, 58 42 
                 Q 63 34, 67 44 
                 Q 71 36, 75 42 
                 Q 81 34, 88 44
                 L 88 38 C 88 28, 32 28, 32 38 Z"
              fill="url(#hairGradient)"
            />
            {/* Side spikes popping out */}
            <path d="M 32 40 Q 26 37, 30 33 Q 32 33, 33 37 Z" fill="url(#hairGradient)" />
            <path d="M 88 40 Q 94 37, 90 33 Q 88 33, 87 37 Z" fill="url(#hairGradient)" />
          </g>
        )}

        {/* SAKURA FLOWER ORNAMENT */}
        {hasSakura && (
          <g transform="translate(80, 32) scale(0.65)" id="sakura-clip">
            <circle cx="0" cy="0" r="4.5" fill="#f43f5e" />
            <path d="M 0 0 C -6 -6, -6 -12, 0 -12 C 6 -12, 6 -6, 0 0" fill="#ffd1dc" />
            <path d="M 0 0 C 6 -6, 12 -6, 12 0 C 12 6, 6 6, 0 0" fill="#ffd1dc" />
            <path d="M 0 0 C 6 6, 6 12, 0 12 C -6 12, -6 6, 0 0" fill="#ffd1dc" />
            <path d="M 0 0 C -6 6, -12 6, -12 0 C -12 -6, -6 -6, 0 0" fill="#ffd1dc" />
            <circle cx="0" cy="0" r="2.2" fill="#f59e0b" />
          </g>
        )}

        {/* JELLYFISH COMPANION / BARRETTE FOR OCEAN */}
        {skinId === 'skin_ocean' && (
          <g transform="translate(76, 32) scale(0.65)" opacity="0.95" id="ocean-companion">
            <path d="M -7 0 C -7 -10, 7 -10, 7 0 Z" fill="#00d8ff" />
            <path d="M -4 1 L -4 8 M 0 1 L 0 11 M 4 1 L 4 8" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="-2.2" cy="-3" r="1.2" fill="#ffffff" />
            <circle cx="2.2" cy="-3" r="1.2" fill="#ffffff" />
          </g>
        )}

        {/* FACE EMOTION LAYER */}
        {renderFaceAndGlasses()}

        {/* THE OVERSIZED HOOD FABRIC OUTER WRAP */}
        <path d="M 22 64 C 15 28, 26 10, 60 10 C 94 10, 105 28, 98 64 C 100 70, 94 76, 92 70 C 92 30, 78 16, 60 16 C 42 16, 28 30, 28 70 C 26 76, 20 70, 22 64 Z" fill="url(#hoodieGradient)" />
        <path d="M 26 64 C 21 30, 30 14, 60 14 C 90 14, 99 30, 94 64" stroke={hoodieShadow} strokeWidth="1.8" fill="none" />

        {/* ONI DEMON TINY HORNS ACCESSORY */}
        {hasHorns && (
          <g id="oni-horns">
            <path d="M 31 15 Q 18 5, 22 1 Q 33 6, 35 15 Z" fill="#f43f5e" stroke="#991b1b" strokeWidth="1.2" />
            <path d="M 89 15 Q 102 5, 98 1 Q 87 6, 85 15 Z" fill="#f43f5e" stroke="#991b1b" strokeWidth="1.2" />
          </g>
        )}

        {/* SLIME GAMER COMPANION ON TOP */}
        {hasSlimeFriend && (
          <g transform="translate(0, 1)" id="slime-friend">
            <path d="M 50 11 Q 60 3, 70 11 Q 76 15, 60 15 Q 44 15, 50 11 Z" fill="#34d399" stroke="#047857" strokeWidth="1" />
            <circle cx="56" cy="10.5" r="1" fill="#064e3b" />
            <circle cx="64" cy="10.5" r="1" fill="#064e3b" />
            <path d="M 58 12.5 Q 60 14 62 12.5" stroke="#064e3b" strokeWidth="0.8" fill="none" />
          </g>
        )}

        {/* NEON HEADPHONES FOR CYBER GLITCH */}
        {hasHeadphones && (
          <g id="cyber-headphones">
            {/* Neon Band */}
            <path d="M 26 31 A 37 37 0 0 1 94 31" stroke="#d946ef" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Ear Cups */}
            <ellipse cx="23" cy="35" rx="6" ry="10" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
            <circle cx="23" cy="35" r="3" fill="#d946ef" />
            <ellipse cx="97" cy="35" rx="6" ry="10" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
            <circle cx="97" cy="35" r="3" fill="#d946ef" />
          </g>
        )}

        {/* FLOATING GOLDEN HALO FOR CELESTIAL MYTHIC */}
        {hasHaloAndWings && (
          <ellipse cx="60" cy="4" rx="20" ry="4" stroke="#fbbf24" strokeWidth="2.8" fill="none" className="animate-pulse" />
        )}

        {/* PUFFY SLEEVES & TINY HANDS - ARMS */}
        {/* LEFT ARM */}
        <motion.g
          id="left-arm"
          animate={
            mood === 'idle' && idlePhase === 'wave'
              ? { rotate: [-10, 20, -10, 20, -10], y: [0, -3, 0] }
              : { rotate: [-2, 2, -2], y: [0, -0.4, 0] }
          }
          transition={
            mood === 'idle' && idlePhase === 'wave'
              ? { duration: 1.5, ease: 'easeInOut' }
              : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transformOrigin: '28px 58px' }}
        >
          {/* Puffy Sleeve */}
          <path d="M 28 58 C 16 58, 4 62, 2 70 C 1 74, 14 78, 22 73 C 28 68, 30 62, 28 58 Z" fill="url(#hoodieGradient)" />
          <path d="M 2 70 Q 11 75, 20 72" stroke={hoodieShadow} strokeWidth="1.8" fill="none" />
          {/* Tiny Hand */}
          <path d="M 2 71 C -2 71, -4 76, 1 78 C 4 79, 8 77, 7 73 Z" fill="#ffe4e6" />
        </motion.g>

        {/* RIGHT ARM */}
        <motion.g
          id="right-arm"
          animate={
            mood === 'idle' && idlePhase === 'adjust'
              ? { y: [0, -10, -10, 0], x: [0, -6, -6, 0], rotate: [0, -15, -15, 0] }
              : { rotate: [2, -2, 2], y: [0, -0.4, 0] }
          }
          transition={
            mood === 'idle' && idlePhase === 'adjust'
              ? { duration: 2, ease: 'easeInOut' }
              : { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }
          }
          style={{ transformOrigin: '92px 58px' }}
        >
          {/* Puffy Sleeve */}
          <path d="M 92 58 C 104 58, 116 62, 118 70 C 119 74, 106 78, 98 73 C 92 68, 90 62, 92 58 Z" fill="url(#hoodieGradient)" />
          <path d="M 118 70 Q 109 75, 100 72" stroke={hoodieShadow} strokeWidth="1.8" fill="none" />
          {/* Tiny Hand */}
          <path d="M 118 71 C 122 71, 124 76, 119 78 C 116 79, 112 77, 113 73 Z" fill="#ffe4e6" />
        </motion.g>

        {/* EXTRA FLOATING REACTIONS & AURAS ON TOP OF EVERYTHING */}
        {/* CORRECT/HAPPY STARS */}
        {(mood === 'happy' || mood === 'correct' || mood === 'unlock') && (
          <g id="sparkle-effects">
            <motion.path
              d="M 10 15 L 12 21 L 18 21 L 14 24 L 16 29 L 10 26 L 4 29 L 6 24 L 2 21 L 8 21 Z"
              fill="#fbbf24"
              animate={{ scale: [0.5, 1.2, 0], opacity: [1, 1, 0], y: [0, -20] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.path
              d="M 110 25 L 111 29 L 115 29 L 112 31 L 113 35 L 110 33 L 107 35 L 108 31 L 105 29 L 109 29 Z"
              fill="#fbbf24"
              animate={{ scale: [0.5, 1.2, 0], opacity: [1, 1, 0], y: [0, -18] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
            />
          </g>
        )}

        {/* COMBO EYE SPARKLES AND RAINBOW */}
        {mood === 'combo' && (
          <g id="combo-rainbow-sparkles">
            {/* Mini rainbow path over head */}
            <path d="M 20 25 Q 60 -5 100 25" stroke="url(#comboRainbow)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
            <defs>
              <linearGradient id="comboRainbow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="25%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="75%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </g>
        )}

        {/* PERFECT STREAK: GHOST CROWN ON THE HOOD */}
        {mood === 'perfect' && (
          <g id="perfect-streak-crown" transform="translate(42, -10)">
            <motion.path
              d="M 2 12 L 8 4 L 18 10 L 28 4 L 34 12 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.5"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Crown gems */}
            <circle cx="8" cy="4" r="1.5" fill="#ef4444" />
            <circle cx="18" cy="10" r="1.5" fill="#3b82f6" />
            <circle cx="28" cy="4" r="1.5" fill="#ef4444" />
            {/* Glow Aura */}
            <motion.circle
              cx="18"
              cy="8"
              r="18"
              stroke="#f59e0b"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
              animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
