import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SpotlightCard from '../components/SpotlightCard';
import NeuralWaveform from '../components/NeuralWaveform';
import BiometricPlayground from '../components/BiometricPlayground';
import ArchitectureVisualizer from '../components/ArchitectureVisualizer';
import { sounds } from '../utils/soundEffects';
import {
  Brain, ScanFace, Cpu, Layers, Zap, BarChart3, ArrowRight,
  Sparkles, CheckCircle2, Sliders, ShieldCheck, Terminal,
  Activity, ChevronRight, Eye, RefreshCw, Compass
} from 'lucide-react';

const FEATURES = [
  {
    icon: ScanFace,
    title: 'MediaPipe FACS Telemetry',
    tag: 'Edge Vision',
    desc: 'Extracts 52 facial blendshapes including AU4 brow furrow and AU7 squint directly in-memory at 60 FPS without retaining video frames.'
  },
  {
    icon: Brain,
    title: 'DAiSEE BiLSTM ONNX Engine',
    tag: 'Temporal AI',
    desc: 'Bidirectional sequence network trained on empirical student cognitive datasets, running lightweight sub-millisecond inference.'
  },
  {
    icon: Sliders,
    title: 'Dynamic Content Rewriting',
    tag: 'Adaptive RAG',
    desc: 'Closed-loop curriculum adaptation transforms instructional density between Simplified Intuition, Standard, and Expert Depth.'
  },
  {
    icon: Activity,
    title: 'Silent Behavioral Fusion',
    tag: 'Multimodal',
    desc: 'Fuses micro-interaction metrics like scroll cadence, pointer turbulence, and typing pauses alongside facial telemetry.'
  },
  {
    icon: BarChart3,
    title: 'Flow Index & Analytics',
    tag: 'Biometric Log',
    desc: 'Comprehensive post-study analytics visualizing minutes spent in optimal flow vs cognitive friction across topics.'
  },
  {
    icon: ShieldCheck,
    title: 'Zero-Knowledge Privacy',
    tag: 'Client Isolated',
    desc: 'Zero video stream upload or cloud camera storage. Facial landmark vectors are calculated in browser memory and cleared immediately.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLaunch = () => {
    sounds.playLevelUp();
    navigate('/choose-path');
  };

  return (
    <div className="page" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <Navbar currentStep={0} />

      {/* ── HERO SECTION ── */}
      <section style={{
        paddingTop: 84,
        paddingBottom: 60,
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container" style={{ textAlign: 'center' }}>

          {/* Top Status Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }} className="animate-fadeInUp">
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(129,140,248,0.3)',
              fontSize: 11,
              fontWeight: 800,
              color: '#c7d2fe',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
              DAiSEE BiLSTM · MediaPipe 478 Mesh Active
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            maxWidth: 1020,
            margin: '0 auto 24px',
            color: '#ffffff'
          }} className="animate-fadeInUp delay-100">
            Real-time cognitive load detection for{' '}
            <span className="shimmer-text">
              effortless mastery.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 18,
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: 680,
            margin: '0 auto 36px',
          }} className="animate-fadeInUp delay-200">
            CogFlow silently monitors your focus, brow tension, and reading rhythm — dynamically tuning instructional depth to keep you locked in optimal flow state.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }} className="animate-fadeInUp delay-300">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleLaunch}
              id="hero-start-learning-btn"
              style={{ gap: 8 }}
            >
              Launch Adaptive Workspace
              <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => {
                sounds.playClick();
                const el = document.getElementById('playground-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ gap: 8 }}
            >
              <Activity size={16} style={{ color: 'var(--indigo-light)' }} />
              Test Neural Playground
            </button>
          </div>

          {/* ── LIVE NEURAL OSCILLOSCOPE WAVEFORM ── */}
          <div className="animate-fadeInUp delay-400" style={{ maxWidth: 1040, margin: '0 auto 64px' }}>
            <NeuralWaveform defaultBand="alpha" />
          </div>

        </div>
      </section>

      {/* ── BIOMETRIC TELEMETRY PLAYGROUND ── */}
      <section id="playground-section" style={{
        padding: '40px 0 80px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container" style={{ maxWidth: 1040 }}>
          <BiometricPlayground />
        </div>
      </section>

      {/* ── SYSTEM ARCHITECTURE TOPOLOGY ── */}
      <section style={{
        padding: '40px 0 80px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container" style={{ maxWidth: 1040 }}>
          <ArchitectureVisualizer />
        </div>
      </section>

      {/* ── FEATURE MATRIX (SPOTLIGHT CARDS) ── */}
      <section style={{
        padding: '70px 0 90px',
        borderTop: '1px solid var(--border)',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container" style={{ maxWidth: 1120 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--indigo-light)', textTransform: 'uppercase' }}>
              Engine Architecture
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginTop: 8, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Engineered for high-friction technical subjects.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8, maxWidth: 540, margin: '8px auto 0' }}>
              Every component runs client-side with minimal memory footprints, zero video telemetry persistence, and calibrated inference thresholds.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 20 }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <SpotlightCard key={i} style={{ padding: '28px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(99,102,241,0.14)',
                      border: '1px solid rgba(129,140,248,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--indigo-light)',
                    }}>
                      <Icon size={22} />
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
                      background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', border: '1px solid var(--border)'
                    }}>
                      {feat.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: '#ffffff' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {feat.desc}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section style={{
        padding: '40px 0 100px',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 21, 36, 0.9) 0%, rgba(22, 30, 51, 0.7) 100%)',
            border: '1px solid rgba(129,140,248,0.35)',
            borderRadius: 'var(--radius-2xl)',
            padding: '52px 40px',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 50px rgba(99,102,241,0.18)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ambient background bloom */}
            <div style={{
              position: 'absolute', top: -50, right: -50, width: 220, height: 220,
              borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(60px)', pointerEvents: 'none'
            }} />

            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--indigo-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'inline-block' }}>
              Instant Closed-Loop Session
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, marginBottom: 12, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Ready to learn at your cognitive ceiling?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Choose a curated technical curriculum or upload your own course materials to begin your biometric study session.
            </p>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleLaunch}
              style={{ gap: 8, margin: '0 auto' }}
            >
              Get Started Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
