import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../game/audio';
import {
  ANIMAL_STYLES,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  STANDARD_ANIMALS,
} from '../game/constants';
import {
  createParticlePool,
  spawnMilestoneShower,
  spawnPopBurst,
  spawnSkyTapSparkle,
  stepParticles,
} from '../game/particles';
import {
  createInitialClouds,
  renderGameScene,
  stepClouds,
} from '../game/renderer';
import {
  applyBalloonPop,
  computeMaxActiveBalloons,
  computeSpawnInterval,
  createBalloon,
  createInitialStats,
  hitTestBalloon,
  screenToLogical,
  stepBalloons,
} from '../game/rules';
import { Balloon, GameMode, GameState, GameStats } from '../game/types';

interface BalloonGameCanvasProps {
  gameState: GameState;
  mode: GameMode;
  runToken: number;
  bestScore: number;
  onStatsChange: (stats: GameStats) => void;
  onMilestone: (message: string) => void;
  onPartyComplete: (finalStats: GameStats) => void;
}

export const BalloonGameCanvas: React.FC<BalloonGameCanvasProps> = ({
  gameState,
  mode,
  runToken,
  bestScore,
  onStatsChange,
  onMilestone,
  onPartyComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Refs synced with React props so the 60fps loop never resets on HUD updates
  const gameStateRef = useRef<GameState>(gameState);
  const modeRef = useRef<GameMode>(mode);
  const bestScoreRef = useRef<number>(bestScore);
  const onStatsChangeRef = useRef(onStatsChange);
  const onMilestoneRef = useRef(onMilestone);
  const onPartyCompleteRef = useRef(onPartyComplete);

  gameStateRef.current = gameState;
  modeRef.current = mode;
  bestScoreRef.current = bestScore;
  onStatsChangeRef.current = onStatsChange;
  onMilestoneRef.current = onMilestone;
  onPartyCompleteRef.current = onPartyComplete;

  // Mutable simulation state kept outside React reconciliation
  const simRef = useRef<{
    balloons: Balloon[];
    nextId: number;
    spawnTimer: number;
    elapsed: number;
    hitstop: number;
    shake: number;
    stats: GameStats;
    clouds: ReturnType<typeof createInitialClouds>;
    particles: ReturnType<typeof createParticlePool>;
  }>({
    balloons: [],
    nextId: 1,
    spawnTimer: 0.4,
    elapsed: 0,
    hitstop: 0,
    shake: 0,
    stats: createInitialStats(bestScore),
    clouds: createInitialClouds(),
    particles: createParticlePool(),
  });

  // Helper to seed ambient or starting balloons cleanly
  const seedInitialBalloons = (count: number, forTitle: boolean) => {
    const sim = simRef.current;
    sim.balloons = [];
    const titleSlots = [
      { x: 105, y: 295, dir: -1 as const },
      { x: 335, y: 315, dir: 1 as const },
      { x: 175, y: 445, dir: -1 as const },
      { x: 295, y: 470, dir: -1 as const },
    ];
    const playSlots = [
      { x: 225, y: 410, dir: -1 as const },
      { x: 112, y: 545, dir: -1 as const },
      { x: 335, y: 250, dir: 1 as const },
      { x: 245, y: 650, dir: -1 as const },
    ];
    const slots = forTitle ? titleSlots : playSlots;

    for (let i = 0; i < count; i++) {
      const b = createBalloon(sim.nextId++, 0);
      const kind = STANDARD_ANIMALS[i % STANDARD_ANIMALS.length];
      const style = ANIMAL_STYLES[kind];
      b.kind = kind;
      b.label = style.label;
      b.bodyColor = style.bodyColor;
      b.highlightColor = style.highlightColor;
      b.shadeColor = style.shadeColor;
      b.earColor = style.earColor;
      b.cheekColor = style.cheekColor;
      b.points = style.points;
      b.isGolden = false;

      const slot = slots[i % slots.length];
      b.baseX = slot.x;
      b.x = slot.x;
      b.y = slot.y;
      b.direction = slot.dir;
      b.radius = forTitle ? 46 : 48;
      sim.balloons.push(b);
    }
  };

  // Reset simulation whenever runToken increments (Start / Restart / Play Again)
  useEffect(() => {
    const sim = simRef.current;
    sim.stats = createInitialStats(bestScoreRef.current);
    sim.particles = createParticlePool();
    sim.spawnTimer = 0.45;
    sim.hitstop = 0;
    sim.shake = 0;
    seedInitialBalloons(gameStateRef.current === 'title' ? 4 : 3, gameStateRef.current === 'title');
    onStatsChangeRef.current(sim.stats);
  }, [runToken]);

  // Mount canvas, ResizeObserver, and single requestAnimationFrame loop once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasResolution = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(LOGICAL_WIDTH * dpr);
      canvas.height = Math.round(LOGICAL_HEIGHT * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let needsPausedRedraw = true;
    let prevState: GameState = gameStateRef.current;

    const updateCanvasResolutionAndDraw = () => {
      updateCanvasResolution();
      needsPausedRedraw = true;
    };

    updateCanvasResolutionAndDraw();
    const ro2 = new ResizeObserver(updateCanvasResolutionAndDraw);
    ro2.observe(canvas);

    let rafId = 0;
    let lastTime = performance.now();

    const frame = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      const sim = simRef.current;
      const state = gameStateRef.current;
      if (state !== prevState) {
        prevState = state;
        needsPausedRedraw = true;
      }

      if (state === 'playing' || state === 'title') {
        sim.elapsed += dt;
        stepClouds(sim.clouds, dt);
        stepParticles(sim.particles, dt);

        if (sim.shake > 0) {
          sim.shake = Math.max(0, sim.shake - dt * 28);
        }

        if (sim.hitstop > 0) {
          sim.hitstop = Math.max(0, sim.hitstop - dt);
        } else {
          sim.balloons = stepBalloons(sim.balloons, dt, sim.elapsed);
          sim.spawnTimer -= dt;

          const maxActive =
            state === 'title'
              ? 4
              : computeMaxActiveBalloons(sim.stats.poppedCount);

          if (sim.spawnTimer <= 0 && sim.balloons.length < maxActive) {
            sim.balloons.push(
              createBalloon(
                sim.nextId++,
                state === 'title' ? 0 : sim.stats.poppedCount
              )
            );
            sim.spawnTimer =
              state === 'title'
                ? 1.65
                : computeSpawnInterval(sim.stats.poppedCount);
          }
        }
        renderGameScene(
          ctx,
          sim.clouds,
          sim.balloons,
          sim.particles,
          sim.elapsed,
          sim.shake
        );
      } else if (state === 'gameover') {
        // Keep celebration confetti drifting softly behind modal
        sim.elapsed += dt;
        stepClouds(sim.clouds, dt * 0.5);
        stepParticles(sim.particles, dt);
        renderGameScene(
          ctx,
          sim.clouds,
          sim.balloons,
          sim.particles,
          sim.elapsed,
          sim.shake
        );
      } else if (state === 'paused' && needsPausedRedraw) {
        needsPausedRedraw = false;
        renderGameScene(
          ctx,
          sim.clouds,
          sim.balloons,
          sim.particles,
          sim.elapsed,
          0
        );
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro2.disconnect();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameStateRef.current !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    audioEngine.unlock();

    const rect = canvas.getBoundingClientRect();
    const { x, y } = screenToLogical(e.clientX, e.clientY, rect);
    const sim = simRef.current;

    const hit = hitTestBalloon(sim.balloons, x, y);
    if (!hit) {
      spawnSkyTapSparkle(sim.particles, x, y);
      audioEngine.playSkyTapSound();
      return;
    }

    hit.popping = true;
    hit.popTimer = 0;

    const outcome = applyBalloonPop(sim.stats, hit, modeRef.current);
    sim.stats = outcome.stats;

    audioEngine.playPopSound(hit.isGolden);
    spawnPopBurst(
      sim.particles,
      hit.x,
      hit.y,
      hit.bodyColor,
      hit.isGolden,
      outcome.cheerText
    );

    if (hit.isGolden) {
      sim.hitstop = 0.035;
      sim.shake = 5.5;
    }

    onStatsChangeRef.current(sim.stats);

    if (outcome.milestoneReached) {
      spawnMilestoneShower(sim.particles, LOGICAL_WIDTH);
      audioEngine.playCelebrationFanfare();
      onMilestoneRef.current(`${sim.stats.poppedCount} Balloons!`);
    }

    if (outcome.partyComplete) {
      spawnMilestoneShower(sim.particles, LOGICAL_WIDTH);
      audioEngine.playCelebrationFanfare();
      onPartyCompleteRef.current(sim.stats);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      data-testid="game-canvas"
      onPointerDown={handlePointerDown}
      className="block w-full h-full touch-none select-none cursor-pointer"
    />
  );
};
