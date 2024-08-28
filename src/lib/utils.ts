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
