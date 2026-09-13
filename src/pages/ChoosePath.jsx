import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ChoosePath() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <Navbar currentStep={1} />

      <div className="content-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 24px' }}>
        <div className="container-narrow">

          {/* Step Indicator */}
          <StepIndicator current={1} />

          {/* Heading */}
          <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 14 }}>
              How would you like to start?
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 420, margin: '0 auto' }}>
              Choose a pre-built subject path, or upload your own syllabus/PDF to generate a custom topic list.
            </p>
          </div>

          {/* Two path cards */}
          <div className="grid-2 animate-fadeInUp delay-200">

            {/* Path A — Preset Subjects */}
            <button
              id="path-preset-btn"
              onClick={() => navigate('/subjects')}
              style={{ all: 'unset', cursor: 'pointer', display: 'block' }}
            >
              <div className="card" style={{ height: '100%', textAlign: 'center', padding: '40px 32px', cursor: 'pointer' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, margin: '0 auto 20px',
                }}>
                  🎓
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
                  Choose a Subject
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  Pick from curated subjects like{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>Computer Science, Mathematics, Physics</strong>{' '}
                  and more. Pre-loaded with topic breakdowns.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
                  {['Computer Science', 'Mathematics', 'Physics', 'Data Science', 'Economics'].map(s => (
                    <span key={s} className="badge badge-indigo" style={{ fontSize: 12 }}>{s}</span>
                  ))}
                </div>
                <div className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Browse Subjects
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </button>

            {/* Path B — Upload PDF */}
            <button
              id="path-upload-btn"
              onClick={() => navigate('/topics?source=upload')}
              style={{ all: 'unset', cursor: 'pointer', display: 'block' }}
            >
              <div className="card" style={{ height: '100%', textAlign: 'center', padding: '40px 32px', cursor: 'pointer' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.1))',
                  border: '1px solid rgba(6,182,212,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, margin: '0 auto 20px',
                }}>
                  📄
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
                  Upload Your Syllabus
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  Upload a <strong style={{ color: 'var(--text-primary)' }}>PDF or text file</strong> of your syllabus, notes, or book chapters. CogFlow will extract topics automatically.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
                  {['PDF', 'TXT', 'Custom Topics', 'Any Subject'].map(s => (
                    <span key={s} className="badge badge-cyan" style={{ fontSize: 12 }}>{s}</span>
                  ))}
                </div>
                <div className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Upload File
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Privacy note */}
          <div className="animate-fadeInUp delay-400" style={{
            marginTop: 32, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span>🔒</span>
            All uploaded files are processed locally and never stored on any server.
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current }) {
  const steps = ['Start', 'Path', 'Subject', 'Topics', 'Learn'];
  return (
    <div className="step-indicator">
      {steps.map((label, i) => (
        <div key={i} className="step-item">
          <div className="step-wrapper">
            <div className={`step-circle ${i < current ? 'done' : i === current ? 'active' : ''}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <div className={`step-label ${i < current ? 'done' : i === current ? 'active' : ''}`}>{label}</div>
          </div>
          {i < steps.length - 1 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
        </div>
      ))}
    </div>
  );
}
