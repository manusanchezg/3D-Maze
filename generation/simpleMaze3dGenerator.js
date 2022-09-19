import Maze3d from "./maze3d.js";
import Maze3DGenerator from "./maze3dGenerator.js";

export default class SimpleMaze3dGenerator extends Maze3DGenerator {

  constructor() {
    super();
  }
  generate(size = 5, floors = 3) {
    this.maze = new Maze3d(size, floors)
  }

  createMaze(){
      const start = this.#pickRandomCell()
      const target = this.#pickRandomCell()
      console.log([start, target]);

    // Create the path between the target and the start
    const walls = this.#randomWalls()

    console.log([start === target, walls]); 
  }

  /**
   * @returns a random cell from the maze
   */
  #pickRandomCell() {
    const floor = this.#randomInt(this.maze.floors)
    const row = this.#randomInt(this.maze.size)
    const col = this.#randomInt(this.maze.size)

    return this.maze[floor][row][col]
  }

    /**
   * @param {number} range
   * @returns a random integer between [0, range + 1)
   */
  #randomInt(range) {
    return Math.floor(Math.random() * (range + 1));
  }

  #randomWalls() {
    const wall = [true, false];
    let walls = new Array(6);

    for (let i = 0; i < walls.length; i++) {
        walls[i] = Math.round(Math.random())
    }
    return walls
  }

}

const maze = new MazeGenerator();
// console.log(maze.maze);
console.log(maze.createMaze());