import { useState } from 'react';
import UploadForm from './components/UploadForm';
import ResultCard from './components/ResultCard';
import './index.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResult = (data) => {
    setResult(data);
    setError('');
  };

  const handleError = (msg) => {
    setError(msg);
    setResult(null);
  };

  const handleReset = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">📄</span>
          <span className="logo-text">ResuMatch</span>
        </div>
        <p className="tagline">
          AI-powered resume screening — instantly match your resume to any job
        </p>
      </header>

      <main className="app-main">
        {!result ? (
          <>
            <UploadForm
              onResult={handleResult}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
            {error && <div className="error-banner">⚠️ {error}</div>}
          </>
        ) : (
          <ResultCard result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="app-footer">
        Built with Groq · LLaMA 3 70B · MERN Stack
      </footer>
    </div>
  );
}

export default App;
