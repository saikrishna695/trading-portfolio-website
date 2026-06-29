import type {
  FundedAccount,
  Firm,
  Goal,
  JournalEntry,
  Milestone,
} from './types'

// ---------------------------------------------------------------------------
// EDIT ME: This is placeholder content. Swap names, links, and numbers freely.
// ---------------------------------------------------------------------------

export const PROFILE = {
  name: 'Sai Krishna',
  tagline: 'Consistently Funded. Disciplined Trader.',
  bio: 'Forex trader specializing in funded prop-firm accounts. Three years building a process-driven approach to the markets, with a focus on capital preservation and repeatable execution across major and minor pairs.',
  email: 'you@example.com',
  socials: {
    linkedin: 'https://linkedin.com/in/your-handle',
    twitter: 'https://x.com/your-handle',
    discord: 'https://discord.com/users/your-id',
  },
}

// Passcode that unlocks "admin mode" for adding entries and uploads.
// EDIT ME: change this to your own passcode.
export const ADMIN_PASSCODE = 'trader2026'

export const SAMPLE_JOURNAL: JournalEntry[] = [
  {
    id: 'j1',
    date: '2025-05-12',
    instrument: 'EUR/USD',
    direction: 'Long',
    entry: 1.0842,
    exit: 1.0931,
    result: 'Win',
    pnl: 1240,
    image: '/images/chart-eurusd.png',
    notes:
      'Clean break of the London session high with strong follow-through. Scaled out at the daily resistance. Patience on the entry paid off.',
  },
  {
    id: 'j2',
    date: '2025-05-19',
    instrument: 'GBP/JPY',
    direction: 'Short',
    entry: 188.42,
    exit: 187.1,
    result: 'Win',
    pnl: 960,
    image: '/images/chart-gbpjpy.png',
    notes:
      'Rejection from the weekly supply zone aligned with a bearish New York open. Took partials at the first target and trailed the rest.',
  },
  {
    id: 'j3',
    date: '2025-05-23',
    instrument: 'XAU/USD',
    direction: 'Long',
    entry: 2318.5,
    exit: 2311.2,
    result: 'Loss',
    pnl: -430,
    notes:
      'Entered too early ahead of news. Stop hit on the spike. Lesson: avoid holding through high-impact releases without a defined plan.',
  },
  {
    id: 'j4',
    date: '2025-06-04',
    instrument: 'EUR/USD',
    direction: 'Short',
    entry: 1.0895,
    exit: 1.0895,
    result: 'Breakeven',
    pnl: 0,
    notes:
      'Moved stop to entry after the first push lower. Price returned and tapped breakeven. Protected capital, no regrets.',
  },
  {
    id: 'j5',
    date: '2025-06-11',
    instrument: 'USD/JPY',
    direction: 'Long',
    entry: 156.2,
    exit: 157.4,
    result: 'Win',
    pnl: 1510,
    notes:
      'Trend continuation off the 4H demand. Risk kept at 0.75% and let the runner work into the close.',
  },
]

export const SAMPLE_ACCOUNTS: FundedAccount[] = [
  {
    id: 'a1',
    type: 'passing',
    firm: 'Apex Capital',
    accountName: '100K Evaluation',
    date: '2025-04-28',
    amount: 100000,
    note: 'Passed phase two with a 9.4% return and zero drawdown breaches.',
    image: '/images/proof-passing.png',
  },
  {
    id: 'a2',
    type: 'payout',
    firm: 'Apex Capital',
    accountName: '100K Funded',
    date: '2025-06-02',
    amount: 4820,
    note: 'First payout from the funded account. Withdrawal approved within 24 hours.',
    image: '/images/proof-payout.png',
  },
]

export const SAMPLE_FIRMS: Firm[] = [
  { id: 'f1', name: 'FundedFirm', status: 'Funded', datePassed: '2025-04-28' },
]

export const SAMPLE_GOALS: Goal[] = [
  { id: 'g2', label: 'payout target', current: 0, target: 100000, unit: '$' },
]

export const SAMPLE_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    date: '2025-02-10',
    title: 'First evaluation passed',
    description: 'Cleared an FTMO challenge — the first proof the process works.',
  },
  {
    id: 'm2',
    date: '2025-04-28',
    title: 'First funded account',
    description: 'Funded with $100K at Apex Capital after a clean evaluation.',
  },
  {
    id: 'm3',
    date: '2025-06-02',
    title: 'First payout received',
    description: 'Withdrew the first profit split from a funded account.',
  },
]

export const WATCHLIST = [
  'XAU/USD',
]

export const RISK_RULES = [
  { label: 'Risk per trade', value: '1%' },
  { label: 'Max daily loss', value: '3%' },
  { label: 'Minimum reward:risk', value: '1 : 3' },
  { label: 'Max open positions', value: '1' },
]

export const TRADING_PLAN = [
  'Only trade in the direction of the prevailing trend.',
  'Wait patiently for price to reach a key level before considering an entry.',
  'Always enter on a pullback — never chase price.',
  'Maximum two trades per day, no exceptions.',
  'Avoid entries in the middle of a range or between key levels.',
  'Stop trading immediately after hitting the daily loss limit.',
]

export const RESOURCES = [
  { label: 'Platform', value: 'MetaTrader 5 / TradingView' },
  { label: 'Prop firms', value: 'Apex Capital, FTMO, The5ers' },
  { label: 'Analysis', value: 'Smart money concepts, supply & demand' },
  { label: 'Journaling', value: 'This site + spreadsheet backup' },
]
