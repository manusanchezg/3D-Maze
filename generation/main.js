import DFSMaze3DGenerator from "./DFSMaze3DGenerator.js";
import SimpleMaze3dGenerator from "./simpleMaze3dGenerator.js";
import ABMaze3DGenerator from "./ABMaze3DGenerator.js";

const maze = new SimpleMaze3dGenerator()
// console.log(maze.generate());
maze.generate()
console.log(maze.createMaze());
console.log(maze.measureAlgorithmTime());
const DFSMaze = new DFSMaze3DGenerator()
DFSMaze.generate()
DFSMaze.createMaze()
DFSMaze.measureAlgorithmTime()
// console.log(DFSMaze.maze.toString())
const ABMaze = new ABMaze3DGenerator()
ABMaze.generate()
ABMaze.createMaze()