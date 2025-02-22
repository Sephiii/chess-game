class PieceSprite {
    static sprites = {};
    static spriteSheet = null;
    static SPRITE_SIZE = 45;

    static async loadSprites() {
        return new Promise((resolve) => {
            // Créer des cercles de couleur pour représenter temporairement les pièces
            const canvas = document.createElement('canvas');
            canvas.width = 6 * this.SPRITE_SIZE;
            canvas.height = 2 * this.SPRITE_SIZE;
            const ctx = canvas.getContext('2d');

            // Dessiner les pièces blanches
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(
                    i * this.SPRITE_SIZE + this.SPRITE_SIZE/2,
                    this.SPRITE_SIZE/2,
                    this.SPRITE_SIZE/3,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }

            // Dessiner les pièces noires
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(
                    i * this.SPRITE_SIZE + this.SPRITE_SIZE/2,
                    this.SPRITE_SIZE * 3/2,
                    this.SPRITE_SIZE/3,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = 'black';
                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.stroke();
            }

            this.spriteSheet = canvas;
            resolve();
        });
    }

    static getSpriteCoordinates(piece) {
        const types = {
            'king': 0,
            'queen': 1,
            'bishop': 2,
            'knight': 3,
            'rook': 4,
            'pawn': 5
        };

        const row = piece.startsWith('black') ? 1 : 0;
        const col = types[piece.split('-')[1]];
        return [col * this.SPRITE_SIZE, row * this.SPRITE_SIZE];
    }

    static drawPiece(ctx, piece, x, y) {
        if (!this.spriteSheet) return;

        const [spriteX, spriteY] = this.getSpriteCoordinates(piece);
        ctx.drawImage(
            this.spriteSheet,
            spriteX,
            spriteY,
            this.SPRITE_SIZE,
            this.SPRITE_SIZE,
            x - this.SPRITE_SIZE/2,
            y - this.SPRITE_SIZE/2,
            this.SPRITE_SIZE,
            this.SPRITE_SIZE
        );
    }
}