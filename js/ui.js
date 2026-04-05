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

  // Hunger bar (right side, below distance)
  const hungerBarW = 80;
  const hungerBarH = 6;
  const hungerBarX = canvas.width - 20 - hungerBarW;
  const hungerBarY = 40;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(hungerBarX, hungerBarY, hungerBarW, hungerBarH);

  let hungerColor;
  if (hunger > 50) hungerColor = COLORS.hungerBar;
  else if (hunger > 20) hungerColor = '#FF5722';
  else hungerColor = '#f44336';

  ctx.shadowColor = hungerColor;
  ctx.shadowBlur = hunger <= 20 ? 12 : 6;
  ctx.fillStyle = hungerColor;
  ctx.fillRect(hungerBarX, hungerBarY, hungerBarW * (hunger / 100), hungerBarH);

  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = hungerColor;
  ctx.fillText('HUNGER', canvas.width - 20, hungerBarY + 16);

  if (hunger <= 0) {
    ctx.fillStyle = '#f44336';
    ctx.shadowColor = '#f44336';
    ctx.shadowBlur = 12;
    ctx.font = 'bold 12px monospace';
    const blink = Math.floor(Date.now() / 300) % 2 === 0;
    if (blink) ctx.fillText('STARVING!', canvas.width - 20, hungerBarY + 30);
  }

  // Rocket cooldown indicator
  ctx.textAlign = 'left';
  ctx.font = '14px monospace';
  if (player.rocketCooldown <= 0) {
    ctx.shadowColor = COLORS.rocket;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLORS.rocket;
    ctx.fillText('\u25C6 ROCKET READY', 20, 55);
  } else {
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#555';
    ctx.fillText(`\u25C6 ROCKET ${Math.ceil(player.rocketCooldown)}s`, 20, 55);
  }

  // Wings timer
  if (player.flyTimer > 0) {
    ctx.textAlign = 'left';
    ctx.shadowColor = COLORS.wings;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLORS.wings;
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`\u2727 WINGS ${Math.ceil(player.flyTimer)}s`, 20, 75);
  }

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

// === DRAW XBOX CONTROLLER DIAGRAM ===
function drawControllerDiagram(ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(1.25, 1.25); // bigger diagram
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#666';
  ctx.shadowBlur = 4;

  // Controller body — rounded shape
  ctx.beginPath();
  ctx.moveTo(-55, -15);
  ctx.quadraticCurveTo(-60, -25, -50, -30);
  ctx.lineTo(50, -30);
  ctx.quadraticCurveTo(60, -25, 55, -15);
  ctx.quadraticCurveTo(65, 5, 50, 20);
  ctx.quadraticCurveTo(35, 35, 20, 30);
  ctx.lineTo(-20, 30);
  ctx.quadraticCurveTo(-35, 35, -50, 20);
  ctx.quadraticCurveTo(-65, 5, -55, -15);
  ctx.stroke();

  // Left stick (circle)
  ctx.shadowColor = COLORS.player;
  ctx.strokeStyle = COLORS.player;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(-30, -5, 10, 0, Math.PI * 2);
  ctx.stroke();
  // Small cross inside stick
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-30, -9); ctx.lineTo(-30, -1);
  ctx.moveTo(-34, -5); ctx.lineTo(-26, -5);
  ctx.stroke();
  ctx.lineWidth = 1.5;

  // D-pad (below-left of stick)
  ctx.beginPath();
  ctx.moveTo(-30, 12); ctx.lineTo(-30, 22);
  ctx.moveTo(-35, 17); ctx.lineTo(-25, 17);
  ctx.stroke();

  // Face buttons — A, B, X, Y (right side)
  const btnR = 6;
  const btnCx = 30;
  const btnCy = -5;

  // Y (top) — rocket
  ctx.shadowColor = COLORS.rocket;
  ctx.strokeStyle = COLORS.rocket;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(btnCx, btnCy - 14, btnR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = COLORS.rocket;
  ctx.textAlign = 'center';
  ctx.fillText('Y', btnCx, btnCy - 11);

  // A (bottom) — jump
  ctx.shadowColor = COLORS.player;
  ctx.strokeStyle = COLORS.player;
  ctx.beginPath();
  ctx.arc(btnCx, btnCy + 14, btnR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = COLORS.player;
  ctx.fillText('A', btnCx, btnCy + 17);

  // X (left) — melee
  ctx.shadowColor = COLORS.melee;
  ctx.strokeStyle = COLORS.melee;
  ctx.beginPath();
  ctx.arc(btnCx - 14, btnCy, btnR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = COLORS.melee;
  ctx.fillText('X', btnCx - 14, btnCy + 3);

  // B (right) — shoot
  ctx.shadowColor = COLORS.projectile;
  ctx.strokeStyle = COLORS.projectile;
  ctx.beginPath();
  ctx.arc(btnCx + 14, btnCy, btnR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = COLORS.projectile;
  ctx.fillText('B', btnCx + 14, btnCy + 3);

  // Start button (small, center-right)
  ctx.shadowColor = '#aaa';
  ctx.strokeStyle = '#aaa';
  ctx.shadowBlur = 3;
  ctx.beginPath();
  ctx.arc(10, -22, 3, 0, Math.PI * 2);
  ctx.stroke();

  // Labels with lines
  ctx.font = '10px monospace';
  ctx.lineWidth = 1;

  // Left stick label — "Move"
  ctx.shadowColor = COLORS.player;
  ctx.strokeStyle = COLORS.player + '66';
  ctx.fillStyle = COLORS.player;
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(-42, -5); ctx.lineTo(-78, -5);
  ctx.stroke();
  ctx.textAlign = 'right';
  ctx.fillText('Move', -80, -2);

  // A label — "Jump"
  ctx.shadowColor = COLORS.player;
  ctx.strokeStyle = COLORS.player + '66';
  ctx.fillStyle = COLORS.player;
  ctx.beginPath();
  ctx.moveTo(btnCx, btnCy + 21); ctx.lineTo(btnCx, btnCy + 38);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillText('Jump', btnCx, btnCy + 47);

  // X label — "Melee"
  ctx.shadowColor = COLORS.melee;
  ctx.strokeStyle = COLORS.melee + '66';
  ctx.fillStyle = COLORS.melee;
  ctx.beginPath();
  ctx.moveTo(btnCx - 21, btnCy); ctx.lineTo(btnCx - 42, btnCy - 8);
  ctx.stroke();
  ctx.textAlign = 'right';
  ctx.fillText('Melee', btnCx - 44, btnCy - 5);

  // B label — "Shoot"
  ctx.shadowColor = COLORS.projectile;
  ctx.strokeStyle = COLORS.projectile + '66';
  ctx.fillStyle = COLORS.projectile;
  ctx.beginPath();
  ctx.moveTo(btnCx + 21, btnCy); ctx.lineTo(btnCx + 45, btnCy);
  ctx.stroke();
  ctx.textAlign = 'left';
  ctx.fillText('Shoot', btnCx + 47, btnCy + 3);

  // Y label — "Rocket"
  ctx.shadowColor = COLORS.rocket;
  ctx.strokeStyle = COLORS.rocket + '66';
  ctx.fillStyle = COLORS.rocket;
  ctx.beginPath();
  ctx.moveTo(btnCx, btnCy - 21); ctx.lineTo(btnCx, btnCy - 38);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillText('Rocket', btnCx, btnCy - 41);

  // Start label
  ctx.shadowColor = '#aaa';
  ctx.strokeStyle = '#aaa66';
  ctx.fillStyle = '#aaa';
  ctx.beginPath();
  ctx.moveTo(10, -26); ctx.lineTo(10, -38);
  ctx.stroke();
  ctx.fillText('Start', 10, -41);

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

  // Controls — two columns: Keyboard (left) and Xbox (right)
  const cx = canvas.width / 2;

  ctx.shadowColor = COLORS.melee;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.melee;
  ctx.font = 'bold 16px monospace';

  // Keyboard column
  ctx.textAlign = 'center';
  ctx.fillText('KEYBOARD', cx - 160, 200);

  ctx.font = '13px monospace';
  ctx.shadowBlur = 5;
  const kbControls = [
    { key: '\u2190 \u2192', action: 'Move', color: COLORS.player },
    { key: '\u2191', action: 'Jump', color: COLORS.player },
    { key: 'Z / Y', action: 'Melee', color: COLORS.melee },
    { key: 'X', action: 'Shoot', color: COLORS.projectile },
    { key: 'C', action: 'Rocket', color: COLORS.rocket },
  ];

  kbControls.forEach((c, i) => {
    const y = 222 + i * 22;
    ctx.shadowColor = c.color;
    ctx.fillStyle = c.color;
    ctx.textAlign = 'right';
    ctx.fillText(c.key, cx - 190, y);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#888';
    ctx.shadowColor = '#888';
    ctx.shadowBlur = 1;
    ctx.fillText(c.action, cx - 180, y);
    ctx.shadowBlur = 5;
  });

  // Xbox controller diagram
  ctx.shadowColor = COLORS.melee;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.melee;
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('XBOX CONTROLLER', cx + 160, 200);

  drawControllerDiagram(cx + 160, 280);

  // Enemies info
  ctx.textAlign = 'center';
  ctx.font = '12px monospace';
  ctx.shadowBlur = 5;

  const enemyInfo = [
    { text: 'Beetles (red) \u2014 melee them!', color: COLORS.bug },
    { text: 'Zombies (green) \u2014 rage when hit!', color: COLORS.zombie },
    { text: 'Skeletons (white) \u2014 shoot arrows!', color: COLORS.skeleton },
    { text: 'Birds (purple) \u2014 kill for 10s flight!', color: COLORS.bird },
    { text: 'T-Rex (orange) \u2014 3 HP, shoot them!', color: COLORS.dino },
    { text: 'Warden (cyan) \u2014 stay still!', color: COLORS.warden },
  ];

  enemyInfo.forEach((info, i) => {
    ctx.shadowColor = info.color;
    ctx.fillStyle = info.color;
    ctx.fillText('\u2666 ' + info.text, cx, 360 + i * 15);
  });

  // Tips
  ctx.shadowColor = COLORS.food;
  ctx.shadowBlur = 4;
  ctx.fillStyle = COLORS.food;
  ctx.font = '11px monospace';
  ctx.fillText('Collect food to survive hunger \u2022 Hearts = extra lives \u2022 Kill birds = wings!', cx, 460);

  // Start prompt
  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.player;
  ctx.font = 'bold 20px monospace';
  const blink = Math.floor(Date.now() / 500) % 2 === 0;
  if (blink) ctx.fillText('Press ENTER or START to play', cx, 478);

  // Author credit
  ctx.shadowBlur = 3;
  ctx.fillStyle = '#555';
  ctx.shadowColor = '#555';
  ctx.font = '10px monospace';
  ctx.fillText('by Petr \u0160t\u011bpka Jr. (age 6) \u2022 vibe coded with Claude Code & Whisper Flow', cx, 528);

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
