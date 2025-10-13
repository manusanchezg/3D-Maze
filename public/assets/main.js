import Player from "../script/player.js";
import Board from "../script/board.js";
import mazeFactory from "../../generation/createMaze.js";
import BreadthFirstSearch from "../search-algorithms/breadth-first-search.js";

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const floors = urlParams.get("floors");
const size = urlParams.get("size");
const username = urlParams.get("username")
const mazeTypeParam = urlParams.get("mazeType");
const maze = mazeFactory.getMaze(mazeTypeParam, size, floors);
const initialLocation = maze.s;

const storageKey = username ? `maze3d_${username}` : null;
if (storageKey) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(maze));
  } catch (e) {
    console.warn('Could not save maze to localStorage:', e);
  }
}

const player = new Player(maze.location);
const board = new Board(maze, player);

board.displayMaze(maze.location.floor);

const buttons = document.getElementById("buttons");



buttons.addEventListener("click", (e) => {
  const currentDirections = new Map([
    [
      "floorUpButton",
      [0, player.floor + 1, player.row, player.col],
    ],
    [
      "floorDownButton",
      [1, player.floor - 1, player.row, player.col],
    ],
    [
      "forwardButton",
      [2, player.floor, player.row - 1, player.col],
    ],
    [
      "rightButton",
      [3, player.floor, player.row, player.col + 1],
    ],
    [
      "backwardButton",
      [4, player.floor, player.row + 1, player.col],
    ],
    [
      "leftButton",
      [5, player.floor, player.row, player.col - 1],
    ],
  ]);

  const direction = currentDirections.get(e.target.id);
  if (board.canMove(direction[0])) {
    board.updatePlayersLocation(maze, direction[1], direction[2], direction[3], e.target.id);

    // Verifica si el jugador llegó al goal
    if (board.isGameOver()) {
      // Remove saved game so the user won't continue it again
      try {
        if (storageKey) localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn('Could not remove saved game from localStorage:', e);
      }
      window.location.href = "win.html"; // Redirige a la página de victoria
    }
  } else {
    alert("You can't move that way because there is a wall!");
  }
});


const resetBtn = document.getElementById("resetLocation")

resetBtn.addEventListener("click", () => {
  const s = maze.s
  const start = document.getElementById(`${s.floor}${s.row}${s.col}`)
  start.appendChild(player.player)
})

function disableControls() {
  // disable all interactive form controls and buttons to avoid conflicts
  document.querySelectorAll('button, input, select, textarea').forEach(el => {
    el.disabled = true;
  });
}
 
const solveBtn = document.getElementById("solveMaze")

solveBtn.addEventListener("click", () => {
  const path = BreadthFirstSearch.searchPath(maze);
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
          try {
            if (storageKey) localStorage.removeItem(storageKey);
          } catch (e) {
            console.warn('Could not remove saved game from localStorage:', e);
          }
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