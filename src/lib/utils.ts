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
  raceCompletionPercentage = 100
) => {
  if (raceType === 'grandPrix') {
    if (raceCompletionPercentage < 25) {
      switch (position) {
        case 1:
          return 6
        case 2:
          return 4
        case 3:
          return 3
        case 4:
          return 2
        case 5:
          return 1
        default:
          return 0
      }
    } else if (raceCompletionPercentage < 50) {
      switch (position) {
        case 1:
          return 13
        case 2:
          return 10
        case 3:
          return 8
        case 4:
          return 6
        case 5:
          return 5
        case 6:
          return 4
        case 7:
          return 3
        case 8:
          return 2
        case 9:
          return 1
        default:
          return 0
      }
    } else if (raceCompletionPercentage < 75) {
      switch (position) {
        case 1:
          return 19
        case 2:
          return 14
        case 3:
          return 12
        case 4:
          return 9
        case 5:
          return 8
        case 6:
          return 6
        case 7:
          return 5
        case 8:
          return 3
        case 9:
          return 2
        case 10:
          return 1
        default:
          return 0
      }
    } else {
      switch (position) {
        case 1:
          return 25
        case 2:
          return 18
        case 3:
          return 15
        case 4:
          return 12
        case 5:
          return 10
        case 6:
          return 8
        case 7:
          return 6
        case 8:
          return 4
        case 9:
          return 2
        case 10:
          return 1
        default:
          return 0
      }
    }
  } else if (raceType === 'sprint') {
    switch (position) {
      case 1:
        return 8
      case 2:
        return 7
      case 3:
        return 6
      case 4:
        return 5
      case 5:
        return 4
      case 6:
        return 3
      case 7:
        return 2
      case 8:
        return 1
      default:
        return 0
    }
  } else {
    return 0
  }
}

export const currentYear = new Date().getFullYear()
