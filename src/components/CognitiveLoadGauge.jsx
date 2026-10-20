import { useEffect, useRef } from 'react';

const STATE_CONFIG = {
  flow: {
    label: 'In Flow ✨',
    desc: 'Optimal learning zone',
    color: '#10b981',
    lightColor: '#6ee7b7',
    bgColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.25)',
    fillClass: 'low',
  },
  overload: {
    label: 'Overloaded 🔴',
    desc: 'Simplifying content…',
    color: '#f43f5e',
    lightColor: '#fda4af',
    bgColor: 'rgba(244,63,94,0.12)',
    borderColor: 'rgba(244,63,94,0.25)',
    fillClass: 'high',
  },
  bored: {
    label: 'Understimulated 🟡',
    desc: 'Increasing challenge…',
    color: '#f59e0b',
    lightColor: '#fcd34d',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.25)',
    fillClass: 'medium',
  },
};

export default function CognitiveLoadGauge({ state, load }) {
  const config = STATE_CONFIG[state] || STATE_CONFIG.flow;
  const canvasRef = useRef(null);

  // Draw arc gauge
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.72;
    const r = canvas.width * 0.38;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Track arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Filled arc
    const angle = Math.PI + (load / 100) * Math.PI;
    const gradient = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#f43f5e');

    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, angle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Needle
    const needleAngle = Math.PI + (load / 100) * Math.PI;
    const nx = cx + (r) * Math.cos(needleAngle);
    const ny = cy + (r) * Math.sin(needleAngle);

    ctx.beginPath();
    ctx.arc(nx, ny, 6, 0, Math.PI * 2);
    ctx.fillStyle = config.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(nx, ny, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

  }, [load, config.color]);

  return (
    <div style={{
      background: config.bgColor,
      border: `1px solid ${config.borderColor}`,
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      transition: 'background 0.8s ease, border-color 0.8s ease',
    }}>
      {/* Label */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
        Cognitive Load
      </div>

      {/* Arc gauge */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <canvas ref={canvasRef} width={180} height={110} style={{ width: '100%', maxWidth: 180 }} />
        {/* Center value */}
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Space Grotesk', color: config.color, lineHeight: 1 }}>
            {load}%
          </div>
        </div>
      </div>

      {/* State label */}
      <div style={{
        textAlign: 'center',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 'var(--radius-md)',
        marginTop: 8,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: config.lightColor }}>{config.label}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{config.desc}</div>
      </div>

      {/* Linear bar */}
      <div style={{ marginTop: 14 }}>
        <div className="load-gauge-bar">
          <div className={`load-gauge-fill ${config.fillClass}`} style={{ width: `${load}%` }} />
        </div>
      </div>

      {/* Placeholder note */}
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <span className="placeholder-tag">⚙ PLACEHOLDER · AI model output</span>
      </div>
    </div>
  );
}
