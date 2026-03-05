import { Link } from 'react-router-dom';
import { ShieldCheck, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full mt-auto relative z-10 border-t border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 relative">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-1 flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-3 group w-fit">
                            <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">
                                Nexus AI
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Empowering recruiters with next-generation AI verification to build trust and streamline hiring.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Product</h4>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <Link to="/upload" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Verify Candidate
                                </Link>
                            </li>
                            <li>
                                <Link to="/recruiter" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Recruiter Hub
                                </Link>
                            </li>
                            <li>
                                <Link to="/book-demo" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Book a Demo
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Resources</h4>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-fuchsia-400 transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-fuchsia-400 transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    API Reference
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-fuchsia-400 transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-fuchsia-400 transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Case Studies
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Contact */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Company</h4>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contact@nexusai.com" className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 hover:translate-x-1 transform duration-200 group">
                                    <Mail className="w-3.5 h-3.5 group-hover:text-indigo-400" />
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Nexus AI Systems. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-xs text-slate-400 font-medium">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
