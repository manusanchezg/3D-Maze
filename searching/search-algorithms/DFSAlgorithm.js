import Searchable from "../searchable.js";
import Node from "../node.js";

export default class DFSAlgorithm extends Searchable {
    constructor(graph, goalNode) {
        super(graph, goalNode)
        this.frontier = []; // LIFO push() & pop()
        this.explored = new Map();
        this.path = []; // push()
    }

    /**
     * 
     * @param {Node} start 
     * @param {Node} target 
     */
    search(start, target) {
        this.path.push(start)
        this.frontier.push(start)
    }
}