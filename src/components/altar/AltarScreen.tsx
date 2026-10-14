import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MutatorRune } from '../../types/game';

export const AltarScreen: React.FC = () => {
  const {
    activeSockets,
    availableRunes,
    swapSocket,
    setCurrentTab,
    showToast,
  } = useGame();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState<'all' | 'element' | 'form'>('all');
  const [selectedSlot, setSelectedSlot] = useState<'A' | 'B' | 'C'>('A');

  // Animated 60 FPS Ley-Hologram Vector Simulator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const renderHologram = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.min(cx, cy) - 20;

      // Hologram background grid
      ctx.strokeStyle = 'rgba(76, 215, 246, 0.08)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Concentric range circles
      [0.35, 0.65, 0.95].forEach((pct, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * pct, 0, Math.PI * 2);
        ctx.strokeStyle = i === 2 ? 'rgba(76, 215, 246, 0.25)' : 'rgba(221, 183, 255, 0.15)';
        ctx.setLineDash(i === 1 ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Rotating Singularity Vortex Oval
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Outer glow ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, maxR * 0.7, maxR * 0.35, 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#a855f7';
      ctx.stroke();

      // Inner cyan arc
      ctx.beginPath();
      ctx.ellipse(0, 0, maxR * 0.45, maxR * 0.2, -0.3, 0, Math.PI * 1.5);
      ctx.strokeStyle = '#4cd7f6';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#4cd7f6';
      ctx.stroke();

      // Singularity core pulse
      ctx.beginPath();
      ctx.arc(0, 0, 9 + Math.sin(angle * 4) * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#06b6d4';
      ctx.fill();

      ctx.restore();

      angle += 0.035;
      animId = requestAnimationFrame(renderHologram);
    };

    renderHologram();
    return () => cancelAnimationFrame(animId);
  }, []);

  const filteredRunes = availableRunes.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'element') return r.category === 'element';
    if (filter === 'form') return r.category === 'geometry' || r.category === 'augment';
    return true;
  });

  const handleRuneClick = (rune: MutatorRune) => {
    swapSocket(selectedSlot, rune);
  };

  const handleAutoSynergy = () => {
    showToast('TỰ ĐỘNG ĐỒNG BỘ: KÍCH HOẠT SYNERGY VOID COLLAPSE!', 'auto_awesome');
  };

  const handleSynthesize = () => {
    showToast('TỔNG HỢP ẤN KÝ THÀNH CÔNG: KHUẾCH ĐẠI +135% POWER!', 'merge_type');
  };

  return (
    <div className="flex flex-col w-full px-3 py-3 gap-3 pb-24 select-none">
      {/* Skill Altar Header */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00424f] flex items-center justify-center text-[#4cd7f6] ring-1 ring-[#4cd7f6]/40 relative">
            <span className="material-symbols-outlined text-[28px]">cyclone</span>
            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[8px] font-bold">
              TIER IV
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline text-[16px] font-bold text-[#e4e1f0]">Oblivion Slash</span>
              <span className="px-1.5 py-0.2 rounded bg-[#ffb95f]/20 text-[#ffb95f] font-hud text-[9px] font-bold">
                ACTIVE
              </span>
            </div>
            <span className="font-hud text-[10px] text-[#bcc9cd]">Blade of Dimensions • Slash / Singularity</span>
            <div className="flex items-center gap-3 font-hud text-[10px] text-[#4cd7f6] mt-0.5">
              <span>💥 450% DMG</span>
              <span>⏱ 6.0s CD</span>
              <span>🎯 3.5m Rad</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => showToast('CHUYỂN ĐỔI KỸ NĂNG: ĐÃ ĐỔI SANG DIMENSION BREAK', 'swap_horiz')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#292934] text-[#4cd7f6] font-hud text-[10px] font-bold border border-[#4cd7f6]/30 active:scale-95 transition-all shadow"
        >
          <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
          <span>Swap</span>
        </button>
      </div>

      {/* Ley-Hologram Chamber Interactive Canvas */}
      <div className="relative w-full rounded-2xl bg-[#0d0d17] border border-[#3d494c]/40 p-3 shadow-2xl flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#4cd7f6] font-hud text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
            <span>LEY-HOLOGRAM CHAMBER</span>
          </div>
          <span className="font-hud text-[9px] text-[#22c55e] font-bold flex items-center gap-1 bg-[#22c55e]/10 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" /> Simulation Live
          </span>
        </div>

        <div className="relative w-full h-44 rounded-xl bg-[#12121d] overflow-hidden flex items-center justify-center border border-[#3d494c]/30">
          <canvas ref={canvasRef} width={340} height={176} className="w-full h-full block" />

          {/* 60 FPS Badge */}
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#292934]/80 backdrop-blur-md text-[#4cd7f6] font-hud text-[9px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">graphic_eq</span>
            <span>60 FPS SIM</span>
          </div>

          {/* Hologram Vector Badge */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#1b1b25]/80 backdrop-blur-md text-[#ddb7ff] font-hud text-[9px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">all_inclusive</span>
            <span>Vector: Vortex Radial Sweep (360°)</span>
          </div>
        </div>

        <div className="flex items-center justify-between font-hud text-[10px]">
          <span className="text-[#4cd7f6] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">stream</span>
            <span>Void Graviton Pulse Active</span>
          </span>
          <span className="text-[#ffb95f] font-bold">Calculated Range: 5.25m</span>
        </div>
      </div>

      {/* Socket Customization Matrix (3/3 Linked) */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ddb7ff] text-[18px]">hub</span>
            <span className="font-headline text-[15px] font-bold text-[#e4e1f0]">
              Socket Customization Matrix
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#00424f] text-[#4cd7f6] font-hud text-[10px] font-bold">
            3/3 Linked
          </span>
        </div>

        {/* 3 Socket Columns */}
        <div className="grid grid-cols-3 gap-2">
          {(['A', 'B', 'C'] as const).map((slotId) => {
            const socket = activeSockets[slotId];
            const isSelected = selectedSlot === slotId;
            return (
              <button
                key={slotId}
                onClick={() => setSelectedSlot(slotId)}
                className={`flex flex-col items-center justify-between p-2.5 rounded-xl bg-[#292934] active:scale-95 transition-all shadow border ${
                  isSelected
                    ? 'border-[#4cd7f6] ring-1 ring-[#4cd7f6]'
                    : 'border-[#3d494c]/30 hover:border-[#ddb7ff]/40'
                }`}
              >
                <span className="px-1.5 py-0.2 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[8px] font-bold">
                  {socket.label}
                </span>

                <div
                  style={{ color: socket.color }}
                  className="w-10 h-10 rounded-xl bg-[#34343f] flex items-center justify-center my-1.5"
                >
                  <span className="material-symbols-outlined text-[24px]">{socket.iconSymbol}</span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <span className="font-hud text-[11px] font-bold text-[#e4e1f0] truncate w-full">
                    {socket.title}
                  </span>
                  <span className="font-hud text-[8px] text-[#bcc9cd]">{socket.category}</span>
                  <span style={{ color: socket.color }} className="font-hud text-[9px] font-bold mt-0.5">
                    {socket.bonus}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Socket Detail Info */}
        <div className="p-2.5 rounded-xl bg-[#292934]/60 border border-[#3d494c]/20 flex items-start gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] shrink-0 mt-0.5">info</span>
          <div className="flex flex-col">
            <span className="font-hud text-[10px] text-[#4cd7f6] font-bold uppercase">
              {activeSockets[selectedSlot].title}: Graviton Singularity
            </span>
            <span className="font-body-sm text-[11px] text-[#bcc9cd] mt-0.5">
              Hút toàn bộ mục tiêu trong phạm vi 5.25m vào tâm vụ nổ, gây choáng 1.5 giây và kích hoạt hiệu ứng suy nhược nguyên tố.
            </span>
          </div>
        </div>
      </div>

      {/* Combat Formula Synthesis (GDD CALIBRATED) */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">calculate</span>
            <span className="font-headline text-[15px] font-bold text-[#e4e1f0]">
              Combat Formula Synthesis
            </span>
          </div>
          <span className="font-hud text-[9px] text-[#ffb95f] font-bold tracking-wider uppercase">
            GDD CALIBRATED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col p-2.5 rounded-xl bg-[#292934] border border-[#3d494c]/20">
            <div className="flex items-center justify-between font-hud text-[10px]">
              <span className="text-[#bcc9cd]">Final Skill Power</span>
              <span className="text-[#ffb95f] font-bold">+135%</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline text-[20px] font-bold text-[#4cd7f6]">2,840</span>
              <span className="font-hud text-[11px] text-[#bcc9cd]">DMG</span>
            </div>
            <div className="w-full h-1 rounded-full bg-[#34343f] mt-1.5 overflow-hidden">
              <div className="w-4/5 h-full bg-[#4cd7f6]" />
            </div>
          </div>

          <div className="flex flex-col p-2.5 rounded-xl bg-[#292934] border border-[#3d494c]/20">
            <div className="flex items-center justify-between font-hud text-[10px]">
              <span className="text-[#bcc9cd]">Precision Multiplier</span>
              <span className="text-[#ffb95f] font-bold">Max 1.5x</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline text-[20px] font-bold text-[#ddb7ff]">0.85x – 1.5x</span>
            </div>
            <div className="w-full h-1 rounded-full bg-[#34343f] mt-1.5 overflow-hidden">
              <div className="w-3/5 h-full bg-[#ddb7ff]" />
            </div>
          </div>

          <div className="flex flex-col p-2.5 rounded-xl bg-[#292934] border border-[#3d494c]/20">
            <div className="flex items-center justify-between font-hud text-[10px]">
              <span className="text-[#bcc9cd]">Detonation Radius</span>
              <span className="text-[#4cd7f6] font-bold">+1.75m</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline text-[18px] font-bold text-[#e4e1f0]">5.25</span>
              <span className="font-hud text-[10px] text-[#bcc9cd]">Meters (360°)</span>
            </div>
          </div>

          <div className="flex flex-col p-2.5 rounded-xl bg-[#292934] border border-[#3d494c]/20">
            <div className="flex items-center justify-between font-hud text-[10px]">
              <span className="text-[#bcc9cd]">Resource Profile</span>
              <span className="text-[#f43f5e] font-bold">Reset 50%</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline text-[16px] font-bold text-[#4cd7f6]">💧 42</span>
              <span className="font-hud text-[12px] text-[#ffb95f]">/ ⏱ 6.0s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mutator Rune Stash */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#1b1b25] border border-[#3d494c]/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">inventory_2</span>
            <span className="font-headline text-[15px] font-bold text-[#e4e1f0]">Mutator Rune Stash</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded-lg font-hud text-[9px] font-bold transition-all ${
                filter === 'all' ? 'bg-[#4cd7f6] text-[#003640]' : 'bg-[#292934] text-[#bcc9cd]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('element')}
              className={`px-2 py-0.5 rounded-lg font-hud text-[9px] font-bold transition-all ${
                filter === 'element' ? 'bg-[#4cd7f6] text-[#003640]' : 'bg-[#292934] text-[#bcc9cd]'
              }`}
            >
              Element
            </button>
            <button
              onClick={() => setFilter('form')}
              className={`px-2 py-0.5 rounded-lg font-hud text-[9px] font-bold transition-all ${
                filter === 'form' ? 'bg-[#4cd7f6] text-[#003640]' : 'bg-[#292934] text-[#bcc9cd]'
              }`}
            >
              Form
            </button>
          </div>
        </div>

        {/* Runes Grid */}
        <div className="grid grid-cols-4 gap-2">
          {filteredRunes.map((rune) => (
            <button
              key={rune.id}
              onClick={() => handleRuneClick(rune)}
              className="relative flex flex-col items-center justify-between p-2 rounded-xl bg-[#292934] border border-[#3d494c]/30 active:scale-95 transition-all shadow hover:border-[#4cd7f6]"
            >
              <span
                style={{
                  backgroundColor:
                    rune.rarity === 'Legendary' ? '#b45309' : rune.rarity === 'Epic' ? '#6f00be' : '#00424f',
                }}
                className="absolute top-1 right-1 px-1 py-0.2 rounded font-hud text-[7px] text-[#e4e1f0] font-bold uppercase"
              >
                {rune.rarity.substring(0, 4)}
              </span>

              <div
                style={{ color: rune.color }}
                className="w-9 h-9 rounded-lg bg-[#34343f] flex items-center justify-center my-1"
              >
                <span className="material-symbols-outlined text-[20px]">{rune.iconSymbol}</span>
              </div>

              <span className="font-hud text-[9px] font-bold text-[#e4e1f0] truncate w-full text-center">
                {rune.name}
              </span>
            </button>
          ))}

          {/* Forge + Button */}
          <button
            onClick={() => showToast('MỞ PHÒNG ĐÚC ẤN KÝ MỚI!', 'add_circle')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#292934] border border-dashed border-[#3d494c] active:scale-95 transition-all text-[#bcc9cd] hover:text-[#4cd7f6]"
          >
            <span className="material-symbols-outlined text-[22px]">add</span>
            <span className="font-hud text-[9px] font-bold mt-1">Forge +</span>
          </button>
        </div>

        {/* 3 Bottom Synthesis Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={handleAutoSynergy}
            className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#292934] text-[#ffb95f] font-hud text-[11px] font-bold border border-[#ffb95f]/30 active:scale-95 transition-all shadow"
          >
            <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
            <span>Auto Synergy</span>
          </button>

          <button
            onClick={handleSynthesize}
            className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#292934] text-[#ddb7ff] font-hud text-[11px] font-bold border border-[#ddb7ff]/30 active:scale-95 transition-all shadow"
          >
            <span className="material-symbols-outlined text-[16px]">all_inclusive</span>
            <span>Synthesize</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('combat');
              showToast('TIẾN VÀO TEST ARENA THỬ NGHIỆM SÁT THƯƠNG!', 'sports_esports');
            }}
            className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-hud text-[11px] font-bold active:scale-95 transition-all shadow-[0_0_14px_rgba(76,215,246,0.5)]"
          >
            <span className="material-symbols-outlined text-[16px]">sports_kabaddi</span>
            <span>Test Arena</span>
          </button>
        </div>
      </div>
    </div>
  );
};
