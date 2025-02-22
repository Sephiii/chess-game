import { Position, Color } from './types';
import { Piece } from './pieces/Piece';
import { Pawn } from './pieces/Pawn';
import { Rook } from './pieces/Rook';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { Queen } from './pieces/Queen';
import { King } from './pieces/King';
import { PieceSprite } from './PieceSprite';

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

    async init(): Promise<void> {
        this.canvas.width = this.squareSize * 8;
        this.canvas.height = this.squareSize * 8;
        await PieceSprite.loadSprites();
        this.draw();
    }

    private createInitialPieces(): (Piece | null)[][] {
        const pieces: (Piece | null)[][] = Array(8).fill(null)
            .map(() => Array(8).fill(null));
        
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

    highlightSquare(position: Position): void {
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
        this.ctx.fillRect(
            position.col * this.squareSize,
            position.row * this.squareSize,
            this.squareSize,
            this.squareSize
        );
    }

    highlightCheck(kingPosition: Position): void {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        this.ctx.fillRect(
            kingPosition.col * this.squareSize,
            kingPosition.row * this.squareSize,
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

    selectSquare(position: Position): void {
        this.selectedSquare = position;
        this.draw();
    }

    clearSelection(): void {
        this.selectedSquare = null;
        this.draw();
    }

    getPiece(row: number, col: number): Piece | null {
        if (row < 0 || row > 7 || col < 0 || col > 7) return null;
        return this.pieces[row][col];
    }

    movePiece(from: Position, to: Position): boolean {
        const piece = this.getPiece(from.row, from.col);
        if (!piece) return false;

        const validMoves = piece.getValidMoves(this);
        const isValidMove = validMoves.some(move => 
            move.row === to.row && 
            move.col === to.col
        );

        if (isValidMove) {
            if (piece instanceof King) {
                this.handleCastling(piece, to);
            }

            if (piece instanceof Pawn) {
                this.handleEnPassant(piece, from, to);
            }

            this.pieces[from.row][from.col] = null;
            this.pieces[to.row][to.col] = piece;
            piece.move(to);

            this.draw();
            return true;
        }
        return false;
    }

    private handleCastling(king: King, to: Position): void {
        const castlingCol = to.col;
        const row = king.position.row;

        if (Math.abs(castlingCol - king.position.col) === 2) {
            // C'est un roque
            const isKingSide = castlingCol === 6;
            const rookFromCol = isKingSide ? 7 : 0;
            const rookToCol = isKingSide ? 5 : 3;

            const rook = this.getPiece(row, rookFromCol);
            if (rook instanceof Rook) {
                this.pieces[row][rookFromCol] = null;
                this.pieces[row][rookToCol] = rook;
                rook.move({row, col: rookToCol});
            }
        }
    }

    private handleEnPassant(pawn: Pawn, from: Position, to: Position): void {
        if (Math.abs(from.col - to.col) === 1 && !this.getPiece(to.row, to.col)) {
            // C'est une prise en passant
            this.pieces[from.row][to.col] = null;
        }
    }

    clone(): ChessBoard {
        const newBoard = new ChessBoard();
        newBoard.pieces = this.pieces.map(row => 
            row.map(piece => 
                piece ? piece.clone() : null
            )
        );
        return newBoard;
    }
}