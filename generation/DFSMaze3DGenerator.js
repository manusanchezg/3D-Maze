import Cell from "./cell.js";
import Maze3DGenerator from "./maze3dGenerator.js";

/**
 * It creates a Maze3D using the Depth-First-Search Algorithm
 */
export default class DFSMaze3DGenerator extends Maze3DGenerator {
  createMaze() {
    const start = this.#pickRandomCell();
    const target = this.#pickRandomCell();
    const maze = this.generate(this.maze.size, this.maze.floors, start, target);

    const stack = [];
    const visited = new Set();
    let currLoc = start;
    let newLoc;

    stack.push([start.floor, start.row, start.row]);
    visited.add([start.floor, start.row, start.row].toString());

    while (stack.length) {
      const neighbours = this.#getNeighbours(currLoc, visited);
      const neighbour = neighbours[this.#randomInt(neighbours.length)];

      if (
        !visited.has([neighbour.floor, neighbour.row, neighbour.col].toString())
      ) {
        newLoc = neighbour;
        this.#breakWall(currLoc, newLoc);
        visited.add([neighbour.floor, neighbour.row, neighbour.col].toString());
        stack.push(...neighbours);
        currLoc = newLoc;
      } else {
        currLoc = stack.pop();
      }
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
   * @returns a random integer between [0, range)
   */
  #randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  /**
   *
   * @param {Maze3d} maze
   * @param {Cell} cell
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
      //I doesn't enter to the if, never
      if (this.#isSafe(this.maze, newFloor, newRow, newCol)) {
        if(!visited.has([newFloor, newRow, newCol])){
          const neighbour = this.maze.maze[newFloor][newRow][newCol];
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
