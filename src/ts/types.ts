export type Color = 'white' | 'black';
export type PieceType = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn';
export type GameStatus = 'ongoing' | 'check' | 'checkmate' | 'stalemate';

export interface Position {
    row: number;
    col: number;
}

export interface Move {
    from: Position;
    to: Position;
}

export interface GameState {
    status: GameStatus;
    winner: Color | null;
}

export interface ValidMove {
    row: number;
    col: number;
    type?: 'normal' | 'capture' | 'castle' | 'en-passant' | 'promotion';
}
