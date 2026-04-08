import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  IoSparkles,
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoArrowForward,
} from 'react-icons/io5';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        showToast('Welcome back! 🎉', 'success');
      } else {
        await register(name, email, password);
        showToast('Account created successfully! 🚀', 'success');
      }
      navigate('/dashboard');
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Something went wrong';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel — Branding */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-badge">
            <IoSparkles size={14} />
            <span>AI POWERED INSIGHTS</span>
          </div>
          <h1 className="auth-hero-title">
            Your career,
            <br />
            <span className="auth-hero-title-gradient">intelligently curated.</span>
          </h1>
          <p className="auth-hero-desc">
            Move beyond the spreadsheet. CareerCurator uses advanced neural
            tracking to map your professional journey from first click to final
            offer.
          </p>
          <div className="auth-hero-stats">
            <div className="auth-hero-stat">
              <div className="auth-hero-stat-icon" />
              <div>
                <strong>98% Match</strong>
                <span>AI precision in job relevancy tracking.</span>
              </div>
            </div>
            <div className="auth-hero-stat">
              <div className="auth-hero-stat-icon" />
              <div>
                <strong>Fast Apply</strong>
                <span>Automated workflow optimization.</span>
              </div>
            </div>
          </div>
        </div>
        {/* Animated background mesh */}
        <div className="auth-hero-mesh" />
      </div>

      {/* Right Panel — Form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-brand">
            <div className="auth-form-brand-icon">
              <IoSparkles size={20} />
            </div>
            <span className="auth-form-brand-name">CareerCurator</span>
          </div>

          <h2 className="auth-form-title">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-form-subtitle">
            {isLogin
              ? 'Log in to your workspace to continue your search.'
              : 'Start tracking your job applications with AI.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group animate-fade-in-up">
                <label htmlFor="auth-name">Full Name</label>
                <div className="auth-input-wrapper">
                  <IoPersonOutline size={18} className="auth-input-icon" />
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="auth-email">Email address</label>
              <div className="auth-input-wrapper">
                <IoMailOutline size={18} className="auth-input-icon" />
                <input
                  id="auth-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="auth-label-row">
                <label htmlFor="auth-password">Password</label>
                {isLogin && (
                  <a href="#" className="auth-forgot">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="auth-input-wrapper">
                <IoLockClosedOutline size={18} className="auth-input-icon" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Keep me signed in</span>
              </label>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner" />
              ) : (
                <>
                  {isLogin ? 'Sign in to Dashboard' : 'Create Account'}
                  <IoArrowForward size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? (
              <>
                New to CareerCurator?{' '}
                <button
                  className="auth-switch-btn"
                  onClick={() => setIsLogin(false)}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  className="auth-switch-btn"
                  onClick={() => setIsLogin(true)}
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="auth-terms">
            By logging in, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
