import { countries } from '@/data/countries'

import { DriverStats, PositionChange } from '@/api/types'
import { FINISHED_STATUSES } from '@/api/constants'

export const calculateAveragePosition = (
  races: any[],
  type: 'gridAverage' | 'raceAverage'
) => {
  const positions = races.map(race =>
    Number(
      type === 'gridAverage' ? race.Results[0].grid : race.Results[0].position
    )
  )
  return (
    positions.reduce((acc, curr) => acc + curr, 0) / positions.length
  ).toFixed(2)
}

export const comparePositions = (
  races1: any[],
  races2: any[],
  type: 'grid' | 'race'
) => {
  let driver1Better = 0
  let driver2Better = 0

  races1.forEach((race1, index) => {
    const pos1 = Number(
      type === 'grid' ? race1.Results[0].grid : race1.Results[0].position
    )
    const pos2 = Number(
      type === 'grid'
        ? races2[index]?.Results[0].grid
        : races2[index]?.Results[0].position
    )

    if (pos1 < pos2) driver1Better++
    if (pos2 < pos1) driver2Better++
  })

  return { driver1Better, driver2Better }
}

export const calculateDriverStats = (
  raceData: any,
  points: any
): Partial<DriverStats> => {
  const totalRaces = raceData.RaceTable.Races.length

  const fastestLaps = raceData.RaceTable.Races.reduce(
    (count: number, race: any) =>
      count + (race.Results[0].FastestLap?.rank === '1' ? 1 : 0),
    0
  )

  const podiums = raceData.RaceTable.Races.reduce(
    (count: number, race: any) =>
      count + (parseInt(race.Results[0].position) <= 3 ? 1 : 0),
    0
  )

  const positionChanges: PositionChange[] = raceData.RaceTable.Races.map(
    (race: any) => {
      const country = race.Circuit.Location.country
      const locality = race.Circuit.Location.locality

      let displayName = country

      if (country === 'USA' || country === 'United States') {
        displayName = `USA (${locality})`
      }

      if (country === 'Italy') {
        displayName = `Italy (${locality})`
      }

      const countryData = countries.find(c => {
        if (country === 'USA' || country === 'United States') {
          return c.name.startsWith('USA')
        }

        if (country === 'Italy') {
          return c.name.startsWith('Italy')
        }
        return c.name === country
      })

      const status = race.Results[0].status
      console.log(`Race: ${race.raceName}, Status: ${status}`)
      const isDriverDNF = !FINISHED_STATUSES.includes(status)

      if (race.raceName.includes('British')) {
        console.log({
          status,
          isDriverDNF,
          FINISHED_STATUSES,
          position: race.Results[0].position
        })
      }

      return {
        race: displayName,
        flag: countryData?.flag || '🏁',
        grid: parseInt(race.Results[0].grid),
        finish: isDriverDNF ? 'DNF' : parseInt(race.Results[0].position),
        placesGained: isDriverDNF
          ? null
          : parseInt(race.Results[0].grid) - parseInt(race.Results[0].position),
        status
      }
    }
  )

  const totalPositionsGained = positionChanges.reduce(
    (sum, change) => sum + (change.placesGained ?? 0),
    0
  )

  return {
    fastestLaps,
    podiums,
    positionChanges,
    totalPositionsGained,
    totalRaces,
    pointsPerRace: points
      ? Number((parseInt(points.points) / totalRaces).toFixed(2))
      : 0
  }
}

export const isDNF = (status: string) => !FINISHED_STATUSES.includes(status)

export const calculateRaceCompletion = (statusData: any) => {
  return statusData?.StatusTable.Status.reduce(
    (acc: { finishedRaces: number; dnfRaces: number }, status: any) => {
      const count = Number(status.count)
      if (FINISHED_STATUSES.includes(status.status)) {
        acc.finishedRaces += count
      } else {
        acc.dnfRaces += count
      }
      return acc
    },
    { finishedRaces: 0, dnfRaces: 0 }
  )
}
