import Node from "./../node.js";

//This class converts a 3d Array in a node tree.

            class Adapter3D {
                static adapt(problem, startPosition, map) {
                    const Moves = {
                        left: 0,
                        right: 1,
                        forward: 2,
                        backward: 3,
                        up: 4,
                        down: 5,
                    };

                    // startPosition is expected as an array: [floor, row, col]
                    const rootKey = `${startPosition[0]},${startPosition[1]},${startPosition[2]}`;
                    const root = new Node(rootKey);
                    const first = [root, startPosition[0], startPosition[1], startPosition[2]];

                    const neighborStack = [];
                    neighborStack.push(first);

                    const visited = new Set();

                    while (neighborStack.length > 0) {
                        const next = neighborStack.shift();
                        const currNode = next[0];
                        const currNodeLevel = next[1];
                        const currNodeRow = next[2];
                        const currNodeCol = next[3];

                        if (!visited.has(currNode.value)) {
                            const cell = problem[currNodeLevel][currNodeRow][currNodeCol];
                            const cellMoves = map.get(cell) || [];

                            // left
                            if (cellMoves[Moves.left]) {
                                const childKey = `${currNodeLevel},${currNodeRow},${currNodeCol - 1}`;
                                currNode.addChildren(childKey);
                                if (!visited.has(childKey)) {
                                    neighborStack.push([currNode.children[currNode.children.length - 1], currNodeLevel, currNodeRow, currNodeCol - 1]);
                                }
                            }

                            // right
                            if (cellMoves[Moves.right]) {
                                const childKey = `${currNodeLevel},${currNodeRow},${currNodeCol + 1}`;
                                currNode.addChildren(childKey);
                                if (!visited.has(childKey)) {
                                    neighborStack.push([currNode.children[currNode.children.length - 1], currNodeLevel, currNodeRow, currNodeCol + 1]);
                                }
                            }

                            // backward (row + 1)
                            if (cellMoves[Moves.backward]) {
                                const childKey = `${currNodeLevel},${currNodeRow + 1},${currNodeCol}`;
                                currNode.addChildren(childKey);
                                if (!visited.has(childKey)) {
                                    neighborStack.push([currNode.children[currNode.children.length - 1], currNodeLevel, currNodeRow + 1, currNodeCol]);
                                }
                            }

                            // forward (row - 1)
                            if (cellMoves[Moves.forward]) {
                                const childKey = `${currNodeLevel},${currNodeRow - 1},${currNodeCol}`;
                                currNode.addChildren(childKey);
                                if (!visited.has(childKey)) {
                                    neighborStack.push([currNode.children[currNode.children.length - 1], currNodeLevel, currNodeRow - 1, currNodeCol]);
                                }
                            }

                            // up (level + 1)
                            if (cellMoves[Moves.up]) {
                                const childKey = `${currNodeLevel + 1},${currNodeRow},${currNodeCol}`;
                                currNode.addChildren(childKey);
                                if (!visited.has(childKey)) {
                                    neighborStack.push([currNode.children[currNode.children.length - 1], currNodeLevel + 1, currNodeRow, currNodeCol]);
                                }
                            }

                            // down (level - 1)
                            if (cellMoves[Moves.down]) {
                                const childKey = `${currNodeLevel - 1},${currNodeRow},${currNodeCol}`;
                                currNode.addChildren(childKey);
                                if (!visited.has(childKey)) {
                                    neighborStack.push([currNode.children[currNode.children.length - 1], currNodeLevel - 1, currNodeRow, currNodeCol]);
                                }
                            }

                            visited.add(currNode.value);
                        }
                    }

                    return root;
                }

                constructor() {
                    throw new Error("This class only provides functions");
                }
            }

            export default Adapter3D;