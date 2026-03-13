import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, GraduationCap, ChevronRight, Play, Star, Clock, User, Filter, Sparkles, BookOpen, Trophy } from 'lucide-react';

const Learn = () => {
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Opening', 'Middle Game', 'Endgame', 'Strategy', 'Tactics'];

    const courses = [
        { title: 'The Royal Opening', level: 'Beginner', duration: '2.5h', icon: <BookOpen className="text-gold-primary" />, desc: 'Master the principles of a solid opening and control the center early.' },
        { title: 'Advanced Endgames', level: 'Grandmaster', duration: '4h', icon: <Trophy className="text-gold-primary" />, desc: 'Elite techniques for converting slight advantages into clinical victories.' },
        { title: 'The Art of Attack', level: 'Intermediate', duration: '3.5h', icon: <Sparkles className="text-gold-primary" />, desc: 'Coordinated piece placement and explosive tactical breakthroughs.' },
        { title: 'Pawn Structure Masterclass', level: 'Advanced', duration: '5h', icon: <Filter className="text-gold-primary" />, desc: 'Understand the skeleton of chess and how to exploit weaknesses.' },
        { title: 'Mental Fortitude', level: 'All Levels', duration: '1.5h', icon: <User className="text-gold-primary" />, desc: 'Psychology and decision-making under intense competitive pressure.' },
        { title: 'Speed Chess Secrets', level: 'Intermediate', duration: '2h', icon: <Clock className="text-gold-primary" />, desc: 'Thinking fast and staying accurate in blitz and bullet formats.' },
    ];

    const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="min-h-screen bg-dark-bg text-text-primary">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-20 lg:pt-32">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 text-gold-primary font-black mb-5 tracking-[0.2em] uppercase">
                                <GraduationCap className="w-7 h-7" />
                                Elite Academy
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">Learn from <br /> the <span className="text-gold-primary italic">Masters.</span></h1>
                            <p className="text-grey-light text-lg font-medium leading-relaxed">Unlock the hidden patterns of the game with our premium curriculum designed by World Champions.</p>
                        </div>

                        <div className="relative w-full md:w-[400px] group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-hover:text-gold-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search courses, masters, or topics..."
                                className="w-full bg-dark-surface border border-white/5 pl-14 pr-6 py-5 rounded-[1.5rem] focus:outline-none focus:border-gold-primary/30 focus:shadow-[0_0_40px_rgba(212,175,55,0.05)] transition-all text-sm font-bold placeholder:text-text-muted/50"
                            />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[280px_1fr] gap-16">
                        {/* Sidebar Filters */}
                        <aside className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div>
                                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6">Subject Pillars</h3>
                                <div className="flex flex-col gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilter(cat)}
                                            className={`flex items-center justify-between px-5 py-4 rounded-2xl font-black text-sm transition-all group ${filter === cat ? 'bg-gold-primary/10 text-gold-primary border border-gold-primary/20 shadow-lg shadow-gold-primary/5' : 'text-text-secondary hover:bg-white/5 border border-transparent'}`}
                                        >
                                            {cat}
                                            <ChevronRight className={`w-4 h-4 transition-transform ${filter === cat ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-dark-surface p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                <h4 className="text-sm font-black text-white mb-2 z-10 relative">Your Rank</h4>
                                <div className="text-3xl font-black text-gold-primary mb-6 z-10 relative">Aspirant</div>
                                <div className="h-2 bg-black/40 rounded-full overflow-hidden shadow-inner mb-4 z-10 relative">
                                    <div className="h-full bg-gold-primary w-[35%] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                </div>
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest z-10 relative">520 XP to Pro Level</p>
                            </div>
                        </aside>

                        {/* Course Grid */}
                        <div className="grid sm:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredCourses.map((course, idx) => (
                                <div key={idx} className="group bg-dark-card border border-white/5 rounded-[2.5rem] p-10 hover:border-gold-primary/30 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-500 flex flex-col items-start relative overflow-hidden backdrop-blur-sm">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-gold-primary/5 blur-[60px] group-hover:bg-gold-primary/10 transition-colors" />

                                    <div className="flex items-center justify-between w-full mb-10">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-gold-primary group-hover:text-black transition-all duration-500 shadow-inner">
                                            {React.cloneElement(course.icon, { className: 'w-8 h-8' })}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-gold-primary px-3 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full mb-2">
                                                {course.level}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-black uppercase tracking-tighter">
                                                <Clock className="w-3 h-3" /> {course.duration}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-gold-primary transition-colors tracking-tight leading-tight">{course.title}</h3>
                                    <p className="text-text-secondary text-sm mb-12 leading-relaxed font-medium line-clamp-2">{course.desc}</p>

                                    <button className="mt-auto w-full btn btn-outline py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 border-white/10 text-white hover:bg-gold-primary hover:text-black hover:border-gold-primary transition-all">
                                        Start Learning <Play className="w-3.5 h-3.5 fill-current" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Learn;
