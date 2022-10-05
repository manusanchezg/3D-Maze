export default class Searchable {
  constructor(graph, states, actions, transitionFunc, goal) {
    if (this.constructor === Searchable)
      throw new Error("Searchable class cannot be instantiated");
    
    this.graph = graph;
    this.states = states;
    this.actions = actions;
    this.transitionFunc = transitionFunc;
    this.goal = goal;
  }
}
