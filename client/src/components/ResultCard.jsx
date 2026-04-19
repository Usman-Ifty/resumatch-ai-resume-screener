import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiAward, FiCheckCircle, FiXCircle, FiZap, FiChevronDown, FiChevronUp, FiCopy, FiMap } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultCard({ results, onReset }) {
  const [showPreviews, setShowPreviews] = useState({});
  const [copied, setCopied] = useState(false);

  const togglePreview = (idx) => {
    setShowPreviews(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
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
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '20px' }}>{res.reasoning}</p>
                
                {/* ATS Health Badge */}
                <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>ATS FRIENDLINESS</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--neon-blue)' }}>{res.atsScore}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${res.atsScore}%` }} 
                      transition={{ duration: 1 }}
                      style={{ height: '100%', background: 'var(--neon-blue)', boxShadow: '0 0 10px var(--neon-blue)' }} 
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>"{res.atsFeedback}"</p>
                </div>
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

            {/* Career Roadmap */}
            <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(0, 242, 255, 0.05)', borderRadius: '18px', border: '1px solid rgba(0, 242, 255, 0.2)' }}>
              <h3 className="section-label" style={{ color: 'var(--neon-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMap /> Career Growth Roadmap
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                {res.roadmap?.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '30px', height: '30px', background: 'var(--neon-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 800, fontSize: '12px', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ color: 'var(--text-main)', fontSize: '14px' }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Cover Letter */}
            <div style={{ marginTop: '30px', padding: '30px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '18px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="section-label" style={{ margin: 0 }}>Customized Cover Letter</h3>
                <button 
                  className="nav-btn" 
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => {
                    navigator.clipboard.writeText(res.coverLetter);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? 'Copied!' : <><FiCopy style={{ marginRight: '5px' }} /> Copy</>}
                </button>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--text-dim)', fontSize: '14px', lineHeight: 1.8 }}>
                {res.coverLetter}
              </pre>
            </div>

            {/* Data Preview Section */}
            <div style={{ marginTop: '20px' }}>
              <button 
                className="nav-btn" 
                style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed' }}
                onClick={() => togglePreview(idx)}
              >
                {showPreviews[idx] ? <FiChevronUp /> : <FiChevronDown />} 
                {showPreviews[idx] ? 'Hide Source Data' : 'View Extracted Data & Job Description'}
              </button>

              <AnimatePresence>
                {showPreviews[idx] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="heatmap-container" style={{ marginTop: '20px' }}>
                      <div className="heatmap-box" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <span className="section-label">Extracted Resume Text</span>
                        <pre style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono' }}>
                          {res.resumeText}
                        </pre>
                      </div>
                      <div className="heatmap-box" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <span className="section-label">Job Description</span>
                        <pre style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono' }}>
                          {res.jobDescription}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
