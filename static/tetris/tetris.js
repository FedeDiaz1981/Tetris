document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("tetrisCanvas");
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.getElementById("score");
    const restartButton = document.getElementById("restartButton");
    const restartModalButton = document.getElementById("restartModalButton");
    const gameOverModal = new bootstrap.Modal(document.getElementById("gameOverModal"));
    const finalScoreDisplay = document.getElementById("finalScore");

    const ROWS = 20;
    const COLS = 10;
    const SIZE = 30;
    let score = 0;
    let gameOver = false;

    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    const shapes = [
        [[1, 1, 1, 1]], // Línea
        [[1, 1], [1, 1]], // Cuadrado
        [[0, 1, 0], [1, 1, 1]], // T
        [[1, 1, 0], [0, 1, 1]], // Z
        [[0, 1, 1], [1, 1, 0]]  // S
    ];

    let piece = createPiece();

    function createPiece() {
        let shape = shapes[Math.floor(Math.random() * shapes.length)];
        return { x: 4, y: 0, shape };
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "white";

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c]) {
                    ctx.fillStyle = "blue";
                    ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
                }
                ctx.strokeRect(c * SIZE, r * SIZE, SIZE, SIZE);
            }
        }
    }

    function drawPiece() {
        ctx.fillStyle = "red";
        piece.shape.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                if (cell) {
                    ctx.fillRect((piece.x + cIndex) * SIZE, (piece.y + rIndex) * SIZE, SIZE, SIZE);
                }
            });
        });
    }

    function movePiece(dx) {
        if (gameOver) return;
        piece.x += dx;
        if (collision()) piece.x -= dx;
        update();
    }

    function rotatePiece() {
        if (gameOver) return;
        let newShape = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
        let oldShape = piece.shape;
        piece.shape = newShape;

        if (collision()) piece.shape = oldShape;
        update();
    }

    function moveDown() {
        if (gameOver) return;
        piece.y++;
        if (collision()) {
            piece.y--;
            mergePiece();
            piece = createPiece();
            if (collision()) endGame();
        }
        update();
    }

    function collision() {
        return piece.shape.some((row, rIndex) =>
            row.some((cell, cIndex) =>
                cell &&
                (piece.y + rIndex >= ROWS ||
                piece.x + cIndex < 0 ||
                piece.x + cIndex >= COLS ||
                board[piece.y + rIndex][piece.x + cIndex])
            )
        );
    }

    function mergePiece() {
        piece.shape.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                if (cell) {
                    board[piece.y + rIndex][piece.x + cIndex] = 1;
                }
            });
        });
        removeFullRows();
    }

    function removeFullRows() {
        let rowsToRemove = [];
        for (let r = 0; r < ROWS; r++) {
            if (board[r].every(cell => cell === 1)) {
                rowsToRemove.push(r);
            }
        }
        
        rowsToRemove.forEach(rowIndex => {
            board.splice(rowIndex, 1);
            board.unshift(Array(COLS).fill(0));
        });
        
        updateScore(rowsToRemove.length);
    }

    function updateScore(rowsRemoved) {
        if (rowsRemoved > 0) {
            score += rowsRemoved * 30;
            scoreDisplay.classList.add("animate");
            setTimeout(() => scoreDisplay.classList.remove("animate"), 300);
        }
        scoreDisplay.textContent = `Puntuación: ${score}`;
    }

    function endGame() {
        gameOver = true;
        finalScoreDisplay.textContent = `Tu puntuación: ${score}`;
        gameOverModal.show();
    }

    function restartGame() {
        gameOver = false;
        score = 0;
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        piece = createPiece();
        scoreDisplay.textContent = `Puntuación: 0`;
        update();
    }

    function update() {
        drawBoard();
        drawPiece();
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") movePiece(-1);
        else if (event.key === "ArrowRight") movePiece(1);
        else if (event.key === "ArrowDown") moveDown();
        else if (event.key === "ArrowUp") rotatePiece();
    });

    restartButton.addEventListener("click", restartGame);
    restartModalButton.addEventListener("click", () => {
        restartGame();
        gameOverModal.hide();
    });

    setInterval(moveDown, 500);
    update();
});
