import Cell from "./cell.js";
import Maze3d from "./maze3d.js";
import Maze3DGenerator from "./maze3dGenerator.js";

/**
 * A 3D Maze Generator using the Aldous-Broder Algorithm
 */
export default class ABMaze3DGenerator extends Maze3DGenerator {
  createMaze() {
    const start = this.#pickRandomCell();
    const target = this.#pickRandomCell();
    const maze = this.generate(this.maze.size, this.maze.floors, start, target);
    maze.maze[start.floor][start.row][start.col] = start
    // console.log(start)
    const DIRECTIONS = [
      [0, 0, 1],
      [0, 0, -1],
      [0, 1, 0],
      [0, -1, 0],
      [1, 0, 0],
      [-1, 0, 0],
    ];

    let cells = new Set();
    // Filling the cells with the position of each cell in the maze
    for (let i = 0; i < maze.floors; i++) {
      for (let j = 0; j < maze.size; j++) {
        for (let k = 0; k < maze.size; k++) {
          cells.add([i, j, k].toString());
        }
      }
    }

    let randomCell = this.#pickRandomCell();
    let neighbour;

    let visited = new Set();
    visited.add([randomCell.floor, randomCell.row, randomCell.col].toString());
    cells.delete([randomCell.floor, randomCell.row, randomCell.col].toString());

    // While cells has an element, it'll choose a random neighbour
    // check if it's not visited, and then added to visited and delete it from cells
    while (cells.size) {
      const randomDir = DIRECTIONS[this.#randomInt(DIRECTIONS.length)];
      // console.log(randomCell, randomDir);
      const newFloor = randomCell.floor + randomDir[0];
      const newRow = randomCell.row + randomDir[1];
      const newCol = randomCell.col + randomDir[2];

      if (this.#isSafe(maze, newFloor, newRow, newCol)) {
        neighbour = maze.maze[newFloor][newRow][newCol];
        if (
          !visited.has(
            [neighbour.floor, neighbour.row, neighbour.col].toString()
          )
        ) {
          this.#breakWall(randomCell, neighbour);
          visited.add(
            [neighbour.floor, neighbour.row, neighbour.col].toString()
          );
          cells.delete(
            [neighbour.floor, neighbour.row, neighbour.col].toString()
          );
        }
        randomCell = neighbour; // Solo actualiza si neighbour es válido
      }
      // Si no es seguro, randomCell no cambia
    }
    return maze;
  }

  #pickRandomCell() {
    const floor = this.#randomInt(this.maze.floors);
    const row = this.#randomInt(this.maze.size);
    const col = this.#randomInt(this.maze.size);

    return this.maze.maze[floor][row][col];
  }

  /**
   * @param {number} range
   * @returns a random integer between [0, range + 1)
   */
  #randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  /**
   * Breaks the wall between the Current Location (currLoc)
   * and the location you want to go (newLoc)
   * @param {Cell} currLoc 
   * @param {Cell} newLoc 
   */
   #breakWall(currLoc, newLoc) {
    // moving up break currLoc wall up
    // break newLoc wall down
    if (currLoc.floor < newLoc.floor) {
      newLoc.breakWall(1);
      currLoc.breakWall(0);
    }
    // moving down
    if (currLoc.floor > newLoc.floor) {
      newLoc.breakWall(0);
      currLoc.breakWall(1);
    }
    // moving forward
    if (currLoc.row > newLoc.row) {
      newLoc.breakWall(4);
      currLoc.breakWall(2);
    }
    // moving backward
    if (currLoc.row < newLoc.row) {
      newLoc.breakWall(2);
      currLoc.breakWall(4);
    }
    // moving right
    if (currLoc.col < newLoc.col) {
      newLoc.breakWall(5);
      currLoc.breakWall(3);
    }
    if (currLoc.col > newLoc.col) {
      newLoc.breakWall(3);
      currLoc.breakWall(5);
    }
  }
  /**
   * Checks whether the location is within
   * the boundaries of the maze
   * @param {Maze3d} maze 
   * @param {number} floor 
   * @param {number} row 
   * @param {number} col 
   * @returns 
   */
  #isSafe(maze, floor, row, col) {
    return (
      row >= 0 &&
      row < maze.size &&
      col >= 0 &&
      col < maze.size &&
      floor >= 0 &&
      floor < maze.floors &&
      maze.maze[floor][row][col]
    );
  }
}
