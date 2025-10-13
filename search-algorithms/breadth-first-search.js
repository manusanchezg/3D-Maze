import Searchable from "./searchable.js";
import Adapter2D from "./adapters/2dAdapter.js";
import Adapter3D from "./adapters/3dAdapter.js";
import { buildMovesMap } from "./movesBuilder.js";

class BreadthFirstSearch extends Searchable {
    //The BFS algorithm
    static search(game, source = 'S', target = 'G') {
        // Ensure there's a `moves` Map for the adapters. If the existing
        // code (generation/website) didn't provide it, build it from the
        // maze cell walls so the adapters can work without modifying older code.
        if (!game.moves) {
            game.moves = buildMovesMap(game.maze);
        }
        function BFS(root, goalKey) {
            const stack = [];
            stack.push(root);
            

            const visited = new Set();

            while(stack.length > 0) {
                const currNode = stack.shift();

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
            return BFS(root, goalKey);
        } else if (game.maze.length > 1) {
            const root = Adapter3D.adapt(game.maze, startPos, game.moves);
            return BFS(root, goalKey);
        }
    }

    // Return the path as an array of coordinate keys: ["f,r,c", ...] from start to goal.
    static searchPath(game, source = 'S', target = 'G') {
        if (!game.moves) {
            game.moves = buildMovesMap(game.maze);
        }

        const startPos = [game.s.floor, game.s.row, game.s.col];
        const goalKey = `${game.g.floor},${game.g.row},${game.g.col}`;

        // BFS that tracks parents to reconstruct the path
        function BFSWithParents(root) {
            const queue = [];
            queue.push(root);

            const visited = new Set();
            const parent = new Map();
            parent.set(root.value, null);

            while (queue.length > 0) {
                const currNode = queue.shift();
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
                        queue.push(child);
                    }
                }
            }

            return null;
        }

        if (game.maze.length === 1) {
            const root = Adapter2D.adapt(game.maze, startPos, game.moves);
            return BFSWithParents(root);
        } else if (game.maze.length > 1) {
            const root = Adapter3D.adapt(game.maze, startPos, game.moves);
            return BFSWithParents(root);
        }
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default BreadthFirstSearch;