import { useLocation, useNavigate } from 'react-router-dom'
import { useCurrentUser, useLogout } from '../../hooks/useAuth'

const NAV_ITEMS = [
  { path: '/dashboard',  label: 'Dashboard', icon: '📊' },
  { path: '/leads',      label: 'Leads',     icon: '📋' },
  { path: '/reports',    label: 'Reports',   icon: '📈' },
  { path: '/settings',   label: 'Settings',  icon: '⚙️' },
]
const ADMIN_ITEM = { path: '/sales-team', label: 'Sales Team', icon: '👥' }

export const Sidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const { mutate: logout, isPending } = useLogout()

  const navItems = [
    NAV_ITEMS[0],
    NAV_ITEMS[1],
    ...(user?.role === 'admin' ? [ADMIN_ITEM] : []),
    NAV_ITEMS[2],
    NAV_ITEMS[3],
  ]

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      borderRight: '1px solid rgba(240,237,230,0.06)',
      padding: '28px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      position: 'sticky',
      top: 0,
      height: '100vh',
      flexShrink: 0,
      background: '#0a0a0a',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px', marginBottom: 28 }}>
        <div style={{ width: 26, height: 26, background: '#f0ede6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#0a0a0a', fontWeight: 900, fontSize: 13 }}>L</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#f0ede6' }}>LeadsMS</span>
      </div>

      {/* Nav */}
      {navItems.map(item => {
        const active = pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              color: active ? '#f0ede6' : '#555',
              background: active ? 'rgba(240,237,230,0.08)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.background = 'rgba(240,237,230,0.04)'
                e.currentTarget.style.color = '#aaa'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#555'
              }
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}

      <div style={{ flex: 1 }} />

      {/* User card */}
      <div style={{
        padding: '12px',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(240,237,230,0.06)',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(240,237,230,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, color: '#f0ede6', flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#f0ede6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name ?? '—'}
            </p>
            <p style={{ fontSize: 11, color: '#444', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => logout()}
        disabled={isPending}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 6,
          fontSize: 14, fontWeight: 500, color: '#555',
          background: 'transparent', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit',
          width: '100%', textAlign: 'left', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.color = '#f87171' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555' }}
      >
        <span>🚪</span> {isPending ? 'Signing out...' : 'Sign out'}
      </button>
    </aside>
  )
}