import { Piece } from './Piece';
import { Color, Position, ValidMove } from '../types';
import { ChessBoard } from '../Board';

export class Pawn extends Piece {
    private enPassantVulnerable: boolean = false;

    constructor(color: Color, position: Position) {
        super(color, position, 'pawn');
    }

    getValidMoves(board: ChessBoard): ValidMove[] {
        const moves: ValidMove[] = [];
        const direction = this.color === 'white' ? -1 : 1;

        // Mouvement avant d'une case
        const oneStep: Position = {
            row: this.position.row + direction,
            col: this.position.col
        };

        if (this.isValidPosition(oneStep) && !board.getPiece(oneStep.row, oneStep.col)) {
            // Vérifier la promotion
            if (oneStep.row === 0 || oneStep.row === 7) {
                moves.push({ ...oneStep, type: 'promotion' });
            } else {
                moves.push({ ...oneStep, type: 'normal' });
            }

            // Mouvement avant de deux cases si le pion n'a pas bougé
            if (!this.hasMoved) {
                const twoStep: Position = {
                    row: this.position.row + (direction * 2),
                    col: this.position.col
                };
                if (!board.getPiece(twoStep.row, twoStep.col)) {
                    moves.push({ ...twoStep, type: 'normal' });
                }
            }
        }

        // Captures en diagonale
        const captures: Position[] = [
            { row: this.position.row + direction, col: this.position.col - 1 },
            { row: this.position.row + direction, col: this.position.col + 1 }
        ];

        for (const capturePos of captures) {
            if (this.isValidPosition(capturePos)) {
                const targetPiece = board.getPiece(capturePos.row, capturePos.col);

                // Capture normale
                if (targetPiece && targetPiece.color !== this.color) {
                    if (capturePos.row === 0 || capturePos.row === 7) {
                        moves.push({ ...capturePos, type: 'promotion' });
                    } else {
                        moves.push({ ...capturePos, type: 'capture' });
                    }
                }

                // Prise en passant
                const adjacentPos: Position = {
                    row: this.position.row,
                    col: capturePos.col
                };
                const adjacentPiece = board.getPiece(adjacentPos.row, adjacentPos.col);

                if (adjacentPiece && 
                    adjacentPiece instanceof Pawn && 
                    (adjacentPiece as Pawn).isEnPassantVulnerable() && 
                    adjacentPiece.color !== this.color) {
                    moves.push({ ...capturePos, type: 'en-passant' });
                }
            }
        }

        return moves;
    }

    move(newPosition: Position): void {
        // Si c'est un mouvement de deux cases
        if (Math.abs(newPosition.row - this.position.row) === 2) {
            this.enPassantVulnerable = true;
        }
        super.move(newPosition);
    }

    isEnPassantVulnerable(): boolean {
        return this.enPassantVulnerable;
    }

    resetEnPassantVulnerable(): void {
        this.enPassantVulnerable = false;
    }
}