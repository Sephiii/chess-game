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
            const newPosition: Position = {
                row: this.position.row + rowOffset,
                col: this.position.col + colOffset
            };

            if (this.canMoveTo(board, newPosition)) {
                moves.push({
                    ...newPosition,
                    type: this.getMoveType(board, newPosition)
                });
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