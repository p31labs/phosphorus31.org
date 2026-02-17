export function getShelterBase(): string {
  return typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SHELTER_URL
    ? import.meta.env.VITE_SHELTER_URL
    : 'http://localhost:4000'
}

const FETCH_TIMEOUT_MS = 15_000

import type { HistoryResponse } from '../types'
import type { AccommodationRecord } from '../types'

/** Fetch with timeout so UI never hangs on a stuck request. */
function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = FETCH_TIMEOUT_MS
): Promise<Response> {
  const ac = new AbortController()
  const timeoutId = setTimeout(() => ac.abort(), timeoutMs)
  return fetch(url, { ...options, signal: ac.signal }).finally(() => clearTimeout(timeoutId))
}

export async function fetchHistory(
  limit = 50,
  offset = 0,
  status?: string
): Promise<HistoryResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (status) params.set('status', status)
  const res = await fetchWithTimeout(`${getShelterBase()}/history?${params}`)
  if (!res.ok) throw new Error(`History failed: ${res.status}`)
  return res.json()
}

export async function fetchAccommodationLog(): Promise<AccommodationRecord[]> {
  const res = await fetchWithTimeout(`${getShelterBase()}/accommodation-log`)
  if (!res.ok) throw new Error(`Accommodation log failed: ${res.status}`)
  return res.json()
}

export function getShelterWsUrl(): string {
  const base = getShelterBase().replace(/^http/, 'ws')
  return `${base}/ws`
}
