import { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analyze';

export default function UploadForm({ onResult, onError, loading, setLoading }) {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (selected) => {
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      onError('Please upload a PDF file only.');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      onError('File size must be under 5MB.');
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { onError('Please upload your resume PDF.'); return; }
    if (jobDesc.trim().length < 20) {
      onError('Please enter a job description (at least 20 characters).');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDesc);

    try {
      const { data } = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      onResult(data);
    } catch (err) {
      const msg =
        err.response?.data?.error || 'Server error. Make sure the backend is running.';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>

        {/* PDF Upload */}
        <div className="form-group">
          <label className="form-label">Resume (PDF)</label>
          <div
            className={'drop-zone' + (dragOver ? ' drag-over' : '') + (file ? ' has-file' : '')}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="file-selected">
                <span className="file-icon">✅</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <div className="drop-placeholder">
                <span className="drop-icon">📂</span>
                <span>Drop your PDF here or click to browse</span>
                <span className="drop-hint">PDF only · Max 5MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="form-group">
          <label className="form-label">Job Description</label>
          <textarea
            className="jd-textarea"
            placeholder="Paste the full job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={10}
          />
          <span className="char-count">{jobDesc.length} chars</span>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span className="loading-text">
              <span className="spinner" /> Analyzing with AI...
            </span>
          ) : (
            '🔍 Analyze Resume'
          )}
        </button>

      </form>
    </div>
  );
}
