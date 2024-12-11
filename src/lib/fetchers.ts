// TYPES

interface LegendaryRivalry {
  id: number
  slug: string
  team: string
  seasons: Array<{ year: number }>
  primaryColor: string
  secondaryColor: string
  drivers: Array<{
    id: number
    firstName: string
    lastName: string
    code: string
    pictureUrl: string
    slug: string
  }>
}

interface DriverStats {
  qualifying: string
  race: string
  poles: number
  points: any
  status: any
  races: any[]
  fastestLaps: number
  podiums: number
  positionChanges: Array<{
    race: string
    grid: number
    finish: number
    placesGained: number
  }>
  totalPositionsGained: number
  poleToWinRatio: number
  lapsCompleted: number
  totalRaces: number
  pointsPerRace: number
}

// CONSTANTS

// // const BASE_URL = 'https://api.jolpi.ca/ergast/f1'
const BASE_URL = 'http://ergast.com/api/f1'

// FUNCTIONS

const fetchErgastData = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`)
  if (!response.ok) return undefined
  const { MRData } = await response.json()
  return MRData
}

const calculateAveragePosition = (
  races: any[],
  type: 'qualifying' | 'race'
) => {
  const positions = races.map(race =>
    Number(
      type === 'qualifying'
        ? race.QualifyingResults[0].position
        : race.Results[0].position
    )
  )
  return (
    positions.reduce((acc, curr) => acc + curr, 0) / positions.length
  ).toFixed(2)
}

const comparePositions = (
  races1: any[],
  races2: any[],
  type: 'qualifying' | 'race'
) => {
  let driver1Better = 0
  let driver2Better = 0

  races1.forEach((race1, index) => {
    const pos1 = Number(
      type === 'qualifying' ? race1.Results[0].grid : race1.Results[0].position
    )
    const pos2 = Number(
      type === 'qualifying'
        ? races2[index]?.Results[0].grid
        : races2[index]?.Results[0].position
    )

    if (pos1 < pos2) driver1Better++
    if (pos2 < pos1) driver2Better++
  })

  return { driver1Better, driver2Better }
}

export const getSeasonRaces = async ({ seasonSlug }) => {
  const seasonRacesData = await fetchErgastData(`/${seasonSlug}.json`)
  if (!seasonRacesData) return undefined

  return {
    seasonRaces: seasonRacesData.RaceTable.Races,
    totalSeasonRaces: seasonRacesData.total
  }
}

const getDriverStats = async (
  seasonSlug: string,
  driverId: string
): Promise<DriverStats | undefined> => {
  const [seasonData, qualifyingData, raceData, statusData] = await Promise.all([
    fetchErgastData(`/${seasonSlug}/driverStandings.json`),
    fetchErgastData(`/${seasonSlug}/drivers/${driverId}/qualifying.json`),
    fetchErgastData(`/${seasonSlug}/drivers/${driverId}/results.json`),
    fetchErgastData(`/${seasonSlug}/drivers/${driverId}/status.json`)
  ])

  if (!seasonData || !qualifyingData || !raceData || !statusData)
    return undefined

  const totalRaces = raceData.RaceTable.Races.length

  const fastestLaps = raceData.RaceTable.Races.reduce(
    (count, race) => count + (race.Results[0].FastestLap?.rank === '1' ? 1 : 0),
    0
  )

  const podiums = raceData.RaceTable.Races.reduce(
    (count, race) => count + (parseInt(race.Results[0].position) <= 3 ? 1 : 0),
    0
  )

  const status = statusData.StatusTable.Status

  const points =
    seasonData.StandingsTable.StandingsLists[0].DriverStandings.find(
      driver => driver.Driver.driverId === driverId
    )

  const pointsPerRace = Number(
    (parseInt(points.points) / totalRaces).toFixed(1)
  )

  const positionChanges = raceData.RaceTable.Races.map(race => ({
    race: race.raceName.replace(' Grand Prix', ' GP'),
    grid: parseInt(race.Results[0].grid),
    finish: parseInt(race.Results[0].position),
    placesGained:
      parseInt(race.Results[0].grid) - parseInt(race.Results[0].position)
  }))

  const totalPositionsGained = positionChanges.reduce(
    (sum, change) => sum + change.placesGained,
    0
  )

  const races = qualifyingData.RaceTable.Races
  const poles = races.filter(
    race => race.QualifyingResults?.[0]?.position === '1'
  ).length

  const winsFromPole = raceData.RaceTable.Races.reduce((count, race) => {
    const startedFromPole = race.Results?.[0]?.grid === '1'
    const wonRace = race.Results?.[0]?.position === '1'
    return count + (startedFromPole && wonRace ? 1 : 0)
  }, 0)

  const poleToWinRatio = poles > 0 ? (winsFromPole / poles) * 100 : 0

  const lapsCompleted = raceData.RaceTable.Races.reduce((total, race) => {
    return total + parseInt(race.Results[0].laps)
  }, 0)

  return {
    qualifying: calculateAveragePosition(races, 'qualifying'),
    race: calculateAveragePosition(raceData.RaceTable.Races, 'race'),
    poles,
    points,
    status,
    races: raceData.RaceTable.Races,
    fastestLaps,
    podiums,
    positionChanges,
    totalPositionsGained,
    poleToWinRatio,
    lapsCompleted,
    totalRaces,
    pointsPerRace
  }
}

export const getDriversSeasonStats = async ({
  season,
  driverOne,
  driverTwo
}) => {
  const [driverOneStats, driverTwoStats] = await Promise.all([
    getDriverStats(season, driverOne),
    getDriverStats(season, driverTwo)
  ])

  if (!driverOneStats || !driverTwoStats) return undefined

  const raceComparison = comparePositions(
    driverOneStats.races,
    driverTwoStats.races,
    'race'
  )

  const qualifyingComparison = comparePositions(
    driverOneStats.races, // using races since it contains qualifying data
    driverTwoStats.races,
    'qualifying'
  )

  return {
    driverOneQualifyingAverage: driverOneStats.qualifying,
    driverOneRaceAverage: driverOneStats.race,
    driverTwoQualifyingAverage: driverTwoStats.qualifying,
    driverTwoRaceAverage: driverTwoStats.race,
    driverOnePoints: driverOneStats.points.points,
    driverTwoPoints: driverTwoStats.points.points,
    driverOnePosition: driverOneStats.points.position,
    driverTwoPosition: driverTwoStats.points.position,
    driverOneWins: driverOneStats.points.wins,
    driverTwoWins: driverTwoStats.points.wins,
    driverOnePoles: driverOneStats.poles,
    driverTwoPoles: driverTwoStats.poles,
    driverOneBetterFinishes: raceComparison.driver1Better,
    driverTwoBetterFinishes: raceComparison.driver2Better,
    driverOneBetterQualifying: qualifyingComparison.driver1Better,
    driverTwoBetterQualifying: qualifyingComparison.driver2Better,
    driverOneStatus: driverOneStats.status,
    driverTwoStatus: driverTwoStats.status,
    driverOnePositionChanges: driverOneStats.positionChanges,
    driverTwoPositionChanges: driverTwoStats.positionChanges,
    driverOneTotalPositionsGained: driverOneStats.totalPositionsGained,
    driverTwoTotalPositionsGained: driverTwoStats.totalPositionsGained,
    driverOneFastestLaps: driverOneStats.fastestLaps,
    driverTwoFastestLaps: driverTwoStats.fastestLaps,
    driverOnePodiums: driverOneStats.podiums,
    driverTwoPodiums: driverTwoStats.podiums,
    driverOnePoleToWinRatio: driverOneStats.poleToWinRatio,
    driverTwoPoleToWinRatio: driverTwoStats.poleToWinRatio,
    driverOneLapsCompleted: driverOneStats.lapsCompleted,
    driverTwoLapsCompleted: driverTwoStats.lapsCompleted,
    driverOneTotalRaces: driverOneStats.totalRaces,
    driverTwoTotalRaces: driverTwoStats.totalRaces,
    driverOnePointsPerRace: driverOneStats.pointsPerRace,
    driverTwoPointsPerRace: driverTwoStats.pointsPerRace
  }
}

const getDriverRaceResult = async (
  season: string,
  circuit: string,
  driver: string
) => {
  try {
    const data = await fetchErgastData(
      `/${season}/circuits/${circuit}/drivers/${driver}/results.json`
    )
    if (!data) return undefined

    const race = data.RaceTable.Races[0]
    return {
      raceName: race?.raceName,
      result: race?.Results[0]
    }
  } catch (error) {
    console.error('Error fetching driver race result:', error)
    return undefined
  }
}

export const getDriversRaceStats = async ({
  season,
  circuit,
  driverOne,
  driverTwo
}: {
  season: string
  circuit: string
  driverOne: string
  driverTwo: string
}) => {
  const [driverOneStats, driverTwoStats] = await Promise.all([
    getDriverRaceResult(season, circuit, driverOne),
    getDriverRaceResult(season, circuit, driverTwo)
  ])

  if (!driverOneStats?.result || !driverTwoStats?.result) return undefined

  return {
    raceName: driverOneStats.raceName,
    driverOne: {
      position: driverOneStats.result.position,
      grid: driverOneStats.result.grid,
      points: driverOneStats.result.points,
      laps: driverOneStats.result.laps,
      status: driverOneStats.result.status,
      finishTime: driverOneStats.result.Time?.time,
      fastestLap: driverOneStats.result.FastestLap?.Time.time,
      fastestLapRank: driverOneStats.result.FastestLap?.rank
    },
    driverTwo: {
      position: driverTwoStats.result.position,
      grid: driverTwoStats.result.grid,
      points: driverTwoStats.result.points,
      laps: driverTwoStats.result.laps,
      status: driverTwoStats.result.status,
      finishTime: driverTwoStats.result.Time?.time,
      fastestLap: driverTwoStats.result.FastestLap?.Time.time,
      fastestLapRank: driverTwoStats.result.FastestLap?.rank
    }
  }
}

export const getSeasonChampion = async (season: string) => {
  const data = await fetchErgastData(`/${season}/driverStandings/1.json`)

  if (!data) return undefined

  const champion = data.StandingsTable.StandingsLists[0].DriverStandings[0]

  return {
    driverName: `${champion.Driver.givenName} ${champion.Driver.familyName}`,
    points: Number(champion.points),
    wins: Number(champion.wins),
    position: Number(champion.position)
  }
}

export const getConstructorStandings = async ({
  season,
  constructorId
}: {
  season: string
  constructorId: string
}) => {
  const data = await fetchErgastData(
    `/${season}/constructors/${constructorId}/constructorStandings.json`
  )
  if (!data) return undefined

  const standings =
    data.StandingsTable.StandingsLists[0]?.ConstructorStandings[0]
  if (!standings) return undefined

  return {
    position: Number(standings.position),
    points: Number(standings.points),
    wins: Number(standings.wins),
    constructorName: standings.Constructor.name,
    nationality: standings.Constructor.nationality
  }
}

// LEGENDARY

export const getLegendaryRivalryOverallResults = async (
  rivalry: LegendaryRivalry
) => {
  const seasonsResults = await Promise.all(
    rivalry.seasons.map(async season => {
      const results = await getDriversSeasonStats({
        season: season.year.toString(),
        driverOne: rivalry.drivers[0].slug,
        driverTwo: rivalry.drivers[1].slug
      })
      return results
    })
  )

  const combinedStats = {
    driverOne: {
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      fastestLaps: 0,
      positions: [] as number[],
      championships: 0 // Add championships counter
    },
    driverTwo: {
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      fastestLaps: 0,
      positions: [] as number[],
      championships: 0 // Add championships counter
    }
  }

  seasonsResults.forEach(season => {
    if (!season) return

    // Driver One
    combinedStats.driverOne.points += Number(season.driverOnePoints)
    combinedStats.driverOne.wins += Number(season.driverOneWins)
    combinedStats.driverOne.poles += Number(season.driverOnePoles)
    combinedStats.driverOne.podiums += Number(season.driverOnePodiums)
    combinedStats.driverOne.fastestLaps += Number(season.driverOneFastestLaps)
    combinedStats.driverOne.positions.push(Number(season.driverOnePosition))
    // Check if champion
    if (Number(season.driverOnePosition) === 1) {
      combinedStats.driverOne.championships++
    }

    // Driver Two
    combinedStats.driverTwo.points += Number(season.driverTwoPoints)
    combinedStats.driverTwo.wins += Number(season.driverTwoWins)
    combinedStats.driverTwo.poles += Number(season.driverTwoPoles)
    combinedStats.driverTwo.podiums += Number(season.driverTwoPodiums)
    combinedStats.driverTwo.fastestLaps += Number(season.driverTwoFastestLaps)
    combinedStats.driverTwo.positions.push(Number(season.driverTwoPosition))
    // Check if champion
    if (Number(season.driverTwoPosition) === 1) {
      combinedStats.driverTwo.championships++
    }
  })
  // Calculate averages
  const driverOneAvgPosition =
    combinedStats.driverOne.positions.length > 0
      ? (
          combinedStats.driverOne.positions.reduce((a, b) => a + b, 0) /
          combinedStats.driverOne.positions.length
        ).toFixed(1)
      : 0

  const driverTwoAvgPosition =
    combinedStats.driverTwo.positions.length > 0
      ? (
          combinedStats.driverTwo.positions.reduce((a, b) => a + b, 0) /
          combinedStats.driverTwo.positions.length
        ).toFixed(1)
      : 0

  return {
    driverOne: {
      ...combinedStats.driverOne,
      averagePosition: Number(driverOneAvgPosition)
    },
    driverTwo: {
      ...combinedStats.driverTwo,
      averagePosition: Number(driverTwoAvgPosition)
    }
  }
}
