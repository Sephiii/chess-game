class Rook extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'rook';
    }

    getValidMoves(board) {
        const moves = [];
        
        // Déplacements horizontaux et verticaux
        const directions = [
            [-1, 0],  // Haut
            [1, 0],   // Bas
            [0, -1],  // Gauche
            [0, 1]    // Droite
        ];

        for (const [rowDir, colDir] of directions) {
            moves.push(...this.getMovesInDirection(board, rowDir, colDir));
        }

        return moves;
    }
}