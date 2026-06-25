import { Flag } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SAMPLE_GOALS, SAMPLE_MILESTONES } from '@/lib/sample-data'

function formatValue(value: number, unit: string) {
  if (unit === '$') {
    return `$${value.toLocaleString('en-US')}`
  }
  return `${value.toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function Journey() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          eyebrow="Progress"
          title="Goals & milestones"
          description="Where I'm headed, and the moments that mark the journey so far."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Goals tracker
            </h3>
            <div className="mt-5 space-y-6">
              {SAMPLE_GOALS.map((goal, i) => {
                const pct = Math.min(
                  100,
                  Math.round((goal.current / goal.target) * 100),
                )
                return (
                  <Reveal key={goal.id} delay={i * 70}>
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-medium text-foreground">
                          {goal.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatValue(goal.current, goal.unit)} /{' '}
                          {formatValue(goal.target, goal.unit)}
                        </span>
                      </div>
                      <Progress value={pct} className="mt-2" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {pct}% complete
                      </p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Milestones timeline
            </h3>
            <ol className="mt-5 space-y-6 border-l border-border pl-6">
              {SAMPLE_MILESTONES.map((m, i) => (
                <Reveal key={m.id} as="li" delay={i * 70} className="relative">
                  <span
                    className="absolute -left-[31px] flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    aria-hidden="true"
                  >
                    <Flag className="size-2.5" />
                  </span>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-primary">
                        {formatDate(m.date)}
                      </p>
                      <h4 className="mt-1 font-heading font-semibold text-foreground">
                        {m.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {m.description}
                      </p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
