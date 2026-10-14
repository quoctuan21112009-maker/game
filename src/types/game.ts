export type TabType = 'sanctuary' | 'combat' | 'altar' | 'inventory' | 'astral';

export type CameraMode = '2d' | 'fps' | 'dynamic' | 'overshoulder' | 'isometric';

export type GestureMode = 'slash' | 'nova' | 'parry';

export type GameMode = 'campaign' | 'roguelike' | 'tower' | 'worldboss';

export interface PlayerStats {
  atk: number;
  hp: number;
  maxHp: number;
  def: number;
  critRate: number;
  critDmg: number;
  leechRate: number;
  afkSpeed: number;
  cp: number;
}

export interface PlayerProfile {
  name: string;
  title: string;
  classArchetype: string;
  level: number;
  vip: number;
  energy: number;
  maxEnergy: number;
  mana: number;
  maxMana: number;
  gold: number;
  diamonds: number;
  voidTokens: number;
  voidStones: number;
  towerFloor: number;
  worldBossBestDps: number;
  eventPoints: number;
  rebirthCount: number;
  unlockedPerks: string[];
  lastAfkClaimTime: number;
  lastCrystalHarvestTime: number;
  hasClaimedStarterPack: boolean;
  stats: PlayerStats;
}

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Celestial';

export type GearSlot =
  | 'weapon'
  | 'helmet'
  | 'chest'
  | 'gloves'
  | 'necklace'
  | 'ring'
  | 'boots'
  | 'relic';

export interface EquipmentItem {
  id: string;
  name: string;
  nameVi: string;
  slot: GearSlot;
  slotLabel: string;
  rarity: ItemRarity;
  setName?: string;
  enhanceLevel: number;
  maxEnhance: number;
  starTier?: number;
  baseAtk: number;
  enhancedAtk: number;
  substats: { label: string; value: string; isCrit?: boolean }[];
  specialEffectVi: string;
  iconSymbol: string;
  iconBgColor: string;
  gemSlots: {
    unlocked: boolean;
    gemName?: string;
    gemColor?: string;
    bonus?: string;
  }[];
  imageUrl?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  element: 'fire' | 'frost' | 'volt' | 'void' | 'aether';
  cooldownMax: number;
  cooldownRemaining: number;
  damageMultiplier: number;
  manaCost: number;
  tag: string;
  iconSymbol: string;
  accentColor: string;
  descVi?: string;
}

export interface RuneSocket {
  slotId: 'A' | 'B' | 'C';
  label: string;
  title: string;
  category: string;
  bonus: string;
  iconSymbol: string;
  color: string;
}

export interface MutatorRune {
  id: string;
  name: string;
  rarity: ItemRarity;
  category: 'element' | 'geometry' | 'augment';
  bonus: string;
  iconSymbol: string;
  color: string;
}

export interface LeaderboardPlayer {
  rank: number;
  name: string;
  title: string;
  guild: string;
  vip: number;
  cp: number;
  towerFloor: number;
  avatarIcon: string;
  isCurrentPlayer?: boolean;
}

export interface GachaItem {
  id: string;
  name: string;
  rarity: ItemRarity;
  type: 'weapon' | 'relic' | 'hero_shard' | 'materials';
  count: number;
  color: string;
  iconSymbol: string;
  desc: string;
}

export interface RoguelikeBuff {
  id: string;
  nameVi: string;
  rarity: 'Epic' | 'Legendary' | 'Mythic' | 'Celestial';
  descVi: string;
  icon: string;
  color: string;
  atkMult?: number;
  critRateBonus?: number;
  critDmgBonus?: number;
  cooldownReduction?: number;
  stackCount: number;
}

export interface QuestItem {
  id: string;
  category: 'daily' | 'main' | 'achievement' | 'event';
  titleVi: string;
  descVi: string;
  icon: string;
  target: number;
  progress: number;
  claimed: boolean;
  rewards: {
    gold: number;
    diamonds: number;
    exp: number;
    voidStones?: number;
    eventTokens?: number;
  };
}

export interface GameEventMilestone {
  pointsRequired: number;
  rewardTitle: string;
  diamonds: number;
  gold: number;
  voidStones: number;
  claimed: boolean;
}

export interface GameEvent {
  id: string;
  titleVi: string;
  subTitleVi: string;
  badge: string;
  bannerColor: string;
  accentColor: string;
  descriptionVi: string;
  activeBuffDescVi: string;
  expMultiplier: number;
  dropMultiplier: number;
  gachaRateUpHeroId?: string;
  timeRemainingSec: number;
  totalDurationSec: number;
  milestones: GameEventMilestone[];
}
