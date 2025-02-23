export class PieceSprite {
    private static spriteSheet: HTMLImageElement | null = null;
    private static readonly SPRITE_SIZE: number = 45;

    static async loadSprites(): Promise<void> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const size = this.SPRITE_SIZE;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            this.spriteSheet = canvas;

            // Utiliser un SVG simplifié pour les pièces
            const drawPiece = (color: string, outline: string) => {
                ctx.clearRect(0, 0, size, size);
                
                // Dessiner un cercle pour la pièce
                ctx.beginPath();
                ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = outline;
                ctx.lineWidth = 2;
                ctx.stroke();
            };

            // Créer les sprites
            drawPiece('white', 'black');
            drawPiece('black', 'white');

            resolve();
        });
    }

    static drawPiece(ctx: CanvasRenderingContext2D, piece: string, x: number, y: number): void {
        if (!this.spriteSheet) return;

        const [pieceColor, pieceType] = piece.split('-');
        const radius = this.SPRITE_SIZE / 3;

        // Dessiner la pièce
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = pieceColor;
        ctx.fill();
        ctx.strokeStyle = pieceColor === 'white' ? 'black' : 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ajouter un indicateur de type de pièce (optionnel)
        ctx.fillStyle = pieceColor === 'white' ? 'black' : 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pieceType[0].toUpperCase(), x, y);
    }
}