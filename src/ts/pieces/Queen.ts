import { Piece } from './Piece';
import { Color, Position, ValidMove } from '../types';
import { ChessBoard } from '../Board';

export class Queen extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 'queen');
    }

    getValidMoves(board: ChessBoard): ValidMove[] {
        const moves: ValidMove[] = [];
        const directions: [number, number][] = [
            [-1, 0],  // Haut
            [1, 0],   // Bas
            [0, -1],  // Gauche
            [0, 1],   // Droite
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

    clone(): Queen {
        const cloned = new Queen(this.color, {...this.position});
        cloned.setHasMoved(this.getHasMoved());
        return cloned;
    }
}