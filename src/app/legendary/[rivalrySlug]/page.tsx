import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { RaceDriverStats } from '@/components/global/race-driver-stats'
import { PrivateResultType } from '@prisma/client/runtime/library'
import { DriverStats } from '@/components/global/driver-stats'

import {
  getDriversRaceStats,
  getLegendaryRivalryOverallResults,
  getSeasonRaces
} from '@/lib/fetchers'
import { legendaryTeamRivals } from '@/data/legendary-team-rivals'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SeasonsNav } from '@/components/legendary-team-rivals/seasons-nav'

interface TeamSeasonGpPageProps {
  params: Promise<{
    rivalrySlug: string
  }>
}

export default async function LegendaryRivalryPage({
  params
}: TeamSeasonGpPageProps) {
  const { rivalrySlug } = await params

  const rivalry = legendaryTeamRivals.find(r => r.slug === rivalrySlug)

  if (!rivalry) {
    return null
  }

  const data = await getLegendaryRivalryOverallResults(rivalry)

  return (
    <MaxWidthWrapper>
      <section className='flex items-center justify-between bg-card'>
        <Image
          src={rivalry.drivers[0].pictureUrl}
          alt={`${rivalry.drivers[0].firstName} ${rivalry.drivers[0].lastName}`}
          width={560}
          height={560}
          className={cn(
            'w-24 transform rounded-l-xl duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />

        <div className='flex flex-col items-center'>
          <h2 className='font-mono text-sm font-medium uppercase tracking-wider text-zinc-100'>{`${rivalry.team} •︎ ${rivalry.seasons.length} ${rivalry.seasons.length <= 1 ? 'Season' : 'Seasons'}`}</h2>
          <h1 className='mt-2.5 text-center font-serif text-sm md:text-5xl'>{`${rivalry.drivers[0].lastName ?? ''} vs ${rivalry.drivers[1].lastName ?? ''}`}</h1>
        </div>

        <Image
          src={rivalry.drivers[1].pictureUrl}
          alt={`${rivalry.drivers[1].firstName} ${rivalry.drivers[1].lastName}`}
          width={560}
          height={560}
          className={cn(
            'w-24 rounded-r-xl duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />
      </section>

      <SeasonsNav seasons={rivalry.seasons} rivalry={rivalry.slug} />

      {/* <div className='mt-16 flex flex-col gap-y-16'>
        <div>
          <h2 className='text-center text-lg font-bold'>{`${seasonSlug} ${result.raceName} Stats`}</h2>
          <div className='mt-8 grid grid-cols-2 gap-x-4 sm:gap-x-8'>
            <DriverStats
              driverNumber={1}
              result={result}
              color={team.primaryColor}
              driver={team.drivers[0].code}
              mode='race'
            />
            <DriverStats
              driverNumber={2}
              result={result}
              color={team.secondaryColor}
              driver={team.drivers[1].code}
              mode='race'
            />
          </div>
        </div>
      </div> */}
    </MaxWidthWrapper>
  )
}
