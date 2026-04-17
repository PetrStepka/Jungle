# Village, Inventory, and Collectible Items — Design Spec

**Date:** 2026-04-17
**Status:** Design approved, ready for implementation plan

## Summary

Adds a new yellow "village" biome that periodically appears along the endless run, a modal inventory window opened with `I`, and six collectible item types (egg, coin, key, potion, sword, wand). Eggs drop from killed enemies and hatch a helper bird. Coins, keys, potions, swords, and wands come from the village — either lying on the ground, bought from a shop for coins, or found in a locked chest opened with a key. The start screen gains a paged help overlay opened with `H`.

## Goals

- Give the player a long-term resource loop (earn coins → buy items → use items) on top of the existing moment-to-moment run-and-gun.
- Make the village feel like a safe, visually distinct break from the jungle.
- Keep the existing "pick up food/heart, auto-consume" feeling untouched. Only the new items go through the inventory.
- Teach the player all of the above through a paged help screen on the start menu.

## Non-goals

- No NPC dialogue, no questlines, no persistent village state between runs.
- No inventory weight, no item stacking limits beyond a per-slot counter.
- No crafting, no item combining.
- No permanent progression (everything resets on game over, like today).

## Player experience

While running through the jungle, enemies occasionally drop a purple egg. The player keeps going. Every ~800 meters the background fades to yellow and three neon-yellow wireframe houses appear — this is a village. Enemies already on screen still threaten the player, but no new enemies spawn inside the village. On the ground are a few coins, sometimes a free potion or key. One of the houses is a shop; standing in front of it and pressing ↓ opens a buy panel. Further along is a yellow chest; if the player has a key, pressing ↓ at the chest consumes the key and drops a random item.

At any time the player can press `I` to pause and open the inventory: a modal panel with six slots and a neon cursor controlled by mouse, arrow keys, or the gamepad left stick. Clicking or pressing space/A on a slot uses that item. An egg hatches a purple helper bird that flies alongside for 15 seconds, auto-shooting the nearest enemy once per second. A potion grants 5 seconds of double speed. A sword gives 10 seconds of a longer, stronger melee swing. A wand gives 3 piercing magic shots that replace normal bullets. A coin is passive currency — not usable, just spent in the shop.

## Architecture

The game is vanilla JS files loaded in order via `<script>` tags in `index.html`. The architecture follows the existing style: one file per concern, state globals in `state.js`, constants in `constants.js`, draw/update in `game.js`. This change adds two new files and modifies seven existing ones.

### New files

- **`js/village.js`** — village spawning, tracking current-village state, drawing yellow buildings/signs/chests, detecting shop/chest proximity.
- **`js/inventory.js`** — inventory data structure, opening/closing, cursor state, rendering the modal, item-use dispatch.

### Modified files

- **`js/constants.js`** — add village colors, item colors, item constants (prices, durations).
- **`js/state.js`** — add inventory state, helper-bird state, sword/potion/wand active-effect timers, current-village reference, help-screen page index.
- **`js/input.js`** — add `I` key toggle, mouse position tracking, `H`/Esc for help, shop/chest interaction (`↓`).
- **`js/enemies.js`** — egg drop chance on enemy death.
- **`js/game.js`** — new `paused` game state, new `help` game state, update loop integrates inventory pause, helper-bird update, active-effect timers, village advancement, shop/chest interaction.
- **`js/ui.js`** — help screen (paged), updated start screen ("Press H for HELP"), small "near shop / near chest" prompts.
- **`js/player.js`** — draw helper bird near player, draw sword swing with extended range when sword active.

## Components

### Village (`js/village.js`)

**State (in `state.js`):**
```
let villages = [];            // active village zones on the map
let nextVillageDistance = 600; // first village at ~600m, then every 800m
let currentVillage = null;     // reference to the village the player is inside, or null
```

**A village object:**
```
{
  xStart, xEnd,        // world-space bounds (xEnd - xStart = 400)
  buildings: [         // 3 buildings
    { x, w, h, type }  // type: 'house' | 'shop'
  ],
  chest: { x, locked, opened },  // one chest per village
  coins: [{ x, y, taken }],       // 3-5 coins on ground
  groundItems: [{ x, y, type }],  // optional free potion/key
  signX,                          // "VILLAGE" sign at xStart
}
```

**Generation rule:** When `distance >= nextVillageDistance`, a village is spawned at `terrainNextX`. Terrain generation inside a village forces flat ground (no gaps, no elevated blocks). On exit (`player.x > village.xEnd`), `nextVillageDistance` is set to `distance + 800`.

**Safe zone:** When `player.x >= village.xStart && player.x <= village.xEnd`, enemy spawn timers pause. Already-alive enemies keep moving. Pickups spawned before entering the village continue normally.

**Background tint:** When inside a village, a semi-transparent yellow overlay (`#FFEB3B` at 8% alpha) is drawn before enemies, to give a "you are in the village" feel without washing the game out.

**Shop interaction:** The shop building has a "near shop" hitbox. When player overlaps, HUD shows `↓ SHOP`. Pressing `↓` (keyboard down arrow or gamepad d-pad down) opens the shop panel (a modal overlay). The shop panel lists four items with prices:
- 🔑 Key — 5 coins
- 🧪 Potion — 10 coins
- ⚔️ Sword — 15 coins
- 🪄 Wand — 20 coins

Cursor works identically to inventory (mouse/arrows/stick). Click or A/space buys the highlighted item if coins are sufficient; item goes into inventory, coins decrement. Esc/B/I closes the shop.

**Chest interaction:** The chest has a "near chest" hitbox. When player overlaps, HUD shows `↓ CHEST` if locked or `↓ OPEN` if unlocked-but-not-looted. Pressing `↓` at a locked chest: if the player has ≥1 key, consume 1 key, set `chest.locked = false`, add a random item (weighted 40% potion, 25% sword, 20% wand, 15% egg) to inventory, set `chest.opened = true`. If no key, show "NEED KEY" briefly.

### Inventory (`js/inventory.js`)

**State:**
```
let inventoryOpen = false;
let inventorySlots = {
  egg: 0, coin: 0, key: 0, potion: 0, sword: 0, wand: 0
};
let inventoryCursor = { x: 480, y: 270, slotIndex: 0 }; // canvas coords
```

**Slot order (left-to-right):** egg, coin, key, potion, sword, wand.

**Opening:** Pressing `I` (keyboard) or Back/Select (gamepad) toggles `inventoryOpen`. When open, `gameState` transitions to `'paused'` — update loop early-returns, draw loop still draws the world (frozen) with the inventory modal on top.

**Cursor:**
- Mouse move over canvas sets `inventoryCursor.x / inventoryCursor.y` directly.
- Arrow keys nudge cursor by slot-width per press (one slot at a time).
- Gamepad left stick moves cursor continuously (200 px/s × stick magnitude).
- `inventoryCursor.slotIndex` is computed each frame by hit-testing slot rects against cursor; −1 if cursor is outside all slots.

**Using:** Left-click, `Space`, or gamepad A dispatches to the item handler for `slotIndex`. Clicking the coin slot is a no-op (coins are spent in the shop). Clicking an empty slot is a silent no-op.

**Rendering:** Dark semi-transparent full-screen backdrop, centered panel (~600×280), title "INVENTORY", six slots in a row, each slot 72×72 with neon border in its item's color. Slot shows icon + count. Highlighted slot has extra glow. Cursor is a neon cross/arrow drawn on top. Footer text: "Click or SPACE to use — I or ESC to close".

### Items

| Item | Icon | Source | Use effect |
|---|---|---|---|
| 🥚 Egg | purple | 20% drop from any killed enemy | Hatches helper bird (see below); slot count −1 |
| 🪙 Coin | gold | 3–5 on ground per village | Not directly usable; +5 score on pickup; spent at shop |
| 🔑 Key | yellow | Bought (5 coins) or rare ground spawn | Consumed when opening a chest |
| 🧪 Potion | blue | Bought (10 coins), ground, or chest | 5s double speed (`PLAYER_SPEED × 2`), player glows blue |
| ⚔️ Sword | silver | Bought (15 coins) or chest | 10s: melee hitbox width ×1.5, damage 2 instead of 1 |
| 🪄 Wand | pink | Bought (20 coins) or chest | Arms 3 magic shots; next 3 presses of X fire a piercing pink projectile (damage 2, ignores beetles like rocket); after 3 shots, wand count −1 |

**Active-effect state:**
```
player.speedBoostTimer = 0; // seconds remaining
player.swordTimer = 0;      // seconds remaining
player.wandShots = 0;       // 0 or 1–3 remaining
```

### Helper bird (from egg)

**State:**
```
let helperBird = null;
// { x, y, baseAngle, timer, shootTimer }
```

**Behavior:** Lives 15 seconds after hatching. Orbits the player at radius 50, angle increasing at 2 rad/s (visible circling). Every 1 second `shootTimer` fires: finds nearest enemy within 400px, spawns a friendly projectile (`{ hostile: false, speed: 450, ... }`) aimed at the enemy's horizontal direction. Bird is drawn as a small purple wireframe bird (reuse bird drawing primitive).

**Limitation:** Only one helper bird at a time. Using an egg while one is active resets the timer to 15s but does not spawn a second bird.

### Help screen (`js/ui.js`)

**State:**
```
let helpPage = 0; // 0..3
```

**Activation:** From start screen, pressing `H` (keyboard) or `Y` (gamepad) transitions `gameState` from `'start'` to `'help'`. In `'help'`, the update loop doesn't advance the world; draw loop renders the help page.

**Pages:**
0. **ENEMIES** — existing enemies list with descriptions (reuse the current start-screen list).
1. **VILLAGE** — "Yellow safe zone every ~800m. Find coins on the ground. Shop sells items for coins. Chests need a key."
2. **INVENTORY** — "Press I to open. Move cursor with mouse, arrows, or left stick. Click or SPACE to use."
3. **ITEMS** — six-row list of items with icon, color, and one-line effect.

**Navigation:** `←` / `→` keyboard or `LB` / `RB` gamepad cycles pages. `Esc` keyboard or `B` gamepad returns to `'start'`. Enter goes back to start too. Footer dots `• • • •` show current page.

## Data flow

**Ground-item pickups** share a single new array `itemPickups` (alongside the existing `healthPickups` and `foodPickups`). Each entry: `{ type: 'egg' | 'coin' | 'key' | 'potion', x, y }`. Ground coins/keys/potions come from village generation; eggs come from enemy-death drops.

**Egg drop on enemy death** (inside the existing `game.js` enemy-filter pass when `e.hp <= 0`):
```
if (Math.random() < 0.2) {
  itemPickups.push({ type: 'egg', x: e.x, y: e.y - e.h / 2 });
}
```
Pickup logic (mirrors food/health): when player overlaps an `itemPickups` entry, increment `inventorySlots[entry.type]`, remove from array, spawn particles.

**Village lifecycle:**
1. `updateVillageSpawn()` in main update adds a new village when `distance >= nextVillageDistance`.
2. `updateCurrentVillage()` sets/clears `currentVillage` based on player x.
3. If `currentVillage` is set, enemy spawn timers skip their decrement.
4. Shop/chest interaction is driven by the `↓` key when near their hitboxes.
5. `drawVillage()` draws sign, buildings, chest, coins, ground items — called from the main draw loop before enemies.

**Inventory open flow:**
1. Player presses `I` → `inventoryOpen = true`, `gameState = 'paused'`.
2. Update loop returns early when `gameState === 'paused'`; `lastTime` is reset on next frame to avoid dt spikes.
3. Draw loop draws the frozen world, then `drawInventory()` on top.
4. Cursor/click logic runs inside the draw cycle (or a small `updateInventoryCursor()` even while paused).
5. Player presses `I` or `Esc` → `inventoryOpen = false`, `gameState = 'playing'`.

**Active-effect decay:** In main update, decrement `speedBoostTimer`, `swordTimer`. Apply speed multiplier in movement, apply sword range/damage in melee hit check, draw the sword visual while `swordTimer > 0`.

## Error handling / edge cases

- **Game over while inventory open:** Inventory closes automatically; game over screen takes over.
- **Warden sequence while inventory open:** Blocked — `I` does nothing during `gameState === 'warden'`. Helper bird and active effects are paused during warden too (their timers don't tick).
- **Coin/egg collected while inventory full:** Slots are counters (not fixed capacity), so overflow never happens. The game has no max cap per slot for simplicity.
- **Using an item with count 0:** Click is silently ignored (no error).
- **Village spawning inside warden sequence:** Village generation is gated — do not spawn a new village while warden phase is active; wait until warden exits.
- **Helper bird outside camera:** Bird is tethered to player by angle/radius, so it stays on-screen naturally.
- **Shop opened outside a village:** Impossible — only triggered by proximity hitbox.
- **Buying with insufficient coins:** Button is drawn dimmed; click shows "NEED 5 COINS" (or appropriate amount) briefly, no purchase.

## Testing strategy

This is a browser game with no test harness today. Verification is manual:

1. **Smoke run** — launch `index.html`, play until first village appears, confirm yellow tint, houses, coins, shop, chest.
2. **Egg drop** — kill 10–20 enemies, confirm eggs drop roughly 2–4 times.
3. **Inventory open/close** — press `I` during play, confirm pause, cursor responds to mouse/arrows/stick, escape closes.
4. **Shop purchase** — collect coins, enter shop, buy each item, confirm inventory count updates, coin count decrements.
5. **Chest unlock** — enter village with key, unlock chest, confirm random item added, key consumed.
6. **Each item effect** — use egg (helper bird flies, shoots), potion (speed doubles for 5s), sword (melee range doubled for 10s), wand (3 piercing pink shots on X).
7. **Help screen** — from start, press `H`, cycle all four pages, Esc returns.
8. **Gamepad parity** — repeat 3, 4, 5, 7 with Xbox controller (left stick, A, LB/RB, Back, B, d-pad).
9. **Warden interaction** — trigger warden inside a village (or near one); confirm village safe-zone does not block warden phase.
10. **Visual check** — ensure neon style is consistent across new art (houses, chest, items, inventory panel, help pages).

## Open questions

None — all design questions were resolved during brainstorming.

## Out of scope for this spec (future ideas)

- Multiple village biomes with different themes.
- Persistent village unlocks across runs.
- Shopkeeper NPC with animation and dialog.
- Item rarities (common/rare/epic).
- Two-handed inventory (main hand / off hand).
