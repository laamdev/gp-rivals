import { Suspense } from 'react'
import Image from 'next/image'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriverStats } from '@/components/global/driver-stats'
import { SeasonsNav } from '@/components/legendary-team-rivals/seasons-nav'

import { getLegendaryRivalrySeasonStats } from '@/api/queries'
import { legendaryTeamRivals } from '@/data/legendary-team-rivals'
import { cn } from '@/lib/utils'

interface SeasonStatsProps {
  rivalry: (typeof legendaryTeamRivals)[0]
  yearSlug: string
}
interface LegendaryRivalrySeasonPageProps {
  params: Promise<{ rivalrySlug: string; yearSlug: string }>
}

const Loading = () => {
  return (
    <div className='p-4 text-center'>
      <p>Loading season data...</p>
    </div>
  )
}

const SeasonStats = async ({ rivalry, yearSlug }: SeasonStatsProps) => {
  const result = await getLegendaryRivalrySeasonStats({
    driverOne: rivalry.drivers[0].slug,
    driverTwo: rivalry.drivers[1].slug,
    year: Number(yearSlug)
  })

  if (!result) {
    return (
      <div className='p-4 text-center'>
        <p>No data available for {yearSlug} season</p>
        <p className='mt-2 text-sm text-gray-500'>
          Please try again later or contact support if the issue persists.
        </p>
      </div>
    )
  }

  return (
    <div className='mt-16 flex flex-col gap-y-16'>
      <div>
        <h2 className='text-center text-lg font-bold'>{`${yearSlug} Season Stats`}</h2>
        <div className='mt-8 grid grid-cols-2 gap-x-4 sm:gap-x-8'>
          <DriverStats
            driverNumber={1}
            result={result}
            color={rivalry.primaryColor}
            driver={rivalry.drivers[0].code}
          />
          <DriverStats
            driverNumber={2}
            result={result}
            color={rivalry.secondaryColor}
            driver={rivalry.drivers[1].code}
          />
        </div>
      </div>
    </div>
  )
}

export default async function LegendaryRivalrySeasonPage({
  params
}: LegendaryRivalrySeasonPageProps) {
  const { rivalrySlug, yearSlug } = await params
  const rivalry = legendaryTeamRivals.find(r => r.slug === rivalrySlug)

  if (!rivalry) return null

  return (
    <MaxWidthWrapper>
      <div className='mt-8 grid'>
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

        <SeasonsNav seasons={rivalry.seasons} rivalry={rivalrySlug} />

        <Suspense fallback={<Loading />}>
          <SeasonStats rivalry={rivalry} yearSlug={yearSlug} />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  )
}

export async function generateStaticParams() {
  return legendaryTeamRivals.flatMap(rivalry =>
    rivalry.seasons.map(season => ({
      rivalrySlug: rivalry.slug,
      yearSlug: season.year.toString()
    }))
  )
}
