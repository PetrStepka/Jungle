// === INPUT ===
const keys = {};
const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'z', 'Z', 'y', 'Y', 'x', 'X', 'Enter'];
window.addEventListener('keydown', e => { keys[e.key] = true; if (GAME_KEYS.includes(e.key)) e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key] = false; if (GAME_KEYS.includes(e.key)) e.preventDefault(); });
