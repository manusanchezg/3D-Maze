import Node from "./node";

export default class Searchable {
  constructor(graph, goal) {
    if (this.constructor === Searchable)
      throw new Error("Searchable class cannot be instantiated");
    
    this.graph = graph;
    this.goal = new Node(goal);
  }

  search(start, target) {}
}
