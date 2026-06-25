export type TradeDirection = 'Long' | 'Short'
export type TradeResult = 'Win' | 'Loss' | 'Breakeven'

export interface JournalEntry {
  id: string
  date: string // ISO yyyy-mm-dd
  instrument: string
  direction: TradeDirection
  entry: number
  exit: number
  result: TradeResult
  pnl: number // in account currency ($)
  image?: string
  notes?: string
}

export type AccountType = 'passing' | 'payout'

export interface FundedAccount {
  id: string
  type: AccountType
  firm: string
  accountName: string
  date: string
  amount?: number
  note?: string
  image?: string
}

export type FirmStatus = 'Passed' | 'Active' | 'Funded'

export interface Firm {
  id: string
  name: string
  status: FirmStatus
  datePassed: string
}

export interface Goal {
  id: string
  label: string
  current: number
  target: number
  unit: string
}

export interface Milestone {
  id: string
  date: string
  title: string
  description: string
}
