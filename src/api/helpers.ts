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
  if (!raceData?.MRData?.RaceTable?.Races) {
    return {
      fastestLaps: 0,
      podiums: 0,
      positionChanges: [],
      totalPositionsGained: 0,
      totalRaces: 0,
      pointsPerRace: 0,
      lapsCompleted: 0,
      completedLaps: 0,
      poles: 0,
      poleToWinRatio: 0,
      podiumPercentage: 0,
      gridAverage: 0,
      raceAverage: 0,
      lapCompletionPercentage: 0,
      races: []
    }
  }

  const races = raceData.MRData.RaceTable.Races
  const totalRaces = races.length

  const fastestLaps = races.reduce(
    (count: number, race: any) =>
      count + (race.Results[0].FastestLap?.rank === '1' ? 1 : 0),
    0
  )

  const podiums = races.reduce(
    (count: number, race: any) =>
      count + (parseInt(race.Results[0].position) <= 3 ? 1 : 0),
    0
  )

  const poles = races.filter(race => race.Results[0].grid === '1').length

  const positionChanges: PositionChange[] = races.map((race: any) => {
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
    const isDriverDNF = !FINISHED_STATUSES.includes(status)

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
  })

  const totalPositionsGained = positionChanges.reduce(
    (sum, change) => sum + (change.placesGained ?? 0),
    0
  )

  const completedLaps = races.reduce(
    (sum, race) => sum + parseInt(race.Results[0].laps || '0'),
    0
  )

  const gridAverage = Number(calculateAveragePosition(races, 'gridAverage'))
  const raceAverage = Number(calculateAveragePosition(races, 'raceAverage'))

  return {
    fastestLaps,
    podiums,
    positionChanges,
    totalPositionsGained,
    totalRaces,
    pointsPerRace: points
      ? Number((parseInt(points.points) / totalRaces).toFixed(2))
      : 0,
    lapsCompleted: completedLaps,
    completedLaps,
    poles,
    poleToWinRatio:
      poles > 0
        ? Number(
            (
              (races.filter(
                race =>
                  race.Results[0].grid === '1' &&
                  race.Results[0].position === '1'
              ).length /
                poles) *
              100
            ).toFixed(2)
          )
        : 0,
    podiumPercentage:
      totalRaces > 0 ? Number(((podiums / totalRaces) * 100).toFixed(2)) : 0,
    gridAverage,
    raceAverage,
    races
  }
}

export const isDNF = (status: string) => !FINISHED_STATUSES.includes(status)

export const calculateRaceCompletion = (statusData: any) => {
  if (!statusData?.StatusTable?.Status) {
    return { finishedRaces: 0, dnfRaces: 0 }
  }

  return statusData.StatusTable.Status.reduce(
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
