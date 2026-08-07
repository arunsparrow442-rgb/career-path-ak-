import { useRef, useState } from 'react';

// Lightweight keyword → domain map (client-side only, no external AI call needed).
const DOMAIN_KEYWORDS = {
  'Artificial Intelligence / ML': ['machine learning', 'tensorflow', 'pytorch', 'neural network', 'deep learning', 'nlp', 'scikit-learn', 'ml'],
  'Data Science': ['data science', 'pandas', 'numpy', 'data analysis', 'tableau', 'power bi', 'statistics', 'sql'],
  'Web Development': ['react', 'javascript', 'html', 'css', 'node.js', 'node', 'express', 'frontend', 'backend', 'full stack'],
  'Cybersecurity': ['cybersecurity', 'penetration testing', 'ethical hacking', 'network security', 'ceh', 'siem'],
  'Cloud Computing': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops', 'terraform', 'cloud'],
  'Business Analysis': ['business analyst', 'agile', 'scrum', 'jira', 'requirements', 'product management'],
  'Finance / Fintech': ['finance', 'cfa', 'financial modelling', 'accounting', 'investment', 'banking'],
  'Design / UX': ['ux', 'ui', 'figma', 'user research', 'prototyping', 'design systems'],
  'Embedded Systems': ['embedded', 'arduino', 'microcontroller', 'iot', 'vlsi', 'firmware', 'rtos'],
  'Research / Academia': ['research', 'thesis', 'publication', 'phd', 'academic'],
};

const LANG_KEYWORDS = {
  Python: ['python'],
  Java: ['java'],
  JavaScript: ['javascript', 'typescript', 'js'],
  'C / C++': ['c++', ' c ', 'c programming'],
  SQL: ['sql'],
  R: [' r ', 'r programming'],
};

function analyzeResume(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  const domainScores = Object.entries(DOMAIN_KEYWORDS).map(([domain, kws]) => {
    const hits = kws.filter((k) => t.includes(k));
    return { domain, hits };
  }).filter((d) => d.hits.length > 0).sort((a, b) => b.hits.length - a.hits.length);

  const langHits = Object.entries(LANG_KEYWORDS)
    .filter(([, kws]) => kws.some((k) => t.includes(k)))
    .map(([lang]) => lang);

  return { topDomain: domainScores[0]?.domain || null, domainScores, langHits };
}

export default function ResumeUpload({ onApply }) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (!/\.(txt|md)$/i.test(file.name)) {
      setResult({ error: 'Please upload a .txt resume, or paste your resume text below — PDF/DOCX parsing needs a backend service.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setText(String(ev.target.result || ''));
    reader.readAsText(file);
  }

  function runAnalysis() {
    if (!text.trim()) { setResult({ error: 'Paste your resume text or upload a .txt file first.' }); return; }
    const analysis = analyzeResume(text);
    setResult(analysis);
  }

  function applySuggestion() {
    if (result?.topDomain) {
      onApply({ domain: result.topDomain, lang: result.langHits[0] || '' });
    }
  }

  return (
    <div className="resume-card">
      <h3>📄 RESUME-BASED SUGGESTION</h3>
      <div className="page-sub">Upload a .txt resume or paste your resume text — we'll scan it for skills and suggest a domain (runs fully in your browser, no data leaves your device)</div>

      <div className="resume-drop" onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" accept=".txt,.md" onChange={handleFile} />
        {fileName ? `📎 ${fileName} — click to change` : '📎 Click to upload a .txt resume'}
      </div>

      <textarea
        placeholder="...or paste your resume text here"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'rgba(5,4,10,0.95)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px', color: 'var(--text)', fontFamily: "'Rajdhani',sans-serif", fontSize: '0.88rem', resize: 'vertical' }}
      />

      <button className="predict-btn" style={{ marginTop: '12px' }} onClick={runAnalysis}>🔍 ANALYZE RESUME</button>

      {result?.error && <div className="err-msg" style={{ display: 'block' }}>⚠ {result.error}</div>}

      {result && !result.error && (
        result.topDomain ? (
          <>
            <div className="resume-match">
              🎯 Best-matching domain: <strong>{result.topDomain}</strong>
              {result.langHits.length > 0 && <> · Detected language(s): <strong>{result.langHits.join(', ')}</strong></>}
            </div>
            <div className="resume-tags">
              {result.domainScores.slice(0, 5).map((d) => (
                <span className="resume-tag" key={d.domain}>{d.domain} ({d.hits.length})</span>
              ))}
            </div>
            <button className="btn-outline" style={{ marginTop: '14px' }} onClick={applySuggestion}>
              ⬇ Apply to Profile Form
            </button>
          </>
        ) : (
          <div className="resume-match">No strong domain match found — try pasting more of your resume, or fill the form manually below.</div>
        )
      )}
    </div>
  );
}
