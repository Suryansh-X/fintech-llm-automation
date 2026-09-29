import React, { useState, useEffect } from 'react';

const Dashboard = ({ user, onLogout, token }) => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({ input: '', type: 'transaction' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/ai-pipeline/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          input: formData.input,
          type: formData.type,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        setFormData({ input: '', type: 'transaction' });
        fetchStats();
      } else {
        setError(data.message || 'Processing failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div className="container" style={styles.headerContent}>
          <div style={styles.logo}>Finora AI</div>
          <div style={styles.userSection}>
            <span style={styles.userName}>👋 {user?.name}</span>
            <button className="btn btn-secondary" onClick={onLogout}>
              लॉगआउट / Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container" style={styles.content}>
        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...( tab === 'overview' ? styles.tabActive : {}),
            }}
            onClick={() => setTab('overview')}
          >
            📊 अवलोकन / Overview
          </button>
          <button
            style={{
              ...styles.tab,
              ...(tab === 'analysis' ? styles.tabActive : {}),
            }}
            onClick={() => setTab('analysis')}
          >
            🤖 विश्लेषण / Analysis
          </button>
          <button
            style={{
              ...styles.tab,
              ...(tab === 'history' ? styles.tabActive : {}),
            }}
            onClick={() => setTab('history')}
          >
            📜 इतिहास / History
          </button>
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && stats && (
          <div>
            <h1 style={styles.pageTitle}>डैशबोर्ड / Dashboard</h1>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div className="card" style={styles.statCard}>
                <div style={styles.statLabel}>कुल अनुरोधें / Total Requests</div>
                <div style={styles.statValue}>{stats.totalRequests}</div>
              </div>
              <div className="card" style={styles.statCard}>
                <div style={styles.statLabel}>सत्यापित / Verified</div>
                <div style={styles.statValue}>{stats.verifiedRequests}</div>
              </div>
              <div className="card" style={styles.statCard}>
                <div style={styles.statLabel}>लंबित / Pending</div>
                <div style={styles.statValue}>{stats.pendingRequests}</div>
              </div>
              <div className="card" style={styles.statCard}>
                <div style={styles.statLabel}>औसत विश्वास / Avg Confidence</div>
                <div style={styles.statValue}>{(stats.averageConfidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {tab === 'analysis' && (
          <div>
            <h1 style={styles.pageTitle}>AI विश्लेषण / AI Analysis</h1>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="card">
                <h3 style={styles.formTitle}>डेटा सबमिट करें / Submit Data</h3>
                {error && <div style={styles.errorBox}>{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>प्रकार / Type</label>
                    <select
                      className="input-field"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="transaction">लेन-देन / Transaction</option>
                      <option value="report">रिपोर्ट / Report</option>
                      <option value="compliance">अनुपालन / Compliance</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>इनपुट डेटा / Input Data</label>
                    <textarea
                      className="input-field"
                      value={formData.input}
                      onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                      placeholder="अपना डेटा यहाँ पेस्ट करें / Paste your data here"
                      rows="8"
                      required
                      style={{ fontFamily: 'monospace', resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? <span className="spinner"></span> : 'विश्लेषण करें / Analyze'}
                  </button>
                </form>
              </div>
              <div className="card">
                <h3 style={styles.formTitle}>परिणाम / Results</h3>
                {result ? (
                  <div>
                    <div style={styles.resultSection}>
                      <h4 style={styles.resultLabel}>विश्वास स्कोर / Confidence</h4>
                      <div style={{
                        ...styles.confidenceBar,
                        background: `linear-gradient(90deg, #14b8a6 0%, #14b8a6 ${result.confidence * 100}%, rgba(148, 163, 184, 0.1) ${result.confidence * 100}%, rgba(148, 163, 184, 0.1) 100%)`,
                      }}>
                        {(result.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div style={styles.resultSection}>
                      <h4 style={styles.resultLabel}>सारांश / Summary</h4>
                      <p style={styles.resultText}>{result.output?.summary || 'N/A'}</p>
                    </div>
                    <div style={styles.resultSection}>
                      <h4 style={styles.resultLabel}>गुणवत्ता / Quality</h4>
                      <span className="badge badge-success">{result.output?.qualityRating}</span>
                    </div>
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#94a3b8' }}>परिणाम यहाँ दिखाई देंगे / Results will appear here</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <div>
            <h1 style={styles.pageTitle}>विश्लेषण इतिहास / Analysis History</h1>
            <div className="card">
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>आपके विश्लेषण का इतिहास यहाँ दिखाई देगा / Your analysis history will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    minHeight: '100vh',
  },
  header: {
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    paddingTop: '20px',
    paddingBottom: '20px',
    backdropFilter: 'blur(10px)',
    background: 'rgba(15, 23, 42, 0.8)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #14b8a6 0%, #fbbf24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
  },
  content: {
    paddingTop: '40px',
    paddingBottom: '40px',
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    paddingBottom: '16px',
  },
  tab: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 16px',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    color: '#14b8a6',
    borderBottomColor: '#14b8a6',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '32px',
  },
  statCard: {
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '12px',
    color: '#cbd5e1',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #14b8a6 0%, #fbbf24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  resultSection: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
  },
  resultLabel: {
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '8px',
    textTransform: 'uppercase',
    color: '#cbd5e1',
    letterSpacing: '0.5px',
  },
  confidenceBar: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    textAlign: 'center',
    color: '#f1f5f9',
  },
  resultText: {
    fontSize: '14px',
    color: '#cbd5e1',
    lineHeight: '1.6',
  },
};

export default Dashboard;
