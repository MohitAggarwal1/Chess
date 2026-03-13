import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Cpu, Users, GraduationCap, Zap, Trophy, ChevronRight, Star, ShieldCheck, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const [onlinePlayers, setOnlinePlayers] = useState(142683);
    const [gamesPlayed, setGamesPlayed] = useState(12847291);

    useEffect(() => {
        const interval = setInterval(() => {
            setOnlinePlayers(prev => prev + Math.floor(Math.random() * 5));
            setGamesPlayed(prev => prev + Math.floor(Math.random() * 2));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: 'Online Players', value: onlinePlayers.toLocaleString(), icon: <Globe className="w-4 h-4" /> },
        { label: 'Games Today', value: gamesPlayed.toLocaleString(), icon: <Play className="w-4 h-4 text-gold-primary" /> },
        { label: 'Active Masters', value: '2,840', icon: <Trophy className="w-4 h-4 text-gold-primary" /> },
    ];

    const gameModes = [
        { name: 'Play Online', desc: 'Ranked & Casual matches', icon: <Play />, badge: 'LIVE', color: 'gold' },
        { name: 'Vs Computer', desc: 'Sharpen your skills', icon: <Cpu />, badge: 'NEW', color: 'white' },
        { name: 'Play a Friend', desc: 'Invite via custom link', icon: <Users />, badge: 'FREE', color: 'grey' },
        { name: 'Daily Puzzles', desc: 'Master taktical patterns', icon: <Zap />, badge: 'HOT', color: 'gold' },
        { name: 'Pro Lessons', desc: 'Learn from Grandmasters', icon: <GraduationCap />, badge: 'PREMIUM', color: 'white' },
        { name: 'Tournaments', desc: 'Win exclusive prizes', icon: <Trophy />, badge: 'ARENA', color: 'gold' },
    ];

    return (
        <div className="min-h-screen bg-dark-bg">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
                {/* Background Gradients */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold-primary/5 blur-[150px]" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold-primary/10 blur-[120px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,0)_0%,rgba(10,10,10,1)_100%)]" />
                </div>

                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-gold-primary/10 border border-gold-primary/20 px-4 py-1.5 rounded-full text-gold-primary text-[10px] font-black tracking-[0.2em] mb-8 uppercase">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            THE GOLD STANDARD OF CHESS
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
                            Play <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary via-gold-light to-gold-primary animate-gradient">Elite</span> <br />
                            Chess Online.
                        </h1>

                        <p className="text-grey-light text-lg md:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Join <span className="text-white font-bold underline decoration-gold-primary decoration-2 underline-offset-4">150M+ players</span> and experience the most premium chess platform ever built.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-16">
                            <Link to="/game" className="btn btn-primary bg-gold-primary text-black font-black px-10 py-5 rounded-2xl shadow-2xl scale-110 md:scale-100">
                                Play Now
                            </Link>
                            <Link to="/learn" className="btn btn-outline border-white/20 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/5 backdrop-blur-md">
                                View Lessons
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-6 md:gap-12 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl max-w-2xl mx-auto lg:mx-0">
                            {stats.map((stat, idx) => (
                                <div key={stat.label} className="text-center md:text-left">
                                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                        {stat.icon}
                                        <span className="text-2xl md:text-3xl font-display font-black text-white">{stat.value}</span>
                                    </div>
                                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group hidden lg:block">
                        <div className="absolute inset-x-0 -bottom-10 h-20 bg-gold-primary/20 blur-[100px] animate-pulse rounded-full" />
                        <div className="relative aspect-square w-full max-w-[550px] mx-auto bg-[#1a1a1a] rounded-[2.5rem] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-2xl overflow-hidden border border-black/40">
                                {[...Array(64)].map((_, i) => {
                                    const row = Math.floor(i / 8);
                                    const col = i % 8;
                                    const isLight = (row + col) % 2 === 0;

                                    const pieces = {
                                        // Black pieces (b)
                                        4: { char: '♚', color: 'b' },
                                        3: { char: '♛', color: 'b' },
                                        6: { char: '♞', color: 'b' },
                                        13: { char: '♟', color: 'b' },
                                        18: { char: '♞', color: 'b' },
                                        25: { char: '♟', color: 'b' },
                                        11: { char: '♟', color: 'b' },
                                        // White pieces (w)
                                        60: { char: '♔', color: 'w' },
                                        59: { char: '♕', color: 'w' },
                                        57: { char: '♘', color: 'w' },
                                        28: { char: '♙', color: 'w' },
                                        36: { char: '♖', color: 'w' },
                                        35: { char: '♗', color: 'w' },
                                        42: { char: '♘', color: 'w' },
                                        44: { char: '♙', color: 'w' },
                                        52: { char: '♙', color: 'w' },
                                    };

                                    const piece = pieces[i];

                                    return (
                                        <div
                                            key={i}
                                            className={`${isLight ? 'bg-wood-light' : 'bg-wood-dark'} relative flex items-center justify-center wood-pattern`}
                                        >
                                            {piece && (
                                                <span
                                                    className={`text-4xl drop-shadow-2xl transition-all duration-700 select-none
                                                        ${piece.color === 'w' ? 'text-wood-piece-white' : 'text-wood-piece-black'}
                                                    `}
                                                    style={{
                                                        color: piece.color === 'w' ? 'var(--color-wood-piece-white)' : 'var(--color-wood-piece-black)',
                                                        WebkitTextStroke: piece.color === 'w' ? '1px rgba(0, 0, 0, 0.15)' : 'none'
                                                    }}
                                                >
                                                    {piece.char}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Game Modes */}
            <section className="bg-dark-surface py-32 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <div className="flex items-center gap-3 text-gold-primary font-bold mb-4">
                                <ShieldCheck className="w-6 h-6" />
                                <span className="text-sm tracking-widest uppercase">Elite Experience</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Premium Play Modes</h2>
                            <p className="text-grey-light text-lg max-w-xl">Every match is a tournament. Choose your battlefield and claim your throne.</p>
                        </div>
                        <Link to="#" className="btn btn-ghost border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10">Explore All Modes</Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gameModes.map((mode) => (
                            <div key={mode.name} className="group bg-dark-card border border-white/5 p-8 rounded-[2rem] hover:border-gold-primary/40 hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col items-start h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 blur-[40px] group-hover:bg-gold-primary/10 transition-colors" />

                                <div className="flex items-center justify-between w-full mb-8">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-white group-hover:bg-gold-primary group-hover:text-black transition-all duration-500 shadow-inner`}>
                                        {React.cloneElement(mode.icon, { className: 'w-8 h-8' })}
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${mode.color === 'gold' ? 'border-gold-primary text-gold-primary bg-gold-primary/5' : 'border-white/20 text-text-muted hover:text-white'} tracking-wider`}>
                                        {mode.badge}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-gold-primary transition-colors">{mode.name}</h3>
                                <p className="text-text-secondary text-sm mb-10 leading-relaxed">{mode.desc}</p>

                                <div className="mt-auto w-full flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-card bg-grey-dark" />)}
                                        <span className="text-xs text-text-muted ml-4 mt-2">1,2k playing</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-gold-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
