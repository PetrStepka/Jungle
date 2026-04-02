// === TERRAIN GENERATION ===
function generateTerrain() {
  while (terrainNextX < camera.x + canvas.width + 400) {
    const rand = Math.random();
    if (rand < 0.15 && terrainNextX > 300) {
      terrainNextX += 80 + Math.random() * 60;
    } else if (rand < 0.3) {
      const w = 120 + Math.random() * 200;
      terrainSegments.push({ x: terrainNextX, y: GROUND_Y - 40 - Math.random() * 30, w, h: 12 });
      terrainSegments.push({ x: terrainNextX, y: GROUND_Y, w, h: 20 });
      terrainNextX += w;
    } else {
      const w = 150 + Math.random() * 300;
      terrainSegments.push({ x: terrainNextX, y: GROUND_Y, w, h: 20 });
      terrainNextX += w;
    }
  }
  terrainSegments = terrainSegments.filter(s => s.x + s.w > camera.x - 200);
}

// === DRAW TERRAIN ===
function drawTerrain() {
  ctx.save();
  ctx.shadowColor = COLORS.terrain;
  ctx.shadowBlur = 6;
  ctx.strokeStyle = COLORS.terrain + '88';
  ctx.lineWidth = 2;

  terrainSegments.forEach(seg => {
    const sx = seg.x - camera.x;
    if (sx + seg.w < -10 || sx > canvas.width + 10) return;
    ctx.strokeRect(sx, seg.y, seg.w, seg.h);
  });
  ctx.restore();
}
