import { cn, formatPosition, getComparison, isLightColor } from '@/lib/utils'

import { StatCard } from '@/components/global/stat-card'

interface GPStatsProps {
  grid?: string
  position?: string
  points?: string
  laps?: string
  status?: string
  fastestLapRank?: string
  fastestLapTime?: string
  fastestLapSpeed?: string
  fastestLapNumber?: string
  timeDelta?: string
  color: string
  driver: string
  teammateGrid?: string
  teammatePosition?: string
  teammatePoints?: string
  teammateLaps?: string
  teammateFastestLapRank?: string
  teammateFastestLapTime?: string
  teammateFastestLapSpeed?: string
  teammateFastestLapNumber?: string
  teammateTimeDelta?: string
  teammateStatus?: string
}

type ComparisonResult = boolean | 'tie'

export const GPStats = ({
  grid = '0',
  position = '0',
  points = '0',
  laps = '0',
  status = 'Unknown',
  fastestLapRank = '0',
  fastestLapTime = '0',
  fastestLapSpeed = '0',
  fastestLapNumber = '0',
  timeDelta = '0',
  color,
  driver,
  teammateGrid = '0',
  teammatePosition = '0',
  teammatePoints = '0',
  teammateLaps = '0',
  teammateFastestLapRank = '0',
  teammateFastestLapTime = '0',
  teammateFastestLapSpeed = '0',
  teammateFastestLapNumber = '0',
  teammateTimeDelta = '0',
  teammateStatus = 'Unknown'
}: GPStatsProps) => {
  const stats: Array<{
    title: string
    value: string | number
    type: string
    isBetter: ComparisonResult
  }> = [
    {
      title: 'Grid Position',
      value: Number(grid),
      type: 'grid',
      isBetter:
        Number(grid) === Number(teammateGrid)
          ? 'tie'
          : Number(grid) < Number(teammateGrid)
    },
    {
      title: 'Race Position',
      value: Number(position),
      type: 'position',
      isBetter:
        Number(position) === Number(teammatePosition)
          ? 'tie'
          : Number(position) < Number(teammatePosition)
    },
    {
      title: 'Points',
      value: points,
      type: 'points',
      isBetter:
        Number(points) === Number(teammatePoints)
          ? 'tie'
          : Number(points) > Number(teammatePoints)
    },
    {
      title: 'Fastest Lap Rank',
      value: fastestLapRank,
      type: 'position',
      isBetter:
        Number(fastestLapRank) === Number(teammateFastestLapRank)
          ? 'tie'
          : Number(fastestLapRank) < Number(teammateFastestLapRank)
    },
    {
      title: 'Fastest Lap',
      value: fastestLapTime,
      type: 'time',
      isBetter:
        fastestLapTime === teammateFastestLapTime
          ? 'tie'
          : Number(fastestLapRank) < Number(teammateFastestLapRank)
    },
    {
      title: 'Fastest Lap #',
      value: `Lap ${fastestLapNumber}`,
      type: 'lap',
      isBetter:
        Number(fastestLapNumber) === Number(teammateFastestLapNumber)
          ? 'tie'
          : Number(fastestLapNumber) < Number(teammateFastestLapNumber)
    },
    {
      title: 'Average Speed',
      value: `${fastestLapSpeed} kph`,
      type: 'speed',
      isBetter:
        Number(fastestLapSpeed) === Number(teammateFastestLapSpeed)
          ? 'tie'
          : Number(fastestLapSpeed) > Number(teammateFastestLapSpeed)
    },
    {
      title: 'Time Delta',
      value: timeDelta,
      type: 'time',
      isBetter:
        timeDelta === teammateTimeDelta ? 'tie' : timeDelta < teammateTimeDelta
    },
    {
      title: 'Laps',
      value: laps,
      type: 'laps',
      isBetter:
        Number(laps) === Number(teammateLaps)
          ? 'tie'
          : Number(laps) > Number(teammateLaps)
    },
    {
      title: 'Status',
      value: status,
      type: 'status',
      isBetter: status === teammateStatus ? 'tie' : false
    }
  ]

  return (
    <div>
      <div
        className={cn(
          'rounded-t-xl p-4 text-center font-serif text-base sm:p-6 sm:text-lg',
          isLightColor(color) ? 'text-zinc-900' : 'text-white'
        )}
        style={{ background: color }}
      >
        {driver}
      </div>
      <div className='grid sm:grid-cols-2'>
        {stats.map((stat, idx) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            comparison={stat.isBetter}
            isLast={idx === stats.length - 1}
            isSecondToLast={idx === stats.length - 2}
          />
        ))}
      </div>
    </div>
  )
}
