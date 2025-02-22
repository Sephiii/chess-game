class Bishop extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'bishop';
    }

    getValidMoves(board) {
        const moves = [];
        
        // Déplacements en diagonale
        const directions = [
            [-1, -1], // Haut-gauche
            [-1, 1],  // Haut-droite
            [1, -1],  // Bas-gauche
            [1, 1]    // Bas-droite
        ];

        for (const [rowDir, colDir] of directions) {
            moves.push(...this.getMovesInDirection(board, rowDir, colDir));
        }

        return moves;
    }
}