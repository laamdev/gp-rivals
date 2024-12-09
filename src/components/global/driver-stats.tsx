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
