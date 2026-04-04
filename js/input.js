// === INPUT ===
const keys = {};
const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'z', 'Z', 'y', 'Y', 'x', 'X', 'Enter'];
window.addEventListener('keydown', e => { keys[e.key] = true; if (GAME_KEYS.includes(e.key)) e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key] = false; if (GAME_KEYS.includes(e.key)) e.preventDefault(); });

// === CHEAT CODE DETECTION ===
let cheatBuffer = '';
window.addEventListener('keydown', e => {
  cheatBuffer += e.key.toLowerCase();
  if (cheatBuffer.length > 10) cheatBuffer = cheatBuffer.slice(-10);
  if (cheatBuffer.endsWith('iddqd')) {
    godMode = !godMode;
    cheatBuffer = '';
  }
});
