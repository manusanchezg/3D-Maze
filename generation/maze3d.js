import Cell from "./cell.js";

export default class Maze3d {
  #maze;

  /**
   * A representation of the Maze
   * @param {number} size 5 by default
   * @param {number} floors 3 by default
   * @param {Cell} s
   * @param {Cell} g
   * @param {Cell} location
   */
  constructor(size, floors, s, g, location = s) {
    this.floors = floors;
    this.size = size;
    this.s = s;
    this.g = g;
    this.location = location;

    this.#maze = new Array(floors);

    for (let i = 0; i < floors; i++) {
      this.#maze[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        this.#maze[i][j] = new Array(size);
        // for every space in the array, create a cell
        // with 6 walls (all walls by default)
        for (let k = 0; k < size; k++) {
          const walls = [true, true, true, true, true, true];
          this.#maze[i][j][k] = new Cell(...walls, i, j, k);
        }
      }
    }
  }

  get maze() {
    return this.#maze;
  }

  getNeighbours(cell) {
    let up;
    let down;
    let forward;
    let backward;
    let left;
    let right;

    if (this.#isSafe(cell.floor + 1, cell.row, cell.col) && !cell.walls[0]) {
      up = this.maze[cell.floor + 1][cell.row][cell.col];
    } else up = null;
    if (this.#isSafe(cell.floor - 1, cell.row, cell.col) && !cell.walls[1]) {
      down = this.maze[cell.floor - 1][cell.row][cell.col];
    } else down = null;
    if (this.#isSafe(cell.floor, cell.row - 1, cell.col) && !cell.walls[2]) {
      forward = this.maze[cell.floor][cell.row - 1][cell.col];
    } else forward = null;
    if (this.#isSafe(cell.floor, cell.row + 1, cell.col) && !cell.walls[4]) {
      backward = this.maze[cell.floor][cell.row + 1][cell.col];
    } else backward = null;
    if (this.#isSafe(cell.floor, cell.row, cell.col - 1) && !cell.walls[5]) {
      left = this.maze[cell.floor][cell.row][cell.col - 1];
    } else left = null;
    if (this.#isSafe(cell.floor, cell.row, cell.col + 1) && !cell.walls[3]) {
      right = this.maze[cell.floor][cell.row][cell.col + 1];
    } else right = null;

    return [up, down, forward, right, backward, left];
  }

  #isSafe(floor, row, col) {
    return (
      row >= 0 &&
      row < this.size &&
      col >= 0 &&
      col < this.size &&
      floor >= 0 &&
      floor < this.floors &&
      this.maze[floor][row][col]
    );
  }
  /**
   * A console view of the maze
   */
  // toString() {
  //   let toPrint = "";
  //   const upArrow = "\u{2191}";
  //   const downArrow = "\u{2193}";
  //   const upDownArrow = "\u{2195}";

  //   for (let i = 0; i < this.maze.length; i++) {
  //     toPrint += `${i + 1}° floor \n`;
  //     // Top side
  //     for (let j = 0; j < this.maze[0][0].length * 2 - 1; j++) {
  //       toPrint += "_";
  //     }
  //     toPrint += "\n";
  //     // Maze
  //     for (let row = 0; row < this.maze[0].length; row++) {
  //       for (let col = 0; col < this.maze[0][0].length; col++) {
  //         let cell = this.maze[i][row][col];

  //         if (this.s.floor === i && this.s.row === row && this.s.col === col) {
  //           toPrint = toPrint.slice(0, toPrint.length - 1) + "S";
  //         }
  //         if (this.g.floor === i && this.g.row === row && this.g.col === col) {
  //           toPrint = toPrint.slice(0, toPrint.length - 1) + "G";
  //         }
  //         if (
  //           this.location.floor === i &&
  //           this.location.row === row &&
  //           this.location.col === col
  //         ) {
  //           toPrint = toPrint.slice(0, toPrint.length - 1) + "P";
  //         }

  //         if (cell.walls[5]) {
  //           toPrint += "|";
  //         } else toPrint += " ";
  //         if (cell[0] && cell[1]) toPrint += upDownArrow;
  //         else if (cell[0]) toPrint += upArrow;
  //         else if (cell[1]) toPrint += downArrow;
  //         else toPrint += " ";
  //       }
  //       toPrint += "|\n";

  //       if (row < this.maze[i].length - 1) {
  //         toPrint += "|";
  //         for (let col = 0; col < this.maze[0][0].length; col++) {
  //           let cell = this.maze[i][row][col];
  //           if (cell.walls[4]) toPrint += "-";
  //           else toPrint += " ";
  //           toPrint += "+";
  //         }
  //         toPrint = toPrint.slice(0, toPrint.length - 1) + "|\n"
  //       }
  //     }
  //     toPrint += " "
  //     for (let i = 0; i < this.maze[0][0].length * 2 - 1; i++) toPrint += "_"
  //     toPrint += "\n"
  //   }
  //   return toPrint;
  // }
}
