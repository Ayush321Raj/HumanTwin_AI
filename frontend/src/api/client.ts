// ── API client ────────────────────────────────────────────────────────────────
// All fetch calls go through here so the base URL is configured in one place.

import type {
  AccessLogEntry,
  ConsentState,
  FidelityResponse,
  InterpretResponse,
  OverrideResponse,
  SimulateResponse,
  TwinMemory,
  WhyResponse,
} from '../types'

const BASE = '/api'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

// ── Twin ─────────────────────────────────────────────────────────────────────

export const getTwin = (): Promise<TwinMemory> => get('/twin')

export const getWhy = (beliefId: string): Promise<WhyResponse> =>
  get(`/why/${beliefId}`)

// ── Consent ───────────────────────────────────────────────────────────────────

export const getConsent = (): Promise<ConsentState> => get('/consent')

export const toggleConsent = (
  sourceId: string,
  enabled: boolean
): Promise<ConsentState> => post(`/consent/${sourceId}`, { enabled })

export const getAccessLog = (): Promise<AccessLogEntry[]> => get('/access-log')

// ── Simulate ──────────────────────────────────────────────────────────────────

export const interpret = (question: string): Promise<InterpretResponse> =>
  post('/interpret', { question })

// Scenario is sent directly as the body (matches Pydantic Scenario model)
export const simulate = (
  scenario: InterpretResponse['scenario']
): Promise<SimulateResponse> => post('/simulate', scenario)

// ── Override ──────────────────────────────────────────────────────────────────

export const override = (
  chosen_option: string,
  reason: string
): Promise<OverrideResponse> => post('/override', { chosen_option, reason })

// ── Fidelity ──────────────────────────────────────────────────────────────────

export const getFidelity = (): Promise<FidelityResponse> => get('/fidelity')

// ── Upcoming tasks ────────────────────────────────────────────────────────────

export const getUpcoming = (): Promise<Record<string, unknown>[]> =>
  get('/upcoming')
