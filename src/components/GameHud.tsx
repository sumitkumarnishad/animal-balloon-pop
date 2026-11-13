import React from 'react';
import { PARTY_TARGET_POPS } from '../game/constants';
import { GameMode } from '../game/types';

interface GameHudProps {
  score: number;
  stars: number;
  poppedCount: number;
  mode: GameMode;
  muted: boolean;
  milestoneBanner: string | null;
  onToggleMute: () => void;
  onPause: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  score,
  stars,
  poppedCount,
  mode,
  muted,
  milestoneBanner,
  onToggleMute,
  onPause,
}) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-3.5">
      {/* Top Perimeter HUD Clusters */}
      <div className="flex items-start justify-between gap-2">
        {/* Top-left Score & Stars cluster */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#FFFDF7]/92 border-2 border-[#332C47]/20 shadow-[0_3px_0_rgba(51,44,71,0.14)]">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
              <ellipse
                cx="12"
                cy="10"
                rx="7.5"
                ry="8.5"
                fill="#FF8FA3"
                stroke="#332C47"
                strokeWidth="2"
              />
              <ellipse
                cx="9.5"
                cy="6.5"
                rx="1.8"
                ry="2.8"
                transform="rotate(20 9.5 6.5)"
                fill="#FFFFFF"
                opacity="0.7"
              />
              <path
                d="M12 18.5 Q13.5 21 11 23"
                fill="none"
                stroke="#332C47"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6A6088]">
                {mode === 'party' ? 'Pops' : 'Score'}
              </span>
              <span
                data-testid="hud-score"
                className="font-display text-2xl font-bold text-[#332C47] tabular-nums"
              >
                {mode === 'party'
                  ? `${Math.min(poppedCount, PARTY_TARGET_POPS)}/${PARTY_TARGET_POPS}`
                  : Math.round(score)}
              </span>
            </div>
          </div>

          <div className="w-px h-7 bg-[#332C47]/15" aria-hidden="true" />

          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
              <path
                d="M12 2.5 L14.9 8.4 L21.4 9.3 L16.7 13.9 L17.8 20.4 L12 17.3 L6.2 20.4 L7.3 13.9 L2.6 9.3 L9.1 8.4 Z"
                fill="#FFD166"
                stroke="#332C47"
                strokeWidth="1.9"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6A6088]">
                Stars
              </span>
              <span
                data-testid="hud-stars"
                className="font-display text-xl font-bold text-[#332C47] tabular-nums"
              >
                {Math.round(stars)}
              </span>
            </div>
          </div>
        </div>

        {/* Top-right Utility Icon Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            tabIndex={-1}
            aria-label={muted ? 'Unmute sound (M)' : 'Mute sound (M)'}
            aria-pressed={muted}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            className="w-11 h-11 rounded-xl bg-[#FFFDF7]/92 hover:bg-white active:scale-95 border-2 border-[#332C47]/20 shadow-[0_3px_0_rgba(51,44,71,0.14)] flex items-center justify-center text-[#332C47] transition-transform duration-150 cursor-pointer"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path
                  d="M11 5 L6 9 H3 V15 H6 L11 19 Z"
                  fill="#FFB3C6"
                  stroke="#332C47"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 9 L21 15 M21 9 L16 15"
                  stroke="#332C47"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path
                  d="M11 5 L6 9 H3 V15 H6 L11 19 Z"
                  fill="#7AE5B8"
                  stroke="#332C47"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 8.5 A5 5 0 0 1 15.5 15.5 M18.5 6 A8.5 8.5 0 0 1 18.5 18"
                  fill="none"
                  stroke="#332C47"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <button
            type="button"
            tabIndex={-1}
            aria-label="Pause game (P)"
            onClick={(e) => {
              e.currentTarget.blur();
              onPause();
            }}
            className="w-11 h-11 rounded-xl bg-[#FFFDF7]/92 hover:bg-white active:scale-95 border-2 border-[#332C47]/20 shadow-[0_3px_0_rgba(51,44,71,0.14)] flex items-center justify-center text-[#332C47] transition-transform duration-150 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <rect
                x="6"
                y="5"
                width="4.5"
                height="14"
                rx="1.5"
                fill="#7EC8FF"
                stroke="#332C47"
                strokeWidth="2"
              />
              <rect
                x="13.5"
                y="5"
                width="4.5"
                height="14"
                rx="1.5"
                fill="#7EC8FF"
                stroke="#332C47"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Gentle non-blocking milestone cheer banner near top-center */}
      {milestoneBanner && (
        <div className="self-center mb-auto mt-3 px-4 py-1.5 rounded-2xl bg-[#FFE066] border-2 border-[#332C47] shadow-[0_3px_0_#332C47]">
          <span className="font-display text-lg font-bold text-[#332C47]">
            {milestoneBanner}
          </span>
        </div>
      )}
    </div>
  );
};
