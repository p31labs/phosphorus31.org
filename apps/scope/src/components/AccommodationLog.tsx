import { useState, useEffect, useMemo } from 'react'
import { useSignalStore } from '../stores/useSignalStore'
import { fetchAccommodationLog, getShelterBase } from '../api/shelter'
import type { AccommodationRecord } from '../types'

const PAGE_SIZE = 20

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function AccommodationLog() {
  const [records, setRecords] = useState<AccommodationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [dateFrom, setDateFrom] = useState<string>(() => toDateOnly(new Date(Date.now() - 30 * 24 * 3600 * 1000)))
  const [dateTo, setDateTo] = useState<string>(() => toDateOnly(new Date()))
  const lastSignal = useSignalStore((s) => s.lastSignal)

  useEffect(() => {
    let cancelled = false
    fetchAccommodationLog()
      .then((data) => {
        if (!cancelled) setRecords(data)
      })
      .catch(() => {
        if (!cancelled) setRecords([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [lastSignal?.receivedAt])

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const t = r.timestamp.slice(0, 10)
      return t >= dateFrom && t <= dateTo
    })
  }, [records, dateFrom, dateTo])

  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])
  const hasMore = paginated.length < filtered.length

  const exportCsv = () => {
    const base = getShelterBase()
    const csvUrl = `${base}/accommodation-log?format=csv`
    const filename = `p31-accommodation-log-${new Date().toISOString().slice(0, 10)}.csv`
    fetch(csvUrl)
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('text/csv')) {
          return res.blob().then((blob) => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = res.headers.get('Content-Disposition')?.match(/filename="?([^";\n]+)"?/)?.[1] ?? filename
            a.click()
            URL.revokeObjectURL(url)
          })
        }
        // Fallback: build client-side with UTF-8 BOM and required columns (no PII)
        const UTF8_BOM = '\uFEFF'
        const headers = ['timestamp', 'event_type', 'signal', 'voltage_before', 'voltage_after', 'source', 'accommodation_type']
        const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
        const rows = filtered.map((r) =>
          headers.map((h) => escape((r as unknown as Record<string, string>)[h] ?? '')).join(',')
        )
        const csv = UTF8_BOM + [headers.join(','), ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => {
        const UTF8_BOM = '\uFEFF'
        const headers = ['timestamp', 'event_type', 'signal', 'voltage_before', 'voltage_after', 'source', 'accommodation_type']
        const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
        const rows = filtered.map((r) =>
          headers.map((h) => escape((r as unknown as Record<string, string>)[h] ?? '')).join(',')
        )
        const csv = UTF8_BOM + [headers.join(','), ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      })
  }

  return (
    <section
      aria-label="Accommodation log"
      className="p31-scope-panel"
      style={{
        padding: 16,
        overflow: 'auto',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h2 className="p31-scope-panel-header" style={{ margin: 0 }}>
          Accommodation log
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="date"
            className="p31-input"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
            aria-label="From date"
          />
          <input
            type="date"
            className="p31-input"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
            aria-label="To date"
          />
          <button type="button" className="p31-btn p31-btn-secondary" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>
      {loading ? (
        <p style={{ color: 'var(--p31-muted)', margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          Loading…
        </p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--p31-muted)', margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          No accommodation events recorded
        </p>
      ) : (
        <>
          <div className="p31-scope-accommodation-table-wrap" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12, minWidth: 560 }} className="p31-scope-accommodation-table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                  <th style={thStyle}>Timestamp</th>
                  <th style={thStyle}>Event Type</th>
                  <th style={thStyle}>Signal</th>
                  <th style={thStyle}>Voltage Before</th>
                  <th style={thStyle}>Voltage After</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>Accommodation Type</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => (
                  <tr
                    key={`${r.timestamp}-${i}`}
                    style={{
                      borderBottom: '1px solid var(--panel-border)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <td style={tdStyle}>{new Date(r.timestamp).toISOString()}</td>
                    <td style={tdStyle}>{r.event_type}</td>
                    <td style={tdStyle}>{r.signal || '—'}</td>
                    <td style={tdStyle}>{r.voltage_before ?? '—'}</td>
                    <td style={tdStyle}>{r.voltage_after ?? '—'}</td>
                    <td style={tdStyle}>{r.source}</td>
                    <td style={tdStyle}>{r.accommodation_type ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <button type="button" className="p31-btn p31-btn-secondary" onClick={() => setPage((p) => p + 1)}>
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 6px',
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '3px',
  color: 'var(--p31-muted)',
}

const tdStyle: React.CSSProperties = {
  padding: '8px 6px',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--p31-data)',
}
