import demoPreview from '../assets/demo-preview.svg';

const FEATURES = [
  { icon: '🧠', title: 'AI Predictions', desc: 'Neural engine analyses your profile to predict top matching careers with precision scores.' },
  { icon: '📚', title: 'Smart Courses', desc: 'Personalised course recommendations from top platforms to bridge skill gaps fast.' },
  { icon: '🎙️', title: 'Voice AI Advisor', desc: 'Speak naturally — our voice assistant listens, responds, and reads answers aloud for you.' },
  { icon: '🏫', title: 'Nearby Colleges', desc: 'Find offline courses at top colleges in Chennai with direct website links.' },
  { icon: '🎯', title: 'Skill Gap Analysis', desc: 'Identify exactly what skills you need to land your dream role.' },
  { icon: '🏆', title: 'Progress Tracking', desc: 'Track completed courses and watch your career match score improve over time.' },
];

export default function Home({ goTo }) {
  return (
    <div className="dash" style={{ padding: 0 }}>
      <div className="hero">
        <div className="hero-badge vip">👑 AK TECH AI · Premium Direct-Access Edition</div>
        <h1>
          Discover Your
          <br />
          <span className="grad">Perfect Career Path</span>
        </h1>
        <p>
          AK TECH's AI-powered system analyses your skills, interests, and academic profile —
          delivering precision career predictions with personalised roadmaps.
        </p>
        <div className="hero-btns">
          <button className="btn-solid" onClick={() => goTo('dashboard')}>⚡ Predict My Career</button>
          <button className="btn-outline" onClick={() => goTo('chatbot')}>Chat with AI Advisor</button>
        </div>

        <div className="hero-demo">
          <img src={demoPreview} alt="AK TECH CareerPath AI dashboard preview showing career match predictions" />
        </div>
      </div>
      <div className="features">
        {FEATURES.map((f) => (
          <div className="feat" key={f.title}>
            <div className="feat-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
