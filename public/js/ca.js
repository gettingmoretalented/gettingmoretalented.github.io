const canvas = document.getElementById('ca-canvas');
if (!canvas) {
    console.log('CA canvas not found');
} else {
    const ctx = canvas.getContext('2d');
    const cellSize = 12;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);
    let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    // Simple representation of "gmt" in a bitmask
    const gmtMask = [
        //[0, 0,0,0,0, 0, 0,0,0,0,0, 0, 0,0,0,0, 0],
        [0, 1,1,1,1, 0, 1,0,0,0,1, 0, 0,1,0,0, 0],
        [0, 1,0,0,1, 0, 1,1,0,1,1, 0, 1,1,1,1, 0],
        [0, 1,1,1,1, 0, 1,0,1,0,1, 0, 0,1,0,0, 0],
        [0, 0,0,0,1, 0, 1,0,0,0,1, 0, 1,0,0,1, 0],
        [0, 1,1,1,1, 0, 1,0,0,0,1, 0, 0,1,1,0, 0],
        //[0, 0,0,0,0, 0, 0,0,0,0,0, 0, 0,0,0,0, 0],

    ];
    function seed() {
        // Seed the "gmt" pattern in the center
        const startRow = Math.floor(rows / 2) - 2;
        const startCol = Math.floor(cols / 2) - 6;
        
        for (let r = 0; r < gmtMask.length; r++) {
            for (let c = 0; c < gmtMask[0].length; c++) {
              // Only plant cells where the mask has a 1 (draw the letters)
              if (gmtMask[r][c] && startRow + r >= 0 && startRow + r < rows && startCol + c >= 0 && startCol + c < cols) {
              // seed with a slightly higher state so the letters stand out
              grid[startRow + r][startCol + c] = 64; 
                }
            }
        }
        // Add some random seeds for the "loop" effect
        //for (let i = 0; i < 20; i++) {
        //    grid[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)] = Math.floor(Math.random() * 10);
        //}
    }
    function update() {
        let nextGrid = grid.map(row => [...row]);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const state = grid[r][c];
                const neighbors = getNeighbors(r, c);
                
                // Simplified CA rule mimicking loop-like growth
                if (state === 0 && neighbors.filter(n => n > 0).length === 1) {
                    nextGrid[r][c] = (state + 1) % 10;
                } else if (state > 0) {
                    nextGrid[r][c] = (state + 1) % 10;
                }
            }
        }
        grid = nextGrid;
    }
    function getNeighbors(r, c) {
        const neighbors = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const nr = r + i;
                const nc = c + j;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    neighbors.push(grid[nr][nc]);
                }
            }
        }
        return neighbors;
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] > 0) {
                    ctx.fillStyle = `hsl(${grid[r][c] * 36}, 25%, 50%, 0.05)`;
                    ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                }
            }
        }
    }
    function loop() {
        draw();
        update(); 
        setTimeout(loop, 100);
    }
    seed();
    loop();
}
