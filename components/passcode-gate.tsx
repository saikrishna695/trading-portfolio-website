'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePortfolio } from '@/components/portfolio-provider'

export function PasscodeGate({ onUnlocked }: { onUnlocked?: () => void }) {
  const { unlock } = usePortfolio()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (unlock(value)) {
      setError(false)
      onUnlocked?.()
    } else {
      setError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg bg-secondary p-4 text-secondary-foreground">
        <Lock className="size-5 shrink-0" aria-hidden="true" />
        <p className="text-sm leading-relaxed">
          Adding entries and uploads is passcode protected. Enter your passcode
          to continue.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="passcode">Passcode</Label>
        <Input
          id="passcode"
          type="password"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Enter passcode"
          aria-invalid={error}
        />
        {error ? (
          <p className="text-sm text-destructive">
            Incorrect passcode. Please try again.
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full">
        Unlock
      </Button>
    </form>
  )
}
