import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadDashboard() {
    const [file, setFile] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [leetcodeUrl, setLeetcodeUrl] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError('');
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const onButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validate File
        if (!file) {
            setError('Please upload a resume (PDF or DOCX).');
            return;
        }

        // 2. Validate Required Fields
        if (!jobRole.trim()) {
            setError('Expected Job Role is required.');
            return;
        }
        if (!githubUrl.trim() || !linkedinUrl.trim()) {
            setError('GitHub and LinkedIn links are strictly required.');
            return;
        }

        // 3. Validate URL Formats
        // Requires domain + path (e.g., github.com/user, meaning it rejects just "vishal")
        const urlPattern = /^((https?:\/\/)?([\w\d-]+\.)+\w{2,}\/.*)|(https?:\/\/.+)$/i;

        if (!urlPattern.test(githubUrl) && githubUrl.trim()) {
            setError('Invalid GitHub link. Please provide the full URL (e.g. github.com/username), not just the username.');
            return;
        }
        if (!urlPattern.test(linkedinUrl) && linkedinUrl.trim()) {
            setError('Invalid LinkedIn link. Please provide the full URL (e.g. linkedin.com/in/username), not just the username.');
            return;
        }

        // Portfolio is optional, so only validate if they didn't type "na" or something similar
        const portVal = portfolioUrl.trim().toLowerCase();
        if (portVal && portVal !== 'na' && portVal !== 'n/a' && !urlPattern.test(portfolioUrl)) {
            setError('Invalid Portfolio link. Please provide the full URL (e.g. https://yourwebsite.com).');
            return;
        }

        // LeetCode is optional, but if provided, must be a URL
        const leetVal = leetcodeUrl.trim().toLowerCase();
        if (leetVal && leetVal !== 'na' && leetVal !== 'n/a' && !urlPattern.test(leetcodeUrl)) {
            setError('Invalid LeetCode link. Please provide the full URL (e.g. https://leetcode.com/u/username).');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('job_role', jobRole);
        formData.append('github_username', githubUrl);
        formData.append('linkedin_url', linkedinUrl);
        formData.append('leetcode_url', leetcodeUrl);
        formData.append('portfolio_url', portfolioUrl);

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            navigate(`/verify-identity/${res.data.candidate_id || res.data.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 relative">
            {/* Ambient Background Glows */}
            <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/10 top-[-100px] right-[-100px]" />
            <div className="glow-orb w-[700px] h-[700px] bg-fuchsia-600/10 bottom-[-200px] left-[-200px]" />

            <div className="text-center max-w-2xl mb-12 relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
                    Verify Candidate
                </h1>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                    Upload a resume and optionally provide the target job role to generate a comprehensive authenticity and compatibility report.
                </p>
            </div>

            <div className="w-full max-w-2xl card-3d p-8 md:p-12 rounded-[2rem] relative z-10 mx-auto">
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                        <p className="text-rose-200 text-sm font-medium">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 relative">
                    {/* Drag and Drop Zone */}
                    <div
                        className={`relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden group cursor-pointer ${dragActive ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50'
                            } ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={onButtonClick}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleChange}
                            className="hidden"
                        />

                        {!file ? (
                            <>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2 ${dragActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'}`}>
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Drag & Drop Resume</h3>
                                <p className="text-sm font-medium text-slate-400">or click to browse local files</p>
                                <p className="text-xs text-slate-500 mt-2 font-mono">Supports: PDF, DOCX (Max 10MB)</p>
                            </>
                        ) : (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-emerald-50 px-4 text-center break-all">{file.name}</h3>
                                <div className="flex items-center gap-2 mt-3 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-xs font-bold tracking-wide uppercase">Ready for Analysis</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold tracking-wide text-slate-300 uppercase ml-1 block mb-2">Expected Job Role <span className="text-rose-500">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Senior Frontend Engineer"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium shadow-inner"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold tracking-wide text-slate-300 uppercase ml-1 block mb-2">GitHub Profile <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="https://github.com/username"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium text-sm shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold tracking-wide text-slate-300 uppercase ml-1 block mb-2">LinkedIn Profile <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="https://linkedin.com/in/username"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium text-sm shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold tracking-wide text-slate-300 uppercase ml-1 block mb-2">LeetCode Profile <span className="text-slate-500 lowercase normal-case font-medium">(Optional)</span></label>
                                <input
                                    type="text"
                                    placeholder="https://leetcode.com/u/username"
                                    value={leetcodeUrl}
                                    onChange={(e) => setLeetcodeUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium text-sm shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold tracking-wide text-slate-300 uppercase ml-1 block mb-2">Portfolio Website <span className="text-slate-500 lowercase normal-case font-medium">(Optional)</span></label>
                                <input
                                    type="text"
                                    placeholder="https://yourwebsite.com"
                                    value={portfolioUrl}
                                    onChange={(e) => setPortfolioUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium text-sm shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!file || loading}
                            className={`btn-primary-3d w-full py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-bold group ${!file ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                                    Starting Verification Engine...
                                </>
                            ) : (
                                <>
                                    Analyze & Verification
                                    {file && <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
