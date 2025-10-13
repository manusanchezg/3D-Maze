export default class Player {
  constructor(initialLocation) {
    this.player = document.createElement("img");
    this.player.src = "../assets/player.svg";
    this.player.style.width = "45px";
    this.floor = initialLocation.floor;
    this.row = initialLocation.row;
    this.col = initialLocation.col;
  }

  changePlayerLocation(newFloor, newRow, newCol) {
    this.floor = newFloor;
    this.row = newRow;
    this.col = newCol;
  }

  get location() {
    return {
      floor: this.floor,
      row: this.row,
      col: this.col,
    };
  }
}
