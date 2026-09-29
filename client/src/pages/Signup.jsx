import React, { useState } from 'react';

const Signup = ({ onNavigate, onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      });

      const data = await response.json();
      if (data.success) {
        // Auto-login after signup
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();
        if (loginData.success) {
          onSignup(loginData.token, loginData.user);
        }
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.formCard}>
          <h1 style={styles.title}>साइन अप / Sign Up</h1>
          <p style={styles.subtitle}>एक नया खाता बनाएं</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>नाम / Name</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="आपका नाम"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>ईमेल / Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>पासवर्ड / Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>पासवर्ड की पुष्टि / Confirm Password</label>
              <input
                type="password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? <span className="spinner"></span> : 'खाता बनाएं / Create Account'}
            </button>
          </form>

          <p style={styles.footerText}>
            पहले से खाता है? <button onClick={() => onNavigate('login')} style={styles.link}>यहाँ लॉगिन करें / Login here</button>
          </p>
          <button onClick={() => onNavigate('landing')} style={styles.backBtn}>← वापस जाएं / Back</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    paddingTop: '60px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '420px',
    padding: '20px',
  },
  formCard: {
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '12px',
    padding: '40px',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#cbd5e1',
    marginBottom: '32px',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
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
  submitBtn: {
    width: '100%',
    marginTop: '8px',
  },
  footerText: {
    marginTop: '24px',
    fontSize: '14px',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#14b8a6',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: '4px',
  },
  backBtn: {
    width: '100%',
    padding: '10px 20px',
    background: 'rgba(148, 163, 184, 0.1)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    color: '#cbd5e1',
    borderRadius: '8px',
    marginTop: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default Signup;
