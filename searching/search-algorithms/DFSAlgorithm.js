import Searchable from "../searchable.js";
import Node from "../node.js";

export default class DFSAlgorithm extends Searchable {
    constructor(graph, goalNode) {
        super(graph, goalNode)
        this.frontier = []; // LIFO push() & pop()
        this.explored = new Set();
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

        let currLoc = start
        let newLoc;

        while (this.frontier.length) {
           newLoc = this.frontier.pop()

           this.explored.add()
           const neighbours = newLoc.actions
           this.frontier.push(...neighbours)

           if (newLoc !== target) {
            this.path.push(newLoc)
           }
           currLoc = newLoc
        }

        return this.path
    }
    // /**
    //  * @param {Node} cell 
    //  */
    // #getNeighbours(cell) {

    // }
}