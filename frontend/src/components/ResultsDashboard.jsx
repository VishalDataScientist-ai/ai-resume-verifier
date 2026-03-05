import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Cpu, GitBranch, Terminal, ArrowLeft, Download, CheckCircle, XCircle, Camera, Activity, Volume2, Loader2, Linkedin, Code2, Globe, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';

export default function ResultsDashboard() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exporting, setExporting] = useState(false);
    const [showRawCv, setShowRawCv] = useState(false);
    const [cvViewMode, setCvViewMode] = useState('image');

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/candidates/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCandidate(res.data);
            } catch (err) {
                setError('Failed to load candidate results.');
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="w-20 h-20 border-4 border-fuchsia-500/30 border-t-fuchsia-400 rounded-full animate-[spin_1s_cubic-bezier(0.5,0,0.5,1)_infinite] shadow-[0_0_40px_rgba(217,70,239,0.5)]"></div>
                <p className="mt-8 text-fuchsia-300 font-bold tracking-widest uppercase text-sm animate-pulse">Running Deep Analysis Models...</p>
            </div>
        );
    }

    if (error || !candidate) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="card-3d p-8 text-center max-w-md w-full">
                    <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Analysis Error</h2>
                    <p className="text-slate-400 mb-6">{error || 'Candidate not found.'}</p>
                    <Link to="/recruiter" className="btn-secondary-3d px-6 py-2 inline-block">Return to Hub</Link>
                </div>
            </div>
        );
    }

    const skillScore = Math.round(candidate.authenticity_score || 0);
    const identityScore = candidate.identity_verification ? Math.round(candidate.identity_verification.identity_score) : null;
    const finalScore = candidate.final_trust_score !== null ? Math.round(candidate.final_trust_score) : skillScore;

    // Risk alerts based on dual layers
    const isHighRisk = candidate.risk_classification === "High" || finalScore < 50;

    const handleExportPDF = () => {
        setExporting(true);
        // Target the printable report div instead of the dashboard
        const element = document.getElementById('printable-report');

        // Unhide it momentarily for capture
        element.style.display = 'block';

        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `${candidate.name || 'Candidate'}_Verification_Report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            element.style.display = 'none';
            setExporting(false);
        }).catch(() => {
            element.style.display = 'none';
            setExporting(false);
        });
    };

    return (
        <div className="min-h-screen py-24 px-4 relative">
            {/* Hidden Printable Report */}
            <div id="printable-report" className="hidden bg-white text-black p-8 max-w-[800px] w-full mx-auto font-sans" style={{ display: 'none' }}>
                <div className="border-b-2 border-slate-200 pb-6 mb-8 text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nexus AI Verification</h1>
                    <p className="text-slate-500 font-medium mt-2">Comprehensive Candidate Analysis Report</p>
                </div>

                <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Candidate Profile</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Name</p>
                            <p className="text-lg font-medium text-slate-900">{candidate.name || 'Not Provided'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Role</p>
                            <p className="text-lg font-medium text-slate-900">{candidate.job_role || 'General'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</p>
                            <p className="text-lg font-medium text-slate-900">{candidate.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resume ID</p>
                            <p className="text-lg font-medium text-slate-900">#{candidate.id}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">AI Summary & Trust Score</h2>
                    <div className="flex items-start gap-8">
                        <div className="w-1/3 bg-slate-50 p-6 rounded-xl text-center border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Final Trust Score</p>
                            <p className={`text-6xl font-black ${isHighRisk ? 'text-rose-600' : 'text-emerald-600'}`}>{finalScore}%</p>
                        </div>
                        <div className="w-2/3">
                            <p className="text-slate-700 leading-relaxed text-lg">{candidate.ai_summary || "No AI summary available."}</p>
                            {isHighRisk && (
                                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-bold flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5" /> High Risk Factors Detected
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Skill Verification Snapshot</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="font-bold text-emerald-700 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Extracted Capabilities
                            </p>
                            <ul className="list-disc pl-5 text-slate-700 space-y-1">
                                {candidate.extracted_skills && candidate.extracted_skills.length > 0 ? (
                                    candidate.extracted_skills.map((s, i) => <li key={i} className="capitalize">{s}</li>)
                                ) : (
                                    <li className="italic text-slate-400">No verifiable skills found.</li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <p className="font-bold text-rose-700 mb-2 flex items-center gap-2">
                                <XCircle className="w-5 h-5" /> Missing Role Requirements
                            </p>
                            <ul className="list-disc pl-5 text-slate-700 space-y-1">
                                {candidate.missing_skills && candidate.missing_skills.length > 0 ? (
                                    candidate.missing_skills.map((s, i) => <li key={i} className="capitalize">{s}</li>)
                                ) : (
                                    <li className="italic text-slate-400">No missing skills detected for this role.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">External Presence Analysis</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">GitHub Analysis</p>
                            <p className="text-sm text-slate-700 mb-1"><span className="font-medium">URL:</span> {candidate.github_username ? `github.com/${candidate.github_username}` : 'N/A'}</p>
                            <p className="text-sm text-slate-700"><span className="font-medium">Skill Match:</span> {Math.round(candidate.github_score || 0)}%</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">LinkedIn Scan</p>
                            <p className="text-sm text-slate-700 mb-1 break-all"><span className="font-medium">URL:</span> {candidate.linkedin_url || 'N/A'}</p>
                            <p className="text-sm text-slate-700"><span className="font-medium">Skill Endorsement:</span> {Math.round(candidate.linkedin_score || 0)}%</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">LeetCode Proficiency</p>
                            <p className="text-sm text-slate-700 mb-1 break-all"><span className="font-medium">URL:</span> {candidate.leetcode_url || 'N/A'}</p>
                            <p className="text-sm text-slate-700"><span className="font-medium">Problem Solving:</span> {Math.round(candidate.leetcode_score || 0)}%</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Portfolio & Links</p>
                            <p className="text-sm text-slate-700 mb-1 break-all"><span className="font-medium">URL:</span> {candidate.portfolio_url || 'Not Provided'}</p>
                            <p className="text-sm text-slate-700"><span className="font-medium">Evidence Score:</span> {Math.round(candidate.portfolio_evidence_score || 0)}%</p>
                        </div>
                    </div>
                </div>

                {candidate.risk_alerts && candidate.risk_alerts.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                            <ShieldAlert className="w-6 h-6 text-rose-600" /> Detected Anomalies
                        </h2>
                        <div className="space-y-3">
                            {candidate.risk_alerts.map((alert, i) => (
                                <div key={i} className="bg-rose-50 border-l-4 border-rose-500 p-4">
                                    <p className="text-rose-800 font-medium">{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center mt-12 pt-8 border-t border-slate-200">
                    <p className="text-xs text-slate-400 font-mono">Generated securely by Nexus AI • Authenticity Layer Active</p>
                </div>
            </div>
            <div className="glow-orb w-[600px] h-[600px] bg-fuchsia-600/10 top-[-10%] right-[-10%]" />
            <div className="glow-orb w-[800px] h-[800px] bg-emerald-600/10 bottom-[-20%] left-[-20%]" />

            <div className="max-w-6xl mx-auto relative z-10" id="dashboard-content">
                <div id="export-nav-bar" className="mb-8 flex items-center justify-between">
                    <Link to="/recruiter" className="text-slate-400 hover:text-white flex items-center gap-2 font-medium transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Pipeline
                    </Link>
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="btn-secondary-3d px-4 py-2 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {exporting ? 'Exporting...' : 'Export PDF'}
                    </button>
                </div>

                <div className="card-3d rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl opacity-20 rounded-full ${isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'}`} />

                    <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center relative z-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{candidate.name || 'Anonymous Candidate'}</h1>
                            <p className="text-xl text-fuchsia-400 font-medium">{candidate.job_role || 'General SWE'}</p>
                            <div className="flex gap-4 mt-6">
                                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                    <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Resume ID</span>
                                    <span className="font-mono text-sm text-slate-300">#{candidate.id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 bg-[#0A0A14]/80 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Final Trust Score</h3>
                                <div className="text-6xl font-black tracking-tighter flex items-end">
                                    <span className={isHighRisk ? 'text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]'}>
                                        {finalScore}
                                    </span>
                                    <span className="text-3xl text-slate-500 mb-2">%</span>
                                </div>
                                {identityScore && (
                                    <p className="text-xs text-slate-500 mt-2 font-mono">
                                        (0.6 × Skill) + (0.4 × Identity)
                                    </p>
                                )}
                            </div>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] ${isHighRisk ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                {isHighRisk ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Component 1: Technical Stack Verify */}
                    <div className="card-3d p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Cpu className="w-6 h-6 text-fuchsia-400" />
                            <h3 className="text-xl font-bold text-white">Skill Verification</h3>
                        </div>
                        <ul className="space-y-4">
                            {candidate.extracted_skills?.map((skill, i) => (
                                <li key={`found-${i}`} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <span className="font-medium text-emerald-100">{skill}</span>
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                </li>
                            ))}
                            {candidate.missing_skills?.map((skill, i) => (
                                <li key={`miss-${i}`} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                    <span className="font-medium text-rose-200">{skill}</span>
                                    <XCircle className="w-5 h-5 text-rose-500/70" />
                                </li>
                            ))}

                            {/* Fallback if no skills processed */}
                            {(!candidate.extracted_skills || candidate.extracted_skills.length === 0) && (!candidate.missing_skills || candidate.missing_skills.length === 0) && (
                                <li className="text-slate-400 text-sm italic py-4 text-center">
                                    No specific skills required or extracted for this role.
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Component 2: Risk Factors */}
                    <div className="card-3d p-8 rounded-3xl relative overflow-hidden text-rose-100">
                        <div className="absolute inset-0 bg-rose-900/10 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <ShieldAlert className="w-6 h-6 text-rose-400" />
                            <h3 className="text-xl font-bold text-white">Risk Flags</h3>
                        </div>
                        {isHighRisk || (candidate.missing_skills && candidate.missing_skills.length > 0) ? (
                            <div className="space-y-4 relative z-10">
                                {candidate.missing_skills && candidate.missing_skills.length > 0 ? (
                                    <>
                                        <p className="font-bold text-rose-300 px-1 mb-2">Missing Required Skills</p>
                                        {candidate.missing_skills.map((skill, index) => (
                                            <div key={index} className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-3">
                                                <p className="font-bold text-rose-300">Skill Gap: {skill.charAt(0).toUpperCase() + skill.slice(1)}</p>
                                                <p className="text-sm text-rose-200 mt-1">This skill is missing from the resume but highly relevant for {candidate.job_role || 'this role'}.</p>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                                        <p className="font-bold text-rose-300">Unverifiable Open-Source Presence</p>
                                        <p className="text-sm text-rose-200 mt-1">Low GitHub or portfolio matches found.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-8 relative z-10">
                                <ShieldCheck className="w-12 h-12 text-emerald-500 mb-4 opacity-50" />
                                <p className="text-emerald-400 font-bold uppercase tracking-wider text-sm">No High Risk Factors</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* External Cross-Reference Engines */}
                <div className="card-3d p-8 rounded-3xl mt-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Globe className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-2xl font-bold text-white tracking-tight">External Identity & Skill Cross-Reference</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* GitHub */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <GitBranch className="w-6 h-6 text-slate-400 mb-4" />
                            <p className="text-sm font-bold text-slate-300 mb-1">GitHub Repos</p>
                            <p className="text-3xl font-black text-white">{Math.round(candidate.github_score || 0)}%</p>
                            <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wide">Deep Skill Match</p>
                        </div>
                        {/* LinkedIn */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <Linkedin className="w-6 h-6 text-[#0A66C2] mb-4" />
                            <p className="text-sm font-bold text-slate-300 mb-1">LinkedIn Scan</p>
                            <p className="text-3xl font-black text-white">{Math.round(candidate.linkedin_score || 0)}%</p>
                            <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wide">Skill Verification</p>
                        </div>
                        {/* LeetCode */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <Code2 className="w-6 h-6 text-[#FFA116] mb-4" />
                            <p className="text-sm font-bold text-slate-300 mb-1">LeetCode</p>
                            <p className="text-3xl font-black text-white">{Math.round(candidate.leetcode_score || 0)}%</p>
                            <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wide">Coding Proficiency</p>
                        </div>
                        {/* Portfolio */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <Terminal className="w-6 h-6 text-fuchsia-400 mb-4" />
                            <p className="text-sm font-bold text-slate-300 mb-1">Portfolio</p>
                            <p className="text-3xl font-black text-white">{Math.round(candidate.portfolio_evidence_score || 0)}%</p>
                            <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wide">Site Evidence</p>
                        </div>
                    </div>
                </div>

                {/* Raw CV Data Vault */}
                <div className="card-3d rounded-3xl mt-8 overflow-hidden">
                    <button
                        onClick={() => setShowRawCv(!showRawCv)}
                        className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-emerald-400" />
                            <h3 className="text-xl font-bold text-white text-left">Unstructured Data Vault <span className="text-slate-500 text-sm font-medium ml-2">- Raw Extracted CV</span></h3>
                        </div>
                        {showRawCv ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
                    </button>
                    {showRawCv && (
                        <div className="px-8 pb-8">
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setCvViewMode('image')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${cvViewMode === 'image' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}>
                                    Physical CV Document
                                </button>
                                <button
                                    onClick={() => setCvViewMode('text')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${cvViewMode === 'text' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}>
                                    Raw Extracted Text
                                </button>
                            </div>

                            {cvViewMode === 'image' ? (
                                <div className="bg-[#0A0A14] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                                    <FileText className="w-16 h-16 text-emerald-400 mb-4" />
                                    <h4 className="text-xl font-bold text-white mb-2">Physical Document Saved</h4>
                                    <p className="text-slate-400 text-sm mb-6 max-w-md">
                                        The raw document uploaded by the candidate ({candidate.cv_filename || 'document.pdf'}) has been securely archived in the Nexus Vault.
                                    </p>
                                    <a
                                        href={`http://127.0.0.1:5001/api/candidates/${candidate.id}/resume_download`}
                                        download
                                        className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        <Download className="w-5 h-5" /> Download Original CV
                                    </a>
                                </div>
                            ) : (
                                <div className="bg-[#0A0A14] border border-white/10 p-6 rounded-2xl max-h-96 overflow-y-auto custom-scrollbar">
                                    <pre className="text-slate-400 font-mono text-sm whitespace-pre-wrap">
                                        {candidate.resume_text || "No unstructured CV data was saved for this candidate."}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Component 3: Identity Engine (Deepfake Layer) */}
                {candidate.identity_verification ? (
                    <div className="card-3d p-8 rounded-3xl relative overflow-hidden mt-8">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <Camera className="w-6 h-6 text-indigo-400" />
                                <h3 className="text-2xl font-bold text-white tracking-tight">Identity Authenticity Meter</h3>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-4xl font-black ${identityScore < 60 ? 'text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`}>
                                    {identityScore}
                                </span>
                                <span className="text-slate-500 font-bold mb-1">%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <div className="bg-[#0A0A14]/50 border border-white/5 p-5 rounded-2xl flex flex-col items-center text-center">
                                <ShieldCheck className="w-8 h-8 text-fuchsia-400 mb-3" />
                                <p className="text-sm font-bold text-slate-300 mb-1">Face Anomaly</p>
                                <p className="text-xs text-slate-500 mx-auto max-w-[150px] mb-4">MesoNet CNN deepfake artifact sweep.</p>
                                <div className="w-full bg-white/5 rounded-full h-2 mt-auto overflow-hidden">
                                    <div className="bg-fuchsia-400 h-2 rounded-full" style={{ width: `${candidate.identity_verification.face_anomaly_score}%` }}></div>
                                </div>
                                <span className="text-xs font-bold font-mono text-fuchsia-300 mt-3">{Math.round(candidate.identity_verification.face_anomaly_score)}/100</span>
                            </div>

                            <div className="bg-[#0A0A14]/50 border border-white/5 p-5 rounded-2xl flex flex-col items-center text-center">
                                <Activity className="w-8 h-8 text-emerald-400 mb-3" />
                                <p className="text-sm font-bold text-slate-300 mb-1">Blink Consistency</p>
                                <p className="text-xs text-slate-500 mx-auto max-w-[150px] mb-4">EAR liveness variance validation.</p>
                                <div className="w-full bg-white/5 rounded-full h-2 mt-auto overflow-hidden">
                                    <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${candidate.identity_verification.blink_consistency_score}%` }}></div>
                                </div>
                                <span className="text-xs font-bold font-mono text-emerald-300 mt-3">{Math.round(candidate.identity_verification.blink_consistency_score)}/100</span>
                            </div>

                            <div className="bg-[#0A0A14]/50 border border-white/5 p-5 rounded-2xl flex flex-col items-center text-center">
                                <Volume2 className="w-8 h-8 text-indigo-400 mb-3" />
                                <p className="text-sm font-bold text-slate-300 mb-1">Audio-Visual Sync</p>
                                <p className="text-xs text-slate-500 mx-auto max-w-[150px] mb-4">SyncNet lip-to-audio manipulation.</p>
                                <div className="w-full bg-white/5 rounded-full h-2 mt-auto overflow-hidden">
                                    <div className="bg-indigo-400 h-2 rounded-full" style={{ width: `${candidate.identity_verification.audio_sync_score}%` }}></div>
                                </div>
                                <span className="text-xs font-bold font-mono text-indigo-300 mt-3">{Math.round(candidate.identity_verification.audio_sync_score)}/100</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card-3d p-8 rounded-3xl relative overflow-hidden mt-8 text-center flex flex-col items-center justify-center">
                        <Camera className="w-12 h-12 text-indigo-500 mx-auto mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold text-white mb-2">Identity Verification Pending</h3>
                        <p className="text-slate-400 mb-6 max-w-md">This candidate has not completed the Layer 2 Identity Authenticity check. Upload an interview video to generate the final Trust Score.</p>
                        <Link to={`/verify-identity/${candidate.id}`} className="btn-primary-3d px-6 py-3 rounded-xl inline-block font-bold">
                            Run Identity Verification Now
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
