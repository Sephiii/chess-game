class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.hasMoved = false;
    }

    getValidMoves(board) {
        // Cette méthode sera redéfinie par chaque type de pièce
        return [];
    }

    move(newPosition) {
        this.position = newPosition;
        this.hasMoved = true;
    }
}