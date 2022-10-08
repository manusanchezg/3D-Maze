import Searchable from "../searchable.js";
import Node from "../node.js";

export default class BFSAlgorithm extends Searchable {
  /**
   *
   * @param {Node} goalNode
   */
  constructor(graph, goalNode) {
    super(graph, goalNode);
    this.frontier = []; // FIFO unshift() & pop()
    this.explored = new Map();
    this.path = []; // push()
  }
  /**
   *
   * @param {Node} start
   * @param {Node} target
   */
  search(start, target) {
    this.path.push(start);
    this.frontier.push(start);

    while (this.frontier.length > 0) {
      const currNode = this.frontier.pop();

      if (currNode.state === target.state) return this.path;

      this.explored.set(currNode.state, currNode);

      for (const child of currNode.actions) {
        if (!this.explored.has(child.state)) {
          for (let i = 0; i < this.frontier.length; i++) {
            const el = this.frontier[i];
            if (child.state !== el.state) {
              this.frontier.push(child);
            }
          }
        }
      }
      this.path.push(currNode);
    }
    return this.path
  }
}
