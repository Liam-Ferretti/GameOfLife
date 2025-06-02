const width = 1080;
const height = 2400;
const size = 10;
const cols = Math.floor(width / size);
const rows = Math.floor(height / size);
const frameRateValue = 10;
const randomThreshold = 0.7;

let liveCells = new Set();
let paused = false;

function setup() {
    createCanvas(width, height);
    frameRate(frameRateValue);
    randomizeLiveCells();
}

function draw() {
    background(0);

    // Disegna solo le celle vive
    for (const key of liveCells) {
        const [x, y] = key.split(',').map(Number);
        noStroke();
        fill(255);
        square(x * size, y * size, size);
    }

    if (paused) return;

    const neighborCounts = new Map();

    // Conta i vicini di tutte le celle vive
    for (const key of liveCells) {
        const [x, y] = key.split(',').map(Number);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = (x + dx + cols) % cols;
                const ny = (y + dy + rows) % rows;
                const nKey = `${nx},${ny}`;

                if (dx !== 0 || dy !== 0) {
                    neighborCounts.set(nKey, (neighborCounts.get(nKey) || 0) + 1);
                }
            }
        }
    }

    const newLiveCells = new Set();

    for (const [key, count] of neighborCounts.entries()) {
        const alive = liveCells.has(key);
        if ((alive && (count === 2 || count === 3)) || (!alive && count === 3)) {
            newLiveCells.add(key);
        }
    }

    liveCells = newLiveCells;
}

function keyPressed() {
    if (key === ' ') {
        paused = !paused;
    } else if (key === 'r') {
        randomizeLiveCells();
    } else if (key === 'c') {
        liveCells.clear();
    }
}

function randomizeLiveCells() {
    liveCells.clear();
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (random() > randomThreshold) {
                liveCells.add(`${x},${y}`);
            }
        }
    }
}
