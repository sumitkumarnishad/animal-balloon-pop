import { useCallback, useEffect, useRef, useState } from 'react';
import { BalloonGameCanvas } from './components/BalloonGameCanvas';
import { CelebrationModal } from './components/CelebrationModal';
import { GameHud } from './components/GameHud';
import { PauseModal } from './components/PauseModal';
import { TitleOverlay } from './components/TitleOverlay';
import { audioEngine } from './game/audio';
import { createInitialStats } from './game/rules';
import { GameMode, GameState, GameStats } from './game/types';

const BEST_SCORE_STORAGE_KEY = 'animal-balloon-pop-best';

function readStoredBestScore(): number {
  try {
    const raw = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    const parsed = raw ? Number(raw) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  } catch {
    return 0;
  }
}

export default function App() {
  const initialAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [bestScore, setBestScore] = useState<number>(() => readStoredBestScore());
  const [mode, setMode] = useState<GameMode>('free');
  const [gameState, setGameState] = useState<GameState>(
    initialAutostart ? 'playing' : 'title'
  );
  const [stats, setStats] = useState<GameStats>(() =>
    createInitialStats(readStoredBestScore())
  );
  const [muted, setMuted] = useState(false);
  const [runToken, setRunToken] = useState(1);
  const [milestoneBanner, setMilestoneBanner] = useState<string | null>(null);
  const milestoneTimerRef = useRef<number | null>(null);

  // Sync game state to body dataset for observability and testing
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  const clearMilestoneBanner = useCallback(() => {
    if (milestoneTimerRef.current !== null) {
      window.clearTimeout(milestoneTimerRef.current);
      milestoneTimerRef.current = null;
    }
    setMilestoneBanner(null);
  }, []);

  const startGame = useCallback(() => {
    audioEngine.unlock();
    audioEngine.playStartChime();
    clearMilestoneBanner();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setRunToken((t) => t + 1);
    setGameState('playing');
  }, [clearMilestoneBanner]);

  const pauseGame = useCallback(() => {
    setGameState((prev) => (prev === 'playing' ? 'paused' : prev));
  }, []);

  const resumeGame = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setGameState((prev) => (prev === 'paused' ? 'playing' : prev));
  }, []);

  const backToTitle = useCallback(() => {
    clearMilestoneBanner();
    setRunToken((t) => t + 1);
    setGameState('title');
  }, [clearMilestoneBanner]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, []);

  const handleStatsChange = useCallback((nextStats: GameStats) => {
    setStats(nextStats);
    setBestScore((prevBest) => {
      const updated = Math.max(prevBest, nextStats.bestScore);
      if (updated > prevBest) {
        try {
          window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(updated));
        } catch {
          // Ignore storage quota errors
        }
      }
      return updated;
    });
  }, []);

  const handleMilestone = useCallback((message: string) => {
    if (milestoneTimerRef.current !== null) {
      window.clearTimeout(milestoneTimerRef.current);
    }
    setMilestoneBanner(message);
    milestoneTimerRef.current = window.setTimeout(() => {
      setMilestoneBanner(null);
      milestoneTimerRef.current = null;
    }, 1700);
  }, []);

  const handlePartyComplete = useCallback((finalStats: GameStats) => {
    setStats(finalStats);
    clearMilestoneBanner();
    setGameState('gameover');
  }, [clearMilestoneBanner]);

  // Global keyboard shortcuts (Enter/Space on Title, P/Escape for Pause, M for Mute)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();

      if (key === 'm') {
        toggleMute();
        return;
      }

      if (gameState === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startGame();
        return;
      }

      if (gameState === 'playing' && (key === 'p' || e.key === 'Escape')) {
        e.preventDefault();
        pauseGame();
        return;
      }

      if (gameState === 'paused' && (key === 'p' || e.key === 'Escape')) {
        e.preventDefault();
        resumeGame();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, startGame, pauseGame, resumeGame, toggleMute]);

  useEffect(() => {
    return () => {
      if (milestoneTimerRef.current !== null) {
        window.clearTimeout(milestoneTimerRef.current);
      }
    };
  }, []);

  return (
    <main className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#B3E2FF] via-[#DCF3FF] to-[#FFF6E5] sm:p-4">
      {/* 9:16 Vertical Hyper-Casual Play Stage */}
      <div
        className="relative w-full h-full sm:h-[min(94vh,860px)] sm:w-auto aspect-[9/16] max-w-full max-h-full overflow-hidden sm:rounded-[34px] sm:border-[4px] sm:border-[#332C47] sm:shadow-[0_18px_48px_rgba(47,42,68,0.22)] bg-[#BDE7FF]"
      >
        <BalloonGameCanvas
          gameState={gameState}
          mode={mode}
          runToken={runToken}
          bestScore={bestScore}
          onStatsChange={handleStatsChange}
          onMilestone={handleMilestone}
          onPartyComplete={handlePartyComplete}
        />

        {gameState === 'title' && (
          <TitleOverlay
            mode={mode}
            bestScore={bestScore}
            onSelectMode={setMode}
            onStart={startGame}
          />
        )}

        {(gameState === 'playing' || gameState === 'paused') && (
          <GameHud
            score={stats.score}
            stars={stats.stars}
            poppedCount={stats.poppedCount}
            mode={mode}
            muted={muted}
            milestoneBanner={milestoneBanner}
            onToggleMute={toggleMute}
            onPause={pauseGame}
          />
        )}

        {gameState === 'paused' && (
          <PauseModal
            score={stats.score}
            stars={stats.stars}
            onResume={resumeGame}
            onRestart={startGame}
            onBackToTitle={backToTitle}
          />
        )}

        {gameState === 'gameover' && (
          <CelebrationModal
            stats={stats}
            onPlayAgain={startGame}
            onBackToTitle={backToTitle}
          />
        )}
      </div>
    </main>
  );
}
