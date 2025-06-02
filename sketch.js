let width = 800;
let height = 800;

let size = 10;
let cols, rows, grid;

function setup() {
    createCanvas(width, height);
    cols = width / size;
    rows = height / size;
    grid = make2DArray(cols, rows);
}

function draw() {
    background(0);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            noStroke();
            grid[i][j].show(i, j);
        }
    }

    let nextGrid = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 1; j < rows; j++) {
            grid[i][j].update(i, j, grid, nextGrid)
        }
    }

    grid = nextGrid;
}

function mouseDragged() {
    let i = floor(mouseX / size);
    let j = floor(mouseY / size);
    if (i >= 0 && i < cols && j >= 0 && j < rows) {
        grid[i][j].state = 1;
    }
}

function make2DArray(col, row) {
    let arr = new Array(col);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(row);
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = new Cell(0, -1);
        }
    }
    return arr;
}