import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, UploadCloud, Shield, CheckCircle, AlertCircle, Loader2, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IdentityCamera() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!videoFile) {
            setError('Please capture or upload an interview video first.');
            return;
        }

        const formData = new FormData();
        formData.append('candidate_id', id);
        formData.append('video', videoFile);

        setLoading(true);
        setError('');

        try {
            await axios.post('/api/verify-identity', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Proceed to final results dashboard
            navigate(`/results/${id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Identity Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 relative w-full">
            <div className="glow-orb w-[600px] h-[600px] bg-emerald-600/10 top-[-100px] right-[-100px]" />
            <div className="glow-orb w-[700px] h-[700px] bg-indigo-600/10 bottom-[-200px] left-[-200px]" />

            <div className="text-center max-w-2xl mb-10 relative z-10 mx-auto">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="bg-emerald-500/20 p-3 rounded-full border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
                    Identity Authentication
                </h1>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                    Step 2: Upload a short video interview. Our deepfake engine will analyze facial anomalies, blink consistency, and audio-visual synchronization.
                </p>
            </div>

            <div className="w-full max-w-xl card-3d p-8 md:p-12 rounded-[2rem] relative z-10 mx-auto">
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                        <p className="text-rose-200 text-sm font-medium">{error}</p>
                    </motion.div>
                )}

                <div className="space-y-8">
                    <div
                        className={`relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer ${videoFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-400'
                            }`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            capture="camcorder"
                            onChange={handleVideoChange}
                            className="hidden"
                        />

                        {!videoFile ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-110">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Capture or Upload Video</h3>
                                <p className="text-sm font-medium text-slate-400">Tap to open webcam/camera roll</p>
                            </div>
                        ) : (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                                    <Video className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-emerald-50 px-4 text-center break-all">{videoFile.name}</h3>
                                <div className="flex items-center gap-2 mt-3 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-xs font-bold tracking-wide uppercase">Video Secured</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!videoFile || loading}
                        className={`btn-primary-3d w-full py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-bold group bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 ${!videoFile ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                Analyzing Identity Elements...
                            </>
                        ) : (
                            <>
                                Authenticate Identity
                                {videoFile && <Shield className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />}
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => navigate(`/results/${id}`)}
                        disabled={loading}
                        className="w-full py-3 text-sm font-bold tracking-widest uppercase text-slate-500 hover:text-white transition-colors flex justify-center items-center gap-2"
                    >
                        Skip Video Verification (Layer 1 Only)
                    </button>
                </div>
            </div>
        </div>
    );
}
