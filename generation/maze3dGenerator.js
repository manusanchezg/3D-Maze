import Maze3D from "./maze3d.js"

/**
 * Abstract Class for generating a Maze
 */
export default class Maze3DGenerator {
  constructor() {
    if (this.constructor === Maze3DGenerator)
      throw new Error("Maze3d Class cannot be instantiated");
  }

  generate(size = 5, floors = 3, start, target) {
    this.maze = new Maze3D(size, floors, start, target)
    return this.maze
  }

  measureAlgorithmTime() {
    let first = Date.now();
    this.generate(this.maze.size, this.maze.floors)
    let last = Date.now()
    return `Running time: ${last - first} ms`
  }
}
