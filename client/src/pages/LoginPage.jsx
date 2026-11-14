import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { loginUser, registerUser, clearAuthError } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';
import { ArrowLeftIcon } from '../components/icons';
import './LoginPage.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, fieldErrors } = useSelector((state) => state.auth);

  const [tab, setTab] = useState('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSubmitting = status === 'loading';

  const switchTab = (nextTab) => {
    dispatch(clearAuthError());
    setTab(nextTab);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    try {
      const result = await dispatch(loginUser({ email: email.trim(), password })).unwrap();
      const user = result.user;

      dispatch(showToast(`Welcome back, ${user.name || user.email}!`));

      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/hotels';
        navigate(from, { replace: true });
      }
    } catch {

    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;

    try {
      const result = await dispatch(
        registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        })
      ).unwrap();

      const user = result.user;
      dispatch(showToast(`Account created successfully! Welcome, ${user.name}!`));
      navigate('/hotels', { replace: true });
    } catch {

    }
  };

  return (
    <>
      <Helmet>
        <title>{tab === 'login' ? 'Sign In' : 'Create Account'} — Hotels</title>
        <meta
          name="description"
          content="Sign in or register an account to browse and manage hotel listings."
        />
      </Helmet>

      <div className="container page login-page">
        <Link to="/" className="back-link">
          <ArrowLeftIcon aria-hidden="true" /> Back to Home
        </Link>

        <div className="card login-card">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1>{tab === 'login' ? 'Sign In' : 'Create Account'}</h1>
            <p className="page-sub">
              {tab === 'login'
                ? 'Enter your credentials to access your account'
                : 'Register as a user to explore'}
            </p>
          </div>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              className={`auth-tab ${tab === 'register' ? 'auth-tab--active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Register
            </button>
          </div>

          {error && <div className="login-error-banner">{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="login-form" noValidate>
              <div className="form-field">
                <label className="label" htmlFor="login-email">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="input"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  required
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label className="label" htmlFor="login-password">
                  Password <span className="req">*</span>
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary login-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (

            <form onSubmit={handleRegisterSubmit} className="login-form" noValidate>
              <div className="form-field">
                <label className="label" htmlFor="reg-name">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  className={`input${fieldErrors.name ? ' input--invalid' : ''}`}
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  required
                  autoFocus
                />
                {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
              </div>

              <div className="form-field">
                <label className="label" htmlFor="reg-email">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className={`input${fieldErrors.email ? ' input--invalid' : ''}`}
                  placeholder="e.g. user@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  required
                />
                {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
              </div>

              <div className="form-field">
                <label className="label" htmlFor="reg-password">
                  Password <span className="req">*</span>
                </label>
                <input
                  id="reg-password"
                  type="password"
                  className={`input${fieldErrors.password ? ' input--invalid' : ''}`}
                  placeholder="At least 4 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  required
                />
                {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
              </div>

              <button
                type="submit"
                className="btn btn--primary login-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account…' : 'Register Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
