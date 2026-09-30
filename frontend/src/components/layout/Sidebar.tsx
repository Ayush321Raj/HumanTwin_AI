import { NavLink } from 'react-router-dom'
import {
  Shield, User, Sparkles, Users, BookOpen, Activity,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/consent',    icon: Shield,   label: 'Consent Vault',      color: '#4589FF' },
  { to: '/twin',       icon: User,     label: 'Twin Profile',       color: '#2DD4BF' },
  { to: '/whatif',     icon: Sparkles, label: 'What-If Studio',     color: '#F1C21B' },
  { to: '/parliament', icon: Users,    label: 'Parliament',         color: '#4589FF' },
  { to: '/learning',   icon: BookOpen, label: 'Learning',           color: '#A78BFA' },
  { to: '/fidelity',   icon: Activity, label: 'Fidelity & Autopsy', color: '#FB923C' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const W = collapsed ? 64 : 220

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: W,
        minWidth: W,
        maxWidth: W,
        height: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          minHeight: 64,
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #4589FF 0%, #6EA6FF 100%)',
            boxShadow: '0 0 12px rgba(69,137,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>
            HT
          </span>
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, lineHeight: '1.2', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              HumanTwin
            </p>
            <p style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace', whiteSpace: 'nowrap' }}>
              AI · GATEWAYS 2026
            </p>
          </div>
        )}
      </div>

      {/* ── Nav links ────────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px 14px' : '9px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 8,
              marginBottom: 2,
              background: isActive ? `${color}18` : 'transparent',
              color: isActive ? color : 'var(--muted)',
              borderLeft: isActive ? `2.5px solid ${color}` : '2.5px solid transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: 13,
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              fontFamily: 'IBM Plex Sans, sans-serif',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={15} style={{ color: isActive ? color : 'var(--muted)', flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Collapse toggle ──────────────────────────────────────────────── */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--muted)',
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'IBM Plex Sans, sans-serif',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={15} />
          : <><ChevronLeft size={15} /><span>Collapse</span></>
        }
      </button>
    </aside>
  )
}
