import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'

export const DriverCard = ({ team }) => {
  return (
    <Link href={`/legendary/${team.slug}`} className='group'>
      <div className={cn('grid grid-cols-2 gap-x-4 rounded-xl')}>
        {team.drivers.map((driver, idx) => (
          <div key={driver.id} className='relative'>
            <div className={cn('relative overflow-hidden rounded-t-xl')}>
              <Image
                alt={`${driver.firstName} ${driver.lastName}`}
                src={driver.pictureUrl ?? ''}
                width={320}
                height={320}
                className={cn('transform duration-300 group-hover:scale-105')}
              />
            </div>
            <div className='absolute inset-0 transform rounded-xl bg-black opacity-10 duration-300 group-hover:opacity-0' />
          </div>
        ))}
      </div>
      <h2 className='rounded-b-xl bg-card p-4 text-center font-mono text-lg'>
        {`${team.drivers[0]?.lastName} vs ${team.drivers[1]?.lastName}`}
      </h2>
    </Link>
  )
}
