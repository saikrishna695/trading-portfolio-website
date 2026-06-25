import { PROFILE } from '@/lib/sample-data'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} {PROFILE.name}. Private portfolio.
        </p>
        <p className="text-pretty text-center">
          Past performance is not indicative of future results. For
          informational purposes only.
        </p>
      </div>
    </footer>
  )
}
