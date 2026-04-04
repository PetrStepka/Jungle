// === DRAW PROJECTILES ===
function drawProjectiles() {
  ctx.save();

  projectiles.forEach(p => {
    const sx = p.x - camera.x;

    if (p.rocket) {
      // Rocket — orange, big, with fire trail
      ctx.shadowColor = COLORS.rocket;
      ctx.shadowBlur = 15;
      ctx.fillStyle = COLORS.rocket;
      ctx.fillRect(sx, p.y - 4, p.dir * 18, 8);
      // Nose cone
      ctx.beginPath();
      ctx.moveTo(sx + p.dir * 18, p.y - 5);
      ctx.lineTo(sx + p.dir * 26, p.y);
      ctx.lineTo(sx + p.dir * 18, p.y + 5);
      ctx.fill();
      // Fire trail
      for (let i = 1; i <= 4; i++) {
        const alpha = (1 - i * 0.2).toFixed(1);
        const trailW = 8 + i * 3;
        ctx.fillStyle = `rgba(255, ${50 + i * 40}, 0, ${alpha})`;
        ctx.fillRect(sx - p.dir * i * 10, p.y - trailW / 2, 10, trailW);
      }
    } else if (p.hostile) {
      // Arrow (hostile) — white thin line with small trail
      ctx.shadowColor = COLORS.arrow;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = COLORS.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, p.y);
      ctx.lineTo(sx - p.dir * 16, p.y);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(sx, p.y);
      ctx.lineTo(sx - p.dir * 5, p.y - 4);
      ctx.moveTo(sx, p.y);
      ctx.lineTo(sx - p.dir * 5, p.y + 4);
      ctx.stroke();
    } else {
      // Player projectile — cyan with trail
      ctx.shadowColor = COLORS.projectile;
      ctx.shadowBlur = 10;
      for (let i = 1; i <= 3; i++) {
        const alpha = (1 - i * 0.3).toFixed(1);
        ctx.fillStyle = `rgba(0, 188, 212, ${alpha})`;
        ctx.fillRect(sx - p.dir * i * 8, p.y - 2, 10, 4);
      }
      ctx.fillStyle = COLORS.projectile;
      ctx.fillRect(sx, p.y - 3, 12, 6);
    }
  });
  ctx.restore();
}
