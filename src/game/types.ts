export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export type GameMode = 'free' | 'party';

export type AnimalKind =
  | 'bunny'
  | 'duck'
  | 'frog'
  | 'bear'
  | 'kitty'
  | 'fox'
  | 'puppy';

export interface AnimalBalloonStyle {
  kind: AnimalKind;
  label: string;
  bodyColor: string;
  highlightColor: string;
  shadeColor: string;
  earColor: string;
  cheekColor: string;
  points: number;
}

export interface Balloon {
  id: number;
  kind: AnimalKind;
  label: string;
  bodyColor: string;
  highlightColor: string;
  shadeColor: string;
  earColor: string;
  cheekColor: string;
  x: number;
  y: number;
  baseX: number;
  radius: number;
  speed: number;
  direction: -1 | 1; // -1 floats upward, 1 floats downward
  swayAmp: number;
  swayFreq: number;
  phase: number;
  tilt: number;
  points: number;
  isGolden: boolean;
  popping: boolean;
  popTimer: number;
  blinkTimer: number;
}

export interface GameStats {
  score: number;
  poppedCount: number;
  stars: number;
  bestScore: number;
  streak: number;
  lastAnimal: string;
  animalCounts: Record<AnimalKind, number>;
}

export interface PopOutcome {
  stats: GameStats;
  pointsEarned: number;
  milestoneReached: boolean;
  partyComplete: boolean;
  cheerText: string;
}

export type ParticleKind = 'star' | 'confetti' | 'ring' | 'sparkle' | 'text';

export interface Particle {
  active: boolean;
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
  gravity: number;
  text: string;
}

export interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  opacity: number;
}
