import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User, BookOpen } from 'lucide-react';

const STEP_LABELS = ['Home', 'Path', 'Subject', 'Topics', 'Learning'];

export default function Navbar({ currentStep = 0, session = null }) {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')} role="button" id="nav-logo">
          <div className="navbar-logo-icon">🧠</div>
          <span className="navbar-logo-text">CogFlow</span>
        </div>

        {/* Step breadcrumb (only shown after step 0) */}
        {currentStep > 0 && (
          <div className="navbar-steps" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {STEP_LABELS.slice(1).map((label, i) => {
              const stepNum = i + 1;
              const isDone = stepNum < currentStep;
              const isActive = stepNum === currentStep;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div className={`nav-step ${isActive ? 'active' : isDone ? 'completed' : ''}`}>
                    {isDone ? '✓' : <span className="nav-step-dot" />}
                    {label}
                  </div>
                  {stepNum < 4 && <div className="nav-divider" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Right Controls: Session indicator + Profile Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {session && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px', fontSize: 13,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: session.state === 'overload' ? 'var(--rose)' :
                             session.state === 'bored' ? 'var(--amber)' : 'var(--emerald)',
                animation: 'blink 1.5s ease infinite',
              }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                {session.state === 'overload' ? 'Overloaded' :
                 session.state === 'bored' ? 'Bored' : 'In Flow'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{session.time}</span>
            </div>
          )}

          {/* Student Profile & History Button */}
          {user && (
            <button
              id="btn-nav-profile"
              onClick={() => navigate('/profile')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-primary)',
                transition: 'var(--transition)'
              }}
              title="View User Profile & Learned History"
            >
              <span style={{ fontSize: 15 }}>{user.avatar || '🎓'}</span>
              <span>{user.name}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
