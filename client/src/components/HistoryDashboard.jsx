import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiTrash2, FiClock, FiCheckCircle, FiFileText } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api/analyze/history';

export default function HistoryDashboard({ onViewResult }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setHistory(data);
    } catch (err) {
      console.error('History fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="loading-state">Loading History...</div>;

  return (
    <div className="history-page">
      <span className="section-label">Past Analyses</span>
      
      {history.length === 0 ? (
        <div className="empty-history">No analysis history found. Start by scanning a resume!</div>
      ) : (
        <div className="history-grid">
          {history.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card history-card"
              onClick={() => onViewResult(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="skill-pill match" style={{ margin: 0 }}>Score: {item.score}</span>
                <button onClick={(e) => deleteEntry(e, item._id)} className="delete-btn">
                  <FiTrash2 />
                </button>
              </div>

              <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '18px' }}>
                {item.verdict}
              </h4>
              
              <div className="history-meta" style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', gap: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiClock /> {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiCheckCircle /> {item.matchedSkills?.length} Skills
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
