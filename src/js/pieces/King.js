class King extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'king';
    }

    getValidMoves(board) {
        const moves = [];
        
        // Tous les mouvements possibles du roi (une case dans toutes les directions)
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],  // Haut
            [0, -1], [0, 1],             // Milieu
            [1, -1], [1, 0], [1, 1]      // Bas
        ];

        for (const [rowOffset, colOffset] of directions) {
            const newPosition = {
                row: this.position.row + rowOffset,
                col: this.position.col + colOffset
            };

            if (this.canMoveTo(board, newPosition)) {
                moves.push(newPosition);
            }
        }

        // Vérifier les possibilités de roque
        if (!this.hasMoved) {
            // Petit roque
            const kingSideRook = board.getPiece(this.position.row, 7);
            if (kingSideRook && 
                kingSideRook instanceof Rook && 
                !kingSideRook.hasMoved) {
                
                const path = [
                    {row: this.position.row, col: 5},
                    {row: this.position.row, col: 6}
                ];
                
                if (path.every(pos => !board.getPiece(pos.row, pos.col))) {
                    moves.push({row: this.position.row, col: 6});
                }
            }

            // Grand roque
            const queenSideRook = board.getPiece(this.position.row, 0);
            if (queenSideRook && 
                queenSideRook instanceof Rook && 
                !queenSideRook.hasMoved) {
                
                const path = [
                    {row: this.position.row, col: 3},
                    {row: this.position.row, col: 2},
                    {row: this.position.row, col: 1}
                ];
                
                if (path.every(pos => !board.getPiece(pos.row, pos.col))) {
                    moves.push({row: this.position.row, col: 2});
                }
            }
        }

        return moves;
    }

    // Méthode spéciale pour gérer le roque
    handleCastling(board, newPosition) {
        if (Math.abs(newPosition.col - this.position.col) === 2) {
            // C'est un roque
            const isKingSide = newPosition.col === 6;
            const rookCol = isKingSide ? 7 : 0;
            const rookNewCol = isKingSide ? 5 : 3;
            
            const rook = board.getPiece(this.position.row, rookCol);
            board.movePiece(this.position.row, rookCol, this.position.row, rookNewCol);
            rook.hasMoved = true;
        }
    }
}