// Builds a Map of moves expected by the adapters.
// The adapters expect `map.get(cell)[directionIndex]` to be truthy when
// movement in that direction is possible. Generation `Cell` stores a
// `walls` array where `true` means wall present. We invert that meaning.
export function buildMovesMap(maze) {
    const moves = new Map();

    // If maze is 2D represented as [level][row][col] but only one level,
    // treat as 3D with length 1 to reuse the same logic.
    const floors = maze.length;
    const rows = maze[0].length;
    const cols = maze[0][0].length;

    for (let f = 0; f < floors; f++) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = maze[f][r][c];
                // cell.walls: [up, down, forward, right, backward, left]
                // adapters expect Moves indices in this order:
                // { left:0, right:1, forward:2, backward:3, up:4, down:5 }
                // So build an array of allowed movements that matches that order
                // where `true` means movement allowed (no wall).
                const up = cell.walls[0];
                const down = cell.walls[1];
                const forward = cell.walls[2];
                const right = cell.walls[3];
                const backward = cell.walls[4];
                const left = cell.walls[5];

                const allowed = [
                    !left,     // left -> index 0
                    !right,    // right -> index 1
                    !forward,  // forward -> index 2
                    !backward, // backward -> index 3
                    !up,       // up -> index 4
                    !down      // down -> index 5
                ];
                moves.set(cell, allowed);
            }
        }
    }

    return moves;
}
