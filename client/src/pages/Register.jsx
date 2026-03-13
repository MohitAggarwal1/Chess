import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ChevronLeft, ArrowRight, ShieldCheck, Trophy, Stars } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const success = await register(formData.username, formData.email, formData.password);
            if (success) navigate('/game');
            else setError('Registration failed. Username or email might be taken.');
        } catch (err) {
            setError('Connection error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex selection:bg-gold-primary selection:text-black">
            {/* Left: Branding & Graphic */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                <Link to="/" className="flex items-center gap-3 font-display text-3xl font-black text-white z-10 group">
                    <div className="w-12 h-12 bg-gold-primary rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                        <svg viewBox="0 0 40 40" className="w-8 h-8 fill-black"><path d="M20 5l5 10h-2v10h4v-10h-2l5-10zM12 30h16v3h-16z" /></svg>
                    </div>
                    Chess<span className="text-gold-primary italic">.in</span>
                </Link>

                <div className="z-10 max-w-lg">
                    <div className="flex items-center gap-3 text-gold-primary font-black mb-6 tracking-[0.2em] uppercase text-xs">
                        <Stars className="w-5 h-5" /> Start Your Legacy
                    </div>
                    <h2 className="text-6xl font-black text-white leading-tight mb-8 tracking-tighter">Join the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-gold-light">Elite Tier</span></h2>
                    <p className="text-grey-light text-xl font-medium leading-relaxed opacity-80">Join 150M+ masters in the world's most premium chess environment. Your path to Grandmaster starts here.</p>
                </div>

                <div className="z-10 flex items-center gap-10 text-text-muted font-black uppercase text-[10px] tracking-widest border-t border-white/5 pt-10">
                    <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-gold-primary" /> Ranked Ladder</div>
                    <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold-primary" /> Anti-Cheat Verified</div>
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="w-full max-w-md bg-dark-surface p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 blur-3xl group-hover:scale-150 transition-all duration-700" />

                    <Link to="/" className="lg:hidden flex items-center gap-2 text-text-muted hover:text-white mb-10 text-sm font-black uppercase tracking-widest transition-all">
                        <ChevronLeft className="w-4 h-4" /> Home
                    </Link>

                    <header className="mb-12">
                        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Create Account</h1>
                        <p className="text-text-secondary font-medium">Define your new digital identity.</p>
                    </header>

                    {error && (
                        <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 text-red-400 text-sm animate-in shake duration-500">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-bold leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Unique Username</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="TheMagnus_2.0"
                                    className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-gold-primary/30 focus:shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all placeholder:text-text-muted/40 font-bold"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Secure Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="master@chess.in"
                                    className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-gold-primary/30 focus:shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all placeholder:text-text-muted/40 font-bold"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="minimum 8 characters"
                                    className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-gold-primary/30 focus:shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all placeholder:text-text-muted/40 font-bold"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] relative overflow-hidden group/btn shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>Initiate Legacy <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-sm font-medium text-text-muted">
                        Already a member?{' '}
                        <Link to="/login" className="text-gold-primary font-black uppercase tracking-widest hover:underline ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
