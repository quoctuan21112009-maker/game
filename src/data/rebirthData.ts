export interface RebirthPerk {
  tier: number;
  id: string;
  nameVi: string;
  descVi: string;
  icon: string;
  accentColor: string;
  effect: {
    atkBonusPercent: number;
    hpBonusPercent: number;
    cdrBonusPercent: number;
    afkSpeedBonusPercent: number;
    critRateBonus: number;
    critDmgBonus: number;
    leechBonus: number;
    manaRegenBonus: number;
  };
}

export const REBIRTH_PERKS: RebirthPerk[] = [
  {
    tier: 1,
    id: 'perk_aether_core',
    nameVi: 'Lõi Thần Thánh Sáng Thế',
    descVi: '+35% Tổng Sát Thương & +25% Máu Tối Đa vĩnh viễn',
    icon: 'cyclone',
    accentColor: '#4cd7f6',
    effect: {
      atkBonusPercent: 35,
      hpBonusPercent: 25,
      cdrBonusPercent: 0,
      afkSpeedBonusPercent: 0,
      critRateBonus: 0,
      critDmgBonus: 0,
      leechBonus: 0,
      manaRegenBonus: 0,
    },
  },
  {
    tier: 2,
    id: 'perk_mana_nexus',
    nameVi: 'Tụ Điểm Lượng Tử Vĩnh Hằng',
    descVi: 'Tốc độ hồi Mana +100% & Giảm 20% Hồi Chiêu Toàn Bộ Kỹ Năng',
    icon: 'bolt',
    accentColor: '#a855f7',
    effect: {
      atkBonusPercent: 0,
      hpBonusPercent: 0,
      cdrBonusPercent: 20,
      afkSpeedBonusPercent: 0,
      critRateBonus: 0,
      critDmgBonus: 0,
      leechBonus: 0,
      manaRegenBonus: 100,
    },
  },
  {
    tier: 3,
    id: 'perk_temporal_surge',
    nameVi: 'Gia Tốc Dòng Thời Gian',
    descVi: 'Tốc độ AFK +80% & Nhận thêm +50% Vàng/EXP Vượt Ải',
    icon: 'hourglass_top',
    accentColor: '#f59e0b',
    effect: {
      atkBonusPercent: 0,
      hpBonusPercent: 0,
      cdrBonusPercent: 0,
      afkSpeedBonusPercent: 80,
      critRateBonus: 0,
      critDmgBonus: 0,
      leechBonus: 0,
      manaRegenBonus: 0,
    },
  },
  {
    tier: 4,
    id: 'perk_vampiric_crest',
    nameVi: 'Huyết Ấn Bất Diệt',
    descVi: '+12% Hút Máu toàn phần & +30% Sức Chống Chịu',
    icon: 'water_drop',
    accentColor: '#ff5f7e',
    effect: {
      atkBonusPercent: 15,
      hpBonusPercent: 30,
      cdrBonusPercent: 0,
      afkSpeedBonusPercent: 0,
      critRateBonus: 0,
      critDmgBonus: 0,
      leechBonus: 12,
      manaRegenBonus: 0,
    },
  },
  {
    tier: 5,
    id: 'perk_godslayer',
    nameVi: 'Chiến Ý Thần Thánh Vô Song',
    descVi: '+25% Tỉ Lệ Bạo Kích & +120% Sát Thương Bạo Kích',
    icon: 'swords',
    accentColor: '#f43f5e',
    effect: {
      atkBonusPercent: 50,
      hpBonusPercent: 0,
      cdrBonusPercent: 10,
      afkSpeedBonusPercent: 0,
      critRateBonus: 25,
      critDmgBonus: 120,
      leechBonus: 0,
      manaRegenBonus: 50,
    },
  },
  {
    tier: 6,
    id: 'perk_void_sovereign',
    nameVi: 'Chúa Tể Hư Không Vô Ngã',
    descVi: '+100% Toàn Bộ Chỉ Số Chiến Đấu & Thêm 500,000 CP',
    icon: 'military_tech',
    accentColor: '#eab308',
    effect: {
      atkBonusPercent: 100,
      hpBonusPercent: 100,
      cdrBonusPercent: 15,
      afkSpeedBonusPercent: 100,
      critRateBonus: 30,
      critDmgBonus: 150,
      leechBonus: 15,
      manaRegenBonus: 100,
    },
  },
];

export const getRebirthRequirements = (rebirthCount: number) => {
  // Higher rebirth count = progressively harder milestones!
  // Rebirth 0: Level 25 & Tower Floor 5 & 100k Gold
  // Rebirth 1: Level 40 & Tower Floor 10 & 250k Gold
  // Rebirth 2: Level 55 & Tower Floor 15 & 450k Gold
  // Rebirth 3: Level 70 & Tower Floor 20 & 700k Gold
  // Rebirth 4: Level 85 & Tower Floor 25 & 1M Gold
  // Rebirth 5+: Level 100 & Tower Floor 30+ & 1.5M Gold
  const requiredLevel = Math.min(100, 25 + rebirthCount * 15);
  const requiredTower = 5 + rebirthCount * 5;
  const requiredGold = 100000 + rebirthCount * 150000;
  return { requiredLevel, requiredTower, requiredGold };
};
