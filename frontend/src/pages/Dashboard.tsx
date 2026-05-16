import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { useCurrentUser, useLogout } from '../hooks/useAuth'
import type { LeadsResponse, UsersResponse } from '../types'

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  qualified: '#4ade80',
  lost: '#f87171',
}

const STATUS_BG: Record<string, string> = {
  new: 'rgba(59,130,246,0.12)',
  contacted: 'rgba(245,158,11,0.12)',
  qualified: 'rgba(74,222,128,0.12)',
  lost: 'rgba(248,113,113,0.12)',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const { mutate: logout, isPending: loggingOut } = useLogout()

  const { data: leadsData, isLoading: leadsLoading } = useQuery<LeadsResponse>({
    queryKey: ['leads', { page: 1 }],
    queryFn: () => axiosInstance.get('/leads?page=1').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })

  const { data: usersData } = useQuery<UsersResponse>({
    queryKey: ['users', { page: 1 }],
    queryFn: () => axiosInstance.get('/users?page=1').then(r => r.data),
    staleTime: 1000 * 60 * 5,
    enabled: user?.role === 'admin',
  })

  const leads = leadsData?.data?.leads ?? []
  const totalLeads = leadsData?.data?.pagination?.total ?? 0
  const totalUsers = usersData?.data?.pagination?.total ?? 0

  // Count per status
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const qualifiedCount = leads.filter(l => l.status === 'qualified').length
  const conversionRate = leads.length > 0 ? Math.round((qualifiedCount / leads.length) * 100) : 0

  const STAT_CARDS = [
    { label: 'Total leads', value: totalLeads, sub: 'All time', icon: '📋' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, sub: 'This page', icon: '🎯' },
    { label: 'Conversion', value: `${conversionRate}%`, sub: 'Qualified rate', icon: '📈' },
    ...(user?.role === 'admin' ? [{ label: 'Team size', value: totalUsers, sub: 'Active users', icon: '👥' }] : []),
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          border: none;
          background: none;
          font-family: inherit;
          width: 100%;
          text-align: left;
        }
        .nav-item:hover { background: rgba(240,237,230,0.05); color: #f0ede6; }
        .nav-item.active { background: rgba(240,237,230,0.08); color: #f0ede6; }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(240,237,230,0.08);
          border-radius: 10px;
          padding: 24px 22px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-card:hover { border-color: rgba(240,237,230,0.16); transform: translateY(-2px); }

        .lead-row {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr 1fr;
          gap: 16px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(240,237,230,0.05);
          align-items: center;
          transition: background 0.15s;
        }
        .lead-row:hover { background: rgba(255,255,255,0.02); }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: capitalize;
        }

        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: none;
          font-family: inherit;
          width: 100%;
          text-align: left;
        }
        .logout-btn:hover { background: rgba(248,113,113,0.08); color: #f87171; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(240,237,230,0.1); border-radius: 2px; }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: 220, borderRight: '1px solid rgba(240,237,230,0.06)', padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 14px', marginBottom: 28 }}>
          <div style={{ width: 26, height: 26, background: '#f0ede6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#0a0a0a', fontWeight: 900, fontSize: 13 }}>L</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>LeadsMS</span>
        </div>

        <button className="nav-item active">
          <span>📊</span> Dashboard
        </button>
        <button className="nav-item" onClick={() => navigate('/leads')}>
          <span>📋</span> Leads
        </button>
        {user?.role === 'admin' && (
          <button className="nav-item" onClick={() => navigate('/users')}>
            <span>👥</span> Team
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* User info */}
        <div style={{ padding: '12px 14px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(240,237,230,0.06)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(240,237,230,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#f0ede6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name ?? '—'}
              </p>
              <p style={{ fontSize: 11, color: '#444', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={() => logout()} disabled={loggingOut}>
          <span>🚪</span> {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '40px 40px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: '#444', fontWeight: 300 }}>
            Good to see you, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
          {leadsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="stat-card">
                  <div className="shimmer" style={{ height: 14, width: 80, marginBottom: 12 }} />
                  <div className="shimmer" style={{ height: 32, width: 60, marginBottom: 8 }} />
                  <div className="shimmer" style={{ height: 12, width: 100 }} />
                </div>
              ))
            : STAT_CARDS.map(card => (
                <div key={card.label} className="stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontSize: 13, color: '#555', fontWeight: 400 }}>{card.label}</p>
                    <span style={{ fontSize: 18 }}>{card.icon}</span>
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#f0ede6', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>
                    {card.value}
                  </p>
                  <p style={{ fontSize: 12, color: '#333' }}>{card.sub}</p>
                </div>
              ))}
        </div>

        {/* Status breakdown + Recent leads */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          {/* Status breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,237,230,0.07)', borderRadius: 10, padding: '24px 20px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#f0ede6' }}>
              Pipeline status
            </h2>
            {leadsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div className="shimmer" style={{ height: 12, width: '100%', marginBottom: 8 }} />
                    <div className="shimmer" style={{ height: 6, width: '100%', borderRadius: 3 }} />
                  </div>
                ))
              : (['new', 'contacted', 'qualified', 'lost'] as const).map(status => {
                  const count = statusCounts[status] ?? 0
                  const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0
                  return (
                    <div key={status} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: '#888', textTransform: 'capitalize' }}>{status}</span>
                        <span style={{ fontSize: 13, color: '#555' }}>{count} · {pct}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: STATUS_COLORS[status],
                          borderRadius: 2,
                          transition: 'width 0.6s cubic-bezier(.16,1,.3,1)',
                        }} />
                      </div>
                    </div>
                  )
                })}
          </div>

          {/* Recent leads */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,237,230,0.07)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 0', marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0ede6' }}>Recent leads</h2>
                <button
                  onClick={() => navigate('/leads')}
                  style={{ fontSize: 13, color: '#555', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f0ede6')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                >
                  View all →
                </button>
              </div>
            </div>

            {/* Table header */}
            <div className="lead-row" style={{ borderBottom: '1px solid rgba(240,237,230,0.08)' }}>
              {['Name', 'Email', 'Status', 'Source'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
              ))}
            </div>

            {leadsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="lead-row">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="shimmer" style={{ height: 14, width: j === 0 ? '70%' : '60%' }} />
                    ))}
                  </div>
                ))
              : leads.length === 0
              ? (
                  <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: 32, marginBottom: 12 }}>📭</p>
                    <p style={{ fontSize: 14, color: '#444' }}>No leads yet</p>
                  </div>
                )
              : leads.slice(0, 6).map(lead => (
                  <div key={lead._id} className="lead-row">
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6', marginBottom: 2 }}>{lead.name}</p>
                      {lead.assignedTo && (
                        <p style={{ fontSize: 11, color: '#333' }}>→ {(lead.assignedTo as any).name ?? '—'}</p>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</p>
                    <span
                      className="badge"
                      style={{ background: STATUS_BG[lead.status], color: STATUS_COLORS[lead.status] }}
                    >
                      {lead.status}
                    </span>
                    <span style={{ fontSize: 13, color: '#444', textTransform: 'capitalize' }}>{lead.source}</span>
                  </div>
                ))}
          </div>
        </div>
      </main>
    </div>
  )
}