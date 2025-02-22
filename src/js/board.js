class ChessBoard {
    constructor() {
        this.canvas = document.getElementById('chessboard');
        this.ctx = this.canvas.getContext('2d');
        this.squareSize = 60;
        this.board = this.createInitialBoard();
        this.selectedSquare = null;
        this.init();
    }

    async init() {
        this.canvas.width = this.squareSize * 8;
        this.canvas.height = this.squareSize * 8;
        await PieceSprite.loadSprites();
        this.draw();
    }

    createInitialBoard() {
        const board = new Array(8).fill(null).map(() => new Array(8).fill(null));
        
        // Placement des pièces
        const backRowOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        
        // Placement des pièces noires
        backRowOrder.forEach((piece, col) => {
            board[0][col] = `black-${piece}`;
        });
        for (let col = 0; col < 8; col++) {
            board[1][col] = 'black-pawn';
        }
        
        // Placement des pièces blanches
        backRowOrder.forEach((piece, col) => {
            board[7][col] = `white-${piece}`;
        });
        for (let col = 0; col < 8; col++) {
            board[6][col] = 'white-pawn';
        }
        
        return board;
    }

    draw() {
        this.drawBoard();
        this.drawPieces();
        if (this.selectedSquare) {
            this.highlightSquare(this.selectedSquare.row, this.selectedSquare.col);
        }
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

    drawPieces() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const x = col * this.squareSize + this.squareSize / 2;
                    const y = row * this.squareSize + this.squareSize / 2;
                    PieceSprite.drawPiece(this.ctx, piece, x, y);
                }
            }
        }
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

    getSquareFromCoords(x, y) {
        const col = Math.floor(x / this.squareSize);
        const row = Math.floor(y / this.squareSize);
        return { row, col };
    }

    selectSquare(row, col) {
        this.selectedSquare = { row, col };
        this.draw();
    }

    clearSelection() {
        this.selectedSquare = null;
        this.draw();
    }

    getPiece(row, col) {
        return this.board[row][col];
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = null;
        this.board[toRow][toCol] = piece;
        this.draw();
    }
}