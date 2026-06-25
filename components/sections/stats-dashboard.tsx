'use client'

import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { usePortfolio } from '@/components/portfolio-provider'
import {
  computeSummary,
  cumulativePnl,
  formatCurrency,
  pnlByInstrument,
  pnlByMonth,
} from '@/lib/stats'

const pnlConfig = {
  pnl: { label: 'Cumulative P&L', color: 'var(--chart-1)' },
} satisfies ChartConfig

const monthConfig = {
  pnl: { label: 'Monthly P&L', color: 'var(--chart-1)' },
} satisfies ChartConfig

const pairConfig = {
  pnl: { label: 'P&L', color: 'var(--chart-1)' },
} satisfies ChartConfig

const wlConfig = {
  Win: { label: 'Wins', color: 'var(--chart-3)' },
  Loss: { label: 'Losses', color: 'var(--chart-4)' },
  Breakeven: { label: 'Breakeven', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function StatsDashboard() {
  const { entries } = usePortfolio()
  const summary = useMemo(() => computeSummary(entries), [entries])
  const equity = useMemo(() => cumulativePnl(entries), [entries])
  const byPair = useMemo(() => pnlByInstrument(entries), [entries])
  const byMonth = useMemo(() => pnlByMonth(entries), [entries])

  const wlData = useMemo(
    () => [
      { name: 'Win', value: summary.wins, fill: 'var(--chart-3)' },
      { name: 'Loss', value: summary.losses, fill: 'var(--chart-4)' },
      { name: 'Breakeven', value: summary.breakeven, fill: 'var(--chart-2)' },
    ],
    [summary],
  )

  return (
    <section
      id="stats"
      className="border-y border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          eyebrow="Performance"
          title="Stats & performance dashboard"
          description="Live charts calculated directly from the journal entries above."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-heading">Cumulative P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={pnlConfig} className="h-64 w-full">
                  <AreaChart data={equity} margin={{ left: 4, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="fillPnl" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={48}
                      fontSize={12}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                      }
                    />
                    <Area
                      dataKey="pnl"
                      type="monotone"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      fill="url(#fillPnl)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={80}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-heading">Win / Loss ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={wlConfig}
                  className="mx-auto h-64 w-full"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={wlData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={95}
                      strokeWidth={2}
                    >
                      {wlData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm">
                  <Legend label="Wins" value={summary.wins} color="var(--chart-3)" />
                  <Legend label="Losses" value={summary.losses} color="var(--chart-4)" />
                  <Legend
                    label="Breakeven"
                    value={summary.breakeven}
                    color="var(--chart-2)"
                  />
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-heading">
                  P&L by instrument
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={pairConfig} className="h-64 w-full">
                  <BarChart
                    data={byPair}
                    layout="vertical"
                    margin={{ left: 8, right: 16 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="instrument"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={72}
                      fontSize={12}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                      }
                    />
                    <Bar dataKey="pnl" radius={4}>
                      {byPair.map((d) => (
                        <Cell
                          key={d.instrument}
                          fill={d.pnl >= 0 ? 'var(--chart-1)' : 'var(--chart-4)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={80}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-heading">Monthly P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={monthConfig} className="h-64 w-full">
                  <BarChart data={byMonth} margin={{ left: 4, right: 8, top: 8 }}>
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={48}
                      fontSize={12}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                      }
                    />
                    <Bar dataKey="pnl" radius={4}>
                      {byMonth.map((d) => (
                        <Cell
                          key={d.key}
                          fill={d.pnl >= 0 ? 'var(--chart-1)' : 'var(--chart-4)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Legend({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <span className="flex items-center gap-2 text-muted-foreground">
      <span
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
      <span className="font-medium text-foreground">{value}</span>
    </span>
  )
}
