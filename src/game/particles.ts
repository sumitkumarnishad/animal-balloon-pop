import { CONFETTI_COLORS, MAX_PARTICLES } from './constants';
import { Particle, ParticleKind } from './types';

export interface ParticlePool {
  items: Particle[];
  cursor: number;
}

export function createParticlePool(): ParticlePool {
  const items: Particle[] = new Array(MAX_PARTICLES);
  for (let i = 0; i < MAX_PARTICLES; i++) {
    items[i] = {
      active: false,
      kind: 'star',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 8,
      color: '#FFD166',
      rotation: 0,
      vRot: 0,
      life: 0,
      maxLife: 1,
      gravity: 0,
      text: '',
    };
  }
  return { items, cursor: 0 };
}

function allocParticle(pool: ParticlePool): Particle {
  const p = pool.items[pool.cursor];
  pool.cursor = (pool.cursor + 1) % MAX_PARTICLES;
  p.active = true;
  return p;
}

export function spawnParticle(
  pool: ParticlePool,
  kind: ParticleKind,
  x: number,
  y: number,
  vx: number,
  vy: number,
  size: number,
  color: string,
  maxLife: number,
  gravity: number,
  text = ''
) {
  const p = allocParticle(pool);
  p.kind = kind;
  p.x = x;
  p.y = y;
  p.vx = vx;
  p.vy = vy;
  p.size = size;
  p.color = color;
  p.rotation = Math.random() * Math.PI * 2;
  p.vRot = (Math.random() - 0.5) * 8;
  p.life = 0;
  p.maxLife = maxLife;
  p.gravity = gravity;
  p.text = text;
}

export function spawnPopBurst(
  pool: ParticlePool,
  x: number,
  y: number,
  mainColor: string,
  isGolden: boolean,
  cheerText: string
) {
  // Expanding pop ring
  spawnParticle(pool, 'ring', x, y, 0, 0, isGolden ? 26 : 18, mainColor, 0.34, 0);

  const count = isGolden ? 26 : 16;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
    const speed = (isGolden ? 140 : 105) + Math.random() * 145;
    const kind: ParticleKind = i % 2 === 0 ? 'star' : 'confetti';
    const color =
      i % 3 === 0
        ? mainColor
        : CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    spawnParticle(
      pool,
      kind,
      x,
      y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed - 45,
      kind === 'star' ? 8 + Math.random() * 7 : 7 + Math.random() * 5,
      color,
      0.58 + Math.random() * 0.35,
      240
    );
  }

  // Cheerful floating text popup
  spawnParticle(
    pool,
    'text',
    x,
    y - 12,
    0,
    -68,
    isGolden ? 24 : 21,
    isGolden ? '#D97706' : '#332C47',
    0.78,
    -15,
    cheerText
  );
}

export function spawnSkyTapSparkle(pool: ParticlePool, x: number, y: number) {
  spawnParticle(pool, 'ring', x, y, 0, 0, 8, '#FFFFFF', 0.25, 0);
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 + Math.random() * 0.4;
    const speed = 42 + Math.random() * 38;
    spawnParticle(
      pool,
      'sparkle',
      x,
      y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed - 15,
      5 + Math.random() * 4,
      CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      0.42,
      60
    );
  }
}

export function spawnMilestoneShower(pool: ParticlePool, width: number) {
  for (let i = 0; i < 34; i++) {
    const x = 24 + Math.random() * (width - 48);
    const y = 30 + Math.random() * 90;
    const kind: ParticleKind = i % 2 === 0 ? 'star' : 'confetti';
    spawnParticle(
      pool,
      kind,
      x,
      y,
      (Math.random() - 0.5) * 90,
      60 + Math.random() * 110,
      8 + Math.random() * 6,
      CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      1.15 + Math.random() * 0.45,
      110
    );
  }
}

export function stepParticles(pool: ParticlePool, dt: number) {
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = pool.items[i];
    if (!p.active) continue;

    p.life += dt;
    if (p.life >= p.maxLife) {
      p.active = false;
      continue;
    }

    p.vy += p.gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.98;
    p.rotation += p.vRot * dt;
  }
}
