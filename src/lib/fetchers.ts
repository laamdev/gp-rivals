'server only'

import prisma from '@/lib/db'

export const getDrivers = async () => {
  const res = await prisma.driver.findMany()

  return res
}

export const getTeamMemberships = async () => {
  const res = await prisma.teamMembership.findMany({
    where: {
      season: {
        year: 2024
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

export const getSeason = async () => {
  const res = await prisma.season.findMany({
    include: {
      drivers: true,
      seasonRaces: {
        include: {
          raceResults: {
            include: {
              teamMembership: true,
              driver: true
            }
          }
        }
      }
    }
  })

  return res
}
