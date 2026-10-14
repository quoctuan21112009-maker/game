import React, { useState, useEffect } from 'react';
import { GameMode } from '../../types/game';
import { Arena2D } from './Arena2D';
import { useGame } from '../../context/GameContext';
import { HERO_AVATARS } from '../../data/heroAvatars';
import { soundManager } from '../../utils/soundManager';

export const CombatScreen: React.FC = () => {
  const {
    activeBoss,
    availableBosses,
    switchBoss,
    activeHero,
    availableHeroes,
    switchHero,
    stages,
    currentStage,
    selectStage,
    player,
    skills,
    dashCharges,
    useDash,
    ultimateReady,
    useUltimate,
    dealDamageToBoss,
    triggerSkill,
    showToast,
    gameMode,
    switchGameMode,
    activeBuffs,
    pendingBuffChoices,
    selectRoguelikeBuff,
    triggerBuffDraft,
    worldBossTimeLeft,
    worldBossCurrentDamage,
  } = useGame();

  const [speedMultiplier, setSpeedMultiplier] = useState<number>(2);
  const [isAutoBattle, setIsAutoBattle] = useState<boolean>(false);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [buffsDrawerOpen, setBuffsDrawerOpen] = useState(false);

  // Screen shake state
  const [isScreenShake, setIsScreenShake] = useState<boolean>(false);
  const triggerScreenShake = () => {
    setIsScreenShake(true);
    setTimeout(() => setIsScreenShake(false), 300);
  };

  // Keyboard controls listener (1-4 for skills, Space for dash, R for ultimate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1' && skills[0]) {
        triggerSkill(skills[0].id);
      } else if (e.key === '2' && skills[1]) {
        triggerSkill(skills[1].id);
      } else if (e.key === '3' && skills[2]) {
        triggerSkill(skills[2].id);
      } else if (e.key === '4' && skills[3]) {
        triggerSkill(skills[3].id);
      } else if (e.code === 'Space') {
        e.preventDefault();
        useDash();
      } else if (e.key === 'r' || e.key === 'R') {
        useUltimate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skills, useDash, useUltimate, triggerSkill]);

  const toggleSpeed = () => {
    const next = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 4 : 1;
    setSpeedMultiplier(next);
    showToast(`TỐC ĐỘ CHIẾN ĐẤU: x${next}`, 'speed');
  };

  const toggleAuto = () => {
    setIsAutoBattle((prev) => {
      const next = !prev;
      showToast(next ? 'TỰ ĐỘNG CHIẾN ĐẤU: BẬT!' : 'TỰ ĐỘNG CHIẾN ĐẤU: TẮT', next ? 'smart_toy' : 'pause');
      return next;
    });
  };

  // World Boss DPS Rank Calculation
  const getWorldBossRank = (dmg: number) => {
    if (dmg >= 5000000) return { label: 'HẠNG EX (THẦN THOẠI)', color: '#ff5f7e' };
    if (dmg >= 2500000) return { label: 'HẠNG SSS', color: '#f59e0b' };
    if (dmg >= 1200000) return { label: 'HẠNG SS', color: '#a855f7' };
    if (dmg >= 500000) return { label: 'HẠNG S', color: '#4cd7f6' };
    if (dmg >= 200000) return { label: 'HẠNG A', color: '#10b981' };
    return { label: 'HẠNG B', color: '#bcc9cd' };
  };

  const worldBossRank = getWorldBossRank(worldBossCurrentDamage);

  return (
    <div className={`flex flex-col w-full pb-20 select-none ${isScreenShake ? 'shake-active' : ''}`}>
      {/* 4 Game Modes Bar */}
      <div className="w-full px-2 sm:px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#0d0d17]/95 border-b border-[#3d494c]/30">
        {(
          [
            { id: 'campaign', label: 'Chiến Dịch', icon: 'map', color: '#4cd7f6' },
            { id: 'roguelike', label: 'Mê Cung Dị Biến', icon: 'style', color: '#ff5f7e' },
            { id: 'tower', label: `Tháp Vô Tận (T.${player.towerFloor})`, icon: 'domain', color: '#f59e0b' },
            { id: 'worldboss', label: 'Boss Thế Giới (45s)', icon: 'local_fire_department', color: '#ef4444' },
          ] as { id: GameMode; label: string; icon: string; color: string }[]
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => {
              soundManager.playButtonSound();
              switchGameMode(m.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-hud text-[10px] font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
              gameMode === m.id
                ? 'bg-[#1b1b25] text-white shadow-md'
                : 'bg-[#12121d] text-[#bcc9cd] border-transparent hover:text-white'
            }`}
            style={{ borderColor: gameMode === m.id ? m.color : undefined }}
          >
            <span className="material-symbols-outlined text-[14px]" style={{ color: m.color }}>
              {m.icon}
            </span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* World Boss Raid Meter (Only in worldboss mode) */}
      {gameMode === 'worldboss' && (
        <div className="mx-2 sm:mx-4 mt-2 p-2.5 rounded-2xl bg-gradient-to-r from-[#7f1d1d]/80 via-[#2e1065]/80 to-[#0f172a]/90 border border-[#f43f5e]/50 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#ef4444]/20 flex items-center justify-center text-[#f43f5e] font-hud text-[14px] font-bold border border-[#f43f5e]/40 animate-pulse shrink-0">
              {worldBossTimeLeft}s
            </div>
            <div className="flex flex-col">
              <span className="font-hud text-[10px] text-[#bcc9cd] uppercase font-bold">TỔNG SÁT THƯƠNG ĐÃ GÂY:</span>
              <span className="font-headline text-[16px] font-bold text-white tracking-wide">
                {worldBossCurrentDamage.toLocaleString()} DMG
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              style={{ color: worldBossRank.color }}
              className="font-hud text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#000]/40 border border-current"
            >
              {worldBossRank.label}
            </span>
            <span className="font-hud text-[9px] text-[#bcc9cd] mt-0.5">
              Kỷ Lục: {player.worldBossBestDps.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Roguelike Buffs Drawer Trigger (Only in roguelike mode) */}
      {gameMode === 'roguelike' && (
        <div className="mx-2 sm:mx-4 mt-2 p-2 rounded-xl bg-[#1b1b25] border border-[#ff5f7e]/40 flex items-center justify-between text-[11px] font-hud">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5f7e] text-[18px]">style</span>
            <span className="text-[#e4e1f0] font-bold">Thẻ Dị Biến Kích Hoạt ({activeBuffs.length}):</span>
            <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] sm:max-w-xs">
              {activeBuffs.map((b) => (
                <span
                  key={b.id}
                  style={{ color: b.color }}
                  className="px-1.5 py-0.2 rounded bg-[#0d0d17] text-[9px] font-bold whitespace-nowrap border border-current"
                >
                  {b.nameVi} x{b.stackCount}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={triggerBuffDraft}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#ff5f7e] to-[#f59e0b] text-[#001f26] font-bold text-[9px] active:scale-95 transition-all cursor-pointer shadow"
          >
            + RÚT THẺ
          </button>
        </div>
      )}

      {/* Top Combat Stage & Camera Control Bar */}
      <div className="w-full px-2 sm:px-4 pt-2 pb-1.5 flex items-center justify-between gap-2 z-20 bg-[#0d0d17]/90 backdrop-blur-md border-b border-[#3d494c]/30">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Stage & Boss Select Trigger */}
          <button
            onClick={() => setStageModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#292934] text-[#ffb4ab] font-hud text-[10px] font-bold border border-[#ffb4ab]/40 active:scale-95 transition-all shadow shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">map</span>
            <span className="truncate max-w-[100px] sm:max-w-[150px]">
              {gameMode === 'tower' ? `Tháp Tầng ${player.towerFloor}` : gameMode === 'worldboss' ? 'Boss Thế Giới' : currentStage?.displayName || activeBoss.name}
            </span>
            <span className="material-symbols-outlined text-[12px]">expand_more</span>
          </button>

          {/* Quick Hero Switcher Trigger with Avatar */}
          <button
            onClick={() => {
              soundManager.playButtonSound();
              setHeroModalOpen(true);
            }}
            style={{ borderColor: activeHero.accentColor }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#292934] font-hud text-[10px] font-bold border active:scale-95 transition-all shadow shrink-0 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-[#3d494c]/50">
              <img
                src={HERO_AVATARS[activeHero.id] || HERO_AVATARS.aethel}
                alt={activeHero.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="truncate max-w-[65px]" style={{ color: activeHero.accentColor }}>
              {activeHero.name}
            </span>
          </button>
        </div>

        {/* Right: 2D Combat Indicator & Speed/Auto Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#2e1065]/50 border border-[#a855f7]/40 text-[#d6a9ff] font-hud text-[10px] font-bold shadow-[0_0_10px_rgba(168,85,247,0.25)]">
            <span className="material-symbols-outlined text-[14px] text-[#4cd7f6] animate-pulse">view_in_ar</span>
            <span>2D TÁC CHIẾN</span>
          </div>

          {/* Speed & Auto buttons */}
          <button
            onClick={toggleSpeed}
            className="px-2 py-1 rounded-xl bg-[#292934] text-[#ffddb8] font-hud text-[10px] font-bold border border-[#ffddb8]/30 active:scale-95 transition-all shadow cursor-pointer"
          >
            x{speedMultiplier}
          </button>
          <button
            onClick={toggleAuto}
            className={`px-2 py-1 rounded-xl font-hud text-[10px] font-bold border active:scale-95 transition-all shadow cursor-pointer ${
              isAutoBattle
                ? 'bg-[#003640] text-[#4cd7f6] border-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]'
                : 'bg-[#292934] text-[#bcc9cd] border-[#3d494c]/30'
            }`}
          >
            AUTO
          </button>
        </div>
      </div>

      {/* Real-time 2D Cyber-Battle Arena Viewport */}
      <div className="w-full px-2 sm:px-4 pt-1.5">
        <Arena2D
          speedMultiplier={speedMultiplier}
          isAutoBattle={isAutoBattle}
          onScreenShakeTrigger={triggerScreenShake}
        />
      </div>

      {/* Roguelike Buff Selection Draft Modal */}
      {pendingBuffChoices && pendingBuffChoices.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
          <div className="relative w-full max-w-lg max-h-[82vh] rounded-2xl bg-[#171723] border border-[#ff5f7e]/60 p-4 shadow-2xl flex flex-col gap-3 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#3d494c]/30 shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff5f7e] text-[24px]">style</span>
                <span className="font-headline text-[16px] font-bold text-[#e4e1f0]">
                  RÚT THẺ DỊ BIẾN HƯ KHÔNG (CHỌN 1)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 overflow-y-auto flex-1 min-h-0 overscroll-contain p-1">
              {pendingBuffChoices.map((buff) => (
                <button
                  key={buff.id}
                  onClick={() => {
                    soundManager.playRewardSound();
                    selectRoguelikeBuff(buff.id);
                  }}
                  style={{ borderColor: buff.color }}
                  className="flex flex-col items-center justify-between p-3 rounded-xl bg-[#292934] border hover:scale-105 active:scale-95 transition-all shadow-lg text-center cursor-pointer"
                >
                  <span
                    style={{ backgroundColor: `${buff.color}33`, color: buff.color }}
                    className="px-2 py-0.5 rounded font-hud text-[9px] font-bold uppercase"
                  >
                    {buff.rarity}
                  </span>
                  <div
                    style={{ color: buff.color }}
                    className="w-12 h-12 rounded-full bg-[#1b1b25] flex items-center justify-center my-2 shadow"
                  >
                    <span className="material-symbols-outlined text-[26px]">{buff.icon}</span>
                  </div>
                  <span className="font-headline text-[13px] font-bold text-white">{buff.nameVi}</span>
                  <span className="font-hud text-[10px] text-[#bcc9cd] mt-1 leading-snug">{buff.descVi}</span>
                  <span className="mt-3 w-full py-1 rounded bg-[#0d0d17] text-[#4cd7f6] font-hud text-[10px] font-bold">
                    CHỌN THẺ NÀY
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Select Stage & Boss Modal */}
      {stageModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setStageModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg h-[82vh] max-h-[82vh] rounded-2xl bg-[#171723] border border-[#ffb4ab]/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#3d494c]/30 shrink-0 bg-[#1b1b28]">
              <div className="flex flex-col">
                <span className="font-headline text-[15px] sm:text-[16px] font-bold text-[#e4e1f0] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffb4ab]">map</span>
                  CHỌN MÀN CHƠI & ĐẤU BOSS
                </span>
                <span className="font-hud text-[10px] text-[#4cd7f6] mt-0.5">
                  ⚡ Máu Boss & Quái tự động cân bằng theo Lv Player: Lv.{player.level}
                </span>
              </div>
              <button
                onClick={() => setStageModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Stage List */}
            <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {stages.map((stg) => {
                const isCurrent = stg.id === currentStage.id;
                return (
                  <button
                    key={stg.id}
                    onClick={() => {
                      soundManager.playButtonSound();
                      selectStage(stg.id);
                      setStageModalOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#93000a]/25 border-[#ffb4ab] ring-1 ring-[#ffb4ab]'
                        : stg.unlocked
                        ? 'bg-[#292934] border-[#3d494c]/30 hover:border-[#ffb4ab]/50'
                        : 'bg-[#181822] opacity-60 border-[#2d2d3a]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0d0d17] flex items-center justify-center shrink-0 border border-[#ffb4ab]/30">
                      <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">
                        {stg.stageNum === 5 ? 'skull' : 'swords'}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-headline text-[13px] font-bold text-[#e4e1f0] truncate">
                          {stg.displayName}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-[#ffb4ab] text-[#472a00] font-hud text-[9px] font-bold shrink-0">
                            ĐANG ĐẤU
                          </span>
                        )}
                      </div>

                      <span className="font-hud text-[10px] text-[#bcc9cd] mt-0.5">{stg.chapterName}</span>

                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#3d494c]/20">
                        <span className="font-hud text-[9px] text-[#ffb4ab] font-bold">
                          HP Cân Bằng: {activeBoss.maxHp.toLocaleString()}
                        </span>
                        <span className="font-hud text-[9px] text-[#4cd7f6]">
                          Thưởng: +{stg.expReward} EXP • {stg.goldReward.toLocaleString()} 🪙
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hero Switcher Modal with Character Art */}
      {heroModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setHeroModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg h-[82vh] max-h-[82vh] rounded-2xl bg-[#171723] border border-[#4cd7f6]/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#3d494c]/30 shrink-0 bg-[#1b1b28]">
              <div className="flex flex-col">
                <span className="font-headline text-[15px] sm:text-[16px] font-bold text-[#e4e1f0] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4cd7f6]">groups</span>
                  DANH SÁCH CHIẾN BINH (7 TƯỚNG)
                </span>
                <span className="font-hud text-[10px] text-[#bcc9cd] mt-0.5">
                  Chuyển đổi nhân vật đổi cả vũ khí FPS 3D, chiêu thức và chỉ số
                </span>
              </div>
              <button
                onClick={() => setHeroModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Heroes List */}
            <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {availableHeroes.map((hero) => {
                const isCurrent = hero.id === activeHero.id;
                return (
                  <button
                    key={hero.id}
                    onClick={() => {
                      soundManager.playButtonSound();
                      switchHero(hero.id);
                      setHeroModalOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#003640]/40 border-[#4cd7f6] ring-1 ring-[#4cd7f6]'
                        : 'bg-[#292934] border-[#3d494c]/30 hover:border-[#4cd7f6]/50'
                    }`}
                  >
                    <div
                      style={{ borderColor: hero.accentColor }}
                      className="w-12 h-12 rounded-xl bg-[#0d0d17] flex items-center justify-center shrink-0 border overflow-hidden p-0.5 shadow"
                    >
                      <img
                        src={HERO_AVATARS[hero.id] || HERO_AVATARS.aethel}
                        alt={hero.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-headline text-[14px] font-bold text-[#e4e1f0]">{hero.name}</span>
                          <span className="font-hud text-[10px] text-[#facc15] font-bold">
                            {hero.stars}★
                          </span>
                          <span
                            style={{ backgroundColor: hero.accentColor + '33', color: hero.accentColor }}
                            className="px-1.5 py-0.2 rounded font-hud text-[8px] font-bold uppercase"
                          >
                            {hero.role}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-[#4cd7f6] text-[#003640] font-hud text-[9px] font-bold">
                            ĐANG CHỌN
                          </span>
                        )}
                      </div>

                      <span className="font-hud text-[10px] text-[#4cd7f6] font-bold mt-0.5">{hero.classVi}</span>
                      <span className="font-hud text-[10px] text-[#bcc9cd] mt-0.5 line-clamp-2">
                        {hero.descriptionVi}
                      </span>

                      <div className="flex items-center gap-2 mt-1.5 pt-1 border-t border-[#3d494c]/20 text-[9px] font-hud">
                        <span className="text-[#ffddb8] font-bold">Vũ Khí: {hero.signatureWeaponName}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
