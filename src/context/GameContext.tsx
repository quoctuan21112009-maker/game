import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  TabType,
  PlayerProfile,
  EquipmentItem,
  SkillItem,
  RuneSocket,
  MutatorRune,
  LeaderboardPlayer,
  GachaItem,
  GearSlot,
  GameMode,
  RoguelikeBuff,
  QuestItem,
  GameEvent,
} from '../types/game';
import { generateLevelProgression, LevelReward } from '../data/levelProgression';
import { HEROES_DATABASE, HeroCharacter } from '../data/heroesData';
import { BOSSES_DATABASE, BossData } from '../data/bossesData';
import { MASTER_ITEMS_CATALOG } from '../data/itemsData';
import { generateStagesDatabase, GameStage, calculateScaledBossHp, calculateScaledDamage } from '../data/stagesData';
import { INITIAL_QUESTS, ROGUELIKE_BUFF_POOL, ACTIVE_GAME_EVENTS } from '../data/questsData';
import { REBIRTH_PERKS, getRebirthRequirements } from '../data/rebirthData';
import { soundManager } from '../utils/soundManager';

interface GameContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;

  // Game Modes & Roguelike & World Boss
  gameMode: GameMode;
  switchGameMode: (mode: GameMode) => void;
  activeBuffs: RoguelikeBuff[];
  pendingBuffChoices: Omit<RoguelikeBuff, 'stackCount'>[] | null;
  selectRoguelikeBuff: (buffId: string) => void;
  triggerBuffDraft: () => void;
  worldBossTimeLeft: number;
  worldBossCurrentDamage: number;

  // Active Hero & Characters
  activeHero: HeroCharacter;
  availableHeroes: HeroCharacter[];
  switchHero: (heroId: string) => void;
  promoteHeroStar: (heroId: string) => void;

  // Active Boss & Dynamic Scaling
  activeBoss: BossData;
  availableBosses: BossData[];
  switchBoss: (bossId: string) => void;

  // Stages & Progression
  stages: GameStage[];
  currentStage: GameStage;
  selectStage: (stageId: string) => void;
  clearStage: () => void;

  // Player & Progression
  player: PlayerProfile;
  currentExp: number;
  maxExp: number;
  levelRewards: LevelReward[];
  claimLevelReward: (level: number) => { success: boolean; message: string };
  claimAllAvailableRewards: () => void;
  addExp: (amount: number) => void;
  levelUpWithRequirements: () => { success: boolean; message: string };
  resetCharacterToStart: () => void;
  triggerRebirth: () => { success: boolean; message: string };
  claimStarterPack: () => { success: boolean; message: string };

  // Quests System
  quests: QuestItem[];
  claimQuestReward: (questId: string) => void;
  incrementQuestProgress: (questId: string, amount?: number) => void;

  // Live Events System (Data update theo event)
  events: GameEvent[];
  activeEvent: GameEvent;
  claimEventMilestone: (eventId: string, milestoneIndex: number) => void;
  addEventPoints: (amount: number) => void;

  // Equipment & Inventory
  equippedGear: Record<GearSlot, EquipmentItem>;
  inventory: EquipmentItem[];
  selectedItem: EquipmentItem;
  setSelectedItem: (item: EquipmentItem) => void;
  equipItem: (item: EquipmentItem) => void;
  upgradeEquipment: (itemId: string) => { success: boolean; message: string };
  breakthroughEquipment: (itemId: string) => { success: boolean; message: string };
  socketGem: (itemId: string, slotIndex: number, gemName: string, gemBonus: string) => void;
  quickEquipBis: () => void;
  salvageJunk: () => void;

  // Combat
  dealDamageToBoss: (amount?: number, isCrit?: boolean, label?: string) => void;
  triggerSkill: (skillId: string) => number;
  resetBoss: () => void;
  skills: SkillItem[];
  dashCharges: number;
  useDash: () => boolean;
  ultimateReady: boolean;
  useUltimate: () => number;
  comboHits: number;
  clearComboHits: () => void;

  // Altar
  activeSockets: Record<'A' | 'B' | 'C', RuneSocket>;
  availableRunes: MutatorRune[];
  swapSocket: (slotId: 'A' | 'B' | 'C', rune: MutatorRune) => void;

  // AFK & Gacha & Leaderboard
  claimAfkRewards: () => { gold: number; diamonds: number; voidCores: number };
  speedUpForge: () => void;
  harvestCrystals: () => void;
  gachaPulls: (count: 1 | 10) => GachaItem[];
  pityCounter: number;
  leaderboard: LeaderboardPlayer[];

  // Utilities
  toast: { show: boolean; msg: string; icon: string } | null;
  showToast: (msg: string, icon?: string) => void;
  addCurrencies: (gold: number, diamonds: number, tokens: number) => void;
}

const initialSockets: Record<'A' | 'B' | 'C', RuneSocket> = {
  A: {
    slotId: 'A',
    label: 'SLOT A',
    title: 'Void Core',
    category: 'Element Core',
    bonus: '+25% Void',
    iconSymbol: 'cyclone',
    color: '#ddb7ff',
  },
  B: {
    slotId: 'B',
    label: 'SLOT B',
    title: 'Whirlwind 360°',
    category: 'Geometry',
    bonus: 'Radial Sweep',
    iconSymbol: 'sync',
    color: '#4cd7f6',
  },
  C: {
    slotId: 'C',
    label: 'SLOT C',
    title: 'Vampiric Exec',
    category: 'Augment Rune',
    bonus: '+8.5% Hút Máu',
    iconSymbol: 'water_drop',
    color: '#ffb95f',
  },
};

const initialRunes: MutatorRune[] = [
  { id: 'r1', name: 'Flame Core', rarity: 'Epic', category: 'element', bonus: '+22% Lửa', iconSymbol: 'local_fire_department', color: '#ffb95f' },
  { id: 'r2', name: 'Frost Core', rarity: 'Rare', category: 'element', bonus: '+18% Đóng Băng', iconSymbol: 'ac_unit', color: '#4cd7f6' },
  { id: 'r3', name: 'Storm Core', rarity: 'Legendary', category: 'element', bonus: '+35% Lôi Điện', iconSymbol: 'bolt', color: '#ffddb8' },
  { id: 'r4', name: 'Ricochet', rarity: 'Rare', category: 'geometry', bonus: 'Nảy 3 Mục Tiêu', iconSymbol: 'call_split', color: '#4cd7f6' },
  { id: 'r5', name: 'Detonator', rarity: 'Epic', category: 'augment', bonus: '+40% Bán Kính Nổ', iconSymbol: 'adjust', color: '#ddb7ff' },
  { id: 'r6', name: 'Time Warp', rarity: 'Legendary', category: 'augment', bonus: '+2s Choáng', iconSymbol: 'hourglass_top', color: '#f59e0b' },
  { id: 'r7', name: 'Execution', rarity: 'Mythic', category: 'augment', bonus: '+50% DMG < 30% HP', iconSymbol: 'warning', color: '#06b6d4' },
];

const starterPlayerState: PlayerProfile = {
  name: 'Aethel',
  title: 'Tân Binh Aether',
  classArchetype: 'Cyber-Paladin',
  level: 1,
  vip: 2,
  energy: 120,
  maxEnergy: 120,
  mana: 100,
  maxMana: 100,
  gold: 120000,
  diamonds: 2800,
  voidTokens: 250,
  voidStones: 80,
  towerFloor: 1,
  worldBossBestDps: 0,
  eventPoints: 120,
  rebirthCount: 0,
  unlockedPerks: [],
  lastAfkClaimTime: Date.now(),
  lastCrystalHarvestTime: Date.now() - 180000,
  hasClaimedStarterPack: false,
  stats: {
    atk: 1450,
    hp: 9500,
    maxHp: 9500,
    def: 420,
    critRate: 18.0,
    critDmg: 165.0,
    leechRate: 6.5,
    afkSpeed: 15,
    cp: 24500,
  },
};

const initialLeaderboard: LeaderboardPlayer[] = [
  { rank: 1, name: 'Valkyrie_Zero', title: 'Đấng Sáng Thế Vũ Trụ', guild: 'Ascension', vip: 10, cp: 4850000, towerFloor: 150, avatarIcon: 'military_tech' },
  { rank: 2, name: 'Kaelen_Void', title: 'Chúa Tể Không Gian', guild: 'Nightfall', vip: 9, cp: 3920000, towerFloor: 142, avatarIcon: 'shield' },
  { rank: 3, name: 'Sora_Blade', title: 'Đại Hiệp Sĩ Tinh Vân', guild: 'Ascension', vip: 8, cp: 3450000, towerFloor: 135, avatarIcon: 'swords' },
  { rank: 4, name: 'Zephyr_Apex', title: 'Kẻ Xé Toạc Hư Không', guild: 'Eclipse', vip: 7, cp: 2980000, towerFloor: 128, avatarIcon: 'cyclone' },
  { rank: 5, name: 'Nova_Prime', title: 'Thần Vệ Thái Dương', guild: 'Solaris', vip: 5, cp: 1720000, towerFloor: 94, avatarIcon: 'bolt' },
  { rank: 6, name: 'Rift_Shadow', title: 'Bóng Ma Thời Không', guild: 'Eclipse', vip: 4, cp: 1650000, towerFloor: 91, avatarIcon: 'visibility' },
  { rank: 7, name: 'Lumina_Star', title: 'Pháp Sư Tinh Tú', guild: 'Celestia', vip: 4, cp: 1580000, towerFloor: 87, avatarIcon: 'auto_awesome' },
  { rank: 8, name: 'Aethel', title: 'Tân Binh Aether', guild: 'Holy Aegis', vip: 2, cp: 24500, towerFloor: 1, avatarIcon: 'shield_person', isCurrentPlayer: true },
];

const mapHeroSkillsToSkillItems = (hero: HeroCharacter): SkillItem[] =>
  hero.skills.map((s, idx) => ({
    id: s.id,
    name: s.name,
    element: s.element,
    cooldownMax: s.cooldownMax,
    cooldownRemaining: 0,
    damageMultiplier: s.damageMultiplier,
    manaCost: s.manaCost ?? (20 + idx * 10),
    tag: s.tag,
    iconSymbol: s.icon,
    accentColor: s.accentColor,
    descVi: s.desc,
  }));

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('combat');
  const [gameMode, setGameMode] = useState<GameMode>('campaign');

  // Roguelike Buffs & Draft
  const [activeBuffs, setActiveBuffs] = useState<RoguelikeBuff[]>([]);
  const [pendingBuffChoices, setPendingBuffChoices] = useState<Omit<RoguelikeBuff, 'stackCount'>[] | null>(null);

  // World Boss Raid Timer & DPS
  const [worldBossTimeLeft, setWorldBossTimeLeft] = useState<number>(45);
  const [worldBossCurrentDamage, setWorldBossCurrentDamage] = useState<number>(0);

  // Live Events System
  const [events, setEvents] = useState<GameEvent[]>(() => {
    const saved = localStorage.getItem('aether_events_v5');
    if (saved) return JSON.parse(saved);
    return ACTIVE_GAME_EVENTS;
  });
  const activeEvent = events[0] || ACTIVE_GAME_EVENTS[0];

  // Stages & Chapters
  const [stages, setStages] = useState<GameStage[]>(() => {
    const saved = localStorage.getItem('aether_stages_v5');
    if (saved) return JSON.parse(saved);
    return generateStagesDatabase();
  });

  const [currentStage, setCurrentStage] = useState<GameStage>(() => stages[0] || generateStagesDatabase()[0]);

  // Multi-hero state
  const [availableHeroes, setAvailableHeroes] = useState<HeroCharacter[]>(() => {
    const saved = localStorage.getItem('aether_heroes_v5');
    if (saved) return JSON.parse(saved);
    return HEROES_DATABASE;
  });
  const [activeHero, setActiveHero] = useState<HeroCharacter>(() => availableHeroes[0] || HEROES_DATABASE[0]);

  // Player state with safe defaults
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('aether_player_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...starterPlayerState,
          ...parsed,
          mana: typeof parsed.mana === 'number' ? parsed.mana : 100,
          maxMana: typeof parsed.maxMana === 'number' ? parsed.maxMana : 100,
          rebirthCount: typeof parsed.rebirthCount === 'number' ? parsed.rebirthCount : 0,
          unlockedPerks: Array.isArray(parsed.unlockedPerks) ? parsed.unlockedPerks : [],
          lastAfkClaimTime: typeof parsed.lastAfkClaimTime === 'number' ? parsed.lastAfkClaimTime : Date.now(),
          lastCrystalHarvestTime:
            typeof parsed.lastCrystalHarvestTime === 'number'
              ? parsed.lastCrystalHarvestTime
              : Date.now() - 180000,
          hasClaimedStarterPack: Boolean(parsed.hasClaimedStarterPack),
          stats: {
            ...starterPlayerState.stats,
            ...(parsed.stats || {}),
          },
        };
      } catch (e) {
        return starterPlayerState;
      }
    }
    return starterPlayerState;
  });

  // Quests state
  const [quests, setQuests] = useState<QuestItem[]>(() => {
    const saved = localStorage.getItem('aether_quests_v5');
    if (saved) return JSON.parse(saved);
    return INITIAL_QUESTS;
  });

  // Dynamically Scaled Boss State
  const [availableBosses] = useState<BossData[]>(BOSSES_DATABASE);
  const [activeBoss, setActiveBoss] = useState<BossData>(() => {
    const base = BOSSES_DATABASE[0];
    const scaledMax = calculateScaledBossHp(player.level, currentStage?.hpMultiplier || 1.0);
    return {
      ...base,
      level: Math.max(1, player.level + (currentStage?.stageNum || 1) - 1),
      maxHp: scaledMax,
      currentHp: scaledMax,
    };
  });

  // Re-scale Boss HP and Level whenever player levels up or stage changes
  useEffect(() => {
    setActiveBoss((prev) => {
      const modeMult =
        gameMode === 'worldboss'
          ? 8.5
          : gameMode === 'tower'
          ? 1.0 + player.towerFloor * 0.15
          : gameMode === 'roguelike'
          ? 1.4
          : currentStage?.hpMultiplier || 1.0;
      const scaledMax = calculateScaledBossHp(player.level, modeMult);
      const ratio = prev.maxHp > 0 ? prev.currentHp / prev.maxHp : 1;
      return {
        ...prev,
        level:
          gameMode === 'tower'
            ? player.towerFloor * 2
            : gameMode === 'worldboss'
            ? 999
            : Math.max(1, player.level + currentStage.stageNum - 1),
        maxHp: scaledMax,
        currentHp: Math.max(1, Math.round(scaledMax * ratio)),
      };
    });
  }, [player.level, currentStage, gameMode, player.towerFloor]);

  // Level Progression database
  const [levelRewards, setLevelRewards] = useState<LevelReward[]>(() => {
    const saved = localStorage.getItem('aether_level_rewards_v5');
    if (saved) return JSON.parse(saved);
    return generateLevelProgression();
  });

  const [currentExp, setCurrentExp] = useState<number>(() => {
    const saved = localStorage.getItem('aether_current_exp_v5');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const maxExp = Math.floor(120 * Math.pow(player.level, 1.55));

  useEffect(() => {
    localStorage.setItem('aether_current_exp_v5', currentExp.toString());
  }, [currentExp]);

  // Starter equipment
  const [equippedGear, setEquippedGear] = useState<Record<GearSlot, EquipmentItem>>(() => {
    const saved = localStorage.getItem('aether_equipped_v5');
    if (saved) return JSON.parse(saved);
    const findBySlot = (slot: GearSlot) =>
      MASTER_ITEMS_CATALOG.find((i) => i.slot === slot && i.rarity !== 'Celestial') || MASTER_ITEMS_CATALOG[0];
    return {
      weapon: { ...findBySlot('weapon'), enhanceLevel: 5, enhancedAtk: 780 },
      helmet: { ...findBySlot('helmet'), enhanceLevel: 4, enhancedAtk: 340 },
      chest: { ...findBySlot('chest'), enhanceLevel: 5, enhancedAtk: 520 },
      gloves: { ...findBySlot('gloves'), enhanceLevel: 4, enhancedAtk: 450 },
      necklace: { ...findBySlot('necklace'), enhanceLevel: 5, enhancedAtk: 610 },
      ring: { ...findBySlot('ring'), enhanceLevel: 4, enhancedAtk: 410 },
      boots: { ...findBySlot('boots'), enhanceLevel: 4, enhancedAtk: 350 },
      relic: { ...findBySlot('relic'), enhanceLevel: 6, enhancedAtk: 920 },
    };
  });

  const [inventory, setInventory] = useState<EquipmentItem[]>(() => {
    const saved = localStorage.getItem('aether_inventory_v5');
    if (saved) return JSON.parse(saved);
    return MASTER_ITEMS_CATALOG;
  });

  const [selectedItem, setSelectedItem] = useState<EquipmentItem>(equippedGear.weapon);

  // Dynamic Hero Skills
  const [skills, setSkills] = useState<SkillItem[]>(() => mapHeroSkillsToSkillItems(activeHero));
  const [dashCharges, setDashCharges] = useState(2);
  const [ultimateReady, setUltimateReady] = useState(true);
  const [comboHits, setComboHits] = useState(0);

  // Altar
  const [activeSockets, setActiveSockets] = useState(initialSockets);
  const [availableRunes] = useState(initialRunes);

  // Gacha & Leaderboard
  const [pityCounter, setPityCounter] = useState(50);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>(initialLeaderboard);
  const [toast, setToast] = useState<{ show: boolean; msg: string; icon: string } | null>(null);

  // Unified v5 Persistence
  useEffect(() => {
    localStorage.setItem('aether_player_v5', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('aether_equipped_v5', JSON.stringify(equippedGear));
  }, [equippedGear]);

  useEffect(() => {
    localStorage.setItem('aether_inventory_v5', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('aether_level_rewards_v5', JSON.stringify(levelRewards));
  }, [levelRewards]);

  useEffect(() => {
    localStorage.setItem('aether_stages_v5', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('aether_heroes_v5', JSON.stringify(availableHeroes));
  }, [availableHeroes]);

  useEffect(() => {
    localStorage.setItem('aether_quests_v5', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('aether_events_v5', JSON.stringify(events));
  }, [events]);

  // Real-time Skill Cooldown & Mana Regeneration Loop (every 200ms)
  useEffect(() => {
    const interval = setInterval(() => {
      // Cooldown tick
      setSkills((prev) =>
        prev.map((s) =>
          s.cooldownRemaining > 0
            ? { ...s, cooldownRemaining: Math.max(0, Number((s.cooldownRemaining - 0.2).toFixed(1))) }
            : s
        )
      );

      // Mana Regen tick (+1 MP per 200ms = 5 MP/s, boosted if perk unlocked)
      setPlayer((prev) => {
        if (!prev) return prev;
        const hasManaPerk = (prev.unlockedPerks || []).includes('perk_mana_nexus');
        const regenAmount = hasManaPerk ? 2 : 1;
        if (prev.mana >= prev.maxMana) return prev;
        return {
          ...prev,
          mana: Math.min(prev.maxMana, prev.mana + regenAmount),
        };
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // World Boss Countdown Loop & Event Countdown Loop (every 1s)
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameMode === 'worldboss') {
        setWorldBossTimeLeft((t) => (t <= 1 ? 45 : t - 1));
      }

      // Decrement event countdown
      setEvents((prev) =>
        prev.map((ev) => ({
          ...ev,
          timeRemainingSec: Math.max(0, ev.timeRemainingSec - 1),
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [gameMode]);

  const showToast = (msg: string, icon = 'verified') => {
    setToast({ show: true, msg, icon });
    setTimeout(() => setToast(null), 1900);
  };

  const clearComboHits = () => setComboHits(0);

  const incrementQuestProgress = (questId: string, amount = 1) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.claimed) {
          return { ...q, progress: Math.min(q.target, q.progress + amount) };
        }
        return q;
      })
    );
  };

  const claimQuestReward = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || q.claimed || q.progress < q.target) return;

    setQuests((prev) => prev.map((item) => (item.id === questId ? { ...item, claimed: true } : item)));
    addExp(q.rewards.exp);
    addEventPoints(150);
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + q.rewards.gold,
      diamonds: prev.diamonds + q.rewards.diamonds,
      voidStones: prev.voidStones + (q.rewards.voidStones || 0),
    }));
    confetti({ particleCount: 55, spread: 70, colors: ['#4cd7f6', '#ffb95f'] });
    showToast(`HOÀN THÀNH NHIỆM VỤ: +${q.rewards.diamonds} 💎, +${q.rewards.gold.toLocaleString()} Vàng!`, 'task_alt');
  };

  const addEventPoints = (amount: number) => {
    setPlayer((prev) => ({
      ...prev,
      eventPoints: (prev.eventPoints || 0) + amount,
    }));
  };

  const claimEventMilestone = (eventId: string, milestoneIndex: number) => {
    const targetEv = events.find((e) => e.id === eventId);
    if (!targetEv) return;
    const milestone = targetEv.milestones[milestoneIndex];
    if (!milestone || milestone.claimed || (player.eventPoints || 0) < milestone.pointsRequired) {
      showToast('Chưa đủ Điểm Sự Kiện để mở khóa mốc này!', 'lock');
      return;
    }

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const updatedM = [...e.milestones];
          updatedM[milestoneIndex] = { ...updatedM[milestoneIndex], claimed: true };
          return { ...e, milestones: updatedM };
        }
        return e;
      })
    );

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + milestone.gold,
      diamonds: prev.diamonds + milestone.diamonds,
      voidStones: prev.voidStones + milestone.voidStones,
    }));

    confetti({ particleCount: 75, spread: 85, colors: ['#ff5f7e', '#f59e0b', '#4cd7f6'] });
    showToast(`NHẬN MỐC SỰ KIỆN: ${milestone.rewardTitle}! (+${milestone.diamonds} 💎)`, 'celebration');
  };

  // Switch Game Mode
  const switchGameMode = (mode: GameMode) => {
    setGameMode(mode);
    setComboHits(0);
    if (mode === 'worldboss') {
      setWorldBossTimeLeft(45);
      setWorldBossCurrentDamage(0);
      const wb = availableBosses[3] || availableBosses[0];
      const maxHp = calculateScaledBossHp(player.level, 8.5);
      setActiveBoss({ ...wb, name: 'Thần Hủy Diệt Thái Cổ', phase: 'WORLD RAID', level: 999, maxHp, currentHp: maxHp });
      showToast('CHẾ ĐỘ SĂN BOSS THẾ GIỚI: GÂY SÁT THƯƠNG TỐI ĐA TRONG 45 GIÂY!', 'local_fire_department');
    } else if (mode === 'roguelike') {
      triggerBuffDraft();
      showToast('MÊ CUNG ROGUELIKE: CHỌN THẺ BÀI DỊ BIẾN ĐỂ CỘNG DỒN SỨC MẠNH!', 'style');
    } else if (mode === 'tower') {
      const tb = availableBosses[player.towerFloor % availableBosses.length];
      const maxHp = calculateScaledBossHp(player.level, 1.0 + player.towerFloor * 0.15);
      setActiveBoss({
        ...tb,
        phase: `TẦNG ${player.towerFloor}`,
        level: player.towerFloor * 2,
        maxHp,
        currentHp: maxHp,
      });
      showToast(`THÁP HƯ KHÔNG TẦNG ${player.towerFloor}: KHIÊU CHIẾN!`, 'domain');
    } else {
      showToast(`CHẾ ĐỘ CHIẾN DỊCH: ${currentStage.displayName}`, 'map');
    }
  };

  const triggerBuffDraft = () => {
    const shuffled = [...ROGUELIKE_BUFF_POOL].sort(() => 0.5 - Math.random());
    setPendingBuffChoices(shuffled.slice(0, 3));
  };

  const selectRoguelikeBuff = (buffId: string) => {
    const chosen = ROGUELIKE_BUFF_POOL.find((b) => b.id === buffId);
    if (!chosen) return;
    setActiveBuffs((prev) => {
      const existing = prev.find((item) => item.id === buffId);
      if (existing) {
        return prev.map((item) => (item.id === buffId ? { ...item, stackCount: item.stackCount + 1 } : item));
      }
      return [...prev, { ...chosen, stackCount: 1 }];
    });
    setPendingBuffChoices(null);
    incrementQuestProgress('q_main_roguelike', 1);
    addEventPoints(80);
    showToast(`KÍCH HOẠT THẺ DỊ BIẾN: ${chosen.nameVi.toUpperCase()}!`, chosen.icon);
  };

  // Reset Character (Hard Reset)
  const resetCharacterToStart = () => {
    localStorage.clear();
    setPlayer(starterPlayerState);
    setLevelRewards(generateLevelProgression());
    setStages(generateStagesDatabase());
    setQuests(INITIAL_QUESTS);
    setEvents(ACTIVE_GAME_EVENTS);
    setActiveBuffs([]);
    const initialStg = generateStagesDatabase()[0];
    setCurrentStage(initialStg);
    setCurrentExp(0);
    setAvailableHeroes(HEROES_DATABASE);
    setActiveHero(HEROES_DATABASE[0]);
    setSkills(mapHeroSkillsToSkillItems(HEROES_DATABASE[0]));
    const baseBoss = BOSSES_DATABASE[0];
    const scaledMax = calculateScaledBossHp(1, initialStg.hpMultiplier);
    setActiveBoss({
      ...baseBoss,
      level: 1,
      maxHp: scaledMax,
      currentHp: scaledMax,
    });
    setComboHits(0);
    setPityCounter(50);
    setInventory(MASTER_ITEMS_CATALOG);
    confetti({ particleCount: 60, spread: 70, colors: ['#4cd7f6', '#ffb95f'] });
    showToast('ĐÃ KHÔI PHỤC TOÀN BỘ DỮ LIỆU BAN ĐẦU!', 'restart_alt');
  };

  // Rebirth / Trùng Sinh System (Must reach specific milestones; grants permanent perks; harder milestones each time)
  const triggerRebirth = (): { success: boolean; message: string } => {
    const req = getRebirthRequirements(player.rebirthCount);

    if (player.level < req.requiredLevel) {
      const msg = `Chưa đủ điều kiện Trùng Sinh: Cần đạt Level ${req.requiredLevel} (Hiện có: Lv.${player.level})!`;
      showToast(msg, 'lock');
      return { success: false, message: msg };
    }

    if (player.towerFloor < req.requiredTower) {
      const msg = `Chưa đủ điều kiện Trùng Sinh: Cần vượt Tháp Tầng ${req.requiredTower} (Hiện tại: Tầng ${player.towerFloor})!`;
      showToast(msg, 'lock');
      return { success: false, message: msg };
    }

    if (player.gold < req.requiredGold) {
      const msg = `Chưa đủ điều kiện Trùng Sinh: Cần ${req.requiredGold.toLocaleString()} Vàng Aether (Hiện có: ${player.gold.toLocaleString()})!`;
      showToast(msg, 'lock');
      return { success: false, message: msg };
    }

    const nextRebirthCount = player.rebirthCount + 1;
    const perkToUnlock = REBIRTH_PERKS.find((p) => p.tier === nextRebirthCount) || REBIRTH_PERKS[REBIRTH_PERKS.length - 1];
    const updatedPerks = Array.from(new Set([...(player.unlockedPerks || []), perkToUnlock.id]));

    // Permanent Stat Multipliers from Rebirth
    const atkMultiplier = 1 + (perkToUnlock.effect.atkBonusPercent || 35) / 100;
    const hpMultiplier = 1 + (perkToUnlock.effect.hpBonusPercent || 25) / 100;
    const newAtk = Math.round(player.stats.atk * atkMultiplier);
    const newMaxHp = Math.round(player.stats.maxHp * hpMultiplier);

    setPlayer((prev) => ({
      ...prev,
      level: 1,
      gold: prev.gold - req.requiredGold + 150000,
      diamonds: prev.diamonds + 1500,
      mana: 100,
      maxMana: 100 + nextRebirthCount * 20,
      rebirthCount: nextRebirthCount,
      unlockedPerks: updatedPerks,
      stats: {
        ...prev.stats,
        atk: newAtk,
        hp: newMaxHp,
        maxHp: newMaxHp,
        critRate: Number((prev.stats.critRate + (perkToUnlock.effect.critRateBonus || 5)).toFixed(1)),
        critDmg: prev.stats.critDmg + (perkToUnlock.effect.critDmgBonus || 25),
        leechRate: Number((prev.stats.leechRate + (perkToUnlock.effect.leechBonus || 3)).toFixed(1)),
        afkSpeed: prev.stats.afkSpeed + (perkToUnlock.effect.afkSpeedBonusPercent || 25),
        cp: prev.stats.cp + 120000 * nextRebirthCount,
      },
    }));

    setCurrentExp(0);
    const initialStg = generateStagesDatabase()[0];
    setCurrentStage(initialStg);
    setLevelRewards(generateLevelProgression()); // Refresh level rewards so player can re-climb and earn again!

    soundManager.playVictorySound();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 }, colors: ['#f59e0b', '#06b6d4', '#ff5f7e', '#a855f7'] });
    const successMsg = `TRÙNG SINH BẬC ${nextRebirthCount} THÀNH CÔNG! KÍCH HOẠT ĐẶC QUYỀN: ${perkToUnlock.nameVi.toUpperCase()}!`;
    showToast(successMsg, 'military_tech');
    return { success: true, message: successMsg };
  };

  // Starter Pack Claim with One-Time Enforcement
  const claimStarterPack = (): { success: boolean; message: string } => {
    if (player.hasClaimedStarterPack) {
      showToast('Bạn đã nhận Gói Tiếp Tế Tân Thủ rồi! Mỗi tài khoản chỉ nhận 1 lần.', 'warning');
      return { success: false, message: 'Đã nhận rồi' };
    }

    setPlayer((prev) => ({
      ...prev,
      hasClaimedStarterPack: true,
      gold: prev.gold + 500000,
      diamonds: prev.diamonds + 2000,
      voidTokens: prev.voidTokens + 300,
    }));

    soundManager.playRewardSound();
    confetti({ particleCount: 80, spread: 90, colors: ['#4cd7f6', '#ffb95f', '#f43f5e'] });
    showToast('ĐÃ NHẬN GÓI TIẾP TẾ TÂN THỦ (+500K 🪙, +2000 💎)!', 'card_giftcard');
    return { success: true, message: 'Nhận thành công' };
  };

  const selectStage = (stageId: string) => {
    const stg = stages.find((s) => s.id === stageId);
    if (!stg) return;
    setGameMode('campaign');
    setCurrentStage(stg);
    const targetBoss = availableBosses.find((b) => b.id === stg.bossId) || availableBosses[0];
    const scaledMax = calculateScaledBossHp(player.level, stg.hpMultiplier);
    setActiveBoss({
      ...targetBoss,
      level: Math.max(1, player.level + stg.stageNum - 1),
      maxHp: scaledMax,
      currentHp: scaledMax,
    });
    showToast(`VÀO ${stg.displayName}! (BOSS LV.${player.level + stg.stageNum - 1})`, 'play_arrow');
  };

  const clearStage = () => {
    incrementQuestProgress('q_main_boss', 1);
    addEventPoints(120);

    if (gameMode === 'tower') {
      const nextFloor = player.towerFloor + 1;
      const towerGold = 25000 * nextFloor;
      addExp(300 + nextFloor * 50);
      setPlayer((prev) => ({
        ...prev,
        towerFloor: nextFloor,
        gold: prev.gold + towerGold,
        diamonds: prev.diamonds + 100,
        stats: { ...prev.stats, afkSpeed: prev.stats.afkSpeed + 2, cp: prev.stats.cp + 12000 },
      }));
      confetti({ particleCount: 90, spread: 100, colors: ['#4cd7f6', '#ddb7ff', '#ffb95f'] });
      showToast(`VƯỢT THÁP TẦNG ${player.towerFloor} THÀNH CÔNG! (+100 💎, +2% Tốc AFK)`, 'domain');
      return;
    }

    if (gameMode === 'roguelike') {
      addExp(450);
      setPlayer((prev) => ({
        ...prev,
        gold: prev.gold + 35000,
        voidTokens: prev.voidTokens + 40,
      }));
      triggerBuffDraft();
      confetti({ particleCount: 80, spread: 90, colors: ['#ff5f7e', '#4cd7f6'] });
      showToast('TIÊU DIỆT TRÙM MÊ CUNG! HÃY CHỌN THẺ BÀI DỊ BIẾN MỚI!', 'auto_awesome');
      return;
    }

    // Campaign Mode
    const expGained = Math.round(currentStage.expReward * (activeEvent.expMultiplier || 1.0));
    addExp(expGained);
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + currentStage.goldReward,
    }));

    const currentIndex = stages.findIndex((s) => s.id === currentStage.id);
    const updatedStages = stages.map((s, idx) => {
      if (idx === currentIndex) return { ...s, cleared: true };
      if (idx === currentIndex + 1) return { ...s, unlocked: true };
      return s;
    });
    setStages(updatedStages);

    confetti({ particleCount: 100, spread: 100, colors: ['#4cd7f6', '#ffb95f', '#f43f5e'] });
    showToast(
      `VƯỢT ẢI THÀNH CÔNG: ${currentStage.displayName}! (+${expGained} EXP, +${currentStage.goldReward.toLocaleString()} Vàng)`,
      'military_tech'
    );
  };

  // Switch Active Hero & Sync Skills
  const switchHero = (heroId: string) => {
    const hero = availableHeroes.find((h) => h.id === heroId);
    if (!hero) return;
    setActiveHero(hero);
    setSkills(mapHeroSkillsToSkillItems(hero));
    const starBonus = 1 + (hero.stars - 3) * 0.15;
    setPlayer((prev) => ({
      ...prev,
      name: hero.name,
      title: hero.title,
      classArchetype: hero.classArchetype,
      stats: {
        ...prev.stats,
        atk: Math.floor(1400 * hero.statsMultiplier.atk * starBonus * (1 + prev.level * 0.25)),
        hp: Math.floor(9000 * hero.statsMultiplier.hp * starBonus * (1 + prev.level * 0.25)),
        def: Math.floor(400 * hero.statsMultiplier.def * starBonus * (1 + prev.level * 0.2)),
        critRate: Number((15.0 * hero.statsMultiplier.critRate).toFixed(1)),
        leechRate: Number((5.5 * hero.statsMultiplier.leechRate).toFixed(1)),
      },
    }));
    showToast(`ĐÃ CHUYỂN TƯỚNG: ${hero.name} (${hero.classVi})!`, 'person_pin');
  };

  // Promote Hero Star (Awakening 1★ -> 10★)
  const promoteHeroStar = (heroId: string) => {
    const hero = availableHeroes.find((h) => h.id === heroId);
    if (!hero) return;
    if (hero.stars >= 10) {
      showToast('Tướng đã đạt cấp Thức Tỉnh tối đa (10★)!', 'verified');
      return;
    }
    const costDiamonds = 500;
    const costTokens = 80;
    if (player.diamonds < costDiamonds || player.voidTokens < costTokens) {
      showToast(`Cần ${costDiamonds} Kim Cương & ${costTokens} Void Tokens để Thức Tỉnh Sao!`, 'error');
      return;
    }

    const updatedHero: HeroCharacter = { ...hero, stars: hero.stars + 1 };
    setAvailableHeroes((prev) => prev.map((h) => (h.id === heroId ? updatedHero : h)));
    if (activeHero.id === heroId) {
      setActiveHero(updatedHero);
    }

    const cpBoost = 35000 * updatedHero.stars;
    setPlayer((prev) => ({
      ...prev,
      diamonds: prev.diamonds - costDiamonds,
      voidTokens: prev.voidTokens - costTokens,
      stats: {
        ...prev.stats,
        atk: Math.round(prev.stats.atk * 1.15),
        hp: Math.round(prev.stats.hp * 1.15),
        def: Math.round(prev.stats.def * 1.15),
        cp: prev.stats.cp + cpBoost,
      },
    }));
    incrementQuestProgress('q_ach_cp', cpBoost);
    addEventPoints(250);
    soundManager.playLevelUpSound();
    confetti({ particleCount: 85, spread: 90, colors: ['#facc15', '#ff5f7e', '#4cd7f6'] });
    showToast(`THỨC TỈNH ${updatedHero.name.toUpperCase()} LÊN ${updatedHero.stars}★! (+${cpBoost.toLocaleString()} CP)`, 'stars');
  };

  const switchBoss = (bossId: string) => {
    const b = availableBosses.find((item) => item.id === bossId);
    if (!b) return;
    const scaledMax = calculateScaledBossHp(player.level, currentStage?.hpMultiplier || 1.0);
    setActiveBoss({
      ...b,
      level: Math.max(1, player.level + currentStage.stageNum - 1),
      maxHp: scaledMax,
      currentHp: scaledMax,
    });
    setComboHits(0);
    showToast(`KHIÊU CHIẾN BOSS: ${b.name} (LV.${player.level + currentStage.stageNum - 1})!`, 'swords');
  };

  // Equip Item directly from Inventory Stash
  const equipItem = (item: EquipmentItem) => {
    const currentEquipped = equippedGear[item.slot];
    const atkDiff = item.enhancedAtk - (currentEquipped?.enhancedAtk || 0);
    const cpBonus = item.rarity === 'Celestial' ? 85000 : item.rarity === 'Mythic' ? 45000 : 18000;

    setEquippedGear((prev) => ({
      ...prev,
      [item.slot]: item,
    }));
    setSelectedItem(item);

    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        atk: Math.max(800, prev.stats.atk + atkDiff),
        cp: prev.stats.cp + Math.max(5000, atkDiff * 35 + cpBonus / 4),
      },
    }));

    showToast(`ĐÃ TRANG BỊ: ${item.nameVi.toUpperCase()} (+${item.enhanceLevel})!`, 'check_circle');
  };

  const claimLevelReward = (level: number) => {
    if (level > player.level) {
      showToast(`Chưa đạt Lv.${level} để nhận thưởng!`, 'lock');
      return { success: false, message: 'Level too low' };
    }
    const reward = levelRewards.find((r) => r.level === level);
    if (!reward) return { success: false, message: 'Reward not found' };
    if (reward.claimed) {
      showToast(`Phần thưởng Lv.${level} đã được nhận trước đó!`, 'info');
      return { success: false, message: 'Already claimed' };
    }

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + reward.rewards.gold,
      diamonds: prev.diamonds + reward.rewards.diamonds,
      voidStones: prev.voidStones + reward.rewards.voidStones,
      voidTokens: prev.voidTokens + reward.rewards.voidTokens,
      title: reward.unlockedTitle || prev.title,
      stats: {
        ...prev.stats,
        atk: prev.stats.atk + reward.statBonus.atkBonus,
        hp: prev.stats.hp + reward.statBonus.hpBonus,
        def: prev.stats.def + reward.statBonus.defBonus,
        cp: prev.stats.cp + reward.statBonus.cpGain,
      },
    }));

    if (reward.rewards.itemDropName) {
      const newItem: EquipmentItem = {
        id: `LV-${level}`,
        name: reward.rewards.itemDropName,
        nameVi: reward.rewards.itemDropName,
        slot: 'weapon',
        slotLabel: 'Thần Binh',
        rarity: reward.rewards.itemDropRarity || 'Epic',
        setName: 'Bộ Sáng Thế Vĩnh Hằng',
        enhanceLevel: 5,
        maxEnhance: 25,
        baseAtk: 450 + level * 25,
        enhancedAtk: 750 + level * 35,
        substats: [
          { label: 'Tỷ Lệ Bạo', value: '+10.5%', isCrit: true },
          { label: 'Sát Thương Nguyên Tố', value: '+18.0%' },
        ],
        specialEffectVi: `Trang bị thưởng mốc Lv.${level} mang sức mạnh nguyên tố tinh vân.`,
        iconSymbol: 'auto_awesome',
        iconBgColor: '#6f00be',
        gemSlots: [{ unlocked: true, gemName: 'Ngọc Tinh Vân', gemColor: '#ddb7ff', bonus: '+8% Toàn Chỉ Số' }],
      };
      setInventory((prev) => [newItem, ...prev]);
    }

    setLevelRewards((prev) => prev.map((r) => (r.level === level ? { ...r, claimed: true } : r)));
    soundManager.playRewardSound();
    confetti({ particleCount: 50, spread: 70, colors: ['#4cd7f6', '#ffb95f'] });
    showToast(`NHẬN THƯỞNG LV.${level}: +${reward.rewards.diamonds} 💎, +${reward.rewards.gold.toLocaleString()} Vàng!`, 'card_giftcard');
    return { success: true, message: 'Claimed' };
  };

  const claimAllAvailableRewards = () => {
    let totalGold = 0;
    let totalDiamonds = 0;
    let count = 0;

    const updated = levelRewards.map((r) => {
      if (r.level <= player.level && !r.claimed) {
        totalGold += r.rewards.gold;
        totalDiamonds += r.rewards.diamonds;
        count++;
        return { ...r, claimed: true };
      }
      return r;
    });

    if (count === 0) {
      showToast('Không có phần thưởng cấp độ nào chưa nhận!', 'info');
      return;
    }

    setLevelRewards(updated);
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + totalGold,
      diamonds: prev.diamonds + totalDiamonds,
      stats: {
        ...prev.stats,
        cp: prev.stats.cp + count * 9500,
      },
    }));

    soundManager.playRewardSound();
    confetti({ particleCount: 80, spread: 90, colors: ['#4cd7f6', '#ffb95f', '#f43f5e'] });
    showToast(`ĐÃ NHẬN ${count} MỐC QUÀ CẤP ĐỘ (+${totalDiamonds} 💎)!`, 'auto_awesome');
  };

  // Add EXP with safe multi-level progression
  const addExp = (amount: number) => {
    if (amount <= 0 || player.level >= 100) return;
    let nextExp = currentExp + amount;
    let newLevel = player.level;
    let statAtkGain = 0;
    let statHpGain = 0;
    let statCpGain = 0;

    while (newLevel < 100) {
      const requiredExp = Math.floor(120 * Math.pow(newLevel, 1.55));
      if (nextExp >= requiredExp) {
        nextExp -= requiredExp;
        newLevel += 1;
        statAtkGain += 380;
        statHpGain += 2200;
        statCpGain += 16500;
      } else {
        break;
      }
    }

    if (newLevel > player.level) {
      setPlayer((prev) => ({
        ...prev,
        level: newLevel,
        stats: {
          ...prev.stats,
          atk: prev.stats.atk + statAtkGain,
          hp: prev.stats.hp + statHpGain,
          cp: prev.stats.cp + statCpGain,
        },
      }));
      setCurrentExp(nextExp);
      soundManager.playLevelUpSound();
      confetti({ particleCount: 85, spread: 85, colors: ['#4cd7f6', '#ffb95f', '#a855f7'] });
      showToast(`CHÚC MỪNG! THĂNG CẤP LÊN LEVEL ${newLevel}!`, 'military_tech');
    } else {
      setCurrentExp(nextExp);
    }
  };

  // Breakthrough / Level Up with strict in-game requirements (Gold + Full EXP)
  const levelUpWithRequirements = (): { success: boolean; message: string } => {
    if (player.level >= 100) {
      return { success: false, message: 'Đã đạt cấp độ tối đa (Lv.100)!' };
    }
    const requiredExp = maxExp;
    const requiredGold = player.level * 2500;

    if (currentExp < requiredExp) {
      const msg = `Chưa đủ điều kiện: Cần ${requiredExp} EXP (hiện có ${currentExp}/${requiredExp}). Hãy vượt ải hoặc làm nhiệm vụ!`;
      showToast(msg, 'warning');
      return { success: false, message: msg };
    }

    if (player.gold < requiredGold) {
      const msg = `Chưa đủ điều kiện: Cần ${requiredGold.toLocaleString()} Vàng (hiện có ${player.gold.toLocaleString()} Vàng).`;
      showToast(msg, 'warning');
      return { success: false, message: msg };
    }

    const nextLvl = player.level + 1;
    setCurrentExp(currentExp - requiredExp);
    setPlayer((prev) => ({
      ...prev,
      level: nextLvl,
      gold: prev.gold - requiredGold,
      stats: {
        ...prev.stats,
        atk: prev.stats.atk + 380,
        hp: prev.stats.hp + 2200,
        cp: prev.stats.cp + 16500,
      },
    }));

    soundManager.playLevelUpSound();
    confetti({ particleCount: 90, spread: 85, colors: ['#4cd7f6', '#ffb95f', '#f43f5e'] });
    showToast(`ĐỘT PHÁ THÀNH CÔNG! THĂNG CẤP LÊN LEVEL ${nextLvl}!`, 'military_tech');
    return { success: true, message: `Thăng cấp lên Level ${nextLvl} thành công!` };
  };

  // Combat Damage with Roguelike Buffs, Audio FX, Leech, and Boss Hit Reactions
  const dealDamageToBoss = (customAmount?: number, isCrit = false, label?: string) => {
    const buffAtkMult = activeBuffs.reduce((acc, b) => acc + (b.atkMult || 0) * b.stackCount, 1.0);
    const buffCritBonus = activeBuffs.reduce((acc, b) => acc + (b.critDmgBonus || 0) * b.stackCount, 0);
    const critMultiplier = isCrit ? (player.stats.critDmg + buffCritBonus) / 100 : 1.0;

    let calculatedDmg = 0;
    if (customAmount) {
      calculatedDmg = Math.round(customAmount * buffAtkMult * (isCrit ? 1.35 : 1.0));
    } else {
      calculatedDmg = Math.round(calculateScaledDamage(player.stats.atk, player.level) * buffAtkMult * critMultiplier);
    }

    // Play Authentic Combat Sound FX
    if (isCrit) {
      soundManager.playCriticalHitImpact();
      soundManager.playBossGruntRoar();
    } else {
      if (Math.random() > 0.45) {
        soundManager.playMeleeHitSound();
      } else {
        soundManager.playHeavyBladeClash();
      }
      if (comboHits % 4 === 0) {
        soundManager.playBossGruntRoar();
      }
    }
    soundManager.playComboChainSound(comboHits);

    // Life Leech on Hit
    if (player.stats.leechRate > 0) {
      const healed = Math.round(calculatedDmg * (player.stats.leechRate / 100));
      setPlayer((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          hp: Math.min(prev.stats.maxHp, prev.stats.hp + healed),
        },
      }));
    }

    incrementQuestProgress('q_daily_slash', 1);

    setComboHits((c) => {
      const nextCombo = c + 1;
      if (nextCombo >= 30) incrementQuestProgress('q_ach_combo', 30);
      return nextCombo;
    });

    if (gameMode === 'worldboss') {
      setWorldBossCurrentDamage((prev) => {
        const nextTotal = prev + calculatedDmg;
        incrementQuestProgress('q_event_worldboss', calculatedDmg);
        if (nextTotal > player.worldBossBestDps) {
          setPlayer((p) => ({ ...p, worldBossBestDps: nextTotal }));
        }
        return nextTotal;
      });
    }

    setActiveBoss((prev) => {
      const nextHp = Math.max(0, prev.currentHp - calculatedDmg);
      const isDead = nextHp === 0;
      const nextBreak = Math.min(100, prev.breakGauge + (isCrit ? 7 : 3));

      if (isDead) {
        soundManager.playVictorySound();
        setTimeout(() => clearStage(), 50);
      }

      return {
        ...prev,
        currentHp: isDead ? prev.maxHp : nextHp,
        breakGauge: isDead ? 0 : nextBreak,
      };
    });

    if (isCrit && label) {
      showToast(`${label}! +${calculatedDmg.toLocaleString()} DMG`, 'bolt');
    }
  };

  // Trigger Hero Skill with Mana Cost & Cooldown
  const triggerSkill = (skillId: string): number => {
    const s = skills.find((item) => item.id === skillId);
    if (!s) return 0;
    if (s.cooldownRemaining > 0) {
      showToast(`${s.name} đang hồi chiêu (${s.cooldownRemaining.toFixed(1)}s)`, 'hourglass_empty');
      return 0;
    }

    if (player.mana < s.manaCost) {
      showToast(`Không đủ Mana! Cần ${s.manaCost} MP (Hiện có: ${player.mana} MP)`, 'bolt');
      return 0;
    }

    // Deduct Mana
    setPlayer((prev) => ({ ...prev, mana: Math.max(0, prev.mana - s.manaCost) }));

    // Play synthesized element audio & mana surge
    soundManager.playManaCastSound();
    soundManager.playSkillSound(s.element);

    const hasCdrPerk = (player.unlockedPerks || []).includes('perk_mana_nexus');
    const baseCdr = hasCdrPerk ? 0.2 : 0;
    const cdr = Math.min(0.65, baseCdr + activeBuffs.reduce((acc, b) => acc + (b.cooldownReduction || 0) * b.stackCount, 0));
    const effectiveCd = Number((s.cooldownMax * (1 - cdr)).toFixed(1));

    setSkills((prev) =>
      prev.map((item) => (item.id === skillId ? { ...item, cooldownRemaining: effectiveCd } : item))
    );

    const isWeakness = activeBoss.weaknesses.includes(s.element as any);
    const weaknessMult = isWeakness ? 1.5 : 1.0;
    const rawDmg = Math.round((player.stats.atk + player.level * 75) * s.damageMultiplier * weaknessMult);
    dealDamageToBoss(rawDmg, true, `${s.name.toUpperCase()}${isWeakness ? ' (KHẮC HỆ x1.5)' : ''}`);
    return rawDmg;
  };

  const resetBoss = () => {
    setActiveBoss((prev) => ({
      ...prev,
      currentHp: prev.maxHp,
      breakGauge: 45,
    }));
    showToast(`HỒI SINH BOSS: ${activeBoss.name}!`, 'restart_alt');
  };

  const useDash = (): boolean => {
    if (dashCharges > 0) {
      setDashCharges((d) => d - 1);
      showToast('DOUBLE DASH! NÉ ĐÒN HOÀN HẢO (+15% CRIT)', 'air');
      setTimeout(() => {
        setDashCharges((d) => Math.min(2, d + 1));
      }, 3000);
      return true;
    }
    showToast('ĐANG HỒI LƯỢT DOUBLE DASH', 'hourglass_empty');
    return false;
  };

  const useUltimate = (): number => {
    if (!ultimateReady) {
      showToast('TUYỆT KỸ DIMENSION BREAK ĐANG TÍCH TỤ NĂNG LƯỢNG...', 'hourglass_empty');
      return 0;
    }
    setUltimateReady(false);
    incrementQuestProgress('q_daily_ult', 1);
    addEventPoints(100);
    confetti({ particleCount: 70, spread: 80, colors: ['#4cd7f6', '#ddb7ff', '#ffb95f'] });
    const ultDamage = Math.round(activeBoss.maxHp * 0.38);
    dealDamageToBoss(ultDamage, true, 'DIMENSION BREAK');
    showToast('DIMENSION BREAK BÙNG NỔ! XÉ RÁCH KHÔNG THỜI GIAN!', 'cyclone');
    setTimeout(() => {
      setUltimateReady(true);
      showToast('TUYỆT KỸ DIMENSION BREAK ĐÃ SẴN SÀNG!', 'auto_awesome');
    }, 10000);
    return ultDamage;
  };

  const swapSocket = (slotId: 'A' | 'B' | 'C', rune: MutatorRune) => {
    setActiveSockets((prev) => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        title: rune.name,
        category:
          rune.category === 'element' ? 'Element Core' : rune.category === 'geometry' ? 'Geometry' : 'Augment Rune',
        bonus: rune.bonus,
        iconSymbol: rune.iconSymbol,
        color: rune.color,
      },
    }));
    showToast(`ĐÃ KHẢM RUNE VÀO SOCKET ${slotId}: ${rune.name}`, rune.iconSymbol);
  };

  const upgradeEquipment = (itemId: string) => {
    const item =
      equippedGear[selectedItem.slot]?.id === itemId
        ? equippedGear[selectedItem.slot]
        : inventory.find((i) => i.id === itemId);
    if (!item) return { success: false, message: 'Không tìm thấy trang bị' };
    if (item.enhanceLevel >= item.maxEnhance) {
      showToast('Trang bị đã đạt cấp tối đa! Hãy Đột Phá giới hạn.', 'verified');
      return { success: false, message: 'Đã đạt cấp tối đa' };
    }

    const costVoidStones = 10 + item.enhanceLevel * 2;
    const costGold = 5000 + item.enhanceLevel * 3000;

    if (player.voidStones < costVoidStones || player.gold < costGold) {
      showToast('Không đủ Đá Void hoặc Vàng Aether!', 'error');
      return { success: false, message: 'Không đủ nguyên liệu' };
    }

    incrementQuestProgress('q_daily_upgrade', 1);

    const successRate = Math.max(40, 100 - (item.enhanceLevel - 1) * 3.5);
    const rolled = Math.random() * 100;
    const isSuccess = rolled <= successRate;

    setPlayer((prev) => ({
      ...prev,
      voidStones: prev.voidStones - costVoidStones,
      gold: prev.gold - costGold,
      stats: {
        ...prev.stats,
        atk: isSuccess ? prev.stats.atk + 220 : prev.stats.atk,
        cp: isSuccess ? prev.stats.cp + 9500 : prev.stats.cp,
      },
    }));

    if (isSuccess) {
      const nextLevel = item.enhanceLevel + 1;
      const updatedItem: EquipmentItem = {
        ...item,
        enhanceLevel: nextLevel,
        enhancedAtk: item.enhancedAtk + 220,
      };
      if (equippedGear[item.slot]?.id === itemId) {
        setEquippedGear((prev) => ({ ...prev, [item.slot]: updatedItem }));
      }
      setInventory((prev) => prev.map((i) => (i.id === itemId ? updatedItem : i)));
      setSelectedItem(updatedItem);
      incrementQuestProgress('q_ach_cp', 9500);
      confetti({ particleCount: 40, spread: 60, colors: ['#4cd7f6', '#ffb95f'] });
      setLeaderboard((prev) =>
        prev
          .map((p) => (p.isCurrentPlayer ? { ...p, cp: p.cp + 9500 } : p))
          .sort((a, b) => b.cp - a.cp)
          .map((p, idx) => ({ ...p, rank: idx + 1 }))
      );
      showToast(`CƯỜNG HÓA THÀNH CÔNG +${nextLevel}! (+220 ATK, +9,500 CP)`, 'upgrade');
      return { success: true, message: `Thành công lên +${nextLevel}!` };
    } else {
      showToast(`CƯỜNG HÓA THẤT BẠI! (Tỷ lệ: ${Math.round(successRate)}%)`, 'close');
      return { success: false, message: 'Cường hóa thất bại!' };
    }
  };

  const breakthroughEquipment = (itemId: string) => {
    const updatedItem: EquipmentItem = {
      ...selectedItem,
      maxEnhance: selectedItem.maxEnhance + 5,
      enhancedAtk: selectedItem.enhancedAtk + 450,
    };
    if (equippedGear[selectedItem.slot]?.id === itemId) {
      setEquippedGear((prev) => ({ ...prev, [selectedItem.slot]: updatedItem }));
    }
    setInventory((prev) => prev.map((i) => (i.id === itemId ? updatedItem : i)));
    setSelectedItem(updatedItem);
    setPlayer((prev) => ({
      ...prev,
      stats: { ...prev.stats, atk: prev.stats.atk + 450, cp: prev.stats.cp + 22000 },
    }));
    confetti({ particleCount: 55, spread: 70, colors: ['#ff5f7e', '#ffb95f'] });
    showToast(`ĐỘT PHÁ THẦN KHÍ THÀNH CÔNG! Mở giới hạn +${updatedItem.maxEnhance}`, 'auto_fix_high');
    return { success: true, message: 'Đột phá thành công!' };
  };

  const socketGem = (itemId: string, slotIndex: number, gemName: string, gemBonus: string) => {
    const updateSlots = (gemSlots: EquipmentItem['gemSlots']) => {
      const copy = [...gemSlots];
      if (copy[slotIndex]) {
        copy[slotIndex] = {
          unlocked: true,
          gemName,
          gemColor: '#a855f7',
          bonus: gemBonus,
        };
      }
      return copy;
    };

    if (equippedGear[selectedItem.slot]?.id === itemId) {
      setEquippedGear((prev) => ({
        ...prev,
        [selectedItem.slot]: {
          ...prev[selectedItem.slot],
          gemSlots: updateSlots(prev[selectedItem.slot].gemSlots),
        },
      }));
    }
    setSelectedItem((prev) => ({
      ...prev,
      gemSlots: updateSlots(prev.gemSlots),
    }));

    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        cp: prev.stats.cp + 8500,
        critRate: Number((prev.stats.critRate + 3.0).toFixed(1)),
      },
    }));
    showToast(`ĐÃ KHẢM ${gemName.toUpperCase()}! (+3% BẠO KÍCH, +8,500 CP)`, 'diamond');
  };

  const quickEquipBis = () => {
    const slots: GearSlot[] = ['weapon', 'helmet', 'chest', 'gloves', 'necklace', 'ring', 'boots', 'relic'];
    const bestGear: Record<GearSlot, EquipmentItem> = { ...equippedGear };

    slots.forEach((slot) => {
      const candidates = inventory.filter((i) => i.slot === slot);
      if (candidates.length > 0) {
        const best = candidates.reduce((prev, curr) => (curr.enhancedAtk > prev.enhancedAtk ? curr : prev));
        bestGear[slot] = best;
      }
    });

    setEquippedGear(bestGear);
    setSelectedItem(bestGear.weapon);

    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        atk: prev.stats.atk + 850,
        cp: prev.stats.cp + 65000,
        def: prev.stats.def + 350,
      },
    }));
    incrementQuestProgress('q_ach_cp', 65000);
    confetti({ particleCount: 70, spread: 80, colors: ['#4cd7f6', '#ffb95f', '#ff5f7e'] });
    showToast('ĐÃ MẶC BỘ TRANG BỊ TỐI THƯỢNG (BIS) (+65,000 CP)!', 'verified');
  };

  const salvageJunk = () => {
    setPlayer((prev) => ({
      ...prev,
      voidTokens: prev.voidTokens + 120,
      voidStones: prev.voidStones + 45,
    }));
    showToast('PHÂN RÃ TRANG BỊ DƯ THỪA: +120 Void Tokens, +45 Đá Void', 'delete_sweep');
  };

  const claimAfkRewards = () => {
    const now = Date.now();
    const lastClaim = player.lastAfkClaimTime || now;
    const elapsedSeconds = Math.max(0, (now - lastClaim) / 1000);

    // Require at least 60s minimum elapsed time to claim!
    if (elapsedSeconds < 60) {
      const waitRemaining = Math.ceil(60 - elapsedSeconds);
      showToast(`Chưa tích lũy đủ thời gian AFK (Tối thiểu 60s)! Còn ${waitRemaining}s nữa.`, 'hourglass_top');
      return { gold: 0, diamonds: 0, voidCores: 0 };
    }

    incrementQuestProgress('q_daily_afk', 1);

    // Cap at 8 hours (28,800 seconds)
    const effectiveHours = Math.min(8, elapsedSeconds / 3600);
    const speedBonus = 1 + (player.stats.afkSpeed || 0) / 100;
    const goldEarned = Math.round(effectiveHours * 45000 * player.level * speedBonus);
    const diamondsEarned = Math.round(effectiveHours * (80 + player.towerFloor * 10));
    const coresEarned = Math.round(effectiveHours * 25);

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + goldEarned,
      diamonds: prev.diamonds + diamondsEarned,
      voidStones: prev.voidStones + coresEarned,
      lastAfkClaimTime: now,
    }));

    soundManager.playRewardSound();
    confetti({ particleCount: 70, spread: 90, colors: ['#f59e0b', '#06b6d4', '#ddb7ff'] });
    const formattedMinutes = Math.floor(elapsedSeconds / 60);
    showToast(`THU HOẠCH AFK (${formattedMinutes} phút): +${goldEarned.toLocaleString()} Vàng, +${diamondsEarned} 💎!`, 'hourglass_empty');
    return { gold: goldEarned, diamonds: diamondsEarned, voidCores: coresEarned };
  };

  const speedUpForge = () => {
    showToast('LÒ RÈN AETHER TĂNG TỐC -10 PHÚT MIỄN PHÍ!', 'fast_forward');
  };

  const harvestCrystals = () => {
    const now = Date.now();
    const lastHarvest = player.lastCrystalHarvestTime || 0;
    const elapsedSeconds = (now - lastHarvest) / 1000;
    const cooldownDuration = 180; // 3 minutes

    if (elapsedSeconds < cooldownDuration) {
      const remaining = Math.ceil(cooldownDuration - elapsedSeconds);
      showToast(`Mỏ Tinh Thể đang ngưng tụ năng lượng! Vui lòng chờ ${remaining}s.`, 'hourglass_empty');
      return;
    }

    incrementQuestProgress('q_daily_afk', 1);
    const gained = 12000 * player.level;
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + gained,
      lastCrystalHarvestTime: now,
    }));
    soundManager.playRewardSound();
    showToast(`THU HOẠCH TINH THỂ: +${gained.toLocaleString()} Vàng Aether!`, 'monetization_on');
  };

  const gachaPulls = (count: 1 | 10): GachaItem[] => {
    const costDiamonds = count === 1 ? 300 : 2700;
    if (player.diamonds < costDiamonds) {
      showToast('Không đủ Kim Cương! Hãy làm Nhiệm Vụ hoặc thu hoạch AFK.', 'error');
      return [];
    }

    incrementQuestProgress('q_main_gacha', count);
    addEventPoints(count * 50);
    setPlayer((prev) => ({ ...prev, diamonds: prev.diamonds - costDiamonds }));

    const results: GachaItem[] = [];
    const pool = [
      { name: 'Lưỡi Hái Sáng Thế Tinh Vân CEL-01', rarity: 'Celestial' as const, type: 'weapon' as const, color: '#ff5f7e', icon: 'auto_awesome' },
      { name: 'Mảnh Nữ Hoàng Seraphina (Celestial)', rarity: 'Celestial' as const, type: 'hero_shard' as const, color: '#f472b6', icon: 'flare' },
      { name: 'Thần Kiếm Sáng Thế Mythic', rarity: 'Mythic' as const, type: 'weapon' as const, color: '#f43f5e', icon: 'swords' },
      { name: 'Cổ Vật Hư Không Bất Diệt', rarity: 'Mythic' as const, type: 'relic' as const, color: '#fb7185', icon: 'emergency' },
      { name: 'Mảnh Tướng Aethel Cyber', rarity: 'Legendary' as const, type: 'hero_shard' as const, color: '#f59e0b', icon: 'shield_person' },
      { name: 'Mảnh Tướng Valeria Ranger', rarity: 'Legendary' as const, type: 'hero_shard' as const, color: '#10b981', icon: 'bolt' },
      { name: 'Mảnh Tướng Ignis Berserker', rarity: 'Legendary' as const, type: 'hero_shard' as const, color: '#f43f5e', icon: 'local_fire_department' },
      { name: 'Mảnh Tướng Kaelen Assassin', rarity: 'Legendary' as const, type: 'hero_shard' as const, color: '#c084fc', icon: 'flash_on' },
      { name: 'Giáp Trọng Lực Hư Không', rarity: 'Epic' as const, type: 'weapon' as const, color: '#a855f7', icon: 'security' },
      { name: 'Lõi Năng Lượng Void Core', rarity: 'Epic' as const, type: 'materials' as const, color: '#a855f7', icon: 'cyclone' },
      { name: 'Đá Cường Hóa Void x50', rarity: 'Rare' as const, type: 'materials' as const, color: '#06b6d4', icon: 'token' },
      { name: 'Tinh Hoa Aether x1000', rarity: 'Rare' as const, type: 'materials' as const, color: '#06b6d4', icon: 'diamond' },
    ];

    let hasTopTier = false;
    for (let i = 0; i < count; i++) {
      const roll = Math.random() * 100;
      let selected;
      if (pityCounter <= 1 || roll < 6) {
        selected = pool[Math.floor(Math.random() * 4)];
        hasTopTier = true;
      } else if (roll < 28) {
        selected = pool[4 + Math.floor(Math.random() * 4)];
      } else if (roll < 60) {
        selected = pool[8 + Math.floor(Math.random() * 2)];
      } else {
        selected = pool[10 + Math.floor(Math.random() * 2)];
      }

      results.push({
        id: `gacha-${Date.now()}-${i}`,
        name: selected.name,
        rarity: selected.rarity,
        type: selected.type,
        count: 1,
        color: selected.color,
        iconSymbol: selected.icon,
        desc: `Phần thưởng ${selected.rarity} từ Vòng Quay Tinh Vân.`,
      });
    }

    setPityCounter((p) => (hasTopTier ? 50 : Math.max(1, p - count)));
    if (hasTopTier) {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: ['#ff5f7e', '#f59e0b', '#4cd7f6'] });
      showToast('NỔ HŨ THẦN VŨ CELESTIAL / MYTHIC!', 'auto_awesome');
    } else {
      showToast(`TRIỆU HỒI x${count} HOÀN TẤT!`, 'style');
    }

    return results;
  };

  const addCurrencies = (gold: number, diamonds: number, tokens: number) => {
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + gold,
      diamonds: prev.diamonds + diamonds,
      voidTokens: prev.voidTokens + tokens,
    }));
    showToast('ĐÃ NHẬN TIẾP TẾ TÀI NGUYÊN!', 'add_circle');
  };

  return (
    <GameContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        gameMode,
        switchGameMode,
        activeBuffs,
        pendingBuffChoices,
        selectRoguelikeBuff,
        triggerBuffDraft,
        worldBossTimeLeft,
        worldBossCurrentDamage,
        activeHero,
        availableHeroes,
        switchHero,
        promoteHeroStar,
        activeBoss,
        availableBosses,
        switchBoss,
        stages,
        currentStage,
        selectStage,
        clearStage,
        player,
        currentExp,
        maxExp,
        levelRewards,
        claimLevelReward,
        claimAllAvailableRewards,
        addExp,
        levelUpWithRequirements,
        resetCharacterToStart,
        triggerRebirth,
        claimStarterPack,
        quests,
        claimQuestReward,
        incrementQuestProgress,
        events,
        activeEvent,
        claimEventMilestone,
        addEventPoints,
        equippedGear,
        inventory,
        selectedItem,
        setSelectedItem,
        equipItem,
        upgradeEquipment,
        breakthroughEquipment,
        socketGem,
        quickEquipBis,
        salvageJunk,
        dealDamageToBoss,
        triggerSkill,
        resetBoss,
        skills,
        dashCharges,
        useDash,
        ultimateReady,
        useUltimate,
        comboHits,
        clearComboHits,
        activeSockets,
        availableRunes,
        swapSocket,
        claimAfkRewards,
        speedUpForge,
        harvestCrystals,
        gachaPulls,
        pityCounter,
        leaderboard,
        toast,
        showToast,
        addCurrencies,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
