# Minecraft-Inspired Enemies — Design Spec

Three new enemies inspired by Minecraft's Warden, Zombie, and Skeleton, adapted to the neon wireframe 2D side-scroller style of Jungle Neon.

## Approach

Minimal invasion (Approach A). New enemies use the existing patterns: `type` field on enemy objects, spawn timers, shared `enemies[]` array. Warden sequence uses a new `gameState = 'warden'`. Skeleton arrows go into the existing `projectiles[]` with a `hostile: true` flag.

No refactoring of existing beetle/dino code. No module registry or behavior system.

---

## 1. Zombie (Nemrtvý chodec)

### Visual
- Color: `#7CFC00` (toxic green), rage color: `#ADFF2F` (brighter green)
- Neon wireframe humanoid: round head, body, arms stretched forward, shuffling legs
- shadowBlur: 8, lineWidth: 2
- Hitbox: 30x45px
- Larger than Beetle, smaller than T-Rex

### Mechanics
- **Spawn**: from 200m distance
- **Spawn interval**: 3.0s (< 500m), 2.0s (500-1500m), 1.2s (> 1500m)
- **Group size**: 1-2
- **HP**: 2
- **Normal speed**: 60 (very slow, walks left)
- **Rage state**: after taking any damage without dying, speed increases to 220 (faster than player's 260 but creates pressure), color changes to `zombieRage`, blinks
- **Points**: 15 (normal), 25 (killed during rage)
- **Damage**: 1 life on contact (same as all enemies)

### Tactical Intent
Player must either land 2 melee hits quickly, or hit with ranged (2 dmg = instant kill). A single melee hit (1 dmg) triggers rage. Ranged shot (2 dmg) kills instantly since Zombie has 2 HP. Punishes careless single-melee-and-move-on play.

---

## 2. Skeleton (Kostlivec)

### Visual
- Color: `#E0E0E0` (bone white)
- Wireframe skeleton: skull (circle + jaw lines), ribcage (arc pairs), thin limbs
- Holds a bow (triangular arc with string line)
- shadowBlur: 8, lineWidth: 1.5
- Hitbox: 28x48px

### Mechanics
- **Spawn**: from 500m distance
- **Spawn interval**: 5.0s (< 500m), 3.5s (500-1500m), 2.0s (> 1500m)
- **HP**: 2
- **Base speed**: 40 (slow, walks left)
- **Retreat behavior**: if player is closer than 250px horizontally, Skeleton stops moving left and retreats right at speed 80 (tries to maintain distance)
- **Shooting**: fires an arrow every 1.5s toward the player
  - Arrow properties: speed 350, hitbox 12x4px, color `#E0E0E0`
  - Added to `projectiles[]` with `hostile: true` flag
  - Player's projectiles can destroy arrows (both projectile and arrow are removed on collision)
  - Arrow deals 1 life damage on contact with player
- **Points**: 30
- **Kill methods**: melee (2 hits) or ranged (1 shot = 2 dmg = kill)

### Tactical Intent
Ranged threat that forces player to either dodge arrows and close distance for melee, or engage in ranged duel. Retreat behavior prevents easy melee rushdown. Projectile-vs-projectile collision adds a skill layer.

---

## 3. Warden (Strážce hlubin)

### Visual
- Color: `#00CED1` (dark turquoise)
- Massive wireframe humanoid: ~80x90px
- Wide torso, huge arms, two antennae/growths on head
- No eyes — smooth head with only antennae
- Pulsating core on chest: circle with sinusoidal opacity (breathing effect)
- shadowBlur: 20+ (significantly stronger glow than other enemies)
- lineWidth: 3 (thicker strokes = sense of mass)

### Warden Sequence — gameState `'warden'`

**Trigger**: first at 2000m, then every ~2000m (with +-500m randomness). Tracked via `nextWardenDistance` variable.

**Phase 1 — Intro (2s):**
- Screen darkens (overlay opacity grows from 0 to 0.5)
- Screen shake
- Warden appears at right edge of screen and starts walking left slowly

**Phase 2 — Stealth (10-12s):**
- Warden walks left at speed 30
- Player can stand (quiet) or move (noisy)
- **Noise system**: simple `noiseLevel` float (0-100)
  - Standing still: noiseLevel decreases at -2/s (floor 0)
  - Running (ArrowLeft/ArrowRight): noiseLevel increases at +3/s
  - Jumping: noiseLevel += 5 instant
- **Visual feedback**: ring around Warden changes color based on noise
  - Green (noiseLevel < 30): safe
  - Yellow (noiseLevel 30-60): warning
  - Red (noiseLevel > 60): danger
- Normal enemies do NOT spawn during sequence
- Player melee/ranged inputs are ignored (no attacks during sequence)

**Phase 3 — Detection (noiseLevel > 80):**
- Warden turns toward player, 0.3s pause
- **Sonic wave**: visual expanding ring/pulse across full screen width
- Deals 2 damage (2 lives lost)
- Large screen shake (0.5)
- After wave, Warden continues walking left (single punishment, no rage loop)

**Phase 4 — Exit:**
- Warden walks off left edge of screen
- gameState returns to `'playing'`
- Overlay fades out
- If player survived without detection: +100 bonus points

**Warden is invincible.** No HP, cannot be damaged. Player attacks are disabled during sequence.

### Tactical Intent
Pure horror moment. Player must stop, wait, and move only in short careful bursts. Stark contrast to the frenetic pace of the rest of the game. The noise meter visual feedback gives clear information without being too forgiving.

---

## Spawn Cadence

| Distance | New Enemy | Teaching Moment |
|---|---|---|
| 0m | Beetle | Teaches melee basics |
| 200m | Zombie | Teaches that 1 hit isn't enough, rage mechanic |
| 500m | Skeleton | Introduces ranged threat, arrow dodging |
| 30s (~750m) | T-Rex | Existing tank enemy |
| 2000m | Warden sequence | First stealth moment, repeats every ~2000m |

## New Colors (COLORS object)

```javascript
zombie: '#7CFC00',
zombieRage: '#ADFF2F',
skeleton: '#E0E0E0',
arrow: '#E0E0E0',
warden: '#00CED1',
```

## Files Changed

| File | Changes |
|---|---|
| `js/constants.js` | New color entries |
| `js/state.js` | New spawn timers (`zombieSpawnTimer`, `skeletonSpawnTimer`), warden state (`noiseLevel`, `wardenPhase`, `wardenTimer`, `nextWardenDistance`) |
| `js/enemies.js` | `drawZombie()`, `drawSkeleton()`, `drawWarden()` functions + spawn logic for zombie/skeleton in `spawnEnemies()` |
| `js/game.js` | Update logic: zombie rage behavior, skeleton retreat AI + shooting, warden sequence state machine, hostile projectile collision with player, hostile vs player projectile collision, death particle color mapping for new types |
| `js/collision.js` | No structural changes needed (existing `rectsOverlap` works for all) |
| `js/ui.js` | Warden overlay drawing, warden noise meter HUD, update start screen enemy descriptions |

## Enemy Summary Table

| Enemy | HP | Speed | Damage | Points | Kill Method |
|---|---|---|---|---|---|
| Beetle | 1 | 150-230 | 1 | 10 | 1 melee or 1 shot |
| Zombie | 2 | 60 (rage: 220) | 1 | 15/25 | 2 melee, or 1 shot, or melee+melee |
| Skeleton | 2 | 40 (retreat: 80) | 1 (arrows) | 30 | 2 melee or 1 shot |
| T-Rex | 3 | 60-90 | 1 | 50 | 3 melee or 1 shot + 1 melee |
| Warden | invincible | 30 | 2 (sonic) | 100 (survive) | Cannot be killed |
