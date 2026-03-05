import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Frontend Password Validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('Password must be at least 8 characters long and contain both letters and numbers.');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post('/api/forgot-password', {
                email,
                new_password: newPassword
            });
            setSuccess(res.data.message || 'Password successfully reset!');
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Please check your email and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center relative px-4 py-24 w-full">
            {/* Background Orbs */}
            <div className="glow-orb w-[500px] h-[500px] bg-rose-600/20 top-0 left-[-20%] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="glow-orb w-[600px] h-[600px] bg-orange-600/10 bottom-[-10%] right-[-10%] animate-pulse" style={{ animationDuration: '5s' }} />

            <div className="card-3d w-full max-w-md p-8 md:p-10 rounded-3xl relative z-10 w-full">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                        <ShieldAlert className="w-8 h-8 text-rose-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Reset Password</h2>
                    <p className="text-slate-400 mt-2 text-sm">Create a new secure password for your account.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/50 text-rose-400 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm text-center font-medium">
                        {success} Redirecting to sign in...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all font-medium"
                                placeholder="you@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="btn-primary-3d w-full py-4 rounded-xl flex items-center justify-center gap-2 group mt-8 text-base font-bold bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 border-none before:hidden"
                        style={{ boxShadow: '0 0 20px rgba(244,63,94,0.3)' }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        Remember your password?{' '}
                        <Link to="/signin" className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 font-bold hover:underline decoration-orange-400 underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
