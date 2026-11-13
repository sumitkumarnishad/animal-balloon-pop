import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyBalloonPop,
  computeSpawnInterval,
  createBalloon,
  createInitialStats,
  getFavoriteAnimal,
  hitTestBalloon,
  screenToLogical,
  stepBalloons,
} from './rules';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, PARTY_TARGET_POPS } from './constants';

test('createInitialStats sets zeroed counters and preserves bestScore', () => {
  const stats = createInitialStats(14);
  assert.equal(stats.score, 0);
  assert.equal(stats.poppedCount, 0);
  assert.equal(stats.stars, 0);
  assert.equal(stats.bestScore, 14);
});

test('hitTestBalloon selects topmost overlapping balloon and uses forgiving toddler radius', () => {
  const bottom = createBalloon(1, 0, () => 0.5);
  bottom.x = 200;
  bottom.y = 300;
  bottom.radius = 45;

  const top = createBalloon(2, 0, () => 0.1);
  top.x = 215;
  top.y = 305;
  top.radius = 45;

  const hit = hitTestBalloon([bottom, top], 210, 302);
  assert.equal(hit?.id, 2);

  // Slightly off-center tap within forgiving radius (1.2x) still counts
  const edgeHit = hitTestBalloon([bottom], 200 + 50, 300);
  assert.equal(edgeHit?.id, 1);

  // Far miss returns null
  const miss = hitTestBalloon([bottom], 40, 40);
  assert.equal(miss, null);
});

test('hitTestBalloon ignores balloons already popping', () => {
  const b = createBalloon(1, 0, () => 0.5);
  b.x = 225;
  b.y = 400;
  b.popping = true;
  assert.equal(hitTestBalloon([b], 225, 400), null);
});

test('applyBalloonPop increments score, stars, milestones, and party completion', () => {
  let stats = createInitialStats(0);
  const normalBalloon = createBalloon(1, 0, () => 0.5);
  normalBalloon.isGolden = false;
  normalBalloon.points = 1;
  normalBalloon.kind = 'bunny';
  normalBalloon.label = 'Bunny';

  for (let i = 0; i < 9; i++) {
    const res = applyBalloonPop(stats, normalBalloon, 'free');
    stats = res.stats;
    assert.equal(res.milestoneReached, false);
  }
  assert.equal(stats.score, 9);
  assert.equal(stats.stars, 1); // 1 star earned at pop #5

  // 10th pop triggers milestone in Free Play
  const tenth = applyBalloonPop(stats, normalBalloon, 'free');
  assert.equal(tenth.milestoneReached, true);
  assert.equal(tenth.stats.stars, 2);
  assert.equal(tenth.partyComplete, false);

  // Golden balloon awards +3 points and immediate bonus star
  const golden = createBalloon(2, 5, () => 0.01);
  golden.isGolden = true;
  golden.points = 3;
  golden.kind = 'puppy';
  golden.label = 'Star Puppy';
  const goldenRes = applyBalloonPop(tenth.stats, golden, 'free');
  assert.equal(goldenRes.pointsEarned, 3);
  assert.equal(goldenRes.stats.score, 13);
  assert.equal(goldenRes.stats.stars, 3);

  // Party mode completes at PARTY_TARGET_POPS
  let partyStats = createInitialStats(0);
  for (let i = 0; i < PARTY_TARGET_POPS - 1; i++) {
    partyStats = applyBalloonPop(partyStats, normalBalloon, 'party').stats;
  }
  const finalPop = applyBalloonPop(partyStats, normalBalloon, 'party');
  assert.equal(finalPop.partyComplete, true);
});

test('stepBalloons moves upward and downward balloons and culls offscreen ones', () => {
  const up = createBalloon(1, 0, () => 0.2); // rng < 0.72 => direction -1
  up.y = 400;
  up.direction = -1;
  up.speed = 100;

  const down = createBalloon(2, 0, () => 0.9); // rng >= 0.72 => direction 1
  down.y = 200;
  down.direction = 1;
  down.speed = 80;

  const offscreen = createBalloon(3, 0, () => 0.2);
  offscreen.direction = -1;
  offscreen.y = -(offscreen.radius + 100);

  const stepped = stepBalloons([up, down, offscreen], 0.5, 1.0);
  assert.equal(stepped.length, 2);
  assert.ok(stepped[0].y < 400);
  assert.ok(stepped[1].y > 200);
});

test('computeSpawnInterval gently scales without becoming frantic', () => {
  const initial = computeSpawnInterval(0);
  const later = computeSpawnInterval(50);
  assert.ok(initial > later);
  assert.ok(later >= 0.68);
});

test('getFavoriteAnimal and screenToLogical return expected values', () => {
  let stats = createInitialStats(0);
  const duck = createBalloon(1, 0, () => 0.5);
  duck.kind = 'duck';
  duck.label = 'Duckling';
  stats = applyBalloonPop(stats, duck, 'free').stats;
  stats = applyBalloonPop(stats, duck, 'free').stats;
  assert.equal(getFavoriteAnimal(stats), 'Duckling');

  const pt = screenToLogical(225, 400, {
    left: 0,
    top: 0,
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
  });
  assert.equal(pt.x, 225);
  assert.equal(pt.y, 400);
});
