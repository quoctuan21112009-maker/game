import { ItemRarity } from '../types/game';

export interface LevelReward {
  level: number;
  expRequired: number;
  unlockedTitle?: string;
  rewards: {
    gold: number;
    diamonds: number;
    voidStones: number;
    voidTokens: number;
    itemDropName?: string;
    itemDropRarity?: ItemRarity;
    heroShards?: { heroId: string; heroName: string; count: number };
  };
  claimed: boolean;
  statBonus: {
    atkBonus: number;
    hpBonus: number;
    defBonus: number;
    cpGain: number;
  };
}

export const generateLevelProgression = (): LevelReward[] => {
  const levels: LevelReward[] = [];

  for (let lvl = 1; lvl <= 100; lvl++) {
    const isMajor = lvl % 10 === 0;
    const isMid = lvl % 5 === 0;
    const expRequired = Math.floor(120 * Math.pow(lvl, 1.55));

    let itemDropName: string | undefined;
    let itemDropRarity: ItemRarity | undefined;
    let heroShards: LevelReward['rewards']['heroShards'] | undefined;
    let unlockedTitle: string | undefined;

    if (lvl === 1) {
      unlockedTitle = 'Tân Binh Khởi Nguyên';
      itemDropName = 'Lưỡi Kiếm Hư Không EP-01';
      itemDropRarity = 'Epic';
    } else if (lvl === 5) {
      itemDropName = 'Song Nỏ Tinh Vân EP-02';
      itemDropRarity = 'Epic';
      heroShards = { heroId: 'valeria', heroName: 'Valeria (Xạ Thủ)', count: 10 };
      unlockedTitle = 'Tân Binh Aether';
    } else if (lvl === 10) {
      itemDropName = 'Mũ Giáp Tinh Tú EP-10';
      itemDropRarity = 'Epic';
      heroShards = { heroId: 'ignis', heroName: 'Ignis (Cuồng Chiến)', count: 15 };
      unlockedTitle = 'Vệ Binh Tinh Tú';
    } else if (lvl === 15) {
      itemDropName = 'Rìu Hỏa Diệm Địa Ngục EP-03';
      itemDropRarity = 'Legendary';
      heroShards = { heroId: 'lyra', heroName: 'Lyra (Pháp Sư)', count: 20 };
    } else if (lvl === 20) {
      itemDropName = 'Song Đoản Kiếm Hư Vô EP-07';
      itemDropRarity = 'Legendary';
      heroShards = { heroId: 'kaelen', heroName: 'Kaelen (Sát Thủ)', count: 25 };
      unlockedTitle = 'Kẻ Chinh Phục Không Gian';
    } else if (lvl === 25) {
      itemDropName = 'Giáp Thánh Quang Hộ Thân EP-05';
      itemDropRarity = 'Legendary';
      heroShards = { heroId: 'aurora', heroName: 'Aurora (Nữ Thần)', count: 30 };
    } else if (lvl === 30) {
      itemDropName = 'Dây Chuyền Thời Không EP-15';
      itemDropRarity = 'Legendary';
      heroShards = { heroId: 'aethel', heroName: 'Aethel (Hiệp Sĩ)', count: 35 };
      unlockedTitle = 'Bậc Thầy Thời Không';
    } else if (lvl === 40) {
      itemDropName = 'Thánh Thương Quang Minh EP-08';
      itemDropRarity = 'Mythic';
      heroShards = { heroId: 'aurora', heroName: 'Aurora (Nữ Thần)', count: 40 };
      unlockedTitle = 'Chiến Binh Thiên Thể';
    } else if (lvl === 50) {
      itemDropName = 'Nhẫn Ma Thuật Hoàng Gia EP-18';
      itemDropRarity = 'Legendary';
      heroShards = { heroId: 'seraphina', heroName: 'Seraphina (Nữ Hoàng)', count: 50 };
      unlockedTitle = 'Chúa Tể Không Gian';
    } else if (lvl === 75) {
      itemDropName = 'Lõi Tinh Vân Sáng Thế EP-20';
      itemDropRarity = 'Celestial';
      heroShards = { heroId: 'seraphina', heroName: 'Seraphina (Nữ Hoàng)', count: 75 };
      unlockedTitle = 'Vua Hư Không';
    } else if (lvl === 100) {
      itemDropName = 'Lưỡi Hái Sáng Thế Tinh Vân CEL-01';
      itemDropRarity = 'Celestial';
      heroShards = { heroId: 'seraphina', heroName: 'Seraphina (Nữ Hoàng)', count: 200 };
      unlockedTitle = 'Đấng Sáng Thế Vũ Trụ';
    }

    const gold = Math.floor(5000 + lvl * 1800 + Math.pow(lvl, 1.85) * 80);
    const diamonds = isMajor ? 500 : isMid ? 200 : 60;
    const voidStones = isMajor ? 60 : isMid ? 25 : 10;
    const voidTokens = isMajor ? 250 : isMid ? 100 : 35;

    levels.push({
      level: lvl,
      expRequired,
      unlockedTitle,
      rewards: {
        gold,
        diamonds,
        voidStones,
        voidTokens,
        itemDropName,
        itemDropRarity,
        heroShards,
      },
      claimed: false,
      statBonus: {
        atkBonus: Math.floor(180 + lvl * 35),
        hpBonus: Math.floor(1200 + lvl * 240),
        defBonus: Math.floor(60 + lvl * 12),
        cpGain: Math.floor(6000 + lvl * 1600),
      },
    });
  }

  return levels;
};
