import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChessBoard from '../components/ChessBoard';
import { useChessGame } from '../hooks/useChessGame';
import { getBestMove } from '../utils/chessAI';
import { Trophy, History, Flag, Share2, Settings, ChevronLeft, ChevronRight, RotateCcw, Clock, MoreVertical, Zap } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Game = () => {
    const [mode, setMode] = useState('computer'); // 'computer', 'friend', 'online'
    const [roomId, setRoomId] = useState('lobby');
    const [difficulty, setDifficulty] = useState('medium');

    const {
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
    } = useChessGame(null, 600);

    // Online Mode Socket Logic
    useEffect(() => {
        if (mode === 'online') {
            socket.emit('joinRoom', roomId);

            socket.on('move', (move) => {
                makeMove(move);
            });

            return () => {
                socket.off('move');
            };
        }
    }, [mode, roomId, makeMove]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Computer Move Logic
    useEffect(() => {
        if (mode === 'computer' && turn === 'b' && !isGameOver) {
            const timer = setTimeout(() => {
                const move = getBestMove(game, difficulty);
                if (move) makeMove(move);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [turn, mode, isGameOver, game, makeMove, difficulty]);

    const handleMove = (move) => {
        if (isGameOver) return false;
        const success = makeMove(move);
        if (success && mode === 'online') {
            socket.emit('move', { roomId, move });
        }
        return success;
    };

    return (
        <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-gold-primary selection:text-black">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-12 lg:pt-32">
                <div className="grid lg:grid-cols-[1fr_420px] gap-10 max-w-7xl mx-auto">

                    {/* Left: Board Area */}
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-700">
                        {/* Opponent Profile */}
                        <div className="flex items-center justify-between bg-dark-surface p-5 rounded-2xl border border-white/5 shadow-xl">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5">
                                    {mode === 'computer' ? '🤖' : '👤'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-black text-white text-lg tracking-tight">
                                            {mode === 'computer' ? `ChessIn Bot (${difficulty})` : mode === 'online' ? 'Opponent' : 'Black Player'}
                                        </h3>
                                        <span className="bg-gold-primary/10 text-gold-primary text-[10px] px-2 py-0.5 rounded-full font-black border border-gold-primary/20">
                                            {mode === 'computer' ? 'AI' : 'ELITE'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted font-bold tracking-widest uppercase flex items-center gap-2">
                                        <span className={`w-2 h-2 ${isActive && turn === 'b' ? 'bg-green-500 animate-pulse' : 'bg-grey-medium'} rounded-full`} />
                                        {isActive && turn === 'b' ? 'Thinking...' : 'Waiting'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-black/60 px-5 py-2.5 rounded-xl border border-white/5 font-mono text-2xl font-black text-gold-primary shadow-inner">
                                {formatTime(blackTime)}
                            </div>
                        </div>

                        {/* Chessboard Container */}
                        <div className="relative w-full max-w-[650px] mx-auto lg:mx-0">
                            <ChessBoard game={game} onMove={handleMove} />

                            {/* Game Over Overlay */}
                            {isGameOver && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl animate-in zoom-in-95 duration-300">
                                    <div className="bg-dark-surface border border-gold-primary/30 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm mx-4">
                                        <div className="w-20 h-20 bg-gold-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-primary/20">
                                            <Trophy className="w-10 h-10 text-gold-primary" />
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
                                            {gameResult?.winner === 'w' ? 'White Victorious' : gameResult?.winner === 'b' ? 'Black Victorious' : 'Draw Match'}
                                        </h2>
                                        <p className="text-gold-primary font-black uppercase tracking-widest text-xs mb-8">
                                            Won by {gameResult?.reason}
                                        </p>
                                        <button
                                            onClick={resetGame}
                                            className="w-full btn btn-primary py-4 rounded-2xl font-black tracking-widest uppercase text-sm"
                                        >
                                            Play Again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* My Profile */}
                        <div className="flex flex-col gap-4">
                            {mode === 'online' && !isActive && (
                                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                                    <input
                                        type="text"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        placeholder="Enter Room ID..."
                                        className="flex-1 bg-dark-surface border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-primary transition-all font-bold"
                                    />
                                    <div className="bg-gold-primary/10 text-gold-primary px-4 py-3 rounded-xl text-[10px] font-black uppercase flex items-center border border-gold-primary/20">
                                        ID Required
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between bg-dark-surface p-5 rounded-2xl border border-gold-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gold-primary rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/20">👤</div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-black text-white text-lg tracking-tight">
                                                {mode === 'friend' ? 'White Player' : 'You'}
                                            </h3>
                                            <span className="text-gold-primary text-[10px] font-black tracking-widest uppercase">Member</span>
                                        </div>
                                        <p className="text-xs text-text-muted font-bold tracking-widest uppercase flex items-center gap-2">
                                            <span className={`w-2 h-2 ${isActive && turn === 'w' ? 'bg-green-500 animate-pulse' : 'bg-grey-medium'} rounded-full`} />
                                            {isActive && turn === 'w' ? 'Your Turn' : 'Waiting'}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-black/60 px-5 py-2.5 rounded-xl border border-white/5 font-mono text-2xl font-black text-white shadow-inner">
                                    {formatTime(whiteTime)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Sidebar */}
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="bg-dark-surface rounded-[2.5rem] border border-white/5 flex flex-col h-[700px] shadow-2xl overflow-hidden">
                            {/* Header Tabs */}
                            <div className="flex p-2 bg-black/40 border-b border-white/5">
                                <button className="flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 border-gold-primary text-white bg-gold-primary/5 rounded-t-xl">Analysis</button>
                                <button className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors">Chat</button>
                                <button className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors">History</button>
                            </div>

                            {/* Move Notation List */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.02),transparent_70%)]">
                                <div className="grid grid-cols-[50px_1fr_1fr] gap-y-3">
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">P</div>
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">White</div>
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Black</div>

                                    <div className="col-span-3 h-px bg-white/5 mb-2" />

                                    {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                                        <React.Fragment key={i}>
                                            <div className="text-sm font-black text-text-muted py-2">{i + 1}.</div>
                                            <div className="font-bold text-white p-2 text-sm">{moveHistory[i * 2]}</div>
                                            <div className="font-bold text-white p-2 text-sm">{moveHistory[i * 2 + 1] || ''}</div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Action Toolbar */}
                            <div className="p-8 border-t border-white/5 bg-black/60 backdrop-blur-md">
                                <div className="grid grid-cols-4 gap-4 mb-8">
                                    <button
                                        onClick={undoMove}
                                        className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 group border border-transparent hover:border-white/10 transition-all text-text-muted hover:text-gold-primary"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Undo</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 group border border-transparent hover:border-white/10 transition-all opacity-40 cursor-not-allowed">
                                        <ChevronLeft className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Back</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 group border border-transparent hover:border-white/10 transition-all opacity-40 cursor-not-allowed">
                                        <ChevronRight className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Forward</span>
                                    </button>
                                    <button
                                        onClick={resetGame}
                                        className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 group border border-transparent hover:border-white/10 transition-all text-text-muted hover:text-gold-primary"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Reset</span>
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={resetGame} className="flex-1 btn btn-primary flex justify-center py-4 rounded-2xl font-black text-sm tracking-widest uppercase">
                                        New Game
                                    </button>
                                    <div className="relative group">
                                        <button className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 border border-white/10 group transition-all">
                                            <Settings className="w-6 h-6 text-text-muted group-hover:text-gold-primary" />
                                        </button>
                                        <div className="absolute bottom-full right-0 mb-4 w-48 bg-dark-surface border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-4 z-50">
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Mode Selection</p>
                                            <div className="flex flex-col gap-2">
                                                {['computer', 'friend', 'online'].map(m => (
                                                    <button
                                                        key={m}
                                                        onClick={() => setMode(m)}
                                                        className={`text-left px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${mode === m ? 'bg-gold-primary text-black' : 'hover:bg-white/5 text-white'}`}
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                            {mode === 'computer' && (
                                                <>
                                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-4 mb-4">Difficulty</p>
                                                    <div className="flex flex-col gap-2">
                                                        {['easy', 'medium', 'hard'].map(d => (
                                                            <button
                                                                key={d}
                                                                onClick={() => setDifficulty(d)}
                                                                className={`text-left px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${difficulty === d ? 'bg-gold-primary text-black' : 'hover:bg-white/5 text-white'}`}
                                                            >
                                                                {d}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-8">
                                    <button
                                        onClick={resign}
                                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-2"
                                    >
                                        <Flag className="w-4 h-4" /> Resign Match
                                    </button>
                                    <div className="flex gap-4 text-text-muted">
                                        <Share2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                                        <Settings className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Game;
