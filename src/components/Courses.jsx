import { useState } from 'react';
import { COURSES } from '../data/coursesData.js';

const TAG_CLASS = { tech: 't-tech', data: 't-data', biz: 't-biz', design: 't-design', nearby: 't-nearby' };

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'tech', label: 'Technology' },
  { id: 'data', label: 'Data & AI' },
  { id: 'biz', label: 'Business' },
  { id: 'design', label: 'Design' },
  { id: 'nearby', label: '📍 Nearby Colleges', nearby: true },
];

export default function Courses() {
  const [filter, setFilter] = useState('all');

  const list =
    filter === 'all' ? COURSES :
    filter === 'nearby' ? COURSES.filter((c) => c.nearby) :
    COURSES.filter((c) => c.tag === filter && !c.nearby);

  return (
    <div className="courses-wrap">
      <div className="page-title">📚 LEARNING PATHWAYS</div>
      <div className="page-sub">Online courses + nearby colleges in Chennai with official website links</div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`f-btn ${filter === f.id ? 'on' : ''}`}
            style={f.nearby ? { borderColor: 'rgba(212,175,55,0.35)', color: 'var(--gold)' } : undefined}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="course-grid">
        {list.map((c) => (
          <div className="c-card" key={c.t}>
            <span className={`c-tag ${TAG_CLASS[c.tag] || 't-tech'}`}>{c.label}</span>
            {c.nearby && <div className="college-badge">📍 {c.college}</div>}
            <h4>{c.t}</h4>
            <p>{c.d}</p>
            <div className="c-meta">
              {c.dur && <span>⏱ {c.dur}</span>}
              {c.lvl && <span>📊 {c.lvl}</span>}
            </div>
            {c.url && (
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="visit-link">
                🌐 {c.nearby ? 'College' : 'Course'} Website ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
