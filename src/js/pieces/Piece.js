class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.hasMoved = false;
    }

    getValidMoves(board) {
        return [];
    }

    move(newPosition) {
        this.position = newPosition;
        this.hasMoved = true;
    }

    isValidPosition(position) {
        return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
    }

    // Vérifie si une case est vide ou contient une pièce adverse
    canMoveTo(board, position) {
        if (!this.isValidPosition(position)) return false;
        
        const piece = board.getPiece(position.row, position.col);
        if (!piece) return true; // Case vide
        return piece.color !== this.color; // Pièce adverse
    }

    // Obtient toutes les cases valides dans une direction donnée jusqu'à une obstruction
    getMovesInDirection(board, rowDir, colDir) {
        const moves = [];
        let currentRow = this.position.row + rowDir;
        let currentCol = this.position.col + colDir;

        while (this.isValidPosition({row: currentRow, col: currentCol})) {
            const targetPosition = {row: currentRow, col: currentCol};
            const targetPiece = board.getPiece(currentRow, currentCol);

            if (!targetPiece) {
                moves.push(targetPosition);
            } else {
                if (targetPiece.color !== this.color) {
                    moves.push(targetPosition);
                }
                break;
            }

            currentRow += rowDir;
            currentCol += colDir;
        }

        return moves;
    }
}