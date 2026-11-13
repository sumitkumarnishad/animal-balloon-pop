import { LOGICAL_HEIGHT, LOGICAL_WIDTH, MAX_PARTICLES } from './constants';
import { ParticlePool } from './particles';
import { AnimalKind, Balloon, Cloud } from './types';

export function createInitialClouds(): Cloud[] {
  return [
    { x: 65, y: 120, scale: 0.92, speed: 9, opacity: 0.92 },
    { x: 310, y: 195, scale: 0.78, speed: 6.5, opacity: 0.85 },
    { x: 165, y: 310, scale: 1.05, speed: 11, opacity: 0.78 },
    { x: 390, y: 455, scale: 0.72, speed: 7.5, opacity: 0.72 },
  ];
}

export function stepClouds(clouds: Cloud[], dt: number) {
  for (let i = 0; i < clouds.length; i++) {
    const c = clouds[i];
    c.x += c.speed * dt;
    if (c.x > LOGICAL_WIDTH + 110) {
      c.x = -110;
    }
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud) {
  ctx.save();
  ctx.translate(cloud.x, cloud.y);
  ctx.scale(cloud.scale, cloud.scale);
  ctx.globalAlpha = cloud.opacity;

  // Soft underside shadow
  ctx.fillStyle = '#E1F2FF';
  ctx.beginPath();
  ctx.arc(-25, 8, 21, 0, Math.PI * 2);
  ctx.arc(0, 6, 25, 0, Math.PI * 2);
  ctx.arc(25, 8, 20, 0, Math.PI * 2);
  ctx.fill();

  // Crisp fluffy cream-white top
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-25, 3, 20, 0, Math.PI * 2);
  ctx.arc(-2, -6, 26, 0, Math.PI * 2);
  ctx.arc(25, 3, 19, 0, Math.PI * 2);
  ctx.arc(0, 6, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.closePath();
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  elapsed: number
) {
  // Warm storybook pastel sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
  skyGrad.addColorStop(0, '#BDE7FF');
  skyGrad.addColorStop(0.58, '#E4F5FF');
  skyGrad.addColorStop(1, '#FFF8EB');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  // Soft smiling sun tucked gracefully in upper-right sky
  const sunX = LOGICAL_WIDTH - 68;
  const sunY = 122;
  ctx.save();
  ctx.translate(sunX, sunY);
  const pulse = 1 + Math.sin(elapsed * 1.6) * 0.03;
  ctx.scale(pulse, pulse);

  ctx.fillStyle = 'rgba(255, 232, 133, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFE066';
  ctx.beginPath();
  ctx.arc(0, 0, 29, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFF5B8';
  ctx.beginPath();
  ctx.arc(-8, -9, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Fluffy clouds
  for (let i = 0; i < clouds.length; i++) {
    drawCloud(ctx, clouds[i]);
  }

  // Rolling pastel meadow hills at bottom edge
  ctx.fillStyle = '#C9F0C5';
  ctx.beginPath();
  ctx.moveTo(0, LOGICAL_HEIGHT - 82);
  ctx.quadraticCurveTo(LOGICAL_WIDTH * 0.28, LOGICAL_HEIGHT - 122, LOGICAL_WIDTH * 0.62, LOGICAL_HEIGHT - 84);
  ctx.quadraticCurveTo(LOGICAL_WIDTH * 0.85, LOGICAL_HEIGHT - 60, LOGICAL_WIDTH, LOGICAL_HEIGHT - 88);
  ctx.lineTo(LOGICAL_WIDTH, LOGICAL_HEIGHT);
  ctx.lineTo(0, LOGICAL_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#B2E6AE';
  ctx.beginPath();
  ctx.moveTo(0, LOGICAL_HEIGHT - 44);
  ctx.quadraticCurveTo(LOGICAL_WIDTH * 0.38, LOGICAL_HEIGHT - 86, LOGICAL_WIDTH * 0.78, LOGICAL_HEIGHT - 46);
  ctx.quadraticCurveTo(LOGICAL_WIDTH * 0.92, LOGICAL_HEIGHT - 32, LOGICAL_WIDTH, LOGICAL_HEIGHT - 44);
  ctx.lineTo(LOGICAL_WIDTH, LOGICAL_HEIGHT);
  ctx.lineTo(0, LOGICAL_HEIGHT);
  ctx.closePath();
  ctx.fill();

  // Tiny cheerful meadow daisies
  const flowers = [
    { x: 52, y: LOGICAL_HEIGHT - 30, color: '#FFB3C6' },
    { x: 148, y: LOGICAL_HEIGHT - 46, color: '#FFFFFF' },
    { x: 295, y: LOGICAL_HEIGHT - 34, color: '#FFE28A' },
    { x: 392, y: LOGICAL_HEIGHT - 26, color: '#FFB3C6' },
  ];
  for (const f of flowers) {
    ctx.fillStyle = f.color;
    for (let p = 0; p < 5; p++) {
      const a = (Math.PI * 2 * p) / 5;
      ctx.beginPath();
      ctx.arc(f.x + Math.cos(a) * 4.2, f.y + Math.sin(a) * 4.2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(f.x, f.y, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAnimalEars(
  ctx: CanvasRenderingContext2D,
  kind: AnimalKind,
  r: number,
  bodyColor: string,
  earColor: string
) {
  const rx = r * 0.96;
  const ry = r * 1.1;

  if (kind === 'bunny') {
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * rx * 0.34, -ry * 0.88);
      ctx.rotate(side * 0.16);
      ctx.fillStyle = bodyColor;
      ctx.strokeStyle = 'rgba(51, 44, 71, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, -14, r * 0.22, r * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = earColor;
      ctx.beginPath();
      ctx.ellipse(0, -13, r * 0.11, r * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else if (kind === 'bear' || kind === 'frog') {
    for (const side of [-1, 1]) {
      const ex = side * rx * 0.58;
      const ey = -ry * 0.74;
      ctx.fillStyle = bodyColor;
      ctx.strokeStyle = 'rgba(51, 44, 71, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ex, ey, r * (kind === 'frog' ? 0.28 : 0.25), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (kind === 'bear') {
        ctx.fillStyle = '#FFF5E8';
        ctx.beginPath();
        ctx.arc(ex, ey, r * 0.13, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Froggy eyes sit on the upper bumps!
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ex, ey, r * 0.17, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#332C47';
        ctx.beginPath();
        ctx.arc(ex, ey, r * 0.09, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (kind === 'kitty' || kind === 'fox') {
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * rx * 0.52, -ry * 0.72);
      ctx.rotate(side * 0.32);
      ctx.fillStyle = kind === 'fox' ? '#EE8B4E' : bodyColor;
      ctx.strokeStyle = 'rgba(51, 44, 71, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.22, r * 0.12);
      ctx.lineTo(0, -r * 0.36);
      ctx.lineTo(r * 0.22, r * 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = kind === 'fox' ? '#FFF5E8' : '#FFC6DC';
      ctx.beginPath();
      ctx.moveTo(-r * 0.11, r * 0.06);
      ctx.lineTo(0, -r * 0.2);
      ctx.lineTo(r * 0.11, r * 0.06);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  } else if (kind === 'duck') {
    // Little cheerful feather tuft on top
    ctx.fillStyle = '#FFBE3D';
    ctx.beginPath();
    ctx.ellipse(-4, -ry * 1.03, r * 0.1, r * 0.2, -0.35, 0, Math.PI * 2);
    ctx.ellipse(5, -ry * 1.01, r * 0.09, r * 0.18, 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'puppy') {
    // Floppy golden puppy ears on sides
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * rx * 0.88, -ry * 0.26);
      ctx.rotate(side * 0.36);
      ctx.fillStyle = '#F2BE35';
      ctx.strokeStyle = 'rgba(51, 44, 71, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, r * 0.18, r * 0.18, r * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    // Cute tiny crown star above puppy
    ctx.fillStyle = '#FFF9C4';
    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 1.8;
    drawStarPath(ctx, 0, -ry * 1.15, 5, r * 0.24, r * 0.11);
    ctx.fill();
    ctx.stroke();
  }
}

function drawAnimalFace(ctx: CanvasRenderingContext2D, b: Balloon) {
  const r = b.radius;
  const blinking = b.blinkTimer < 0;

  // Rosy cheeks
  ctx.fillStyle = b.cheekColor;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.ellipse(-r * 0.42, r * 0.14, r * 0.15, r * 0.1, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.42, r * 0.14, r * 0.15, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Eyes (skip main eyes for frog since frog eyes are on top bumps)
  if (b.kind !== 'frog') {
    for (const side of [-1, 1]) {
      const ex = side * r * 0.28;
      const ey = -r * 0.08;
      if (blinking) {
        ctx.strokeStyle = '#332C47';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(ex, ey + 2, r * 0.1, Math.PI, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#332C47';
        ctx.beginPath();
        ctx.arc(ex, ey, r * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Catchlight sparkle in eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ex - r * 0.03, ey - r * 0.035, r * 0.038, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Muzzle / Nose / Beak / Smile
  if (b.kind === 'duck') {
    ctx.fillStyle = '#FF8A4C';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.14, r * 0.22, r * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(51, 44, 71, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (b.kind === 'frog') {
    ctx.strokeStyle = '#332C47';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, r * 0.04, r * 0.34, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else {
    if (b.kind === 'bear' || b.kind === 'puppy') {
      ctx.fillStyle = '#FFF7ED';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.16, r * 0.28, r * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose
    ctx.fillStyle = b.kind === 'bunny' || b.kind === 'kitty' ? '#FF6B8A' : '#332C47';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.09, r * 0.09, r * 0.065, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute smile
    ctx.strokeStyle = '#332C47';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-r * 0.075, r * 0.16, r * 0.075, 0.15, Math.PI - 0.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(r * 0.075, r * 0.16, r * 0.075, 0.1, Math.PI - 0.15);
    ctx.stroke();

    if (b.kind === 'kitty') {
      ctx.strokeStyle = 'rgba(51, 44, 71, 0.45)';
      ctx.lineWidth = 1.6;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * r * 0.36, r * 0.06);
        ctx.lineTo(side * r * 0.62, r * 0.01);
        ctx.moveTo(side * r * 0.36, r * 0.15);
        ctx.lineTo(side * r * 0.62, r * 0.17);
        ctx.stroke();
      }
    }
  }
}

function drawBalloon(
  ctx: CanvasRenderingContext2D,
  b: Balloon,
  elapsed: number
) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.tilt);

  if (b.popping) {
    const p = Math.min(1, b.popTimer / 0.14);
    const sx = 1 + p * 0.42;
    const sy = 1 - p * 0.32;
    ctx.scale(sx, sy);
    ctx.globalAlpha = 1 - p;
  }

  const r = b.radius;
  const rx = r * 0.96;
  const ry = r * 1.1;

  // Swaying curly ribbon string underneath
  const wave = Math.sin(elapsed * 4.2 + b.phase) * 9;
  ctx.strokeStyle = b.isGolden ? '#EAB308' : 'rgba(92, 84, 118, 0.42)';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, ry + 5);
  ctx.bezierCurveTo(wave, ry + 26, -wave, ry + 48, wave * 0.5, ry + 68);
  ctx.stroke();

  // For downward floating balloons, draw cute mini floating cloud puff above
  if (b.direction === 1 && !b.popping) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(-11, -ry - 16, 8, 0, Math.PI * 2);
    ctx.arc(0, -ry - 20, 10, 0, Math.PI * 2);
    ctx.arc(11, -ry - 16, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Balloon knot
  ctx.fillStyle = b.shadeColor;
  ctx.beginPath();
  ctx.moveTo(-6, ry + 6);
  ctx.lineTo(6, ry + 6);
  ctx.lineTo(0, ry - 2);
  ctx.closePath();
  ctx.fill();

  // Golden aura ring for Star Puppy balloon
  if (b.isGolden) {
    ctx.strokeStyle = 'rgba(255, 224, 102, 0.65)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx + 5, ry + 5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Ears behind/above balloon
  drawAnimalEars(ctx, b.kind, r, b.bodyColor, b.earColor);

  // Main pastel balloon oval body
  const grad = ctx.createRadialGradient(-rx * 0.32, -ry * 0.35, r * 0.1, 0, 0, ry * 1.15);
  grad.addColorStop(0, b.highlightColor);
  grad.addColorStop(0.55, b.bodyColor);
  grad.addColorStop(1, b.shadeColor);

  ctx.fillStyle = grad;
  ctx.strokeStyle = 'rgba(51, 44, 71, 0.16)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Specular soft highlight crescent
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-rx * 0.44, -ry * 0.42, r * 0.16, r * 0.28, 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Animal face
  drawAnimalFace(ctx, b);

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, pool: ParticlePool) {
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = pool.items[i];
    if (!p.active) continue;

    const progress = p.life / p.maxLife;
    const alpha = Math.max(0, 1 - progress * progress);

    ctx.save();
    ctx.globalAlpha = alpha;

    if (p.kind === 'ring') {
      const radius = p.size + progress * 48;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(1.5, 5 * (1 - progress));
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.kind === 'star' || p.kind === 'sparkle') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      const spikes = p.kind === 'star' ? 5 : 4;
      const s = p.size * (1 - progress * 0.35);
      drawStarPath(ctx, 0, 0, spikes, s, s * 0.46);
      ctx.fill();
    } else if (p.kind === 'confetti') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.life * 10), 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 0.55, -p.size * 0.3, p.size * 1.1, p.size * 0.6);
    } else if (p.kind === 'text') {
      ctx.font = `700 ${p.size}px 'Fredoka', ui-rounded, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 5;
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
    }

    ctx.restore();
  }
}

export function renderGameScene(
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  balloons: Balloon[],
  pool: ParticlePool,
  elapsed: number,
  shakeAmount: number
) {
  ctx.save();

  if (shakeAmount > 0.1) {
    const sx = (Math.random() - 0.5) * shakeAmount;
    const sy = (Math.random() - 0.5) * shakeAmount;
    ctx.translate(sx, sy);
  }

  drawBackground(ctx, clouds, elapsed);

  for (let i = 0; i < balloons.length; i++) {
    drawBalloon(ctx, balloons[i], elapsed);
  }

  drawParticles(ctx, pool);

  ctx.restore();
}
