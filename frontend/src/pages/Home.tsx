import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'Real-time lead tracking with instant updates across your entire sales team.',
  },
  {
    icon: '🎯',
    title: 'Smart Filtering',
    desc: 'Multi-filter search by status, source, and keyword — find any lead in seconds.',
  },
  {
    icon: '🔐',
    title: 'Role-Based Access',
    desc: 'Admin and Sales roles with granular permissions. Your data stays protected.',
  },
  {
    icon: '📊',
    title: 'Export & Insights',
    desc: 'One-click CSV export. Slice your pipeline any way you need.',
  },
]

const STATS = [
  { value: '10x', label: 'Faster lead tracking' },
  { value: '99%', label: 'Uptime guaranteed' },
  { value: '< 1s', label: 'Average response time' },
]

export default function Home() {
  const navigate = useNavigate()
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(32px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-link {
          color: #888;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #f0ede6; }

        .btn-primary {
          background: #f0ede6;
          color: #0a0a0a;
          border: none;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s;
          font-family: inherit;
        }
        .btn-primary:hover { background: #fff; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .btn-outline {
          background: transparent;
          color: #f0ede6;
          border: 1px solid rgba(240,237,230,0.2);
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: border-color 0.2s, transform 0.15s;
          font-family: inherit;
        }
        .btn-outline:hover { border-color: rgba(240,237,230,0.5); transform: translateY(-1px); }

        .feature-card {
          border: 1px solid rgba(240,237,230,0.08);
          border-radius: 8px;
          padding: 32px 28px;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.3s, background 0.3s, transform 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(240,237,230,0.18);
          background: rgba(255,255,255,0.04);
          transform: translateY(-4px);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(240,237,230,0.06);
          border: 1px solid rgba(240,237,230,0.12);
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #888;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(240,237,230,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,237,230,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(240,237,230,0.04) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 48px !important; line-height: 1.1 !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-row { flex-direction: column !important; gap: 24px !important; }
          .hero-buttons { flex-direction: column !important; }
          .home-nav { padding: 14px 20px !important; }
          .home-nav-links { gap: 16px !important; }
          .hero-section { padding: 80px 20px 60px !important; }
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav className="home-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '20px 48px', borderBottom: '1px solid rgba(240,237,230,0.06)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#f0ede6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0a0a0a', fontWeight: 900, fontSize: 14 }}>G</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>GigFlow</span>
        </div>
        <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#stats" className="nav-link">Why us</a>
          <button className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }} onClick={() => navigate('/login')}>
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '120px 48px 100px' }}>
        <div className="grid-bg" />
        <div className="glow" />

        <div ref={heroRef} style={{ position: 'relative', maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: 32, display: 'inline-flex' }}>
            <span className="dot" />
            Now in production
          </div>

          <h1 className="hero-title" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: 28,
            color: '#f0ede6',
          }}>
            Your leads,<br />
            <span style={{ color: 'rgba(240,237,230,0.35)' }}>finally under</span><br />
            control.
          </h1>

          <p style={{ fontSize: 18, color: '#888', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 48px', fontWeight: 300 }}>
            A complete lead management system built for modern sales teams.
            Track, filter, assign and export — all in one place.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get started free
            </button>
            <button className="btn-outline" onClick={() => navigate('/login')}>
              Sign in →
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="section-pad" style={{ padding: '60px 48px', borderTop: '1px solid rgba(240,237,230,0.06)', borderBottom: '1px solid rgba(240,237,230,0.06)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="stats-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, color: '#f0ede6', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 8, fontWeight: 400, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-pad" style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: 16 }}>
              Everything you need
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, color: '#f0ede6', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Built for real sales teams
            </h2>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f0ede6', marginBottom: 10, letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.65, fontWeight: 300 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ padding: '80px 48px 100px', borderTop: '1px solid rgba(240,237,230,0.06)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 20, color: '#f0ede6', lineHeight: 1.1 }}>
            Ready to close more deals?
          </h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 40, fontWeight: 300 }}>
            Join your team on GigFlow. Setup takes under 2 minutes.
          </p>
          <button className="btn-primary" style={{ padding: '16px 44px', fontSize: 16 }} onClick={() => navigate('/register')}>
            Create your account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-pad" style={{ padding: '24px 48px', borderTop: '1px solid rgba(240,237,230,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>© 2025 GigFlow</span>
        <span style={{ fontSize: 13, color: '#333' }}>Built with MERN + TypeScript</span>
      </footer>
    </div>
  )
}