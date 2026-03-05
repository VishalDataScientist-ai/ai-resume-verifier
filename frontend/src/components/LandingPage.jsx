import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ArrowRight, Code2, Cpu, FileCheck2, ShieldAlert, Github, FileText, GitBranch, Terminal, Activity, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        icon: <Code2 className="w-8 h-8 text-blue-400" />,
        title: "GitHub Intelligence",
        description: "Deep scan of commit history, repository language match, and activity consistency."
    },
    {
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        title: "NLP Skill Extraction",
        description: "Advanced spaCy models understand the nuances of technical resumes beyond keywords."
    },
    {
        icon: <ShieldAlert className="w-8 h-8 text-rose-400" />,
        title: "Risk Detection Engine",
        description: "Instantly flags suspicious experience gaps or skill-activity mismatches."
    },
    {
        icon: <FileCheck2 className="w-8 h-8 text-emerald-400" />,
        title: "ML Authenticity Score",
        description: "Composite 0-100% score based on triangulated evidence across multiple sources."
    }
];

const TiltCard = ({ feature, idx }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 1, 0.5, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
            className="card-3d p-8 rounded-[2rem] relative group cursor-crosshair will-change-transform"
        >
            <div style={{ transform: "translateZ(50px)" }} className="bg-slate-900/80 p-4 rounded-2xl inline-block mb-8 border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),_0_10px_20px_rgba(0,0,0,0.5)] transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500">
                {feature.icon}
            </div>
            <h3 style={{ transform: "translateZ(30px)" }} className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-fuchsia-400 transition-all duration-300">
                {feature.title}
            </h3>
            <p style={{ transform: "translateZ(20px)" }} className="text-slate-400 leading-relaxed font-medium">
                {feature.description}
            </p>
        </motion.div>
    );
};

const StepGraphics = ({ index, colorClass }) => {
    if (index === 0) {
        return (
            <div className="w-full h-full relative flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClass} p-[1px] z-20 shadow-[0_0_30px_rgba(59,130,246,0.5)]`}>
                    <div className="w-full h-full bg-[#0A0A14] rounded-2xl flex items-center justify-center">
                        <Github className="w-10 h-10 text-blue-400" />
                    </div>
                </motion.div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute w-64 h-64 rounded-full border border-white/5 border-dashed z-10 flex items-center justify-center">
                    <div className="absolute top-[-10px] w-6 h-6 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                    <div className="absolute bottom-[-10px] w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                </motion.div>
            </div>
        );
    }
    if (index === 1) {
        return (
            <div className="w-full h-full relative flex flex-col items-center justify-center gap-4">
                <div className="flex gap-4 items-center z-10">
                    <FileText className="w-12 h-12 text-fuchsia-400 opacity-80" />
                    <motion.div initial={{ width: 0 }} animate={{ width: 60 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }} className="h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" />
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-fuchsia-500/30">
                        <span className="text-fuchsia-300 font-mono text-xs font-bold">{"{ skills: ['React'] }"}</span>
                    </div>
                </div>
                <div className="w-48 h-32 bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden z-0">
                    <motion.div animate={{ y: [0, 100, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-full h-10 bg-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.3)] border-y border-fuchsia-500/50 absolute left-0" />
                    <div className="w-3/4 h-2 bg-white/20 rounded-full mb-3" />
                    <div className="w-full h-2 bg-white/10 rounded-full mb-3" />
                    <div className="w-5/6 h-2 bg-white/10 rounded-full mb-3" />
                    <div className="w-1/2 h-2 bg-white/20 rounded-full" />
                </div>
            </div>
        );
    }
    if (index === 2) {
        return (
            <div className="w-full h-full relative flex items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 border border-white/10 rounded-full border-dashed animate-[spin_15s_linear_infinite]" />
                    <svg className="absolute w-full h-full z-0 opacity-20" viewBox="0 0 100 100">
                        <polygon points="50,10 90,80 10,80" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4" />
                    </svg>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} className="absolute top-2 w-12 h-12 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                        <FileText className="w-5 h-5 text-indigo-400" />
                    </motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="absolute bottom-4 right-2 w-12 h-12 rounded-full bg-slate-800 border-2 border-rose-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                        <GitBranch className="w-5 h-5 text-rose-400" />
                    </motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }} className="absolute bottom-4 left-2 w-12 h-12 rounded-full bg-slate-800 border-2 border-violet-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                        <Terminal className="w-5 h-5 text-violet-400" />
                    </motion.div>
                    <motion.div animate={{ scale: [0.8, 1.1, 0.8] }} transition={{ duration: 3, repeat: Infinity }} className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 p-[2px] z-20">
                        <div className="w-full h-full bg-[#0A0A14] rounded-full flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }
    if (index === 3) {
        return (
            <div className="w-full h-full relative flex items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                        <circle cx="96" cy="96" r="80" className="stroke-white/5" strokeWidth="12" fill="none" />
                        <motion.circle cx="96" cy="96" r="80" className="stroke-emerald-400" strokeWidth="12" fill="none" strokeDasharray="502" initial={{ strokeDashoffset: 502 }} whileInView={{ strokeDashoffset: 502 - (502 * 0.98) }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }} className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            98<span className="text-2xl text-emerald-500/70">%</span>
                        </motion.span>
                    </div>
                </div>
                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 1.5, type: "spring" }} className="absolute -bottom-4 right-8 bg-slate-900 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-50 text-xs font-bold uppercase tracking-wider">Authentic</span>
                </motion.div>
            </div>
        );
    }
    return null;
};

export default function LandingPage() {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();

    // Parallax for hero
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    // Scroll 3D transform for the Dashboard Preview
    const dashboardRef = useRef(null);
    const { scrollYProgress: dashProgress } = useScroll({
        target: dashboardRef,
        offset: ["start end", "center center"]
    });
    const dashRotateX = useTransform(dashProgress, [0, 1], ["40deg", "0deg"]);
    const dashScale = useTransform(dashProgress, [0, 1], [0.8, 1]);
    const dashY = useTransform(dashProgress, [0, 1], ["100px", "0px"]);

    return (
        <div className="w-full relative flex flex-col items-center justify-center pt-24 pb-32 overflow-hidden perspective-1000">
            {/* Ambient Background Glowing Orbs */}
            <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/20 top-0 left-[-200px]" style={{ animationDelay: '0s' }} />
            <div className="glow-orb w-[500px] h-[500px] bg-fuchsia-600/20 top-[20%] right-[-100px]" style={{ animationDelay: '-5s' }} />
            <div className="glow-orb w-[800px] h-[800px] bg-emerald-600/10 bottom-[-200px] left-[10%]" style={{ animationDelay: '-10s' }} />
            {/* Extended glowing orbs for scroll depth */}
            <div className="glow-orb w-[700px] h-[700px] bg-purple-600/15 top-[150vh] right-[0%]" style={{ animationDelay: '-2s' }} />
            <div className="glow-orb w-[900px] h-[900px] bg-indigo-600/10 top-[250vh] left-[-300px]" style={{ animationDelay: '-7s' }} />

            {/* Hero Section */}
            <motion.div
                style={{ y: heroY, opacity: heroOpacity }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                className="text-center max-w-5xl relative z-10"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block mb-6 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(79,70,229,0.2)]"
                >
                    Next-Gen AI • Talent Authentication Engine
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
                    <span className="text-white drop-shadow-lg">Verify Skills.</span> <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 drop-shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                        Eliminate Resume Fraud.
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto leading-relaxed font-medium text-shadow-sm">
                    The first intelligence layer for technical hiring. We triangulate resumes with real
                    code activity and metadata to calculate <span className="text-white">true skill authenticity</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button
                        onClick={() => navigate('/upload')}
                        className="btn-primary-3d group flex items-center justify-center gap-3 px-10 py-5 text-lg w-full sm:w-auto"
                    >
                        Analyze Candidate
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </button>

                    <button
                        onClick={() => navigate('/book-demo')}
                        className="btn-secondary-3d px-10 py-5 text-lg border border-white/10 w-full sm:w-auto"
                    >
                        Book Enterprise Demo
                    </button>
                </div>
            </motion.div>

            {/* 3D Dashboard Preview (Scroll animated) */}
            <div className="w-full max-w-6xl mt-32 relative z-10 px-4" style={{ perspective: "1000px" }} ref={dashboardRef}>
                <motion.div
                    style={{
                        rotateX: dashRotateX,
                        scale: dashScale,
                        y: dashY,
                        transformStyle: "preserve-3d"
                    }}
                    className="w-full glass-panel rounded-[2.5rem] border border-white/20 p-2 shadow-[0_0_50px_rgba(79,70,229,0.3)] will-change-transform"
                >
                    <div className="bg-[#0A0A14] w-full h-[300px] md:h-[600px] rounded-[2rem] overflow-hidden flex flex-col items-center justify-center relative">
                        {/* Beautiful fake dashboard graphic inside */}
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-[#05050A]/90 z-10" />

                        {/* Decorative Top Bar */}
                        <div className="absolute top-4 left-4 flex gap-2 z-20">
                            <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 z-20 drop-shadow-lg tracking-tight">Authenticity Engine</h2>

                        {/* Fake UI Elements */}
                        <div className="absolute top-24 w-[90%] flex gap-4 md:gap-6 z-0">
                            {/* Box 1: Verified */}
                            <div className="flex-1 h-24 md:h-32 bg-white/5 rounded-2xl border border-white/10 shadow-inner p-4 flex flex-col justify-between overflow-hidden relative group">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl" />
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    Verified
                                </div>
                                <div className="text-2xl md:text-4xl font-black text-white">
                                    8,492
                                </div>
                            </div>

                            {/* Box 2: Candidates */}
                            <div className="flex-1 h-24 md:h-32 bg-white/5 rounded-2xl border border-white/10 shadow-inner p-4 flex flex-col justify-between overflow-hidden relative">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl" />
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    Processing
                                </div>
                                <div className="text-2xl md:text-4xl font-black text-white flex items-end gap-2">
                                    143
                                    <span className="text-xs text-emerald-400 font-bold mb-1 md:mb-2">+12%</span>
                                </div>
                            </div>

                            {/* Box 3: Fraud Caught */}
                            <div className="flex-1 h-24 md:h-32 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)] p-4 flex flex-col justify-between overflow-hidden relative">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/20 rounded-full blur-xl" />
                                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                                    Fraud Prevented
                                </div>
                                <div className="text-2xl md:text-4xl font-black text-white">
                                    1.2<span className="text-lg md:text-2xl text-indigo-400">k</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-52 md:top-64 w-[90%] h-40 md:h-64 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-center p-6 z-0 overflow-hidden">
                            {/* Decorative background grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-8">
                                <div className="w-full h-px bg-white/5" />
                                <div className="w-full h-px bg-white/5" />
                                <div className="w-full h-px bg-white/5" />
                                <div className="w-full h-px bg-white/5" />
                            </div>

                            {/* Animated Chart Bars */}
                            <div className="w-full h-full flex items-end justify-between px-4 gap-2 md:gap-4 relative z-10">
                                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((height, i) => (
                                    <div key={i} className="w-full bg-white/5 hover:bg-white/10 rounded-t-lg transition-colors relative group flex justify-center h-full">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${height}%` }}
                                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                            className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-indigo-600/50 to-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                                        />

                                        {/* Hover tooltip */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded tracking-wider shadow-lg transition-opacity whitespace-nowrap z-20">
                                            {height}% Match
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Overlay glow */}
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0A0A14] to-transparent pointer-events-none" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Premium 3D Features Grid */}
            <div
                className="w-full max-w-7xl mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 px-4"
                style={{ perspective: "1000px" }}
            >
                {features.map((feature, idx) => (
                    <TiltCard key={idx} feature={feature} idx={idx} />
                ))}
            </div>

            {/* How It Works - Scroll 3D sections */}
            <div className="w-full max-w-6xl mt-40 flex flex-col gap-32 relative z-10 px-4 pb-40">
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md"
                    >
                        Intelligence Pipeline
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto"
                    >
                        A seamless integration into your existing technical hiring workflow.
                    </motion.p>
                </div>

                {[
                    { title: "Connect Identity", desc: "Link the candidate's GitHub, GitLab, or portfolio. We instantly index their public digital footprint.", color: "from-blue-500 to-cyan-500", number: "01" },
                    { title: "Deep NLP Parsing", desc: "Our models parse the resume and extract nuanced technical claims, mapping them to a standardized ontology.", color: "from-purple-500 to-fuchsia-500", number: "02" },
                    { title: "Activity Triangulation", desc: "We cross-reference claimed skills with actual commit history, project complexity, and repository language stats.", color: "from-indigo-500 to-rose-500", number: "03" },
                    { title: "Authenticity Scoring", desc: "Receive a comprehensive report with a 0-100% trust score, verified skills list, and risk alerts.", color: "from-emerald-500 to-teal-500", number: "04" }
                ].map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100, rotateY: i % 2 === 0 ? 30 : -30, z: -100 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0, z: 0 }}
                        viewport={{ once: false, margin: "-10%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        style={{ perspective: "1000px" }}
                    >
                        <div className="flex-1 space-y-4">
                            <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b ${step.color} opacity-30`}>{step.number}</span>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{step.title}</h3>
                            <p className="text-lg text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                        </div>
                        <div className="flex-1 w-full relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className={`w-full aspect-video rounded-[2.5rem] bg-gradient-to-br ${step.color} p-[2px] opacity-90 card-3d relative z-10 transform transition-transform duration-700 group-hover:scale-105`}>
                                <div className="w-full h-full bg-[#0A0A14] rounded-[38px] flex items-center justify-center overflow-hidden relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10`} />
                                    <StepGraphics index={i} colorClass={step.color} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
