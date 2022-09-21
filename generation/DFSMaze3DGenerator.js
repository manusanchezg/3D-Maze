import Maze3DGenerator from "./maze3dGenerator.js";

export default class DFSMaze3DGenerator extends Maze3DGenerator {
  createMaze() {
    const start = this.#pickRandomCell();
    const target = this.#pickRandomCell();
    let maze = this.generate(this.maze.size, this.maze.floors, start, target);
    const DIRECTIONS = [
      [0, 0, 1],
      [0, 0, -1],
      [0, 1, 0],
      [0, -1, 0],
      [1, 0, 0],
      [-1, 0, 0],
    ];

    let stack = [];
    let visited = new Set();
    let currLoc;
    let newLoc;

    stack.push([start.floor, start.row, start.row]);
    visited.add([start.floor, start.row, start.row].toString());

    while (stack.length) {
      const randomLoc = DIRECTIONS[this.#randomInt(DIRECTIONS.length)];
      const newFloor = randomLoc[0] + start.floor;
      const newRow = randomLoc[1] + start.row;
      const newCol = randomLoc[2] + start.col;
      currLoc = start;
      
      if (this.#isSafe(maze, newFloor, newRow, newCol, visited)) {
          newLoc = maze.maze[newFloor][newRow][newCol];

        this.#breakWall(currLoc, newLoc);
        visited.add([newLoc.floor, newLoc.row, newLoc.col].toString());
        currLoc = newLoc;
        stack.push(currLoc)
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
   * @returns a random integer between [0, range + 1)
   */
  #randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  #isSafe(maze, floor, row, col, visited) {
    return (
      row >= 0 &&
      row < maze.size &&
      col >= 0 &&
      col < maze.size &&
      floor >= 0 &&
      floor < maze.floors &&
      maze.maze[floor][row][col] &&
      !visited.has([floor, row, col].toString())
    );
  }

  #breakWall(currLoc, newLoc) {
    if (currLoc.floor < newLoc.floor) {
      currLoc.breakWall(0);
      newLoc.breakWall(1);
    }
    if (currLoc.floor > newLoc.floor) {
      newLoc.breakWall(0);
      currLoc.breakWall(1);
    }
    if (currLoc.row > newLoc.row) {
      newLoc.breakWall(2);
      currLoc.breakWall(4);
    }
    if (currLoc.row < newLoc.row) {
      currLoc.breakWall(2);
      newLoc.breakWall(4);
    }
    if (currLoc.col < newLoc.col) {
      currLoc.breakWall(3);
      newLoc.breakWall(5);
    }
    if (currLoc.col > newLoc.col) {
      newLoc.breakWall(3);
      currLoc.breakWall(5);
    }
  }

  //   #areEqual(cell1, cell2) {
  //     return (
  //       cell1.floor === cell2.floor &&
  //       cell1.row === cell2.row &&
  //       cell1.col === cell2.col
  //     );
  //   }
}
