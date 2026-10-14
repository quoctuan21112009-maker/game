export interface GameStage {
  id: string;
  chapter: number;
  chapterName: string;
  stageNum: number;
  displayName: string;
  recommendedLevel: number;
  bossId: string;
  bossNameVi: string;
  mobsCount: number;
  hpMultiplier: number;
  expReward: number;
  goldReward: number;
  firstClearReward: string;
  unlocked: boolean;
  cleared: boolean;
}

export const CHAPTERS_LIST = [
  { chapter: 1, name: 'Vết Nứt Tân Binh (Aether Rift)', bossId: 'chrono_chimera', bossNameVi: 'Chrono Chimera (Hư Không)', element: 'void' },
  { chapter: 2, name: 'Hẻm Núi Dung Nham (Molten Gorge)', bossId: 'ignis_colossus', bossNameVi: 'Ignis Colossus (Hỏa Diệm)', element: 'fire' },
  { chapter: 3, name: 'Băng Hà Vĩnh Cửu (Glacial Abyss)', bossId: 'frostborne_hydra', bossNameVi: 'Frostborne Hydra (Hàn Băng)', element: 'frost' },
  { chapter: 4, name: 'Đền Thờ Thiên Thể (Celestial Temple)', bossId: 'abyssal_archon', bossNameVi: 'Abyssal Archon (Thiên Thể)', element: 'void' },
  { chapter: 5, name: 'Tinh Vân Sấm Sét (Storm Nebula)', bossId: 'tempest_wyrm', bossNameVi: 'Tempest Wyrm (Lôi Điện)', element: 'volt' },
  { chapter: 6, name: 'Vực Thẳm Hỗn Mang (Entropy Abyss)', bossId: 'void_goliath', bossNameVi: 'Void Goliath (Hỗn Mang)', element: 'void' },
];

export const generateStagesDatabase = (): GameStage[] => {
  const stages: GameStage[] = [];

  CHAPTERS_LIST.forEach((chap) => {
    for (let s = 1; s <= 5; s++) {
      const recLevel = (chap.chapter - 1) * 15 + s * 3;
      stages.push({
        id: `stage-${chap.chapter}-${s}`,
        chapter: chap.chapter,
        chapterName: chap.name,
        stageNum: s,
        displayName: `Ải ${chap.chapter}-${s}: ${s === 5 ? `Trùm ${chap.bossNameVi}` : `Quái Tiên Phong #${s}`}`,
        recommendedLevel: recLevel,
        bossId: chap.bossId,
        bossNameVi: chap.bossNameVi,
        mobsCount: s === 5 ? 1 : 2 + s,
        hpMultiplier: 0.85 + (chap.chapter - 1) * 0.25 + s * 0.08,
        expReward: 180 * chap.chapter + s * 75,
        goldReward: 4500 * chap.chapter + s * 1500,
        firstClearReward: s === 5 ? 'Rương Thần Thoại Boss Hoàng Gia' : '+150 Kim Cương',
        unlocked: chap.chapter === 1 && s === 1,
        cleared: false,
      });
    }
  });

  return stages;
};

export const calculateScaledBossHp = (playerLevel: number, hpMultiplier = 1.0): number => {
  const baseHpAtLv1 = 35000;
  const levelFactor = Math.pow(Math.max(1, playerLevel), 1.12);
  const scaled = Math.round(baseHpAtLv1 * levelFactor * hpMultiplier);
  return Math.max(30000, scaled);
};

export const calculateScaledMobHp = (playerLevel: number, hpMultiplier = 1.0): number => {
  return Math.round(calculateScaledBossHp(playerLevel, hpMultiplier) * 0.22);
};

export const calculateScaledDamage = (baseAtk: number, playerLevel: number): number => {
  return Math.round((baseAtk + playerLevel * 65) * (0.92 + Math.random() * 0.22));
};

export const calculateScaledBossAttack = (playerLevel: number): number => {
  return Math.round((350 + playerLevel * 95) * (0.85 + Math.random() * 0.3));
};
