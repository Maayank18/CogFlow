import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  {
    icon: '👁️',
    title: 'Silent Observation',
    desc: 'Tracks your mouse, scroll, and typing patterns — no webcam required in Phase 1.',
  },
  {
    icon: '🧠',
    title: 'Cognitive Classification',
    desc: 'AI model detects if you\'re overloaded, in flow, or bored every 10 seconds.',
  },
  {
    icon: '📖',
    title: 'Adaptive Content',
    desc: 'Content difficulty shifts up or down automatically so you stay in the learning zone.',
  },
  {
    icon: '📊',
    title: 'Session Analytics',
    desc: 'See a timeline of your mental state throughout the session after you\'re done.',
  },
];

const stats = [
  { value: '3x', label: 'Better retention' },
  { value: '40%', label: 'Less study time' },
  { value: '5', label: 'Difficulty tiers' },
  { value: '10s', label: 'Adaptation cycle' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Background orbs */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <Navbar currentStep={0} />

      {/* HERO SECTION */}
      <section style={{
        paddingTop: '100px',
        paddingBottom: '80px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 65%)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container-narrow animate-fadeInUp">
          {/* Pill badge */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <span className="badge badge-indigo" style={{ fontSize: '13px', padding: '6px 14px' }}>
              <span style={{ fontSize: '8px' }}>🟢</span>
              Phase 1 · Now Available
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.08,
            marginBottom: '24px',
            letterSpacing: '-0.03em',
          }}>
            Learn Smarter.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Not Harder.
            </span>
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '40px',
            maxWidth: '560px',
            margin: '0 auto 40px',
          }}>
            CogFlow watches how your brain is coping and{' '}
            <strong style={{ color: 'var(--text-primary)' }}>automatically adjusts</strong>{' '}
            content difficulty — so you always stay in the optimal learning zone.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg animate-float"
              onClick={() => navigate('/choose-path')}
              id="hero-start-btn"
            >
              Start Learning Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              id="hero-learn-more-btn"
            >
              How it Works
            </button>
          </div>
        </div>

        {/* Floating demo card */}
        <div className="container animate-fadeInUp delay-300" style={{ marginTop: '64px' }}>
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), var(--shadow-glow-lg)',
          }}>
            {/* Fake window bar */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid var(--border)',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                CogFlow · Machine Learning Basics
              </span>
            </div>
            {/* Demo content */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Reading · Gradient Descent
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <p style={{ marginBottom: 8 }}>Gradient descent is an optimization algorithm that iteratively moves towards the minimum of a function by taking steps proportional to the negative gradient.</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>The learning rate η controls the size of each step. Too large → overshoot. Too small → slow convergence.</p>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <span className="tag selected">Simplify</span>
                  <span className="tag">Normal</span>
                  <span className="tag">Advanced</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Cognitive Load
                </div>
                <div className="load-gauge-wrapper" style={{ padding: '16px' }}>
                  <div className="load-gauge-bar">
                    <div className="load-gauge-fill high" style={{ width: '78%' }} />
                  </div>
                  <div className="load-state-indicator load-state-overload" style={{ marginTop: 10 }}>
                    <span style={{ fontSize: 8 }}>🔴</span> Overloaded
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                    ↓ Switching to simpler tier…
                  </div>
                </div>
                <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Mouse velocity</span><span style={{ color: 'var(--text-secondary)' }}>Low</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Scroll rate</span><span style={{ color: 'var(--text-secondary)' }}>Slow</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Typing rhythm</span><span style={{ color: 'var(--text-secondary)' }}>Irregular</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '48px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="grid-4">
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }} className={`animate-fadeInUp delay-${(i+1)*100}`}>
                <div style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'Space Grotesk', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="badge badge-indigo" style={{ marginBottom: 16 }}>How It Works</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 16 }}>
              The Invisible Co-Pilot for Learning
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', fontSize: 16 }}>
              No buttons to press. No ratings to give. Just read — CogFlow handles the rest.
            </p>
          </div>

          <div className="grid-4">
            {features.map((f, i) => (
              <div key={i} className={`card animate-fadeInUp delay-${(i+1)*100}`}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOW STEPS */}
      <section style={{ padding: '60px 0', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 48 }}>
            Your Learning Journey
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
            {[
              { num: '01', label: 'Pick a Subject', desc: 'Choose from preset subjects or upload your own syllabus PDF' },
              { num: '02', label: 'Select Topics', desc: 'Pick the specific topics you want to study in this session' },
              { num: '03', label: 'Read Naturally', desc: 'Content loads — just read at your own pace, no instructions needed' },
              { num: '04', label: 'AI Adapts', desc: 'Every 10 seconds the AI re-evaluates and adjusts content tier' },
              { num: '05', label: 'Session Review', desc: 'See your cognitive load timeline and which topics were hardest' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'center', maxWidth: 160 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: i === 0 ? 'var(--gradient-brand)' : 'var(--bg-card)',
                    border: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: i === 0 ? 'white' : 'var(--text-muted)',
                    margin: '0 auto 12px',
                    boxShadow: i === 0 ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
                  }}>{step.num}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div>
                </div>
                {i < 4 && (
                  <div style={{ width: 60, height: 1, background: 'var(--border)', marginTop: 24, flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Ready to learn smarter?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16 }}>
          No sign-up needed for Phase 1. Just pick a topic and start.
        </p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/choose-path')}
          id="footer-start-btn"
        >
          Get Started Now
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, position: 'relative', zIndex: 1 }}>
        CogFlow · B.Tech Minor Project · Phase 1
      </footer>
    </div>
  );
}
