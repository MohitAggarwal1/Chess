import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, User, LogIn, Menu, X, Bell } from 'lucide-react';
import logo from '../assets/chesslogo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Play', path: '/game', dropdown: ['Online', 'Computer', 'Friend'] },
        { name: 'Puzzles', path: '/puzzles', dropdown: ['Daily Puzzle', 'Tactics', 'Rush'] },
        { name: 'Learn', path: '/learn', dropdown: ['Courses', 'Openings', 'Endgames'] },
        { name: 'Watch', path: '#', dropdown: ['Events', 'Players', 'TV'] },
        { name: 'Community', path: '#', dropdown: ['News', 'Clubs', 'Blog'] },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-[1000] h-16 transition-all duration-300 ${isScrolled ? 'bg-black/95 shadow-lg border-gold-primary/10' : 'bg-transparent'} border-b border-white/5 backdrop-blur-sm`}>
            <nav className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-4">
                {/* Left Section: Logo & Links */}
                <div className="flex items-center gap-10">
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

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group/item">
                                <Link
                                    to={link.path}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${location.pathname === link.path ? 'text-white bg-white/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                                >
                                    {link.name}
                                    <ChevronDown className={`w-3 h-3 opacity-40 group-hover/item:text-gold-primary transition-colors`} />
                                </Link>

                                {/* Dropdown */}
                                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 translate-y-1 group-hover/item:translate-y-0">
                                    <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl min-w-[200px] p-2 backdrop-blur-xl">
                                        {link.dropdown.map((item) => (
                                            <Link
                                                key={item}
                                                to="#"
                                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-gold-primary/10 hover:text-gold-primary transition-all font-medium"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-3">
                    <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                        <Search className="w-5 h-5" />
                    </button>

                    <div className="hidden md:flex items-center gap-3 ml-2">
                        <Link to="/login" className="btn btn-ghost px-5 py-2.5 text-sm">
                            Log In
                        </Link>
                        <Link to="/register" className="btn btn-primary px-6 py-2.5 text-sm rounded-xl">
                            Sign Up
                        </Link>
                    </div>

                    <button
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-white hover:bg-white/5 transition-all border border-white/10"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-dark-bg/98 backdrop-blur-xl z-[900] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col p-6 gap-2">
                        {navLinks.map((link) => (
                            <div key={link.name} className="border-b border-white/5">
                                <Link
                                    to={link.path}
                                    className="py-5 font-black text-xl text-white flex justify-between items-center group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                    <ChevronDown className="w-5 h-5 text-gold-primary" />
                                </Link>
                            </div>
                        ))}
                        <div className="flex flex-col gap-4 mt-10">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost w-full justify-center py-4 text-lg">Log In</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary w-full justify-center py-4 text-lg rounded-2xl shadow-xl">Sign Up</Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
