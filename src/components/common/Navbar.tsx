import React from 'react';
import { useGame } from '../../context/GameContext';
import { TabType } from '../../types/game';

export const Navbar: React.FC = () => {
  const { currentTab, setCurrentTab } = useGame();

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'sanctuary', label: 'Thánh Địa', icon: 'fort' },
    { id: 'combat', label: 'Đấu Trường', icon: 'swords' },
    { id: 'altar', label: 'Tế Đàn Rune', icon: 'auto_fix_high' },
    { id: 'inventory', label: 'Kho Đồ & Tướng', icon: 'backpack' },
    { id: 'astral', label: 'AFK Tinh Vân', icon: 'hourglass_empty' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0d0d17]/95 backdrop-blur-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.8)] border-t border-[#3d494c]/30">
      <div className="flex justify-around items-center h-16 px-2 max-w-4xl mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center w-20 h-13 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#4cd7f6] bg-[#4cd7f6]/10 shadow-[0_0_14px_rgba(76,215,246,0.25)] border border-[#4cd7f6]/40 scale-105'
                  : 'text-[#bcc9cd] hover:text-[#e4e1f0] hover:bg-[#1b1b25]/60'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="font-hud text-[9px] mt-0.5 tracking-tight font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
