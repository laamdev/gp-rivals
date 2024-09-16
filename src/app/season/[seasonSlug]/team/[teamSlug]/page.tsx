import { Metadata, ResolvingMetadata } from 'next'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { PointsPercentagePie } from '@/components/charts/points-percentage-pie'
import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { RaceStatCard } from '@/components/global/race-stat-card'
import { RaceStatContainer } from '@/components/global/race-stat-container'

import { getAllDriversPoints, getTeamMembership } from '@/lib/fetchers'
interface TeamSeasonPageProps {
  params: {
    seasonSlug: string
    teamSlug: string
  }
}

export async function generateMetadata(
  { params }: TeamSeasonPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { seasonSlug, teamSlug } = params

  const teamMembership = await getTeamMembership({
    teamName: String(teamSlug.split('-').join(' ')),
    year: Number(seasonSlug)
  })

  return {
    title: `${teamMembership[0].team.name} ${teamMembership[0].season.year} F1 Season`
  }
}

export default async function TeamSeasonPage({ params }: TeamSeasonPageProps) {
  const { seasonSlug, teamSlug } = params

  const x = await getAllDriversPoints({
    year: Number(seasonSlug)
  })

  const teamMembership = await getTeamMembership({
    teamName: String(teamSlug.split('-').join(' ')),
    year: Number(seasonSlug)
  })

  if (!teamMembership) {
    return null
  }

  const drivers = teamMembership.map(driverMembership => {
    let totalPosition = 0
    let totalPolePosition = 0
    let totalSprintShootout = 0
    let totalSprint = 0
    let totalTimeInRace = 0
    let totalFastestLap = 0
    let totalResults = driverMembership.raceResults.length
    let totalPoints = 0
    let wins = 0
    let podiums = 0

    driverMembership.raceResults.forEach((result: any) => {
      totalPosition += result.position
      totalPolePosition += result.polePosition
      totalSprintShootout += result.sprintShootout ?? 0
      totalSprint += result.sprint ?? 0
      totalTimeInRace += result.timeInRace
      totalFastestLap += result.fastestLap
      totalPoints += result.points + result.sprintPoints

      // Count wins and podiums
      if (result.position === 1) {
        wins += 1
        podiums += 1
      } else if (result.position === 2 || result.position === 3) {
        podiums += 1
      }
    })

    let averagePosition = (totalPosition / totalResults).toFixed(2)
    let averagePolePosition = totalPolePosition / totalResults
    let averageSprintShootout = totalSprintShootout / totalResults
    let averageSprint = totalSprint / totalResults
    let averageTimeInRace = totalTimeInRace / totalResults
    let averageFastestLap = totalFastestLap / totalResults

    return {
      name: driverMembership.driver.lastName,
      code: driverMembership.driver.nameId,
      image: driverMembership.driver.pictureUrl,
      driverId: driverMembership.id,
      averagePosition,
      averagePolePosition,
      averageSprintShootout,
      averageSprint,
      averageTimeInRace,
      averageFastestLap,
      totalPoints,
      wins,
      podiums
    }
  })

  // Calculate H2H for race positions and qualifying

  let raceH2H = { driverA: 0, driverB: 0 }
  let qualyH2H = { driverA: 0, driverB: 0 }

  const driverAResults = teamMembership[0].raceResults
  const driverBResults = teamMembership[1].raceResults

  driverAResults.forEach((resultA: any, index: number) => {
    const resultB = driverBResults[index]

    if (
      resultA.qualifyingPosition < resultB.qualifyingPosition! ||
      resultB.qualifyingPosition === null
    ) {
      qualyH2H.driverA += 1
    } else if (
      resultA.qualifyingPosition > resultB.qualifyingPosition ||
      resultA.qualifyingPosition === null
    ) {
      qualyH2H.driverB += 1
    }

    if (resultA.position < resultB.position! || resultB.position === null) {
      raceH2H.driverA += 1
    } else if (
      resultA.position > resultB.position ||
      resultA.position === null
    ) {
      raceH2H.driverB += 1
    }
  })

  // Calculate team wins and podiums
  const teamWins = drivers[0].wins + drivers[1].wins
  const teamPodiums = drivers[0].podiums + drivers[1].podiums

  return (
    <MaxWidthWrapper>
      <div className='mt-8 grid'>
        <DriversHeader teamMembership={teamMembership} drivers={drivers} />

        <SeasonRacesNav seasonSlug={seasonSlug} teamSlug={teamSlug} />

        <div className='mt-10 flex flex-col gap-y-10'>
          <RaceStatContainer
            label={`${seasonSlug} Team Stats`}
            className='grid-cols-2 md:grid-cols-4'
          >
            <RaceStatCard label='Standing' value={1} />
            <RaceStatCard label='Wins' value={teamWins} />
            <RaceStatCard label='Podiums' value={teamPodiums} />
            <RaceStatCard
              label='Points'
              value={drivers[0].totalPoints + drivers[1].totalPoints}
            />
          </RaceStatContainer>

          <div>
            <RaceStatContainer
              label={`${seasonSlug} Drivers Stats`}
              className='grid-cols-1 gap-x-10 md:grid-cols-2'
            >
              <div className='col-span-1 grid grid-cols-2 md:grid-cols-4'>
                <RaceStatCard
                  label='Standing'
                  value={drivers[0].averagePosition}
                  className='rounded-b-none rounded-r-none border-r-0'
                />
                <RaceStatCard
                  label='Wins'
                  value={drivers[0].wins}
                  className='rounded-b-none rounded-l-none rounded-r-none rounded-tr-lg border md:rounded-tr-none md:border-r-0'
                />
                <RaceStatCard
                  label='Podiums'
                  value={drivers[0].podiums}
                  className='rounded-b-none rounded-l-none rounded-r-none border border-r-0 border-t-0 md:border-t'
                />
                <RaceStatCard
                  label='Points'
                  value={drivers[0].totalPoints}
                  className='rounded-b-none rounded-l-none rounded-tr-none border border-t-0 md:rounded-tr-lg md:border-t'
                />
                <div
                  className='col-span-2 rounded-b-lg border-b border-l border-r p-2.5 text-center font-bold md:col-span-4'
                  style={{ backgroundColor: teamMembership[0].team.color }}
                >
                  {drivers[0].code}
                </div>
              </div>

              <div className='col-span-1 grid grid-cols-2 md:grid-cols-4'>
                <RaceStatCard
                  label='Standing'
                  value={1}
                  className='rounded-b-none rounded-r-none border-r-0'
                />
                <RaceStatCard
                  label='Wins'
                  value={drivers[1].wins}
                  className='rounded-b-none rounded-l-none rounded-r-none rounded-tr-lg border md:rounded-tr-none md:border-r-0'
                />
                <RaceStatCard
                  label='Podiums'
                  value={drivers[1].podiums}
                  className='rounded-b-none rounded-l-none rounded-r-none border border-r-0 border-t-0 md:border-t'
                />
                <RaceStatCard
                  label='Points'
                  value={drivers[1].totalPoints}
                  className='rounded-b-none rounded-l-none rounded-tr-none border border-t-0 md:rounded-tr-lg md:border-t'
                />
                <div
                  className='col-span-2 rounded-b-lg border-b border-l border-r p-2.5 text-center font-bold md:col-span-4'
                  style={{
                    backgroundColor: teamMembership[0].team.secondaryColor
                  }}
                >
                  {drivers[1].code}
                </div>
              </div>
            </RaceStatContainer>
          </div>

          <RaceStatContainer
            label={`H2H`}
            className='grid-cols-1 gap-x-10 md:grid-cols-2'
          >
            <div className='col-span-1 grid grid-cols-2'>
              <RaceStatCard
                label='Race'
                value={raceH2H.driverA}
                className='rounded-r-none border-r-0'
              />
              <RaceStatCard
                label='Qualifying'
                value={qualyH2H.driverA}
                className='rounded-l-none border'
              />
              <div
                className='col-span-4 rounded-b-lg border-b border-l border-r p-2.5 text-center font-bold'
                style={{
                  backgroundColor: teamMembership[0].team.color
                }}
              >
                {drivers[0].code}
              </div>
            </div>

            <div className='col-span-1 grid grid-cols-2'>
              <RaceStatCard
                label='Race'
                value={raceH2H.driverB}
                className='rounded-r-none border-r-0'
              />
              <RaceStatCard
                label='Qualifying'
                value={qualyH2H.driverB}
                className='rounded-l-none border'
              />
              <div
                className='col-span-4 rounded-b-lg border-b border-l border-r p-2.5 text-center font-bold'
                style={{
                  backgroundColor: teamMembership[0].team.secondaryColor
                }}
              >
                {drivers[1].code}
              </div>
            </div>
          </RaceStatContainer>

          <RaceStatContainer
            label={`Season Visualizations`}
            className='grid-cols-1 gap-x-10 md:grid-cols-2'
          >
            <PointsPercentagePie
              teamName={teamMembership[0].team.name}
              teammateAPoints={drivers[0].totalPoints}
              teammateBPoints={drivers[1].totalPoints}
              teammateAName={drivers[0].name}
              teammateBName={drivers[1].name}
              year={Number(seasonSlug)}
              color={teamMembership[0].team.color}
              secondaryColor={teamMembership[0].team.secondaryColor}
            />
          </RaceStatContainer>

          {/* <SeasonRadarChart
              teammateAPoints={drivers[0].totalPoints}
              teammateBPoints={drivers[1].totalPoints}
              teammateAName={drivers[0].name}
              teammateBName={drivers[1].name}
              year={Number(seasonSlug)}
              color={teamMembership[0].team.color}
              secondaryColor={teamMembership[0].team.secondaryColor}
            /> */}
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
