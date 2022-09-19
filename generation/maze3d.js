import Cell from "./cell.js";

export default class Maze3d {
    #maze;

    constructor(size, floors) {
        this.floors = floors;
        this.size = size;
    
        this.#maze = new Array(floors);
    
        for (let i = 0; i < floors; i++) {
          this.#maze[i] = new Array(size);
          for (let j = 0; j < size; j++) {
            this.#maze[i][j] = new Array(size);
            // for every space in the array, create a cell
            // with 6 walls (all walls by default)
            for (let k = 0; k < size; k++) {
              this.#maze[i][j][k] = new Cell();
            }
          }
        }
      }

      get maze() {
        return this.#maze;
      }
}