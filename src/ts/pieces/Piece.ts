import { Color, Position, ValidMove } from '../types.js';
import { ChessBoard } from '../Board.js';

export abstract class Piece {
    protected hasMoved: boolean = false;
    
    constructor(
        public readonly color: Color,
        public position: Position,
        public readonly type: string
    ) {}

    abstract getValidMoves(board: ChessBoard): ValidMove[];

    abstract clone(): Piece;

    move(newPosition: Position): void {
        this.position = newPosition;
        this.hasMoved = true;
    }

    protected isValidPosition(position: Position): boolean {
        return position.row >= 0 && 
               position.row < 8 && 
               position.col >= 0 && 
               position.col < 8;
    }

    protected canMoveTo(board: ChessBoard, position: Position): boolean {
        if (!this.isValidPosition(position)) return false;
        
        const piece = board.getPiece(position.row, position.col);
        return !piece || piece.color !== this.color;
    }

    protected getMovesInDirection(
        board: ChessBoard, 
        rowDir: number, 
        colDir: number
    ): ValidMove[] {
        const moves: ValidMove[] = [];
        let currentRow = this.position.row + rowDir;
        let currentCol = this.position.col + colDir;

        while (this.isValidPosition({row: currentRow, col: currentCol})) {
            const targetPosition = {row: currentRow, col: currentCol};
            const piece = board.getPiece(currentRow, currentCol);

            if (!piece) {
                moves.push({
                    row: currentRow,
                    col: currentCol,
                    type: 'normal'
                });
            } else {
                if (piece.color !== this.color) {
                    moves.push({
                        row: currentRow,
                        col: currentCol,
                        type: 'capture'
                    });
                }
                break;
            }

            currentRow += rowDir;
            currentCol += colDir;
        }

        return moves;
    }

    getMoveType(board: ChessBoard, targetPosition: Position): 'normal' | 'capture' {
        const targetPiece = board.getPiece(targetPosition.row, targetPosition.col);
        return targetPiece ? 'capture' : 'normal';
    }

    getHasMoved(): boolean {
        return this.hasMoved;
    }

    setHasMoved(value: boolean): void {
        this.hasMoved = value;
    }
}