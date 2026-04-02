// === DRAW PROJECTILES ===
function drawProjectiles() {
  ctx.save();
  ctx.shadowColor = COLORS.projectile;
  ctx.shadowBlur = 10;

  projectiles.forEach(p => {
    const sx = p.x - camera.x;
    for (let i = 1; i <= 3; i++) {
      const alpha = (1 - i * 0.3).toFixed(1);
      ctx.fillStyle = `rgba(0, 188, 212, ${alpha})`;
      ctx.fillRect(sx - p.dir * i * 8, p.y - 2, 10, 4);
    }
    ctx.fillStyle = COLORS.projectile;
    ctx.fillRect(sx, p.y - 3, 12, 6);
  });
  ctx.restore();
}
