'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { usePortfolio } from '@/components/portfolio-provider'

export function StatsDashboard() {
  const { accounts } = usePortfolio()

  const totalPayouts = useMemo(
    () =>
      accounts
        .filter((a) => a.type === 'payout')
        .reduce((sum, a) => sum + a.amount, 0),
    [accounts],
  )

  const payoutCount = useMemo(
    () => accounts.filter((a) => a.type === 'payout').length,
    [accounts],
  )

  return (
    <section id="stats" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          eyebrow="Performance"
          title="Total Payouts"
          description="Running total of all payouts received from funded accounts."
        />

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <Reveal>
            <Card className="w-72 text-center">
              <CardHeader>
                <CardTitle className="font-heading text-muted-foreground text-sm uppercase tracking-wide">
                  Total Payout Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-primary">
                  ${totalPayouts.toLocaleString('en-US')}
                </p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={80}>
            <Card className="w-72 text-center">
              <CardHeader>
                <CardTitle className="font-heading text-muted-foreground text-sm uppercase tracking-wide">
                  Number of Payouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-primary">
                  {payoutCount}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}