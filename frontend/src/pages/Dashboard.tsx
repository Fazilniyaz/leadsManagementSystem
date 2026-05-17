import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { useCurrentUser } from '../hooks/useAuth'
import type { LeadsResponse, UsersResponse } from '../types'
import { RevenueChart } from '../components/dashboard/RevenueChart'
import { TopPerformers } from '../components/dashboard/TopPerformers'
import { DashboardLayout } from '../components/layout/DashboardLayout'

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

  const { data: leadsData, isLoading: leadsLoading } = useQuery<LeadsResponse>({
    queryKey: ['leads', { limit: 1000 }],
    queryFn: () => axiosInstance.get('/leads?limit=1000').then(r => r.data),
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

  const topPerformersData = (() => {
    const userStats = new Map<string, { name: string, total: number, qualified: number }>()
    
    leads.forEach(l => {
      const assignee = l.assignedTo as any
      if (!assignee) return
      const id = String(assignee._id ?? assignee.id)
      const name = assignee.name || 'Unknown'
      
      if (!userStats.has(id)) {
        userStats.set(id, { name, total: 0, qualified: 0 })
      }
      
      const stats = userStats.get(id)!
      stats.total += 1
      if (l.status === 'qualified') {
        stats.qualified += 1
      }
    })
    
    return Array.from(userStats.values())
      .map(s => ({
        name: s.name,
        totalLeads: s.total,
        qualifiedLeads: s.qualified,
        conversionRate: s.total > 0 ? Math.round((s.qualified / s.total) * 100) : 0
      }))
      .sort((a, b) => b.qualifiedLeads - a.qualifiedLeads || b.totalLeads - a.totalLeads)
      .slice(0, 5)
      .map((s, idx) => ({ ...s, rank: idx + 1 }))
  })();

  const STAT_CARDS = [
    { label: 'Total leads', value: totalLeads, change: '+12.5%', changeType: 'positive' as const, icon: '📋' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, change: '+3.2%', changeType: 'positive' as const, icon: '🎯' },
    { label: 'Conversion', value: `${conversionRate}%`, change: conversionRate > 0 ? `+${conversionRate}%` : '0%', changeType: conversionRate > 0 ? 'positive' as const : 'neutral' as const, icon: '📈' },
    ...(user?.role === 'admin' ? [{ label: 'Team size', value: totalUsers, change: `+${totalUsers}`, changeType: 'positive' as const, icon: '👥' }] : []),
  ]

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle={`Good to see you, ${user?.name?.split(' ')[0] ?? 'there'} 👋`}
    >
      <style>{`
        .stat-card {
          position: relative;
          background: black;
          border: 1px solid #2a2d35;
          border-radius: 12px;
          padding: 20px;
          transition: border-color 0.3s, transform 0.3s;
          overflow: hidden;
        }
        .stat-card:hover {
          border-color: rgba(74, 222, 128, 0.5);
          transform: translateY(-2px);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #2a2d35;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: background 0.3s;
        }
        .stat-card:hover .stat-card-icon {
          background: rgba(74, 222, 128, 0.1);
        }

        .stat-change {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .stat-change.positive { color: #4ade80; }
        .stat-change.negative { color: #f87171; }
        .stat-change.neutral { color: #6b7280; }

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
      `}</style>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {leadsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card">
                <div className="shimmer" style={{ height: 14, width: 80, marginBottom: 12 }} />
                <div className="shimmer" style={{ height: 32, width: 60, marginBottom: 8 }} />
                <div className="shimmer" style={{ height: 12, width: 100 }} />
              </div>
            ))
            : STAT_CARDS.map((card, index) => (
              <div key={card.label} className="stat-card" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Header row: title + icon */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: '#9ca3af', fontWeight: 500 }}>{card.label}</span>
                  <div className="stat-card-icon">
                    <span>{card.icon}</span>
                  </div>
                </div>
                {/* Value + change row */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#f0ede6', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {card.value}
                  </span>
                  <span className={`stat-change ${card.changeType}`}>
                    <span style={{ fontSize: 14 }}>{card.changeType === 'positive' ? '↗' : '↘'}</span>
                    {card.change}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Charts section */}
        <div className="dashboard-grid" style={{ marginBottom: 20 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="dashboard-grid">
              <div style={{ flex: 2 }}>
                <RevenueChart />
              </div>
              <div style={{ flex: 1 }}>
                <TopPerformers data={topPerformersData} />
              </div>
            </div>
          </div>
        </div>

        {/* Status breakdown + Recent leads */}
        <div className="dashboard-grid">
          {/* Pipeline Stages */}
          <div style={{ background: 'black', border: '1px solid #2a2d35', borderRadius: 12, padding: 20 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f0ede6', marginBottom: 2 }}>
                Pipeline Stages
              </h2>
              <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 2 }}>Distribution by stage</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {leadsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="shimmer" style={{ height: 14, width: '100%', marginBottom: 8 }} />
                    <div className="shimmer" style={{ height: 8, width: '100%', borderRadius: 999 }} />
                  </div>
                ))
                : (['new', 'contacted', 'qualified', 'lost'] as const).map((status, index) => {
                  const count = statusCounts[status] ?? 0
                  const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0
                  return (
                    <div key={status}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6', textTransform: 'capitalize' }}>{status}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14, color: '#9ca3af' }}>{count}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#f0ede6' }}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{ height: 8, background: '#2a2d35', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: STATUS_COLORS[status],
                          borderRadius: 999,
                          transition: `width 1s ease-out ${index * 150}ms`,
                        }} />
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* Total */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #2a2d35' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#9ca3af' }}>Total Leads</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#f0ede6' }}>{totalLeads}</span>
              </div>
            </div>
          </div>


          {/* Recent leads */}
          <div style={{ background: 'black', border: '1px solid rgba(240,237,230,0.07)', borderRadius: 10, overflow: 'hidden' }}>
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
    </DashboardLayout>
  )
}