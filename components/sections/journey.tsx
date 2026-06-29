'use client'

import { useState } from 'react'
import { Flag, Plus } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SAMPLE_GOALS } from '@/lib/sample-data'
import { usePortfolio } from '@/components/portfolio-provider'

function formatValue(value: number, unit: string) {
  if (unit === '$') return `$${value.toLocaleString('en-US')}`
  return `${value.toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

interface Milestone {
  id: string
  date: string
  title: string
  description: string
}

const STORAGE_KEY = 'portfolio_milestones'

function loadMilestones(): Milestone[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveMilestones(milestones: Milestone[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones)) } catch {}
}

export function Journey() {
  const { accounts } = usePortfolio()
  const [milestones, setMilestones] = useState<Milestone[]>(() => loadMilestones())
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const totalPayouts = accounts
    .filter((a) => a.type === 'payout')
    .reduce((sum, a) => sum + (a.amount ?? 0), 0)

  const goals = SAMPLE_GOALS.map((g) =>
    g.id === 'g2' ? { ...g, current: totalPayouts } : g
  )

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      date: date || new Date().toISOString().slice(0, 10),
      title: title.trim(),
      description: description.trim(),
    }
    const updated = [...milestones, newMilestone].sort((a, b) => a.date.localeCompare(b.date))
    setMilestones(updated)
    saveMilestones(updated)
    setDate('')
    setTitle('')
    setDescription('')
    setOpen(false)
  }

  function deleteMilestone(id: string) {
    const updated = milestones.filter((m) => m.id !== id)
    setMilestones(updated)
    saveMilestones(updated)
  }

  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          eyebrow="Progress"
          title="Goals & milestones"
          description="Where I'm headed, and the moments that mark the journey so far."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Goals */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Goals tracker</h3>
            <div className="mt-5 space-y-6">
              {goals.map((goal, i) => {
                const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
                return (
                  <Reveal key={goal.id} delay={i * 70}>
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-medium text-foreground">{goal.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatValue(goal.current, goal.unit)} / {formatValue(goal.target, goal.unit)}
                        </span>
                      </div>
                      <Progress value={pct} className="mt-2" />
                      <p className="mt-1 text-xs text-muted-foreground">{pct}% complete</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground">Milestones timeline</h3>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="size-4" />
                    Add milestone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add milestone</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="m-date">Date</Label>
                      <Input id="m-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="m-title">Title</Label>
                      <Input id="m-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="First payout received" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="m-desc">Description</Label>
                      <Textarea id="m-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description of this milestone" rows={3} />
                    </div>
                    <Button type="submit" className="w-full">Save milestone</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {milestones.length === 0 ? (
              <p className="mt-5 text-sm text-muted-foreground">No milestones yet. Add your first one!</p>
            ) : (
              <ol className="mt-5 space-y-6 border-l border-border pl-6">
                {milestones.map((m, i) => (
                  <Reveal key={m.id} as="li" delay={i * 70} className="relative">
                    <span className="absolute -left-[31px] flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Flag className="size-2.5" />
                    </span>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-medium uppercase tracking-wide text-primary">{formatDate(m.date)}</p>
                          <button
                            type="button"
                            onClick={() => deleteMilestone(m.id)}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        <h4 className="mt-1 font-heading font-semibold text-foreground">{m.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}