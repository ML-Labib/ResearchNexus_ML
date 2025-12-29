import React, { useState } from 'react';
import { summarizeText } from '../services/api';
import '../styles/ResearchTool.css';

const ResearchTool = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await summarizeText(text);
      setSummary(res.data.summary);
    } catch (error) {
      console.error(error);
      alert("Error generating summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="research-container">
      <h1 className="tool-title">🧠 AI Research Assistant</h1>
      
      <div className="tool-grid">
        {/* LEFT: INPUT */}
        <div className="tool-card">
          <h3>Source Text</h3>
          <textarea 
            placeholder="Paste your article, abstract, or notes here..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button 
            className="btn-ai" 
            onClick={handleSummarize} 
            disabled={loading || !text}
          >
            {loading ? "Thinking..." : "✨ Summarize"}
          </button>
        </div>

        {/* RIGHT: OUTPUT */}
        <div className="tool-card">
          <h3>AI Summary</h3>
          <div className="summary-result">
            {summary ? (
              <p>{summary}</p>
            ) : (
              <span className="placeholder">Result will appear here...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchTool;