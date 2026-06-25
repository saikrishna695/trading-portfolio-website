'use client'

import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { PasscodeGate } from '@/components/passcode-gate'
import { usePortfolio } from '@/components/portfolio-provider'
import type { TradeDirection, TradeResult } from '@/lib/types'
import {
  computeSummary,
  formatCurrency,
  monthKey,
  monthLabel,
} from '@/lib/stats'
import { cn } from '@/lib/utils'

const resultStyles: Record<TradeResult, string> = {
  Win: 'bg-positive text-positive-foreground',
  Loss: 'bg-destructive text-primary-foreground',
  Breakeven: 'bg-secondary text-secondary-foreground',
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function TradingJournal() {
  const { entries } = usePortfolio()
  const [month, setMonth] = useState('all')
  const [instrument, setInstrument] = useState('all')

  const months = useMemo(() => {
    const set = new Map<string, string>()
    entries.forEach((e) => set.set(monthKey(e.date), monthLabel(e.date)))
    return Array.from(set.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [entries])

  const instruments = useMemo(
    () => Array.from(new Set(entries.map((e) => e.instrument))).sort(),
    [entries],
  )

  const filtered = useMemo(
    () =>
      entries
        .filter((e) => (month === 'all' ? true : monthKey(e.date) === month))
        .filter((e) => (instrument === 'all' ? true : e.instrument === instrument))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [entries, month, instrument],
  )

  const summary = computeSummary(filtered)

  const summaryCards = [
    { label: 'Win rate', value: `${summary.winRate.toFixed(0)}%` },
    {
      label: 'Total P&L',
      value: formatCurrency(summary.totalPnl),
      tone: summary.totalPnl >= 0 ? 'pos' : 'neg',
    },
    {
      label: 'Best trade',
      value: summary.bestTrade ? formatCurrency(summary.bestTrade.pnl) : '—',
      tone: 'pos',
    },
    {
      label: 'Worst trade',
      value: summary.worstTrade ? formatCurrency(summary.worstTrade.pnl) : '—',
      tone: summary.worstTrade && summary.worstTrade.pnl < 0 ? 'neg' : undefined,
    },
  ] as const

  return (
    <section id="journal" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Trading Journal"
          title="Every trade, documented"
          description="A transparent record of entries, exits, and the lessons behind each result."
        />
        <Reveal>
          <AddEntryDialog />
        </Reveal>
      </div>

      <Reveal className="mt-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {card.label}
              </p>
              <p
                className={cn(
                  'mt-1 font-heading text-2xl font-semibold',
                  card.tone === 'pos' && 'text-positive',
                  card.tone === 'neg' && 'text-destructive',
                  !card.tone && 'text-foreground',
                )}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-6">
        <div className="flex flex-wrap gap-3">
          <div className="w-44">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger aria-label="Filter by month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All months</SelectItem>
                {months.map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-44">
            <Select value={instrument} onValueChange={setInstrument}>
              <SelectTrigger aria-label="Filter by instrument">
                <SelectValue placeholder="Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All instruments</SelectItem>
                {instruments.map((inst) => (
                  <SelectItem key={inst} value={inst}>
                    {inst}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 space-y-5">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No entries match these filters.</p>
        ) : (
          filtered.map((entry, i) => (
            <Reveal key={entry.id} delay={(i % 4) * 50}>
              <Card className="overflow-hidden p-0">
                <div className="grid md:grid-cols-[260px_1fr]">
                  {entry.image ? (
                    <div className="relative aspect-video bg-muted md:aspect-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.image || '/placeholder.svg'}
                        alt={`${entry.instrument} chart`}
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="hidden items-center justify-center bg-secondary/60 md:flex">
                      <span className="font-mono text-sm text-muted-foreground">
                        {entry.instrument}
                      </span>
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading text-lg font-semibold text-foreground">
                        {entry.instrument}
                      </span>
                      <Badge
                        variant="outline"
                        className="gap-1 text-muted-foreground"
                      >
                        {entry.direction === 'Long' ? (
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        ) : (
                          <ArrowDownRight className="size-3" aria-hidden="true" />
                        )}
                        {entry.direction}
                      </Badge>
                      <Badge className={resultStyles[entry.result]}>
                        {entry.result}
                      </Badge>
                      <span className="ml-auto text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {formatDate(entry.date)}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Entry </span>
                        <span className="font-mono font-medium text-foreground">
                          {entry.entry}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Exit </span>
                        <span className="font-mono font-medium text-foreground">
                          {entry.exit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">P&L </span>
                        <span
                          className={cn(
                            'font-mono font-semibold',
                            entry.pnl > 0 && 'text-positive',
                            entry.pnl < 0 && 'text-destructive',
                            entry.pnl === 0 && 'text-foreground',
                          )}
                        >
                          {formatCurrency(entry.pnl)}
                        </span>
                      </div>
                    </div>

                    {entry.notes ? (
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {entry.notes}
                      </p>
                    ) : null}
                  </CardContent>
                </div>
              </Card>
            </Reveal>
          ))
        )}
      </div>
    </section>
  )
}

function AddEntryDialog() {
  const { addEntry, isAdmin } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [instrument, setInstrument] = useState('')
  const [direction, setDirection] = useState<TradeDirection>('Long')
  const [result, setResult] = useState<TradeResult>('Win')
  const [entry, setEntry] = useState('')
  const [exit, setExit] = useState('')
  const [pnl, setPnl] = useState('')
  const [notes, setNotes] = useState('')
  const [image, setImage] = useState<string | undefined>(undefined)
  const [fileName, setFileName] = useState('')

  function reset() {
    setDate('')
    setInstrument('')
    setDirection('Long')
    setResult('Win')
    setEntry('')
    setExit('')
    setPnl('')
    setNotes('')
    setImage(undefined)
    setFileName('')
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addEntry({
      date: date || new Date().toISOString().slice(0, 10),
      instrument: instrument.trim().toUpperCase() || 'EUR/USD',
      direction,
      result,
      entry: Number(entry) || 0,
      exit: Number(exit) || 0,
      pnl: Number(pnl) || 0,
      notes: notes.trim() || undefined,
      image,
    })
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden="true" />
          Add entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {!isAdmin ? (
          <>
            <DialogHeader>
              <DialogTitle>Add journal entry</DialogTitle>
              <DialogDescription>Unlock to add a new trade.</DialogDescription>
            </DialogHeader>
            <PasscodeGate />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>New journal entry</DialogTitle>
              <DialogDescription>
                Log the trade details and attach the chart.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="entry-date">Date</Label>
                  <Input
                    id="entry-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instrument">Instrument</Label>
                  <Input
                    id="instrument"
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    placeholder="EUR/USD"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select
                    value={direction}
                    onValueChange={(v) => setDirection(v as TradeDirection)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Long">Long</SelectItem>
                      <SelectItem value="Short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Result</Label>
                  <Select
                    value={result}
                    onValueChange={(v) => setResult(v as TradeResult)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Win">Win</SelectItem>
                      <SelectItem value="Loss">Loss</SelectItem>
                      <SelectItem value="Breakeven">Breakeven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry-price">Entry price</Label>
                  <Input
                    id="entry-price"
                    type="number"
                    step="any"
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="1.0842"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exit-price">Exit price</Label>
                  <Input
                    id="exit-price"
                    type="number"
                    step="any"
                    value={exit}
                    onChange={(e) => setExit(e.target.value)}
                    placeholder="1.0931"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="pnl">P&L ($)</Label>
                  <Input
                    id="pnl"
                    type="number"
                    step="any"
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder="1240 (use - for a loss)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes / lessons learned</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="What was the setup? What did you learn?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entry-file">Chart screenshot</Label>
                <label
                  htmlFor="entry-file"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <Upload className="size-4" aria-hidden="true" />
                  {fileName || 'Attach a chart image'}
                </label>
                <Input
                  id="entry-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
              <Button type="submit" className="w-full">
                Save entry
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
