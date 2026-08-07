import { useEffect, useRef, useState } from 'react';
import { KB } from '../data/chatbotKB.js';

const QUICK_CHIPS = [
  'What career suits me?',
  'Best courses for Data Science',
  'Salary of Software Engineer',
  'How to become AI Engineer?',
  'Top skills in demand 2025',
  'MBA vs M.Tech',
  'How to crack placements?',
  'Best programming language to learn',
];

function getBotReply(q) {
  const ql = q.toLowerCase();
  for (const entry of KB) {
    for (const kw of entry.k) {
      if (ql.includes(kw)) return entry.html;
    }
  }
  return '🤔 I\'m not sure about that specific topic, but I can help with:<br>• Career roadmaps (AI, Data Science, Web Dev, Cybersecurity…)<br>• Salary benchmarks & placements<br>• Recommended courses & nearby Chennai colleges<br>• MBA vs M.Tech, Resume tips, LinkedIn<br><br>Try asking: <em>"How to become a Data Scientist?"</em> or <em>"Best courses for cloud computing"</em>';
}

export default function Chatbot({ currentUser, welcomeMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);
  const boxRef = useRef(null);
  const recognitionRef = useRef(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    if (welcomeMessage) {
      setMessages([{ id: 'welcome', role: 'bot', html: welcomeMessage }]);
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      setInput(txt);
      stopVoice();
      sendMsg(txt);
    };
    recognition.onerror = () => stopVoice();
    recognition.onend = () => setIsListening((prev) => { if (prev) return false; return prev; });
    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, typing]);

  function addBot(html) {
    setMessages((m) => [...m, { id: Date.now() + Math.random(), role: 'bot', html }]);
  }
  function addUser(txt) {
    setMessages((m) => [...m, { id: Date.now() + Math.random(), role: 'user', text: txt }]);
  }

  function sendMsg(overrideText) {
    const txt = (overrideText ?? input).trim();
    if (!txt) return;
    setInput('');
    addUser(txt);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addBot(getBotReply(txt));
    }, 900);
  }

  function qSend(text) {
    setInput(text);
    sendMsg(text);
  }

  function toggleVoice() {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isListening) { stopVoice(); return; }
    setIsListening(true);
    recognition.start();
  }
  function stopVoice() {
    setIsListening(false);
    try { recognitionRef.current?.stop(); } catch (e) { /* ignore */ }
  }

  function speakText(id, txt) {
    if (!window.speechSynthesis) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(txt);
    utt.lang = 'en-IN';
    utt.rate = 0.95;
    utt.onend = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utt);
  }

  const userAvatar = currentUser ? currentUser[0].toUpperCase() : 'U';

  return (
    <div className="chat-wrap">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '4px' }}>
        <div>
          <div className="page-title">🤖 AK TECH AI ADVISOR</div>
          <div className="page-sub" style={{ marginBottom: 0 }}>Ask me anything — type or use your voice 🎙️</div>
        </div>
        <div className={`voice-status ${isListening ? 'show' : ''}`}>
          <div className="voice-wave"><span></span><span></span><span></span><span></span><span></span></div>
          <span>LISTENING…</span>
        </div>
      </div>

      <div className="quick-chips" style={{ marginTop: '14px' }}>
        {QUICK_CHIPS.map((c) => (
          <span className="chip" key={c} onClick={() => qSend(c)}>{c}</span>
        ))}
      </div>

      <div className="chat-box" ref={boxRef}>
        {messages.map((m) => (
          <div className={`msg ${m.role}`} key={m.id}>
            <div className="msg-av">{m.role === 'bot' ? 'AI' : userAvatar}</div>
            {m.role === 'bot' ? (
              <div>
                <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: m.html }} />
                <button
                  className={`speak-btn ${speakingId === m.id ? 'speaking' : ''}`}
                  onClick={() => speakText(m.id, m.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())}
                >
                  {speakingId === m.id ? '⏹ Stop' : '🔊 Listen'}
                </button>
              </div>
            ) : (
              <div className="msg-bubble">{m.text}</div>
            )}
          </div>
        ))}
        {typing && (
          <div className="msg bot">
            <div className="msg-av">AI</div>
            <div className="msg-bubble">
              <div className="typing-dots"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-row">
        <input
          type="text"
          placeholder="Type your career question or press 🎙️ to speak…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMsg(); }}
        />
        <button className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={toggleVoice} title="Click to speak">🎙️</button>
        <button className="chat-send" onClick={() => sendMsg()}>➤</button>
      </div>
      {!voiceSupported && (
        <div style={{ display: 'block', marginTop: '8px', fontSize: '0.74rem', color: 'var(--muted)', fontFamily: "'Orbitron',monospace", letterSpacing: '1px' }}>
          ⚠ Voice not supported in this browser. Try Chrome or Edge.
        </div>
      )}
    </div>
  );
}
