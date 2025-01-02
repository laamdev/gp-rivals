import { MainHeader } from '@/components/global/main-header'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriverCard } from '@/components/legendary/driver-card'

import { legendaryTeamRivals } from '@/data/legendary-team-rivals'

export default async function LegendaryRivalriesPage() {
  return (
    <MaxWidthWrapper>
      <MainHeader
        heading='Legendary'
        summary='Explore how these legendary drivers matched up when they shared the same car, and relive the moments that defined their epic battles on the track.'
      />
      <div className='mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {legendaryTeamRivals.map((team, idx) => (
          <DriverCard key={idx} team={team} />
        ))}
      </div>
    </MaxWidthWrapper>
  )
}
