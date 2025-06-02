
class Cell {
    constructor(state, material) {
        this.state = state;
        this.material = material;
    }

    show(i, j) {
        if (this.state === 1) {
            fill(255, 0, 0); // sabbia
        } else {
            fill(0);
        }
        square(i * size, j * size, size);
    }

    update(i, j, grid, nextGrid) {
        let state = this.state;

        if (state === 1) { // sabbia
            let below = (j + 1 < rows) ? grid[i][j + 1].state : 1;
            let belowL = (i - 1 >= 0 && j + 1 < rows) ? grid[i - 1][j + 1].state : 1;
            let belowR = (i + 1 < cols && j + 1 < rows) ? grid[i + 1][j + 1].state : 1;

            if (below === 0) {
                nextGrid[i][j + 1].state = state;
                return;
            }
            if (belowL === 0 && belowR === 0) {
                let dir = random([-1, 1]);
                nextGrid[i + dir][j + 1].state = state;
                return;
            }
            if (belowL === 0) {
                nextGrid[i - 1][j + 1].state = state;
                return;
            }
            if (belowR === 0) {
                nextGrid[i + 1][j + 1].state = state;
                return;
            }

            nextGrid[i][j].state = state;
        }
    }
}