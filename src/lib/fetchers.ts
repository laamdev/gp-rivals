import prisma from '@/lib/db'

interface RaceResult {
  MRData: {
    RaceTable: {
      Races: Array<{
        raceName: string
        Results: Array<{
          position: string
          grid: string
          points: string
          laps: string
          status: string
          Time?: { time: string }
          FastestLap?: {
            rank: string
            Time: { time: string }
          }
        }>
      }>
    }
  }
}

interface DriverPoints {
  driverId: string
  totalPoints: number
}

export const getDrivers = async () => {
  const res = await prisma.driver.findMany()

  return res
}

export const getSeasonsYear = async () => {
  const res = await prisma.season.findMany({
    select: {
      year: true
    }
  })

  return res
}

export const getTeams = async () => {
  const res = await prisma.team.findMany({
    include: {
      drivers: true
    }
  })

  return res
}

export const getAllDriversPoints = async ({ year }: { year: number }) => {
  const driversPoints = await prisma.season.findMany({
    where: {
      year
    },
    include: {
      drivers: {
        select: {
          id: true,
          driver: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          raceResults: {
            select: {
              position: true,
              points: true,
              sprintPoints: true
            }
          }
        }
      }
    }
  })

  // Calculate total points for each driver
  const driverPoints: DriverPoints[] = driversPoints.flatMap(season =>
    season.drivers.map(driver => {
      const totalPoints = driver.raceResults.reduce((acc, result) => {
        return acc + result.points + (result.sprintPoints ?? 0)
      }, 0)

      return {
        driverId: driver.id,
        driverName: `${driver.driver.firstName} ${driver.driver.lastName}`,
        totalPoints
      }
    })
  )

  // Sort drivers by total points in descending order
  driverPoints.sort((a, b) => b.totalPoints - a.totalPoints)

  return driverPoints
}

export const getTeamMemberships = async seasonYear => {
  const res = await prisma.teamMembership.findMany({
    where: {
      season: {
        year: seasonYear
      },
      mainDriver: {
        equals: true
      }
    },
    include: {
      driver: true,
      team: true,
      season: true
    }
  })

  return res
}

export const getTeamMembershipGP = async ({ teamName, year, raceCountry }) => {
  const res = await prisma.teamMembership.findMany({
    where: {
      team: {
        name: {
          equals: teamName,
          mode: 'insensitive'
        }
      },
      mainDriver: {
        equals: true
      },
      season: {
        year: {
          equals: year
        }
      }
    },
    include: {
      season: {
        select: {
          year: true
        }
      },
      driver: {
        include: {
          raceResults: {
            where: {
              seasonRace: {
                season: {
                  year: year
                },
                country: {
                  equals: raceCountry,
                  mode: 'insensitive'
                }
              }
            },
            include: {
              seasonRace: true
            }
          }
        }
      },
      team: true
    }
  })

  return res
}

export const getTeamMembership = async ({ teamName, year }) => {
  const res = await prisma.teamMembership.findMany({
    where: {
      team: {
        name: {
          equals: teamName,
          mode: 'insensitive'
        }
      },
      mainDriver: {
        equals: true
      },
      season: {
        year: {
          equals: year
        }
      }
    },
    include: {
      driver: true,
      team: true,
      season: true,
      raceResults: {
        include: {
          seasonRace: true
        }
      }
    }
  })

  return res
}

export const getSeason = async ({ year }) => {
  const res = await prisma.season.findMany({
    where: {
      year
    },
    include: {
      drivers: true,
      seasonRaces: {
        include: {
          raceResults: {
            include: {
              teamMembership: true,
              driver: true,
              seasonRace: true
            }
          }
        }
      }
    }
  })

  return res
}

export const getSeasons = async () => {
  const res = await prisma.season.findMany({
    select: {
      year: true
    }
  })

  return res
}

// // export const getSeasonRaces = async ({ year }) => {
// //   const res = await prisma.season.findFirst({
// //     where: {
// //       year
// //     },
// //     include: {
// //       seasonRaces: {
// //         select: {
// //           id: true,
// //           country: true,
// //           startDate: true
// //         }
// //       }
// //     }
// //   })

// //   return res
// // }

export const getHistoricalRivalries = async () => {
  const res = await prisma.historicalRivalry.findMany({
    include: {
      drivers: {
        orderBy: {
          lastName: 'asc'
        }
      },
      teamSeasons: {
        orderBy: {
          season: {
            year: 'asc'
          }
        }
      },
      team: true,
      driversSeasons: {
        orderBy: {
          driver: {
            lastName: 'asc'
          }
        },
        include: {
          driver: true
        }
      }
    }
  })

  return res
}

export const getHistoricalRivalryYears = async ({ rivalry }) => {
  const res = await prisma.historicalRivalry.findFirst({
    where: {
      slug: rivalry
    },
    include: {
      teamSeasons: {
        orderBy: {
          season: {
            year: 'asc'
          }
        },
        select: {
          season: {
            select: {
              year: true
            }
          }
        }
      }
    }
  })

  return res
}

export const getHistoricalRivalry = async ({ rivalry }) => {
  const res = await prisma.historicalRivalry.findFirst({
    where: {
      slug: rivalry
    },
    include: {
      drivers: {
        orderBy: {
          lastName: 'asc'
        }
      },
      teamSeasons: {
        orderBy: {
          season: {
            year: 'asc'
          }
        },
        include: {
          season: true
        }
      },
      team: true,
      driversSeasons: {
        orderBy: {
          driver: {
            lastName: 'asc'
          }
        },
        include: {
          driver: true
        }
      }
    }
  })

  return res
}

export const getHistoricalRivalrySeason = async ({ rivalry, year }) => {
  const res = await prisma.historicalRivalry.findFirst({
    where: {
      slug: rivalry
    },
    include: {
      drivers: {
        orderBy: {
          lastName: 'asc'
        }
      },
      team: true,
      teamSeasons: {
        orderBy: {
          season: {
            year: 'asc'
          }
        },
        where: {
          season: {
            year: Number(year)
          }
        },
        include: {
          driversSeasons: {
            orderBy: {
              driver: {
                lastName: 'asc'
              }
            },
            include: {
              driver: true
            }
          },
          season: true
        }
      }
    }
  })

  return res
}

// ERGAST API FETCHERS

export const getSeasonRaces = async ({ seasonSlug }) => {
  const seasonRacesResult = await fetch(
    `http://ergast.com/api/f1/${seasonSlug}.json`
  )

  if (!seasonRacesResult.ok) return undefined

  const { MRData: seasonRacesData } = await seasonRacesResult.json()

  return {
    seasonRaces: seasonRacesData.RaceTable.Races,
    totalSeasonRaces: seasonRacesData.total
  }
}

interface DriverStats {
  qualifying: string
  race: string
  poles: number
  points: any // Replace with proper type from API
}

const BASE_URL = 'http://ergast.com/api/f1'

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

const getDriverStats = async (
  seasonSlug: string,
  driverId: string
): Promise<DriverStats | undefined> => {
  const [seasonData, qualifyingData, raceData] = await Promise.all([
    fetchErgastData(`/${seasonSlug}/driverStandings.json`),
    fetchErgastData(`/${seasonSlug}/drivers/${driverId}/qualifying.json`),
    fetchErgastData(`/${seasonSlug}/drivers/${driverId}/results.json`)
  ])

  if (!seasonData || !qualifyingData || !raceData) return undefined

  const points =
    seasonData.StandingsTable.StandingsLists[0].DriverStandings.find(
      driver => driver.Driver.driverId === driverId
    )

  const races = qualifyingData.RaceTable.Races
  const poles = races.filter(
    race => race.QualifyingResults[0].position === '1'
  ).length

  return {
    qualifying: calculateAveragePosition(races, 'qualifying'),
    race: calculateAveragePosition(raceData.RaceTable.Races, 'race'),
    poles,
    points
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
    driverTwoPoles: driverTwoStats.poles
  }
}

const getDriverRaceResult = async (
  season: string,
  circuit: string,
  driver: string
) => {
  try {
    const response = await fetch(
      `http://ergast.com/api/f1/${season}/circuits/${circuit}/drivers/${driver}/results.json`
    )
    const data: RaceResult = await response.json()
    const race = data.MRData.RaceTable.Races[0]
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
