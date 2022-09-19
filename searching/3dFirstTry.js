import Cell from "../generation/cell.js";
import Maze3D from "../generation/maze3dGenerator.js";

/**
 * Class that creates a 3D Maze
 */

export default class Maze3DGenerator extends Maze3D {
  #maze;

  constructor(size = 5, floors = 3) {
    this.size = size;
    this.floors = floors;
    // Create the maze with the numbers of floor first
    this.#maze = new Array(floors);
    // Run a loop to fill the floors with matrices (size * size)
    for (let i = 0; i < floors; i++) {
      this.#maze[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        // for every space in the array, create a cell
        // with 6 walls (all walls by default)
        this.#maze[i][j] = new Cell();
      }
    }
  }

  get maze() {
    return this.#maze;
  }

  toString() {
    for (let i = 0; i < this.maze.length; i++) {}
  }

  /**
   * The function will randomly create all the walls
   * and the elevators for the player using DFS
   */
  createMaze() {
    // Generate a random start each time the maze initializes
    const startFloor = this.#getRandomInt(this.floors);
    const startRow = this.#getRandomInt(this.size);
    const startCol = this.#getRandomInt(this.size);

    const targetFloor = this.#getRandomInt(this.floors);
    const targetRow = this.#getRandomInt(this.size);
    const targetCol = this.#getRandomInt(this.size);

    let visited = new Set();

    // Start of the DFS algorithm
    const start = this.maze[startFloor][startRow][startCol];
    const target = this.maze[targetFloor][targetRow][targetCol]

    this.#visitArea(this.maze, startFloor, startRow, startCol, visited, start);
    return this.maze;
  }

  #visitArea(maze, floor, row, col, visited, start) {
    let stack = [];
    const floorNbr = [0, 0, 0, 0, 1, -1];
    const rowNbr = [0, 1, -1, 0, 0, 0];
    const colNbr = [1, 0, 0, -1, 0, 0];

    stack.push([floor, row, col]);
    while (stack.length > 0) {
      const [currFloor, currRow, currCol] = stack.shift();
      visited.add([currFloor, currRow, currCol].toString());

      for (const floor of floorNbr) {
        for (const row of rowNbr) {
          for (const col of colNbr) {
            const newFloor = currFloor + floor;
            const newRow = currRow + row;
            const newCol = currCol + col;
            if (this.#isSafe(maze, newFloor, newRow, newCol, visited))
              stack.push([newFloor, newRow, newCol]);
          }
        }
      }
    }
  }
  #isSafe(maze, floor, row, col, visited) {
    return (
      row >= 0 &&
      row < this.size &&
      col >= 0 &&
      col < this.size &&
      floor >= 0 &&
      floor < this.floors &&
      maze[floor][row][col] &&
      !visited.has([floor, row, col]).toString()
    );
  }

  /**
   *
   * @param {number} range
   * @returns a random integer between [0, range + 1)
   */
  #getRandomInt(range) {
    return Math.floor(Math.random() * (range + 1));
  }
}

const maze = new Maze3D();
console.log(maze.createMaze()[0]);
