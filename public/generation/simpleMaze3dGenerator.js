import Maze3DGenerator from "./maze3dGenerator.js";

/**
 * Uses the shortest path to the target, and
 * then shuffles the moves to the one
 */
export default class SimpleMaze3dGenerator extends Maze3DGenerator {
  createMaze(size, floors) {
    let maze = this.generate(size, floors);

    const start = this.#pickRandomCell();
    const target = this.#pickRandomCell();

    maze.setStart(start);
    maze.setTarget(target);

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
