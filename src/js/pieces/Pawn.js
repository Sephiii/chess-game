class Pawn extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = 'pawn';
        this.enPassantVulnerable = false;
    }

    getValidMoves(board) {
        const moves = [];
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;

        // Mouvement avant d'une case
        const oneStep = {
            row: this.position.row + direction,
            col: this.position.col
        };
        
        if (this.isValidPosition(oneStep) && !board.getPiece(oneStep.row, oneStep.col)) {
            moves.push(oneStep);

            // Mouvement avant de deux cases si le pion n'a pas bougé
            if (!this.hasMoved) {
                const twoStep = {
                    row: this.position.row + (direction * 2),
                    col: this.position.col
                };
                if (!board.getPiece(twoStep.row, twoStep.col)) {
                    moves.push(twoStep);
                }
            }
        }

        // Captures en diagonale
        const captures = [
            { row: this.position.row + direction, col: this.position.col - 1 },
            { row: this.position.row + direction, col: this.position.col + 1 }
        ];

        for (const capture of captures) {
            if (this.isValidPosition(capture)) {
                const targetPiece = board.getPiece(capture.row, capture.col);
                if (targetPiece && targetPiece.color !== this.color) {
                    moves.push(capture);
                }

                // Prise en passant
                const adjacentPiece = board.getPiece(this.position.row, capture.col);
                if (adjacentPiece && 
                    adjacentPiece instanceof Pawn && 
                    adjacentPiece.enPassantVulnerable && 
                    adjacentPiece.color !== this.color) {
                    moves.push(capture);
                }
            }
        }

        return moves;
    }

    move(newPosition) {
        // Vérifier si c'est un mouvement de deux cases
        if (Math.abs(newPosition.row - this.position.row) === 2) {
            this.enPassantVulnerable = true;
        }
        super.move(newPosition);
    }
}