class ChessBoard {
    constructor() {
        this.canvas = document.getElementById('chessboard');
        this.ctx = this.canvas.getContext('2d');
        this.squareSize = 60;
        this.board = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.init();
    }

    init() {
        this.canvas.width = this.squareSize * 8;
        this.canvas.height = this.squareSize * 8;
        this.drawBoard();
        this.initializePieces();
    }

    drawBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                this.ctx.fillStyle = isLight ? '#FFFFFF' : '#769656';
                this.ctx.fillRect(
                    col * this.squareSize,
                    row * this.squareSize,
                    this.squareSize,
                    this.squareSize
                );
            }
        }
    }

    initializePieces() {
        // Initialisation temporaire avec des cercles pour représenter les pièces
        for (let col = 0; col < 8; col++) {
            // Pions
            this.drawPiece(1, col, 'black');
            this.drawPiece(6, col, 'white');
        }
        
        // Pièces noires
        this.drawPiece(0, 0, 'black');
        this.drawPiece(0, 7, 'black');
        this.drawPiece(0, 1, 'black');
        this.drawPiece(0, 6, 'black');
        this.drawPiece(0, 2, 'black');
        this.drawPiece(0, 5, 'black');
        this.drawPiece(0, 3, 'black');
        this.drawPiece(0, 4, 'black');

        // Pièces blanches
        this.drawPiece(7, 0, 'white');
        this.drawPiece(7, 7, 'white');
        this.drawPiece(7, 1, 'white');
        this.drawPiece(7, 6, 'white');
        this.drawPiece(7, 2, 'white');
        this.drawPiece(7, 5, 'white');
        this.drawPiece(7, 3, 'white');
        this.drawPiece(7, 4, 'white');
    }

    drawPiece(row, col, color) {
        const centerX = col * this.squareSize + this.squareSize / 2;
        const centerY = row * this.squareSize + this.squareSize / 2;
        const radius = this.squareSize / 3;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = color === 'white' ? 'black' : 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    getSquareFromCoords(x, y) {
        const col = Math.floor(x / this.squareSize);
        const row = Math.floor(y / this.squareSize);
        return { row, col };
    }

    highlightSquare(row, col) {
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
        this.ctx.fillRect(
            col * this.squareSize,
            row * this.squareSize,
            this.squareSize,
            this.squareSize
        );
    }
}