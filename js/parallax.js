// === PARALLAX BACKGROUND ===
const stars = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width * 3,
  y: Math.random() * canvas.height * 0.7,
  size: Math.random() * 2 + 0.5,
  brightness: Math.random() * 0.5 + 0.3,
}));

const bgTrees = Array.from({ length: 30 }, () => ({
  x: Math.random() * canvas.width * 5,
  h: 60 + Math.random() * 80,
  w: 20 + Math.random() * 15,
}));

const fgPlants = Array.from({ length: 40 }, () => ({
  x: Math.random() * canvas.width * 5,
  h: 15 + Math.random() * 30,
  type: Math.random() < 0.5 ? 'fern' : 'vine',
}));

function drawParallax() {
  ctx.save();
  const starOffsetX = camera.x * 0.1;
  stars.forEach(s => {
    const sx = ((s.x - starOffsetX) % (canvas.width * 3) + canvas.width * 3) % (canvas.width * 3);
    if (sx < canvas.width) {
      ctx.fillStyle = `rgba(255, 255, 255, ${s.brightness})`;
      ctx.beginPath();
      ctx.arc(sx, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();

  ctx.save();
  ctx.shadowColor = COLORS.terrain;
  ctx.shadowBlur = 6;
  ctx.strokeStyle = COLORS.terrain + '55';
  ctx.lineWidth = 1.5;
  const treeOffsetX = camera.x * 0.4;
  bgTrees.forEach(t => {
    const tx = ((t.x - treeOffsetX) % (canvas.width * 5) + canvas.width * 5) % (canvas.width * 5);
    if (tx > -50 && tx < canvas.width + 50) {
      ctx.beginPath();
      ctx.moveTo(tx, GROUND_Y + 20);
      ctx.lineTo(tx, GROUND_Y + 20 - t.h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx - t.w, GROUND_Y + 20 - t.h * 0.5);
      ctx.lineTo(tx, GROUND_Y + 20 - t.h - 20);
      ctx.lineTo(tx + t.w, GROUND_Y + 20 - t.h * 0.5);
      ctx.closePath();
      ctx.stroke();
    }
  });
  ctx.restore();

  ctx.save();
  ctx.shadowColor = COLORS.terrain;
  ctx.shadowBlur = 4;
  ctx.strokeStyle = COLORS.terrain + '44';
  ctx.lineWidth = 1;
  const plantOffsetX = camera.x * 0.7;
  fgPlants.forEach(p => {
    const px = ((p.x - plantOffsetX) % (canvas.width * 5) + canvas.width * 5) % (canvas.width * 5);
    if (px > -30 && px < canvas.width + 30) {
      if (p.type === 'fern') {
        ctx.beginPath();
        ctx.moveTo(px, GROUND_Y + 20);
        ctx.quadraticCurveTo(px - 10, GROUND_Y + 20 - p.h * 0.6, px - 15, GROUND_Y + 20 - p.h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px, GROUND_Y + 20);
        ctx.quadraticCurveTo(px + 10, GROUND_Y + 20 - p.h * 0.6, px + 15, GROUND_Y + 20 - p.h);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.quadraticCurveTo(px + 8, p.h * 0.5, px - 5, p.h);
        ctx.stroke();
      }
    }
  });
  ctx.restore();
}
