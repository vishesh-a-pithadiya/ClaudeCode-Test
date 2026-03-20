import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, isOAuthConfigured } from '../auth';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const initialStep = searchParams.get('step') === 'role' ? 3 : 1;
  const [step, setStep] = useState(initialStep); // 1=email, 2=password, 3=role selection
  const [error, setError] = useState('');

  // Already logged in — go straight to role selection
  const showRoleSelection = step === 3 || isAuthenticated;

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
      login();
    } else {
      setStep(2);
    }
  };

  const handleLogin = () => {
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    login(email);
    setStep(3);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 1) handleNext();
      else if (step === 2) handleLogin();
    }
  };

  const handleSkip = () => {
    setStep(3);
  };

  const handleRoleSelect = (role) => {
    localStorage.setItem('userRole', role);
    navigate('/home');
  };

  // Role selection screen
  if (showRoleSelection) {
    const displayName = isAuthenticated ? (user.name || 'TI User') : email || 'there';
    return (
      <div className="landing-page">
        <button className="landing-back-btn" onClick={() => setStep(1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div className="landing-logo">
          <img src="/ti-logo.svg" alt="Texas Instruments" className="landing-logo-img" />
        </div>
        <h1 className="landing-title">Welcome, {displayName}!</h1>
        <p className="landing-subtitle">How would you like to use the app?</p>

        <div className="landing-role-options">
          <button className="landing-role-card" onClick={() => handleRoleSelect('client')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="landing-role-label">Client</span>
            <svg className="landing-role-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button className="landing-role-card" onClick={() => handleRoleSelect('fae')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span className="landing-role-label">Field Apps Engineer</span>
            <svg className="landing-role-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button className="landing-role-card" onClick={() => handleRoleSelect('ae')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="landing-role-label">Apps Engineer</span>
            <svg className="landing-role-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Login screen
  return (
    <div className="landing-page">
      <div className="landing-logo">
        <img src="/ti-logo.svg" alt="Texas Instruments" className="landing-logo-img" />
      </div>
      <h1 className="landing-title">Welcome to TI App</h1>
      <p className="landing-subtitle">Sign in to your myTI account to get started</p>

      <div className="landing-login-card">
        {step === 1 ? (
          <>
            <label className="landing-label" htmlFor="landing-email">myTI Account ID</label>
            <input
              id="landing-email"
              type="email"
              className="landing-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <p className="landing-hint">@ti.com addresses are not allowed</p>
            {error && <p className="landing-error">{error}</p>}
            <button className="landing-login-btn" onClick={handleNext} disabled={!email}>
              Next
            </button>
          </>
        ) : (
          <>
            <div className="landing-account-row">
              <span className="landing-account-email">{email}</span>
              <button className="landing-change-btn" onClick={() => { setStep(1); setError(''); }}>Change</button>
            </div>
            <label className="landing-label" htmlFor="landing-password">Password</label>
            <input
              id="landing-password"
              type="password"
              className="landing-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {error && <p className="landing-error">{error}</p>}
            <button className="landing-login-btn" onClick={handleLogin} disabled={!password}>
              Log In
            </button>
          </>
        )}

        <div className="landing-divider">
          <span>or</span>
        </div>

        <button className="landing-skip-btn" onClick={handleSkip}>
          Continue as Guest
        </button>

        <div className="landing-footer-links">
          <a href="https://www.ti.com/myti/forgot-password" target="_blank" rel="noopener noreferrer">Forgot password?</a>
          <span className="landing-link-sep">·</span>
          <a href="https://www.ti.com/myti/register" target="_blank" rel="noopener noreferrer">Create account</a>
        </div>
      </div>
    </div>
  );
}

export default Landing;
