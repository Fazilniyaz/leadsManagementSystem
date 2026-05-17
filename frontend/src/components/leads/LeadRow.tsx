import { Badge } from '../ui'
import type { Lead } from '../../types'

const COLS = '2fr 1.8fr 1fr 1fr 1.2fr 1fr'

interface LeadRowProps {
  lead: Lead
  isAdmin: boolean
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
}

export const LeadRowHeader = () => (
  <div className="table-row" style={{ gridTemplateColumns: COLS, borderBottom: '1px solid rgba(240,237,230,0.08)' }}>
    {['Name', 'Email', 'Status', 'Source', 'Assigned to', 'Actions'].map(h => (
      <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {h}
      </span>
    ))}
  </div>
)

export const LeadRow = ({ lead, isAdmin, onEdit, onDelete }: LeadRowProps) => (
  <div className="table-row" style={{ gridTemplateColumns: COLS }}>
    <div>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6', marginBottom: 2 }}>{lead.name}</p>
      {lead.phone && <p style={{ fontSize: 11, color: '#333' }}>{lead.phone}</p>}
    </div>

    <p style={{ fontSize: 13, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {lead.email}
    </p>

    <Badge label={lead.status} type="status" />
    <Badge label={lead.source} type="source" />

    <p style={{ fontSize: 13, color: '#555' }}>
      {(lead.assignedTo as any)?.name ?? (
        <span style={{ color: '#2a2a2a' }}>Unassigned</span>
      )}
    </p>

    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => onEdit(lead)}
        title="Edit"
        style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: 4, transition: 'color 0.15s', lineHeight: 1 }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f0ede6')}
        onMouseLeave={e => (e.currentTarget.style.color = '#555')}
      >✏️</button>

      {isAdmin && (
        <button
          onClick={() => onDelete(lead._id)}
          title="Delete"
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: 4, transition: 'color 0.15s', lineHeight: 1 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = '#555')}
        >🗑️</button>
      )}
    </div>
  </div>
)

export { COLS as LEAD_COLS }