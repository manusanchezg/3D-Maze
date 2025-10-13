import mazeFactory from "../generation/createMaze.js";
import BreadthFirstSearch from "../search-algorithms/breadth-first-search.js";

// Quick test runner for BFS
(async function() {
  try {
    const size = 5;
    const floors = 3;
    const maze = mazeFactory.getMaze("DFS", size, floors);

    console.log('Start:', maze.s);
    console.log('Goal:', maze.g);

    const visitedCount = BreadthFirstSearch.search(maze);
    const path = BreadthFirstSearch.searchPath(maze);

    console.log('Visited count:', visitedCount);
    console.log('Path:', path);

    if (path) {
      console.log('Path length (steps):', path.length - 1);
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
})();
