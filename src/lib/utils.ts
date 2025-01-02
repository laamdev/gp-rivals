import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const getPercentage = (value, total) => {
  return ((value / total) * 100).toFixed(2)
}

export const calculatePoints = (
  position,
  raceType = 'grandPrix',
  raceCompletionPercentage = 100,
  isFastestLap = false
) => {
  let points = 0

  if (raceType === 'grandPrix') {
    if (raceCompletionPercentage < 25) {
      switch (position) {
        case 1:
          points = 6
          break
        case 2:
          points = 4
          break
        case 3:
          points = 3
          break
        case 4:
          points = 2
          break
        case 5:
          points = 1
          break
        default:
          points = 0
      }
    } else if (raceCompletionPercentage < 50) {
      switch (position) {
        case 1:
          points = 13
          break
        case 2:
          points = 10
          break
        case 3:
          points = 8
          break
        case 4:
          points = 6
          break
        case 5:
          points = 5
          break
        case 6:
          points = 4
          break
        case 7:
          points = 3
          break
        case 8:
          points = 2
          break
        case 9:
          points = 1
          break
        default:
          points = 0
      }
    } else if (raceCompletionPercentage < 75) {
      switch (position) {
        case 1:
          points = 19
          break
        case 2:
          points = 14
          break
        case 3:
          points = 12
          break
        case 4:
          points = 9
          break
        case 5:
          points = 8
          break
        case 6:
          points = 6
          break
        case 7:
          points = 5
          break
        case 8:
          points = 3
          break
        case 9:
          points = 2
          break
        case 10:
          points = 1
          break
        default:
          points = 0
      }
    } else {
      switch (position) {
        case 1:
          points = 25
          break
        case 2:
          points = 18
          break
        case 3:
          points = 15
          break
        case 4:
          points = 12
          break
        case 5:
          points = 10
          break
        case 6:
          points = 8
          break
        case 7:
          points = 6
          break
        case 8:
          points = 4
          break
        case 9:
          points = 2
          break
        case 10:
          points = 1
          break
        default:
          points = 0
      }
    }

    // Add an extra point if isFastestLap is true and position is within the first 10
    if (isFastestLap && position <= 10) {
      points += 1
    }
  } else if (raceType === 'sprint') {
    switch (position) {
      case 1:
        points = 8
        break
      case 2:
        points = 7
        break
      case 3:
        points = 6
        break
      case 4:
        points = 5
        break
      case 5:
        points = 4
        break
      case 6:
        points = 3
        break
      case 7:
        points = 2
        break
      case 8:
        points = 1
        break
      default:
        points = 0
    }
  } else {
    points = 0
  }

  return points
}

export const currentYear = new Date().getFullYear()

export const currentDate = new Date()

export const getTotalCounts = statuses => {
  return statuses.reduce((total, status) => total + parseInt(status.count), 0)
}

export const isEqual = (a: number, b: number) => Math.abs(a - b) < 0.0001

const parseTime = (time: string) => {
  // Remove the '+' prefix if present
  const cleanTime = time.replace('+', '')
  // Convert MM:SS.sss to seconds
  if (cleanTime.includes(':')) {
    const [mins, secs] = cleanTime.split(':')
    return Number(mins) * 60 + Number(secs)
  }
  // Already in seconds
  return Number(cleanTime)
}

export const isLightColor = (color: string) => {
  // Convert hex to RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128
}

export const formatPosition = (position: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const remainder = position % 100

  // Handle 11, 12, 13 specially
  if (remainder > 10 && remainder < 14) {
    return `${position}th`
  }

  const suffix = suffixes[remainder % 10] || suffixes[0]
  return `${position}${suffix}`
}

// STAT COMPARISON

export const compareStats = (
  driverNumber: 1 | 2,
  d1: number,
  d2: number,
  higherIsBetter = false
) => {
  if (isEqual(d1, d2)) return 'tie'
  if (higherIsBetter) {
    return driverNumber === 1 ? d1 > d2 : d2 > d1
  }
  return driverNumber === 1 ? d1 < d2 : d2 < d1
}

export const getComparison = (
  type: string,
  driverNumber: 1 | 2,
  result: any
) => {
  // Handle race-specific result structure
  if (result.driverOne && result.driverTwo) {
    const stats = {
      position: {
        d1: Number(result.driverOne.position),
        d2: Number(result.driverTwo.position),
        higherIsBetter: false
      },
      grid: {
        d1: Number(result.driverOne.grid),
        d2: Number(result.driverTwo.grid),
        higherIsBetter: false
      },
      points: {
        d1: Number(result.driverOne.points),
        d2: Number(result.driverTwo.points),
        higherIsBetter: true
      },
      laps: {
        d1: Number(result.driverOne.laps),
        d2: Number(result.driverTwo.laps),
        higherIsBetter: true
      },
      finishTime: {
        d1: result.driverOne.finishTime
          ? parseTime(result.driverOne.finishTime)
          : Infinity,
        d2: result.driverTwo.finishTime
          ? parseTime(result.driverTwo.finishTime)
          : Infinity,
        higherIsBetter: false
      },
      fastestLap: {
        d1: Number(result.driverOne.fastestLapRank),
        d2: Number(result.driverTwo.fastestLapRank),
        higherIsBetter: false
      }
    }

    const stat = stats[type as keyof typeof stats]
    if (!stat) return false
    return compareStats(driverNumber, stat.d1, stat.d2, stat.higherIsBetter)
  }

  // Fallback to original season stats comparison
  const seasonStats = {
    position: {
      d1: Number(result.driverOnePosition),
      d2: Number(result.driverTwoPosition),
      higherIsBetter: false
    },
    points: {
      d1: Number(result.driverOnePoints),
      d2: Number(result.driverTwoPoints),
      higherIsBetter: true
    },
    wins: {
      d1: Number(result.driverOneWins),
      d2: Number(result.driverTwoWins),
      higherIsBetter: true
    },
    poles: {
      d1: Number(result.driverOnePoles),
      d2: Number(result.driverTwoPoles),
      higherIsBetter: true
    },
    fastestLaps: {
      d1: Number(result.driverOneFastestLaps),
      d2: Number(result.driverTwoFastestLaps),
      higherIsBetter: true
    },
    podiums: {
      d1: Number(result.driverOnePodiums),
      d2: Number(result.driverTwoPodiums),
      higherIsBetter: true
    },
    raceAverage: {
      d1: Number(result.driverOneRaceAverage),
      d2: Number(result.driverTwoRaceAverage),
      higherIsBetter: false
    },
    gridAverage: {
      d1: Number(result.driverOneGridAverage),
      d2: Number(result.driverTwoGridAverage),
      higherIsBetter: false
    },
    poleToWinRatio: {
      d1: Number(result.driverOnePoleToWinRatio),
      d2: Number(result.driverTwoPoleToWinRatio),
      higherIsBetter: true
    },
    pointsPerRace: {
      d1: Number(result.driverOnePointsPerRace),
      d2: Number(result.driverTwoPointsPerRace),
      higherIsBetter: true
    }
  }

  const stat = seasonStats[type as keyof typeof seasonStats]
  if (!stat) return false
  return compareStats(driverNumber, stat.d1, stat.d2, stat.higherIsBetter)
}

export const getLegendaryComparison = (
  type: string,
  driverNumber: 1 | 2,
  result: any
) => {
  const legendaryStats = {
    points: {
      d1: Number(result.driverOne.points),
      d2: Number(result.driverTwo.points),
      higherIsBetter: true
    },
    wins: {
      d1: Number(result.driverOne.wins),
      d2: Number(result.driverTwo.wins),
      higherIsBetter: true
    },
    poles: {
      d1: Number(result.driverOne.gridFirst),
      d2: Number(result.driverTwo.gridFirst),
      higherIsBetter: true
    },
    podiums: {
      d1: Number(result.driverOne.podiums),
      d2: Number(result.driverTwo.podiums),
      higherIsBetter: true
    },
    fastestLaps: {
      d1: Number(result.driverOne.fastestLaps),
      d2: Number(result.driverTwo.fastestLaps),
      higherIsBetter: true
    },
    averageRacePosition: {
      d1: Number(result.driverOne.averagePosition),
      d2: Number(result.driverTwo.averagePosition),
      higherIsBetter: false
    },
    averageGridPosition: {
      d1: Number(result.driverOne.averageGridPosition),
      d2: Number(result.driverTwo.averageGridPosition),
      higherIsBetter: false
    },
    pointsPerRace: {
      d1: Number(result.driverOne.pointsPerRace),
      d2: Number(result.driverTwo.pointsPerRace),
      higherIsBetter: true
    },
    poleToWinRatio: {
      d1: Number(result.driverOne.poleToWinRatio),
      d2: Number(result.driverTwo.poleToWinRatio),
      higherIsBetter: true
    },
    championships: {
      d1: Number(result.driverOne.championships),
      d2: Number(result.driverTwo.championships),
      higherIsBetter: true
    },
    dnfs: {
      d1: Number(result.driverOne.dnfs),
      d2: Number(result.driverTwo.dnfs),
      higherIsBetter: false
    }
  }

  const stat = legendaryStats[type as keyof typeof legendaryStats]
  if (!stat) return false
  return compareStats(driverNumber, stat.d1, stat.d2, stat.higherIsBetter)
}
