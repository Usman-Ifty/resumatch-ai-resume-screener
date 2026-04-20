import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiFileText, FiAward, FiSearch, FiArrowRight, FiBookOpen, FiZap } from 'react-icons/fi';
import axios from 'axios';

export default function DashboardHub({ onStartNewScan, userName }) {
  const [stats, setStats] = useState({ total: 0, avgScore: 0, topVerdict: 'N/A' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/analyze/history');
        if (data.length > 0) {
          const total = data.length;
          const avgScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / total);
          const verdicts = data.reduce((acc, curr) => {
            acc[curr.verdict] = (acc[curr.verdict] || 0) + 1;
            return acc;
          }, {});
          const topVerdict = Object.keys(verdicts).reduce((a, b) => verdicts[a] > verdicts[b] ? a : b);
          
          setStats({ total, avgScore, topVerdict });
        }
      } catch (err) {
        console.error('Stats fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-hub">
      <div className="welcome-section">
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 800 }}>Dashboard <span style={{ color: 'var(--neon-blue)' }}>Hub</span></h1>
          <p style={{ color: 'var(--text-dim)' }}>Welcome back, {userName}. Here is your career progress.</p>
        </div>
        <button className="neon-btn" style={{ width: 'auto', padding: '12px 25px' }} onClick={onStartNewScan}>
          <FiSearch /> New Analysis
        </button>
      </div>

      <div className="stats-grid">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <FiFileText size={24} color="var(--neon-blue)" />
          <span className="stat-val">{stats.total}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Scans</span>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <FiTrendingUp size={24} color="var(--neon-purple)" />
          <span className="stat-val">{stats.avgScore}%</span>
          <span style={{ fontSize: '13px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Average Match</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <FiAward size={24} color="var(--neon-pink)" />
          <span className="stat-val" style={{ fontSize: '24px', whiteSpace: 'nowrap' }}>{stats.topVerdict}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Primary Status</span>
        </motion.div>
      </div>

      <div className="guide-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <FiBookOpen color="var(--neon-blue)" size={24} />
          <h3 className="section-label" style={{ margin: 0, fontSize: '18px' }}>User Quick-Start Guide</h3>
        </div>
        
        <div className="guide-steps">
          <div className="guide-step">
            <div className="step-num">1</div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '5px' }}>Upload Resume</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Drag & drop up to 5 PDFs. The AI ranks them against the job description.</p>
            </div>
          </div>
          
          <div className="guide-step">
            <div className="step-num">2</div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '5px' }}>Analyze Gaps</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Review missing skills heatmap to see why you're missing out on roles.</p>
            </div>
          </div>
          
          <div className="guide-step">
            <div className="step-num">3</div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '5px' }}>Optimize & Applying</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Use generated Roadmaps and Cover Letters to boost your application success.</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
          <FiZap color="var(--neon-purple)" />
          <p style={{ fontSize: '13px', color: 'var(--text-main)' }}>
            <strong>Pro Tip:</strong> Add the AI-suggested bullet points to your resume to increase your score by up to 15% instantly!
          </p>
        </div>
      </div>
    </div>
  );
}
