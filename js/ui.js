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
  ctx.shadowColor = COLORS.bug;
  ctx.shadowBlur = 6;
  ctx.fillStyle = COLORS.bug;
  ctx.font = '14px monospace';
  ctx.fillText('\u2666 Beetles (red) \u2014 fast, 1 HP, melee them!', cx, 420);

  ctx.shadowColor = COLORS.dino;
  ctx.fillStyle = COLORS.dino;
  ctx.fillText('\u2666 T-Rex (orange) \u2014 tough, 3 HP, shoot them!', cx, 445);

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
