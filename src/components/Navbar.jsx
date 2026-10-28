import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Brain, Cpu, User, ArrowRight, Volume2, VolumeX, Activity, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Navbar({ currentStep = 0, session = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [muted, setMuted] = useState(sounds.isMuted());

  const handleToggleSound = () => {
    const isNowMuted = sounds.toggleMute();
    setMuted(isNowMuted);
  };

  const navItemClick = () => {
    sounds.playClick();
  };

  // User initials for monogram badge
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'PG';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(7, 9, 14, 0.82)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1360, margin: '0 auto', padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
      }}>
        {/* Left: Brand Identity */}
        <Link
          to="/"
          onClick={navItemClick}
          style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {/* Custom SVG Neural Frequency Icon */}
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25))',
            border: '1px solid rgba(129,140,248,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99,102,241,0.3)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2 12h3l2.5-6 3.5 12 3-8 2 5 2-3h4" stroke="url(#nav-glyph-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="nav-glyph-grad" x1="2" y1="6" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8"/>
                  <stop offset="1" stopColor="#c084fc"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontSize: 18, fontWeight: 900, fontFamily: 'Space Grotesk, -apple-system, sans-serif',
              letterSpacing: '-0.03em', color: '#fff',
            }}>
              CogFlow
            </span>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--indigo-light)', background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)', padding: '2px 6px', borderRadius: 6
            }}>
              v2.4 Neural
            </span>
          </div>
        </Link>

        {/* Center: Live Session HUD or System Status */}
        {session ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            borderRadius: 99, padding: '4px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: session.state === 'flow' ? '#10b981' : session.state === 'overload' ? '#f43f5e' : '#f59e0b',
                boxShadow: `0 0 8px ${session.state === 'flow' ? '#10b981' : session.state === 'overload' ? '#f43f5e' : '#f59e0b'}`,
              }} />
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
                {session.state}
              </span>
            </div>
            <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--indigo-light)' }}>
              {session.time}
            </span>
          </div>
        ) : (
          <div className="hide-mobile" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            fontSize: 11, color: 'var(--text-muted)', fontWeight: 600
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
              DAiSEE Engine Active
            </span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>
              24ms Latency · 60 FPS
            </span>
          </div>
        )}

        {/* Right: Sound Toggle, Navigation Links & Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            title={muted ? 'Enable UI Audio Feedback' : 'Mute UI Audio'}
            style={{
              all: 'unset', cursor: 'pointer', padding: '6px 8px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              color: muted ? 'var(--text-muted)' : 'var(--indigo-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'var(--transition)'
            }}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <Link
            to="/choose-path"
            onClick={navItemClick}
            className="hide-mobile"
            style={{
              textDecoration: 'none', fontSize: 12.5, fontWeight: 600,
              color: location.pathname === '/choose-path' ? 'var(--indigo-light)' : 'var(--text-secondary)',
              padding: '6px 12px', borderRadius: 8,
              transition: 'all 0.2s ease',
            }}
          >
            Explore Paths
          </Link>

          {/* Profile Monogram Button */}
          <Link
            to="/profile"
            onClick={navItemClick}
            style={{
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              padding: '4px 10px 4px 6px', borderRadius: 20,
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))',
              border: '1px solid rgba(129,140,248,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 900, color: '#c7d2fe', fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {initials}
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.name?.split(' ')[0] || 'Learner'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
