import Node from "./../node.js";

//This class converts the 2D array into a node tree

class Adapter2D {
    static adapt(problem, startPosition, map) {
        const Moves = {
            left: 0,
            right: 1,
            forward: 2,
            backward: 3,
        };

        const NDIRECTIONS = Object.keys(Moves).length;

        const root = new Node(problem[0][startPosition[1]][startPosition[2]]);
        const first = [root, startPosition[1], startPosition[2]];

        const neighborStack = [];
        neighborStack.push(first);

        const visited = new Set();
        
        while(neighborStack.length > 0) {
            
            const next = neighborStack.shift();
            const currNode = next[0];
            
            const currNodeRow = next[1];
            const currNodeCol = next[2];
            //left, right, forward, backward, up, down
            if (!visited.has(currNode.value)) {    
                if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.left]) {
                    currNode.addChildren(problem[0][currNodeRow][currNodeCol-1]);
                    if (!visited.has(problem[0][currNodeRow][currNodeCol-1])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow, currNodeCol-1]);
                    }
                }
                if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.right]) {
                    currNode.addChildren(problem[0][currNodeRow][currNodeCol+1]);
                    if (!visited.has(problem[0][currNodeRow][currNodeCol+1])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow, currNodeCol+1]);
                    }
                } 
                if(map.get(problem[0][currNodeRow][currNodeCol])[Moves.backward]) {
                    currNode.addChildren(problem[0][currNodeRow+1][currNodeCol]);
                    if (!visited.has(problem[0][currNodeRow+1][currNodeCol])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow+1, currNodeCol]);
                    }
                } 
                if (map.get(problem[0][currNodeRow][currNodeCol])[Moves.forward]) {
                    currNode.addChildren(problem[0][currNodeRow-1][currNodeCol]);
                    if (!visited.has(problem[0][currNodeRow-1][currNodeCol])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeRow-1, currNodeCol]);
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