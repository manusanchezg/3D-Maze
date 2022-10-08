export default class Player {
    /**
     * 
     * @param {number} floor 
     * @param {number} row 
     * @param {number} col 
     */
    constructor(floor, row, col) {
        this.floor = floor;
        this.row = row;
        this.col = col;
        this.player = document.createElement("img")
        this.player.src = "../assets/player.svg"
    }
}