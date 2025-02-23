import { Color, Position } from './types.js';
import { Piece } from './pieces/Piece.js';
import { Pawn } from './pieces/Pawn.js';
import { Rook } from './pieces/Rook.js';
import { Knight } from './pieces/Knight.js';
import { Bishop } from './pieces/Bishop.js';
import { Queen } from './pieces/Queen.js';
import { King } from './pieces/King.js';
import { PieceSprite } from './PieceSprite.js';

export class ChessBoard {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private readonly squareSize: number = 60;
    private pieces: (Piece | null)[][];
    private selectedSquare: Position | null = null;

    constructor() {
        const canvas = document.getElementById('chessboard') as HTMLCanvasElement;
        if (!canvas) throw new Error('Canvas element not found');
        
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        this.canvas = canvas;
        this.ctx = ctx;
        this.pieces = this.createInitialPieces();
    }

    // Ajout de la méthode getCanvas
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    async init(): Promise<void> {
        this.canvas.width = this.squareSize * 8;
        this.canvas.height = this.squareSize * 8;
        await PieceSprite.loadSprites();
        this.draw();
    }

    private createInitialPieces(): (Piece | null)[][] {
        const pieces = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Position initiale des pièces
        const backRow = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
        
        // Pièces noires
        for (let col = 0; col < 8; col++) {
            pieces[0][col] = new backRow[col]('black', {row: 0, col: col});
            pieces[1][col] = new Pawn('black', {row: 1, col: col});
        }

        // Pièces blanches
        for (let col = 0; col < 8; col++) {
            pieces[7][col] = new backRow[col]('white', {row: 7, col: col});
            pieces[6][col] = new Pawn('white', {row: 6, col: col});
        }

        return pieces;
    }

    draw(): void {
        this.drawBoard();
        this.drawPieces();
        if (this.selectedSquare) {
            this.highlightSquare(this.selectedSquare);
            this.highlightValidMoves(this.selectedSquare);
        }
    }

    private drawBoard(): void {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                this.ctx.fillStyle = isLight ? '#FFFFFF' : '#769656';
                this.ctx.fillRect(
                    col * this.squareSize,
                    row * this.squareSize,
                    this.squareSize,
                    this.squareSize
                );
            }
        }
    }

    private drawPieces(): void {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.pieces[row][col];
                if (piece) {
                    const x = col * this.squareSize + this.squareSize / 2;
                    const y = row * this.squareSize + this.squareSize / 2;
                    const spriteName = `${piece.color}-${piece.type}`;
                    PieceSprite.drawPiece(this.ctx, spriteName, x, y);
                }
            }
        }
    }

    selectSquare(position: Position): void {
        this.selectedSquare = position;
        this.draw();
    }

    clearSelection(): void {
        this.selectedSquare = null;
        this.draw();
    }

    highlightSquare(position: Position): void {
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
        this.ctx.fillRect(
            position.col * this.squareSize,
            position.row * this.squareSize,
            this.squareSize,
            this.squareSize
        );
    }

    highlightCheck(position: Position): void {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        this.ctx.fillRect(
            position.col * this.squareSize,
            position.row * this.squareSize,
            this.squareSize,
            this.squareSize
        );
    }

    private highlightValidMoves(position: Position): void {
        const piece = this.getPiece(position.row, position.col);
        if (!piece) return;

        const validMoves = piece.getValidMoves(this);
        for (const move of validMoves) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(
                move.col * this.squareSize + this.squareSize / 2,
                move.row * this.squareSize + this.squareSize / 2,
                this.squareSize / 4,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    getSquareFromCoords(x: number, y: number): Position {
        return {
            row: Math.floor(y / this.squareSize),
            col: Math.floor(x / this.squareSize)
        };
    }

    getPiece(row: number, col: number): Piece | null {
        if (row < 0 || row > 7 || col < 0 || col > 7) return null;
        return this.pieces[row][col];
    }

    movePiece(from: Position, to: Position): boolean {
        const piece = this.getPiece(from.row, from.col);
        if (!piece) return false;

        this.pieces[from.row][from.col] = null;
        this.pieces[to.row][to.col] = piece;
        piece.move(to);
        this.draw();
        return true;
    }

    promotePawn(position: Position, type: 'queen' | 'rook' | 'bishop' | 'knight'): void {
        const piece = this.getPiece(position.row, position.col);
        if (!(piece instanceof Pawn)) return;

        let newPiece: Piece;
        switch (type) {
            case 'queen':
                newPiece = new Queen(piece.color, position);
                break;
            case 'rook':
                newPiece = new Rook(piece.color, position);
                break;
            case 'bishop':
                newPiece = new Bishop(piece.color, position);
                break;
            case 'knight':
                newPiece = new Knight(piece.color, position);
                break;
        }

        this.pieces[position.row][position.col] = newPiece;
        this.draw();
    }

    resetEnPassant(): void {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.pieces[row][col];
                if (piece instanceof Pawn) {
                    piece.resetEnPassantVulnerable();
                }
            }
        }
    }

    clone(): ChessBoard {
        const clonedBoard = new ChessBoard();
        
        clonedBoard.pieces = this.pieces.map(row => 
            row.map(piece => piece ? piece.clone() : null)
        );
        
        return clonedBoard;
    }
}