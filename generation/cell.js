export default class Cell {
  #walls;

  constructor(up, down, forward, right, backward, left, floor, row, col) {
    this.#walls = [up, down, forward, right, backward, left];
    this.floor = floor;
    this.row = row;
    this.col = col;
  }
  get walls() {
    return this.#walls;
  }
  set walls(walls) {
    this.#walls = walls;
  }

  breakWall(index) {
    this.walls[index] = false
  }
}

// Is it better to pass the booleans of the walls as a parameter,
// or is it better to set them all in true from the beginning
// in the Cell class and then change it from the Maze class?
