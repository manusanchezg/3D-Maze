import Searchable from "./searchable.js";
import Adapter2D from "./adapters/2dAdapter.js";
import Adapter3D from "./adapters/3dAdapter.js";

class BreadthFirstSearch extends Searchable {
    //The BFS algorithm - Modified to return path
    static search(game, source = 'S', target = 'G') {
        function BFS(root) {
            const queue = [];
            queue.push({ node: root, path: [root] });
            
            const visited = new Set();

            while(queue.length > 0) {
                const { node: currNode, path } = queue.shift();

                if (currNode.value === target) {
                    // Retorna el camino completo como array de posiciones
                    return path.map(node => ({
                        floor: node.floor || 0,
                        row: node.row,
                        col: node.col
                    }));
                }
                
                visited.add(currNode.value);
                
                for (let i = 0; i < currNode.children.length; i++) {
                    const child = currNode.children[i];
                    if (!visited.has(child.value)) {
                        // Verifica si ya está en la cola
                        let inQueue = false;
                        for (let j = 0; j < queue.length; j++) {
                            if (queue[j].node.value === child.value) {
                                inQueue = true;
                                break;
                            }
                        }
                        if (!inQueue) {
                            // Agrega el nodo hijo y extiende el camino
                            queue.push({ 
                                node: child, 
                                path: [...path, child] 
                            });
                        }
                    }
                }
            }
            return []; // Retorna array vacío si no encuentra solución
        }

        //This function search the start node.
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
        
        if (game.maze.length === 1) {
            return BFS(Adapter2D.adapt(game.maze, game.s, game.moves));
        } else if (game.maze.length > 1) {
            return BFS(Adapter3D.adapt(game.maze, game.s, game.moves));
        }     
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default BreadthFirstSearch;