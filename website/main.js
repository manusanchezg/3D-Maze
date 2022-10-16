import DFSMaze3DGenerator from "../generation/DFSMaze3DGenerator.js";
import ABMaze3DGenerator from "../generation/ABMaze3DGenerator.js";
import SimpleMaze3dGenerator from "../generation/simpleMaze3dGenerator.js";
import Player from "./script/player.js";
import Board from "./script/board.js";

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const floors = urlParams.get("floors");
const size = urlParams.get("size");
const username = urlParams.get("username")

const DFSMaze = new ABMaze3DGenerator();
// const DFSMaze = new DFSMaze3DGenerator();
// const DFSMaze = new SimpleMaze3dGenerator();
DFSMaze.generate(size, floors);
const maze = DFSMaze.createMaze();
localStorage.setItem(username, JSON.stringify(maze))

const player = new Player(maze);
const board = new Board(maze, player);

board.displayMaze(maze.location.floor);

const buttons = document.getElementById("buttons");

// Position 1 of value direction I intent to move
// Position 2, 3 and 4 of value changing the location of player
const directions = new Map([
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

buttons.addEventListener("click", (e) => {
  const direction = directions.get(e.target.id);
  if (!maze.location.walls[direction[0]])
  board.updatePlayersLocation(maze, direction[1], direction[2], direction[3], e.target.id);
  else alert("You can't move that way because there is a wall!");
});


const resetBtn = document.getElementById("resetLocation")

resetBtn.addEventListener("click", () => {
  const s = maze.s
  const start = document.getElementById(`${s.floor}${s.row}${s.col}`)
  start.appendChild(player.player)
})