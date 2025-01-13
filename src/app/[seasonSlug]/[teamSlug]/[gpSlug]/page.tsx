import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriverStats } from '@/components/global/driver-stats'

import { seasons } from '@/data/seasons'
import { getDriversRaceStats, getSeasonRaces } from '@/api/queries'
import { Race } from '@/api/types'

interface TeamSeasonGpPageProps {
  params: Promise<{
    seasonSlug: string
    teamSlug: string
    gpSlug: string
  }>
}

export async function generateStaticParams(): Promise<
  { seasonSlug: string; teamSlug: string; gpSlug: string }[]
> {
  const params: { seasonSlug: string; teamSlug: string; gpSlug: string }[] = []
  for (const season of seasons) {
    for (const team of season.teams) {
      const races = await getSeasonRaces(season.year.toString())
      if (races?.seasonRaces) {
        for (const race of races.seasonRaces as Race[]) {
          params.push({
            seasonSlug: season.year.toString(),
            teamSlug: team.slug,
            gpSlug: race.Circuit.circuitId
          })
        }
      }
    }
  }
  return params
}

export default async function TeamSeasonGpPage({
  params
}: TeamSeasonGpPageProps) {
  const { seasonSlug, teamSlug, gpSlug } = await params

  const team = await (async () => {
    const season = seasons.find(season => season.year === Number(seasonSlug))
    if (!season) {
      throw new Error(`Season ${seasonSlug} not found`)
    }

    const team = season.teams.find(team => team.slug === teamSlug)
    if (!team) {
      throw new Error(`Team ${teamSlug} not found in season ${seasonSlug}`)
    }

    return team
  })()

  if (!team) {
    return null
  }

  const racesResult = await getSeasonRaces(seasonSlug)

  if (!racesResult) {
    return null
  }

  const { seasonRaces } = racesResult

  const result = await getDriversRaceStats({
    season: seasonSlug,
    circuit: gpSlug,
    driverOne: team.drivers[0].slug,
    driverTwo: team.drivers[1].slug
  })

  if (!result) {
    return <div>No data available</div>
  }

  return (
    <MaxWidthWrapper>
      <section className='mt-8 grid'>
        <DriversHeader
          team={team}
          season={seasonSlug}
          raceName={result.raceName}
        />
        <SeasonRacesNav teamSlug={teamSlug} seasonSlug={seasonSlug} />
      </section>

      <div className='mt-16 flex flex-col gap-y-16'>
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
      </div>
    </MaxWidthWrapper>
  )
}
