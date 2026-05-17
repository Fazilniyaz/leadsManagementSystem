// ─── Badge ───────────────────────────────────────────────────────────────────
export const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  new:       { bg: 'rgba(59,130,246,0.12)',  text: '#3b82f6' },
  contacted: { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
  qualified: { bg: 'rgba(74,222,128,0.12)',  text: '#4ade80' },
  lost:      { bg: 'rgba(248,113,113,0.12)', text: '#f87171' },
  admin:     { bg: 'rgba(139,92,246,0.12)',  text: '#a78bfa' },
  sales:     { bg: 'rgba(59,130,246,0.12)',  text: '#3b82f6' },
}

export const SOURCE_COLOR: Record<string, { bg: string; text: string }> = {
  website:   { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa' },
  instagram: { bg: 'rgba(236,72,153,0.12)', text: '#f472b6' },
  referral:  { bg: 'rgba(20,184,166,0.12)', text: '#2dd4bf' },
}

interface BadgeProps {
  label: string
  type?: 'status' | 'source'
}

export const Badge = ({ label, type = 'status' }: BadgeProps) => {
  const map = type === 'status' ? STATUS_COLOR : SOURCE_COLOR
  const color = map[label] ?? { bg: 'rgba(255,255,255,0.06)', text: '#888' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      textTransform: 'capitalize',
      background: color.bg,
      color: color.text,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// ─── StatCard ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: string
}

export const StatCard = ({ label, value, sub, icon }: StatCardProps) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(240,237,230,0.08)',
    borderRadius: 10,
    padding: '22px 20px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <p style={{ fontSize: 13, color: '#555' }}>{label}</p>
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
    </div>
    <p style={{
      fontSize: 34,
      fontWeight: 700,
      color: '#f0ede6',
      letterSpacing: '-0.02em',
      lineHeight: 1,
      marginBottom: 6,
    }}>
      {value}
    </p>
    {sub && <p style={{ fontSize: 12, color: '#333' }}>{sub}</p>}
  </div>
)

// ─── Shimmer ─────────────────────────────────────────────────────────────────
interface ShimmerProps {
  width?: string | number
  height?: number
  borderRadius?: number
}

export const Shimmer = ({ width = '100%', height = 14, borderRadius = 4 }: ShimmerProps) => (
  <div style={{
    width,
    height,
    borderRadius,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  }} />
)

// ─── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: number
}

export const Modal = ({ open, onClose, title, children, width = 480 }: ModalProps) => {
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999, padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111',
          border: '1px solid rgba(240,237,230,0.1)',
          borderRadius: 12,
          width: '100%',
          maxWidth: width,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(240,237,230,0.07)',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f0ede6', letterSpacing: '-0.01em' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f0ede6')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          >×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Confirm ─────────────────────────────────────────────────────────────────
interface ConfirmProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  confirmText?: string
}

export const Confirm = ({ open, message, onConfirm, onCancel, loading, confirmText = 'Delete' }: ConfirmProps) => (
  <Modal open={open} onClose={onCancel} title="Confirm action" width={380}>
    <p style={{ fontSize: 15, color: '#888', marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
    <div style={{ display: 'flex', gap: 12 }}>
      <button
        onClick={onCancel}
        style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid rgba(240,237,230,0.12)', borderRadius: 6, color: '#888', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}
      >Cancel</button>
      <button
        onClick={onConfirm}
        disabled={loading}
        style={{ flex: 1, padding: '11px', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 6, color: '#f87171', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}
      >{loading ? 'Please wait...' : confirmText}</button>
    </div>
  </Modal>
)

// ─── FormField ───────────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string
  children: React.ReactNode
}

export const FormField = ({ label, children }: FormFieldProps) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>
      {label}
    </label>
    {children}
  </div>
)