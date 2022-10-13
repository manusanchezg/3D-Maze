import DFSMaze3DGenerator from "../generation/DFSMaze3DGenerator.js";
import ABMaze3DGenerator from "../generation/ABMaze3DGenerator.js";
import SimpleMaze3dGenerator from "../generation/simpleMaze3dGenerator.js";
import Player from "./script/player.js";
import Board from "./script/board.js";

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const floors = urlParams.get("floors");
const size = urlParams.get("size");

const DFSMaze = new ABMaze3DGenerator();
// const DFSMaze = new DFSMaze3DGenerator();
// const DFSMaze = new SimpleMaze3dGenerator();
DFSMaze.generate(size, floors);
const maze = DFSMaze.createMaze();

const player = new Player();
const board = new Board(maze, player);

board.displayMaze();

const buttons = document.getElementById("buttons");

// Position 1 of value direction I intent to move
// Position 2, 3 and 4 of value changing the location of player
const directions = new Map([
  [
    "floorUpButton",
    [0, maze.location.floor + 1, maze.location.row, maze.location.col],
  ],
  [
    "floorDownButton",
    [1, maze.location.floor - 1, maze.location.row, maze.location.col],
  ],
  [
    "forwardButton",
    [2, maze.location.floor, maze.location.row - 1, maze.location.col],
  ],
  [
    "rightButton",
    [3, maze.location.floor, maze.location.row, maze.location.col + 1],
  ],
  [
    "backwardButton",
    [4, maze.location.floor, maze.location.row + 1, maze.location.col],
  ],
  [
    "leftButton",
    [5, maze.location.floor, maze.location.row, maze.location.col - 1],
  ],
]);

buttons.addEventListener("click", (e) => {
  console.log(maze.location)
  const direction = directions.get(e.target.id);
  if (!maze.location.walls[direction[0]])
  board.updatePlayersLocation(direction[1], direction[2], direction[3], e.target.id);
  else alert("You can't move that way because there is a wall!");
});
