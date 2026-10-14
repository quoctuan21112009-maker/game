export interface BossData {
  id: string;
  name: string;
  subTitle: string;
  phase: string;
  level: number;
  currentHp: number;
  maxHp: number;
  hpPips: number;
  breakGauge: number;
  weaknesses: ('frost' | 'volt' | 'fire' | 'void')[];
  element: 'void' | 'fire' | 'frost' | 'volt';
  elementBadgeColor: string;
  themeColor: string;
  descriptionVi: string;
  exclusiveDrops: {
    name: string;
    rarity: 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Celestial';
    icon: string;
  }[];
  model3DConfig: {
    coreColor: number;
    wingColor: number;
    hornColor: number;
    eyeColor: number;
    ambientColor: number;
    geometryType: 'chimera' | 'colossus' | 'archon' | 'hydra' | 'wyrm' | 'goliath';
  };
}

export const BOSSES_DATABASE: BossData[] = [
  {
    id: 'chrono_chimera',
    name: 'Chrono Chimera',
    subTitle: 'Void Devourer • Quái Thú Hư Không',
    phase: 'Phase 2/3',
    level: 1,
    currentHp: 35000,
    maxHp: 35000,
    hpPips: 3,
    breakGauge: 82,
    weaknesses: ['frost', 'volt'],
    element: 'void',
    elementBadgeColor: '#ddb7ff',
    themeColor: '#6f00be',
    descriptionVi: 'Quái thú không gian có đôi cánh tinh thể năng lượng nuốt chửng dòng chảy thời gian.',
    exclusiveDrops: [
      { name: 'Lưỡi Kiếm Hư Không EP-01', rarity: 'Epic', icon: 'swords' },
      { name: 'Cổ Vật Hư Không EP-19', rarity: 'Mythic', icon: 'auto_awesome' },
      { name: 'Đá Cường Hóa Void x150', rarity: 'Legendary', icon: 'token' },
    ],
    model3DConfig: {
      coreColor: 0x090714,
      wingColor: 0x7c22d6,
      hornColor: 0x4cd7f6,
      eyeColor: 0xff3b69,
      ambientColor: 0x231d45,
      geometryType: 'chimera',
    },
  },
  {
    id: 'ignis_colossus',
    name: 'Ignis Colossus',
    subTitle: 'Molten Juggernaut • Chúa Tể Hỏa Diệm',
    phase: 'Phase 1/3',
    level: 1,
    currentHp: 42000,
    maxHp: 42000,
    hpPips: 4,
    breakGauge: 45,
    weaknesses: ['frost', 'void'],
    element: 'fire',
    elementBadgeColor: '#ffb95f',
    themeColor: '#7f1d1d',
    descriptionVi: 'Gã khổng lồ dung nham bước ra từ lòng núi lửa cổ đại với lớp giáp nóng chảy bất khả xâm phạm.',
    exclusiveDrops: [
      { name: 'Rìu Hỏa Diệm Địa Ngục EP-03', rarity: 'Legendary', icon: 'local_fire_department' },
      { name: 'Ngọc Dung Nham Tối Thượng', rarity: 'Epic', icon: 'whatshot' },
      { name: 'Mũ Chiến Binh Lửa EP-09', rarity: 'Rare', icon: 'security' },
    ],
    model3DConfig: {
      coreColor: 0x260303,
      wingColor: 0xf43f5e,
      hornColor: 0xffb95f,
      eyeColor: 0xfacc15,
      ambientColor: 0x450a0a,
      geometryType: 'colossus',
    },
  },
  {
    id: 'frostborne_hydra',
    name: 'Frostborne Hydra',
    subTitle: 'Glacial Serpent • Mãng Xà Băng Giá',
    phase: 'Phase 2/3',
    level: 1,
    currentHp: 38000,
    maxHp: 38000,
    hpPips: 3,
    breakGauge: 70,
    weaknesses: ['fire', 'volt'],
    element: 'frost',
    elementBadgeColor: '#acedff',
    themeColor: '#1e3a8a',
    descriptionVi: 'Mãng xà băng giá 9 đầu sinh sống tại vực thẳm vĩnh cửu, đóng băng mọi kẻ xâm nhập.',
    exclusiveDrops: [
      { name: 'Pháp Trượng Băng Ngàn Tinh Tú EP-04', rarity: 'Epic', icon: 'ac_unit' },
      { name: 'Vòng Cổ Băng Sao EP-16', rarity: 'Rare', icon: 'diamond' },
      { name: 'Ngọc Hàn Băng Vĩnh Cửu', rarity: 'Rare', icon: 'snowing' },
    ],
    model3DConfig: {
      coreColor: 0x0c213d,
      wingColor: 0x38bdf8,
      hornColor: 0xffffff,
      eyeColor: 0x00f0ff,
      ambientColor: 0x172554,
      geometryType: 'hydra',
    },
  },
  {
    id: 'abyssal_archon',
    name: 'Abyssal Archon',
    subTitle: 'Celestial Destroyer • Thần Hủy Diệt',
    phase: 'Phase 3/3',
    level: 1,
    currentHp: 50000,
    maxHp: 50000,
    hpPips: 5,
    breakGauge: 60,
    weaknesses: ['fire', 'volt'],
    element: 'void',
    elementBadgeColor: '#4cd7f6',
    themeColor: '#00424f',
    descriptionVi: 'Kẻ hủy diệt thiên thể mang sức mạnh bẻ cong không thời gian và điều khiển hố đen nguyên thủy.',
    exclusiveDrops: [
      { name: 'Lưỡi Hái Sáng Thế Tinh Vân CEL-01', rarity: 'Celestial', icon: 'swords' },
      { name: 'Lõi Tinh Vân Sáng Thế EP-20', rarity: 'Celestial', icon: 'emergency' },
      { name: 'Nhẫn Ma Thuật Hoàng Gia EP-18', rarity: 'Legendary', icon: 'wb_sunny' },
    ],
    model3DConfig: {
      coreColor: 0x031826,
      wingColor: 0x06b6d4,
      hornColor: 0xacedff,
      eyeColor: 0x38bdf8,
      ambientColor: 0x082f49,
      geometryType: 'archon',
    },
  },
  {
    id: 'tempest_wyrm',
    name: 'Tempest Wyrm',
    subTitle: 'Storm Sovereign • Long Vương Sấm Sét',
    phase: 'Phase 2/3',
    level: 1,
    currentHp: 44000,
    maxHp: 44000,
    hpPips: 4,
    breakGauge: 65,
    weaknesses: ['void', 'fire'],
    element: 'volt',
    elementBadgeColor: '#facc15',
    themeColor: '#713f12',
    descriptionVi: 'Rồng sấm sét tinh vân giáng những tia sét kinh hoàng từ tầng khí quyển ion hủy diệt mục tiêu.',
    exclusiveDrops: [
      { name: 'Song Nỏ Tinh Vân EP-02', rarity: 'Epic', icon: 'bolt' },
      { name: 'Giày Xung Kích Không Gian EP-13', rarity: 'Epic', icon: 'snowshoeing' },
      { name: 'Ngọc Lôi Thạch Thượng Hạng', rarity: 'Legendary', icon: 'flash_on' },
    ],
    model3DConfig: {
      coreColor: 0x1f1900,
      wingColor: 0xeab308,
      hornColor: 0xfef08a,
      eyeColor: 0x67e8f9,
      ambientColor: 0x422006,
      geometryType: 'wyrm',
    },
  },
  {
    id: 'void_goliath',
    name: 'Void Goliath',
    subTitle: 'Titan of Entropy • Titan Hỗn Mang',
    phase: 'Phase 3/3',
    level: 1,
    currentHp: 58000,
    maxHp: 58000,
    hpPips: 5,
    breakGauge: 75,
    weaknesses: ['frost', 'volt'],
    element: 'void',
    elementBadgeColor: '#c084fc',
    themeColor: '#3b0764',
    descriptionVi: 'Thực thể hỗn mang khổng lồ trỗi dậy từ lõi hố đen vũ trụ.',
    exclusiveDrops: [
      { name: 'Song Đoản Kiếm Hư Vô EP-07', rarity: 'Legendary', icon: 'flash_on' },
      { name: 'Giáp Thánh Quang Hộ Thân EP-05', rarity: 'Legendary', icon: 'security' },
      { name: 'Vương Miện Vũ Trụ Vĩnh Hằng CEL-02', rarity: 'Celestial', icon: 'workspace_premium' },
    ],
    model3DConfig: {
      coreColor: 0x150424,
      wingColor: 0xa855f7,
      hornColor: 0xe9d5ff,
      eyeColor: 0xff0055,
      ambientColor: 0x2e1065,
      geometryType: 'goliath',
    },
  },
];
