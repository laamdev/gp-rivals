import type { Metadata, ResolvingMetadata } from 'next'

import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { RaceStatCard } from '@/components/global/race-stat-card'
import { RaceStatContainer } from '@/components/global/race-stat-container'

import { calculatePoints } from '@/lib/utils'
import { getTeamMembershipGP } from '@/lib/fetchers'

interface TeamSeasonGpPageProps {
  params: {
    seasonSlug: string
    teamSlug: string
    gpSlug: string
  }
}

export async function generateMetadata(
  { params }: TeamSeasonGpPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { seasonSlug, teamSlug, gpSlug } = params

  const teamMembership = await getTeamMembershipGP({
    teamName: String(teamSlug.split('-').join(' ')),
    year: Number(seasonSlug),
    raceCountry: String(gpSlug.split('-').join(' '))
  })
  return {
    title: `${teamMembership[0].team.name}'s ${teamMembership[0].season.year} ${teamMembership[0].driver.raceResults[0].seasonRace.country} GP`
  }
}

export default async function TeamSeasonGPPage({
  params
}: TeamSeasonGpPageProps) {
  const { seasonSlug, teamSlug, gpSlug } = params

  const teamMembership = await getTeamMembershipGP({
    teamName: String(teamSlug.split('-').join(' ')),
    year: Number(seasonSlug),
    raceCountry: String(gpSlug.split('-').join(' '))
  })

  if (!teamMembership) {
    return null
  }

  const extractRaceResults = (data: any[]): any[] => {
    const results: any[] = []

    data.forEach(driverMembership => {
      const name = driverMembership.driver.lastName
      const image = driverMembership.driver.pictureUrl
      driverMembership.driver.raceResults.forEach(result => {
        return results.push({
          name,
          image,
          position: result.position,
          points: result.points,
          qualifyingPosition: result.qualifyingPosition,
          qualifyingTime: result.qualifyingTime,
          isFastestLap: result.isFastestLap,
          fastestLap: result.fastestLap,
          fastestLapTime: result.fastestLapTime,
          raceName: result.seasonRace.name,
          circuit: result.seasonRace.circuit,
          country: result.seasonRace.country,
          raceDate: result.seasonRace.raceDate,
          isDns: result.isDns,
          isDnf: result.isDnf,
          isDsq: result.isDsq,
          color: driverMembership.team.color,
          secondaryColor: driverMembership.team.secondaryColor
        })
      })
    })

    return results
  }

  const drivers = await extractRaceResults(teamMembership)
  return (
    <MaxWidthWrapper>
      <section className='mt-8 grid'>
        <DriversHeader teamMembership={teamMembership} drivers={drivers} />

        <SeasonRacesNav seasonSlug={seasonSlug} teamSlug={teamSlug} />
      </section>

      <section className='mt-10 flex flex-col gap-x-10 gap-y-10'>
        <RaceStatContainer label='Race'>
          <div className='grid grid-cols-3 gap-x-5'>
            <RaceStatCard
              label='Position'
              // // isBest={drivers[1].position > drivers[0].position ? true : false}
              isBest={
                drivers[1].position === null ||
                drivers[1].position > drivers[0].position
                  ? true
                  : false
              }
              color={drivers[0].color}
              value={
                drivers[0].position
                  ? drivers[0].position
                  : drivers[0].isDnf === true
                    ? 'DNF'
                    : drivers[0].isDns === true
                      ? 'DNS'
                      : drivers[0].isDsq === true
                        ? 'DSQ'
                        : 'N/A'
              }
              delta={drivers[1].position - drivers[0].position}
              className='col-span-1'
            />
            <RaceStatCard
              label='Points'
              isBest={
                drivers[1].position === null ||
                drivers[1].position > drivers[0].position
                  ? true
                  : false
              }
              value={String(calculatePoints(drivers[0].position))}
              delta={
                calculatePoints(drivers[0].position) -
                calculatePoints(drivers[1].position)
              }
              color={drivers[0].color}
              className='col-span-1'
            />
            <RaceStatCard
              label='Fastest Lap'
              isBest={
                drivers[0].fastestLapTime < drivers[1].fastestLapTime
                  ? true
                  : false
              }
              value={drivers[0].fastestLapTime}
              color={drivers[0].color}
              delta={(
                drivers[0].fastestLapTime - drivers[1].fastestLapTime
              ).toFixed(3)}
              className='col-span-1'
            />
          </div>
          <div className='grid grid-cols-3 gap-x-5'>
            <RaceStatCard
              label='Position'
              isBest={
                drivers[1].isDnf === true ||
                drivers[1].isDns === true ||
                drivers[1].isDsq === true
                  ? false
                  : drivers[0].position > drivers[1].position
                    ? true
                    : false
              }
              color={drivers[1].color}
              value={
                drivers[1].position
                  ? drivers[1].position
                  : drivers[1].isDnf === true
                    ? 'DNF'
                    : drivers[1].isDns === true
                      ? 'DNS'
                      : drivers[1].isDsq === true
                        ? 'DSQ'
                        : 'N/A'
              }
              delta={drivers[0].position - drivers[1].position}
              className='col-span-1'
            />
            <RaceStatCard
              label='Points'
              isBest={drivers[0].position > drivers[1].position ? true : false}
              value={String(calculatePoints(drivers[1].position))}
              color={drivers[1].secondaryColor}
              delta={
                calculatePoints(drivers[1].position) -
                calculatePoints(drivers[0].position)
              }
              className='col-span-1'
            />
            <RaceStatCard
              label='Fastest Lap'
              isBest={
                drivers[1].fastestLapTime < drivers[0].fastestLapTime
                  ? true
                  : false
              }
              delta={(
                drivers[1].fastestLapTime - drivers[0].fastestLapTime
              ).toFixed(3)}
              value={drivers[1].fastestLapTime}
              color={drivers[1].secondaryColor}
              className='col-span-1'
            />
          </div>
        </RaceStatContainer>

        <RaceStatContainer label='Qualifying'>
          <div className='grid grid-cols-2 gap-x-5'>
            <RaceStatCard
              label='Position'
              isBest={
                drivers[1].qualifyingPosition > drivers[0].qualifyingPosition
                  ? true
                  : false
              }
              color={drivers[0].color}
              value={drivers[0].qualifyingPosition}
              delta={
                drivers[1].qualifyingPosition - drivers[0].qualifyingPosition
              }
              className='col-span-1'
            />
            <RaceStatCard
              label='Fastest Lap'
              isBest={
                drivers[0].qualifyingTime < drivers[1].qualifyingTime
                  ? true
                  : false
              }
              value={drivers[0].qualifyingTime}
              color={drivers[0].color}
              delta={(
                drivers[0].qualifyingTime - drivers[1].qualifyingTime
              ).toFixed(3)}
              className='col-span-1'
            />
          </div>
          <div className='grid grid-cols-2 gap-x-5'>
            <RaceStatCard
              label='Position'
              isBest={
                drivers[0].qualifyingPosition > drivers[1].qualifyingPosition
                  ? true
                  : false
              }
              value={drivers[1].qualifyingPosition}
              color={drivers[1].secondaryColor}
              delta={
                drivers[0].qualifyingPosition - drivers[1].qualifyingPosition
              }
              className='col-span-1'
            />
            <RaceStatCard
              label='Fastest Lap'
              isBest={
                drivers[1].qualifyingTime < drivers[0].qualifyingTime
                  ? true
                  : false
              }
              delta={(
                drivers[1].qualifyingTime - drivers[0].qualifyingTime
              ).toFixed(3)}
              value={drivers[1].qualifyingTime}
              color={drivers[1].secondaryColor}
              className='col-span-1'
            />
          </div>
        </RaceStatContainer>
      </section>
    </MaxWidthWrapper>
  )
}
