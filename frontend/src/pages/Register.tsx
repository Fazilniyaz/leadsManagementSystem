import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'
import { useForm, FormProvider } from 'react-hook-form'
import FormInput from '../components/FormInput'

export default function Register() {
  const { mutate: register, isPending, error, isError } = useRegister()
  const methods = useForm({ defaultValues: { name: '', email: '', password: '' } })
  const [showPass, setShowPass] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [])

  const handleSubmit = (data: any) => {
    register(data)
  }

  const pwd = methods.watch('password') ?? ''
  const pwdChecks = {
    length: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    symbol: /[^A-Za-z0-9]/.test(pwd),
  }

  const errMsg = isError
    ? (error as any)?.response?.data?.message || 'Registration failed. Please try again.'
    : null

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(240,237,230,0.1);
          border-radius: 6px;
          padding: 13px 16px;
          font-size: 15px;
          color: #f0ede6;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .field:focus {
          border-color: rgba(240,237,230,0.35);
          background: rgba(255,255,255,0.06);
        }
        .field::placeholder { color: #3a3a3a; }

        .btn-submit {
          width: 100%;
          background: #f0ede6;
          color: #0a0a0a;
          border: none;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s, transform 0.15s;
          margin-top: 8px;
        }
        .btn-submit:hover:not(:disabled) { background: #fff; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(240,237,230,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,237,230,0.025) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
        }

        .show-btn {
          background: none;
          border: none;
          color: #555;
          cursor: pointer;
          font-size: 13px;
          font-family: inherit;
          padding: 0 4px;
          transition: color 0.2s;
        }
        .show-btn:hover { color: #f0ede6; }
      `}</style>

      <div className="grid-bg" />

      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px', borderRight: '1px solid rgba(240,237,230,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 1 }}>
          <div style={{ width: 30, height: 30, background: '#f0ede6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0a0a0a', fontWeight: 900, fontSize: 15 }}>G</span>
          </div>
          <span style={{ color: '#f0ede6', fontWeight: 600, fontSize: 16 }}>GigFlow</span>
        </div>

        <div style={{ zIndex: 1 }}>
          <div style={{ marginBottom: 40 }}>
            {['Track every lead.', 'Close more deals.', 'Work as a team.'].map((line, i) => (
              <p key={i} style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 30,
                fontWeight: 700,
                color: i === 0 ? '#f0ede6' : i === 1 ? 'rgba(240,237,230,0.45)' : 'rgba(240,237,230,0.2)',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
              }}>
                {line}
              </p>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['JWT-secured authentication', 'Role-based access control', 'Real-time lead pipeline'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#4ade80', fontSize: 10 }}>✓</span>
                </div>
                <span style={{ fontSize: 14, color: '#444', fontWeight: 300 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#2a2a2a', zIndex: 1 }}>© 2025 GigFlow</p>

        <div style={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(240,237,230,0.04)', pointerEvents: 'none' }} />
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 56px' }}>
        <div ref={cardRef} style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#f0ede6', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Create account
            </h1>
            <p style={{ fontSize: 15, color: '#555', fontWeight: 300 }}>
              Join your team on GigFlow
            </p>
          </div>

          {errMsg && (
            <div style={{ background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.25)', borderRadius: 6, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#f87171' }}>
              {errMsg}
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <FormInput
                name="name"
                label="Full name"
                type="text"
                placeholder="Your full name"
                rules={{
                  required: 'Name required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                  pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Name can only contain letters, spaces, hyphens, or apostrophes' },
                }}
              />

              <FormInput name="email" label="Email address" type="email" placeholder="you@company.com" rules={{ required: 'Email required' }} />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#888' }}>Password</label>
                  <button type="button" className="show-btn" onClick={() => setShowPass(p => !p)}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                <FormInput
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 chars, A-Z, a-z, symbol"
                rules={{
                  required: 'Password required',
                  minLength: { value: 8, message: 'Min 8 characters' },
                  validate: {
                    upper: (v: string) => /[A-Z]/.test(v) || 'Must include an uppercase letter',
                    lower: (v: string) => /[a-z]/.test(v) || 'Must include a lowercase letter',
                    symbol: (v: string) => /[^A-Za-z0-9]/.test(v) || 'Must include a symbol (e.g. @, !, #)',
                  },
                }}
              />
              {/* Password strength checklist */}
              {pwd.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {([
                    [pwdChecks.length, '8+ characters'],
                    [pwdChecks.upper,  'One uppercase letter'],
                    [pwdChecks.lower,  'One lowercase letter'],
                    [pwdChecks.symbol, 'One symbol (@, !, # …)'],
                  ] as [boolean, string][]).map(([ok, label]) => (
                    <span key={label} style={{ fontSize: 11, color: ok ? '#4ade80' : '#555', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 10 }}>{ok ? '✓' : '○'}</span>{label}
                    </span>
                  ))}
                </div>
              )}
              </div>

              <button className="btn-submit" type="submit" disabled={isPending}>
                {isPending ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </FormProvider>

          <p style={{ marginTop: 28, fontSize: 14, color: '#444', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#f0ede6', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid rgba(240,237,230,0.3)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}