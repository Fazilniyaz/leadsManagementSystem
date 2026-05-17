import { useState, useCallback } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Badge, Shimmer, Confirm } from '../components/ui'
import { LeadModal } from '../components/leads/LeadModal'
import { useLeads, useDeleteLead, useExportCSV } from '../hooks/useLeads'
import { useCurrentUser } from '../hooks/useAuth'
import type { Lead } from '../types'
import type { LeadFilters } from '../api/leads.api'

const COLS = '2fr 1.8fr 1fr 1fr 1.2fr 1fr'

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)
  useState(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  })
  return debounced
}

export default function Leads() {
  const { data: user } = useCurrentUser()
  const isAdmin = user?.role === 'admin'

  const [filters, setFilters] = useState<LeadFilters>({ page: 1, sort: 'latest' })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const activeFilters: LeadFilters = { ...filters, search: debouncedSearch || undefined }

  const { data, isLoading, isFetching } = useLeads(activeFilters)
  const { mutate: deleteLead, isPending: deleting } = useDeleteLead()
  const { mutate: exportCSV, isPending: exporting } = useExportCSV()

  const [modalOpen, setModalOpen] = useState(false)
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const leads = data?.data?.leads ?? []
  const pagination = data?.data?.pagination

  const setFilter = useCallback((k: keyof LeadFilters, v: string) => {
    setFilters(p => ({ ...p, [k]: v || undefined, page: 1 }))
  }, [])

  const openCreate = () => { setEditLead(null); setModalOpen(true) }
  const openEdit = (lead: Lead) => { setEditLead(lead); setModalOpen(true) }

  return (
    <DashboardLayout
      title="Leads"
      subtitle={pagination ? `${pagination.total} total leads` : undefined}
      actions={
        <>
          <button className="btn-ghost" onClick={() => exportCSV(activeFilters)} disabled={exporting}>
            {exporting ? 'Exporting...' : '⬇ Export CSV'}
          </button>
          <button className="btn-primary" onClick={openCreate}>+ New lead</button>
        </>
      }
    >
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          placeholder="🔍  Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <select value={filters.status ?? ''} onChange={e => setFilter('status', e.target.value)} style={{ width: 'auto' }}>
          <option value="">All statuses</option>
          {['new', 'contacted', 'qualified', 'lost'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.source ?? ''} onChange={e => setFilter('source', e.target.value)} style={{ width: 'auto' }}>
          <option value="">All sources</option>
          {['website', 'instagram', 'referral'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.sort ?? 'latest'} onChange={e => setFilter('sort', e.target.value)} style={{ width: 'auto' }}>
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        {(filters.status || filters.source || search) && (
          <button className="btn-ghost" onClick={() => { setFilters({ page: 1, sort: 'latest' }); setSearch('') }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,237,230,0.07)', borderRadius: 10, overflow: 'hidden', opacity: isFetching && !isLoading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
        {/* Table header */}
        <div className="table-row" style={{ gridTemplateColumns: COLS, borderBottom: '1px solid rgba(240,237,230,0.08)' }}>
          {['Name', 'Email', 'Status', 'Source', 'Assigned to', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="table-row" style={{ gridTemplateColumns: COLS }}>
                <Shimmer width="70%" />
                <Shimmer width="80%" />
                <Shimmer width={60} />
                <Shimmer width={60} />
                <Shimmer width="60%" />
                <Shimmer width={80} />
              </div>
            ))
          : leads.length === 0
          ? (
              <div style={{ padding: '64px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>📭</p>
                <p style={{ fontSize: 15, color: '#555', marginBottom: 6 }}>No leads found</p>
                <p style={{ fontSize: 13, color: '#333' }}>Try adjusting your filters or create a new lead</p>
              </div>
            )
          : leads.map(lead => (
              <div key={lead._id} className="table-row" style={{ gridTemplateColumns: COLS }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6', marginBottom: 2 }}>{lead.name}</p>
                  {lead.phone && <p style={{ fontSize: 11, color: '#333' }}>{lead.phone}</p>}
                </div>
                <p style={{ fontSize: 13, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</p>
                <Badge label={lead.status} type="status" />
                <Badge label={lead.source} type="source" />
                <p style={{ fontSize: 13, color: '#555' }}>
                  {(lead.assignedTo as any)?.name ?? <span style={{ color: '#2a2a2a' }}>Unassigned</span>}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => openEdit(lead)}
                    style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: 4, transition: 'color 0.15s', lineHeight: 1 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f0ede6')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                    title="Edit"
                  >✏️</button>
                  {isAdmin && (
                    <button
                      onClick={() => setConfirmId(lead._id)}
                      style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: 4, transition: 'color 0.15s', lineHeight: 1 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                      title="Delete"
                    >🗑️</button>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#444' }}>
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn-ghost"
              disabled={!pagination.hasPrevPage}
              onClick={() => setFilters(p => ({ ...p, page: (p.page ?? 1) - 1 }))}
              style={{ padding: '8px 16px' }}
            >
              ← Prev
            </button>
            <button
              className="btn-ghost"
              disabled={!pagination.hasNextPage}
              onClick={() => setFilters(p => ({ ...p, page: (p.page ?? 1) + 1 }))}
              style={{ padding: '8px 16px' }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} lead={editLead} />
      <Confirm
        open={!!confirmId}
        message="Are you sure you want to delete this lead? This action cannot be undone."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) deleteLead(confirmId, { onSuccess: () => setConfirmId(null) })
        }}
        loading={deleting}
      />
    </DashboardLayout>
  )
}