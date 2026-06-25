import {
  CheckCircle2,
  Compass,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Card, CardContent } from '@/components/ui/card'
import {
  RISK_RULES,
  TRADING_PLAN,
  WATCHLIST,
} from '@/lib/sample-data'

const PILLARS = [
  {
    icon: TrendingUp,
    title: 'Trading style',
    text: 'Intraday and swing setups on majors, focusing on liquidity, supply & demand, and session timing.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk management',
    text: 'Fixed fractional risk, hard daily loss limits, and capital preservation ahead of profit chasing.',
  },
  {
    icon: Compass,
    title: 'Philosophy',
    text: 'A repeatable process beats prediction. Journal everything, review weekly, refine slowly.',
  },
  {
    icon: Target,
    title: 'Goals',
    text: 'Scale funded capital responsibly while keeping drawdowns shallow and payouts consistent.',
  },
]

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="About Me"
        title="A process-driven approach to funded trading"
        description="I trade Forex on funded prop-firm accounts, treating each account like a business with strict rules. The edge is discipline — protect capital first, let the process compound."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {PILLARS.map((pillar, i) => (
          <Reveal key={pillar.title} delay={i * 70}>
            <Card className="h-full">
              <CardContent className="flex gap-4 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <pillar.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {pillar.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Trading plan & rules
              </h3>
              <ul className="mt-4 space-y-3">
                {TRADING_PLAN.map((rule) => (
                  <li key={rule} className="flex gap-3 text-sm leading-relaxed">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Risk framework
              </h3>
              <dl className="mt-4 space-y-3">
                {RISK_RULES.map((rule) => (
                  <div
                    key={rule.label}
                    className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-muted-foreground">
                      {rule.label}
                    </dt>
                    <dd className="text-sm font-semibold text-foreground">
                      {rule.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <Reveal className="mt-8">
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Pairs I trade
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                My focused watchlist for funded accounts.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {WATCHLIST.map((pair) => (
                <li
                  key={pair}
                  className="rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-sm font-medium text-secondary-foreground"
                >
                  {pair}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  )
}
