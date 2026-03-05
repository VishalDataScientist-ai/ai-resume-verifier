import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UploadDashboard from './components/UploadDashboard';
import ResultsDashboard from './components/ResultsDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import BookDemoPage from './components/BookDemoPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
import IdentityCamera from './components/IdentityCamera';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Footer from './components/Footer';
import { ShieldCheck, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        {/* Futuristic Floating Navigation */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
          <div className="glass-panel px-6 py-4 flex justify-between items-center rounded-3xl backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 p-2.5 rounded-2xl group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">
                Nexus AI
              </span>
            </Link>
            <div className="flex gap-4 md:gap-6 items-center">
              <Link to="/upload" className="relative group px-3 py-2">
                <span className="absolute inset-0 w-full h-full bg-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                <span className="relative text-sm font-bold text-slate-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-fuchsia-400 transition-all duration-300 inline-block transform group-hover:-translate-y-0.5">
                  Verify Candidate
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
              </Link>
              <Link to="/recruiter" className="relative group px-3 py-2">
                <span className="absolute inset-0 w-full h-full bg-fuchsia-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                <span className="relative text-sm font-bold text-slate-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-fuchsia-400 group-hover:to-rose-400 transition-all duration-300 inline-block transform group-hover:-translate-y-0.5">
                  Recruiter Hub
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-fuchsia-500 to-rose-500 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
              </Link>
              {user ? (
                <div className="flex items-center gap-3 ml-2">
                  <Link to="/profile" className="group flex items-center gap-2 text-sm font-medium text-slate-300 bg-white/5 hover:bg-indigo-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all duration-300 transform hover:-translate-y-1">
                    <User className="w-4 h-4 text-indigo-400 group-hover:text-fuchsia-400 transition-colors" />
                    <span className="truncate max-w-[150px] group-hover:text-white transition-colors">{user.email}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="group p-2 text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/20 rounded-xl border border-transparent hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all duration-300 transform hover:-translate-y-1"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <Link to="/signin" className="btn-primary-3d px-6 py-2.5 text-sm ml-2">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadDashboard />} />
            <Route path="/verify-identity/:id" element={<IdentityCamera />} />
            <Route path="/results/:id" element={<ResultsDashboard />} />
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/book-demo" element={<BookDemoPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        {/* Advanced Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
