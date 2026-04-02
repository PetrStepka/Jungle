// === UPDATE ===
function update(dt) {
  if (gameState === 'start') {
    if (keys['Enter']) { gameState = 'playing'; }
    return;
  }

  if (gameState === 'gameOver') {
    if (keys['Enter']) resetGame();
    return;
  }

  gameTime += dt;

  player.vx = 0;
  if (keys['ArrowLeft']) { player.vx = -PLAYER_SPEED; player.facing = -1; }
  if (keys['ArrowRight']) { player.vx = PLAYER_SPEED; player.facing = 1; }
  if (keys['ArrowUp'] && player.onGround) { player.vy = JUMP_FORCE; player.onGround = false; }

  player.vy += GRAVITY * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  if (player.x < 0) player.x = 0;

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

  if (player.y > canvas.height + 50) {
    player.lives--;
    screenShake = 0.3;
    if (player.lives <= 0) {
      endGame();
      return;
    }
    player.y = GROUND_Y - 100;
    player.vy = 0;
    player.invincible = 1.5;
  }

  camera.x = player.x - 250;

  const newDistance = Math.max(distance, player.x / 50);
  score += Math.floor(newDistance) - Math.floor(distance);
  distance = newDistance;

  if (player.invincible > 0) player.invincible -= dt;
  if (player.meleeCooldown > 0) player.meleeCooldown -= dt;
  if (player.meleeTimer > 0) player.meleeTimer -= dt;
  if (player.shootCooldown > 0) player.shootCooldown -= dt;

  if ((keys['z'] || keys['Z'] || keys['y'] || keys['Y']) && player.meleeCooldown <= 0) {
    player.meleeCooldown = 0.3;
    player.meleeTimer = 0.15;
    const hitbox = meleeHitbox();
    enemies.forEach(e => {
      if (rectsOverlap(hitbox, { x: e.x - e.w / 2, y: e.y, w: e.w, h: e.h })) {
        e.hp -= 1;
      }
    });
  }

  if ((keys['x'] || keys['X']) && player.shootCooldown <= 0) {
    player.shootCooldown = 0.5;
    projectiles.push({
      x: player.x + (player.facing === 1 ? player.w : 0),
      y: player.y - 18,
      dir: player.facing,
      speed: 500,
    });
  }

  projectiles.forEach(p => { p.x += p.dir * p.speed * dt; });
  projectiles = projectiles.filter(p => {
    const sx = p.x - camera.x;
    return sx > -50 && sx < canvas.width + 50;
  });

  projectiles = projectiles.filter(p => {
    for (const e of enemies) {
      const ex = e.x - e.w / 2;
      if (p.x > ex && p.x < ex + e.w && p.y > e.y - e.h && p.y < e.y) {
        e.hp -= 2;
        return false;
      }
    }
    return true;
  });

  spawnEnemies(dt);
  generateTerrain();

  enemies.forEach(e => {
    e.x -= e.speed * dt;
  });

  enemies.forEach(e => {
    if (player.invincible > 0 || gameState === 'gameOver') return;
    const playerBox = { x: player.x, y: player.y, w: player.w, h: player.h };
    const enemyBox = { x: e.x - e.w / 2, y: e.y, w: e.w, h: e.h };
    if (rectsOverlap(playerBox, enemyBox)) {
      player.lives--;
      player.invincible = 1.5;
      screenShake = 0.3;
      if (player.lives <= 0) {
        endGame();
      }
    }
  });

  enemies = enemies.filter(e => {
    if (e.hp <= 0) {
      score += e.points;
      spawnDeathParticles(e.x, e.y - e.h / 2, e.type === 'bug' ? COLORS.bug : COLORS.dino);
      return false;
    }
    if (e.x < camera.x - 100) return false;
    return true;
  });

  particles.forEach(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 200 * dt;
    p.life -= dt * 1.5;
  });
  particles = particles.filter(p => p.life > 0);

  if (screenShake > 0) screenShake -= dt;
}

// === DRAW ===
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === 'start') {
    drawStartScreen();
    return;
  }

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  if (screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * screenShake * 20;
    const shakeY = (Math.random() - 0.5) * screenShake * 20;
    ctx.translate(shakeX, shakeY);
  }

  drawParallax();
  drawTerrain();

  enemies.forEach(e => {
    if (e.type === 'bug') drawBeetle(e);
    else drawTRex(e);
  });

  drawProjectiles();
  drawPlayer();
  drawParticles();

  ctx.restore();

  drawHUD();

  if (gameState === 'gameOver') drawGameOver();
}

// === RESET ===
function resetGame() {
  gameState = 'playing';
  score = 0;
  distance = 0;
  gameTime = 0;
  player.x = 200;
  player.y = GROUND_Y - 50;
  player.vx = 0;
  player.vy = 0;
  player.lives = 3;
  player.invincible = 0;
  player.meleeCooldown = 0;
  player.meleeTimer = 0;
  player.shootCooldown = 0;
  player.facing = 1;
  camera.x = 0;
  enemies = [];
  projectiles = [];
  particles = [];
  terrainSegments = [];
  terrainNextX = 0;
  bugSpawnTimer = 2;
  dinoSpawnTimer = 8;
  screenShake = 0;
  generateTerrain();
}

function endGame() {
  gameState = 'gameOver';
  if (score > highScore) {
    highScore = Math.floor(score);
    localStorage.setItem('jungleNeonHighScore', highScore);
  }
}

// === GAME LOOP ===
let lastTime = null;
function gameLoop(timestamp) {
  if (lastTime === null) { lastTime = timestamp; }
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  update(dt);
  draw();
  requestAnimationFrame(gameLoop);
}

generateTerrain();
requestAnimationFrame(gameLoop);
