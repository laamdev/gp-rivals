import { Metadata, ResolvingMetadata } from 'next'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { PointsPercentagePie } from '@/components/charts/points-percentage-pie'
import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { SeasonRadarChart } from '@/components/charts/season-radar-chart'

import { getTeamMembership } from '@/lib/fetchers'
import { calculatePoints } from '@/lib/utils'

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

    driverMembership.raceResults.forEach((result: any) => {
      totalPosition += result.position
      totalPolePosition += result.polePosition
      totalSprintShootout += result.sprintShootout ?? 0
      totalSprint += result.sprint ?? 0
      totalTimeInRace += result.timeInRace
      totalFastestLap += result.fastestLap
      totalPoints += calculatePoints(result.position) // Assuming calculatePoints is a function you have defined
    })

    let averagePosition = totalPosition / totalResults
    let averagePolePosition = totalPolePosition / totalResults
    let averageSprintShootout = totalSprintShootout / totalResults
    let averageSprint = totalSprint / totalResults
    let averageTimeInRace = totalTimeInRace / totalResults
    let averageFastestLap = totalFastestLap / totalResults

    return {
      name: driverMembership.driver.lastName,
      image: driverMembership.driver.pictureUrl,
      driverId: driverMembership.id,
      averagePosition,
      averagePolePosition,
      averageSprintShootout,
      averageSprint,
      averageTimeInRace,
      averageFastestLap,
      totalPoints
    }
  })

  return (
    <MaxWidthWrapper>
      <section className='mt-8 grid'>
        <DriversHeader teamMembership={teamMembership} drivers={drivers} />

        <SeasonRacesNav seasonSlug={seasonSlug} teamSlug={teamSlug} />

        <div className='grid grid-cols-2 gap-x-10 gap-y-5'>
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

          <SeasonRadarChart
            teammateAPoints={drivers[0].totalPoints}
            teammateBPoints={drivers[1].totalPoints}
            teammateAName={drivers[0].name}
            teammateBName={drivers[1].name}
            year={Number(seasonSlug)}
            color={teamMembership[0].team.color}
            secondaryColor={teamMembership[0].team.secondaryColor}
          />
        </div>
      </section>
    </MaxWidthWrapper>
  )
}
