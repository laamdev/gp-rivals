import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriverStats } from '@/components/global/driver-stats'

import { seasons } from '@/data/seasons'
import {
  getDriversRaceStats,
  getSeasonRaces,
  getTeamRaceResult
} from '@/api/queries'
import { Race } from '@/api/types'
import { SectionHeading } from '@/components/global/section-heading'
import { GPStats } from '@/components/global/gp-stats'

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

  const raceResult = await getTeamRaceResult({
    season: seasonSlug,
    round: gpSlug,
    team: teamSlug
  })

  const team = seasons
    .find(season => season.year === Number(seasonSlug))
    ?.teams.find(team => team.slug === teamSlug)
  if (!team) {
    return null
  }
  // const result = await getDriversRaceStats({
  //   season: seasonSlug,
  //   circuit: gpSlug,
  //   driverOne: team.drivers[0].slug,
  //   driverTwo: team.drivers[1].slug
  // })

  console.log(JSON.stringify(raceResult, null, 2), 'XXXXXXXX')

  return (
    <MaxWidthWrapper>
      <section className='mt-8 grid'>
        <DriversHeader
          team={team}
          season={seasonSlug}
          raceName={raceResult?.raceName}
        />
        <SeasonRacesNav teamSlug={teamSlug} seasonSlug={seasonSlug} />
      </section>
      <div className='mt-16 flex flex-col gap-y-16'>
        <div>
          <SectionHeading>
            {`${seasonSlug} ${raceResult?.raceName} Stats`}
          </SectionHeading>

          <div className='mt-8 grid grid-cols-2 gap-x-4 sm:gap-x-8'>
            <GPStats
              grid={raceResult?.results[0]?.grid}
              position={raceResult?.results[0]?.position}
              points={raceResult?.results[0]?.points}
              laps={raceResult?.results[0]?.laps}
              status={raceResult?.results[0]?.status}
              fastestLapRank={raceResult?.results[0]?.FastestLap?.rank}
              fastestLapTime={raceResult?.results[0]?.FastestLap?.Time?.time}
              fastestLapSpeed={
                raceResult?.results[0]?.FastestLap?.AverageSpeed?.speed
              }
              fastestLapNumber={raceResult?.results[0]?.FastestLap?.lap}
              timeDelta={raceResult?.results[0]?.Time?.time}
              color={team.primaryColor}
              driver={team.drivers[0].code}
              teammateGrid={raceResult?.results[1]?.grid}
              teammatePosition={raceResult?.results[1]?.position}
              teammatePoints={raceResult?.results[1]?.points}
              teammateLaps={raceResult?.results[1]?.laps}
              teammateFastestLapRank={raceResult?.results[1]?.FastestLap?.rank}
              teammateFastestLapTime={
                raceResult?.results[1]?.FastestLap?.Time?.time
              }
              teammateFastestLapSpeed={
                raceResult?.results[1]?.FastestLap?.AverageSpeed?.speed
              }
              teammateFastestLapNumber={raceResult?.results[1]?.FastestLap?.lap}
              teammateTimeDelta={raceResult?.results[1]?.Time?.time}
              teammateStatus={raceResult?.results[1]?.status}
            />
            <GPStats
              grid={raceResult?.results[1]?.grid}
              position={raceResult?.results[1]?.position}
              points={raceResult?.results[1]?.points}
              laps={raceResult?.results[1]?.laps}
              status={raceResult?.results[1]?.status}
              fastestLapRank={raceResult?.results[1]?.FastestLap?.rank}
              fastestLapTime={raceResult?.results[1]?.FastestLap?.Time?.time}
              fastestLapSpeed={
                raceResult?.results[1]?.FastestLap?.AverageSpeed?.speed
              }
              fastestLapNumber={raceResult?.results[1]?.FastestLap?.lap}
              timeDelta={raceResult?.results[1]?.Time?.time}
              color={team.secondaryColor}
              driver={team.drivers[1].code}
              teammateGrid={raceResult?.results[0]?.grid}
              teammatePosition={raceResult?.results[0]?.position}
              teammatePoints={raceResult?.results[0]?.points}
              teammateLaps={raceResult?.results[0]?.laps}
              teammateFastestLapRank={raceResult?.results[0]?.FastestLap?.rank}
              teammateFastestLapTime={
                raceResult?.results[0]?.FastestLap?.Time?.time
              }
              teammateFastestLapSpeed={
                raceResult?.results[0]?.FastestLap?.AverageSpeed?.speed
              }
              teammateFastestLapNumber={raceResult?.results[0]?.FastestLap?.lap}
              teammateTimeDelta={raceResult?.results[0]?.Time?.time}
              teammateStatus={raceResult?.results[0]?.status}
            />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
