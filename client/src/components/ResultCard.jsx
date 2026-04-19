export default function ResultCard({ result, onReset }) {
  const { score, verdict, matchedSkills, missingSkills, reasoning } = result;

  const getScoreColor = (s) => {
    if (s >= 75) return '#a6e3a1';
    if (s >= 50) return '#89b4fa';
    if (s >= 30) return '#f9e2af';
    return '#f38ba8';
  };

  const getVerdictClass = (v) => {
    const map = {
      'Strong Match': 'verdict-strong',
      'Good Match': 'verdict-good',
      'Partial Match': 'verdict-partial',
      'Weak Match': 'verdict-weak',
    };
    return map[v] || 'verdict-partial';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="result-card">

      {/* Score Ring */}
      <div className="score-section">
        <svg width="130" height="130" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="45" fill="none" stroke="#313244" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="45" fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
          <text x="60" y="55" textAnchor="middle" fill={getScoreColor(score)}
            fontSize="22" fontWeight="bold" fontFamily="Arial">{score}</text>
          <text x="60" y="72" textAnchor="middle" fill="#6c7086"
            fontSize="11" fontFamily="Arial">/ 100</text>
        </svg>
        <div className={'verdict-badge ' + getVerdictClass(verdict)}>{verdict}</div>
      </div>

      {/* Reasoning */}
      <div className="reasoning-box">
        <h3 className="section-title">AI Analysis</h3>
        <p className="reasoning-text">{reasoning}</p>
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        <div className="skills-col">
          <h3 className="section-title matched-title">
            ✅ Matched Skills ({matchedSkills.length})
          </h3>
          <div className="skills-list">
            {matchedSkills.length > 0
              ? matchedSkills.map((s, i) => (
                  <span key={i} className="skill-tag matched">{s}</span>
                ))
              : <span className="no-skills">None detected</span>}
          </div>
        </div>
        <div className="skills-col">
          <h3 className="section-title missing-title">
            ❌ Missing Skills ({missingSkills.length})
          </h3>
          <div className="skills-list">
            {missingSkills.length > 0
              ? missingSkills.map((s, i) => (
                  <span key={i} className="skill-tag missing">{s}</span>
                ))
              : <span className="no-skills">None — great fit!</span>}
          </div>
        </div>
      </div>

      <button className="reset-btn" onClick={onReset}>
        ← Analyze Another Resume
      </button>
    </div>
  );
}
