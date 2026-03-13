import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';

export const useChessGame = (initialFen = null, initialTime = 600) => {
    const [game, setGame] = useState(new Chess(initialFen || undefined));
    const [fen, setFen] = useState(game.fen());
    const [moveHistory, setMoveHistory] = useState([]);
    const [turn, setTurn] = useState('w');

    // Timers
    const [whiteTime, setWhiteTime] = useState(initialTime);
    const [blackTime, setBlackTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    // Game Status
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameResult, setGameResult] = useState(null);

    const timerRef = useRef(null);

    // Timer logic
    useEffect(() => {
        if (isActive && !isGameOver) {
            timerRef.current = setInterval(() => {
                if (turn === 'w') {
                    setWhiteTime((prev) => {
                        if (prev <= 0) {
                            handleGameOver('b', 'Time Out');
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    setBlackTime((prev) => {
                        if (prev <= 0) {
                            handleGameOver('w', 'Time Out');
                            return 0;
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, turn, isGameOver]);

    const handleGameOver = (winner, reason) => {
        setIsGameOver(true);
        setIsActive(false);
        setGameResult({ winner, reason });
    };

    const makeMove = useCallback((move) => {
        try {
            const result = game.move(move);
            if (result) {
                const newFen = game.fen();
                setGame(new Chess(newFen));
                setFen(newFen);
                setMoveHistory(game.history());
                setTurn(game.turn());

                if (!isActive) setIsActive(true);

                if (game.isGameOver()) {
                    let reason = 'Draw';
                    if (game.isCheckmate()) reason = 'Checkmate';
                    else if (game.isStalemate()) reason = 'Stalemate';
                    else if (game.isThreefoldRepetition()) reason = 'Repetition';

                    handleGameOver(game.turn() === 'w' ? 'b' : 'w', reason);
                }
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    }, [game, isActive]);

    const undoMove = useCallback(() => {
        game.undo();
        const newFen = game.fen();
        setGame(new Chess(newFen));
        setFen(newFen);
        setMoveHistory(game.history());
        setTurn(game.turn());
        if (moveHistory.length === 1) setIsActive(false);
    }, [game, moveHistory]);

    const resetGame = useCallback(() => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setMoveHistory([]);
        setTurn('w');
        setWhiteTime(initialTime);
        setBlackTime(initialTime);
        setIsActive(false);
        setIsGameOver(false);
        setGameResult(null);
    }, [initialTime]);

    const resign = useCallback(() => {
        handleGameOver(turn === 'w' ? 'b' : 'w', 'Resignation');
    }, [turn]);

    return {
        game,
        fen,
        moveHistory,
        turn,
        whiteTime,
        blackTime,
        isGameOver,
        gameResult,
        makeMove,
        undoMove,
        resetGame,
        resign,
        isActive
    };
};
