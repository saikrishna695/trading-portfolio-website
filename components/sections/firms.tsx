import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SAMPLE_FIRMS } from '@/lib/sample-data'
import type { FirmStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusStyles: Record<FirmStatus, string> = {
  Funded: 'bg-primary text-primary-foreground',
  Passed: 'bg-positive text-positive-foreground',
  Active: 'bg-accent text-accent-foreground',
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function Firms() {
  return (
    <section id="firms" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Credibility"
        title="Firms & challenges passed"
        description="Prop firms where I've cleared evaluations or hold funded accounts."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SAMPLE_FIRMS.map((firm, i) => (
          <Reveal key={firm.id} delay={(i % 4) * 70}>
            <Card className="h-full">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-secondary font-heading text-lg font-semibold text-secondary-foreground">
                  {initials(firm.name)}
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">
                    {firm.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {formatDate(firm.datePassed)}
                  </p>
                </div>
                <Badge className={cn('mt-auto', statusStyles[firm.status])}>
                  {firm.status}
                </Badge>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
