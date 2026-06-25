'use client'

import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { usePortfolio } from '@/components/portfolio-provider'
import { PROFILE } from '@/lib/sample-data'
import { computeSummary, formatCurrency } from '@/lib/stats'

export function Hero() {
  const { entries, accounts } = usePortfolio()
  const summary = computeSummary(entries)
  const totalPayouts = accounts
    .filter((a) => a.type === 'payout')
    .reduce((sum, a) => sum + (a.amount ?? 0), 0)
  const fundedCapital = accounts
    .filter((a) => a.type === 'passing' || a.type === 'payout')
    .reduce((max, a) => Math.max(max, a.amount ?? 0), 0)

  const stats = [
    { label: 'Funded capital', value: formatCurrency(fundedCapital) },
    { label: 'Win rate', value: `${summary.winRate.toFixed(0)}%` },
    { label: 'Total payouts', value: formatCurrency(totalPayouts) },
  ]

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-accent/40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-positive" aria-hidden="true" />
            Funded Forex Trader
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
            {PROFILE.name}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-3 text-balance text-xl font-medium text-primary sm:text-2xl">
            {PROFILE.tagline}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            {PROFILE.bio}
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#accounts">
                View My Results
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#journal">
                <BookOpen className="size-4" aria-hidden="true" />
                Read the Journal
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <dl className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-5"
              >
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 font-heading text-3xl font-semibold text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
