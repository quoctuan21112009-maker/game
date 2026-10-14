export interface HeroSkillConfig {
  id: string;
  name: string;
  element: 'fire' | 'frost' | 'volt' | 'void' | 'aether';
  cooldownMax: number;
  damageMultiplier: number;
  manaCost?: number;
  tag: string;
  icon: string;
  accentColor: string;
  desc: string;
}

export interface HeroCharacter {
  id: string;
  name: string;
  title: string;
  classArchetype: string;
  classVi: string;
  role: 'Tank' | 'DPS' | 'Burst' | 'Mage' | 'Assassin' | 'Celestial';
  element: 'aether' | 'void' | 'fire' | 'frost' | 'volt';
  elementLabel: string;
  elementColor: string;
  themeColor: string;
  accentColor: string;
  stars: number;
  passiveNameVi: string;
  passiveDescVi: string;
  descriptionVi: string;
  statsMultiplier: {
    atk: number;
    hp: number;
    def: number;
    critRate: number;
    leechRate: number;
  };
  signatureWeaponName: string;
  skills: HeroSkillConfig[];
  modelConfig: {
    headColor: number;
    visorColor: number;
    armorColor: number;
    weaponColor: number;
    auraColor: number;
    weaponType: 'greatsword' | 'crossbow' | 'axe' | 'staff' | 'daggers' | 'spear' | 'scythe';
  };
}

export const HEROES_DATABASE: HeroCharacter[] = [
  {
    id: 'aethel',
    name: 'Aethel',
    title: 'Sanctum Knight',
    classArchetype: 'Cyber-Paladin',
    classVi: 'Hiệp Sĩ Không Gian',
    role: 'Tank',
    element: 'void',
    elementLabel: 'HƯ KHÔNG & AETHER',
    elementColor: '#ddb7ff',
    themeColor: '#00424f',
    accentColor: '#4cd7f6',
    stars: 3,
    passiveNameVi: 'Lõi Khiên Thánh Quang',
    passiveDescVi: 'Giảm 20% sát thương nhận vào và phản lại 150% ATK thành sóng xung kích Hư Không.',
    descriptionVi: 'Chiến binh hộ vệ không gian với giáp thánh quang và trọng kiếm năng lượng Aether, công thủ toàn diện.',
    statsMultiplier: {
      atk: 1.1,
      hp: 1.35,
      def: 1.4,
      critRate: 1.0,
      leechRate: 1.1,
    },
    signatureWeaponName: 'Lưỡi Kiếm Hư Không EP-01',
    skills: [
      { id: 'a1', name: 'Oblivion Slash', element: 'void', cooldownMax: 4, damageMultiplier: 2.6, tag: 'PHÁ GIÁP', icon: 'content_cut', accentColor: '#ddb7ff', desc: 'Chém xuyên không gian gây 260% sát thương Hư Không.' },
      { id: 'a2', name: 'Nova Radial', element: 'aether', cooldownMax: 6, damageMultiplier: 3.2, tag: 'HÚT TÂM', icon: 'radio_button_checked', accentColor: '#4cd7f6', desc: 'Kích nổ sóng xung kích nén trọng lực diện rộng.' },
      { id: 'a3', name: 'Holy Aegis', element: 'volt', cooldownMax: 8, damageMultiplier: 2.8, tag: 'KHIÊN CHẮN', icon: 'shield', accentColor: '#ffb95f', desc: 'Tạo khiên hấp thụ sát thương và phản đòn ánh sáng.' },
      { id: 'a4', name: 'Singularity Rift', element: 'void', cooldownMax: 10, damageMultiplier: 4.8, tag: 'HỐ ĐEN x4', icon: 'cyclone', accentColor: '#a855f7', desc: 'Triệu hồi hố đen nghiền nát mọi kẻ địch.' },
    ],
    modelConfig: {
      headColor: 0x1a202c,
      visorColor: 0x4cd7f6,
      armorColor: 0x0f172a,
      weaponColor: 0x4cd7f6,
      auraColor: 0x06b6d4,
      weaponType: 'greatsword',
    },
  },
  {
    id: 'valeria',
    name: 'Valeria',
    title: 'Shadow Phantom',
    classArchetype: 'Void Ranger',
    classVi: 'Xạ Thủ Bóng Đêm',
    role: 'DPS',
    element: 'volt',
    elementLabel: 'LÔI ĐIỆN & BÓNG TỐI',
    elementColor: '#ffddb8',
    themeColor: '#064e3b',
    accentColor: '#10b981',
    stars: 4,
    passiveNameVi: 'Nhịp Bắn Liên Hoàn',
    passiveDescVi: 'Mỗi phát bắn thứ 3 chắc chắn Bạo Kích và bắn kèm 2 tia sét chuỗi.',
    descriptionVi: 'Xạ thủ tinh vân sở hữu song nỏ thần tốc, gây sát thương tầm xa liên hoàn và bạo kích cực cao.',
    statsMultiplier: {
      atk: 1.38,
      hp: 0.9,
      def: 0.85,
      critRate: 1.5,
      leechRate: 1.15,
    },
    signatureWeaponName: 'Song Nỏ Tinh Vân EP-02',
    skills: [
      { id: 'v1', name: 'Volt Rapid Fire', element: 'volt', cooldownMax: 3.5, damageMultiplier: 2.8, tag: 'LIÊN XẠ x12', icon: 'bolt', accentColor: '#10b981', desc: 'Bắn liên hoàn 12 mũi tên điện gây choáng mục tiêu.' },
      { id: 'v2', name: 'Shadow Snipe', element: 'void', cooldownMax: 6, damageMultiplier: 3.6, tag: 'XUYÊN THẤU', icon: 'my_location', accentColor: '#34d399', desc: 'Bắn phát đạn bóng đêm xuyên 100% phòng thủ.' },
      { id: 'v3', name: 'Critical Flare', element: 'fire', cooldownMax: 7, damageMultiplier: 3.0, tag: '+35% CRIT', icon: 'flare', accentColor: '#ffb95f', desc: 'Bắn pháo sáng kích nổ và tăng mạnh tỷ lệ bạo kích.' },
      { id: 'v4', name: 'Starfall Barrage', element: 'volt', cooldownMax: 9, damageMultiplier: 5.0, tag: 'MƯA TÊN', icon: 'auto_awesome', accentColor: '#6ee7b7', desc: 'Mưa tên thiên thạch hủy diệt toàn bộ đấu trường.' },
    ],
    modelConfig: {
      headColor: 0x111827,
      visorColor: 0x10b981,
      armorColor: 0x064e3b,
      weaponColor: 0x34d399,
      auraColor: 0x10b981,
      weaponType: 'crossbow',
    },
  },
  {
    id: 'ignis',
    name: 'Ignis',
    title: 'Flame Titan',
    classArchetype: 'Inferno Berserker',
    classVi: 'Cuồng Chiến Hỏa Diệm',
    role: 'Burst',
    element: 'fire',
    elementLabel: 'DUNG NHAM ĐỊA NGỤC',
    elementColor: '#ffb95f',
    themeColor: '#7f1d1d',
    accentColor: '#f43f5e',
    stars: 4,
    passiveNameVi: 'Huyết Nộ Dung Nham',
    passiveDescVi: 'Máu càng thấp sát thương càng cao (tối đa +80% ATK) và hút máu trên mọi đòn bổ rìu.',
    descriptionVi: 'Gã khổng lồ mang dòng máu dung nham nguyên thủy, vung rìu hủy diệt càn quét đấu trường với sức mạnh áp đảo.',
    statsMultiplier: {
      atk: 1.45,
      hp: 1.2,
      def: 1.0,
      critRate: 1.15,
      leechRate: 1.75,
    },
    signatureWeaponName: 'Rìu Hỏa Diệm Địa Ngục EP-03',
    skills: [
      { id: 'i1', name: 'Molten Cleave', element: 'fire', cooldownMax: 4, damageMultiplier: 3.1, tag: 'THIÊU ĐỐT', icon: 'local_fire_department', accentColor: '#f43f5e', desc: 'Vung rìu quét sạch mục tiêu kèm hiệu ứng đốt cháy.' },
      { id: 'i2', name: 'Berserk Fury', element: 'fire', cooldownMax: 6, damageMultiplier: 3.5, tag: 'HÚT MÁU', icon: 'whatshot', accentColor: '#fb923c', desc: 'Cuồng nộ bổ xuống tạo cột lửa và hút máu toàn phần.' },
      { id: 'i3', name: 'Lava Shockwave', element: 'volt', cooldownMax: 7.5, damageMultiplier: 4.0, tag: 'ĐỊA CHẤN', icon: 'volcano', accentColor: '#ffb95f', desc: 'Nện rìu xuống đất phun trào cột dung nham hủy diệt.' },
      { id: 'i4', name: 'Cataclysm Smash', element: 'fire', cooldownMax: 10, damageMultiplier: 5.5, tag: 'TUYỆT DIỆT', icon: 'crisis_alert', accentColor: '#ef4444', desc: 'Nhát bổ đại hồng thủy chẻ đôi không gian.' },
    ],
    modelConfig: {
      headColor: 0x450a0a,
      visorColor: 0xf59e0b,
      armorColor: 0x7f1d1d,
      weaponColor: 0xf43f5e,
      auraColor: 0xf97316,
      weaponType: 'axe',
    },
  },
  {
    id: 'lyra',
    name: 'Lyra',
    title: 'Astral Weaver',
    classArchetype: 'Chrono Mage',
    classVi: 'Pháp Sư Thời Gian',
    role: 'Mage',
    element: 'frost',
    elementLabel: 'BĂNG GIÁ & THỜI KHÔNG',
    elementColor: '#4cd7f6',
    themeColor: '#1e1b4b',
    accentColor: '#38bdf8',
    stars: 4,
    passiveNameVi: 'Ngưng Đọng Tuyệt Đối',
    passiveDescVi: 'Kỹ năng Băng làm chậm Boss và tăng 45% sát thương lên mục tiêu đang bị đóng băng.',
    descriptionVi: 'Pháp sư tinh thông ma pháp băng tuyết và thao túng dòng chảy thời gian, đóng băng kẻ địch diện rộng.',
    statsMultiplier: {
      atk: 1.35,
      hp: 0.95,
      def: 0.9,
      critRate: 1.25,
      leechRate: 1.0,
    },
    signatureWeaponName: 'Pháp Trượng Băng Ngàn Tinh Tú EP-04',
    skills: [
      { id: 'l1', name: 'Glacial Spike', element: 'frost', cooldownMax: 4, damageMultiplier: 2.9, tag: 'ĐÓNG BĂNG', icon: 'ac_unit', accentColor: '#38bdf8', desc: 'Triệu hồi gai băng khổng lồ đóng băng kẻ địch 2.5s.' },
      { id: 'l2', name: 'Temporal Stasis', element: 'void', cooldownMax: 6.5, damageMultiplier: 3.4, tag: 'NGƯNG ĐỌNG', icon: 'hourglass_bottom', accentColor: '#818cf8', desc: 'Bóp méo không thời gian gây sát thương chuẩn.' },
      { id: 'l3', name: 'Arcane Nova', element: 'aether', cooldownMax: 7, damageMultiplier: 3.8, tag: 'XUYÊN KHÁNG', icon: 'blur_on', accentColor: '#4cd7f6', desc: 'Tung chùm tia năng lượng tinh vân xuyên phòng thủ.' },
      { id: 'l4', name: 'Absolute Zero', element: 'frost', cooldownMax: 9.5, damageMultiplier: 5.2, tag: 'ĐỘ KHÔNG', icon: 'snowing', accentColor: '#7dd3fc', desc: 'Bão tuyết vĩnh cửu đóng băng toàn bộ sinh vật.' },
    ],
    modelConfig: {
      headColor: 0x1e1b4b,
      visorColor: 0x38bdf8,
      armorColor: 0x312e81,
      weaponColor: 0x67e8f9,
      auraColor: 0x38bdf8,
      weaponType: 'staff',
    },
  },
  {
    id: 'kaelen',
    name: 'Kaelen',
    title: 'Night Reaper',
    classArchetype: 'Void Assassin',
    classVi: 'Sát Thủ Hư Không',
    role: 'Assassin',
    element: 'void',
    elementLabel: 'ÁM SÁT HƯ KHÔNG',
    elementColor: '#a855f7',
    themeColor: '#2e1065',
    accentColor: '#c084fc',
    stars: 5,
    passiveNameVi: 'Đoạt Mệnh Trong Bóng Tối',
    passiveDescVi: 'Tăng +35% Tỷ Lệ Bạo Kích cố định. Đòn chí mạng gây thêm vết thương xuất huyết Hư Không.',
    descriptionVi: 'Bóng ma thầm lặng sử dụng song đoản kiếm kết liễu mục tiêu trong chớp mắt với sát thương bạo kích cực đại.',
    statsMultiplier: {
      atk: 1.55,
      hp: 0.85,
      def: 0.8,
      critRate: 1.7,
      leechRate: 1.3,
    },
    signatureWeaponName: 'Song Đoản Kiếm Hư Vô EP-07',
    skills: [
      { id: 'k1', name: 'Phantom Strike', element: 'void', cooldownMax: 3.5, damageMultiplier: 3.3, tag: 'CHÍ MẠNG x2', icon: 'flash_on', accentColor: '#c084fc', desc: 'Đột kích chớp nhoáng sau lưng mục tiêu gây bạo kích.' },
      { id: 'k2', name: 'Shadow Veil', element: 'void', cooldownMax: 5.5, damageMultiplier: 3.6, tag: 'TÀNG HÌNH', icon: 'visibility_off', accentColor: '#a855f7', desc: 'Hòa vào hư không, chém liên hoàn 6 nhát chí mạng.' },
      { id: 'k3', name: 'Abyssal Venom', element: 'fire', cooldownMax: 7, damageMultiplier: 4.1, tag: 'ĐỘC TỐ', icon: 'science', accentColor: '#e879f9', desc: 'Tẩm độc hư vô làm mục rữa giáp Boss 40%.' },
      { id: 'k4', name: 'Death Blossom', element: 'void', cooldownMax: 9, damageMultiplier: 5.8, tag: '36 LIÊN TRẢM', icon: 'cruelty_free', accentColor: '#d8b4fe', desc: 'Xoay tròn tung 36 nhát chém tử thần trong 1 giây.' },
    ],
    modelConfig: {
      headColor: 0x18181b,
      visorColor: 0xa855f7,
      armorColor: 0x2e1065,
      weaponColor: 0xd8b4fe,
      auraColor: 0xa855f7,
      weaponType: 'daggers',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    title: 'Solar Valkyrie',
    classArchetype: 'Dawn Paladin',
    classVi: 'Nữ Thần Ánh Sáng',
    role: 'Tank',
    element: 'aether',
    elementLabel: 'THÁI DƯƠNG THÁNH QUANG',
    elementColor: '#facc15',
    themeColor: '#713f12',
    accentColor: '#fbbf24',
    stars: 5,
    passiveNameVi: 'Phước Lành Thái Dương',
    passiveDescVi: 'Tăng 25% Toàn Bộ Chỉ Số và tự động thanh tẩy mọi hiệu ứng bất lợi.',
    descriptionVi: 'Chiến binh thánh quang sở hữu ngọn giáo mặt trời thiêng liêng, vừa càn quét kẻ địch vừa ban phước bất tử.',
    statsMultiplier: {
      atk: 1.3,
      hp: 1.4,
      def: 1.3,
      critRate: 1.2,
      leechRate: 1.4,
    },
    signatureWeaponName: 'Thánh Thương Quang Minh EP-08',
    skills: [
      { id: 'au1', name: 'Solar Thrust', element: 'aether', cooldownMax: 4, damageMultiplier: 3.0, tag: 'XUYÊN GIÁP', icon: 'military_tech', accentColor: '#facc15', desc: 'Đâm thẳng thánh thương xuyên thủng mọi lớp giáp.' },
      { id: 'au2', name: 'Divine Blessing', element: 'fire', cooldownMax: 6, damageMultiplier: 3.5, tag: 'THÁNH HỎA', icon: 'favorite', accentColor: '#fbbf24', desc: 'Phóng thích ngọn lửa thái dương thiêu rụi tà ma.' },
      { id: 'au3', name: 'Radiant Aegis', element: 'volt', cooldownMax: 7.5, damageMultiplier: 4.0, tag: 'CHÓI LÒA', icon: 'brightness_7', accentColor: '#fde047', desc: 'Tạo hào quang mặt trời làm mù và choáng Boss 3s.' },
      { id: 'au4', name: 'Dawn Judgment', element: 'aether', cooldownMax: 10, damageMultiplier: 5.6, tag: 'PHÁN QUYẾT', icon: 'light_mode', accentColor: '#fef08a', desc: 'Triệu hồi thánh kiếm từ thiên giới giáng đòn phán quyết.' },
    ],
    modelConfig: {
      headColor: 0x362b00,
      visorColor: 0xfacc15,
      armorColor: 0x854d0e,
      weaponColor: 0xfde047,
      auraColor: 0xfacc15,
      weaponType: 'spear',
    },
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    title: 'Celestial Empress',
    classArchetype: 'Astral Sovereign',
    classVi: 'Nữ Hoàng Tinh Vân',
    role: 'Celestial',
    element: 'aether',
    elementLabel: 'THẦN VŨ VŨ TRỤ (CELESTIAL)',
    elementColor: '#ff5f7e',
    themeColor: '#4a044e',
    accentColor: '#f472b6',
    stars: 6,
    passiveNameVi: 'Quyền Năng Sáng Thế',
    passiveDescVi: 'Tất cả đòn đánh kích hoạt cộng hưởng Ngũ Hành, gây thêm 50% sát thương chuẩn và +25% tốc độ thu hoạch AFK.',
    descriptionVi: 'Thực thể tối cao cai quản dải ngân hà, sử dụng Lưỡi Hái Tinh Vân gặt hái linh hồn các Boss Cổ Đại.',
    statsMultiplier: {
      atk: 1.75,
      hp: 1.5,
      def: 1.35,
      critRate: 1.8,
      leechRate: 1.6,
    },
    signatureWeaponName: 'Lưỡi Hái Sáng Thế Tinh Vân CEL-01',
    skills: [
      { id: 's1', name: 'Nebula Reap', element: 'aether', cooldownMax: 3.5, damageMultiplier: 3.8, tag: 'GẶT LINH HỒN', icon: 'flare', accentColor: '#f472b6', desc: 'Vung lưỡi hái tinh vân cắt đứt chiều không gian.' },
      { id: 's2', name: 'Supernova Collapse', element: 'fire', cooldownMax: 5.5, damageMultiplier: 4.5, tag: 'SIÊU TÂN TINH', icon: 'wb_sunny', accentColor: '#ff5f7e', desc: 'Kích nổ siêu tân tinh ngay trên đầu mục tiêu.' },
      { id: 's3', name: 'Quantum Vortex', element: 'void', cooldownMax: 7, damageMultiplier: 5.0, tag: 'LƯỢNG TỬ', icon: 'all_inclusive', accentColor: '#c084fc', desc: 'Xoáy thuận lượng tử rút cạn sinh lực và phá vỡ khiên.' },
      { id: 's4', name: 'Genesis Finale', element: 'aether', cooldownMax: 9, damageMultiplier: 6.8, tag: 'SÁNG THẾ x6', icon: 'auto_awesome', accentColor: '#38bdf8', desc: 'Tái tạo vũ trụ, giáng đòn hủy diệt tối thượng lên toàn cõi.' },
    ],
    modelConfig: {
      headColor: 0x3b0764,
      visorColor: 0xf472b6,
      armorColor: 0x581c87,
      weaponColor: 0xff5f7e,
      auraColor: 0xf472b6,
      weaponType: 'scythe',
    },
  },
];
