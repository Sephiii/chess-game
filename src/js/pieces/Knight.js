class Knight extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'knight';
    }

    getValidMoves(board) {
        const moves = [];
        
        // Tous les mouvements possibles du cavalier (en L)
        const knightMoves = [
            [-2, -1], [-2, 1],  // Haut
            [2, -1], [2, 1],    // Bas
            [-1, -2], [1, -2],  // Gauche
            [-1, 2], [1, 2]     // Droite
        ];

        for (const [rowOffset, colOffset] of knightMoves) {
            const newPosition = {
                row: this.position.row + rowOffset,
                col: this.position.col + colOffset
            };

            if (this.canMoveTo(board, newPosition)) {
                moves.push(newPosition);
            }
        }

        return moves;
    }
}