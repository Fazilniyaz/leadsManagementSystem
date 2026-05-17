import { useState } from 'react'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export const DashboardLayout = ({ children, title, subtitle, actions }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024)

  return (
  <div style={{
    display: 'flex',
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#f0ede6',
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }

      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(240,237,230,0.1); border-radius: 2px; }

      input, select, textarea {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(240,237,230,0.1);
        border-radius: 6px;
        padding: 10px 13px;
        font-size: 14px;
        color: #f0ede6;
        font-family: 'DM Sans', sans-serif;
        outline: none;
        transition: border-color 0.2s;
        width: 100%;
      }
      input:focus, select:focus, textarea:focus {
        border-color: rgba(240,237,230,0.3);
      }
      input::placeholder, textarea::placeholder { color: #333; }
      select option { background: #111; color: #f0ede6; }
      input:disabled { opacity: 0.4; cursor: not-allowed; }

      .btn-primary {
        background: #f0ede6;
        color: #0a0a0a;
        border: none;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.2s, transform 0.15s;
        white-space: nowrap;
      }
      .btn-primary:hover:not(:disabled) { background: #fff; }
      .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

      .btn-ghost {
        background: transparent;
        color: #888;
        border: 1px solid rgba(240,237,230,0.1);
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
        white-space: nowrap;
      }
      .btn-ghost:hover:not(:disabled) { border-color: rgba(240,237,230,0.25); color: #f0ede6; }
      .btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

      .btn-danger {
        background: rgba(248,113,113,0.1);
        color: #f87171;
        border: 1px solid rgba(248,113,113,0.25);
        padding: 7px 14px;
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
      }
      .btn-danger:hover { background: rgba(248,113,113,0.18); }

      .table-row {
        display: grid;
        align-items: center;
        padding: 13px 20px;
        border-bottom: 1px solid rgba(240,237,230,0.05);
        transition: background 0.15s;
        gap: 12px;
      }
      .table-row:hover { background: rgba(255,255,255,0.02); }
      
      .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
      }
      
      @media (max-width: 1024px) {
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
        .dashboard-main {
          padding: 24px !important;
        }
      }
    `}</style>

    <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

    <main className="dashboard-main" style={{ 
      flex: 1, 
      padding: '40px 40px', 
      overflowY: 'auto',
      marginLeft: collapsed ? 72 : 260,
      transition: 'margin-left 0.3s ease-out',
      width: '100%',
      minWidth: 0
    }}>
      {/* Page header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 36,
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 4,
            color: '#f0ede6',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 14, color: '#444', fontWeight: 300 }}>{subtitle}</p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>
        )}
      </div>

      {children}
    </main>
  </div>
  )
}