import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, isOAuthConfigured } from '../auth';
import './Login.css';

function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // If already logged in, show profile
  if (isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-card">
          <img src="/ti-logo.svg" alt="Texas Instruments" className="login-logo" />
          <h2 className="login-title">Welcome back!</h2>
          <div className="login-profile">
            <div className="login-avatar">
              {(user.name || user.email || '?')[0].toUpperCase()}
            </div>
            <p className="login-profile-name">{user.name || 'TI User'}</p>
            <p className="login-profile-email">{user.email}</p>
          </div>
          <button className="login-btn" onClick={() => navigate('/')}>
            Go to Home
          </button>
          <button className="login-btn login-btn-outline" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (!email) {
      setError('Please enter your myTI account ID.');
      return;
    }
    if (email.endsWith('@ti.com')) {
      setError('@ti.com addresses are not allowed.');
      return;
    }
    setError('');

    if (isOAuthConfigured()) {
      // Real OAuth: redirect to TI login
      login();
    } else {
      // Mock mode: show password step
      setStep(2);
    }
  };

  const handleLogin = () => {
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    // Mock login — stores user locally for development
    login(email);
    navigate('/');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 1) handleNext();
      else handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/ti-logo.svg" alt="Texas Instruments" className="login-logo" />
        <h2 className="login-title">Log in to myTI</h2>

        {step === 1 ? (
          <div className="login-step">
            <label className="login-label" htmlFor="email">myTI account ID</label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <p className="login-hint">@ti.com addresses are not allowed</p>
            {error && <p className="login-error">{error}</p>}
            <button
              className="login-btn"
              onClick={handleNext}
              disabled={!email}
            >
              Next
            </button>
            <a href="https://www.ti.com/myti/forgot-password" target="_blank" rel="noopener noreferrer" className="login-link">
              Forgot password?
            </a>
            <div className="login-divider" />
            <p className="login-register">
              Don't have a myTI account?{' '}
              <a href="https://www.ti.com/myti/register" target="_blank" rel="noopener noreferrer" className="login-link-inline">
                Register now
              </a>
            </p>
          </div>
        ) : (
          <div className="login-step">
            <div className="login-account-row">
              <span className="login-account-email">{email}</span>
              <button className="login-change-btn" onClick={() => { setStep(1); setError(''); }}>Change</button>
            </div>
            <label className="login-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {error && <p className="login-error">{error}</p>}
            <button
              className="login-btn"
              onClick={handleLogin}
              disabled={!password}
            >
              Log in
            </button>
            <a href="https://www.ti.com/myti/forgot-password" target="_blank" rel="noopener noreferrer" className="login-link">
              Forgot password?
            </a>
          </div>
        )}

        <div className="login-footer">
          <a href="https://www.ti.com/myti/help" target="_blank" rel="noopener noreferrer" className="login-footer-link">
            Need help logging in?
          </a>
          <a href="https://www.ti.com/myti/faq" target="_blank" rel="noopener noreferrer" className="login-footer-link">
            myTI FAQs
          </a>
          <p className="login-legal">
            By logging in, you agree to TI's{' '}
            <a href="https://www.ti.com/legal/terms-conditions/terms-of-sale.html" target="_blank" rel="noopener noreferrer">transaction terms</a>,{' '}
            <a href="https://www.ti.com/legal/terms-conditions/terms-of-use.html" target="_blank" rel="noopener noreferrer">terms of use</a>{' '}
            and{' '}
            <a href="https://www.ti.com/legal/privacy-policy.html" target="_blank" rel="noopener noreferrer">privacy policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
