import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Settings, CreditCard, Shield, Activity, X } from 'lucide-react';
import AccountSettingsModal from './AccountSettingsModal';

export default function ProfilePage({ user, setUser }) {
    const [stats, setStats] = useState({ total_analyzed: 0 });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/candidates', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats({ total_analyzed: res.data.length });
            } catch (err) {
                console.error("Failed to load stats", err);
            }
        };
        if (user) fetchStats();
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen py-24 px-4 relative">
            <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/10 top-0 left-[-10%]" />
            <div className="glow-orb w-[600px] h-[600px] bg-fuchsia-600/10 bottom-[-10%] right-[-10%]" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                        <User className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Account Overview</h1>
                        <p className="text-slate-400 text-lg font-medium">Manage your Nexus AI subscription and settings.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Profile Card */}
                    <div className="md:col-span-2 card-3d rounded-[2rem] p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Personal Info</h2>
                                <p className="text-slate-400 text-sm">Your secure identity profile</p>
                            </div>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="btn-secondary-3d px-4 py-2 text-sm flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" /> Edit
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="p-3 bg-indigo-500/10 rounded-xl">
                                    <Mail className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email Address</p>
                                    <p className="text-white font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Security</p>
                                    <p className="text-white font-medium">Password Authenticated</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="card-3d rounded-[2rem] p-8 bg-gradient-to-b from-fuchsia-500/10 to-indigo-500/5 relative overflow-hidden flex flex-col justify-center text-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-3xl rounded-full" />
                        <Activity className="w-10 h-10 text-fuchsia-400 mx-auto mb-4" />
                        <h3 className="text-5xl font-black text-white mb-2">{stats.total_analyzed}</h3>
                        <p className="text-fuchsia-300 font-bold tracking-widest uppercase text-sm">Resumes Verified</p>
                    </div>
                </div>

                {/* API Credits Section */}
                <div className="card-3d rounded-[2rem] p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <CreditCard className="w-6 h-6 text-amber-400" />
                        <h2 className="text-2xl font-bold text-white">API Credits & Billing</h2>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-amber-400 font-bold text-lg mb-1">Billing Portal Coming Soon</h3>
                            <p className="text-amber-200/70 text-sm">You are currently on the unlimited developer preview.</p>
                        </div>
                        <div className="hidden md:flex px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-bold uppercase tracking-wider">
                            Preview Active
                        </div>
                    </div>
                </div>

                {isSettingsOpen && <AccountSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} setUser={setUser} />}
            </div>
        </div>
    );
}
