import Searchable from "../searchable.js";
import Maze3d from "../../generation/maze3d.js";
import Cell from "../../generation/cell.js";
import Node from "../node.js";

export default class BFSAlgorithm extends Searchable {
  /**
   *
   * @param {Maze3d} graph
   * @param {Cell} startNode
   * @param {Cell} goalNode
   */
  constructor(graph, startNode, goalNode) {
    this.startNode = new Node(startNode, graph.getNeighbours(startNode));
    this.goalNode = new Node(goalNode); // Target
    this.graph = graph; // The maze itself
    this.frontier = []; // FIFO unshift() & pop()
    this.explored = new Set();
    this.path = []; // push()
  }
  BFS() {
    
  }
}
