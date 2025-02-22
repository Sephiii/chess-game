class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.hasMoved = false;
        this.type = 'piece'; // Type par défaut, sera surchargé par les classes enfants
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

    canMoveTo(board, position) {
        if (!this.isValidPosition(position)) return false;
        const piece = board.getPiece(position.row, position.col);
        return !piece || piece.color !== this.color;
    }

    getMovesInDirection(board, rowDir, colDir) {
        const moves = [];
        let currentRow = this.position.row + rowDir;
        let currentCol = this.position.col + colDir;

        while (this.isValidPosition({row: currentRow, col: currentCol})) {
            const piece = board.getPiece(currentRow, currentCol);
            if (!piece) {
                moves.push({row: currentRow, col: currentCol});
            } else {
                if (piece.color !== this.color) {
                    moves.push({row: currentRow, col: currentCol});
                }
                break;
            }
            currentRow += rowDir;
            currentCol += colDir;
        }

        return moves;
    }
}