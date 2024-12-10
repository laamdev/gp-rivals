import { getComparison } from '@/lib/utils'

import { StatCard } from '@/components/global/stat-card'

export const DriverStats = ({
  driverNumber,
  result
}: {
  driverNumber: 1 | 2
  result: any
}) => {
  const stats = [
    {
      title: 'Position',
      value:
        driverNumber === 1
          ? result.driverOnePosition
          : result.driverTwoPosition,
      type: 'position'
    },
    {
      title: 'Points',
      value:
        driverNumber === 1 ? result.driverOnePoints : result.driverTwoPoints,
      type: 'points'
    },
    {
      title: 'Wins',
      value: driverNumber === 1 ? result.driverOneWins : result.driverTwoWins,
      type: 'wins'
    },
    {
      title: 'Poles',
      value: driverNumber === 1 ? result.driverOnePoles : result.driverTwoPoles,
      type: 'poles'
    },
    {
      title: 'Podiums',
      value:
        driverNumber === 1 ? result.driverOnePodiums : result.driverTwoPodiums,
      type: 'podiums'
    },
    {
      title: 'Fastest Laps',
      value:
        driverNumber === 1
          ? result.driverOneFastestLaps
          : result.driverTwoFastestLaps,
      type: 'fastestLaps'
    },
    {
      title: 'Race Position Average',
      value:
        driverNumber === 1
          ? result.driverOneRaceAverage
          : result.driverTwoRaceAverage,
      type: 'race'
    },
    {
      title: 'Qualifying Position Average',
      value:
        driverNumber === 1
          ? result.driverOneQualifyingAverage
          : result.driverTwoQualifyingAverage,
      type: 'qualifying'
    },
    {
      title: 'Pole to Win Ratio',
      value:
        driverNumber === 1
          ? `${result.driverOnePoleToWinRatio.toFixed(1)}%`
          : `${result.driverTwoPoleToWinRatio.toFixed(1)}%`,
      type: 'poleToWinRatio'
    }
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          title={stat.title}
          value={stat.value}
          comparison={getComparison(stat.type, driverNumber, result)}
        />
      ))}
    </div>
  )
}
