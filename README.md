# Jungle Neon

A neon wireframe 2D side-scroller where you fight through an endless jungle full of dangerous creatures. Built entirely through vibe coding by a 6-year-old.

## About

Jungle Neon is a browser-based action game with a distinctive neon wireframe visual style. You run, jump, slash, and shoot your way through procedurally generated terrain while battling increasingly dangerous enemies - from simple beetles to a terrifying Warden boss that hunts you by sound.

**Vibe coded by Petr Stepka Jr. (age 6)** using [Claude Code](https://claude.ai/code) and [Wispr Flow](https://wisprflow.com).

## How to Play

Open `index.html` in any modern browser. No build tools, no dependencies, no install.

### Keyboard Controls

| Key | Action |
|-----|--------|
| Arrow Left / Right | Move |
| Arrow Up | Jump |
| Z / Y | Melee attack |
| X | Shoot |
| C | Rocket (piercing, 10s cooldown) |
| Enter | Start / Restart |

### Xbox Controller (Bluetooth)

| Button | Action |
|--------|--------|
| Left Stick / D-Pad | Move |
| A / D-Pad Up | Jump |
| X | Melee attack |
| B | Shoot |
| Y | Rocket |
| Start | Start / Restart |

## Enemies

| Enemy | Color | HP | Behavior |
|-------|-------|----|----------|
| Beetle | Red | 1 | Fast, melee range |
| Zombie | Green | 2 | Slow, but rages (speeds up) when hit |
| Skeleton | White | 2 | Shoots arrows, retreats when you approach |
| T-Rex | Orange | 3 | Tough tank |
| Warden | Cyan | Invincible | Stealth boss - stay still or face the sonic blast |

## Survival Mechanics

- **Hunger** - depletes over time, collect food (apples, bananas, meat) to stay alive. Starving = losing lives.
- **Health pickups** - pink hearts restore 1 life (max 5).
- **Rocket** - piercing projectile that destroys everything in its path, 10 second cooldown.

## Secret

There may or may not be a classic cheat code hidden in the game.

## Tech

Pure vanilla JavaScript + Canvas 2D. No frameworks, no bundlers, no dependencies. Just HTML, CSS, and JS files loaded via script tags.

## License

Made with fun.
