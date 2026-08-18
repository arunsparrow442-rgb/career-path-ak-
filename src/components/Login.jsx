import { useState } from 'react';
import { authenticateUser, registerUser } from '../data/users.js';

export default function Login({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', first: '', last: '', degree: '' });
  const [error, setError] = useState('');

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleLogin(e) {
    e.preventDefault();
    setError('');
    const res = authenticateUser(form.email, form.password);
    if (!res.ok) { setError(res.error); return; }
    onAuth(res.email);
  }

  function handleSignup(e) {
    e.preventDefault();
    setError('');
    const res = registerUser(form);
    if (!res.ok) { setError(res.error); return; }
    onAuth(res.email);
  }

  return (
    <div className="auth-wrap">
      <div className="bg-orbs"><span></span><span></span><span></span></div>
      <div className="auth-card">
        <div className="nav-brand" style={{ justifyContent: 'center', marginBottom: '18px' }}>
          <span style={{ fontSize: '1.6rem' }}>⚡</span>
          <div>
            <div className="nav-brand-text"><span className="ak">AK </span><span className="tech">TECH</span></div>
            <span className="nav-brand-sub">CareerPath AI</span>
          </div>
        </div>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }}>Sign Up</button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email} onChange={update('email')} required />
            <label>Password</label>
            <input type="password" placeholder="Your password" value={form.password} onChange={update('password')} required />
            {error && <div className="err-msg" style={{ display: 'block' }}>⚠ {error}</div>}
            <button className="predict-btn" type="submit" style={{ width: '100%', marginTop: '6px' }}>⚡ LOGIN</button>
            <div className="auth-hint">
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
              <div><label>First Name</label><input type="text" placeholder="Arun" value={form.first} onChange={update('first')} required /></div>
              <div><label>Last Name</label><input type="text" placeholder="Kumar" value={form.last} onChange={update('last')} /></div>
            </div>
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email} onChange={update('email')} required />
            <label>Degree</label>
            <select value={form.degree} onChange={update('degree')}>
              <option value="">Select degree</option>
              <option>B.Tech – Computer Science</option>
              <option>B.Tech – Artificial Intelligence and data science</option>
              <option>B.Tech – Electronics</option>
              <option>B.Sc – Mathematics</option>
              <option>BCA</option>
              <option>MBA</option>
              <option>B.Com</option>
              <option>B.A</option>
              <option>B.Tech – Mechanical</option>
            </select>
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={update('password')} required />
            {error && <div className="err-msg" style={{ display: 'block' }}>⚠ {error}</div>}
            <button className="predict-btn" type="submit" style={{ width: '100%', marginTop: '6px' }}>✅ CREATE ACCOUNT</button>
          </form>
        )}
      </div>
    </div>
  );
}
