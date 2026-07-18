import { CosmeticItem } from '../types';

export const COSMETIC_ITEMS: CosmeticItem[] = [
  // SKINS
  {
    id: 'skin_default',
    name: 'Default Character',
    type: 'skin',
    price: 0,
    rarity: 'common',
    value: 'from-zinc-100 to-zinc-300',
    color: '#a855f7'
  },
  {
    id: 'skin_galaxy',
    name: 'Galaxy Drifter',
    type: 'skin',
    price: 499,
    rarity: 'rare',
    value: 'from-indigo-600 via-purple-600 to-pink-600 animate-pulse',
    color: '#8b5cf6'
  },
  {
    id: 'skin_sakura',
    name: 'Sakura Bloom',
    type: 'skin',
    price: 499,
    rarity: 'epic',
    value: 'from-pink-100 via-pink-200 to-rose-300',
    color: '#ec4899'
  },
  {
    id: 'skin_hacker',
    name: 'Cyber Hacker',
    type: 'skin',
    price: 599,
    rarity: 'legendary',
    value: 'from-zinc-900 via-zinc-800 to-purple-950 border border-purple-900',
    color: '#a855f7'
  },
  {
    id: 'skin_ocean',
    name: 'Ocean Spirit',
    type: 'skin',
    price: 499,
    rarity: 'epic',
    value: 'from-sky-300 via-cyan-400 to-blue-500',
    color: '#0284c7'
  },
  {
    id: 'skin_oni',
    name: 'Oni Demon',
    type: 'skin',
    price: 599,
    rarity: 'legendary',
    value: 'from-zinc-950 via-red-950 to-zinc-900 border border-red-900',
    color: '#ef4444'
  },
  {
    id: 'skin_bear',
    name: 'Honey Bear',
    type: 'skin',
    price: 499,
    rarity: 'epic',
    value: 'from-amber-100 via-amber-200 to-yellow-300',
    color: '#eab308'
  },
  {
    id: 'skin_slime_gamer',
    name: 'Slime Gamer',
    type: 'skin',
    price: 499,
    rarity: 'rare',
    value: 'from-green-100 via-green-300 to-emerald-400',
    color: '#22c55e'
  },
  {
    id: 'skin_glitch',
    name: 'Glitch Neon',
    type: 'skin',
    price: 699,
    rarity: 'legendary',
    value: 'from-fuchsia-500 via-zinc-900 to-cyan-500',
    color: '#ec4899'
  },
  {
    id: 'skin_angel',
    name: 'Celestial Angel',
    type: 'skin',
    price: 699,
    rarity: 'mythic',
    value: 'from-yellow-50 via-amber-100 to-yellow-200 animate-pulse',
    color: '#eab308'
  },

  // FRAMES
  {
    id: 'frame_none',
    name: 'No Profile Border',
    type: 'frame',
    price: 0,
    rarity: 'common',
    value: 'border-transparent'
  },
  {
    id: 'frame_neon',
    name: 'Cosmic Purple Glow',
    type: 'frame',
    price: 100,
    rarity: 'common',
    value: 'border border-purple-500 shadow-[0_0_10px_#a855f7]'
  },
  {
    id: 'frame_cyber',
    name: 'Cyberpunk Grid',
    type: 'frame',
    price: 250,
    rarity: 'rare',
    value: 'border-2 border-dashed border-cyan-400 shadow-[0_0_12px_#22d3ee]'
  },
  {
    id: 'frame_lava',
    name: 'Molten Fire Ring',
    type: 'frame',
    price: 450,
    rarity: 'epic',
    value: 'border-2 border-orange-500 shadow-[0_0_15px_#f97316] animate-pulse'
  },
  {
    id: 'frame_gold',
    name: 'Celestial Starry Frame',
    type: 'frame',
    price: 800,
    rarity: 'legendary',
    value: 'border-4 border-double border-indigo-300 shadow-[0_0_20px_#8da3f2]'
  },

  // TITLES
  {
    id: 'title_newbie',
    name: 'Unranked NPC',
    type: 'title',
    price: 0,
    rarity: 'common',
    value: 'Unranked NPC'
  },
  {
    id: 'title_main_char',
    name: 'Main Character',
    type: 'title',
    price: 100,
    rarity: 'common',
    value: 'Main Character'
  },
  {
    id: 'title_delusional',
    name: 'Delusional',
    type: 'title',
    price: 200,
    rarity: 'rare',
    value: 'Delusional 🔮'
  },
  {
    id: 'title_brainrot',
    name: 'Brainrot Overlord',
    type: 'title',
    price: 400,
    rarity: 'epic',
    value: 'Brainrot Overlord 🧠'
  },
  {
    id: 'title_gigachad',
    name: 'GIGA CHAD',
    type: 'title',
    price: 600,
    rarity: 'epic',
    value: 'GIGA CHAD 🗿'
  },
  {
    id: 'title_ghost',
    name: 'THE PHANTOM',
    type: 'title',
    price: 1200,
    rarity: 'legendary',
    value: '✦ THE PHANTOM 👻'
  }
];
