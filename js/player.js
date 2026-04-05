// === DRAW PLAYER ===
function drawPlayer() {
  if (player.invincible > 0 && Math.floor(player.invincible * 10) % 2 === 0) return;

  const sx = player.x - camera.x;
  const sy = player.y;
  const f = player.facing;

  ctx.save();
  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 12;
  ctx.strokeStyle = COLORS.player;
  ctx.lineWidth = 2;
  ctx.translate(sx + player.w / 2, sy);
  ctx.scale(f, 1);

  ctx.beginPath();
  ctx.arc(0, -30, 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(0, -4);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(10, -10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(-8, -12);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(7, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(-7, 0);
  ctx.stroke();

  ctx.restore();

  // Wings when flying
  if (player.flyTimer > 0) {
    const wingFlap = Math.sin(gameTime * 12) * 0.5;
    const wingAlpha = player.flyTimer < 3 ? 0.3 + 0.7 * (player.flyTimer / 3) : 1;
    ctx.save();
    ctx.shadowColor = COLORS.wings;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = `rgba(206, 147, 216, ${wingAlpha})`;
    ctx.lineWidth = 2;
    const wx = sx + player.w / 2;
    const wy = sy - 18;
    // Left wing
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx - 15, wy - 18 - wingFlap * 20, wx - 28, wy - 10 - wingFlap * 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(wx - 28, wy - 10 - wingFlap * 25);
    ctx.quadraticCurveTo(wx - 12, wy - 8 - wingFlap * 10, wx, wy);
    ctx.stroke();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + 15, wy - 18 - wingFlap * 20, wx + 28, wy - 10 - wingFlap * 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(wx + 28, wy - 10 - wingFlap * 25);
    ctx.quadraticCurveTo(wx + 12, wy - 8 - wingFlap * 10, wx, wy);
    ctx.stroke();
    ctx.restore();
  }

  if (player.meleeTimer > 0) {
    ctx.save();
    ctx.shadowColor = COLORS.melee;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = COLORS.melee;
    ctx.lineWidth = 3;
    const arcX = sx + player.w / 2 + f * 15;
    const arcY = sy - 15;
    const startAngle = f === 1 ? -Math.PI * 0.6 : Math.PI * 0.6;
    const endAngle = f === 1 ? Math.PI * 0.3 : Math.PI + Math.PI * 0.3;
    ctx.beginPath();
    ctx.arc(arcX, arcY, 28, startAngle, endAngle, f === -1);
    ctx.stroke();
    ctx.restore();
  }
}
