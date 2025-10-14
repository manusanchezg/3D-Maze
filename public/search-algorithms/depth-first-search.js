import Searchable from "./searchable.js";
import Adapter2D from "./adapters/2dAdapter.js";
import Adapter3D from "./adapters/3dAdapter.js";
import { buildMovesMap } from "./movesBuilder.js";

class DepthFirstSearch extends Searchable {
    //The DFS algorithm
    static search(game, source = 'S', target = 'G') {
        // Ensure there's a `moves` Map for the adapters. If the existing
        // code (generation/website) didn't provide it, build it from the
        // maze cell walls so the adapters can work without modifying older code.
        if (!game.moves) {
            game.moves = buildMovesMap(game.maze);
        }
        
        function DFS(root, goalKey) {
            const stack = [];
            stack.push(root);
            
            const visited = new Set();
            
            while(stack.length > 0) {
                const currNode = stack.pop();

                if (currNode.value === goalKey) {
                    return visited.size;
                }
                
                visited.add(currNode.value);

                for (let i = 0; i < currNode.children.length; i++) {
                    if (!visited.has(currNode.children[i].value)) {
                        stack.push(currNode.children[i]);
                    }
                }
            }
            return false;
        }
        
        // Build coordinate keys for start and goal (format 'f,r,c')
        const startPos = [game.s.floor, game.s.row, game.s.col];
        const goalKey = `${game.g.floor},${game.g.row},${game.g.col}`;

        if (game.maze.length === 1) {
            const root = Adapter2D.adapt(game.maze, startPos, game.moves);
            return DFS(root, goalKey);
        } else if (game.maze.length > 1) {
            const root = Adapter3D.adapt(game.maze, startPos, game.moves);
            return DFS(root, goalKey);
        }
    }

    // Return the path as an array of coordinate keys: ["f,r,c", ...] from start to goal.
    static searchPath(game, source = 'S', target = 'G') {
        if (!game.moves) {
            game.moves = buildMovesMap(game.maze);
        }

        const startPos = [game.s.floor, game.s.row, game.s.col];
        const goalKey = `${game.g.floor},${game.g.row},${game.g.col}`;

        // DFS that tracks parents to reconstruct the path
        function DFSWithParents(root) {
            const stack = [];
            stack.push(root);

            const visited = new Set();
            const parent = new Map();
            parent.set(root.value, null);

            while (stack.length > 0) {
                const currNode = stack.pop();
                if (currNode.value === goalKey) {
                    // reconstruct path
                    const path = [];
                    let nodeKey = currNode.value;
                    while (nodeKey !== null) {
                        path.push(nodeKey);
                        nodeKey = parent.get(nodeKey);
                    }
                    path.reverse();
                    return path;
                }

                visited.add(currNode.value);

                for (let i = 0; i < currNode.children.length; i++) {
                    const child = currNode.children[i];
                    const childKey = child.value;
                    if (!visited.has(childKey) && !parent.has(childKey)) {
                        parent.set(childKey, currNode.value);
                        stack.push(child);
                    }
                }
            }

            return null;
        }

        if (game.maze.length === 1) {
            const root = Adapter2D.adapt(game.maze, startPos, game.moves);
            return DFSWithParents(root);
        } else if (game.maze.length > 1) {
            const root = Adapter3D.adapt(game.maze, startPos, game.moves);
            return DFSWithParents(root);
        }
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default DepthFirstSearch;