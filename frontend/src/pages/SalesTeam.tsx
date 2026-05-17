import { useState } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Badge, Shimmer, Modal, FormField } from '../components/ui'
import { useUsers, useUpdateUserRole } from '../hooks/useUsers'
import { useLeads } from '../hooks/useLeads'
import type { User } from '../types'

export default function SalesTeam() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useUsers(page)
  const { data: leadsData } = useLeads({ page: 1 })
  const { mutate: updateRole, isPending: updatingRole } = useUpdateUserRole()

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [roleModal, setRoleModal] = useState(false)
  const [newRole, setNewRole] = useState<'admin' | 'sales'>('sales')

  const users = data?.data?.users ?? []
  const pagination = data?.data?.pagination
  const leads = leadsData?.data?.leads ?? []

  // Count leads per user
  const leadsByUser = leads.reduce((acc, lead) => {
    const uid = (lead.assignedTo as any)?._id ?? (lead.assignedTo as any)?.id
    if (uid) acc[uid] = (acc[uid] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const qualifiedByUser = leads.reduce((acc, lead) => {
    const uid = (lead.assignedTo as any)?._id ?? (lead.assignedTo as any)?.id
    if (uid && lead.status === 'qualified') acc[uid] = (acc[uid] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const openRoleModal = (user: User) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setRoleModal(true)
  }

  const handleRoleUpdate = () => {
    if (!selectedUser) return
    updateRole({ id: selectedUser.id, role: newRole }, {
      onSuccess: () => setRoleModal(false),
    })
  }

  const COLS = '1.5fr 1.8fr 0.8fr 0.8fr 0.8fr 1fr'

  return (
    <DashboardLayout
      title="Sales team"
      subtitle={pagination ? `${pagination.total} team members` : undefined}
    >
      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,237,230,0.07)', borderRadius: 10, overflow: 'hidden' }}>
        <div className="table-row" style={{ gridTemplateColumns: COLS, borderBottom: '1px solid rgba(240,237,230,0.08)' }}>
          {['Member', 'Email', 'Role', 'Leads', 'Qualified', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="table-row" style={{ gridTemplateColumns: COLS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                  <Shimmer width={100} />
                </div>
                <Shimmer width="80%" />
                <Shimmer width={50} />
                <Shimmer width={30} />
                <Shimmer width={30} />
                <Shimmer width={80} />
              </div>
            ))
          : users.map(user => {
              const total = leadsByUser[user.id] ?? 0
              const qualified = qualifiedByUser[user.id] ?? 0
              const rate = total > 0 ? Math.round((qualified / total) * 100) : 0
              return (
                <div key={user.id} className="table-row" style={{ gridTemplateColumns: COLS }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: user.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(240,237,230,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      color: user.role === 'admin' ? '#a78bfa' : '#f0ede6',
                      flexShrink: 0,
                    }}>
                      {user.name[0].toUpperCase()}
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6' }}>{user.name}</p>
                  </div>
                  <p style={{ fontSize: 13, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                  <Badge label={user.role} type="status" />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6' }}>{total}</p>
                    <p style={{ fontSize: 11, color: '#333' }}>assigned</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#4ade80' }}>{qualified}</p>
                    <p style={{ fontSize: 11, color: '#333' }}>{rate}% rate</p>
                  </div>
                  <button
                    className="btn-ghost"
                    style={{ padding: '6px 12px', fontSize: 13 }}
                    onClick={() => openRoleModal(user)}
                  >
                    Change role
                  </button>
                </div>
              )
            })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button className="btn-ghost" disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px' }}>← Prev</button>
          <button className="btn-ghost" disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px' }}>Next →</button>
        </div>
      )}

      {/* Role change modal */}
      <Modal open={roleModal} onClose={() => setRoleModal(false)} title={`Change role — ${selectedUser?.name}`} width={360}>
        <FormField label="New role">
          <select value={newRole} onChange={e => setNewRole(e.target.value as 'admin' | 'sales')}>
            <option value="sales">Sales</option>
            <option value="admin">Admin</option>
          </select>
        </FormField>
        <p style={{ fontSize: 13, color: '#444', marginBottom: 24, lineHeight: 1.6 }}>
          {newRole === 'admin'
            ? '⚠️ Admin can delete leads and manage team members.'
            : 'Sales users can create and edit leads only.'}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setRoleModal(false)}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleRoleUpdate} disabled={updatingRole}>
            {updatingRole ? 'Saving...' : 'Update role'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}