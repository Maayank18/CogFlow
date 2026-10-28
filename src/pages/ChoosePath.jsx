import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SpotlightCard from '../components/SpotlightCard';
import { sounds } from '../utils/soundEffects';
import { BookOpen, UploadCloud, ArrowRight, ShieldCheck, Layers, Sparkles } from 'lucide-react';

export default function ChoosePath() {
  const navigate = useNavigate();

  const handleSelect = (route) => {
    sounds.playClick();
    navigate(route);
  };

  return (
    <div className="page" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <Navbar currentStep={1} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '50px 24px', position: 'relative', zIndex: 1 }}>
        <div className="container-narrow" style={{ maxWidth: 960 }}>

          {/* Heading */}
          <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--indigo-light)', textTransform: 'uppercase' }}>
              Curriculum Routing · Step 1 of 4
            </span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginTop: 8, marginBottom: 12, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Select your learning pathway
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              Choose a curated STEM curriculum or upload your own course materials to extract custom learning topics.
            </p>
          </div>

          {/* Dual Path Spotlight Cards */}
          <div className="grid-2 animate-fadeInUp delay-100" style={{ gap: 24 }}>

            {/* Path 1: Curated Subjects */}
            <SpotlightCard
              onClick={() => handleSelect('/subjects')}
              spotlightColor="rgba(99, 102, 241, 0.2)"
              borderColor="rgba(129, 140, 248, 0.5)"
              style={{
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.12))',
                  border: '1px solid rgba(129,140,248,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--indigo-light)',
                  marginBottom: 20
                }}>
                  <BookOpen size={24} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: '#ffffff' }}>
                  Curated Subject Library
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.65, marginBottom: 22 }}>
                  Pre-structured STEM curriculum with calibrated 3-tier breakdowns across Computer Science, Linear Algebra, Machine Learning, and Physics.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
                  {['Computer Science', 'Machine Learning', 'Linear Algebra', 'Physics'].map(s => (
                    <span key={s} className="badge badge-indigo" style={{ fontSize: 10, padding: '3px 8px' }}>{s}</span>
                  ))}
                </div>
              </div>

              <div className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                Browse Subjects
                <ArrowRight size={15} />
              </div>
            </SpotlightCard>

            {/* Path 2: Upload Custom Syllabus */}
            <SpotlightCard
              onClick={() => handleSelect('/topics?source=upload')}
              spotlightColor="rgba(6, 182, 212, 0.2)"
              borderColor="rgba(56, 189, 248, 0.5)"
              style={{
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.1))',
                  border: '1px solid rgba(6,182,212,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  marginBottom: 20
                }}>
                  <UploadCloud size={24} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: '#ffffff' }}>
                  Custom Document Ingestion
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.65, marginBottom: 22 }}>
                  Upload your personal lecture slides, textbook excerpts, or syllabus PDFs. The RAG engine chunks content into 3 progressive tiers automatically.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
                  {['PDF Documents', 'Lecture Notes', 'Smart Chunking', 'Personalized'].map(s => (
                    <span key={s} className="badge badge-cyan" style={{ fontSize: 10, padding: '3px 8px' }}>{s}</span>
                  ))}
                </div>
              </div>

              <div className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                Upload Materials
                <UploadCloud size={15} />
              </div>
            </SpotlightCard>

          </div>

          {/* Privacy Note */}
          <div className="animate-fadeInUp delay-200" style={{
            marginTop: 36,
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <ShieldCheck size={14} style={{ color: '#34d399' }} />
            Local processing guarantee: uploaded materials and live webcam tensors remain strictly on your machine.
          </div>

        </div>
      </div>
    </div>
  );
}
