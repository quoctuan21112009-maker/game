import React, { useState } from 'react';
import { HeroModel3D } from './HeroModel3D';
import { useGame } from '../../context/GameContext';
import { GearSlot, ItemRarity } from '../../types/game';
import { HERO_AVATARS } from '../../data/heroAvatars';
import { soundManager } from '../../utils/soundManager';

export const InventoryScreen: React.FC = () => {
  const {
    player,
    currentExp,
    maxExp,
    levelRewards,
    claimLevelReward,
    claimAllAvailableRewards,
    activeHero,
    availableHeroes,
    switchHero,
    promoteHeroStar,
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
  } = useGame();

  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'enhance' | 'breakthrough' | 'socket'>('enhance');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'weapon' | 'armor' | 'accessory' | 'relic'>('all');
  const [gemModalOpen, setGemModalOpen] = useState(false);
  const [selectedGemSlot, setSelectedGemSlot] = useState<number>(0);
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);

  const leftSlots: GearSlot[] = ['weapon', 'helmet', 'chest', 'gloves'];
  const rightSlots: GearSlot[] = ['necklace', 'ring', 'boots', 'relic'];

  const filteredInventory = inventory.filter((item) => {
    if (inventoryFilter === 'all') return true;
    if (inventoryFilter === 'weapon') return item.slot === 'weapon';
    if (inventoryFilter === 'armor') return ['helmet', 'chest', 'gloves', 'boots'].includes(item.slot);
    if (inventoryFilter === 'accessory') return ['necklace', 'ring'].includes(item.slot);
    if (inventoryFilter === 'relic') return item.slot === 'relic';
    return true;
  });

  const isSelectedEquipped = equippedGear[selectedItem.slot]?.id === selectedItem.id;
  const currentSlotEquipped = equippedGear[selectedItem.slot];
  const atkDelta = selectedItem.enhancedAtk - (currentSlotEquipped?.enhancedAtk || 0);

  // Calculate active set pieces
  const equippedList = Object.values(equippedGear);
  const voidSetCount = equippedList.filter((i) => i.setName === 'Bộ Hư Không Vĩnh Cửu').length;
  const celestialSetCount = equippedList.filter((i) => i.setName === 'Bộ Sáng Thế Vĩnh Hằng').length;
  const solarSetCount = equippedList.filter((i) => i.setName === 'Bộ Thái Dương Thần Quang').length;
  const stormSetCount = equippedList.filter((i) => i.setName === 'Bộ Tinh Vân Sấm Sét').length;

  const rarityBadgeStyle = (rarity: ItemRarity) => {
    switch (rarity) {
      case 'Celestial':
        return 'bg-gradient-to-r from-[#ff5f7e] via-[#f59e0b] to-[#4cd7f6] text-[#001f26] shadow-[0_0_10px_rgba(255,95,126,0.5)]';
      case 'Mythic':
        return 'bg-[#f43f5e] text-white shadow-[0_0_8px_rgba(244,63,94,0.4)]';
      case 'Legendary':
        return 'bg-[#f59e0b] text-[#472a00]';
      case 'Epic':
        return 'bg-[#6f00be] text-[#d6a9ff]';
      default:
        return 'bg-[#00424f] text-[#4cd7f6]';
    }
  };

  const unclaimedCount = levelRewards.filter((r) => r.level <= player.level && !r.claimed).length;

  const availableGems = [
    { name: 'Ngọc Sáng Thế Thái Cổ', color: '#ff5f7e', bonus: '+15% Sát Thương Chuẩn & +10% Bạo' },
    { name: 'Ngọc Hư Không Hắc Ám', color: '#a855f7', bonus: '+6% Bạo Kích & +800 ATK' },
    { name: 'Ngọc Lôi Thạch Thượng Hạng', color: '#ffb95f', bonus: '+12% Sát Thương Lôi & Tốc Đánh' },
    { name: 'Ngọc Băng Lam Tinh Khiết', color: '#38bdf8', bonus: '+10% Đóng Băng & +15,000 HP' },
    { name: 'Ngọc Dung Nham Cuồng Nộ', color: '#f43f5e', bonus: '+8% Hút Máu Toàn Phần' },
  ];

  return (
    <div className="flex flex-col w-full px-2 sm:px-4 py-3 gap-3 pb-24 select-none">
      {/* Top Banner: Hero Profile, Awakening & Switcher */}
      <div className="flex flex-col gap-2.5 p-3 sm:p-4 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/40 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setHeroModalOpen(true)}
              style={{ backgroundColor: `${activeHero.accentColor}22`, borderColor: activeHero.accentColor }}
              className="w-12 h-12 rounded-xl flex items-center justify-center border shadow active:scale-95 transition-all relative shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[26px]" style={{ color: activeHero.accentColor }}>
                shield_person
              </span>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[8px] font-bold">
                ĐỔI TƯỚNG
              </span>
            </button>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-headline text-[16px] font-bold text-[#e4e1f0]">{activeHero.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#facc15]/20 text-[#facc15] font-hud text-[9px] font-bold">
                  {activeHero.stars}★
                </span>
                <span
                  style={{ color: activeHero.accentColor, backgroundColor: `${activeHero.accentColor}22` }}
                  className="px-1.5 py-0.2 rounded font-hud text-[9px] font-bold uppercase"
                >
                  {activeHero.classVi}
                </span>
              </div>
              <span className="font-hud text-[10px] text-[#bcc9cd] mt-0.5">
                {activeHero.role} • {activeHero.elementLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end leading-tight shrink-0">
            <span className="font-hud text-[9px] text-[#bcc9cd] uppercase tracking-wider font-semibold">
              LỰC CHIẾN (CP)
            </span>
            <span className="font-headline text-[20px] sm:text-[23px] font-bold text-[#4cd7f6] tracking-tight">
              {player.stats.cp > 1000000 ? `${(player.stats.cp / 1000000).toFixed(2)}M` : player.stats.cp.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Passive Skill & Star Awakening Action Row */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#12121d] border border-[#3d494c]/30">
          <div className="flex items-start gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#ffb95f] text-[18px] shrink-0 mt-0.5">auto_awesome</span>
            <div className="flex flex-col min-w-0">
              <span className="font-hud text-[10px] text-[#ffb95f] font-bold">
                Nội Tại: {activeHero.passiveNameVi}
              </span>
              <span className="font-hud text-[9px] text-[#bcc9cd] line-clamp-1">
                {activeHero.passiveDescVi}
              </span>
            </div>
          </div>
          <button
            onClick={() => promoteHeroStar(activeHero.id)}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ff5f7e] text-[#001f26] font-hud text-[10px] font-bold shrink-0 active:scale-95 transition-all shadow cursor-pointer"
          >
            THỨC TỈNH {activeHero.stars + 1}★
          </button>
        </div>
      </div>

      {/* Level 1 -> 100 Reward Center Trigger Banner */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-[#2a1700] via-[#1b1b25] to-[#00424f] border border-[#ffb95f]/40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ffb95f]/20 flex items-center justify-center text-[#ffb95f] shrink-0">
            <span className="material-symbols-outlined text-[22px]">military_tech</span>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 font-hud">
              <span className="text-[#e4e1f0] font-bold text-[12px]">Cấp Độ: Lv.{player.level}/100</span>
              <span className="text-[#ffb95f] font-bold text-[10px]">
                ({Math.round((currentExp / maxExp) * 100)}% EXP)
              </span>
            </div>
            <div className="w-32 sm:w-48 h-1.5 rounded-full bg-[#34343f] mt-1 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (currentExp / maxExp) * 100)}%` }}
                className="h-full bg-[#ffb95f] rounded-full"
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => setRewardsModalOpen(true)}
          className="relative flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ffb95f] text-[#472a00] font-hud text-[11px] font-bold active:scale-95 transition-all shadow-[0_0_12px_rgba(255,185,95,0.5)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">card_giftcard</span>
          <span>Thưởng Lv.1-100</span>
          {unclaimedCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-[#f43f5e] text-[#fff] text-[9px] font-bold animate-bounce">
              {unclaimedCount}
            </span>
          )}
        </button>
      </div>

      {/* Responsive Grid for Tablet & Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Section: 3D Showroom + 8 Equipment Slots (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2 items-center">
            {/* Left 4 Gear Slots */}
            <div className="flex flex-col gap-2">
              {leftSlots.map((slot) => {
                const item = equippedGear[slot];
                const isSelected = selectedItem.id === item.id;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedItem(item)}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-xl bg-[#1b1b25] transition-all shadow border cursor-pointer ${
                      isSelected
                        ? 'border-[#4cd7f6] ring-2 ring-[#4cd7f6]'
                        : item.rarity === 'Celestial'
                        ? 'border-[#ff5f7e]/70'
                        : 'border-[#3d494c]/40 hover:border-[#ddb7ff]/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#292934] flex items-center justify-center relative">
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{
                          color:
                            item.rarity === 'Celestial'
                              ? '#ff5f7e'
                              : item.rarity === 'Mythic'
                              ? '#f43f5e'
                              : item.rarity === 'Legendary'
                              ? '#ffb95f'
                              : '#ddb7ff',
                        }}
                      >
                        {item.iconSymbol}
                      </span>
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[8px] font-bold">
                        +{item.enhanceLevel}
                      </span>
                    </div>
                    <span className="font-hud text-[9px] text-[#e4e1f0] font-bold mt-1 truncate w-full text-center">
                      {item.slotLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Center 3D Character Viewport */}
            <div className="col-span-2">
              <HeroModel3D rotationAngle={rotationAngle} onRotationChange={setRotationAngle} />
            </div>

            {/* Right 4 Gear Slots */}
            <div className="flex flex-col gap-2">
              {rightSlots.map((slot) => {
                const item = equippedGear[slot];
                const isSelected = selectedItem.id === item.id;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedItem(item)}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-xl bg-[#1b1b25] transition-all shadow border cursor-pointer ${
                      isSelected
                        ? 'border-[#4cd7f6] ring-2 ring-[#4cd7f6]'
                        : item.rarity === 'Celestial'
                        ? 'border-[#ff5f7e]/70'
                        : 'border-[#3d494c]/40 hover:border-[#ddb7ff]/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#292934] flex items-center justify-center relative">
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{
                          color:
                            item.rarity === 'Celestial'
                              ? '#ff5f7e'
                              : item.rarity === 'Mythic'
                              ? '#f43f5e'
                              : item.rarity === 'Legendary'
                              ? '#ffb95f'
                              : '#ddb7ff',
                        }}
                      >
                        {item.iconSymbol}
                      </span>
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[8px] font-bold">
                        +{item.enhanceLevel}
                      </span>
                    </div>
                    <span className="font-hud text-[9px] text-[#e4e1f0] font-bold mt-1 truncate w-full text-center">
                      {item.slotLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipment Set Resonance Banner */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1b1b25] border border-[#4cd7f6]/30 font-hud text-[10px] flex-wrap gap-1">
            <div className="flex items-center gap-1.5 text-[#4cd7f6] font-bold">
              <span className="material-symbols-outlined text-[15px]">hub</span>
              <span>CỘNG HƯỞNG BỘ TRANG BỊ:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={voidSetCount >= 4 ? 'text-[#ddb7ff] font-bold' : 'text-[#bcc9cd]'}>
                Hư Không ({voidSetCount}/8)
              </span>
              <span className={celestialSetCount >= 2 ? 'text-[#ff5f7e] font-bold' : 'text-[#bcc9cd]'}>
                Sáng Thế ({celestialSetCount}/4)
              </span>
              <span className={solarSetCount >= 2 ? 'text-[#ffb95f] font-bold' : 'text-[#bcc9cd]'}>
                Thái Dương ({solarSetCount}/4)
              </span>
              <span className={stormSetCount >= 2 ? 'text-[#38bdf8] font-bold' : 'text-[#bcc9cd]'}>
                Tinh Vân ({stormSetCount}/4)
              </span>
            </div>
          </div>

          {/* 6 Key Player Stats Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-2 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-md">
            <div className="flex flex-col items-center text-center p-1">
              <span className="font-hud text-[9px] text-[#bcc9cd] font-bold">ATK</span>
              <span className="font-hud text-[12px] font-bold text-[#4cd7f6]">{player.stats.atk.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center text-center p-1">
              <span className="font-hud text-[9px] text-[#bcc9cd] font-bold">HP</span>
              <span className="font-hud text-[12px] font-bold text-[#ffb4ab]">{(player.stats.hp / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex flex-col items-center text-center p-1">
              <span className="font-hud text-[9px] text-[#bcc9cd] font-bold">DEF</span>
              <span className="font-hud text-[12px] font-bold text-[#ddb7ff]">{player.stats.def.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center text-center p-1">
              <span className="font-hud text-[9px] text-[#bcc9cd] font-bold">CRIT %</span>
              <span className="font-hud text-[12px] font-bold text-[#ffb95f]">{player.stats.critRate}%</span>
            </div>
            <div className="flex flex-col items-center text-center p-1">
              <span className="font-hud text-[9px] text-[#bcc9cd] font-bold">HÚT MÁU</span>
              <span className="font-hud text-[12px] font-bold text-[#f43f5e]">{player.stats.leechRate}%</span>
            </div>
            <div className="flex flex-col items-center text-center p-1">
              <span className="font-hud text-[9px] text-[#bcc9cd] font-bold">TỐC AFK</span>
              <span className="font-hud text-[12px] font-bold text-[#22c55e]">+{player.stats.afkSpeed}%</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={quickEquipBis}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#00424f] text-[#4cd7f6] font-hud text-[11px] font-bold border border-[#4cd7f6]/40 active:scale-95 transition-all shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Mặc Nhanh BIS</span>
            </button>
            <button
              onClick={() => upgradeEquipment(selectedItem.id)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#292934] text-[#ddb7ff] font-hud text-[11px] font-bold border border-[#ddb7ff]/30 active:scale-95 transition-all shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Cường Hóa +1</span>
            </button>
            <button
              onClick={salvageJunk}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#292934] text-[#ffb95f] font-hud text-[11px] font-bold border border-[#ffb95f]/30 active:scale-95 transition-all shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">recycling</span>
              <span>Phân Rã Rác</span>
            </button>
          </div>
        </div>

        {/* Right Section: Selected Item Inspector + Stash Catalog (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {/* Detailed Selected Weapon/Gear Inspector */}
          <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/40 shadow-xl">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  style={{ backgroundColor: selectedItem.iconBgColor }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center relative border border-[#ddb7ff]/50 shrink-0 shadow-lg"
                >
                  <span className="material-symbols-outlined text-white text-[28px]">{selectedItem.iconSymbol}</span>
                  <span className="absolute -top-1 -left-1 px-1 py-0.2 rounded bg-[#0d0d17] text-[#4cd7f6] font-hud text-[8px] font-bold">
                    {selectedItem.id}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-headline text-[15px] font-bold text-[#e4e1f0] truncate">
                      {selectedItem.nameVi}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded font-hud text-[9px] font-bold uppercase ${rarityBadgeStyle(selectedItem.rarity)}`}>
                      {selectedItem.rarity}
                    </span>
                  </div>
                  <span className="font-hud text-[10px] text-[#4cd7f6] mt-0.5">
                    {selectedItem.slotLabel} • {selectedItem.setName || 'Bộ Trang Bị Tinh Vân'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-headline text-[20px] font-bold text-[#ddb7ff]">+{selectedItem.enhanceLevel}</span>
                <span className="font-hud text-[9px] text-[#bcc9cd]">Tối đa +{selectedItem.maxEnhance}</span>
              </div>
            </div>

            {/* Equip / Compare Banner if viewing an unequipped item */}
            {!isSelectedEquipped && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#003640]/60 border border-[#4cd7f6]/50">
                <div className="flex flex-col font-hud text-[10px]">
                  <span className="text-[#e4e1f0] font-bold">So với trang bị đang mặc ({currentSlotEquipped?.nameVi}):</span>
                  <span className={atkDelta >= 0 ? 'text-[#22c55e] font-bold' : 'text-[#ffb4ab] font-bold'}>
                    {atkDelta >= 0 ? `Tăng +${atkDelta} ATK khi trang bị` : `Giảm ${Math.abs(atkDelta)} ATK`}
                  </span>
                </div>
                <button
                  onClick={() => equipItem(selectedItem)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4cd7f6] text-[#003640] font-hud text-[11px] font-bold active:scale-95 transition-all shadow cursor-pointer"
                >
                  TRANG BỊ NGAY
                </button>
              </div>
            )}

            {/* Base ATK & Enhancement breakdown */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#292934] border border-[#3d494c]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">swords</span>
                <span className="font-hud text-[12px] font-bold text-[#e4e1f0]">Tấn Công Cơ Bản (ATK)</span>
              </div>
              <div className="flex items-center gap-1.5 font-hud">
                <span className="text-[#bcc9cd] line-through text-[12px]">+{selectedItem.baseAtk}</span>
                <span className="text-[#4cd7f6] font-bold text-[15px]">+{selectedItem.enhancedAtk}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#00424f] text-[#4cd7f6] text-[9px] font-bold">
                  (+{selectedItem.enhancedAtk - selectedItem.baseAtk} Cường Hóa)
                </span>
              </div>
            </div>

            {/* Substats */}
            <div className="grid grid-cols-2 gap-2">
              {selectedItem.substats.map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#292934]/60 font-hud text-[11px]">
                  <span className="text-[#bcc9cd]">{sub.label}</span>
                  <span className={sub.isCrit ? 'text-[#ffb95f] font-bold' : 'text-[#4cd7f6] font-bold'}>
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Special Effect */}
            <div className="p-2.5 rounded-xl bg-[#6f00be]/15 border border-[#ddb7ff]/20 flex items-start gap-2">
              <span className="material-symbols-outlined text-[#ddb7ff] text-[18px] shrink-0 mt-0.5">auto_awesome</span>
              <div className="flex flex-col">
                <span className="font-hud text-[10px] text-[#ddb7ff] font-bold uppercase tracking-wider">
                  ĐẶC TÍNH THẦN KHÍ
                </span>
                <span className="font-body-sm text-[11px] text-[#e4e1f0] leading-snug mt-0.5">
                  {selectedItem.specialEffectVi}
                </span>
              </div>
            </div>

            {/* Gem Sockets Section */}
            <div className="flex flex-col gap-1.5">
              <span className="font-hud text-[10px] text-[#bcc9cd] uppercase tracking-wider font-bold">
                KHẢM NGỌC NGUYÊN TỐ ({selectedItem.gemSlots.length} LỖ KHẢM)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedItem.gemSlots.map((gem, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedGemSlot(idx);
                      setGemModalOpen(true);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl bg-[#292934] border border-[#3d494c]/40 text-left active:scale-95 transition-all hover:border-[#4cd7f6] cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: gem.gemColor ? `${gem.gemColor}33` : '#34343f' }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ color: gem.gemColor || '#bcc9cd' }}>
                        {gem.gemName ? 'diamond' : 'add_circle'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-hud text-[10px] font-bold text-[#e4e1f0] truncate">
                        {gem.gemName || `Lỗ Khảm #${idx + 1}`}
                      </span>
                      <span className="font-hud text-[9px] text-[#bcc9cd] truncate">{gem.bonus}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upgrade / Breakthrough / Socket Tab Strip */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#292934]">
              <button
                onClick={() => setActiveTab('enhance')}
                className={`py-1.5 rounded-lg font-hud text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === 'enhance' ? 'bg-[#6f00be] text-[#e4e1f0]' : 'text-[#bcc9cd]'
                }`}
              >
                Cường Hóa
              </button>
              <button
                onClick={() => setActiveTab('breakthrough')}
                className={`py-1.5 rounded-lg font-hud text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === 'breakthrough' ? 'bg-[#6f00be] text-[#e4e1f0]' : 'text-[#bcc9cd]'
                }`}
              >
                Đột Phá
              </button>
              <button
                onClick={() => {
                  setActiveTab('socket');
                  setGemModalOpen(true);
                }}
                className={`py-1.5 rounded-lg font-hud text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === 'socket' ? 'bg-[#6f00be] text-[#e4e1f0]' : 'text-[#bcc9cd]'
                }`}
              >
                Khảm Ngọc
              </button>
            </div>

            {/* Forge Action Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#292934] border border-[#3d494c]/30 flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">token</span>
                  <div className="flex flex-col">
                    <span className="font-hud text-[9px] text-[#bcc9cd]">Đá Void</span>
                    <span className="font-hud text-[11px] font-bold text-[#e4e1f0]">
                      {10 + selectedItem.enhanceLevel * 2} / {player.voidStones}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">monetization_on</span>
                  <div className="flex flex-col">
                    <span className="font-hud text-[9px] text-[#bcc9cd]">Vàng Aether</span>
                    <span className="font-hud text-[11px] font-bold text-[#e4e1f0]">
                      {(5000 + selectedItem.enhanceLevel * 3000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={
                  activeTab === 'breakthrough'
                    ? () => breakthroughEquipment(selectedItem.id)
                    : () => upgradeEquipment(selectedItem.id)
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6f00be] to-[#4cd7f6] text-[#e4e1f0] font-hud text-[12px] font-bold active:scale-95 transition-all shadow-[0_0_16px_rgba(76,215,246,0.5)] border border-[#4cd7f6]/40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">hardware</span>
                <span>{activeTab === 'breakthrough' ? 'ĐỘT PHÁ +5' : `NÂNG +${selectedItem.enhanceLevel + 1}`}</span>
              </button>
            </div>
          </div>

          {/* Kho Đồ Master Catalog */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">backpack</span>
                <span className="font-headline text-[15px] font-bold text-[#e4e1f0]">Kho Thần Khí & Cổ Vật</span>
                <span className="font-hud text-[10px] text-[#bcc9cd]">{filteredInventory.length}/60</span>
              </div>
              <span className="font-hud text-[9px] text-[#ffb95f]">Chạm để xem hoặc Trang bị</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(
                [
                  { id: 'all', label: `Tất Cả (${inventory.length})` },
                  { id: 'weapon', label: 'Vũ Khí' },
                  { id: 'armor', label: 'Giáp Trụ' },
                  { id: 'accessory', label: 'Trang Sức' },
                  { id: 'relic', label: 'Cổ Vật' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setInventoryFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg font-hud text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    inventoryFilter === tab.id ? 'bg-[#4cd7f6] text-[#003640]' : 'bg-[#292934] text-[#bcc9cd]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 4-Column Grid of Items */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredInventory.map((item) => {
                const isEquipped = Object.values(equippedGear).some((eq) => eq.id === item.id);
                const isSelected = selectedItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`relative flex flex-col items-center justify-between p-2 rounded-xl bg-[#292934] aspect-square transition-all shadow border active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-[#4cd7f6] ring-2 ring-[#4cd7f6]'
                        : item.rarity === 'Celestial'
                        ? 'border-[#ff5f7e] shadow-[0_0_10px_rgba(255,95,126,0.3)]'
                        : isEquipped
                        ? 'border-[#ddb7ff]/70'
                        : 'border-[#3d494c]/30 hover:border-[#3d494c]'
                    }`}
                  >
                    <span className="absolute top-1 left-1.5 font-hud text-[7px] font-bold text-[#bcc9cd]">
                      {item.rarity === 'Celestial' ? '★THẦN' : item.id}
                    </span>
                    <span
                      style={{ backgroundColor: item.iconBgColor }}
                      className="absolute top-1 right-1 px-1 py-0.2 rounded text-[#e4e1f0] font-hud text-[7px] font-bold uppercase"
                    >
                      +{item.enhanceLevel}
                    </span>

                    <div className="my-auto flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{
                          color:
                            item.rarity === 'Celestial'
                              ? '#ff5f7e'
                              : item.rarity === 'Mythic'
                              ? '#f43f5e'
                              : item.rarity === 'Legendary'
                              ? '#ffb95f'
                              : '#ddb7ff',
                        }}
                      >
                        {item.iconSymbol}
                      </span>
                    </div>

                    <span className="font-hud text-[8px] text-[#e4e1f0] truncate w-full text-center font-bold">
                      {isEquipped ? 'ĐANG MẶC' : item.slotLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Switcher Modal */}
      {heroModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setHeroModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg h-[82vh] max-h-[82vh] rounded-2xl bg-[#171723] border border-[#3d494c]/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#3d494c]/30 shrink-0 bg-[#1b1b28]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">groups</span>
                <span className="font-headline text-[16px] font-bold text-[#e4e1f0]">
                  Đại Điện Anh Hùng ({availableHeroes.length} Tướng)
                </span>
              </div>
              <button
                onClick={() => setHeroModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] flex items-center justify-center hover:text-white cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Hero List */}
            <div className="flex flex-col gap-2.5 p-3 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {availableHeroes.map((hero) => {
                const isActive = activeHero.id === hero.id;
                return (
                  <div
                    key={hero.id}
                    className={`flex items-center justify-between p-3 rounded-xl bg-[#292934] border transition-all ${
                      isActive ? 'border-[#4cd7f6] ring-1 ring-[#4cd7f6]' : 'border-[#3d494c]/30 hover:border-[#ddb7ff]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        style={{ backgroundColor: `${hero.accentColor}25`, borderColor: hero.accentColor }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 overflow-hidden p-0.5 shadow"
                      >
                        <img
                          src={HERO_AVATARS[hero.id] || HERO_AVATARS.aethel}
                          alt={hero.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-headline text-[14px] font-bold text-[#e4e1f0]">{hero.name}</span>
                          <span className="font-hud text-[10px] text-[#facc15] font-bold">
                            {hero.stars}★
                          </span>
                          <span
                            style={{ color: hero.accentColor, backgroundColor: `${hero.accentColor}20` }}
                            className="px-1.5 py-0.2 rounded font-hud text-[9px] font-bold uppercase"
                          >
                            {hero.classVi}
                          </span>
                        </div>
                        <span className="font-hud text-[10px] text-[#bcc9cd] truncate mt-0.5">
                          {hero.signatureWeaponName} • {hero.elementLabel}
                        </span>
                        <span className="font-hud text-[9px] text-[#ffb95f] mt-0.5 truncate">
                          {hero.passiveNameVi}: {hero.passiveDescVi}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={() => {
                          soundManager.playButtonSound();
                          switchHero(hero.id);
                          setHeroModalOpen(false);
                        }}
                        disabled={isActive}
                        className={`px-3 py-1.5 rounded-xl font-hud text-[10px] font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#00424f] text-[#4cd7f6] opacity-70'
                            : 'bg-[#4cd7f6] text-[#003640] hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isActive ? 'ĐANG DÙNG' : 'CHỌN TƯỚNG'}
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playLevelUpSound();
                          promoteHeroStar(hero.id);
                        }}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ff5f7e] text-[#001f26] font-hud text-[9px] font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        NÂNG {hero.stars + 1}★
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Gem Socket Modal */}
      {gemModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setGemModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-md max-h-[82vh] rounded-2xl bg-[#171723] border border-[#3d494c]/50 p-4 shadow-2xl flex flex-col gap-3 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#3d494c]/30 shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a855f7] text-[22px]">diamond</span>
                <span className="font-headline text-[15px] font-bold text-[#e4e1f0]">
                  Khảm Ngọc Lỗ #{selectedGemSlot + 1} ({selectedItem.nameVi})
                </span>
              </div>
              <button
                onClick={() => setGemModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] flex items-center justify-center hover:text-white cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 overscroll-contain pr-1">
              {availableGems.map((gem, i) => (
                <button
                  key={i}
                  onClick={() => {
                    soundManager.playRewardSound();
                    socketGem(selectedItem.id, selectedGemSlot, gem.name, gem.bonus);
                    setGemModalOpen(false);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#292934] border border-[#3d494c]/30 hover:border-[#4cd7f6] text-left active:scale-95 transition-all cursor-pointer"
                >
                  <div
                    style={{ backgroundColor: `${gem.color}25` }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ color: gem.color }}>
                      diamond
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-hud text-[11px] font-bold text-[#e4e1f0]">{gem.name}</span>
                    <span className="font-hud text-[10px] text-[#4cd7f6]">{gem.bonus}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Level 1-100 Milestones Rewards Modal */}
      {rewardsModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setRewardsModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg h-[82vh] max-h-[82vh] rounded-2xl bg-[#171723] border border-[#ffb95f]/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#3d494c]/30 shrink-0 bg-[#1b1b28]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb95f] text-[22px]">card_giftcard</span>
                <span className="font-headline text-[16px] font-bold text-[#e4e1f0]">
                  Kho Thưởng Cấp Độ 1 → 100
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playRewardSound();
                    claimAllAvailableRewards();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#ffb95f] text-[#472a00] font-hud text-[10px] font-bold active:scale-95 transition-all shadow cursor-pointer"
                >
                  NHẬN TẤT CẢ
                </button>
                <button
                  onClick={() => setRewardsModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] flex items-center justify-center hover:text-white cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Scrollable Reward Items */}
            <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {levelRewards.map((reward) => {
                const canClaim = player.level >= reward.level && !reward.claimed;
                const isClaimed = reward.claimed;
                return (
                  <div
                    key={reward.level}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isClaimed
                        ? 'bg-[#1b1b25]/50 border-[#3d494c]/20 opacity-60'
                        : canClaim
                        ? 'bg-[#292934] border-[#ffb95f] shadow-[0_0_10px_rgba(255,185,95,0.2)]'
                        : 'bg-[#1b1b25] border-[#3d494c]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#34343f] flex items-center justify-center font-hud text-[11px] font-bold text-[#ffb95f] shrink-0">
                        Lv.{reward.level}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-hud text-[11px] font-bold text-[#e4e1f0]">
                            +{reward.rewards.diamonds} 💎 • +{reward.rewards.gold.toLocaleString()} Vàng
                          </span>
                          {reward.unlockedTitle && (
                            <span className="px-1.5 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[8px] font-bold">
                              {reward.unlockedTitle}
                            </span>
                          )}
                        </div>
                        {reward.rewards.itemDropName && (
                          <span className="font-hud text-[9px] text-[#4cd7f6] mt-0.5">
                            Thần Binh: {reward.rewards.itemDropName} ({reward.rewards.itemDropRarity})
                          </span>
                        )}
                        {reward.rewards.heroShards && (
                          <span className="font-hud text-[9px] text-[#f472b6] mt-0.5">
                            Mảnh Tướng: {reward.rewards.heroShards.heroName} x{reward.rewards.heroShards.count}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundManager.playRewardSound();
                        claimLevelReward(reward.level);
                      }}
                      disabled={!canClaim}
                      className={`px-3 py-1.5 rounded-xl font-hud text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                        isClaimed
                          ? 'bg-[#292934] text-[#bcc9cd]'
                          : canClaim
                          ? 'bg-[#ffb95f] text-[#472a00] hover:scale-105 active:scale-95 shadow'
                          : 'bg-[#292934] text-[#bcc9cd] opacity-50'
                      }`}
                    >
                      {isClaimed ? 'ĐÃ NHẬN' : canClaim ? 'NHẬN QUÀ' : `CẦN LV.${reward.level}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
