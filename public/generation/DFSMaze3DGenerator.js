import Cell from "./cell.js";
import Maze3DGenerator from "./maze3dGenerator.js";

/**
 * It creates a Maze3D using the Depth-First-Search Algorithm
 */
export default class DFSMaze3DGenerator extends Maze3DGenerator {
  get start() {
    return this.maze.s;
  }
  createMaze(size, floors) {
    const maze = this.generate(size, floors);
    const start = this.#pickRandomCell(size, floors);
    const target = this.#pickRandomCell(size, floors);

    maze.setStart(start);
    maze.setTarget(target);

    const stack = [];
    const visited = new Set();

    stack.push(start);
    visited.add(this.#cellKey(start));

    while (stack.length) {
      const currLoc = stack.pop();
      const neighbours = this.#getNeighbours(currLoc, visited);

      // DFS: elige vecinos aleatoriamente y sigue profundizando
      for (const neighbour of this.#shuffleArray(neighbours)) {
        const key = this.#cellKey(neighbour);
        if (!visited.has(key)) {
          this.#breakWall(currLoc, neighbour);
          visited.add(key);
          stack.push(neighbour);
        }
      }
    }
    return maze;
  }

  #cellKey(cell) {
    return `${cell.floor},${cell.row},${cell.col}`;
  }

  #pickRandomCell(size, floors) {
    const floor = this.#randomInt(floors);
    const row = this.#randomInt(size);
    const col = this.#randomInt(size);

    return this.maze.maze[floor][row][col];
  }

  /**
   * @param {number} range
   * @returns a random integer between [0, range)
   */
  #randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  /**
   * Shuffle array (Fisher-Yates)
   */
  #shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * @param {Cell} cell
   * @param {Set} visited
   */
  #getNeighbours(cell, visited) {
    const neighbours = [];
    const DIRECTIONS = [
      [0, 0, 1],
      [0, 0, -1],
      [0, 1, 0],
      [0, -1, 0],
      [1, 0, 0],
      [-1, 0, 0],
    ];

    for (const direction of DIRECTIONS) {
      const newFloor = cell.floor + direction[0];
      const newRow = cell.row + direction[1];
      const newCol = cell.col + direction[2];
      if (this.#isSafe(this.maze, newFloor, newRow, newCol)) {
        const neighbour = this.maze.maze[newFloor][newRow][newCol];
        if (!visited.has(this.#cellKey(neighbour))) {
          neighbours.push(neighbour);
        }
      }
    }
    return neighbours;
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
}
