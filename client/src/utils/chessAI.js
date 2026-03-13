const PIECE_VALUES = {
    p: 10,
    r: 50,
    n: 30,
    b: 35,
    q: 90,
    k: 900
};

const evaluateBoard = (game) => {
    let totalEvaluation = 0;
    const board = game.board();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            totalEvaluation += getPieceValue(board[i][j], i, j);
        }
    }
    return totalEvaluation;
};

const getPieceValue = (piece, x, y) => {
    if (piece === null) return 0;
    const absoluteValue = PIECE_VALUES[piece.type] || 0;
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

export const getBestMove = (game, difficulty = 'medium') => {
    const depth = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;
    const moves = game.moves();

    if (difficulty === 'easy') {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    let bestMove = null;
    const turn = game.turn();
    let bestValue = turn === 'w' ? -Infinity : Infinity;

    for (const move of moves) {
        game.move(move);
        const boardValue = minimax(game, depth - 1, -Infinity, Infinity, game.turn() === 'w');
        game.undo();

        if (game.turn() === 'w') {
            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        } else {
            if (boardValue < bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }
    }
    return bestMove || moves[Math.floor(Math.random() * moves.length)];
};

const minimax = (game, depth, alpha, beta, isMaximizingPlayer) => {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizingPlayer) {
        let bestValue = -Infinity;
        for (const move of moves) {
            game.move(move);
            bestValue = Math.max(bestValue, minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestValue);
            if (beta <= alpha) return bestValue;
        }
        return bestValue;
    } else {
        let bestValue = Infinity;
        for (const move of moves) {
            game.move(move);
            bestValue = Math.min(bestValue, minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
            game.undo();
            beta = Math.min(beta, bestValue);
            if (beta <= alpha) return bestValue;
        }
        return bestValue;
    }
};
