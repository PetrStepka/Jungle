// === DRAW HUD ===
function drawHUD() {
  ctx.save();

  ctx.shadowColor = '#f44336';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#f44336';
  ctx.font = '20px sans-serif';
  for (let i = 0; i < player.lives; i++) {
    ctx.fillText('\u2665', 20 + i * 28, 30);
  }

  ctx.shadowColor = COLORS.projectile;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.projectile;
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.floor(score)}`, canvas.width / 2, 30);

  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.player;
  ctx.textAlign = 'right';
  ctx.font = '16px monospace';
  ctx.fillText(`${Math.floor(distance)}m`, canvas.width - 20, 30);

  if (godMode) {
    ctx.shadowColor = COLORS.melee;
    ctx.shadowBlur = 12;
    ctx.fillStyle = COLORS.melee;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GOD MODE', canvas.width / 2, 50);
  }

  ctx.textAlign = 'left';
  ctx.restore();
}

// === DRAW GAME OVER ===
function drawGameOver() {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';

  ctx.shadowColor = COLORS.dino;
  ctx.shadowBlur = 20;
  ctx.fillStyle = COLORS.dino;
  ctx.font = 'bold 48px monospace';
  ctx.fillText('GAME OVER', canvas.width / 2, 200);

  ctx.shadowColor = COLORS.projectile;
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.projectile;
  ctx.font = 'bold 28px monospace';
  ctx.fillText(`Score: ${Math.floor(score)}`, canvas.width / 2, 270);

  ctx.shadowColor = COLORS.melee;
  ctx.shadowBlur = 10;
  ctx.fillStyle = COLORS.melee;
  ctx.font = '20px monospace';
  ctx.fillText(`High Score: ${Math.floor(highScore)}`, canvas.width / 2, 310);

  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.player;
  ctx.font = '18px monospace';
  ctx.fillText('Press ENTER to restart', canvas.width / 2, 380);

  ctx.textAlign = 'left';
  ctx.restore();
}

// === DRAW START SCREEN ===
function drawStartScreen() {
  ctx.save();
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';

  // Title
  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 25;
  ctx.fillStyle = COLORS.player;
  ctx.font = 'bold 52px monospace';
  ctx.fillText('JUNGLE NEON', canvas.width / 2, 120);

  // Subtitle
  ctx.shadowColor = COLORS.projectile;
  ctx.shadowBlur = 10;
  ctx.fillStyle = COLORS.projectile;
  ctx.font = '18px monospace';
  ctx.fillText('Survive the neon jungle', canvas.width / 2, 160);

  // Controls header
  ctx.shadowColor = COLORS.melee;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.melee;
  ctx.font = 'bold 22px monospace';
  ctx.fillText('CONTROLS', canvas.width / 2, 220);

  // Control lines
  ctx.shadowBlur = 6;
  ctx.font = '16px monospace';
  const cx = canvas.width / 2;
  const controls = [
    { key: '\u2190 \u2192', action: 'Move left / right', color: COLORS.player },
    { key: '\u2191', action: 'Jump', color: COLORS.player },
    { key: 'Z / Y', action: 'Melee attack (kills bugs)', color: COLORS.melee },
    { key: 'X', action: 'Shoot (kills dinosaurs)', color: COLORS.projectile },
  ];

  controls.forEach((c, i) => {
    const y = 260 + i * 36;
    ctx.shadowColor = c.color;
    ctx.fillStyle = c.color;
    ctx.textAlign = 'right';
    ctx.fillText(c.key, cx - 20, y);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#aaa';
    ctx.shadowColor = '#aaa';
    ctx.shadowBlur = 2;
    ctx.fillText(c.action, cx + 20, y);
    ctx.shadowBlur = 6;
  });

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

  // Start prompt
  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.player;
  ctx.font = 'bold 20px monospace';
  const blink = Math.floor(Date.now() / 500) % 2 === 0;
  if (blink) ctx.fillText('Press ENTER to start', cx, 500);

  ctx.textAlign = 'left';
  ctx.restore();
}

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
