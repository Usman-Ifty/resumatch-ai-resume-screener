import { motion } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiAward, FiCheckCircle, FiXCircle, FiZap } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultCard({ results, onReset }) {
  // Sort results by score descending for ranking
  const sorted = [...results].sort((a, b) => b.score - a.score);

  const downloadPDF = async () => {
    const element = document.getElementById('print-area');
    const canvas = await html2canvas(element, { 
      backgroundColor: '#05050a',
      scale: 2
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ResuMatch-Analysis.pdf');
  };

  const getScoreColor = (s) => s >= 75 ? '#00f2ff' : s >= 50 ? '#bc13fe' : '#ff00ff';

  return (
    <div className="results-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="nav-btn" onClick={onReset}><FiArrowLeft /> Back</button>
        <button className="nav-btn" onClick={downloadPDF} style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>
          <FiDownload /> Download Report
        </button>
      </div>

      <div id="print-area">
        {sorted.map((res, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="glass-card" 
            style={{ marginBottom: '30px' }}
          >
            {results.length > 1 && (
              <div className="rank-badge" style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,242,255,0.1)', padding: '5px 15px', borderRadius: '20px', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)', fontWeight: 700 }}>
                # {idx + 1}
              </div>
            )}

            <div className="result-header">
              <div className="score-circle">
                <svg width="160" height="160" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={getScoreColor(res.score)}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - res.score / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ filter: `drop-shadow(0 0 8px ${getScoreColor(res.score)})` }}
                  />
                </svg>
                <div className="score-text">
                  <div className="score-val" style={{ color: getScoreColor(res.score) }}>{res.score}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Confidence</div>
                </div>
              </div>

              <div className="verdict-info">
                <p className="section-label">Analysis for {res.fileName || 'Resume'}</p>
                <h2 className="verdict-label">{res.verdict}</h2>
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>{res.reasoning}</p>
              </div>
            </div>

            {/* Keyword Heatmap */}
            <div className="heatmap-container">
              <div className="heatmap-box">
                <h3 className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCheckCircle color="var(--neon-blue)" /> Matched Strengths
                </h3>
                <div style={{ marginTop: '15px' }}>
                  {res.matchedSkills.length > 0 ? res.matchedSkills.map((s, i) => (
                    <span key={i} className="skill-pill match">{s}</span>
                  )) : <span style={{ color: 'var(--text-dim)' }}>No major matches found.</span>}
                </div>
              </div>

              <div className="heatmap-box">
                <h3 className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-pink)' }}>
                  <FiXCircle color="var(--neon-pink)" /> Critical Gaps
                </h3>
                <div style={{ marginTop: '15px' }}>
                  {res.missingSkills.length > 0 ? res.missingSkills.map((s, i) => (
                    <span key={i} className="skill-pill miss">{s}</span>
                  )) : <span style={{ color: 'var(--text-dim)' }}>Perfect alignment!</span>}
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(188, 19, 254, 0.05)', borderRadius: '18px', border: '1px solid rgba(188, 19, 254, 0.2)' }}>
              <h3 className="section-label" style={{ color: 'var(--neon-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiZap /> AI-Powered Improvement Plan
              </h3>
              <p style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--text-dim)' }}>
                Add these specific bullet points to your resume to increase your score immediately:
              </p>
              {res.suggestions?.map((s, i) => (
                <div key={i} className="suggestion-item">{s}</div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
