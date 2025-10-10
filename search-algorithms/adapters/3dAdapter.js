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
            down: 5
        };
    
        const NDIRECTIONS = Object.keys(Moves).length;
    
        // Convertir startPosition a array si es un objeto Cell
        let startArray;
        if (Array.isArray(startPosition)) {
            startArray = startPosition;
        } else {
            // Es un objeto Cell
            startArray = [startPosition.floor, startPosition.row, startPosition.col];
        }
    
        const root = new Node(problem[startArray[0]][startArray[1]][startArray[2]]);
        const first = [root, startArray[0], startArray[1], startArray[2]];
       
        const neighborStack = [];
        neighborStack.push(first);
    
        const visited = new Set();
        
        while(neighborStack.length > 0) {
            const next = neighborStack.shift();
            
            const currNode = next[0];
            const currNodeLevel = next[1];        
            const currNodeRow = next[2];
            const currNodeCol = next[3];
           
            if (!visited.has(currNode.value)) {
                const currentCell = problem[currNodeLevel][currNodeRow][currNodeCol];
                
                // Left: verificar límites Y movimiento válido
                if(currNodeCol > 0 && map.get(currentCell)[Moves.left]) {
                    currNode.addChildren(problem[currNodeLevel][currNodeRow][currNodeCol-1]);
                    if (!visited.has(problem[currNodeLevel][currNodeRow][currNodeCol-1])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow, currNodeCol-1]);
                    }
                }
                
                // Right: verificar límites Y movimiento válido
                if(currNodeCol < problem[0][0].length - 1 && map.get(currentCell)[Moves.right]) {
                    currNode.addChildren(problem[currNodeLevel][currNodeRow][currNodeCol+1]);
                    if (!visited.has(problem[currNodeLevel][currNodeRow][currNodeCol+1])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow, currNodeCol+1]);
                    }
                } 
                
                // Backward: verificar límites Y movimiento válido
                if(currNodeRow < problem[0].length - 1 && map.get(currentCell)[Moves.backward]) {
                    currNode.addChildren(problem[currNodeLevel][currNodeRow+1][currNodeCol]);
                    if (!visited.has(problem[currNodeLevel][currNodeRow+1][currNodeCol])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow+1, currNodeCol]);
                    }
                } 
                
                // Forward: verificar límites Y movimiento válido  
                if (currNodeRow > 0 && map.get(currentCell)[Moves.forward]) {
                    currNode.addChildren(problem[currNodeLevel][currNodeRow-1][currNodeCol]);
                    if (!visited.has(problem[currNodeLevel][currNodeRow-1][currNodeCol])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel, currNodeRow-1, currNodeCol]);
                    }
                } 
                
                // Up: verificar límites Y movimiento válido
                if (currNodeLevel < problem.length - 1 && map.get(currentCell)[Moves.up]) {
                    currNode.addChildren(problem[currNodeLevel+1][currNodeRow][currNodeCol]);
                    if (!visited.has(problem[currNodeLevel+1][currNodeRow][currNodeCol])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel+1, currNodeRow, currNodeCol]);
                    }
                } 
                
                // Down: verificar límites Y movimiento válido
                if (currNodeLevel > 0 && map.get(currentCell)[Moves.down]) {
                    currNode.addChildren(problem[currNodeLevel-1][currNodeRow][currNodeCol]);
                    if (!visited.has(problem[currNodeLevel-1][currNodeRow][currNodeCol])) {
                        neighborStack.push([currNode.children[currNode.children.length-1], currNodeLevel-1, currNodeRow, currNodeCol]);
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

export default Adapter3D;