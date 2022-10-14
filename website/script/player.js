export default class Player {
  constructor(maze) {
    this.player = document.createElement("img");
    this.player.src = "../assets/player.svg";
    this.player.style.width = "45px";
    this.floor = maze.location.floor;
    this.row = maze.location.row;
    this.col = maze.location.col;
  }

  changePlayerLocation(newFloor, newRow, newCol) {
    this.floor = newFloor;
    this.row = newRow;
    this.col = newCol;
  }
}
