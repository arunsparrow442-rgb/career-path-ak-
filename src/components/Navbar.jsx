export default function Navbar({ page, goTo, userName, isAdmin, onLogout }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'courses', label: 'Courses' },
    { id: 'chatbot', label: 'AI Advisor' },
    // Admin tab only shows up for admin accounts.
    ...(isAdmin ? [{ id: 'admin', label: '⚙ Admin' }] : []),
  ];

  return (
    <nav>
      <div className="nav-brand">
        <span style={{ fontSize: '1.3rem' }}>⚡</span>
        <div>
          <div className="nav-brand-text">
            <span className="ak">AK </span>
            <span className="tech">TECH</span>
          </div>
          <span className="nav-brand-sub">CareerPath AI</span>
        </div>
      </div>
      <div className="nav-links">
        {links.map((l) => (
          <button
            key={l.id}
            id={`nb-${l.id}`}
            className={page === l.id ? 'active' : ''}
            onClick={() => goTo(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <div className="premium-badge">
          <div className="premium-crown">👑</div>
          <div>
            <div className="premium-name" id="uName">{userName}</div>
            <span className="premium-tag">⚡ PREMIUM · FULL ACCESS</span>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}