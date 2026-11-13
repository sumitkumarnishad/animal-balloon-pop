import React from 'react';
import { GameMode } from '../game/types';

interface TitleOverlayProps {
  mode: GameMode;
  bestScore: number;
  onSelectMode: (mode: GameMode) => void;
  onStart: () => void;
}

export const TitleOverlay: React.FC<TitleOverlayProps> = ({
  mode,
  bestScore,
  onSelectMode,
  onStart,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-between px-6 py-7 pointer-events-none">
      {/* Top calm sky lockup */}
      <div className="w-full flex flex-col items-center pt-2 pointer-events-auto">
        <svg
          viewBox="0 0 360 190"
          className="w-full max-w-[350px] drop-shadow-[0_6px_14px_rgba(47,42,68,0.14)]"
          role="img"
          aria-label="Animal Balloon Pop"
        >
          {/* Cute illustrated bunny balloon crest */}
          <g transform="translate(180, 44)">
            {/* Left ear */}
            <ellipse
              cx="-13"
              cy="-24"
              rx="7.5"
              ry="18"
              transform="rotate(-10 -13 -24)"
              fill="#FF8FA3"
              stroke="#332C47"
              strokeWidth="2.5"
            />
            <ellipse
              cx="-13"
              cy="-23"
              rx="3.8"
              ry="11"
              transform="rotate(-10 -13 -23)"
              fill="#FFD6DF"
            />
            {/* Right ear */}
            <ellipse
              cx="13"
              cy="-24"
              rx="7.5"
              ry="18"
              transform="rotate(10 13 -24)"
              fill="#FF8FA3"
              stroke="#332C47"
              strokeWidth="2.5"
            />
            <ellipse
              cx="13"
              cy="-23"
              rx="3.8"
              ry="11"
              transform="rotate(10 13 -23)"
              fill="#FFD6DF"
            />
            {/* Balloon head */}
            <ellipse
              cx="0"
              cy="4"
              rx="25"
              ry="27"
              fill="#FF8FA3"
              stroke="#332C47"
              strokeWidth="2.5"
            />
            <ellipse
              cx="-10"
              cy="-8"
              rx="5"
              ry="8"
              transform="rotate(24 -10 -8)"
              fill="rgba(255,255,255,0.45)"
            />
            {/* Eyes & smile */}
            <circle cx="-8" cy="2" r="2.8" fill="#332C47" />
            <circle cx="8" cy="2" r="2.8" fill="#332C47" />
            <ellipse cx="0" cy="7" rx="3" ry="2" fill="#FF5D7D" />
            <path
              d="M -5 10 Q -2.5 14 0 10 Q 2.5 14 5 10"
              fill="none"
              stroke="#332C47"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Decorative side stars */}
            <path
              d="M -48 -4 L -45 2 L -38 3 L -43 8 L -42 15 L -48 11 L -54 15 L -53 8 L -58 3 L -51 2 Z"
              fill="#FFD166"
              stroke="#332C47"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M 48 -6 L 51 0 L 58 1 L 53 6 L 54 13 L 48 9 L 42 13 L 43 6 L 38 1 L 45 0 Z"
              fill="#7AE5B8"
              stroke="#332C47"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>

          {/* Storybook Title Text */}
          <text
            x="180"
            y="124"
            textAnchor="middle"
            fill="#FFFFFF"
            stroke="#332C47"
            strokeWidth="8"
            strokeLinejoin="round"
            style={{
              fontFamily: "'Fredoka', ui-rounded, sans-serif",
              fontSize: '40px',
              fontWeight: 700,
              paintOrder: 'stroke fill',
            }}
          >
            Animal
          </text>
          <text
            x="180"
            y="170"
            textAnchor="middle"
            fill="#FFE066"
            stroke="#332C47"
            strokeWidth="8.5"
            strokeLinejoin="round"
            style={{
              fontFamily: "'Fredoka', ui-rounded, sans-serif",
              fontSize: '42px',
              fontWeight: 700,
              paintOrder: 'stroke fill',
            }}
          >
            Balloon Pop
          </text>
        </svg>

        {bestScore > 0 && (
          <p className="mt-1 text-sm font-bold text-[#332C47]/80 tabular-nums">
            Best Score: {bestScore}
          </p>
        )}
      </div>

      {/* Bottom play controls over calm meadow negative space */}
      <div className="w-full max-w-[300px] flex flex-col items-center gap-3.5 pb-2 pointer-events-auto">
        {/* Clean functional mode selector */}
        <div
          className="grid grid-cols-2 w-full p-1 rounded-2xl bg-[#FFFDF7]/90 border-2 border-[#332C47]/15 shadow-sm"
          role="group"
          aria-label="Game Mode"
        >
          <button
            type="button"
            onClick={() => onSelectMode('free')}
            className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-transform duration-150 cursor-pointer whitespace-nowrap ${
              mode === 'free'
                ? 'bg-[#7EC8FF] text-[#221D35] shadow-sm scale-[1.01]'
                : 'text-[#5A5273] hover:text-[#221D35]'
            }`}
          >
            Free Play
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('party')}
            className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-transform duration-150 cursor-pointer whitespace-nowrap ${
              mode === 'party'
                ? 'bg-[#FFD166] text-[#221D35] shadow-sm scale-[1.01]'
                : 'text-[#5A5273] hover:text-[#221D35]'
            }`}
          >
            Star Party
          </button>
        </div>

        {/* Primary Play CTA */}
        <button
          type="button"
          data-start="true"
          onClick={onStart}
          className="w-full min-h-[58px] py-3.5 px-8 rounded-2xl bg-[#FF758F] hover:bg-[#FF5D7D] active:scale-[0.97] text-white font-display text-2xl font-bold tracking-wide border-[3px] border-[#332C47] shadow-[0_5px_0_#332C47] transition-transform duration-150 cursor-pointer focus-visible:outline-4 focus-visible:outline-[#FFD166]"
        >
          Play!
        </button>

        {/* Single flat control-hint line */}
        <p className="text-xs font-extrabold text-[#221D35] tracking-wide text-center whitespace-nowrap drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
          Tap Balloons to Pop · M Mute · P Pause
        </p>
      </div>
    </div>
  );
};
