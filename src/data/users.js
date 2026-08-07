export const BUILTIN = {
  'arun552@gmail.com':  {pass:'123',        name:'Arun',    last:'Kumar', degree:'B.Tech – Computer Science', year:'Final Year', role:'admin'},
  'student@aktech.ai':  {pass:'student123', name:'Student', last:'User',  degree:'BCA',                       year:'3rd Year',   role:'user'},
  'admin@aktech.ai':    {pass:'admin123',   name:'Admin',   last:'',      degree:'MBA',                       year:'Graduated',  role:'admin'},
  'demo@aktech.ai':     {pass:'demo123',    name:'Demo',    last:'User',  degree:'B.Tech – Computer Science', year:'Final Year', role:'user'}
};

export function getAllUsers() {
  let extra = {};
  try {
    const s = localStorage.getItem('aktech_registered');
    if (s) extra = JSON.parse(s);
  } catch (e) { /* ignore */ }
  return Object.assign({}, BUILTIN, extra);
}

export function saveNewUser(email, data) {
  let extra = {};
  try {
    const s = localStorage.getItem('aktech_registered');
    if (s) extra = JSON.parse(s);
  } catch (e) { /* ignore */ }
  extra[email] = data;
  try { localStorage.setItem('aktech_registered', JSON.stringify(extra)); } catch (e) { /* ignore */ }
}

export function deleteUserFromStorage(email) {
  if (BUILTIN[email]) return false; // can't delete builtins
  let extra = {};
  try {
    const s = localStorage.getItem('aktech_registered');
    if (s) extra = JSON.parse(s);
  } catch (e) { /* ignore */ }
  delete extra[email];
  try { localStorage.setItem('aktech_registered', JSON.stringify(extra)); } catch (e) { /* ignore */ }
  return true;
}

export function updateUserPassword(email, newPass) {
  let extra = {};
  try {
    const s = localStorage.getItem('aktech_registered');
    if (s) extra = JSON.parse(s);
  } catch (e) { /* ignore */ }
  extra[email] = Object.assign({}, getAllUsers()[email], { pass: newPass });
  try { localStorage.setItem('aktech_registered', JSON.stringify(extra)); } catch (e) { /* ignore */ }
}

// ===== AUTH =====
export function authenticateUser(email, password) {
  const users = getAllUsers();
  const cleanEmail = (email || '').trim().toLowerCase();
  const user = users[cleanEmail];
  if (!user) return { ok: false, error: 'No account found with this email.' };
  if (user.pass !== password) return { ok: false, error: 'Incorrect password.' };
  return { ok: true, email: cleanEmail, data: user };
}

export function registerUser({ email, password, first, last, degree, year }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!first || !first.trim()) return { ok: false, error: 'First name is required.' };
  if (!cleanEmail || !cleanEmail.includes('@')) return { ok: false, error: 'A valid email is required.' };
  if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
  const users = getAllUsers();
  if (users[cleanEmail]) return { ok: false, error: 'An account with this email already exists.' };
  const data = { pass: password, name: first.trim(), last: (last || '').trim(), degree: degree || '', year: year || '1st Year', role: 'user' };
  saveNewUser(cleanEmail, data);
  return { ok: true, email: cleanEmail, data };
}

export function getSession() {
  try { return localStorage.getItem('aktech_session') || null; } catch (e) { return null; }
}
export function setSession(email) {
  try { localStorage.setItem('aktech_session', email); } catch (e) { /* ignore */ }
}
export function clearSession() {
  try { localStorage.removeItem('aktech_session'); } catch (e) { /* ignore */ }
}
