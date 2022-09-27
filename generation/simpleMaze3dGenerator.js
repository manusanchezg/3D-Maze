import Maze3DGenerator from "./maze3dGenerator.js";

/**
 * Uses the shortest path to the target, and
 * then shuffles the moves to the one
 */
export default class SimpleMaze3dGenerator extends Maze3DGenerator {
  createMaze() {
    const start = this.#pickRandomCell();
    const target = this.#pickRandomCell();

    let maze = this.generate(this.maze.size, this.maze.floors, start, target);
    let steps = [];
    let currLoc = start;
    let newLoc = maze.location;
    let step;

    if (start.floor - target.floor < 0) {
      for (let i = 0; i < target.floor - start.floor; i++)
        steps.push([1, 0, 0]);
    }
    if (start.floor - target.floor > 0) {
      for (let i = 0; i < start.floor - target.floor; i++)
        steps.push([-1, 0, 0]);
    }
    if (start.row - target.row > 0) {
      for (let i = 0; i < start.row - target.row; i++) steps.push([0, -1, 0]);
    }
    if (start.row - target.row < 0) {
      for (let i = 0; i < target.row - start.row; i++) steps.push([0, 1, 0]);
    }
    if (start.col - target.col < 0) {
      for (let i = 0; i < target.col - start.col; i++) steps.push([0, 0, 1]);
    }
    if (start.col - target.col > 0) {
      for (let i = 0; i < start.col - target.col; i++) steps.push([0, 0, -1]);
    }

    do {
      step = steps[this.#randomInt(steps.length)];

      newLoc =
        maze.maze[currLoc.floor + step[0]][currLoc.row + step[1]][
          currLoc.col + step[2]
        ];
      this.#breakWall(currLoc, newLoc);
      currLoc = newLoc;

      const index = steps.indexOf(step);
      steps.splice(index, 1);
    } while (steps.length)

    maze.maze[start.floor][start.row][start.col] = start
    return maze;
  }

  /**
   * @returns a random cell from the maze
   */
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

  #breakWall(currLoc, newLoc) {
    if (currLoc.floor < newLoc.floor) {
      currLoc.walls = [false, true, true, true, true, true];
      newLoc.walls = [true, false, true, true, true, true];
    }
    if (currLoc.floor > newLoc.floor) {
      newLoc.walls = [false, true, true, true, true, true];
      currLoc.walls = [true, false, true, true, true, true];
    }
    if (currLoc.row > newLoc.row) {
      newLoc.walls = [true, true, false, true, true, true];
      currLoc.walls = [true, true, true, true, false, true];
    }
    if (currLoc.row < newLoc.row) {
      currLoc.walls = [true, true, false, true, true, true];
      newLoc.walls = [true, true, true, true, false, true];
    }
    if (currLoc.col < newLoc.col) {
      currLoc.walls = [true, true, true, false, true, true];
      newLoc.walls = [true, true, true, true, true, false];
    }
    if (currLoc.col > newLoc.col) {
      newLoc.walls = [true, true, true, false, true, true];
      currLoc.walls = [true, true, true, true, true, false];
    }
  }
}
