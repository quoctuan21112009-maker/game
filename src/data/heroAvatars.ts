// High-fidelity cybernetic SVG avatars and portrait art for all 7 heroes
// Crisp, reactive, responsive vector artwork that looks stunning on mobile and 4K screens

export const HERO_AVATARS: Record<string, string> = {
  aethel: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="bg_aethel" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#005b6e"/>
          <stop offset="100%" stop-color="#0a0a14"/>
        </radialGradient>
        <linearGradient id="armor_aethel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a384c"/>
          <stop offset="50%" stop-color="#141c26"/>
          <stop offset="100%" stop-color="#0a0d13"/>
        </linearGradient>
        <linearGradient id="neon_cyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#4cd7f6"/>
        </linearGradient>
        <filter id="glow_aethel">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" rx="30" fill="url(#bg_aethel)"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#4cd7f6" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.4"/>
      <!-- Cyber Paladin Helm & Shoulders -->
      <path d="M40 195 L65 140 L100 155 L135 140 L160 195 Z" fill="url(#armor_aethel)" stroke="#4cd7f6" stroke-width="2"/>
      <path d="M70 145 L100 130 L130 145 L100 160 Z" fill="#1b2838" stroke="#00f0ff" stroke-width="1.5"/>
      <!-- Neck & Head Base -->
      <path d="M85 130 L115 130 L110 100 L90 100 Z" fill="#18202d"/>
      <!-- Cyber Helmet -->
      <path d="M65 95 L100 45 L135 95 L125 125 L75 125 Z" fill="url(#armor_aethel)" stroke="#3d5a7d" stroke-width="2"/>
      <!-- Glowing Cyan Visor -->
      <polygon points="75,85 125,85 118,102 82,102" fill="url(#neon_cyan)" filter="url(#glow_aethel)"/>
      <line x1="72" y1="93" x2="128" y2="93" stroke="#ffffff" stroke-width="2" filter="url(#glow_aethel)"/>
      <!-- Forehead Crest -->
      <polygon points="100,50 108,70 92,70" fill="#00f0ff" filter="url(#glow_aethel)"/>
      <!-- Halo Arc -->
      <path d="M60 45 Q 100 20 140 45" fill="none" stroke="#4cd7f6" stroke-width="3" filter="url(#glow_aethel)"/>
    </svg>
  `)}`,

  valeria: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="bg_valeria" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="100%" stop-color="#04110b"/>
        </radialGradient>
        <linearGradient id="neon_emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6ee7b7"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
        <filter id="glow_valeria">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" rx="30" fill="url(#bg_valeria)"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4"/>
      <!-- Ranger Mantle -->
      <path d="M40 195 L65 140 L100 152 L135 140 L160 195 Z" fill="#0c2419" stroke="#059669" stroke-width="2"/>
      <!-- Cybernetic Visor & Sniper Hood -->
      <path d="M65 92 L100 48 L135 92 L124 130 L76 130 Z" fill="#061c14" stroke="#047857" stroke-width="1.5"/>
      <polygon points="78,90 122,90 114,104 86,104" fill="url(#neon_emerald)" filter="url(#glow_valeria)"/>
      <!-- Crossbow Reticle Accent -->
      <circle cx="100" cy="97" r="12" fill="none" stroke="#a7f3d0" stroke-width="1.5" filter="url(#glow_valeria)"/>
      <line x1="100" y1="82" x2="100" y2="112" stroke="#ffffff" stroke-width="1"/>
      <line x1="85" y1="97" x2="115" y2="97" stroke="#ffffff" stroke-width="1"/>
    </svg>
  `)}`,

  ignis: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="bg_ignis" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#7f1d1d"/>
          <stop offset="100%" stop-color="#120505"/>
        </radialGradient>
        <linearGradient id="neon_fire" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#ef4444"/>
        </linearGradient>
        <filter id="glow_ignis">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" rx="30" fill="url(#bg_ignis)"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#f97316" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4"/>
      <!-- Pyro Horns -->
      <path d="M72 70 Q 55 35 45 40 Q 60 55 70 78 Z" fill="url(#neon_fire)" filter="url(#glow_ignis)"/>
      <path d="M128 70 Q 145 35 155 40 Q 140 55 130 78 Z" fill="url(#neon_fire)" filter="url(#glow_ignis)"/>
      <!-- Mantle & Armor -->
      <path d="M40 195 L65 145 L100 160 L135 145 L160 195 Z" fill="#291212" stroke="#ea580c" stroke-width="2"/>
      <!-- Berserker Mask -->
      <polygon points="70,85 130,85 120,130 100,145 80,130" fill="#1b0b0b" stroke="#7f1d1d" stroke-width="1.5"/>
      <!-- Glowing Molten Eyes -->
      <ellipse cx="86" cy="98" rx="7" ry="4" fill="#ffedd5" filter="url(#glow_ignis)"/>
      <ellipse cx="114" cy="98" rx="7" ry="4" fill="#ffedd5" filter="url(#glow_ignis)"/>
      <circle cx="100" cy="120" r="5" fill="#f97316" filter="url(#glow_ignis)"/>
    </svg>
  `)}`,

  lyra: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="bg_lyra" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#090514"/>
        </radialGradient>
        <linearGradient id="neon_frost" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0f2fe"/>
          <stop offset="50%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
        <filter id="glow_lyra">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" rx="30" fill="url(#bg_lyra)"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 6" opacity="0.5"/>
      <!-- Astral Crown Crystals -->
      <polygon points="100,35 106,65 94,65" fill="url(#neon_frost)" filter="url(#glow_lyra)"/>
      <polygon points="78,45 86,70 72,70" fill="url(#neon_frost)" opacity="0.8"/>
      <polygon points="122,45 128,70 114,70" fill="url(#neon_frost)" opacity="0.8"/>
      <!-- Chrono Mage Robes -->
      <path d="M42 195 L68 140 L100 152 L132 140 L158 195 Z" fill="#17153a" stroke="#38bdf8" stroke-width="2"/>
      <!-- Face & Ice Mask -->
      <polygon points="74,80 126,80 118,124 100,136 82,124" fill="#0f0c29" stroke="#4338ca" stroke-width="1.5"/>
      <ellipse cx="88" cy="98" rx="6" ry="3.5" fill="#bae6fd" filter="url(#glow_lyra)"/>
      <ellipse cx="112" cy="98" rx="6" ry="3.5" fill="#bae6fd" filter="url(#glow_lyra)"/>
    </svg>
  `)}`,

  kaelen: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="bg_kaelen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3b0764"/>
          <stop offset="100%" stop-color="#0a0512"/>
        </radialGradient>
        <linearGradient id="neon_purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="100%" stop-color="#9333ea"/>
        </linearGradient>
        <filter id="glow_kaelen">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" rx="30" fill="url(#bg_kaelen)"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="3 6" opacity="0.5"/>
      <!-- Cowl & Mantle -->
      <path d="M35 195 Q 100 135 165 195 Z" fill="#190d29" stroke="#9333ea" stroke-width="2"/>
      <path d="M60 110 L100 45 L140 110 L130 145 L70 145 Z" fill="#13091f" stroke="#581c87" stroke-width="2"/>
      <!-- Assassin Mask -->
      <polygon points="76,90 124,90 115,115 100,128 85,115" fill="#24113a"/>
      <!-- Dual Glowing Slit Eyes -->
      <polygon points="78,92 94,92 91,98 80,98" fill="#d8b4fe" filter="url(#glow_kaelen)"/>
      <polygon points="106,92 122,92 120,98 109,98" fill="#d8b4fe" filter="url(#glow_kaelen)"/>
      <!-- Floating Dagger Shards -->
      <path d="M30 90 L45 75 L40 115 Z" fill="url(#neon_purple)" filter="url(#glow_kaelen)"/>
      <path d="M170 90 L155 75 L160 115 Z" fill="url(#neon_purple)" filter="url(#glow_kaelen)"/>
    </svg>
  `)}`,

  aurora: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="bg_aurora" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#713f12"/>
          <stop offset="100%" stop-color="#0d0a04"/>
        </radialGradient>
        <linearGradient id="neon_solar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
        <filter id="glow_aurora">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" rx="30" fill="url(#bg_aurora)"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#facc15" stroke-width="1.5" opacity="0.4"/>
      <!-- Solar Ray Crown -->
      <polygon points="100,32 105,62 95,62" fill="url(#neon_solar)" filter="url(#glow_aurora)"/>
      <polygon points="76,42 85,68 73,68" fill="url(#neon_solar)"/>
      <polygon points="124,42 127,68 115,68" fill="url(#neon_solar)"/>
      <!-- Solar Armor & Spear Shoulder Plating -->
      <path d="M40 195 L65 140 L100 155 L135 140 L160 195 Z" fill="#291a05" stroke="#facc15" stroke-width="2"/>
      <polygon points="74,80 126,80 118,122 100,135 82,122" fill="#1b1204" stroke="#ca8a04" stroke-width="1.5"/>
      <polygon points="78,92 122,92 115,106 85,106" fill="#fef08a" filter="url(#glow_aurora)"/>
    </svg>
  `)}`,

  seraphina: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="bg_sera" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#4c1d95"/>
          <stop offset="50%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#090514"/>
        </radialGradient>
        <linearGradient id="neon_gold_celestial" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="40%" stop-color="#fde047"/>
          <stop offset="80%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
        <filter id="glow_sera">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" rx="30" fill="url(#bg_sera)"/>
      <!-- Celestial Star Rings -->
      <circle cx="100" cy="100" r="88" fill="none" stroke="#fde047" stroke-width="2" filter="url(#glow_sera)"/>
      <circle cx="100" cy="100" r="75" fill="none" stroke="#c084fc" stroke-width="1" stroke-dasharray="3 6"/>
      <!-- Angelic Wings Silhouette -->
      <path d="M100 90 Q 50 30 18 60 Q 50 90 90 110 Z" fill="url(#neon_gold_celestial)" opacity="0.85" filter="url(#glow_sera)"/>
      <path d="M100 90 Q 150 30 182 60 Q 150 90 110 110 Z" fill="url(#neon_gold_celestial)" opacity="0.85" filter="url(#glow_sera)"/>
      <!-- Celestial Archon Robe & Armor -->
      <path d="M42 195 L65 138 L100 152 L135 138 L158 195 Z" fill="#241738" stroke="#fbbf24" stroke-width="2"/>
      <!-- Divine Face & Tiara -->
      <polygon points="76,82 124,82 116,125 100,138 84,125" fill="#180e28" stroke="#d97706" stroke-width="1.5"/>
      <!-- Golden Radiant Eyes -->
      <ellipse cx="88" cy="98" rx="6" ry="3.5" fill="#ffffff" filter="url(#glow_sera)"/>
      <ellipse cx="112" cy="98" rx="6" ry="3.5" fill="#ffffff" filter="url(#glow_sera)"/>
      <!-- Tiara Halo -->
      <polygon points="100,52 108,74 92,74" fill="#fde047" filter="url(#glow_sera)"/>
      <circle cx="100" cy="45" r="4" fill="#ffffff" filter="url(#glow_sera)"/>
    </svg>
  `)}`,
};
