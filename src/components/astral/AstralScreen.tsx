import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GachaItem } from '../../types/game';
import { soundManager } from '../../utils/soundManager';

export const AstralScreen: React.FC = () => {
  const {
    player,
    pityCounter,
    gachaPulls,
    claimAfkRewards,
    leaderboard,
    switchGameMode,
    setCurrentTab,
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'gacha' | 'tower' | 'leaderboard'>('gacha');
  const [pulledItems, setPulledItems] = useState<GachaItem[]>([]);
  const [showGachaModal, setShowGachaModal] = useState(false);

  const handlePull = (count: 1 | 10) => {
    const items = gachaPulls(count);
    if (items.length > 0) {
      setPulledItems(items);
      setShowGachaModal(true);
    }
  };

  const handleTowerChallenge = () => {
    switchGameMode('tower');
    setCurrentTab('combat');
  };

  return (
    <div className="flex flex-col w-full px-2 sm:px-4 py-3 gap-3 pb-24 select-none">
      {/* Astral AFK Header Card */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#2a1700] flex items-center justify-center text-[#ffb95f] ring-1 ring-[#ffb95f]/40 shrink-0">
            <span className="material-symbols-outlined text-[24px]">hourglass_empty</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-[16px] font-bold text-[#e4e1f0]">Astral AFK & Rankings</span>
            <span className="font-hud text-[11px] text-[#bcc9cd]">Hệ Thống Triệu Hồi & Đua Top Toàn Cầu</span>
          </div>
        </div>

        <button
          onClick={claimAfkRewards}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ffb95f] to-[#e79400] text-[#472a00] font-hud text-[11px] font-bold active:scale-95 transition-all shadow cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">lock_open</span>
          <span>Thu Hoạch AFK</span>
        </button>
      </div>

      {/* 3 Sub-Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#1b1b25] border border-[#3d494c]/30">
        <button
          onClick={() => setActiveSubTab('gacha')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-hud text-[11px] font-bold transition-all cursor-pointer ${
            activeSubTab === 'gacha'
              ? 'bg-[#6f00be] text-[#e4e1f0] shadow'
              : 'text-[#bcc9cd] hover:text-[#e4e1f0]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>Gacha Triệu Hồi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tower')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-hud text-[11px] font-bold transition-all cursor-pointer ${
            activeSubTab === 'tower'
              ? 'bg-[#6f00be] text-[#e4e1f0] shadow'
              : 'text-[#bcc9cd] hover:text-[#e4e1f0]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">domain</span>
          <span>Tháp Hư Không</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-hud text-[11px] font-bold transition-all cursor-pointer ${
            activeSubTab === 'leaderboard'
              ? 'bg-[#6f00be] text-[#e4e1f0] shadow'
              : 'text-[#bcc9cd] hover:text-[#e4e1f0]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">leaderboard</span>
          <span>BXH Toàn Cầu</span>
        </button>
      </div>

      {/* TAB 1: GACHA SUMMON GATE */}
      {activeSubTab === 'gacha' && (
        <div className="flex flex-col gap-3">
          {/* Banner Hero Card */}
          <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#1f113a] via-[#12121d] to-[#003640] p-4 border border-[#ddb7ff]/40 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#a855f7]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex flex-col">
                <span className="px-2 py-0.5 rounded-full bg-[#ff5f7e]/20 text-[#ff5f7e] font-hud text-[9px] font-bold uppercase tracking-wider w-fit border border-[#ff5f7e]/30">
                  RATE UP THẦN VŨ (CELESTIAL)
                </span>
                <span className="font-headline text-[18px] sm:text-[20px] font-bold text-[#e4e1f0] mt-1">
                  TRIỆU HỒI NỮ HOÀNG SERAPHINA & CỔ VẬT CELESTIAL
                </span>
                <span className="font-hud text-[11px] text-[#bcc9cd]">
                  Cơ hội sở hữu Lưỡi Hái Sáng Thế CEL-01 & Mảnh Tướng Seraphina Celestial!
                </span>
              </div>
            </div>

            {/* Pity Progress */}
            <div className="relative z-10 flex flex-col gap-1 mt-4">
              <div className="flex items-center justify-between font-hud text-[10px]">
                <span className="text-[#bcc9cd] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#ffb95f] text-[14px]">stars</span>
                  <span>Bảo hiểm chắc chắn ra Celestial / Mythic:</span>
                </span>
                <span className="text-[#ffb95f] font-bold">{pityCounter} lượt nữa</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#34343f] overflow-hidden">
                <div
                  style={{ width: `${((50 - pityCounter) / 50) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#06b6d4] via-[#ffb95f] to-[#ff5f7e] rounded-full shadow-[0_0_10px_rgba(255,95,126,0.6)]"
                />
              </div>
            </div>

            {/* Pull Buttons */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handlePull(1)}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#292934] text-[#e4e1f0] font-hud text-[12px] font-bold border border-[#3d494c]/40 active:scale-95 transition-all shadow hover:border-[#4cd7f6] cursor-pointer"
              >
                <div className="flex items-center gap-1 text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[16px]">diamond</span>
                  <span>300</span>
                </div>
                <span>Triệu Hồi x1</span>
              </button>

              <button
                onClick={() => handlePull(10)}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-[#6f00be] to-[#06b6d4] text-[#e4e1f0] font-hud text-[12px] font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition-all border border-[#acedff]/40 cursor-pointer"
              >
                <div className="flex items-center gap-1 text-[#ffddb8]">
                  <span className="material-symbols-outlined text-[16px]">diamond</span>
                  <span>2,700</span>
                  <span className="line-through opacity-60 text-[9px]">3,000</span>
                </div>
                <span>Triệu Hồi x10</span>
              </button>
            </div>
          </div>

          {/* Gacha Drop Rates Info */}
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 font-hud text-[10px]">
            <span className="text-[#bcc9cd] uppercase font-bold tracking-wider">Tỷ Lệ Triệu Hồi Công Khai</span>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="p-1.5 rounded-lg bg-[#be185d]/20 border border-[#ff5f7e]/30 text-[#ff5f7e] font-bold">
                Celestial: 6.0%
              </div>
              <div className="p-1.5 rounded-lg bg-[#93000a]/20 border border-[#f43f5e]/30 text-[#f43f5e] font-bold">
                Mythic: 12.0%
              </div>
              <div className="p-1.5 rounded-lg bg-[#b45309]/20 border border-[#ffb95f]/30 text-[#ffb95f] font-bold">
                Legendary: 32.0%
              </div>
              <div className="p-1.5 rounded-lg bg-[#00424f]/20 border border-[#4cd7f6]/30 text-[#4cd7f6] font-bold">
                Epic/Rare: 50.0%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENDLESS VOID TOWER */}
      {activeSubTab === 'tower' && (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1b1b25] to-[#292934] border border-[#3d494c]/30 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-hud text-[10px] text-[#ffb95f] uppercase tracking-wider font-bold">
                  THÁP HƯ KHÔNG VÔ TẬN
                </span>
                <span className="font-headline text-[22px] font-bold text-[#e4e1f0]">
                  Tầng Hiện Tại: {player.towerFloor}/150
                </span>
                <span className="font-hud text-[10px] text-[#22c55e] font-bold mt-0.5">
                  ⚡ Hiệu ứng Idle: +{player.towerFloor * 2}% Tốc Độ Sản Lượng AFK
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#6f00be]/30 flex items-center justify-center text-[#ddb7ff] border border-[#ddb7ff]/40">
                <span className="material-symbols-outlined text-[28px]">military_tech</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#12121d] border border-[#3d494c]/30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-hud text-[11px] text-[#bcc9cd]">Boss Tầng {player.towerFloor}: Quái Thú Hư Không</span>
                <span className="font-hud text-[12px] text-[#ffb4ab] font-bold">
                  Thưởng Vượt Tầng: +100 💎 • +{(25000 * player.towerFloor).toLocaleString()} 🪙
                </span>
              </div>
              <div className="flex items-center gap-1 font-hud text-[12px] text-[#4cd7f6] font-bold">
                <span>CP: {player.stats.cp > 1000000 ? `${(player.stats.cp / 1000000).toFixed(2)}M` : player.stats.cp.toLocaleString()}</span>
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
              </div>
            </div>

            <button
              onClick={handleTowerChallenge}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffb95f] to-[#e79400] text-[#472a00] font-hud text-[13px] font-bold active:scale-95 transition-all shadow-[0_0_16px_rgba(255,185,95,0.5)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">swords</span>
              <span>KHIÊU CHIẾN TẦNG {player.towerFloor} TRONG ĐẤU TRƯỜNG 3D</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL LEADERBOARD */}
      {activeSubTab === 'leaderboard' && (
        <div className="flex flex-col gap-2">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                user.isCurrentPlayer
                  ? 'bg-[#003640]/40 border-[#4cd7f6] ring-1 ring-[#4cd7f6]'
                  : 'bg-[#1b1b25] border-[#3d494c]/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-hud text-[12px] font-bold ${
                    user.rank === 1
                      ? 'bg-[#facc15] text-[#000]'
                      : user.rank === 2
                      ? 'bg-[#94a3b8] text-[#000]'
                      : user.rank === 3
                      ? 'bg-[#b45309] text-white'
                      : 'bg-[#292934] text-[#bcc9cd]'
                  }`}
                >
                  {user.rank}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline text-[13px] font-bold text-white">{user.name}</span>
                    {user.isCurrentPlayer && (
                      <span className="px-1.5 py-0.2 rounded bg-[#4cd7f6] text-[#003640] font-hud text-[8px] font-bold">
                        BẠN
                      </span>
                    )}
                  </div>
                  <span className="font-hud text-[9px] text-[#bcc9cd]">
                    {user.title} • Bang: {user.guild}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-hud text-[12px] text-[#4cd7f6] font-bold">
                  {user.cp > 1000000 ? `${(user.cp / 1000000).toFixed(2)}M` : user.cp.toLocaleString()} CP
                </span>
                <span className="font-hud text-[9px] text-[#ffb95f]">Tháp Tầng {user.towerFloor}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gacha Pull Results Modal */}
      {showGachaModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGachaModal(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg max-h-[82vh] rounded-2xl bg-[#171723] border border-[#ff5f7e]/50 p-4 shadow-2xl flex flex-col gap-3 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#3d494c]/30 shrink-0">
              <span className="font-headline text-[16px] font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ff5f7e]">auto_awesome</span>
                KẾT QUẢ TRIỆU HỒI TINH VÂN
              </span>
              <button
                onClick={() => setShowGachaModal(false)}
                className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1">
              {pulledItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{ borderColor: item.color }}
                  className="flex flex-col items-center justify-between p-2 rounded-xl bg-[#292934] border aspect-square text-center shadow-lg"
                >
                  <span
                    style={{ backgroundColor: `${item.color}33`, color: item.color }}
                    className="px-1.5 py-0.2 rounded font-hud text-[8px] font-bold uppercase"
                  >
                    {item.rarity}
                  </span>
                  <span className="material-symbols-outlined text-[26px] my-auto" style={{ color: item.color }}>
                    {item.iconSymbol}
                  </span>
                  <span className="font-hud text-[9px] font-bold text-white truncate w-full">{item.name}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                soundManager.playButtonSound();
                setShowGachaModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#4cd7f6] text-[#003640] font-hud text-[12px] font-bold active:scale-95 transition-all shadow cursor-pointer mt-1 shrink-0"
            >
              TIẾP NHẬN PHẦN THƯỞNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
