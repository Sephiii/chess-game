class ChessGame {
    constructor() {
        this.board = new ChessBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.init();
    }

    async init() {
        this.updateStatus();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.board.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(event) {
        const rect = this.board.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const square = this.board.getSquareFromCoords(x, y);
        
        // Vérifier si la case est dans les limites du plateau
        if (square.row < 0 || square.row > 7 || square.col < 0 || square.col > 7) {
            return;
        }

        if (this.selectedSquare === null) {
            // Sélection d'une pièce
            const piece = this.board.getPiece(square.row, square.col);
            if (piece && piece.color === this.currentPlayer) {
                this.selectedSquare = square;
                this.board.selectSquare(square.row, square.col);
            }
        } else {
            // Tentative de déplacement
            if (this.selectedSquare.row === square.row && 
                this.selectedSquare.col === square.col) {
                // Désélection si on clique sur la même case
                this.board.clearSelection();
                this.selectedSquare = null;
                return;
            }

            // Essayer de déplacer la pièce
            const success = this.board.movePiece(
                this.selectedSquare.row,
                this.selectedSquare.col,
                square.row,
                square.col
            );

            if (success) {
                // Réinitialiser les drapeaux de prise en passant pour toutes les pièces
                this.resetEnPassant();
                this.switchPlayer();
            }

            this.board.clearSelection();
            this.selectedSquare = null;
        }
    }

    resetEnPassant() {
        // Réinitialiser le drapeau enPassantVulnerable pour tous les pions
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

    updateStatus() {
        const statusElement = document.getElementById('current-player');
        statusElement.textContent = `Tour du joueur : ${this.currentPlayer}`;
    }
}

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
    const game = new ChessGame();
});