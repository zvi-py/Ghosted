// Synthesized Web Audio API sound effects for Ghosted
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (browser security blocks autoplay)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// State management
let sfxEnabled = true;
let musicEnabled = false;

if (typeof window !== 'undefined') {
  const savedSfx = localStorage.getItem('ghosted_sfx_enabled');
  sfxEnabled = savedSfx !== null ? savedSfx === 'true' : true;
  
  const savedMusic = localStorage.getItem('ghosted_music_enabled');
  musicEnabled = savedMusic !== null ? savedMusic === 'true' : false;
}

export function isMusicEnabled() {
  return musicEnabled;
}

export function isSfxEnabled() {
  return sfxEnabled;
}

export function toggleMusic(): boolean {
  if (musicEnabled) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
  return musicEnabled;
}

export function toggleSfx(): boolean {
  sfxEnabled = !sfxEnabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('ghosted_sfx_enabled', sfxEnabled ? 'true' : 'false');
  }
  return sfxEnabled;
}

let tickAlternate = false;

/**
 * Play a classy wooden-mechanical clock tick for low timer countdown
 */
export function playTimerTick() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  // Alternate tick (high woodblock) and tock (low woodblock) for a premium feel
  const freq = tickAlternate ? 420 : 320;
  tickAlternate = !tickAlternate;

  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq / 2, now + 0.04);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq, now);
  filter.Q.setValueAtTime(4, now);

  gain.gain.setValueAtTime(0.008, now); // Quiet, background, mild ticking
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

/**
 * Play a beautiful, subtle, clean mechanical tactile switch click on option selection
 */
export function playOptionClick() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(580, now);
  osc.frequency.exponentialRampToValueAtTime(1100, now + 0.025);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(850, now);
  filter.Q.setValueAtTime(5, now);

  gain.gain.setValueAtTime(0.012, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.035);
}

/**
 * Play a sweet, luxurious glass-harp acoustic major-fifth chime
 */
export function playCorrect() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    523.25, // C5
    659.25, // E5
    783.99, // G5
    1046.50 // C6
  ];

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, noteTime);

    gain.gain.setValueAtTime(0, noteTime);
    gain.gain.linearRampToValueAtTime(0.02, noteTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.45);
  });
}

/**
 * Play an elegant wooden low-pass thud for incorrect responses
 */
export function playIncorrect() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.linearRampToValueAtTime(147, now + 0.2);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(250, now);

  gain.gain.setValueAtTime(0.02, now);
  gain.gain.linearRampToValueAtTime(0.0001, now + 0.2);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}

/**
 * Play a cascading majestic ambient cloud-like major-arpeggio
 */
export function playWin() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    261.63, // C4
    329.63, // E4
    392.00, // G4
    493.88, // B4
    587.33, // D5
    783.99, // G5
    987.77, // B5
    1174.66 // D6
  ];

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.06;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, noteTime);

    gain.gain.setValueAtTime(0, noteTime);
    gain.gain.linearRampToValueAtTime(0.025, noteTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.65);
  });
}

// Ambient Background Procedural Loop
let activeSwells: { osc: OscillatorNode; gain: GainNode }[] = [];
let nextChordTimeout: any = null;
let currentChordIndex = 0;

const chordProgressions = [
  [130.81, 196.00, 246.94, 329.63, 392.00], // Cmaj9 (C3, G3, B3, E4, G4)
  [110.00, 164.81, 196.00, 261.63, 329.63], // Am9 (A2, E3, G3, C4, E4)
  [87.31, 130.81, 174.61, 220.00, 329.63],  // Fmaj9 (F2, C3, F3, A3, E4)
  [98.00, 146.83, 174.61, 246.94, 293.66]   // G13 (G2, D3, F3, B3, D4)
];

function playAmbientChordSwells() {
  const ctx = getAudioContext();
  if (!ctx || !musicEnabled) return;

  const now = ctx.currentTime;
  const chord = chordProgressions[currentChordIndex];

  // Crossfade: gracefully fade out previous swells
  activeSwells.forEach((swell) => {
    try {
      swell.gain.gain.cancelScheduledValues(now);
      swell.gain.gain.setValueAtTime(swell.gain.gain.value, now);
      swell.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        try {
          swell.osc.stop();
        } catch (e) {}
      }, 1000);
    } catch (e) {}
  });
  activeSwells = [];

  // Play current chord
  chord.forEach((freq) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Warm analog lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      // Elegant pad fade in
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.012, now + 1.5);
      
      // Hold & decay
      gain.gain.setValueAtTime(0.012, now + 3.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      activeSwells.push({ osc, gain });
    } catch (e) {}
  });

  currentChordIndex = (currentChordIndex + 1) % chordProgressions.length;
  nextChordTimeout = setTimeout(playAmbientChordSwells, 4800);
}

export function startBackgroundMusic() {
  musicEnabled = true;
  if (typeof window !== 'undefined') {
    localStorage.setItem('ghosted_music_enabled', 'true');
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  if (nextChordTimeout) {
    clearTimeout(nextChordTimeout);
  }

  playAmbientChordSwells();
}

export function stopBackgroundMusic() {
  musicEnabled = false;
  if (typeof window !== 'undefined') {
    localStorage.setItem('ghosted_music_enabled', 'false');
  }

  if (nextChordTimeout) {
    clearTimeout(nextChordTimeout);
    nextChordTimeout = null;
  }

  const ctx = getAudioContext();
  const now = ctx ? ctx.currentTime : 0;

  activeSwells.forEach((swell) => {
    try {
      if (ctx) {
        swell.gain.gain.cancelScheduledValues(now);
        swell.gain.gain.setValueAtTime(swell.gain.gain.value, now);
        swell.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      }
      setTimeout(() => {
        try {
          swell.osc.stop();
        } catch (e) {}
      }, 500);
    } catch (e) {}
  });
  activeSwells = [];
}

// Autoplay policy resolver: resume on first user click if enabled
if (typeof window !== 'undefined') {
  const resumeOnFirstInteraction = () => {
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          if (musicEnabled && activeSwells.length === 0 && !nextChordTimeout) {
            playAmbientChordSwells();
          }
        }).catch(() => {});
      } else if (musicEnabled && activeSwells.length === 0 && !nextChordTimeout) {
        playAmbientChordSwells();
      }
      window.removeEventListener('click', resumeOnFirstInteraction);
      window.removeEventListener('keydown', resumeOnFirstInteraction);
    }
  };
  window.addEventListener('click', resumeOnFirstInteraction);
  window.addEventListener('keydown', resumeOnFirstInteraction);
}
