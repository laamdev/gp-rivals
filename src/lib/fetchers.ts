import prisma from '@/lib/db'

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

export const getTeamMemberships = async seasonYear => {
  const res = await prisma.teamMembership.findMany({
    where: {
      season: {
        year: seasonYear
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

export const getTeamMembership = async ({ teamName, year }) => {
  const res = await prisma.team.findFirst({
    where: {
      name: {
        equals: teamName,
        mode: 'insensitive'
      }
    },
    include: {
      drivers: {
        include: {
          team: true,
          driver: true,
          raceResults: {
            include: {
              teamMembership: true
            }
          }
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

export const getSeasonRaces = async ({ year }) => {
  const res = await prisma.season.findFirst({
    where: {
      year
    },
    include: {
      seasonRaces: {
        select: {
          id: true,
          country: true
        }
      }
    }
  })

  return res
}
