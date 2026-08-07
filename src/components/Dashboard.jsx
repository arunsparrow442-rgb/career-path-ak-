import { useEffect, useRef, useState } from 'react';
import { careerDB, defaultCareers } from '../data/careerData.js';
import ResumeUpload from './ResumeUpload.jsx';

export default function Dashboard({ profile, setProfile, logActivity, currentUser }) {
  const [results, setResults] = useState(null); // array of {t,c,score}
  const resultsRef = useRef(null);
  const [barsGrown, setBarsGrown] = useState(false);

  const field = (key) => ({
    value: profile[key] ?? '',
    onChange: (e) => setProfile((p) => ({ ...p, [key]: e.target.value })),
  });

  function doPredict() {
    const domain = profile.domain;
    const careers = (domain && careerDB[domain]) ? careerDB[domain] : defaultCareers;
    const gpa = parseFloat(profile.gpa) || 7;
    const boost = gpa >= 8.5 ? 2 : gpa >= 7 ? 0 : -3;
    const scored = careers.map((c) => ({ ...c, score: Math.min(99, c.m + boost) }));
    setResults(scored);
    setBarsGrown(false);
    logActivity('Career prediction run by: ' + currentUser, 'gold');
  }

  useEffect(() => {
    if (results) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      const t = setTimeout(() => setBarsGrown(true), 300);
      return () => clearTimeout(t);
    }
  }, [results]);

  return (
    <div className="dash">
      <div className="page-title">⚡ CAREER PREDICTION MATRIX</div>
      <div className="page-sub">Enter your academic &amp; skill profile to get AI-powered career predictions</div>

      <div className="stats-row">
        <div className="stat"><div className="num">94%</div><div className="lbl">Accuracy</div></div>
        <div className="stat"><div className="num">250+</div><div className="lbl">Career Paths</div></div>
        <div className="stat"><div className="num">1.2k</div><div className="lbl">Courses</div></div>
        <div className="stat"><div className="num">85k</div><div className="lbl">Students</div></div>
      </div>

      <ResumeUpload onApply={(vals) => setProfile((p) => ({ ...p, ...vals }))} />

      <div className="input-card">
        <h3>🎓 YOUR ACADEMIC &amp; SKILL PROFILE</h3>
        <div className="fields-grid">
          <div>
            <label>Degree</label>
            <select {...field('degree')}>
              <option value="">Select degree</option>
              <option>B.Tech – Computer Science</option>
              <option>B.Tech – Electronics</option>
              <option>B.Sc – Mathematics</option>
              <option>BCA</option>
              <option>MBA</option>
              <option>B.Com</option>
              <option>B.A</option>
              <option>B.Tech – Mechanical</option>
            </select>
          </div>
          <div>
            <label>Year</label>
            <select {...field('year')}>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>Final Year</option>
              <option>Graduated</option>
            </select>
          </div>
          <div>
            <label>GPA / CGPA</label>
            <input type="number" min="0" max="10" step="0.1" placeholder="e.g. 8.2" {...field('gpa')} />
          </div>
          <div>
            <label>Programming Skill</label>
            <select {...field('lang')}>
              <option value="">Select language</option>
              <option>Python</option>
              <option>Java</option>
              <option>JavaScript</option>
              <option>C / C++</option>
              <option>SQL</option>
              <option>R</option>
              <option>None</option>
            </select>
          </div>
          <div>
            <label>Domain Interest</label>
            <select {...field('domain')}>
              <option value="">Select domain</option>
              <option>Artificial Intelligence / ML</option>
              <option>Data Science</option>
              <option>Web Development</option>
              <option>Cybersecurity</option>
              <option>Cloud Computing</option>
              <option>Business Analysis</option>
              <option>Finance / Fintech</option>
              <option>Design / UX</option>
              <option>Embedded Systems</option>
              <option>Research / Academia</option>
            </select>
          </div>
          <div>
            <label>Work Preference</label>
            <select {...field('work')}>
              <option>Corporate / MNC</option>
              <option>Startup</option>
              <option>Freelance / Remote</option>
              <option>Government</option>
              <option>Research / PhD</option>
            </select>
          </div>
        </div>
        <button className="predict-btn" onClick={doPredict}>⚡ ANALYZE &amp; PREDICT MY CAREERS</button>
      </div>

      {results && (
        <div id="results-section" ref={resultsRef}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.8rem', color: 'var(--gold2)', letterSpacing: '2px', marginBottom: '16px' }}>
            🏆 TOP CAREER MATCHES — AK TECH AI
          </div>
          <div className="results-grid">
            {results.map((c, i) => (
              <div className="result-card" key={c.t} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="rank-label">◆ RANK #{i + 1} — AK TECH AI</div>
                <h4>{c.t}</h4>
                <div className="match-score">✅ {c.score}% MATCH SCORE</div>
                <div className="prog-bg">
                  <div className="prog" style={{ width: barsGrown ? `${c.score}%` : 0 }} />
                </div>
                <p style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.68rem', color: 'var(--muted)', marginBottom: '8px', letterSpacing: '1px' }}>
                  📚 COURSES:
                </p>
                <ul className="course-list">
                  {c.c.map((course) => (<li key={course}>{course}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
