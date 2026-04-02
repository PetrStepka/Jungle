// === COLLISION HELPERS ===
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y - a.h < b.y && a.y > b.y - b.h;
}

function meleeHitbox() {
  const range = 28;
  return {
    x: player.x + (player.facing === 1 ? player.w / 2 : -range - player.w / 2),
    y: player.y,
    w: range + player.w / 2,
    h: 30,
  };
}
