// === SPAWN PARTICLES ===
function spawnDeathParticles(x, y, color) {
  const count = 8 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 100 + Math.random() * 150;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 50,
      size: 2 + Math.random() * 3,
      life: 1.0,
      color,
    });
  }
}

// === DRAW PARTICLES ===
function drawParticles() {
  ctx.save();
  ctx.shadowBlur = 6;
  particles.forEach(p => {
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(p.x - camera.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}
