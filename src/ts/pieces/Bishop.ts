import { Piece } from './Piece';
import { Color, Position, ValidMove } from '../types';
import { ChessBoard } from '../Board';

export class Bishop extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 'bishop');
    }

    getValidMoves(board: ChessBoard): ValidMove[] {
        const moves: ValidMove[] = [];
        const directions: [number, number][] = [
            [-1, -1], // Haut-gauche
            [-1, 1],  // Haut-droite
            [1, -1],  // Bas-gauche
            [1, 1]    // Bas-droite
        ];

        for (const [rowDir, colDir] of directions) {
            const directionMoves = this.getMovesInDirection(board, rowDir, colDir);
            moves.push(...directionMoves);
        }

        return moves;
    }

    clone(): Bishop {
        const cloned = new Bishop(this.color, {...this.position});
        cloned.setHasMoved(this.getHasMoved());
        return cloned;
    }
}