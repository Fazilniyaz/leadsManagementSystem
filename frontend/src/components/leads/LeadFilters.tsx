import type { LeadFilters as LeadFiltersType } from '../../api/leads.api'

interface LeadFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  filters: LeadFiltersType
  onFilterChange: (key: keyof LeadFiltersType, value: string) => void
  onClear: () => void
}

const hasActiveFilters = (filters: LeadFiltersType, search: string) =>
  !!(filters.status || filters.source || search)

export const LeadFilters = ({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onClear,
}: LeadFiltersProps) => (
  <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
    <input
      placeholder="🔍  Search name or email..."
      value={search}
      onChange={e => onSearchChange(e.target.value)}
      style={{ maxWidth: 260 }}
    />

    <select
      value={filters.status ?? ''}
      onChange={e => onFilterChange('status', e.target.value)}
      style={{ width: 'auto' }}
    >
      <option value="">All statuses</option>
      {['new', 'contacted', 'qualified', 'lost'].map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>

    <select
      value={filters.source ?? ''}
      onChange={e => onFilterChange('source', e.target.value)}
      style={{ width: 'auto' }}
    >
      <option value="">All sources</option>
      {['website', 'instagram', 'referral'].map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>

    <select
      value={filters.sort ?? 'latest'}
      onChange={e => onFilterChange('sort', e.target.value)}
      style={{ width: 'auto' }}
    >
      <option value="latest">Latest first</option>
      <option value="oldest">Oldest first</option>
    </select>

    {hasActiveFilters(filters, search) && (
      <button className="btn-ghost" onClick={onClear}>
        ✕ Clear filters
      </button>
    )}
  </div>
)