import Searchable from "./searchable.js";
import Adapter2D from "./adapters/2dAdapter.js";
import Adapter3D from "./adapters/3dAdapter.js";

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
        function ASearch(root, successor, goalTest, heuristic) {
            const initialNode = root;

            const priorQueue = new PriorityQueue();
            priorQueue.push(root);

            const explored = new Set();

        }

        function goalTest(node) {
            if (node.value = 'G') {
                return true;
            }
            return false;
        }

        function successor(node) {
            return [...node.children];
        }

        function searchNode(problem, value) {
            for (let i = 0; i < problem.length; i++) {
                for (let j = 0; j < problem[0].length; j++) {
                    for (let k = 0; k < problem[0][0].length; k++) {
                        if (problem[i][j][k] === value) {
                            return [i, j, k];
                        }
                    }
                }
            }
        }

        function _heuristic(problem, goalPos) {
            const saverProblem = problem;
            const saveFinalNode = finalNode;

            return function heuristic(node) {
                const nodePosition = searchNode(problem, node.value);
    
                const xDiference = nodePosition[0] > goalPos[0] ? nodePosition[0] - goalPos[0] : goalPos[0] - nodePosition[0];
                const yDiference = nodePosition[1] > goalPos[1] ? nodePosition[1] - goalPos[1] : goalPos[1] - nodePosition[1];
                const zDiference = nodePosition[2] > goalPos[2] ? nodePosition[2] - goalPos[2] : goalPos[2] - nodePosition[2];
    
                const maxDistance = problem.length * problem[0].length * problem[0][0].length;
    
                return maxDistance - xDiference - yDiference - zDiference;
            }
        }

        const startNode = searchNode(game.maze, 'S');
        const finalNode = searchNode(game.maze, 'G');
        const useHeuristic = _heuristic(game.maze, finalNode);
        //root, successor, goalTest, heuristic
        if (game.maze.length === 1) {
            return ASearch(Adapter2D.adapt(game.maze, startNode, game.moves), successor, goalTest, useHeuristic);
        } else if (game.maze.length > 1) {
            return ASearch(Adapter3D.adapt(game.maze, startNode, game.moves), successor, goalTest, useHeuristic);
        }     
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default AStarSearch;