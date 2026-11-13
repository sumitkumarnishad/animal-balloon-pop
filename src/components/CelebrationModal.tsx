import React from 'react';
import { getFavoriteAnimal } from '../game/rules';
import { GameStats } from '../game/types';

interface CelebrationModalProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onBackToTitle: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  stats,
  onPlayAgain,
  onBackToTitle,
}) => {
  const favoriteAnimal = getFavoriteAnimal(stats);

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#2F2A44]/35"
      role="dialog"
      aria-modal="true"
      aria-label="Party Complete"
    >
      <div className="w-full max-w-[320px] rounded-3xl bg-[#FFFDF7] border-[3px] border-[#332C47] shadow-[0_8px_0_#332C47] p-6 flex flex-col items-center gap-4 text-center">
        <svg viewBox="0 0 80 64" className="w-20 h-16" aria-hidden="true">
          <path
            d="M40 4 L48 22 L68 24 L53 38 L57 58 L40 48 L23 58 L27 38 L12 24 L32 22 Z"
            fill="#FFE066"
            stroke="#332C47"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="34" cy="30" r="2.6" fill="#332C47" />
          <circle cx="46" cy="30" r="2.6" fill="#332C47" />
          <path
            d="M35 37 Q40 42 45 37"
            fill="none"
            stroke="#332C47"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        <div>
          <h2 className="font-display text-3xl font-bold text-[#332C47]">
            Great Popping!
          </h2>
          <p className="text-sm font-bold text-[#6A6088] mt-1">
            Favorite Friend: {favoriteAnimal}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="rounded-2xl bg-[#FFE8EE] border-2 border-[#332C47]/15 py-2.5 px-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6A6088]">
              Score
            </div>
            <div className="font-display text-xl font-bold text-[#332C47] tabular-nums">
              {Math.round(stats.score)}
            </div>
          </div>
          <div className="rounded-2xl bg-[#FFF5D6] border-2 border-[#332C47]/15 py-2.5 px-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6A6088]">
              Stars
            </div>
            <div className="font-display text-xl font-bold text-[#332C47] tabular-nums">
              {Math.round(stats.stars)}
            </div>
          </div>
          <div className="rounded-2xl bg-[#E8F6FF] border-2 border-[#332C47]/15 py-2.5 px-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6A6088]">
              Best
            </div>
            <div className="font-display text-xl font-bold text-[#332C47] tabular-nums">
              {Math.round(stats.bestScore)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full pt-1">
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="w-full min-h-[54px] py-3 px-6 rounded-2xl bg-[#FF758F] hover:bg-[#FF5D7D] active:scale-[0.98] text-white font-display text-xl font-bold border-2 border-[#332C47] shadow-[0_4px_0_#332C47] transition-transform duration-150 cursor-pointer"
          >
            Play Again!
          </button>
          <button
            type="button"
            onClick={onBackToTitle}
            className="w-full min-h-[44px] py-2 px-6 rounded-2xl bg-[#F3F0FA] hover:bg-[#E7E1F5] active:scale-[0.98] text-[#332C47] font-bold text-base border-2 border-[#332C47]/25 transition-transform duration-150 cursor-pointer"
          >
            Title Screen
          </button>
        </div>
      </div>
    </div>
  );
};
