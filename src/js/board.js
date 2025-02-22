class ChessBoard {
    constructor(pieces = null) {
        this.canvas = document.getElementById('chessboard');
        this.ctx = this.canvas.getContext('2d');
        this.squareSize = 60;
        this.pieces = pieces || this.createInitialPieces();
        this.selectedSquare = null;
        if (!pieces) this.init();
    }

    async init() {
        this.canvas.width = this.squareSize * 8;
        this.canvas.height = this.squareSize * 8;
        await PieceSprite.loadSprites();
        this.draw();
    }

    drawPiece(row, col, piece) {
        const x = col * this.squareSize + this.squareSize / 2;
        const y = row * this.squareSize + this.squareSize / 2;
        const radius = this.squareSize / 3;

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = piece.color;
        this.ctx.fill();
        this.ctx.strokeStyle = piece.color === 'white' ? 'black' : 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    createInitialPieces() {
        const pieces = new Array(8).fill(null).map(() => new Array(8).fill(null));
        
        // Position initiale des pièces
        const backRow = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
        
        // Pièces noires
        for (let col = 0; col < 8; col++) {
            pieces[0][col] = new backRow[col]('black', {row: 0, col: col});
            pieces[1][col] = new Pawn('black', {row: 1, col: col});
        }

        // Pièces blanches
        for (let col = 0; col < 8; col++) {
            pieces[7][col] = new backRow[col]('white', {row: 7, col: col});
            pieces[6][col] = new Pawn('white', {row: 6, col: col});
        }

        return pieces;
    }

    draw() {
        this.drawBoard();
        this.drawPieces();
        if (this.selectedSquare) {
            this.highlightSquare(this.selectedSquare.row, this.selectedSquare.col);
            this.highlightValidMoves(this.selectedSquare);
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
                const piece = this.pieces[row][col];
                if (piece) {
                    this.drawPiece(row, col, piece);
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

    highlightCheck(kingPosition) {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        this.ctx.fillRect(
            kingPosition.col * this.squareSize,
            kingPosition.row * this.squareSize,
            this.squareSize,
            this.squareSize
        );
    }

    highlightValidMoves(square) {
        const piece = this.getPiece(square.row, square.col);
        if (!piece) return;

        const validMoves = piece.getValidMoves(this);
        for (const move of validMoves) {
            if (!GameRules.wouldMoveIntoCheck(this, square.row, square.col, move.row, move.col, piece.color)) {
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(
                    move.col * this.squareSize + this.squareSize / 2,
                    move.row * this.squareSize + this.squareSize / 2,
                    this.squareSize / 4,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        }
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
        if (row < 0 || row > 7 || col < 0 || col > 7) return null;
        return this.pieces[row][col];
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.pieces[fromRow][fromCol];
        if (!piece) return false;

        const validMoves = piece.getValidMoves(this);
        if (validMoves.some(move => move.row === toRow && move.col === toCol)) {
            // Gestion spéciale pour le roque
            if (piece instanceof King) {
                piece.handleCastling(this, {row: toRow, col: toCol});
            }

            // Déplacement de la pièce
            this.pieces[fromRow][fromCol] = null;
            this.pieces[toRow][toCol] = piece;
            piece.move({row: toRow, col: toCol});

            this.draw();
            return true;
        }
        return false;
    }

    clone() {
        const clonedPieces = new Array(8).fill(null).map(() => new Array(8).fill(null));
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.pieces[row][col];
                if (piece) {
                    const PieceClass = piece.constructor;
                    clonedPieces[row][col] = new PieceClass(piece.color, {row, col});
                    clonedPieces[row][col].hasMoved = piece.hasMoved;
                }
            }
        }
        
        return new ChessBoard(clonedPieces);
    }
}