import Player from "./script/player.js";
import Board from "./script/board.js";
import mazeFactory from "./generation/createMaze.js";
import Maze3d from "./generation/maze3d.js";
import BreadthFirstSearch from "./search-algorithms/breadth-first-search.js";
import DepthFirstSearch from "./search-algorithms/depth-first-search.js";
import AStarSearch from "./search-algorithms/A_-search.js";
import { loadSavedMaze, saveMaze, clearSavedMaze } from "./script/storage.js";
import { highlightButton, disableControls, enableControls, showHalfPulse, showFullPulse, removeFloorChooser } from "./script/uiHelpers.js";
import { getDirectionMap, keyToDirectionId } from "./script/directionUtils.js";

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const floors = urlParams.get("floors");
const size = urlParams.get("size");
const username = urlParams.get("username")
const mazeTypeParam = urlParams.get("mazeType");
// Parse numeric parameters (URLSearchParams returns strings)
const floorsNum = Number(floors);
const sizeNum = Number(size);

const mazeFromStorage = loadSavedMaze(username);
let maze = mazeFromStorage || mazeFactory.getMaze(mazeTypeParam, sizeNum, floorsNum);
if (!mazeFromStorage) {
  saveMaze(username, maze);
}

// Create player from maze.location. Some saved mazes may have location as plain object already.
const player = new Player(maze.location);
const board = new Board(maze, player);

board.displayMaze(maze.location.floor);

/**
 * Show a pulse animation in the given cell on either 'up' or 'down' half.
 * Returns a promise that resolves when the animation ends (approx 420ms).
 */
// pulses are provided by uiHelpers.js

// returns a map of direction id -> [moveType, newFloor, newRow, newCol]
// direction mapping moved to directionUtils.js

function handleMove(directionId, { showAlert = false } = {}) {
  if (!directionId) return false;
  const dirMap = getDirectionMap(player);
  const direction = dirMap.get(directionId);
  if (!direction) return false;

  if (board.canMove(direction[0])) {
    board.updatePlayersLocation(maze, direction[1], direction[2], direction[3], directionId);

    // Check if player reached goal
    if (board.isGameOver()) {
      clearSavedMaze(username);
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
// highlightButton moved to uiHelpers.js

// Map key event to direction id. Supports Arrow keys, PageUp/PageDown, WASD and R/F.
// keyToDirectionId moved to directionUtils.js

// keyboard auto-repeat and handlers remain in main.js but use keyToDirectionId

const _pressedKeyState = new Map(); // key -> { dirId, timeoutId, intervalId }
const INITIAL_DELAY = 500; // ms before first repeated move while holding
const REPEAT_DELAY = 200; // ms between repeated moves after initial delay

window.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

  const rawKey = e.key || '';
  const dirId = keyToDirectionId(e);
  if (!dirId) return;

  e.preventDefault();
  if (_pressedKeyState.has(rawKey)) return;

  handleMove(dirId);
  highlightButton(dirId, true);

  const timeoutId = setTimeout(() => {
    const ok = handleMove(dirId);
    if (!ok) {
      const entry = _pressedKeyState.get(rawKey);
      if (entry) {
        highlightButton(entry.dirId, false);
        _pressedKeyState.delete(rawKey);
      }
      return;
    }
    const intervalId = setInterval(() => {
      const ok2 = handleMove(dirId);
      if (!ok2) {
        const entry2 = _pressedKeyState.get(rawKey);
        if (entry2) {
          if (entry2.intervalId) clearInterval(entry2.intervalId);
          highlightButton(entry2.dirId, false);
          _pressedKeyState.delete(rawKey);
        }
      }
    }, REPEAT_DELAY);
    const entry = _pressedKeyState.get(rawKey);
    if (entry) entry.intervalId = intervalId;
  }, INITIAL_DELAY);

  _pressedKeyState.set(rawKey, { dirId, timeoutId, intervalId: null });
});

window.addEventListener('keyup', (e) => {
  const rawKey = e.key || '';
  const state = _pressedKeyState.get(rawKey);
  if (!state) return;
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

// removeFloorChooser provided by uiHelpers.js

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

// disableControls provided by uiHelpers.js
 
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
          clearSavedMaze(username);
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