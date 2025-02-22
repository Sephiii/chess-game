class ChessGame {
    constructor() {
        this.board = new ChessBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameStatus = {
            status: 'ongoing',
            winner: null
        };
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.updateStatus();
    }

    setupEventListeners() {
        this.board.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(event) {
        if (this.gameStatus.status === 'checkmate' || this.gameStatus.status === 'stalemate') {
            return;
        }

        const rect = this.board.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const square = this.board.getSquareFromCoords(x, y);
        
        if (square.row < 0 || square.row > 7 || square.col < 0 || square.col > 7) {
            return;
        }

        if (this.selectedSquare === null) {
            const piece = this.board.getPiece(square.row, square.col);
            if (piece && piece.color === this.currentPlayer) {
                this.selectedSquare = square;
                this.board.selectSquare(square.row, square.col);
            }
        } else {
            if (this.selectedSquare.row === square.row && 
                this.selectedSquare.col === square.col) {
                this.board.clearSelection();
                this.selectedSquare = null;
                return;
            }

            const success = this.board.movePiece(
                this.selectedSquare.row,
                this.selectedSquare.col,
                square.row,
                square.col
            );

            if (success) {
                this.resetEnPassant();
                this.switchPlayer();
                this.updateGameStatus();
            }

            this.board.clearSelection();
            this.selectedSquare = null;
        }
    }

    resetEnPassant() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board.getPiece(row, col);
                if (piece instanceof Pawn) {
                    piece.enPassantVulnerable = false;
                }
            }
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateStatus();
    }

    updateGameStatus() {
        this.gameStatus = GameRules.getGameStatus(this.board, this.currentPlayer);
        
        // Mettre à jour l'affichage
        this.updateStatus();
        
        // Si le roi est en échec, le mettre en surbrillance
        if (this.gameStatus.status === 'check' || this.gameStatus.status === 'checkmate') {
            const kingPos = GameRules.findKing(this.board, this.currentPlayer);
            if (kingPos) {
                this.board.highlightCheck(kingPos);
            }
        }
    }

    updateStatus() {
        const statusElement = document.getElementById('current-player');
        let statusText = `Tour du joueur : ${this.currentPlayer}`;

        switch (this.gameStatus.status) {
            case 'check':
                statusText += ' - ÉCHEC !';
                break;
            case 'checkmate':
                statusText = `ÉCHEC ET MAT ! ${this.gameStatus.winner === 'white' ? 'Blancs' : 'Noirs'} gagnent!`;
                break;
            case 'stalemate':
                statusText = 'PAT - Match nul!';
                break;
        }

        statusElement.textContent = statusText;
    }
}