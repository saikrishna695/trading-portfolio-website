import { PortfolioProvider } from '@/components/portfolio-provider'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { FundedAccounts } from '@/components/sections/funded-accounts'
import { StatsDashboard } from '@/components/sections/stats-dashboard'
import { Firms } from '@/components/sections/firms'
import { Journey } from '@/components/sections/journey'

import { Footer } from '@/components/sections/footer'

export default function Page() {
  return (
    <PortfolioProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <FundedAccounts />
        
        <StatsDashboard />
        <Firms />
        <Journey />
        
      </main>
      <Footer />
    </PortfolioProvider>
  )
}
