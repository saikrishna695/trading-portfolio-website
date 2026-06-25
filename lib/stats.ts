import type { JournalEntry } from './types'

export function formatCurrency(value: number): string {
  const sign = value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`
}

export function monthKey(dateIso: string): string {
  return dateIso.slice(0, 7) // yyyy-mm
}

export function monthLabel(dateIso: string): string {
  const d = new Date(dateIso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export interface SummaryStats {
  totalPnl: number
  winRate: number
  wins: number
  losses: number
  breakeven: number
  total: number
  bestTrade: JournalEntry | null
  worstTrade: JournalEntry | null
}

export function computeSummary(entries: JournalEntry[]): SummaryStats {
  const wins = entries.filter((e) => e.result === 'Win').length
  const losses = entries.filter((e) => e.result === 'Loss').length
  const breakeven = entries.filter((e) => e.result === 'Breakeven').length
  const decisive = wins + losses
  const totalPnl = entries.reduce((sum, e) => sum + e.pnl, 0)

  const sorted = [...entries].sort((a, b) => b.pnl - a.pnl)
  const bestTrade = sorted.length ? sorted[0] : null
  const worstTrade = sorted.length ? sorted[sorted.length - 1] : null

  return {
    totalPnl,
    winRate: decisive ? (wins / decisive) * 100 : 0,
    wins,
    losses,
    breakeven,
    total: entries.length,
    bestTrade,
    worstTrade,
  }
}

export function cumulativePnl(entries: JournalEntry[]) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  let running = 0
  return sorted.map((e) => {
    running += e.pnl
    return { date: e.date, label: monthLabel(e.date), pnl: running, trade: e.pnl }
  })
}

export function pnlByInstrument(entries: JournalEntry[]) {
  const map = new Map<string, number>()
  for (const e of entries) {
    map.set(e.instrument, (map.get(e.instrument) ?? 0) + e.pnl)
  }
  return Array.from(map.entries())
    .map(([instrument, pnl]) => ({ instrument, pnl }))
    .sort((a, b) => b.pnl - a.pnl)
}

export function pnlByMonth(entries: JournalEntry[]) {
  const map = new Map<string, number>()
  for (const e of entries) {
    map.set(monthKey(e.date), (map.get(monthKey(e.date)) ?? 0) + e.pnl)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, pnl]) => ({
      month: new Date(key + '-01T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
      }),
      key,
      pnl,
    }))
}
