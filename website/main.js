import { maze } from "../generation/createMaze.js";
import Player from "./script/player.js";
import Board from "./script/board.js";

const player = new Player(maze.location.floor, maze.location.row, maze.location.col)
const board = new Board(maze,  player)

board.displayMaze();

// const forwardButton = document.getElementById("forwardButton");
// const rightButton = document.getElementById("rightButton");
// const backwardButton = document.getElementById("backwardButton");
// const leftButton = document.getElementById("leftButton");
// const floorUpButton = document.getElementById("floorUpButton");
// const floorDownButton = document.getElementById("floorDownButton");


const buttons = document.getElementById("buttons")
// Position 1 of value direction I intent to move
// Position 2 of value changing the location of player
const directions = new Map([
  ["floorUpButton", [0, ++maze.location.floor]],
  ["floorDownButton", [1, --maze.location.floor]],
  ["forwardButton", [2, --maze.location.row]],
  ["rightButton", [3, ++maze.location.col]],
  ["backwardButton", [4, ++maze.location.row]],
  ["leftButton", [5, --maze.location.col]],
])
buttons.addEventListener("click", e => {
  const direction = directions.get(e.target.id)
  if(!maze.location.walls[direction[0]]) console.log(direction[1]);
  else alert("You can't move that way because there is a wall!")
})