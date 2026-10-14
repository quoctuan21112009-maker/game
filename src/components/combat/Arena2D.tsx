import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { HERO_AVATARS } from '../../data/heroAvatars';
import { soundManager } from '../../utils/soundManager';

interface Arena2DProps {
  speedMultiplier: number;
  isAutoBattle: boolean;
  onScreenShakeTrigger?: () => void;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  isCrit: boolean;
}

interface SlashEffect {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export const Arena2D: React.FC<Arena2DProps> = ({
  speedMultiplier,
  isAutoBattle,
  onScreenShakeTrigger,
}) => {
  const {
    activeBoss,
    activeHero,
    player,
    skills,
    dashCharges,
    useDash,
    ultimateReady,
    useUltimate,
    dealDamageToBoss,
    triggerSkill,
    comboHits,
    showToast,
  } = useGame();

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [slashes, setSlashes] = useState<SlashEffect[]>([]);
  const [heroAttacking, setHeroAttacking] = useState(false);
  const [bossHit, setBossHit] = useState(false);
  const [bossTelegraph, setBossTelegraph] = useState(false);

  const arenaCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-battle loop
  useEffect(() => {
    if (!isAutoBattle) return;
    const intervalTime = Math.max(250, 900 / speedMultiplier);

    const autoTimer = setInterval(() => {
      // 1. Try to cast ready skill if sufficient mana
      const readySkill = skills.find((s) => s.cooldownRemaining <= 0 && player.mana >= s.manaCost);
      if (readySkill) {
        handleCastSkill(readySkill.id);
        return;
      }

      // 2. Otherwise perform basic cyber slash
      handleBasicSlash();
    }, intervalTime);

    return () => clearInterval(autoTimer);
  }, [isAutoBattle, speedMultiplier, skills, player.mana]);

  // Periodic Boss telegraph warning
  useEffect(() => {
    const telegraphTimer = setInterval(() => {
      setBossTelegraph(true);
      setTimeout(() => setBossTelegraph(false), 2000);
    }, 8000);
    return () => clearInterval(telegraphTimer);
  }, []);

  // Canvas particle starfield & dynamic grid in 2D
  useEffect(() => {
    const canvas = arenaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 380);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 600;
      height = canvas.height = canvas.offsetHeight || 380;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.8 + 0.3,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Starfield drift
      stars.forEach((star) => {
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = width;
          star.y = Math.random() * height;
        }
        ctx.fillStyle = `rgba(172, 237, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Holographic floor grid
      const horizonY = height * 0.65;
      gridOffset = (gridOffset + 0.6 * speedMultiplier) % 30;

      ctx.save();
      ctx.strokeStyle = 'rgba(76, 215, 246, 0.12)';
      ctx.lineWidth = 1;

      // Horizontal perspective grid lines
      for (let y = horizonY; y < height; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Converging perspective lines
      for (let x = -width * 0.5; x < width * 1.5; x += 40) {
        ctx.beginPath();
        ctx.moveTo(width * 0.5, horizonY);
        ctx.lineTo(x + gridOffset, height);
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speedMultiplier]);

  const spawnFloatingDamage = (text: string, isCrit = false, color = '#4cd7f6') => {
    const id = Date.now() + Math.random();
    const x = 50 + (Math.random() * 20 - 10);
    const y = 40 + (Math.random() * 15 - 7);

    setFloatingTexts((prev) => [...prev.slice(-6), { id, text, x, y, color, isCrit }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 850);
  };

  const spawnSlashVisual = (color = '#4cd7f6') => {
    const id = Date.now() + Math.random();
    const slash = {
      id,
      x1: 25 + Math.random() * 10,
      y1: 35 + Math.random() * 20,
      x2: 70 + Math.random() * 15,
      y2: 45 + Math.random() * 25,
      color,
    };
    setSlashes((prev) => [...prev.slice(-4), slash]);
    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== id));
    }, 280);
  };

  // Perform basic cyber slash
  const handleBasicSlash = () => {
    setHeroAttacking(true);
    setBossHit(true);
    spawnSlashVisual(activeHero.accentColor || '#4cd7f6');

    if (onScreenShakeTrigger) onScreenShakeTrigger();

    // Trigger authentic fighting sound effects
    if (Math.random() > 0.4) {
      soundManager.playMeleeHitSound();
    } else {
      soundManager.playHeavyBladeClash();
    }

    if (comboHits % 4 === 0) {
      soundManager.playBossGruntRoar();
    }

    const isCrit = Math.random() * 100 < player.stats.critRate;
    const baseDmg = Math.round((player.stats.atk + player.level * 55) * (isCrit ? 1.6 : 1.0));

    dealDamageToBoss(baseDmg, isCrit, isCrit ? 'CRITICAL SLASH' : undefined);
    spawnFloatingDamage(
      `${baseDmg.toLocaleString()}${isCrit ? '!' : ''}`,
      isCrit,
      isCrit ? '#ffb95f' : activeHero.accentColor || '#4cd7f6'
    );

    setTimeout(() => setHeroAttacking(false), 200);
    setTimeout(() => setBossHit(false), 150);
  };

  // Cast Elemental Skill
  const handleCastSkill = (skillId: string) => {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return;

    if (player.mana < skill.manaCost) {
      showToast(`Không đủ Mana! Cần ${skill.manaCost} MP (Hiện có: ${player.mana} MP)`, 'bolt');
      return;
    }

    setHeroAttacking(true);
    setBossHit(true);
    spawnSlashVisual(skill.accentColor);

    if (onScreenShakeTrigger) onScreenShakeTrigger();

    // Play skill cast audio + elemental audio + boss impact
    soundManager.playManaCastSound();
    soundManager.playBossGruntRoar();

    const dmg = triggerSkill(skillId);
    if (dmg > 0) {
      spawnFloatingDamage(`${skill.name.toUpperCase()} +${dmg.toLocaleString()}`, true, skill.accentColor);
    }

    setTimeout(() => setHeroAttacking(false), 300);
    setTimeout(() => setBossHit(false), 200);
  };

  const handleDoubleDash = () => {
    soundManager.playSlashSound();
    const success = useDash();
    if (success) {
      setHeroAttacking(true);
      setTimeout(() => setHeroAttacking(false), 400);
    }
  };

  const handleDimensionBreak = () => {
    if (!ultimateReady) {
      showToast('DIMENSION BREAK ĐANG HỒI NĂNG LƯỢNG...', 'hourglass_empty');
      return;
    }
    soundManager.playCriticalHitImpact();
    soundManager.playBossGruntRoar();
    if (onScreenShakeTrigger) onScreenShakeTrigger();

    setHeroAttacking(true);
    setBossHit(true);
    spawnSlashVisual('#ddb7ff');

    const ultDmg = useUltimate();
    spawnFloatingDamage(`DIMENSION BREAK +${ultDmg.toLocaleString()}!`, true, '#ddb7ff');

    setTimeout(() => setHeroAttacking(false), 500);
    setTimeout(() => setBossHit(false), 350);
  };

  // Calculate percentages safely
  const bossHpPercent = Math.max(0, Math.min(100, (activeBoss.currentHp / activeBoss.maxHp) * 100));
  const playerHpPercent = Math.max(0, Math.min(100, (player.stats.hp / player.stats.maxHp) * 100));
  const playerManaPercent = Math.max(0, Math.min(100, (player.mana / player.maxMana) * 100));

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl bg-gradient-to-b from-[#0d0d17] via-[#141423] to-[#0a0a12] border border-[#3d494c]/50 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col justify-between select-none"
    >
      {/* Dynamic Animated 2D Background Canvas */}
      <canvas ref={arenaCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Floating Laser Slashes Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {slashes.map((s) => (
          <line
            key={s.id}
            x1={`${s.x1}%`}
            y1={`${s.y1}%`}
            x2={`${s.x2}%`}
            y2={`${s.y2}%`}
            stroke={s.color}
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ filter: `drop-shadow(0 0 10px ${s.color})` }}
          />
        ))}
      </svg>

      {/* Floating Combat Damage Numbers */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {floatingTexts.map((f) => (
          <div
            key={f.id}
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              color: f.color,
              textShadow: `0 0 14px ${f.color}`,
            }}
            className={`absolute font-headline font-bold -translate-x-1/2 -translate-y-1/2 animate-bounce transition-all ${
              f.isCrit ? 'text-[20px] sm:text-[24px]' : 'text-[15px] sm:text-[17px]'
            }`}
          >
            {f.text}
          </div>
        ))}
      </div>

      {/* 1. TOP SECTION: BOSS MULTI-PHASE STATUS & HEALTH GAUGE */}
      <div className="relative z-10 w-full p-2.5 sm:p-3 bg-gradient-to-b from-[#0d0d17]/95 to-transparent flex flex-col gap-1.5 border-b border-[#3d494c]/20">
        <div className="flex items-center justify-between gap-2">
          {/* Boss identity */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#93000a] to-[#3f0003] border border-[#ff5449]/50 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,84,73,0.3)]">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[22px]">skull</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-headline text-[14px] sm:text-[16px] font-bold text-white truncate">
                  {activeBoss.name}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#ff5449]/20 text-[#ffb4ab] font-hud text-[9px] font-bold border border-[#ff5449]/30">
                  Lv.{activeBoss.level}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#a855f7]/20 text-[#ddb7ff] font-hud text-[9px] font-bold uppercase">
                  {activeBoss.phase}
                </span>
              </div>
              <span className="font-hud text-[10px] text-[#bcc9cd] truncate">{activeBoss.subTitle}</span>
            </div>
          </div>

          {/* Elemental Weaknesses */}
          <div className="flex items-center gap-1 shrink-0">
            {activeBoss.weaknesses.map((w) => (
              <span
                key={w}
                className="px-2 py-0.5 rounded-lg bg-[#1b1b25] text-[#4cd7f6] font-hud text-[9px] uppercase font-bold border border-[#4cd7f6]/40 shadow"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="flex flex-col gap-1 mt-0.5">
          <div className="flex items-center justify-between text-[11px] font-hud font-bold">
            <span className="text-[#ff5449] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">favorite</span>
              HP TRÙM: {bossHpPercent.toFixed(1)}%
            </span>
            <span className="text-[#e4e1f0] font-mono">
              {activeBoss.currentHp.toLocaleString()} / {activeBoss.maxHp.toLocaleString()}
            </span>
          </div>

          <div className="relative w-full h-3.5 rounded-full bg-[#1b1b25] border border-[#ff5449]/40 overflow-hidden shadow-inner">
            <div
              style={{ width: `${bossHpPercent}%` }}
              className="h-full bg-gradient-to-r from-[#93000a] via-[#dc2626] to-[#ff5449] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(255,84,73,0.8)]"
            />
          </div>

          {/* Boss Break Bar */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-hud text-[9px] text-[#f59e0b] font-bold uppercase flex items-center gap-0.5 shrink-0">
              <span className="material-symbols-outlined text-[12px]">bolt</span>
              BREAK
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-[#1b1b25] overflow-hidden">
              <div
                style={{ width: `${activeBoss.breakGauge}%` }}
                className="h-full bg-gradient-to-r from-[#d97706] to-[#facc15] rounded-full transition-all shadow-[0_0_6px_#facc15]"
              />
            </div>
            <span className="font-hud text-[9px] text-[#facc15] font-bold shrink-0">{activeBoss.breakGauge}%</span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: 2D BATTLEFIELD ARENA (HERO VS BOSS) */}
      <div className="relative z-10 w-full flex-1 min-h-[170px] sm:min-h-[200px] px-3 sm:px-6 py-2 flex items-center justify-between overflow-hidden">
        {/* Boss Telegraph Warning Popup */}
        {bossTelegraph && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-[#93000a]/90 border border-[#ff5449] text-white font-hud text-[11px] font-bold shadow-[0_0_20px_rgba(255,84,73,0.8)] animate-bounce flex items-center gap-1.5 z-40">
            <span className="material-symbols-outlined text-[16px] animate-spin">warning</span>
            CẢNH BÁO: TRÙM SẮP PHÁT ĐỘNG CUỒNG NỘ!
          </div>
        )}

        {/* HERO SPRITE / AVATAR (LEFT) */}
        <div
          onClick={handleBasicSlash}
          className={`relative flex flex-col items-center gap-1 cursor-pointer transition-transform duration-150 ${
            heroAttacking ? 'translate-x-6 sm:translate-x-10 scale-105' : 'hover:scale-105'
          }`}
          title="Chạm vào Tướng để vung kiếm chém"
        >
          {/* Hero Cybernetic Avatar Stand */}
          <div
            style={{
              borderColor: activeHero.accentColor,
              boxShadow: `0 0 24px ${activeHero.accentColor}55`,
            }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#1b1b25]/90 border-2 p-1 overflow-hidden backdrop-blur-md"
          >
            <img
              src={HERO_AVATARS[activeHero.id] || HERO_AVATARS.aethel}
              alt={activeHero.name}
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Glowing active weapon slash indicator */}
            {heroAttacking && (
              <div
                style={{ backgroundColor: activeHero.accentColor }}
                className="absolute inset-0 opacity-40 mix-blend-screen animate-ping rounded-xl"
              />
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="font-headline text-[13px] sm:text-[14px] font-bold text-white flex items-center gap-1">
              {activeHero.name}
              <span
                style={{ color: activeHero.accentColor }}
                className="material-symbols-outlined text-[14px]"
              >
                verified
              </span>
            </span>
            <span className="font-hud text-[9px] text-[#bcc9cd] uppercase font-bold">
              {activeHero.classVi} • Lv.{player.level}
            </span>
          </div>
        </div>

        {/* CENTER CLASH STATUS & COMBO BADGE */}
        <div className="flex flex-col items-center gap-1 z-20">
          {comboHits > 0 && (
            <div className="flex flex-col items-center animate-pulse">
              <span className="font-headline text-[22px] sm:text-[28px] font-black text-[#ffb95f] tracking-wider drop-shadow-[0_0_12px_rgba(255,185,95,0.8)]">
                {comboHits}x
              </span>
              <span className="font-hud text-[9px] sm:text-[10px] text-[#acedff] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#00424f]/70 border border-[#4cd7f6]/40">
                COMBO HITS
              </span>
            </div>
          )}

          {/* Quick Attack Slash Action Button */}
          <button
            onClick={handleBasicSlash}
            className="mt-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00424f] to-[#005d6e] border border-[#4cd7f6]/60 text-[#4cd7f6] font-hud text-[11px] font-bold flex items-center gap-1 active:scale-95 shadow-[0_0_14px_rgba(76,215,246,0.4)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">swords</span>
            VUNG KIẾM [CLICK/TAP]
          </button>
        </div>

        {/* BOSS SPRITE / MONSTER (RIGHT) */}
        <div
          onClick={handleBasicSlash}
          className={`relative flex flex-col items-center gap-1 cursor-pointer transition-transform duration-150 ${
            bossHit ? 'translate-x-2 scale-95 brightness-150' : 'hover:scale-105'
          }`}
          title="Chạm vào Trùm để tấn công"
        >
          {/* Boss Demonic Aura Frame */}
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#2a0808] to-[#120002] border-2 border-[#ff5449] p-2 flex flex-col items-center justify-center shadow-[0_0_24px_rgba(255,84,73,0.5)] transition-all ${
              bossHit ? 'ring-4 ring-[#ff5449]' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[#ff5449] text-[42px] sm:text-[50px] animate-pulse">
              smart_toy
            </span>
            <div className="absolute -bottom-2 px-2 py-0.2 rounded-full bg-[#93000a] text-white font-hud text-[8px] font-bold border border-[#ff5449]/40">
              TARGET BOSS
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-headline text-[13px] sm:text-[14px] font-bold text-[#ffb4ab]">
              {activeBoss.name}
            </span>
            <span className="font-hud text-[9px] text-[#bcc9cd] font-bold">
              {activeBoss.element.toUpperCase()} • {activeBoss.model3DConfig.geometryType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: PLAYER VITALS (HP & MANA) + ELEMENTAL SKILL DECK */}
      <div className="relative z-10 w-full p-2.5 sm:p-3 bg-gradient-to-t from-[#0d0d17]/98 to-[#171723]/95 border-t border-[#3d494c]/40 flex flex-col gap-2">
        {/* PLAYER VITALS: HEALTH (HP) & MANA (MP) BARS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#1b1b25]/90 p-2 rounded-xl border border-[#3d494c]/30">
          {/* Player HP Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-hud font-bold">
              <span className="text-[#22c55e] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">health_and_safety</span>
                MÁU CHIẾN BINH (HP): {playerHpPercent.toFixed(0)}%
              </span>
              <span className="text-white font-mono">
                {player.stats.hp.toLocaleString()} / {player.stats.maxHp.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#141423] border border-[#22c55e]/40 overflow-hidden shadow-inner">
              <div
                style={{ width: `${playerHpPercent}%` }}
                className="h-full bg-gradient-to-r from-[#15803d] to-[#22c55e] rounded-full transition-all shadow-[0_0_8px_#22c55e]"
              />
            </div>
          </div>

          {/* Player Mana Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-hud font-bold">
              <span className="text-[#4cd7f6] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                NĂNG LƯỢNG MANA (MP): {playerManaPercent.toFixed(0)}%
              </span>
              <span className="text-white font-mono">
                {player.mana} / {player.maxMana} MP (+5 MP/s)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#141423] border border-[#4cd7f6]/40 overflow-hidden shadow-inner">
              <div
                style={{ width: `${playerManaPercent}%` }}
                className="h-full bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#4cd7f6] rounded-full transition-all shadow-[0_0_8px_#4cd7f6]"
              />
            </div>
          </div>
        </div>

        {/* 4 ELEMENTAL SKILLS CARDS (WITH EXPLICIT MANA COST & COOLDOWN) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {skills.map((skill, idx) => {
            const isOnCd = skill.cooldownRemaining > 0;
            const notEnoughMana = player.mana < skill.manaCost;
            const isDisabled = isOnCd || notEnoughMana;

            return (
              <button
                key={skill.id}
                onClick={() => handleCastSkill(skill.id)}
                disabled={isDisabled}
                style={{
                  borderColor: !isDisabled ? skill.accentColor : '#3d494c',
                }}
                className={`relative p-2 rounded-xl border flex flex-col items-center justify-between gap-1 transition-all active:scale-95 shadow cursor-pointer ${
                  isDisabled
                    ? 'bg-[#1b1b25] opacity-60 cursor-not-allowed'
                    : 'bg-[#292934] hover:bg-[#34343f] hover:scale-102'
                }`}
              >
                {/* Hotkey tag */}
                <span className="absolute top-1 left-1.5 px-1 py-0.2 rounded bg-black/60 text-[#bcc9cd] font-hud text-[8px] font-bold">
                  [{idx + 1}]
                </span>

                {/* Mana Cost Badge */}
                <span
                  style={{ color: notEnoughMana ? '#ff5449' : '#4cd7f6' }}
                  className="absolute top-1 right-1.5 px-1.5 py-0.2 rounded bg-black/70 font-hud text-[9px] font-bold flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[10px]">bolt</span>
                  {skill.manaCost} MP
                </span>

                {/* Cooldown Overlay */}
                {isOnCd && (
                  <div className="absolute inset-0 rounded-xl bg-black/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
                    <span className="font-hud text-[12px] text-[#ddb7ff] font-bold">
                      {skill.cooldownRemaining.toFixed(1)}s
                    </span>
                  </div>
                )}

                {/* Skill Icon */}
                <div
                  style={{ color: skill.accentColor }}
                  className="w-8 h-8 rounded-lg bg-[#1b1b25] flex items-center justify-center mt-3 shadow"
                >
                  <span className="material-symbols-outlined text-[20px]">{skill.iconSymbol}</span>
                </div>

                {/* Skill Title & Tag */}
                <div className="flex flex-col items-center w-full text-center">
                  <span className="font-headline text-[11px] font-bold text-white truncate w-full">
                    {skill.name}
                  </span>
                  <span
                    style={{ color: skill.accentColor }}
                    className="font-hud text-[8.5px] font-bold truncate w-full uppercase"
                  >
                    {skill.element} • x{skill.damageMultiplier}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* DOUBLE DASH & DIMENSION BREAK QUICK BAR */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            onClick={handleDoubleDash}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#292934] text-white font-hud text-[11px] font-bold border border-[#3d494c]/40 active:scale-95 shadow cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">air</span>
            <span>DOUBLE DASH [Space]</span>
            <span className="px-1.5 py-0.2 rounded bg-[#1b1b25] text-[#4cd7f6] font-bold text-[9px]">
              {dashCharges}/2
            </span>
          </button>

          <button
            onClick={handleDimensionBreak}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-hud text-[11px] font-bold border active:scale-95 transition-all shadow cursor-pointer ${
              ultimateReady
                ? 'bg-gradient-to-r from-[#06b6d4] via-[#4cd7f6] to-[#ddb7ff] text-[#003640] border-[#4cd7f6] shadow-[0_0_16px_rgba(76,215,246,0.6)]'
                : 'bg-[#292934] text-[#bcc9cd] border-[#3d494c]/40 opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] animate-spin">cyclone</span>
            <span>DIMENSION BREAK [R]</span>
            <span className="px-1.5 py-0.2 rounded bg-black/60 text-[#4cd7f6] font-bold text-[9px]">
              {ultimateReady ? 'SẴN SÀNG' : 'NẠP...'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
