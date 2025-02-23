import { Color, Position, ValidMove } from '../types';
import { ChessBoard } from '../Board';

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

    protected getMovesInDirection(board: ChessBoard, rowDir: number, colDir: number): ValidMove[] {
        const moves: ValidMove[] = [];
        let newRow = this.position.row + rowDir;
        let newCol = this.position.col + colDir;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetPiece = board.getPiece(newRow, newCol);
            
            if (!targetPiece) {
                moves.push({
                    row: newRow,
                    col: newCol,
                    type: 'normal'
                });
            } else {
                if (targetPiece.color !== this.color) {
                    moves.push({
                        row: newRow,
                        col: newCol,
                        type: 'capture'
                    });
                }
                break;
            }

            newRow += rowDir;
            newCol += colDir;
        }

        return moves;
    }

    getHasMoved(): boolean {
        return this.hasMoved;
    }

    setHasMoved(value: boolean): void {
        this.hasMoved = value;
    }
}