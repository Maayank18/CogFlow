import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SpotlightCard from '../components/SpotlightCard';
import { SUBJECTS } from '../data/subjects';
import { sounds } from '../utils/soundEffects';
import { 
  ArrowLeft, Search, BookOpen, Cpu, Brain, Binary, Atom, Database, Check, ArrowRight, Layers
} from 'lucide-react';

const ICON_MAP = {
  cs: Binary,
  ml: Brain,
  math: Cpu,
  physics: Atom,
  dbms: Database,
  default: BookOpen
};

export default function SubjectSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = SUBJECTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id) => {
    sounds.playClick();
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    sounds.playLevelUp();
    navigate(`/topics?subject=${selected}`);
  };

  return (
    <div className="page" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <Navbar currentStep={2} />

      <div style={{ flex: 1, padding: '40px 24px 60px', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 1140 }}>

          {/* Navigation Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <button 
              onClick={() => {
                sounds.playClick();
                navigate('/choose-path');
              }}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <ArrowLeft size={16} />
              Back to Paths
            </button>

            {/* Step Counter */}
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--indigo-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Step 2 of 4 · Select Curriculum
            </span>
          </div>

          {/* Title & Search Bar */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#ffffff', marginBottom: 6, letterSpacing: '-0.02em' }}>
                Choose a Subject Domain
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14.5 }}>
                Select a curriculum to load its verified multi-tier instructional knowledge modules.
              </p>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                style={{ paddingLeft: 38, fontSize: 13 }}
                placeholder="Filter curriculum domains..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Subject Spotlight Cards Grid */}
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
            {filtered.map(subj => {
              const isSelected = selected === subj.id;
              const IconComponent = ICON_MAP[subj.id] || ICON_MAP.default;

              return (
                <SpotlightCard
                  key={subj.id}
                  onClick={() => handleSelect(subj.id)}
                  spotlightColor={isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.12)'}
                  borderColor={isSelected ? 'rgba(129, 140, 248, 0.8)' : 'rgba(255, 255, 255, 0.12)'}
                  style={{
                    padding: '24px',
                    borderColor: isSelected ? 'var(--indigo-light)' : 'var(--border)',
                    boxShadow: isSelected ? '0 0 25px rgba(99,102,241,0.3)' : 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Top Row: Icon & Checkmark */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: isSelected ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? 'rgba(129,140,248,0.5)' : 'var(--border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#ffffff' : 'var(--indigo-light)',
                        transition: 'all 0.2s ease'
                      }}>
                        <IconComponent size={22} />
                      </div>

                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: `1.5px solid ${isSelected ? 'var(--indigo-light)' : 'var(--border)'}`,
                        background: isSelected ? 'var(--indigo)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        transition: 'all 0.2s ease'
                      }}>
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>

                    {/* Subject Title */}
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
                      {subj.name}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.55, marginBottom: 16 }}>
                      {subj.desc}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div style={{
                    paddingTop: 14,
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    color: 'var(--text-muted)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Layers size={13} />
                      {subj.topics?.length || 5} Core Modules
                    </span>
                    <span style={{ color: isSelected ? 'var(--indigo-light)' : 'var(--text-secondary)', fontWeight: 700 }}>
                      {isSelected ? 'Selected' : 'Click to select'}
                    </span>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Sticky Bottom Action Bar */}
          <div style={{
            position: 'sticky',
            bottom: 24,
            background: 'rgba(16, 21, 36, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(99,102,241,0.15)',
            maxWidth: 680,
            margin: '0 auto'
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                {selected ? 'Curriculum Chosen' : 'Please select a subject to proceed'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
                {selected ? SUBJECTS.find(s => s.id === selected)?.name : 'No subject chosen'}
              </div>
            </div>

            <button
              className="btn btn-primary"
              disabled={!selected}
              onClick={handleContinue}
              style={{
                opacity: selected ? 1 : 0.45,
                cursor: selected ? 'pointer' : 'not-allowed',
                padding: '10px 22px',
                gap: 8
              }}
            >
              Continue to Topics
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
