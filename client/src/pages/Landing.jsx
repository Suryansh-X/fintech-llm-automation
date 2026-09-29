import React from 'react';

const Landing = ({ onNavigate }) => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="navbar-brand">Finora AI</div>
        <div className="navbar-actions">
          <button className="btn-secondary" onClick={() => onNavigate('login')}>Login</button>
          <button className="btn-primary" onClick={() => onNavigate('signup')}>Sign Up</button>
        </div>
      </nav>

      <section className="hero">
        <h1>Secure Fintech Automation with AI</h1>
        <p>Advanced LLM-powered analysis with multi-layered security</p>
        <button className="btn-primary btn-lg" onClick={() => onNavigate('signup')}>Get Started</button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🔐 Enterprise Security</h3>
          <p>Multi-layered security pipeline with real-time threat detection</p>
        </div>
        <div className="feature-card">
          <h3>⚡ AI-Powered Analysis</h3>
          <p>Advanced LLM models for financial pattern recognition</p>
        </div>
        <div className="feature-card">
          <h3>📊 Real-time Insights</h3>
          <p>Instant data analysis and automated reporting</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Finora AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
