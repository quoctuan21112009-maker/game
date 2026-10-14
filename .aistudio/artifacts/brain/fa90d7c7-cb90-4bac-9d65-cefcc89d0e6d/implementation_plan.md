# Aether Rift: Arcane Cybernetic Action RPG

An immersive, tactile Mobile Action RPG web application built with a real-time Three.js 3D combat arena, smooth 2D/3D camera switches, gesture-based physics combat, deep RPG character progression, and high-retention gameplay loops (lucky gacha, infinite void tower, AFK Astral Vault, high-risk +20 refinement, and real-time global leaderboards).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed with the user in Phase 1:

- **3D Combat Engine**: Full real-time 3D arena powered by Three.js with free-look 360° camera orbit, over-the-shoulder chase view, and isometric tactical zoom. Features physics-driven spark and slash collision trails on canvas, screen-shake haptics, and slow-mo bullet-time.
- **Addictive Progression Systems**:
  - **Aether Gacha & Relic Summon**: High-roller summoning gate with animation reveals, pity counters, and legendary drop fanfare.
  - **Global Combat Power (CP) & Void Rift Tower Leaderboard**: Live ranking board tracking top players, CP ranks, and endless Void Abyss stage clears.
  - **High-Risk Equipment Refinement (+20)**: Weapon smithing with success/failure rates, breakthrough stones, and socketable ancient runes.
  - **Astral Vault AFK & Aether Forge**: Idle resource accumulation with 12h storage cap, one-tap harvest, and item crafting queues.

---

## 1. Overview & Core Concept

- **What It Does**: Aether Rift delivers a complete, AAA-feeling mobile ARPG in the browser. Players command **Aethel**, a Lv.85 Cyber-Paladin, fighting through the cosmic Void Rift. The game features 5 interconnected core tabs:
  1. **Combat**: Live 3D boss fight against **Chrono Chimera Void Devourer** (Phase 2/3), real-time gestures (Slash sweetspot, Nova spring hold, Chrono Parry QTE), 4-element mutator deck, evade dash, and Dimension Break ultimate.
  2. **Sanctuary**: Base building hub featuring the Arcane Spire, Aether Forge item crafting, Leyline resonance, and Astral Vault AFK collection.
  3. **Altar**: Holographic skill matrix with 60 FPS vector preview, socket customization (Core / Geometry / Rune), and combat formula synthesis.
  4. **Inventory**: 3D interactive hero inspection with 360° drag rotation, full 20-slot Epic gear equipment, +15 to +20 forge upgrading, stat recalculation, and fast Best-in-Slot (BIS) equipping.
  5. **Astral AFK & Rankings**: High-stakes Gacha summons, Void Tower climb, and live Global Leaderboards.
- **Target Persona**: Mid-core to hardcore ARPG mobile players who love tactical tactile combat, deep gear min-maxing, and satisfying progression feedback.
- **Key Value**: Delivers the tactile polish and deep progression of games like Honkai Impact, Genshin Impact, and Solo Leveling: Arise directly in a responsive, fast-loading web app.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Combat Engagement Flow**:
   - Tap **Combat** tab to enter the 3D Rift Arena.
   - Switch camera between **3D Freelook**, **Over-Shoulder**, and **Iso Tactical**.
   - Toggle **x1 / x2 / x4 Speed** and **Auto-Battle** modes.
   - Execute gesture inputs in the Interactive Zone: swipe across the sweetspot for +35% Crit, hold & release for Nova radial implosion, or tap 1-2-3 rhythm buttons for Chrono Parry bullet-time.
   - Unleash elemental skills (Fire Slash, Frost Wall, Volt Vortex, Singularity) to trigger weakness break gauges and multi-phase boss HP depletion.
   - Pop the glowing **Dimension Break** ultimate for screen-shattering particle VFX.

2. **Hero Equipment & Upgrade Flow**:
   - Open **Inventory** tab to view the 3D Cyber-Paladin hero avatar.
   - Drag horizontally to rotate the hero 360° and inspect armor textures.
   - Select equipped items (e.g., EP-01 Void Blade +15) or inventory items from the 20-slot Epic stash.
   - Upgrade weapon levels (+16, +17, up to +20) consuming Void Stones and Aether Gold, risking failure at higher tiers with dramatic forge sparks.
   - Slot and unslot ancient runes (Purple Crit Gem, Leech Rune) to immediately update stats (ATK, HP, DEF, Crit%, Leech%).

3. **Skill Customization Flow**:
   - In **Altar**, view the Ley-Hologram chamber simulating orbital slash vectors at 60 FPS.
   - Swap Socket A (Element Core), Socket B (Whirlwind 360° geometry), and Socket C (Vampiric Leech).
   - Watch the live GDD Combat Formula synthesis update Final Skill Power, Detonation Radius, and Precision Multipliers.

4. **AFK Harvest & Forge Crafting Flow**:
   - In **Sanctuary**, view building nodes (Arcane Spire, Aether Forge, Runic Altar, AFK Treasury).
   - Claim accumulated Astral Vault gold, diamonds, and void cores.
   - Accelerate crafting or start forging high-tier Epic weapons with countdown timers.

5. **Gacha Summoning & Global Leaderboard Flow**:
   - In **Astral AFK / Rankings**, pull 1x or 10x Ancient Relic Summon gates with glowing card flip animations.
   - View the Global Top 100 Leaderboard showing player rankings, guilds, VIP levels, and real-time Combat Power (CP).

### Visual Identity & Theme

- **Design Philosophy**: *Arcane Cybernetic Glass* — futuristic dark fantasy aesthetic with crystalline glassmorphism, luminous neon conduits, and deep cosmic space backdrops.
- **Color Palette**:
  - `Canvas`: Deep Abyssal Obsidian (`#0d0d17` / `#12121d`)
  - `Surfaces`: Void Indigo Glass (`#1b1b25`, `#1f1f29`, `#292934`) with hairline borders (`#3d494c`)
  - `Primary Accent`: Aether Cyan (`#4cd7f6` / `#06b6d4`)
  - `Secondary Accent`: Arcane Violet (`#ddb7ff` / `#a855f7`)
  - `Tertiary Accent`: Solar Gold (`#ffb95f` / `#f59e0b`)
  - `Danger & Boss`: Void Crimson (`#ffb4ab` / `#f43f5e`)
- **Typography**:
  - Headlines: `Space Grotesk` (sharp, angular, high-tech display face)
  - Body & Lore: `Inter` (high-clarity reading font)
  - HUD Numbers & Combat Counters: Monospace tabular numerals (`Geist` / `tabular-nums`)
- **Feedback & Motion**:
  - Screen shake on heavy hits and critical strikes.
  - Radial shockwave ripple on successful Chrono Parry.
  - Shimmering animated light trails on ready Ultimates.
  - Floating dynamic damage numbers with physics pop and color-coded crit tags.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Real-Time 3D Rendering (Three.js WebGL + 2D Particle Canvas)**
  - *Chosen Approach*: Embed an interactive Three.js 3D viewport for both the combat arena (3D boss model/environment with animated orbit camera) and inventory hero inspection (360° rotatable 3D knight model with specular lighting), combined with an HTML5 2D overlay canvas for ultra-crisp 60 FPS laser slashes and spark physics.
  - *Why*: Delivers authentic 3D spatial presence with seamless camera switching and zero rendering lag on mobile devices.
  - *Alternatives Considered*: Pure pre-rendered CSS 3D transforms — while lightweight, it cannot provide true 360° geometry inspection or dynamic camera perspective orbits.

- **Decision 2: Local Persistence with Mock Global Sync**
  - *Chosen Approach*: Persist user progression (hero level, CP, inventory upgrades, gems, currencies, AFK timer timestamps) in `localStorage`. Seed a competitive global leaderboard with responsive live sorting that reflects the player's real-time CP changes.
  - *Why*: Instant zero-latency loading, works completely offline or in any preview iframe, never fails due to network dropouts.

- **Decision 3: Zero-Pill Ergonomic HUD Navigation**
  - *Chosen Approach*: Clean bottom navigation bar with 5 iconic tabs (Sanctuary, Combat, Altar, Inventory, Astral AFK) strictly compliant with mobile safe-area thumb zones, and unboxed typography for status metadata.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App Container                             │
│       (Top Header HUD: Player Profile, Lv.85, VIP 4, Currencies)       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           │            State Store (Game Context)             │
           │  • Player CP & Stats (ATK, HP, DEF, CRIT, LEECH)  │
           │  • Inventory & Equipment Upgrade Levels (+15-+20) │
           │  • Currencies (Gold 1.42M, Gems 4850, Tokens 740) │
           │  • AFK Vault Timers & Forge Crafting Queue        │
           │  • Active Skill Sockets & Modifiers               │
           └─────────────────────────┬─────────────────────────┘
                                     │
    ┌──────────────┬─────────────────┼─────────────────┬──────────────┐
    │              │                 │                 │              │
┌───▼────┐   ┌─────▼──────┐   ┌──────▼─────┐   ┌───────▼────┐   ┌─────▼──────┐
│ Combat │   │ Sanctuary  │   │Skill Altar │   │ Inventory  │   │ Astral AFK │
│ View   │   │ Hub        │   │ Chamber    │   │ 3D Gear    │   │ & Ranking  │
└───┬────┘   └────────────┘   └────────────┘   └───────┬────┘   └────────────┘
    │                                                  │
┌───▼───────────────────────────┐              ┌───────▼────────────────────┐
│ • Three.js 3D Boss & Arena    │              │ • Three.js 3D Hero Viewer  │
│ • Camera Mode Switcher        │              │ • 360° Orbit Rotation      │
│ • 2D Physics Particle Overlay │              │ • 20-Slot Equipment Matrix │
│ • Gesture Touch Playground    │              │ • Forge Upgrade (+20 Risk) │
│ • Elemental Skill Deck        │              │ • Rune Sockets & BIS Equip │
└───────────────────────────────┘              └────────────────────────────┘
```

### State Model Entities

- `PlayerProfile`: `{ name: string, level: number, vip: number, cp: number, hp: number, maxHp: number, aether: number, gold: number, diamonds: number, voidTokens: number }`
- `EquipmentItem`: `{ id: string, name: string, slot: string, rarity: 'Epic' | 'Legendary' | 'Mythic', enhanceLevel: number, baseAtk: number, bonusAtk: number, substats: Array<{ name: string, value: string }>, sockets: Array<{ gemId?: string, type: string }> }`
- `SkillSocket`: `{ slotId: 'A' | 'B' | 'C', name: string, type: string, bonus: string, icon: string }`
- `SanctuaryBuilding`: `{ id: string, name: string, level: number, status: string, timerRemaining?: number }`
- `LeaderboardEntry`: `{ rank: number, name: string, title: string, guild: string, vip: number, cp: number, stage: string, isPlayer?: boolean }`
