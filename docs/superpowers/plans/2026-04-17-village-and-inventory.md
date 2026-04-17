# Village & Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a yellow safe-zone "village" biome, a modal inventory window opened with `I`, six collectible items (egg, coin, key, potion, sword, wand), a helper bird that hatches from eggs, and a paged help screen on the start menu.

**Architecture:** Additive — two new files (`js/village.js`, `js/inventory.js`) plus targeted edits to existing files. Village is a world-space zone tracked in a `villages[]` array with flat terrain and paused enemy spawns inside. Inventory uses a new `gameState = 'paused'` that short-circuits `update()` while still rendering. Items live in a single `inventorySlots` counter object. Active effects (potion/sword/wand) are timers on the `player` object, applied at the existing movement/attack sites.

**Tech Stack:** Vanilla JS, Canvas 2D, no build tools or test framework. Verification is visual — open `index.html` in a browser and play. Every task ends with a manual verification step and a commit.

**Spec:** `docs/superpowers/specs/2026-04-17-village-and-inventory-design.md`

**Coding style:** Follow existing patterns — globals in `state.js`, constants in `constants.js`, one responsibility per file. No comments unless a WHY is non-obvious. Neon rendering = `ctx.shadowColor + ctx.shadowBlur + strokeStyle/fillStyle`.

---

### Task 1: Add Constants and State

**Files:**
- Modify: `js/constants.js`
- Modify: `js/state.js`

- [ ] **Step 1: Extend the COLORS object**

In `js/constants.js`, replace the COLORS block (lines 7–26):

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
  rocket: '#FF6600',
  health: '#FF69B4',
  food: '#FFA726',
  hungerBar: '#FF9800',
  bird: '#E040FB',
  wings: '#CE93D8',
  village: '#FFEB3B',
  coin: '#FFD700',
  egg: '#CE93D8',
  key: '#FFEB3B',
  potion: '#29B6F6',
  sword: '#BDBDBD',
  wand: '#F06292',
  magic: '#F48FB1',
};
```

- [ ] **Step 2: Add village + item constants**

Append to the end of `js/constants.js`:

```javascript
const VILLAGE_LENGTH = 400;
const VILLAGE_INTERVAL = 800;
const FIRST_VILLAGE_DISTANCE = 600;
const EGG_DROP_CHANCE = 0.2;

const ITEM_PRICES = { key: 5, potion: 10, sword: 15, wand: 20 };
const ITEM_ORDER = ['egg', 'coin', 'key', 'potion', 'sword', 'wand'];

const POTION_DURATION = 5;
const SWORD_DURATION = 10;
const WAND_SHOTS = 3;
const HELPER_BIRD_DURATION = 15;
```

- [ ] **Step 3: Add new state variables**

In `js/state.js`, add to the `player` object (inside the existing `const player = { ... }` block, before the closing `}`):

```javascript
  speedBoostTimer: 0,
  swordTimer: 0,
  wandShots: 0,
```

Append to the end of `js/state.js`:

```javascript
// === VILLAGES ===
let villages = [];
let currentVillage = null;
let nextVillageDistance = FIRST_VILLAGE_DISTANCE;

// === ITEM PICKUPS (ground) ===
let itemPickups = []; // { type: 'egg'|'coin'|'key'|'potion', x, y }

// === INVENTORY ===
let inventoryOpen = false;
let inventorySlots = { egg: 0, coin: 0, key: 0, potion: 0, sword: 0, wand: 0 };
let inventoryCursor = { x: 480, y: 270, slotIndex: -1 };

// === SHOP / CHEST MODALS ===
let shopOpen = false;
let shopCursor = { x: 480, y: 270, slotIndex: -1 };
let shopMessage = ''; // e.g. "NEED 5 COINS"
let shopMessageTimer = 0;

// === HELPER BIRD ===
let helperBird = null; // { x, y, angle, timer, shootTimer }

// === HELP SCREEN ===
let helpPage = 0;

// === MOUSE ===
let mouseX = 0, mouseY = 0;
```

- [ ] **Step 4: Verify and commit**

Open `index.html` in a browser. Game should run exactly as before — no visual changes.

```bash
git add js/constants.js js/state.js
git commit -m "feat: add constants and state for village + inventory"
```

---

### Task 2: Wire in New JS Files

**Files:**
- Create: `js/village.js`
- Create: `js/inventory.js`
- Modify: `index.html`

- [ ] **Step 1: Create empty `js/village.js`**

Create `js/village.js` with this placeholder content:

```javascript
// === VILLAGE ===
function updateVillages() {
  if (gameState !== 'playing') return;

  if (distance >= nextVillageDistance) {
    const xStart = terrainNextX + 100;
    villages.push({
      xStart,
      xEnd: xStart + VILLAGE_LENGTH,
      buildings: [],
      chest: null,
      coins: [],
      signX: xStart,
    });
    nextVillageDistance = distance + VILLAGE_INTERVAL;
  }

  currentVillage = villages.find(v => player.x >= v.xStart && player.x <= v.xEnd) || null;
  villages = villages.filter(v => v.xEnd > camera.x - 200);
}

function drawVillages() {}
```

- [ ] **Step 2: Create empty `js/inventory.js`**

Create `js/inventory.js` with this placeholder content:

```javascript
// === INVENTORY ===
function toggleInventory() {
  if (gameState === 'playing') {
    inventoryOpen = true;
    gameState = 'paused';
  } else if (gameState === 'paused') {
    inventoryOpen = false;
    gameState = 'playing';
    lastTime = null;
  }
}

function updateInventoryCursor(dt) {}
function drawInventory() {}

function useInventoryItem(type) {}
```

- [ ] **Step 3: Add script tags to `index.html`**

Replace the body script section (lines 10–21):

```html
<script src="js/constants.js"></script>
<script src="js/state.js"></script>
<script src="js/input.js"></script>
<script src="js/terrain.js"></script>
<script src="js/parallax.js"></script>
<script src="js/player.js"></script>
<script src="js/enemies.js"></script>
<script src="js/projectiles.js"></script>
<script src="js/particles.js"></script>
<script src="js/village.js"></script>
<script src="js/inventory.js"></script>
<script src="js/ui.js"></script>
<script src="js/collision.js"></script>
<script src="js/game.js"></script>
```

- [ ] **Step 4: Verify and commit**

Reload `index.html`. Open the browser devtools console — no errors. Game plays normally.

```bash
git add js/village.js js/inventory.js index.html
git commit -m "feat: add village.js and inventory.js stubs wired into index.html"
```

---

### Task 3: Inventory Toggle + Modal Rendering

**Files:**
- Modify: `js/input.js`
- Modify: `js/inventory.js`
- Modify: `js/game.js`

- [ ] **Step 1: Register `I` and `Escape` keys**

In `js/input.js`, replace line 3:

```javascript
const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'z', 'Z', 'y', 'Y', 'x', 'X', 'c', 'C', 'i', 'I', 'h', 'H', 'Escape', ' ', 'Enter', '1', '2', '3', '4', '5', '6'];
```

Append to `js/input.js` (after the cheat-code block):

```javascript
// Edge-triggered keys (one-shot on press)
const _prevKeys = {};
function keyPressed(k) {
  const p = keys[k] && !_prevKeys[k];
  return p;
}
function updateKeyEdges() {
  for (const k of GAME_KEYS) _prevKeys[k] = keys[k];
}

// Mouse position tracking
window.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
});

let mouseClicked = false;
window.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
  mouseClicked = true;
});
```

- [ ] **Step 2: Implement `drawInventory()`**

In `js/inventory.js`, replace `function drawInventory() {}` with:

```javascript
function drawInventory() {
  if (!inventoryOpen) return;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const panelW = 600, panelH = 260;
  const px = (canvas.width - panelW) / 2;
  const py = (canvas.height - panelH) / 2;

  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = COLORS.player;
  ctx.lineWidth = 2;
  ctx.strokeRect(px, py, panelW, panelH);

  ctx.fillStyle = COLORS.player;
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('INVENTORY', px + panelW / 2, py + 32);

  const slotW = 72, slotH = 72, gap = 14;
  const slotsW = ITEM_ORDER.length * slotW + (ITEM_ORDER.length - 1) * gap;
  const startX = px + (panelW - slotsW) / 2;
  const slotY = py + 60;

  ITEM_ORDER.forEach((type, i) => {
    const sx = startX + i * (slotW + gap);
    const count = inventorySlots[type];
    const color = COLORS[type];
    const active = i === inventoryCursor.slotIndex;

    ctx.shadowColor = color;
    ctx.shadowBlur = active ? 16 : 6;
    ctx.strokeStyle = count > 0 ? color : '#444';
    ctx.lineWidth = active ? 3 : 2;
    ctx.strokeRect(sx, slotY, slotW, slotH);

    ctx.fillStyle = count > 0 ? color : '#666';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(type[0].toUpperCase(), sx + slotW / 2, slotY + 44);

    ctx.font = '14px monospace';
    ctx.fillText('x' + count, sx + slotW / 2, slotY + 64);
  });

  ctx.shadowBlur = 4;
  ctx.fillStyle = '#888';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CLICK or SPACE to use — I or ESC to close', px + panelW / 2, py + panelH - 18);

  ctx.shadowBlur = 12;
  ctx.shadowColor = COLORS.melee;
  ctx.strokeStyle = COLORS.melee;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(inventoryCursor.x - 8, inventoryCursor.y);
  ctx.lineTo(inventoryCursor.x + 8, inventoryCursor.y);
  ctx.moveTo(inventoryCursor.x, inventoryCursor.y - 8);
  ctx.lineTo(inventoryCursor.x, inventoryCursor.y + 8);
  ctx.stroke();

  ctx.restore();
  ctx.textAlign = 'left';
}
```

- [ ] **Step 3: Hook toggle + draw into `game.js`**

In `js/game.js`, find the `update(dt)` function and replace the top (lines 142–157) with:

```javascript
function update(dt) {
  if (gameState === 'start') {
    if (keys['Enter']) { gameState = 'playing'; }
    if (keys['h'] || keys['H']) { gameState = 'help'; helpPage = 0; lastTime = null; }
    updateKeyEdges();
    return;
  }

  if (gameState === 'help') {
    updateKeyEdges();
    return;
  }

  if (gameState === 'gameOver') {
    if (keys['Enter']) resetGame();
    updateKeyEdges();
    return;
  }

  if (gameState === 'warden') {
    updateWarden(dt);
    updateKeyEdges();
    return;
  }

  if (keyPressed('i') || keyPressed('I')) {
    toggleInventory();
  }

  if (gameState === 'paused') {
    updateInventoryCursor(dt);
    if (keyPressed('Escape')) toggleInventory();
    updateKeyEdges();
    mouseClicked = false;
    return;
  }
```

(Keep the rest of `update(dt)` body unchanged from `gameTime += dt;` onward.)

At the **very end** of `update(dt)`, just before its closing `}`, add:

```javascript
  updateKeyEdges();
  mouseClicked = false;
}
```

(Remove the existing closing `}` of `update` first, then add the two lines plus new `}`. Or delete the old closing brace and append.)

In `js/game.js`, find `function draw()` and near the end (after `drawHUD();` on line 584) add:

```javascript
  if (inventoryOpen) drawInventory();
```

- [ ] **Step 4: Verify and commit**

Open `index.html`. Start game. Press `I` — dark panel with 6 outlined slots appears. Press `I` again — closes, game resumes. Press `Escape` while inventory open — closes. While open, movement and enemies are frozen.

```bash
git add js/input.js js/inventory.js js/game.js
git commit -m "feat: add inventory modal with I-key toggle and pause"
```

---

### Task 4: Inventory Cursor (Mouse + Keyboard + Gamepad)

**Files:**
- Modify: `js/inventory.js`
- Modify: `js/input.js`

- [ ] **Step 1: Add gamepad stick read for inventory**

In `js/input.js`, append to the `pollGamepad()` function (before its closing `}`):

```javascript
  // Inventory cursor — left stick while inventory open
  if (inventoryOpen || shopOpen) {
    _inventoryStickX = lx;
    _inventoryStickY = gp.axes[1] || 0;
    _inventoryUse = gp.buttons[0] && gp.buttons[0].pressed;
    _inventoryClose = gp.buttons[1] && gp.buttons[1].pressed; // B
  }
```

At the top of `js/input.js`, after the `const STICK_DEADZONE` line, add:

```javascript
let _inventoryStickX = 0, _inventoryStickY = 0;
let _inventoryUse = false;
let _inventoryUsePrev = false;
let _inventoryClose = false;
let _inventoryClosePrev = false;
```

And also clear these every frame at the top of `pollGamepad()` (add after the `gpKeys[k] = false;` loop):

```javascript
  _inventoryStickX = 0;
  _inventoryStickY = 0;
  _inventoryUse = false;
  _inventoryClose = false;
```

- [ ] **Step 2: Implement cursor update and slot hit-test**

In `js/inventory.js`, replace `function updateInventoryCursor(dt) {}` with:

```javascript
function getInventorySlotRects() {
  const panelW = 600, panelH = 260;
  const px = (canvas.width - panelW) / 2;
  const py = (canvas.height - panelH) / 2;
  const slotW = 72, slotH = 72, gap = 14;
  const slotsW = ITEM_ORDER.length * slotW + (ITEM_ORDER.length - 1) * gap;
  const startX = px + (panelW - slotsW) / 2;
  const slotY = py + 60;
  return ITEM_ORDER.map((type, i) => ({
    type,
    x: startX + i * (slotW + gap),
    y: slotY,
    w: slotW,
    h: slotH,
  }));
}

function updateInventoryCursor(dt) {
  if (!inventoryOpen) return;

  // Mouse move moves cursor directly
  if (mouseX !== inventoryCursor._lastMouseX || mouseY !== inventoryCursor._lastMouseY) {
    inventoryCursor.x = mouseX;
    inventoryCursor.y = mouseY;
    inventoryCursor._lastMouseX = mouseX;
    inventoryCursor._lastMouseY = mouseY;
  }

  // Gamepad stick moves cursor continuously
  if (Math.abs(_inventoryStickX) > STICK_DEADZONE) {
    inventoryCursor.x += _inventoryStickX * 250 * dt;
  }
  if (Math.abs(_inventoryStickY) > STICK_DEADZONE) {
    inventoryCursor.y += _inventoryStickY * 250 * dt;
  }

  // Arrow keys nudge by one slot
  const slots = getInventorySlotRects();
  if (keyPressed('ArrowLeft') && inventoryCursor.slotIndex > 0) {
    const s = slots[inventoryCursor.slotIndex - 1];
    inventoryCursor.x = s.x + s.w / 2;
    inventoryCursor.y = s.y + s.h / 2;
  }
  if (keyPressed('ArrowRight') && inventoryCursor.slotIndex < ITEM_ORDER.length - 1) {
    const next = Math.max(0, inventoryCursor.slotIndex) + 1;
    const s = slots[Math.min(ITEM_ORDER.length - 1, next)];
    inventoryCursor.x = s.x + s.w / 2;
    inventoryCursor.y = s.y + s.h / 2;
  }

  // Clamp to canvas
  inventoryCursor.x = Math.max(0, Math.min(canvas.width, inventoryCursor.x));
  inventoryCursor.y = Math.max(0, Math.min(canvas.height, inventoryCursor.y));

  // Compute slotIndex from position
  inventoryCursor.slotIndex = -1;
  slots.forEach((s, i) => {
    if (inventoryCursor.x >= s.x && inventoryCursor.x <= s.x + s.w &&
        inventoryCursor.y >= s.y && inventoryCursor.y <= s.y + s.h) {
      inventoryCursor.slotIndex = i;
    }
  });

  // Use trigger: click, space, or gamepad A (edge-triggered)
  const useNow = mouseClicked || keyPressed(' ') || (_inventoryUse && !_inventoryUsePrev);
  _inventoryUsePrev = _inventoryUse;
  if (useNow && inventoryCursor.slotIndex >= 0) {
    const type = ITEM_ORDER[inventoryCursor.slotIndex];
    useInventoryItem(type);
  }

  // Close via gamepad B
  const closeNow = _inventoryClose && !_inventoryClosePrev;
  _inventoryClosePrev = _inventoryClose;
  if (closeNow) toggleInventory();
}
```

- [ ] **Step 3: Stub `useInventoryItem` with a placeholder log**

In `js/inventory.js`, replace `function useInventoryItem(type) {}` with:

```javascript
function useInventoryItem(type) {
  if (type === 'coin') return;
  if (inventorySlots[type] <= 0) return;
  // Actual effects wired in later tasks — for now just decrement (test).
  // This line will be removed in Task 13; items will decrement inside their handlers.
  console.log('use', type, 'remaining', inventorySlots[type]);
}
```

- [ ] **Step 4: Temporary debug key — fill inventory with 1 of each**

In `js/game.js`, inside `update(dt)` after the `if (gameState === 'paused') { ... return; }` block, add a debug block:

```javascript
  // TEMP: debug — press 0 to get one of each item (removed in Task 14)
  if (keyPressed('0')) {
    inventorySlots.egg = 3;
    inventorySlots.coin = 10;
    inventorySlots.key = 1;
    inventorySlots.potion = 2;
    inventorySlots.sword = 1;
    inventorySlots.wand = 1;
  }
```

Also add `'0'` to the `GAME_KEYS` array in `js/input.js`:

```javascript
const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'z', 'Z', 'y', 'Y', 'x', 'X', 'c', 'C', 'i', 'I', 'h', 'H', 'Escape', ' ', 'Enter', '0', '1', '2', '3', '4', '5', '6'];
```

- [ ] **Step 5: Verify and commit**

Start game. Press `0` to fill inventory. Press `I`. All six slots show `x1` (or x3/x10/x2). Move mouse — neon crosshair follows. Hover over a slot — it glows brighter. Left/right arrows step between slots. Click a non-coin slot — browser console logs `use <type> remaining N`. Gamepad: left stick moves cursor, A uses, B closes.

```bash
git add js/input.js js/inventory.js js/game.js
git commit -m "feat: add inventory cursor (mouse/keyboard/gamepad) and slot dispatch"
```

---

### Task 5: Ground-Item Pickups (Infrastructure)

**Files:**
- Modify: `js/game.js`
- Modify: `js/inventory.js`

- [ ] **Step 1: Add pickup update + draw helpers**

In `js/inventory.js`, append:

```javascript
function drawItemPickups() {
  ctx.save();
  ctx.lineWidth = 2;
  itemPickups.forEach(p => {
    const sx = p.x - camera.x;
    if (sx < -20 || sx > canvas.width + 20) return;
    const color = COLORS[p.type];
    const bob = Math.sin(gameTime * 3 + p.x * 0.01) * 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(sx, p.y + bob);

    if (p.type === 'coin') {
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$', 0, 3);
    } else if (p.type === 'egg') {
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'key') {
      ctx.beginPath();
      ctx.arc(-4, 0, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(8, 0);
      ctx.moveTo(6, 0);
      ctx.lineTo(6, 4);
      ctx.stroke();
    } else if (p.type === 'potion') {
      ctx.beginPath();
      ctx.moveTo(-4, -6);
      ctx.lineTo(4, -6);
      ctx.moveTo(-3, -6);
      ctx.lineTo(-5, 6);
      ctx.lineTo(5, 6);
      ctx.lineTo(3, -6);
      ctx.stroke();
    }

    ctx.restore();
  });
  ctx.textAlign = 'left';
  ctx.restore();
}

function updateItemPickups() {
  itemPickups = itemPickups.filter(p => {
    if (p.x < camera.x - 100) return false;
    const dx = Math.abs((player.x + player.w / 2) - p.x);
    const dy = Math.abs((player.y - player.h / 2) - p.y);
    if (dx < 20 && dy < 25) {
      inventorySlots[p.type]++;
      if (p.type === 'coin') score += 5;
      spawnDeathParticles(p.x, p.y, COLORS[p.type]);
      return false;
    }
    return true;
  });
}
```

- [ ] **Step 2: Call them from the main loop**

In `js/game.js`, inside `update(dt)`, after the existing food-collection block (after line 399 closing `});`), add:

```javascript
  updateItemPickups();
```

In `js/game.js`, inside `draw()`, after the food-pickup draw block (after line 576 closing `});`), add:

```javascript
  drawItemPickups();
```

- [ ] **Step 3: Temporary debug — spawn a test coin on key press**

In `js/game.js`, near the existing `if (keyPressed('0'))` debug block, add:

```javascript
  if (keyPressed('9')) {
    itemPickups.push({ type: 'coin', x: player.x + 100, y: GROUND_Y - 18 });
    itemPickups.push({ type: 'egg', x: player.x + 140, y: GROUND_Y - 18 });
    itemPickups.push({ type: 'key', x: player.x + 180, y: GROUND_Y - 18 });
    itemPickups.push({ type: 'potion', x: player.x + 220, y: GROUND_Y - 18 });
  }
```

Also add `'9'` to `GAME_KEYS` in `js/input.js`.

- [ ] **Step 4: Verify and commit**

Start game. Press `9` — four items appear on the ground ahead. Run over each — see coin/egg/key/potion disappear with particles. Open inventory — counts reflect picks. Coin pickup also adds 5 points to the score (top-center HUD goes up by 20).

```bash
git add js/input.js js/inventory.js js/game.js
git commit -m "feat: add ground item pickups (coin/egg/key/potion)"
```

---

### Task 6: Village Generation + Visuals

**Files:**
- Modify: `js/village.js`
- Modify: `js/game.js`
- Modify: `js/terrain.js`

- [ ] **Step 1: Implement `updateVillages()` and `drawVillages()`**

In `js/village.js`, replace the entire file contents with:

```javascript
// === VILLAGE ===
function updateVillages() {
  if (gameState !== 'playing' && gameState !== 'paused') return;

  if (gameState === 'playing' && distance >= nextVillageDistance) {
    const xStart = terrainNextX + 100;
    const xEnd = xStart + VILLAGE_LENGTH;
    const buildings = [
      { x: xStart + 60,  w: 70, h: 90,  type: 'house' },
      { x: xStart + 170, w: 80, h: 100, type: 'shop' },
      { x: xStart + 290, w: 70, h: 85,  type: 'house' },
    ];
    const chest = { x: xStart + 370, locked: true, opened: false };
    const coins = [];
    const coinCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < coinCount; i++) {
      coins.push({ x: xStart + 80 + i * 60 + Math.random() * 30, y: GROUND_Y - 18 });
    }
    villages.push({ xStart, xEnd, buildings, chest, coins, signX: xStart + 20 });
    nextVillageDistance = distance + VILLAGE_INTERVAL;
  }

  currentVillage = villages.find(v => player.x >= v.xStart - 50 && player.x <= v.xEnd + 50) || null;
  villages = villages.filter(v => v.xEnd > camera.x - 400);
}

function drawVillageBackground() {
  if (!currentVillage) return;
  ctx.save();
  ctx.fillStyle = 'rgba(255, 235, 59, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawVillages() {
  ctx.save();
  villages.forEach(v => {
    const sxStart = v.xStart - camera.x;
    const sxEnd = v.xEnd - camera.x;
    if (sxEnd < -50 || sxStart > canvas.width + 50) return;

    // Sign
    ctx.shadowColor = COLORS.village;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = COLORS.village;
    ctx.fillStyle = COLORS.village;
    ctx.lineWidth = 2;
    const signSx = v.signX - camera.x;
    ctx.strokeRect(signSx, GROUND_Y - 70, 90, 28);
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('VILLAGE', signSx + 45, GROUND_Y - 52);

    // Buildings
    v.buildings.forEach(b => {
      const bsx = b.x - camera.x;
      const color = b.type === 'shop' ? COLORS.coin : COLORS.village;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      // Body
      ctx.strokeRect(bsx, GROUND_Y - b.h, b.w, b.h);
      // Roof (triangle)
      ctx.beginPath();
      ctx.moveTo(bsx - 6, GROUND_Y - b.h);
      ctx.lineTo(bsx + b.w / 2, GROUND_Y - b.h - 25);
      ctx.lineTo(bsx + b.w + 6, GROUND_Y - b.h);
      ctx.stroke();
      // Door
      ctx.strokeRect(bsx + b.w / 2 - 8, GROUND_Y - 28, 16, 28);
      // Shop label
      if (b.type === 'shop') {
        ctx.fillStyle = color;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SHOP', bsx + b.w / 2, GROUND_Y - b.h + 14);
      }
    });

    // Chest
    if (v.chest && !v.chest.opened) {
      const csx = v.chest.x - camera.x;
      ctx.shadowColor = COLORS.key;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = COLORS.key;
      ctx.strokeRect(csx, GROUND_Y - 22, 26, 22);
      ctx.beginPath();
      ctx.moveTo(csx, GROUND_Y - 16);
      ctx.lineTo(csx + 26, GROUND_Y - 16);
      ctx.stroke();
      ctx.fillStyle = COLORS.key;
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('\u25A0', csx + 13, GROUND_Y - 6);
    } else if (v.chest && v.chest.opened) {
      const csx = v.chest.x - camera.x;
      ctx.shadowColor = '#555';
      ctx.shadowBlur = 4;
      ctx.strokeStyle = '#555';
      ctx.strokeRect(csx, GROUND_Y - 10, 26, 10);
    }
  });
  ctx.textAlign = 'left';
  ctx.restore();
}
```

- [ ] **Step 2: Spawn village coins as ground pickups**

In `js/village.js`, at the end of the `updateVillages()` function (after the `villages.push(...)` inside the spawn block), also push each coin into `itemPickups`:

Replace the block:

```javascript
    villages.push({ xStart, xEnd, buildings, chest, coins, signX: xStart + 20 });
    nextVillageDistance = distance + VILLAGE_INTERVAL;
```

with:

```javascript
    villages.push({ xStart, xEnd, buildings, chest, coins, signX: xStart + 20 });
    coins.forEach(c => itemPickups.push({ type: 'coin', x: c.x, y: c.y }));
    // 25% chance of a free key on the ground
    if (Math.random() < 0.25) {
      itemPickups.push({ type: 'key', x: xStart + 330, y: GROUND_Y - 18 });
    }
    // 25% chance of a free potion on the ground
    if (Math.random() < 0.25) {
      itemPickups.push({ type: 'potion', x: xStart + 140, y: GROUND_Y - 18 });
    }
    nextVillageDistance = distance + VILLAGE_INTERVAL;
```

- [ ] **Step 3: Force flat terrain inside villages**

In `js/terrain.js`, replace `generateTerrain()` (lines 3–23):

```javascript
function generateTerrain() {
  while (terrainNextX < camera.x + canvas.width + 400) {
    // If the next slab would be inside or overlapping a village, force flat ground
    const insideVillage = villages.some(v =>
      terrainNextX < v.xEnd && terrainNextX + 400 > v.xStart
    );

    if (insideVillage) {
      const w = 200;
      terrainSegments.push({ x: terrainNextX, y: GROUND_Y, w, h: 20 });
      terrainNextX += w;
      lastWasGap = false;
      continue;
    }

    const rand = Math.random();
    if (rand < 0.15 && terrainNextX > 300 && !lastWasGap) {
      terrainNextX += 60 + Math.random() * 40;
      lastWasGap = true;
    } else if (rand < 0.3) {
      lastWasGap = false;
      const w = 120 + Math.random() * 200;
      terrainSegments.push({ x: terrainNextX, y: GROUND_Y - 40 - Math.random() * 30, w, h: 12 });
      terrainSegments.push({ x: terrainNextX, y: GROUND_Y, w, h: 20 });
      terrainNextX += w;
    } else {
      lastWasGap = false;
      const w = 150 + Math.random() * 300;
      terrainSegments.push({ x: terrainNextX, y: GROUND_Y, w, h: 20 });
      terrainNextX += w;
    }
  }
  terrainSegments = terrainSegments.filter(s => s.x + s.w > camera.x - 200);
}
```

- [ ] **Step 4: Wire village update + draw into game loop**

In `js/game.js`, inside `update(dt)`, after the line `generateTerrain();` add:

```javascript
  updateVillages();
```

In `js/game.js`, inside `draw()`, replace the line `drawTerrain();` with:

```javascript
  drawVillageBackground();
  drawTerrain();
  drawVillages();
```

Also reset village state in `resetGame()`. Find `resetGame()` and after the `terrainNextX = 0;` line add:

```javascript
  villages = [];
  currentVillage = null;
  nextVillageDistance = FIRST_VILLAGE_DISTANCE;
  itemPickups = [];
  inventorySlots = { egg: 0, coin: 0, key: 0, potion: 0, sword: 0, wand: 0 };
  inventoryOpen = false;
  helperBird = null;
  player.speedBoostTimer = 0;
  player.swordTimer = 0;
  player.wandShots = 0;
```

- [ ] **Step 5: Verify and commit**

Reload and play. Run forward past ~600m. Village should appear: yellow tint on the screen, a "VILLAGE" sign, three wireframe buildings (middle one labeled SHOP), a yellow chest. Ground inside is flat (no gaps, no elevated blocks). Coins lie on the ground — pick them up, inventory coin count increases. Leave the village and keep running ~800m — another village appears.

```bash
git add js/village.js js/terrain.js js/game.js
git commit -m "feat: add village generation, visuals, and ground coin spawns"
```

---

### Task 7: Village Safe Zone (No Enemy Spawns Inside)

**Files:**
- Modify: `js/enemies.js`

- [ ] **Step 1: Skip spawn timers inside a village**

In `js/enemies.js`, find the `spawnEnemies(dt)` function. Wrap the whole body of `spawnEnemies(dt)` in an early-return guard. At the top of the function, add:

```javascript
  if (currentVillage) return;
```

(This assumes `spawnEnemies` is the function that decrements all the `*SpawnTimer` vars and pushes new enemies. If any enemy type is spawned elsewhere, apply the same guard there.)

- [ ] **Step 2: Verify and commit**

Play until you reach a village. While standing inside: enemies already alive continue moving, but no new enemies appear. Walk out the far side — enemy spawns resume.

```bash
git add js/enemies.js
git commit -m "feat: villages are safe zones — no enemy spawns inside"
```

---

### Task 8: Shop Interaction

**Files:**
- Modify: `js/village.js`
- Modify: `js/game.js`
- Modify: `js/ui.js`

- [ ] **Step 1: Add shop proximity + prompt**

In `js/village.js`, append:

```javascript
function getNearbyShop() {
  if (!currentVillage) return null;
  const shop = currentVillage.buildings.find(b => b.type === 'shop');
  if (!shop) return null;
  const dx = (player.x + player.w / 2) - (shop.x + shop.w / 2);
  if (Math.abs(dx) < 50 && player.onGround) return shop;
  return null;
}

function getNearbyChest() {
  if (!currentVillage || !currentVillage.chest || currentVillage.chest.opened) return null;
  const dx = (player.x + player.w / 2) - (currentVillage.chest.x + 13);
  if (Math.abs(dx) < 32) return currentVillage.chest;
  return null;
}

function drawInteractPrompt() {
  if (gameState !== 'playing') return;
  const shop = getNearbyShop();
  const chest = getNearbyChest();
  if (!shop && !chest) return;
  ctx.save();
  ctx.shadowColor = COLORS.village;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.village;
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  const psx = (player.x + player.w / 2) - camera.x;
  const label = shop ? '\u2193 SHOP' : '\u2193 CHEST';
  ctx.fillText(label, psx, player.y - player.h - 18);
  ctx.textAlign = 'left';
  ctx.restore();
}
```

- [ ] **Step 2: Implement the shop modal**

Append to `js/village.js`:

```javascript
const SHOP_ITEMS = ['key', 'potion', 'sword', 'wand'];

function openShop() {
  shopOpen = true;
  gameState = 'paused';
  shopMessage = '';
  shopMessageTimer = 0;
}

function closeShop() {
  shopOpen = false;
  gameState = 'playing';
  lastTime = null;
}

function getShopSlotRects() {
  const panelW = 480, panelH = 240;
  const px = (canvas.width - panelW) / 2;
  const py = (canvas.height - panelH) / 2;
  const slotW = 80, slotH = 100, gap = 14;
  const slotsW = SHOP_ITEMS.length * slotW + (SHOP_ITEMS.length - 1) * gap;
  const startX = px + (panelW - slotsW) / 2;
  const slotY = py + 60;
  return SHOP_ITEMS.map((type, i) => ({
    type,
    x: startX + i * (slotW + gap),
    y: slotY,
    w: slotW,
    h: slotH,
  }));
}

function updateShopCursor(dt) {
  if (!shopOpen) return;

  if (mouseX !== shopCursor._lastMouseX || mouseY !== shopCursor._lastMouseY) {
    shopCursor.x = mouseX;
    shopCursor.y = mouseY;
    shopCursor._lastMouseX = mouseX;
    shopCursor._lastMouseY = mouseY;
  }
  if (Math.abs(_inventoryStickX) > STICK_DEADZONE) shopCursor.x += _inventoryStickX * 250 * dt;
  if (Math.abs(_inventoryStickY) > STICK_DEADZONE) shopCursor.y += _inventoryStickY * 250 * dt;

  shopCursor.x = Math.max(0, Math.min(canvas.width, shopCursor.x));
  shopCursor.y = Math.max(0, Math.min(canvas.height, shopCursor.y));

  const slots = getShopSlotRects();
  shopCursor.slotIndex = -1;
  slots.forEach((s, i) => {
    if (shopCursor.x >= s.x && shopCursor.x <= s.x + s.w &&
        shopCursor.y >= s.y && shopCursor.y <= s.y + s.h) {
      shopCursor.slotIndex = i;
    }
  });

  if (keyPressed('ArrowLeft') && shopCursor.slotIndex > 0) {
    const s = slots[shopCursor.slotIndex - 1];
    shopCursor.x = s.x + s.w / 2;
    shopCursor.y = s.y + s.h / 2;
  }
  if (keyPressed('ArrowRight') && shopCursor.slotIndex < SHOP_ITEMS.length - 1) {
    const next = Math.max(0, shopCursor.slotIndex) + 1;
    const s = slots[Math.min(SHOP_ITEMS.length - 1, next)];
    shopCursor.x = s.x + s.w / 2;
    shopCursor.y = s.y + s.h / 2;
  }

  const useNow = mouseClicked || keyPressed(' ') || (_inventoryUse && !_inventoryUsePrev);
  _inventoryUsePrev = _inventoryUse;
  if (useNow && shopCursor.slotIndex >= 0) {
    const type = SHOP_ITEMS[shopCursor.slotIndex];
    const price = ITEM_PRICES[type];
    if (inventorySlots.coin >= price) {
      inventorySlots.coin -= price;
      inventorySlots[type]++;
      shopMessage = 'BOUGHT ' + type.toUpperCase();
      shopMessageTimer = 1.5;
    } else {
      shopMessage = 'NEED ' + price + ' COINS';
      shopMessageTimer = 1.5;
    }
  }

  if (keyPressed('Escape') || keyPressed('i') || keyPressed('I') ||
      (_inventoryClose && !_inventoryClosePrev)) {
    _inventoryClosePrev = _inventoryClose;
    closeShop();
  }
  _inventoryClosePrev = _inventoryClose;

  if (shopMessageTimer > 0) shopMessageTimer -= dt;
}

function drawShop() {
  if (!shopOpen) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const panelW = 480, panelH = 240;
  const px = (canvas.width - panelW) / 2;
  const py = (canvas.height - panelH) / 2;

  ctx.shadowColor = COLORS.coin;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = COLORS.coin;
  ctx.lineWidth = 2;
  ctx.strokeRect(px, py, panelW, panelH);

  ctx.fillStyle = COLORS.coin;
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SHOP — \ud83e\ude99 ' + inventorySlots.coin, px + panelW / 2, py + 32);

  const slots = getShopSlotRects();
  slots.forEach((s, i) => {
    const type = SHOP_ITEMS[i];
    const price = ITEM_PRICES[type];
    const canAfford = inventorySlots.coin >= price;
    const color = COLORS[type];
    const active = i === shopCursor.slotIndex;

    ctx.shadowColor = color;
    ctx.shadowBlur = active ? 16 : 6;
    ctx.strokeStyle = canAfford ? color : '#555';
    ctx.lineWidth = active ? 3 : 2;
    ctx.strokeRect(s.x, s.y, s.w, s.h);

    ctx.fillStyle = canAfford ? color : '#555';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(type[0].toUpperCase(), s.x + s.w / 2, s.y + 50);

    ctx.font = '13px monospace';
    ctx.fillText(type.toUpperCase(), s.x + s.w / 2, s.y + 72);
    ctx.fillStyle = canAfford ? COLORS.coin : '#555';
    ctx.fillText(price + ' \ud83e\ude99', s.x + s.w / 2, s.y + 90);
  });

  if (shopMessageTimer > 0) {
    ctx.shadowColor = COLORS.coin;
    ctx.shadowBlur = 8;
    ctx.fillStyle = COLORS.coin;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(shopMessage, px + panelW / 2, py + panelH - 40);
  }

  ctx.fillStyle = '#888';
  ctx.shadowBlur = 4;
  ctx.font = '12px monospace';
  ctx.fillText('CLICK or SPACE to buy — ESC or I to close', px + panelW / 2, py + panelH - 18);

  ctx.shadowBlur = 12;
  ctx.shadowColor = COLORS.melee;
  ctx.strokeStyle = COLORS.melee;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(shopCursor.x - 8, shopCursor.y);
  ctx.lineTo(shopCursor.x + 8, shopCursor.y);
  ctx.moveTo(shopCursor.x, shopCursor.y - 8);
  ctx.lineTo(shopCursor.x, shopCursor.y + 8);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.restore();
}
```

- [ ] **Step 3: Wire shop into game loop**

In `js/game.js`, inside `update(dt)`, find the inventory pause block and extend to handle shop. Replace:

```javascript
  if (gameState === 'paused') {
    updateInventoryCursor(dt);
    if (keyPressed('Escape')) toggleInventory();
    updateKeyEdges();
    mouseClicked = false;
    return;
  }
```

with:

```javascript
  if (gameState === 'paused') {
    if (shopOpen) updateShopCursor(dt);
    else updateInventoryCursor(dt);
    if (!shopOpen && keyPressed('Escape')) toggleInventory();
    updateKeyEdges();
    mouseClicked = false;
    return;
  }
```

Handle `ArrowDown` in the main `update(dt)` body (add right after the melee/shoot/rocket blocks, before `projectiles.forEach`):

```javascript
  if (keyPressed('ArrowDown')) {
    const shop = getNearbyShop();
    if (shop) openShop();
  }
```

In `js/game.js`, inside `draw()`, add after `if (inventoryOpen) drawInventory();`:

```javascript
  if (shopOpen) drawShop();
  drawInteractPrompt();
```

Also reset shop state in `resetGame()`. Add:

```javascript
  shopOpen = false;
```

- [ ] **Step 4: Verify and commit**

Enter a village. Walk to the middle (SHOP) building. Yellow "↓ SHOP" prompt appears above the player. Press `↓` — shop modal opens. If you have ≥5 coins, hover over the KEY slot and click — coins drop by 5, key count goes up. Try buying something you can't afford: red-dimmed slot, clicking it shows "NEED N COINS". Press `Esc` or `I` — shop closes.

```bash
git add js/village.js js/game.js
git commit -m "feat: add shop interaction inside villages"
```

---

### Task 9: Chest Interaction

**Files:**
- Modify: `js/village.js`
- Modify: `js/game.js`

- [ ] **Step 1: Implement chest unlock**

Append to `js/village.js`:

```javascript
function openChest() {
  const chest = getNearbyChest();
  if (!chest) return;
  if (inventorySlots.key <= 0) {
    shopMessage = 'NEED KEY';
    shopMessageTimer = 1.5;
    return;
  }
  inventorySlots.key--;
  chest.locked = false;
  chest.opened = true;

  // Weighted random reward
  const r = Math.random();
  let reward;
  if (r < 0.40) reward = 'potion';
  else if (r < 0.65) reward = 'sword';
  else if (r < 0.85) reward = 'wand';
  else reward = 'egg';
  inventorySlots[reward]++;

  spawnDeathParticles(chest.x + 13, GROUND_Y - 20, COLORS[reward]);
  shopMessage = 'GOT ' + reward.toUpperCase() + '!';
  shopMessageTimer = 2;
}

function drawShopMessage() {
  if (shopOpen) return;
  if (shopMessageTimer <= 0) return;
  ctx.save();
  ctx.shadowColor = COLORS.coin;
  ctx.shadowBlur = 10;
  ctx.fillStyle = COLORS.coin;
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(shopMessage, canvas.width / 2, 90);
  ctx.textAlign = 'left';
  ctx.restore();
}
```

- [ ] **Step 2: Wire chest into input + draw**

In `js/game.js`, replace the earlier `if (keyPressed('ArrowDown'))` block with:

```javascript
  if (keyPressed('ArrowDown')) {
    const shop = getNearbyShop();
    const chest = getNearbyChest();
    if (shop) openShop();
    else if (chest) openChest();
  }
```

Also decrement `shopMessageTimer` during `playing` state. In `js/game.js`, at the end of `update(dt)` (before the `updateKeyEdges()` line added earlier), add:

```javascript
  if (shopMessageTimer > 0) shopMessageTimer -= dt;
```

In `draw()`, add after `drawInteractPrompt();`:

```javascript
  drawShopMessage();
```

- [ ] **Step 3: Verify and commit**

Enter a village with a chest. Walk to chest, `↓ CHEST` prompt appears. Press `↓` without a key → "NEED KEY" message. Buy a key from shop (or use debug `0`), press `↓` at chest: key count drops by 1, chest flattens (opened state), a random new item is added to inventory, "GOT POTION!" (or similar) message flashes for 2 seconds.

```bash
git add js/village.js js/game.js
git commit -m "feat: add chest unlock with key for random item"
```

---

### Task 10: Egg Drops From Enemies

**Files:**
- Modify: `js/game.js`

- [ ] **Step 1: Drop eggs on enemy death**

In `js/game.js`, find the enemies death-filter block (lines 468–479) — the one starting `enemies = enemies.filter(e => { if (e.hp <= 0) ...`. Replace it with:

```javascript
  enemies = enemies.filter(e => {
    if (e.hp <= 0) {
      score += e.points;
      if (e.type === 'bird') {
        player.flyTimer = 10;
      }
      if (Math.random() < EGG_DROP_CHANCE) {
        itemPickups.push({ type: 'egg', x: e.x, y: e.y - e.h / 2 });
      }
      spawnDeathParticles(e.x, e.y - e.h / 2, COLORS[e.type] || COLORS.dino);
      return false;
    }
    if (e.x < camera.x - 100) return false;
    return true;
  });
```

- [ ] **Step 2: Verify and commit**

Start a new game. Kill 20–30 enemies (melee beetles, shoot skeletons, etc). Several purple egg pickups should drop (roughly 1 in 5 kills). Run over them — egg count in inventory increases.

```bash
git add js/game.js
git commit -m "feat: enemies drop eggs on death (20% chance)"
```

---

### Task 11: Helper Bird From Egg

**Files:**
- Modify: `js/inventory.js`
- Modify: `js/game.js`

- [ ] **Step 1: Implement helper-bird logic**

In `js/inventory.js`, append:

```javascript
function updateHelperBird(dt) {
  if (!helperBird) return;
  helperBird.timer -= dt;
  if (helperBird.timer <= 0) { helperBird = null; return; }

  helperBird.angle += 2 * dt;
  const radius = 55;
  helperBird.x = player.x + player.w / 2 + Math.cos(helperBird.angle) * radius;
  helperBird.y = player.y - player.h / 2 + Math.sin(helperBird.angle) * radius * 0.6;

  helperBird.shootTimer -= dt;
  if (helperBird.shootTimer <= 0) {
    helperBird.shootTimer = 1.0;
    let nearest = null;
    let nearestDist = 450;
    for (const e of enemies) {
      const dx = e.x - helperBird.x;
      if (Math.abs(dx) < nearestDist) {
        nearestDist = Math.abs(dx);
        nearest = e;
      }
    }
    if (nearest) {
      projectiles.push({
        x: helperBird.x,
        y: helperBird.y,
        dir: nearest.x > helperBird.x ? 1 : -1,
        speed: 450,
      });
    }
  }
}

function drawHelperBird() {
  if (!helperBird) return;
  ctx.save();
  const sx = helperBird.x - camera.x;
  const sy = helperBird.y;
  ctx.shadowColor = COLORS.bird;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = COLORS.bird;
  ctx.lineWidth = 1.5;
  ctx.translate(sx, sy);
  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Wings (flap)
  const flap = Math.sin(gameTime * 20) * 4;
  ctx.beginPath();
  ctx.moveTo(-2, 0);
  ctx.lineTo(-8, -4 - flap);
  ctx.moveTo(2, 0);
  ctx.lineTo(8, -4 - flap);
  ctx.stroke();
  // Beak
  ctx.beginPath();
  ctx.moveTo(5, 0);
  ctx.lineTo(9, 1);
  ctx.stroke();
  // Timer ring
  ctx.shadowBlur = 4;
  ctx.strokeStyle = COLORS.bird + '66';
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2 * (helperBird.timer / HELPER_BIRD_DURATION));
  ctx.stroke();
  ctx.restore();
}
```

- [ ] **Step 2: Hook egg-use to hatch the bird**

In `js/inventory.js`, replace `useInventoryItem` with:

```javascript
function useInventoryItem(type) {
  if (type === 'coin') return;
  if (inventorySlots[type] <= 0) return;

  if (type === 'egg') {
    inventorySlots.egg--;
    helperBird = {
      x: player.x,
      y: player.y - player.h / 2,
      angle: 0,
      timer: HELPER_BIRD_DURATION,
      shootTimer: 1.0,
    };
    return;
  }
  // potion, sword, wand wired in Task 12
}
```

- [ ] **Step 3: Call update + draw from game loop**

In `js/game.js`, inside `update(dt)`, after `updateItemPickups();` add:

```javascript
  updateHelperBird(dt);
```

In `js/game.js`, inside `draw()`, after `drawPlayer();` add:

```javascript
  drawHelperBird();
```

- [ ] **Step 4: Verify and commit**

Get an egg (kill enemies or debug `0`). Press `I`, click the egg slot (or press `Space`). Inventory closes. Purple bird appears orbiting the player, flapping wings. A fading timer ring shrinks around it. Every second, the bird shoots a projectile at the nearest enemy (kills beetles, damages others). After 15 seconds, bird disappears. Using another egg while one is active resets the timer to 15s (only one bird at a time).

```bash
git add js/inventory.js js/game.js
git commit -m "feat: hatch helper bird from egg (orbits player, auto-shoots)"
```

---

### Task 12: Active Effects — Potion, Sword, Wand

**Files:**
- Modify: `js/inventory.js`
- Modify: `js/game.js`
- Modify: `js/player.js`

- [ ] **Step 1: Hook potion / sword / wand use**

In `js/inventory.js`, replace `useInventoryItem` again with the final version:

```javascript
function useInventoryItem(type) {
  if (type === 'coin') return;
  if (inventorySlots[type] <= 0) return;

  if (type === 'egg') {
    inventorySlots.egg--;
    helperBird = {
      x: player.x,
      y: player.y - player.h / 2,
      angle: 0,
      timer: HELPER_BIRD_DURATION,
      shootTimer: 1.0,
    };
  } else if (type === 'potion') {
    inventorySlots.potion--;
    player.speedBoostTimer = POTION_DURATION;
  } else if (type === 'sword') {
    inventorySlots.sword--;
    player.swordTimer = SWORD_DURATION;
  } else if (type === 'wand') {
    inventorySlots.wand--;
    player.wandShots = WAND_SHOTS;
  } else if (type === 'key') {
    // Key is consumed automatically at chests; direct use is a no-op
    return;
  }
}
```

- [ ] **Step 2: Apply speed boost during movement**

In `js/game.js`, inside `update(dt)`, replace:

```javascript
  player.vx = 0;
  if (keys['ArrowLeft']) { player.vx = -PLAYER_SPEED; player.facing = -1; }
  if (keys['ArrowRight']) { player.vx = PLAYER_SPEED; player.facing = 1; }
```

with:

```javascript
  player.vx = 0;
  const speedMult = player.speedBoostTimer > 0 ? 2 : 1;
  if (keys['ArrowLeft']) { player.vx = -PLAYER_SPEED * speedMult; player.facing = -1; }
  if (keys['ArrowRight']) { player.vx = PLAYER_SPEED * speedMult; player.facing = 1; }
```

Also decrement the timer. Near the other `player.*Cooldown -= dt` lines, add:

```javascript
  if (player.speedBoostTimer > 0) player.speedBoostTimer -= dt;
  if (player.swordTimer > 0) player.swordTimer -= dt;
```

- [ ] **Step 3: Apply sword to melee hitbox**

Find `meleeHitbox()` in the codebase (likely in `js/player.js` or `js/collision.js`):

```bash
grep -rn "function meleeHitbox" js/
```

Assuming it's in `js/collision.js` and looks roughly like:

```javascript
function meleeHitbox() {
  return { x: player.x + (player.facing === 1 ? player.w : -30), y: player.y - player.h, w: 40, h: player.h };
}
```

Replace its body with:

```javascript
function meleeHitbox() {
  const swordActive = player.swordTimer > 0;
  const reach = swordActive ? 60 : 40;
  return {
    x: player.x + (player.facing === 1 ? player.w : -reach),
    y: player.y - player.h,
    w: reach,
    h: player.h,
  };
}
```

(Adapt to match the real function shape found above — preserve its original x/y/h, only multiply width when sword is active.)

In `js/game.js`, inside the melee block (the existing `if ((keys['z'] || keys['Z'] || keys['y'] || keys['Y']) && player.meleeCooldown <= 0)`), replace `e.hp -= 1;` with:

```javascript
        const meleeDmg = player.swordTimer > 0 ? 2 : 1;
        e.hp -= meleeDmg;
```

- [ ] **Step 4: Apply wand to shoot**

In `js/game.js`, inside the shoot block (`if ((keys['x'] || keys['X']) && player.shootCooldown <= 0)`), replace the whole block with:

```javascript
  if ((keys['x'] || keys['X']) && player.shootCooldown <= 0) {
    player.shootCooldown = 0.5;
    if (player.wandShots > 0) {
      player.wandShots--;
      projectiles.push({
        x: player.x + (player.facing === 1 ? player.w : 0),
        y: player.y - 18,
        dir: player.facing,
        speed: 520,
        magic: true,
      });
    } else {
      projectiles.push({
        x: player.x + (player.facing === 1 ? player.w : 0),
        y: player.y - 18,
        dir: player.facing,
        speed: 500,
      });
    }
  }
```

Update projectile collision to honour magic damage + pierce. In the collision filter:

```javascript
  projectiles = projectiles.filter(p => {
    for (const e of enemies) {
      if (p.hostile && e.type === 'skeleton') continue;
      if (p.rocket && e.type === 'bug') continue;
      const ex = e.x - e.w / 2;
      if (p.x > ex && p.x < ex + e.w && p.y > e.y - e.h && p.y < e.y) {
        if (p.rocket) {
          e.hp -= 999;
          spawnDeathParticles(e.x, e.y - e.h / 2, COLORS.rocket);
          continue;
        }
        if (p.magic) {
          e.hp -= 2;
          spawnDeathParticles(e.x, e.y - e.h / 2, COLORS.magic);
          continue; // magic pierces too
        }
        const dmg = p.hostile ? 1 : 2;
        e.hp -= dmg;
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
```

- [ ] **Step 5: Render magic projectiles + sword trail + speed glow**

Find `drawProjectiles()` in `js/projectiles.js`:

```bash
grep -n "function drawProjectiles" js/projectiles.js
```

Inside the per-projectile loop, before the generic draw, add a branch for magic:

```javascript
    if (p.magic) {
      ctx.save();
      ctx.shadowColor = COLORS.magic;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = COLORS.magic;
      ctx.fillStyle = COLORS.magic;
      ctx.lineWidth = 2;
      const sx = p.x - camera.x;
      ctx.beginPath();
      ctx.arc(sx, p.y, 5, 0, Math.PI * 2);
      ctx.stroke();
      // Sparkle trail
      for (let k = 1; k <= 3; k++) {
        ctx.beginPath();
        ctx.arc(sx - p.dir * k * 6, p.y + Math.sin(gameTime * 20 + k) * 3, 5 - k * 1.2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      continue;
    }
```

In `js/player.js`, inside `drawPlayer()`, add at the top (before `ctx.save()` or right after the existing save):

```javascript
  if (player.speedBoostTimer > 0) {
    ctx.save();
    const sx = player.x - camera.x + player.w / 2;
    ctx.shadowColor = COLORS.potion;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = COLORS.potion + 'AA';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, player.y - player.h / 2, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
```

And sword overlay (add after the potion block):

```javascript
  if (player.swordTimer > 0) {
    ctx.save();
    const sx = player.x - camera.x + (player.facing === 1 ? player.w : 0);
    const tipX = sx + player.facing * 32;
    ctx.shadowColor = COLORS.sword;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = COLORS.sword;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, player.y - 20);
    ctx.lineTo(tipX, player.y - 24);
    ctx.stroke();
    // Cross-guard
    ctx.beginPath();
    ctx.moveTo(sx, player.y - 16);
    ctx.lineTo(sx, player.y - 24);
    ctx.stroke();
    ctx.restore();
  }
```

- [ ] **Step 6: Add HUD indicators for active effects**

In `js/ui.js`, inside `drawHUD()`, after the existing "Wings timer" block, add:

```javascript
  // Active effect timers
  let effectY = 95;
  if (player.speedBoostTimer > 0) {
    ctx.shadowColor = COLORS.potion;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLORS.potion;
    ctx.font = 'bold 14px monospace';
    ctx.fillText('\ud83e\uddea POTION ' + Math.ceil(player.speedBoostTimer) + 's', 20, effectY);
    effectY += 20;
  }
  if (player.swordTimer > 0) {
    ctx.shadowColor = COLORS.sword;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLORS.sword;
    ctx.font = 'bold 14px monospace';
    ctx.fillText('\u2694\ufe0f SWORD ' + Math.ceil(player.swordTimer) + 's', 20, effectY);
    effectY += 20;
  }
  if (player.wandShots > 0) {
    ctx.shadowColor = COLORS.wand;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLORS.wand;
    ctx.font = 'bold 14px monospace';
    ctx.fillText('\ud83e\ude84 WAND x' + player.wandShots, 20, effectY);
  }
```

- [ ] **Step 7: Verify and commit**

Use debug `0` to fill inventory. Press `I` and click each item:

- **Potion** → player glows blue, moves 2× faster for 5s, HUD shows countdown.
- **Sword** → silver blade drawn on player, melee has longer reach (kills T-Rex in fewer hits), HUD shows countdown.
- **Wand** → HUD shows "WAND x3". Press `X` — pink magic projectile pierces through enemies, damages 2. After 3 shots, normal bullets resume.

```bash
git add js/inventory.js js/game.js js/player.js js/collision.js js/projectiles.js js/ui.js
git commit -m "feat: add potion (speed), sword (melee buff), wand (magic shots)"
```

---

### Task 13: Help Screen + Start Screen Update

**Files:**
- Modify: `js/ui.js`
- Modify: `js/game.js`

- [ ] **Step 1: Add help-screen rendering**

In `js/ui.js`, append:

```javascript
function drawHelpScreen() {
  ctx.save();
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;

  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 18;
  ctx.fillStyle = COLORS.player;
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HELP', cx, 70);

  const titles = ['ENEMIES', 'VILLAGE', 'INVENTORY', 'ITEMS'];
  ctx.shadowColor = COLORS.melee;
  ctx.shadowBlur = 10;
  ctx.fillStyle = COLORS.melee;
  ctx.font = 'bold 22px monospace';
  ctx.fillText(titles[helpPage], cx, 110);

  ctx.shadowBlur = 5;
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';

  if (helpPage === 0) {
    const rows = [
      { c: COLORS.bug, t: 'BEETLE (red) — 1 HP, fast, melee them' },
      { c: COLORS.zombie, t: 'ZOMBIE (green) — 2 HP, rages when hit' },
      { c: COLORS.skeleton, t: 'SKELETON (white) — 2 HP, shoots arrows' },
      { c: COLORS.bird, t: 'BIRD (purple) — kill for 10s of flight' },
      { c: COLORS.dino, t: 'T-REX (orange) — 3 HP, tough tank' },
      { c: COLORS.warden, t: 'WARDEN (cyan) — stay still or die' },
    ];
    rows.forEach((r, i) => {
      ctx.shadowColor = r.c;
      ctx.fillStyle = r.c;
      ctx.fillText('\u25C6 ' + r.t, cx - 220, 170 + i * 26);
    });
  } else if (helpPage === 1) {
    const lines = [
      'Yellow safe zone every ~800 meters.',
      'No enemies spawn inside — take a breather.',
      'Find coins on the ground (3-5 per village).',
      '',
      'SHOP building: walk up, press DOWN to buy',
      '  Key (5), Potion (10), Sword (15), Wand (20)',
      '',
      'CHEST: press DOWN with a key — random item inside.',
    ];
    lines.forEach((t, i) => {
      ctx.shadowColor = COLORS.village;
      ctx.fillStyle = COLORS.village;
      ctx.fillText(t, cx - 240, 170 + i * 22);
    });
  } else if (helpPage === 2) {
    const lines = [
      'Press I to open inventory (game pauses).',
      '',
      'MOVE CURSOR: mouse, arrow keys, or left stick',
      'USE ITEM: click, SPACE, or A button',
      'CLOSE: I, ESC, or B button',
      '',
      'Coins cannot be used directly — they are spent at the shop.',
    ];
    lines.forEach((t, i) => {
      ctx.shadowColor = COLORS.player;
      ctx.fillStyle = COLORS.player;
      ctx.fillText(t, cx - 260, 170 + i * 22);
    });
  } else if (helpPage === 3) {
    const rows = [
      { c: COLORS.egg, t: 'EGG — dropped by enemies (20%). Hatches a 15s helper bird that auto-shoots.' },
      { c: COLORS.coin, t: 'COIN — found in villages. Spent at the shop.' },
      { c: COLORS.key, t: 'KEY — unlocks chests for a random item.' },
      { c: COLORS.potion, t: 'POTION — 5 seconds of 2x speed.' },
      { c: COLORS.sword, t: 'SWORD — 10 seconds of longer, stronger melee.' },
      { c: COLORS.wand, t: 'WAND — 3 piercing magic shots (next X presses).' },
    ];
    rows.forEach((r, i) => {
      ctx.shadowColor = r.c;
      ctx.fillStyle = r.c;
      ctx.fillText('\u25C6 ' + r.t, cx - 280, 170 + i * 30);
    });
  }

  // Page dots
  ctx.shadowBlur = 5;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i === helpPage ? COLORS.player : '#555';
    ctx.shadowColor = i === helpPage ? COLORS.player : '#555';
    ctx.beginPath();
    ctx.arc(cx - 30 + i * 20, canvas.height - 70, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Footer
  ctx.shadowColor = '#888';
  ctx.shadowBlur = 3;
  ctx.fillStyle = '#888';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('\u2190 / \u2192 to switch pages — ESC or ENTER to return', cx, canvas.height - 30);

  ctx.textAlign = 'left';
  ctx.restore();
}
```

- [ ] **Step 2: Update start screen with HELP prompt**

In `js/ui.js`, inside `drawStartScreen()`, find the "Start prompt" block (near line 391) and replace with:

```javascript
  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.player;
  ctx.font = 'bold 20px monospace';
  const blink = Math.floor(Date.now() / 500) % 2 === 0;
  if (blink) ctx.fillText('Press ENTER or START to play', cx, 478);

  ctx.shadowColor = COLORS.melee;
  ctx.shadowBlur = 6;
  ctx.fillStyle = COLORS.melee;
  ctx.font = '14px monospace';
  ctx.fillText('Press H or Y for HELP', cx, 500);
```

(Adjust the author-credit y-position if it overlaps — change `528` to `520` if needed.)

- [ ] **Step 3: Wire help state into update + draw**

In `js/game.js`, replace the start-state block:

```javascript
  if (gameState === 'start') {
    if (keys['Enter']) { gameState = 'playing'; }
    if (keys['h'] || keys['H']) { gameState = 'help'; helpPage = 0; lastTime = null; }
    updateKeyEdges();
    return;
  }
```

with:

```javascript
  if (gameState === 'start') {
    if (keys['Enter']) { gameState = 'playing'; lastTime = null; }
    if (keyPressed('h') || keyPressed('H')) { gameState = 'help'; helpPage = 0; }
    updateKeyEdges();
    return;
  }

  if (gameState === 'help') {
    if (keyPressed('ArrowLeft') && helpPage > 0) helpPage--;
    if (keyPressed('ArrowRight') && helpPage < 3) helpPage++;
    if (keyPressed('Escape') || keyPressed('Enter')) {
      gameState = 'start';
      lastTime = null;
    }
    updateKeyEdges();
    return;
  }
```

Also support gamepad: in `js/input.js`, inside `pollGamepad()`, add before the final `}`:

```javascript
  // Help screen nav on gamepad
  if (gameState === 'help') {
    gpSet('ArrowLeft', gp.buttons[4] && gp.buttons[4].pressed); // LB
    gpSet('ArrowRight', gp.buttons[5] && gp.buttons[5].pressed); // RB
    gpSet('Escape', gp.buttons[1] && gp.buttons[1].pressed); // B
  }
  if (gameState === 'start') {
    gpSet('h', gp.buttons[3] && gp.buttons[3].pressed); // Y
  }
```

In `js/game.js`, inside `draw()`, near the top after the `drawStartScreen()` branch, add:

```javascript
  if (gameState === 'help') {
    drawHelpScreen();
    return;
  }
```

- [ ] **Step 4: Verify and commit**

Reload. Start screen shows "Press H or Y for HELP" under the ENTER prompt. Press `H` → ENEMIES page opens. `→` cycles to VILLAGE → INVENTORY → ITEMS. `←` goes back. `Esc` returns to start. Gamepad Y opens help, LB/RB navigate, B returns.

```bash
git add js/ui.js js/input.js js/game.js
git commit -m "feat: add paged help screen accessible from start menu"
```

---

### Task 14: Final Polish — Edge Cases, Warden, Cleanup

**Files:**
- Modify: `js/game.js`
- Modify: `js/village.js`

- [ ] **Step 1: Freeze active effects + helper bird during warden**

In `js/game.js`, inside `updateWarden(dt)`, at the very top, add a pause for the timers by not touching them there. (No change needed — they're only decremented in the main `update(dt)` body, which short-circuits during warden. Verify visually.)

- [ ] **Step 2: Close inventory and shop on game over**

In `js/game.js`, find `endGame()` and add at the top:

```javascript
function endGame() {
  inventoryOpen = false;
  shopOpen = false;
  gameState = 'gameOver';
  if (score > highScore) {
    highScore = Math.floor(score);
    localStorage.setItem('jungleNeonHighScore', highScore);
  }
}
```

- [ ] **Step 3: Prevent village spawn during warden**

In `js/village.js`, at the top of `updateVillages()`, extend the guard:

```javascript
function updateVillages() {
  if (gameState !== 'playing' && gameState !== 'paused') return;
  if (wardenPhase !== 'none') return;
  // ...
}
```

(Insert the `if (wardenPhase !== 'none') return;` line as the second guard.)

- [ ] **Step 4: Remove debug spawn keys**

In `js/game.js`, delete the two debug blocks added in Tasks 4 and 5:

```javascript
  if (keyPressed('0')) {
    inventorySlots.egg = 3;
    // ...
  }
```

and

```javascript
  if (keyPressed('9')) {
    itemPickups.push({ type: 'coin', ...
    // ...
  }
```

In `js/input.js`, remove `'0'` and `'9'` from `GAME_KEYS`.

- [ ] **Step 5: Update README**

In `README.md`, add to the controls table (after the `C | Rocket ...` row):

```
| I | Open inventory |
| ↓ | Interact (shop / chest) |
| H | Help (from start screen) |
```

Add a new section before "## Tech":

```markdown
## Village

Every ~800m you reach a yellow safe-zone village. No enemies spawn inside. Pick up coins on the ground, buy items from the shop, or unlock chests with a key for random rewards.

## Items

Open your inventory with `I`. Use mouse, arrows, or left stick to move the cursor; click / space / A to use.

| Item | Where | Effect |
|------|-------|--------|
| Egg | 20% drop from kills | Hatches a 15s helper bird (auto-shoots) |
| Coin | Village ground | Spent at the shop |
| Key | Shop (5) or village | Unlocks chests |
| Potion | Shop (10), ground, chest | 5s of 2× speed |
| Sword | Shop (15) or chest | 10s of longer, stronger melee |
| Wand | Shop (20) or chest | 3 piercing magic shots |
```

- [ ] **Step 6: Full playthrough verification**

Reload. Start a new game. Play through at least two villages. Confirm:

1. Village appears around 600m, another around 1400m.
2. Yellow tint inside village, buildings rendered, no enemy spawns.
3. Coins on ground pickup works, adds to score and inventory.
4. Shop interaction works, purchases deduct coins.
5. Chest locked until you have a key; reward appears.
6. Enemies drop eggs; pickup works.
7. Inventory opens with `I`, cursor works with mouse + keys + gamepad, click uses items.
8. Each item effect visible: helper bird, blue glow + 2× speed, silver sword + bigger melee, pink magic shots.
9. Warden sequence still triggers at 2000m; villages do not spawn during warden.
10. Help screen from start menu, all 4 pages, navigation both directions.
11. Game over closes inventory/shop. Restart works, state resets, villages start fresh.
12. No debug keys `0` or `9` do anything.

```bash
git add js/game.js js/village.js js/input.js README.md
git commit -m "feat: final polish — warden/game-over edges, cleanup, README update"
```

---

## Summary

After all 14 tasks:

- **New files:** `js/village.js`, `js/inventory.js`
- **Modified files:** `js/constants.js`, `js/state.js`, `js/input.js`, `js/terrain.js`, `js/enemies.js`, `js/projectiles.js`, `js/player.js`, `js/collision.js`, `js/ui.js`, `js/game.js`, `index.html`, `README.md`
- **New features:** yellow village biome with shop + chest, paged help screen on start menu, modal inventory with cursor, six collectible items with effects, helper bird from eggs, gamepad parity throughout.
- **Preserved behavior:** existing enemies, warden, hunger, food, hearts, rocket, flight — unchanged.
