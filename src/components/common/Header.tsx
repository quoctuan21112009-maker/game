import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { HERO_AVATARS } from '../../data/heroAvatars';
import { soundManager } from '../../utils/soundManager';
import { REBIRTH_PERKS, getRebirthRequirements } from '../../data/rebirthData';

export const Header: React.FC = () => {
  const {
    player,
    addCurrencies,
    activeHero,
    resetCharacterToStart,
    triggerRebirth,
    claimStarterPack,
    showToast,
    levelRewards,
    claimLevelReward,
    claimAllAvailableRewards,
    currentExp,
    maxExp,
    levelUpWithRequirements,
    quests,
    claimQuestReward,
    activeEvent,
    claimEventMilestone,
  } = useGame();

  const [modalOpen, setModalOpen] = useState(false);
  const [levelRewardsModalOpen, setLevelRewardsModalOpen] = useState(false);
  const [questsModalOpen, setQuestsModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [questCategoryFilter, setQuestCategoryFilter] = useState<'all' | 'daily' | 'main' | 'achievement' | 'event'>('all');
  const [isAudioMuted, setIsAudioMuted] = useState(() => soundManager.isMuted());

  const unclaimedLevelCount = levelRewards.filter((r) => r.level <= player.level && !r.claimed).length;
  const unclaimedQuestsCount = quests.filter((q) => q.progress >= q.target && !q.claimed).length;

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) soundManager.playButtonSound();
    showToast(muted ? 'ĐÃ TẮT ÂM THANH' : 'ĐÃ BẬT ÂM THANH GAME', muted ? 'volume_off' : 'volume_up');
  };

  const rebirthReq = getRebirthRequirements(player.rebirthCount);
  const canRebirth =
    player.level >= rebirthReq.requiredLevel &&
    player.towerFloor >= rebirthReq.requiredTower &&
    player.gold >= rebirthReq.requiredGold;
  const nextPerk =
    REBIRTH_PERKS.find((p) => p.tier === player.rebirthCount + 1) ||
    REBIRTH_PERKS[REBIRTH_PERKS.length - 1];

  const handleClaimFreePack = () => {
    claimStarterPack();
  };

  const handleTriggerRebirth = () => {
    const res = triggerRebirth();
    if (res.success) {
      setModalOpen(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('CẢNH BÁO: Hành động này sẽ xóa toàn bộ dữ liệu game về ban đầu! Bạn có chắc chắn muốn reset?')) {
      resetCharacterToStart();
      setModalOpen(false);
    }
  };

  const handleManualBreakthrough = () => {
    soundManager.playButtonSound();
    levelUpWithRequirements();
  };

  const formatEventTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredQuests = quests.filter((q) => {
    if (questCategoryFilter === 'all') return true;
    return q.category === questCategoryFilter;
  });

  const canBreakthrough = currentExp >= maxExp && player.gold >= player.level * 2500 && player.level < 100;
  const breakthroughGoldCost = player.level * 2500;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0d0d17]/95 backdrop-blur-xl border-b border-[#3d494c]/30">
        <div className="h-20 px-3 sm:px-6 flex flex-col justify-center gap-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.6)] max-w-7xl mx-auto">
          {/* Top Profile & Header Actions */}
          <div className="flex items-center justify-between gap-2">
            {/* Player Info with Vector Hero Avatar */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Hero Illustrated Avatar with Level badge */}
              <div
                onClick={() => {
                  soundManager.playButtonSound();
                  setLevelRewardsModalOpen(true);
                }}
                className="relative shrink-0 cursor-pointer group"
                title="Xem Kho Quà Thăng Cấp & Đột Phá"
              >
                <div
                  style={{ borderColor: activeHero.accentColor }}
                  className="w-10 h-10 rounded-xl bg-[#1b1b25] flex items-center justify-center border p-0.5 shadow-[0_0_12px_rgba(76,215,246,0.25)] group-hover:scale-105 transition-transform overflow-hidden"
                >
                  <img
                    src={HERO_AVATARS[activeHero.id] || HERO_AVATARS.aethel}
                    alt={activeHero.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-gradient-to-r from-[#6f00be] to-[#a855f7] text-white font-hud text-[9px] rounded font-bold shadow ring-1 ring-[#0d0d17]">
                  Lv.{player.level}
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-headline text-[14px] sm:text-[15px] font-bold text-[#e4e1f0] truncate">
                    {activeHero.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#e79400]/30 text-[#ffb95f] font-hud text-[8px] sm:text-[9px] uppercase tracking-wider font-bold">
                    VIP {player.vip}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-hud text-[9px] text-[#bcc9cd] uppercase tracking-wider font-semibold">CP</span>
                  <span className="font-hud text-[11px] sm:text-[12px] text-[#4cd7f6] font-bold tracking-tight leading-none">
                    {player.stats.cp > 1000000 ? `${(player.stats.cp / 1000000).toFixed(2)}M` : player.stats.cp.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#bcc9cd]/60 ml-1 hidden sm:inline">• {activeHero.classVi}</span>
                </div>
              </div>
            </div>

            {/* Right: Audio Toggle, Event Banner, Quests, Level Rewards Gift button, Settings */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Sound FX Toggle Button */}
              <button
                onClick={handleToggleSound}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isAudioMuted
                    ? 'bg-[#292934] border-[#3d494c]/40 text-[#bcc9cd]'
                    : 'bg-[#00424f]/60 border-[#4cd7f6]/60 text-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.3)]'
                }`}
                title={isAudioMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {isAudioMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>

              {/* Live Timed Event Button */}
              <button
                onClick={() => {
                  soundManager.playButtonSound();
                  setEventModalOpen(true);
                }}
                className="relative flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#4a044e] to-[#7f1d1d] border border-[#ff5f7e]/60 text-[#ff5f7e] font-hud text-[10px] font-bold active:scale-95 transition-all shadow-[0_0_10px_rgba(255,95,126,0.3)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px] text-[#ff5f7e] animate-pulse">local_fire_department</span>
                <span className="hidden sm:inline">SỰ KIỆN:</span>
                <span className="text-white text-[9px]">{formatEventTime(activeEvent.timeRemainingSec)}</span>
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
              </button>

              {/* Quests Button */}
              <button
                onClick={() => {
                  soundManager.playButtonSound();
                  setQuestsModalOpen(true);
                }}
                className="relative flex items-center gap-1 px-2 py-1 rounded-xl bg-[#292934] border border-[#3d494c]/40 text-[#4cd7f6] font-hud text-[10px] font-bold active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">task_alt</span>
                <span className="hidden sm:inline">NHIỆM VỤ</span>
                {unclaimedQuestsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#f43f5e] text-white text-[9px] flex items-center justify-center font-bold animate-bounce">
                    {unclaimedQuestsCount}
                  </span>
                )}
              </button>

              {/* Level Milestones Gift Button */}
              <button
                onClick={() => {
                  soundManager.playButtonSound();
                  setLevelRewardsModalOpen(true);
                }}
                className={`relative flex items-center gap-1 px-2 py-1 rounded-xl font-hud text-[10px] font-bold transition-all border active:scale-95 cursor-pointer ${
                  unclaimedLevelCount > 0
                    ? 'bg-gradient-to-r from-[#e79400]/30 to-[#f59e0b]/30 border-[#ffb95f] text-[#ffddb8] shadow-[0_0_12px_rgba(255,185,95,0.5)] animate-pulse'
                    : 'bg-[#292934] border-[#3d494c]/40 text-[#bcc9cd]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px] text-[#ffb95f]">card_giftcard</span>
                <span className="hidden sm:inline">QUÀ CẤP</span>
                {unclaimedLevelCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#ff5449] text-white text-[9px] flex items-center justify-center font-bold">
                    {unclaimedLevelCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  soundManager.playButtonSound();
                  setModalOpen(true);
                }}
                className="w-8 h-8 rounded-full bg-[#4cd7f6] text-[#003640] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(76,215,246,0.6)] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
              </button>
            </div>
          </div>

          {/* Currency & EXP Row */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto px-2 py-0.5 bg-[#1b1b25]/70 rounded-xl border border-[#3d494c]/20">
            <div className="flex items-center gap-1 px-1.5 py-0.5 shrink-0">
              <span className="material-symbols-outlined text-[#ffb95f] text-[14px]">monetization_on</span>
              <span className="font-hud text-[11px] text-[#e4e1f0] font-bold">
                {player.gold >= 1000000 ? `${(player.gold / 1000000).toFixed(2)}M` : player.gold.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1 px-1.5 py-0.5 shrink-0">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">diamond</span>
              <span className="font-hud text-[11px] text-[#e4e1f0] font-bold">
                {player.diamonds.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1 px-1.5 py-0.5 shrink-0">
              <span className="material-symbols-outlined text-[#ddb7ff] text-[14px]">token</span>
              <span className="font-hud text-[11px] text-[#e4e1f0] font-bold">
                {player.voidTokens.toLocaleString()}
              </span>
            </div>

            {/* Event Points Counter */}
            <div
              onClick={() => {
                soundManager.playButtonSound();
                setEventModalOpen(true);
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 shrink-0 cursor-pointer text-[#ff5f7e]"
            >
              <span className="material-symbols-outlined text-[14px]">flare</span>
              <span className="font-hud text-[11px] font-bold">
                {player.eventPoints || 0} Điểm SK
              </span>
            </div>

            {/* Quick EXP progress pill */}
            <div
              onClick={() => {
                soundManager.playButtonSound();
                setLevelRewardsModalOpen(true);
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#292934] border border-[#3d494c]/30 cursor-pointer hover:border-[#4cd7f6] shrink-0"
            >
              <span className="font-hud text-[9px] text-[#4cd7f6] font-bold">EXP:</span>
              <span className="font-hud text-[9px] text-[#bcc9cd]">
                {Math.min(100, Math.round((currentExp / maxExp) * 100))}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* BULLETPROOF MODALS: Bounded to 82vh, Pinned Headers, Smooth Inner Scroll */}
      {/* ======================================================== */}

      {/* Level Milestone Rewards Database Modal */}
      {levelRewardsModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setLevelRewardsModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg h-[82vh] max-h-[82vh] rounded-2xl bg-[#171723] border border-[#4cd7f6]/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Modal Header (Never cut off) */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#3d494c]/30 shrink-0 bg-[#1b1b28]">
              <div className="flex flex-col">
                <span className="font-headline text-[15px] sm:text-[16px] font-bold text-[#e4e1f0] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffb95f]">card_giftcard</span>
                  KHO QUÀ THĂNG CẤP (LV.1 - LV.100)
                </span>
                <span className="font-hud text-[10px] text-[#4cd7f6] mt-0.5">
                  Đẳng cấp hiện tại: Lv.{player.level} • {currentExp.toLocaleString()} / {maxExp.toLocaleString()} EXP
                </span>
              </div>
              <button
                onClick={() => setLevelRewardsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Strict Breakthrough / Level-Up Control Bar */}
            <div className="p-3 border-b border-[#3d494c]/30 shrink-0 bg-[#12121d] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-hud">
                <span className="text-[#bcc9cd]">
                  Tiến độ thăng cấp: <strong className="text-white">Lv.{player.level} ➔ Lv.{Math.min(100, player.level + 1)}</strong>
                </span>
                <span className="text-[#4cd7f6] font-bold">
                  {currentExp.toLocaleString()} / {maxExp.toLocaleString()} EXP ({Math.min(100, Math.round((currentExp / maxExp) * 100))}%)
                </span>
              </div>

              {/* EXP Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#1b1b25] overflow-hidden border border-[#3d494c]/30">
                <div
                  style={{ width: `${Math.min(100, (currentExp / maxExp) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] transition-all duration-300"
                />
              </div>

              {/* Action Buttons: Breakthrough & Claim All */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={handleManualBreakthrough}
                  disabled={!canBreakthrough}
                  className={`flex-1 py-2 px-3 rounded-xl font-hud text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    canBreakthrough
                      ? 'bg-gradient-to-r from-[#f59e0b] to-[#ffb95f] text-[#472a00] shadow-[0_0_15px_rgba(255,185,95,0.6)] active:scale-95 animate-pulse'
                      : 'bg-[#292934] text-[#bcc9cd] opacity-50 cursor-not-allowed'
                  }`}
                  title={
                    canBreakthrough
                      ? 'Đủ điều kiện! Nhấn để thăng cấp'
                      : `Cần ${maxExp} EXP và ${breakthroughGoldCost.toLocaleString()} Vàng để thăng cấp`
                  }
                >
                  <span className="material-symbols-outlined text-[16px]">military_tech</span>
                  <span>
                    {canBreakthrough
                      ? `ĐỘT PHÁ THĂNG CẤP (TIÊU ${breakthroughGoldCost.toLocaleString()} 🪙)`
                      : `CẦN ${(maxExp - currentExp > 0 ? maxExp - currentExp : 0).toLocaleString()} EXP & ${breakthroughGoldCost.toLocaleString()} 🪙`}
                  </span>
                </button>

                <button
                  onClick={claimAllAvailableRewards}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-hud text-[11px] font-bold active:scale-95 transition-all shadow-[0_0_10px_rgba(76,215,246,0.4)] flex items-center justify-center gap-1 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">done_all</span>
                  NHẬN TẤT CẢ ({unclaimedLevelCount})
                </button>
              </div>
            </div>

            {/* Level Database List - Scrolls smoothly within bounded height */}
            <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {levelRewards.map((reward) => {
                const canClaim = reward.level <= player.level && !reward.claimed;
                const isClaimed = reward.claimed;

                return (
                  <div
                    key={reward.level}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      canClaim
                        ? 'bg-[#003640]/30 border-[#4cd7f6] ring-1 ring-[#4cd7f6]'
                        : isClaimed
                        ? 'bg-[#1b1b25] border-[#3d494c]/20 opacity-70'
                        : 'bg-[#292934]/60 border-[#3d494c]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 font-hud font-bold ${
                          canClaim
                            ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_10px_#4cd7f6]'
                            : isClaimed
                            ? 'bg-[#34343f] text-[#bcc9cd]'
                            : 'bg-[#12121d] text-[#e4e1f0] border border-[#3d494c]/40'
                        }`}
                      >
                        <span className="text-[8px] uppercase">CẤP</span>
                        <span className="text-[14px] leading-none">{reward.level}</span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {reward.unlockedTitle && (
                            <span className="px-1.5 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[8px] font-bold">
                              {reward.unlockedTitle}
                            </span>
                          )}
                          {reward.rewards.itemDropName && (
                            <span className="px-1.5 py-0.2 rounded bg-[#ffb95f]/20 text-[#ffddb8] font-hud text-[8px] font-bold border border-[#ffb95f]/30">
                              🎁 {reward.rewards.itemDropName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[10px] font-hud text-[#bcc9cd]">
                          <span>🪙 +{reward.rewards.gold.toLocaleString()}</span>
                          <span>💎 +{reward.rewards.diamonds}</span>
                          <span>CP +{reward.statBonus.cpGain.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => claimLevelReward(reward.level)}
                      disabled={!canClaim}
                      className={`px-3 py-1.5 rounded-xl font-hud text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                        isClaimed
                          ? 'bg-[#292934] text-[#bcc9cd]'
                          : canClaim
                          ? 'bg-[#4cd7f6] text-[#003640] shadow active:scale-95'
                          : 'bg-[#292934] text-[#bcc9cd] opacity-50'
                      }`}
                    >
                      {isClaimed ? 'ĐÃ NHẬN' : canClaim ? 'NHẬN' : `CẦN LV.${reward.level}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Live Event Details Modal */}
      {eventModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEventModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg h-[82vh] max-h-[82vh] rounded-2xl bg-[#171723] border border-[#ff5f7e]/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#3d494c]/30 shrink-0 bg-[#1b1b28]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff5f7e] text-[22px]">local_fire_department</span>
                <span className="font-headline text-[16px] font-bold text-white">
                  {activeEvent.titleVi}
                </span>
              </div>
              <button
                onClick={() => setEventModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 overflow-y-auto flex-1 min-h-0 flex flex-col gap-3 overscroll-contain">
              {/* Event Banner Card */}
              <div className={`p-3 rounded-xl bg-gradient-to-r ${activeEvent.bannerColor} border border-[#ff5f7e]/40 shadow-lg flex flex-col gap-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#ff5f7e] text-[#001f26] font-hud text-[9px] font-bold uppercase">
                    {activeEvent.badge}
                  </span>
                  <span className="font-hud text-[11px] text-[#ffddb8] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    {formatEventTime(activeEvent.timeRemainingSec)}
                  </span>
                </div>
                <span className="font-hud text-[12px] text-white font-bold">{activeEvent.subTitleVi}</span>
                <p className="font-hud text-[10px] text-[#bcc9cd] leading-relaxed">{activeEvent.descriptionVi}</p>
                <div className="p-2 rounded-lg bg-[#000]/40 border border-[#ff5f7e]/30 flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-[#facc15] text-[18px]">bolt</span>
                  <span className="font-hud text-[10px] text-[#facc15] font-bold">
                    Hiệu Lực Sự Kiện: {activeEvent.activeBuffDescVi}
                  </span>
                </div>
              </div>

              {/* Event Milestones Progress */}
              <div className="flex items-center justify-between px-1">
                <span className="font-hud text-[11px] text-[#e4e1f0] font-bold">
                  Điểm Sự Kiện Của Bạn: <span className="text-[#ff5f7e]">{player.eventPoints || 0} PTS</span>
                </span>
                <span className="font-hud text-[9px] text-[#bcc9cd]">Làm Nhiệm vụ & Vượt Ải nhận thêm Điểm</span>
              </div>

              <div className="flex flex-col gap-2">
                {activeEvent.milestones.map((m, idx) => {
                  const canClaim = (player.eventPoints || 0) >= m.pointsRequired && !m.claimed;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        m.claimed
                          ? 'bg-[#12121d] border-[#3d494c]/20 opacity-60'
                          : canClaim
                          ? 'bg-[#292934] border-[#ff5f7e] shadow-[0_0_10px_rgba(255,95,126,0.2)]'
                          : 'bg-[#1b1b25] border-[#3d494c]/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#34343f] flex items-center justify-center text-[#ff5f7e] font-hud text-[10px] font-bold shrink-0">
                          {m.pointsRequired}p
                        </div>
                        <div className="flex flex-col">
                          <span className="font-hud text-[11px] font-bold text-white">{m.rewardTitle}</span>
                          <span className="font-hud text-[10px] text-[#4cd7f6]">
                            +{m.diamonds} 💎 • +{m.gold.toLocaleString()} 🪙 • +{m.voidStones} Đá Void
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => claimEventMilestone(activeEvent.id, idx)}
                        disabled={!canClaim}
                        className={`px-3 py-1.5 rounded-xl font-hud text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                          m.claimed
                            ? 'bg-[#292934] text-[#bcc9cd]'
                            : canClaim
                            ? 'bg-[#ff5f7e] text-[#001f26] shadow active:scale-95'
                            : 'bg-[#292934] text-[#bcc9cd] opacity-50'
                        }`}
                      >
                        {m.claimed ? 'ĐÃ NHẬN' : canClaim ? 'NHẬN' : `${m.pointsRequired} PTS`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quests System Modal */}
      {questsModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuestsModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg h-[82vh] max-h-[82vh] rounded-2xl bg-[#171723] border border-[#4cd7f6]/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#3d494c]/30 shrink-0 bg-[#1b1b28]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">task_alt</span>
                <span className="font-headline text-[16px] font-bold text-[#e4e1f0]">
                  Sổ Tay Nhiệm Vụ & Thành Tựu
                </span>
              </div>
              <button
                onClick={() => setQuestsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#292934] text-[#bcc9cd] hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-3 border-b border-[#3d494c]/20 shrink-0 bg-[#14141f]">
              {(
                [
                  { id: 'all', label: 'Tất Cả' },
                  { id: 'daily', label: 'Hằng Ngày' },
                  { id: 'main', label: 'Chính Tuyến' },
                  { id: 'achievement', label: 'Thành Tựu' },
                  { id: 'event', label: 'Sự Kiện Tuần' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setQuestCategoryFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg font-hud text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    questCategoryFilter === tab.id ? 'bg-[#4cd7f6] text-[#003640]' : 'bg-[#292934] text-[#bcc9cd]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quests List */}
            <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {filteredQuests.map((quest) => {
                const isComplete = quest.progress >= quest.target;
                const isClaimed = quest.claimed;
                return (
                  <div
                    key={quest.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isClaimed
                        ? 'bg-[#1b1b25]/60 border-[#3d494c]/20 opacity-60'
                        : isComplete
                        ? 'bg-[#003640]/30 border-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.2)]'
                        : 'bg-[#292934] border-[#3d494c]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1b1b25] flex items-center justify-center text-[#4cd7f6] shrink-0 border border-[#4cd7f6]/30">
                        <span className="material-symbols-outlined text-[22px]">{quest.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-headline text-[13px] font-bold text-white">{quest.titleVi}</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#34343f] text-[#bcc9cd] font-hud text-[8px] font-bold uppercase">
                            {quest.category}
                          </span>
                        </div>
                        <span className="font-hud text-[10px] text-[#bcc9cd] mt-0.5">{quest.descVi}</span>
                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-28 h-1.5 rounded-full bg-[#1b1b25] overflow-hidden">
                            <div
                              style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                              className="h-full bg-[#4cd7f6] rounded-full"
                            />
                          </div>
                          <span className="font-hud text-[9px] text-[#4cd7f6] font-bold">
                            {quest.progress}/{quest.target}
                          </span>
                        </div>
                        <span className="font-hud text-[9px] text-[#ffb95f] mt-0.5">
                          Thưởng: +{quest.rewards.diamonds} 💎 • +{quest.rewards.gold.toLocaleString()} 🪙 • +{quest.rewards.exp} EXP
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => claimQuestReward(quest.id)}
                      disabled={!isComplete || isClaimed}
                      className={`px-3 py-1.5 rounded-xl font-hud text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                        isClaimed
                          ? 'bg-[#1b1b25] text-[#bcc9cd]'
                          : isComplete
                          ? 'bg-[#4cd7f6] text-[#003640] shadow active:scale-95'
                          : 'bg-[#1b1b25] text-[#bcc9cd] opacity-50'
                      }`}
                    >
                      {isClaimed ? 'ĐÃ NHẬN' : isComplete ? 'NHẬN' : 'CHƯA ĐẠT'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Settings & Rebirth / Trùng Sinh Modal */}
      {modalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
        >
          <div className="relative w-full max-w-lg max-h-[84vh] rounded-2xl bg-[#171723] border border-[#a855f7]/50 p-4 shadow-2xl flex flex-col gap-3 my-auto overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#3d494c]/30 shrink-0">
              <span className="font-headline text-[15px] font-bold text-[#e4e1f0] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#a855f7]">military_tech</span>
                HỆ THỐNG TRÙNG SINH & THIẾT LẬP
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#292934] text-[#bcc9cd] hover:text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-3 pr-1">
              {/* REBIRTH CARD */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#2e1065]/60 via-[#1b1b25] to-[#12121d] border border-[#a855f7]/40 flex flex-col gap-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center text-[#d6a9ff]">
                      <span className="material-symbols-outlined text-[24px]">published_with_changes</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline text-[14px] font-bold text-white">
                        Trùng Sinh Bậc {player.rebirthCount}
                      </span>
                      <span className="font-hud text-[10px] text-[#bcc9cd]">
                        Chuyển sinh thức tỉnh sức mạnh thần thánh vĩnh viễn
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#a855f7]/30 text-[#d6a9ff] font-hud text-[10px] font-bold border border-[#a855f7]/40">
                    BẬC {player.rebirthCount}
                  </span>
                </div>

                {/* Milestone requirements checklist */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-[#0d0d17]/80 border border-[#3d494c]/30">
                  <span className="font-hud text-[10px] font-bold text-[#ffb95f] uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    MỐC YÊU CẦU ĐỂ TRÙNG SINH BẬC {player.rebirthCount + 1}:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    {/* Level requirement */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-start p-1.5 rounded bg-[#1b1b25] border border-[#3d494c]/20">
                      <span className="font-hud text-[9px] text-[#bcc9cd]">Cấp Độ Nhân Vật</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`material-symbols-outlined text-[13px] ${
                            player.level >= rebirthReq.requiredLevel ? 'text-[#22c55e]' : 'text-[#ff5449]'
                          }`}
                        >
                          {player.level >= rebirthReq.requiredLevel ? 'check_circle' : 'cancel'}
                        </span>
                        <span
                          className={`font-hud text-[11px] font-bold ${
                            player.level >= rebirthReq.requiredLevel ? 'text-[#22c55e]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          Lv.{player.level} / {rebirthReq.requiredLevel}
                        </span>
                      </div>
                    </div>

                    {/* Tower Floor requirement */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-start p-1.5 rounded bg-[#1b1b25] border border-[#3d494c]/20">
                      <span className="font-hud text-[9px] text-[#bcc9cd]">Tháp Hư Không</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`material-symbols-outlined text-[13px] ${
                            player.towerFloor >= rebirthReq.requiredTower ? 'text-[#22c55e]' : 'text-[#ff5449]'
                          }`}
                        >
                          {player.towerFloor >= rebirthReq.requiredTower ? 'check_circle' : 'cancel'}
                        </span>
                        <span
                          className={`font-hud text-[11px] font-bold ${
                            player.towerFloor >= rebirthReq.requiredTower ? 'text-[#22c55e]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          Tầng {player.towerFloor} / {rebirthReq.requiredTower}
                        </span>
                      </div>
                    </div>

                    {/* Gold requirement */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-start p-1.5 rounded bg-[#1b1b25] border border-[#3d494c]/20">
                      <span className="font-hud text-[9px] text-[#bcc9cd]">Vàng Aether</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`material-symbols-outlined text-[13px] ${
                            player.gold >= rebirthReq.requiredGold ? 'text-[#22c55e]' : 'text-[#ff5449]'
                          }`}
                        >
                          {player.gold >= rebirthReq.requiredGold ? 'check_circle' : 'cancel'}
                        </span>
                        <span
                          className={`font-hud text-[11px] font-bold ${
                            player.gold >= rebirthReq.requiredGold ? 'text-[#22c55e]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {player.gold >= 1000000 ? `${(player.gold / 1000000).toFixed(1)}M` : player.gold.toLocaleString()} / {rebirthReq.requiredGold >= 1000000 ? `${(rebirthReq.requiredGold / 1000000).toFixed(1)}M` : rebirthReq.requiredGold.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="font-hud text-[9px] text-[#bcc9cd]/80 italic mt-0.5">
                    * Lưu ý: Số lần trùng sinh càng nhiều thì mốc yêu cầu càng khó và đặc quyền càng siêu việt!
                  </span>
                </div>

                {/* Next Perk Reward */}
                <div className="p-2.5 rounded-lg bg-[#1b1b25] border border-[#a855f7]/30 flex items-center gap-2.5">
                  <div
                    style={{ borderColor: nextPerk.accentColor }}
                    className="w-10 h-10 rounded-xl bg-[#0d0d17] border flex items-center justify-center shrink-0 shadow"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ color: nextPerk.accentColor }}>
                      {nextPerk.icon}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-hud text-[9px] text-[#ddb7ff] font-bold uppercase">
                      ĐẶC QUYỀN SẮP MỞ KHÓA (BẬC {player.rebirthCount + 1}):
                    </span>
                    <span className="font-headline text-[13px] font-bold text-white truncate">
                      {nextPerk.nameVi}
                    </span>
                    <span className="font-hud text-[10px] text-[#4cd7f6]">{nextPerk.descVi}</span>
                  </div>
                </div>

                {/* Rebirth Action Button */}
                <button
                  onClick={handleTriggerRebirth}
                  disabled={!canRebirth}
                  className={`w-full py-2.5 px-3 rounded-xl font-hud text-[11px] font-bold flex items-center justify-center gap-2 transition-all shadow ${
                    canRebirth
                      ? 'bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#4cd7f6] text-[#001f26] shadow-[0_0_20px_rgba(168,85,247,0.7)] active:scale-95 cursor-pointer animate-pulse'
                      : 'bg-[#292934] text-[#bcc9cd] opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {canRebirth ? 'auto_awesome' : 'lock'}
                  </span>
                  {canRebirth
                    ? `KÍCH HOẠT TRÙNG SINH (LÊN BẬC ${player.rebirthCount + 1})`
                    : `CHƯA ĐẠT MỐC TRÙNG SINH BẬC ${player.rebirthCount + 1}`}
                </button>
              </div>

              {/* UNLOCKED PERKS LIST */}
              {player.unlockedPerks && player.unlockedPerks.length > 0 && (
                <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-[#1b1b25] border border-[#3d494c]/30">
                  <span className="font-hud text-[10px] font-bold text-[#4cd7f6] uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">military_tech</span>
                    ĐẶC QUYỀN ĐÃ MỞ KHÓA ({player.unlockedPerks.length}):
                  </span>
                  <div className="flex flex-col gap-1">
                    {player.unlockedPerks.map((perkId) => {
                      const perk = REBIRTH_PERKS.find((p) => p.id === perkId);
                      if (!perk) return null;
                      return (
                        <div
                          key={perk.id}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-[#0d0d17] border border-[#3d494c]/20"
                        >
                          <span
                            className="material-symbols-outlined text-[16px] shrink-0"
                            style={{ color: perk.accentColor }}
                          >
                            {perk.icon}
                          </span>
                          <span className="font-headline text-[11px] font-bold text-white shrink-0">
                            {perk.nameVi}:
                          </span>
                          <span className="font-hud text-[10px] text-[#bcc9cd] truncate">
                            {perk.descVi}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUPPORT PACK & SETTINGS */}
              <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-[#1b1b25] border border-[#3d494c]/30">
                <span className="font-hud text-[10px] font-bold text-[#e4e1f0] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">inventory</span>
                  TIẾP TẾ & THIẾT LẬP
                </span>

                {/* Free Starter Pack */}
                <button
                  onClick={handleClaimFreePack}
                  disabled={player.hasClaimedStarterPack}
                  className={`w-full py-2 px-3 rounded-xl font-hud text-[11px] font-bold flex items-center justify-center gap-2 transition-all shadow ${
                    player.hasClaimedStarterPack
                      ? 'bg-[#1b1b25] text-[#bcc9cd] border border-[#3d494c]/30 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-[#00424f] to-[#005d6e] border border-[#4cd7f6]/40 text-[#4cd7f6] active:scale-95 cursor-pointer shadow'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {player.hasClaimedStarterPack ? 'check_circle' : 'card_giftcard'}
                  </span>
                  {player.hasClaimedStarterPack
                    ? 'ĐÃ NHẬN GÓI TIẾP TẾ TÂN THỦ (CHỈ 1 LẦN)'
                    : 'NHẬN TIẾP TẾ TÂN THỦ (+500K 🪙, +2000 💎)'}
                </button>

                {/* Hard Reset */}
                <button
                  onClick={handleReset}
                  className="w-full py-2 px-3 rounded-xl bg-[#93000a]/15 border border-[#ff5449]/30 text-[#ffb4ab] font-hud text-[10px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer hover:bg-[#93000a]/30"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  KHÔI PHỤC TOÀN BỘ DỮ LIỆU BAN ĐẦU (HARD RESET)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
