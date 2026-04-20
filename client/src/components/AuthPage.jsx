import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card auth-card"
      >
        <h2 className="verdict-label" style={{ textAlign: 'center', marginBottom: '30px' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <div className="input-with-icon">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="neon-textarea"
                  style={{ paddingLeft: '45px', height: '60px' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                className="neon-textarea"
                style={{ paddingLeft: '45px', height: '60px' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                className="neon-textarea"
                style={{ paddingLeft: '45px', height: '60px' }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          {error && <div className="error-banner" style={{ marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

          <button type="submit" className="neon-btn" disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                {isLogin ? 'Login to Dashboard' : 'Join ResuMatch'} <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-dim)', fontSize: '14px' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--neon-blue)', marginLeft: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
