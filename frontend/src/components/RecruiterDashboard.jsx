import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, CheckCircle, Clock, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/candidates', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCandidates(res.data);
            } catch (err) {
                setError('Failed to load active candidates.');
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const getScoreColor = (score) => {
        if (!score) return 'text-slate-500';
        if (score >= 80) return 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]';
        if (score >= 50) return 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]';
        return 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]';
    };

    return (
        <div className="min-h-screen py-24 px-4 relative">
            <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/10 top-[-10%] right-[-10%]" />
            <div className="glow-orb w-[800px] h-[800px] bg-fuchsia-600/10 bottom-[-20%] left-[-20%]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                                <Users className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Intelligence Hub</h1>
                        </div>
                        <p className="text-slate-400 text-lg font-medium">Monitor and verify your candidate pipeline in real-time.</p>
                    </div>

                    <Link to="/upload" className="btn-primary-3d px-8 py-3 rounded-xl flex items-center gap-2 font-bold">
                        <Activity className="w-5 h-5" />
                        New Verification
                    </Link>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/50 flex flex-row items-center gap-3 text-rose-300 font-medium">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.5)]"></div>
                        <p className="mt-6 text-indigo-300 font-bold tracking-widest uppercase text-sm animate-pulse">Synchronizing Pipeline...</p>
                    </div>
                ) : candidates.length === 0 ? (
                    <div className="card-3d p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 mb-6 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5">
                            <Users className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Your Pipeline is Empty</h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">Upload your first resume to see the deep authentication engine in action.</p>
                        <Link to="/upload" className="btn-primary-3d px-8 py-3 rounded-xl font-bold">Start Verifying</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidates.map((candidate, idx) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                                key={candidate.id}
                                className="group card-3d rounded-2xl p-6 relative flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                            >
                                <div className="absolute top-6 right-6 font-mono text-3xl font-black italic opacity-20 group-hover:opacity-40 transition-opacity">
                                    #{idx + 1}
                                </div>
                                <div className="mb-6 z-10">
                                    <h3 className="text-xl font-bold text-white mb-1 truncate pr-8">{candidate.name || 'Unknown Candidate'}</h3>
                                    <p className="text-sm font-medium text-indigo-400/80 uppercase tracking-widest">{candidate.job_role || 'Unspecified Role'}</p>
                                </div>

                                <div className="mt-auto z-10 flex items-end justify-between border-t border-white/10 pt-6">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Authenticity Score</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-4xl font-extrabold ${getScoreColor(candidate.overall_score)}`}>
                                                {Math.round(candidate.overall_score || 0)}
                                            </span>
                                            <span className="text-slate-500 font-bold">%</span>
                                        </div>
                                    </div>

                                    <Link to={`/results/${candidate.id}`} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 border border-white/5 transition-all text-slate-400 shrink-0">
                                        <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
