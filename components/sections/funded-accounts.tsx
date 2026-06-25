'use client'

import { useMemo, useState } from 'react'
import { FileText, Plus, Upload } from 'lucide-react'
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
import type { AccountType, FundedAccount } from '@/lib/types'
import { formatCurrency } from '@/lib/stats'
import { cn } from '@/lib/utils'

type FilterKey = 'all' | 'passing' | 'payout'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'passing', label: 'Passing Accounts' },
  { key: 'payout', label: 'Payouts' },
]

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function FundedAccounts() {
  const { accounts } = usePortfolio()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [preview, setPreview] = useState<FundedAccount | null>(null)

  const filtered = useMemo(
    () =>
      accounts.filter((a) => (filter === 'all' ? true : a.type === filter)),
    [accounts, filter],
  )

  return (
    <section
      id="accounts"
      className="border-y border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Proof of Results"
            title="Funded accounts & payouts"
            description="Verified screenshots and certificates from passed evaluations and approved payouts."
          />
          <Reveal>
            <AddAccountDialog />
          </Reveal>
        </div>

        <Reveal className="mt-8">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  filter === f.key
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <Reveal className="mt-10">
            <p className="text-muted-foreground">No items in this category yet.</p>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((account, i) => (
              <Reveal key={account.id} delay={(i % 3) * 70}>
                <Card className="group h-full overflow-hidden p-0">
                  <button
                    type="button"
                    onClick={() => account.image && setPreview(account)}
                    className="block w-full text-left"
                    aria-label={`View ${account.firm} ${account.accountName}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {account.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={account.image || '/placeholder.svg'}
                          alt={`${account.firm} ${account.accountName} proof`}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <FileText
                            className="size-10 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <Badge
                        className={cn(
                          'absolute left-3 top-3 capitalize',
                          account.type === 'payout'
                            ? 'bg-positive text-positive-foreground'
                            : 'bg-primary text-primary-foreground',
                        )}
                      >
                        {account.type === 'payout' ? 'Payout' : 'Passed'}
                      </Badge>
                    </div>
                  </button>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading font-semibold text-foreground">
                          {account.firm}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {account.accountName}
                        </p>
                      </div>
                      {typeof account.amount === 'number' ? (
                        <span className="font-heading text-lg font-semibold text-primary">
                          {formatCurrency(account.amount)}
                        </span>
                      ) : null}
                    </div>
                    {account.note ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {account.note}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {formatDate(account.date)}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {preview?.firm} — {preview?.accountName}
            </DialogTitle>
            <DialogDescription>
              {preview ? formatDate(preview.date) : ''}
            </DialogDescription>
          </DialogHeader>
          {preview?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.image || '/placeholder.svg'}
              alt={`${preview.firm} proof`}
              className="w-full rounded-lg border border-border"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function AddAccountDialog() {
  const { addAccount, isAdmin } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<AccountType>('passing')
  const [firm, setFirm] = useState('')
  const [accountName, setAccountName] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [image, setImage] = useState<string | undefined>(undefined)
  const [fileName, setFileName] = useState('')

  function reset() {
    setType('passing')
    setFirm('')
    setAccountName('')
    setDate('')
    setAmount('')
    setNote('')
    setImage(undefined)
    setFileName('')
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setImage(undefined)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addAccount({
      type,
      firm: firm.trim() || 'Prop Firm',
      accountName: accountName.trim() || 'Account',
      date: date || new Date().toISOString().slice(0, 10),
      amount: amount ? Number(amount) : undefined,
      note: note.trim() || undefined,
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
        <Button variant="outline">
          <Plus className="size-4" aria-hidden="true" />
          Add proof
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {!isAdmin ? (
          <>
            <DialogHeader>
              <DialogTitle>Add proof</DialogTitle>
              <DialogDescription>Unlock to upload a new item.</DialogDescription>
            </DialogHeader>
            <PasscodeGate />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add proof of results</DialogTitle>
              <DialogDescription>
                Upload a passing screenshot, certificate, or payout proof.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as AccountType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passing">Passing account</SelectItem>
                    <SelectItem value="payout">Payout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firm">Firm</Label>
                  <Input
                    id="firm"
                    value={firm}
                    onChange={(e) => setFirm(e.target.value)}
                    placeholder="Apex Capital"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account name</Label>
                  <Input
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="100K Evaluation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc-date">Date</Label>
                  <Input
                    id="acc-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($, optional)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Short context about this result"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-file">Screenshot or PDF</Label>
                <label
                  htmlFor="acc-file"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <Upload className="size-4" aria-hidden="true" />
                  {fileName || 'Choose a file to upload'}
                </label>
                <Input
                  id="acc-file"
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
              <Button type="submit" className="w-full">
                Save proof
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
