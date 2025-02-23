import { ChessBoard } from './Board.js';
import { Color, Position, GameState } from './types.js';
import { King } from './pieces/King.js';

export class GameRules {
    static isSquareUnderAttack(board: ChessBoard, targetPosition: Position, attackingColor: Color): boolean {
        // Vérifier si une pièce de la couleur attaquante peut atteindre la case cible
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece(row, col);
                if (piece && piece.color === attackingColor) {
                    const validMoves = piece.getValidMoves(board);
                    if (validMoves.some(move => 
                        move.row === targetPosition.row && 
                        move.col === targetPosition.col
                    )) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static findKing(board: ChessBoard, color: Color): Position | null {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece(row, col);
                if (piece instanceof King && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    static isInCheck(board: ChessBoard, color: Color): boolean {
        const kingPosition = this.findKing(board, color);
        if (!kingPosition) return false;
        
        const opposingColor: Color = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(board, kingPosition, opposingColor);
    }

    static wouldMoveIntoCheck(
        board: ChessBoard, 
        fromPosition: Position,
        toPosition: Position, 
        color: Color
    ): boolean {
        // Simuler le mouvement sur un clone du plateau
        const tempBoard = board.clone();
        tempBoard.movePiece(fromPosition, toPosition);
        
        // Vérifier si le roi est en échec après le mouvement
        return this.isInCheck(tempBoard, color);
    }

    private static hasLegalMoves(board: ChessBoard, color: Color): boolean {
        // Vérifier toutes les pièces de la couleur donnée
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece(row, col);
                if (piece && piece.color === color) {
                    const moves = piece.getValidMoves(board);
                    
                    // Vérifier si l'un des mouvements est légal
                    for (const move of moves) {
                        const fromPos = { row, col };
                        const toPos = { row: move.row, col: move.col };
                        
                        if (!this.wouldMoveIntoCheck(board, fromPos, toPos, color)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    static isCheckmate(board: ChessBoard, color: Color): boolean {
        // Vérifie si le roi est en échec et n'a aucun mouvement légal
        return this.isInCheck(board, color) && !this.hasLegalMoves(board, color);
    }

    static isStalemate(board: ChessBoard, color: Color): boolean {
        // Vérifie si le roi n'est pas en échec mais n'a aucun mouvement légal
        return !this.isInCheck(board, color) && !this.hasLegalMoves(board, color);
    }

    static getGameStatus(board: ChessBoard, currentPlayer: Color): GameState {
        if (this.isCheckmate(board, currentPlayer)) {
            return {
                status: 'checkmate',
                winner: currentPlayer === 'white' ? 'black' : 'white'
            };
        }
        
        if (this.isStalemate(board, currentPlayer)) {
            return {
                status: 'stalemate',
                winner: null
            };
        }
        
        if (this.isInCheck(board, currentPlayer)) {
            return {
                status: 'check',
                winner: null
            };
        }
        
        return {
            status: 'ongoing',
            winner: null
        };
    }

    static validateMove(
        board: ChessBoard,
        fromPosition: Position,
        toPosition: Position
    ): boolean {
        const piece = board.getPiece(fromPosition.row, fromPosition.col);
        if (!piece) return false;

        const validMoves = piece.getValidMoves(board);
        if (!validMoves.some(move => move.row === toPosition.row && move.col === toPosition.col)) {
            return false;
        }

        return !this.wouldMoveIntoCheck(board, fromPosition, toPosition, piece.color);
    }
}