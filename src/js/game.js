class ChessGame {
    constructor() {
        this.board = new ChessBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.init();
    }

    init() {
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

        if (this.selectedSquare === null) {
            this.selectedSquare = square;
            this.board.highlightSquare(square.row, square.col);
        } else {
            // Simuler un mouvement
            this.board.drawBoard(); // Redessine le plateau
            this.board.initializePieces(); // Redessine les pièces
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