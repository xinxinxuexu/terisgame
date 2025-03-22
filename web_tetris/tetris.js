const BLOCK_SIZE = 30;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

const SHAPES = [
    [[1, 1, 1, 1]],  // I
    [[1, 1], [1, 1]],  // O
    [[1, 1, 1], [0, 1, 0]],  // T
    [[1, 1, 1], [1, 0, 0]],  // L
    [[1, 1, 1], [0, 0, 1]],  // J
    [[1, 1, 0], [0, 1, 1]],  // S
    [[0, 1, 1], [1, 1, 0]]   // Z
];

const COLORS = [
    '#00ffff',  // cyan
    '#ffff00',  // yellow
    '#ff00ff',  // magenta
    '#ffa500',  // orange
    '#0000ff',  // blue
    '#00ff00',  // green
    '#ff0000'   // red
];

class Tetris {
    constructor() {
        this.canvas = document.getElementById('tetris');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.width = BLOCK_SIZE * GRID_WIDTH;
        this.canvas.height = BLOCK_SIZE * GRID_HEIGHT;
        
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        
        this.reset();
        this.initializeControls();
        this.gameLoop();
    }

    reset() {
        this.grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.createNewPiece();
        this.updateScore();
        this.lastDrop = Date.now();
    }

    createNewPiece() {
        const shapeIndex = Math.floor(Math.random() * SHAPES.length);
        this.currentPiece = {
            shape: SHAPES[shapeIndex],
            color: COLORS[shapeIndex],
            x: Math.floor(GRID_WIDTH / 2) - Math.floor(SHAPES[shapeIndex][0].length / 2),
            y: 0
        };
    }

    initializeControls() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            if (this.gameOver) {
                if (event.key === 'Enter') {
                    this.reset();
                }
                return;
            }

            switch (event.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    this.dropPiece();
                    break;
            }
        });

        // Mobile controls
        const addMobileControl = (id, action) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (!this.gameOver) action();
                });
                button.addEventListener('mousedown', () => {
                    if (!this.gameOver) action();
                });
            }
        };

        addMobileControl('left', () => this.movePiece(-1, 0));
        addMobileControl('right', () => this.movePiece(1, 0));
        addMobileControl('down', () => this.movePiece(0, 1));
        addMobileControl('rotate', () => this.rotatePiece());
        addMobileControl('drop', () => this.dropPiece());
    }

    isValidMove(piece, offsetX, offsetY) {
        return piece.shape.every((row, dy) =>
            row.every((value, dx) => {
                if (!value) return true;
                const newX = piece.x + dx + offsetX;
                const newY = piece.y + dy + offsetY;
                return (
                    newX >= 0 &&
                    newX < GRID_WIDTH &&
                    newY < GRID_HEIGHT &&
                    (newY < 0 || !this.grid[newY][newX])
                );
            })
        );
    }

    movePiece(dx, dy) {
        if (this.isValidMove(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            return true;
        }
        return false;
    }

    rotatePiece() {
        const rotated = {
            ...this.currentPiece,
            shape: this.currentPiece.shape[0].map((_, i) =>
                this.currentPiece.shape.map(row => row[row.length - 1 - i])
            )
        };
        
        if (this.isValidMove(rotated, 0, 0)) {
            this.currentPiece.shape = rotated.shape;
        }
    }

    dropPiece() {
        while (this.movePiece(0, 1));
        this.mergePiece();
    }

    mergePiece() {
        this.currentPiece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) {
                    const y = this.currentPiece.y + dy;
                    if (y >= 0) {
                        this.grid[y][this.currentPiece.x + dx] = this.currentPiece.color;
                    }
                }
            });
        });

        this.clearLines();
        this.createNewPiece();

        if (!this.isValidMove(this.currentPiece, 0, 0)) {
            this.gameOver = true;
        }
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(GRID_WIDTH).fill(0));
                linesCleared++;
                y++;
            }
        }

        if (linesCleared > 0) {
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.score / 1000) + 1;
            this.updateScore();
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
    }

    draw() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the grid
        this.grid.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color) {
                    this.drawBlock(x, y, color);
                }
            });
        });

        // Draw the current piece
        if (!this.gameOver) {
            this.currentPiece.shape.forEach((row, dy) => {
                row.forEach((value, dx) => {
                    if (value) {
                        this.drawBlock(
                            this.currentPiece.x + dx,
                            this.currentPiece.y + dy,
                            this.currentPiece.color
                        );
                    }
                });
            });
        }

        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press Enter to restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }

    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * BLOCK_SIZE,
            y * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
        );
    }

    gameLoop() {
        const now = Date.now();
        const dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

        if (!this.gameOver && now - this.lastDrop > dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.mergePiece();
            }
            this.lastDrop = now;
        }

        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => new Tetris()); 