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

export const getTeams = async () => {
  const res = await prisma.team.findMany({
    include: {
      drivers: true
    }
  })

  return res
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

export const getSeasonRaces = async ({ year }) => {
  const res = await prisma.season.findFirst({
    where: {
      year
    },
    include: {
      seasonRaces: {
        select: {
          id: true,
          country: true,
          startDate: true
        }
      }
    }
  })

  return res
}

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
