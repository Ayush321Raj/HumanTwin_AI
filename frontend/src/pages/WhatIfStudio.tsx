/**
 * WhatIfStudio.tsx — Hero page with full end-to-end simulation flow.
 * Visual: Large hero header, scenario suggestions, step-by-step cards.
 */

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, RotateCcw, AlertCircle, AlertTriangle, Trophy, Zap } from 'lucide-react'
import type { InterpretResponse, SimulateResponse } from '../types'
import { interpret, simulate } from '../api/client'
import { Card, Button, Skeleton, CountUp } from '../components/ui'
import InterpretConfirmCard from '../components/shared/InterpretConfirmCard'
import BranchTimeline from '../components/shared/BranchTimeline'
import OptionResultCard from '../components/shared/OptionResultCard'
import ParliamentPanel from '../components/shared/ParliamentPanel'

const SUGGESTIONS = [
  'What if I spend two days on exam prep instead of the assignment?',
  'What if I take it easy this weekend?',
  'What if I pull an all-nighter before the exam?',
]

type Stage = 'idle' | 'interpreting' | 'confirm' | 'simulating' | 'results'

export default function WhatIfStudio() {
  const [question, setQuestion] = useState('')
  const [stage, setStage]       = useState<Stage>('idle')
  const [error, setError]       = useState<string | null>(null)
  const [interp, setInterp]     = useState<InterpretResponse | null>(null)
  const [simResult, setSimResult] = useState<SimulateResponse | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleAnalyse = async () => {
    if (!question.trim()) return
    setError(null); setInterp(null); setSimResult(null)
    setStage('interpreting')
    try {
      const data = await interpret(question.trim())
      setInterp(data)
      setStage('confirm')
    } catch {
      setError('Could not interpret your question. Is the backend running?')
      setStage('idle')
    }
  }

  const handleSimulate = async () => {
    if (!interp) return
    setError(null)
    setStage('simulating')
    try {
      const data = await simulate(interp.scenario)
      setSimResult(data)
      setStage('results')
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch {
      setError('Simulation failed. Please try again.')
      setStage('confirm')
    }
  }

  const handleReset = () => {
    setStage('idle'); setInterp(null); setSimResult(null); setError(null)
  }

  const isLoading = stage === 'interpreting' || stage === 'simulating'

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(69,137,255,0.08) 0%, rgba(45,212,191,0.04) 100%)',
          border: '1px solid rgba(69,137,255,0.2)',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="rounded-xl flex items-center justify-center shrink-0"
            style={{ width: 48, height: 48, background: 'rgba(69,137,255,0.15)', color: 'var(--primary)' }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              What-If Studio
            </h1>
            <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 13, lineHeight: 1.5 }}>
              Ask a question about your upcoming decisions. The twin runs{' '}
              <span className="mono" style={{ color: 'var(--accent)' }}>1,000</span> simulated
              futures and shows you the probabilities — then three versions of you debate.
            </p>
          </div>
        </div>
      </div>

      {/* ── Question input card ──────────────────────────────────────────── */}
      <Card>
        <label
          style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 8,
                   textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'IBM Plex Mono, monospace' }}
        >
          Your question
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isLoading && handleAnalyse()}
            placeholder="e.g. What if I spend two days on exam prep instead of the assignment?"
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'var(--elevated)',
              border: '1.5px solid var(--border)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 14,
              color: 'var(--text)',
              outline: 'none',
              fontFamily: 'IBM Plex Sans, sans-serif',
              opacity: isLoading ? 0.5 : 1,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          <Button
            variant="primary"
            disabled={!question.trim() || isLoading}
            onClick={handleAnalyse}
          >
            {stage === 'interpreting' ? (
              <span className="flex items-center gap-2">
                <span
                  style={{ width: 12, height: 12, borderRadius: '50%',
                           border: '2px solid rgba(255,255,255,0.3)',
                           borderTopColor: '#fff', animation: 'spin 0.8s linear infinite',
                           display: 'inline-block' }}
                />
                Reading…
              </span>
            ) : (
              <>
                <Send size={14} />
                Analyse
              </>
            )}
          </Button>
          {stage !== 'idle' && (
            <Button variant="ghost" size="sm" onClick={handleReset} title="Start over">
              <RotateCcw size={14} />
            </Button>
          )}
        </div>

        {/* Quick-fill suggestions */}
        {stage === 'idle' && (
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', alignSelf: 'center', marginRight: 4 }}>
              Try:
            </span>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => setQuestion(s)}
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, color 0.15s',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--primary)'
                  e.currentTarget.style.color = 'var(--primary)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--muted)'
                }}
              >
                {s.length > 52 ? s.slice(0, 52) + '…' : s}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* ── Error banner ────────────────────────────────────────────────── */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 8, padding: '14px 16px',
            borderRadius: 10, border: '1px solid rgba(250,77,86,0.35)',
            background: 'rgba(250,77,86,0.08)',
          }}
        >
          <AlertCircle size={15} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</p>
        </motion.div>
      )}

      {/* ── Interpretation confirmation ──────────────────────────────────── */}
      <AnimatePresence>
        {interp && (stage === 'confirm' || stage === 'simulating' || stage === 'results') && (
          <InterpretConfirmCard
            interp={interp}
            onConfirm={handleSimulate}
            onEdit={handleReset}
            loading={stage === 'simulating'}
          />
        )}
      </AnimatePresence>

      {/* ── Simulating skeleton ──────────────────────────────────────────── */}
      {stage === 'simulating' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map(i => (
            <div key={i} className="card p-5 space-y-4">
              <Skeleton lines={1} className="w-32" />
              <Skeleton lines={3} />
              <Skeleton lines={1} className="w-20" />
            </div>
          ))}
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {simResult && stage === 'results' && (
          <div ref={resultsRef} className="space-y-6">

            {/* Step divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span
                style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace',
                         padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 12 }}
              >
                Simulation results
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Branch timeline */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} style={{ color: 'var(--accent)' }} />
                <h2 style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>Two Possible Futures</h2>
                <span
                  className="mono"
                  style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 4,
                           background: 'var(--elevated)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)' }}
                >
                  n=1,000 · seed=7
                </span>
              </div>
              <BranchTimeline
                options={simResult.options}
                recommendation={simResult.recommendation}
              />
            </Card>

            {/* Edge Case 2: consent changed mid-flow */}
            {simResult.consent_note && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px',
                  borderRadius: 10, border: '1px solid rgba(241,194,27,0.3)',
                  background: 'rgba(241,194,27,0.07)',
                }}
              >
                <AlertTriangle size={15} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--warning)', marginBottom: 2 }}>
                    Data changed since you asked
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(241,194,27,0.8)' }}>{simResult.consent_note}</p>
                </div>
              </motion.div>
            )}

            {/* Option cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {simResult.options.map((opt, i) => (
                <OptionResultCard
                  key={opt.id}
                  result={opt}
                  isRecommended={opt.id === simResult.recommendation}
                  optionLetter={String.fromCharCode(65 + i)}
                  recommendedId={simResult.recommendation}
                />
              ))}
            </div>

            {/* Recommendation banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              style={{
                borderRadius: 12,
                border: '1px solid rgba(69,137,255,0.35)',
                background: 'linear-gradient(135deg, rgba(69,137,255,0.1) 0%, rgba(69,137,255,0.04) 100%)',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                boxShadow: '0 0 24px rgba(69,137,255,0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl flex items-center justify-center"
                  style={{ width: 40, height: 40, background: 'rgba(69,137,255,0.18)', color: 'var(--primary)' }}
                >
                  <Trophy size={18} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase',
                               letterSpacing: '0.08em', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 3 }}>
                    Recommendation
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                    {simResult.options.find(o => o.id === simResult.recommendation)?.label
                      ?? simResult.recommendation}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>Confidence</p>
                <CountUp
                  value={simResult.confidence * 100}
                  decimals={0}
                  suffix="%"
                  style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}
                />
              </div>
            </motion.div>

            {/* Parliament */}
            <div className="space-y-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span
                  style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace',
                           padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 12 }}
                >
                  Parliament of Selves
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <ParliamentPanel result={simResult} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
