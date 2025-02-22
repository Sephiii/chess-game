class GameRules {
    static isSquareUnderAttack(board, targetRow, targetCol, attackingColor) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece(row, col);
                if (piece && piece.color === attackingColor) {
                    const validMoves = piece.getValidMoves(board);
                    if (validMoves.some(move => move.row === targetRow && move.col === targetCol)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static findKing(board, color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece(row, col);
                if (piece && piece instanceof King && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    static isInCheck(board, color) {
        const kingPosition = this.findKing(board, color);
        if (!kingPosition) return false;
        
        const opposingColor = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(board, kingPosition.row, kingPosition.col, opposingColor);
    }

    static wouldMoveIntoCheck(board, fromRow, fromCol, toRow, toCol, color) {
        // Simuler le mouvement
        const tempBoard = board.clone();
        tempBoard.movePiece(fromRow, fromCol, toRow, toCol);
        
        // Vérifier si le roi est en échec après le mouvement
        return this.isInCheck(tempBoard, color);
    }

    static hasLegalMoves(board, color) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = board.getPiece(fromRow, fromCol);
                if (piece && piece.color === color) {
                    const validMoves = piece.getValidMoves(board);
                    for (const move of validMoves) {
                        if (!this.wouldMoveIntoCheck(board, fromRow, fromCol, move.row, move.col, color)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    static isCheckmate(board, color) {
        return this.isInCheck(board, color) && !this.hasLegalMoves(board, color);
    }

    static isStalemate(board, color) {
        return !this.isInCheck(board, color) && !this.hasLegalMoves(board, color);
    }

    static getGameStatus(board, color) {
        if (this.isCheckmate(board, color)) {
            return {
                status: 'checkmate',
                winner: color === 'white' ? 'black' : 'white'
            };
        }
        
        if (this.isStalemate(board, color)) {
            return {
                status: 'stalemate',
                winner: null
            };
        }
        
        if (this.isInCheck(board, color)) {
            return {
                status: 'check',
                winner: null
            };
        }
        
        return {
            status: 'ongoing',
            winner: null
        };
    }
}