import Cell from "./cell.js";

export default class Maze3d {
  #maze;

  /**
   * A representation of the Maze
   * @param {number} size 5 by default
   * @param {number} floors 3 by default
   * @param {Cell} s
   * @param {Cell} g
   * @param {Cell} location
   */
  constructor(size, floors, s, g) {
    this.floors = floors;
    this.size = size;
    this.s = s;
    this.g = g;

    this.#maze = new Array(floors);

    for (let i = 0; i < floors; i++) {
      this.#maze[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        this.#maze[i][j] = new Array(size);
        // for every space in the array, create a cell
        // with 6 walls (all walls by default)
        for (let k = 0; k < size; k++) {
          const walls = [true, true, true, true, true, true];
          this.#maze[i][j][k] = new Cell(...walls, i, j, k);
        }
      }
    }
  }

  setStart(start) {
    this.s = start;
    // copy start into location so they are independent objects
    this.location = { floor: start.floor, row: start.row, col: start.col };
  }

  setTarget(target) {
    this.g = target;
  }

  get maze() {
    return this.#maze;
  }

  changeLocation(newFloor, newRow, newCol) {
    this.location.floor = newFloor;
    this.location.row = newRow;
    this.location.col = newCol;

    return this.location;
  }

  toJSON() {
    return {
      maze: this.#maze,
      floors: this.floors,
      size: this.size,
      s: this.s,
      g: this.g,
      location: this.location,
    }
  }

  /**
   * Reconstruct a Maze3d instance from a plain object (parsed JSON)
   * This will recreate Cell instances so methods are available if needed.
   * @param {object} obj
   * @returns {Maze3d}
   */
  static fromJSON(obj) {
    if (!obj) return null;
    const size = obj.size;
    const floors = obj.floors;
    // Create an empty Maze3d instance
    const maze = new Maze3d(size, floors, obj.s || null, obj.g || null);

    // Replace maze internal structure with reconstructed Cells
    const reconstructed = new Array(floors);
    for (let f = 0; f < floors; f++) {
      reconstructed[f] = new Array(size);
      for (let r = 0; r < size; r++) {
        reconstructed[f][r] = new Array(size);
        for (let c = 0; c < size; c++) {
          const rawCell = obj.maze && obj.maze[f] && obj.maze[f][r] && obj.maze[f][r][c];
          if (rawCell) {
            // rawCell may already be a Cell-like object with .walls etc.
            const walls = Array.isArray(rawCell.walls) ? rawCell.walls : rawCell["#walls"] || [true, true, true, true, true, true];
            const floorIdx = typeof rawCell.floor === 'number' ? rawCell.floor : f;
            const rowIdx = typeof rawCell.row === 'number' ? rawCell.row : r;
            const colIdx = typeof rawCell.col === 'number' ? rawCell.col : c;
            reconstructed[f][r][c] = new Cell(...walls, floorIdx, rowIdx, colIdx);
            // If there were other properties on rawCell (rare), ignore them for now
          } else {
            reconstructed[f][r][c] = new Cell(true, true, true, true, true, true, f, r, c);
          }
        }
      }
    }

    // Replace the private #maze field. There's no direct way to set a private field
    // from here, but the constructor already created a #maze we can overwrite by
    // assigning to the internal property via a brute-force approach: use Object.getOwnPropertyNames
    // to find the private field key and set it. This is a fragile hack but works in environments
    // where private fields are transpiled to symbols; however to avoid runtime fragility,
    // we will instead set the public getter's backing by temporarily assigning via a closure.

    // As a simpler safe approach, we'll create a new Maze3d-like plain object with the
    // same public shape (not relying on private field mutation). Many parts of the app
    // access .maze via the getter; to keep compatibility, we'll return an object that
    // mimics the Maze3d public API.

    const plain = {
      maze: reconstructed,
      floors: floors,
      size: size,
      s: obj.s,
      g: obj.g,
      location: obj.location || (obj.s ? { floor: obj.s.floor, row: obj.s.row, col: obj.s.col } : { floor: 0, row: 0, col: 0 }),
      changeLocation(newFloor, newRow, newCol) {
        this.location.floor = newFloor;
        this.location.row = newRow;
        this.location.col = newCol;
        return this.location;
      },
      toJSON() {
        return obj;
      }
    };

    return plain;
  }
  /**
   * A console view of the maze
   */
  toString() {
    let toPrint = "";
    const upArrow = "\u{2191}";
    const downArrow = "\u{2193}";
    const upDownArrow = "\u{2195}";

    for (let i = 0; i < this.maze.length; i++) {
      toPrint += `${i + 1}° floor \n`;
      // Top side
      for (let j = 0; j < this.maze[0][0].length * 2 - 1; j++) {
        toPrint += "_";
      }
      toPrint += "\n";
      // Maze
      for (let row = 0; row < this.maze[0].length; row++) {
        for (let col = 0; col < this.maze[0][0].length; col++) {
          let cell = this.maze[i][row][col];

          if (this.s.floor === i && this.s.row === row && this.s.col === col) {
            toPrint = toPrint.slice(0, toPrint.length - 1) + "S";
          }
          if (this.g.floor === i && this.g.row === row && this.g.col === col) {
            toPrint = toPrint.slice(0, toPrint.length - 1) + "G";
          }
          if (
            this.location.floor === i &&
            this.location.row === row &&
            this.location.col === col
          ) {
            toPrint = toPrint.slice(0, toPrint.length - 1) + "P";
          }

          if (cell.walls[5]) {
            toPrint += "|";
          } else toPrint += " ";
          if (cell[0] && cell[1]) toPrint += upDownArrow;
          else if (cell[0]) toPrint += upArrow;
          else if (cell[1]) toPrint += downArrow;
          else toPrint += " ";
        }
        toPrint += "|\n";

        if (row < this.maze[i].length - 1) {
          toPrint += "|";
          for (let col = 0; col < this.maze[0][0].length; col++) {
            let cell = this.maze[i][row][col];
            if (cell.walls[4]) toPrint += "-";
            else toPrint += " ";
            toPrint += "+";
          }
          toPrint = toPrint.slice(0, toPrint.length - 1) + "|\n"
        }
      }
      toPrint += " "
      for (let i = 0; i < this.maze[0][0].length * 2 - 1; i++) toPrint += "_"
      toPrint += "\n"
    }
    return toPrint;
  }
}
