'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  ADMIN_PASSCODE,
  SAMPLE_ACCOUNTS,
  SAMPLE_JOURNAL,
} from '@/lib/sample-data'
import type { FundedAccount, JournalEntry } from '@/lib/types'

interface PortfolioContextValue {
  entries: JournalEntry[]
  accounts: FundedAccount[]
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void
  addAccount: (account: Omit<FundedAccount, 'id'>) => void
  isAdmin: boolean
  unlock: (passcode: string) => boolean
  lock: () => void
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(SAMPLE_JOURNAL)
  const [accounts, setAccounts] = useState<FundedAccount[]>(SAMPLE_ACCOUNTS)
  const [isAdmin, setIsAdmin] = useState(false)

  const addEntry = useCallback((entry: Omit<JournalEntry, 'id'>) => {
    setEntries((prev) => [{ ...entry, id: `j-${Date.now()}` }, ...prev])
  }, [])

  const addAccount = useCallback((account: Omit<FundedAccount, 'id'>) => {
    setAccounts((prev) => [{ ...account, id: `a-${Date.now()}` }, ...prev])
  }, [])

  const unlock = useCallback((passcode: string) => {
    const ok = passcode === ADMIN_PASSCODE
    if (ok) setIsAdmin(true)
    return ok
  }, [])

  const lock = useCallback(() => setIsAdmin(false), [])

  const value = useMemo(
    () => ({ entries, accounts, addEntry, addAccount, isAdmin, unlock, lock }),
    [entries, accounts, addEntry, addAccount, isAdmin, unlock, lock],
  )

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return ctx
}
