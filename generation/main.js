import DFSMaze3DGenerator from "./DFSMaze3DGenerator.js";
import SimpleMaze3dGenerator from "./simpleMaze3dGenerator.js";
import ABMaze3DGenerator from "./ABMaze3DGenerator.js";
import Maze3d from "./maze3d.js";
import Maze3DGenerator from "./maze3dGenerator.js";

//! Maze Try
// const maze = new Maze3d(5, 3)
// const cell = maze.maze[2][4][1]
// console.log(maze.getNeighbours(cell))

//! Simple Maze Generation
// const maze = new SimpleMaze3dGenerator()
// console.log(maze.generate());
// maze.generate()
// console.log(maze.createMaze());
// console.log(maze.measureAlgorithmTime());

//! DFS Maze Generation
// const DFSMaze = new DFSMaze3DGenerator()
// DFSMaze.generate()
// console.log(DFSMaze.createMaze())
// DFSMaze.measureAlgorithmTime()
// console.log(DFSMaze.maze)

//! AB Maze Generation
// const ABMaze = new ABMaze3DGenerator()
// ABMaze.generate()
// console.log(ABMaze.createMaze())

//! BFS Search Algorithm
const DFSMaze = new DFSMaze3DGenerator()
DFSMaze.generate()
const maze = DFSMaze.createMaze()

export { maze }
