import { ChessGame } from './Game';

document.addEventListener('DOMContentLoaded', async () => {
    const game = new ChessGame();
    await game.init();

    document.getElementById('restart-btn')?.addEventListener('click', () => {
        game.restart();
    });
});