import Player from "./script/player.js";
import Board from "./script/board.js";
import mazeFactory from "../../generation/createMaze.js";
import BFS from "../search-algorithms/breadth-first-search.js";
import DFS from "../search-algorithms/depth-first-search.js";
import AStar from "../search-algorithms/a-star-search.js";

// Obtener parámetros de la URL

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const floors = urlParams.get("floors");
const size = urlParams.get("size");
const username = urlParams.get("username")
const mazeTypeParam = urlParams.get("mazeType");
const maze = mazeFactory.getMaze(mazeTypeParam, size, floors);

localStorage.setItem(username, JSON.stringify(maze))

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
    maze.moves.set([direction[1], direction[2], direction[3], direction[3]]);
    console.log(maze.moves);

    // Verifica si el jugador llegó al goal
    if (board.isGameOver()) {
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


const solveBtn = document.getElementById("solveMazeBtn")

console.log(solveBtn)

solveBtn.addEventListener("click", async () => {
  // Adapta el maze para el algoritmo de búsqueda
  const solution = BFS.search(maze, maze.s, maze.g); // O el algoritmo que prefieras

  // solution debe ser un array de posiciones [{floor, row, col}, ...]
  if (solution && solution.length) {
    for (const step of solution) {
      await movePlayerTo(step.floor, step.row, step.col);
      await new Promise(res => setTimeout(res, 350)); // Animación: espera 350ms entre pasos
    }
  }
});

// Función para mover el jugador y actualizar la vista
async function movePlayerTo(floor, row, col) {
  board.updatePlayersLocation(maze, floor, row, col, null);
  board.displayMaze(floor);
}