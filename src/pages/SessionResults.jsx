import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TIER_COLORS = {
  tier1: { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',  text: '#6ee7b7',  label: 'Simplified', icon: '⬇', hex: '#10b981' },
  tier3: { bg: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.3)',  text: '#a5b4fc',  label: 'Standard',   icon: '─', hex: '#6366f1' },
  tier5: { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)',  text: '#fcd34d',  label: 'Expert',     icon: '⬆', hex: '#f59e0b' },
};

const REASON_LABELS = {
  'manual-simpler': '👤 You simplified',
  'manual-harder':  '👤 You leveled up',
  'ai-suggested':   '🧠 AI suggested',
  'manual':         '👤 Manual',
};

export default function SessionResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, topicNames = [], adaptationLog = [], totalSeconds = 0, avgLoad = 50 } = location.state || {};
  const canvasRef = useRef(null);

  // Guard: redirect if arrived without state
  useEffect(() => {
    if (!subject) navigate('/');
  }, [subject, navigate]);

  // Draw tier-based timeline bar as canvas chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || totalSeconds < 1) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ['Simplified', 'Standard', 'Expert'].forEach((label, i) => {
      const y = H - ((i + 1) / 4) * H;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.font = '9px Inter';
      ctx.fillText(label, 4, y - 3);
    });

    // Build tier segments
    const TIER_Y = { tier1: H * 0.15, tier3: H * 0.5, tier5: H * 0.85 };
    const TIER_HEX = { tier1: '#10b981', tier3: '#6366f1', tier5: '#f59e0b' };
    const segments = [];
    let prevTier = 'tier3'; let prevTime = 0;
    adaptationLog.forEach(e => {
      segments.push({ tier: prevTier, from: prevTime, to: e.time });
      prevTier = e.to; prevTime = e.time;
    });
    segments.push({ tier: prevTier, from: prevTime, to: totalSeconds });

    if (segments.length === 1) {
      const y = TIER_Y[segments[0].tier] || H / 2;
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, TIER_HEX[segments[0].tier] || '#6366f1');
      grad.addColorStop(1, TIER_HEX[segments[0].tier] || '#6366f1');
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
    } else {
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const x1 = (seg.from / totalSeconds) * W;
        const x2 = (seg.to / totalSeconds) * W;
        const y1 = TIER_Y[segments[i === 0 ? 0 : i - 1]?.tier] || H / 2;
        const y2 = TIER_Y[seg.tier] || H / 2;
        ctx.beginPath(); ctx.moveTo(x1, i === 0 ? y2 : y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = TIER_HEX[seg.tier] || '#6366f1';
        ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
        // Dot at start of each segment
        ctx.beginPath(); ctx.arc(x1, y2, 4, 0, Math.PI * 2);
        ctx.fillStyle = TIER_HEX[seg.tier] || '#6366f1'; ctx.fill();
      }
    }
  }, [adaptationLog, totalSeconds]);

  if (!subject) return null;

  // Compute tier time breakdown
  const tierSeconds = { tier1: 0, tier3: 0, tier5: 0 };
  let prevTier = 'tier3'; let prevTime2 = 0;
  adaptationLog.forEach(e => {
    const dur = e.time - prevTime2;
    if (tierSeconds[prevTier] !== undefined) tierSeconds[prevTier] += dur;
    prevTier = e.to; prevTime2 = e.time;
  });
  const lastDur = totalSeconds - prevTime2;
  if (tierSeconds[prevTier] !== undefined) tierSeconds[prevTier] += lastDur;

  const total = Math.max(1, totalSeconds);
  const simplifiedPct = Math.round((tierSeconds.tier1 / total) * 100);
  const standardPct   = Math.round((tierSeconds.tier3 / total) * 100);
  const expertPct     = Math.round((tierSeconds.tier5 / total) * 100);

  // FIX: declare tooShort BEFORE engagementScore which references it
  const tooShort = totalSeconds < 10;

  // Score: reward time at any tier + bonus for expert time
  const engagementScore = tooShort ? 0 : Math.min(100, Math.round(
    standardPct * 0.5 + expertPct * 1.0 + simplifiedPct * 0.3
  ));

  const formatTime = (s) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const score = tooShort
    ? 0
    : Math.min(100, Math.round(engagementScore));
  const scoreLabel = tooShort ? 'Session Too Short' : score >= 70 ? 'Excellent' : score >= 45 ? 'Good' : 'Needs Work';
  const scoreColor = tooShort ? '#6366f1' : score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="page">
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <Navbar currentStep={0} />

      <div className="content-area" style={{ flex: 1, padding: '40px 24px 80px' }}>
        <div className="container" style={{ maxWidth: 960 }}>

          {/* Header */}
          <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: 48 }}>
            {/* Big score circle */}
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: `conic-gradient(${scoreColor} ${score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: `0 0 40px ${scoreColor}40`,
              position: 'relative',
            }}>
              <div style={{
                width: 96, height: 96, borderRadius: '50%',
                background: 'var(--bg-primary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Space Grotesk', color: scoreColor }}>{score}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Score</div>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 8 }}>
              {tooShort ? 'Session Ended Early' : 'Session Complete! 🎉'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 8 }}>
              {subject} · {formatTime(totalSeconds)} session · {topicNames.length} topic{topicNames.length !== 1 ? 's' : ''}
            </p>
            {tooShort ? (
              <span style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: '99px',
                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                color: 'var(--indigo-light)', fontSize: 13, fontWeight: 600,
              }}>
                ⚡ Study for at least 30 seconds to get a full score
              </span>
            ) : (
              <span style={{
                display: 'inline-block', padding: '4px 14px', borderRadius: '99px',
                background: `${scoreColor}20`, border: `1px solid ${scoreColor}50`,
                color: scoreColor, fontSize: 13, fontWeight: 700,
              }}>
                {scoreLabel} Performance
              </span>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid-4 animate-fadeInUp delay-100" style={{ marginBottom: 28 }}>
            {[
              { label: 'Total Time',   value: formatTime(totalSeconds), icon: '⏱️', sub: 'Session duration' },
              { label: 'At Standard',  value: `${standardPct}%`,        icon: '─',  sub: formatTime(tierSeconds.tier3), color: '#a5b4fc' },
              { label: 'Adjustments', value: adaptationLog.length,     icon: '🔄', sub: 'Difficulty changes' },
              { label: 'Topics Done',  value: topicNames.length,        icon: '📖', sub: 'Topics covered' },
            ].map(({ label, value, icon, sub, color }) => (
              <div key={label} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, fontFamily: 'Space Grotesk', color: color || 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 6, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Timeline Chart + State Breakdown side by side */}
          <div className="grid-2 animate-fadeInUp delay-200" style={{ marginBottom: 28 }}>

            {/* Chart */}
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
                Difficulty Level Over Time
              </div>
              <canvas
                ref={canvasRef}
                width={400} height={140}
                style={{ width: '100%', height: 140, borderRadius: 8 }}
              />
              <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
                {Object.entries(TIER_COLORS).map(([tier, cfg]) => (
                  <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                    <div style={{ width: 10, height: 3, borderRadius: 99, background: cfg.hex }} />
                    {cfg.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Tier breakdown */}
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
                Time at Each Difficulty
              </div>
              {[
                { tier: 'tier1', pct: simplifiedPct, seconds: tierSeconds.tier1 },
                { tier: 'tier3', pct: standardPct,   seconds: tierSeconds.tier3 },
                { tier: 'tier5', pct: expertPct,     seconds: tierSeconds.tier5 },
              ].map(({ tier, pct, seconds }) => {
                const cfg = TIER_COLORS[tier];
                return (
                  <div key={tier} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13 }}>{cfg.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: cfg.text }}>{cfg.label}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatTime(seconds)}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: cfg.text }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: cfg.hex, borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}

              {/* Insight */}
              <div style={{
                marginTop: 8, padding: '12px 14px',
                background: 'rgba(99,102,241,0.06)', borderRadius: 8,
                border: '1px solid rgba(99,102,241,0.15)', fontSize: 13,
                color: 'var(--text-secondary)', lineHeight: 1.6,
              }}>
                {expertPct >= 40
                  ? `🎯 Great! You spent ${expertPct}% at Expert level — excellent challenge!`
                  : simplifiedPct >= 50
                  ? `💡 You needed Simplified content for ${simplifiedPct}% of the session. Keep reviewing the basics!`
                  : `📚 You stayed mostly at Standard level — a solid balanced session.`
                }
              </div>
            </div>
          </div>

          {/* Topics covered */}
          <div className="card animate-fadeInUp delay-300" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
              Topics Covered
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {topicNames.map((t, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '99px', padding: '6px 14px',
                }}>
                  <span style={{ fontSize: 11, color: 'var(--indigo-light)', fontWeight: 700 }}>#{i + 1}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t}</span>
                  <span style={{ color: '#10b981', fontSize: 13 }}>✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptation log — now shows tier changes */}
          {adaptationLog.length > 0 && (
            <div className="card animate-fadeInUp delay-400" style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
                Adjustment Log — {adaptationLog.length} change{adaptationLog.length !== 1 ? 's' : ''} made
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 220, overflowY: 'auto' }}>
                {adaptationLog.map((entry, i) => {
                  const fromCfg = TIER_COLORS[entry.from] || TIER_COLORS.tier3;
                  const toCfg   = TIER_COLORS[entry.to]   || TIER_COLORS.tier3;
                  const reasonLabel = REASON_LABELS[entry.reason] || '↕';
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                      padding: '10px 0', borderBottom: i < adaptationLog.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      <span style={{ fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', width: 36, flexShrink: 0 }}>
                        {Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: fromCfg.bg, color: fromCfg.text, border: `1px solid ${fromCfg.border}` }}>
                        {fromCfg.icon} {entry.fromLabel || fromCfg.label}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>→</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: toCfg.bg, color: toCfg.text, border: `1px solid ${toCfg.border}` }}>
                        {toCfg.icon} {entry.toLabel || toCfg.label}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{reasonLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Saved to Profile Badge */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
              color: '#6ee7b7', padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600
            }}>
              <span>💾</span> Session & topic mastery recorded in your Profile History
            </span>
          </div>

          {/* Action buttons */}
          <div className="animate-fadeInUp delay-400" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              id="view-profile-btn"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/profile')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span>👤</span> View Profile & History
            </button>
            <button
              id="study-again-btn"
              className="btn btn-primary btn-lg"
              onClick={() => {
                // FIX: preserve subject context — go back to same subject's topic selection
                if (location.state?.subjectId) {
                  navigate(`/topics?subject=${location.state.subjectId}`);
                } else {
                  navigate('/subjects');
                }
              }}
            >
              Study Again
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              id="home-btn"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
