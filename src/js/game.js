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
            const piece = this.board.getPiece(square.row, square.col);
            if (piece && piece.startsWith(this.currentPlayer)) {
                this.selectedSquare = square;
                this.board.selectSquare(square.row, square.col);
            }
        } else {
            // Déplacer la pièce
            this.board.movePiece(
                this.selectedSquare.row,
                this.selectedSquare.col,
                square.row,
                square.col
            );
            this.board.clearSelection();
            this.selectedSquare = null;
            this.switchPlayer();
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