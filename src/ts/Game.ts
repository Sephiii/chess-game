import { ChessBoard } from './Board.js';
import { GameRules } from './GameRules.js';
import { Color, Position, GameState } from './types.js';
import { Pawn } from './pieces/Pawn.js';

export class ChessGame {
    private board: ChessBoard;
    private currentPlayer: Color = 'white';
    private selectedSquare: Position | null = null;
    private gameState: GameState = {
        status: 'ongoing',
        winner: null
    };

    constructor() {
        this.board = new ChessBoard();
    }

    async init(): Promise<void> {
        await this.board.init();
        this.setupEventListeners();
        this.updateStatus();
    }

    private setupEventListeners(): void {
        const canvas = this.board.getCanvas();
        canvas.addEventListener('click', (e: MouseEvent) => this.handleClick(e));
    }

    private handleClick(event: MouseEvent): void {
        if (this.gameState.status === 'checkmate' || this.gameState.status === 'stalemate') {
            return;
        }

        const rect = this.board.getCanvas().getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const clickedSquare = this.board.getSquareFromCoords(x, y);

        // Vérifier si la case est valide
        if (!this.isValidSquare(clickedSquare)) {
            return;
        }

        if (!this.selectedSquare) {
            this.handlePieceSelection(clickedSquare);
        } else {
            this.handlePieceMove(clickedSquare);
        }
    }

    private isValidSquare(position: Position): boolean {
        return position.row >= 0 && position.row < 8 && 
               position.col >= 0 && position.col < 8;
    }

    private handlePieceSelection(square: Position): void {
        const piece = this.board.getPiece(square.row, square.col);
        if (piece && piece.color === this.currentPlayer) {
            this.selectedSquare = square;
            this.board.selectSquare(square);
        }
    }

    private handlePieceMove(targetSquare: Position): void {
        if (!this.selectedSquare) return;

        // Vérifier si on clique sur la même case
        if (this.selectedSquare.row === targetSquare.row && 
            this.selectedSquare.col === targetSquare.col) {
            this.board.clearSelection();
            this.selectedSquare = null;
            return;
        }

        // Tenter le déplacement
        if (this.makeMove(this.selectedSquare, targetSquare)) {
            this.afterMove();
        }

        this.board.clearSelection();
        this.selectedSquare = null;
    }

    private makeMove(from: Position, to: Position): boolean {
        // Vérifier si le mouvement est valide
        if (!GameRules.validateMove(this.board, from, to)) {
            return false;
        }

        // Effectuer le mouvement
        const success = this.board.movePiece(from, to);
        if (success) {
            this.handleSpecialMoves(from, to);
        }
        return success;
    }

    private handleSpecialMoves(from: Position, to: Position): void {
        const piece = this.board.getPiece(to.row, to.col);
        if (!piece) return;

        // Gestion de la promotion des pions
        if (piece instanceof Pawn) {
            if ((piece.color === 'white' && to.row === 0) ||
                (piece.color === 'black' && to.row === 7)) {
                this.handlePromotion(to);
            }
        }
    }

    private handlePromotion(position: Position): void {
        // Pour l'instant, on promeut automatiquement en Dame
        // TODO: Ajouter une interface utilisateur pour choisir la pièce
        const piece = this.board.getPiece(position.row, position.col);
        if (piece) {
            this.board.promotePawn(position, 'queen');
        }
    }

    private afterMove(): void {
        this.resetEnPassant();
        this.switchPlayer();
        this.updateGameState();
    }

    private resetEnPassant(): void {
        this.board.resetEnPassant();
    }

    private switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateStatus();
    }

    private updateGameState(): void {
        this.gameState = GameRules.getGameStatus(this.board, this.currentPlayer);
        
        if (this.gameState.status === 'check' || this.gameState.status === 'checkmate') {
            const kingPos = GameRules.findKing(this.board, this.currentPlayer);
            if (kingPos) {
                this.board.highlightCheck(kingPos);
            }
        }

        this.updateStatus();
    }

    private updateStatus(): void {
        const statusElement = document.getElementById('current-player');
        if (!statusElement) return;

        let statusText = `Tour du joueur : ${this.currentPlayer}`;

        switch (this.gameState.status) {
            case 'check':
                statusText += ' - ÉCHEC !';
                break;
            case 'checkmate':
                statusText = `ÉCHEC ET MAT ! ${this.gameState.winner === 'white' ? 'Blancs' : 'Noirs'} gagnent!`;
                break;
            case 'stalemate':
                statusText = 'PAT - Match nul!';
                break;
        }

        statusElement.textContent = statusText;
    }

    // Méthodes publiques pour le contrôle du jeu
    public restart(): void {
        this.board = new ChessBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameState = { status: 'ongoing', winner: null };
        this.board.init();
        this.updateStatus();
    }

    public getCurrentState(): GameState {
        return { ...this.gameState };
    }

    public getCurrentPlayer(): Color {
        return this.currentPlayer;
    }
}