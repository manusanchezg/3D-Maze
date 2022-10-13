import Maze3d from "../../generation/maze3d.js";
import Player from "./player.js";

export default class Board {
  /**
   * 
   * @param {Maze3d} maze 
   * @param {Player} player 
   */
  constructor(maze, player) {
    this.container = document.getElementById("container");
    this.maze = maze;
    this.player = player;
  }

  displayMaze() {
    const upArrow = "\u{2191}";
    const downArrow = "\u{2193}";
    const upDownArrow = "\u{2195}";

    const title = document.getElementById("title");
    title.textContent = `You're in the ${this.maze.location.floor + 1}° floor`;

    for (let j = 0; j < this.maze.size; j++) {
      for (let k = 0; k < this.maze.size; k++) {
        const floorLocation = this.maze.location.floor;
        const mazeCell = this.maze.maze[floorLocation][j][k];
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `${floorLocation}${j}${k}`

        if (!mazeCell.walls[0]) cell.textContent = upArrow;
        if (!mazeCell.walls[1]) cell.textContent = downArrow;
        if (!mazeCell.walls[0] && !mazeCell.walls[1])
          cell.textContent = upDownArrow;
        if (mazeCell.walls[2]) cell.style.borderTop = "2px solid #0D324D";
        if (mazeCell.walls[3]) cell.style.borderRight = "2px solid #0D324D";
        if (mazeCell.walls[4]) cell.style.borderBottom = "2px solid #0D324D";
        if (mazeCell.walls[5]) cell.style.borderLeft = "2px solid #0D324D";
        if (!mazeCell.walls[2]) cell.style.marginTop = "2px";
        if (!mazeCell.walls[3]) cell.style.marginRight = "2px";
        if (!mazeCell.walls[4]) cell.style.marginBottom = "2px";
        if (!mazeCell.walls[5]) cell.style.marginLeft = "2px";
        if (
          mazeCell.floor === this.maze.s.floor &&
          mazeCell.row === this.maze.s.row &&
          mazeCell.col === this.maze.s.col
        )
          cell.textContent = "S";
        if (
          mazeCell.floor === this.maze.g.floor &&
          mazeCell.row === this.maze.g.row &&
          mazeCell.col === this.maze.g.col
        )
          cell.textContent = "G";
        if (
          mazeCell.floor === this.maze.location.floor &&
          mazeCell.row === this.maze.location.row &&
          mazeCell.col === this.maze.location.col
        )
          cell.appendChild(this.player.player);
        this.container.appendChild(cell);
      }
    }
    this.container.style.maxWidth = 54 * this.maze.size + "px";
  }

  updatePlayersLocation(floor, row, col, direction) {
    // Every time a button is pressed, change the location
    // of the player, depending on which direction you're moving
    const newLoc = document.getElementById(`${floor}${row}${col}`)
    this.maze.changeLocation(floor, row, col)
    if(direction === "floorUpButton" || direction === "floorDownButton") {
      this.container.innerHTML = ""
      this.displayMaze()
    }
    newLoc.appendChild(this.player.player)
    console.log("location in function update", this.maze.location)
  }

  isGameOver() {
    if (
      this.player.floor === this.maze.g.floor &&
      this.player.row === this.maze.g.row &&
      this.player.col === this.maze.g.col
    )
      return true;
    return false;
  }
}
