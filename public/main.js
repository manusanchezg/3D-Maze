import Player from "./script/player.js";
import Board from "./script/board.js";
import mazeFactory from "./generation/createMaze.js";
import Maze3d from "./generation/maze3d.js";
import BreadthFirstSearch from "./search-algorithms/breadth-first-search.js";
import DepthFirstSearch from "./search-algorithms/depth-first-search.js";
import AStarSearch from "./search-algorithms/A_-search.js";

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const floors = urlParams.get("floors");
const size = urlParams.get("size");
const username = urlParams.get("username")
const mazeTypeParam = urlParams.get("mazeType");
// Parse numeric parameters (URLSearchParams returns strings)
const floorsNum = Number(floors);
const sizeNum = Number(size);

const storageKey = username ? `maze3d_${username}` : null;

let maze = null;
// If a username was provided, try to load a saved maze for that user.
if (storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
        const parsed = JSON.parse(raw);
        // If parsed seems like a saved maze (has .maze, .size, .floors), use it
        if (parsed && parsed.maze && typeof parsed.size !== 'undefined' && typeof parsed.floors !== 'undefined') {
          // Reconstruct Maze3d (and Cell instances) as a plain object with expected API
          maze = Maze3d.fromJSON(parsed);
        }
      }
  } catch (e) {
    console.warn('Could not load saved maze from localStorage:', e);
  }
}

// If we didn't get a saved maze, generate a new one and save it
if (!maze) {
  maze = mazeFactory.getMaze(mazeTypeParam, sizeNum, floorsNum);
  if (storageKey) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(maze));
    } catch (e) {
      console.warn('Could not save maze to localStorage:', e);
    }
  }
}

// Create player from maze.location. Some saved mazes may have location as plain object already.
const player = new Player(maze.location);
const board = new Board(maze, player);

board.displayMaze(maze.location.floor);

// Helper to remove saved maze entries from localStorage for the current user.
function clearSavedMaze() {
  if (!storageKey) return;
  try {
    // Prefer removing the exact storageKey
    localStorage.removeItem(storageKey);
  } catch (e) {
    console.warn('Could not remove saved game from localStorage:', e);
  }
  try {
    // Also remove any fallback keys that include the username (landing.js may have saved variants)
    const namePart = username || '';
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('maze3d_') && namePart && k.includes(namePart)) {
        try { localStorage.removeItem(k); } catch (e) { /* ignore individual failures */ }
      }
    }
  } catch (e) {
    // ignore iteration errors
  }
}

// Pulse styles are provided in style/style.css; overlays use classes.

/**
 * Show a pulse animation in the given cell on either 'up' or 'down' half.
 * Returns a promise that resolves when the animation ends (approx 420ms).
 */
function showHalfPulse(cell, dir) {
  return new Promise((resolve) => {
    if (!cell) return resolve();
    // light haptic feedback on supported devices
    try { if (navigator && typeof navigator.vibrate === 'function') navigator.vibrate(20); } catch (e) {}
    // make sure cell is positioned relatively to host absolute children
    if (getComputedStyle(cell).position === 'static') cell.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.className = `pulse-overlay pulse-half ${dir === 'up' ? 'pulse-up' : 'pulse-down'}`;
    overlay.textContent = dir === 'up' ? '\u25B2' : '\u25BC';
    cell.appendChild(overlay);

    // Remove overlay after animation duration
    const timeout = setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve();
    }, 250);

    // Fallback: if user navigates away, ensure cleanup
    overlay._cleanup = () => {
      clearTimeout(timeout);
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve();
    };
  });
}

/**
 * Show a full-cell pulse (covers entire cell) with arrow up/down.
 * Returns a promise that resolves after the animation.
 */
function showFullPulse(cell, dir) {
  return new Promise((resolve) => {
    // light haptic feedback on supported devices
    try { if (navigator && typeof navigator.vibrate === 'function') navigator.vibrate(20); } catch (e) {}
    if (!cell) return resolve();
    if (getComputedStyle(cell).position === 'static') cell.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.className = `pulse-overlay pulse-full ${dir === 'up' ? 'pulse-up' : 'pulse-down'}`;
    overlay.textContent = dir === 'up' ? '\u25B2' : '\u25BC';
    cell.appendChild(overlay);

    const timeout = setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve();
    }, 420);

    overlay._cleanup = () => {
      clearTimeout(timeout);
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve();
    };
  });
}

// returns a map of direction id -> [moveType, newFloor, newRow, newCol]
function getDirectionMap(currentPlayer) {
  return new Map([
    ["floorUpButton", [0, currentPlayer.floor + 1, currentPlayer.row, currentPlayer.col]],
    ["floorDownButton", [1, currentPlayer.floor - 1, currentPlayer.row, currentPlayer.col]],
    ["forwardButton", [2, currentPlayer.floor, currentPlayer.row - 1, currentPlayer.col]],
    ["rightButton", [3, currentPlayer.floor, currentPlayer.row, currentPlayer.col + 1]],
    ["backwardButton", [4, currentPlayer.floor, currentPlayer.row + 1, currentPlayer.col]],
    ["leftButton", [5, currentPlayer.floor, currentPlayer.row, currentPlayer.col - 1]],
  ]);
}

function handleMove(directionId, { showAlert = false } = {}) {
  if (!directionId) return false;
  const dirMap = getDirectionMap(player);
  const direction = dirMap.get(directionId);
  if (!direction) return false;

  if (board.canMove(direction[0])) {
    board.updatePlayersLocation(maze, direction[1], direction[2], direction[3], directionId);

    // Check if player reached goal
    if (board.isGameOver()) {
      clearSavedMaze();
      window.location.href = "win.html";
    }
    return true;
  } else {
    if (showAlert) alert("You can't move that way because there is a wall!");
    return false;
  }
}

const buttons = document.getElementById("buttons");
buttons.addEventListener("click", (e) => {
  // ignore clicks that are not on elements inside the container
  if (!(e.target instanceof HTMLElement)) return;
  const id = e.target.id;
  // briefly highlight the clicked button for feedback
  highlightButton(id, true);
  handleMove(id);
  setTimeout(() => highlightButton(id, false), 150);
});

// Recompute maze layout when viewport size/orientation changes
function debounce(fn, wait) {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

const rerenderMaze = debounce(() => {
  try {
    // re-display current floor to recalc cell sizes based on container
    board.displayMaze(player.floor);
  } catch (e) {
    // ignore if board/player not yet initialized
  }
}, 120);

window.addEventListener('resize', rerenderMaze);
window.addEventListener('orientationchange', rerenderMaze);

// Keyboard support: Arrow keys + PageUp/PageDown
// Highlight helper: applies a visible outline while the button is active
function highlightButton(btnId, on) {
  const el = document.getElementById(btnId);
  if (!el) return;
  if (on) {
    // store previous inline outline so we can restore later
    if (el.dataset._prevOutline === undefined) el.dataset._prevOutline = el.style.outline || '';
    el.style.outline = '3px solid #ffd54f';
    el.style.transition = 'outline 120ms';
  } else {
    el.style.outline = el.dataset._prevOutline || '';
    delete el.dataset._prevOutline;
  }
}

// Map key event to direction id. Supports Arrow keys, PageUp/PageDown, WASD and R/F.
function keyToDirectionId(e) {
  const key = (e.key || '').toLowerCase();
  switch (key) {
    case 'arrowup':
    case 'w':
      return 'forwardButton';
    case 'arrowdown':
    case 's':
      return 'backwardButton';
    case 'arrowleft':
    case 'a':
      return 'leftButton';
    case 'arrowright':
    case 'd':
      return 'rightButton';
    case 'pageup':
    case 'r':
      return 'floorUpButton';
    case 'pagedown':
    case 'f':
      return 'floorDownButton';
    default:
      return null;
  }
}

// Auto-repeat support when holding keys: track pressed keys and timers
// Behavior: immediate move on keydown, then wait INITIAL_DELAY before
// performing the first repeated move, after which repeat every REPEAT_DELAY.
const _pressedKeyState = new Map(); // key -> { dirId, timeoutId, intervalId }
const INITIAL_DELAY = 500; // ms before first repeated move while holding
const REPEAT_DELAY = 200; // ms between repeated moves after initial delay

window.addEventListener('keydown', (e) => {
  // ignore typing into inputs or textareas
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

  const rawKey = e.key || '';
  const dirId = keyToDirectionId(e);
  if (!dirId) return;

  // prevent default behavior (page scroll for PageUp/PageDown)
  e.preventDefault();

  // If this physical key is already pressed, ignore duplicate keydown events
  if (_pressedKeyState.has(rawKey)) return;

  // First immediate move
  handleMove(dirId);
  highlightButton(dirId, true);

  // Start a timeout that will perform the first repeated move after INITIAL_DELAY
  // and then set an interval to continue repeating every REPEAT_DELAY.
  const timeoutId = setTimeout(() => {
    // perform the first repeated move after initial delay
    const ok = handleMove(dirId);
    if (!ok) {
      // blocked by wall: clear timeout, unhighlight and don't start interval
      const entry = _pressedKeyState.get(rawKey);
      if (entry) {
        highlightButton(entry.dirId, false);
        _pressedKeyState.delete(rawKey);
      }
      return;
    }
    // then start interval for continuous repeats
    const intervalId = setInterval(() => {
      const ok2 = handleMove(dirId);
      if (!ok2) {
        // blocked: stop repeating and cleanup
        const entry2 = _pressedKeyState.get(rawKey);
        if (entry2) {
          if (entry2.intervalId) clearInterval(entry2.intervalId);
          highlightButton(entry2.dirId, false);
          _pressedKeyState.delete(rawKey);
        }
      }
    }, REPEAT_DELAY);
    // update stored state with the interval id
    const entry = _pressedKeyState.get(rawKey);
    if (entry) entry.intervalId = intervalId;
  }, INITIAL_DELAY);

  _pressedKeyState.set(rawKey, { dirId, timeoutId, intervalId: null });
});

window.addEventListener('keyup', (e) => {
  const rawKey = e.key || '';
  const state = _pressedKeyState.get(rawKey);
  if (!state) return;
  // stop pending timeout and repeating interval
  if (state.timeoutId) clearTimeout(state.timeoutId);
  if (state.intervalId) clearInterval(state.intervalId);
  highlightButton(state.dirId, false);
  _pressedKeyState.delete(rawKey);
});

// Function to move player with finger swipe (for touch devices)
let touchStartX = null;
let touchStartY = null;
let touchStartTime = null;
const SWIPE_THRESHOLD = 30; // Minimum distance (px) for a swipe
const SWIPE_TIME = 500; // Maximum time (ms) for a swipe

window.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  }
});

window.addEventListener('touchend', (e) => {
  if (e.changedTouches.length === 1 && touchStartX !== null && touchStartY !== null) {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const deltaTime = Date.now() - touchStartTime;
    if (deltaTime < SWIPE_TIME) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        // Horizontal swipe
        if (deltaX > 0) {
          handleMove('rightButton', { showAlert: true });
          highlightButton('rightButton', true);
          setTimeout(() => highlightButton('rightButton', false), 150);
        } else {
          handleMove('leftButton', { showAlert: true });
          highlightButton('leftButton', true);
          setTimeout(() => highlightButton('leftButton', false), 150);
        }
      } else if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
        // Vertical swipe
        if (deltaY > 0) {
          handleMove('backwardButton', { showAlert: true });
          highlightButton('backwardButton', true);
          setTimeout(() => highlightButton('backwardButton', false), 150);
        } else {
          handleMove('forwardButton', { showAlert: true });
          highlightButton('forwardButton', true);
          setTimeout(() => highlightButton('forwardButton', false), 150);
        }
      } else {
        // It's not a swipe: consider it a tap
        handleTapAt(touch.clientX, touch.clientY);
      }
    }
  }
});

// Remove any existing overlay chooser
function removeFloorChooser() {
  const existing = document.getElementById('floor-chooser-overlay');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
}

function handleTapAt(clientX, clientY) {
  // Find element at touch point
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) return;
  // If it's a child (like the player inside the cell), walk up to .cell
  let cell = el.closest ? el.closest('.cell') : null;
  if (!cell) return;

  // Only handle taps on the current player cell
  const id = cell.id; // `${floor}${row}${col}`
  const pf = player.floor;
  const pr = player.row;
  const pc = player.col;
  if (id !== `${pf}${pr}${pc}`) return;

  // Get maze cell data
  const mazeCell = maze.maze[pf][pr][pc];
  const canUp = !mazeCell.walls[0];
  const canDown = !mazeCell.walls[1];

  if (canUp && !canDown) {
    showFullPulse(cell, 'up').then(() => {
      handleMove('floorUpButton', { showAlert: true });
      highlightButton('floorUpButton', true);
      setTimeout(() => highlightButton('floorUpButton', false), 150);
    });
    return;
  }
  if (canDown && !canUp) {
    showFullPulse(cell, 'down').then(() => {
      handleMove('floorDownButton', { showAlert: true });
      highlightButton('floorDownButton', true);
      setTimeout(() => highlightButton('floorDownButton', false), 150);
    });
    return;
  }

  if (canUp && canDown) {
    // Decide by tap vertical position within the cell:
    // top half -> go up, bottom half -> go down
    const rect = cell.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    if (clientY < centerY) {
      // show green up pulse, then move
      showHalfPulse(cell, 'up').then(() => {
        handleMove('floorUpButton', { showAlert: true });
        highlightButton('floorUpButton', true);
        setTimeout(() => highlightButton('floorUpButton', false), 150);
      });
    } else {
      // show red down pulse, then move
      showHalfPulse(cell, 'down').then(() => {
        handleMove('floorDownButton', { showAlert: true });
        highlightButton('floorDownButton', true);
        setTimeout(() => highlightButton('floorDownButton', false), 150);
      });
    }
    return;
  }
}


const resetBtn = document.getElementById("resetLocation")

resetBtn.addEventListener("click", () => {
  const s = maze.s
  const start = document.getElementById(`${s.floor}${s.row}${s.col}`);
  board.updatePlayersLocation(maze, s.floor, s.row, s.col);
  start.appendChild(player.player);
})

function disableControls() {
  // disable all interactive form controls and buttons to avoid conflicts
  document.querySelectorAll('button, input, select, textarea').forEach(el => {
    el.disabled = true;
  });
}
 
const solveBtn = document.getElementById("solveMaze")

solveBtn.addEventListener("click", () => {
  // const path = BreadthFirstSearch.searchPath(maze);
  // const path = DepthFirstSearch.searchPath(maze);
  const path = AStarSearch.searchPath(maze);
  if (path) {
    // prevent user input while the animation runs
    disableControls();

    let delay = 0;
    // start from player's current location (should match path[0])
    let prev = [player.floor, player.row, player.col];
    for (let i = 1; i < path.length; i++) {
      const [f, r, c] = path[i].split(',').map(Number);

      const directionId = (() => {
        const [pf, pr, pc] = prev;
        if (f > pf) return 'floorUpButton';
        if (f < pf) return 'floorDownButton';
        if (r < pr) return 'forwardButton';
        if (r > pr) return 'backwardButton';
        if (c > pc) return 'rightButton';
        if (c < pc) return 'leftButton';
        return null;
      })();

      setTimeout(() => {
        board.updatePlayersLocation(maze, f, r, c, directionId);
        // If we've reached the goal, remove saved game and go to win page
        if (board.isGameOver()) {
          clearSavedMaze();
          window.location.href = "win.html";
        }
      }, delay);

      // update prev for next iteration
      prev = [f, r, c];
      delay += 500; // Ajusta el tiempo de retraso entre movimientos (en milisegundos)
    }

    // re-enable controls after animation completes (extra 100ms buffer)
    setTimeout(() => {
      enableControls();
    }, delay + 100);
  }
})