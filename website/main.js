import Player from "./script/player.js";
import Board from "./script/board.js";
import mazeFactory from "../../generation/createMaze.js";

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const floors = urlParams.get("floors");
const size = urlParams.get("size");
const username = urlParams.get("username")
const mazeTypeParam = urlParams.get("mazeType");
const maze = mazeFactory.getMaze(mazeTypeParam, size, floors);
const initialLocation = maze.s;
console.log(initialLocation)

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
