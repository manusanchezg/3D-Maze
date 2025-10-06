import Maze3d from "../../generation/maze3d.js";
import Player from "./player.js";

export default class Board {
  /**
   * @param {Maze3d} maze 
   * @param {Player} player 
   */
  constructor(maze, player) {
    this.container = document.getElementById("container");
    this.maze = maze;
    this.player = player;
  }

  displayMaze(floorLocation) {
    const upArrow = "\u{2191}";
    const downArrow = "\u{2193}";
    const upDownArrow = "\u{2195}";

    const title = document.getElementById("title");
    title.textContent = `You're in the ${floorLocation + 1}° floor`;

    for (let j = 0; j < this.maze.size; j++) {
      for (let k = 0; k < this.maze.size; k++) {
        const mazeCell = this.maze.maze[floorLocation][j][k];
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `${floorLocation}${j}${k}`

        if (!mazeCell.walls[0]) cell.textContent = upArrow;
        if (!mazeCell.walls[1]) cell.textContent = downArrow;
        if (!mazeCell.walls[0] && !mazeCell.walls[1])
          cell.textContent = upDownArrow;
        if (mazeCell.walls[2]) cell.style.borderTop = "4px solid #0D324D";
        if (mazeCell.walls[3]) cell.style.borderRight = "4px solid #0D324D";
        if (mazeCell.walls[4]) cell.style.borderBottom = "4px solid #0D324D";
        if (mazeCell.walls[5]) cell.style.borderLeft = "4px solid #0D324D";
        if (!mazeCell.walls[2]) cell.style.paddingTop = "4px";
        if (!mazeCell.walls[3]) cell.style.paddingRight = "4px";
        if (!mazeCell.walls[4]) cell.style.paddingBottom = "4px";
        if (!mazeCell.walls[5]) cell.style.paddingLeft = "4px";
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
    this.container.style.maxWidth = 58 * this.maze.size + "px";
  }
/**
 * 
 * @param {Maze3d} maze 
 * @param {number} floor 
 * @param {number} row 
 * @param {number} col 
 * @param {string} direction 
 */
  updatePlayersLocation(maze, floor, row, col, direction) {
    // Actualiza primero la posición en el objeto maze
    maze.location.floor = floor;
    maze.location.row = row;
    maze.location.col = col;

    // Luego actualiza la posición del jugador
    this.player.changePlayerLocation(floor, row, col);
    console.log('players location: ',this.player.location);

    let newLoc = document.getElementById(`${floor}${row}${col}`);

    // Si el jugador se mueve a un piso diferente, redibuja el laberinto

    if (direction === "floorUpButton" || direction === "floorDownButton") {
      this.container.innerHTML = "";
      this.displayMaze(floor);
      newLoc = document.getElementById(`${floor}${row}${col}`); // Re-obtener el elemento después de redibujar
    }

    newLoc.appendChild(this.player.player);
  }

  canMove(directionIndex) {
    const cell = this.maze.maze[this.player.floor][this.player.row][this.player.col];
    return !cell.walls[directionIndex];
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
