// === SETUP ===
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 960;
canvas.height = 540;

// === GAME STATE ===
let gameState = 'start';
let score = 0;
let distance = 0;
let highScore = parseInt(localStorage.getItem('jungleNeonHighScore')) || 0;
let screenShake = 0;
let gameTime = 0;

// === CAMERA ===
const camera = { x: 0 };

// === PLAYER ===
const player = {
  x: 200, y: GROUND_Y, w: 24, h: 40,
  vx: 0, vy: 0,
  facing: 1,
  onGround: false,
  lives: 3,
  invincible: 0,
  meleeCooldown: 0,
  meleeTimer: 0,
  shootCooldown: 0,
};

// === TERRAIN ===
let terrainSegments = [];
let terrainNextX = 0;

// === ENEMIES ===
let enemies = [];
let bugSpawnTimer = 0;
let dinoSpawnTimer = 0;
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

// === CHEATS ===
let godMode = false;

// === PROJECTILES ===
let projectiles = [];

// === PARTICLES ===
let particles = [];
