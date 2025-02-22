import { Piece } from './Piece';
import { Color, Position, ValidMove } from '../types';
import { ChessBoard } from '../Board';
import { Rook } from './Rook';
import { GameRules } from '../GameRules';

export class King extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 'king');
    }

    getValidMoves(board: ChessBoard): ValidMove[] {
        const moves: ValidMove[] = [];
        
        // Mouvements normaux du roi (une case dans toutes les directions)
        const directions: [number, number][] = [
            [-1, -1], [-1, 0], [-1, 1],  // Haut
            [0, -1], [0, 1],             // Milieu
            [1, -1], [1, 0], [1, 1]      // Bas
        ];

        for (const [rowOffset, colOffset] of directions) {
            const newPosition: Position = {
                row: this.position.row + rowOffset,
                col: this.position.col + colOffset
            };

            if (this.canMoveTo(board, newPosition) && 
                !GameRules.isSquareUnderAttack(board, newPosition, this.color === 'white' ? 'black' : 'white')) {
                moves.push({
                    ...newPosition,
                    type: this.getMoveType(board, newPosition)
                });
            }
        }

        // Vérifier les possibilités de roque
        if (!this.hasMoved && !GameRules.isInCheck(board, this.color)) {
            // Petit roque
            const kingSideRook = board.getPiece(this.position.row, 7);
            if (kingSideRook instanceof Rook && !kingSideRook.hasMoved) {
                const path: Position[] = [
                    { row: this.position.row, col: 5 },
                    { row: this.position.row, col: 6 }
                ];
                
                if (this.isCastlingPathClear(board, path)) {
                    moves.push({
                        row: this.position.row,
                        col: 6,
                        type: 'castle'
                    });
                }
            }

            // Grand roque
            const queenSideRook = board.getPiece(this.position.row, 0);
            if (queenSideRook instanceof Rook && !queenSideRook.hasMoved) {
                const path: Position[] = [
                    { row: this.position.row, col: 3 },
                    { row: this.position.row, col: 2 },
                    { row: this.position.row, col: 1 }
                ];
                
                if (this.isCastlingPathClear(board, path)) {
                    moves.push({
                        row: this.position.row,
                        col: 2,
                        type: 'castle'
                    });
                }
            }
        }

        return moves;
    }

    private isCastlingPathClear(board: ChessBoard, path: Position[]): boolean {
        const opposingColor = this.color === 'white' ? 'black' : 'white';
        
        return path.every(pos => {
            // La case doit être vide
            if (board.getPiece(pos.row, pos.col)) return false;
            
            // La case ne doit pas être sous attaque
            if (GameRules.isSquareUnderAttack(board, pos, opposingColor)) return false;
            
            return true;
        });
    }

    clone(): King {
        const cloned = new King(this.color, {...this.position});
        cloned.hasMoved = this.hasMoved;
        return cloned;
    }
}