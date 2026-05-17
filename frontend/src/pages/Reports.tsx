import { useMemo } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { StatCard, Badge } from '../components/ui'
import { useLeads, useExportCSV } from '../hooks/useLeads'
import { useUsers } from '../hooks/useUsers'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts'

const STATUS_COLORS = ['#3b82f6', '#f59e0b', '#4ade80', '#f87171']
const SOURCE_COLORS = ['#a78bfa', '#f472b6', '#2dd4bf']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#111', border: '1px solid rgba(240,237,230,0.12)', borderRadius: 8, padding: '10px 14px' }}>
      {label && <p style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 14, fontWeight: 600, color: p.fill || '#f0ede6' }}>
          {p.value} {p.name}
        </p>
      ))}
    </div>
  )
}

export default function Reports() {
  const { data: leadsData, isLoading } = useLeads({ limit: 1000 })
  const { data: usersData } = useUsers()
  const { mutate: exportCSV, isPending: exporting } = useExportCSV()

  const leads = leadsData?.data?.leads ?? []
  const users = usersData?.data?.users ?? []
  const totalLeads = leadsData?.data?.pagination?.total ?? 0

  const stats = useMemo(() => {
    const qualified = leads.filter(l => l.status === 'qualified').length
    const lost = leads.filter(l => l.status === 'lost').length
    const convRate = leads.length > 0 ? Math.round((qualified / leads.length) * 100) : 0
    return { qualified, lost, convRate }
  }, [leads])

  // Status distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {}
    leads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [leads])

  // Source distribution
  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {}
    leads.forEach(l => { counts[l.source] = (counts[l.source] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [leads])

  // Per-member stats
  const memberStats = useMemo(() => {
    return users.map(user => {
      const userId = String((user as any)._id ?? (user as any).id ?? '')
      const assigned = leads.filter(l => {
        const assignee = l.assignedTo as any
        if (!assignee) return false
        const assigneeId = String(assignee._id ?? assignee.id ?? assignee)
        return assigneeId === userId
      })
      const qualified = assigned.filter(l => l.status === 'qualified').length
      return {
        name: user.name.split(' ')[0],
        fullName: user.name,
        role: user.role,
        total: assigned.length,
        qualified,
        rate: assigned.length > 0 ? Math.round((qualified / assigned.length) * 100) : 0,
      }
    }).sort((a, b) => b.qualified - a.qualified)
  }, [leads, users])

  const chartStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(240,237,230,0.07)',
    borderRadius: 10,
    padding: '24px',
  }

  return (
    <DashboardLayout
      title="Reports"
      subtitle="Pipeline analytics and team performance"
      actions={
        <button className="btn-ghost" onClick={() => exportCSV({})} disabled={exporting}>
          {exporting ? 'Exporting...' : '⬇ Download CSV'}
        </button>
      }
    >
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total leads" value={totalLeads} icon="📋" sub="All time" />
        <StatCard label="Qualified" value={stats.qualified} icon="🎯" sub="This page" />
        <StatCard label="Conversion rate" value={`${stats.convRate}%`} icon="📈" sub="Qualified / total" />
        <StatCard label="Lost" value={stats.lost} icon="❌" sub="This page" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Status pie */}
        <div style={chartStyle}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0ede6', marginBottom: 20 }}>Status breakdown</h2>
          {isLoading ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#888', fontSize: 12, textTransform: 'capitalize' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Source bar */}
        <div style={chartStyle}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0ede6', marginBottom: 20 }}>Leads by source</h2>
          {isLoading ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sourceData} barSize={36}>
                <XAxis dataKey="name" tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Member performance table */}
      <div style={chartStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0ede6', marginBottom: 20 }}>Team performance</h2>
        {memberStats.length === 0 ? (
          <p style={{ color: '#444', fontSize: 14 }}>No data yet</p>
        ) : (
          <div>
            <div className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', borderBottom: '1px solid rgba(240,237,230,0.08)' }}>
              {['Member', 'Role', 'Assigned', 'Qualified', 'Conversion'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
              ))}
            </div>
            {memberStats.map(m => m.role === "sales" && (
              <div key={m.fullName} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(240,237,230,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#f0ede6', flexShrink: 0 }}>
                    {m.fullName[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6' }}>{m.fullName}</span>
                </div>
                <Badge label={m.role} type="status" />
                <span style={{ fontSize: 14, color: '#888' }}>{m.total}</span>
                <span style={{ fontSize: 14, color: '#4ade80', fontWeight: 600 }}>{m.qualified}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${m.rate}%`, background: '#4ade80', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#555', minWidth: 32 }}>{m.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}