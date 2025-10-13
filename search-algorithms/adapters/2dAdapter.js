import Node from "./../node.js";

//This class converts the 2D array into a node tree

class Adapter2D {
    static adapt(problem, startPosition, map) {
        // Moves order matches other adapters: left,right,forward,backward
        const Moves = {
            left: 0,
            right: 1,
            forward: 2,
            backward: 3,
        };

        // startPosition expected as [floor, row, col] but for 2D floor is 0
        const floor = startPosition[0] || 0;
        const rootKey = `${floor},${startPosition[1]},${startPosition[2]}`;
        const root = new Node(rootKey);
        const first = [root, startPosition[1], startPosition[2]];

        const neighborStack = [];
        neighborStack.push(first);

        const visited = new Set();

        while (neighborStack.length > 0) {
            const next = neighborStack.shift();
            const currNode = next[0];
            const currNodeRow = next[1];
            const currNodeCol = next[2];

            if (!visited.has(currNode.value)) {
                const cell = problem[0][currNodeRow][currNodeCol];
                const cellMoves = map.get(cell) || [];

                // left
                if (cellMoves[Moves.left]) {
                    const childKey = `${floor},${currNodeRow},${currNodeCol - 1}`;
                    currNode.addChildren(childKey);
                    if (!visited.has(childKey)) {
                        neighborStack.push([currNode.children[currNode.children.length - 1], currNodeRow, currNodeCol - 1]);
                    }
                }

                // right
                if (cellMoves[Moves.right]) {
                    const childKey = `${floor},${currNodeRow},${currNodeCol + 1}`;
                    currNode.addChildren(childKey);
                    if (!visited.has(childKey)) {
                        neighborStack.push([currNode.children[currNode.children.length - 1], currNodeRow, currNodeCol + 1]);
                    }
                }

                // backward (row + 1)
                if (cellMoves[Moves.backward]) {
                    const childKey = `${floor},${currNodeRow + 1},${currNodeCol}`;
                    currNode.addChildren(childKey);
                    if (!visited.has(childKey)) {
                        neighborStack.push([currNode.children[currNode.children.length - 1], currNodeRow + 1, currNodeCol]);
                    }
                }

                // forward (row - 1)
                if (cellMoves[Moves.forward]) {
                    const childKey = `${floor},${currNodeRow - 1},${currNodeCol}`;
                    currNode.addChildren(childKey);
                    if (!visited.has(childKey)) {
                        neighborStack.push([currNode.children[currNode.children.length - 1], currNodeRow - 1, currNodeCol]);
                    }
                }

                visited.add(currNode.value);
            }
        }

        return root;
    }

    constructor() {
        throw new Error('This class only provides functions');
    }
}

export default Adapter2D;