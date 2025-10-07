import DFSMaze3DGenerator from "./DFSMaze3DGenerator.js";
import SimpleMaze3dGenerator from "./simpleMaze3dGenerator.js";
import ABMaze3DGenerator from "./ABMaze3DGenerator.js";

/**
 * Factory class to create different maze generators
 * @class MazeFactory
 * @static getMaze
 * @param {string} algorithm - The algorithm to use ("DFS", "Simple", "AB")
 * @returns {Maze3DGenerator} An instance of the requested maze generator
 */
export default class MazeFactory {
  static getMaze(algorithm, size, floors) {
    switch (algorithm) {
        case "DFS":
            return (new DFSMaze3DGenerator()).createMaze(size, floors);
        case "Simple":
            return new SimpleMaze3dGenerator().createMaze(size, floors);
        case "AB":
            return new ABMaze3DGenerator().createMaze(size, floors);
        default:
            throw new Error("Unknown algorithm");
    }    
  }
}


