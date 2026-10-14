import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

export const SanctuaryScreen: React.FC = () => {
  const {
    setCurrentTab,
    claimAfkRewards,
    speedUpForge,
    harvestCrystals,
    showToast,
    player,
  } = useGame();

  const [forgeSeconds, setForgeSeconds] = useState<number>(14 * 60 + 22); // 00:14:22
  const [resonance, setResonance] = useState<number>(94.2);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      setForgeSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsedAfk = Math.max(0, Math.floor((now - (player.lastAfkClaimTime || now)) / 1000));
  const afkHours = Math.floor(elapsedAfk / 3600);
  const afkMinutes = Math.floor((elapsedAfk % 3600) / 60);
  const afkSeconds = elapsedAfk % 60;
  const afkTimeFormatted = `${afkHours > 0 ? afkHours + 'h ' : ''}${afkMinutes}m ${afkSeconds}s`;

  const elapsedCrystal = Math.floor((now - (player.lastCrystalHarvestTime || 0)) / 1000);
  const crystalCd = Math.max(0, 180 - elapsedCrystal);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `00:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleResonanceBoost = () => {
    setResonance((r) => Math.min(100, Number((r + 1.5).toFixed(1))));
    showToast('KÍCH HOẠT CỘNG HƯỞNG LEYLINE: x2 TỐC ĐỘ AFK TRONG 2 GIỜ!', 'bolt');
  };

  return (
    <div className="flex flex-col w-full px-3 py-3 gap-3 pb-24 select-none">
      {/* Sanctuary Overview Card */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00424f] flex items-center justify-center text-[#4cd7f6] ring-1 ring-[#4cd7f6]/40">
              <span className="material-symbols-outlined text-[24px]">fort</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-[16px] font-bold text-[#e4e1f0]">Sanctuary...</span>
                <span className="px-1.5 py-0.2 rounded bg-[#06b6d4] text-[#003640] font-hud text-[9px] font-bold">
                  TIER IV
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-hud text-[#bcc9cd]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />
                <span>Leyline Resonance:</span>
                <span className="text-[#4cd7f6] font-bold">{resonance}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-1 rounded-xl bg-[#292934] font-hud text-[11px] text-[#bcc9cd] flex items-center gap-1 border border-[#3d494c]/30">
              <span className="material-symbols-outlined text-[14px]">grid_4x4</span>
              <span>Grid: 24x24</span>
            </span>
            <button className="p-1 rounded-xl bg-[#292934] text-[#bcc9cd] hover:text-[#e4e1f0]">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* Perimeter Expansion Progress */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex items-center justify-between font-hud text-[10px]">
            <span className="text-[#bcc9cd] flex items-center gap-1">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[12px]">architecture</span>
              <span>Aetheric Perimeter Expansion</span>
            </span>
            <span className="text-[#ffb95f] font-bold">03h 42m remaining</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#34343f] overflow-hidden">
            <div className="w-3/5 h-full bg-gradient-to-r from-[#4cd7f6] to-[#ddb7ff] rounded-full" />
          </div>
        </div>
      </div>

      {/* Interactive Constellation Base Node Map */}
      <div className="relative w-full h-[320px] rounded-2xl bg-[#0d0d17] border border-[#3d494c]/40 shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Holographic orbital grid lines */}
        <div className="absolute inset-0 hologram-grid opacity-30" />
        <div className="absolute w-56 h-56 rounded-full border border-[#4cd7f6]/20 animate-spin" style={{ animationDuration: '40s' }} />
        <div className="absolute w-40 h-40 rounded-full border border-dashed border-[#ddb7ff]/20 animate-spin" style={{ animationDuration: '25s' }} />

        {/* Center: Aether Gate */}
        <button
          onClick={() => {
            setCurrentTab('combat');
            showToast('TIẾN VÀO CỔNG HƯ KHÔNG AETHER GATE', 'all_inclusive');
          }}
          className="relative z-20 w-16 h-16 rounded-2xl bg-[#00424f] border border-[#4cd7f6] flex flex-col items-center justify-center shadow-[0_0_24px_rgba(76,215,246,0.6)] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[#4cd7f6] text-[26px]">all_inclusive</span>
          <span className="font-hud text-[8px] font-bold text-[#4cd7f6] tracking-wider mt-0.5">GATE</span>
          {/* Orbital arc ring */}
          <div className="absolute -inset-2 rounded-full border-t-2 border-r-2 border-[#4cd7f6] animate-spin" style={{ animationDuration: '8s' }} />
        </button>

        {/* Top: Arcane Spire */}
        <button
          onClick={() => showToast('ARCANE SPIRE LV.18: CÔNG TRÌNH TỐI CAO', 'account_balance')}
          className="absolute top-4 flex flex-col items-center gap-1 z-20 active:scale-95 transition-all"
        >
          <span className="px-1.5 py-0.2 rounded bg-[#ffb95f] text-[#472a00] font-hud text-[8px] font-bold">
            CORE
          </span>
          <div className="w-12 h-12 rounded-xl bg-[#00424f]/80 border border-[#4cd7f6]/50 flex flex-col items-center justify-center shadow-[0_0_14px_rgba(76,215,246,0.4)]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">account_balance</span>
            <span className="font-hud text-[8px] text-[#bcc9cd]">Lv.18</span>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-[#1b1b25]/90 border border-[#3d494c]/30 font-hud text-[10px] text-[#e4e1f0] font-bold">
            Arcane Spire
          </span>
        </button>

        {/* Left: Aether Forge */}
        <button
          onClick={() => showToast('AETHER FORGE LV.16: ĐANG ĐÚC VŨ KHÍ EPIC', 'local_fire_department')}
          className="absolute left-4 flex flex-col items-center gap-1 z-20 active:scale-95 transition-all"
        >
          <span className="px-1.5 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[8px] font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[10px]">timer</span> 14:22
          </span>
          <div className="w-12 h-12 rounded-xl bg-[#2a1700]/80 border border-[#ffb95f]/50 flex flex-col items-center justify-center shadow-[0_0_14px_rgba(255,185,95,0.4)]">
            <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">local_fire_department</span>
            <span className="font-hud text-[8px] text-[#bcc9cd]">Lv.16</span>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-[#1b1b25]/90 border border-[#3d494c]/30 font-hud text-[10px] text-[#e4e1f0] font-bold">
            Aether Forge
          </span>
        </button>

        {/* Right: Runic Altar */}
        <button
          onClick={() => {
            setCurrentTab('altar');
            showToast('CHUYỂN ĐẾN PHÒNG KHẮC ẤN RUNIC ALTAR', 'auto_awesome');
          }}
          className="absolute right-4 flex flex-col items-center gap-1 z-20 active:scale-95 transition-all"
        >
          <div className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping" />
          <div className="w-12 h-12 rounded-xl bg-[#00424f]/80 border border-[#4cd7f6]/50 flex flex-col items-center justify-center shadow-[0_0_14px_rgba(76,215,246,0.4)]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">flare</span>
            <span className="font-hud text-[8px] text-[#bcc9cd]">Lv.12</span>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-[#1b1b25]/90 border border-[#3d494c]/30 font-hud text-[10px] text-[#e4e1f0] font-bold">
            Runic Altar
          </span>
        </button>

        {/* Bottom Left: Crystal Extractor */}
        <button
          onClick={harvestCrystals}
          className="absolute bottom-3 left-6 flex flex-col items-center gap-1 z-20 active:scale-95 transition-all"
        >
          <span className={`px-1.5 py-0.2 rounded font-hud text-[8px] font-bold flex items-center gap-0.5 ${
            crystalCd > 0 ? 'bg-[#34343f] text-[#bcc9cd]' : 'bg-[#ffb95f] text-[#472a00]'
          }`}>
            <span className="material-symbols-outlined text-[10px]">{crystalCd > 0 ? 'hourglass_top' : 'download'}</span>
            {crystalCd > 0 ? `${crystalCd}s` : 'SẴN SÀNG'}
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#1b1b25] border border-[#ffb95f]/40 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">diamond</span>
            <span className="font-hud text-[7px] text-[#ffb95f] font-bold">12K Vàng</span>
          </div>
          <span className="px-1.5 py-0.5 rounded-lg bg-[#1b1b25]/90 border border-[#3d494c]/30 font-hud text-[9px] text-[#bcc9cd]">
            Mỏ Tinh Thể
          </span>
        </button>

        {/* Bottom Right: AFK Treasury */}
        <button
          onClick={claimAfkRewards}
          className="absolute bottom-3 right-6 flex flex-col items-center gap-1 z-20 active:scale-95 transition-all"
        >
          <span className={`w-2 h-2 rounded-full ${elapsedAfk >= 60 ? 'bg-[#22c55e] animate-ping' : 'bg-[#f59e0b]'}`} />
          <div className="w-10 h-10 rounded-xl bg-[#1b1b25] border border-[#ffb95f]/40 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">inventory_2</span>
            <span className="font-hud text-[7px] text-[#ffb95f] font-bold">{afkTimeFormatted}</span>
          </div>
          <span className="px-1.5 py-0.5 rounded-lg bg-[#1b1b25]/90 border border-[#3d494c]/30 font-hud text-[9px] text-[#bcc9cd]">
            Kho AFK
          </span>
        </button>
      </div>

      {/* Active Crafting: Aether Forge Card */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2a1700] flex items-center justify-center text-[#ffb95f] ring-1 ring-[#ffb95f]/40">
              <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-[15px] font-bold text-[#e4e1f0]">Aether Forge</span>
                <span className="px-1.5 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[9px] font-bold">
                  Lv.16
                </span>
              </div>
              <span className="font-hud text-[11px] text-[#bcc9cd]">Active Crafting: Arcane Void Blade (Epic)</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-hud text-[9px] text-[#bcc9cd] uppercase font-bold">TIME LEFT</span>
            <span className="font-headline text-[16px] font-bold text-[#ffb95f]">{formatTime(forgeSeconds)}</span>
          </div>
        </div>

        {/* Forge Progress Bar */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="w-full h-2 rounded-full bg-[#34343f] overflow-hidden">
            <div className="w-[74%] h-full bg-gradient-to-r from-[#6f00be] to-[#ddb7ff] rounded-full shadow-[0_0_8px_rgba(221,183,255,0.6)]" />
          </div>
          <div className="flex items-center justify-between font-hud text-[10px]">
            <span className="text-[#bcc9cd]">Materials Infused: 850/850 Void Cores</span>
            <span className="text-[#ddb7ff] font-bold">74% Complete</span>
          </div>
        </div>
      </div>

      {/* 4 Base Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={harvestCrystals}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#292934] active:scale-95 transition-all shadow border border-[#3d494c]/30 hover:border-[#ffb95f] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">
            {crystalCd > 0 ? 'hourglass_top' : 'pan_tool'}
          </span>
          <span className="font-hud text-[10px] font-bold text-[#e4e1f0] mt-1">
            {crystalCd > 0 ? `Chờ ${crystalCd}s` : 'Thu Hoạch'}
          </span>
          <span className="font-hud text-[9px] text-[#ffb95f] font-bold">
            {crystalCd > 0 ? 'Đang hồi' : '+12K 🪙'}
          </span>
        </button>

        <button
          onClick={speedUpForge}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#292934] active:scale-95 transition-all shadow border border-[#3d494c]/30 hover:border-[#ddb7ff] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#ddb7ff] text-[20px]">fast_forward</span>
          <span className="font-hud text-[10px] font-bold text-[#e4e1f0] mt-1">Speed-Up</span>
          <span className="font-hud text-[9px] text-[#ddb7ff] font-bold">-10m Free</span>
        </button>

        <button
          onClick={() => showToast('NÂNG CẤP LƯỚI KHÔNG GIAN LÊN 26x26!', 'grid_on')}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#292934] active:scale-95 transition-all shadow border border-[#3d494c]/30 hover:border-[#4cd7f6] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">fullscreen</span>
          <span className="font-hud text-[10px] font-bold text-[#e4e1f0] mt-1">Upgrade</span>
          <span className="font-hud text-[9px] text-[#4cd7f6] font-bold">Grid 26x26</span>
        </button>

        <button
          onClick={handleResonanceBoost}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#292934] active:scale-95 transition-all shadow border border-[#3d494c]/30 hover:border-[#ffb95f] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">bolt</span>
          <span className="font-hud text-[10px] font-bold text-[#e4e1f0] mt-1">Resonance</span>
          <span className="font-hud text-[9px] text-[#ffb95f] font-bold">2x Leyline</span>
        </button>
      </div>

      {/* Astral Vault Storage Card */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2a1700] flex items-center justify-center text-[#ffb95f]">
            <span className="material-symbols-outlined text-[22px]">hourglass_empty</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${elapsedAfk >= 60 ? 'bg-[#22c55e]' : 'bg-[#ffb95f]'}`} />
              <span className="font-headline text-[14px] font-bold text-[#e4e1f0]">Kho Tích Lũy AFK Aether</span>
            </div>
            <span className="font-hud text-[11px] text-[#bcc9cd]">
              Đã tích: <strong className="text-[#ffb95f]">{afkTimeFormatted}</strong> / Tối đa 8h {elapsedAfk < 60 && `(Cần tối thiểu 60s)`}
            </span>
          </div>
        </div>

        <button
          onClick={claimAfkRewards}
          disabled={elapsedAfk < 60}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl font-hud text-[12px] font-bold transition-all shadow ${
            elapsedAfk >= 60
              ? 'bg-gradient-to-r from-[#ffb95f] to-[#e79400] text-[#472a00] active:scale-95 shadow-[0_0_14px_rgba(255,185,95,0.6)] cursor-pointer animate-pulse'
              : 'bg-[#292934] text-[#bcc9cd] opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {elapsedAfk >= 60 ? 'lock_open' : 'lock'}
          </span>
          <span>{elapsedAfk >= 60 ? 'THU HOẠCH' : `CHỜ ${60 - elapsedAfk}S`}</span>
        </button>
      </div>

      {/* Bottom CTA: Enter 3D Rift */}
      <button
        onClick={() => {
          setCurrentTab('combat');
          showToast('TIẾN VÀO CHIẾN TRƯỜNG 3D RIFT: STAGE 14-8!', 'sports_esports');
        }}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#06b6d4] via-[#4cd7f6] to-[#6f00be] text-[#003640] font-headline shadow-[0_0_24px_rgba(6,182,212,0.6)] active:scale-[0.98] transition-all border border-[#acedff]/40"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#001f26]/30 backdrop-blur-md flex items-center justify-center text-[#001f26]">
            <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[17px] font-bold tracking-wide uppercase">ENTER 3D RIFT</span>
            <span className="font-hud text-[11px] font-bold opacity-90">STAGE 14-8: VOID ABYSS</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#001f26]/40 text-[#acedff] font-hud text-[11px] font-bold">
          <span>ENGAGE</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </div>
      </button>
    </div>
  );
};
