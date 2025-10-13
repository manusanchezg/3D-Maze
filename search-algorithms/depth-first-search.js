import Searchable from "./searchable.js";
import Adapter2D from "./adapters/2dAdapter.js";
import Adapter3D from "./adapters/3dAdapter.js";

class DepthFirstSearch extends Searchable{
    static search(game, source = 'S', target = 'G') {
        //The DFS algorithm
        function DFS(root, target = 'G') {
            const stack = [];
            stack.push(root);
            
            const visited = new Set();
            
            while(stack.length > 0) {
                const currNode = stack.pop();

                if (currNode.value === target) {
                    return visited.size;
                }
                
                visited.add(currNode.value);

                for (let i = 0; i < currNode.children.length; i++) {
                    if (!visited.has(currNode.children[i].value)) {
                        let addToStack = true;
                        for (let j = 0; j < stack.length; j++) {
                            if (stack[j].value === currNode.children[i].value) {
                                addToStack = false;
                                break;
                            }
                        }
                        if (addToStack) {
                            stack.push(currNode.children[i]);
                        }
                    }
                }
            }
            return false;
        }
        
        //This function search the position of the entry
        function searchStartNode(problem) {
            for (let i = 0; i < problem.length; i++) {
                for (let j = 0; j < problem[0].length; j++) {
                    for (let k = 0; k < problem[0][0].length; k++) {
                        if (problem[i][j][k] === 'S') {
                            return [i, j, k];
                        }
                    }
                }
            }
        }
        
        const startNode = searchStartNode(game.maze);
        if (game.maze.length === 1) {
            return DFS(Adapter2D.adapt(game.maze, startNode, game.moves));
        } else if (game.maze.length > 1) {
            return DFS(Adapter3D.adapt(game.maze, startNode, game.moves));
        }  
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default DepthFirstSearch;