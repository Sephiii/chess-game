class PieceSprite {
    static sprites = {};
    static spriteSheet = null;
    static SPRITE_SIZE = 45;

    static async loadSprites() {
        return new Promise((resolve) => {
            // Simples cercles de couleur
            const canvas = document.createElement('canvas');
            const size = this.SPRITE_SIZE;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Créer un cercle blanc
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
            this.sprites['white'] = canvas.toDataURL();

            // Créer un cercle noir
            ctx.clearRect(0, 0, size, size);
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            this.sprites['black'] = canvas.toDataURL();

            resolve();
        });
    }

    static drawPiece(ctx, piece, x, y) {
        const color = piece.split('-')[0]; // Extraire la couleur ('white' ou 'black')
        const img = new Image();
        img.src = this.sprites[color];
        ctx.drawImage(img, x - this.SPRITE_SIZE/2, y - this.SPRITE_SIZE/2);
    }
}