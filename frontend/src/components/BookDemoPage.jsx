import { useState } from 'react';
import axios from 'axios';
import { User, Mail, Building, Calendar, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookDemoPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        timeframe: 'ASAP'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post('/api/demo', formData);
            setStatus({ type: 'success', message: "Demo request received! Our team will contact you shortly to schedule your personalized session." });
            setFormData({ name: '', email: '', company: '', timeframe: 'ASAP' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.msg || "Failed to submit demo request. Please try again later." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-24 px-4 flex items-center justify-center relative overflow-hidden">
            <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/20 top-0 left-[-100px]" />
            <div className="glow-orb w-[700px] h-[700px] bg-emerald-600/10 bottom-[-200px] right-[-100px]" />

            <div className="max-w-xl w-full relative z-10 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg">
                        See Nexus AI in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Action</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-medium">
                        Schedule a 30-minute personalized demonstration to learn how we eliminate resume fraud and streamline your technical hiring process.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="card-3d p-8 md:p-12 rounded-[2rem]"
                >
                    {status.message && (
                        <div className={`mb-8 p-6 rounded-2xl flex items-start gap-4 border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                            {status.type === 'success' ? <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" />}
                            <p className="font-medium text-lg leading-relaxed">{status.message}</p>
                        </div>
                    )}

                    {!status.message && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wide ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium shadow-inner"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wide ml-1">Work Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium shadow-inner"
                                            placeholder="jane@company.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 uppercase tracking-wide ml-1">Company Name</label>
                                <div className="relative group">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium shadow-inner"
                                        placeholder="Tech Corp Inc."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 uppercase tracking-wide ml-1">Implementation Timeframe</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <select
                                        value={formData.timeframe}
                                        onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all shadow-inner appearance-none cursor-pointer"
                                    >
                                        <option value="ASAP" className="bg-[#0A0A14] text-white">As soon as possible</option>
                                        <option value="1-3 Months" className="bg-[#0A0A14] text-white">1 - 3 Months</option>
                                        <option value="3-6 Months" className="bg-[#0A0A14] text-white">3 - 6 Months</option>
                                        <option value="Just Exploring" className="bg-[#0A0A14] text-white">Just Exploring</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary-3d w-full py-5 rounded-xl flex items-center justify-center gap-3 mt-8 text-lg font-bold group bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 border-none before:hidden"
                                style={{ boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
                            >
                                {loading ? 'Processing Request...' : 'Schedule Live Demo'}
                                {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
