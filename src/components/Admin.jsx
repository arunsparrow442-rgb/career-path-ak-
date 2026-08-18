import { useState } from 'react';
import { COURSES } from '../data/coursesData.js';
import { BUILTIN, getAllUsers, saveNewUser, deleteUserFromStorage, updateUserPassword } from '../data/users.js';

export default function Admin({ currentUser, activityLog, logActivity, usersVersion, bumpUsersVersion }) {
  const [tab, setTab] = useState('users');
  const [search, setSearch] = useState('');
  // role is locked to 'user' — admin accounts cannot be created from this panel.
  const [form, setForm] = useState({ first: '', last: '', email: '', pass: '', degree: '', role: 'user' });
  const [addErr, setAddErr] = useState('');
  const [addOk, setAddOk] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [passOk, setPassOk] = useState('');
  const [passErr, setPassErr] = useState('');

  // Re-read on every render so table stays fresh after any storage mutation.
  void usersVersion;
  const users = getAllUsers();
  const emails = Object.keys(users);
  const adminCount = emails.filter((e) => users[e].role === 'admin').length;

  function handleAddUser() {
    setAddErr(''); setAddOk('');
    const { first, last, email, pass, degree, role } = form;
    const cleanEmail = email.trim().toLowerCase();
    if (!first.trim()) { setAddErr('⚠ First name required.'); return; }
    if (!cleanEmail || !cleanEmail.includes('@')) { setAddErr('⚠ Valid email required.'); return; }
    if (!pass || pass.length < 6) { setAddErr('⚠ Password min 6 chars.'); return; }
    const allUsers = getAllUsers();
    if (allUsers[cleanEmail]) { setAddErr('⚠ Email already exists.'); return; }
    saveNewUser(cleanEmail, { pass, name: first.trim(), last: last.trim(), degree, year: '', role });
    logActivity('Admin added user: ' + cleanEmail + ' (' + role + ')', 'green');
    setAddOk(`✅ User ${first.trim()} (${cleanEmail}) added successfully.`);
    setForm({ first: '', last: '', email: '', pass: '', degree: '', role: 'user' });
    bumpUsersVersion();
    setTimeout(() => setAddOk(''), 2000);
  }

  function handleDeleteUser(email) {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return;
    if (deleteUserFromStorage(email)) {
      logActivity('Admin deleted user: ' + email, 'red');
      bumpUsersVersion();
    } else {
      window.alert('Cannot delete built-in accounts.');
    }
  }

  function handleChangePassword() {
    setPassOk(''); setPassErr('');
    if (!newPass || newPass.length < 6) { setPassErr('⚠ Password min 6 chars.'); return; }
    if (newPass !== newPass2) { setPassErr('⚠ Passwords do not match.'); return; }
    updateUserPassword(currentUser, newPass);
    setPassOk('✅ Admin password updated successfully.');
    logActivity('Admin changed their password', 'gold');
    setNewPass(''); setNewPass2('');
    bumpUsersVersion();
    setTimeout(() => setPassOk(''), 3000);
  }

  const filteredEmails = emails.filter((email) => {
    if (!search) return true;
    const u = users[email];
    const name = (u.name + ' ' + (u.last || '')).trim().toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.toLowerCase().includes(q);
  });

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <div>
          <div className="page-title">⚙ ADMIN PORTAL</div>
          <div className="page-sub" style={{ marginBottom: 0 }}>Manage users, view analytics, and configure platform settings</div>
        </div>
        <div className="admin-badge">🔴 ADMIN ACCESS · RESTRICTED</div>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat"><div className="anum">{emails.length}</div><div className="albl">Total Users</div></div>
        <div className="admin-stat"><div className="anum">{adminCount}</div><div className="albl">Admins</div></div>
        <div className="admin-stat"><div className="anum">{emails.length - adminCount}</div><div className="albl">Students</div></div>
        <div className="admin-stat"><div className="anum">{COURSES.length}</div><div className="albl">Courses & Colleges Listed</div></div>
        <div className="admin-stat"><div className="anum">{activityLog.length}</div><div className="albl">Log Events</div></div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>👥 User Management</button>
        <button className={`admin-tab ${tab === 'activity' ? 'active' : ''}`} onClick={() => setTab('activity')}>📋 Activity Log</button>
        <button className={`admin-tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>⚙ Platform Settings</button>
      </div>

      {tab === 'users' && (
        <div className="admin-section active">
          <div className="add-user-form">
            <h4>➕ ADD NEW USER</h4>
            <div className="form-row">
              <div><label>First Name</label><input type="text" placeholder="Arun" value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} /></div>
              <div><label>Last Name</label><input type="text" placeholder="Kumar" value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} /></div>
              <div><label>Email</label><input type="email" placeholder="user@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><label>Password</label><input type="password" placeholder="Min 6 chars" value={form.pass} onChange={(e) => setForm({ ...form, pass: e.target.value })} /></div>
              <div>
                <label>Degree</label>
                <select value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })}>
                  <option value="">Select</option>
                  <option>B.Tech – Computer Science</option>
                  <option>B.Tech – Electronics</option>
                  <option>BCA</option>
                  <option>MBA</option>
                  <option>B.Com</option>
                  <option>B.A</option>
                </select>
              </div>
            </div>
            <button className="btn-add" onClick={handleAddUser}>➕ ADD USER</button>
            {addErr && <div className="err-msg" style={{ marginTop: '10px', display: 'block' }}>{addErr}</div>}
            {addOk && <div className="ok-msg" style={{ marginTop: '10px', display: 'block' }} dangerouslySetInnerHTML={{ __html: addOk }} />}
          </div>

          <div className="search-bar">
            <input type="text" placeholder="🔍  Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Degree</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filteredEmails.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>No users found.</td></tr>
                )}
                {filteredEmails.map((email, idx) => {
                  const u = users[email];
                  const name = (u.name + ' ' + (u.last || '')).trim();
                  const isBuiltin = !!BUILTIN[email];
                  const roleClass = u.role === 'admin' ? 's-admin' : 's-active';
                  const roleLabel = u.role === 'admin' ? 'ADMIN' : 'USER';
                  return (
                    <tr key={email}>
                      <td style={{ color: 'var(--muted)', fontFamily: 'Orbitron,monospace', fontSize: '0.7rem' }}>{idx + 1}</td>
                      <td><strong>{name}</strong></td>
                      <td style={{ color: 'var(--gold2)', fontSize: '0.8rem' }}>{email}</td>
                      <td style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{u.degree || '—'}</td>
                      <td><span className={`status-badge ${roleClass}`}>{roleLabel}</span></td>
                      <td><span className={`status-badge ${u.pass === 'google' ? 's-google' : 's-active'}`}>{u.pass === 'google' ? 'GOOGLE' : 'ACTIVE'}</span></td>
                      <td>
                        {isBuiltin
                          ? <span style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>Built-in</span>
                          : <button className="btn-del" onClick={() => handleDeleteUser(email)}>🗑 Delete</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="admin-section active">
          <div className="admin-table-wrap" style={{ padding: '20px' }}>
            {activityLog.length === 0 ? (
              <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px', fontFamily: 'Orbitron,monospace', fontSize: '0.75rem', letterSpacing: '2px' }}>
                NO ACTIVITY YET
              </div>
            ) : (
              activityLog.map((a, i) => (
                <div className="activity-item" key={i}>
                  <div className={`act-dot act-${a.type}`}></div>
                  <div><div className="act-text">{a.text}</div><div className="act-time">{a.time}</div></div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="admin-section active">
          <div className="demo-notice">
            <span>ℹ️</span>
            <span><strong>Demo environment:</strong> platform settings below are illustrative. User and password changes persist locally in your browser via localStorage.</span>
          </div>

          <div className="add-user-form" style={{ maxWidth: '600px', marginTop: '18px' }}>
            <h4>🔑 CHANGE ADMIN PASSWORD</h4>
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div><label>New Password</label><input type="password" placeholder="Min 6 chars" value={newPass} onChange={(e) => setNewPass(e.target.value)} /></div>
              <div><label>Confirm New Password</label><input type="password" placeholder="Re-enter" value={newPass2} onChange={(e) => setNewPass2(e.target.value)} /></div>
            </div>
            <button className="btn-add" onClick={handleChangePassword}>🔑 UPDATE PASSWORD</button>
            {passOk && <div className="ok-msg" style={{ marginTop: '10px', display: 'block' }}>{passOk}</div>}
            {passErr && <div className="err-msg" style={{ marginTop: '10px', display: 'block' }}>{passErr}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
