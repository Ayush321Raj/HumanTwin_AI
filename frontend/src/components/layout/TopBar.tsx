/**
 * TopBar.tsx — fixed-height top bar, pure inline styles so layout is reliable.
 */

import { useEffect, useState } from 'react'
import { Sun, Moon, AlertTriangle, Cpu } from 'lucide-react'
import { getTwin, getFidelity } from '../../api/client'

export default function TopBar() {
  const [twinName, setTwinName]           = useState('Riya')
  const [confidence, setConfidence]       = useState<number | null>(null)
  const [fidelityLabel, setFidelityLabel] = useState<string | null>(null)
  const [fidelityScore, setFidelityScore] = useState<number | null>(null)
  const [dark, setDark]                   = useState(true)
  const [offline, setOffline]             = useState(false)

  const fetchStats = async () => {
    try {
      const [twin, fid] = await Promise.all([getTwin(), getFidelity()])
      setTwinName(twin.persona_name)
      setConfidence(twin.overall_confidence)
      setFidelityLabel(fid.label)
      setFidelityScore(fid.score)
      setOffline(false)
    } catch {
      setOffline(true)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60_000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    setDark(d => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      document.documentElement.classList.toggle('light', !next)
      return next
    })
  }

  const fidelityColor =
    fidelityScore === null ? 'var(--muted)'
    : fidelityScore >= 0.8 ? 'var(--success)'
    : fidelityScore >= 0.6 ? 'var(--warning)'
    : 'var(--danger)'

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 64,
        minHeight: 64,
        maxHeight: 64,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        zIndex: 10,
        position: 'relative',
      }}
    >
      {/* ── Left: Twin identity ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E3A6E 0%, #162038 100%)',
              border: '1.5px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              color: '#4589FF',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >
            {twinName[0]}
          </div>
          {/* Status dot */}
          <span
            style={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: offline ? '#FA4D56' : '#42BE65',
              border: '2px solid var(--surface)',
            }}
          />
        </div>

        {/* Name */}
        <div>
          <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: '1.2', fontFamily: 'IBM Plex Mono, monospace', margin: 0 }}>
            Digital Twin
          </p>
          <p style={{ fontWeight: 600, color: 'var(--text)', lineHeight: '1.3', fontSize: 14, margin: 0 }}>
            {twinName}
          </p>
        </div>

        {/* Offline pill */}
        {offline && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(250,77,86,0.1)',
              border: '1px solid rgba(250,77,86,0.3)',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 11,
              color: '#FA4D56',
            }}
          >
            <AlertTriangle size={11} />
            Backend offline
          </div>
        )}
      </div>

      {/* ── Right: stats + theme toggle ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

        {/* Twin confidence */}
        {confidence !== null && !offline && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, lineHeight: '1.1', fontFamily: 'IBM Plex Mono, monospace' }}>
              Twin confidence
            </p>
            <p style={{ fontSize: 15, color: '#4589FF', fontWeight: 700, margin: 0, fontFamily: 'IBM Plex Mono, monospace' }}>
              {Math.round(confidence * 100)}%
            </p>
          </div>
        )}

        {/* Fidelity badge */}
        {fidelityLabel && !offline && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: `${fidelityColor}18`,
              border: `1px solid ${fidelityColor}35`,
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 11,
              fontFamily: 'IBM Plex Mono, monospace',
              color: fidelityColor,
            }}
          >
            <Cpu size={11} />
            <span>{fidelityLabel}</span>
            {fidelityScore !== null && (
              <span style={{ color: 'var(--muted)', fontSize: 10 }}>
                {Math.round(fidelityScore * 100)}%
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--elevated)',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  )
}
