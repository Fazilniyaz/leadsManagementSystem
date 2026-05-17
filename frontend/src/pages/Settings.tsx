import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { FormField } from '../components/ui'
import { useCurrentUser } from '../hooks/useAuth'
import axiosInstance from '../api/axiosInstance'

export default function Settings() {
  const { data: user } = useCurrentUser()
  const qc = useQueryClient()

  const [form, setForm] = useState({ name: '', email: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email })
  }, [user])

  const { mutate: updateProfile, isPending, isError, error } = useMutation({
    mutationFn: (payload: { name?: string; email?: string }) =>
      axiosInstance.patch('/auth/me', payload).then(r => r.data),
    onSuccess: (data) => {
      qc.setQueryData(['currentUser'], data.data.user)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(form)
  }

  const errMsg = isError ? (error as any)?.response?.data?.message || 'Update failed' : null

  return (
    <DashboardLayout title="Settings" subtitle="Manage your profile">
      <div style={{ maxWidth: 520 }}>
        {/* Avatar section */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(240,237,230,0.07)',
          borderRadius: 10,
          padding: '28px 24px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(240,237,230,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 700,
            color: '#f0ede6',
            flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#f0ede6', marginBottom: 4 }}>{user?.name}</p>
            <p style={{ fontSize: 13, color: '#555' }}>{user?.email}</p>
            <span style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '3px 10px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'capitalize',
              background: user?.role === 'admin' ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)',
              color: user?.role === 'admin' ? '#a78bfa' : '#3b82f6',
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(240,237,230,0.07)',
          borderRadius: 10,
          padding: '28px 24px',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f0ede6', marginBottom: 24 }}>
            Edit profile
          </h2>

          {errMsg && (
            <div style={{ background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 14, color: '#f87171' }}>
              {errMsg}
            </div>
          )}

          {saved && (
            <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 14, color: '#4ade80' }}>
              ✓ Profile updated successfully
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField label="Full name">
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                required
                minLength={2}
              />
            </FormField>

            <FormField label="Email address">
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@company.com"
                required
              />
            </FormField>

            <FormField label="Role">
              <input
                value={user?.role ?? ''}
                disabled
                style={{ opacity: 0.4, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: 12, color: '#333', marginTop: 6 }}>
                Role can only be changed by an admin
              </p>
            </FormField>

            <button
              type="submit"
              className="btn-primary"
              disabled={isPending}
              style={{ marginTop: 8 }}
            >
              {isPending ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}