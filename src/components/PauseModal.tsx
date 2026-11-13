import React from 'react';

interface PauseModalProps {
  score: number;
  stars: number;
  onResume: () => void;
  onRestart: () => void;
  onBackToTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  stars,
  onResume,
  onRestart,
  onBackToTitle,
}) => {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#2F2A44]/35"
      role="dialog"
      aria-modal="true"
      aria-label="Game Paused"
    >
      <div className="w-full max-w-[300px] rounded-3xl bg-[#FFFDF7] border-[3px] border-[#332C47] shadow-[0_8px_0_#332C47] p-6 flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-3xl font-bold text-[#332C47]">
          Paused
        </h2>

        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="rounded-2xl bg-[#E8F6FF] border-2 border-[#332C47]/15 py-2.5 px-3">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#5A5273]">
              Score
            </div>
            <div className="font-display text-2xl font-bold text-[#332C47] tabular-nums">
              {Math.round(score)}
            </div>
          </div>
          <div className="rounded-2xl bg-[#FFF5D6] border-2 border-[#332C47]/15 py-2.5 px-3">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#5A5273]">
              Stars
            </div>
            <div className="font-display text-2xl font-bold text-[#332C47] tabular-nums">
              {Math.round(stars)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full pt-1">
          <button
            type="button"
            onClick={onResume}
            className="w-full min-h-[50px] py-3 px-6 rounded-2xl bg-[#7AE5B8] hover:bg-[#5FD9A6] active:scale-[0.98] text-[#221D35] font-display text-xl font-bold border-2 border-[#332C47] shadow-[0_4px_0_#332C47] transition-transform duration-150 cursor-pointer"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full min-h-[46px] py-2.5 px-6 rounded-2xl bg-[#FFD166] hover:bg-[#FFC442] active:scale-[0.98] text-[#221D35] font-display text-lg font-bold border-2 border-[#332C47] shadow-[0_3px_0_#332C47] transition-transform duration-150 cursor-pointer"
          >
            Restart
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
