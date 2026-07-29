# Interactive Maze Game & Algorithm Visualizer

A comprehensive Python-based maze generation and pathfinding visualization tool featuring multiple game modes, algorithm comparisons, and extensive testing frameworks. This project demonstrates advanced software engineering practices including property-based testing, performance benchmarking, and interactive visualizations.

## 🎮 Features

### Three Interactive Game Modes

1. **Play Mode** - Manually navigate through procedurally generated mazes
   - Keyboard-controlled player movement
   - Dynamic maze size selection 
   - Real-time collision detection

2. **Watch Mode** - Visualize pathfinding algorithms in action
   - Step-by-step algorithm execution
   - Color-coded visualization of visited cells, frontier, and final path
   - Adjustable playback speed
   - Six algorithm options: A*, BFS, DFS, Greedy Best-First, Wall Follower, Random Walk

3. **Race Mode** - Compare up to 4 algorithms simultaneously
   - Side-by-side algorithm performance comparison
   - Shared maze for fair testing
   - Real-time metrics and results dashboard
   - Visual representation of algorithm exploration patterns

### Maze Generation Algorithms

- **Depth-First Search (DFS)** - Creates long, winding corridors
- **Prim's Algorithm** - Generates more branching, tree-like structures
- Both algorithms guarantee perfect mazes (one path between any two points)

### Pathfinding Algorithms

#### Optimal Algorithms
- **A\* Search** - Optimal pathfinding with Manhattan distance heuristic
- **Breadth-First Search (BFS)** - Guaranteed shortest path

#### Heuristic Algorithms
- **Depth-First Search (DFS)** - Fast but non-optimal exploration
- **Greedy Best-First Search** - Heuristic-driven, faster but non-optimal
- **Wall Follower** - Right-hand/left-hand rule implementation

#### Stochastic Algorithms
- **Random Walk** - Pure random exploration
- **Random Walk with Backtracking** - Smart random exploration avoiding recent cells

## 🏗️ Architecture

```
Maze/
├── src/
│   ├── logic/              # Core maze and player mechanics
│   │   ├── maze.py         # Maze data structure
│   │   ├── player.py       # Player movement logic
│   │   ├── generator_dfs.py
│   │   └── generator_prims.py
│   ├── generator_solvers/  # Visualization-ready solvers (generators)
│   ├── performance_solvers/# Performance-optimized solvers
│   ├── pygame/             # Game rendering and visualization
│   │   ├── draw_maze.py
│   │   ├── play_mode.py
│   │   ├── watch_mode.py
│   │   └── race_mode.py
│   └── screens/            # UI screens and menus
├── tests/
│   ├── test_logic/         # Unit tests for core logic
│   ├── test_performance/   # Algorithm performance benchmarking
│   ├── test_pygame/        # UI and state transition tests
│   └── stochastic_testing/ # Statistical analysis of random algorithms
└── main.py                 # Application entry point
```

## 🧪 Testing Framework

### Comprehensive Test Suite

1. **Unit Tests** (`tests/test_logic/`)
   - Maze generation validation
   - Player movement mechanics
   - Path existence verification
   - Boundary condition testing

2. **Property-Based Testing** (`test_properties.py`)
   - Hypothesis framework for generative testing
   - Validates maze properties across size ranges (3x3 to 21x21)
   - Tests invariants: reachability, entrance/exit validity, path consistency
   - Ensures randomness and structural integrity

3. **Visual Regression Testing** (`test_maze_snapshot.py`)
   - Snapshot testing with PIL and pygame
   - Pixel-perfect comparison of rendered mazes
   - Validates visual consistency across runs
   - Tests multiple maze sizes and seeds

4. **State Transition Testing** (`test_pygame/`)
   - Game state flow validation
   - Mock-based testing of UI interactions
   - Verifies proper state management across game modes

5. **Performance Benchmarking** (`tests/test_performance/`)
   - Multi-process parallel simulation framework
   - Time and memory profiling using `tracemalloc`
   - CSV data export for analysis
   - Supports maze sizes from 3x3 to 161x161
   - Automated result plotting and comparison

6. **Stochastic Testing** (`tests/stochastic_testing/`)
   - Statistical analysis of random walk algorithms
   - Comparison against optimal BFS solutions
   - Path length distribution analysis
   - Monte Carlo simulations (500+ runs per configuration)

### Test Coverage

The project includes HTML coverage reports in the `htmlcov/` directory, documenting comprehensive test coverage across all modules.

## 🚀 Getting Started

### Prerequisites

```bash
Python 3.8+
pygame
pandas
numpy
hypothesis
pytest
tqdm
Pillow (PIL)
matplotlib (for performance plotting)
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Maze
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

```bash
python main.py
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test modules
pytest tests/test_logic/
pytest tests/test_performance/

# Run with coverage
pytest --cov=src --cov-report=html
```

### Performance Benchmarking

```bash
# Generate performance data
python tests/test_performance/simulate_data.py

# Plot results
python tests/test_performance/plot_results.py
```

## 📊 Performance Analysis

The performance testing framework includes:
- **Parallel Processing**: Utilizes multiple CPU cores for faster benchmarking
- **Memory Profiling**: Tracks peak memory usage per algorithm
- **Time Measurement**: High-precision timing with `time.perf_counter()`
- **Data Export**: CSV format for further analysis
- **Visualization**: Automated plotting of time/memory vs. maze size

## 🎯 Key Technical Highlights

- **State Machine Architecture**: Clean separation of game states with proper transitions
- **Generator Pattern**: Solvers implemented as Python generators for step-by-step visualization
- **Modular Design**: Clear separation between logic, rendering, and testing
- **Type Safety**: Consistent use of position tuples `(row, col)` throughout codebase
- **Performance Optimization**: Separate solver implementations for visualization vs. benchmarking
- **Extensive Documentation**: Comprehensive docstrings and inline comments

## 🔍 Algorithm Details

### A* Search
- **Optimality**: Yes (with admissible heuristic)
- **Time Complexity**: O(b^d) where b is branching factor, d is depth
- **Space Complexity**: O(b^d)
- **Use Case**: When shortest path is required

### BFS
- **Optimality**: Yes
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Use Case**: Unweighted shortest path

### DFS
- **Optimality**: No
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Use Case**: Fast exploration, memory-constrained

### Wall Follower
- **Optimality**: No
- **Guarantee**: Works for simply-connected mazes
- **Use Case**: Maze-specific approach, real-world robot navigation

## 👨‍💻 Author

Josh Dinn
