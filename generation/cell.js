export default class Cell {
  #walls;

  constructor(
    up = true,
    down = true,
    forward = true,
    right = true,
    backward = true,
    left = true
  ) {
    this.#walls = [up, down, forward, right, backward, left];
  }
  get walls() {
    return this.#walls;
  }
  set walls(walls) {
    this.#walls = walls;
  }
}

// Is it better to pass the booleans of the walls as a parameter,
// or is it better to set them all in true from the beginning
// in the Cell class and then change it from the Maze class?

