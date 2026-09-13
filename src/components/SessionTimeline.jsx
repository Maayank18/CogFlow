// Updated to work with new tier-based adaptation log
// (from/to are now tier keys like 'tier1', 'tier3', 'tier5')

const TIER_COLORS = {
  tier1: '#10b981', // emerald — simplified
  tier3: '#6366f1', // indigo  — standard
  tier5: '#f59e0b', // amber   — expert
};

const TIER_LABELS = {
  tier1: 'Simplified',
  tier3: 'Standard',
  tier5: 'Expert',
};

const REASON_ICONS = {
  'manual-simpler':  '👤⬇',
  'manual-harder':   '👤⬆',
  'ai-suggested':    '🧠',
  'manual':          '👤',
};

export default function SessionTimeline({ adaptationLog, totalSeconds }) {
  if (totalSeconds < 5) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', padding: '18px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
          Difficulty Timeline
        </div>
        <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          Timeline builds as you read…
        </div>
      </div>
    );
  }

  // Build segments: each segment represents a period at a given tier
  const segments = [];
  let prevTier = 'tier3'; // start at Standard
  let prevTime = 0;

  adaptationLog.forEach((entry) => {
    segments.push({ tier: prevTier, from: prevTime, to: entry.time });
    prevTier = entry.to;
    prevTime = entry.time;
  });
  // Final segment (current tier to now)
  segments.push({ tier: prevTier, from: prevTime, to: totalSeconds });

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)', padding: '18px',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
        Difficulty Timeline
      </div>

      {/* Bar */}
      <div style={{
        height: 20, background: 'rgba(255,255,255,0.04)',
        borderRadius: 'var(--radius-full)', overflow: 'hidden',
        display: 'flex', marginBottom: 8,
      }}>
        {segments.map((seg, i) => {
          const width = Math.max(4, ((seg.to - seg.from) / totalSeconds) * 100);
          return (
            <div
              key={i}
              title={`${TIER_LABELS[seg.tier] || seg.tier} (${Math.floor(seg.from / 60)}:${(seg.from % 60).toString().padStart(2, '0')})`}
              style={{
                width: `${width}%`,
                background: (TIER_COLORS[seg.tier] || '#6366f1') + '70',
                borderRight: i < segments.length - 1 ? '1px solid rgba(0,0,0,0.3)' : 'none',
                transition: 'width 0.5s ease',
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 10 }}>
        {Object.entries(TIER_COLORS).map(([tier, color]) => (
          <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-muted)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            {TIER_LABELS[tier]}
          </div>
        ))}
      </div>

      {/* Change log */}
      {adaptationLog.length > 0 && (
        <div style={{ maxHeight: 110, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.2) transparent' }}>
          {adaptationLog.slice().reverse().map((entry, i) => {
            const icon = REASON_ICONS[entry.reason] || '↕';
            const toColor = TIER_COLORS[entry.to] || '#6366f1';
            return (
              <div key={i} style={{
                fontSize: 11, color: 'var(--text-muted)', padding: '4px 0',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                display: 'flex', gap: 6, alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'Space Grotesk', color: 'var(--text-secondary)', flexShrink: 0 }}>
                  {Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')}
                </span>
                <span style={{ flexShrink: 0 }}>{icon}</span>
                <span style={{ color: toColor, fontWeight: 700 }}>
                  {entry.toLabel || TIER_LABELS[entry.to] || entry.to}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {adaptationLog.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 4 }}>
          No difficulty changes yet
        </div>
      )}
    </div>
  );
}
