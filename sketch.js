let size = 10;
let cols, rows, grid;
let paused = false;
let currentPattern = 'random';
let density = 30;

function setup() {
    // Setup will be called after user clicks start
    setupEventListeners();
}

function draw() {
    if (!grid) return;

    background(0);

    // Draw the grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show(i, j);
        }
    }

    if (paused) return;

    // Compute next generation
    let nextGrid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].update(i, j, grid, nextGrid);
        }
    }

    grid = nextGrid;
}

function startSimulation(pattern) {
    // Get settings from UI
    size = parseInt(document.getElementById('cell-size').value);
    density = parseInt(document.getElementById('density').value);
    currentPattern = pattern;

    // Hide start screen, show simulation
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('simulation-screen').style.display = 'block';

    // Create canvas
    const container = document.getElementById('canvas-container');
    // Usa le dimensioni REALI del container
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Calculate grid dimensions
    cols = floor(width / size);
    rows = floor(height / size);

    // Create grid
    grid = make2DArray(cols, rows);

    // Initialize based on pattern
    if (currentPattern === 'random') {
        initializeRandomGrid();
    } else {
        placePattern(currentPattern);
    }

    frameRate(10);
}

function initializeRandomGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].state = random(100) < density ? 1 : 0;
        }
    }
}

function placePattern(patternName) {
    // Clear grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].state = 0;
        }
    }

    const pattern = Patterns.getPattern(patternName);
    if (!pattern) return;

    const patternWidth = pattern[0].length;
    const patternHeight = pattern.length;

    // Calculate center position
    const startX = floor((cols - patternWidth) / 2);
    const startY = floor((rows - patternHeight) / 2);

    // Place pattern
    for (let y = 0; y < patternHeight; y++) {
        for (let x = 0; x < patternWidth; x++) {
            const posX = startX + x;
            const posY = startY + y;

            if (posX >= 0 && posX < cols && posY >= 0 && posY < rows) {
                grid[posX][posY].state = pattern[y][x];
            }
        }
    }
}

function setupEventListeners() {
    // Pattern buttons
    document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Start button
    document.getElementById('start-btn').addEventListener('click', () => {
        const selectedPattern = document.querySelector('.pattern-btn.active')?.dataset.pattern || 'random';
        startSimulation(selectedPattern);
    });

    // Control buttons
    document.getElementById('pause-btn').addEventListener('click', () => {
        paused = !paused;
        document.getElementById('pause-btn').textContent = paused ? 'RIPRENDI' : 'PAUSA';
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        if (currentPattern === 'random') {
            initializeRandomGrid();
        } else {
            placePattern(currentPattern);
        }
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        document.getElementById('simulation-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.remove();
        grid = null;
    });

    // Dopo gli eventi click
    document.getElementById('start-btn').addEventListener('touchend', handleStart);
    document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.addEventListener('touchend', handlePattern);
    });

    // Aggiungi prevenzione dello scroll
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('touchstart', e => e.preventDefault());
    });

    // Sliders
    document.getElementById('cell-size').addEventListener('input', (e) => {
        document.getElementById('cell-size-value').textContent = e.target.value;
    });

    document.getElementById('density').addEventListener('input', (e) => {
        document.getElementById('density-value').textContent = e.target.value;
    });

    // Window resize
    window.addEventListener('resize', () => {
        if (grid) {
            const container = document.getElementById('canvas-container');
            resizeCanvas(container.clientWidth, container.clientHeight);

            // Calcola nuove dimensioni BASATE sul container
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            cols = floor(newWidth / size);
            rows = floor(newHeight / size);

            const newGrid = make2DArray(cols, rows);

            // Copy existing grid state
            for (let i = 0; i < min(cols, grid.length); i++) {
                for (let j = 0; j < min(rows, grid[0].length); j++) {
                    newGrid[i][j].state = grid[i][j].state;
                }
            }

            grid = newGrid;
            redraw();
        }
    });
}

function make2DArray(col, row) {
    let arr = new Array(col);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(row);
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = new Cell(0);
        }
    }
    return arr;
}