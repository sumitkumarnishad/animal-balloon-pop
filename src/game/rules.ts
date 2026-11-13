import {
  ANIMAL_STYLES,
  CHEER_WORDS,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  MILESTONE_STEP,
  PARTY_TARGET_POPS,
  STANDARD_ANIMALS,
} from './constants';
import {
  AnimalKind,
  Balloon,
  GameMode,
  GameStats,
  PopOutcome,
} from './types';

export function createInitialStats(bestScore = 0): GameStats {
  return {
    score: 0,
    poppedCount: 0,
    stars: 0,
    bestScore,
    streak: 0,
    lastAnimal: 'Bunny',
    animalCounts: {
      bunny: 0,
      duck: 0,
      frog: 0,
      bear: 0,
      kitty: 0,
      fox: 0,
      puppy: 0,
    },
  };
}

export function computeSpawnInterval(poppedCount: number): number {
  // Keep pace gentle and welcoming for toddlers under 6
  const reduction = Math.min(0.42, poppedCount * 0.012);
  return Math.max(0.68, 1.18 - reduction);
}

export function computeMaxActiveBalloons(poppedCount: number): number {
  return Math.min(10, 6 + Math.floor(poppedCount / 8));
}

export function createBalloon(
  id: number,
  poppedCount: number,
  rng: () => number = Math.random
): Balloon {
  const isGolden = poppedCount >= 2 && rng() < 0.13;
  const kind: AnimalKind = isGolden
    ? 'puppy'
    : STANDARD_ANIMALS[Math.floor(rng() * STANDARD_ANIMALS.length)];

  const style = ANIMAL_STYLES[kind];
  const radius = isGolden ? 52 : 44 + rng() * 11;
  const margin = radius + 16;
  const baseX = margin + rng() * (LOGICAL_WIDTH - margin * 2);

  // Float upward (72%) or gently downward (28%) as designed
  const direction: -1 | 1 = rng() < 0.72 ? -1 : 1;
  const startY =
    direction === -1
      ? LOGICAL_HEIGHT + radius + 36
      : -(radius + 36);

  const difficultyBoost = Math.min(28, poppedCount * 0.7);
  const speed = (direction === -1 ? 72 : 58) + rng() * 34 + difficultyBoost;

  return {
    id,
    kind,
    label: style.label,
    bodyColor: style.bodyColor,
    highlightColor: style.highlightColor,
    shadeColor: style.shadeColor,
    earColor: style.earColor,
    cheekColor: style.cheekColor,
    x: baseX,
    y: startY,
    baseX,
    radius,
    speed,
    direction,
    swayAmp: 12 + rng() * 16,
    swayFreq: 1.1 + rng() * 0.9,
    phase: rng() * Math.PI * 2,
    tilt: 0,
    points: style.points,
    isGolden,
    popping: false,
    popTimer: 0,
    blinkTimer: 1.5 + rng() * 3.2,
  };
}

export function hitTestBalloon(
  balloons: Balloon[],
  x: number,
  y: number
): Balloon | null {
  // Check top-most balloon first (reverse render order)
  for (let i = balloons.length - 1; i >= 0; i--) {
    const b = balloons[i];
    if (b.popping) continue;

    // Generous toddler-friendly oval hitbox
    const rx = b.radius * 1.26;
    const ry = b.radius * 1.36;
    const dx = (x - b.x) / rx;
    const dy = (y - b.y) / ry;

    if (dx * dx + dy * dy <= 1) {
      return b;
    }
  }
  return null;
}

export function applyBalloonPop(
  stats: GameStats,
  balloon: Balloon,
  mode: GameMode
): PopOutcome {
  const nextScore = stats.score + balloon.points;
  const nextPopped = stats.poppedCount + 1;
  const nextStreak = stats.streak + 1;

  // Earn 1 star every 5 pops, plus an immediate star on golden Star Puppy balloons
  const earnedStarFromCount = nextPopped % 5 === 0 ? 1 : 0;
  const goldenStar = balloon.isGolden ? 1 : 0;
  const nextStars = stats.stars + earnedStarFromCount + goldenStar;

  const nextBest = Math.max(stats.bestScore, nextScore);
  const milestoneReached =
    mode === 'free' && nextPopped > 0 && nextPopped % MILESTONE_STEP === 0;
  const partyComplete =
    mode === 'party' && nextPopped >= PARTY_TARGET_POPS;

  const nextCounts = {
    ...stats.animalCounts,
    [balloon.kind]: (stats.animalCounts[balloon.kind] || 0) + 1,
  };

  const cheerText = balloon.isGolden
    ? '+3 Star!'
    : CHEER_WORDS[nextPopped % CHEER_WORDS.length];

  return {
    stats: {
      score: nextScore,
      poppedCount: nextPopped,
      stars: nextStars,
      bestScore: nextBest,
      streak: nextStreak,
      lastAnimal: balloon.label,
      animalCounts: nextCounts,
    },
    pointsEarned: balloon.points,
    milestoneReached,
    partyComplete,
    cheerText,
  };
}

export function stepBalloons(
  balloons: Balloon[],
  dt: number,
  elapsed: number
): Balloon[] {
  const survivors: Balloon[] = [];

  for (let i = 0; i < balloons.length; i++) {
    const b = balloons[i];
    if (b.popping) {
      b.popTimer += dt;
      if (b.popTimer < 0.14) {
        survivors.push(b);
      }
      continue;
    }

    b.y += b.direction * b.speed * dt;
    const swayOffset = Math.sin(elapsed * b.swayFreq + b.phase) * b.swayAmp;
    b.x = Math.max(
      b.radius + 10,
      Math.min(LOGICAL_WIDTH - b.radius - 10, b.baseX + swayOffset)
    );
    b.tilt = Math.cos(elapsed * b.swayFreq + b.phase) * 0.08;

    b.blinkTimer -= dt;
    if (b.blinkTimer < -0.14) {
      b.blinkTimer = 2.4 + ((b.id * 0.73) % 2.8);
    }

    const outTop = b.direction === -1 && b.y < -(b.radius + 90);
    const outBottom = b.direction === 1 && b.y > LOGICAL_HEIGHT + b.radius + 90;

    if (!outTop && !outBottom) {
      survivors.push(b);
    }
  }

  return survivors;
}

export function getFavoriteAnimal(stats: GameStats): string {
  let bestKind: AnimalKind = 'bunny';
  let maxCount = -1;
  (Object.keys(stats.animalCounts) as AnimalKind[]).forEach((kind) => {
    const count = stats.animalCounts[kind];
    if (count > maxCount) {
      maxCount = count;
      bestKind = kind;
    }
  });
  return maxCount > 0 ? ANIMAL_STYLES[bestKind].label : 'Bunny';
}

export function screenToLogical(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number }
): { x: number; y: number } {
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: LOGICAL_WIDTH / 2, y: LOGICAL_HEIGHT / 2 };
  }
  return {
    x: ((clientX - rect.left) / rect.width) * LOGICAL_WIDTH,
    y: ((clientY - rect.top) / rect.height) * LOGICAL_HEIGHT,
  };
}
