# Pathfinding Visualization

This project visualizes the A\* pathfinding algorithm on a grid. You can create walls, set a start and end point, and watch the algorithm find the shortest path between them!

## What is Pathfinding?

Pathfinding is like finding the best route on a map. Imagine you want to go from your house to the grocery store. There might be many ways to get there, but you want the shortest or fastest one. Pathfinding algorithms help computers solve this same problem, whether it's for a GPS, a video game character finding its way through a level, or a robot navigating a warehouse.

## How This Project Works

This visualization uses the A\* (A-star) algorithm, which is a popular and efficient way to find the shortest path. Here's how it works in simple terms:

1.  **The Grid:** The screen is divided into a grid of squares (nodes).
2.  **Start and End:** You pick a starting point (green) and an ending point (red).
3.  **Walls:** You can create obstacles (walls) that the path must avoid.
4.  **The Search:**
    - The algorithm explores possible paths, step by step.
    - It keeps track of the "cost" of each path (how long it is).
    - It uses a "heuristic" (a smart guess) to estimate how far away the end point is. This helps it prioritize paths that seem promising.
5.  **The Path:** The algorithm finds the path with the lowest cost that avoids all the walls. The path is highlighted in light blue.

## Using the Visualization

1.  **Open `index.html`** in your web browser.
2.  **Set the Start Node:** Click on any empty square to set the starting point (it will turn green).
3.  **Set the End Node:** Click on another empty square to set the ending point (it will turn red).
4.  **Create Walls:** Click on other squares to create walls (they will turn black). Click on a wall again to remove it.
5.  **Start Pathfinding:** Click the "Start Pathfinding" button. The algorithm will find the shortest path (if one exists) and highlight it in light blue.
6.  **Reset the Grid:** Click the "Reset Grid" button to clear the grid and start over. This will remove the path, walls, start, and end points.

## Code Overview

The project consists of these main parts:

- **`index.html`:** This file sets up the basic structure of the webpage, including the grid, buttons, and links to the CSS and JavaScript files.
- **`style.css`:** This file controls the appearance of the grid, nodes, walls, start and end points, and the path.
- **`script.js`:** This file contains the core logic of the project:
  - **`Node` Class:** Represents a single square on the grid. Stores information like its row, column, whether it's a wall, and its cost for pathfinding.
  - **`createGrid()`:** Creates the grid of nodes in the HTML.
  - **`handleNodeClick()`:** Handles what happens when you click on a square (setting start/end, creating walls).
  - **`aStar()`:** Implements the A\* pathfinding algorithm.
  - **`heuristic()`:** Calculates the estimated distance between two nodes (used by A\*).
  - **`getNeighbors()`:** Finds the valid neighboring nodes for a given node.
  - **`reconstructPath()`:** Traces back from the end node to the start node to build the shortest path.
  - **`clearGrid()`:** Resets the grid, removing walls and the path.
  - **`resetGrid()`:** Clears everything, including start and end points.
  - **`startPathfinding()`:** Initiates the A\* algorithm.

## Key Concepts

- **A\* Algorithm:** A search algorithm that balances the actual cost of a path with a heuristic (estimated) cost to find the optimal solution.
- **Heuristic Function:** An estimate of how far away the goal is. A good heuristic helps the algorithm explore promising paths first.
- **Grid-Based Pathfinding:** Representing the search space as a grid, where each cell is a node.

## Customization

You can customize this project by:

- **Changing the grid size:** Modify the `rows` and `cols` variables in `script.js`.
- **Adjusting the heuristic:** Experiment with different heuristic functions in the `heuristic()` function to see how they affect the algorithm's performance.
- **Adding different movement costs:** Instead of each step having a cost of 1, you could make diagonal moves more expensive.
- **Implementing different pathfinding algorithms:** Try implementing Dijkstra's algorithm or other pathfinding techniques.

## Contributing

Feel free to contribute to this project by submitting pull requests with bug fixes, improvements, or new features!
