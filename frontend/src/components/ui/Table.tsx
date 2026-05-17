import { Shimmer } from './Shimmer'

interface Column {
  key: string
  label: string
  width?: string
}

interface TableProps {
  columns: Column[]
  loading?: boolean
  shimmerRows?: number
  children: React.ReactNode
  emptyMessage?: string
  emptySubMessage?: string
}

export const Table = ({
  columns,
  loading,
  shimmerRows = 6,
  children,
  // emptyMessage = 'No data found',
  // emptySubMessage,
}: TableProps) => {
  const gridCols = columns.map(c => c.width ?? '1fr').join(' ')

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(240,237,230,0.07)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div className="table-row" style={{ gridTemplateColumns: gridCols, borderBottom: '1px solid rgba(240,237,230,0.08)' }}>
        {columns.map(col => (
          <span key={col.key} style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {col.label}
          </span>
        ))}
      </div>

      {/* Loading shimmer */}
      {loading && Array.from({ length: shimmerRows }).map((_, i) => (
        <div key={i} className="table-row" style={{ gridTemplateColumns: gridCols }}>
          {columns.map(col => (
            <Shimmer key={col.key} width="70%" />
          ))}
        </div>
      ))}

      {/* Rows */}
      {!loading && children}

      {/* Empty state — rendered by parent via children, but we expose a helper */}
    </div>
  )
}

// Reusable empty state
export const EmptyState = ({ message = 'No data found', subMessage }: { message?: string; subMessage?: string }) => (
  <div style={{ padding: '64px 20px', textAlign: 'center' }}>
    <p style={{ fontSize: 36, marginBottom: 12 }}>📭</p>
    <p style={{ fontSize: 15, color: '#555', marginBottom: 6 }}>{message}</p>
    {subMessage && <p style={{ fontSize: 13, color: '#333' }}>{subMessage}</p>}
  </div>
)

// Reusable table row wrapper
interface TableRowProps {
  gridTemplateColumns: string
  children: React.ReactNode
  onClick?: () => void
}

export const TableRow = ({ gridTemplateColumns, children, onClick }: TableRowProps) => (
  <div className="table-row" style={{ gridTemplateColumns, cursor: onClick ? 'pointer' : undefined }} onClick={onClick}>
    {children}
  </div>
)