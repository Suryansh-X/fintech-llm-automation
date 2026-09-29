import React, { useState, useEffect } from 'react';
import LandingPage from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  const [page, setPage] = useState('landing');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  useEffect(() => {
    if (token) {
      setPage('dashboard');
    }
  }, [token]);

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setPage('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setPage('landing');
  };

  return (
    <div>
      {page === 'landing' && !token && <LandingPage onNavigate={setPage} />}
      {page === 'login' && <Login onNavigate={setPage} onLogin={handleLogin} />}
      {page === 'signup' && <Signup onNavigate={setPage} onSignup={handleLogin} />}
      {page === 'dashboard' && token && <Dashboard user={user} onLogout={handleLogout} token={token} />}
    </div>
  );
};

export default App;
