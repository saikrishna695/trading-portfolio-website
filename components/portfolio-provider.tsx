'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  deleteAccount: (id: string) => void
  isAdmin: boolean
  unlock: (passcode: string) => boolean
  lock: () => void
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(SAMPLE_JOURNAL)
  const [accounts, setAccounts] = useState<FundedAccount[]>(SAMPLE_ACCOUNTS)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on first render
  useEffect(() => {
    const savedAccounts = loadFromStorage<FundedAccount[]>('portfolio_accounts', SAMPLE_ACCOUNTS)
    const savedEntries = loadFromStorage<JournalEntry[]>('portfolio_entries', SAMPLE_JOURNAL)
    setAccounts(savedAccounts)
    setEntries(savedEntries)
    setHydrated(true)
  }, [])

 // Save accounts to localStorage with debounce
  useEffect(() => {
    if (!hydrated) return
    const timer = setTimeout(() => {
      saveToStorage('portfolio_accounts', accounts)
    }, 500)
    return () => clearTimeout(timer)
  }, [accounts, hydrated])

  // Save entries to localStorage with debounce
  useEffect(() => {
    if (!hydrated) return
    const timer = setTimeout(() => {
      saveToStorage('portfolio_entries', entries)
    }, 500)
    return () => clearTimeout(timer)
  }, [entries, hydrated])

  const addEntry = useCallback((entry: Omit<JournalEntry, 'id'>) => {
    setEntries((prev) => [{ ...entry, id: `j-${Date.now()}` }, ...prev])
  }, [])

  const addAccount = useCallback((account: Omit<FundedAccount, 'id'>) => {
    setAccounts((prev) => [{ ...account, id: `a-${Date.now()}` }, ...prev])
  }, [])

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const unlock = useCallback((passcode: string) => {
    const ok = passcode === ADMIN_PASSCODE
    if (ok) setIsAdmin(true)
    return ok
  }, [])

  const lock = useCallback(() => setIsAdmin(false), [])

  const value = useMemo(
    () => ({ entries, accounts, addEntry, addAccount, deleteAccount, isAdmin, unlock, lock }),
    [entries, accounts, addEntry, addAccount, deleteAccount, isAdmin, unlock, lock],
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