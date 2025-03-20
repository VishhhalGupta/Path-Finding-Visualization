// Create grid and initialize nodes
const grid = document.getElementById("grid");
const rows = 20;
const cols = 20;

let startNode = null;
let endNode = null;
let walls = [];
let path = [];
let drawWalls = false;

// Node Class
class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.g = Infinity;
        this.h = 0;
        this.f = Infinity;
        this.previous = null;
    }
}

// Create a 2D grid of nodes
let nodes = [];
for (let row = 0; row < rows; row++) {
    nodes[row] = [];
    for (let col = 0; col < cols; col++) {
        nodes[row][col] = new Node(row, col);
    }
}

// Generate the grid in the HTML
function createGrid() {
    grid.innerHTML = ""; // Clear the grid if it already exists
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const nodeDiv = document.createElement("div");
            nodeDiv.classList.add("node");
            nodeDiv.dataset.row = row;
            nodeDiv.dataset.col = col;
            nodeDiv.addEventListener("mousedown", handleNodeClick);
            nodeDiv.addEventListener("mouseover", handleNodeHover); // For drawing walls
            nodeDiv.addEventListener("mouseup", () => {
                isDragging = false;
            });
            grid.appendChild(nodeDiv);
        }
    }
}

let isDragging = false; // Flag to track mouse drag

// Handle user click/drag on nodes
function handleNodeClick(event) {
    if (drawWalls) {
        isDragging = true;
        handleNodeHover(event); // Treat initial click as a hover
    } else {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const node = nodes[row][col];
        const nodeDiv = event.target;

        if (!startNode) {
            startNode = node;
            nodeDiv.classList.add("start");
            node.isStart = true;
        } else if (!endNode && node !== startNode) {
            endNode = node;
            nodeDiv.classList.add("end");
            node.isEnd = true;
        }
    }
}

function handleNodeHover(event) {
    if (drawWalls && isDragging) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const node = nodes[row][col];
        const nodeDiv = event.target;

        if (node !== startNode && node !== endNode && !node.isWall) {
            node.isWall = true;
            nodeDiv.classList.add("wall");
            walls.push(node);
        }
    }
}

// Clear the path from the grid
function clearPath() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const node = nodes[row][col];
            const nodeDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            node.g = Infinity;
            node.h = 0;
            node.f = Infinity;
            node.previous = null;
            nodeDiv.classList.remove("path");  //Remove path class
        }
    }
    path = []; // Clear the path array
}

// Clear all the walls from the grid
function clearWalls() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const node = nodes[row][col];
            const nodeDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (node.isWall) {
                node.isWall = false;
                nodeDiv.classList.remove("wall");
                const index = walls.findIndex(w => w.row === node.row && w.col === node.col);
                if (index > -1) {
                    walls.splice(index, 1);
                }
            }
        }
    }
}

// Generate a random maze on the grid (Recursive Backtracker)
function generateMaze() {
    clearWalls(); // Clear any existing walls
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false)); // Keep track of visited nodes
    const stack = [];
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);
    let currentRow = startRow;
    let currentCol = startCol;
    visited[currentRow][currentCol] = true;
    stack.push({ row: currentRow, col: currentCol });

    while (stack.length > 0) {
        ({ row: currentRow, col: currentCol } = stack[stack.length - 1]);

        const neighbors = getUnvisitedNeighbors(currentRow, currentCol, visited);

        if (neighbors.length > 0) {
            const { row: nextRow, col: nextCol, wallRow, wallCol } = neighbors[Math.floor(Math.random() * neighbors.length)];
            const wallNode = nodes[wallRow][wallCol];
            const wallDiv = document.querySelector(`[data-row="${wallRow}"][data-col="${wallCol}"]`);

            if (!wallNode.isWall) {
                wallNode.isWall = true;
                wallDiv.classList.add("wall");
                walls.push(wallNode);
            }

            currentRow = nextRow;
            currentCol = nextCol;
            visited[currentRow][currentCol] = true;
            stack.push({ row: currentRow, col: currentCol });
        } else {
            stack.pop();
        }
    }
}

// Get unvisited neighbors for maze generation
function getUnvisitedNeighbors(row, col, visited) {
    const neighbors = [];
    const directions = [[-1, 0, row - 1, col], [1, 0, row + 1, col], [0, -1, row, col - 1], [0, 1, row, col + 1]];

    for (let [dx, dy, neighborRow, neighborCol] of directions) {
        if (neighborRow > 0 && neighborRow < rows - 1 && neighborCol > 0 && neighborCol < cols - 1 && !visited[neighborRow][neighborCol]) {
            neighbors.push({ row: neighborRow, col: neighborCol, wallRow: row + dx, wallCol: col + dy });
            visited[neighborRow][neighborCol] = true; //Mark the neighbour as visited right away
        }
    }
    return neighbors;
}

// A* algorithm
function aStar() {
    if (!startNode || !endNode) {
        alert("Please select a start and end node.");
        return;
    }

    const openSet = [startNode];
    startNode.g = 0;
    startNode.h = heuristic(startNode, endNode);
    startNode.f = startNode.h;

    const closedSet = new Set();

    while (openSet.length > 0) {
        // Find the node in openSet with the lowest f value
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        const currentNode = openSet[lowestIndex];

        // If we reach the end node, reconstruct the path
        if (currentNode === endNode) {
            reconstructPath();
            return;
        }

        openSet.splice(lowestIndex, 1);  // Remove current node from openSet
        closedSet.add(currentNode);         // Add current node to closedSet

        const neighbors = getNeighbors(currentNode);
        for (let neighbor of neighbors) {
            if (closedSet.has(neighbor) || neighbor.isWall) {
                continue;
            }

            const tentativeG = currentNode.g + 1;

            if (!openSet.includes(neighbor) || tentativeG < neighbor.g) {
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = currentNode;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    alert("No path found!");
}

// Heuristic function for A* (Manhattan Distance)
function heuristic(node, endNode) {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}

// Get neighbors of a node (4-directional)
function getNeighbors(node) {
    const neighbors = [];
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
    ];

    for (let [dx, dy] of directions) {
        const newRow = node.row + dx;
        const newCol = node.col + dy;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            neighbors.push(nodes[newRow][newCol]);
        }
    }

    return neighbors;
}

// Reconstruct the path from endNode to startNode
function reconstructPath() {
    let currentNode = endNode;

    while (currentNode) {
        const nodeDiv = document.querySelector(`[data-row="${currentNode.row}"][data-col="${currentNode.col}"]`);
        nodeDiv.classList.add("path");
        path.push(currentNode);
        currentNode = currentNode.previous;
    }
}

// Reset the grid (clear walls and path)
function resetGrid() {
    startNode = null;
    endNode = null;
    walls = [];
    path = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const node = nodes[row][col];
            node.g = Infinity;
            node.h = 0;
            node.f = Infinity;
            node.previous = null;
            node.isWall = false;
            node.isStart = false;
            node.isEnd = false;
            const nodeDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            nodeDiv.classList.remove("wall", "start", "end", "path");
        }
    }
}

// Button Event Listeners
document.getElementById("startBtn").addEventListener("click", startPathfinding);
document.getElementById("resetBtn").addEventListener("click", resetGrid);
document.getElementById("clearWallsBtn").addEventListener("click", clearWalls);
document.getElementById("mazeBtn").addEventListener("click", generateMaze);

// Toggle draw walls mode
document.getElementById("drawWallsToggle").addEventListener("change", (event) => {
    drawWalls = event.target.checked;
});

// Start Pathfinding
function startPathfinding() {
    clearPath(); // Clear only the path, keep walls
    if (startNode && endNode) {
        aStar();
    } else {
        alert("Please set both start and end nodes.");
    }
}

// Initialize the grid
createGrid();
