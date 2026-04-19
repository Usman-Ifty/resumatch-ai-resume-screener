import { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiSearch } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api/analyze';

export default function UploadForm({ onResults, onError, loading, setLoading }) {
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      if (file.type !== 'application/pdf') {
        onError(`"${file.name}" is not a PDF.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        onError(`"${file.name}" is too large (>5MB).`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Limit to 5
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) { onError('Please upload at least one resume.'); return; }
    if (jobDesc.trim().length < 20) { onError('Job description is too short.'); return; }

    setLoading(true);
    const results = [];

    try {
      // Analyze each file one by one
      for (const file of files) {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDesc);
        
        const { data } = await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        results.push({ ...data, fileName: file.name });
      }
      onResults(results);
    } catch (err) {
      onError(err.response?.data?.error || 'Analysis failed. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <span className="section-label">Upload Resumes (Max 5)</span>
          <div
            className={`neon-drop ${dragOver ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept=".pdf"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <FiUploadCloud size={48} color="var(--neon-blue)" style={{ marginBottom: '15px' }} />
            <p style={{ color: 'white', fontWeight: 600 }}>Drop PDFs here or click to browse</p>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '8px' }}>
              Supports multiple files for Batch Ranking
            </p>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <div className="file-list">
                {files.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="file-tag"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiFile color="var(--neon-blue)" />
                      <span style={{ fontSize: '14px' }}>{f.name}</span>
                    </div>
                    <FiX 
                      style={{ cursor: 'pointer' }} 
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="form-group" style={{ marginTop: '30px' }}>
          <span className="section-label">Target Job Description</span>
          <textarea
            className="neon-textarea"
            placeholder="Paste the requirements here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={8}
          />
        </div>

        <button type="submit" className="neon-btn" disabled={loading}>
          {loading ? (
            <span className="loading-text">
              <div className="spinner" /> Analyzing {files.length > 1 ? `Batch (${files.length})` : 'Resume'}...
            </span>
          ) : (
            <>
              <FiSearch /> {files.length > 1 ? 'Start Batch Ranking' : 'Analyze Resume'}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
