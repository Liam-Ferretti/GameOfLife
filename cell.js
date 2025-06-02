class Cell {
    constructor(state) {
        this.state = state; // 1 for alive, 0 for dead
    }

    show(i, j) {
        if (this.state === 1) {
            fill(255); // WHITE
        } else {
            fill(0);
        }
        square(i * size, j * size, size);
    }

    countNeighbors(grid, x, y) {
        let sum = 0;
        const cols = grid.length;
        const rows = grid[0].length;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const col = (x + i + cols) % cols;
                const row = (y + j + rows) % rows;
                sum += grid[col][row].state;
            }
        }
        return sum;
    }

    update(i, j, grid, nextGrid) {
        const neighbors = this.countNeighbors(grid, i, j);
        
        if (this.state === 1) {
            nextGrid[i][j].state = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
            nextGrid[i][j].state = (neighbors === 3) ? 1 : 0;
        }
    }
}