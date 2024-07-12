'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'

export const CompareRadarChart = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <RadarChart cx='50%' cy='50%' outerRadius='80%' data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey='subject' className='text-xs' />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar
          name='VER'
          dataKey='A'
          stroke='#4cb5ff'
          fill='#4cb5ff'
          fillOpacity={0.3}
        />
        <Radar
          name='PER'
          dataKey='B'
          stroke='#ff232b'
          fill='#ff232b'
          fillOpacity={0.3}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}
