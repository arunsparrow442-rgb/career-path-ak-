import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
import Courses from './components/Courses.jsx';
import Chatbot from './components/Chatbot.jsx';
import Admin from './components/Admin.jsx';
import Login from './components/Login.jsx';
import { getAllUsers, getSession, setSession, clearSession } from './data/users.js';

export default function App() {
  const [page, setPage] = useState('home');
  const [activityLog, setActivityLog] = useState([]);
  const [usersVersion, setUsersVersion] = useState(0);
  const [currentUser, setCurrentUser] = useState(() => getSession());

  const userData = useMemo(() => {
    if (!currentUser) return null;
    const users = getAllUsers();
    return users[currentUser] || { name: 'User', last: '', degree: '', year: 'Final Year', role: 'user' };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, usersVersion]);

  const [profile, setProfile] = useState({
    degree: '', year: 'Final Year', gpa: '', lang: '', domain: '', work: 'Corporate / MNC',
  });

  const isAdmin = !!userData && userData.role === 'admin';

  useEffect(() => {
    if (userData) {
      setProfile((p) => ({ ...p, degree: userData.degree || p.degree, year: userData.year || p.year }));
    }
  }, [userData]);

  // IMPORTANT: all hooks (useState/useMemo/useEffect) must run in the same
  // order on every render, so this effect lives ABOVE the early "show Login"
  // return below — never put a hook after a conditional return, or React
  // will throw and the app goes blank until a hard refresh.
  useEffect(() => {
    if (page === 'admin' && !isAdmin) {
      setPage('home');
    }
  }, [page, isAdmin]);

  function logActivity(text, type = 'gold') {
    setActivityLog((log) => {
      const next = [{ text, type, time: new Date().toLocaleTimeString() }, ...log];
      return next.length > 50 ? next.slice(0, 50) : next;
    });
  }

  // Admin page is only reachable by accounts with role === 'admin' —
  // even if something tries to navigate there directly, it's blocked here.
  function goTo(target) {
    if (target === 'admin' && !isAdmin) {
      return;
    }
    setPage(target);
  }

  function handleAuth(email) {
    setSession(email);
    setCurrentUser(email);
    setPage('home');
    logActivity('User signed in: ' + email, 'green');
  }

  function handleLogout() {
    clearSession();
    logActivity('User signed out: ' + currentUser, 'red');
    setCurrentUser(null);
    setPage('home');
  }

  if (!currentUser || !userData) {
    return <Login onAuth={handleAuth} />;
  }

  const fullName = userData.last ? `${userData.name} ${userData.last}` : userData.name;
  const welcomeMessage =
    `👋 Welcome back, <strong>${userData.name}</strong>! I'm <strong>AK TECH AI Advisor</strong>.` +
    (isAdmin
      ? `<br>🔴 <strong style="color:var(--red)">Admin access</strong> is active — visit the <strong>⚙ Admin</strong> tab anytime to manage users and platform settings.`
      : '') +
    `<br>Go to <strong>Dashboard</strong> for personalised career predictions, or press the 🎙️ mic button to talk to me! 🚀`;

  return (
    <>
      <div className="bg-orbs"><span></span><span></span><span></span></div>
      <div id="appShell">
        <Navbar page={page} goTo={goTo} userName={fullName} isAdmin={isAdmin} onLogout={handleLogout} />

        {/* All pages stay mounted (like the original single-page app) so state —
            chat history, prediction results, admin tab — survives navigation.
            Visibility is purely CSS-driven via the .pg / .pg.active classes. */}
        <div id="pg-home" className={`pg ${page === 'home' ? 'active' : ''}`}>
          <Home goTo={goTo} />
        </div>

        <div id="pg-dashboard" className={`pg ${page === 'dashboard' ? 'active' : ''}`}>
          <Dashboard profile={profile} setProfile={setProfile} logActivity={logActivity} currentUser={currentUser} />
        </div>

        <div id="pg-courses" className={`pg ${page === 'courses' ? 'active' : ''}`}>
          <Courses />
        </div>

        <div id="pg-chatbot" className={`pg ${page === 'chatbot' ? 'active' : ''}`}>
          <Chatbot currentUser={currentUser} welcomeMessage={welcomeMessage} />
        </div>

        {isAdmin && (
          <div id="pg-admin" className={`pg ${page === 'admin' ? 'active' : ''}`}>
            <Admin
              currentUser={currentUser}
              activityLog={activityLog}
              logActivity={logActivity}
              usersVersion={usersVersion}
              bumpUsersVersion={() => setUsersVersion((v) => v + 1)}
            />
          </div>
        )}
      </div>
    </>
  );
}