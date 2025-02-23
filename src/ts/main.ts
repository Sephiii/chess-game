import { ChessGame } from './Game.js';

document.addEventListener('DOMContentLoaded', async () => {
    const game = new ChessGame();
    await game.init();

    document.getElementById('restart-btn')?.addEventListener('click', () => {
        game.restart();
    });
});