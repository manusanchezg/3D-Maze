import Searchable from "../searchable.js";

export default class AStarAlgorithm extends Searchable{
    constructor(graph, startNode, goalNode) {
        this.startNode = startNode;
        this.goalNode = goalNode;
        this.graph = graph;
        this.frontier = new Set();
    }
}