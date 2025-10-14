import Searchable from "./searchable.js";
import Adapter2D from "./adapters/2dAdapter.js";
import Adapter3D from "./adapters/3dAdapter.js";
import { buildMovesMap } from "./movesBuilder.js";

class PriorityQueue {
    #heap
    #comparator
    #top
  
    constructor(comparator = (a, b) => a > b) {
      this.#heap = [];
      this.#comparator = comparator;
      this.#top = 0;
    }
  
    size() {
      return this.#heap.length;
    }
  
    isEmpty() {
      return this.size() == 0;
    }
  
    peek() {
      return this.#heap[this.#top];
    }
  
    push(...values) {
      values.forEach(value => {
        this.#heap.push(value);
        this.#heapifyUp(this.size() - 1);
      });
      return this.size();
    }
  
    pop() {
      const poppedValue = this.peek();
      const bottom = this.size() - 1;
      if (bottom > this.#top) {
        this.#swap(this.#top, bottom);
      }
      this.#heap.pop();
      this.#heapifyDown();
      return poppedValue;
    }
  
    remove(value) {
      const index = this.#heap.indexOf(value);
      if (index != -1) {
        this.#removeAt(index);
      }
    }
  
    #parent(childIndex) {    
      return Math.floor((childIndex - 1) / 2);
    }
  
    #left(parentIndex) {
      return (parentIndex * 2) + 1;   
    }
  
    #right(parentIndex) {
      return (parentIndex * 2) + 2;
    }
  
    #greater(i, j) {
      return this.#comparator(this.#heap[i], this.#heap[j]);
    }
  
    #swap(i, j) {
      [this.#heap[i], this.#heap[j]] = [this.#heap[j], this.#heap[i]];
    }
  
    #heapifyUp(index) {   
      while (index > this.#top && this.#greater(index, this.#parent(index))) {
        this.#swap(index, this.#parent(index));
        index = this.#parent(index);
      }
    }
  
    #heapifyDown() {
      let index = this.#top;
  
      while (
        (this.#left(index) < this.size() && this.#greater(this.#left(index), index)) ||
        (this.#right(index) < this.size() && this.#greater(this.#right(index), index))
      ) {
        let maxChild = (this.#right(index) < this.size() && this.#greater(this.#right(index), this.#left(index))) ? 
          this.#right(index) : this.#left(index);
        this.#swap(index, maxChild);
        index = maxChild;
      }
    }
  
    #removeAt(index) {
      // Remove the last element and place it at the removed index
      this.#heap[index] = this.#heap.pop();
  
      if (index > this.#top && this.#greater(index, this.#parent(index))) {
        this.#heapifyUp(index);
      } else {
        this.#heapifyDown(index);
      }    
    }
  }

class AStarSearch extends Searchable {
    static search(game, source = 'S', target = 'G') {
        // Ensure there's a `moves` Map for the adapters
        if (!game.moves) {
            game.moves = buildMovesMap(game.maze);
        }

        function ASearch(root, goalKey, heuristic) {
            // Priority queue for A* (min-heap based on f(n) = g(n) + h(n))
            const priorQueue = new PriorityQueue((a, b) => a.f < b.f);
            
            // Add f, g, h values to the root node
            root.g = 0;
            root.h = heuristic(root);
            root.f = root.g + root.h;
            
            priorQueue.push(root);
            const explored = new Set();
            const openSet = new Set([root.value]);

            while (!priorQueue.isEmpty()) {
                const currentNode = priorQueue.pop();
                openSet.delete(currentNode.value);

                if (currentNode.value === goalKey) {
                    return explored.size;
                }

                explored.add(currentNode.value);

                for (let i = 0; i < currentNode.children.length; i++) {
                    const child = currentNode.children[i];
                    
                    if (explored.has(child.value)) {
                        continue;
                    }

                    const tentativeG = currentNode.g + 1; // Assuming each move costs 1

                    if (!openSet.has(child.value)) {
                        child.g = tentativeG;
                        child.h = heuristic(child);
                        child.f = child.g + child.h;
                        child.parent = currentNode;
                        
                        priorQueue.push(child);
                        openSet.add(child.value);
                    } else if (tentativeG < child.g) {
                        child.g = tentativeG;
                        child.f = child.g + child.h;
                        child.parent = currentNode;
                    }
                }
            }
            return false;
        }

        // Manhattan distance heuristic for 3D space
        function manhattanHeuristic(goalPos) {
            return function(node) {
                const [nodeF, nodeR, nodeC] = node.value.split(',').map(Number);
                const [goalF, goalR, goalC] = goalPos;
                
                return Math.abs(nodeF - goalF) + Math.abs(nodeR - goalR) + Math.abs(nodeC - goalC);
            }
        }

        // Build coordinate keys for start and goal (format 'f,r,c')
        const startPos = [game.s.floor, game.s.row, game.s.col];
        const goalPos = [game.g.floor, game.g.row, game.g.col];
        const goalKey = `${game.g.floor},${game.g.row},${game.g.col}`;
        const heuristic = manhattanHeuristic(goalPos);

        if (game.maze.length === 1) {
            const root = Adapter2D.adapt(game.maze, startPos, game.moves);
            return ASearch(root, goalKey, heuristic);
        } else if (game.maze.length > 1) {
            const root = Adapter3D.adapt(game.maze, startPos, game.moves);
            return ASearch(root, goalKey, heuristic);
        }
    }

    // Return the path as an array of coordinate keys: ["f,r,c", ...] from start to goal.
    static searchPath(game, source = 'S', target = 'G') {
        if (!game.moves) {
            game.moves = buildMovesMap(game.maze);
        }

        function ASearchWithPath(root, goalKey, heuristic) {
            const priorQueue = new PriorityQueue((a, b) => a.f < b.f);
            
            root.g = 0;
            root.h = heuristic(root);
            root.f = root.g + root.h;
            root.parent = null;
            
            priorQueue.push(root);
            const explored = new Set();
            const openSet = new Set([root.value]);

            while (!priorQueue.isEmpty()) {
                const currentNode = priorQueue.pop();
                openSet.delete(currentNode.value);

                if (currentNode.value === goalKey) {
                    // Reconstruct path
                    const path = [];
                    let node = currentNode;
                    while (node !== null) {
                        path.push(node.value);
                        node = node.parent;
                    }
                    path.reverse();
                    return path;
                }

                explored.add(currentNode.value);

                for (let i = 0; i < currentNode.children.length; i++) {
                    const child = currentNode.children[i];
                    
                    if (explored.has(child.value)) {
                        continue;
                    }

                    const tentativeG = currentNode.g + 1;

                    if (!openSet.has(child.value)) {
                        child.g = tentativeG;
                        child.h = heuristic(child);
                        child.f = child.g + child.h;
                        child.parent = currentNode;
                        
                        priorQueue.push(child);
                        openSet.add(child.value);
                    } else if (tentativeG < child.g) {
                        child.g = tentativeG;
                        child.f = child.g + child.h;
                        child.parent = currentNode;
                    }
                }
            }
            return null;
        }

        function manhattanHeuristic(goalPos) {
            return function(node) {
                const [nodeF, nodeR, nodeC] = node.value.split(',').map(Number);
                const [goalF, goalR, goalC] = goalPos;
                
                return Math.abs(nodeF - goalF) + Math.abs(nodeR - goalR) + Math.abs(nodeC - goalC);
            }
        }

        const startPos = [game.s.floor, game.s.row, game.s.col];
        const goalPos = [game.g.floor, game.g.row, game.g.col];
        const goalKey = `${game.g.floor},${game.g.row},${game.g.col}`;
        const heuristic = manhattanHeuristic(goalPos);

        if (game.maze.length === 1) {
            const root = Adapter2D.adapt(game.maze, startPos, game.moves);
            return ASearchWithPath(root, goalKey, heuristic);
        } else if (game.maze.length > 1) {
            const root = Adapter3D.adapt(game.maze, startPos, game.moves);
            return ASearchWithPath(root, goalKey, heuristic);
        }
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default AStarSearch;