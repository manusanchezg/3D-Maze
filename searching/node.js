export default class Node {
  constructor(state, actions = [], cost = 0, prevNode = null) {
    this.state = state;
    this.actions = actions;
    this.cost = cost;
    this.prevNode = prevNode;
  }
}
