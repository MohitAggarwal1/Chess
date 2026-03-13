import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Youtube, Facebook, ShieldCheck, Mail, Globe, Lock } from 'lucide-react';
import logo from '../assets/chesslogo.png';

const Footer = () => {
    return (
        <footer className="bg-black pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Logo & About */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img
                                src={logo}
                                alt="Chess.in"
                                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="font-display text-2xl font-black text-white tracking-tighter">
                                Chess<span className="text-gold-primary italic">.in</span>
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed font-medium">
                            The world's premier platform for elite chess competition, advanced learning, and grandmaster-level training tools.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Youtube, Facebook].map((Icon, i) => (
                                <Link key={i} to="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-gold-primary hover:bg-gold-primary/10 hover:border-gold-primary/20 transition-all">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Ecosystem</h4>
                        <ul className="space-y-4">
                            {['Play Arena', 'Puzzles Rush', 'Course Library', 'Tournaments', 'Leaderboards'].map(link => (
                                <li key={link}>
                                    <Link to="#" className="text-text-secondary hover:text-gold-primary text-sm font-bold transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Intelligence</h4>
                        <ul className="space-y-4">
                            {['Analysis Tool', 'Opening Theory', 'Engine Stats', 'API Access', 'Fair Play Policy'].map(link => (
                                <li key={link}>
                                    <Link to="#" className="text-text-secondary hover:text-gold-primary text-sm font-bold transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Weekly Theoretical</h4>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-gold-primary transition-colors" />
                            <input
                                type="email"
                                placeholder="master@chess.in"
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-gold-primary/30 transition-all font-bold"
                            />
                        </div>
                        <button className="w-full btn btn-primary py-4 rounded-xl font-black text-[10px] uppercase tracking-widest">Subscribe for Updates</button>
                    </div>
                </div>

                {/* Global Stats or Security */}
                <div className="grid grid-cols-3 gap-8 p-10 bg-white/5 border border-white/5 rounded-[2rem] mb-20 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="w-8 h-8 text-gold-primary" />
                        <div>
                            <span className="block text-white font-black text-sm">Anti-Cheat</span>
                            <span className="text-[10px] text-text-muted uppercase font-black">Verified Engine</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Lock className="w-8 h-8 text-gold-primary" />
                        <div>
                            <span className="block text-white font-black text-sm">Secure Transact</span>
                            <span className="text-[10px] text-text-muted uppercase font-black">SSL Encrypted</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Globe className="w-8 h-8 text-gold-primary" />
                        <div>
                            <span className="block text-white font-black text-sm">Global CDN</span>
                            <span className="text-[10px] text-text-muted uppercase font-black">Low Latency</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                        &copy; 2026 CHESS.IN • THE GOLD STANDARD. ALL REGAL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-text-muted">
                        <Link to="#" className="hover:text-gold-primary transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-gold-primary transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-gold-primary transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
