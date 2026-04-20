import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLayout, FiClock, FiCpu, FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from './context/AuthContext';
import UploadForm from './components/UploadForm';
import ResultCard from './components/ResultCard';
import HistoryDashboard from './components/HistoryDashboard';
import AuthPage from './components/AuthPage';
import DashboardHub from './components/DashboardHub';
import './index.css';

function App() {
  const { user, logout, loading: authLoading } = useAuth();
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'scan' | 'history'

  const handleResults = (data) => {
    setResults(data);
    setError('');
    setView('scan'); // If in scan view, result will show.
  };

  const handleError = (msg) => {
    setError(msg);
    setResults([]);
  };

  const handleReset = () => {
    setResults([]);
    setError('');
  };

  if (authLoading) return <div className="loading-state">Initializing ResuMatch...</div>;

  if (!user) return <AuthPage />;

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => { setView('dashboard'); handleReset(); }}>
          <div className="logo-icon"><FiCpu /></div>
          <div className="logo-text">ResuMatch AI</div>
        </div>

        <div className="nav-links">
          <button 
            className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} 
            onClick={() => { setView('dashboard'); handleReset(); }}
          >
            <FiHome /> Home
          </button>
          <button 
            className={`nav-btn ${view === 'scan' ? 'active' : ''}`} 
            onClick={() => { setView('scan'); handleReset(); }}
          >
            <FiLayout /> Scanner
          </button>
          <button 
            className={`nav-btn ${view === 'history' ? 'active' : ''}`} 
            onClick={() => setView('history')}
          >
            <FiClock /> History
          </button>
          
          <div className="user-profile">
            <div className="profile-info">
              <FiUser />
              <span>{user.name.split(' ')[0]}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              <FiLogOut />
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <DashboardHub userName={user.name} onStartNewScan={() => setView('scan')} />
            </motion.div>
          )}

          {view === 'scan' && (
            results.length === 0 ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <header className="app-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '10px' }}>
                    Next-Gen Resume <span style={{ color: 'var(--neon-blue)' }}>Intelligence</span>
                  </h1>
                  <p className="tagline" style={{ fontSize: '18px' }}>
                    Batch Rank Resumes · Identify Skill Gaps · Generate AI Improvements
                  </p>
                </header>

                <UploadForm
                  onResults={handleResults}
                  onError={handleError}
                  loading={loading}
                  setLoading={setLoading}
                />
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="error-banner" 
                    style={{ marginTop: '20px', textAlign: 'center' }}
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <ResultCard results={results} onReset={handleReset} />
              </motion.div>
            )
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <HistoryDashboard onViewResult={(item) => {
                setResults([item]);
                setView('scan');
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <div className="author-badge">
          Designed & Developed by <span className="author-name">Muhammad Usman Awan</span> 🚀
        </div>
        <p style={{ marginTop: '20px', color: 'var(--text-dim)', fontSize: '12px' }}>
          Official ResuMatch Release v2.1.0 · Secure Session Activity
        </p>
      </footer>
    </div>
  );
}

export default App;
