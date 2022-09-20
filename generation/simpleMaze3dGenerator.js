import Maze3DGenerator from "./maze3dGenerator.js";

export default class SimpleMaze3dGenerator extends Maze3DGenerator {
  createMaze() {
    const start = this.#pickRandomCell();
    const target = this.#pickRandomCell();
    const directions = [
      [0, 0, 1],
      [0, 0, -1],
      [0, 1, 0],
      [0, -1, 0],
      [1, 0, 0],
      [-1, 0, 0],
    ];

    let maze = this.generate(this.maze.floors, this.maze.size, start, target);
    let step = directions[this.#randomInt(directions.length)];

    // Create the path between the target and the start
    // for (let i = 0; i < this.maze.floors; i++) {
    //   for (let j = 0; j < this.maze.size; j++) {
    //     for (let k = 0; k < this.maze.size; k++) {
    //       this.maze.maze[i][j][k].walls = this.#randomWalls();
    //     }
    //   }
    // }
    console.log(this.maze.location);
    while(start.floor !== target.floor && start.row !== target.row && start.col !== target.col) {
      let currLoc = this.maze.location
    }
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

  #randomWalls() {
    const wall = [true, false];
    let walls = new Array(6);

    for (let i = 0; i < walls.length; i++) {
      walls[i] = wall[Math.round(Math.random())];
    }
    return walls;
  }

  #breakWall(start) {
    const numOfWalls = 6;
    const wallToBreak = this.#randomInt(numOfWalls);
  }
}
