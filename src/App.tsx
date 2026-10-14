import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { CombatScreen } from './components/combat/CombatScreen';
import { InventoryScreen } from './components/inventory/InventoryScreen';
import { SanctuaryScreen } from './components/sanctuary/SanctuaryScreen';
import { AltarScreen } from './components/altar/AltarScreen';
import { AstralScreen } from './components/astral/AstralScreen';

const MainContent: React.FC = () => {
  const { currentTab, toast } = useGame();
  const [deviceLayoutMode, setDeviceLayoutMode] = useState<'responsive' | 'mobile'>('responsive');

  return (
    <div className="relative min-h-screen bg-[#0d0d17] text-[#e4e1f0] flex flex-col items-center overflow-x-hidden selection:bg-[#4cd7f6] selection:text-[#003640]">
      {/* Background Cyber Grid & Nebula Atmosphere */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(111,0,190,0.18),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_80%_90%,rgba(76,215,246,0.12),rgba(255,255,255,0))]" />

      {/* Device Viewport Mode Switcher Pill (Floating Top-Right for Testing & Preference) */}
      <div className="fixed bottom-20 right-3 z-40 hidden sm:flex items-center gap-1 p-1 rounded-xl bg-[#1b1b25]/90 backdrop-blur-md border border-[#3d494c]/50 shadow-2xl">
        <button
          onClick={() => setDeviceLayoutMode('responsive')}
          title="Giao diện màn hình rộng đa cột cho Tablet & PC"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-hud text-[9px] font-bold transition-all cursor-pointer ${
            deviceLayoutMode === 'responsive'
              ? 'bg-[#4cd7f6] text-[#003640] shadow'
              : 'text-[#bcc9cd] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">desktop_windows</span>
          <span>PC/Tablet (Rộng)</span>
        </button>
        <button
          onClick={() => setDeviceLayoutMode('mobile')}
          title="Mô phỏng kích thước điện thoại di động"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-hud text-[9px] font-bold transition-all cursor-pointer ${
            deviceLayoutMode === 'mobile'
              ? 'bg-[#4cd7f6] text-[#003640] shadow'
              : 'text-[#bcc9cd] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">smartphone</span>
          <span>Mobile (Gọn)</span>
        </button>
      </div>

      {/* Main Container: Adapts between Responsive Wide (max-w-6xl) and Mobile Simulator (max-w-lg) */}
      <div
        className={`w-full min-h-screen flex flex-col bg-[#12121d] relative transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-x border-[#3d494c]/20 ${
          deviceLayoutMode === 'mobile' ? 'max-w-md mx-auto ring-1 ring-[#3d494c]/40' : 'max-w-6xl mx-auto'
        }`}
      >
        <Header />

        <main className="flex-1 w-full pt-20 pb-16 overflow-y-auto">
          {currentTab === 'combat' && <CombatScreen />}
          {currentTab === 'inventory' && <InventoryScreen />}
          {currentTab === 'sanctuary' && <SanctuaryScreen />}
          {currentTab === 'altar' && <AltarScreen />}
          {currentTab === 'astral' && <AstralScreen />}
        </main>

        <Navbar />

        {/* Global Toast Notification */}
        {toast && toast.show && (
          <div className="fixed top-24 inset-x-0 z-50 flex items-center justify-center pointer-events-none px-4">
            <div className="px-4 py-2 rounded-xl bg-[#1b1b25]/95 backdrop-blur-md shadow-2xl flex items-center gap-2 border border-[#4cd7f6]/60 transition-all animate-bounce">
              <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">{toast.icon}</span>
              <span className="font-hud text-[11px] font-bold text-[#e4e1f0] uppercase tracking-wide">
                {toast.msg}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}
