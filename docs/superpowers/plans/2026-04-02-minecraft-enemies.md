# Minecraft-Inspired Enemies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new enemies (Zombie, Skeleton, Warden) inspired by Minecraft to the Jungle Neon side-scroller, each with unique AI and visuals in the existing neon wireframe style.

**Architecture:** Minimal invasion approach. New enemies use the existing `enemies[]` array with `type` field dispatch. Hostile projectiles (skeleton arrows) reuse the `projectiles[]` array with a `hostile: true` flag. Warden sequence is a new `gameState = 'warden'` with its own update/draw path. No refactoring of existing code patterns.

**Tech Stack:** Vanilla JS, Canvas 2D API, no build tools or test framework. Verification is visual (open `index.html` in browser).

**Spec:** `docs/superpowers/specs/2026-04-02-minecraft-enemies-design.md`

---

### Task 1: Add Constants and State Variables

**Files:**
- Modify: `js/constants.js` (lines 7-15, COLORS object)
- Modify: `js/state.js` (lines 36-44, after existing enemy/projectile state)

- [ ] **Step 1: Add new colors to COLORS object**

In `js/constants.js`, replace the COLORS object:

```javascript
const COLORS = {
  bg: '#0a0a0a',
  player: '#4CAF50',
  bug: '#f44336',
  dino: '#ff5722',
  projectile: '#00BCD4',
  melee: '#FFD700',
  terrain: '#4CAF50',
  zombie: '#7CFC00',
  zombieRage: '#ADFF2F',
  skeleton: '#E0E0E0',
  arrow: '#E0E0E0',
  warden: '#00CED1',
};
```

- [ ] **Step 2: Add new state variables**

In `js/state.js`, add after the existing `let dinoSpawnTimer = 0;` line (line 38):

```javascript
let zombieSpawnTimer = 0;
let skeletonSpawnTimer = 0;

// === WARDEN STATE ===
let nextWardenDistance = 2000;
let wardenPhase = 'none'; // 'none' | 'intro' | 'stealth' | 'detected' | 'exit'
let wardenTimer = 0;
let wardenEntity = null;
let noiseLevel = 0;
let wardenOverlayAlpha = 0;
let wardenDetected = false;
```

- [ ] **Step 3: Verify and commit**

Open `index.html` in browser. Game should load and play exactly as before (no visual changes yet).

```bash
git add js/constants.js js/state.js
git commit -m "feat: add constants and state for zombie, skeleton, warden enemies"
```

---

### Task 2: Draw Zombie

**Files:**
- Modify: `js/enemies.js` (add `drawZombie()` after `drawBeetle()`, before `drawTRex()`)

- [ ] **Step 1: Add drawZombie function**

In `js/enemies.js`, add after the closing `}` of `drawBeetle()` (after line 41):

```javascript
// === DRAW ZOMBIE ===
function drawZombie(enemy) {
  const sx = enemy.x - camera.x;
  const sy = enemy.y;
  const f = enemy.facing || -1;
  const isRage = enemy.rage;
  const color = isRage ? COLORS.zombieRage : COLORS.zombie;

  // Blink effect during rage
  if (isRage && Math.floor(gameTime * 8) % 2 === 0) {
    return; // flicker
  }

  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = isRage ? 14 : 8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.translate(sx, sy);
  ctx.scale(f * -1, 1);

  // Head
  ctx.beginPath();
  ctx.arc(0, -38, 7, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(0, -31);
  ctx.lineTo(0, -12);
  ctx.stroke();

  // Arms stretched forward
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(14, -26);
  ctx.lineTo(14, -22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(12, -22);
  ctx.lineTo(12, -18);
  ctx.stroke();

  // Legs (shuffling pose)
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(5, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(-4, 0);
  ctx.stroke();

  ctx.restore();
}
```

- [ ] **Step 2: Verify visually**

Temporarily add a test zombie in the browser console to verify the drawing:
Open browser, open console, type: `enemies.push({ type: 'zombie', x: player.x + 200, y: GROUND_Y, w: 30, h: 45, hp: 2, speed: 60, facing: -1, points: 15, rage: false });`

Verify a green wireframe humanoid appears with arms stretched forward.

Then test rage appearance: `enemies.push({ type: 'zombie', x: player.x + 300, y: GROUND_Y, w: 30, h: 45, hp: 1, speed: 220, facing: -1, points: 25, rage: true });`

Verify a brighter green blinking version appears.

- [ ] **Step 3: Commit**

```bash
git add js/enemies.js
git commit -m "feat: add zombie wireframe drawing with rage blink effect"
```

---

### Task 3: Draw Skeleton

**Files:**
- Modify: `js/enemies.js` (add `drawSkeleton()` after `drawZombie()`)

- [ ] **Step 1: Add drawSkeleton function**

In `js/enemies.js`, add after the closing `}` of `drawZombie()`:

```javascript
// === DRAW SKELETON ===
function drawSkeleton(enemy) {
  const sx = enemy.x - camera.x;
  const sy = enemy.y;
  const f = enemy.facing || -1;

  ctx.save();
  ctx.shadowColor = COLORS.skeleton;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = COLORS.skeleton;
  ctx.lineWidth = 1.5;
  ctx.translate(sx, sy);
  ctx.scale(f * -1, 1);

  // Skull
  ctx.beginPath();
  ctx.arc(0, -42, 6, 0, Math.PI * 2);
  ctx.stroke();
  // Jaw
  ctx.beginPath();
  ctx.moveTo(-4, -37);
  ctx.lineTo(0, -34);
  ctx.lineTo(4, -37);
  ctx.stroke();

  // Spine
  ctx.beginPath();
  ctx.moveTo(0, -36);
  ctx.lineTo(0, -14);
  ctx.stroke();

  // Ribcage
  for (let i = 0; i < 3; i++) {
    const ry = -32 + i * 5;
    ctx.beginPath();
    ctx.moveTo(-6, ry);
    ctx.quadraticCurveTo(0, ry + 3, 6, ry);
    ctx.stroke();
  }

  // Bow arm (front arm holding bow)
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(12, -24);
  ctx.stroke();

  // Bow
  ctx.beginPath();
  ctx.arc(16, -24, 8, -Math.PI * 0.7, Math.PI * 0.7);
  ctx.stroke();
  // Bowstring
  ctx.beginPath();
  ctx.moveTo(16 + Math.cos(-Math.PI * 0.7) * 8, -24 + Math.sin(-Math.PI * 0.7) * 8);
  ctx.lineTo(16 + Math.cos(Math.PI * 0.7) * 8, -24 + Math.sin(Math.PI * 0.7) * 8);
  ctx.stroke();

  // Back arm
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(-8, -20);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(5, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(-5, 0);
  ctx.stroke();

  ctx.restore();
}
```

- [ ] **Step 2: Verify visually**

Open browser console: `enemies.push({ type: 'skeleton', x: player.x + 200, y: GROUND_Y, w: 28, h: 48, hp: 2, speed: 40, facing: -1, points: 30, shootTimer: 1.5 });`

Verify a white wireframe skeleton with bow appears.

- [ ] **Step 3: Commit**

```bash
git add js/enemies.js
git commit -m "feat: add skeleton wireframe drawing with bow"
```

---

### Task 4: Draw Warden

**Files:**
- Modify: `js/enemies.js` (add `drawWarden()` after `drawSkeleton()`)

- [ ] **Step 1: Add drawWarden function**

In `js/enemies.js`, add after the closing `}` of `drawSkeleton()`:

```javascript
// === DRAW WARDEN ===
function drawWarden(entity) {
  const sx = entity.x - camera.x;
  const sy = entity.y;

  ctx.save();
  ctx.shadowColor = COLORS.warden;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = COLORS.warden;
  ctx.lineWidth = 3;
  ctx.translate(sx, sy);

  // Head (smooth, no eyes)
  ctx.beginPath();
  ctx.ellipse(0, -78, 12, 10, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Antennae
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, -86);
  ctx.quadraticCurveTo(-10, -100, -4, -105);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(6, -86);
  ctx.quadraticCurveTo(10, -100, 4, -105);
  ctx.stroke();

  // Antenna tips (small circles)
  ctx.beginPath();
  ctx.arc(-4, -105, 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(4, -105, 3, 0, Math.PI * 2);
  ctx.stroke();

  // Neck
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -68);
  ctx.lineTo(0, -60);
  ctx.stroke();

  // Torso (wide)
  ctx.beginPath();
  ctx.moveTo(-20, -60);
  ctx.lineTo(20, -60);
  ctx.lineTo(18, -20);
  ctx.lineTo(-18, -20);
  ctx.closePath();
  ctx.stroke();

  // Pulsating soul core
  const pulse = 0.5 + 0.5 * Math.sin(gameTime * 3);
  ctx.shadowBlur = 20 + pulse * 15;
  ctx.strokeStyle = `rgba(0, 206, 209, ${0.4 + pulse * 0.6})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -42, 8 + pulse * 2, 0, Math.PI * 2);
  ctx.stroke();
  // Inner core
  ctx.beginPath();
  ctx.arc(0, -42, 3, 0, Math.PI * 2);
  ctx.stroke();

  // Reset style
  ctx.strokeStyle = COLORS.warden;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 3;

  // Arms (massive)
  ctx.beginPath();
  ctx.moveTo(-20, -55);
  ctx.lineTo(-35, -40);
  ctx.lineTo(-38, -20);
  ctx.lineTo(-30, -10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, -55);
  ctx.lineTo(35, -40);
  ctx.lineTo(38, -20);
  ctx.lineTo(30, -10);
  ctx.stroke();

  // Fists
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-30, -8, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(30, -8, 5, 0, Math.PI * 2);
  ctx.stroke();

  // Legs (thick, sturdy)
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-10, -20);
  ctx.lineTo(-12, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, -20);
  ctx.lineTo(12, 0);
  ctx.stroke();

  // Noise detection ring (visual feedback)
  if (wardenPhase === 'stealth' || wardenPhase === 'detected') {
    let ringColor;
    if (noiseLevel < 30) ringColor = 'rgba(76, 175, 80, 0.3)';
    else if (noiseLevel < 60) ringColor = 'rgba(255, 235, 59, 0.4)';
    else ringColor = 'rgba(244, 67, 54, 0.5)';
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    const ringRadius = 60 + noiseLevel * 0.5;
    ctx.beginPath();
    ctx.arc(0, -45, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}
```

- [ ] **Step 2: Verify visually**

Open browser console:
```javascript
wardenPhase = 'stealth'; noiseLevel = 20;
wardenEntity = { x: player.x + 300, y: GROUND_Y };
```
Then in `draw()` you won't see it yet (no dispatch), so just verify no errors. Full visual test comes in Task 7.

- [ ] **Step 3: Commit**

```bash
git add js/enemies.js
git commit -m "feat: add warden wireframe drawing with pulsating core and noise ring"
```

---

### Task 5: Zombie Spawn and Rage Behavior

**Files:**
- Modify: `js/enemies.js` (update `spawnEnemies()`, lines 137-183)
- Modify: `js/game.js` (update `update()` for zombie rage, update `draw()` for dispatch, update `resetGame()`, update enemy death particle colors)

- [ ] **Step 1: Add zombie spawn to spawnEnemies()**

In `js/enemies.js`, inside `spawnEnemies()`, add after the beetle spawn block (after line 160, before the `if (gameTime > 30)` block):

```javascript
  // Zombie spawn (from 200m)
  if (distance >= 200) {
    let zombieInterval;
    if (distance < 500) zombieInterval = 3.0;
    else if (distance < 1500) zombieInterval = 2.0;
    else zombieInterval = 1.2;

    zombieSpawnTimer -= dt;
    if (zombieSpawnTimer <= 0) {
      zombieSpawnTimer = zombieInterval + Math.random() * zombieInterval * 0.4;
      const count = Math.random() < 0.3 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        enemies.push({
          type: 'zombie',
          x: camera.x + canvas.width + 60 + i * 50,
          y: GROUND_Y,
          w: 30, h: 45,
          hp: 2,
          speed: 60,
          facing: -1,
          points: 15,
          rage: false,
        });
      }
    }
  }
```

- [ ] **Step 2: Add zombie rage logic to update()**

In `js/game.js`, the melee hit section (lines 61-70) currently does `e.hp -= 1`. Replace that entire `if` block (lines 61-70) with:

```javascript
  if ((keys['z'] || keys['Z'] || keys['y'] || keys['Y']) && player.meleeCooldown <= 0) {
    player.meleeCooldown = 0.3;
    player.meleeTimer = 0.15;
    const hitbox = meleeHitbox();
    enemies.forEach(e => {
      if (rectsOverlap(hitbox, { x: e.x - e.w / 2, y: e.y, w: e.w, h: e.h })) {
        e.hp -= 1;
        if (e.type === 'zombie' && e.hp > 0 && !e.rage) {
          e.rage = true;
          e.speed = 220;
          e.points = 25;
        }
      }
    });
  }
```

- [ ] **Step 3: Update draw() enemy dispatch**

In `js/game.js`, replace the enemy draw loop (lines 163-166):

```javascript
  enemies.forEach(e => {
    if (e.type === 'bug') drawBeetle(e);
    else if (e.type === 'zombie') drawZombie(e);
    else if (e.type === 'skeleton') drawSkeleton(e);
    else drawTRex(e);
  });
```

- [ ] **Step 4: Update death particle color mapping**

In `js/game.js`, replace the death particle line (line 123):

```javascript
      spawnDeathParticles(e.x, e.y - e.h / 2, COLORS[e.type] || COLORS.dino);
```

This uses `COLORS.bug`, `COLORS.zombie`, `COLORS.skeleton`, `COLORS.dino` automatically based on type.

- [ ] **Step 5: Update resetGame() with new timers**

In `js/game.js`, inside `resetGame()`, add after `dinoSpawnTimer = 8;` (line 203):

```javascript
  zombieSpawnTimer = 3;
  skeletonSpawnTimer = 5;
  nextWardenDistance = 2000;
  wardenPhase = 'none';
  wardenTimer = 0;
  wardenEntity = null;
  noiseLevel = 0;
  wardenOverlayAlpha = 0;
  wardenDetected = false;
```

- [ ] **Step 6: Verify and commit**

Open browser, play past 200m. Verify:
- Green zombies spawn and walk slowly left
- Hitting a zombie once with melee makes it blink bright green and speed up
- Hitting a raged zombie again kills it with green particles
- Shooting a zombie kills it instantly (2 dmg, 2 HP)

```bash
git add js/enemies.js js/game.js
git commit -m "feat: add zombie spawning with rage mechanic on damage"
```

---

### Task 6: Skeleton Spawn, Retreat AI, and Arrow Shooting

**Files:**
- Modify: `js/enemies.js` (add skeleton spawn to `spawnEnemies()`)
- Modify: `js/game.js` (add skeleton AI in `update()`, hostile projectile handling)
- Modify: `js/projectiles.js` (render arrows differently from player projectiles)

- [ ] **Step 1: Add skeleton spawn to spawnEnemies()**

In `js/enemies.js`, inside `spawnEnemies()`, add after the zombie spawn block (before the T-Rex `if (gameTime > 30)` block):

```javascript
  // Skeleton spawn (from 500m)
  if (distance >= 500) {
    let skeletonInterval;
    if (distance < 500) skeletonInterval = 5.0;
    else if (distance < 1500) skeletonInterval = 3.5;
    else skeletonInterval = 2.0;

    skeletonSpawnTimer -= dt;
    if (skeletonSpawnTimer <= 0) {
      skeletonSpawnTimer = skeletonInterval + Math.random() * skeletonInterval * 0.3;
      enemies.push({
        type: 'skeleton',
        x: camera.x + canvas.width + 60,
        y: GROUND_Y,
        w: 28, h: 48,
        hp: 2,
        speed: 40,
        facing: -1,
        points: 30,
        shootTimer: 1.5,
      });
    }
  }
```

- [ ] **Step 2: Add skeleton AI to update()**

In `js/game.js`, replace the simple enemy movement block (lines 102-104):

```javascript
  enemies.forEach(e => {
    if (e.type === 'skeleton') {
      const distToPlayer = e.x - player.x;
      if (distToPlayer < 250 && distToPlayer > 0) {
        // Retreat: move right to keep distance
        e.x += 80 * dt;
        e.facing = -1;
      } else {
        e.x -= e.speed * dt;
      }

      // Shoot arrows
      e.shootTimer -= dt;
      if (e.shootTimer <= 0) {
        e.shootTimer = 1.5;
        const dir = player.x < e.x ? -1 : 1;
        projectiles.push({
          x: e.x + dir * 20,
          y: e.y - 24,
          dir: dir,
          speed: 350,
          hostile: true,
        });
      }
    } else {
      e.x -= e.speed * dt;
    }
  });
```

- [ ] **Step 3: Add hostile projectile vs player collision**

In `js/game.js`, add after the existing enemy-player collision block (after line 118, after the `});` closing the enemy collision loop), add:

```javascript
  // Hostile projectile (arrow) hits player
  if (player.invincible <= 0 && gameState !== 'gameOver') {
    projectiles = projectiles.filter(p => {
      if (!p.hostile) return true;
      const px = player.x;
      const py = player.y;
      if (p.x > px && p.x < px + player.w && p.y > py - player.h && p.y < py) {
        player.lives--;
        player.invincible = 1.5;
        screenShake = 0.3;
        if (player.lives <= 0) {
          endGame();
        }
        return false;
      }
      return true;
    });
  }
```

- [ ] **Step 4: Add player projectile vs arrow collision**

In `js/game.js`, in the existing projectile-enemy collision filter (lines 88-97), add arrow-vs-arrow collision. Replace that block with:

```javascript
  projectiles = projectiles.filter(p => {
    if (p.hostile) return true; // hostile arrows don't hit enemies
    for (const e of enemies) {
      const ex = e.x - e.w / 2;
      if (p.x > ex && p.x < ex + e.w && p.y > e.y - e.h && p.y < e.y) {
        e.hp -= 2;
        if (e.type === 'zombie' && e.hp > 0 && !e.rage) {
          e.rage = true;
          e.speed = 220;
          e.points = 25;
        }
        return false;
      }
    }
    return true;
  });

  // Player projectile vs hostile arrow collision (both destroyed)
  const playerShots = projectiles.filter(p => !p.hostile);
  const arrows = projectiles.filter(p => p.hostile);
  const destroyedPlayerShots = new Set();
  const destroyedArrows = new Set();
  for (let i = 0; i < playerShots.length; i++) {
    for (let j = 0; j < arrows.length; j++) {
      const ps = playerShots[i];
      const ar = arrows[j];
      if (Math.abs(ps.x - ar.x) < 12 && Math.abs(ps.y - ar.y) < 8) {
        destroyedPlayerShots.add(ps);
        destroyedArrows.add(ar);
      }
    }
  }
  if (destroyedPlayerShots.size > 0 || destroyedArrows.size > 0) {
    projectiles = projectiles.filter(p => !destroyedPlayerShots.has(p) && !destroyedArrows.has(p));
  }
```

- [ ] **Step 5: Update projectile rendering for arrows**

In `js/projectiles.js`, replace the entire function with:

```javascript
// === DRAW PROJECTILES ===
function drawProjectiles() {
  ctx.save();

  projectiles.forEach(p => {
    const sx = p.x - camera.x;

    if (p.hostile) {
      // Arrow (hostile) — white thin line with small trail
      ctx.shadowColor = COLORS.arrow;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = COLORS.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, p.y);
      ctx.lineTo(sx - p.dir * 16, p.y);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(sx, p.y);
      ctx.lineTo(sx - p.dir * 5, p.y - 4);
      ctx.moveTo(sx, p.y);
      ctx.lineTo(sx - p.dir * 5, p.y + 4);
      ctx.stroke();
    } else {
      // Player projectile — cyan with trail
      ctx.shadowColor = COLORS.projectile;
      ctx.shadowBlur = 10;
      for (let i = 1; i <= 3; i++) {
        const alpha = (1 - i * 0.3).toFixed(1);
        ctx.fillStyle = `rgba(0, 188, 212, ${alpha})`;
        ctx.fillRect(sx - p.dir * i * 8, p.y - 2, 10, 4);
      }
      ctx.fillStyle = COLORS.projectile;
      ctx.fillRect(sx, p.y - 3, 12, 6);
    }
  });
  ctx.restore();
}
```

- [ ] **Step 6: Verify and commit**

Open browser, play past 500m. Verify:
- White skeletons spawn and walk left slowly
- When player approaches, skeleton stops and retreats right
- Skeleton fires white arrows every 1.5s toward player
- Arrows damage player on contact
- Player projectile destroys arrow when they collide
- Shooting skeleton kills it (2 dmg = instant kill)

```bash
git add js/enemies.js js/game.js js/projectiles.js
git commit -m "feat: add skeleton with retreat AI, arrow shooting, and projectile collision"
```

---

### Task 7: Warden Sequence

**Files:**
- Modify: `js/game.js` (warden trigger, state machine in `update()`, warden drawing in `draw()`)
- Modify: `js/ui.js` (warden overlay, noise meter HUD)

- [ ] **Step 1: Add warden trigger check to update()**

In `js/game.js`, in `update()`, add after the distance/score update block (after line 54 area, after `distance = newDistance;`):

```javascript
  // Warden sequence trigger
  if (gameState === 'playing' && distance >= nextWardenDistance) {
    gameState = 'warden';
    wardenPhase = 'intro';
    wardenTimer = 2.0;
    wardenEntity = { x: camera.x + canvas.width + 100, y: GROUND_Y };
    noiseLevel = 0;
    wardenDetected = false;
    wardenOverlayAlpha = 0;
  }
```

- [ ] **Step 2: Add warden state machine to update()**

In `js/game.js`, add a new `updateWarden(dt)` function before the `update()` function:

```javascript
// === WARDEN UPDATE ===
function updateWarden(dt) {
  // Player can still move during warden (but it makes noise)
  player.vx = 0;
  const moving = keys['ArrowLeft'] || keys['ArrowRight'];
  if (keys['ArrowLeft']) { player.vx = -PLAYER_SPEED; player.facing = -1; }
  if (keys['ArrowRight']) { player.vx = PLAYER_SPEED; player.facing = 1; }
  if (keys['ArrowUp'] && player.onGround) {
    player.vy = JUMP_FORCE;
    player.onGround = false;
    noiseLevel = Math.min(100, noiseLevel + 5);
  }

  // Physics
  player.vy += GRAVITY * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  if (player.x < 0) player.x = 0;

  // Ground collision
  player.onGround = false;
  for (const seg of terrainSegments) {
    if (player.x + player.w > seg.x && player.x < seg.x + seg.w) {
      if (player.y >= seg.y && player.y - player.h < seg.y + seg.h) {
        if (player.vy >= 0) {
          player.y = seg.y;
          player.vy = 0;
          player.onGround = true;
        }
      }
    }
  }

  camera.x = player.x - 250;
  if (player.invincible > 0) player.invincible -= dt;

  // Noise system
  if (moving) {
    noiseLevel = Math.min(100, noiseLevel + 3 * dt);
  } else {
    noiseLevel = Math.max(0, noiseLevel - 2 * dt);
  }

  // Phase state machine
  switch (wardenPhase) {
    case 'intro':
      wardenOverlayAlpha = Math.min(0.5, wardenOverlayAlpha + dt * 0.25);
      screenShake = 0.15;
      wardenTimer -= dt;
      wardenEntity.x -= 30 * dt;
      if (wardenTimer <= 0) {
        wardenPhase = 'stealth';
        wardenTimer = 11; // 10-12s, use 11
      }
      break;

    case 'stealth':
      wardenEntity.x -= 30 * dt;
      wardenTimer -= dt;

      if (noiseLevel > 80 && !wardenDetected) {
        wardenDetected = true;
        wardenPhase = 'detected';
        wardenTimer = 0.3; // pause before attack
      }

      if (wardenTimer <= 0 || wardenEntity.x < camera.x - 100) {
        wardenPhase = 'exit';
        wardenTimer = 1.5;
      }
      break;

    case 'detected':
      wardenTimer -= dt;
      if (wardenTimer <= 0) {
        // Sonic wave — damage player
        screenShake = 0.5;
        if (player.invincible <= 0) {
          player.lives -= 2;
          player.invincible = 2.0;
          if (player.lives <= 0) {
            endGame();
            return;
          }
        }
        // Spawn sonic wave particles
        for (let i = 0; i < 20; i++) {
          const angle = (Math.PI * 2 * i) / 20;
          particles.push({
            x: wardenEntity.x,
            y: wardenEntity.y - 42,
            vx: Math.cos(angle) * 300,
            vy: Math.sin(angle) * 300,
            size: 3,
            life: 0.8,
            color: COLORS.warden,
          });
        }
        wardenPhase = 'exit';
        wardenTimer = 2.0;
      }
      break;

    case 'exit':
      wardenEntity.x -= 50 * dt; // walk away faster
      wardenOverlayAlpha = Math.max(0, wardenOverlayAlpha - dt * 0.5);
      wardenTimer -= dt;
      if (wardenTimer <= 0) {
        gameState = 'playing';
        wardenPhase = 'none';
        wardenEntity = null;
        wardenOverlayAlpha = 0;
        noiseLevel = 0;
        if (!wardenDetected) {
          score += 100; // bonus for surviving undetected
        }
        nextWardenDistance = distance + 1500 + Math.random() * 1000;
      }
      break;
  }

  // Update particles during warden too
  particles.forEach(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 200 * dt;
    p.life -= dt * 1.5;
  });
  particles = particles.filter(p => p.life > 0);

  if (screenShake > 0) screenShake -= dt;
}
```

- [ ] **Step 3: Wire warden into update()**

In `js/game.js`, at the top of `update()`, after the `gameOver` check (after line 10), add:

```javascript
  if (gameState === 'warden') {
    updateWarden(dt);
    return;
  }
```

- [ ] **Step 4: Wire warden into draw()**

In `js/game.js`, in `draw()`, after `drawHUD();` (line 174) and before `if (gameState === 'gameOver')` (line 176), add:

```javascript
  // Warden overlay and entity
  if (gameState === 'warden' && wardenEntity) {
    // Dark overlay
    if (wardenOverlayAlpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${wardenOverlayAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Redraw terrain/player on top of overlay for visibility
    ctx.save();
    if (screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * screenShake * 20;
      const shakeY = (Math.random() - 0.5) * screenShake * 20;
      ctx.translate(shakeX, shakeY);
    }
    drawTerrain();
    drawPlayer();
    drawWarden(wardenEntity);
    drawParticles();
    ctx.restore();

    drawWardenHUD();
  }
```

- [ ] **Step 5: Add drawWardenHUD to ui.js**

In `js/ui.js`, add at the end of the file:

```javascript
// === DRAW WARDEN HUD ===
function drawWardenHUD() {
  ctx.save();

  // Noise meter bar at top center
  const barW = 200;
  const barH = 8;
  const barX = (canvas.width - barW) / 2;
  const barY = 50;

  // Background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(barX, barY, barW, barH);

  // Fill based on noise level
  let fillColor;
  if (noiseLevel < 30) fillColor = COLORS.player; // green
  else if (noiseLevel < 60) fillColor = '#FFEB3B'; // yellow
  else fillColor = '#f44336'; // red

  ctx.shadowColor = fillColor;
  ctx.shadowBlur = 8;
  ctx.fillStyle = fillColor;
  ctx.fillRect(barX, barY, barW * (noiseLevel / 100), barH);

  // Label
  ctx.shadowBlur = 6;
  ctx.fillStyle = COLORS.warden;
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NOISE', canvas.width / 2, barY - 5);

  // Warning text during danger
  if (noiseLevel > 60) {
    ctx.shadowColor = '#f44336';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#f44336';
    ctx.font = 'bold 14px monospace';
    const blink = Math.floor(Date.now() / 300) % 2 === 0;
    if (blink) ctx.fillText('! STAY STILL !', canvas.width / 2, barY + 28);
  }

  ctx.textAlign = 'left';
  ctx.restore();
}
```

- [ ] **Step 6: Fix draw() to handle warden gameState**

In `js/game.js`, the `draw()` function's start screen check works, but we need the warden state to render the normal background first. The existing `draw()` flow already handles this because `gameState === 'warden'` is neither `'start'` nor triggers `drawGameOver()`. The background, parallax, terrain, and player draw normally. The warden overlay is added after `drawHUD()`. This should work without changes to the existing flow.

Verify: the draw flow for warden state will be:
1. Clear canvas, fill bg
2. Screen shake transform
3. drawParallax, drawTerrain, enemies (none during warden), drawProjectiles, drawPlayer, drawParticles
4. drawHUD
5. Warden overlay (darkens screen) + redraw terrain/player/warden on top
6. drawWardenHUD (noise meter)

- [ ] **Step 7: Verify and commit**

To test quickly, temporarily set `nextWardenDistance = 50` in `js/state.js`. Open browser, play past 50m. Verify:
- Screen darkens when warden triggers
- Large turquoise wireframe creature appears and walks left
- Noise meter appears at top
- Standing still: meter stays green and decreases
- Moving: meter rises through yellow to red
- If noise > 80: warden pauses, then sonic blast (screen shake, particles, -2 lives)
- If survived silently: warden exits, +100 score, game resumes

Reset `nextWardenDistance = 2000` after testing.

```bash
git add js/game.js js/ui.js
git commit -m "feat: add warden stealth sequence with noise system and sonic wave attack"
```

---

### Task 8: Update Start Screen and Final Polish

**Files:**
- Modify: `js/ui.js` (start screen enemy descriptions)
- Modify: `js/game.js` (ensure warden sequence doesn't break on fall-off)

- [ ] **Step 1: Update start screen enemy info**

In `js/ui.js`, in `drawStartScreen()`, replace the enemies info section (lines 120-130):

```javascript
  // Enemies info
  ctx.textAlign = 'center';
  ctx.font = '13px monospace';
  ctx.shadowBlur = 6;

  const enemyInfo = [
    { text: 'Beetles (red) \u2014 fast, 1 HP, melee them!', color: COLORS.bug },
    { text: 'Zombies (green) \u2014 slow but rage when hit!', color: COLORS.zombie },
    { text: 'Skeletons (white) \u2014 shoot arrows, keep distance!', color: COLORS.skeleton },
    { text: 'T-Rex (orange) \u2014 tough, 3 HP, shoot them!', color: COLORS.dino },
    { text: 'Warden (cyan) \u2014 stay still or face the sonic blast!', color: COLORS.warden },
  ];

  enemyInfo.forEach((info, i) => {
    ctx.shadowColor = info.color;
    ctx.fillStyle = info.color;
    ctx.fillText('\u2666 ' + info.text, cx, 405 + i * 20);
  });
```

- [ ] **Step 2: Prevent fall-off death during warden**

In `js/game.js`, in `updateWarden()`, add fall-off protection after the ground collision loop:

```javascript
  if (player.y > canvas.height + 50) {
    player.y = GROUND_Y - 100;
    player.vy = 0;
  }
```

- [ ] **Step 3: Verify full game flow and commit**

Open browser and verify full game flow:
1. Start screen shows all 5 enemy types
2. Beetles from start — melee kills work
3. Zombies from 200m — rage on first hit works
4. Skeletons from 500m — shoot arrows, retreat works, arrow-projectile collision works
5. T-Rex from 30s — unchanged behavior
6. Warden at 2000m — stealth sequence works, noise meter, sonic wave

```bash
git add js/ui.js js/game.js
git commit -m "feat: update start screen with all enemy types, polish warden sequence"
```

---

### Task Summary

| Task | What | Files |
|---|---|---|
| 1 | Constants & state variables | `constants.js`, `state.js` |
| 2 | Zombie drawing | `enemies.js` |
| 3 | Skeleton drawing | `enemies.js` |
| 4 | Warden drawing | `enemies.js` |
| 5 | Zombie spawn + rage + game integration | `enemies.js`, `game.js` |
| 6 | Skeleton spawn + AI + arrows + collisions | `enemies.js`, `game.js`, `projectiles.js` |
| 7 | Warden sequence state machine + UI | `game.js`, `ui.js` |
| 8 | Start screen update + polish | `ui.js`, `game.js` |
