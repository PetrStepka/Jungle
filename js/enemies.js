// === DRAW BEETLE ===
function drawBeetle(enemy) {
  const sx = enemy.x - camera.x;
  const sy = enemy.y;
  const f = enemy.facing || -1;

  ctx.save();
  ctx.shadowColor = COLORS.bug;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = COLORS.bug;
  ctx.lineWidth = 2;
  ctx.translate(sx, sy);

  ctx.beginPath();
  ctx.ellipse(0, -8, 14, 8, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(f * 10, -12);
  ctx.lineTo(f * 22, -20);
  ctx.lineTo(f * 18, -14);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(f * 10, -10);
  ctx.lineTo(f * 20, -16);
  ctx.stroke();

  for (let i = -1; i <= 1; i++) {
    const lx = i * 8;
    ctx.beginPath();
    ctx.moveTo(lx, -2);
    ctx.lineTo(lx - 6, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx, -2);
    ctx.lineTo(lx + 6, 4);
    ctx.stroke();
  }

  ctx.restore();
}

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

// === DRAW BIRD ===
function drawBird(enemy) {
  const sx = enemy.x - camera.x;
  const sy = enemy.y;
  const f = enemy.facing || -1;
  const wingFlap = Math.sin(gameTime * 10) * 0.4;

  ctx.save();
  ctx.shadowColor = COLORS.bird;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = COLORS.bird;
  ctx.lineWidth = 2;
  ctx.translate(sx, sy);
  ctx.scale(f * -1, 1);

  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(14, -3, 5, 0, Math.PI * 2);
  ctx.stroke();

  // Beak
  ctx.beginPath();
  ctx.moveTo(19, -3);
  ctx.lineTo(25, -2);
  ctx.lineTo(19, -1);
  ctx.stroke();

  // Eye
  ctx.beginPath();
  ctx.arc(16, -4, 1.5, 0, Math.PI * 2);
  ctx.stroke();

  // Wings (flapping)
  ctx.lineWidth = 2.5;
  // Upper wing
  ctx.beginPath();
  ctx.moveTo(-2, -5);
  ctx.quadraticCurveTo(-5, -18 - wingFlap * 15, -15, -14 - wingFlap * 20);
  ctx.stroke();
  // Lower wing edge
  ctx.beginPath();
  ctx.moveTo(-15, -14 - wingFlap * 20);
  ctx.quadraticCurveTo(-8, -10 - wingFlap * 8, 2, -5);
  ctx.stroke();

  // Tail feathers
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-20, -4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-12, 1);
  ctx.lineTo(-21, 2);
  ctx.stroke();

  ctx.restore();
}

// === DRAW T-REX ===
function drawTRex(enemy) {
  const sx = enemy.x - camera.x;
  const sy = enemy.y;
  const f = enemy.facing || -1;

  ctx.save();
  ctx.shadowColor = COLORS.dino;
  ctx.shadowBlur = 12;
  ctx.strokeStyle = COLORS.dino;
  ctx.lineWidth = 2.5;
  ctx.translate(sx, sy);
  ctx.scale(f * -1, 1);

  ctx.beginPath();
  ctx.moveTo(20, -55);
  ctx.lineTo(38, -52);
  ctx.lineTo(40, -45);
  ctx.lineTo(38, -40);
  ctx.lineTo(20, -42);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(38, -45);
  ctx.lineTo(42, -42);
  ctx.lineTo(38, -40);
  ctx.stroke();

  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const tx = 30 + i * 4;
    ctx.beginPath();
    ctx.moveTo(tx, -40);
    ctx.lineTo(tx + 1, -37);
    ctx.stroke();
  }
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.arc(30, -50, 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(20, -52);
  ctx.quadraticCurveTo(10, -50, 5, -42);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, -42);
  ctx.quadraticCurveTo(12, -40, 5, -35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(5, -42);
  ctx.quadraticCurveTo(-5, -48, -20, -42);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(5, -35);
  ctx.quadraticCurveTo(-5, -25, -20, -30);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-20, -42);
  ctx.quadraticCurveTo(-35, -45, -45, -38);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-20, -30);
  ctx.quadraticCurveTo(-32, -30, -45, -38);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, -35);
  ctx.lineTo(14, -28);
  ctx.lineTo(12, -26);
  ctx.stroke();

  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-10, -30);
  ctx.lineTo(-8, -15);
  ctx.lineTo(-3, -5);
  ctx.lineTo(-8, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-18, -30);
  ctx.lineTo(-20, -15);
  ctx.lineTo(-15, -5);
  ctx.lineTo(-20, 0);
  ctx.stroke();

  ctx.restore();
}

// === SPAWN ENEMIES ===
function spawnEnemies(dt) {
  let bugInterval;
  if (distance < 500) bugInterval = 2.0;
  else if (distance < 1500) bugInterval = 1.2;
  else bugInterval = 0.6;

  bugSpawnTimer -= dt;
  if (bugSpawnTimer <= 0) {
    bugSpawnTimer = bugInterval + Math.random() * bugInterval * 0.5;
    const count = distance > 1500 && Math.random() < 0.4 ? 3 : 1;
    for (let i = 0; i < count; i++) {
      enemies.push({
        type: 'bug',
        x: camera.x + canvas.width + 50 + i * 40,
        y: GROUND_Y,
        w: 28, h: 16,
        hp: 1,
        speed: 150 + Math.random() * 80,
        facing: -1,
        points: 10,
      });
    }
  }

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

  // Skeleton spawn (from 500m)
  if (distance >= 500) {
    let skeletonInterval;
    if (distance < 1500) skeletonInterval = 3.5;
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

  // Bird spawn (from 300m)
  if (distance >= 300) {
    let birdInterval;
    if (distance < 1000) birdInterval = 8.0;
    else if (distance < 2000) birdInterval = 5.0;
    else birdInterval = 3.5;

    birdSpawnTimer -= dt;
    if (birdSpawnTimer <= 0) {
      birdSpawnTimer = birdInterval + Math.random() * birdInterval * 0.4;
      const flyHeight = GROUND_Y - 80 - Math.random() * 120; // flies high
      enemies.push({
        type: 'bird',
        x: camera.x + canvas.width + 60,
        y: flyHeight,
        w: 24, h: 12,
        hp: 1,
        speed: 120 + Math.random() * 60,
        facing: -1,
        points: 20,
        baseY: flyHeight,
        waveSeed: Math.random() * Math.PI * 2,
      });
    }
  }

  if (gameTime > 30) {
    let dinoInterval;
    if (distance < 500) dinoInterval = 8.0;
    else if (distance < 1500) dinoInterval = 4.5;
    else dinoInterval = 2.5;

    dinoSpawnTimer -= dt;
    if (dinoSpawnTimer <= 0) {
      dinoSpawnTimer = dinoInterval + Math.random() * dinoInterval * 0.3;
      enemies.push({
        type: 'dino',
        x: camera.x + canvas.width + 80,
        y: GROUND_Y,
        w: 60, h: 55,
        hp: 3,
        speed: 60 + Math.random() * 30,
        facing: -1,
        points: 50,
      });
    }
  }
}
