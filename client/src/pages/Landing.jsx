import React from 'react';

const Landing = ({ onNavigate }) => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', minHeight: '100vh' }}>
      {/* Navigation */}
      <header style={styles.header}>
        <div className="container" style={styles.navContainer}>
          <div style={styles.logo}>
            <span style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #14b8a6 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Finora AI</span>
          </div>
          <div style={styles.navButtons}>
            <button className="btn btn-secondary" onClick={() => onNavigate('login')} style={{ marginRight: '12px' }}>
              लॉगिन / Login
            </button>
            <button className="btn btn-primary" onClick={() => onNavigate('signup')}>
              शुरुआत करें / Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.title}>
            <span className="gradient-text">भारत के लिए सुरक्षित AI</span>
            <br />
            Secure AI for Indian Fintech
          </h1>
          <p style={styles.subtitle}>
            स्वचालित वित्तीय विश्लेषण, सत्यापित आउटपुट, और विश्वसनीय ऑटोमेशन
            <br />
            Automated financial analysis, verified outputs, and trusted automation
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('signup')} style={{ fontSize: '16px', padding: '14px 32px' }}>
            अभी शुरू करें / Start Now
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>मुख्य विशेषताएं / Key Features</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>🔒</div>
              <h3 style={styles.featureTitle}>सुरक्षित / Secure</h3>
              <p style={styles.featureText}>एंड-टू-एंड एन्क्रिप्शन और RBAC सुरक्षा के साथ बैंक-ग्रेड सुरक्षा।</p>
            </div>
            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>🤖</div>
              <h3 style={styles.featureTitle}>AI संचालित / AI Powered</h3>
              <p style={styles.featureText}>OpenAI के साथ उन्नत LLM विश्लेषण और स्वचालित सत्यापन।</p>
            </div>
            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>✓</div>
              <h3 style={styles.featureTitle}>सत्यापित / Verified</h3>
              <p style={styles.featureText}>बहु-परत सत्यापन और विश्वसनीय आउटपुट फ़िल्टरिंग।</p>
            </div>
            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>⚡</div>
              <h3 style={styles.featureTitle}>तेज़ / Fast</h3>
              <p style={styles.featureText}>रीयल-टाइम विश्लेषण और तत्काल परिणाम।</p>
            </div>
            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>विश्लेषण / Analytics</h3>
              <p style={styles.featureText}>विस्तृत ऑडिट लॉग और व्यापक रिपोर्टिंग।</p>
            </div>
            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>🌍</div>
              <h3 style={styles.featureTitle}>द्विभाषी / Bilingual</h3>
              <p style={styles.featureText}>अंग्रेजी और हिंदी दोनों में पूर्ण समर्थन।</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.how}>
        <div className="container">
          <h2 style={styles.sectionTitle}>कैसे काम करता है / How It Works</h2>
          <div style={styles.stepsContainer}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <h4>डेटा अपलोड / Upload</h4>
              <p>अपना वित्तीय डेटा सुरक्षित रूप से अपलोड करें।</p>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <h4>AI विश्लेषण / Analyze</h4>
              <p>AI तुरंत डेटा का विश्लेषण करता है।</p>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <h4>सत्यापन / Verify</h4>
              <p>बहु-परत सत्यापन और फ़िल्टरिंग।</p>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>4</div>
              <h4>परिणाम / Results</h4>
              <p>विश्वसनीय, सत्यापित आउटपुट प्राप्त करें।</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div className="container">
          <h2 style={styles.ctaTitle}>आज ही शुरू करें / Get Started Today</h2>
          <p style={styles.ctaText}>भारतीय फिनटेक के लिए डिज़ाइन किया गया, सुरक्षित और विश्वसनीय।</p>
          <button className="btn btn-primary" onClick={() => onNavigate('signup')} style={{ fontSize: '16px', padding: '14px 32px' }}>
            निःशुल्क शुरुआत करें / Start Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p>© 2026 Finora AI | भारत से | Made in India 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  header: {
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    paddingTop: '20px',
    paddingBottom: '20px',
    backdropFilter: 'blur(10px)',
    background: 'rgba(15, 23, 42, 0.8)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
  },
  navButtons: {
    display: 'flex',
    gap: '12px',
  },
  hero: {
    paddingTop: '120px',
    paddingBottom: '120px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '56px',
    fontWeight: '800',
    marginBottom: '24px',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '18px',
    color: '#cbd5e1',
    marginBottom: '32px',
    lineHeight: '1.6',
  },
  features: {
    paddingTop: '80px',
    paddingBottom: '80px',
  },
  sectionTitle: {
    fontSize: '40px',
    fontWeight: '800',
    marginBottom: '60px',
    textAlign: 'center',
  },
  featureCard: {
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  featureText: {
    fontSize: '14px',
    color: '#cbd5e1',
  },
  how: {
    paddingTop: '80px',
    paddingBottom: '80px',
    background: 'rgba(30, 41, 59, 0.5)',
  },
  stepsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  },
  step: {
    textAlign: 'center',
    flex: '1',
    minWidth: '120px',
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 auto 16px',
  },
  stepArrow: {
    fontSize: '32px',
    color: '#14b8a6',
  },
  cta: {
    paddingTop: '80px',
    paddingBottom: '80px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(251, 191, 36, 0.1))',
  },
  ctaTitle: {
    fontSize: '40px',
    fontWeight: '800',
    marginBottom: '16px',
  },
  ctaText: {
    fontSize: '16px',
    color: '#cbd5e1',
    marginBottom: '32px',
  },
  footer: {
    paddingTop: '40px',
    paddingBottom: '40px',
    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
    color: '#94a3b8',
    fontSize: '14px',
  },
};

export default Landing;
