// === INPUT ===
const keys = {};
const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'z', 'Z', 'y', 'Y', 'x', 'X', 'c', 'C', 'Enter'];
window.addEventListener('keydown', e => { keys[e.key] = true; if (GAME_KEYS.includes(e.key)) e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key] = false; if (GAME_KEYS.includes(e.key)) e.preventDefault(); });

// === GAMEPAD SUPPORT (Xbox controller) ===
// Standard mapping: https://w3c.github.io/gamepad/#remapping
// Buttons: 0=A, 1=B, 2=X, 3=Y, 4=LB, 5=RB, 6=LT, 7=RT, 8=Back, 9=Start, 12=DUp, 13=DDown, 14=DLeft, 15=DRight
// Axes: 0=LStickX, 1=LStickY
const STICK_DEADZONE = 0.3;
const gpKeys = {}; // tracks which keys are set by gamepad

function pollGamepad() {
  // Clear previous gamepad-only keys (don't interfere with keyboard)
  for (const k in gpKeys) {
    if (gpKeys[k] && !keys['_kb_' + k]) keys[k] = false;
    gpKeys[k] = false;
  }

  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
  if (!gp) return;

  function gpSet(key, pressed) {
    if (pressed) { keys[key] = true; gpKeys[key] = true; }
  }

  // Left stick horizontal
  const lx = gp.axes[0] || 0;
  gpSet('ArrowLeft', lx < -STICK_DEADZONE || (gp.buttons[14] && gp.buttons[14].pressed));
  gpSet('ArrowRight', lx > STICK_DEADZONE || (gp.buttons[15] && gp.buttons[15].pressed));

  // A = Jump, D-pad up = Jump
  gpSet('ArrowUp', (gp.buttons[0] && gp.buttons[0].pressed) || (gp.buttons[12] && gp.buttons[12].pressed));
  // X = Melee
  gpSet('z', gp.buttons[2] && gp.buttons[2].pressed);
  // B = Shoot
  gpSet('x', gp.buttons[1] && gp.buttons[1].pressed);
  // Y = Rocket
  gpSet('c', gp.buttons[3] && gp.buttons[3].pressed);
  // Start = Enter
  gpSet('Enter', gp.buttons[9] && gp.buttons[9].pressed);
}

// Track keyboard state separately so gamepad clear doesn't kill keyboard input
const _origKeydown = window.onkeydown;
window.addEventListener('keydown', e => { keys['_kb_' + e.key] = true; });
window.addEventListener('keyup', e => { delete keys['_kb_' + e.key]; });

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
