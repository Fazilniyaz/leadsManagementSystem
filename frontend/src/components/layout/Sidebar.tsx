import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, GitBranch, Users, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCurrentUser, useLogout } from '../../hooks/useAuth'
import { Confirm } from '../ui'

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (val: boolean) => void;
}

export const Sidebar = ({ collapsed, onCollapse }: SidebarProps) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const [confirmLogout, setConfirmLogout] = useState(false)

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads',     label: 'Leads',     icon: GitBranch },
    ...(user?.role === 'admin' ? [{ path: '/sales-team', label: 'Sales Team', icon: Users }] : []),
    { path: '/reports',   label: 'Reports',   icon: BarChart3 },
    { path: '/settings',  label: 'Settings',  icon: Settings },
  ]

  return (
    <aside style={{ 
      width: collapsed ? 72 : 260, 
      borderRight: '1px solid rgba(240,237,230,0.06)', 
      padding: '16px 12px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 4, 
      position: 'fixed', 
      top: 0, 
      left: 0,
      height: '100vh', 
      flexShrink: 0,
      background: '#0a0a0a',
      zIndex: 40,
      transition: 'all 0.3s ease-out'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 14px', marginBottom: 28, height: 40 }}>
        <div style={{ width: 26, height: 26, background: '#f0ede6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#0a0a0a', fontWeight: 900, fontSize: 13 }}>G</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap', color: '#f0ede6' }}>
          GigFlow
        </span>
      </div>

      {navItems.map(item => {
        const active = pathname === item.path
        const Icon = item.icon
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
              padding: collapsed ? '10px 0' : '10px 14px',
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
                e.currentTarget.style.color = '#f0ede6'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.color = '#555'
              }
            }}
          >
            <Icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        )
      })}

      <div style={{ flex: 1 }} />

      {/* Collapse toggle */}
      <button 
        onClick={() => onCollapse(!collapsed)}
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8,
          padding: '12px 14px', color: '#555', background: 'transparent', border: 'none', cursor: 'pointer',
          borderTop: '1px solid rgba(240,237,230,0.06)', transition: 'all 0.2s', width: '100%'
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f0ede6'}
        onMouseLeave={e => e.currentTarget.style.color = '#555'}
      >
        {collapsed ? <ChevronRight size={20} /> : <><ChevronLeft size={20} /> <span>Collapse</span></>}
      </button>

      {/* User info */}
      <div style={{ padding: collapsed ? '12px 0' : '12px 14px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(240,237,230,0.06)', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(240,237,230,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#f0ede6', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#f0ede6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                {user?.name ?? '—'}
              </p>
              <p style={{ fontSize: 11, color: '#444', textTransform: 'capitalize', margin: 0 }}>{user?.role}</p>
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setConfirmLogout(true)} disabled={loggingOut} style={{ 
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '10px 0' : '10px 14px', borderRadius: 6,
        fontSize: 14, fontWeight: 500, color: '#555',
        background: 'transparent', border: 'none',
        cursor: 'pointer', fontFamily: 'inherit',
        width: '100%', textAlign: 'left', transition: 'all 0.15s',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.color = '#f87171' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555' }}
      >
        <LogOut size={20} /> 
        {!collapsed && <span>{loggingOut ? 'Signing out...' : 'Sign out'}</span>}
      </button>

      <Confirm
        open={confirmLogout}
        message="Are you sure you want to sign out?"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => logout()}
        loading={loggingOut}
        confirmText="Sign out"
      />
    </aside>
  )
}