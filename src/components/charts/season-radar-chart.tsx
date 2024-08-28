'use client'

import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts'
import { TrendingUp } from 'lucide-react'

const maxValues = {
  'Points (vs best driver)': 400,
  'Points (vs max possible)': 350,
  'Average race result (all)': 250,
  'Average race result (classified only)': 200,
  'Average grid position': 220,
  'Laps completed': 300
}

const scaleData = (data, maxValues) => {
  return data.map(item => ({
    ...item,
    teammateA: (item.teammateA / maxValues[item.stat]) * 100,
    teammateB: (item.teammateB / maxValues[item.stat]) * 100
  }))
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const originalValueA = (payload[0].value / 100) * maxValues[label]
    const originalValueB = (payload[1].value / 100) * maxValues[label]
    return (
      <div className='custom-tooltip'>
        <p>{`${label}: ${payload[0].name} - ${originalValueA.toFixed(2)}, ${payload[1].name} - ${originalValueB.toFixed(2)}`}</p>
      </div>
    )
  }

  return null
}

export const SeasonRadarChart = ({
  teammateAPoints,
  teammateBPoints,
  teammateAName,
  teammateBName,
  year,
  color,
  secondaryColor
}) => {
  const chartData = [
    {
      stat: 'Points (vs best driver)',
      teammateA: teammateAPoints,
      teammateB: teammateBPoints
    },
    { stat: 'Points (vs max possible)', teammateA: 305, teammateB: 200 },
    { stat: 'Average race result (all)', teammateA: 237, teammateB: 120 },
    {
      stat: 'Average race result (classified only)',
      teammateA: 73,
      teammateB: 190
    },
    { stat: 'Average grid position', teammateA: 209, teammateB: 130 },
    { stat: 'Laps completed', teammateA: 214, teammateB: 140 }
  ]

  const scaledChartData = scaleData(chartData, maxValues)

  return (
    <div>
      <div className='card-header'>
        <h2>Overall Season Stats</h2>
        <p>Showing total visitors for the last 6 months</p>
      </div>
      <div className='card-content'>
        <RadarChart width={500} height={400} data={scaledChartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey='stat' />
          <Radar
            name={teammateAName}
            dataKey='teammateA'
            stroke={color}
            fill={color}
            fillOpacity={0.6}
          />
          <Radar
            name={teammateBName}
            dataKey='teammateB'
            stroke={secondaryColor}
            fill={secondaryColor}
            fillOpacity={0.6}
          />
          {/* @ts-expect-error */}
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </div>
      <div className='card-footer'>
        <div>
          Trending up by 5.2% this month <TrendingUp />
        </div>
        <div>January - June {year}</div>
      </div>
    </div>
  )
}
