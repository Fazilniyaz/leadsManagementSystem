import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'
import { useForm, FormProvider } from 'react-hook-form'
import FormInput from '../components/FormInput'

export default function Login() {
  const { mutate: login, isPending, error, isError } = useLogin()
  const [showPass, setShowPass] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const methods = useForm({ defaultValues: { email: '', password: '' } })

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
    login(data)
  }

  const errMsg = isError
    ? (error as any)?.response?.data?.message || 'Login failed. Please try again.'
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
          letter-spacing: 0.01em;
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

      {/* Left panel — branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px', borderRight: '1px solid rgba(240,237,230,0.06)', position: 'relative', overflow: 'hidden' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 1 }}>
          <div style={{ width: 30, height: 30, background: '#f0ede6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0a0a0a', fontWeight: 900, fontSize: 15 }}>G</span>
          </div>
          <span style={{ color: '#f0ede6', fontWeight: 600, fontSize: 16 }}>GigFlow</span>
        </div>

        {/* Quote */}
        <div style={{ zIndex: 1 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#f0ede6', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 20 }}>
            "The best CRM is the one your team actually uses."
          </p>
          <p style={{ fontSize: 14, color: '#444', fontWeight: 300 }}>— Every Sales Manager, Ever</p>
        </div>

        {/* Bottom decoration */}
        <div style={{ zIndex: 1 }}>
          <p style={{ fontSize: 13, color: '#2a2a2a' }}>© 2025 GigFlow · All rights reserved</p>
        </div>

        {/* Decorative circle */}
        <div style={{ position: 'absolute', bottom: -120, left: -120, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(240,237,230,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(240,237,230,0.06)', pointerEvents: 'none' }} />
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 56px' }}>
        <div ref={cardRef} style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#f0ede6', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 15, color: '#555', fontWeight: 300 }}>
              Sign in to your workspace
            </p>
          </div>

          {/* Error */}
          {errMsg && (
            <div style={{ background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.25)', borderRadius: 6, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#f87171' }}>
              {errMsg}
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <FormInput name="email" label="Email address" type="email" placeholder="you@company.com" rules={{ required: 'Email required' }} />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#888' }}>Password</label>
                  <button type="button" className="show-btn" onClick={() => setShowPass(p => !p)}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                <FormInput name="password" type={showPass ? 'text' : 'password'} placeholder="Your password" rules={{ required: 'Password required' }} />
              </div>

              <button className="btn-submit" type="submit" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </FormProvider>

          <p style={{ marginTop: 28, fontSize: 14, color: '#444', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#f0ede6', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid rgba(240,237,230,0.3)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}