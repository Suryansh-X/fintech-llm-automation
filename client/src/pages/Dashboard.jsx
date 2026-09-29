import React, { useState } from 'react';

const Dashboard = ({ user, onLogout, token }) => {
  const [inputData, setInputData] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!inputData.trim()) {
      setError('Please enter data to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: inputData })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Analysis failed');
      } else {
        setAnalysis(result);
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">Finora AI - Dashboard</div>
        <div className="navbar-actions">
          <span>Welcome, {user?.name}</span>
          <button className="btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="analysis-panel">
          <h2>AI Analysis Tool</h2>
          {error && <div className="error-message">{error}</div>}
          
          <textarea
            placeholder="Paste your financial data here..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows="8"
          />
          
          <button 
            className="btn-primary" 
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>

        {analysis && (
          <div className="results-panel">
            <h3>Analysis Results</h3>
            <div className="result-content">
              {typeof analysis === 'object' ? (
                <pre>{JSON.stringify(analysis, null, 2)}</pre>
              ) : (
                <p>{analysis}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
