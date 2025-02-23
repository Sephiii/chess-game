import { Piece } from './Piece';
import { Color, Position, ValidMove } from '../types';
import { ChessBoard } from '../Board';

export class Knight extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 'knight');
    }

    getValidMoves(board: ChessBoard): ValidMove[] {
        const moves: ValidMove[] = [];
        const knightMoves: [number, number][] = [
            [-2, -1], [-2, 1],  // Haut
            [2, -1], [2, 1],    // Bas
            [-1, -2], [1, -2],  // Gauche
            [-1, 2], [1, 2]     // Droite
        ];

        for (const [rowOffset, colOffset] of knightMoves) {
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

        return moves;
    }

    clone(): Knight {
        const cloned = new Knight(this.color, {...this.position});
        cloned.setHasMoved(this.getHasMoved());
        return cloned;
    }
}