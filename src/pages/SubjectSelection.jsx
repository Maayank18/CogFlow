import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SUBJECTS } from '../data/subjects';

const colorMap = {
  indigo: { badge: 'badge-indigo', glow: 'rgba(99,102,241,0.4)' },
  violet: { badge: 'badge-indigo', glow: 'rgba(139,92,246,0.4)' },
  cyan:   { badge: 'badge-cyan',   glow: 'rgba(6,182,212,0.4)' },
  amber:  { badge: 'badge-amber',  glow: 'rgba(245,158,11,0.4)' },
  emerald:{ badge: 'badge-emerald',glow: 'rgba(16,185,129,0.4)' },
  rose:   { badge: 'badge-rose',   glow: 'rgba(244,63,94,0.4)' },
};

export default function SubjectSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = SUBJECTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (!selected) return;
    navigate(`/topics?subject=${selected}`);
  };

  return (
    <div className="page">
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <Navbar currentStep={2} />

      <div className="content-area" style={{ flex: 1, padding: '48px 24px' }}>
        <div className="container">

          {/* Back */}
          <button className="back-button animate-fadeIn" onClick={() => navigate('/choose-path')} id="back-to-path-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>

          {/* Header */}
          <div className="animate-fadeInUp" style={{ marginTop: 24, marginBottom: 36 }}>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, marginBottom: 10 }}>
              Choose a Subject
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Select the subject you want to study. You'll pick specific topics next.
            </p>
          </div>

          {/* Search */}
          <div className="animate-fadeInUp delay-100" style={{ marginBottom: 28, position: 'relative', maxWidth: 360 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id="subject-search-input"
              className="input"
              style={{ paddingLeft: 40 }}
              placeholder="Search subjects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Subject Grid */}
          <div className="grid-3 animate-fadeInUp delay-200">
            {filtered.map((subject) => {
              const isSelected = selected === subject.id;
              const color = colorMap[subject.color] || colorMap.indigo;
              return (
                <div
                  key={subject.id}
                  id={`subject-card-${subject.id}`}
                  className={`card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelected(isSelected ? null : subject.id)}
                  style={{
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 0 30px ${color.glow}` : '',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: subject.gradient,
                    border: `1px solid ${subject.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, marginBottom: 16,
                  }}>
                    {subject.icon}
                  </div>

                  {/* Name */}
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{subject.name}</h3>

                  {/* Desc */}
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                    {subject.desc}
                  </p>

                  {/* Topic count */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${color.badge}`}>
                      {subject.topics.length} topics
                    </span>
                    {isSelected && (
                      <span style={{ color: 'var(--emerald)', fontSize: 18 }}>✓</span>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                <p>No subjects match "{search}"</p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="animate-fadeInUp delay-300" style={{
            position: 'sticky', bottom: 24, marginTop: 36,
            display: 'flex', justifyContent: 'flex-end', gap: 12,
          }}>
            <div style={{
              background: 'rgba(10,10,20,0.9)', backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              {selected ? (
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Selected: <strong style={{ color: 'var(--text-primary)' }}>
                    {SUBJECTS.find(s => s.id === selected)?.name}
                  </strong>
                </span>
              ) : (
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Select a subject to continue</span>
              )}
              <button
                id="continue-to-topics-btn"
                className="btn btn-primary"
                onClick={handleContinue}
                disabled={!selected}
                style={{ opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed' }}
              >
                Continue to Topics
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
