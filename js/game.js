// === WARDEN UPDATE ===
function updateWarden(dt) {
  gameTime += dt;

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

  // Fall-off protection during warden
  if (player.y > canvas.height + 50) {
    player.y = GROUND_Y - 100;
    player.vy = 0;
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
        if (player.invincible <= 0 && !godMode) {
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

  if (gameState === 'warden') {
    updateWarden(dt);
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
    if (!godMode) {
      player.lives--;
      screenShake = 0.3;
      if (player.lives <= 0) {
        endGame();
        return;
      }
      player.invincible = 1.5;
    }
    player.y = GROUND_Y - 100;
    player.vy = 0;
  }

  camera.x = player.x - 250;

  const newDistance = Math.max(distance, player.x / 50);
  score += Math.floor(newDistance) - Math.floor(distance);
  distance = newDistance;

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

  if (player.invincible > 0) player.invincible -= dt;
  if (player.meleeCooldown > 0) player.meleeCooldown -= dt;
  if (player.meleeTimer > 0) player.meleeTimer -= dt;
  if (player.shootCooldown > 0) player.shootCooldown -= dt;
  if (player.rocketCooldown > 0) player.rocketCooldown -= dt;

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

  if ((keys['x'] || keys['X']) && player.shootCooldown <= 0) {
    player.shootCooldown = 0.5;
    projectiles.push({
      x: player.x + (player.facing === 1 ? player.w : 0),
      y: player.y - 18,
      dir: player.facing,
      speed: 500,
    });
  }

  // Rocket (C key) — piercing, 10s cooldown
  if ((keys['c'] || keys['C']) && player.rocketCooldown <= 0) {
    player.rocketCooldown = 10;
    projectiles.push({
      x: player.x + (player.facing === 1 ? player.w : 0),
      y: player.y - 18,
      dir: player.facing,
      speed: 400,
      rocket: true,
    });
    screenShake = 0.15;
  }

  projectiles.forEach(p => { p.x += p.dir * p.speed * dt; });
  projectiles = projectiles.filter(p => {
    const sx = p.x - camera.x;
    return sx > -50 && sx < canvas.width + 50;
  });

  projectiles = projectiles.filter(p => {
    if (p.hostile) return true; // hostile arrows don't hit enemies
    let hitSomething = false;
    for (const e of enemies) {
      const ex = e.x - e.w / 2;
      if (p.x > ex && p.x < ex + e.w && p.y > e.y - e.h && p.y < e.y) {
        const dmg = p.rocket ? 999 : 2;
        e.hp -= dmg;
        if (e.type === 'zombie' && e.hp > 0 && !e.rage) {
          e.rage = true;
          e.speed = 220;
          e.points = 25;
        }
        if (p.rocket) {
          hitSomething = true;
          spawnDeathParticles(e.x, e.y - e.h / 2, COLORS.rocket);
          continue; // rocket pierces through
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

  spawnEnemies(dt);
  generateTerrain();

  // Health pickup spawning
  healthSpawnTimer -= dt;
  if (healthSpawnTimer <= 0) {
    healthSpawnTimer = 12 + Math.random() * 8; // every 12-20 seconds
    // Place on a ground segment ahead of camera
    const ahead = terrainSegments.filter(s => s.y === GROUND_Y && s.x > camera.x + canvas.width * 0.5 && s.x < camera.x + canvas.width + 200);
    if (ahead.length > 0) {
      const seg = ahead[Math.floor(Math.random() * ahead.length)];
      healthPickups.push({
        x: seg.x + Math.random() * (seg.w - 20) + 10,
        y: GROUND_Y - 20,
      });
    }
  }

  // Health pickup collection
  healthPickups = healthPickups.filter(h => {
    if (h.x < camera.x - 100) return false;
    const dx = Math.abs((player.x + player.w / 2) - h.x);
    const dy = Math.abs((player.y - player.h / 2) - h.y);
    if (dx < 20 && dy < 25) {
      if (player.lives < 5) {
        player.lives++;
        spawnDeathParticles(h.x, h.y, COLORS.health);
      }
      return false;
    }
    return true;
  });

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

  enemies.forEach(e => {
    if (godMode || player.invincible > 0 || gameState === 'gameOver') return;
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

  // Hostile projectile (arrow) hits player
  if (!godMode && player.invincible <= 0 && gameState !== 'gameOver') {
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

  enemies = enemies.filter(e => {
    if (e.hp <= 0) {
      score += e.points;
      spawnDeathParticles(e.x, e.y - e.h / 2, COLORS[e.type] || COLORS.dino);
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
    else if (e.type === 'zombie') drawZombie(e);
    else if (e.type === 'skeleton') drawSkeleton(e);
    else drawTRex(e);
  });

  // Draw health pickups
  ctx.save();
  ctx.shadowColor = COLORS.health;
  ctx.shadowBlur = 10;
  ctx.fillStyle = COLORS.health;
  ctx.font = '18px sans-serif';
  healthPickups.forEach(h => {
    const hx = h.x - camera.x;
    const bobY = h.y + Math.sin(gameTime * 3) * 3;
    ctx.fillText('\u2665', hx - 6, bobY);
  });
  ctx.restore();

  drawProjectiles();
  drawPlayer();
  drawParticles();

  ctx.restore();

  drawHUD();

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
  player.rocketCooldown = 0;
  player.facing = 1;
  camera.x = 0;
  enemies = [];
  projectiles = [];
  particles = [];
  terrainSegments = [];
  terrainNextX = 0;
  healthPickups = [];
  healthSpawnTimer = 15;
  bugSpawnTimer = 2;
  dinoSpawnTimer = 8;
  zombieSpawnTimer = 3;
  skeletonSpawnTimer = 5;
  nextWardenDistance = 2000;
  wardenPhase = 'none';
  wardenTimer = 0;
  wardenEntity = null;
  noiseLevel = 0;
  wardenOverlayAlpha = 0;
  wardenDetected = false;
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
