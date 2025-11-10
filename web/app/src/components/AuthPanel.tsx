import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AuthUser, ShadowmasterAuthState } from '../types/auth';

type AuthView = 'login' | 'register' | 'password';

interface ApiUserResponse {
  user: AuthUser | null;
}

function hasRole(user: AuthUser | null, role: string) {
  return !!user?.roles.some((r) => r.toLowerCase() === role.toLowerCase());
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  const parseJSON = () => {
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  };

  if (!response.ok) {
    const payload = parseJSON();
    const message = typeof payload.error === 'string' && payload.error.trim().length > 0 ? payload.error : response.statusText;
    throw new Error(message);
  }

  return parseJSON() as T;
}

export function AuthPanel() {
  const [view, setView] = useState<AuthView>('login');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const hasFetchedInitialUser = useRef(false);

  useEffect(() => {
    if (hasFetchedInitialUser.current) {
      return;
    }
    hasFetchedInitialUser.current = true;
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    window.ShadowmasterAuth = {
      user,
      isAdministrator: hasRole(user, 'administrator'),
      isGamemaster: hasRole(user, 'gamemaster'),
      isPlayer: hasRole(user, 'player'),
    };
    window.dispatchEvent(new CustomEvent('shadowmaster:auth', { detail: window.ShadowmasterAuth }));
  }, [user]);

  async function fetchCurrentUser() {
    try {
      setLoading(true);
      setError(null);
      const data = await request<ApiUserResponse>('/api/auth/me');
      setUser(data.user);
      setView('login');
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await request<ApiUserResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      setUser(data.user);
      setView('login');
      setLoginPassword('');
      setSuccess('Welcome back!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (registerPassword !== registerConfirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await request<ApiUserResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: registerEmail,
          username: registerUsername,
          password: registerPassword,
        }),
      });
      setUser(data.user);
      setView('login');
      setSuccess('Account created successfully.');
      setRegisterPassword('');
      setRegisterConfirm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await request('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setView('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange(event: FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await request('/api/auth/password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      setSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setView('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password update failed');
    } finally {
      setLoading(false);
    }
  }

  const roleSummary = useMemo(() => {
    if (!user) return '';
    return user.roles.join(', ');
  }, [user]);

  return (
    <section className="auth-panel">
      <header className="auth-panel__header">
        <h2>{user ? `Welcome, ${user.username}` : 'Account Access'}</h2>
        {user && (
          <div className="auth-panel__roles">
            <span className="auth-tag">{roleSummary || 'Player'}</span>
          </div>
        )}
      </header>

      {error && <div className="auth-alert auth-alert--error">{error}</div>}
      {success && <div className="auth-alert auth-alert--success">{success}</div>}

      {user ? (
        <div className="auth-panel__content">
          <p className="auth-panel__status">
            You are signed in as <strong>{user.email}</strong>.
          </p>
          <div className="auth-panel__actions">
            <button className="btn btn-secondary" onClick={() => setView(view === 'password' ? 'login' : 'password')}>
              {view === 'password' ? 'Hide Password Form' : 'Change Password'}
            </button>
            <button className="btn btn-primary" onClick={handleLogout} disabled={loading}>
              Logout
            </button>
          </div>
          {view === 'password' && (
            <form className="auth-form" onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="current-password">Current Password</label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                Update Password
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="auth-panel__content">
          {view === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="auth-form__footer">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  Sign In
                </button>
                <button className="btn btn-link" type="button" onClick={() => setView('register')}>
                  Need an account?
                </button>
              </div>
            </form>
          )}

          {view === 'register' && (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-username">Username</label>
                <input
                  id="register-username"
                  value={registerUsername}
                  onChange={(event) => setRegisterUsername(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-confirm">Confirm Password</label>
                <input
                  id="register-confirm"
                  type="password"
                  value={registerConfirm}
                  onChange={(event) => setRegisterConfirm(event.target.value)}
                  required
                />
              </div>
              <div className="auth-form__footer">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  Create Account
                </button>
                <button className="btn btn-link" type="button" onClick={() => setView('login')}>
                  Sign in instead
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
}

declare global {
  interface Window {
    ShadowmasterAuth?: ShadowmasterAuthState;
  }
}

