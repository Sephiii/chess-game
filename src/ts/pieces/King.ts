import { Piece } from './Piece';
import { Color, Position, ValidMove } from '../types';
import { ChessBoard } from '../Board';
import { Rook } from './Rook';

export class King extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 'king');
    }

    getValidMoves(board: ChessBoard): ValidMove[] {
        const moves: ValidMove[] = [];
        const directions: [number, number][] = [
            [-1, -1], [-1, 0], [-1, 1],  // Haut
            [0, -1], [0, 1],             // Milieu
            [1, -1], [1, 0], [1, 1]      // Bas
        ];

        // Mouvements normaux
        for (const [rowOffset, colOffset] of directions) {
            const newRow = this.position.row + rowOffset;
            const newCol = this.position.col + colOffset;
            const newPosition: Position = { row: newRow, col: newCol };

            if (this.isValidPosition(newPosition)) {
                const targetPiece = board.getPiece(newRow, newCol);
                if (!targetPiece || targetPiece.color !== this.color) {
                    moves.push({
                        row: newRow,
                        col: newCol,
                        type: targetPiece ? 'capture' : 'normal'
                    });
                }
            }
        }

        // Roque
        if (!this.hasMoved) {
            // Petit roque
            if (this.canCastleKingside(board)) {
                moves.push({
                    row: this.position.row,
                    col: this.position.col + 2,
                    type: 'castle'
                });
            }

            // Grand roque
            if (this.canCastleQueenside(board)) {
                moves.push({
                    row: this.position.row,
                    col: this.position.col - 2,
                    type: 'castle'
                });
            }
        }

        return moves;
    }

    private canCastleKingside(board: ChessBoard): boolean {
        // Vérifier la tour du côté roi
        const rook = board.getPiece(this.position.row, 7);
        if (!(rook instanceof Rook) || rook.getHasMoved()) {
            return false;
        }

        // Vérifier si les cases entre le roi et la tour sont vides
        for (let col = this.position.col + 1; col < 7; col++) {
            if (board.getPiece(this.position.row, col)) {
                return false;
            }
        }

        return true;
    }

    private canCastleQueenside(board: ChessBoard): boolean {
        // Vérifier la tour du côté dame
        const rook = board.getPiece(this.position.row, 0);
        if (!(rook instanceof Rook) || rook.getHasMoved()) {
            return false;
        }

        // Vérifier si les cases entre le roi et la tour sont vides
        for (let col = this.position.col - 1; col > 0; col--) {
            if (board.getPiece(this.position.row, col)) {
                return false;
            }
        }

        return true;
    }

    handleCastling(board: ChessBoard, newPosition: Position): void {
        const deltaCol = newPosition.col - this.position.col;
        if (Math.abs(deltaCol) === 2) {
            // C'est un roque
            const isKingside = deltaCol > 0;
            const rookFromCol = isKingside ? 7 : 0;
            const rookToCol = isKingside ? 5 : 3;
            
            const rook = board.getPiece(this.position.row, rookFromCol);
            if (rook instanceof Rook) {
                board.movePiece(
                    { row: this.position.row, col: rookFromCol },
                    { row: this.position.row, col: rookToCol }
                );
            }
        }
    }

    clone(): King {
        const cloned = new King(this.color, {...this.position});
        cloned.setHasMoved(this.getHasMoved());
        return cloned;
    }
}