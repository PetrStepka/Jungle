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
