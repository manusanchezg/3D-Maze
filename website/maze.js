import { maze } from "../generation/main.js";

const container = document.getElementById("container");
const upArrow = "\u{2191}";
const downArrow = "\u{2193}";
const upDownArrow = "\u{2195}";

const title = document.getElementById("title");
title.textContent = `You're in the ${maze.location.floor + 1}° floor`;

function displayMaze() {
  for (let j = 0; j < maze.size; j++) {
    for (let k = 0; k < maze.size; k++) {
      const floorLocation = maze.location.floor;
      const mazeCell = maze.maze[floorLocation][j][k];
      const cell = document.createElement("div");
      const player = document.createElement("img");
      player.src = "assets/player.svg";
      cell.className = "cell";

      if (!mazeCell.walls[0]) cell.textContent = upArrow;
      if (!mazeCell.walls[1]) cell.textContent = downArrow;
      if (!mazeCell.walls[0] && !mazeCell.walls[1])
        cell.textContent = upDownArrow;
      if (mazeCell.walls[2]) cell.style.borderTop = "1px solid black";
      if (mazeCell.walls[3]) cell.style.borderRight = "1px solid black";
      if (mazeCell.walls[4]) cell.style.borderBottom = "1px solid black";
      if (mazeCell.walls[5]) cell.style.borderLeft = "1px solid black";
      if (
        mazeCell.floor === maze.s.floor &&
        mazeCell.row === maze.s.row &&
        mazeCell.col === maze.s.col
      )
        cell.textContent = "S";
      if (
        mazeCell.floor === maze.g.floor &&
        mazeCell.row === maze.g.row &&
        mazeCell.col === maze.g.col
      )
        cell.textContent = "G";
      if (
        mazeCell.floor === maze.location.floor &&
        mazeCell.row === maze.location.row &&
        mazeCell.col === maze.location.col
      )
        cell.appendChild(player);
      container.appendChild(cell);
    }
  }
}
displayMaze()

const forwardButton = document.getElementById("forwardButton");
const rightButton = document.getElementById("rightButton");
const backwardButton = document.getElementById("backwardButton");
const leftButton = document.getElementById("leftButton");
const floorUpButton = document.getElementById("floorUpButton");
const floorDownButton = document.getElementById("floorDownButton");

floorUpButton.addEventListener("click", () => {
  if (!maze.location.walls[0]) {
    ++maze.location.floor;
    displayMaze();
  } else alert("You can't move that way because there is a wall!");
});

floorDownButton.addEventListener("click", () => {
  if (!maze.location.walls[1]) {
    --maze.location.floor;
    displayMaze();
  } else alert("You can't move that way because there is a wall!");
});

forwardButton.addEventListener("click", () => {
  if (!maze.location.walls[2]) {
    --maze.location.row;
    displayMaze();
  } else alert("You can't move that way because there is a wall!");
});

rightButton.addEventListener("click", () => {
  if (!maze.location.walls[3]) {
    ++maze.location.col;
    displayMaze();
  } else alert("You can't move that way because there is a wall!");
});

backwardButton.addEventListener("click", () => {
  if (!maze.location.walls[4]) {
    ++maze.location.row;
    displayMaze();
  } else alert("You can't move that way because there is a wall!");
});

leftButton.addEventListener("click", () => {
  if (!maze.location.walls[5]) {
    --maze.location.col;
    displayMaze();
  } else alert("You can't move that way because there is a wall!");
});
