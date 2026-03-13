import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChessBoard from '../components/ChessBoard';
import { Chess } from 'chess.js';
import { Zap, Lightbulb, ChevronRight, Share2, History, Target, Trophy, Sparkles } from 'lucide-react';

const Puzzles = () => {
    const [game, setGame] = useState(new Chess('r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4'));
    const [hint, setHint] = useState(null);
    const [solved, setSolved] = useState(false);

    const onMove = (fen) => {
        const newGame = new Chess(fen);
        setGame(newGame);
        if (newGame.isCheckmate()) setSolved(true);
    };

    return (
        <div className="min-h-screen bg-dark-bg text-text-primary">
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-12 lg:pt-32">
                <div className="grid lg:grid-cols-[1fr_420px] gap-10 max-w-7xl mx-auto">
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="bg-dark-surface p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gold-primary/5 blur-[40px] group-hover:scale-150 transition-transform duration-700" />
                            <div className="flex items-center gap-6 z-10 w-full">
                                <div className="w-16 h-16 bg-gold-primary/10 rounded-2xl flex items-center justify-center text-gold-primary border border-gold-primary/20 shadow-inner">
                                    <Target className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-2xl font-black text-white tracking-tight">Daily Puzzle</h1>
                                        <span className="bg-gold-primary/20 text-gold-primary text-[10px] px-2 py-0.5 rounded-full font-black border border-gold-primary/20">#48,291</span>
                                    </div>
                                    <p className="text-sm text-text-muted font-bold tracking-widest uppercase">Intermediate • 1400 ELO</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 z-10 bg-black/40 p-4 rounded-2xl border border-white/5 w-full md:w-auto">
                                <div className="text-center px-4">
                                    <span className="block text-2xl font-black text-gold-primary">1,420</span>
                                    <span className="text-[10px] text-text-muted uppercase font-black tracking-widest">Rating</span>
                                </div>
                                <div className="text-center px-4 border-l border-white/10">
                                    <span className="block text-2xl font-black text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-gold-primary" /> 12
                                    </span>
                                    <span className="text-[10px] text-text-muted uppercase font-black tracking-widest">Streak</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-[600px] mx-auto lg:mx-0">
                            <ChessBoard game={game} onMove={onMove} />
                        </div>
                        {solved && (
                            <div className="bg-gradient-to-br from-gold-primary/20 to-transparent border border-gold-primary/30 p-8 rounded-3xl animate-in zoom-in-95 duration-500 shadow-2xl relative text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-5 mb-4 text-gold-primary">
                                    <Trophy className="w-8 h-8" />
                                    <h2 className="text-3xl font-black tracking-tight">Spectacular!</h2>
                                </div>
                                <p className="text-lg text-grey-light font-medium leading-relaxed">You found the best move. Tactical awareness like this wins titles. Earned <span className="text-white font-black">+15 rating points</span>.</p>
                                <div className="mt-8 flex justify-center md:justify-start gap-4">
                                    <button className="btn btn-primary rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest">Next Puzzle</button>
                                    <button className="btn btn-ghost rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest">Analyze</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="bg-dark-surface rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-white/5">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
                                    <Lightbulb className="w-6 h-6 text-gold-primary" />
                                    Tactical Intelligence
                                </h2>
                            </div>
                            <div className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Mastery Progress</h3>
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                        <div className="flex justify-between text-xs font-black mb-3">
                                            <span className="text-white">5/10 PUZZLES TODAY</span>
                                            <span className="text-gold-primary">50%</span>
                                        </div>
                                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-gold-dark to-gold-primary w-1/2 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <button onClick={() => setHint('Look at f7')} className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-gold-primary/10 hover:border-gold-primary/20 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4 text-left">
                                            <Zap className="w-6 h-6 text-gold-primary group-hover:scale-110 transition-transform" />
                                            <div>
                                                <span className="block text-sm font-black text-white uppercase tracking-tight">Deploy Hint</span>
                                                <span className="text-xs text-text-muted font-bold">No penalty</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-gold-primary group-hover:translate-x-1 transition-all" />
                                    </button>
                                    {hint && (
                                        <div className="p-6 bg-gold-primary/5 border border-gold-primary/10 rounded-2xl text-sm text-gold-primary font-medium italic border-l-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            "{hint}"
                                        </div>
                                    )}
                                </div>
                                <div className="pt-4 grid grid-cols-2 gap-4">
                                    <button className="bg-white/5 border border-white/5 py-4 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group">
                                        <Share2 className="w-4 h-4 text-text-muted group-hover:text-gold-primary" /> Share
                                    </button>
                                    <button className="bg-white/5 border border-white/5 py-4 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group">
                                        <History className="w-4 h-4 text-text-muted group-hover:text-gold-primary" /> History
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-dark-surface rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 blur-3xl" />
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6">Motif Tags</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {['Elite Mate', 'f7 Sacrifice', 'Opening Trap', 'Tactics'].map(t => (
                                    <span key={t} className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black text-white/70 uppercase tracking-tighter hover:border-gold-primary/30 hover:text-gold-primary cursor-pointer transition-all">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Puzzles;
