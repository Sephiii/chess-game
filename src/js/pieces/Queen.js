class Queen extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'queen';
    }

    getValidMoves(board) {
        const moves = [];
        
        // Combine les mouvements de la tour et du fou
        const directions = [
            [-1, 0],  // Haut
            [1, 0],   // Bas
            [0, -1],  // Gauche
            [0, 1],   // Droite
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