import SimpleMaze3dGenerator from "./simpleMaze3dGenerator.js";

const maze = new SimpleMaze3dGenerator()
// console.log(maze.generate());
maze.generate()
console.log(maze.createMaze());
// console.log(maze.measureAlgorithmTime());