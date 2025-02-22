import { Piece } from './Piece';
import { Color, Position, ValidMove } from '../types';
import { ChessBoard } from '../Board';

export class Rook extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 'rook');
    }

    getValidMoves(board: ChessBoard): ValidMove[] {
        const moves: ValidMove[] = [];
        const directions: [number, number][] = [
            [-1, 0], // Haut
            [1, 0],  // Bas
            [0, -1], // Gauche
            [0, 1]   // Droite
        ];

        for (const [rowDir, colDir] of directions) {
            const directionMoves = this.getMovesInDirection(board, rowDir, colDir);
            moves.push(...directionMoves);
        }

        return moves;
    }

    clone(): Rook {
        const cloned = new Rook(this.color, {...this.position});
        cloned.hasMoved = this.hasMoved;
        return cloned;
    }
}